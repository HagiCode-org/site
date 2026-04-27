import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearSteamImageRecordCache,
  getSteamProductImageRecord,
  loadSteamImageRecords,
  normalizeSteamPayload,
  resolveSteamProductImageRecord,
  SteamImagePayloadError,
} from '../src/data/steamImageDescriptors';

const runtimePayload = {
  applications: [
    {
      key: 'hagicode',
      displayName: 'HagiCode',
      kind: 'application',
      parentKey: null,
      storeUrl: 'https://store.steampowered.com/app/4625540/Hagicode/',
      images: [
        {
          src: '/runtime/hagicode-wide.png',
          variant: 'wide-capsule',
          alt: 'Runtime HagiCode wide capsule',
          width: 1232,
          height: 706,
        },
      ],
    },
    {
      key: 'turbo-engine',
      displayName: 'Turbo Engine',
      kind: 'dlc',
      parentKey: 'hagicode',
      storeUrl: 'https://store.steampowered.com/app/4635480/Hagicode__Turbo_Engine/',
      images: [],
    },
  ],
  bundles: [
    {
      key: 'hagicode-plus',
      displayName: 'Hagicode Plus',
      storeUrl: 'https://store.steampowered.com/bundle/73989/Hagicode_Plus/',
      includedApplicationKeys: ['hagicode', 'turbo-engine'],
      images: [],
    },
  ],
  images: {
    'turbo-engine': [
      {
        src: '/runtime/turbo-wide.png',
        variant: 'wide-capsule',
        alt: 'Runtime Turbo wide capsule',
        width: 1232,
        height: 706,
      },
      {
        src: 'https://cdn.example.invalid/turbo-store.png',
        variant: 'store-capsule',
        alt: 'Runtime Turbo store capsule',
      },
    ],
    'hagicode-plus': [
      {
        src: '/runtime/plus-wide.png',
        variant: 'wide-capsule',
        alt: 'Runtime Plus wide capsule',
        width: 1232,
        height: 706,
      },
    ],
  },
};

function mockFetchResponse(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  });
}

describe('site runtime Steam image descriptors', () => {
  beforeEach(() => {
    clearSteamImageRecordCache();
    vi.restoreAllMocks();
  });

  it('normalizes applications, DLC, bundles, and payload-level image descriptors', () => {
    const normalized = normalizeSteamPayload(runtimePayload, 'https://index.hagicode.com/steam/index.json');
    const hagicode = resolveSteamProductImageRecord(normalized, 'hagicode');
    const turbo = resolveSteamProductImageRecord(normalized, 'turbo-engine');
    const plus = resolveSteamProductImageRecord(normalized, 'hagicode-plus');

    expect(hagicode?.type).toBe('application');
    expect(hagicode?.images[0]?.src).toBe('https://index.hagicode.com/runtime/hagicode-wide.png');
    expect(turbo?.type).toBe('dlc');
    expect(turbo?.parentKey).toBe('hagicode');
    expect(turbo?.images[0]?.src).toBe('https://index.hagicode.com/runtime/turbo-wide.png');
    expect(plus?.type).toBe('bundle');
    expect(plus?.includedApplicationKeys).toEqual(['hagicode', 'turbo-engine']);
    expect(plus?.images[0]?.src).toBe('https://index.hagicode.com/runtime/plus-wide.png');
  });

  it('uses turbo-engine image URLs from the runtime payload instead of static build-time URLs', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(runtimePayload));

    const record = await getSteamProductImageRecord('turbo-engine');

    expect(record?.images[0]?.src).toBe('https://index.hagicode.com/runtime/turbo-wide.png');
    expect(record?.images[0]?.src).not.toContain('/_astro/');
  });

  it('uses hagicode-plus bundle image URLs from the runtime payload instead of static build-time URLs', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(runtimePayload));

    const record = await getSteamProductImageRecord('hagicode-plus');

    expect(record?.images[0]?.src).toBe('https://index.hagicode.com/runtime/plus-wide.png');
    expect(record?.images[0]?.src).not.toContain('/_astro/');
  });

  it('deduplicates concurrent homepage requests through one runtime payload fetch', async () => {
    const fetchMock = mockFetchResponse(runtimePayload);
    vi.stubGlobal('fetch', fetchMock);

    const [turbo, plus] = await Promise.all([
      getSteamProductImageRecord('turbo-engine'),
      getSteamProductImageRecord('hagicode-plus'),
    ]);
    await loadSteamImageRecords();

    expect(turbo?.displayName).toBe('Turbo Engine');
    expect(plus?.displayName).toBe('Hagicode Plus');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not poison cache after failed or malformed payloads and allows later fallback data to resolve', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ applications: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(runtimePayload),
      });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getSteamProductImageRecord('turbo-engine')).rejects.toThrow('network down');
    await expect(getSteamProductImageRecord('turbo-engine')).rejects.toThrow(SteamImagePayloadError);
    const retryRecord = await getSteamProductImageRecord('turbo-engine');

    expect(retryRecord?.key).toBe('turbo-engine');
    expect(retryRecord?.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: 'https://index.hagicode.com/runtime/turbo-wide.png' }),
      ]),
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
