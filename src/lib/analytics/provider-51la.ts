import type { WebsiteTrackingEventName } from './events';

export interface TrackingEventContext {
  source?: string;
}

export interface AnalyticsProvider {
  send: (eventName: WebsiteTrackingEventName, context?: TrackingEventContext) => boolean;
}

export interface LaApi {
  track: (eventName: string) => void;
}

export interface AnalyticsWindowLike {
  LA?: LaApi;
}

export function is51LAReady(target?: AnalyticsWindowLike): boolean {
  return typeof target?.LA?.track === 'function';
}

export function sendTo51LA(
  eventName: WebsiteTrackingEventName,
  target?: AnalyticsWindowLike,
): boolean {
  if (!is51LAReady(target)) {
    return false;
  }

  try {
    target.LA.track(eventName);
    return true;
  } catch {
    return false;
  }
}

export function create51LAProvider(
  getTarget: () => AnalyticsWindowLike | undefined,
): AnalyticsProvider {
  return {
    send(eventName: WebsiteTrackingEventName) {
      return sendTo51LA(eventName, getTarget());
    },
  };
}
