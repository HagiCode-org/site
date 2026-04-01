import bundledPayload from '@/data/about.snapshot.json';

export const ABOUT_SNAPSHOT_URL = 'https://index.hagicode.com/about.json';
export const ABOUT_SNAPSHOT_ORIGIN = 'https://index.hagicode.com';
export const ABOUT_SNAPSHOT_VERSION = '1.0.0';
export const ABOUT_SNAPSHOT_REGION_PRIORITIES = ['china-first', 'international-first'] as const;
export const REQUIRED_ABOUT_ENTRY_IDS = [
  'youtube',
  'bilibili',
  'xiaohongshu',
  'douyin-account',
  'douyin-qr',
  'qq-group',
  'feishu-group',
  'discord',
  'wechat-account',
] as const;

export type AboutSnapshotRequiredEntryId = (typeof REQUIRED_ABOUT_ENTRY_IDS)[number];
export type AboutSnapshotEntryType = 'link' | 'contact' | 'qr' | 'image';
export type AboutSnapshotRegionPriority = (typeof ABOUT_SNAPSHOT_REGION_PRIORITIES)[number];

interface AboutSnapshotBaseEntry {
  readonly id: string;
  readonly type: AboutSnapshotEntryType;
  readonly label: string;
  readonly regionPriority: AboutSnapshotRegionPriority;
  readonly description?: string;
}

export interface AboutSnapshotLinkEntry extends AboutSnapshotBaseEntry {
  readonly type: 'link';
  readonly url: string;
}

export interface AboutSnapshotContactEntry extends AboutSnapshotBaseEntry {
  readonly type: 'contact';
  readonly value: string;
  readonly url?: string;
}

export interface AboutSnapshotMediaEntry extends AboutSnapshotBaseEntry {
  readonly type: 'qr' | 'image';
  readonly imageUrl: string;
  readonly resolvedImageUrl: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly url?: string;
}

export type AboutSnapshotEntry =
  | AboutSnapshotLinkEntry
  | AboutSnapshotContactEntry
  | AboutSnapshotMediaEntry;

export interface AboutSnapshotData {
  readonly version: string;
  readonly updatedAt: string;
  readonly entries: readonly AboutSnapshotEntry[];
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readNonEmptyString(value: unknown, fieldName: string): string {
  assert(
    typeof value === 'string' && value.trim().length > 0,
    `Invalid about snapshot payload: ${fieldName} must be a non-empty string`,
  );
  return value;
}

function readOptionalNonEmptyString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return readNonEmptyString(value, fieldName);
}

function readPositiveInteger(value: unknown, fieldName: string): number {
  assert(
    Number.isInteger(value) && Number(value) > 0,
    `Invalid about snapshot payload: ${fieldName} must be a positive integer`,
  );
  return Number(value);
}

function readRegionPriority(value: unknown, fieldName: string): AboutSnapshotRegionPriority {
  const regionPriority = readNonEmptyString(value, fieldName);
  assert(
    ABOUT_SNAPSHOT_REGION_PRIORITIES.includes(regionPriority as AboutSnapshotRegionPriority),
    `Invalid about snapshot payload: ${fieldName} must be ${ABOUT_SNAPSHOT_REGION_PRIORITIES.join(' or ')}`,
  );
  return regionPriority as AboutSnapshotRegionPriority;
}

function readMediaUrl(value: unknown, fieldName: string): string {
  const imageUrl = readNonEmptyString(value, fieldName);
  assert(
    imageUrl.startsWith('/_astro/') || imageUrl.startsWith('http://') || imageUrl.startsWith('https://'),
    `Invalid about snapshot payload: ${fieldName} must be a published Astro asset URL`,
  );
  return imageUrl;
}

function resolveImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  return new URL(imageUrl, ABOUT_SNAPSHOT_ORIGIN).toString();
}

function normalizeAboutEntry(
  entry: unknown,
  index: number,
  seenIds: Set<string>,
  remainingIds: Set<AboutSnapshotRequiredEntryId>,
): AboutSnapshotEntry {
  assert(isRecord(entry), `Invalid about snapshot payload: entries[${index}] must be an object`);

  const id = readNonEmptyString(entry.id, `entries[${index}].id`);
  assert(!seenIds.has(id), `Invalid about snapshot payload: duplicate entry id "${id}"`);
  seenIds.add(id);
  remainingIds.delete(id as AboutSnapshotRequiredEntryId);

  const type = readNonEmptyString(entry.type, `${id}.type`);
  assert(
    ['link', 'contact', 'qr', 'image'].includes(type),
    `Invalid about snapshot payload: ${id}.type must be link, contact, qr, or image`,
  );

  const baseEntry = {
    id,
    type: type as AboutSnapshotEntryType,
    label: readNonEmptyString(entry.label, `${id}.label`),
    regionPriority: readRegionPriority(entry.regionPriority, `${id}.regionPriority`),
    description: readOptionalNonEmptyString(entry.description, `${id}.description`),
  };

  if (type === 'link') {
    return {
      ...baseEntry,
      type,
      url: readNonEmptyString(entry.url, `${id}.url`),
    };
  }

  if (type === 'contact') {
    return {
      ...baseEntry,
      type,
      value: readNonEmptyString(entry.value, `${id}.value`),
      url: readOptionalNonEmptyString(entry.url, `${id}.url`),
    };
  }

  const imageUrl = readMediaUrl(entry.imageUrl, `${id}.imageUrl`);

  return {
    ...baseEntry,
    type,
    imageUrl,
    resolvedImageUrl: resolveImageUrl(imageUrl),
    width: readPositiveInteger(entry.width, `${id}.width`),
    height: readPositiveInteger(entry.height, `${id}.height`),
    alt: readNonEmptyString(entry.alt, `${id}.alt`),
    url: readOptionalNonEmptyString(entry.url, `${id}.url`),
  };
}

export function normalizeAboutSnapshotData(payload: unknown): AboutSnapshotData {
  assert(isRecord(payload), 'Invalid about snapshot payload: root must be an object');
  assert(Array.isArray(payload.entries), 'Invalid about snapshot payload: entries must be an array');

  const version = readNonEmptyString(payload.version, 'version');
  assert(
    version === ABOUT_SNAPSHOT_VERSION,
    `Invalid about snapshot payload: version must be ${ABOUT_SNAPSHOT_VERSION}`,
  );

  const remainingIds = new Set<AboutSnapshotRequiredEntryId>(REQUIRED_ABOUT_ENTRY_IDS);
  const seenIds = new Set<string>();
  const entries = payload.entries.map((entry, index) =>
    normalizeAboutEntry(entry, index, seenIds, remainingIds),
  );

  assert(
    remainingIds.size === 0,
    `Invalid about snapshot payload: missing required entries ${Array.from(remainingIds).join(', ')}`,
  );

  return {
    version,
    updatedAt: readNonEmptyString(payload.updatedAt, 'updatedAt'),
    entries,
  };
}

let bundledSnapshotCache: AboutSnapshotData | null = null;

export function getBundledAboutSnapshot(): AboutSnapshotData {
  if (bundledSnapshotCache) {
    return bundledSnapshotCache;
  }

  bundledSnapshotCache = normalizeAboutSnapshotData(bundledPayload);
  return bundledSnapshotCache;
}

export function partitionAboutEntries(entries: readonly AboutSnapshotEntry[]) {
  const links: AboutSnapshotLinkEntry[] = [];
  const contacts: AboutSnapshotContactEntry[] = [];
  const media: AboutSnapshotMediaEntry[] = [];

  entries.forEach((entry) => {
    if (entry.type === 'link') {
      links.push(entry);
      return;
    }

    if (entry.type === 'contact') {
      contacts.push(entry);
      return;
    }

    media.push(entry);
  });

  return { links, contacts, media };
}
