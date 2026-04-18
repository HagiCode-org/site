import { describe, expect, it } from 'vitest';
import { buildAboutPageModel, hasAboutPageModelMaterialChange } from './about-page-model';
import { normalizeAboutSnapshotData } from './about-snapshot-source';

describe('about page model', () => {
  it('builds the English about route with international entries first while keeping all entries visible', () => {
    const model = buildAboutPageModel('en');
    const storeEntries = model.sections[0]?.entries.map((entry) => entry.id);
    const communityEntries = model.sections[1]?.entries.map((entry) => entry.id);
    const contentEntries = model.sections[2]?.entries.map((entry) => entry.id);
    const youtubeEntry = model.sections[2]?.entries.find((entry) => entry.id === 'youtube');
    const steamEntry = model.sections[0]?.entries.find((entry) => entry.id === 'steam');
    const discordEntry = model.sections[1]?.entries.find((entry) => entry.id === 'discord');

    expect(model.routePath).toBe('/about/');
    expect(model.alternatePath).toBe('/zh-CN/about/');
    expect(model.seo.canonicalUrl).toBe('https://hagicode.com/about/');
    expect(model.header.title).toBe('Grow through exchange');
    expect(model.sections.map((section) => section.id)).toEqual(['store', 'community', 'content']);
    expect(model.sections[0]?.title).toBe('Store');
    expect(model.sections[1]?.title).toBe('Grow through exchange');
    expect(storeEntries).toEqual(['steam']);
    expect(communityEntries).toEqual(['discord', 'feishu-group', 'qq-group']);
    expect(contentEntries?.slice(0, 5)).toEqual([
      'youtube',
      'devto',
      'x',
      'linkedin',
      'facebook',
    ]);
    expect(contentEntries).toContain('bilibili');
    expect(contentEntries).not.toContain('steam');
    expect(contentEntries).toContain('douyin-account');
    expect(contentEntries).toContain('douyin-qr');
    expect(steamEntry).toMatchObject({
      kind: 'link',
      kindLabel: 'Store',
      label: 'Steam',
      detail: 'Official store page',
      linkText: 'Open store',
      href: 'https://store.steampowered.com/app/4625540/Hagicode/',
      presentation: {
        theme: 'steam',
        icon: 'steam',
        badgeLabel: 'Official store',
      },
    });
    expect(discordEntry).toMatchObject({
      kind: 'link',
      detail: 'Official community server',
      linkText: 'Open invite',
    });
    expect(youtubeEntry).toMatchObject({
      kind: 'link',
      label: 'YouTube',
      detail: 'Official video channel',
      linkText: 'Open channel',
      href: 'https://www.youtube.com/@hagicode',
      presentation: {
        theme: 'youtube',
        icon: 'youtube',
        badgeLabel: 'Official channel',
      },
    });
    expect(contentEntries).not.toContain('douyin');
    expect(
      contentEntries?.findIndex((entry) => entry === 'facebook'),
    ).toBeLessThan(
      contentEntries?.findIndex((entry) => entry === 'bilibili') ?? Number.MAX_SAFE_INTEGER,
    );
  });

  it('builds the localized Chinese about route with china-first entries first and the Douyin combo card', () => {
    const model = buildAboutPageModel('zh-CN');
    const storeIds = model.sections[0]?.entries.map((entry) => entry.id);
    const contentIds = model.sections[2]?.entries.map((entry) => entry.id);
    const douyinEntry = model.sections[2]?.entries.find((entry) => entry.id === 'douyin');
    const wechatEntry = model.sections[2]?.entries.find((entry) => entry.id === 'wechat-account');

    expect(model.routePath).toBe('/zh-CN/about/');
    expect(model.alternatePath).toBe('/about/');
    expect(model.seo.canonicalUrl).toBe('https://hagicode.com/zh-CN/about/');
    expect(model.header.title).toBe('增进交流，共同成长');
    expect(model.sections.map((section) => section.id)).toEqual(['store', 'community', 'content']);
    expect(model.sections[0]?.title).toBe('商店');
    expect(model.sections[1]?.title).toBe('增进交流，共同成长');
    expect(model.sections[2]?.title).toBe('关注团队持续发布的内容');
    expect(storeIds).toEqual(['steam']);
    expect(model.sections[1]?.entries.map((entry) => entry.id)).toEqual(['feishu-group', 'qq-group', 'discord']);
    expect(contentIds).toEqual([
      'bilibili',
      'xiaohongshu',
      'douyin',
      'wechat-account',
      'juejin',
      'zhihu',
      'infoq',
      'csdn',
      'cnblogs',
      'tencent-cloud',
      'oschina',
      'segmentfault',
      'xiaoheihe',
      'youtube',
      'devto',
      'x',
      'linkedin',
      'facebook',
    ]);
    expect(douyinEntry).toMatchObject({
      kind: 'combo',
      label: '抖音',
      detail: '扫码查看 HagiCode 抖音账号',
      linkText: '打开抖音二维码',
      imageUrl: expect.stringContaining('https://index.hagicode.com/_astro/'),
      alt: 'HagiCode 抖音二维码',
    });
    expect(wechatEntry).toMatchObject({
      kind: 'media',
      detail: '扫码查看 HagiCode 微信公众号',
      linkText: '打开二维码',
      alt: 'HagiCode 微信公众号二维码',
    });
    expect(contentIds).not.toContain('douyin-account');
    expect(contentIds).not.toContain('douyin-qr');
    expect(contentIds).toContain('youtube');
    expect(model.sections[0]?.entries.find((entry) => entry.id === 'steam')).toMatchObject({
      kindLabel: '商店',
      detail: '官方商店页',
      linkText: '打开商店页',
      href: 'https://store.steampowered.com/app/4625540/Hagicode/',
      presentation: {
        theme: 'steam',
        icon: 'steam',
        badgeLabel: '官方商店',
      },
    });
    expect(
      contentIds?.indexOf('facebook') ?? Number.MAX_SAFE_INTEGER,
    ).toBeGreaterThan(contentIds?.indexOf('xiaoheihe') ?? Number.MIN_SAFE_INTEGER);
  });

  it('rebuilds the English page model from an injected fetched snapshot payload', () => {
    const fetchedSnapshot = normalizeAboutSnapshotData({
      version: '1.0.0',
      updatedAt: '2026-04-05T00:00:00.000Z',
      entries: [
        {
          id: 'youtube',
          type: 'link',
          label: 'YouTube',
          regionPriority: 'international-first',
          url: 'https://www.youtube.com/@hagicode',
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
          imageUrl: '/_astro/douyin.runtime.png',
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
          imageUrl: '/_astro/feishu.runtime.png',
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
          imageUrl: '/_astro/wechat.runtime.jpg',
          width: 430,
          height: 430,
          alt: 'HagiCode 微信公众号二维码',
        },
      ],
    });

    const runtimeModel = buildAboutPageModel('en', fetchedSnapshot);

    expect(runtimeModel.snapshot).toEqual({
      version: '1.0.0',
      updatedAt: '2026-04-05T00:00:00.000Z',
    });
    expect(runtimeModel.sections[0]?.entries.find((entry) => entry.id === 'steam')).toMatchObject({
      kindLabel: 'Store',
      href: 'https://store.steampowered.com/app/4625540/Hagicode/',
      presentation: {
        theme: 'steam',
      },
    });
    expect(runtimeModel.sections[2]?.entries.find((entry) => entry.id === 'douyin-qr')).toMatchObject({
      kind: 'media',
      imageUrl: 'https://index.hagicode.com/_astro/douyin.runtime.png',
    });
  });

  it('rebuilds the Chinese page model from an injected fetched snapshot while preserving the Douyin combo logic', () => {
    const baselineModel = buildAboutPageModel('zh-CN');
    const fetchedSnapshot = normalizeAboutSnapshotData({
      version: '1.0.0',
      updatedAt: '2026-04-06T00:00:00.000Z',
      entries: [
        {
          id: 'youtube',
          type: 'link',
          label: 'YouTube',
          regionPriority: 'international-first',
          url: 'https://www.youtube.com/@hagicode',
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
          url: 'https://www.douyin.com/user/demo',
        },
        {
          id: 'douyin-qr',
          type: 'qr',
          label: '抖音二维码',
          regionPriority: 'china-first',
          imageUrl: '/_astro/douyin.runtime-next.png',
          width: 1061,
          height: 1059,
          alt: 'HagiCode 抖音二维码',
          url: 'https://www.douyin.com/user/demo',
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
          imageUrl: '/_astro/feishu.runtime-next.png',
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
          imageUrl: '/_astro/wechat.runtime-next.jpg',
          width: 430,
          height: 430,
          alt: 'HagiCode 微信公众号二维码',
        },
      ],
    });

    const runtimeModel = buildAboutPageModel('zh-CN', fetchedSnapshot);
    const contentIds = runtimeModel.sections[2]?.entries.map((entry) => entry.id);
    const douyinEntry = runtimeModel.sections[2]?.entries.find((entry) => entry.id === 'douyin');

    expect(contentIds).toContain('douyin');
    expect(contentIds).not.toContain('douyin-account');
    expect(contentIds).not.toContain('douyin-qr');
    expect(douyinEntry).toMatchObject({
      kind: 'combo',
      imageUrl: 'https://index.hagicode.com/_astro/douyin.runtime-next.png',
      href: 'https://www.douyin.com/user/demo',
    });
    expect(runtimeModel.sections[0]?.entries.map((entry) => entry.id)).toEqual(['steam']);
    expect(runtimeModel.sections[0]?.entries.find((entry) => entry.id === 'steam')).toMatchObject({
      kindLabel: '商店',
    });
    expect(runtimeModel.snapshot.updatedAt).toBe('2026-04-06T00:00:00.000Z');
    expect(hasAboutPageModelMaterialChange(baselineModel, runtimeModel)).toBe(true);
  });
});
