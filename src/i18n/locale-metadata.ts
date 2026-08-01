export const SITE_ORIGIN = 'https://www.hagicode.com';
export const DEFAULT_LOCALE = 'en-US';
export const LEGACY_ENGLISH_LOCALE = 'en';
export const DESKTOP_LOCALE_SOURCE =
  'repos/hagicode-desktop/src/shared/desktop-languages.ts';

export const DESKTOP_SUPPORTED_LOCALE_CODES = [
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

const SITE_LOCALE_DEFINITIONS = [
  {
    code: 'en-US',
    desktopCode: 'en-US',
    name: 'English',
    nativeName: 'English',
    shortLabel: 'EN',
    fallbackCodes: ['en-US'],
    aliases: ['en', 'en-us'],
  },
  {
    code: 'zh-CN',
    desktopCode: 'zh-CN',
    name: 'Simplified Chinese',
    nativeName: '简体中文',
    shortLabel: '简中',
    fallbackCodes: ['en-US'],
    aliases: ['zh', 'zh-cn', 'zh-hans', 'zh-sg'],
  },
  {
    code: 'zh-Hant',
    desktopCode: 'zh-Hant',
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    shortLabel: '繁中',
    fallbackCodes: ['zh-CN', 'en-US'],
    aliases: ['zh-hant', 'zh-tw', 'zh-hk', 'zh-mo'],
  },
  {
    code: 'ja-JP',
    desktopCode: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    shortLabel: '日本',
    fallbackCodes: ['en-US'],
    aliases: ['ja', 'ja-jp'],
  },
  {
    code: 'ko-KR',
    desktopCode: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    shortLabel: '한국',
    fallbackCodes: ['en-US'],
    aliases: ['ko', 'ko-kr'],
  },
  {
    code: 'de-DE',
    desktopCode: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    shortLabel: 'DE',
    fallbackCodes: ['en-US'],
    aliases: ['de', 'de-de'],
  },
  {
    code: 'fr-FR',
    desktopCode: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    shortLabel: 'FR',
    fallbackCodes: ['en-US'],
    aliases: ['fr', 'fr-fr'],
  },
  {
    code: 'es-ES',
    desktopCode: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    shortLabel: 'ES',
    fallbackCodes: ['en-US'],
    aliases: ['es', 'es-es'],
  },
  {
    code: 'pt-BR',
    desktopCode: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    shortLabel: 'PT',
    fallbackCodes: ['en-US'],
    aliases: ['pt', 'pt-br'],
  },
  {
    code: 'ru-RU',
    desktopCode: 'ru-RU',
    name: 'Russian',
    nativeName: 'Русский',
    shortLabel: 'RU',
    fallbackCodes: ['en-US'],
    aliases: ['ru', 'ru-ru'],
  },
] as const;

export type DesktopLocaleCode = (typeof DESKTOP_SUPPORTED_LOCALE_CODES)[number];
export type SiteLocale = (typeof SITE_LOCALE_DEFINITIONS)[number]['code'];

export interface SiteLocaleDefinition {
  readonly code: SiteLocale;
  readonly desktopCode: DesktopLocaleCode;
  readonly name: string;
  readonly nativeName: string;
  readonly shortLabel: string;
  readonly fallbackCodes: readonly SiteLocale[];
  readonly aliases: readonly string[];
}

export const SITE_LOCALES: readonly SiteLocaleDefinition[] = SITE_LOCALE_DEFINITIONS;
export const SUPPORTED_SITE_LOCALES = SITE_LOCALES.map((locale) => locale.code) as readonly SiteLocale[];

const SITE_LOCALE_BY_CODE = new Map<SiteLocale, SiteLocaleDefinition>(
  SITE_LOCALES.map((locale) => [locale.code, locale] as const),
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

function buildSiteLocaleAliasMap() {
  const aliases = new Map<string, SiteLocale>();

  for (const locale of SITE_LOCALES) {
    aliases.set(locale.code.toLowerCase(), locale.code);
    aliases.set(locale.desktopCode.toLowerCase(), locale.code);

    for (const alias of locale.aliases) {
      const canonicalAlias = canonicalizeLocale(alias).toLowerCase();
      aliases.set(canonicalAlias || alias.toLowerCase(), locale.code);
    }
  }

  return aliases;
}

const SITE_LOCALE_BY_NORMALIZED_INPUT = buildSiteLocaleAliasMap();
const SITE_LOCALE_BY_LANGUAGE = new Map<string, SiteLocale>(
  SITE_LOCALES.map((locale) => [locale.code.split('-')[0].toLowerCase(), locale.code] as const),
);

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

  const directMatch = SITE_LOCALE_BY_NORMALIZED_INPUT.get(normalized);
  if (directMatch) {
    return directMatch;
  }

  const [languagePart] = normalized.split('-');
  return SITE_LOCALE_BY_LANGUAGE.get(languagePart) ?? null;
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
