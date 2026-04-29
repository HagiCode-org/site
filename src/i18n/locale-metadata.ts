export const SITE_ORIGIN = 'https://hagicode.com';
export const DEFAULT_LOCALE = 'en-US';
export const LEGACY_ENGLISH_LOCALE = 'en';

export const SUPPORTED_SITE_LOCALES = [
  'zh-CN',
  'zh-Hant',
  'en-US',
  'ja-JP',
  'ko-KR',
  'de-DE',
  'fr-FR',
  'es-ES',
  'pt-BR',
  'ru-RU',
] as const;

export type SiteLocale = (typeof SUPPORTED_SITE_LOCALES)[number];

export interface SiteLocaleDefinition {
  readonly code: SiteLocale;
  readonly name: string;
  readonly nativeName: string;
  readonly shortLabel: string;
  readonly fallbackCodes: readonly SiteLocale[];
}

export const SITE_LOCALES: readonly SiteLocaleDefinition[] = [
  {
    code: 'zh-CN',
    name: 'Simplified Chinese',
    nativeName: '简体中文',
    shortLabel: '中',
    fallbackCodes: ['en-US'],
  },
  {
    code: 'zh-Hant',
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    shortLabel: '繁',
    fallbackCodes: ['zh-CN', 'en-US'],
  },
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    shortLabel: 'EN',
    fallbackCodes: ['en-US'],
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    shortLabel: '日',
    fallbackCodes: ['en-US'],
  },
  {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    shortLabel: '한',
    fallbackCodes: ['en-US'],
  },
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    shortLabel: 'DE',
    fallbackCodes: ['en-US'],
  },
  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    shortLabel: 'FR',
    fallbackCodes: ['en-US'],
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    shortLabel: 'ES',
    fallbackCodes: ['en-US'],
  },
  {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    shortLabel: 'PT',
    fallbackCodes: ['en-US'],
  },
  {
    code: 'ru-RU',
    name: 'Russian',
    nativeName: 'Русский',
    shortLabel: 'RU',
    fallbackCodes: ['en-US'],
  },
] as const;

const SITE_LOCALE_BY_CODE = new Map<SiteLocale, SiteLocaleDefinition>(
  SITE_LOCALES.map((locale) => [locale.code, locale]),
);

function canonicalizeLocale(locale: string): string {
  const candidate = locale.trim().replace(/_/g, '-');
  if (!candidate) {
    return '';
  }

  try {
    return Intl.getCanonicalLocales(candidate)[0] ?? candidate;
  } catch {
    return candidate;
  }
}

export function getSiteLocaleDefinition(locale: SiteLocale): SiteLocaleDefinition {
  const definition = SITE_LOCALE_BY_CODE.get(locale);
  if (!definition) {
    throw new Error(`Unsupported site locale: ${locale}`);
  }

  return definition;
}

export function getSiteLocaleFallbackChain(locale: SiteLocale): readonly SiteLocale[] {
  return getSiteLocaleDefinition(locale).fallbackCodes;
}

export function normalizeSiteLocale(locale: string | null | undefined): SiteLocale | null {
  if (!locale) {
    return null;
  }

  const canonical = canonicalizeLocale(locale);
  const normalized = canonical.toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized === 'zh-hant' || normalized.includes('-hant') || ['zh-tw', 'zh-hk', 'zh-mo'].includes(normalized)) {
    return 'zh-Hant';
  }

  if (normalized === 'zh' || normalized.includes('-hans') || ['zh-cn', 'zh-sg'].includes(normalized)) {
    return 'zh-CN';
  }

  for (const supportedCode of SUPPORTED_SITE_LOCALES) {
    if (supportedCode.toLowerCase() === normalized) {
      return supportedCode;
    }
  }

  const [languagePart] = normalized.split('-');
  switch (languagePart) {
    case 'en':
      return 'en-US';
    case 'ja':
      return 'ja-JP';
    case 'ko':
      return 'ko-KR';
    case 'de':
      return 'de-DE';
    case 'fr':
      return 'fr-FR';
    case 'es':
      return 'es-ES';
    case 'pt':
      return 'pt-BR';
    case 'ru':
      return 'ru-RU';
    default:
      return null;
  }
}

export function resolveSiteLocale(
  locale: string | null | undefined,
  fallback: SiteLocale = DEFAULT_LOCALE,
): SiteLocale {
  return normalizeSiteLocale(locale) ?? fallback;
}

export function isDefaultSiteLocale(locale: SiteLocale): boolean {
  return locale === DEFAULT_LOCALE;
}

export function getNonDefaultSiteLocales(): readonly SiteLocale[] {
  return SUPPORTED_SITE_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);
}
