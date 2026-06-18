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

const agentChoices = [
  { slug: 'claude-vs-hagicode', agentName: 'Claude Code', href: '/en-US/claude-vs-hagicode/', localizedLocale: 'en-US' },
  { slug: 'codex-vs-hagicode', agentName: 'Codex', href: '/zh-CN/codex-vs-hagicode/', localizedLocale: 'zh-CN' },
];

describe('HeroSection', () => {
  it('hides the homepage Steam button while Steam support is pending', () => {
    const copy = getHomepageInteractiveCopy('en-US');
    const markup = renderToStaticMarkup(
      <HeroSection locale="en-US" copy={copy.hero} workflowBoardCopy={copy.workflowBoard} />,
    );

    expect(markup).toContain('data-windows-store-entry="site-home-hero"');
    expect(markup).toContain('<ms-store-badge');
    expect(markup).toContain('productid="9N3PM0N3SVDW"');
    expect(markup).toContain('language="en-us"');
    expect(markup).toContain('size="large"');
    expect(markup).not.toContain('data-steam-entry="site-home-hero"');
    expect(markup).not.toContain('>Steam<');
  });

  it('renders the chooser between the product overview video and the workflow board', () => {
    const copy = getHomepageInteractiveCopy('en-US');
    const markup = renderToStaticMarkup(
      <HeroSection
        locale="en-US"
        copy={copy.hero}
        workflowBoardCopy={copy.workflowBoard}
        agentChoices={agentChoices}
        productOverviewVideo={{
          copy: { title: 'Hagicode video' },
          featuredVideos,
        }}
      />,
    );

    expect(markup.indexOf('data-video-placement="hero"')).toBeLessThan(markup.indexOf('hero-agent-chooser-title'));
    expect(markup.indexOf('hero-agent-chooser-title')).toBeLessThan(markup.indexOf('hero-workflow-title'));
    expect(markup).toContain('Choose an agent you know');
    expect(markup).toContain('Claude Code');
    expect(markup).toContain('/zh-CN/codex-vs-hagicode/');
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
