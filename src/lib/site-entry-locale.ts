import {
  DEFAULT_LOCALE,
  normalizeSiteLocale,
  type SiteLocale,
} from '@/i18n/locale-metadata';
import { getLocalizedPath, joinWithSiteBase } from '@/lib/locale-routing';

export const SITE_LOCALE_STORAGE_KEY = 'hagicode:site-locale';
export const LEGACY_SITE_LOCALE_STORAGE_KEY = 'lang';

type ResolveSiteEntryLocaleOptions = {
  requestedLang?: string | null | undefined;
  storedLocale?: string | null | undefined;
  legacyStoredLocale?: string | null | undefined;
  clientLanguages?: Array<string | null | undefined>;
};

type BuildSiteEntryRedirectUrlOptions = ResolveSiteEntryLocaleOptions & {
  currentUrl: URL;
  targetPath: string;
  siteBase?: string;
};

export type SiteEntryLocaleResolution = {
  locale: SiteLocale;
  shouldPersist: boolean;
};

/** Which input decided the locale, in the order resolveSiteEntryLocale() consults them. */
export type SiteEntryLocaleSource = 'query' | 'stored' | 'browser' | 'default';

export type SiteEntryLocaleTrace = SiteEntryLocaleResolution & {
  source: SiteEntryLocaleSource;
};

export type SiteEntryRedirectResolution = SiteEntryLocaleResolution & {
  targetUrl: string;
  shouldRedirect: boolean;
};

export function parseSiteLangFromUrl(url: URL): string | null {
  return url.searchParams.get('lang');
}

export function getStoredSiteLocale(
  storageValue: string | null | undefined,
  legacyStorageValue?: string | null | undefined,
): SiteLocale | null {
  return normalizeSiteLocale(storageValue) ?? normalizeSiteLocale(legacyStorageValue);
}

export function resolveClientSiteLocale(
  clientLanguages: Array<string | null | undefined>,
): SiteLocale | null {
  for (const language of clientLanguages) {
    const locale = normalizeSiteLocale(language);
    if (locale) {
      return locale;
    }
  }

  return null;
}

/**
 * Resolves the entry locale and reports which input decided it, so a surface can show the
 * decision instead of guessing at it. resolveSiteEntryLocale() is this minus the source.
 */
export function traceSiteEntryLocale(
  options: ResolveSiteEntryLocaleOptions,
): SiteEntryLocaleTrace {
  const {
    requestedLang,
    storedLocale,
    legacyStoredLocale,
    clientLanguages = [],
  } = options;

  const resolvedStoredLocale = getStoredSiteLocale(storedLocale, legacyStoredLocale);
  const resolvedClientLocale = resolveClientSiteLocale(clientLanguages);

  // An explicit ?lang= that is unsupported still falls through the chain, but never persists the result.
  const hasRequestedLang = requestedLang !== null && requestedLang !== undefined;
  if (hasRequestedLang) {
    const requestedLocale = normalizeSiteLocale(requestedLang);
    if (requestedLocale) {
      return { locale: requestedLocale, shouldPersist: true, source: 'query' };
    }
  }

  if (resolvedStoredLocale) {
    return { locale: resolvedStoredLocale, shouldPersist: false, source: 'stored' };
  }

  if (resolvedClientLocale) {
    return { locale: resolvedClientLocale, shouldPersist: !hasRequestedLang, source: 'browser' };
  }

  return { locale: DEFAULT_LOCALE, shouldPersist: !hasRequestedLang, source: 'default' };
}

export function resolveSiteEntryLocale(
  options: ResolveSiteEntryLocaleOptions,
): SiteEntryLocaleResolution {
  const { locale, shouldPersist } = traceSiteEntryLocale(options);
  return { locale, shouldPersist };
}

export function buildSiteEntryRedirectUrl(
  options: BuildSiteEntryRedirectUrlOptions,
): SiteEntryRedirectResolution {
  const {
    currentUrl,
    targetPath,
    siteBase = '',
    requestedLang = parseSiteLangFromUrl(currentUrl),
    storedLocale,
    legacyStoredLocale,
    clientLanguages = [],
  } = options;

  const resolved = resolveSiteEntryLocale({
    requestedLang,
    storedLocale,
    legacyStoredLocale,
    clientLanguages,
  });

  const localizedPath = joinWithSiteBase(siteBase, getLocalizedPath(targetPath, resolved.locale));
  const targetUrl = new URL(localizedPath, currentUrl.origin);

  currentUrl.searchParams.forEach((value, key) => {
    if (key !== 'lang') {
      targetUrl.searchParams.append(key, value);
    }
  });
  targetUrl.hash = currentUrl.hash;

  return {
    ...resolved,
    targetUrl: targetUrl.toString(),
    shouldRedirect: targetUrl.toString() !== currentUrl.toString(),
  };
}
