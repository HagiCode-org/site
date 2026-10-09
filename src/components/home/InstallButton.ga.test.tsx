// @vitest-environment jsdom

import React from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { groupAssetsByPlatform } from '../../lib/shared/desktop-utils';
import { setupGaClickHarness, stubMatchMedia } from '@/lib/analytics/test-harness';
import InstallButton from './InstallButton';

vi.mock('../../lib/shared/desktop-utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/shared/desktop-utils')>()),
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
        {
          kind: 'github-release' as const,
          label: 'GitHub Release',
          url: 'https://github.com/HagiCode-org/releases/download/v1.2.4/Hagicode.Desktop.Setup.1.2.4.exe',
        },
      ],
    },
  ],
};

async function renderInstallButton() {
  return harness.render(
    <InstallButton locale="en" variant="full" version={version} platforms={groupAssetsByPlatform(version.assets)} />,
  );
}

describe('InstallButton Google Analytics events', () => {
  beforeAll(() => {
    stubMatchMedia();
  });

  afterEach(() => {
    harness.cleanup();
  });

  it('reports each primary download button once through the unified tracker, not through a tag', async () => {
    const container = await renderInstallButton();
    const downloads = Array.from(container.querySelectorAll<HTMLAnchorElement>('[data-segment-role="primary-actions"] a'));

    expect(downloads.length).toBeGreaterThanOrEqual(2);
    for (const link of downloads) {
      expect(link.hasAttribute('data-ga-category')).toBe(false);

      gtag.mockClear();
      harness.click(link);

      expect(gtag).toHaveBeenCalledTimes(1);
      expect(gtag).toHaveBeenCalledWith('event', 'download_click', {
        event_category: 'download',
        event_label: 'downloadDesktopWindows',
        link_location: expect.stringMatching(/^install_button_full_primary_/),
        link_url: link.getAttribute('href'),
        transport_type: 'beacon',
      });
    }
  });

  it('sends nothing for the dropdown toggle and reports each menu link once', async () => {
    const container = await renderInstallButton();
    const toggle = container.querySelector('[data-segment-role="toggle"]') as Element;
    // The menu renders into a portal on the document body and closes after a link click.
    const readMenuLinks = () => Array.from(document.body.querySelectorAll<HTMLAnchorElement>('[role="menu"] a'));

    harness.click(toggle);
    expect(gtag).not.toHaveBeenCalled();
    const linkCount = readMenuLinks().length;
    expect(linkCount).toBeGreaterThan(0);
    const seen = { container: 0, download: 0 };

    for (let index = 0; index < linkCount; index += 1) {
      if (readMenuLinks().length === 0) {
        harness.click(toggle);
      }
      const link = readMenuLinks()[index];
      const isContainerLink = link.getAttribute('href')?.includes('/container/') ?? false;
      expect(link.hasAttribute('data-ga-category')).toBe(false);

      gtag.mockClear();
      harness.click(link);

      expect(gtag).toHaveBeenCalledTimes(1);
      const [, action, params] = gtag.mock.calls[0];
      if (isContainerLink) {
        seen.container += 1;
        expect(action).toBe('link_click');
        expect(params).toMatchObject({ event_category: 'navigation', event_label: 'openContainerPage' });
      } else {
        seen.download += 1;
        expect(action).toBe('download_click');
        expect(params).toMatchObject({ event_category: 'download', event_label: 'downloadDesktopWindows' });
      }
      expect(params.link_url).toBe(link.getAttribute('href'));
    }

    expect(seen.container).toBeGreaterThan(0);
    expect(seen.download).toBeGreaterThan(0);
  });
});
