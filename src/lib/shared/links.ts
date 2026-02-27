/**
 * 公共链接管理库
 *
 * 统一管理站点间的跳转链接和公共链接
 * 根据环境自动切换开发/生产环境的链接
 *
 * 开发环境链接配置
 *
 * 端口可通过环境变量配置：
 * - PORT_DOCS: 文档站点端口（默认 31265）
 * - PORT_WEBSITE: 营销站点端口（默认 31264）
 *
 * 如需自定义端口，请在 .env.local 中设置对应的环境变量
 */

/**
 * 获取当前环境类型
 * 使用 NODE_ENV 环境变量来区分开发/生产环境
 * @returns 'development' | 'production'
 */
export function getEnvironment(): 'development' | 'production' {
  // 优先使用 NODE_ENV 环境变量
  // 如果没有设置，则根据 import.meta.env.MODE 判断（Astro 内置）
  const nodeEnv = import.meta.env.NODE_ENV || import.meta.env.MODE;
  if (nodeEnv === 'development') {
        return 'development';
    }
    return 'production';
}

/**
 * 获取文档站点的 base 路径
 * 开发环境为根路径，生产环境为根路径（独立部署在 docs.hagicode.com）
 * @returns base 路径
 */
export function getDocsBasePath(): string {
    return '/';
}

/**
 * 获取正确的 base 路径（考虑 locale 和站点配置）
 * 在英文页面（/en/）需要拼接 /en/，中文页面（/）不需要
 * @param locale - 当前语言环境
 * @returns base 路径
 */
export function getCorrectBasePath(locale: string): string {
  const siteBase = import.meta.env.VITE_SITE_BASE || '';

  // 如果是英文，需要添加 /en/ 前缀
  if (locale === 'en') {
    return siteBase ? `${siteBase}en/` : '/en/';
  }

  // 中文页面直接返回 siteBase
  return siteBase;
}

/**
 * 链接配置接口
 */
export interface LinkConfig {
  /** 开发环境链接 */
    dev: string;
    /** 生产环境链接 */
    prod: string;
    /** 是否为外部链接（新窗口打开） */
    external?: boolean;
    /** 是否为相对路径（需要添加 base 前缀） */
    relative?: boolean;
}

/**
 * 站点间链接配置
 */
export const SITE_LINKS = {
    /** 文档站点 */
    docs: {
        dev: 'https://docs.hagicode.com/', // 使用生产 URL（跨仓库链接）
        prod: 'https://docs.hagicode.com/',
        external: false,
    } as LinkConfig,
    /** 官方营销站点 */
    website: {
        dev: '/', // 本站点根路径
        prod: '/', // 本站点根路径
        external: false,
    } as LinkConfig,
    /** GitHub 仓库 */
    github: {
        dev: 'https://github.com/HagiCode-org/site',
        prod: 'https://github.com/HagiCode-org/site',
        external: true,
    } as LinkConfig,
    /** 技术支持群 QQ */
    qqGroup: {
        dev: 'https://qm.qq.com/q/Fwb0o094kw',
        prod: 'https://qm.qq.com/q/Fwb0o094kw',
        external: true,
    } as LinkConfig,
    /** 博客页面（相对于文档站点） */
    blog: {
        dev: 'https://docs.hagicode.com/blog/', // 使用生产 URL（跨仓库链接）
        prod: 'https://docs.hagicode.com/blog/',
        external: false,
    } as LinkConfig,
    /** 产品概述（相对于文档站点） */
    productOverview: {
        dev: 'https://docs.hagicode.com/product-overview/', // 使用生产 URL（跨仓库链接）
        prod: 'https://docs.hagicode.com/product-overview/',
        external: false,
    } as LinkConfig,
    /** 桌面应用下载页 */
    desktop: {
        dev: '/desktop/', // 相对路径，开发环境使用 localhost:31264
        prod: '/desktop/', // 相对路径，支持 locale 前缀
        external: false,
    } as LinkConfig,
    /** Docker Compose 安装指南（相对于文档站点） */
    dockerCompose: {
        dev: 'https://docs.hagicode.com/installation/docker-compose/',
        prod: 'https://docs.hagicode.com/installation/docker-compose/',
        external: false,
    } as LinkConfig,
    /** 容器部署落地页 */
    container: {
        dev: '/container/', // 相对路径，开发环境使用 localhost:31264
        prod: '/container/', // 相对路径，支持 locale 前缀
        external: false,
    } as LinkConfig,
    /** 博客 RSS 订阅（相对于文档站点） */
    rss: {
        dev: 'https://docs.hagicode.com/blog/rss.xml', // 使用生产 URL（跨仓库链接）
        prod: 'https://docs.hagicode.com/blog/rss.xml',
        external: false,
    } as LinkConfig,
} as const;

/**
 * GLM（智谱 AI）推广链接配置
 * 用于博客广告区域和其他推广位置
 */
export const GLM_PROMO_LINKS = {
    /** 智谱 GLM Coding 订阅链接（带推广码） */
    glmCoding: {
        url: 'https://www.bigmodel.cn/glm-coding?ic=14BY54APZA',
        label: '立即开拼',
        title: '智谱 GLM Coding: 20+ 大编程工具无缝支持',
        description: 'Claude Code、Cline 等 20+ 大编程工具无缝支持，"码力"全开，越拼越爽！',
        discount: '10% 优惠',
    },
    /** Docker Compose 部署指南链接 */
    dockerComposeGuide: {
        url: '/installation/docker-compose/',
        label: '查看部署指南',
        title: 'Docker Compose 部署: 一键部署 Hagicode',
        description: '一键部署 Hagicode，快速体验 AI 编程助手',
        isInternal: true,
    },
} as const;

/**
 * 获取 GLM Coding 推广链接
 * @returns GLM Coding 推广链接 URL
 */
export function getGlmCodingUrl(): string {
    return GLM_PROMO_LINKS.glmCoding.url;
}

/**
 * 获取阿里云千问 Coding Plan 推广链接
 * @returns 阿里云千问 Coding Plan 推广链接 URL
 */
export function getAliyunPromoUrl(): string {
    return '';
}

/**
 * 获取 Docker Compose 部署指南链接（带 base 路径）
 * @returns Docker Compose 部署指南完整 URL
 */
export function getDockerComposeGuideUrl(): string {
    const basePath = getCorrectBasePath('zh-CN');
    const path = GLM_PROMO_LINKS.dockerComposeGuide.url;
    // 确保 base 路径和链接路径正确拼接
    if (basePath === '/') {
        return path;
    }
    return `${basePath}${path}`.replace(/\/+/g, '/');
}

/**
 * 公共链接类型
 */
export type PublicLinkKey = keyof typeof SITE_LINKS;

/**
 * Get the correct link URL for the specified key and locale
 * For cross-site links (docs, blog, etc.), adds the current language parameter
 * @param key - Link key name
 * @param locale - Current locale (optional, defaults to client-side detection)
 * @returns Correct URL with proper base path for locale and language parameter for cross-site links
 */
export function getLinkWithLocale(key: PublicLinkKey, locale?: string): string {
  const config = SITE_LINKS[key];
  const env = getEnvironment();
  const basePath = getCorrectBasePath(locale || 'zh-CN');

  // Get the base URL based on environment
  let url = env === 'development' ? config.dev : config.prod;

  // If it's an absolute URL (starts with http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // For cross-site links, add the language parameter
    const currentLocale = locale || getCurrentLocale();
    const urlObj = new URL(url);
    urlObj.searchParams.set('lang', currentLocale);
    return urlObj.toString();
  }

  // For relative paths, prepend the base path
  // Remove leading slashes from the relative path
  const relativePath = url.replace(/^\/+/, '');

  // If basePath is empty, just return the relative path with leading slash
  if (!basePath) {
    return `/${relativePath}`;
  }

  // Ensure no double slashes when concatenating
  return `${basePath}${relativePath}`.replace(/\/+/g, '/');
}

/**
 * Get the current locale from localStorage
 * @returns Current locale ('en' or 'zh-CN')
 */
export function getCurrentLocale(): string {
  if (typeof window !== 'undefined') {
    try {
      const lang = localStorage.getItem('lang');
      if (lang === 'en' || lang === 'zh-CN') {
        return lang;
      }
    } catch (e) {
      // Silent fallback when localStorage is unavailable
    }
  }
  return 'zh-CN'; // Default to Chinese
}

/**
 * Backward compatible function: Get link URL for specified key (defaults to zh-CN)
 * @param key - Link key name
 * @returns Link URL
 */
export function getLink(key: PublicLinkKey): string {
  return getLinkWithLocale(key, 'zh-CN');
}

/**
 * 获取指定链接的配置信息
 * @param key - 链接键名
 * @returns 链接配置对象
 */
export function getLinkConfig(key: PublicLinkKey): LinkConfig {
    return SITE_LINKS[key];
}

/**
 * 判断链接是否为外部链接
 * @param key - 链接键名
 * @returns 是否为外部链接
 */
export function isExternalLink(key: PublicLinkKey): boolean {
    return SITE_LINKS[key].external === true;
}

/**
 * 获取链接的打开方式属性
 * @param key - 链接键名
 * @returns target 属性值
 */
export function getLinkTarget(key: PublicLinkKey): '_blank' | undefined {
    return isExternalLink(key) ? '_blank' : undefined;
}

/**
 * 获取链接的 rel 属性（用于外部链接的安全）
 * @param key - 链接键名
 * @returns rel 属性值
 */
export function getLinkRel(key: PublicLinkKey): 'noopener noreferrer' | undefined {
    return isExternalLink(key) ? 'noopener noreferrer' : undefined;
}
