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

export function resolveSiteEntryLocale(
  options: ResolveSiteEntryLocaleOptions,
): SiteEntryLocaleResolution {
  const {
    requestedLang,
    storedLocale,
    legacyStoredLocale,
    clientLanguages = [],
  } = options;

  const resolvedStoredLocale = getStoredSiteLocale(storedLocale, legacyStoredLocale);
  const resolvedClientLocale = resolveClientSiteLocale(clientLanguages);

  if (requestedLang !== null && requestedLang !== undefined) {
    const requestedLocale = normalizeSiteLocale(requestedLang);
    return {
      locale: requestedLocale ?? resolvedStoredLocale ?? resolvedClientLocale ?? DEFAULT_LOCALE,
      shouldPersist: requestedLocale !== null,
    };
  }

  if (resolvedStoredLocale) {
    return {
      locale: resolvedStoredLocale,
      shouldPersist: false,
    };
  }

  return {
    locale: resolvedClientLocale ?? DEFAULT_LOCALE,
    shouldPersist: true,
  };
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
