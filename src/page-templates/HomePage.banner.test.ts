import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('homepage promotion integration', () => {
  it('mounts the shared Astro banner once with the page locale before the footer', () => {
    const source = readFileSync(new URL('./HomePage.astro', import.meta.url), 'utf8');

    expect(source).toContain("import PromotoBanner from '@hagicode/hagilight-core/PromotoBanner'");
    expect(source.match(/<PromotoBanner locale=\{locale\} \/>/gu)).toHaveLength(1);
    expect(source.indexOf('<PromotoBanner')).toBeLessThan(source.indexOf('<SiteFooter'));
    expect(source).not.toContain('PromoteCard');
  });
});
