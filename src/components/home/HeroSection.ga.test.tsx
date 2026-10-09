// @vitest-environment jsdom

import React from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { getHomepageInteractiveCopy } from '@/lib/homepage-runtime-copy';
import { setupGaClickHarness, stubMatchMedia } from '@/lib/analytics/test-harness';
import HeroSection from './HeroSection';

const features = vi.hoisted(() => ({ steam: false }));
const steamUrl = 'https://store.steampowered.com/app/4625540/Hagicode/';
const storeUrl = 'https://apps.microsoft.com/detail/9N3PM0N3SVDW';

vi.mock('@/config/features', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/config/features')>()),
  get FEATURE_SITE_STEAM_ENABLED() {
    return features.steam;
  },
}));

vi.mock('@/lib/shared/steam-store-link', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/shared/steam-store-link')>()),
  getBundledSteamStoreLink: () => ({ href: steamUrl, source: 'bundled', updatedAt: null }),
  loadSteamStoreLink: async () => ({ href: steamUrl, source: 'canonical', updatedAt: null }),
}));

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

  beforeEach(() => {
    features.steam = false;
  });

  afterEach(() => {
    harness.cleanup();
  });

  it('reports the desktop, container, and documentation buttons through data-ga tags', async () => {
    const container = await renderHero();
    const byLabel = (label: string) =>
      container.querySelector<HTMLAnchorElement>(`a[data-ga-location="home_hero"][data-ga-label="${label}"]`) as HTMLAnchorElement;

    for (const label of ['openDesktopPage', 'openContainerPage', 'productDocs']) {
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

    expectOneEvent('download_click', {
      event_category: 'download',
      event_label: 'microsoftStore',
      link_location: 'home_hero',
      link_url: storeUrl,
    });
  });

  it('reports the Steam button once through the unified tracker, not through a tag', async () => {
    features.steam = true;
    const container = await renderHero();
    const steam = container.querySelector<HTMLAnchorElement>('a[data-steam-entry="site-home-hero"]');

    expect(steam).not.toBeNull();
    expect(steam?.hasAttribute('data-ga-category')).toBe(false);
    harness.click(steam as Element);

    expectOneEvent('download_click', {
      event_category: 'download',
      event_label: 'openSteamStore',
      link_location: 'hero_section_steam',
      link_url: steamUrl,
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
