import { describe, expect, it } from 'vitest';
import { getEntityDefinition } from '@hagicode/hagilight-core/entity-definition';
import { getAbsoluteSiteUrl } from '@/lib/locale-routing';
import { SITE_LINKS } from '@/lib/shared/links';
import { DEFAULT_WINDOWS_STORE_URL } from '@/lib/shared/windows-store-link';
import {
  buildEntityStructuredData,
  getEntityOperatingSystems,
  getEntitySameAs,
  githubOrganizationUrl,
} from './entity-structured-data';

type Block = Record<string, unknown>;

const blockOf = (blocks: Block[], type: string): Block => {
  const found = blocks.filter((block) => block['@type'] === type);
  expect(found, `exactly one ${type}`).toHaveLength(1);
  return found[0];
};

describe('entity structured data', () => {
  it('emits one Organization and one SoftwareApplication, both named HagiCode', () => {
    const blocks = buildEntityStructuredData({ locale: 'en-US' }) as Block[];
    expect(blocks.map((block) => block['@type'])).toEqual(['Organization', 'SoftwareApplication']);
    expect(blockOf(blocks, 'Organization').name).toBe('HagiCode');
    expect(blockOf(blocks, 'SoftwareApplication').name).toBe('HagiCode');
    for (const block of blocks) expect(block['@context']).toBe('https://schema.org');
  });

  it('gives SoftwareApplication the required fields and the shared definition as description', () => {
    const app = blockOf(buildEntityStructuredData({ locale: 'en-US' }) as Block[], 'SoftwareApplication');
    expect(app.applicationCategory).toBe('DeveloperApplication');
    expect(app.operatingSystem).toBe('Windows, macOS, Linux');
    expect(app.description).toBe(getEntityDefinition('en-US'));
    expect(String(app.description).startsWith('HagiCode is ')).toBe(true);
  });

  it('uses the zh-CN definition for the zh-CN page and keeps the en-US fallback for other locales', () => {
    const zh = blockOf(buildEntityStructuredData({ locale: 'zh-CN' }) as Block[], 'SoftwareApplication');
    expect(zh.description).toBe(getEntityDefinition('zh-CN'));
    const fr = blockOf(buildEntityStructuredData({ locale: 'fr-FR' }) as Block[], 'SoftwareApplication');
    expect(fr.description).toBe(getEntityDefinition('en-US'));
  });

  it('lists exactly the platforms the desktop page offers, following the macOS flag', () => {
    expect(getEntityOperatingSystems(true)).toEqual(['Windows', 'macOS', 'Linux']);
    expect(getEntityOperatingSystems(false)).toEqual(['Windows', 'Linux']);

    const withMac = blockOf(buildEntityStructuredData({ locale: 'en-US', macDownloadEnabled: true }) as Block[], 'SoftwareApplication');
    expect(withMac.operatingSystem).toBe('Windows, macOS, Linux');

    const withoutMac = blockOf(buildEntityStructuredData({ locale: 'en-US', macDownloadEnabled: false }) as Block[], 'SoftwareApplication');
    expect(withoutMac.operatingSystem).toBe('Windows, Linux');
  });

  it('points downloadUrl and url at the canonical desktop page of the locale', () => {
    const siteBase = '';
    for (const locale of ['en-US', 'zh-CN'] as const) {
      const desktop = getAbsoluteSiteUrl('/desktop/', locale, siteBase);
      const app = blockOf(buildEntityStructuredData({ locale, siteBase }) as Block[], 'SoftwareApplication');
      expect(app.downloadUrl).toBe(desktop);
      expect(app.url).toBe(desktop);
      expect(desktop).toMatch(/^https:\/\//);
    }
  });

  it('lists the GitHub organization, the Microsoft Store listing and the community invite in sameAs', () => {
    const expected = [
      githubOrganizationUrl(SITE_LINKS.github.prod),
      DEFAULT_WINDOWS_STORE_URL,
      SITE_LINKS.discord.prod,
    ];
    expect(getEntitySameAs()).toEqual(expected);
    expect(expected[0]).toBe('https://github.com/HagiCode-org');

    const blocks = buildEntityStructuredData({ locale: 'en-US' }) as Block[];
    expect(blockOf(blocks, 'Organization').sameAs).toEqual(expected);
    expect(blockOf(blocks, 'SoftwareApplication').sameAs).toEqual(expected);
  });

  it('never invents an offer, a price, a rating or a version', () => {
    const app = blockOf(buildEntityStructuredData({ locale: 'en-US' }) as Block[], 'SoftwareApplication');
    for (const key of ['offers', 'price', 'priceCurrency', 'aggregateRating', 'softwareVersion']) {
      expect(key in app, key).toBe(false);
    }
  });

  it('derives the organization URL from the repository link', () => {
    expect(githubOrganizationUrl('https://github.com/HagiCode-org/site')).toBe('https://github.com/HagiCode-org');
    expect(() => githubOrganizationUrl('https://github.com/')).toThrow(TypeError);
  });
});
