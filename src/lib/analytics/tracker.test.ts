import { describe, expect, it } from 'vitest';
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
});
