/**
 * Hagicode Desktop 工具函数
 * 用于获取和处理版本数据
 * 支持多架构包 (x64, ARM64)
 */

import type {
  DesktopAsset,
  DesktopIndexResponse,
  PlatformDownload,
  PlatformGroup,
  DesktopVersion,
} from './types/desktop';
import { AssetType, CpuArchitecture } from './types/desktop';
import semver from 'semver';

const INDEX_JSON_URL = "https://index.hagicode.com/desktop/index.json";
const LOCAL_VERSION_INDEX = "/version-index.json";
const DOWNLOAD_BASE_URL = "https://desktop.dl.hagicode.com/";
const TIMEOUT_MS = 30000;

// LocalStorage keys
const ARCHITECTURE_STORAGE_KEY = "hagicode-architecture-selection";

/**
 * 平台推荐配置
 * 支持多架构推荐
 */
export const PLATFORM_RECOMMENDATIONS: Record<
  "windows" | "macos" | "linux",
  { recommendedType: AssetType; recommendedArchitecture: CpuArchitecture; label: string; icon: string }
> = {
  windows: {
    recommendedType: AssetType.WindowsSetup,
    recommendedArchitecture: CpuArchitecture.X64,
    label: "Windows",
    icon: "seti:windows",
  },
  macos: {
    recommendedType: AssetType.MacOSApple,
    recommendedArchitecture: CpuArchitecture.ARM64,
    label: "macOS",
    icon: "seti:apple",
  },
  linux: {
    recommendedType: AssetType.LinuxAppImage,
    recommendedArchitecture: CpuArchitecture.X64,
    label: "Linux",
    icon: "seti:linux",
  },
};

/**
 * 比较两个版本字符串
 * @param v1 - 第一个版本
 * @param v2 - 第二个版本
 * @returns -1 如果 v1 < v2, 0 如果 v1 = v2, 1 如果 v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
  const cleaned1 = v1.replace(/^v/, '');
  const cleaned2 = v2.replace(/^v/, '');

  const cmp = semver.compare(cleaned1, cleaned2);
  // semver.compare 返回：负数如果 a < b, 0 如果相等, 正数如果 a > b
  if (cmp < 0) return -1;
  if (cmp > 0) return 1;
  return 0;
}

/**
 * 从文件名推断资源类型
 * 支持 ARM64 架构检测
 * @param filename - 文件名
 * @returns 资源类型枚举值
 */
export function inferAssetType(filename: string): AssetType {
  const name = filename.toLowerCase();

  // Windows
  if (name.includes("setup") && name.endsWith(".exe")) {
    return AssetType.WindowsSetup;
  }
  if (name.endsWith(".exe")) {
    return AssetType.WindowsPortable;
  }
  if (name.endsWith(".appx")) {
    return AssetType.WindowsStore;
  }

  // macOS
  if (name.includes("arm64") && name.endsWith(".dmg")) {
    return AssetType.MacOSApple;
  }
  if (name.includes("arm64-mac.zip")) {
    return AssetType.MacOSApple;
  }
  if (name.endsWith(".dmg")) {
    return AssetType.MacOSIntel;
  }
  if (name.includes("-mac.zip")) {
    return AssetType.MacOSIntel;
  }

  // Linux - 支持多架构
  if (name.includes("arm64") && name.endsWith(".appimage")) {
    return AssetType.LinuxArm64AppImage;
  }
  if (name.endsWith(".appimage")) {
    return AssetType.LinuxAppImage;
  }
  if (name.includes("arm64") && name.includes(".deb")) {
    return AssetType.LinuxArm64Deb;
  }
  if (name.includes("_amd64.deb")) {
    return AssetType.LinuxDeb;
  }
  if (name.includes("arm64") && name.includes(".tar.gz")) {
    return AssetType.LinuxArm64Tarball;
  }
  if (name.includes(".tar.gz")) {
    return AssetType.LinuxTarball;
  }

  return AssetType.Unknown;
}

/**
 * 从资源类型推断 CPU 架构
 * @param assetType - 资源类型
 * @returns CPU 架构
 */
export function inferArchitecture(assetType: AssetType): CpuArchitecture {
  switch (assetType) {
    case AssetType.MacOSApple:
    case AssetType.LinuxArm64AppImage:
    case AssetType.LinuxArm64Deb:
    case AssetType.LinuxArm64Tarball:
      return CpuArchitecture.ARM64;
    case AssetType.WindowsSetup:
    case AssetType.WindowsPortable:
    case AssetType.WindowsStore:
    case AssetType.MacOSIntel:
    case AssetType.LinuxAppImage:
    case AssetType.LinuxDeb:
    case AssetType.LinuxTarball:
      return CpuArchitecture.X64;
    default:
      return CpuArchitecture.Unknown;
  }
}

/**
 * 格式化文件大小
 * @param bytes - 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    return `${gb.toFixed(1)} GB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

/**
 * 平台图标常量（用于 UI 显示）
 */
export const PLATFORM_ICONS: Record<string, string> = {
  macos: '🍎',
  windows: '🪟',
  linux: '🐧',
};

/**
 * 获取资源类型的架构标签
 * @param assetType - 资源类型枚举值
 * @returns 架构标签（如 ARM64、x64）
 */
export function getArchitectureLabel(assetType: AssetType): string {
  const archLabels: Record<AssetType, string> = {
    [AssetType.MacOSApple]: 'ARM64',
    [AssetType.MacOSIntel]: 'x64',
    [AssetType.WindowsSetup]: 'x64',
    [AssetType.WindowsPortable]: 'x64',
    [AssetType.WindowsStore]: '',
    [AssetType.LinuxAppImage]: 'x64',
    [AssetType.LinuxArm64AppImage]: 'ARM64',
    [AssetType.LinuxDeb]: 'x64',
    [AssetType.LinuxArm64Deb]: 'ARM64',
    [AssetType.LinuxTarball]: 'x64',
    [AssetType.LinuxArm64Tarball]: 'ARM64',
    [AssetType.Source]: '',
    [AssetType.Unknown]: '',
  };
  return archLabels[assetType] || '';
}

/**
 * 获取资源类型的文件扩展名
 * @param assetType - 资源类型枚举值
 * @returns 文件扩展名（包含点号，如 .exe、.dmg）
 */
export function getFileExtension(assetType: AssetType): string {
  const extensions: Record<AssetType, string> = {
    [AssetType.WindowsSetup]: '.exe',
    [AssetType.WindowsPortable]: '.exe',
    [AssetType.WindowsStore]: '.appx',
    [AssetType.MacOSApple]: '.dmg',
    [AssetType.MacOSIntel]: '.dmg',
    [AssetType.LinuxAppImage]: '.AppImage',
    [AssetType.LinuxArm64AppImage]: '.AppImage',
    [AssetType.LinuxDeb]: '.deb',
    [AssetType.LinuxArm64Deb]: '.deb',
    [AssetType.LinuxTarball]: '.tar.gz',
    [AssetType.LinuxArm64Tarball]: '.tar.gz',
    [AssetType.Source]: '.zip',
    [AssetType.Unknown]: '',
  };
  return extensions[assetType] || '';
}

/**
 * 获取资源类型的显示名称
 * @param assetType - 资源类型枚举值
 * @returns 显示名称
 */
export function getAssetTypeLabel(assetType: AssetType): string {
  const labels: Record<AssetType, string> = {
    [AssetType.WindowsSetup]: "安装程序",
    [AssetType.WindowsPortable]: "便携版",
    [AssetType.WindowsStore]: "Microsoft Store",
    [AssetType.MacOSApple]: "Apple Silicon",
    [AssetType.MacOSIntel]: "Intel 版",
    [AssetType.LinuxAppImage]: "AppImage (x64)",
    [AssetType.LinuxArm64AppImage]: "AppImage (ARM64)",
    [AssetType.LinuxDeb]: "Debian 包 (x64)",
    [AssetType.LinuxArm64Deb]: "Debian 包 (ARM64)",
    [AssetType.LinuxTarball]: "压缩包 (x64)",
    [AssetType.LinuxArm64Tarball]: "压缩包 (ARM64)",
    [AssetType.Source]: "源代码",
    [AssetType.Unknown]: "其他",
  };
  return labels[assetType] || "未知";
}

/**
 * CPU 架构检测
 * 基于 UserAgent hints 和客户端提示 API
 * @returns 检测到的 CPU 架构
 */
export function detectArchitecture(): CpuArchitecture {
  if (typeof window === "undefined") {
    return CpuArchitecture.Unknown;
  }

  // 优先检查 URL 查询参数
  const urlParams = new URLSearchParams(window.location.search);
  const archParam = urlParams.get("arch");
  if (archParam) {
    const normalizedParam = archParam.toLowerCase();
    if (normalizedParam === "arm64" || normalizedParam === "aarch64") {
      return CpuArchitecture.ARM64;
    }
    if (normalizedParam === "x64" || normalizedParam === "amd64") {
      return CpuArchitecture.X64;
    }
  }

  // 尝试使用客户端提示 API (Chrome/Edge)
  if ("userAgentData" in navigator && (navigator as any).userAgentData) {
    const data = (navigator as any).userAgentData;
    if (data.platform === "Linux" && data.architecture) {
      const arch = data.architecture.toLowerCase();
      if (arch === "arm" || arch === "arm64") {
        return CpuArchitecture.ARM64;
      }
      if (arch === "x86-64") {
        return CpuArchitecture.X64;
      }
    }
  }

  // UserAgent 基于 Heuristic 检测
  const userAgent = navigator.userAgent;

  // Apple Silicon detection
  if (userAgent.includes("Mac") && (userAgent.includes("iPhone") || userAgent.includes("iPad") || /Mac OS X.*Arm/.test(userAgent))) {
    return CpuArchitecture.ARM64;
  }

  // Linux ARM64 detection (某些 Android 设备或其他 ARM64 Linux)
  if (userAgent.includes("Linux") && (userAgent.includes("aarch64") || /armv8/i.test(userAgent))) {
    return CpuArchitecture.ARM64;
  }

  // 默认返回 x64 (最常见)
  return CpuArchitecture.X64;
}

/**
 * 保存用户的架构选择到 localStorage
 * @param architecture - 选择的架构
 */
export function saveArchitectureSelection(architecture: CpuArchitecture): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(ARCHITECTURE_STORAGE_KEY, architecture);
    } catch (error) {
      console.warn("Failed to save architecture selection:", error);
    }
  }
}

/**
 * 从 localStorage 获取用户的架构选择
 * @returns 保存的架构，如果没有则返回 null
 */
export function getSavedArchitectureSelection(): CpuArchitecture | null {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const saved = localStorage.getItem(ARCHITECTURE_STORAGE_KEY);
      if (saved && (saved === CpuArchitecture.X64 || saved === CpuArchitecture.ARM64)) {
        return saved as CpuArchitecture;
      }
    } catch (error) {
      console.warn("Failed to read saved architecture selection:", error);
    }
  }
  return null;
}

/**
 * 清除保存的架构选择
 */
export function clearArchitectureSelection(): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.removeItem(ARCHITECTURE_STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear architecture selection:", error);
    }
  }
}

/**
 * 获取推荐的架构
 * 优先级: 用户保存的选择 > 自动检测 > 默认值
 * @param platform - 操作系统平台
 * @returns 推荐的 CPU 架构
 */
export function getRecommendedArchitecture(platform: "windows" | "macos" | "linux"): CpuArchitecture {
  // 1. 检查用户保存的选择
  const saved = getSavedArchitectureSelection();
  if (saved) {
    return saved;
  }

  // 2. 检查自动检测
  const detected = detectArchitecture();
  if (detected !== CpuArchitecture.Unknown) {
    return detected;
  }

  // 3. 使用平台默认值
  return PLATFORM_RECOMMENDATIONS[platform].recommendedArchitecture;
}

/**
 * 获取版本数据
 * 优先使用本地文件，确保构建过程不依赖外部服务
 * 返回的版本数组已按版本号从高到低排序
 * @returns 版本数据响应
 * @throws 当请求失败或超时时抛出错误，或在非浏览器环境调用时抛出错误
 */
export async function fetchDesktopVersions(): Promise<DesktopIndexResponse> {
  // 检查是否在浏览器环境中
  const isBrowser = typeof window !== 'undefined' && typeof fetch !== 'undefined';

  if (!isBrowser) {
    // 在 SSR/构建环境中，抛出错误而不是返回空数据
    // 这样可以避免水合不匹配的问题
    throw new Error("fetchDesktopVersions cannot be called in SSR environment");
  }

  // Try to load from local file first
  try {
    const response = await fetch(LOCAL_VERSION_INDEX);
    if (response.ok) {
      const data: DesktopIndexResponse = await response.json();

      // 验证数据结构
      if (!Array.isArray(data.versions)) {
        throw new Error("Invalid data structure: missing versions array");
      }

      // 按版本号排序（从高到低）
      data.versions.sort((a, b) => compareVersions(b.version, a.version));

      return data;
    }
  } catch (error) {
    // Local file not available, fall back to online API
    console.warn("Local version index not available, falling back to online API");
  }

  // Fallback to online API
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(INDEX_JSON_URL, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: DesktopIndexResponse = await response.json();

    // 验证数据结构
    if (!Array.isArray(data.versions)) {
      throw new Error("Invalid data structure: missing versions array");
    }

    // 按版本号排序（从高到低）
    data.versions.sort((a, b) => compareVersions(b.version, a.version));

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout: failed to fetch version data");
    }
    throw error;
  }
}

/**
 * 获取指定渠道的最新版本
 * @param channel - 渠道名称 ('stable' | 'beta')
 * @returns 该渠道的最新 DesktopVersion 对象
 * @throws 当渠道数据不存在或版本未找到时抛出错误
 */
export async function getChannelLatestVersion(
  channel: 'stable' | 'beta'
): Promise<DesktopVersion> {
  const data = await fetchDesktopVersions();

  // 检查 channels 字段是否存在
  if (!data.channels || !data.channels[channel]) {
    throw new Error(`Channel '${channel}' not available in version data`);
  }

  const channelInfo = data.channels[channel];
  const latestVersion = channelInfo.latest;

  // 在 versions 数组中查找对应的版本对象
  const latestVersionObj = data.versions.find(v => v.version === latestVersion);

  if (!latestVersionObj) {
    throw new Error(`Version '${latestVersion}' not found in versions array for channel '${channel}'`);
  }

  return latestVersionObj;
}

/**
 * 获取指定渠道的所有版本
 * @param channel - 渠道名称 ('stable' | 'beta')
 * @returns 该渠道的 DesktopVersion 对象数组
 * @throws 当渠道数据不存在时抛出错误
 */
export async function getAllChannelVersions(
  channel: 'stable' | 'beta'
): Promise<DesktopVersion[]> {
  const data = await fetchDesktopVersions();

  // 检查 channels 字段是否存在
  if (!data.channels || !data.channels[channel]) {
    throw new Error(`Channel '${channel}' not available in version data`);
  }

  const channelInfo = data.channels[channel];
  const channelVersions = channelInfo.versions;

  // 在 versions 数组中查找对应的版本对象
  const versionObjects = data.versions.filter(v =>
    channelVersions.includes(v.version)
  );

  // 按版本号排序（从高到低）
  versionObjects.sort((a, b) => compareVersions(b.version, a.version));

  return versionObjects;
}

/**
 * 将资源按平台分组
 * 支持多架构资源
 * @param assets - 文件资源数组
 * @param selectedArchitecture - 选中的架构 (可选，用于过滤)
 * @returns 按平台分组的资源
 */
export function groupAssetsByPlatform(
  assets: DesktopAsset[] | undefined,
  selectedArchitecture?: CpuArchitecture
): PlatformGroup[] {
  if (!assets || !Array.isArray(assets)) {
    return [];
  }

  const platformGroups = new Map<string, PlatformDownload[]>();
  const architectures = new Map<string, Set<CpuArchitecture>>();

  for (const asset of assets) {
    const assetType = inferAssetType(asset.name);
    if (assetType === AssetType.Unknown) {
      continue;
    }

    let platform: "windows" | "macos" | "linux" | null = null;
    switch (assetType) {
      case AssetType.WindowsSetup:
      case AssetType.WindowsPortable:
      case AssetType.WindowsStore:
        platform = "windows";
        break;
      case AssetType.MacOSApple:
      case AssetType.MacOSIntel:
        platform = "macos";
        break;
      case AssetType.LinuxAppImage:
      case AssetType.LinuxArm64AppImage:
      case AssetType.LinuxDeb:
      case AssetType.LinuxArm64Deb:
      case AssetType.LinuxTarball:
      case AssetType.LinuxArm64Tarball:
        platform = "linux";
        break;
      default:
        continue;
    }

    if (!platform) continue;

    const architecture = inferArchitecture(assetType);

    // 如果指定了架构选择，过滤不匹配的资源
    if (selectedArchitecture && architecture !== selectedArchitecture) {
      continue;
    }

    if (!platformGroups.has(platform)) {
      platformGroups.set(platform, []);
      architectures.set(platform, new Set());
    }

    platformGroups.get(platform)!.push({
      url: `${DOWNLOAD_BASE_URL}${asset.path}`,
      size: formatFileSize(asset.size),
      filename: asset.name,
      assetType,
      architecture,
    });

    architectures.get(platform)!.add(architecture);
  }

  // 转换为数组并按推荐类型排序
  const result: PlatformGroup[] = [];
  for (const [platform, downloads] of platformGroups.entries()) {
    const recommendation = PLATFORM_RECOMMENDATIONS[
      platform as "windows" | "macos" | "linux"
    ];

    // 将推荐类型排在前面
    downloads.sort((a, b) => {
      const aRecommended = a.assetType === recommendation.recommendedType &&
                          a.architecture === recommendation.recommendedArchitecture;
      const bRecommended = b.assetType === recommendation.recommendedType &&
                          b.architecture === recommendation.recommendedArchitecture;

      if (aRecommended && !bRecommended) return -1;
      if (!aRecommended && bRecommended) return 1;
      return 0;
    });

    result.push({
      platform: platform as "windows" | "macos" | "linux",
      downloads,
      architectures: Array.from(architectures.get(platform)!),
    });
  }

  return result;
}

/**
 * 获取平台的推荐下载项
 * 支持按架构过滤
 * @param platform - 平台名称
 * @param downloads - 下载资源列表
 * @param architecture - CPU 架构 (可选)
 * @returns 推荐的下载项，如果没有则返回第一个
 */
export function getRecommendedDownload(
  platform: "windows" | "macos" | "linux",
  downloads: PlatformDownload[],
  architecture?: CpuArchitecture
): PlatformDownload | null {
  const recommendation = PLATFORM_RECOMMENDATIONS[platform];

  // 过滤出匹配架构的资源
  let filteredDownloads = downloads;
  if (architecture) {
    filteredDownloads = downloads.filter(d => d.architecture === architecture);
  }

  // 查找推荐类型和架构
  const recommended = filteredDownloads.find(
    (d) => d.assetType === recommendation.recommendedType &&
           (architecture ? d.architecture === architecture : true)
  );

  return recommended || filteredDownloads[0] || null;
}

/**
 * 检测用户操作系统
 * 支持查询字符串覆盖 ?os=windows|macos|linux
 * @returns 检测到的操作系统
 */
export function detectOS(): "windows" | "macos" | "linux" | "unknown" {
  // 优先检查 URL 查询参数
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const osParam = urlParams.get("os");
    if (osParam) {
      const validOS = ["windows", "macos", "linux"];
      const normalizedParam = osParam.toLowerCase();
      if (validOS.includes(normalizedParam)) {
        return normalizedParam as "windows" | "macos" | "linux";
      }
    }

    // 基于 UserAgent 检测
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Windows")) {
      return "windows";
    }
    if (
      userAgent.includes("Mac") ||
      userAgent.includes("iPhone") ||
      userAgent.includes("iPad") ||
      userAgent.includes("Mac OS")
    ) {
      return "macos";
    }
    if (userAgent.includes("Linux")) {
      return "linux";
    }
  }

  return "unknown";
}

/**
 * 检查两个架构是否兼容
 * @param targetArchitecture - 目标架构
 * @param userArchitecture - 用户系统架构
 * @returns 是否兼容 (大多数情况下不兼容，除非相同)
 */
export function isArchitectureCompatible(
  targetArchitecture: CpuArchitecture,
  userArchitecture: CpuArchitecture
): boolean {
  if (targetArchitecture === CpuArchitecture.Unknown || userArchitecture === CpuArchitecture.Unknown) {
    return true; // 无法确定时假设兼容
  }
  return targetArchitecture === userArchitecture;
}

/**
 * 获取架构不兼容警告消息
 * @param targetArchitecture - 目标架构
 * @param userArchitecture - 用户系统架构
 * @returns 警告消息或 null
 */
export function getArchitectureIncompatibilityWarning(
  targetArchitecture: CpuArchitecture,
  userArchitecture: CpuArchitecture
): string | null {
  if (!isArchitectureCompatible(targetArchitecture, userArchitecture)) {
    return `警告：您正在下载 ${targetArchitecture} 版本，但您的系统是 ${userArchitecture} 架构。这可能会导致性能问题或无法运行。`;
  }
  return null;
}
