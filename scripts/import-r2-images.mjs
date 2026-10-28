#!/usr/bin/env node
/**
 * Verifies the R2 images named in r2-images.manifest.json, renders the vendored renditions into
 * src/assets/r2/, and checks each random pool against its album index.
 *
 * Two classes (see the manifest's `class` field):
 * - vendored: the R2 object is verified against `source`, rendered to the small size its display
 *   needs (`render`, via the site's existing sharp dependency), and the rendition is written.
 * - rotating-remote: the R2 object is verified (content type, bytes, sha256, dimensions) and its
 *   bytes checked against `byteCap`, but nothing is written; the page requests it on activation.
 *
 * Every check runs before anything is written. Files are written through a temp file and a rename,
 * so a failed run exits non-zero and leaves the vendored files untouched.
 *
 * Usage: pnpm run import:r2-images [-- --manifest <path>]
 */
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const SITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_MANIFEST = resolve(SITE_ROOT, 'r2-images.manifest.json');
const POOL_MIN_ENTRIES = 12;
const POOL_MAX_ENTRIES = 200;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const CLASSES = new Set(['vendored', 'rotating-remote']);

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

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

/** Structural checks on the manifest. Returns a list of problems; empty means the shape is valid. */
export function validateManifestShape(manifest) {
  const problems = [];
  if (manifest?.schemaVersion !== 2) problems.push('schemaVersion must be 2');
  if (typeof manifest?.base !== 'string' || !manifest.base.startsWith('https://')) {
    problems.push('base must be an https URL');
  }
  if (!isPositiveInteger(manifest?.budgets?.perFileBytes) || !isPositiveInteger(manifest?.budgets?.totalBytes)) {
    problems.push('budgets must set perFileBytes and totalBytes');
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
    if (!CLASSES.has(entry?.class)) problems.push(`${label}: class must be vendored or rotating-remote`);
    if (typeof entry?.album !== 'string' || !entry?.objectKey?.startsWith(`${entry.album}/`)) {
      problems.push(`${label}: objectKey must start with its album`);
    }
    for (const field of ['width', 'height', 'bytes']) {
      if (!isPositiveInteger(entry?.[field])) problems.push(`${label}: ${field} must be a positive integer`);
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

    if (entry?.class === 'vendored') {
      if (typeof entry?.file !== 'string' || !entry.file.startsWith('src/assets/r2/') || files.has(entry.file)) {
        problems.push(`${label}: file must be a unique path under src/assets/r2/`);
      }
      files.add(entry?.file);
      const source = entry?.source;
      if (!source || !isPositiveInteger(source.bytes) || !SHA256_PATTERN.test(source.sha256 ?? '')
        || !isPositiveInteger(source.width) || !isPositiveInteger(source.height)) {
        problems.push(`${label}: vendored entries need source {bytes, sha256, width, height} of the R2 object`);
      }
      if (entry?.render !== null && entry?.render !== undefined) {
        const render = entry.render;
        if (!isPositiveInteger(render.width) || !isPositiveInteger(render.height) || render.format !== 'avif'
          || !isPositiveInteger(render.quality)) {
          problems.push(`${label}: render needs width, height, format avif and quality`);
        }
        if (!Array.isArray(entry.transforms) || entry.transforms.length === 0) {
          problems.push(`${label}: a rendered entry must record its transforms`);
        }
      }
    }
    if (entry?.class === 'rotating-remote') {
      if (entry?.file !== null) problems.push(`${label}: a rotating remote frame has no vendored file (file must be null)`);
      if (!isPositiveInteger(entry?.byteCap)) problems.push(`${label}: a rotating remote frame needs a byteCap`);
      if (typeof entry?.activation !== 'string' || !entry.activation) problems.push(`${label}: a rotating remote frame needs an activation rule`);
      if (entry?.decorative !== true) problems.push(`${label}: a rotating remote frame must be decorative`);
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

/** The R2 object an entry names: its `source` for a vendored entry, the entry itself for a remote frame. */
function objectFields(entry) {
  return entry.class === 'vendored' ? entry.source : entry;
}

/** Checks one downloaded R2 object against the manifest. Returns a list of problems. */
export function verifyDownload(entry, { contentType, bytes }) {
  const expected = objectFields(entry);
  const problems = [];
  if (!/^image\/avif(;|$)/.test(contentType)) problems.push(`content type is ${contentType || 'missing'}, expected image/avif`);
  if (bytes.length !== expected.bytes) problems.push(`has ${bytes.length} bytes, manifest says ${expected.bytes}`);
  if (sha256Hex(bytes) !== expected.sha256) problems.push('sha256 does not match the manifest');
  const dimensions = readAvifDimensions(bytes);
  if (!dimensions) problems.push('no AVIF ispe box found');
  else if (dimensions.width !== expected.width || dimensions.height !== expected.height) {
    problems.push(`is ${dimensions.width}x${dimensions.height}, manifest says ${expected.width}x${expected.height}`);
  }
  return problems;
}

/** Checks a rendered or committed file (bytes, sha256, dimensions) against its vendored entry. */
export function verifyFile(entry, bytes) {
  const problems = [];
  if (bytes.length !== entry.bytes) problems.push(`has ${bytes.length} bytes, manifest says ${entry.bytes}`);
  if (sha256Hex(bytes) !== entry.sha256) problems.push('sha256 does not match the manifest');
  const dimensions = readAvifDimensions(bytes);
  if (!dimensions) problems.push('no AVIF ispe box found');
  else if (dimensions.width !== entry.width || dimensions.height !== entry.height) {
    problems.push(`is ${dimensions.width}x${dimensions.height}, manifest says ${entry.width}x${entry.height}`);
  }
  return problems;
}

/** Produces the committed file for a vendored entry from its verified R2 object. */
export async function renderVendored(entry, sourceBytes) {
  if (!entry.render) return sourceBytes;
  return sharp(sourceBytes)
    .resize(entry.render.width, entry.render.height, { fit: 'cover' })
    .avif({ quality: entry.render.quality, effort: 4 })
    .toBuffer();
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

/** Offline check of the committed vendored files against the manifest. Returns a list of problems. */
export async function checkVendoredFiles(manifest, manifestDir) {
  const problems = [];
  for (const entry of manifest.entries.filter((item) => item.class === 'vendored')) {
    let bytes;
    try {
      bytes = await readFile(resolve(manifestDir, entry.file));
    } catch {
      problems.push(`${entry.file}: missing`);
      continue;
    }
    for (const problem of verifyFile(entry, bytes)) problems.push(`${entry.file}: ${problem}`);
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
  let remoteCount = 0;

  for (const entry of manifest.entries ?? []) {
    try {
      const downloaded = await fetchObject(manifest.base, entry.objectKey);
      const objectProblems = verifyDownload(entry, downloaded);
      if (objectProblems.length > 0) {
        problems.push(...objectProblems.map((problem) => `${entry.objectKey}: ${problem}`));
        continue;
      }
      if (entry.class === 'rotating-remote') {
        remoteCount += 1;
        if (entry.bytes > entry.byteCap) problems.push(`${entry.objectKey}: ${entry.bytes} bytes is over the ${entry.byteCap} byte cap`);
        continue;
      }
      const rendered = await renderVendored(entry, downloaded.bytes);
      const fileProblems = verifyFile(entry, rendered);
      if (fileProblems.length > 0) {
        problems.push(...fileProblems.map((problem) => `${entry.file} (rendered from ${entry.objectKey}): ${problem}`));
      } else {
        downloads.set(entry.file, rendered);
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
  const vendoredCount = manifest.entries.filter((entry) => entry.class === 'vendored').length;
  console.log(`Verified ${vendoredCount} vendored rendition(s), ${remoteCount} rotating remote frame(s) (not written) and ${Object.keys(manifest.pools ?? {}).length} pool(s) from ${manifest.base}.`);
  console.log(`Wrote ${written} file(s); ${downloads.size - written} already matched.`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
