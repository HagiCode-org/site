import { describe, expect, it } from 'vitest';
import { SUPPORTED_SITE_LOCALES } from '@/i18n/locale-metadata';
import {
  buildLegacyEnglishPath,
  getCanonicalLocalePrefix,
  getAbsoluteSiteUrl,
  getAlternateLocalePaths,
  getLocalizedPath,
  getLocaleSwitchPath,
  hasExplicitLocalePrefix,
  joinWithSiteBase,
  resolveLocaleFromPathname,
  stripLocalePrefix,
} from './locale-routing';

describe('locale routing', () => {
  it('treats unprefixed routes as the canonical default locale', () => {
    expect(resolveLocaleFromPathname('/')).toBe('en-US');
    expect(resolveLocaleFromPathname('/desktop/')).toBe('en-US');
    expect(resolveLocaleFromPathname('/container/')).toBe('en-US');
  });

  it('resolves explicit locale prefixes across the full locale catalog', () => {
    expect(resolveLocaleFromPathname('/zh-CN/')).toBe('zh-CN');
    expect(resolveLocaleFromPathname('/zh-CN/desktop/')).toBe('zh-CN');
    expect(resolveLocaleFromPathname('/ja-JP/container/')).toBe('ja-JP');
    expect(resolveLocaleFromPathname('/unsupported/about/')).toBe('en-US');
    expect(resolveLocaleFromPathname('/fr-FR/about/')).toBe('fr-FR');
    expect(resolveLocaleFromPathname('/zh-TW/about/')).toBe('zh-Hant');
    expect(resolveLocaleFromPathname('/zh-HK/about/')).toBe('zh-Hant');
  });

  it('keeps legacy /en routes mapped to English', () => {
    expect(resolveLocaleFromPathname('/en/')).toBe('en-US');
    expect(getCanonicalLocalePrefix('/en/about/')).toBe('en-US');
    expect(hasExplicitLocalePrefix('/en/about/')).toBe(true);
    expect(stripLocalePrefix('/en/desktop/')).toBe('/desktop');
    expect(stripLocalePrefix('/en/container/')).toBe('/container');
    expect(buildLegacyEnglishPath('/desktop/')).toBe('/en/desktop/');
  });

  it('builds localized counterparts for matching pages', () => {
    expect(getLocalizedPath('/', 'en-US')).toBe('/en-US/');
    expect(getLocalizedPath('/', 'zh-CN')).toBe('/zh-CN/');
    expect(getLocalizedPath('/desktop/', 'zh-CN')).toBe('/zh-CN/desktop/');
    expect(getLocalizedPath('/container/', 'zh-CN')).toBe('/zh-CN/container/');
    expect(getLocalizedPath('/zh-CN/', 'en-US')).toBe('/en-US/');
    expect(getLocalizedPath('/zh-CN/desktop/', 'en-US')).toBe('/en-US/desktop/');
    expect(getLocalizedPath('/zh-CN/container/', 'en-US')).toBe('/en-US/container/');
    expect(getLocalizedPath('/en/desktop/', 'en-US')).toBe('/en-US/desktop/');
    expect(getLocalizedPath('/desktop/', 'ja-JP')).toBe('/ja-JP/desktop/');
  });

  it('preserves query strings and hash fragments while switching locales', () => {
    expect(
      getLocaleSwitchPath('zh-CN', {
        pathname: '/desktop/',
        search: '?channel=beta',
        hash: '#download',
      }),
    ).toBe('/zh-CN/desktop/?channel=beta#download');

    expect(
      getLocaleSwitchPath('en-US', {
        pathname: '/zh-CN/container/',
        search: '?tab=faq',
        hash: '#pricing',
      }),
    ).toBe('/en-US/container/?tab=faq#pricing');

    expect(
      getLocaleSwitchPath('pt-BR', {
        pathname: '/zh-TW/container/',
        search: 'channel=stable',
        hash: 'faq',
      }),
    ).toBe('/pt-BR/container/?channel=stable#faq');
  });

  it('builds canonical URLs with the canonical default root and localized alternates', () => {
    expect(getAbsoluteSiteUrl('/', 'en-US')).toBe('https://hagicode.com/en-US/');
    expect(getAbsoluteSiteUrl('/', 'zh-CN')).toBe('https://hagicode.com/zh-CN/');
    expect(getAbsoluteSiteUrl('/desktop/', 'en-US')).toBe('https://hagicode.com/en-US/desktop/');
    expect(getAbsoluteSiteUrl('/desktop/', 'zh-CN')).toBe('https://hagicode.com/zh-CN/desktop/');
    expect(getAbsoluteSiteUrl('/container/', 'en-US')).toBe('https://hagicode.com/en-US/container/');
    expect(getAbsoluteSiteUrl('/container/', 'zh-CN')).toBe('https://hagicode.com/zh-CN/container/');
  });

  it('builds alternate paths for every supported locale', () => {
    const alternates = getAlternateLocalePaths('/desktop/');
    expect(Object.keys(alternates)).toHaveLength(SUPPORTED_SITE_LOCALES.length);
    expect(alternates['en-US']).toBe('/en-US/desktop/');
    expect(alternates['zh-CN']).toBe('/zh-CN/desktop/');
    expect(alternates['zh-Hant']).toBe('/zh-Hant/desktop/');
    expect(alternates['ja-JP']).toBe('/ja-JP/desktop/');
    expect(alternates['es-ES']).toBe('/es-ES/desktop/');
    expect(alternates['pt-BR']).toBe('/pt-BR/desktop/');
    expect(alternates['ru-RU']).toBe('/ru-RU/desktop/');
  });

  it('respects an optional site base when building localized paths', () => {
    expect(joinWithSiteBase('/site/', '/')).toBe('/site/');
    expect(joinWithSiteBase('/site/', '/desktop/')).toBe('/site/desktop/');
    expect(getAbsoluteSiteUrl('/container/', 'zh-CN', '/site/')).toBe(
      'https://hagicode.com/site/zh-CN/container/',
    );
  });
});
