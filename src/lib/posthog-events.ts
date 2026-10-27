// Site-level PostHog capture wrapper (shared contract for add-site-level-posthog-events-to-hagicode-sites).
// Copy this file verbatim to src/lib/posthog-events.ts in each site, then replace ONLY the
// SITE_POSTHOG_EVENTS table. Do not change the capture rules without updating the change spec.

export type PostHogLike = {
  __loaded?: boolean;
  capture: (event: string, properties?: Record<string, unknown>) => unknown;
  has_opted_out_capturing?: () => boolean;
};

export type SitePropertySpec =
  | { kind: 'string' }
  | { kind: 'boolean' }
  | { kind: 'count' }
  | { kind: 'enum'; values: readonly string[] };

export type SiteEventTable = Readonly<
  Record<string, Readonly<Record<string, SitePropertySpec>>>
>;

export interface SiteEventCaptureOptions {
  posthog?: PostHogLike | null;
  isAllowed?: () => boolean;
}

export const SITE_EVENT_STRING_MAX_LENGTH = 128;

// Hagilight-managed super properties. Never sent by a site, even if a table lists them.
const FORBIDDEN_KEYS: ReadonlySet<string> = new Set([
  'site_id',
  'site_framework',
  'hagilight_version',
  'locale',
  'page_type',
]);

// Keys are snake_case event names (object before action), mirroring WEBSITE_TRACKING_EVENT_CATALOG.
// Only `source` (the tracked location) and `platform` (download events) are allowed; no URL or free text.
const SOURCE_PROPERTY = Object.freeze({ source: Object.freeze({ kind: 'string' }) } as const);
const PLATFORM_PROPERTIES = Object.freeze({
  source: Object.freeze({ kind: 'string' }),
  platform: Object.freeze({ kind: 'enum', values: Object.freeze(['windows', 'macos', 'linux']) }),
} as const);

export const SITE_POSTHOG_EVENTS: SiteEventTable = Object.freeze({
  download_desktop: SOURCE_PROPERTY,
  open_desktop_page: SOURCE_PROPERTY,
  open_steam_store: SOURCE_PROPERTY,
  download_desktop_windows: PLATFORM_PROPERTIES,
  download_desktop_macos: PLATFORM_PROPERTIES,
  download_desktop_linux: PLATFORM_PROPERTIES,
});

function readWindowPostHog(): PostHogLike | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { posthog?: PostHogLike }).posthog ?? undefined;
}

function sanitize(
  allowed: Readonly<Record<string, SitePropertySpec>>,
  input: Record<string, unknown>,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const key of Object.keys(input)) {
    if (FORBIDDEN_KEYS.has(key)) continue;
    if (!Object.prototype.hasOwnProperty.call(allowed, key)) continue;
    const spec = allowed[key];
    const value = input[key];
    switch (spec.kind) {
      case 'string':
        if (typeof value === 'string') {
          out[key] = value.slice(0, SITE_EVENT_STRING_MAX_LENGTH);
        }
        break;
      case 'boolean':
        if (typeof value === 'boolean') out[key] = value;
        break;
      case 'count':
        if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
          out[key] = value;
        }
        break;
      case 'enum':
        if (typeof value === 'string' && spec.values.includes(value)) out[key] = value;
        break;
    }
  }
  return out;
}

/**
 * Sends one allowlisted site event. Never throws; sends nothing when the event is unknown,
 * PostHog is missing, consent (isAllowed) says no, or the visitor has opted out.
 * While the PostHog stub is not loaded, the event is handed to the stub (which queues it) and
 * has_opted_out_capturing is NOT called, matching the hagilight foundation rule.
 */
export function captureSiteEvent(
  name: string,
  input: Record<string, unknown> = {},
  options: SiteEventCaptureOptions = {},
): void {
  try {
    if (!Object.prototype.hasOwnProperty.call(SITE_POSTHOG_EVENTS, name)) return;
    if (options.isAllowed && !options.isAllowed()) return;

    const posthog = options.posthog === undefined ? readWindowPostHog() : options.posthog ?? undefined;
    if (!posthog) return;

    if (posthog.__loaded === true) {
      if (typeof posthog.has_opted_out_capturing === 'function' && posthog.has_opted_out_capturing()) {
        return;
      }
    }

    const properties = sanitize(SITE_POSTHOG_EVENTS[name], input ?? {});
    posthog.capture(name, properties);
  } catch {
    // Analytics must never interrupt the user action that triggered it.
  }
}
