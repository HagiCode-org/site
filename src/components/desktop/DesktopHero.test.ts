import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { DesktopVersionData } from '@/lib/shared/version-manager';
import {
  DesktopHeroActionBar,
  DesktopHeroSteamRow,
  convertVersionToPlatformDownloads,
  resolveDesktopHeroCurrentVersion,
  resolveDesktopHeroFallbackState,
  resolveDesktopHeroPrimaryActions,
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

const acceleratedOnlyVersion = {
  version: 'v1.2.5',
  assets: [
    {
      name: 'Hagicode.Desktop.Setup.1.2.5.exe',
      path: 'v1.2.5/Hagicode.Desktop.Setup.1.2.5.exe',
      size: 1048576,
      lastModified: null,
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

  it('always prefers the stable channel on the desktop page', () => {
    const data: DesktopVersionData = {
      latest: {
        version: 'v9.9.9',
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
        stable: {
          latest: {
            version: 'v1.2.3',
            assets: [],
          },
          all: [],
        },
        beta: {
          latest: {
            version: 'v1.3.0-beta.1',
            assets: [],
          },
          all: [],
        },
      },
    };

    expect(resolveDesktopHeroCurrentVersion(data)?.version).toBe('v1.2.3');
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

  it('projects separate accelerated and GitHub buttons from a single platform card', () => {
    const platformData = convertVersionToPlatformDownloads(multiSourceVersion);
    const windowsOption = platformData[0]?.options[0] ?? null;
    const actions = resolveDesktopHeroPrimaryActions(windowsOption);

    expect(actions.accelerated?.kind).toBe('official');
    expect(actions.accelerated?.url).toContain('desktop.dl.hagicode.com');
    expect(actions.github?.kind).toBe('github-release');
    expect(actions.github?.url).toContain('github.com');
    expect(actions.secondary.map((action) => action.kind)).toEqual(['torrent']);
  });

  it('keeps a single-source platform visible without fabricating the missing GitHub button', () => {
    const platformData = convertVersionToPlatformDownloads(acceleratedOnlyVersion);
    const windowsOption = platformData[0]?.options[0] ?? null;
    const actions = resolveDesktopHeroPrimaryActions(windowsOption);

    expect(platformData).toHaveLength(1);
    expect(actions.accelerated?.kind).toBe('legacy');
    expect(actions.github).toBeNull();
    expect(actions.secondary).toEqual([]);
  });

  it('renders the desktop card downloads as one inline action bar', () => {
    const platformData = convertVersionToPlatformDownloads(multiSourceVersion);
    const windowsOption = platformData[0]?.options[0] ?? null;
    const actions = resolveDesktopHeroPrimaryActions(windowsOption);
    const markup = renderToStaticMarkup(
      React.createElement(DesktopHeroActionBar, {
        isOpen: false,
        locale: 'en',
        toggleLabel: 'Select Windows downloads',
        visiblePrimaryActions: [
          {
            source: 'github',
            action: actions.github!,
            label: 'GitHub Download',
            ariaLabel: 'Install Hagicode Desktop (GitHub Download)',
          },
          {
            source: 'accelerated',
            action: actions.accelerated!,
            label: 'China',
            ariaLabel: 'Install Hagicode Desktop (China)',
          },
        ],
        onToggle: () => {},
        onPrimaryActionClick: () => {},
      }),
    );

    expect(markup).toContain('data-action-bar="platform"');
    expect(markup).toContain('data-segment-role="primary-actions"');
    expect(markup).toContain('data-segment-role="toggle"');
    expect(markup).toContain('More versions');
  });

  it('renders the Steam row ahead of the download table with the canonical store target', () => {
    const markup = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(DesktopHeroSteamRow, {
          locale: 'en',
          href: 'https://store.steampowered.com/app/4625540/Hagicode/',
        }),
        React.createElement(
          'table',
          { 'data-platform-table': 'desktop-downloads' },
          React.createElement('tbody', null, React.createElement('tr', null, React.createElement('td', null, 'Windows'))),
        ),
      ),
    );

    expect(markup).toContain('data-steam-row="desktop-downloads"');
    expect(markup).toContain('site-desktop-hero');
    expect(markup).toContain('https://store.steampowered.com/app/4625540/Hagicode/');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('<a');
    expect(markup).toContain('Click to open on Steam');
    expect(markup.indexOf('data-steam-row="desktop-downloads"')).toBeLessThan(
      markup.indexOf('data-platform-table="desktop-downloads"'),
    );
  });

  it('keeps the desktop downloads renderable inside a table layout', () => {
    const markup = renderToStaticMarkup(
      React.createElement('table', { 'data-platform-table': 'desktop-downloads' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Platform'),
            React.createElement('th', null, 'GitHub'),
            React.createElement('th', null, 'China'),
            React.createElement('th', null, 'More Downloads'),
          ),
        ),
        React.createElement('tbody', null,
          React.createElement('tr', { className: 'platform-row' },
            React.createElement('td', null, 'Windows'),
            React.createElement('td', null, 'github'),
            React.createElement('td', null, 'china'),
            React.createElement('td', null, 'more'),
          ),
        ),
      ),
    );

    expect(markup).toContain('data-platform-table="desktop-downloads"');
    expect(markup).toContain('More Downloads');
    expect(markup).toContain('<tr');
    expect(markup).toContain('<td');
  });
});
