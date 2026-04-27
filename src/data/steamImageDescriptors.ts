export const DEFAULT_STEAM_INDEX_URL = 'https://index.hagicode.com/steam/index.json';

export const STEAM_IMAGE_VARIANTS = [
  'wide-capsule',
  'store-capsule',
  'library-capsule',
  'hero',
] as const;

export type SteamImageDescriptor = {
  src: string;
  variant: typeof STEAM_IMAGE_VARIANTS[number] | (string & {});
  alt?: string;
  width?: number;
  height?: number;
};

export type SteamProductImageRecord = {
  key: string;
  displayName: string;
  type: 'application' | 'dlc' | 'bundle';
  storeUrl: string | null;
  images: SteamImageDescriptor[];
  parentKey?: string | null;
  includedApplicationKeys?: string[];
};

export type SteamApplicationPayloadEntry = {
  key: string;
  displayName: string;
  kind?: 'application' | 'dlc' | string;
  parentKey?: string | null;
  storeUrl?: string | null;
  images?: SteamImageDescriptor[];
};

export type SteamBundlePayloadEntry = {
  key: string;
  displayName: string;
  storeUrl?: string | null;
  includedApplicationKeys?: string[];
  images?: SteamImageDescriptor[];
};

export type SteamIndexPayload = {
  applications: SteamApplicationPayloadEntry[];
  bundles: SteamBundlePayloadEntry[];
  images?: Record<string, SteamImageDescriptor[]>;
};

type NormalizedSteamPayload = {
  applications: Map<string, SteamProductImageRecord>;
  bundles: Map<string, SteamProductImageRecord>;
};

const IMAGE_VARIANT_PRIORITY = new Map<string, number>(
  STEAM_IMAGE_VARIANTS.map((variant, index) => [variant, index]),
);

let resolvedPayloadCache: NormalizedSteamPayload | null = null;
let inFlightPayloadRequest: Promise<NormalizedSteamPayload> | null = null;

export class SteamImagePayloadError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'SteamImagePayloadError';
  }
}

function normalizeKey(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized || null;
}

function normalizeString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function normalizeNullableString(value: unknown): string | null {
  return normalizeString(value) ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeImageSrc(src: string, baseUrl: string): string {
  try {
    return new URL(src, baseUrl).toString();
  } catch {
    return src;
  }
}

function normalizeImages(value: unknown, baseUrl: string): SteamImageDescriptor[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const descriptors: SteamImageDescriptor[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const src = normalizeString(item.src);
    const variant = normalizeString(item.variant);

    if (!src || !variant) {
      continue;
    }

    const resolvedSrc = normalizeImageSrc(src, baseUrl);
    const dedupeKey = `${variant}\n${resolvedSrc}`;
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    descriptors.push({
      src: resolvedSrc,
      variant,
      alt: normalizeString(item.alt),
      width: typeof item.width === 'number' && Number.isFinite(item.width) ? item.width : undefined,
      height: typeof item.height === 'number' && Number.isFinite(item.height) ? item.height : undefined,
    });
  }

  return descriptors.sort((left, right) => {
    const leftPriority = IMAGE_VARIANT_PRIORITY.get(left.variant) ?? 99;
    const rightPriority = IMAGE_VARIANT_PRIORITY.get(right.variant) ?? 99;
    return leftPriority - rightPriority;
  });
}

function validatePayload(payload: unknown): Record<string, unknown> {
  if (!isRecord(payload)) {
    throw new SteamImagePayloadError('Steam index payload must be an object.');
  }

  if (!Array.isArray(payload.applications)) {
    throw new SteamImagePayloadError('Steam index payload is missing applications array.');
  }

  if (!Array.isArray(payload.bundles)) {
    throw new SteamImagePayloadError('Steam index payload is missing bundles array.');
  }

  return payload;
}

function normalizeApplicationEntry(
  value: unknown,
  payloadImages: Map<string, SteamImageDescriptor[]>,
  baseUrl: string,
): SteamProductImageRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const key = normalizeKey(value.key);
  const displayName = normalizeString(value.displayName) ?? normalizeString(value.name);

  if (!key || !displayName) {
    return null;
  }

  const kind = normalizeString(value.kind);
  const images = normalizeImages(value.images, baseUrl);

  return {
    key,
    displayName,
    type: kind === 'dlc' ? 'dlc' : 'application',
    storeUrl: normalizeNullableString(value.storeUrl),
    images: images.length ? images : payloadImages.get(key) ?? [],
    parentKey: normalizeKey(value.parentKey),
  };
}

function normalizeBundleEntry(
  value: unknown,
  payloadImages: Map<string, SteamImageDescriptor[]>,
  baseUrl: string,
): SteamProductImageRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const key = normalizeKey(value.key);
  const displayName = normalizeString(value.displayName) ?? normalizeString(value.name);

  if (!key || !displayName) {
    return null;
  }

  const images = normalizeImages(value.images, baseUrl);

  return {
    key,
    displayName,
    type: 'bundle',
    storeUrl: normalizeNullableString(value.storeUrl),
    images: images.length ? images : payloadImages.get(key) ?? [],
    includedApplicationKeys: Array.isArray(value.includedApplicationKeys)
      ? value.includedApplicationKeys.flatMap((item) => normalizeKey(item) ?? [])
      : [],
  };
}

export function normalizeSteamPayload(payload: unknown, baseUrl = DEFAULT_STEAM_INDEX_URL): NormalizedSteamPayload {
  const validated = validatePayload(payload);
  const payloadImages = new Map<string, SteamImageDescriptor[]>();

  if (isRecord(validated.images)) {
    for (const [rawKey, rawImages] of Object.entries(validated.images)) {
      const key = normalizeKey(rawKey);
      if (key) {
        payloadImages.set(key, normalizeImages(rawImages, baseUrl));
      }
    }
  }

  const applications = new Map<string, SteamProductImageRecord>();
  for (const item of validated.applications as unknown[]) {
    const record = normalizeApplicationEntry(item, payloadImages, baseUrl);
    if (record) {
      applications.set(record.key, record);
    }
  }

  const bundles = new Map<string, SteamProductImageRecord>();
  for (const item of validated.bundles as unknown[]) {
    const record = normalizeBundleEntry(item, payloadImages, baseUrl);
    if (record) {
      bundles.set(record.key, record);
    }
  }

  return { applications, bundles };
}

export async function loadSteamImageRecords(options: { forceRefresh?: boolean; url?: string } = {}): Promise<NormalizedSteamPayload> {
  if (!options.forceRefresh && resolvedPayloadCache) {
    return resolvedPayloadCache;
  }

  if (!options.forceRefresh && inFlightPayloadRequest) {
    return inFlightPayloadRequest;
  }

  const url = options.url ?? DEFAULT_STEAM_INDEX_URL;
  inFlightPayloadRequest = fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'default',
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new SteamImagePayloadError(`Steam index request failed with HTTP ${response.status}.`);
      }

      const payload = await response.json() as SteamIndexPayload;
      resolvedPayloadCache = normalizeSteamPayload(payload, url);
      return resolvedPayloadCache;
    })
    .catch((error: unknown) => {
      resolvedPayloadCache = null;
      throw error;
    })
    .finally(() => {
      inFlightPayloadRequest = null;
    });

  return inFlightPayloadRequest;
}

export function resolveSteamProductImageRecord(
  normalized: NormalizedSteamPayload,
  key: string,
): SteamProductImageRecord | null {
  const normalizedKey = normalizeKey(key);
  if (!normalizedKey) {
    return null;
  }

  return normalized.applications.get(normalizedKey) ?? normalized.bundles.get(normalizedKey) ?? null;
}

export async function getSteamProductImageRecord(key: string): Promise<SteamProductImageRecord | null> {
  const normalized = await loadSteamImageRecords();
  return resolveSteamProductImageRecord(normalized, key);
}

export function clearSteamImageRecordCache(): void {
  resolvedPayloadCache = null;
  inFlightPayloadRequest = null;
}

export const __steamImageDescriptorTestUtils = {
  normalizeImages,
};
