import {
  DEFAULT_LOCALE,
  getLocalizedPathWithBase,
  resolveLocaleFromPathname,
  type SiteLocale,
} from '@/lib/locale-routing';
import { resolveSiteLocale } from '@/i18n/locale-metadata';

/**
 * Common link registry for the marketing site.
 */
export function getEnvironment(): 'development' | 'production' {
  const nodeEnv = import.meta.env.NODE_ENV || import.meta.env.MODE;
  if (nodeEnv === 'development') {
    return 'development';
  }
  return 'production';
}

export function getDocsBasePath(): string {
  return '/';
}

export function getCorrectBasePath(locale: string): string {
  const siteBase = import.meta.env.VITE_SITE_BASE || '';
  const normalizedLocale = resolveSiteLocale(locale);
  return getLocalizedPathWithBase('/', normalizedLocale, siteBase);
}

export interface LinkConfig {
  dev: string;
  prod: string;
  external?: boolean;
  relative?: boolean;
}

type DocsRouteLocale = 'root' | 'en' | 'zh-Hant' | 'ja-JP' | 'ko-KR' | 'de-DE' | 'fr-FR' | 'es-ES' | 'pt-BR' | 'ru-RU';

const DOCS_ROUTE_LOCALE_BY_SITE_LOCALE: Record<SiteLocale, DocsRouteLocale> = {
  'zh-CN': 'root',
  'zh-Hant': 'zh-Hant',
  'en-US': 'en',
  'ja-JP': 'ja-JP',
  'ko-KR': 'ko-KR',
  'de-DE': 'de-DE',
  'fr-FR': 'fr-FR',
  'es-ES': 'es-ES',
  'pt-BR': 'pt-BR',
  'ru-RU': 'ru-RU',
};

function normalizeAbsolutePath(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutTrailingSlash = normalized.replace(/\/+$/u, '');
  return withoutTrailingSlash || '/';
}

function ensureTrailingSlash(pathname: string): string {
  if (pathname === '/') {
    return pathname;
  }

  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function stripDocsLocalePrefix(pathname: string): string {
  const normalized = normalizeAbsolutePath(pathname);
  const matchedLocale = normalized.match(/^\/(en|zh-Hant|ja-JP|ko-KR|de-DE|fr-FR|es-ES|pt-BR|ru-RU)(?=\/|$)/u)?.[1];

  if (!matchedLocale) {
    return ensureTrailingSlash(normalized);
  }

  const stripped = normalized.replace(/^\/[^/]+(?=\/|$)/u, '');
  return ensureTrailingSlash(stripped || '/');
}

function getDocsRouteLocale(locale?: string): DocsRouteLocale {
  return DOCS_ROUTE_LOCALE_BY_SITE_LOCALE[normalizeLocale(locale)];
}

function getLocalizedDocsPath(pathname: string, locale?: string): string {
  const routeLocale = getDocsRouteLocale(locale);
  const normalizedPath = stripDocsLocalePrefix(pathname);

  if (routeLocale === 'root') {
    return normalizedPath;
  }

  if (normalizedPath === '/') {
    return `/${routeLocale}/`;
  }

  return `/${routeLocale}${normalizedPath}`;
}

function rebuildAbsoluteUrl(url: URL, pathname: string): string {
  url.pathname = pathname;
  return url.toString();
}

export const SITE_LINKS = {
  docs: {
    dev: 'https://docs.hagicode.com/',
    prod: 'https://docs.hagicode.com/',
    external: false,
  } as LinkConfig,
  website: {
    dev: '/',
    prod: '/',
    external: false,
  } as LinkConfig,
  github: {
    dev: 'https://github.com/HagiCode-org/site',
    prod: 'https://github.com/HagiCode-org/site',
    external: true,
  } as LinkConfig,
  qqGroup: {
    dev: 'https://qm.qq.com/q/Fwb0o094kw',
    prod: 'https://qm.qq.com/q/Fwb0o094kw',
    external: true,
  } as LinkConfig,
  discord: {
    dev: 'https://discord.gg/qY662sJK',
    prod: 'https://discord.gg/qY662sJK',
    external: true,
  } as LinkConfig,
  blog: {
    dev: 'https://docs.hagicode.com/blog/',
    prod: 'https://docs.hagicode.com/blog/',
    external: false,
  } as LinkConfig,
  productOverview: {
    dev: 'https://docs.hagicode.com/product-overview/',
    prod: 'https://docs.hagicode.com/product-overview/',
    external: false,
  } as LinkConfig,
  desktop: {
    dev: '/desktop/',
    prod: '/desktop/',
    external: false,
  } as LinkConfig,
  dockerCompose: {
    dev: 'https://docs.hagicode.com/installation/docker-compose/',
    prod: 'https://docs.hagicode.com/installation/docker-compose/',
    external: false,
  } as LinkConfig,
  container: {
    dev: '/container/',
    prod: '/container/',
    external: false,
  } as LinkConfig,
  about: {
    dev: '/about/',
    prod: '/about/',
    external: false,
  } as LinkConfig,
  rss: {
    dev: 'https://docs.hagicode.com/blog/rss.xml',
    prod: 'https://docs.hagicode.com/blog/rss.xml',
    external: false,
  } as LinkConfig,
  costCalculator: {
    dev: 'https://cost.hagicode.com',
    prod: 'https://cost.hagicode.com',
    external: true,
  } as LinkConfig,
} as const;

export const GLM_PROMO_LINKS = {
  glmCoding: {
    url: 'https://www.bigmodel.cn/glm-coding?ic=14BY54APZA',
    label: '立即开拼',
    title: '智谱 GLM Coding: 20+ 大编程工具无缝支持',
    description: 'Claude Code、Cline 等 20+ 大编程工具无缝支持，"码力"全开，越拼越爽！',
    discount: '10% 优惠',
  },
  dockerComposeGuide: {
    url: 'https://docs.hagicode.com/installation/docker-compose/',
    label: '查看部署指南',
    title: 'Docker Compose 部署: 一键部署 Hagicode',
    description: '一键部署 Hagicode，快速体验 AI 编程助手',
    isInternal: true,
  },
} as const;

export function getGlmCodingUrl(): string {
  return GLM_PROMO_LINKS.glmCoding.url;
}

export function getAliyunPromoUrl(): string {
  return '';
}

export function getDockerComposeGuideUrl(locale: string = DEFAULT_LOCALE): string {
  return getDocsAbsoluteUrl('/installation/docker-compose/', locale);
}

export type PublicLinkKey = keyof typeof SITE_LINKS;

function normalizeLocale(locale?: string): SiteLocale {
  return resolveSiteLocale(locale);
}

export function getDocsAbsoluteUrl(pathname: string, locale?: string): string {
  const docsUrl = new URL('https://docs.hagicode.com');
  return rebuildAbsoluteUrl(docsUrl, getLocalizedDocsPath(pathname, locale));
}

function getDocsRssUrl(locale?: string): string {
  const currentLocale = normalizeLocale(locale);
  return currentLocale.startsWith('zh')
    ? 'https://docs.hagicode.com/blog/rss.zh-CN.xml'
    : 'https://docs.hagicode.com/blog/rss.en.xml';
}

export function getLinkWithLocale(key: PublicLinkKey, locale?: string): string {
  const config = SITE_LINKS[key];
  const env = getEnvironment();
  const currentLocale = normalizeLocale(locale || getCurrentLocale());
  const url = env === 'development' ? config.dev : config.prod;

  if (config.external) {
    return url;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    const urlObject = new URL(url);
    if (urlObject.hostname === 'docs.hagicode.com') {
      if (key === 'rss') {
        return getDocsRssUrl(currentLocale);
      }

      return rebuildAbsoluteUrl(urlObject, getLocalizedDocsPath(urlObject.pathname, currentLocale));
    }

    if (urlObject.hostname === 'hagicode.com') {
      return rebuildAbsoluteUrl(urlObject, getLocalizedPathWithBase(urlObject.pathname, currentLocale, ''));
    }

    return urlObject.toString();
  }

  const siteBase = import.meta.env.VITE_SITE_BASE || '';
  return getLocalizedPathWithBase(url, currentLocale, siteBase);
}

export function getCurrentLocale(): SiteLocale {
  if (typeof window !== 'undefined') {
    if (window.location?.pathname) {
      return resolveLocaleFromPathname(window.location.pathname);
    }
  }

  return DEFAULT_LOCALE;
}

export function getLink(key: PublicLinkKey): string {
  return getLinkWithLocale(key, DEFAULT_LOCALE);
}

export function getLinkConfig(key: PublicLinkKey): LinkConfig {
  return SITE_LINKS[key];
}

export function isExternalLink(key: PublicLinkKey): boolean {
  return SITE_LINKS[key].external === true;
}

export function getLinkTarget(key: PublicLinkKey): '_blank' | undefined {
  return isExternalLink(key) ? '_blank' : undefined;
}

export function getLinkRel(key: PublicLinkKey): 'noopener noreferrer' | undefined {
  return isExternalLink(key) ? 'noopener noreferrer' : undefined;
}
