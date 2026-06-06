export const DEFAULT_WINDOWS_STORE_PRODUCT_ID = '9N3PM0N3SVDW';

const WINDOWS_STORE_BADGE_LANGUAGE_BY_LOCALE: Record<string, string> = {
  en: 'en-us',
  'en-us': 'en-us',
  zh: 'zh-cn',
  'zh-cn': 'zh-cn',
  'zh-hant': 'zh-tw',
  'ja-jp': 'ja',
  'ko-kr': 'ko',
  'de-de': 'de',
  'fr-fr': 'fr',
  'es-es': 'es',
  'pt-br': 'pt-br',
  'ru-ru': 'ru',
};

export function resolveMicrosoftStoreProductId(href?: string): string {
  if (!href) {
    return DEFAULT_WINDOWS_STORE_PRODUCT_ID;
  }

  const match = href.match(/(?:detail|store\/detail)\/([a-z0-9]+)/i);
  return match?.[1]?.toUpperCase() ?? DEFAULT_WINDOWS_STORE_PRODUCT_ID;
}

export function resolveMicrosoftStoreBadgeLanguage(locale?: string): string {
  if (!locale) {
    return 'en-us';
  }

  const normalizedLocale = locale.toLowerCase();
  return WINDOWS_STORE_BADGE_LANGUAGE_BY_LOCALE[normalizedLocale] ?? 'en-us';
}
