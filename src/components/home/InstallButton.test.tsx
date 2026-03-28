import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { DesktopVersionData } from '../../lib/shared/version-manager';
import { groupAssetsByPlatform } from '../../lib/shared/desktop-utils';
import InstallButton, {
  createInstallButtonPropSnapshot,
  getInstallButtonMenuState,
  resolveInstallButtonRuntimeSnapshot,
} from './InstallButton';

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
      channels: {
        stable: { latest: latestVersion, all: [latestVersion] },
        beta: { latest: latestVersion, all: [latestVersion] },
      },
    };

    const snapshot = resolveInstallButtonRuntimeSnapshot(data, 'stable');

    expect(snapshot.platforms).toBe(platformGroups);
    expect(getInstallButtonMenuState(snapshot, snapshot.platforms.length)).toEqual({
      mode: 'ready',
      hasDownloads: true,
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
    expect(markup).not.toContain('Open Desktop page');
  });

  it('keeps the fallback CTA and dropdown trigger available when runtime data is unavailable', () => {
    const markup = renderToStaticMarkup(
      <InstallButton locale="en" versionError="network down" />,
    );

    expect(markup).toContain('data-runtime-state="fatal"');
    expect(markup).toContain('Open Desktop page');
    expect(markup).toContain('network down');
  });
});
