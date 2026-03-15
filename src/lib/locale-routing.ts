export const DEFAULT_LOCALE = 'en';
export const CHINESE_LOCALE = 'zh-CN';
export const LEGACY_ENGLISH_PREFIX = '/en';
export const SITE_ORIGIN = 'https://hagicode.com';

export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, CHINESE_LOCALE] as const;

export type SiteLocale = (typeof SUPPORTED_LOCALES)[number];

function normalizeSlashes(value: string): string {
  return value.replace(/\/{2,}/g, '/');
}

export function normalizePathname(pathname: string): string {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutQueryOrHash = withLeadingSlash.split(/[?#]/, 1)[0] || '/';
  const normalized = normalizeSlashes(withoutQueryOrHash);

  if (normalized.length > 1 && normalized.endsWith('/')) {
    return normalized.replace(/\/+$/, '');
  }

  return normalized || '/';
}

export function ensureTrailingSlash(pathname: string): string {
  if (pathname === '/') {
    return pathname;
  }

  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function resolveLocaleFromPathname(pathname: string): SiteLocale {
  const normalized = normalizePathname(pathname);

  if (normalized === CHINESE_LOCALE_PATH || normalized.startsWith(`${CHINESE_LOCALE_PATH}/`)) {
    return CHINESE_LOCALE;
  }

  return DEFAULT_LOCALE;
}

export const CHINESE_LOCALE_PATH = `/${CHINESE_LOCALE}`;

export function stripLocalePrefix(pathname: string): string {
  const normalized = normalizePathname(pathname);
  const withoutPrefix = normalized.replace(/^\/(?:en|zh-CN)(?=\/|$)/, '');

  if (!withoutPrefix) {
    return '/';
  }

  return withoutPrefix.startsWith('/') ? withoutPrefix : `/${withoutPrefix}`;
}

export function getLocalizedPath(pathname: string, locale: SiteLocale): string {
  const routePath = stripLocalePrefix(pathname);

  if (locale === CHINESE_LOCALE) {
    if (routePath === '/') {
      return `${CHINESE_LOCALE_PATH}/`;
    }

    return ensureTrailingSlash(`${CHINESE_LOCALE_PATH}${routePath}`);
  }

  return ensureTrailingSlash(routePath);
}

function normalizeSearch(search = ''): string {
  if (!search) {
    return '';
  }

  return search.startsWith('?') ? search : `?${search}`;
}

function normalizeHash(hash = ''): string {
  if (!hash) {
    return '';
  }

  return hash.startsWith('#') ? hash : `#${hash}`;
}

export function getLocaleSwitchPath(
  locale: SiteLocale,
  options: { pathname: string; search?: string; hash?: string },
): string {
  const localizedPath = getLocalizedPath(options.pathname, locale);
  return `${localizedPath}${normalizeSearch(options.search)}${normalizeHash(options.hash)}`;
}

export function normalizeSiteBase(siteBase = ''): string {
  if (!siteBase || siteBase === '/') {
    return '/';
  }

  const trimmed = siteBase.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

export function joinWithSiteBase(siteBase: string, pathname: string): string {
  const normalizedBase = normalizeSiteBase(siteBase);
  const normalizedPath = pathname === '/' ? '/' : `/${pathname.replace(/^\/+/, '')}`;

  if (normalizedBase === '/') {
    return normalizedPath;
  }

  if (normalizedPath === '/') {
    return normalizedBase;
  }

  return normalizeSlashes(`${normalizedBase}${normalizedPath.replace(/^\//, '')}`);
}

export function getLocalizedPathWithBase(
  pathname: string,
  locale: SiteLocale,
  siteBase = '',
): string {
  return joinWithSiteBase(siteBase, getLocalizedPath(pathname, locale));
}

export function getAbsoluteSiteUrl(
  pathname: string,
  locale: SiteLocale = DEFAULT_LOCALE,
  siteBase = '',
): string {
  return `${SITE_ORIGIN}${getLocalizedPathWithBase(pathname, locale, siteBase)}`;
}
