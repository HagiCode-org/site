// @vitest-environment jsdom

import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import PricingComparisonSection from '@/components/home/PricingComparisonSection';
import { getPricingContent } from '@/lib/homepage-section-copy';
import { setupGaClickHarness } from '@/lib/analytics/test-harness';

const harness = setupGaClickHarness();
const { gtag } = harness;

describe('PricingComparisonSection Google Analytics events', () => {
  afterEach(() => {
    harness.cleanup();
  });

  for (const locale of ['en', 'zh-CN'] as const) {
    it(`reports one navigation event per edition action for ${locale}`, async () => {
      const container = await harness.render(<PricingComparisonSection content={getPricingContent(locale)} />);
      const actions = Array.from(container.querySelectorAll<HTMLAnchorElement>('thead a[data-ga-location="pricing"]'));

      expect(actions.map((action) => action.dataset.gaLabel)).toEqual([
        'pricingDesktop',
        'pricingContainer',
        'pricingMicrosoftStore',
      ]);

      for (const action of actions) {
        gtag.mockClear();
        harness.click(action);

        expect(gtag).toHaveBeenCalledTimes(1);
        expect(gtag).toHaveBeenCalledWith('event', 'link_click', {
          event_category: 'navigation',
          event_label: action.dataset.gaLabel,
          link_location: 'pricing',
          link_url: action.href,
          transport_type: 'beacon',
        });
      }
    });
  }

  it('sends nothing for in-table cell links', async () => {
    const container = await harness.render(<PricingComparisonSection content={getPricingContent('en')} />);
    const cellLinks = Array.from(container.querySelectorAll('tbody a'));

    expect(cellLinks.length).toBeGreaterThan(0);
    for (const link of cellLinks) {
      expect(link.hasAttribute('data-ga-category')).toBe(false);
      harness.click(link);
    }

    expect(gtag).not.toHaveBeenCalled();
  });
});
