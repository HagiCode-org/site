import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PricingComparisonSection from '@/components/home/PricingComparisonSection';
import { getPricingContent } from '@/lib/homepage-section-copy';

describe('PricingComparisonSection', () => {
  for (const locale of ['en', 'zh-CN'] as const) {
    it(`shows Microsoft Store footnotes with the docs-aligned capability split for ${locale}`, () => {
      const content = getPricingContent(locale);
      const maxConcurrentRow = content.rows.find((row) =>
        row.feature === (locale === 'zh-CN' ? '最大提案并行数' : 'Maximum concurrent proposals')
      );
      const documentThemesRow = content.rows.find((row) =>
        row.feature === (locale === 'zh-CN' ? '文档主题' : 'Document themes')
      );

      expect(content.microsoftStoreEdition.title).toBe('Microsoft Store');
      expect(content.microsoftStoreEdition.action?.href).toBe('https://apps.microsoft.com/detail/9N3PM0N3SVDW');
      expect(content.rows.map((row) => row.feature)).not.toContain(locale === 'zh-CN' ? '定价' : 'Pricing');
      expect(maxConcurrentRow?.desktop.value).toBe('3');
      expect(maxConcurrentRow?.container.value).toBe('3');
      expect(maxConcurrentRow?.microsoftStore.value).toBe('32');
      expect(maxConcurrentRow?.microsoftStore.footnote).toBe('1');
      expect(documentThemesRow?.desktop.type).toBe('cross');
      expect(documentThemesRow?.microsoftStore.type).toBe('check');
      expect(documentThemesRow?.microsoftStore.footnote).toBe('1');
      expect(content.unlockFootnoteMarker).toBe('1');
    });
  }

  it('renders the pricing comparison without Hagicode Plus or Microsoft Store labels', () => {
    const content = getPricingContent('zh-CN');
    const markup = renderToStaticMarkup(<PricingComparisonSection content={content} />);

    expect(markup).not.toContain('href="https://store.steampowered.com');
    expect(markup).not.toContain('Microsoft Store');
    expect(markup).not.toContain('Hagicode Plus');
    expect(markup).toContain('Microsoft Store');
    expect(markup).toContain('[1]');
  });
});
