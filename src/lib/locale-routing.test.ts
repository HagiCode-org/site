import { describe, expect, it } from 'vitest';
import {
  getAbsoluteSiteUrl,
  getLocalizedPath,
  getLocaleSwitchPath,
  joinWithSiteBase,
  resolveLocaleFromPathname,
  stripLocalePrefix,
} from './locale-routing';

describe('locale routing', () => {
  it('treats unprefixed routes as English', () => {
    expect(resolveLocaleFromPathname('/')).toBe('en');
    expect(resolveLocaleFromPathname('/desktop/')).toBe('en');
    expect(resolveLocaleFromPathname('/container/')).toBe('en');
  });

  it('treats zh-CN routes as Chinese', () => {
    expect(resolveLocaleFromPathname('/zh-CN/')).toBe('zh-CN');
    expect(resolveLocaleFromPathname('/zh-CN/desktop/')).toBe('zh-CN');
    expect(resolveLocaleFromPathname('/zh-CN/container/')).toBe('zh-CN');
  });

  it('keeps legacy /en routes mapped to English', () => {
    expect(resolveLocaleFromPathname('/en/')).toBe('en');
    expect(stripLocalePrefix('/en/desktop/')).toBe('/desktop');
    expect(stripLocalePrefix('/en/container/')).toBe('/container');
  });

  it('builds localized counterparts for matching pages', () => {
    expect(getLocalizedPath('/', 'zh-CN')).toBe('/zh-CN/');
    expect(getLocalizedPath('/desktop/', 'zh-CN')).toBe('/zh-CN/desktop/');
    expect(getLocalizedPath('/container/', 'zh-CN')).toBe('/zh-CN/container/');
    expect(getLocalizedPath('/zh-CN/', 'en')).toBe('/');
    expect(getLocalizedPath('/zh-CN/desktop/', 'en')).toBe('/desktop/');
    expect(getLocalizedPath('/zh-CN/container/', 'en')).toBe('/container/');
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
      getLocaleSwitchPath('en', {
        pathname: '/zh-CN/container/',
        search: '?tab=faq',
        hash: '#pricing',
      }),
    ).toBe('/container/?tab=faq#pricing');
  });

  it('builds canonical URLs with the English root and zh-CN alternates', () => {
    expect(getAbsoluteSiteUrl('/', 'en')).toBe('https://hagicode.com/');
    expect(getAbsoluteSiteUrl('/', 'zh-CN')).toBe('https://hagicode.com/zh-CN/');
    expect(getAbsoluteSiteUrl('/desktop/', 'en')).toBe('https://hagicode.com/desktop/');
    expect(getAbsoluteSiteUrl('/desktop/', 'zh-CN')).toBe('https://hagicode.com/zh-CN/desktop/');
    expect(getAbsoluteSiteUrl('/container/', 'en')).toBe('https://hagicode.com/container/');
    expect(getAbsoluteSiteUrl('/container/', 'zh-CN')).toBe('https://hagicode.com/zh-CN/container/');
  });

  it('respects an optional site base when building localized paths', () => {
    expect(joinWithSiteBase('/site/', '/')).toBe('/site/');
    expect(joinWithSiteBase('/site/', '/desktop/')).toBe('/site/desktop/');
    expect(getAbsoluteSiteUrl('/container/', 'zh-CN', '/site/')).toBe(
      'https://hagicode.com/site/zh-CN/container/',
    );
  });
});
