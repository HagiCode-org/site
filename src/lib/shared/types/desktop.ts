/**
 * Hagicode Desktop 相关类型定义
 * 基于 index.hagicode.com/desktop/index.json 的实际数据结构
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

export type DesktopPlatform = "windows" | "macos" | "linux";

export type DesktopStructuredSourceKind = "official" | "github-release";

export type DownloadSourceKind = DesktopStructuredSourceKind | "torrent" | "legacy";

export type DownloadSourceProbeState = "unknown" | "probing" | "reachable" | "unreachable";
export type DownloadSourceProbeStateMap = Partial<Record<DownloadSourceKind, DownloadSourceProbeState>>;
export type GithubReachabilityState = DownloadSourceProbeState;

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
  /** 最后修改时间（ISO 字符串或时间戳） */
  lastModified: number | string | null;
  /** 直链地址（index 站新结构可选提供） */
  directUrl?: string;
  /** 种子下载地址 */
  torrentUrl?: string;
  /** 可选信息哈希 */
  infoHash?: string;
  /** 兼容 hybrid metadata 的 WebSeed 列表 */
  webSeeds?: string[];
  /** 结构化下载源 */
  downloadSources?: DesktopDownloadSource[];
}

export interface DesktopDownloadSource {
  kind?: string;
  label?: string;
  url?: string;
  primary?: boolean;
  webSeed?: boolean;
}

/**
 * 版本信息
 * 来自 index.json 的 versions 数组
 */
export interface DesktopVersion {
  /** 版本号 (如 "v0.1.1") */
  version: string;
  /** 文件详细信息数组（canonical） */
  assets: DesktopAsset[];
  /** 文件相对路径列表（兼容 index 附带字段） */
  files?: string[];
}

/**
 * 渠道信息
 */
export interface ChannelInfo {
  /** 该渠道最新版本号 */
  latest: string | null;
  /** 该渠道包含的版本号列表 */
  versions: string[];
}

export interface DesktopChannels {
  /** 稳定版渠道 */
  stable: ChannelInfo;
  /** 测试版渠道 */
  beta?: ChannelInfo;
  /** 兼容未来新增的其他渠道，例如 dev */
  [channel: string]: ChannelInfo | undefined;
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
  channels?: DesktopChannels;
}

/**
 * 应用层使用的平台分类下载信息
 * 从文件名推断并格式化后的数据
 */
export interface PlatformDownload {
  /** 安全回退下载链接（优先官方 / legacy） */
  url: string;
  /** 格式化的文件大小 */
  size: string;
  /** 文件名 */
  filename: string;
  /** 资源类型 */
  assetType: AssetType;
  /** CPU 架构 */
  architecture: CpuArchitecture;
  /** 同一资产下的显式来源动作 */
  sourceActions: DownloadAction[];
}

export interface DownloadAction {
  /** 来源类型 */
  kind: DownloadSourceKind;
  /** 展示标签 */
  label: string;
  /** 下载地址 */
  url: string;
  /** 是否由结构化来源显式提供 */
  isStructured: boolean;
  /** 是否来自 legacy fallback */
  isLegacyFallback: boolean;
  /** 是否被源数据标记为 primary */
  isPrimary: boolean;
}

/**
 * 平台分组信息
 * 按平台分组的下载资源，支持多架构
 */
export interface PlatformGroup {
  /** 平台名称 */
  platform: DesktopPlatform;
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
