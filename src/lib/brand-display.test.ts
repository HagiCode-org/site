import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Regression guard for the display spelling. The product name shown to people is "HagiCode".
 * This test fails when a display-copy source reintroduces "Hagicode" (capital H, lowercase rest).
 *
 * Literal identifiers are not display text and are never matched: domains (`hagicode.com`), package
 * names (`@hagicode/...`), URL paths, keys such as `choosePaneHagicode`, and file names such as
 * `Hagicode.Desktop-1.2.3.exe`. The recorded exemptions below are the only display-looking literals kept.
 * See openspec/changes/unify-hagicode-branding-and-add-entity-json-ld/brand-audit.md for the full inventory.
 */

const ROOT = process.cwd();

const DISPLAY_SOURCE_DIRECTORIES = [
  'src/i18n/locales',
  'src/components',
  'src/page-templates',
  'src/pages',
];

const DISPLAY_SOURCE_FILES = ['src/lib/site-page-copy.ts'];

const SOURCE_EXTENSIONS = new Set(['.yml', '.yaml', '.ts', '.tsx', '.astro', '.json']);

// Exempt literals: the macOS bundle path whose real name is not verified yet (brand-audit section 4/5).
const EXEMPT_LITERALS = ['/Applications/Hagicode.app'];

const DISPLAY_NAME_PATTERN = /(?<![A-Za-z0-9_/\-.@:])Hagicode(?![A-Za-z0-9_]|\.[A-Za-z])/u;

function isTestFile(path: string): boolean {
  return /\.test\.[cm]?[jt]sx?$/u.test(path) || path.includes('/__tests__/');
}

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return walk(path);
    return SOURCE_EXTENSIONS.has(extname(name)) && !isTestFile(path) ? [path] : [];
  });
}

function displaySourceFiles(): string[] {
  const directories = DISPLAY_SOURCE_DIRECTORIES.flatMap((directory) => walk(join(ROOT, directory)));
  return [...directories, ...DISPLAY_SOURCE_FILES.map((file) => join(ROOT, file))];
}

function displayViolations(): string[] {
  const violations: string[] = [];
  for (const file of displaySourceFiles()) {
    readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
      let scanned = line;
      for (const literal of EXEMPT_LITERALS) scanned = scanned.split(literal).join('');
      if (DISPLAY_NAME_PATTERN.test(scanned)) {
        violations.push(`${relative(ROOT, file)}:${index + 1}: ${line.trim().slice(0, 120)}`);
      }
    });
  }
  return violations;
}

describe('display spelling of the product name', () => {
  it('scans the display-copy sources', () => {
    const files = displaySourceFiles();
    expect(files.length).toBeGreaterThan(50);
    expect(files.some((file) => file.endsWith('site-page-copy.ts'))).toBe(true);
  });

  it('keeps "HagiCode" in display copy and rejects "Hagicode" outside the recorded exemptions', () => {
    expect(displayViolations()).toEqual([]);
  });

  it('does not match identifiers, domains or the exempt bundle path', () => {
    expect(DISPLAY_NAME_PATTERN.test('const choosePaneHagicode = 1;')).toBe(false);
    expect(DISPLAY_NAME_PATTERN.test('https://www.hagicode.com/')).toBe(false);
    expect(DISPLAY_NAME_PATTERN.test('@hagicode/hagilight')).toBe(false);
    expect(DISPLAY_NAME_PATTERN.test('Hagicode.Desktop-1.2.3.exe')).toBe(false);
    expect(DISPLAY_NAME_PATTERN.test('/Applications/Hagicode.app')).toBe(false);
    expect(DISPLAY_NAME_PATTERN.test('Download Hagicode Desktop')).toBe(true);
    expect(DISPLAY_NAME_PATTERN.test('Hagicode-Produkt')).toBe(true);
  });
});
