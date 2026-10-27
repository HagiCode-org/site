import { captureSiteEvent, type PostHogLike } from '../posthog-events';
import {
  WEBSITE_TRACKING_EVENT_CATALOG,
  type WebsiteTrackingEventName,
  type WebsiteTrackingPlatform,
} from './events';
import { normalizeLocation, type AnalyticsMirror } from './provider-ga';
import type { TrackingEventContext } from './provider-51la';

export interface PostHogWindowLike {
  posthog?: PostHogLike | null;
}

const PLATFORM_MAP = new Map<WebsiteTrackingEventName, WebsiteTrackingPlatform>(
  WEBSITE_TRACKING_EVENT_CATALOG.flatMap((definition) =>
    definition.platform ? [[definition.name, definition.platform] as const] : [],
  ),
);

/**
 * Mirrors tracker events to PostHog under the catalog event name, with `source` and (for download events) `platform`.
 * Never sends the link URL. Sends nothing when `window.posthog` is missing or the visitor has opted out, and never throws.
 */
export function createPostHogMirror(
  getTarget: () => PostHogWindowLike | undefined,
): AnalyticsMirror {
  return {
    mirror(eventName: WebsiteTrackingEventName, context?: TrackingEventContext) {
      try {
        const platform = PLATFORM_MAP.get(eventName);
        captureSiteEvent(
          eventName,
          {
            source: normalizeLocation(context?.source),
            ...(platform ? { platform } : {}),
          },
          // null (not undefined) so the wrapper does not fall back to reading window.posthog.
          { posthog: getTarget()?.posthog ?? null },
        );
      } catch {
        // Analytics must never interfere with the click.
      }
    },
  };
}
