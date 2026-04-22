import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoShowcase from './VideoShowcase';
import {
  getHomepageFallbackProvider,
  resolveHomepageVideoProvider,
  type FeaturedVideosByProvider,
  type VideoShowcaseItem,
} from './video-showcase-model';

const englishFeaturedVideos: FeaturedVideosByProvider = {
  youtube: {
    provider: 'youtube',
    embedId: 'AQ8oSTW6wNQ',
    title: 'English overview',
    description: 'The English primary video stays visible with a YouTube CTA.',
    watchUrl: 'https://www.youtube.com/watch?v=AQ8oSTW6wNQ',
    ctaLabel: 'Open on YouTube',
  },
  bilibili: {
    provider: 'bilibili',
    embedId: 'BV1z4oWB3EpY',
    title: 'Bilibili overview',
    description: 'The Chinese-primary fallback still keeps a visible CTA.',
    watchUrl: 'https://www.bilibili.com/video/BV1z4oWB3EpY/',
    ctaLabel: 'Open on Bilibili',
  },
};

const chineseFeaturedVideos: FeaturedVideosByProvider = {
  youtube: {
    provider: 'youtube',
    embedId: 'AQ8oSTW6wNQ',
    title: '英文介绍',
    description: '英文主介绍视频仍然保留清晰的 YouTube CTA。',
    watchUrl: 'https://www.youtube.com/watch?v=AQ8oSTW6wNQ',
    ctaLabel: '打开 YouTube',
  },
  bilibili: {
    provider: 'bilibili',
    embedId: 'BV1z4oWB3EpY',
    title: '中文介绍',
    description: '中文主介绍视频仍然保留清晰的 Bilibili CTA。',
    watchUrl: 'https://www.bilibili.com/video/BV1z4oWB3EpY/',
    ctaLabel: '打开 Bilibili',
  },
};

const supportingVideos: VideoShowcaseItem[] = [
  {
    provider: 'bilibili',
    embedId: 'BV1KxwMzxEVK',
    title: 'Supporting demo',
    description: 'A supporting card with a platform-specific CTA.',
    watchUrl: 'https://www.bilibili.com/video/BV1KxwMzxEVK/',
    ctaLabel: 'Open on Bilibili',
  },
];

describe('homepage video provider resolution', () => {
  it('routes zh-prefixed browser languages to Bilibili and other languages to YouTube', () => {
    expect(resolveHomepageVideoProvider('zh-CN', 'youtube')).toBe('bilibili');
    expect(resolveHomepageVideoProvider('zh-Hans', 'youtube')).toBe('bilibili');
    expect(resolveHomepageVideoProvider('en-US', 'bilibili')).toBe('youtube');
    expect(resolveHomepageVideoProvider('fr-FR', 'bilibili')).toBe('youtube');
  });

  it('falls back to the current page locale when browser language is missing', () => {
    expect(getHomepageFallbackProvider('en')).toBe('youtube');
    expect(getHomepageFallbackProvider('zh-CN')).toBe('bilibili');
    expect(resolveHomepageVideoProvider(undefined, getHomepageFallbackProvider('en'))).toBe('youtube');
    expect(resolveHomepageVideoProvider('', getHomepageFallbackProvider('zh-CN'))).toBe('bilibili');
  });
});

describe('VideoShowcase SSR fallback', () => {
  it('renders the YouTube primary video and CTA for the English homepage before hydration', () => {
    const markup = renderToStaticMarkup(
      <VideoShowcase
        locale="en"
        featuredVideos={englishFeaturedVideos}
        supportingVideos={supportingVideos}
      />,
    );

    expect(markup).toContain('data-featured-provider="youtube"');
    expect(markup).toContain('data-video-provider="youtube"');
    expect(markup).toContain('https://www.youtube.com/watch?v=AQ8oSTW6wNQ');
    expect(markup).toContain('Open on YouTube');
    expect(markup).toContain('YouTube player: English overview');
  });

  it('renders the Bilibili primary video and CTA for the Chinese homepage before hydration', () => {
    const markup = renderToStaticMarkup(
      <VideoShowcase
        locale="zh-CN"
        featuredVideos={chineseFeaturedVideos}
        supportingVideos={supportingVideos}
      />,
    );

    expect(markup).toContain('data-featured-provider="bilibili"');
    expect(markup).toContain('data-video-provider="bilibili"');
    expect(markup).toContain('https://www.bilibili.com/video/BV1z4oWB3EpY/');
    expect(markup).toContain('打开 Bilibili');
    expect(markup).toContain('Bilibili player: 中文介绍');
  });
});
