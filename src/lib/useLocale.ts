import { useEffect, useState } from 'react';

import {
  DEFAULT_LOCALE,
  resolveSiteLocale,
  type SiteLocale,
} from '@/i18n/locale-metadata';
import {
  getLocaleSwitchPath,
  hasExplicitLocalePrefix,
  resolveLocaleFromPathname,
} from './locale-routing';
import {
  LEGACY_SITE_LOCALE_STORAGE_KEY,
  SITE_LOCALE_STORAGE_KEY,
} from './site-entry-locale';

function getClientLocale(): SiteLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  return resolveLocaleFromPathname(window.location.pathname);
}

function readStoredLocale(): SiteLocale | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedLocale = localStorage.getItem(SITE_LOCALE_STORAGE_KEY)
      ?? localStorage.getItem(LEGACY_SITE_LOCALE_STORAGE_KEY);
    return storedLocale ? resolveSiteLocale(storedLocale, DEFAULT_LOCALE) : null;
  } catch (error) {
    console.warn('Unable to read stored site locale.', error);
    return null;
  }
}

function persistStoredLocale(locale: SiteLocale) {
  try {
    localStorage.setItem(SITE_LOCALE_STORAGE_KEY, locale);
    localStorage.removeItem(LEGACY_SITE_LOCALE_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to persist site locale.', error);
  }
}

export function useLocale() {
  const [locale, setLocaleState] = useState<SiteLocale>(() => getClientLocale());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncLocale = () => {
      const nextLocale = resolveLocaleFromPathname(window.location.pathname);
      setLocaleState((previousLocale) =>
        previousLocale === nextLocale ? previousLocale : nextLocale,
      );

      if (hasExplicitLocalePrefix(window.location.pathname)) {
        persistStoredLocale(nextLocale);
      }
    };

    const storedLocale = readStoredLocale();
    if (storedLocale) {
      setLocaleState(storedLocale);
    }

    syncLocale();
    window.addEventListener('popstate', syncLocale);
    window.addEventListener('hashchange', syncLocale);

    return () => {
      window.removeEventListener('popstate', syncLocale);
      window.removeEventListener('hashchange', syncLocale);
    };
  }, []);

  const setLocale = (newLocale: SiteLocale) => {
    const resolvedLocale = resolveSiteLocale(newLocale, DEFAULT_LOCALE);
    setLocaleState(resolvedLocale);

    if (typeof window === 'undefined') {
      return;
    }

    persistStoredLocale(resolvedLocale);

    const nextUrl = getLocaleSwitchPath(resolvedLocale, {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    });

    if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.location.assign(nextUrl);
    }
  };

  return { locale, setLocale };
}
