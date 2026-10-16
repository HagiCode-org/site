// @vitest-environment jsdom

import React from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { getHomepageInteractiveCopy } from '@/lib/homepage-runtime-copy';
import { setupGaClickHarness, stubMatchMedia } from '@/lib/analytics/test-harness';
import HeroSection from './HeroSection';

const storeUrl = 'https://apps.microsoft.com/detail/9N3PM0N3SVDW';

vi.mock('@/lib/shared/windows-store-link', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/shared/windows-store-link')>()),
  getBundledWindowsStoreLink: () => ({ href: storeUrl, source: 'bundled', updatedAt: null }),
  loadWindowsStoreLink: async () => ({ href: storeUrl, source: 'canonical', updatedAt: null }),
}));

const harness = setupGaClickHarness();
const { gtag } = harness;

const agentChoices = [
  { slug: 'claude-vs-hagicode', agentName: 'Claude Code', href: '/en-US/claude-vs-hagicode/', localizedLocale: 'en-US' },
];

async function renderHero() {
  const copy = getHomepageInteractiveCopy('en-US');
  return await harness.render(
    <HeroSection
      locale="en-US"
      copy={copy.hero}
      workflowBoardCopy={copy.workflowBoard}
      agentChoices={agentChoices}
    />,
  );
}

function expectOneEvent(action: string, params: Record<string, string>) {
  expect(gtag).toHaveBeenCalledTimes(1);
  expect(gtag).toHaveBeenCalledWith('event', action, { ...params, transport_type: 'beacon' });
  gtag.mockClear();
}

describe('HeroSection Google Analytics events', () => {
  beforeAll(() => {
    stubMatchMedia();
  });

  afterEach(() => {
    harness.cleanup();
  });

  it('reports the desktop and documentation buttons through data-ga tags', async () => {
    const container = await renderHero();
    const byLabel = (label: string) =>
      container.querySelector<HTMLAnchorElement>(`a[data-ga-location="home_hero"][data-ga-label="${label}"]`) as HTMLAnchorElement;

    for (const label of ['openDesktopPage', 'productDocs']) {
      const link = byLabel(label);
      expect(link, label).not.toBeNull();

      harness.click(link);
      expectOneEvent('link_click', {
        event_category: 'navigation',
        event_label: label,
        link_location: 'home_hero',
        link_url: link.href,
      });
    }
  });

  it('reports the Microsoft Store badge once through its host element', async () => {
    const container = await renderHero();
    const badge = container.querySelector('ms-store-badge[data-windows-store-entry="site-home-hero"]');

    expect(badge).not.toBeNull();
    harness.click(badge as Element);

    expectOneEvent('store_visit', {
      event_category: 'store',
      event_label: 'microsoftStore',
      link_location: 'home_hero',
      link_url: storeUrl,
    });
  });

  it('sends nothing for the agent chooser cards', async () => {
    const container = await renderHero();
    const card = container.querySelector('a[href="/en-US/claude-vs-hagicode/"]');

    expect(card).not.toBeNull();
    harness.click(card as Element);

    expect(gtag).not.toHaveBeenCalled();
  });
});
