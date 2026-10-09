// @vitest-environment jsdom

import React from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { getHomepageInteractiveCopy } from '@/lib/homepage-runtime-copy';
import { setupGaClickHarness, stubMatchMedia } from '@/lib/analytics/test-harness';
import Navbar from './Navbar';

vi.mock('@/lib/shared/version-manager', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/shared/version-manager')>()),
  // Keep the compact install button in its loading state instead of fetching the release index.
  getDesktopVersionData: vi.fn(() => new Promise(() => undefined)),
}));

const harness = setupGaClickHarness();
const { gtag } = harness;

async function renderNavbar() {
  const copy = getHomepageInteractiveCopy('en-US');
  return await harness.render(
    <Navbar
      locale="en-US"
      copy={copy.navbar}
      themeToggleCopy={copy.themeToggle}
      languageSwitcherCopy={copy.languageSwitcher}
    />,
  );
}

describe('Navbar Google Analytics events', () => {
  beforeAll(() => {
    stubMatchMedia();
  });

  afterEach(() => {
    harness.cleanup();
  });

  it('reports one event per navbar link in the desktop and the mobile menu', async () => {
    const container = await renderNavbar();
    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[data-ga-location="navbar"]'));

    // logo + three links in the desktop menu + three links in the mobile menu
    expect(links).toHaveLength(7);

    const expected = [
      { category: 'navigation', label: 'home', count: 1 },
      { category: 'navigation', label: 'productDocs', count: 2 },
      { category: 'navigation', label: 'support', count: 2 },
      { category: 'community', label: 'github', count: 2 },
    ];

    for (const { category, label, count } of expected) {
      const matching = links.filter((link) => link.dataset.gaLabel === label);
      expect(matching).toHaveLength(count);

      for (const link of matching) {
        gtag.mockClear();
        harness.click(link);

        expect(gtag).toHaveBeenCalledTimes(1);
        expect(gtag).toHaveBeenCalledWith('event', 'link_click', {
          event_category: category,
          event_label: label,
          link_location: 'navbar',
          link_url: link.href,
          transport_type: 'beacon',
        });
      }
    }
  });

  it('keeps labels independent of the link text', async () => {
    const container = await renderNavbar();

    for (const link of container.querySelectorAll<HTMLAnchorElement>('a[data-ga-label]')) {
      expect(link.dataset.gaLabel).toMatch(/^[a-zA-Z]+$/);
      expect(link.dataset.gaLabel).not.toBe(link.textContent?.trim());
    }
  });

  it('sends nothing for the language switcher, the theme toggle, and the mobile menu toggle', async () => {
    const container = await renderNavbar();
    const buttons = Array.from(container.querySelectorAll('button'));

    expect(container.querySelector('button[aria-controls="mobile-site-nav"]')).not.toBeNull();
    expect(container.querySelector('button[aria-haspopup="dialog"]')).not.toBeNull();
    expect(buttons.length).toBeGreaterThanOrEqual(3);

    for (const button of buttons) {
      harness.click(button);
    }

    expect(gtag).not.toHaveBeenCalled();
  });
});
