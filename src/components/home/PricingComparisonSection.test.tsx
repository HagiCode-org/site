import { describe, expect, it } from 'vitest';

import { DEFAULT_STEAM_STORE_URL } from '@/lib/shared/steam-store-link';

import {
  getHagicodePlusDocsIntroductionUrl,
  getPricingContent,
  HAGICODE_PLUS_BUNDLE_STEAM_URL,
  TURBO_ENGINE_STEAM_STORE_URL,
} from './PricingComparisonSection';

describe('PricingComparisonSection', () => {
  for (const locale of ['en', 'zh-CN'] as const) {
    it(`keeps the generic Steam entry on the base app while routing Hagicode Plus docs and purchase CTAs correctly for ${locale}`, () => {
      const content = getPricingContent(locale);
      const hagicodePlusCard = content.dlcItems.find((item) => item.title === 'Hagicode Plus');

      expect(content.steamEdition.action.href).toBe(DEFAULT_STEAM_STORE_URL);
      expect(content.turboEdition.action.href).toBe(getHagicodePlusDocsIntroductionUrl(locale));
      expect(content.rows[0]?.steam.href).toBe(DEFAULT_STEAM_STORE_URL);
      expect(content.rows[0]?.turbo.href).toBe(HAGICODE_PLUS_BUNDLE_STEAM_URL);
      expect(content.rows[0]?.turbo.href).not.toBe(TURBO_ENGINE_STEAM_STORE_URL);
      expect(content.dlcItems[0]?.action.href).toBe(DEFAULT_STEAM_STORE_URL);
      expect(content.dlcItems[1]?.action.href).toBe(TURBO_ENGINE_STEAM_STORE_URL);
      expect(hagicodePlusCard?.action.href).toBe(HAGICODE_PLUS_BUNDLE_STEAM_URL);
      expect(hagicodePlusCard?.action.href).not.toBe(TURBO_ENGINE_STEAM_STORE_URL);
      expect(content.dlcItems.at(-1)?.action.href).toBe(DEFAULT_STEAM_STORE_URL);
    });
  }
});
