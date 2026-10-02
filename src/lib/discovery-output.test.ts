import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, SITE_ORIGIN, SUPPORTED_SITE_LOCALES } from '../i18n/locale-metadata';

const dist = resolve(process.cwd(), 'dist');
const read = (file: string) => readFileSync(resolve(dist, file), 'utf8');

function assertEmptyFeed(xml: string, language: string) {
  expect(xml).toMatch(/^<\?xml/u);
  const channel = xml.match(/<channel>([\s\S]*?)<\/channel>/u)?.[1];
  expect(channel).toBeDefined();
  if (!channel) throw new Error('Expected an RSS channel');
  expect(channel).toMatch(/<title>[^<]+<\/title>/u);
  expect(channel).toMatch(/<description>[^<]+<\/description>/u);
  expect(channel).toContain(`<language>${language}</language>`);
  const link = channel.match(/<link>([^<]+)<\/link>/u)?.[1];
  expect(link).toBe(new URL('/', SITE_ORIGIN).href);
  expect(xml).not.toMatch(/<item>/u);
}

describe('shared discovery defaults', () => {
  it('publishes empty root, English alias, and configured locale feeds', () => {
    const rootFeed = read('rss.xml');
    const englishAlias = read('rss.en.xml');
    const defaultLocaleHtml = read('en-US/index.html');
    const robots = read('robots.txt');
    const sitemap = read('sitemap-index.xml');

    assertEmptyFeed(rootFeed, DEFAULT_LOCALE);
    assertEmptyFeed(englishAlias, DEFAULT_LOCALE);
    expect(rootFeed).toBe(englishAlias);
    expect(defaultLocaleHtml).toContain('<footer');
    expect(defaultLocaleHtml).toContain(new URL('rss.xml', SITE_ORIGIN).href);
    expect(robots).toContain('User-agent: *\nAllow: /');
    expect(robots).toContain('Sitemap: https://www.hagicode.com/sitemap-index.xml');
    expect(sitemap).toContain('https://www.hagicode.com/sitemap-0.xml');

    for (const locale of SUPPORTED_SITE_LOCALES.filter((code) => code !== DEFAULT_LOCALE)) {
      assertEmptyFeed(read(`rss.${locale}.xml`), locale);
    }
  });
});
