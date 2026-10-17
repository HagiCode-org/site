// @vitest-environment jsdom

import React, { act } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { groupAssetsByPlatform } from '../../lib/shared/desktop-utils';
import { setupGaClickHarness, stubMatchMedia } from '@/lib/analytics/test-harness';
import InstallButton from './InstallButton';

vi.mock('../../lib/shared/desktop-utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/shared/desktop-utils')>()),
  // Avoid probing real download sources from the test.
  ensureDownloadSourceProbes: vi.fn(async () => ({})),
}));

vi.mock('../../lib/shared/version-manager', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/shared/version-manager')>()),
  getDesktopVersionData: vi.fn(() => new Promise(() => {})),
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
    const readMenuLinks = () => Array.from(document.body.querySelectorAll<HTMLAnchorElement>('[role="dialog"] a'));

    harness.click(toggle);
    expect(gtag).not.toHaveBeenCalled();
    const linkCount = readMenuLinks().length;
    expect(linkCount).toBeGreaterThan(0);
    let downloadCount = 0;

    for (let index = 0; index < linkCount; index += 1) {
      if (readMenuLinks().length === 0) {
        harness.click(toggle);
      }
      const link = readMenuLinks()[index];
      expect(link.hasAttribute('data-ga-category')).toBe(false);

      gtag.mockClear();
      harness.click(link);

      expect(gtag).toHaveBeenCalledTimes(1);
      const [, action, params] = gtag.mock.calls[0];
      if (link.hasAttribute('download')) {
        expect(link.getAttribute('aria-label')).toContain(link.textContent!.trim());
        downloadCount += 1;
        expect(action).toBe('download_click');
        expect(params).toMatchObject({ event_category: 'download', event_label: 'downloadDesktopWindows' });
      } else {
        expect(action).toBe('link_click');
        expect(params).toMatchObject({
          event_category: 'navigation',
          event_label: 'openDesktopPage',
          link_location: 'install_button_full_all_downloads',
        });
      }
      expect(params.link_url).toBe(link.getAttribute('href'));
    }

    expect(downloadCount).toBeGreaterThan(0);
  });

  it('shows the current platform first and switches packages without sending analytics', async () => {
    window.history.replaceState({}, '', '/?os=linux');
    const assets = [...version.assets, {
      name: 'Hagicode.Desktop-1.2.4.AppImage',
      path: 'v1.2.4/Hagicode.Desktop-1.2.4.AppImage',
      size: 1048576,
      lastModified: null,
    }];

    try {
      const container = await harness.render(
        <InstallButton locale="en" version={{ ...version, assets }} platforms={groupAssetsByPlatform(assets)} />,
      );
      harness.click(container.querySelector('[data-segment-role="toggle"]')!);
      const panel = document.querySelector('[role="dialog"]')!;
      const platforms = Array.from(panel.querySelectorAll<HTMLButtonElement>('button'));
      expect(platforms.map((button) => button.textContent)).toEqual(['Linux', 'Windows']);
      expect(platforms[0].getAttribute('aria-pressed')).toBe('true');
      expect(panel.querySelector('a[download]')?.getAttribute('href')).toContain('.AppImage');
      expect(panel.querySelector('a[href$=".exe"]')).toBeNull();

      harness.click(platforms[1]);
      expect(platforms[1].getAttribute('aria-pressed')).toBe('true');
      expect(panel.querySelector('a[href$=".AppImage"]')).toBeNull();
      expect(panel.querySelector('a[download]')?.getAttribute('href')).toContain('.exe');
      expect(gtag).not.toHaveBeenCalled();
    } finally {
      window.history.replaceState({}, '', '/');
    }
  });

  it('focuses the panel on open and restores the trigger on Escape', async () => {
    const container = await renderInstallButton();
    const toggle = container.querySelector<HTMLButtonElement>('[data-segment-role="toggle"]')!;
    harness.click(toggle);
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    });
    expect(document.activeElement).toBe(document.querySelector('[role="dialog"]'));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });

  it.each([
    { error: null, message: 'Versions are still loading' },
    { error: 'network down', message: 'Version data is temporarily unavailable' },
  ])('keeps the history recovery link available: $message', async ({ error, message }) => {
    const container = await harness.render(<InstallButton locale="en" versionError={error} />);
    harness.click(container.querySelector('[data-segment-role="toggle"]')!);
    const panel = document.querySelector('[role="dialog"]')!;
    expect(panel.querySelector('[role="status"]')?.textContent).toContain(message);
    expect(panel.querySelectorAll('button')).toHaveLength(0);
    expect(panel.querySelector('a')?.getAttribute('href')).toBe('https://index.hagicode.com/desktop/history/');
  });
});
