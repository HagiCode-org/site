import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductOverviewVideoSection from './ProductOverviewVideoSection';
import type { FeaturedVideosByProvider } from './video-showcase-model';

const englishFeaturedVideos: FeaturedVideosByProvider = {
  youtube: {
    provider: 'youtube',
    embedId: 'AQ8oSTW6wNQ',
    title: 'Hagicode Product Overview on YouTube',
    description: 'The English primary overview keeps a clear YouTube CTA.',
    watchUrl: 'https://www.youtube.com/watch?v=AQ8oSTW6wNQ',
    ctaLabel: 'Open on YouTube',
  },
  bilibili: {
    provider: 'bilibili',
    embedId: 'BV1z4oWB3EpY',
    title: 'Hagicode Product Overview on Bilibili',
    description: 'The Chinese-primary fallback keeps a clear Bilibili CTA.',
    watchUrl: 'https://www.bilibili.com/video/BV1z4oWB3EpY/',
    ctaLabel: 'Open on Bilibili',
  },
};

const chineseFeaturedVideos: FeaturedVideosByProvider = {
  youtube: {
    provider: 'youtube',
    embedId: 'AQ8oSTW6wNQ',
    title: 'Hagicode YouTube',
    description: '英文主介绍视频仍然保留清晰的 YouTube CTA。',
    watchUrl: 'https://www.youtube.com/watch?v=AQ8oSTW6wNQ',
    ctaLabel: '打开 YouTube',
  },
  bilibili: {
    provider: 'bilibili',
    embedId: 'BV1z4oWB3EpY',
    title: 'Hagicode Bilibili',
    description: '中文主介绍视频仍然保留清晰的 Bilibili CTA。',
    watchUrl: 'https://www.bilibili.com/video/BV1z4oWB3EpY/',
    ctaLabel: '打开 Bilibili',
  },
};

describe('ProductOverviewVideoSection locale provider selection', () => {
  it('selects the YouTube overview video for the English site language with iframe title and outbound CTA', () => {
    const markup = renderToStaticMarkup(
      <ProductOverviewVideoSection
        locale="en"
        copy={{
          title: 'Understand Hagicode before the feature tour',
        }}
        featuredVideos={englishFeaturedVideos}
      />,
    );

    expect(markup).toContain('aria-labelledby="product-overview-video-title"');
    expect(markup).toContain('data-overview-provider="youtube"');
    expect(markup).toContain('data-video-provider="youtube"');
    expect(markup).toContain('YouTube player: Hagicode Product Overview on YouTube');
    expect(markup).toContain('https://www.youtube.com/watch?v=AQ8oSTW6wNQ');
    expect(markup).toContain('Open on YouTube');
    expect(markup).toContain('aria-label="Open on YouTube: Hagicode Product Overview on YouTube"');
    expect(markup).not.toContain('Product overview video');
    expect(markup).not.toContain('The English primary overview keeps a clear YouTube CTA.');
  });

  it('selects the Bilibili overview video for the Chinese site language with iframe title and outbound CTA', () => {
    const markup = renderToStaticMarkup(
      <ProductOverviewVideoSection
        locale="zh-CN"
        copy={{
          title: 'Hagicode video',
        }}
        featuredVideos={chineseFeaturedVideos}
      />,
    );

    expect(markup).toContain('aria-labelledby="product-overview-video-title"');
    expect(markup).toContain('data-overview-provider="bilibili"');
    expect(markup).toContain('data-video-provider="bilibili"');
    expect(markup).toContain('Bilibili player: Hagicode Bilibili');
    expect(markup).toContain('https://www.bilibili.com/video/BV1z4oWB3EpY/');
    expect(markup).toContain('打开 Bilibili');
    expect(markup).toContain('aria-label="打开 Bilibili: Hagicode Bilibili"');
    expect(markup).not.toContain('产品总览视频');
    expect(markup).not.toContain('当前平台：');
    expect(markup).not.toContain('中文主介绍视频仍然保留清晰的 Bilibili CTA。');
  });

  it('hides the outbound CTA button in hero placement', () => {
    const markup = renderToStaticMarkup(
      <ProductOverviewVideoSection
        locale="en"
        placement="hero"
        copy={{
          title: 'Understand Hagicode before the feature tour',
        }}
        featuredVideos={englishFeaturedVideos}
      />,
    );

    expect(markup).toContain('data-video-placement="hero"');
    expect(markup).not.toContain('Open on YouTube');
    expect(markup).not.toContain('aria-label="Open on YouTube: Hagicode Product Overview on YouTube"');
  });
});
