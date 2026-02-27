import zhCN from './zh-CN.json';
import en from './en.json';

const translations = {
  'zh-CN': zhCN,
  'en': en,
} as const;

export type TranslationKey = keyof typeof zhCN;

export function useTranslation(locale: 'zh-CN' | 'en') {
  return {
    t: (key: string) => {
      const keys = key.split('.');
      let value: any = translations[locale];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to Chinese if key is missing
          let fallback: any = translations['zh-CN'];
          for (const fallbackKey of keys) {
            if (fallback && typeof fallback === 'object' && fallbackKey in fallback) {
              fallback = fallback[fallbackKey];
            } else {
              return key;
            }
          }
          return fallback || key;
        }
      }

      return value || key;
    },
    locale,
  };
}

// Server-side translation helper for Astro pages
export function getTranslation(locale: 'zh-CN' | 'en') {
  const translation = translations[locale];

  return {
    t: (key: string) => {
      const keys = key.split('.');
      let value: any = translation;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key;
        }
      }

      return value || key;
    },
    locale,
  };
}
