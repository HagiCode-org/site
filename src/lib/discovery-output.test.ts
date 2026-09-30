import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = resolve(process.cwd(), 'dist');
const built = existsSync(resolve(dist, 'index.html'));

describe.skipIf(!built)('shared discovery defaults', () => {
  it('publishes the standard robots and sitemap output without site RSS feeds', () => {
    const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
    const robots = readFileSync(resolve(dist, 'robots.txt'), 'utf8');
    const sitemap = readFileSync(resolve(dist, 'sitemap-index.xml'), 'utf8');

    expect(robots).toContain('User-agent: *\nAllow: /');
    expect(robots).toContain('Sitemap: https://www.hagicode.com/sitemap-index.xml');
    expect(sitemap).toContain('https://www.hagicode.com/sitemap-0.xml');
    expect(html).not.toMatch(/application\/rss\+xml|\/rss(?:\.xml|\.en\.xml|\.zh-CN\.xml)/u);
    expect(existsSync(resolve(dist, 'rss.xml'))).toBe(false);
  });
});
