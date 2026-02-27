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

      // Update URL
      const currentPath = window.location.pathname;
      if (newLocale === 'zh-CN') {
        // Remove /en/ prefix
        let newPath = currentPath.replace(/^\/en\//, '/');
        // If path was just /en/, make it /
        if (newPath === '') newPath = '/';
        window.location.href = newPath;
      } else {
        // Add /en/ prefix
        let newPath = currentPath === '/' ? '/en' : `/en${currentPath}`;
        window.location.href = newPath;
      }
    }
  };

  const toggleLocale = () => {
    const newLocale = locale === 'zh-CN' ? 'en' : 'zh-CN';
    setLocale(newLocale);
  };

  return { locale, setLocale, toggleLocale };
}
