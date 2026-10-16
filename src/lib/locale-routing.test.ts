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
    expect(resolveLocaleFromPathname('/about/')).toBe('en-US');
  });

  it('resolves explicit locale prefixes across the full locale catalog', () => {
    expect(resolveLocaleFromPathname('/zh-CN/')).toBe('zh-CN');
    expect(resolveLocaleFromPathname('/zh-CN/desktop/')).toBe('zh-CN');
    expect(resolveLocaleFromPathname('/ja-JP/about/')).toBe('ja-JP');
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
    expect(stripLocalePrefix('/en/about/')).toBe('/about');
    expect(buildLegacyEnglishPath('/desktop/')).toBe('/en/desktop/');
  });

  it('builds localized counterparts for matching pages', () => {
    expect(getLocalizedPath('/', 'en-US')).toBe('/en-US/');
    expect(getLocalizedPath('/', 'zh-CN')).toBe('/zh-CN/');
    expect(getLocalizedPath('/desktop/', 'zh-CN')).toBe('/zh-CN/desktop/');
    expect(getLocalizedPath('/about/', 'zh-CN')).toBe('/zh-CN/about/');
    expect(getLocalizedPath('/zh-CN/', 'en-US')).toBe('/en-US/');
    expect(getLocalizedPath('/zh-CN/desktop/', 'en-US')).toBe('/en-US/desktop/');
    expect(getLocalizedPath('/zh-CN/about/', 'en-US')).toBe('/en-US/about/');
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
        pathname: '/zh-CN/about/',
        search: '?tab=faq',
        hash: '#pricing',
      }),
    ).toBe('/en-US/about/?tab=faq#pricing');

    expect(
      getLocaleSwitchPath('pt-BR', {
        pathname: '/zh-TW/about/',
        search: 'channel=stable',
        hash: 'faq',
      }),
    ).toBe('/pt-BR/about/?channel=stable#faq');
  });

  it('builds canonical URLs with the canonical default root and localized alternates', () => {
    expect(getAbsoluteSiteUrl('/', 'en-US')).toBe('https://www.hagicode.com/en-US/');
    expect(getAbsoluteSiteUrl('/', 'zh-CN')).toBe('https://www.hagicode.com/zh-CN/');
    expect(getAbsoluteSiteUrl('/desktop/', 'en-US')).toBe('https://www.hagicode.com/en-US/desktop/');
    expect(getAbsoluteSiteUrl('/desktop/', 'zh-CN')).toBe('https://www.hagicode.com/zh-CN/desktop/');
    expect(getAbsoluteSiteUrl('/about/', 'en-US')).toBe('https://www.hagicode.com/en-US/about/');
    expect(getAbsoluteSiteUrl('/about/', 'zh-CN')).toBe('https://www.hagicode.com/zh-CN/about/');
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
    expect(getAbsoluteSiteUrl('/about/', 'zh-CN', '/site/')).toBe(
      'https://www.hagicode.com/site/zh-CN/about/',
    );
  });
});
