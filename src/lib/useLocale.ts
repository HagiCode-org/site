import { useState, useEffect } from 'react';

export function useLocale() {
  const [locale, setLocaleState] = useState<'zh-CN' | 'en'>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lang') as 'zh-CN' | 'en' | null;
      if (stored && (stored === 'zh-CN' || stored === 'en')) {
        return stored;
      }

      // Fallback to browser detection
      const browserLang = navigator.language;
      return browserLang.startsWith('en') ? 'en' : 'zh-CN';
    }

    return 'zh-CN';
  });

  // Update locale when URL changes (for client-side navigation)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      // Check if path starts with /en/ (but not just /en/ at root)
      const newLocale = (path === '/en' || path.startsWith('/en/')) ? 'en' : 'zh-CN';
      // Only update if different to avoid loops
      setLocaleState(prev => prev !== newLocale ? newLocale : prev);
    }
  }, []);

  const setLocale = (newLocale: 'zh-CN' | 'en') => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', newLocale);

      // Get current path, search params, and hash
      const currentPath = window.location.pathname;
      const searchParams = window.location.search;
      const hash = window.location.hash;

      // Unified path preprocessing: remove all language prefixes
      let cleanPath = currentPath
        .replace(/^\/en(\/|$)/, '/')
        .replace(/^\/zh(\/|$)/, '/');
      // Ensure root path is always '/'
      if (cleanPath === '') cleanPath = '/';

      // Add new language prefix
      let newPath = newLocale === 'en'
        ? (cleanPath === '/' ? '/en' : `/en${cleanPath}`)
        : cleanPath;

      // Append search params and hash
      window.location.href = `${newPath}${searchParams}${hash}`;
    }
  };

  const toggleLocale = () => {
    const newLocale = locale === 'zh-CN' ? 'en' : 'zh-CN';
    setLocale(newLocale);
  };

  return { locale, setLocale, toggleLocale };
}
