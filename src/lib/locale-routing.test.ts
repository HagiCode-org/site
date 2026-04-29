import { describe, expect, it } from 'vitest';
import {
  buildLegacyEnglishPath,
  getAbsoluteSiteUrl,
  getAlternateLocalePaths,
  getLocalizedPath,
  getLocaleSwitchPath,
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
    expect(resolveLocaleFromPathname('/fr-FR/about/')).toBe('fr-FR');
    expect(resolveLocaleFromPathname('/zh-TW/about/')).toBe('zh-Hant');
  });

  it('keeps legacy /en routes mapped to English', () => {
    expect(resolveLocaleFromPathname('/en/')).toBe('en-US');
    expect(stripLocalePrefix('/en/desktop/')).toBe('/desktop');
    expect(stripLocalePrefix('/en/container/')).toBe('/container');
    expect(buildLegacyEnglishPath('/desktop/')).toBe('/en/desktop/');
  });

  it('builds localized counterparts for matching pages', () => {
    expect(getLocalizedPath('/', 'zh-CN')).toBe('/zh-CN/');
    expect(getLocalizedPath('/desktop/', 'zh-CN')).toBe('/zh-CN/desktop/');
    expect(getLocalizedPath('/container/', 'zh-CN')).toBe('/zh-CN/container/');
    expect(getLocalizedPath('/zh-CN/', 'en-US')).toBe('/');
    expect(getLocalizedPath('/zh-CN/desktop/', 'en-US')).toBe('/desktop/');
    expect(getLocalizedPath('/zh-CN/container/', 'en-US')).toBe('/container/');
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
    ).toBe('/container/?tab=faq#pricing');
  });

  it('builds canonical URLs with the canonical default root and localized alternates', () => {
    expect(getAbsoluteSiteUrl('/', 'en-US')).toBe('https://hagicode.com/');
    expect(getAbsoluteSiteUrl('/', 'zh-CN')).toBe('https://hagicode.com/zh-CN/');
    expect(getAbsoluteSiteUrl('/desktop/', 'en-US')).toBe('https://hagicode.com/desktop/');
    expect(getAbsoluteSiteUrl('/desktop/', 'zh-CN')).toBe('https://hagicode.com/zh-CN/desktop/');
    expect(getAbsoluteSiteUrl('/container/', 'en-US')).toBe('https://hagicode.com/container/');
    expect(getAbsoluteSiteUrl('/container/', 'zh-CN')).toBe('https://hagicode.com/zh-CN/container/');
  });

  it('builds alternate paths for every supported locale', () => {
    const alternates = getAlternateLocalePaths('/desktop/');
    expect(alternates['en-US']).toBe('/desktop/');
    expect(alternates['zh-CN']).toBe('/zh-CN/desktop/');
    expect(alternates['zh-Hant']).toBe('/zh-Hant/desktop/');
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
