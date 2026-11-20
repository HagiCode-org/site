// @vitest-environment jsdom

import React from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import HeroSection from '@/components/home/HeroSection';
import InstallButton from '@/components/home/InstallButton';
import { DesktopHeroWindowsStoreRow } from '@/components/desktop/DesktopHero';
import { getHomepageInteractiveCopy } from '@/lib/homepage-runtime-copy';
import { groupAssetsByPlatform } from '@/lib/shared/desktop-utils';
import { setupGaClickHarness, stubMatchMedia } from '@/lib/analytics/test-harness';

// Store controls are guarded by their destination host: the Microsoft Store listing.
const STORE_HOSTS = new Set(['apps.microsoft.com']);
const storeUrl = 'https://apps.microsoft.com/detail/9N3PM0N3SVDW';

vi.mock('@/lib/shared/windows-store-link', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/shared/windows-store-link')>()),
  getBundledWindowsStoreLink: () => ({ href: storeUrl, source: 'bundled', updatedAt: null }),
  loadWindowsStoreLink: async () => ({ href: storeUrl, source: 'canonical', updatedAt: null }),
}));

vi.mock('@/lib/shared/desktop-utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/shared/desktop-utils')>()),
  // Avoid probing real download sources from the test.
  ensureDownloadSourceProbes: vi.fn(async () => ({})),
}));

const harness = setupGaClickHarness();
const { gtag } = harness;

const version = {
  version: 'v1.2.4',
  assets: [
    {
      name: 'Hagicode.Desktop.Setup.1.2.4.exe',
      path: 'v1.2.4/Hagicode.Desktop.Setup.1.2.4.exe',
      size: 1048576,
      lastModified: null,
      torrentUrl: 'v1.2.4/Hagicode.Desktop.Setup.1.2.4.exe.torrent',
      downloadSources: [
        {
          kind: 'official' as const,
          label: 'Official Download',
          url: 'https://desktop.dl.hagicode.com/v1.2.4/Hagicode.Desktop.Setup.1.2.4.exe',
          primary: true,
        },
      ],
    },
  ],
};

type GaCall = [string, string, Record<string, unknown>];

function isStoreControl(element: Element): boolean {
  if (element.tagName.toLowerCase() === 'ms-store-badge') {
    return true;
  }

  const href = element.getAttribute('href');
  if (!href) {
    return false;
  }

  try {
    return STORE_HOSTS.has(new URL(href, 'https://hagicode.com').hostname);
  } catch {
    return false;
  }
}

function describeControl(element: Element): string {
  const label = element.getAttribute('data-ga-label') ?? element.getAttribute('data-track-event') ?? element.tagName;
  return `${element.tagName.toLowerCase()} (${label})`;
}

/**
 * Returns one entry per rule the Store control breaks; an empty array means it is wired correctly.
 * Rules: never wired to both mechanisms, declared as category `store`, one click sends at most one
 * event, and that event is `store_visit` in category `store` (or nothing, for an untracked control).
 */
function storeControlViolations(element: Element): string[] {
  const violations: string[] = [];
  const category = element.getAttribute('data-ga-category');
  const hasDeclarativeTag = category !== null || element.hasAttribute('data-ga-label');

  if (hasDeclarativeTag && element.hasAttribute('data-track-event')) {
    violations.push('wired to both the unified tracker and data-ga tags');
  }
  if (category !== null && category !== 'store') {
    violations.push(`declared as category ${category}`);
  }

  gtag.mockClear();
  harness.click(element);
  const calls = gtag.mock.calls as GaCall[];

  if (calls.length > 1) {
    violations.push(`one click sent ${calls.length} events`);
  }
  for (const [, action, params] of calls) {
    if (action === 'download_click') {
      violations.push('reports download_click');
    } else if (action !== 'store_visit' || params.event_category !== 'store') {
      violations.push(`reports ${action} in category ${String(params.event_category)}`);
    }
  }

  return violations;
}

/** Audits every Store control in the container. Returns the controls found and one line per violation. */
function auditStoreControls(container: Element) {
  const controls = Array.from(container.querySelectorAll('a, ms-store-badge')).filter(isStoreControl);
  const problems = controls.flatMap((element) =>
    storeControlViolations(element).map((violation) => `${describeControl(element)}: ${violation}`),
  );

  return { controlCount: controls.length, problems };
}

describe('Store control wiring guard', () => {
  beforeAll(() => {
    stubMatchMedia();
  });

  afterEach(() => {
    harness.cleanup();
  });

  it('fails a Store control declared as a download', async () => {
    const container = await harness.render(
      <a
        href={storeUrl}
        data-ga-category="download"
        data-ga-label="microsoftStore"
        data-ga-location="fixture"
      >
        Store
      </a>,
    );

    const { controlCount, problems } = auditStoreControls(container);

    expect(controlCount).toBe(1);
    expect(problems).toEqual(
      expect.arrayContaining([
        'a (microsoftStore): declared as category download',
        'a (microsoftStore): reports download_click',
      ]),
    );
  });

  it('fails a Store control wired to both the unified tracker and a data-ga tag', async () => {
    const container = await harness.render(
      <a
        href={storeUrl}
        data-track-event="open_desktop_page"
        data-ga-category="store"
        data-ga-label="microsoftStore"
        data-ga-location="fixture"
      >
        Store
      </a>,
    );

    const { problems } = auditStoreControls(container);

    expect(problems).toEqual(
      expect.arrayContaining([
        'a (microsoftStore): wired to both the unified tracker and data-ga tags',
        'a (microsoftStore): one click sent 2 events',
      ]),
    );
  });

  it.each([
    ['the hero Store badge', () => (
      <HeroSection
        locale="en-US"
        copy={getHomepageInteractiveCopy('en-US').hero}
        workflowBoardCopy={getHomepageInteractiveCopy('en-US').workflowBoard}
        agentChoices={[]}
      />
    )],
    ['the compact install button shortcuts', () => (
      <InstallButton locale="en" variant="compact" version={version} platforms={groupAssetsByPlatform(version.assets)} />
    )],
    ['the desktop Windows Store row', () => <DesktopHeroWindowsStoreRow locale="en" href={storeUrl} />],
  ])('passes on the real components: %s', async (_name, renderSurface) => {
    const container = await harness.render(renderSurface());

    const { controlCount, problems } = auditStoreControls(container);

    expect(controlCount).toBeGreaterThan(0);
    expect(problems).toEqual([]);
  });
});
