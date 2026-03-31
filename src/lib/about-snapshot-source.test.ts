import { describe, expect, it } from 'vitest';
import {
  ABOUT_SNAPSHOT_ORIGIN,
  getBundledAboutSnapshot,
  normalizeAboutSnapshotData,
  partitionAboutEntries,
} from './about-snapshot-source';

const fixture = {
  version: '1.0.0',
  updatedAt: '2026-03-31T00:00:00.000Z',
  entries: [
    {
      id: 'bilibili',
      type: 'link',
      label: 'Bilibili',
      url: 'https://space.bilibili.com/272265720',
    },
    {
      id: 'xiaohongshu',
      type: 'contact',
      label: '小红书',
      value: '11671904293',
      url: 'https://www.xiaohongshu.com/user/profile/demo',
    },
    {
      id: 'douyin-account',
      type: 'contact',
      label: '抖音',
      value: 'hagicode',
    },
    {
      id: 'douyin-qr',
      type: 'qr',
      label: '抖音二维码',
      imageUrl: '/_astro/douyin.hash.png',
      width: 1061,
      height: 1059,
      alt: 'HagiCode 抖音二维码',
    },
    {
      id: 'qq-group',
      type: 'contact',
      label: 'QQ群',
      value: '610394020',
      url: 'https://qm.qq.com/q/demo',
    },
    {
      id: 'feishu-group',
      type: 'qr',
      label: '飞书群',
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
      url: 'https://discord.gg/demo',
    },
    {
      id: 'wechat-account',
      type: 'qr',
      label: '微信公众号',
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

    expect(mediaEntry?.type).toBe('qr');
    expect(
      mediaEntry && 'resolvedImageUrl' in mediaEntry
        ? mediaEntry.resolvedImageUrl
        : null,
    ).toBe(`${ABOUT_SNAPSHOT_ORIGIN}/_astro/douyin.hash.png`);
  });

  it('rejects payloads missing the required public entries', () => {
    expect(() =>
      normalizeAboutSnapshotData({
        version: '1.0.0',
        updatedAt: '2026-03-31T00:00:00.000Z',
        entries: [],
      }),
    ).toThrow('missing required entries');
  });

  it('keeps a bundled snapshot ready for page rendering and grouping', () => {
    const snapshot = getBundledAboutSnapshot();
    const grouped = partitionAboutEntries(snapshot.entries);

    expect(snapshot.version).toBe('1.0.0');
    expect(grouped.links.length).toBeGreaterThan(0);
    expect(grouped.contacts.length).toBeGreaterThan(0);
    expect(grouped.media.length).toBe(3);
    expect(grouped.media[0]?.resolvedImageUrl.startsWith(`${ABOUT_SNAPSHOT_ORIGIN}/_astro/`)).toBe(true);
  });
});
