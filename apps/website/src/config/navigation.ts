/**
 * 导航链接配置
 * 站点导航链接的统一数据源,确保所有组件使用相同的链接配置
 * 使用共享链接库管理站点间跳转和公共链接
 */
import { getLink, type PublicLinkKey } from '@shared/links';

/**
 * 导航链接接口
 * 定义导航链接的基本结构
 */
export interface NavLink {
  /** 链接显示文本 */
  label: string;

  /** 链接地址 (支持相对路径和绝对 URL) */
  href: string;

  /** 是否为外部链接 (可选) */
  external?: boolean;

  /** Starlight 图标名称 (可选) */
  icon?: string;

  /** 链接键名 (用于从共享库获取环境相关链接) */
  linkKey?: PublicLinkKey;
}

/**
 * 站点导航链接配置
 * 使用共享链接库,自动根据环境切换开发/生产链接
 */
export const navLinks: NavLink[] = [
  {
    label: "文档",
    href: getLink('docs'),
    linkKey: 'docs',
  },
  {
    label: "桌面应用",
    href: getLink('desktop'),
    linkKey: 'desktop',
  },
  {
    label: "技术支持群",
    href: getLink('qqGroup'),
    external: true,
    linkKey: 'qqGroup',
  },
  {
    label: "GitHub",
    href: getLink('github'),
    external: true,
    linkKey: 'github',
  },
];
