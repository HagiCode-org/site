import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wrapperPath = path.join(srcDir, 'components/GoogleAnalytics.astro');

function readSource(file: string) {
  return readFileSync(file, 'utf8');
}

function listAstroFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listAstroFiles(entryPath);
    return entry.name.endsWith('.astro') ? [entryPath] : [];
  });
}

describe('Website Google Analytics component', () => {
  it('delegates to the shared Hagilight component with the existing measurement id', () => {
    const source = readSource(wrapperPath);

    expect(source).toContain("from '@hagicode/hagilight-core/GoogleAnalytics'");
    expect(source).toContain("'G-EN03FMT2Q4'");
    expect(source).toContain('<GoogleAnalytics measurementId={measurementId} />');
  });

  it('keeps the gtag bootstrap in one place, in the shared component', () => {
    for (const file of listAstroFiles(srcDir)) {
      const source = readSource(file);
      expect(source, path.relative(srcDir, file)).not.toContain('googletagmanager.com');
      expect(source, path.relative(srcDir, file)).not.toContain('function gtag');
    }
  });

  it('renders it once in each of the six page templates', () => {
    const importers = listAstroFiles(srcDir).filter((file) => file !== wrapperPath && readSource(file).includes('GoogleAnalytics'));

    expect(importers.map((file) => path.basename(file)).sort()).toEqual([
      'AboutSnapshotDocument.astro',
      'ContainerPage.astro',
      'DesktopPage.astro',
      'HomePage.astro',
      'LandingRedirectPage.astro',
      'StructuredArticlePage.astro',
    ]);

    for (const file of importers) {
      const source = readSource(file);
      expect(source.match(/import GoogleAnalytics from '@\/components\/GoogleAnalytics\.astro';/g)).toHaveLength(1);
      expect(source.match(/<GoogleAnalytics \/>/g)).toHaveLength(1);
    }
  });

  it('loads Google Analytics only in production builds', () => {
    const core = readSource(
      path.resolve(srcDir, '../node_modules/@hagicode/hagilight-core/GoogleAnalytics.astro'),
    );

    expect(core).toMatch(/import\.meta\.env\.PROD && \(/);
    expect(core).toContain("<script async src={scriptUrl}></script>");
    expect(core.match(/installGaEventTracking\(\);/g)).toHaveLength(1);
  });
});
