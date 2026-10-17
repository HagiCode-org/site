import { describe, expect, it } from 'vitest';

import {
  buildSiteEntryRedirectUrl,
  getStoredSiteLocale,
  resolveClientSiteLocale,
  resolveSiteEntryLocale,
  traceSiteEntryLocale,
} from './site-entry-locale';

describe('site entry locale resolution', () => {
  it('uses the browser locale on first visit and persists it', () => {
    expect(
      resolveSiteEntryLocale({
        clientLanguages: ['zh-CN', 'en-US'],
      }),
    ).toEqual({
      locale: 'zh-CN',
      shouldPersist: true,
    });
  });

  it('prefers stored locale over browser locale', () => {
    expect(
      resolveSiteEntryLocale({
        storedLocale: 'ja-JP',
        clientLanguages: ['zh-CN'],
      }),
    ).toEqual({
      locale: 'ja-JP',
      shouldPersist: false,
    });
  });

  it('maps explicit language params and persists valid requests', () => {
    expect(
      resolveSiteEntryLocale({
        requestedLang: 'zh-HK',
        storedLocale: 'en-US',
        clientLanguages: ['fr-FR'],
      }),
    ).toEqual({
      locale: 'zh-Hant',
      shouldPersist: true,
    });
  });

  it('falls back after invalid language params without persisting the fallback', () => {
    expect(
      resolveSiteEntryLocale({
        requestedLang: 'unknown-locale',
        storedLocale: 'fr-FR',
        clientLanguages: ['ja-JP'],
      }),
    ).toEqual({
      locale: 'fr-FR',
      shouldPersist: false,
    });
  });

  it('reads both current and legacy storage keys', () => {
    expect(getStoredSiteLocale('pt-BR')).toBe('pt-BR');
    expect(getStoredSiteLocale('unsupported-locale')).toBeNull();
    expect(getStoredSiteLocale(null, 'zh-TW')).toBe('zh-Hant');
  });

  it('normalizes browser language fallbacks by language family', () => {
    expect(resolveClientSiteLocale(['fr-CA'])).toBe('fr-FR');
    expect(resolveClientSiteLocale(['es-MX'])).toBe('es-ES');
  });

  it('builds localized redirect URLs and strips the lang query parameter', () => {
    expect(
      buildSiteEntryRedirectUrl({
        currentUrl: new URL('https://www.hagicode.com/desktop/?lang=zh-HK&utm=campaign#download'),
        targetPath: '/desktop/',
        clientLanguages: ['en-US'],
      }),
    ).toEqual({
      locale: 'zh-Hant',
      shouldPersist: true,
      shouldRedirect: true,
      targetUrl: 'https://www.hagicode.com/zh-Hant/desktop/?utm=campaign#download',
    });
  });

  it('supports non-root site bases when computing the redirect target', () => {
    expect(
      buildSiteEntryRedirectUrl({
        currentUrl: new URL('https://www.hagicode.com/site/about/?ref=promo'),
        targetPath: '/about/',
        siteBase: '/site/',
        legacyStoredLocale: 'ja-JP',
      }),
    ).toEqual({
      locale: 'ja-JP',
      shouldPersist: false,
      shouldRedirect: true,
      targetUrl: 'https://www.hagicode.com/site/ja-JP/about/?ref=promo',
    });
  });
});

describe('site entry locale source', () => {
  it('reports the input that decided the locale, in priority order', () => {
    expect(traceSiteEntryLocale({ requestedLang: 'ja', storedLocale: 'fr-FR', clientLanguages: ['de'] }).source).toBe('query');
    expect(traceSiteEntryLocale({ storedLocale: 'fr-FR', clientLanguages: ['de'] }).source).toBe('stored');
    expect(traceSiteEntryLocale({ legacyStoredLocale: 'zh-TW', clientLanguages: ['de'] }).source).toBe('stored');
    expect(traceSiteEntryLocale({ clientLanguages: ['xx', 'de-AT'] }).source).toBe('browser');
    expect(traceSiteEntryLocale({ clientLanguages: ['xx'] })).toEqual({
      locale: 'en-US',
      shouldPersist: true,
      source: 'default',
    });
  });

  it('skips an unsupported ?lang= and never persists what it fell back to', () => {
    expect(traceSiteEntryLocale({ requestedLang: 'nope', clientLanguages: ['de'] })).toEqual({
      locale: 'de-DE',
      shouldPersist: false,
      source: 'browser',
    });
    expect(traceSiteEntryLocale({ requestedLang: 'nope', clientLanguages: [] })).toEqual({
      locale: 'en-US',
      shouldPersist: false,
      source: 'default',
    });
  });
});
