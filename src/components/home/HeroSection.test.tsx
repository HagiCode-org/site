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
  it('has no Steam button and leads with the Microsoft Store badge', () => {
    const copy = getHomepageInteractiveCopy('en-US');
    const markup = renderToStaticMarkup(
      <HeroSection locale="en-US" copy={copy.hero} workflowBoardCopy={copy.workflowBoard} />,
    );

    expect(markup).toContain('data-windows-store-entry="site-home-hero"');
    expect(markup).toContain('<ms-store-badge');
    expect(markup).toContain('productid="9N3PM0N3SVDW"');
    expect(markup).toContain('language="en-us"');
    expect(markup).toContain('size="large"');
    expect(markup.indexOf('ms-store-badge')).toBeLessThan(markup.indexOf('Install Desktop App'));
    expect(markup).toContain('Recommended');
    expect(markup).not.toContain('data-steam-entry="site-home-hero"');
    expect(markup).not.toContain('>Steam<');
  });

  it('leads with the proposal-driven headline instead of generic taglines', () => {
    const copy = getHomepageInteractiveCopy('en-US');
    const markup = renderToStaticMarkup(
      <HeroSection locale="en-US" copy={copy.hero} workflowBoardCopy={copy.workflowBoard} />,
    );

    expect(markup).toContain('Turn AI coding from open-ended chat into reviewable, reusable proposals');
    expect(markup).toContain('Proposal → Execution → Archive');
    expect(markup).not.toContain('Not globally unique');
  });

  it('keeps the product video above the workflow board and leaves the agent entry to the compare arena', () => {
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

    expect(markup.indexOf('data-video-placement="hero"')).toBeLessThan(markup.indexOf('hero-workflow-title'));
    expect(markup).not.toContain('-vs-hagicode/');
    expect(markup).toContain('YouTube player: Hagicode YouTube');
    expect(markup).not.toContain('Open on YouTube');
    expect(markup).not.toContain('Open on Bilibili');
  });

  it('renders the agent lanes board in the hero stage', () => {
    const copy = getHomepageInteractiveCopy('en-US');
    const markup = renderToStaticMarkup(
      <HeroSection locale="en-US" copy={copy.hero} workflowBoardCopy={copy.workflowBoard} />,
    );

    expect(markup).not.toContain('Smart');
    expect(markup).toContain('Many agents, every stage, always running');
    expect(markup).toContain('Illustrative run');
    expect(markup).toContain('Claude Code');
    expect(markup).toContain('Archive feeds the next proposal');
    expect(markup).not.toContain('10x Parallel Management Efficiency');
    expect(markup).not.toContain('Live Efficiency');
  });
});
