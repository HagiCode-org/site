import { describe, expect, it, vi } from 'vitest';
import { WEBSITE_TRACKING_EVENTS } from './events';
import { createWebsiteAnalyticsRuntime, notifyWebsiteAnalyticsReady } from './tracker';
import { createGoogleAnalyticsMirror } from './provider-ga';
import { createPostHogMirror } from './provider-posthog';

function createEventTarget() {
  const listeners = new Map<string, Array<() => void>>();

  return {
    addEventListener(type: string, listener: () => void) {
      const currentListeners = listeners.get(type) ?? [];
      currentListeners.push(listener);
      listeners.set(type, currentListeners);
    },
    dispatchEvent(event: Event) {
      const currentListeners = listeners.get(event.type) ?? [];
      currentListeners.forEach((listener) => listener());
      return true;
    },
  };
}

describe('website analytics runtime', () => {
  it('dispatches events through the analytics provider when the SDK is ready', () => {
    const sentEvents: string[] = [];
    const runtime = createWebsiteAnalyticsRuntime({
      provider: {
        send(eventName) {
          sentEvents.push(eventName);
          return true;
        },
      },
      eventTarget: createEventTarget(),
    });

    const result = runtime.trackEvent(WEBSITE_TRACKING_EVENTS.downloadDesktop);

    expect(result).toBe('sent');
    expect(sentEvents).toEqual([WEBSITE_TRACKING_EVENTS.downloadDesktop]);
    expect(runtime.getPendingCount()).toBe(0);
  });

  it('queues events until the analytics provider becomes ready and then flushes them', () => {
    const sentEvents: string[] = [];
    let ready = false;
    const eventTarget = createEventTarget();
    const runtime = createWebsiteAnalyticsRuntime({
      provider: {
        send(eventName) {
          if (!ready) {
            return false;
          }

          sentEvents.push(eventName);
          return true;
        },
      },
      eventTarget,
    });

    runtime.initialize();

    const firstResult = runtime.trackEvent(WEBSITE_TRACKING_EVENTS.openDesktopPage);
    const secondResult = runtime.trackEvent(WEBSITE_TRACKING_EVENTS.openSteamStore);

    expect(firstResult).toBe('queued');
    expect(secondResult).toBe('queued');
    expect(runtime.getPendingCount()).toBe(2);

    ready = true;
    notifyWebsiteAnalyticsReady(eventTarget as never);

    expect(sentEvents).toEqual([
      WEBSITE_TRACKING_EVENTS.openDesktopPage,
      WEBSITE_TRACKING_EVENTS.openSteamStore,
    ]);
    expect(runtime.getPendingCount()).toBe(0);
  });

  it('falls back to noop when there is no browser event target available', () => {
    const runtime = createWebsiteAnalyticsRuntime({
      provider: {
        send() {
          return false;
        },
      },
    });

    const result = runtime.trackEvent(WEBSITE_TRACKING_EVENTS.downloadDesktopWindows);

    expect(result).toBe('noop');
    expect(runtime.getPendingCount()).toBe(0);
  });

  describe('Google Analytics mirror', () => {
    function createMirror() {
      return { mirror: vi.fn() };
    }

    it('mirrors each tracked event once with its context', () => {
      const mirror = createMirror();
      const runtime = createWebsiteAnalyticsRuntime({
        provider: { send: () => true },
        eventTarget: createEventTarget(),
        mirror,
      });

      runtime.trackEvent(WEBSITE_TRACKING_EVENTS.openDesktopPage, { source: 'home-hero', url: '/desktop/' });

      expect(mirror.mirror).toHaveBeenCalledTimes(1);
      expect(mirror.mirror).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openDesktopPage, {
        source: 'home-hero',
        url: '/desktop/',
      });
    });

    it('mirrors immediately while 51LA is not ready and does not mirror again on flush', () => {
      const mirror = createMirror();
      const sentEvents: string[] = [];
      let ready = false;
      const eventTarget = createEventTarget();
      const runtime = createWebsiteAnalyticsRuntime({
        provider: {
          send(eventName) {
            if (!ready) {
              return false;
            }

            sentEvents.push(eventName);
            return true;
          },
        },
        eventTarget,
        mirror,
      });
      runtime.initialize();

      expect(runtime.trackEvent(WEBSITE_TRACKING_EVENTS.downloadDesktop)).toBe('queued');
      expect(mirror.mirror).toHaveBeenCalledTimes(1);

      ready = true;
      notifyWebsiteAnalyticsReady(eventTarget as never);
      runtime.flushPendingEvents();

      expect(sentEvents).toEqual([WEBSITE_TRACKING_EVENTS.downloadDesktop]);
      expect(mirror.mirror).toHaveBeenCalledTimes(1);
    });

    it('mirrors even when there is no browser event target', () => {
      const mirror = createMirror();
      const runtime = createWebsiteAnalyticsRuntime({ provider: { send: () => false }, mirror });

      expect(runtime.trackEvent(WEBSITE_TRACKING_EVENTS.downloadDesktop)).toBe('noop');
      expect(mirror.mirror).toHaveBeenCalledTimes(1);
    });

    it('does not change what 51LA receives', () => {
      const send = vi.fn(() => true);
      const runtime = createWebsiteAnalyticsRuntime({
        provider: { send },
        eventTarget: createEventTarget(),
        mirror: createMirror(),
      });

      runtime.trackEvent(WEBSITE_TRACKING_EVENTS.openDesktopPage, { source: 'hero' });

      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openDesktopPage, { source: 'hero' });
    });
  });

  describe('ordered mirrors', () => {
    const events = [
      { name: WEBSITE_TRACKING_EVENTS.downloadDesktop, context: { source: 'navbar', url: '/download/' } },
      { name: WEBSITE_TRACKING_EVENTS.openDesktopPage, context: { source: 'install-options-desktop', url: '/desktop/' } },
      { name: WEBSITE_TRACKING_EVENTS.downloadDesktopWindows, context: { source: 'desktop_hero', url: 'https://example.com/a.exe' } },
      { name: WEBSITE_TRACKING_EVENTS.openSteamStore, context: { source: 'hero-section-steam' } },
    ] as const;

    /** Real GA mirror over a recording gtag, so GA call arguments are compared exactly. */
    function gaRecorder() {
      const gtag = vi.fn();
      return { gtag, mirror: createGoogleAnalyticsMirror(() => ({ gtag })) };
    }

    it('keeps GA and 51LA call sequences and arguments identical with and without the PostHog mirror', () => {
      const withoutPostHog = gaRecorder();
      const laWithout = vi.fn(() => true);
      const runtimeWithout = createWebsiteAnalyticsRuntime({
        provider: { send: laWithout },
        eventTarget: createEventTarget(),
        mirrors: [withoutPostHog.mirror],
      });

      const withPostHog = gaRecorder();
      const laWith = vi.fn(() => true);
      const posthog = { __loaded: true, capture: vi.fn(), has_opted_out_capturing: () => false };
      const runtimeWith = createWebsiteAnalyticsRuntime({
        provider: { send: laWith },
        eventTarget: createEventTarget(),
        mirrors: [withPostHog.mirror, createPostHogMirror(() => ({ posthog }))],
      });

      for (const event of events) {
        runtimeWithout.trackEvent(event.name, event.context);
        runtimeWith.trackEvent(event.name, event.context);
      }

      expect(withPostHog.gtag.mock.calls).toEqual(withoutPostHog.gtag.mock.calls);
      expect(withPostHog.gtag.mock.calls.length).toBe(events.length);
      expect(laWith.mock.calls).toEqual(laWithout.mock.calls);
      expect(laWith.mock.calls.length).toBe(events.length);
      // The PostHog mirror did receive every event, so the comparison is not vacuous.
      expect(posthog.capture).toHaveBeenCalledTimes(events.length);
    });

    it('does not stop GA or 51LA when the PostHog mirror throws', () => {
      const ga = gaRecorder();
      const throwingPostHog = {
        mirror: vi.fn(() => {
          throw new Error('posthog down');
        }),
      };
      const laSend = vi.fn(() => true);
      const runtime = createWebsiteAnalyticsRuntime({
        provider: { send: laSend },
        eventTarget: createEventTarget(),
        mirrors: [ga.mirror, throwingPostHog],
      });

      expect(() => runtime.trackEvent(WEBSITE_TRACKING_EVENTS.downloadDesktop, { source: 'navbar' })).not.toThrow();

      expect(throwingPostHog.mirror).toHaveBeenCalledTimes(1);
      expect(ga.gtag).toHaveBeenCalledTimes(1);
      expect(laSend).toHaveBeenCalledTimes(1);
    });

    it('still runs a mirror that comes after a throwing mirror', () => {
      const after = { mirror: vi.fn() };
      const runtime = createWebsiteAnalyticsRuntime({
        provider: { send: () => true },
        mirrors: [
          {
            mirror: () => {
              throw new Error('first mirror failed');
            },
          },
          after,
        ],
      });

      runtime.trackEvent(WEBSITE_TRACKING_EVENTS.openDesktopPage, { source: 'hero' });

      expect(after.mirror).toHaveBeenCalledTimes(1);
    });

    it('delivers a queued-then-flushed event to each mirror exactly once', () => {
      const ga = { mirror: vi.fn() };
      const posthog = { mirror: vi.fn() };
      let ready = false;
      const sent: string[] = [];
      const eventTarget = createEventTarget();
      const runtime = createWebsiteAnalyticsRuntime({
        provider: {
          send(eventName) {
            if (!ready) {
              return false;
            }
            sent.push(eventName);
            return true;
          },
        },
        eventTarget,
        mirrors: [ga, posthog],
      });
      runtime.initialize();

      expect(runtime.trackEvent(WEBSITE_TRACKING_EVENTS.downloadDesktopMacOS, { source: 'desktop' })).toBe('queued');
      ready = true;
      notifyWebsiteAnalyticsReady(eventTarget as never);
      runtime.flushPendingEvents();

      expect(sent).toEqual([WEBSITE_TRACKING_EVENTS.downloadDesktopMacOS]);
      expect(ga.mirror).toHaveBeenCalledTimes(1);
      expect(posthog.mirror).toHaveBeenCalledTimes(1);
    });

    it('accepts the single mirror option as a one-item list', () => {
      const single = { mirror: vi.fn() };
      const runtime = createWebsiteAnalyticsRuntime({ provider: { send: () => true }, mirror: single });

      runtime.trackEvent(WEBSITE_TRACKING_EVENTS.downloadDesktop);

      expect(single.mirror).toHaveBeenCalledTimes(1);
    });
  });

  describe('declarative data-track-event clicks', () => {
    function setup() {
      const clickListeners: Array<(event: Event) => void> = [];
      const mirror = { mirror: vi.fn() };
      const send = vi.fn(() => true);
      const runtime = createWebsiteAnalyticsRuntime({
        provider: { send },
        eventTarget: createEventTarget(),
        documentTarget: {
          addEventListener(type, listener) {
            if (type === 'click') {
              clickListeners.push(listener);
            }
          },
        },
        mirror,
      });
      runtime.initialize();

      function click(dataset: { trackEvent?: string; trackSource?: string }, href?: string) {
        const element = { dataset, href, getAttribute: () => null };
        const target = { closest: () => (dataset.trackEvent ? element : null) };
        clickListeners.forEach((listener) => listener({ target } as unknown as Event));
      }

      return { click, mirror, send };
    }

    it('recognizes the hyphenated spelling of a retained event', () => {
      const { click, mirror, send } = setup();

      click(
        { trackEvent: 'open-steam-store', trackSource: 'home-hero-steam' },
        'https://store.steampowered.com/app/hagicode',
      );

      const context = { source: 'home-hero-steam', url: 'https://store.steampowered.com/app/hagicode' };
      expect(send).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openSteamStore, context);
      expect(mirror.mirror).toHaveBeenCalledTimes(1);
      expect(mirror.mirror).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openSteamStore, context);
    });

    it('still recognizes the underscore spelling and leaves url empty without an href', () => {
      const { click, mirror } = setup();

      click({ trackEvent: 'open_desktop_page', trackSource: 'install-options-desktop' });

      expect(mirror.mirror).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openDesktopPage, {
        source: 'install-options-desktop',
        url: undefined,
      });
    });

    it('ignores unknown event names and clicks outside tracked elements', () => {
      const { click, mirror, send } = setup();

      click({ trackEvent: 'not-a-real-event' });
      click({});

      expect(send).not.toHaveBeenCalled();
      expect(mirror.mirror).not.toHaveBeenCalled();
    });
  });
});
