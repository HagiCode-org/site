import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import type { DesktopVersionData } from '../../lib/shared/version-manager';
import {
  collectDownloadSourceProbeTargets,
  ensureDownloadSourceProbes,
  groupAssetsByPlatform,
  resetDownloadSourceProbeCache,
} from '../../lib/shared/desktop-utils';
import InstallButton, {
  convertPlatformGroups,
  createInstallButtonPropSnapshot,
  getInstallButtonMenuState,
  resolveInstallButtonPrimaryTarget,
  resolveInstallButtonRuntimeSnapshot,
} from './InstallButton';

const fallbackUrl = 'https://index.hagicode.com/desktop/history/';

const latestVersion = {
  version: 'v1.2.3',
  assets: [
    {
      name: 'Hagicode.Desktop.Setup.1.2.3.exe',
      path: 'v1.2.3/Hagicode.Desktop.Setup.1.2.3.exe',
      size: 1048576,
      lastModified: null,
    },
    {
      name: 'Hagicode.Desktop-1.2.3-arm64.dmg',
      path: 'v1.2.3/Hagicode.Desktop-1.2.3-arm64.dmg',
      size: 1048576,
      lastModified: null,
    },
    {
      name: 'Hagicode.Desktop-1.2.3.AppImage',
      path: 'v1.2.3/Hagicode.Desktop-1.2.3.AppImage',
      size: 1048576,
      lastModified: null,
    },
  ],
};

const platformGroups = groupAssetsByPlatform(latestVersion.assets);

const multiSourceVersion = {
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
          kind: 'official',
          label: 'Official Download',
          url: 'https://desktop.dl.hagicode.com/v1.2.4/Hagicode.Desktop.Setup.1.2.4.exe',
          primary: true,
        },
        {
          kind: 'github-release',
          label: 'GitHub Release',
          url: 'https://github.com/HagiCode-org/releases/download/v1.2.4/Hagicode.Desktop.Setup.1.2.4.exe',
        },
      ],
    },
  ],
};

describe('InstallButton runtime state helpers', () => {
  it('treats an unresolved runtime state as loading instead of frozen', () => {
    const snapshot = createInstallButtonPropSnapshot({
      version: null,
      platforms: [],
      versionError: null,
    });

    expect(getInstallButtonMenuState(snapshot, 0)).toEqual({
      mode: 'loading',
      hasDownloads: false,
    });
  });

  it('keeps ready runtime data downloadable by reusing precomputed platform groups', () => {
    const data: DesktopVersionData = {
      latest: latestVersion,
      platforms: platformGroups,
      error: null,
      source: 'primary',
      status: 'ready',
      attempts: [],
      fallbackTarget: null,
      failedAttemptSummary: null,
      channels: {
        stable: { latest: latestVersion, all: [latestVersion] },
        beta: { latest: latestVersion, all: [latestVersion] },
      },
    };

    const snapshot = resolveInstallButtonRuntimeSnapshot(data, 'stable');

    expect(snapshot.platforms).toBe(platformGroups);
    expect(snapshot.fallbackTarget).toBeNull();
    expect(getInstallButtonMenuState(snapshot, snapshot.platforms.length)).toEqual({
      mode: 'ready',
      hasDownloads: true,
    });
  });

  it('preserves the Index history fallback contract for fatal runtime data', () => {
    const snapshot = createInstallButtonPropSnapshot({
      version: null,
      platforms: [],
      versionError: 'network down',
    });

    expect(snapshot.status).toBe('fatal');
    expect(snapshot.fallbackTarget).toBe(fallbackUrl);
    expect(snapshot.failedAttemptSummary).toBe('network down');
    expect(getInstallButtonMenuState(snapshot, 0)).toEqual({
      mode: 'fatal',
      hasDownloads: false,
    });
  });
});

describe('InstallButton markup', () => {
  it('renders a responsive loading trigger while runtime data is pending', () => {
    const markup = renderToStaticMarkup(<InstallButton locale="en" />);

    expect(markup).toContain('data-runtime-state="loading"');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('Install now');
    expect(markup).toContain('Fetching latest version...');
  });

  it('renders the ready state from precomputed download data', () => {
    const markup = renderToStaticMarkup(
      <InstallButton
        locale="en"
        version={latestVersion}
        platforms={platformGroups}
      />,
    );

    expect(markup).toContain('data-runtime-state="ready"');
    expect(markup).toContain('Hagicode.Desktop.Setup.1.2.3.exe');
    expect(markup).not.toContain('Open version history');
  });

  it('renders compact installs as one segmented action group', () => {
    const markup = renderToStaticMarkup(
      <InstallButton
        locale="en"
        variant="compact"
        version={multiSourceVersion}
        platforms={groupAssetsByPlatform(multiSourceVersion.assets)}
      />,
    );

    expect(markup).toContain('data-action-group="segmented"');
    expect(markup).toContain('data-segment-role="primary-actions"');
    expect(markup).toContain('data-segment-role="toggle"');
    expect(markup).toContain('>GitHub<');
    expect(markup).toContain('>China<');
  });

  it('adds a direct Steam shortcut to the compact install cluster without removing existing actions', () => {
    const markup = renderToStaticMarkup(
      <InstallButton
        locale="en"
        variant="compact"
        version={multiSourceVersion}
        platforms={groupAssetsByPlatform(multiSourceVersion.assets)}
      />,
    );

    expect(markup).toContain('data-steam-entry="site-header-install"');
    expect(markup).toContain('https://store.steampowered.com/app/4625540/Hagicode/');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('>Steam<');
    expect(markup).toContain('data-steam-icon="true"');
    expect(markup).toContain('>GitHub<');
    expect(markup).toContain('>China<');
  });

  it('projects multi-source actions without duplicating the asset row contract', () => {
    const platformData = convertPlatformGroups(groupAssetsByPlatform(multiSourceVersion.assets));
    const windowsOption = platformData[0]?.options[0];

    expect(windowsOption?.sourceActions.map((action) => action.kind)).toEqual([
      'official',
      'github-release',
      'torrent',
    ]);
  });

  it('prefers GitHub when the probe is reachable and falls back to official when it is not', () => {
    const platformData = convertPlatformGroups(groupAssetsByPlatform(multiSourceVersion.assets));

    const reachable = resolveInstallButtonPrimaryTarget(
      platformData,
      { 'github-release': 'reachable' },
      'windows',
      '/desktop/',
    );
    const unreachable = resolveInstallButtonPrimaryTarget(
      platformData,
      { 'github-release': 'unreachable' },
      'windows',
      '/desktop/',
    );

    expect(reachable.action?.kind).toBe('github-release');
    expect(reachable.href).toContain('github.com');
    expect(unreachable.action?.kind).toBe('official');
    expect(unreachable.href).toContain('desktop.dl.hagicode.com');
  });

  it('keeps legacy single-source assets downloadable', () => {
    const legacyPlatformData = convertPlatformGroups(platformGroups);
    const primary = resolveInstallButtonPrimaryTarget(
      legacyPlatformData,
      { legacy: 'unreachable' },
      'windows',
      '/desktop/',
    );

    expect(primary.action?.kind).toBe('legacy');
    expect(primary.href).toContain('desktop.dl.hagicode.com');
  });

  it('keeps the fallback CTA and dropdown trigger available when runtime data is unavailable', () => {
    const markup = renderToStaticMarkup(
      <InstallButton locale="en" versionError="network down" />,
    );

    expect(markup).toContain('data-runtime-state="fatal"');
    expect(markup).toContain('Open version history');
    expect(markup).toContain(fallbackUrl);
    expect(markup).toContain('network down');
  });
});

describe('Download source probe cache', () => {
  it('reuses the page-lifecycle probe result after the first success', async () => {
    resetDownloadSourceProbeCache();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('window', {
      setTimeout,
      clearTimeout,
    });

    const probeTargets = collectDownloadSourceProbeTargets(platformGroups);

    await expect(ensureDownloadSourceProbes(probeTargets)).resolves.toEqual({
      legacy: 'reachable',
    });
    await expect(ensureDownloadSourceProbes(probeTargets)).resolves.toEqual({
      legacy: 'reachable',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it('probes multiple source hosts independently and returns keyed states', async () => {
    resetDownloadSourceProbeCache();
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url === 'https://desktop.dl.hagicode.com/favicon.ico') {
        return { ok: true };
      }

      if (url === 'https://github.com/favicon.ico') {
        throw new Error('github blocked');
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('window', {
      setTimeout,
      clearTimeout,
    });

    const probeTargets = collectDownloadSourceProbeTargets(groupAssetsByPlatform(multiSourceVersion.assets));

    await expect(ensureDownloadSourceProbes(probeTargets)).resolves.toEqual({
      official: 'reachable',
      'github-release': 'unreachable',
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://desktop.dl.hagicode.com/favicon.ico',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://github.com/favicon.ico',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    vi.unstubAllGlobals();
  });
});
