import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoShowcase from './VideoShowcase';
import {
  getHomepageFallbackProvider,
  getVideoEmbedUrl,
  type VideoShowcaseItem,
} from './video-showcase-model';

const supportingVideos: VideoShowcaseItem[] = [
  {
    provider: 'bilibili',
    embedId: 'BV1KxwMzxEVK',
    title: 'Supporting demo',
    description: 'A supporting card with a platform-specific CTA.',
    watchUrl: 'https://www.bilibili.com/video/BV1KxwMzxEVK/',
    ctaLabel: 'Open on Bilibili',
  },
  {
    provider: 'youtube',
    embedId: 'supporting-youtube',
    title: 'YouTube supporting demo',
    description: 'A second supporting card that keeps provider labels visible.',
    watchUrl: 'https://www.youtube.com/watch?v=supporting-youtube',
    ctaLabel: 'Open on YouTube',
  },
];

describe('homepage video provider resolution', () => {
  it('selects video provider from the current site language only', () => {
    expect(getHomepageFallbackProvider('en')).toBe('youtube');
    expect(getHomepageFallbackProvider('zh-CN')).toBe('bilibili');
  });

  it('builds a muted autoplay YouTube embed url', () => {
    const embedUrl = getVideoEmbedUrl({ provider: 'youtube', embedId: 'AQ8oSTW6wNQ' });

    expect(embedUrl).toContain('autoplay=1');
    expect(embedUrl).toContain('mute=1');
    expect(embedUrl).toContain('playsinline=1');
  });

  it('builds a muted autoplay Bilibili embed url', () => {
    const embedUrl = getVideoEmbedUrl({ provider: 'bilibili', embedId: 'BV1KxwMzxEVK' });

    expect(embedUrl).toContain('autoplay=1');
    expect(embedUrl).toContain('muted=1');
    expect(embedUrl).toContain('mute=1');
  });
});

describe('VideoShowcase supporting demos', () => {
  it('renders supporting videos without featured provider state', () => {
    const markup = renderToStaticMarkup(
      <VideoShowcase
        locale="en"
        supportingLabel="Focused demo"
        supportingVideos={supportingVideos}
      />,
    );

    expect(markup).not.toContain('data-featured-provider');
    expect(markup).toContain('data-video-locale="en"');
    expect(markup).toContain('data-video-provider="bilibili"');
    expect(markup).toContain('data-video-provider="youtube"');
    expect(markup).toContain('Supporting demo');
    expect(markup).toContain('YouTube supporting demo');
    expect(markup).toContain('Bilibili player: Supporting demo');
    expect(markup).toContain('YouTube player: YouTube supporting demo');
  });

  it('does not duplicate the primary overview videos in the supporting-only section', () => {
    const markup = renderToStaticMarkup(
      <VideoShowcase locale="zh-CN" supportingVideos={supportingVideos} />,
    );

    expect(markup).not.toContain('AQ8oSTW6wNQ');
    expect(markup).not.toContain('BV1z4oWB3EpY');
    expect(markup).not.toContain('Hagicode Product Overview');
  });

  it('keeps supporting card titles, descriptions, labels, and safe external watch links', () => {
    const markup = renderToStaticMarkup(
      <VideoShowcase locale="en" supportingLabel="Focused demo" supportingVideos={supportingVideos} />,
    );

    expect(markup).toContain('Focused demo');
    expect(markup).toContain('A supporting card with a platform-specific CTA.');
    expect(markup).toContain('Bilibili');
    expect(markup).toContain('YouTube');
    expect(markup).toContain('rel="noreferrer"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('aria-label="Open on Bilibili: Supporting demo"');
    expect(markup).toContain('Open on YouTube');
  });
});
