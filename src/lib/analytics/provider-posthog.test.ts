import { describe, expect, it, vi } from 'vitest';
import { WEBSITE_TRACKING_EVENTS, type WebsiteTrackingEventName } from './events';
import { createPostHogMirror } from './provider-posthog';

function fakePostHog(overrides: Record<string, unknown> = {}) {
  return {
    __loaded: true,
    capture: vi.fn(),
    has_opted_out_capturing: vi.fn(() => false),
    ...overrides,
  };
}

function mirrorWith(posthog: unknown) {
  return createPostHogMirror(() => ({ posthog: posthog as never }));
}

describe('PostHog mirror', () => {
  it.each([
    [WEBSITE_TRACKING_EVENTS.downloadDesktop, { source: 'navbar' }],
    [WEBSITE_TRACKING_EVENTS.openDesktopPage, { source: 'install_options_desktop' }],
    [WEBSITE_TRACKING_EVENTS.openSteamStore, { source: 'hero_section_steam' }],
    [WEBSITE_TRACKING_EVENTS.downloadDesktopWindows, { source: 'desktop_hero', platform: 'windows' }],
    [WEBSITE_TRACKING_EVENTS.downloadDesktopMacOS, { source: 'desktop_hero', platform: 'macos' }],
    [WEBSITE_TRACKING_EVENTS.downloadDesktopLinux, { source: 'desktop_hero', platform: 'linux' }],
  ] as Array<[WebsiteTrackingEventName, Record<string, string>]>)(
    'sends %s under its catalog name with source and platform only',
    (eventName, expectedProperties) => {
      const posthog = fakePostHog();

      mirrorWith(posthog).mirror(eventName, { source: expectedProperties.source, url: 'https://example.com/target' });

      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith(eventName, expectedProperties);
    },
  );

  it('normalizes the source the same way the GA location is normalized', () => {
    const posthog = fakePostHog();

    mirrorWith(posthog).mirror(WEBSITE_TRACKING_EVENTS.openDesktopPage, { source: '  install-options-desktop ' });

    expect(posthog.capture).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openDesktopPage, {
      source: 'install_options_desktop',
    });
  });

  it.each([undefined, {}, { source: '' }, { source: '   ' }])(
    'falls back to the website source for %j',
    (context) => {
      const posthog = fakePostHog();

      mirrorWith(posthog).mirror(WEBSITE_TRACKING_EVENTS.openSteamStore, context);

      expect(posthog.capture).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openSteamStore, { source: 'website' });
    },
  );

  it('never sends the link URL', () => {
    const posthog = fakePostHog();

    mirrorWith(posthog).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktopLinux, {
      source: 'navbar',
      url: 'https://example.com/private?token=abc',
    });

    const sentProperties = posthog.capture.mock.calls[0][1] as Record<string, unknown>;
    expect(Object.keys(sentProperties).sort()).toEqual(['platform', 'source']);
    expect(JSON.stringify(sentProperties)).not.toContain('example.com');
  });

  it('sends nothing and does not throw when there is no PostHog', () => {
    expect(() => createPostHogMirror(() => undefined).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop)).not.toThrow();
    expect(() => mirrorWith(undefined).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop)).not.toThrow();
    expect(() => mirrorWith(null).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop)).not.toThrow();
  });

  it('sends nothing after the visitor opted out', () => {
    const posthog = fakePostHog({ has_opted_out_capturing: vi.fn(() => true) });

    mirrorWith(posthog).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop, { source: 'navbar' });

    expect(posthog.has_opted_out_capturing).toHaveBeenCalledTimes(1);
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it('queues through the stub without checking opt-out while the SDK is still loading', () => {
    const posthog = fakePostHog({ __loaded: false });

    mirrorWith(posthog).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop, { source: 'navbar' });

    expect(posthog.capture).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.downloadDesktop, { source: 'navbar' });
    expect(posthog.has_opted_out_capturing).not.toHaveBeenCalled();
  });

  it('does not throw when capture throws', () => {
    const posthog = fakePostHog({
      capture: vi.fn(() => {
        throw new Error('blocked');
      }),
    });

    expect(() => mirrorWith(posthog).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop)).not.toThrow();
    expect(posthog.capture).toHaveBeenCalledTimes(1);
  });

  it('ignores event names missing from the catalog', () => {
    const posthog = fakePostHog();

    mirrorWith(posthog).mirror('not_in_catalog' as WebsiteTrackingEventName);

    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
