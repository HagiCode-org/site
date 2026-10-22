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

  it('lists exactly the vendored files under src/assets/r2 (no orphan file, no missing file)', () => {
    const vendored = walk(R2_ROOT).map(toPosix).sort();
    const listed = manifest.entries.map((entry) => entry.file).sort();

    expect(vendored).toEqual(listed);
  });

  it('gives every entry a surface, a usage in a source file and the right marking', () => {
    for (const entry of manifest.entries) {
      expect(entry.surface, entry.id).toMatch(/^(home|about|site-footer)/);
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

  it('keeps every pool referenced, outside the defaults, and within its entry count', () => {
    const defaultKeys = new Set(manifest.entries.map((entry) => entry.objectKey));

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
        expect(defaultKeys.has(item.objectKey), `${item.objectKey} is a default and must not repeat in its pool`).toBe(false);
      }
    }
  });

  it('stays within the per-file and total budgets', () => {
    const sizes = manifest.entries.map((entry) => entry.bytes);

    for (const entry of manifest.entries) {
      expect(entry.bytes, `${entry.file} is over the per-file budget (${manifest.budgets.perFileBytes} bytes)`).toBeLessThanOrEqual(
        manifest.budgets.perFileBytes,
      );
    }
    expect(
      sizes.reduce((sum, size) => sum + size, 0),
      `vendored R2 images are over the total budget (${manifest.budgets.totalBytes} bytes)`,
    ).toBeLessThanOrEqual(manifest.budgets.totalBytes);
  });
});

describe('Astro asset rule for R2 images', () => {
  it('never references R2 with a ?url query, a public/ path or a remote URL in source', () => {
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

  it('keeps the R2 origin only in the manifest, which the pool URLs are built from', () => {
    expect(manifest.base).toBe(`https://${R2_ORIGIN}`);
    expect(walk(join(SITE_ROOT, 'public')).filter((file) => /\/r2[-/]/.test(file))).toEqual([]);
  });
});
