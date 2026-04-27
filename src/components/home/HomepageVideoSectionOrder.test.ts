import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const rootDir = fileURLToPath(new URL('../../..', import.meta.url)).replace(/\/$/, '');

function readHomepage(relativePath: string) {
  return readFileSync(`${rootDir}/${relativePath}`, 'utf8');
}

function readVideoShowcaseUsage(source: string) {
  const start = source.indexOf('<VideoShowcase');
  const end = source.indexOf('/>', start);

  return source.slice(start, end);
}

describe('localized homepage video section order', () => {
  it('places the English product overview video inside Hero before later homepage sections', () => {
    const source = readHomepage('src/pages/index.astro');

    const heroUsage = source.slice(source.indexOf('<HeroSection'), source.indexOf('/>', source.indexOf('<HeroSection')));

    expect(heroUsage).toContain('productOverviewVideo');
    expect(heroUsage).toContain('featuredVideos: featuredHomepageVideos');
    expect(source).not.toContain('<ProductOverviewVideoSection');
    expect(source.indexOf('<HeroSection')).toBeLessThan(source.indexOf('<ActivityMetricsSection'));
    expect(source.indexOf('<ActivityMetricsSection')).toBeLessThan(source.indexOf('<FeaturesShowcase'));
    expect(source.indexOf('<ShowcaseSection')).toBeLessThan(source.indexOf('<VideoShowcase'));
    expect(readVideoShowcaseUsage(source)).not.toContain('featuredVideos={featuredHomepageVideos}');
  });

  it('places the Chinese product overview video inside Hero before later homepage sections', () => {
    const source = readHomepage('src/pages/zh-CN/index.astro');

    const heroUsage = source.slice(source.indexOf('<HeroSection'), source.indexOf('/>', source.indexOf('<HeroSection')));

    expect(heroUsage).toContain('productOverviewVideo');
    expect(heroUsage).toContain('featuredVideos: featuredHomepageVideos');
    expect(source).not.toContain('<ProductOverviewVideoSection');
    expect(source.indexOf('<HeroSection')).toBeLessThan(source.indexOf('<ActivityMetricsSection'));
    expect(source.indexOf('<ActivityMetricsSection')).toBeLessThan(source.indexOf('<FeaturesShowcase'));
    expect(source.indexOf('<ShowcaseSection')).toBeLessThan(source.indexOf('<VideoShowcase'));
    expect(readVideoShowcaseUsage(source)).not.toContain('featuredVideos={featuredHomepageVideos}');
  });
});
