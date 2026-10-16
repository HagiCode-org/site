export const SITE_I18N_NAMESPACES = [
  'common',
  'home',
  'desktop',
  'about',
] as const;

export type SiteI18nNamespace = (typeof SITE_I18N_NAMESPACES)[number];
