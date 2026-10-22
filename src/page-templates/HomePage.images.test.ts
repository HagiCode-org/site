import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const showcaseScreenshots = [
  'showcase-session-board',
  'showcase-proposal-workflow',
  'showcase-agent-roster',
  'showcase-agent-cli',
  'showcase-skills-gallery',
  'showcase-vault',
  'showcase-token-usage',
  'showcase-achievements',
  'showcase-git-management',
  'showcase-scheduled-plans',
];

const homePageSource = readFileSync(new URL('./HomePage.astro', import.meta.url), 'utf8');
const siteAssetUrlsSource = readFileSync(new URL('../assets/siteAssetUrls.ts', import.meta.url), 'utf8');

describe('homepage showcase image delivery', () => {
  it.each(showcaseScreenshots)('imports %s from a relative path with no query', (name) => {
    const relativeImport = new RegExp(`import \\w+ from '\\.\\./assets/img/home/${name}\\.png';`, 'u');

    expect(homePageSource, `${name} must be imported relatively with no query`).toMatch(relativeImport);
  });

  it.each(showcaseScreenshots)('keeps %s out of the URL-only asset map', (name) => {
    expect(siteAssetUrlsSource, `${name} must not be mapped in siteAssetUrls.ts`).not.toContain(name);
  });
});
