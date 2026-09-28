import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Footer from './Footer';
import footerSitesSnapshot from '@/data/footer-sites.snapshot.json';
import { getFooterRelatedSites } from '@/lib/footer-site-links';

afterEach(() => vi.unstubAllEnvs());

function countOccurrences(input: string, target: string) {
  return input.split(target).length - 1;
}

describe('Footer related sites', () => {
  it('renders the English related-sites section with quick links intact', () => {
    const markup = renderToStaticMarkup(<Footer locale="en" />);

    expect(markup).toContain('Ecosystem Sites');
    expect(markup).toContain('HagiCode Docs');
    expect(markup).toContain('Official guides and references.');
    expect(markup).toContain('https://docs.hagicode.com/en-US/');
    expect(markup).toContain('/en-US/desktop/');
    expect(markup).toContain('Product Docs');
    expect(markup).toContain('https://docs.hagicode.com/en-US/product-overview/');
    expect(markup).toContain('https://docs.hagicode.com/en-US/blog/');
    expect(markup).toContain('https://docs.hagicode.com/blog/rss.en-US.xml');
  });

  it('renders the Chinese related-sites section with localized quick links intact', () => {
    const markup = renderToStaticMarkup(<Footer locale="zh-CN" />);

    expect(markup).toContain('生态站点');
    expect(markup).toContain('Docker Compose Builder');
    expect(markup).toContain('Docker 部署 Hagicode');
    expect(markup).toContain('https://docs.hagicode.com/');
    expect(markup).toContain('/zh-CN/desktop/');
    expect(markup).toContain('产品文档');
    expect(markup).toContain('https://docs.hagicode.com/product-overview/');
    expect(markup).toContain('https://docs.hagicode.com/blog/rss.zh-CN.xml');
  });

  it('renders snapshot-backed related sites while excluding the current site and duplicate cost link', () => {
    const markup = renderToStaticMarkup(<Footer locale="en" />);

    expect(markup).toContain('https://docs.hagicode.com/en-US/');
    expect(markup).toContain('https://builder.hagicode.com/');
    expect(markup).toContain('https://design.hagicode.com/');
    expect(markup).not.toContain('https://www.hagicode.com/');
    expect(countOccurrences(markup, 'https://cost.hagicode.com')).toBe(1);

    const snapshotEntry = footerSitesSnapshot.entries.find((entry) => entry.id === 'trait-builder');
    expect(snapshotEntry?.url).toBe('https://trait.hagicode.com/');
    expect(markup).toContain('https://trait.hagicode.com/');
    expect(getFooterRelatedSites('en').map(({ id }) => id)).toEqual(
      footerSitesSnapshot.entries.map(({ id }) => id),
    );
  });

  it('renders the Steam support link with the canonical external URL and safe attributes', () => {
    const markup = renderToStaticMarkup(<Footer locale="en" />);

    expect(markup).toContain('>Steam<');
    expect(markup).toContain('href="https://store.steampowered.com/app/4625540/Hagicode/"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('https://beian.miit.gov.cn/');
    expect(markup).toContain('http://www.beian.gov.cn/portal/registerSystemInfo');
  });

  it('uses the site deployment base for internal routes and leaves Docs external', () => {
    vi.stubEnv('VITE_SITE_BASE', '/preview');
    const markup = renderToStaticMarkup(<Footer locale="ja-JP" />);

    expect(markup).toContain('href="/preview/ja-JP/desktop/"');
    expect(markup).toContain('href="https://docs.hagicode.com/ja-JP/"');
    expect(markup).toContain('href="https://docs.hagicode.com/ja-JP/blog/"');
  });
});
