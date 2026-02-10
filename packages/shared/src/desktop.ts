/**
 * Hagicode Desktop 相关类型定义
 * 基于 desktop.dl.hagicode.com/index.json 的实际数据结构
 */

/**
 * 资源类型枚举
 * 从文件名推断的平台和类型
 */
export enum AssetType {
  WindowsSetup = "windows-setup", // Windows 安装程序 (推荐)
  WindowsPortable = "windows-portable", // Windows 便携版
  WindowsStore = "windows-store", // Microsoft Store
  MacOSApple = "macos-apple", // macOS Apple Silicon (推荐)
  MacOSIntel = "macos-intel", // macOS Intel/通用
  LinuxAppImage = "linux-appimage", // Linux AppImage (推荐)
  LinuxDeb = "linux-deb", // Linux Debian 包
  LinuxTarball = "linux-tarball", // Linux 压缩包
  Source = "source", // 源代码
  Unknown = "unknown",
}

/**
 * 文件资源信息
 * 来自 index.json 的 assets 数组
 */
export interface DesktopAsset {
  /** 文件名 */
  name: string;
  /** 相对路径 */
  path: string;
  /** 文件大小 (字节) */
  size: number;
  /** 最后修改时间 (Unix 时间戳) */
  lastModified: number | null;
}

/**
 * 版本信息
 * 来自 index.json 的 versions 数组
 */
export interface DesktopVersion {
  /** 版本号 (如 "v0.1.1") */
  version: string;
  /** 文件名数组 */
  files: string[];
  /** 详细文件信息 */
  assets: DesktopAsset[];
}

/**
 * index.json 响应结构
 */
export interface DesktopIndexResponse {
  /** Unix 时间戳 */
  updatedAt: number;
  /** 版本列表 */
  versions: DesktopVersion[];
}

/**
 * 应用层使用的平台分类下载信息
 * 从文件名推断并格式化后的数据
 */
export interface PlatformDownload {
  /** 完整下载链接 */
  url: string;
  /** 格式化的文件大小 */
  size: string;
  /** 文件名 */
  filename: string;
  /** 资源类型 */
  assetType: AssetType;
}

/**
 * 平台分组信息
 * 按平台分组的下载资源
 */
export interface PlatformGroup {
  /** 平台名称 */
  platform: "windows" | "macos" | "linux";
  /** 该平台的下载资源列表 */
  downloads: PlatformDownload[];
}

/**
 * 平台推荐配置
 * 定义每个平台的推荐下载类型
 */
export interface PlatformRecommendation {
  /** 平台名称 */
  platform: string;
  /** 推荐的资源类型 */
  recommendedType: AssetType;
  /** 平台显示名称 */
  label: string;
  /** 图标名称 */
  icon: string;
}
