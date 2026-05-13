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
  it('hides the homepage Steam button while Steam support is pending', () => {
    const copy = getHomepageInteractiveCopy('en-US');
    const markup = renderToStaticMarkup(
      <HeroSection locale="en-US" copy={copy.hero} workflowBoardCopy={copy.workflowBoard} />,
    );

    expect(markup).not.toContain('data-steam-entry="site-home-hero"');
    expect(markup).not.toContain('>Steam<');
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
    expect(markup.indexOf('data-video-placement="hero"')).toBeLessThan(markup.indexOf('hero-workflow-title'));
    expect(markup).toContain('YouTube player: Hagicode YouTube');
    expect(markup).not.toContain('Open on YouTube');
    expect(markup).not.toContain('Open on Bilibili');
  });

  it('renders the workflow board summary copy in the hero stage', () => {
    const copy = getHomepageInteractiveCopy('en-US');
    const markup = renderToStaticMarkup(
      <HeroSection locale="en-US" copy={copy.hero} workflowBoardCopy={copy.workflowBoard} />,
    );

    expect(markup).not.toContain('Smart');
    expect(markup).toContain('Mainstream Agents Supported');
    expect(markup).toContain('10x Parallel Management Efficiency');
    expect(markup).toContain('OpenSpec Reduces Hallucinations');
    expect(markup).toContain('Completed Tasks');
    expect(markup).toContain('Live Efficiency');
  });
});
