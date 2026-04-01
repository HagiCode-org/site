import { describe, expect, it } from 'vitest';
import { buildAboutPageModel } from './about-page-model';

describe('about page model', () => {
  it('builds the English about route with international entries first while keeping all entries visible', () => {
    const model = buildAboutPageModel('en');
    const youtubeEntry = model.sections[1]?.entries.find((entry) => entry.id === 'youtube');
    const discordEntry = model.sections[0]?.entries.find((entry) => entry.id === 'discord');

    expect(model.routePath).toBe('/about/');
    expect(model.alternatePath).toBe('/zh-CN/about/');
    expect(model.seo.canonicalUrl).toBe('https://hagicode.com/about/');
    expect(model.header.title).toBe('Grow through exchange');
    expect(model.sections.map((section) => section.id)).toEqual(['community', 'content']);
    expect(model.sections[0]?.title).toBe('Grow through exchange');
    expect(model.sections[0]?.entries.map((entry) => entry.id)).toEqual(['discord', 'feishu-group', 'qq-group']);
    expect(model.sections[1]?.entries.map((entry) => entry.id).slice(0, 5)).toEqual([
      'youtube',
      'devto',
      'x',
      'linkedin',
      'facebook',
    ]);
    expect(model.sections[1]?.entries.map((entry) => entry.id)).toContain('bilibili');
    expect(model.sections[1]?.entries.map((entry) => entry.id)).toContain('douyin-account');
    expect(model.sections[1]?.entries.map((entry) => entry.id)).toContain('douyin-qr');
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
    expect(model.sections[1]?.entries.find((entry) => entry.id === 'douyin')).toBeUndefined();
    expect(
      model.sections[1]?.entries.findIndex((entry) => entry.id === 'facebook'),
    ).toBeLessThan(
      model.sections[1]?.entries.findIndex((entry) => entry.id === 'bilibili') ?? Number.MAX_SAFE_INTEGER,
    );
  });

  it('builds the localized Chinese about route with china-first entries first and the Douyin combo card', () => {
    const model = buildAboutPageModel('zh-CN');
    const contentIds = model.sections[1]?.entries.map((entry) => entry.id);
    const douyinEntry = model.sections[1]?.entries.find((entry) => entry.id === 'douyin');
    const wechatEntry = model.sections[1]?.entries.find((entry) => entry.id === 'wechat-account');

    expect(model.routePath).toBe('/zh-CN/about/');
    expect(model.alternatePath).toBe('/about/');
    expect(model.seo.canonicalUrl).toBe('https://hagicode.com/zh-CN/about/');
    expect(model.header.title).toBe('增进交流，共同成长');
    expect(model.sections[0]?.title).toBe('增进交流，共同成长');
    expect(model.sections[1]?.title).toBe('关注团队持续发布的内容');
    expect(model.sections[0]?.entries.map((entry) => entry.id)).toEqual(['feishu-group', 'qq-group', 'discord']);
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
    expect(
      contentIds?.indexOf('facebook') ?? Number.MAX_SAFE_INTEGER,
    ).toBeGreaterThan(contentIds?.indexOf('xiaoheihe') ?? Number.MIN_SAFE_INTEGER);
  });
});
