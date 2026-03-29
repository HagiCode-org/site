import { describe, expect, it } from 'vitest';

import type { DesktopVersionData } from '@/lib/shared/version-manager';
import { resolveDesktopHeroFallbackState } from './DesktopHero';

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
});
