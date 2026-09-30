import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = resolve(process.cwd(), 'dist');
const built = existsSync(resolve(dist, 'rss.xml'));
const read = (file: string) => readFileSync(resolve(dist, file), 'utf8');
const itemLinks = (xml: string) =>
  [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gu)]
    .map(([, item]) => item.match(/<link>([^<]+)<\/link>/u)?.[1] ?? '');

describe.skipIf(!built)('Official Website built RSS feeds', () => {
  it('publishes English root and alias feeds with absolute published article URLs', () => {
    const english = read('rss.xml');
    const alias = read('rss.en.xml');
    const links = itemLinks(english);

    expect(english).toMatch(/<language>en-US<\/language>/u);
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((link) => new URL(link).origin === 'https://www.hagicode.com')).toBe(true);
    expect(links.every((link) => /^https:\/\/www\.hagicode\.com\/[^/]+\/$/u.test(link))).toBe(true);
    expect(itemLinks(alias)).toEqual(links);
    expect(new Set(links).size).toBe(links.length);
  });

  it('publishes a localized feed and preserves the separate Docs blog subscription', () => {
    const chinese = read('rss.zh-CN.xml');
    const links = itemLinks(chinese);
    const englishHome = read('en-US/index.html');
    const chineseHome = read('zh-CN/index.html');

    expect(chinese).toMatch(/<language>zh-CN<\/language>/u);
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((link) => (
      new URL(link).origin === 'https://www.hagicode.com'
      && new URL(link).pathname.startsWith('/zh-CN/')
    ))).toBe(true);
    expect(englishHome).toMatch(/type="application\/rss\+xml"[^>]+href="https:\/\/www\.hagicode\.com\/rss\.xml"/u);
    expect(chineseHome).toMatch(/type="application\/rss\+xml"[^>]+href="https:\/\/www\.hagicode\.com\/rss\.zh-CN\.xml"/u);
    expect(englishHome).toMatch(/href="https:\/\/docs\.hagicode\.com\/blog\/rss\.en-US\.xml"[^>]*>Docs Blog RSS</u);
    expect(chineseHome).toMatch(/href="https:\/\/docs\.hagicode\.com\/blog\/rss\.zh-CN\.xml"[^>]*>文档博客 RSS</u);
  });
});
