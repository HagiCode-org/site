import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductHuntBadgeSection, {
  PRODUCT_HUNT_BADGE_ALT,
  PRODUCT_HUNT_BADGE_HEIGHT,
  PRODUCT_HUNT_BADGE_IMAGE_URL,
  PRODUCT_HUNT_BADGE_LINK,
  PRODUCT_HUNT_BADGE_WIDTH,
} from './ProductHuntBadgeSection';

function encodeAttribute(value: string) {
  return value.replaceAll('&', '&amp;');
}

describe('ProductHuntBadgeSection', () => {
  it('renders the English Product Hunt badge entry with canonical external metadata', () => {
    const markup = renderToStaticMarkup(<ProductHuntBadgeSection locale="en" />);

    expect(markup).toContain('Trusted by early adopters');
    expect(markup).toContain('See Hagicode on Product Hunt');
    expect(markup).toContain(`href="${encodeAttribute(PRODUCT_HUNT_BADGE_LINK)}"`);
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('aria-label="Open Hagicode on Product Hunt"');
    expect(markup).toContain(`src="${encodeAttribute(PRODUCT_HUNT_BADGE_IMAGE_URL)}"`);
    expect(markup).toContain(`alt="${PRODUCT_HUNT_BADGE_ALT}"`);
    expect(markup).toContain(`width="${PRODUCT_HUNT_BADGE_WIDTH}"`);
    expect(markup).toContain(`height="${PRODUCT_HUNT_BADGE_HEIGHT}"`);
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain('decoding="async"');
  });

  it('renders Chinese localized copy and accessible labeling for the Product Hunt entry', () => {
    const markup = renderToStaticMarkup(<ProductHuntBadgeSection locale="zh-CN" />);

    expect(markup).toContain('来自早期用户的信号');
    expect(markup).toContain('在 Product Hunt 上查看 Hagicode');
    expect(markup).toContain('查看 Product Hunt 产品页');
    expect(markup).toContain('aria-label="打开 Hagicode 的 Product Hunt 页面"');
    expect(markup).toContain('data-product-hunt-entry="homepage-badge"');
  });
});
