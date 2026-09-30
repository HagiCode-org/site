import { describe, expect, it } from 'vitest';
import getFeed from './rss-feed';

describe('Official Website RSS callback', () => {
  it.each([
    ['en-US', 'en-US', '/'],
    ['zh-CN', 'zh-CN', '/zh-CN/'],
    ['ja-JP', 'ja-JP', '/ja-JP/'],
  ])('returns published %s articles at localized paths', (route, lang, prefix) => {
    const feed = getFeed({ route, lang });

    expect(feed.items.length).toBeGreaterThan(0);
    expect(feed.items.every((item) => (
      lang === 'en-US'
        ? /^\/[^/]+\/$/u.test(item.link)
        : item.link.startsWith(prefix)
    ))).toBe(true);
    expect(feed.items.every((item) => item.title.length > 0 && item.description.length > 0)).toBe(true);
    expect(feed.items.every((item) => !Number.isNaN(item.pubDate.getTime()))).toBe(true);
    expect(feed.items.map((item) => item.pubDate.getTime())).toEqual(
      [...feed.items].map((item) => item.pubDate.getTime()).sort((left, right) => right - left),
    );
  });

  it('rejects a callback route and language mismatch', () => {
    expect(() => getFeed({ route: 'zh-CN', lang: 'en-US' })).toThrow(/Unsupported Official Website RSS route/u);
  });
});
