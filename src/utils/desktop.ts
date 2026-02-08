/**
 * Hagicode Desktop 工具函数
 * 用于获取和处理版本数据
 */

import type {
  DesktopAsset,
  DesktopIndexResponse,
  PlatformDownload,
  PlatformGroup,
} from "@/types/desktop";
import { AssetType } from "@/types/desktop";

const INDEX_JSON_URL = "https://desktop.dl.hagicode.com/index.json";
const DOWNLOAD_BASE_URL = "https://desktop.dl.hagicode.com/";
const TIMEOUT_MS = 30000;

/**
 * 平台推荐配置
 */
export const PLATFORM_RECOMMENDATIONS: Record<
  "windows" | "macos" | "linux",
  { recommendedType: AssetType; label: string; icon: string }
> = {
  windows: {
    recommendedType: AssetType.WindowsSetup,
    label: "Windows",
    icon: "seti:windows",
  },
  macos: {
    recommendedType: AssetType.MacOSApple,
    label: "macOS",
    icon: "seti:apple",
  },
  linux: {
    recommendedType: AssetType.LinuxAppImage,
    label: "Linux",
    icon: "seti:linux",
  },
};

/**
 * 从文件名推断资源类型
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

  // Linux
  if (name.endsWith(".appimage")) {
    return AssetType.LinuxAppImage;
  }
  if (name.includes("_amd64.deb")) {
    return AssetType.LinuxDeb;
  }
  if (name.includes(".tar.gz")) {
    return AssetType.LinuxTarball;
  }

  return AssetType.Unknown;
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
    [AssetType.LinuxAppImage]: "AppImage",
    [AssetType.LinuxDeb]: "Debian 包",
    [AssetType.LinuxTarball]: "压缩包",
    [AssetType.Source]: "源代码",
    [AssetType.Unknown]: "其他",
  };
  return labels[assetType] || "未知";
}

/**
 * 获取版本数据
 * @returns 版本数据响应
 * @throws 当请求失败或超时时抛出错误
 */
export async function fetchDesktopVersions(): Promise<DesktopIndexResponse> {
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

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout: failed to fetch version data");
    }
    throw error;
  }
}

/**
 * 将资源按平台分组
 * @param assets - 文件资源数组
 * @returns 按平台分组的资源
 */
export function groupAssetsByPlatform(
  assets: DesktopAsset[]
): PlatformGroup[] {
  const platformGroups = new Map<string, PlatformDownload[]>();

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
      case AssetType.LinuxDeb:
      case AssetType.LinuxTarball:
        platform = "linux";
        break;
      default:
        continue;
    }

    if (!platform) continue;

    if (!platformGroups.has(platform)) {
      platformGroups.set(platform, []);
    }

    platformGroups.get(platform)!.push({
      url: `${DOWNLOAD_BASE_URL}${asset.path}`,
      size: formatFileSize(asset.size),
      filename: asset.name,
      assetType,
    });
  }

  // 转换为数组并按推荐类型排序
  const result: PlatformGroup[] = [];
  for (const [platform, downloads] of platformGroups.entries()) {
    const recommendation = PLATFORM_RECOMMENDATIONS[
      platform as "windows" | "macos" | "linux"
    ];

    // 将推荐类型排在前面
    downloads.sort((a, b) => {
      if (a.assetType === recommendation.recommendedType) return -1;
      if (b.assetType === recommendation.recommendedType) return 1;
      return 0;
    });

    result.push({
      platform: platform as "windows" | "macos" | "linux",
      downloads,
    });
  }

  return result;
}

/**
 * 获取平台的推荐下载项
 * @param platform - 平台名称
 * @param downloads - 下载资源列表
 * @returns 推荐的下载项，如果没有则返回第一个
 */
export function getRecommendedDownload(
  platform: "windows" | "macos" | "linux",
  downloads: PlatformDownload[]
): PlatformDownload | null {
  const recommendation = PLATFORM_RECOMMENDATIONS[platform];
  const recommended = downloads.find(
    (d) => d.assetType === recommendation.recommendedType
  );
  return recommended || downloads[0] || null;
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
