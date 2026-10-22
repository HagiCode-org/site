import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import manifest from '../r2-images.manifest.json';
import { SUPPORTED_SITE_LOCALES } from '../src/i18n/locale-metadata';
import { checkVendoredFiles, validateManifestShape } from '../scripts/import-r2-images.mjs';

const SITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_ROOT = join(SITE_ROOT, 'src');
const R2_ROOT = join(SRC_ROOT, 'assets', 'r2');
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.astro', '.mjs', '.js', '.css', '.json']);
const R2_ORIGIN = 'img-gen.hagicode.com';
const POOL_MIN_ENTRIES = 12;
const POOL_MAX_ENTRIES = 200;
const MAX_RENDITION_WIDTH = 960;

interface VendoredEntry {
  id: string;
  surface: string;
  objectKey: string;
  file: string;
  bytes: number;
  width: number;
  height: number;
  render: { width: number } | null;
  source: { width: number };
  decorative: boolean;
  pool?: string;
}
interface RemoteEntry {
  id: string;
  objectKey: string;
  file: null;
  bytes: number;
  byteCap: number;
  decorative: boolean;
}
const vendored = manifest.entries.filter((entry) => entry.class === 'vendored') as unknown as VendoredEntry[];
const remote = manifest.entries.filter((entry) => entry.class === 'rotating-remote') as unknown as RemoteEntry[];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function sourceFiles() {
  return walk(SRC_ROOT).filter((file) => SOURCE_EXTENSIONS.has(file.slice(file.lastIndexOf('.'))));
}

/** Every module specifier in a file: static imports, re-exports, side-effect and dynamic imports. */
function specifiersIn(file: string): string[] {
  const source = readFileSync(file, 'utf8');
  return [...source.matchAll(/\b(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
}

function toPosix(path: string) {
  return relative(SITE_ROOT, path).split(sep).join('/');
}

describe('r2-images manifest', () => {
  it('is schema-valid', () => {
    expect(validateManifestShape(manifest)).toEqual([]);
  });

  it('matches the vendored files byte for byte, by sha256 and AVIF dimensions', async () => {
    expect(await checkVendoredFiles(manifest, SITE_ROOT)).toEqual([]);
  });

  it('lists exactly the vendored files under src/assets/r2 (no orphan, no missing, no remote frame on disk)', () => {
    const onDisk = walk(R2_ROOT).map(toPosix).sort();
    const listed = vendored.map((entry) => entry.file).sort();

    expect(onDisk).toEqual(listed);
  });

  it('keeps each vendored entry a rendition of its R2 object, not the 1024 px source', () => {
    for (const entry of vendored) {
      expect(entry.render, `${entry.id} has no render`).toBeTruthy();
      expect(entry.width, `${entry.id} is larger than ${MAX_RENDITION_WIDTH} px`).toBeLessThanOrEqual(MAX_RENDITION_WIDTH);
      expect(entry.source.width, `${entry.id} source`).toBe(1024);
    }
  });

  it('gives every entry a surface and the right marking', () => {
    for (const entry of manifest.entries) {
      expect(entry.surface, entry.id).toMatch(/^(home|about|site-footer)/);
      const alt = (entry as { alt?: Record<string, string> }).alt;
      if (entry.decorative) {
        expect(alt, `${entry.id} is decorative and must not carry alt text`).toBeUndefined();
      } else {
        expect(Object.keys(alt ?? {}).sort(), `${entry.id} needs alt text for every locale`).toEqual(
          [...SUPPORTED_SITE_LOCALES].sort(),
        );
      }
    }
  });

  it('imports every vendored entry from a source file with a relative path and no query', () => {
    for (const entry of vendored) {
      const target = resolve(SITE_ROOT, entry.file);
      const usages = sourceFiles().flatMap((file) =>
        specifiersIn(file)
          .filter((specifier) => resolve(dirname(file), specifier.split('?')[0]) === target)
          .map((specifier) => ({ file, specifier })),
      );

      expect(usages.length, `${entry.id} is used by no source file`).toBeGreaterThan(0);
      for (const usage of usages) {
        expect(usage.specifier.startsWith('.'), `${entry.id} must be imported with a relative path`).toBe(true);
        expect(usage.specifier.includes('?'), `${entry.id} must not use a query such as ?url`).toBe(false);
      }
    }
  });

  it('reads every rotating remote frame from the manifest, in a source file that names the class', () => {
    const readers = sourceFiles().filter((file) => readFileSync(file, 'utf8').includes("'rotating-remote'"));

    expect(remote.length).toBeGreaterThan(0);
    expect(readers.length).toBeGreaterThan(0);
    for (const entry of remote) {
      expect(entry.file, `${entry.id} must have no vendored file`).toBeNull();
      expect(entry.byteCap, `${entry.id} needs a byte cap`).toBeGreaterThan(0);
      expect(entry.bytes, `${entry.id} is over its byte cap`).toBeLessThanOrEqual(entry.byteCap);
    }
  });

  it('keeps every pool referenced, outside every entry, and within its entry count', () => {
    const entryKeys = new Set(manifest.entries.map((entry) => entry.objectKey));

    for (const [name, pool] of Object.entries(manifest.pools)) {
      const users = manifest.entries.filter((entry) => entry.pool === name);
      expect(users.length, `pool ${name} is used by no entry`).toBeGreaterThan(0);
      expect(users.every((entry) => entry.decorative), `pool ${name} is used by a meaningful image`).toBe(true);
      expect(pool.entries.length, `pool ${name} entry count`).toBeGreaterThanOrEqual(POOL_MIN_ENTRIES);
      expect(pool.entries.length, `pool ${name} entry count`).toBeLessThanOrEqual(POOL_MAX_ENTRIES);

      const keys = pool.entries.map((item) => item.objectKey);
      expect(new Set(keys).size, `pool ${name} lists a key twice`).toBe(keys.length);
      for (const item of pool.entries) {
        expect(item.objectKey.startsWith(`${pool.album}/`), `${item.objectKey} is outside ${pool.album}`).toBe(true);
        expect(item.bytes, `${item.objectKey} is over the pool cap`).toBeLessThanOrEqual(pool.maxBytes);
        expect(entryKeys.has(item.objectKey), `${item.objectKey} is also an entry and must not repeat in its pool`).toBe(false);
      }
    }
  });

  it('keeps vendored files within the per-file and total budgets; remote frames are not counted', () => {
    for (const entry of vendored) {
      expect(entry.bytes, `${entry.file} is over the per-file budget (${manifest.budgets.perFileBytes} bytes)`).toBeLessThanOrEqual(
        manifest.budgets.perFileBytes,
      );
    }
    const total = vendored.reduce((sum, entry) => sum + entry.bytes, 0);
    expect(total, `vendored R2 images are over the total budget (${manifest.budgets.totalBytes} bytes)`).toBeLessThanOrEqual(
      manifest.budgets.totalBytes,
    );
  });
});

describe('Astro asset rule for R2 images', () => {
  it('never references R2 with a ?url query, a public/ path or a literal origin in source', () => {
    for (const file of sourceFiles()) {
      const source = readFileSync(file, 'utf8');
      expect(source, `${toPosix(file)} hot-links the R2 origin`).not.toContain(R2_ORIGIN);
      for (const specifier of specifiersIn(file)) {
        if (/\/r2\//.test(specifier)) {
          expect(specifier.includes('?'), `${toPosix(file)} imports ${specifier} with a query`).toBe(false);
          expect(specifier.includes('public/'), `${toPosix(file)} imports ${specifier} from public/`).toBe(false);
        }
      }
    }
  });

  it('keeps the R2 origin only in the manifest, which pool and remote frame URLs are built from', () => {
    expect(manifest.base).toBe(`https://${R2_ORIGIN}`);
    expect(walk(join(SITE_ROOT, 'public')).filter((file) => /\/r2[-/]/.test(file))).toEqual([]);
  });
});
