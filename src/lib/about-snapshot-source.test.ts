import { describe, expect, it, vi } from 'vitest';
import {
  ABOUT_SNAPSHOT_URL,
  ABOUT_SNAPSHOT_ORIGIN,
  fetchCanonicalAboutSnapshot,
  getBundledAboutSnapshot,
  getAboutSnapshotMaterialChangeSummary,
  hasAboutSnapshotMaterialChange,
  normalizeAboutSnapshotData,
  partitionAboutEntries,
} from './about-snapshot-source';

const fixture = {
  version: '1.0.0',
  updatedAt: '2026-04-20T00:00:00.000Z',
  entries: [
    {
      id: 'youtube',
      type: 'link',
      label: 'YouTube',
      regionPriority: 'international-first',
      url: 'https://www.youtube.com/@hagicode',
    },
    {
      id: 'product-hunt',
      type: 'link',
      label: 'Product Hunt',
      regionPriority: 'international-first',
      url: 'https://www.producthunt.com/products/hagicode',
    },
    {
      id: 'steam',
      type: 'link',
      label: 'Steam',
      regionPriority: 'international-first',
      url: 'https://store.steampowered.com/app/4625540/Hagicode/',
    },
    {
      id: 'bilibili',
      type: 'link',
      label: 'Bilibili',
      regionPriority: 'china-first',
      url: 'https://space.bilibili.com/272265720',
    },
    {
      id: 'xiaohongshu',
      type: 'contact',
      label: '小红书',
      regionPriority: 'china-first',
      value: '11671904293',
      url: 'https://www.xiaohongshu.com/user/profile/demo',
    },
    {
      id: 'douyin-account',
      type: 'contact',
      label: '抖音',
      regionPriority: 'china-first',
      value: 'hagicode',
    },
    {
      id: 'douyin-qr',
      type: 'qr',
      label: '抖音二维码',
      regionPriority: 'china-first',
      imageUrl: '/_astro/douyin.hash.png',
      width: 1061,
      height: 1059,
      alt: 'HagiCode 抖音二维码',
    },
    {
      id: 'qq-group',
      type: 'contact',
      label: 'QQ群',
      regionPriority: 'china-first',
      value: '610394020',
      url: 'https://qm.qq.com/q/demo',
    },
    {
      id: 'feishu-group',
      type: 'qr',
      label: '飞书群',
      regionPriority: 'china-first',
      imageUrl: '/_astro/feishu.hash.png',
      width: 778,
      height: 724,
      alt: 'HagiCode 飞书群二维码',
      url: 'https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=demo',
    },
    {
      id: 'discord',
      type: 'link',
      label: 'Discord',
      regionPriority: 'international-first',
      url: 'https://discord.gg/demo',
    },
    {
      id: 'wechat-account',
      type: 'qr',
      label: '微信公众号',
      regionPriority: 'china-first',
      imageUrl: '/_astro/wechat.hash.jpg',
      width: 430,
      height: 430,
      alt: 'HagiCode 微信公众号二维码',
    },
  ],
};

describe('about snapshot source', () => {
  it('normalizes bundled media entries into absolute asset URLs', () => {
    const data = normalizeAboutSnapshotData(structuredClone(fixture));
    const mediaEntry = data.entries.find((entry) => entry.id === 'douyin-qr');
    const steamEntry = data.entries.find((entry) => entry.id === 'steam');

    expect(mediaEntry?.type).toBe('qr');
    expect(steamEntry).toMatchObject({
      type: 'link',
      url: 'https://store.steampowered.com/app/4625540/Hagicode/',
      regionPriority: 'international-first',
    });
    expect(
      mediaEntry && 'resolvedImageUrl' in mediaEntry
        ? mediaEntry.resolvedImageUrl
        : null,
    ).toBe(`${ABOUT_SNAPSHOT_ORIGIN}/_astro/douyin.hash.png`);
    expect(data.entries.find((entry) => entry.id === 'youtube')?.regionPriority).toBe('international-first');
  });

  it('rejects payloads missing the required public entries', () => {
    expect(() =>
      normalizeAboutSnapshotData({
        ...structuredClone(fixture),
        entries: fixture.entries.filter((entry) => entry.id !== 'youtube'),
      }),
    ).toThrow('missing required entries youtube');
  });

  it('rejects payloads missing a region priority marker', () => {
    expect(() =>
      normalizeAboutSnapshotData({
        ...structuredClone(fixture),
        entries: fixture.entries.map((entry) =>
          entry.id === 'discord'
            ? { ...entry, regionPriority: undefined }
            : entry,
        ),
      }),
    ).toThrow('discord.regionPriority');
  });

  it('keeps a bundled snapshot ready for page rendering and grouping', () => {
    const snapshot = getBundledAboutSnapshot();
    const grouped = partitionAboutEntries(snapshot.entries);

    expect(snapshot.version).toBe('1.0.0');
    expect(grouped.links.length).toBeGreaterThan(0);
    expect(grouped.contacts.length).toBeGreaterThan(0);
    expect(grouped.media.length).toBe(3);
    expect(grouped.links.some((entry) => entry.id === 'youtube')).toBe(true);
    expect(grouped.links.some((entry) => entry.id === 'steam')).toBe(true);
    expect(grouped.media[0]?.resolvedImageUrl.startsWith(`${ABOUT_SNAPSHOT_ORIGIN}/_astro/`)).toBe(true);
  });

  it('loads the canonical payload with runtime-safe fetch options', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(structuredClone(fixture)),
    });

    const snapshot = await fetchCanonicalAboutSnapshot(fetcher as typeof fetch);

    expect(fetcher).toHaveBeenCalledWith(
      ABOUT_SNAPSHOT_URL,
      expect.objectContaining({
        cache: 'no-store',
        headers: expect.objectContaining({
          accept: 'application/json',
        }),
      }),
    );
    expect(snapshot.updatedAt).toBe(fixture.updatedAt);
    expect(snapshot.entries.find((entry) => entry.id === 'wechat-account')).toMatchObject({
      type: 'qr',
      resolvedImageUrl: `${ABOUT_SNAPSHOT_ORIGIN}/_astro/wechat.hash.jpg`,
    });
  });

  it('detects freshness and image URL changes between bundled and fetched payloads', () => {
    const current = normalizeAboutSnapshotData(structuredClone(fixture));
    const candidate = normalizeAboutSnapshotData({
      ...structuredClone(fixture),
      updatedAt: '2026-04-03T00:00:00.000Z',
      entries: fixture.entries.map((entry) =>
        entry.id === 'wechat-account'
          ? { ...entry, imageUrl: '/_astro/wechat.next.jpg' }
          : entry,
      ),
    });

    const summary = getAboutSnapshotMaterialChangeSummary(current, candidate);

    expect(summary.freshnessChanged).toBe(true);
    expect(summary.entriesChanged).toBe(true);
    expect(summary.imageUrlsChanged).toBe(true);
    expect(summary.changedEntryIds).toContain('wechat-account');
    expect(hasAboutSnapshotMaterialChange(current, candidate)).toBe(true);
  });

  it('treats identical canonical payloads as a no-op', () => {
    const current = normalizeAboutSnapshotData(structuredClone(fixture));
    const candidate = normalizeAboutSnapshotData(structuredClone(fixture));

    expect(getAboutSnapshotMaterialChangeSummary(current, candidate)).toEqual({
      freshnessChanged: false,
      entriesChanged: false,
      imageUrlsChanged: false,
      changedEntryIds: [],
    });
    expect(hasAboutSnapshotMaterialChange(current, candidate)).toBe(false);
  });
});
