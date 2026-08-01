import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const SITE_WARMUP_CONFIG = Object.freeze({
  domains: Object.freeze(['site.472158246.workers.dev', 'www.hagicode.com']),
  maxAttempts: 4,
  retryDelayMs: 3000,
  timeoutMs: 10000,
});

export class WarmupRunError extends Error {
  constructor(message, result) {
    super(message);
    this.name = 'WarmupRunError';
    this.result = result;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalizePositiveInteger(value, fieldName) {
  assert(Number.isInteger(value) && value > 0, `Invalid warmup config: ${fieldName} must be a positive integer`);
  return value;
}

function normalizeDomain(value) {
  assert(typeof value === 'string' && value.trim().length > 0, 'Invalid warmup config: domain must be a non-empty string');
  return value.trim().replace(/^https?:\/\//i, '').replace(/\/+$/u, '');
}

export function normalizeWarmupConfig(config = SITE_WARMUP_CONFIG) {
  assert(typeof config === 'object' && config !== null, 'Invalid warmup config: config must be an object');

  const domains = Array.from(config.domains ?? [], (domain) => normalizeDomain(domain));
  assert(domains.length > 0, 'Invalid warmup config: at least one domain is required');

  return {
    domains,
    maxAttempts: normalizePositiveInteger(config.maxAttempts, 'maxAttempts'),
    retryDelayMs: normalizePositiveInteger(config.retryDelayMs, 'retryDelayMs'),
    timeoutMs: normalizePositiveInteger(config.timeoutMs, 'timeoutMs'),
  };
}

function createLogger(logger) {
  return {
    log: typeof logger?.log === 'function' ? logger.log.bind(logger) : () => {},
    warn: typeof logger?.warn === 'function' ? logger.warn.bind(logger) : (typeof logger?.log === 'function' ? logger.log.bind(logger) : () => {}),
    error: typeof logger?.error === 'function' ? logger.error.bind(logger) : (typeof logger?.warn === 'function' ? logger.warn.bind(logger) : () => {}),
  };
}

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function safeReadText(response) {
  try {
    return (await response.text()).replace(/\s+/gu, ' ').trim().slice(0, 240);
  } catch {
    return '';
  }
}

function createFailureDetail(error, timeoutMs) {
  if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
    return `Request timed out after ${timeoutMs}ms`;
  }

  return error instanceof Error ? error.message : String(error);
}

function formatHttpDetail(status, body = '') {
  return `HTTP ${status}${body ? ` - ${body}` : ''}`;
}

function createDomainUrl(domain) {
  return `https://${domain}/`;
}

function describeWarmupResult(result) {
  if (result.ok) {
    return result.retriesUsed > 0 ? 'warmed after retry' : 'warmed';
  }

  return 'failed';
}

export async function warmDomain(domain, { config = SITE_WARMUP_CONFIG, fetchImpl = globalThis.fetch, wait = sleep, logger = console } = {}) {
  assert(typeof fetchImpl === 'function', 'Warmup requires a fetch implementation');
  assert(typeof wait === 'function', 'Warmup requires a wait implementation');

  const normalizedConfig = normalizeWarmupConfig({
    ...config,
    domains: [domain],
  });
  const normalizedDomain = normalizedConfig.domains[0];
  const url = createDomainUrl(normalizedDomain);
  const log = createLogger(logger);
  const attempts = [];

  for (let attempt = 1; attempt <= normalizedConfig.maxAttempts; attempt += 1) {
    log.log(`[warmup] ${normalizedDomain}: attempt ${attempt}/${normalizedConfig.maxAttempts}`);

    try {
      const response = await fetchImpl(url, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'user-agent': 'hagicode-deployment-warmup/1.0',
        },
        signal: AbortSignal.timeout(normalizedConfig.timeoutMs),
      });
      const body = response.status >= 400 ? await safeReadText(response) : '';
      const detail = formatHttpDetail(response.status, body);
      const ok = response.status >= 200 && response.status < 400;

      attempts.push({
        attempt,
        ok,
        status: response.status,
        detail,
      });

      if (ok) {
        log.log(`[warmup] ${normalizedDomain}: success (${detail})`);
        return {
          domain: normalizedDomain,
          url,
          maxAttempts: normalizedConfig.maxAttempts,
          attempts,
          retriesUsed: attempt - 1,
          ok: true,
          finalDetail: detail,
        };
      }

      log.warn(`[warmup] ${normalizedDomain}: ${detail}`);
    } catch (error) {
      const detail = createFailureDetail(error, normalizedConfig.timeoutMs);

      attempts.push({
        attempt,
        ok: false,
        detail,
        error: detail,
      });

      log.warn(`[warmup] ${normalizedDomain}: ${detail}`);
    }

    if (attempt < normalizedConfig.maxAttempts) {
      log.log(`[warmup] ${normalizedDomain}: retrying in ${normalizedConfig.retryDelayMs}ms`);
      await wait(normalizedConfig.retryDelayMs);
    }
  }

  const finalAttempt = attempts.at(-1);
  return {
    domain: normalizedDomain,
    url,
    maxAttempts: normalizedConfig.maxAttempts,
    attempts,
    retriesUsed: normalizedConfig.maxAttempts - 1,
    ok: false,
    finalDetail: `${finalAttempt?.detail ?? 'Unknown failure'}; retries exhausted after ${attempts.length}/${normalizedConfig.maxAttempts} attempts`,
  };
}

export async function runWarmup({ config = SITE_WARMUP_CONFIG, fetchImpl = globalThis.fetch, wait = sleep, logger = console } = {}) {
  const normalizedConfig = normalizeWarmupConfig(config);
  const domainResults = [];

  for (const domain of normalizedConfig.domains) {
    domainResults.push(await warmDomain(domain, { config: normalizedConfig, fetchImpl, wait, logger }));
  }

  const result = {
    config: normalizedConfig,
    domainResults,
    successCount: domainResults.filter((domainResult) => domainResult.ok).length,
    failureCount: domainResults.filter((domainResult) => !domainResult.ok).length,
  };

  if (result.failureCount > 0) {
    const failedDomains = result.domainResults
      .filter((domainResult) => !domainResult.ok)
      .map((domainResult) => `${domainResult.domain} (${domainResult.finalDetail})`)
      .join('; ');
    throw new WarmupRunError(`Deployment warmup failed: ${failedDomains}`, result);
  }

  return result;
}

function escapeTableValue(value) {
  return String(value).replace(/\|/gu, '\\|').replace(/\s+/gu, ' ').trim();
}

export function renderWarmupSummary(result) {
  const lines = [
    '## Deployment domain warmup',
    '- Warmup ran after gh-pages publication.',
    `- Successful domains: ${result.successCount}/${result.domainResults.length}`,
    '',
    '| Domain | Result | Attempts | Final detail |',
    '| --- | --- | --- | --- |',
  ];

  for (const domainResult of result.domainResults) {
    lines.push(
      `| \`${domainResult.domain}\` | ${describeWarmupResult(domainResult)} | ${domainResult.attempts.length}/${domainResult.maxAttempts} | ${escapeTableValue(domainResult.finalDetail)} |`,
    );
  }

  if (result.failureCount > 0) {
    lines.push('', '- Warmup failure does not roll back the published `gh-pages` snapshot.');
  }

  return `${lines.join('\n')}\n`;
}

export async function writeWarmupSummary(summaryMarkdownPath, result) {
  if (!summaryMarkdownPath) {
    return null;
  }

  await mkdir(path.dirname(summaryMarkdownPath), { recursive: true });
  await writeFile(summaryMarkdownPath, renderWarmupSummary(result), 'utf8');
  return summaryMarkdownPath;
}

export function parseArgs(argv) {
  const args = Array.isArray(argv) ? [...argv] : [];
  let summaryMarkdownPath = null;

  while (args.length > 0) {
    const current = args.shift();

    if (current === '--summary-markdown') {
      const value = args.shift();
      assert(typeof value === 'string' && value.trim().length > 0, 'Missing value for --summary-markdown');
      summaryMarkdownPath = value;
      continue;
    }

    throw new Error(`Unknown argument: ${current}`);
  }

  return {
    summaryMarkdownPath,
  };
}

export async function main(argv = process.argv.slice(2), runtime = {}) {
  const { summaryMarkdownPath } = parseArgs(argv);

  try {
    const result = await runWarmup(runtime);
    await writeWarmupSummary(summaryMarkdownPath, result);
    return result;
  } catch (error) {
    if (error instanceof WarmupRunError) {
      await writeWarmupSummary(summaryMarkdownPath, error.result);
    }

    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
