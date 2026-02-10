/**
 * 公共链接管理库
 *
 * 统一管理站点间的跳转链接和公共链接
 * 根据环境自动切换开发/生产环境的链接
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
        dev: 'http://localhost:4321/', // docs 应用开发环境端口
        prod: 'https://docs.hagicode.com/',
        external: false,
    } as LinkConfig,

    /** 官方营销站点 */
    website: {
        dev: 'http://localhost:4322/', // website 应用开发环境端口
        prod: 'https://hagicode.com/',
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
        dev: 'http://localhost:4321/blog/',
        prod: 'https://docs.hagicode.com/blog/',
        external: false,
    } as LinkConfig,

    /** 产品概述（相对于文档站点） */
    productOverview: {
        dev: 'http://localhost:4321/product-overview/',
        prod: 'https://docs.hagicode.com/product-overview/',
        external: false,
    } as LinkConfig,

    /** 桌面应用下载页 */
    desktop: {
        dev: 'http://localhost:4322/desktop/',
        prod: 'https://hagicode.com/desktop/',
        external: false,
    } as LinkConfig,

    /** Docker Compose 安装指南（相对于文档站点） */
    dockerCompose: {
        dev: 'http://localhost:4321/installation/docker-compose/',
        prod: 'https://docs.hagicode.com/installation/docker-compose/',
        external: false,
    } as LinkConfig,

    /** 容器部署落地页 */
    container: {
        dev: 'http://localhost:4322/container/',
        prod: 'https://hagicode.com/container/',
        external: false,
    } as LinkConfig,

    /** 博客 RSS 订阅（相对于文档站点） */
    rss: {
        dev: 'http://localhost:4321/blog/rss.xml',
        prod: 'https://docs.hagicode.com/blog/rss.xml',
        external: false,
    } as LinkConfig,
} as const;

/**
 * 公共链接类型
 */
export type PublicLinkKey = keyof typeof SITE_LINKS;

/**
 * 获取指定链接的当前环境 URL
 * @param key - 链接键名
 * @returns 当前环境下的完整 URL
 */
export function getLink(key: PublicLinkKey): string {
    const config = SITE_LINKS[key];
    const env = getEnvironment();

    if (env === 'development') {
        return config.dev;
    }
    return config.prod;
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
