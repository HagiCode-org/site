import { describe, expect, it, vi } from 'vitest';
import { WEBSITE_TRACKING_EVENTS, type WebsiteTrackingEventName } from './events';
import { createGoogleAnalyticsMirror } from './provider-ga';

function mirrorWith(gtag: unknown) {
  return createGoogleAnalyticsMirror(() => ({ gtag }));
}

describe('Google Analytics mirror', () => {
  it.each([
    [WEBSITE_TRACKING_EVENTS.downloadDesktop, 'download_click', 'download', 'downloadDesktop'],
    [WEBSITE_TRACKING_EVENTS.downloadDesktopWindows, 'download_click', 'download', 'downloadDesktopWindows'],
    [WEBSITE_TRACKING_EVENTS.downloadDesktopMacOS, 'download_click', 'download', 'downloadDesktopMacOS'],
    [WEBSITE_TRACKING_EVENTS.downloadDesktopLinux, 'download_click', 'download', 'downloadDesktopLinux'],
    [WEBSITE_TRACKING_EVENTS.openSteamStore, 'download_click', 'download', 'openSteamStore'],
    [WEBSITE_TRACKING_EVENTS.openDesktopPage, 'link_click', 'navigation', 'openDesktopPage'],
    [WEBSITE_TRACKING_EVENTS.openContainerPage, 'link_click', 'navigation', 'openContainerPage'],
    [
      WEBSITE_TRACKING_EVENTS.openContainerDeploymentGuide,
      'link_click',
      'navigation',
      'openContainerDeploymentGuide',
    ],
    [WEBSITE_TRACKING_EVENTS.openContainerSourceRepo, 'link_click', 'navigation', 'openContainerSourceRepo'],
  ] as Array<[WebsiteTrackingEventName, string, string, string]>)(
    'maps %s to %s with category %s and label %s',
    (eventName, action, category, label) => {
      const gtag = vi.fn();

      mirrorWith(gtag).mirror(eventName, { source: 'home-hero', url: 'https://example.com/target' });

      expect(gtag).toHaveBeenCalledTimes(1);
      expect(gtag).toHaveBeenCalledWith('event', action, {
        event_category: category,
        event_label: label,
        link_location: 'home_hero',
        link_url: 'https://example.com/target',
        transport_type: 'beacon',
      });
    },
  );

  it('normalizes hyphens in the source to underscores for the location', () => {
    const gtag = vi.fn();

    mirrorWith(gtag).mirror(WEBSITE_TRACKING_EVENTS.openContainerPage, { source: 'container-page-hero' });

    expect(gtag.mock.calls[0][2].link_location).toBe('container_page_hero');
  });

  it.each([undefined, {}, { source: '' }, { source: '   ' }])(
    'falls back to the website location for %j',
    (context) => {
      const gtag = vi.fn();

      mirrorWith(gtag).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop, context);

      expect(gtag.mock.calls[0][2].link_location).toBe('website');
    },
  );

  it.each([undefined, { source: 'navbar' }, { source: 'navbar', url: '' }])(
    'omits link_url when the destination is unknown (%j)',
    (context) => {
      const gtag = vi.fn();

      mirrorWith(gtag).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop, context);

      expect(gtag.mock.calls[0][2]).not.toHaveProperty('link_url');
    },
  );

  it('never sends link text or other fields', () => {
    const gtag = vi.fn();

    mirrorWith(gtag).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop, { source: 'navbar', url: 'https://example.com/' });

    expect(Object.keys(gtag.mock.calls[0][2]).sort()).toEqual([
      'event_category',
      'event_label',
      'link_location',
      'link_url',
      'transport_type',
    ]);
  });

  it.each([undefined, null, 'gtag', {}])('skips silently when gtag is %j', (gtag) => {
    expect(() => mirrorWith(gtag).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop)).not.toThrow();
  });

  it('skips silently when there is no browser window', () => {
    const mirror = createGoogleAnalyticsMirror(() => undefined);

    expect(() => mirror.mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop)).not.toThrow();
  });

  it('does not throw when gtag throws', () => {
    const gtag = vi.fn(() => {
      throw new Error('blocked');
    });

    expect(() => mirrorWith(gtag).mirror(WEBSITE_TRACKING_EVENTS.downloadDesktop)).not.toThrow();
    expect(gtag).toHaveBeenCalledTimes(1);
  });

  it('ignores event names missing from the catalog', () => {
    const gtag = vi.fn();

    mirrorWith(gtag).mirror('not_in_catalog' as WebsiteTrackingEventName);

    expect(gtag).not.toHaveBeenCalled();
  });
});
