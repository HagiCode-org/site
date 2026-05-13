import { describe, expect, it } from 'vitest';

import {
  getHagicodePlusDocsIntroductionUrl,
  getPricingContent,
} from '@/lib/homepage-section-copy';

describe('PricingComparisonSection', () => {
  for (const locale of ['en', 'zh-CN'] as const) {
    it(`marks Steam and Hagicode Plus as pending and hides DLC entries for ${locale}`, () => {
      const content = getPricingContent(locale);
      const pendingLabel = locale === 'zh-CN' ? '待定' : 'Pending';

      expect(content.steamEdition.title).toContain(pendingLabel);
      expect(content.turboEdition.title).toContain(pendingLabel);
      expect(content.steamEdition.action).toBeUndefined();
      expect(content.turboEdition.action).toBeUndefined();
      expect(content.rows[0]?.steam.value).toBe(pendingLabel);
      expect(content.rows[0]?.turbo.value).toBe(pendingLabel);
      expect(content.plusDescription).toBe(pendingLabel);
      expect(content.dlcItems).toHaveLength(0);
    });
  }

  it('maps additional locales to the matching localized docs route', () => {
    expect(getHagicodePlusDocsIntroductionUrl('ja-JP')).toBe(
      'https://docs.hagicode.com/ja-JP/bundles/hagicode-plus/',
    );
    expect(getHagicodePlusDocsIntroductionUrl('zh-Hant')).toBe(
      'https://docs.hagicode.com/zh-Hant/bundles/hagicode-plus/',
    );
  });
});
