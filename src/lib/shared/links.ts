import {
  DEFAULT_LOCALE,
  getLocalizedPathWithBase,
  resolveLocaleFromPathname,
  type SiteLocale,
} from '@/lib/locale-routing';

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
  const normalizedLocale = locale === 'zh-CN' ? 'zh-CN' : 'en';
  return getLocalizedPathWithBase('/', normalizedLocale, siteBase);
}

export interface LinkConfig {
  dev: string;
  prod: string;
  external?: boolean;
  relative?: boolean;
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
  const url = new URL(GLM_PROMO_LINKS.dockerComposeGuide.url);
  url.searchParams.set('lang', locale);
  return url.toString();
}

export type PublicLinkKey = keyof typeof SITE_LINKS;

function normalizeLocale(locale?: string): SiteLocale {
  return locale === 'zh-CN' ? 'zh-CN' : 'en';
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
    urlObject.searchParams.set('lang', currentLocale);
    return urlObject.toString();
  }

  const siteBase = import.meta.env.VITE_SITE_BASE || '';
  return getLocalizedPathWithBase(url, currentLocale, siteBase);
}

export function getCurrentLocale(): SiteLocale {
  if (typeof window !== 'undefined') {
    const pathLocale = resolveLocaleFromPathname(window.location.pathname);
    if (pathLocale) {
      return pathLocale;
    }

    try {
      const stored = localStorage.getItem('lang');
      if (stored === 'en' || stored === 'zh-CN') {
        return stored;
      }
    } catch {
      // Ignore storage access failures and fall back to the default locale.
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
