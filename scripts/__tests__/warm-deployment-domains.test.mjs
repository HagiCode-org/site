import { describe, expect, it, vi } from 'vitest';

import {
  SITE_WARMUP_CONFIG,
  WarmupRunError,
  renderWarmupSummary,
  runWarmup,
} from '../warm-deployment-domains.mjs';

function createLogger() {
  return {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

function createFetch(routes, calls = []) {
  return vi.fn(async (url, options = {}) => {
    const normalizedUrl = String(url);
    calls.push({ url: normalizedUrl, options });
    const handler = routes[normalizedUrl];

    if (!handler) {
      throw new Error(`Unexpected warmup URL: ${normalizedUrl}`);
    }

    return typeof handler === 'function' ? handler(url, options) : handler;
  });
}

describe('site deployment warmup helper', () => {
  it('retries transient warmup failures and summarizes success', async () => {
    const calls = [];
    const wait = vi.fn().mockResolvedValue(undefined);
    const logger = createLogger();
    const fetchImpl = createFetch(
      {
        'https://hagicode.com/': vi
          .fn()
          .mockResolvedValueOnce(new Response('warming', { status: 503 }))
          .mockResolvedValueOnce(new Response('ready', { status: 200 })),
      },
      calls,
    );

    const result = await runWarmup({
      fetchImpl,
      wait,
      logger,
    });

    expect(result.successCount).toBe(1);
    expect(result.failureCount).toBe(0);
    expect(result.domainResults[0]).toMatchObject({
      domain: 'hagicode.com',
      ok: true,
      retriesUsed: 1,
      finalDetail: 'HTTP 200',
    });
    expect(wait).toHaveBeenCalledTimes(1);
    expect(wait).toHaveBeenCalledWith(SITE_WARMUP_CONFIG.retryDelayMs);
    expect(calls.map((call) => call.url)).toEqual([
      'https://hagicode.com/',
      'https://hagicode.com/',
    ]);

    const summary = renderWarmupSummary(result);
    expect(summary).toContain('`hagicode.com`');
    expect(summary).toContain('warmed after retry');
  });

  it('reports exhausted retries with actionable failure details', async () => {
    const wait = vi.fn().mockResolvedValue(undefined);
    const logger = createLogger();
    const fetchImpl = createFetch({
      'https://hagicode.com/': vi.fn().mockImplementation(async () => new Response('bad gateway', { status: 502 })),
    });

    let error;

    try {
      await runWarmup({
        fetchImpl,
        wait,
        logger,
      });
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toBeInstanceOf(WarmupRunError);
    expect(error.result.failureCount).toBe(1);
    expect(error.result.successCount).toBe(0);
    expect(error.result.domainResults[0].finalDetail).toContain('HTTP 502 - bad gateway');
    expect(error.result.domainResults[0].finalDetail).toContain('retries exhausted');
    expect(wait).toHaveBeenCalledTimes(SITE_WARMUP_CONFIG.maxAttempts - 1);

    const summary = renderWarmupSummary(error.result);
    expect(summary).toContain('failed');
    expect(summary).toContain('Warmup failure does not roll back the published `gh-pages` snapshot.');
  });
});
