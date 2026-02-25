/**
 * Hagicode Desktop 相关类型定义
 * 基于 desktop.dl.hagicode.com/index.json 的实际数据结构
 * 支持多架构包 (x64, ARM64)
 */

/**
 * CPU 架构类型
 */
export enum CpuArchitecture {
  X64 = "x64",
  ARM64 = "arm64",
  Unknown = "unknown",
}

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
  LinuxAppImage = "linux-appimage", // Linux AppImage x64 (推荐)
  LinuxArm64AppImage = "linux-arm64-appimage", // Linux AppImage ARM64
  LinuxDeb = "linux-deb", // Linux Debian 包 x64
  LinuxArm64Deb = "linux-arm64-deb", // Linux Debian 包 ARM64
  LinuxTarball = "linux-tarball", // Linux 压缩包 x64
  LinuxArm64Tarball = "linux-arm64-tarball", // Linux 压缩包 ARM64
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
  /** 文件详细信息数组 */
  files: DesktopAsset[];
}

/**
 * 渠道信息
 */
export interface ChannelInfo {
  /** 该渠道最新版本号 */
  latest: string;
  /** 该渠道包含的版本号列表 */
  versions: string[];
}

/**
 * index.json 响应结构（更新后）
 */
export interface DesktopIndexResponse {
  /** Unix 时间戳或 ISO 时间戳字符串 */
  updatedAt: number | string;
  /** 版本列表（完整历史） */
  versions: DesktopVersion[];
  /** 渠道信息（可选，向后兼容） */
  channels?: {
    /** 稳定版渠道 */
    stable: ChannelInfo;
    /** 测试版渠道 */
    beta: ChannelInfo;
  };
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
  /** CPU 架构 */
  architecture: CpuArchitecture;
}

/**
 * 平台分组信息
 * 按平台分组的下载资源，支持多架构
 */
export interface PlatformGroup {
  /** 平台名称 */
  platform: "windows" | "macos" | "linux";
  /** 该平台的下载资源列表 */
  downloads: PlatformDownload[];
  /** 可用的架构列表 */
  architectures: CpuArchitecture[];
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
  /** Starlight 图标名称 */
  icon: string;
  /** 推荐的 CPU 架构 */
  recommendedArchitecture: CpuArchitecture;
}

/**
 * 架构选择配置
 */
export interface ArchitectureSelection {
  /** 选中的架构 */
  architecture: CpuArchitecture;
  /** 架构是否自动检测 */
  isAutoDetected: boolean;
  /** 检测置信度 (0-1) */
  confidence: number;
}
