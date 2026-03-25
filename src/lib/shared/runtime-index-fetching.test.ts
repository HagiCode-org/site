import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearDesktopVersionCache as clearSiteDesktopVersionCache,
  getDesktopVersionData as getSiteDesktopVersionData,
} from './version-manager';
import {
  clearDesktopVersionCache as clearDocsDesktopVersionCache,
  getDesktopVersionData as getDocsDesktopVersionData,
} from '../../../../docs/shared/src/version-manager';

const desktopIndexFixture = {
  updatedAt: '2026-03-24T00:00:00Z',
  versions: [
    {
      version: 'v1.2.3',
      files: [
        {
          name: 'Hagicode.Desktop.Setup.1.2.3.exe',
          path: 'v1.2.3/Hagicode.Desktop.Setup.1.2.3.exe',
          size: 1048576,
          lastModified: null,
        },
        {
          name: 'Hagicode.Desktop-1.2.3-arm64.dmg',
          path: 'v1.2.3/Hagicode.Desktop-1.2.3-arm64.dmg',
          size: 1048576,
          lastModified: null,
        },
        {
          name: 'Hagicode.Desktop-1.2.3.AppImage',
          path: 'v1.2.3/Hagicode.Desktop-1.2.3.AppImage',
          size: 1048576,
          lastModified: null,
        },
      ],
    },
  ],
  channels: {
    stable: { latest: 'v1.2.3', versions: ['v1.2.3'] },
    beta: { latest: 'v1.2.3', versions: ['v1.2.3'] },
  },
};

const targets = [
  {
    label: 'site',
    getDesktopVersionData: getSiteDesktopVersionData,
    clearDesktopVersionCache: clearSiteDesktopVersionCache,
  },
  {
    label: 'docs',
    getDesktopVersionData: getDocsDesktopVersionData,
    clearDesktopVersionCache: clearDocsDesktopVersionCache,
  },
] as const;

function createJsonResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: vi.fn().mockResolvedValue(body),
  };
}

describe.each(targets)('$label runtime index fetching', (target) => {
  beforeEach(() => {
    vi.stubGlobal('window', {});
  });

  afterEach(() => {
    target.clearDesktopVersionCache();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns the latest version data and reuses the cached result', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createJsonResponse(structuredClone(desktopIndexFixture)));

    vi.stubGlobal('fetch', fetchMock);

    const first = await target.getDesktopVersionData();
    const second = await target.getDesktopVersionData();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(first).toBe(second);
    expect(first.latest?.version).toBe('v1.2.3');
    expect(first.platforms).toHaveLength(3);
    expect(first.channels.stable.latest?.version).toBe('v1.2.3');
  });

  it('deduplicates concurrent in-flight requests', async () => {
    let resolveResponse: ((value: ReturnType<typeof createJsonResponse>) => void) | null = null;
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveResponse = resolve;
        }),
    );

    vi.stubGlobal('fetch', fetchMock);

    const pending = Promise.all([
      target.getDesktopVersionData(),
      target.getDesktopVersionData(),
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveResponse?.(createJsonResponse(structuredClone(desktopIndexFixture)));

    const [first, second] = await pending;

    expect(first).toBe(second);
    expect(first.latest?.version).toBe('v1.2.3');
  });

  it('rejects invalid JSON payloads', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse({
        updatedAt: '2026-03-24T00:00:00Z',
        channels: desktopIndexFixture.channels,
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(target.getDesktopVersionData()).rejects.toThrow(
      'Invalid desktop index payload: missing versions array',
    );
  });

  it('surfaces request failures', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));

    vi.stubGlobal('fetch', fetchMock);

    await expect(target.getDesktopVersionData()).rejects.toThrow('network down');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
