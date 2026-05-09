import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getHomepageInteractiveCopy } from '@/lib/homepage-runtime-copy';
import HeroSection from './HeroSection';
import type { FeaturedVideosByProvider } from './video-showcase-model';

const featuredVideos: FeaturedVideosByProvider = {
  youtube: {
    provider: 'youtube',
    embedId: 'AQ8oSTW6wNQ',
    title: 'Hagicode YouTube',
    description: 'YouTube video.',
    watchUrl: 'https://www.youtube.com/watch?v=AQ8oSTW6wNQ',
    ctaLabel: 'Open on YouTube',
  },
  bilibili: {
    provider: 'bilibili',
    embedId: 'BV1z4oWB3EpY',
    title: 'Hagicode Bilibili',
    description: 'Bilibili video.',
    watchUrl: 'https://www.bilibili.com/video/BV1z4oWB3EpY/',
    ctaLabel: 'Open on Bilibili',
  },
};

describe('HeroSection', () => {
  it('renders the homepage Steam button with the canonical store target', () => {
    const copy = getHomepageInteractiveCopy('en-US');
    const markup = renderToStaticMarkup(
      <HeroSection locale="en-US" copy={copy.hero} workflowBoardCopy={copy.workflowBoard} />,
    );

    expect(markup).toContain('data-steam-entry="site-home-hero"');
    expect(markup).toContain('href="https://store.steampowered.com/app/4625540/Hagicode/"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('aria-label="Open Hagicode on Steam"');
    expect(markup).toContain('>Steam<');
  });

  it('keeps the Chinese Steam aria label localized on the homepage CTA', () => {
    const copy = getHomepageInteractiveCopy('zh-CN');
    const markup = renderToStaticMarkup(
      <HeroSection locale="zh-CN" copy={copy.hero} workflowBoardCopy={copy.workflowBoard} />,
    );

    expect(markup).toContain('aria-label="打开 Hagicode Steam 商店页"');
    expect(markup).toContain('data-steam-entry="site-home-hero"');
  });

  it('renders the product overview video directly after the Hagicode title when provided', () => {
    const copy = getHomepageInteractiveCopy('en-US');
    const markup = renderToStaticMarkup(
      <HeroSection
        locale="en-US"
        copy={copy.hero}
        workflowBoardCopy={copy.workflowBoard}
        productOverviewVideo={{
          copy: { title: 'Hagicode video' },
          featuredVideos,
        }}
      />,
    );

    expect(markup.indexOf('<h1')).toBeLessThan(markup.indexOf('data-video-placement="hero"'));
    expect(markup.indexOf('data-video-placement="hero"')).toBeLessThan(
      markup.indexOf('aria-label="Primary homepage actions"'),
    );
    expect(markup).toContain('YouTube player: Hagicode YouTube');
  });
});
