/**
 * 路径工具函数
 * 处理站点的 base path，确保在子路径部署时链接正常工作
 */

/**
 * 获取站点基础路径
 * 从 HTML data 属性或环境变量读取
 */
export function getBasePath(): string {
  // 优先从 HTML 元素的 data 属性读取（运行时）
  if (typeof window !== 'undefined') {
    const dataBase = document.documentElement.getAttribute('data-site-base');
    if (dataBase) {
      return dataBase;
    }
  }

  // 回退到环境变量（构建时）
  if (import.meta.env.VITE_SITE_BASE) {
    return import.meta.env.VITE_SITE_BASE;
  }

  return '/';
}

/**
 * 规范化路径，确保包含 base path
 * @param path - 原始路径（如 '/docs/...'）
 * @returns 完整路径（如 '/site/docs/...' 或 '/docs/...'）
 */
export function withBasePath(path: string): string {
  const base = getBasePath();

  // 如果是外部链接，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 如果路径已经包含 base，直接返回
  if (base !== '/' && path.startsWith(base)) {
    return path;
  }

  // 移除开头的斜杠以便拼接
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;

  return `${normalizedBase}${normalizedPath}`;
}

/**
 * 创建带 base path 的 URL
 * 用于动态生成链接
 */
export function createUrl(path: string, hash?: string): string {
  const url = withBasePath(path);
  return hash ? `${url}${hash.startsWith('#') ? hash : `#${hash}`}` : url;
}
