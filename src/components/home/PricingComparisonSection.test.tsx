import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PricingComparisonSection from '@/components/home/PricingComparisonSection';
import { getPricingContent } from '@/lib/homepage-section-copy';

describe('PricingComparisonSection', () => {
  for (const locale of ['en', 'zh-CN'] as const) {
    it(`shows Windows Store and Hagicode Plus with the requested capability split for ${locale}`, () => {
      const content = getPricingContent(locale);
      const maxConcurrentRow = content.rows.find((row) =>
        row.feature === (locale === 'zh-CN' ? '最大提案并行数' : 'Maximum concurrent proposals')
      );
      const copySwitchingRow = content.rows.find((row) =>
        row.feature === (locale === 'zh-CN' ? '文案切换支持' : 'Copy switching support')
      );

      expect(content.steamEdition.title).toBe('Windows Store');
      expect(content.turboEdition.title).toBe('Hagicode Plus');
      expect(content.steamEdition.action?.href).toBe('https://apps.microsoft.com/detail/9N3PM0N3SVDW');
      expect(content.turboEdition.action).toBeUndefined();
      expect(content.rows[0]?.steam.value).toBe(locale === 'zh-CN' ? '免费' : 'Free');
      expect(content.rows[0]?.turbo.value).toBe(locale === 'zh-CN' ? '待定' : 'Pending');
      expect(maxConcurrentRow?.desktop.value).toBe('6');
      expect(maxConcurrentRow?.container.value).toBe('6');
      expect(maxConcurrentRow?.steam.value).toBe('6');
      expect(maxConcurrentRow?.turbo.value).toBe('32');
      expect(copySwitchingRow?.steam.type).toBe('cross');
      expect(copySwitchingRow?.turbo.type).toBe('check');
    });
  }

  it('renders the pricing comparison without the DLC section or store jump links', () => {
    const content = getPricingContent('zh-CN');
    const markup = renderToStaticMarkup(<PricingComparisonSection content={content} />);

    expect(markup).not.toContain('href="https://store.steampowered.com');
    expect(markup).not.toContain('打开 Steam');
    expect(markup).not.toContain('点击查看');
    expect(markup).not.toContain('DLC 与组合包');
    expect(markup).not.toContain('扩展包列表');
  });
});
