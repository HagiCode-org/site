import { describe, expect, it } from 'vitest';
import { buildAboutPageModel } from './about-page-model';

describe('about page model', () => {
  it('builds the canonical English about route around community and content sections', () => {
    const model = buildAboutPageModel('en');

    expect(model.routePath).toBe('/about/');
    expect(model.alternatePath).toBe('/zh-CN/about/');
    expect(model.seo.canonicalUrl).toBe('https://hagicode.com/about/');
    expect(model.header.title).toBe('Grow through exchange');
    expect(model.sections.map((section) => section.id)).toEqual(['community', 'content']);
    expect(model.sections[0]?.title).toBe('Grow through exchange');
    expect(model.sections[0]?.entries.map((entry) => entry.id)).toEqual(['feishu-group', 'qq-group', 'discord']);
    expect(model.sections[1]?.entries.find((entry) => entry.id === 'douyin')).toMatchObject({
      kind: 'combo',
      imageUrl: expect.stringContaining('https://index.hagicode.com/_astro/'),
    });
  });

  it('builds the localized Chinese about route while keeping the same snapshot contract', () => {
    const model = buildAboutPageModel('zh-CN');

    expect(model.routePath).toBe('/zh-CN/about/');
    expect(model.alternatePath).toBe('/about/');
    expect(model.seo.canonicalUrl).toBe('https://hagicode.com/zh-CN/about/');
    expect(model.header.title).toBe('增进交流，共同成长');
    expect(model.sections[0]?.title).toBe('增进交流，共同成长');
    expect(model.sections[1]?.title).toBe('关注团队持续发布的内容');
    expect(model.sections[1]?.entries).toHaveLength(17);
  });
});
