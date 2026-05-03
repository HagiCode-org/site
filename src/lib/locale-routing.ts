import {
  DEFAULT_LOCALE,
  LEGACY_ENGLISH_LOCALE,
  SITE_ORIGIN,
  SUPPORTED_SITE_LOCALES,
  normalizeSiteLocale,
  type SiteLocale,
} from '@/i18n/locale-metadata';

export {
  DEFAULT_LOCALE,
  SITE_ORIGIN,
  SUPPORTED_SITE_LOCALES,
  type SiteLocale,
};

export const LEGACY_ENGLISH_PREFIX = '/en';

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

function getLeadingSegment(pathname: string): string | null {
  const normalized = normalizePathname(pathname);
  if (normalized === '/') {
    return null;
  }

  const [, leadingSegment] = normalized.split('/');
  return leadingSegment || null;
}

export function resolveLocaleFromPathname(pathname: string): SiteLocale {
  const leadingSegment = getLeadingSegment(pathname);
  const resolvedLocale = normalizeSiteLocale(leadingSegment);
  return resolvedLocale ?? DEFAULT_LOCALE;
}

export function isLegacyEnglishPath(pathname: string): boolean {
  return getLeadingSegment(pathname) === LEGACY_ENGLISH_LOCALE;
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = normalizePathname(pathname);
  const leadingSegment = getLeadingSegment(normalized);
  if (!leadingSegment || !normalizeSiteLocale(leadingSegment)) {
    return normalized;
  }

  const withoutPrefix = normalized.replace(/^\/[^/]+(?=\/|$)/, '');
  if (!withoutPrefix) {
    return '/';
  }

  return withoutPrefix.startsWith('/') ? withoutPrefix : `/${withoutPrefix}`;
}

export function getLocalePathPrefix(locale: SiteLocale): string {
  return `/${locale}`;
}

export function getLocalizedPath(pathname: string, locale: SiteLocale): string {
  const routePath = stripLocalePrefix(pathname);
  const normalizedRoutePath = routePath === '/' ? '' : routePath;
  const localePrefix = getLocalePathPrefix(locale);

  if (!localePrefix) {
    return ensureTrailingSlash(routePath);
  }

  return ensureTrailingSlash(`${localePrefix}${normalizedRoutePath}`);
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

export function getAlternateLocalePaths(pathname: string): Record<SiteLocale, string> {
  return Object.fromEntries(
    SUPPORTED_SITE_LOCALES.map((locale) => [locale, getLocalizedPath(pathname, locale)]),
  ) as Record<SiteLocale, string>;
}

export function getAlternateLocaleUrls(
  pathname: string,
  siteBase = '',
): Record<SiteLocale, string> {
  return Object.fromEntries(
    SUPPORTED_SITE_LOCALES.map((locale) => [
      locale,
      getAbsoluteSiteUrl(pathname, locale, siteBase),
    ]),
  ) as Record<SiteLocale, string>;
}

export function buildLegacyEnglishPath(pathname: string): string {
  const routePath = stripLocalePrefix(pathname);
  if (routePath === '/') {
    return '/en/';
  }

  return ensureTrailingSlash(`/en${routePath}`);
}
