import { describe, expect, it } from 'vitest';

import type { DesktopVersionData } from '@/lib/shared/version-manager';
import {
  convertVersionToPlatformDownloads,
  resolveDesktopHeroFallbackState,
  resolveDesktopHeroPrimaryTarget,
} from './DesktopHero';

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

describe('DesktopHero fallback contract', () => {
  it('returns the Index history redirect target for terminal failures', () => {
    const data: DesktopVersionData = {
      latest: null,
      platforms: [],
      error: 'Failed to load desktop versions',
      source: null,
      status: 'fatal',
      attempts: [
        { source: 'primary', error: 'primary down' },
      ],
      fallbackTarget: 'https://index.hagicode.com/desktop/history/',
      failedAttemptSummary: 'primary=primary down',
      channels: {
        stable: { latest: null, all: [] },
        beta: { latest: null, all: [] },
      },
    };

    const result = resolveDesktopHeroFallbackState('en', data, data.error, false);

    expect(result).toEqual({
      fallbackTarget: 'https://index.hagicode.com/desktop/history/',
      shouldAutoRedirect: true,
      message: 'Unable to load desktop packages here. Redirecting to the Index version history...',
      detail: 'primary=primary down',
    });
  });

  it('returns null when a downloadable version is still available', () => {
    const data: DesktopVersionData = {
      latest: {
        version: 'v1.2.3',
        assets: [],
      },
      platforms: [],
      error: null,
      source: 'primary',
      status: 'ready',
      attempts: [],
      fallbackTarget: null,
      failedAttemptSummary: null,
      channels: {
        stable: { latest: null, all: [] },
        beta: { latest: null, all: [] },
      },
    };

    expect(resolveDesktopHeroFallbackState('zh-CN', data, null, true)).toBeNull();
  });

  it('keeps one Windows option while exposing official, GitHub, and torrent actions', () => {
    const platformData = convertVersionToPlatformDownloads(multiSourceVersion);
    const windowsOption = platformData[0]?.options[0];

    expect(platformData).toHaveLength(1);
    expect(windowsOption?.sourceActions.map((action) => action.kind)).toEqual([
      'official',
      'github-release',
      'torrent',
    ]);
  });

  it('uses GitHub as the primary action only when the probe is reachable', () => {
    const platformData = convertVersionToPlatformDownloads(multiSourceVersion);
    const windowsOption = platformData[0]?.options[0] ?? null;

    const reachable = resolveDesktopHeroPrimaryTarget(windowsOption, { 'github-release': 'reachable' });
    const unreachable = resolveDesktopHeroPrimaryTarget(windowsOption, { 'github-release': 'unreachable' });

    expect(reachable.action?.kind).toBe('github-release');
    expect(reachable.href).toContain('github.com');
    expect(unreachable.action?.kind).toBe('official');
    expect(unreachable.href).toContain('desktop.dl.hagicode.com');
  });
});
