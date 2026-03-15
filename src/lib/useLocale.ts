import { useEffect, useState } from 'react';
import {
  DEFAULT_LOCALE,
  getLocaleSwitchPath,
  resolveLocaleFromPathname,
  type SiteLocale,
} from './locale-routing';

function getClientLocale(): SiteLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  return resolveLocaleFromPathname(window.location.pathname);
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
    };

    syncLocale();
    window.addEventListener('popstate', syncLocale);
    window.addEventListener('hashchange', syncLocale);

    return () => {
      window.removeEventListener('popstate', syncLocale);
      window.removeEventListener('hashchange', syncLocale);
    };
  }, []);

  const setLocale = (newLocale: SiteLocale) => {
    setLocaleState(newLocale);

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem('lang', newLocale);

    const nextUrl = getLocaleSwitchPath(newLocale, {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    });

    if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.location.assign(nextUrl);
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'zh-CN' ? 'en' : 'zh-CN');
  };

  return { locale, setLocale, toggleLocale };
}
