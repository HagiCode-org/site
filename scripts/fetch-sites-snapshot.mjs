import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FOOTER_SITES_SNAPSHOT_URL = 'https://index.hagicode.com/sites.json';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertNonEmptyString(value, fieldName) {
  assert(typeof value === 'string' && value.trim().length > 0, `Invalid footer sites snapshot payload: ${fieldName} must be a non-empty string`);
  return value.trim();
}

function normalizeHttpsUrl(value, fieldName) {
  const raw = assertNonEmptyString(value, fieldName);
  let parsed;

  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`Invalid footer sites snapshot payload: ${fieldName} must be a valid URL`);
  }

  assert(parsed.protocol === 'https:', `Invalid footer sites snapshot payload: ${fieldName} must use https`);
  parsed.hash = '';
  return parsed.toString();
}

function normalizeFooterSitesSnapshotPayload(payload) {
  assert(isRecord(payload), 'Invalid footer sites snapshot payload: root must be an object');

  const version = assertNonEmptyString(payload.version, 'version');
  const generatedAt = assertNonEmptyString(payload.generatedAt, 'generatedAt');
  const groups = payload.groups;
  const entries = payload.entries;

  assert(Array.isArray(groups) && groups.length > 0, 'Invalid footer sites snapshot payload: groups must be a non-empty array');
  assert(Array.isArray(entries) && entries.length > 0, 'Invalid footer sites snapshot payload: entries must be a non-empty array');

  const normalizedGroups = groups.map((group, index) => {
    assert(isRecord(group), `Invalid footer sites snapshot payload: groups[${index}] must be an object`);
    return {
      id: assertNonEmptyString(group.id, `groups[${index}].id`),
      label: assertNonEmptyString(group.label, `groups[${index}].label`),
      description: assertNonEmptyString(group.description, `groups[${index}].description`),
    };
  });

  const knownGroupIds = new Set();
  for (const group of normalizedGroups) {
    assert(!knownGroupIds.has(group.id), `Invalid footer sites snapshot payload: duplicate group id "${group.id}"`);
    knownGroupIds.add(group.id);
  }

  const seenEntryIds = new Set();
  const normalizedEntries = entries.map((entry, index) => {
    assert(isRecord(entry), `Invalid footer sites snapshot payload: entries[${index}] must be an object`);

    const id = assertNonEmptyString(entry.id, `entries[${index}].id`);
    const groupId = assertNonEmptyString(entry.groupId, `entries[${index}].groupId`);

    assert(!seenEntryIds.has(id), `Invalid footer sites snapshot payload: duplicate entry id "${id}"`);
    assert(knownGroupIds.has(groupId), `Invalid footer sites snapshot payload: entries[${index}].groupId references unknown group "${groupId}"`);
    seenEntryIds.add(id);

    return {
      id,
      title: assertNonEmptyString(entry.title, `entries[${index}].title`),
      label: assertNonEmptyString(entry.label, `entries[${index}].label`),
      description: assertNonEmptyString(entry.description, `entries[${index}].description`),
      groupId,
      url: normalizeHttpsUrl(entry.url, `entries[${index}].url`),
      actionLabel: assertNonEmptyString(entry.actionLabel, `entries[${index}].actionLabel`),
    };
  });

  return {
    version,
    generatedAt,
    groups: normalizedGroups,
    entries: normalizedEntries,
  };
}

async function updateFooterSitesSnapshot({
  fetchImpl = globalThis.fetch,
  outputPath,
  url = FOOTER_SITES_SNAPSHOT_URL,
} = {}) {
  assert(typeof fetchImpl === 'function', 'Footer sites snapshot fetch requires a fetch implementation');
  assertNonEmptyString(outputPath, 'outputPath');

  const response = await fetchImpl(url, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response?.ok) {
    throw new Error(`Failed to fetch footer sites snapshot: ${response?.status ?? 'unknown status'}`);
  }

  const contentType = response.headers?.get?.('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(`Failed to fetch footer sites snapshot: expected application/json from ${url} but received ${contentType || 'unknown content-type'}`);
  }

  const payload = normalizeFooterSitesSnapshotPayload(await response.json());
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(repoRoot, 'src', 'data', 'footer-sites.snapshot.json');

await updateFooterSitesSnapshot({ outputPath });
console.log(`Footer sites snapshot updated at ${path.relative(repoRoot, outputPath)}`);
