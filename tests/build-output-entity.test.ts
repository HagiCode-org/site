import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getEntityDefinition } from '@hagicode/hagilight-core/entity-definition';
import { SUPPORTED_SITE_LOCALES } from '@/i18n/locale-metadata';
import { getEntitySameAs } from '@/lib/entity-structured-data';

/**
 * Build-output contract for the entity data. Runs against `dist/` after `npm run build`; it is skipped
 * (and says so) when no build exists, so `npm test` on a clean checkout does not pretend to have checked it.
 */

const DIST = join(process.cwd(), 'dist');
const BUILT = existsSync(join(DIST, 'llms.txt'));
const SCRIPT_PATTERN = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu;

type Block = Record<string, unknown>;

function jsonLdBlocks(html: string): Block[] {
  return [...html.matchAll(SCRIPT_PATTERN)].map(([, json]) => JSON.parse(json) as Block);
}

function readBuilt(path: string): string {
  return readFileSync(join(DIST, path), 'utf8');
}

describe.skipIf(!BUILT)('built entity data (requires npm run build)', () => {
  it('llms.txt starts with the HagiCode name and carries the en-US definition', () => {
    const llms = readBuilt('llms.txt');
    expect(llms.startsWith('# HagiCode\n')).toBe(true);
    expect(llms).toContain(`> ${getEntityDefinition('en-US')}`);
    expect(llms).not.toMatch(/has moved/u);
    expect(llms).not.toMatch(/Hagicode/u);
  });

  for (const locale of SUPPORTED_SITE_LOCALES) {
    for (const [page, path] of [
      ['homepage', `${locale}/index.html`],
      ['desktop page', `${locale}/desktop/index.html`],
    ] as const) {
      it(`${locale} ${page} has exactly one Organization and one SoftwareApplication, both named HagiCode`, () => {
        const html = readBuilt(path);
        const blocks = jsonLdBlocks(html);
        const organizations = blocks.filter((block) => block['@type'] === 'Organization');
        const applications = blocks.filter((block) => block['@type'] === 'SoftwareApplication');
        expect(organizations).toHaveLength(1);
        expect(applications).toHaveLength(1);
        expect(organizations[0].name).toBe('HagiCode');
        expect(applications[0].name).toBe('HagiCode');
        expect(applications[0].applicationCategory).toBe('DeveloperApplication');
        expect(typeof applications[0].operatingSystem).toBe('string');
        expect(applications[0].description).toBe(getEntityDefinition(locale));
        expect(organizations[0].sameAs).toEqual(getEntitySameAs());
        expect(applications[0].sameAs).toEqual(getEntitySameAs());
        expect('offers' in applications[0]).toBe(false);
      });

      it(`${locale} ${page} shows the definition as visible text`, () => {
        expect(readBuilt(path)).toContain(getEntityDefinition(locale));
      });
    }
  }

  it('the en-US and zh-CN comparison pages open with the definition before the summary', () => {
    for (const locale of ['en-US', 'zh-CN'] as const) {
      const path = `${locale}/claude-vs-hagicode/index.html`;
      const html = readBuilt(path);
      const definitionAt = html.indexOf('compare-page__definition');
      const summaryAt = html.indexOf('compare-page__subtitle');
      expect(definitionAt).toBeGreaterThan(-1);
      expect(summaryAt).toBeGreaterThan(definitionAt);
      expect(html).toContain(getEntityDefinition(locale));
    }
  });
});
