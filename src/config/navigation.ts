/**
 * 导航链接配置
 * 站点导航链接的统一数据源,确保所有组件使用相同的链接配置
 */
import { withBasePath } from "@/utils/path";

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
}

/**
 * 站点导航链接配置
 * 所有链接在配置时使用相对路径,withBasePath 会在运行时处理 base path
 */
export const navLinks: NavLink[] = [
  {
    label: "博客",
    href: withBasePath("/blog"),
    icon: "pencil",
  },
  {
    label: "文档",
    href: withBasePath("/product-overview"),
    icon: "document",
  },
  {
    label: "客户端",
    href: withBasePath("/desktop"),
    icon: "desktop",
  },
  {
    label: "技术支持群 610394020",
    href: "https://qm.qq.com/q/Fwb0o094kw",
    external: true,
    icon: "comment",
  },
  {
    label: "GitHub （求 Star ~）",
    href: "https://github.com/HagiCode-org/site",
    external: true,
    icon: "github",
  },
];
