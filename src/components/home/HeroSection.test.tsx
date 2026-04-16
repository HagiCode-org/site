import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('renders the homepage Steam button with the canonical store target', () => {
    const markup = renderToStaticMarkup(<HeroSection locale="en" />);

    expect(markup).toContain('data-steam-entry="site-home-hero"');
    expect(markup).toContain('href="https://store.steampowered.com/app/4625540/Hagicode/"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('aria-label="Open Hagicode on Steam"');
    expect(markup).toContain('>Steam<');
  });

  it('keeps the Chinese Steam aria label localized on the homepage CTA', () => {
    const markup = renderToStaticMarkup(<HeroSection locale="zh-CN" />);

    expect(markup).toContain('aria-label="打开 Hagicode Steam 商店页"');
    expect(markup).toContain('data-steam-entry="site-home-hero"');
  });
});
