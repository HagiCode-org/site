import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ABOUT_SNAPSHOT_URL = 'https://index.hagicode.com/about.json';
export const ABOUT_SNAPSHOT_VERSION = '1.0.0';
export const ABOUT_SNAPSHOT_OUTPUT_PATH = 'src/data/about.snapshot.json';
export const ABOUT_SNAPSHOT_REGION_PRIORITIES = ['china-first', 'international-first'];
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
];

const rootRelativeAstroAssetPattern = /^\/_astro\/.+/i;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readNonEmptyString(value, fieldName) {
  assert(
    typeof value === 'string' && value.trim().length > 0,
    `Invalid about snapshot payload: ${fieldName} must be a non-empty string`,
  );
  return value;
}

function readOptionalNonEmptyString(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  return readNonEmptyString(value, fieldName);
}

function readPositiveInteger(value, fieldName) {
  assert(
    Number.isInteger(value) && Number(value) > 0,
    `Invalid about snapshot payload: ${fieldName} must be a positive integer`,
  );
  return value;
}

function readRegionPriority(value, fieldName) {
  const regionPriority = readNonEmptyString(value, fieldName);
  assert(
    ABOUT_SNAPSHOT_REGION_PRIORITIES.includes(regionPriority),
    `Invalid about snapshot payload: ${fieldName} must be ${ABOUT_SNAPSHOT_REGION_PRIORITIES.join(' or ')}`,
  );
  return regionPriority;
}

function readImageUrl(value, fieldName) {
  const imageUrl = readNonEmptyString(value, fieldName);
  assert(
    rootRelativeAstroAssetPattern.test(imageUrl) || /^https?:\/\//.test(imageUrl),
    `Invalid about snapshot payload: ${fieldName} must be a root-relative or absolute asset URL`,
  );
  return imageUrl;
}

function normalizeAboutEntry(entry, index, seenIds, remainingIds) {
  assert(isRecord(entry), `Invalid about snapshot payload: entries[${index}] must be an object`);

  const id = readNonEmptyString(entry.id, `entries[${index}].id`);
  assert(!seenIds.has(id), `Invalid about snapshot payload: duplicate entry id "${id}"`);
  seenIds.add(id);
  remainingIds.delete(id);

  const type = readNonEmptyString(entry.type, `${id}.type`);
  assert(
    ['link', 'contact', 'qr', 'image'].includes(type),
    `Invalid about snapshot payload: ${id}.type must be link, contact, qr, or image`,
  );

  const normalizedBase = {
    id,
    type,
    label: readNonEmptyString(entry.label, `${id}.label`),
    regionPriority: readRegionPriority(entry.regionPriority, `${id}.regionPriority`),
    description: readOptionalNonEmptyString(entry.description, `${id}.description`),
  };

  if (type === 'link') {
    return {
      ...normalizedBase,
      type,
      url: readNonEmptyString(entry.url, `${id}.url`),
    };
  }

  if (type === 'contact') {
    return {
      ...normalizedBase,
      type,
      value: readNonEmptyString(entry.value, `${id}.value`),
      url: readOptionalNonEmptyString(entry.url, `${id}.url`),
    };
  }

  return {
    ...normalizedBase,
    type,
    imageUrl: readImageUrl(entry.imageUrl, `${id}.imageUrl`),
    width: readPositiveInteger(entry.width, `${id}.width`),
    height: readPositiveInteger(entry.height, `${id}.height`),
    alt: readNonEmptyString(entry.alt, `${id}.alt`),
    url: readOptionalNonEmptyString(entry.url, `${id}.url`),
  };
}

export function getSiteRoot() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(scriptDir, '..', '..');
}

export function resolveAboutSnapshotOutputPath(relativePath = ABOUT_SNAPSHOT_OUTPUT_PATH) {
  return path.join(getSiteRoot(), relativePath);
}

export function normalizeAboutSnapshotPayload(payload) {
  assert(isRecord(payload), 'Invalid about snapshot payload: root must be an object');
  assert(Array.isArray(payload.entries), 'Invalid about snapshot payload: entries must be an array');

  const version = readNonEmptyString(payload.version, 'version');
  assert(
    version === ABOUT_SNAPSHOT_VERSION,
    `Invalid about snapshot payload: version must be ${ABOUT_SNAPSHOT_VERSION}`,
  );

  const remainingIds = new Set(REQUIRED_ABOUT_ENTRY_IDS);
  const seenIds = new Set();
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

export async function fetchAboutSnapshot(fetchImpl = globalThis.fetch) {
  assert(typeof fetchImpl === 'function', 'About snapshot fetch requires a fetch implementation');

  const response = await fetchImpl(ABOUT_SNAPSHOT_URL, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response?.ok) {
    throw new Error(`Failed to fetch about snapshot: ${response?.status ?? 'unknown status'}`);
  }

  return normalizeAboutSnapshotPayload(await response.json());
}

export async function writeAboutSnapshotFile(payload, { outputPath = resolveAboutSnapshotOutputPath() } = {}) {
  const normalizedPayload = normalizeAboutSnapshotPayload(payload);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(normalizedPayload, null, 2)}\n`, 'utf8');

  return {
    outputPath,
    payload: normalizedPayload,
  };
}

export async function updateAboutSnapshot({
  fetchImpl = globalThis.fetch,
  outputPath = resolveAboutSnapshotOutputPath(),
} = {}) {
  const payload = await fetchAboutSnapshot(fetchImpl);
  return writeAboutSnapshotFile(payload, { outputPath });
}
