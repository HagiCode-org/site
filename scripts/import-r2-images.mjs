#!/usr/bin/env node
/**
 * Vendors the R2 images named in r2-images.manifest.json into src/assets/r2/ and checks each
 * random pool against its album index.
 *
 * Every download is verified (content type, bytes, sha256 and AVIF dimensions) and every pool
 * entry is matched against index.json before anything is written. Files are written through a
 * temp file and a rename, so a failed run exits non-zero and leaves the vendored files untouched.
 *
 * Usage: npm run import:r2-images [-- --manifest <path>]
 */
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_MANIFEST = resolve(SITE_ROOT, 'r2-images.manifest.json');
const POOL_MIN_ENTRIES = 12;
const POOL_MAX_ENTRIES = 200;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

/** Finds the first `ispe` property (width and height) in an AVIF file's ISOBMFF box tree. */
export function readAvifDimensions(bytes) {
  return findIspe(bytes, 0, bytes.length);
}

function findIspe(bytes, start, end) {
  let offset = start;
  while (offset + 8 <= end) {
    let size = bytes.readUInt32BE(offset);
    const type = bytes.toString('latin1', offset + 4, offset + 8);
    let headerSize = 8;
    if (size === 1) {
      if (offset + 16 > end) return null;
      size = Number(bytes.readBigUInt64BE(offset + 8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - offset;
    }
    const boxEnd = offset + size;
    if (size < headerSize || boxEnd > end) return null;

    const bodyStart = offset + headerSize;
    if (type === 'ispe') {
      // FullBox: 4 bytes of version and flags, then width and height.
      return bodyStart + 12 <= boxEnd
        ? { width: bytes.readUInt32BE(bodyStart + 4), height: bytes.readUInt32BE(bodyStart + 8) }
        : null;
    }
    // `meta` is a FullBox, so its children start after 4 more bytes.
    const childStart = type === 'meta' ? bodyStart + 4 : bodyStart;
    if (type === 'meta' || type === 'iprp' || type === 'ipco') {
      const found = findIspe(bytes, childStart, boxEnd);
      if (found) return found;
    }
    offset = boxEnd;
  }
  return null;
}

export function sha256Hex(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

/** Structural checks on the manifest. Returns a list of problems; empty means the shape is valid. */
export function validateManifestShape(manifest) {
  const problems = [];
  if (manifest?.schemaVersion !== 1) problems.push('schemaVersion must be 1');
  if (typeof manifest?.base !== 'string' || !manifest.base.startsWith('https://')) {
    problems.push('base must be an https URL');
  }
  if (!Array.isArray(manifest?.entries)) problems.push('entries must be an array');
  if (!Array.isArray(manifest?.unchangedSurfaces)) problems.push('unchangedSurfaces must be an array');

  const pools = manifest?.pools ?? {};
  const ids = new Set();
  const files = new Set();
  for (const entry of manifest?.entries ?? []) {
    const label = entry?.id ?? '(no id)';
    if (!entry?.id || ids.has(entry.id)) problems.push(`${label}: id must be present and unique`);
    ids.add(entry?.id);
    if (typeof entry?.album !== 'string' || !entry?.objectKey?.startsWith(`${entry.album}/`)) {
      problems.push(`${label}: objectKey must start with its album`);
    }
    if (typeof entry?.file !== 'string' || !entry.file.startsWith('src/assets/r2/') || files.has(entry.file)) {
      problems.push(`${label}: file must be a unique path under src/assets/r2/`);
    }
    files.add(entry?.file);
    for (const field of ['width', 'height', 'bytes']) {
      if (!Number.isInteger(entry?.[field]) || entry[field] <= 0) problems.push(`${label}: ${field} must be a positive integer`);
    }
    if (!SHA256_PATTERN.test(entry?.sha256 ?? '')) problems.push(`${label}: sha256 must be 64 lowercase hex characters`);
    if (typeof entry?.decorative !== 'boolean') problems.push(`${label}: decorative must be a boolean`);
    if (entry?.decorative === false && (typeof entry.alt !== 'object' || entry.alt === null)) {
      problems.push(`${label}: a meaningful image needs alt text per locale`);
    }
    if (entry?.pool !== undefined && !pools[entry.pool]) problems.push(`${label}: pool ${entry.pool} is not defined`);
    if (entry?.decorative === false && entry?.pool !== undefined) problems.push(`${label}: a meaningful image may not declare a pool`);
    if (entry?.audit?.verdict !== 'accepted' || !entry.audit.checkedOn || !entry.audit.notes) {
      problems.push(`${label}: audit needs verdict accepted, checkedOn and notes`);
    }
  }
  for (const [name, pool] of Object.entries(pools)) {
    if (typeof pool?.album !== 'string' || !Number.isInteger(pool?.maxBytes) || !Array.isArray(pool?.entries)) {
      problems.push(`pool ${name}: needs album, maxBytes and entries`);
    }
  }
  for (const surface of manifest?.unchangedSurfaces ?? []) {
    if (!surface?.surface || !surface?.reason) problems.push('unchangedSurfaces: each item needs surface and reason');
  }
  return problems;
}

/** Checks one downloaded object against its manifest entry. Returns a list of problems. */
export function verifyDownload(entry, { contentType, bytes }) {
  const problems = [];
  if (!/^image\/avif(;|$)/.test(contentType)) problems.push(`content type is ${contentType || 'missing'}, expected image/avif`);
  if (bytes.length !== entry.bytes) problems.push(`has ${bytes.length} bytes, manifest says ${entry.bytes}`);
  if (sha256Hex(bytes) !== entry.sha256) problems.push('sha256 does not match the manifest');
  const dimensions = readAvifDimensions(bytes);
  if (!dimensions) problems.push('no AVIF ispe box found');
  else if (dimensions.width !== entry.width || dimensions.height !== entry.height) {
    problems.push(`is ${dimensions.width}x${dimensions.height}, manifest says ${entry.width}x${entry.height}`);
  }
  return problems;
}

/** Checks every pool entry against the album index. Returns a list of problems. */
export function verifyPool(name, pool, indexEntries) {
  const problems = [];
  if (pool.entries.length < POOL_MIN_ENTRIES || pool.entries.length > POOL_MAX_ENTRIES) {
    problems.push(`pool ${name} has ${pool.entries.length} entries, must be ${POOL_MIN_ENTRIES} to ${POOL_MAX_ENTRIES}`);
  }
  const byObjectKey = new Map(indexEntries.map((item) => [item.objectKey, item]));
  const seen = new Set();
  for (const entry of pool.entries) {
    const label = `pool ${name} ${entry.objectKey}`;
    if (seen.has(entry.objectKey)) problems.push(`${label}: listed twice`);
    seen.add(entry.objectKey);
    if (!entry.objectKey.startsWith(`${pool.album}/`)) problems.push(`${label}: not in album ${pool.album}`);
    if (entry.bytes > pool.maxBytes) problems.push(`${label}: ${entry.bytes} bytes is over the ${pool.maxBytes} byte cap`);
    const indexed = byObjectKey.get(entry.objectKey);
    if (!indexed) {
      problems.push(`${label}: not in the album index`);
      continue;
    }
    if (indexed.bytes !== entry.bytes || indexed.width !== entry.width || indexed.height !== entry.height) {
      problems.push(`${label}: index says ${indexed.bytes} bytes ${indexed.width}x${indexed.height}`);
    }
  }
  return problems;
}

/** Offline check of the vendored files against the manifest. Returns a list of problems. */
export async function checkVendoredFiles(manifest, manifestDir) {
  const problems = [];
  for (const entry of manifest.entries) {
    const path = resolve(manifestDir, entry.file);
    let bytes;
    try {
      bytes = await readFile(path);
    } catch {
      problems.push(`${entry.file}: missing`);
      continue;
    }
    const fileProblems = verifyDownload(entry, { contentType: 'image/avif', bytes });
    for (const problem of fileProblems.filter((item) => !item.startsWith('content type'))) {
      problems.push(`${entry.file}: ${problem}`);
    }
  }
  return problems;
}

async function fetchObject(base, objectKey) {
  const response = await fetch(`${base}/${objectKey}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return {
    contentType: response.headers.get('content-type') ?? '',
    bytes: Buffer.from(await response.arrayBuffer()),
  };
}

async function writeAtomic(target, bytes) {
  await mkdir(dirname(target), { recursive: true });
  const temp = `${target}.${process.pid}-${randomUUID()}.tmp`;
  try {
    await writeFile(temp, bytes);
    await rename(temp, target);
  } catch (error) {
    await unlink(temp).catch(() => {});
    throw error;
  }
}

function parseArgs(argv) {
  let manifestPath = DEFAULT_MANIFEST;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--manifest' && argv[index + 1]) {
      manifestPath = resolve(argv[index + 1]);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${argv[index]}`);
    }
  }
  return manifestPath;
}

async function main(argv) {
  const manifestPath = parseArgs(argv);
  const manifestDir = dirname(manifestPath);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

  const problems = validateManifestShape(manifest);
  const downloads = new Map();

  for (const entry of manifest.entries ?? []) {
    try {
      const downloaded = await fetchObject(manifest.base, entry.objectKey);
      const entryProblems = verifyDownload(entry, downloaded);
      if (entryProblems.length > 0) {
        problems.push(...entryProblems.map((problem) => `${entry.objectKey}: ${problem}`));
      } else {
        downloads.set(entry.file, downloaded.bytes);
      }
    } catch (error) {
      problems.push(`${entry.objectKey}: ${error instanceof Error ? error.message : error}`);
    }
  }

  const indexCache = new Map();
  for (const [name, pool] of Object.entries(manifest.pools ?? {})) {
    try {
      if (!indexCache.has(pool.album)) {
        const response = await fetch(`${manifest.base}/${pool.album}/index.json`);
        if (!response.ok) throw new Error(`index HTTP ${response.status}`);
        indexCache.set(pool.album, (await response.json()).entries);
      }
      problems.push(...verifyPool(name, pool, indexCache.get(pool.album)));
    } catch (error) {
      problems.push(`pool ${name}: ${error instanceof Error ? error.message : error}`);
    }
  }

  if (problems.length > 0) {
    for (const problem of problems) console.error(`FAIL ${problem}`);
    console.error(`No file was changed (${problems.length} problem(s)).`);
    process.exitCode = 1;
    return;
  }

  let written = 0;
  for (const [file, bytes] of downloads) {
    const target = resolve(manifestDir, file);
    const current = await readFile(target).catch(() => null);
    if (current && current.equals(bytes)) continue;
    await writeAtomic(target, bytes);
    written += 1;
  }

  const vendoredProblems = await checkVendoredFiles(manifest, manifestDir);
  if (vendoredProblems.length > 0) {
    for (const problem of vendoredProblems) console.error(`FAIL ${problem}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Verified ${downloads.size} R2 image(s) and ${Object.keys(manifest.pools ?? {}).length} pool(s) from ${manifest.base}.`);
  console.log(`Wrote ${written} file(s); ${downloads.size - written} already matched.`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
