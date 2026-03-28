import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PRIMARY_INDEX_JSON_URL } from './desktop-utils';
import {
  clearDesktopVersionCache as clearSiteDesktopVersionCache,
  getDesktopVersionData as getSiteDesktopVersionData,
} from './version-manager';
import {
  BACKUP_INDEX_JSON_URL as DOCS_BACKUP_INDEX_JSON_URL,
  LOCAL_VERSION_INDEX as DOCS_LOCAL_VERSION_INDEX,
  PRIMARY_INDEX_JSON_URL as DOCS_PRIMARY_INDEX_JSON_URL,
} from '../../../../docs/shared/src/desktop-utils';
import {
  clearDesktopVersionCache as clearDocsDesktopVersionCache,
  getDesktopVersionData as getDocsDesktopVersionData,
} from '../../../../docs/shared/src/version-manager';

const siteDesktopIndexFixture = {
  updatedAt: '2026-03-24T00:00:00Z',
  versions: [
    {
      version: 'v1.2.3',
      assets: [
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
      files: [
        'v1.2.3/Hagicode.Desktop.Setup.1.2.3.exe',
        'v1.2.3/Hagicode.Desktop-1.2.3-arm64.dmg',
        'v1.2.3/Hagicode.Desktop-1.2.3.AppImage',
      ],
    },
  ],
  channels: {
    stable: { latest: 'v1.2.3', versions: ['v1.2.3'] },
    beta: { latest: 'v1.2.3', versions: ['v1.2.3'] },
  },
};

const docsDesktopIndexFixture = {
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
    runtimeSourceCount: 1,
    fixture: siteDesktopIndexFixture,
    primaryUrl: PRIMARY_INDEX_JSON_URL,
    backupUrl: null,
    localUrl: null,
    localStatus: null,
  },
  {
    label: 'docs',
    getDesktopVersionData: getDocsDesktopVersionData,
    clearDesktopVersionCache: clearDocsDesktopVersionCache,
    runtimeSourceCount: 3,
    fixture: docsDesktopIndexFixture,
    primaryUrl: DOCS_PRIMARY_INDEX_JSON_URL,
    backupUrl: DOCS_BACKUP_INDEX_JSON_URL,
    localUrl: DOCS_LOCAL_VERSION_INDEX,
    localStatus: 'local_snapshot',
  },
] as const;

function createJsonResponse(
  body: unknown,
  options?: { ok?: boolean; status?: number; statusText?: string },
) {
  return {
    ok: options?.ok ?? true,
    status: options?.status ?? 200,
    statusText: options?.statusText ?? 'OK',
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

  it('uses the primary source and reuses the cached result', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createJsonResponse(structuredClone(target.fixture)));

    vi.stubGlobal('fetch', fetchMock);

    const first = await target.getDesktopVersionData();
    const second = await target.getDesktopVersionData();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      target.primaryUrl,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(first).toBe(second);
    expect(first.source).toBe('primary');
    expect(first.status).toBe('ready');
    expect(first.attempts).toEqual([]);
    expect(first.latest?.version).toBe('v1.2.3');
    expect(first.platforms).toHaveLength(3);
    expect(first.channels.stable.latest?.version).toBe('v1.2.3');
  });

  it('falls back to the backup source when the primary payload is invalid', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url === target.primaryUrl) {
        return createJsonResponse({ updatedAt: '2026-03-24T00:00:00Z' });
      }

      if (target.backupUrl && url === target.backupUrl) {
        return createJsonResponse(structuredClone(target.fixture));
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    const data = await target.getDesktopVersionData();

    if (target.runtimeSourceCount === 1) {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(data.source).toBeNull();
      expect(data.status).toBe('fatal');
      expect(data.latest).toBeNull();
      expect(data.platforms).toEqual([]);
      expect(data.error).toContain('Failed to load desktop versions');
      expect(data.attempts).toEqual([
        expect.objectContaining({ source: 'primary' }),
      ]);
      return;
    }

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(data.source).toBe('backup');
    expect(data.status).toBe('degraded');
    expect(data.attempts).toEqual([
      expect.objectContaining({ source: 'primary' }),
    ]);
    expect(data.error).toBeNull();
  });

  it('handles remote source failures with the expected fallback chain', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url === target.primaryUrl) {
        throw new Error('primary down');
      }

      if (target.backupUrl && url === target.backupUrl) {
        return createJsonResponse({}, { ok: false, status: 503, statusText: 'Service Unavailable' });
      }

      if (target.localUrl && url === target.localUrl) {
        return createJsonResponse(structuredClone(target.fixture));
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    const data = await target.getDesktopVersionData();

    if (target.runtimeSourceCount === 3) {
      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(data.source).toBe('local');
      expect(data.status).toBe(target.localStatus);
      expect(data.attempts).toEqual([
        expect.objectContaining({ source: 'primary', error: 'primary down' }),
        expect.objectContaining({ source: 'backup' }),
      ]);
      expect(data.latest?.version).toBe('v1.2.3');
      return;
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(data.source).toBeNull();
    expect(data.status).toBe('fatal');
    expect(data.latest).toBeNull();
    expect(data.platforms).toEqual([]);
    expect(data.error).toContain('Failed to load desktop versions');
    expect(data.attempts).toEqual([
      expect.objectContaining({ source: 'primary', error: 'primary down' }),
    ]);
  });

  it('returns a fatal state when every source fails', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      throw new Error(`failed:${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    const data = await target.getDesktopVersionData();

    expect(fetchMock).toHaveBeenCalledTimes(target.runtimeSourceCount);
    expect(data.status).toBe('fatal');
    expect(data.source).toBeNull();
    expect(data.latest).toBeNull();
    expect(data.platforms).toEqual([]);
    expect(data.error).toContain('Failed to load desktop versions');
    expect(data.attempts).toHaveLength(target.runtimeSourceCount);
  });

  it('deduplicates concurrent in-flight requests', async () => {
    let resolveResponse: (value: ReturnType<typeof createJsonResponse>) => void = () => {};
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Promise<ReturnType<typeof createJsonResponse>>((resolve) => {
          resolveResponse = resolve;
        }),
    );

    vi.stubGlobal('fetch', fetchMock);

    const pending = Promise.all([
      target.getDesktopVersionData(),
      target.getDesktopVersionData(),
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveResponse(createJsonResponse(structuredClone(target.fixture)));

    const [first, second] = await pending;
    expect(first).toBe(second);
    expect(first.source).toBe('primary');
  });
});

describe('site runtime index fetching fatal caching', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {});
  });

  afterEach(() => {
    clearSiteDesktopVersionCache();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('reuses the cached fatal state until the cache is cleared', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      throw new Error(`failed:${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    const first = await getSiteDesktopVersionData();
    const second = await getSiteDesktopVersionData();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(first).toBe(second);
    expect(second.status).toBe('fatal');
    expect(second.attempts).toHaveLength(1);
  });
});
