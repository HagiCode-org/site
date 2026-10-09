import { describe, expect, it, vi } from 'vitest';
import { WEBSITE_TRACKING_EVENTS } from './events';
import { createWebsiteAnalyticsRuntime, notifyWebsiteAnalyticsReady } from './tracker';

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
    const secondResult = runtime.trackEvent(WEBSITE_TRACKING_EVENTS.openContainerPage);

    expect(firstResult).toBe('queued');
    expect(secondResult).toBe('queued');
    expect(runtime.getPendingCount()).toBe(2);

    ready = true;
    notifyWebsiteAnalyticsReady(eventTarget as never);

    expect(sentEvents).toEqual([
      WEBSITE_TRACKING_EVENTS.openDesktopPage,
      WEBSITE_TRACKING_EVENTS.openContainerPage,
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

      runtime.trackEvent(WEBSITE_TRACKING_EVENTS.openContainerPage, { source: 'home-hero', url: '/container/' });

      expect(mirror.mirror).toHaveBeenCalledTimes(1);
      expect(mirror.mirror).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openContainerPage, {
        source: 'home-hero',
        url: '/container/',
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

    it('recognizes the hyphenated spelling used by the Container FAQ link', () => {
      const { click, mirror, send } = setup();

      click(
        { trackEvent: 'open-container-deployment-guide', trackSource: 'container-faq' },
        'https://docs.hagicode.com/installation/docker-compose/',
      );

      const context = { source: 'container-faq', url: 'https://docs.hagicode.com/installation/docker-compose/' };
      expect(send).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openContainerDeploymentGuide, context);
      expect(mirror.mirror).toHaveBeenCalledTimes(1);
      expect(mirror.mirror).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openContainerDeploymentGuide, context);
    });

    it('still recognizes the underscore spelling and leaves url empty without an href', () => {
      const { click, mirror } = setup();

      click({ trackEvent: 'open_container_deployment_guide', trackSource: 'container-page-hero' });

      expect(mirror.mirror).toHaveBeenCalledWith(WEBSITE_TRACKING_EVENTS.openContainerDeploymentGuide, {
        source: 'container-page-hero',
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
