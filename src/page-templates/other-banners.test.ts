import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const templates = [
  { file: new URL('./DesktopPage.astro', import.meta.url), localeProp: 'locale' },
  { file: new URL('./ContainerPage.astro', import.meta.url), localeProp: 'locale' },
  { file: new URL('../components/about/AboutSnapshotDocument.astro', import.meta.url), localeProp: 'currentLocale' },
  { file: new URL('../components/structured-article/StructuredArticlePage.astro', import.meta.url), localeProp: 'locale' },
] as const;

describe('site template promotion integration', () => {
  for (const { file, localeProp } of templates) {
    it(`${file.pathname.split('/').slice(-1)[0]} mounts the shared banner before the shared footer without a legacy card`, () => {
      const source = readFileSync(file, 'utf8');

      expect(source).toContain("import PromotoBanner from '@hagicode/hagilight-core/PromotoBanner'");
      expect(source).toContain(`<PromotoBanner locale={${localeProp}} />`);
      expect(source).toContain('<SiteFooter');
      expect(source.indexOf('<PromotoBanner')).toBeLessThan(source.indexOf('<SiteFooter'));
      expect(source).not.toContain('PromoteCard');
    });
  }
});
