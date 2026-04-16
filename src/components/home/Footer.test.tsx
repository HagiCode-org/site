import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';
import footerSitesSnapshot from '@/data/footer-sites.snapshot.json';

function countOccurrences(input: string, target: string) {
  return input.split(target).length - 1;
}

describe('Footer related sites', () => {
  it('renders the English related-sites section with quick links intact', () => {
    const markup = renderToStaticMarkup(<Footer locale="en" />);

    expect(markup).toContain('Related Sites');
    expect(markup).toContain('HagiCode Docs');
    expect(markup).toContain('使用指南');
    expect(markup).toContain('/desktop/');
    expect(markup).toContain('Product Docs');
  });

  it('renders the Chinese related-sites section with localized quick links intact', () => {
    const markup = renderToStaticMarkup(<Footer locale="zh-CN" />);

    expect(markup).toContain('生态站点');
    expect(markup).toContain('Docker Compose Builder');
    expect(markup).toContain('Docker 部署 Hagicode');
    expect(markup).toContain('/zh-CN/desktop/');
    expect(markup).toContain('产品文档');
  });

  it('renders snapshot-backed related sites while excluding the current site and duplicate cost link', () => {
    const markup = renderToStaticMarkup(<Footer locale="en" />);

    expect(markup).toContain('https://docs.hagicode.com/');
    expect(markup).toContain('https://builder.hagicode.com/');
    expect(markup).toContain('https://design.hagicode.com/');
    expect(markup).not.toContain('https://hagicode.com/');
    expect(countOccurrences(markup, 'https://cost.hagicode.com')).toBe(1);

    const snapshotEntry = footerSitesSnapshot.entries.find((entry) => entry.id === 'trait-builder');
    expect(snapshotEntry?.url).toBe('https://trait.hagicode.com/');
    expect(markup).toContain('https://trait.hagicode.com/');
  });

  it('renders the Steam support link with the canonical external URL and safe attributes', () => {
    const markup = renderToStaticMarkup(<Footer locale="en" />);

    expect(markup).toContain('>Steam<');
    expect(markup).toContain('href="https://store.steampowered.com/app/4625540/Hagicode/"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
  });
});
