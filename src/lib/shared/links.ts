import {
  DEFAULT_LOCALE,
  getLocalizedPathWithBase,
  resolveLocaleFromPathname,
  type SiteLocale,
} from '@/lib/locale-routing';
import { getSiteLocaleFallbackChain, resolveSiteLocale } from '@/i18n/locale-metadata';

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

type DocsRouteLocale = 'root' | 'en-US' | 'zh-Hant' | 'ja-JP' | 'ko-KR' | 'de-DE' | 'fr-FR' | 'es-ES' | 'pt-BR' | 'ru-RU';

const DOCS_ROUTE_LOCALE_BY_SITE_LOCALE: Partial<Record<SiteLocale, DocsRouteLocale>> = {
  'zh-CN': 'root',
  'zh-Hant': 'zh-Hant',
  'en-US': 'en-US',
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
  const matchedLocale = normalized.match(
    /^\/(en-US|en|zh-Hant|ja-JP|ko-KR|de-DE|fr-FR|es-ES|pt-BR|ru-RU)(?=\/|$)/u,
  )?.[1];

  if (!matchedLocale) {
    return ensureTrailingSlash(normalized);
  }

  const stripped = normalized.replace(/^\/[^/]+(?=\/|$)/u, '');
  return ensureTrailingSlash(stripped || '/');
}

function getDocsRouteLocale(locale?: string): DocsRouteLocale {
  const resolvedLocale = normalizeLocale(locale);

  for (const candidate of [resolvedLocale, ...getSiteLocaleFallbackChain(resolvedLocale)]) {
    const directRouteLocale = DOCS_ROUTE_LOCALE_BY_SITE_LOCALE[candidate];
    if (directRouteLocale) {
      return directRouteLocale;
    }
  }

  return 'en-US';
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
  about: {
    dev: '/about/',
    prod: '/about/',
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
} as const;

export function getGlmCodingUrl(): string {
  return GLM_PROMO_LINKS.glmCoding.url;
}

export function getAliyunPromoUrl(): string {
  return '';
}

export type PublicLinkKey = keyof typeof SITE_LINKS;

function normalizeLocale(locale?: string): SiteLocale {
  return resolveSiteLocale(locale);
}

export function getDocsAbsoluteUrl(pathname: string, locale?: string): string {
  const docsUrl = new URL('https://docs.hagicode.com');
  return rebuildAbsoluteUrl(docsUrl, getLocalizedDocsPath(pathname, locale));
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
      return rebuildAbsoluteUrl(urlObject, getLocalizedDocsPath(urlObject.pathname, currentLocale));
    }

    if (urlObject.hostname === 'www.hagicode.com') {
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

const FIRST_PARTY_DOMAIN = 'hagicode.com';
const FIRST_PARTY_GITHUB_HOST = 'github.com';
const FIRST_PARTY_GITHUB_ORG = 'hagicode-org';
const SITE_ORIGIN_BASE = 'https://www.hagicode.com';

/**
 * 判断目标地址是否为第一方站点。
 * 第一方：http(s) 且主机为 hagicode.com 或其子域名，或 github.com 上的 HagiCode-org 组织。
 * 相对地址按站点自身来源解析，视为第一方。
 * 主机按解析后的 hostname 精确匹配，不做子串匹配。
 */
export function isFirstPartyHref(href: string): boolean {
  let url: URL;
  try {
    url = new URL(href, SITE_ORIGIN_BASE);
  } catch {
    return false;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return false;
  }

  const host = url.hostname.toLowerCase();
  if (host === FIRST_PARTY_DOMAIN || host.endsWith(`.${FIRST_PARTY_DOMAIN}`)) {
    return true;
  }

  if (host === FIRST_PARTY_GITHUB_HOST) {
    const [org] = url.pathname.split('/').filter(Boolean);
    return org?.toLowerCase() === FIRST_PARTY_GITHUB_ORG;
  }

  return false;
}

/**
 * 按目标地址所属类别返回新标签页打开时的 rel。
 * 第一方使用 noopener（保留来源 origin 作为 Referer），其他使用 noopener noreferrer。
 */
export function getRelForHref(href: string): 'noopener' | 'noopener noreferrer' {
  return isFirstPartyHref(href) ? 'noopener' : 'noopener noreferrer';
}

/**
 * 获取链接的 rel 属性（仅新标签页外部链接需要）。
 * @param key - 链接键名
 * @returns rel 属性值；同页跳转返回 undefined
 */
export function getLinkRel(key: PublicLinkKey): 'noopener' | 'noopener noreferrer' | undefined {
  return isExternalLink(key) ? getRelForHref(getLink(key)) : undefined;
}
