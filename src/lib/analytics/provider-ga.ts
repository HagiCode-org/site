import { GA_CATEGORY_ACTIONS, type GaEventParams } from '@hagicode/hagilight-core/analytics-events';
import {
  WEBSITE_TRACKING_EVENT_CATALOG,
  type WebsiteTrackingEventName,
  type WebsiteTrackingGaMapping,
} from './events';
import type { TrackingEventContext } from './provider-51la';

export interface GoogleAnalyticsWindowLike {
  gtag?: unknown;
}

/** Fire-and-forget copy of a tracked event, sent next to the 51LA provider. */
export interface AnalyticsMirror {
  mirror: (eventName: WebsiteTrackingEventName, context?: TrackingEventContext) => void;
}

const DEFAULT_LOCATION = 'website';

const GA_MAPPINGS = new Map<WebsiteTrackingEventName, WebsiteTrackingGaMapping>(
  WEBSITE_TRACKING_EVENT_CATALOG.map((definition) => [definition.name, definition.ga]),
);

function normalizeLocation(source: string | undefined): string {
  const location = source?.trim().replaceAll('-', '_');
  return location || DEFAULT_LOCATION;
}

/**
 * Mirrors tracker events to Google Analytics with the shared Hagilight vocabulary.
 * Sends only while `gtag` is a function (production pages with Google Analytics loaded) and never throws.
 */
export function createGoogleAnalyticsMirror(
  getTarget: () => GoogleAnalyticsWindowLike | undefined,
): AnalyticsMirror {
  return {
    mirror(eventName, context) {
      try {
        const mapping = GA_MAPPINGS.get(eventName);
        const gtag = getTarget()?.gtag;
        if (!mapping || typeof gtag !== 'function') {
          return;
        }

        const params: GaEventParams = {
          event_category: mapping.category,
          event_label: mapping.label,
          link_location: normalizeLocation(context?.source),
          ...(context?.url ? { link_url: context.url } : {}),
          transport_type: 'beacon',
        };
        gtag('event', GA_CATEGORY_ACTIONS[mapping.category], params);
      } catch {
        // Analytics must never interfere with the click.
      }
    },
  };
}
