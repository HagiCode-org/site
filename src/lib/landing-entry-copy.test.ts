import { describe, expect, it } from 'vitest';

import { SUPPORTED_SITE_LOCALES } from '@/i18n/locale-metadata';
import { LANDING_ENTRY_COPY, getLandingEntryCopy } from './landing-entry-copy';

describe('landing entry copy', () => {
  it('covers every supported site locale with every string', () => {
    for (const locale of SUPPORTED_SITE_LOCALES) {
      const copy = getLandingEntryCopy(locale);
      for (const [key, value] of Object.entries(copy)) {
        expect(value.trim(), `${locale}.${key}`).not.toBe('');
      }
    }
    expect(Object.keys(LANDING_ENTRY_COPY).sort()).toEqual([...SUPPORTED_SITE_LOCALES].sort());
  });

  it('keeps the product name in the heading of every locale', () => {
    for (const locale of SUPPORTED_SITE_LOCALES) {
      expect(getLandingEntryCopy(locale).opening).toContain('HagiCode');
    }
  });
});
