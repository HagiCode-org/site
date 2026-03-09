import {
  isWebsiteTrackingEventName,
  type WebsiteTrackingEventName,
} from './events';
import {
  create51LAProvider,
  type AnalyticsProvider,
  type AnalyticsWindowLike,
  type TrackingEventContext,
} from './provider-51la';

export const WEBSITE_ANALYTICS_READY_EVENT = 'hagicode:analytics-ready';

interface QueuedTrackingEvent {
  name: WebsiteTrackingEventName;
  context?: TrackingEventContext;
}

interface TrackableElement {
  dataset?: {
    trackEvent?: string;
    trackSource?: string;
  };
}

interface TrackableTarget {
  closest?: (selector: string) => TrackableElement | null;
}

interface AnalyticsDocumentLike {
  addEventListener?: (type: string, listener: (event: Event) => void) => void;
}

interface AnalyticsEventTargetLike {
  addEventListener?: (type: string, listener: () => void) => void;
  dispatchEvent?: (event: Event) => boolean;
}

export interface BrowserAnalyticsWindow extends AnalyticsWindowLike, AnalyticsEventTargetLike {
  document?: AnalyticsDocumentLike;
  __HAGI_WEBSITE_ANALYTICS__?: WebsiteAnalyticsRuntime;
}

export type TrackDispatchStatus = 'sent' | 'queued' | 'noop';

function getBrowserWindow(): BrowserAnalyticsWindow | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window as BrowserAnalyticsWindow;
}

function findTrackedElement(target: EventTarget | null): TrackableElement | null {
  if (!target || typeof target !== 'object') {
    return null;
  }

  const candidate = target as TrackableTarget & TrackableElement;
  if (typeof candidate.closest === 'function') {
    return candidate.closest('[data-track-event]');
  }

  return candidate.dataset?.trackEvent ? candidate : null;
}

export class WebsiteAnalyticsRuntime {
  private pendingQueue: QueuedTrackingEvent[] = [];
  private initialized = false;

  constructor(
    private readonly provider: AnalyticsProvider,
    private readonly eventTarget?: AnalyticsEventTargetLike,
    private readonly documentTarget?: AnalyticsDocumentLike,
  ) {}

  initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.eventTarget?.addEventListener?.(
      WEBSITE_ANALYTICS_READY_EVENT,
      this.handleAnalyticsReady,
    );
    this.documentTarget?.addEventListener?.('click', this.handleDocumentClick);
    this.flushPendingEvents();
  }

  trackEvent(
    eventName: WebsiteTrackingEventName,
    context?: TrackingEventContext,
  ): TrackDispatchStatus {
    if (this.provider.send(eventName, context)) {
      return 'sent';
    }

    if (!this.eventTarget) {
      return 'noop';
    }

    this.pendingQueue.push({ name: eventName, context });
    return 'queued';
  }

  flushPendingEvents(): number {
    if (this.pendingQueue.length === 0) {
      return 0;
    }

    const queuedEvents = [...this.pendingQueue];
    this.pendingQueue = [];
    let sentCount = 0;

    for (const queuedEvent of queuedEvents) {
      if (this.provider.send(queuedEvent.name, queuedEvent.context)) {
        sentCount += 1;
        continue;
      }

      this.pendingQueue.push(queuedEvent);
    }

    return sentCount;
  }

  getPendingCount(): number {
    return this.pendingQueue.length;
  }

  private readonly handleAnalyticsReady = () => {
    this.flushPendingEvents();
  };

  private readonly handleDocumentClick = (event: Event) => {
    const trackedElement = findTrackedElement(event.target);
    const trackEventName = trackedElement?.dataset?.trackEvent;

    if (!trackEventName || !isWebsiteTrackingEventName(trackEventName)) {
      return;
    }

    this.trackEvent(trackEventName, {
      source: trackedElement.dataset?.trackSource,
    });
  };
}

function getGlobalRuntime(target = getBrowserWindow()): WebsiteAnalyticsRuntime | undefined {
  if (!target) {
    return undefined;
  }

  if (!target.__HAGI_WEBSITE_ANALYTICS__) {
    target.__HAGI_WEBSITE_ANALYTICS__ = new WebsiteAnalyticsRuntime(
      create51LAProvider(() => getBrowserWindow()),
      target,
      target.document,
    );
  }

  return target.__HAGI_WEBSITE_ANALYTICS__;
}

export function initializeWebsiteAnalytics() {
  getGlobalRuntime()?.initialize();
}

export function trackEvent(
  eventName: WebsiteTrackingEventName,
  context?: TrackingEventContext,
): TrackDispatchStatus {
  return getGlobalRuntime()?.trackEvent(eventName, context) ?? 'noop';
}

export function notifyWebsiteAnalyticsReady(target = getBrowserWindow()) {
  target?.dispatchEvent?.(new Event(WEBSITE_ANALYTICS_READY_EVENT));
}

export function createWebsiteAnalyticsRuntime(options: {
  provider: AnalyticsProvider;
  eventTarget?: AnalyticsEventTargetLike;
  documentTarget?: AnalyticsDocumentLike;
}) {
  return new WebsiteAnalyticsRuntime(
    options.provider,
    options.eventTarget,
    options.documentTarget,
  );
}
