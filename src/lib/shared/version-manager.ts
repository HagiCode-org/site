/**
 * Desktop 版本数据管理器
 *
 * 提供单例模式的版本数据管理，支持服务端注入和客户端获取
 * 用于统一管理 Desktop 版本信息，避免重复请求
 */

import type {
  DesktopIndexResponse,
  DesktopVersion,
  PlatformGroup,
  ChannelInfo,
} from './types/desktop';
import {
  fetchDesktopVersions,
  groupAssetsByPlatform,
} from './desktop-utils';

/**
 * 版本数据接口
 * 包含最新版本、平台分组、错误信息和渠道数据
 */
export interface DesktopVersionData {
  /** 最新版本信息 */
  latest: DesktopVersion | null;
  /** 按平台分组的下载资源 */
  platforms: PlatformGroup[];
  /** 错误信息 */
  error: string | null;
  /** 渠道信息 */
  channels: {
    /** 稳定版渠道 */
    stable: {
      /** 最新版本 */
      latest: DesktopVersion | null;
      /** 所有版本 */
      all: DesktopVersion[];
    };
    /** 测试版渠道 */
    beta: {
      /** 最新版本 */
      latest: DesktopVersion | null;
      /** 所有版本 */
      all: DesktopVersion[];
    };
  };
}

/**
 * 版本管理器类
 * 单例模式，确保全局只有一个实例
 */
class VersionManager {
  private static instance: VersionManager | null = null;
  private data: DesktopVersionData | null = null;
  private initialized: boolean = false;
  private fetching: boolean = false;
  private pendingPromises: Array<{
    resolve: (data: DesktopVersionData) => void;
    reject: (error: Error) => void;
  }> = [];

  private constructor() {
    // 私有构造函数，防止直接实例化
  }

  /**
   * 获取单例实例
   */
  static getInstance(): VersionManager {
    if (!VersionManager.instance) {
      VersionManager.instance = new VersionManager();
    }
    return VersionManager.instance;
  }

  /**
   * 设置服务端注入的数据（用于 SSR）
   * 在 Astro 页面的服务端调用此方法，将版本数据注入到客户端
   *
   * @param data - 从服务端获取的版本数据
   */
  setServerData(data: DesktopIndexResponse): void {
    const versionData = this.transformToVersionData(data);
    this.data = versionData;
    this.initialized = true;

    // 解析所有等待的 Promise
    for (const { resolve } of this.pendingPromises) {
      resolve(versionData);
    }
    this.pendingPromises = [];
  }

  /**
   * 获取版本数据
   * 如果数据已初始化，直接返回缓存数据
   * 否则发起请求获取数据
   *
   * @returns 版本数据
   */
  async getVersionData(): Promise<DesktopVersionData> {
    // 如果数据已初始化，直接返回
    if (this.initialized && this.data) {
      return this.data;
    }

    // 检查是否有服务端注入的全局数据
    if (typeof window !== 'undefined' && (window as any).__DESKTOP_VERSION_DATA__) {
      const serverData = (window as any).__DESKTOP_VERSION_DATA__;
      if (serverData) {
        const versionData = this.transformToVersionData(serverData);
        this.data = versionData;
        this.initialized = true;
        // 清除全局数据以避免内存泄漏
        delete (window as any).__DESKTOP_VERSION_DATA__;
        return versionData;
      }
    }

    // 如果正在获取数据，等待结果
    if (this.fetching) {
      return new Promise((resolve, reject) => {
        this.pendingPromises.push({ resolve, reject });
      });
    }

    // 开始获取数据
    this.fetching = true;

    try {
      const responseData = await fetchDesktopVersions();
      const versionData = this.transformToVersionData(responseData);

      this.data = versionData;
      this.initialized = true;

      // 解析所有等待的 Promise
      for (const { resolve } of this.pendingPromises) {
        resolve(versionData);
      }
      this.pendingPromises = [];

      return versionData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorData: DesktopVersionData = {
        latest: null,
        platforms: [],
        error: errorMessage,
        channels: {
          stable: { latest: null, all: [] },
          beta: { latest: null, all: [] },
        },
      };

      // 拒绝所有等待的 Promise
      for (const { reject } of this.pendingPromises) {
        reject(error instanceof Error ? error : new Error(errorMessage));
      }
      this.pendingPromises = [];

      throw error;
    } finally {
      this.fetching = false;
    }
  }

  /**
   * 获取指定渠道的版本数据
   *
   * @param channel - 渠道名称 ('stable' | 'beta')
   * @returns 渠道版本数据
   */
  async getChannelVersionData(
    channel: 'stable' | 'beta'
  ): Promise<{
    latest: DesktopVersion | null;
    all: DesktopVersion[];
    platforms: PlatformGroup[];
    error: string | null;
  }> {
    const data = await this.getVersionData();

    return {
      latest: data.channels[channel].latest,
      all: data.channels[channel].all,
      platforms: data.platforms,
      error: data.error,
    };
  }

  /**
   * 检查是否已初始化
   *
   * @returns 是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 清除缓存
   * 主要用于测试或手动刷新场景
   */
  clearCache(): void {
    this.data = null;
    this.initialized = false;
    this.fetching = false;

    // 拒绝所有等待的 Promise
    for (const { reject } of this.pendingPromises) {
      reject(new Error('Cache cleared'));
    }
    this.pendingPromises = [];
  }

  /**
   * 将 DesktopIndexResponse 转换为 DesktopVersionData
   *
   * @param data - 原始版本数据响应
   * @returns 转换后的版本数据
   */
  private transformToVersionData(
    data: DesktopIndexResponse
  ): DesktopVersionData {
    // 优先使用 stable 渠道的最新版本作为默认 latest
    let latest: DesktopVersion | null = null;

    if (data.channels && data.channels.stable && data.channels.stable.latest) {
      // 如果有 channels.stable.latest，使用它
      const stableLatestVersion = data.channels.stable.latest;
      latest = data.versions.find(v => v.version === stableLatestVersion) || null;
    }

    // 如果没有找到 stable 版本，则使用最新的版本
    if (!latest && data.versions.length > 0) {
      latest = data.versions[0];
    }

    // 获取平台分组（基于 latest 版本）
    const platforms = latest
      ? groupAssetsByPlatform(latest.files)
      : [];

    // 处理渠道数据
    const channels = {
      stable: this.processChannel(data, 'stable'),
      beta: this.processChannel(data, 'beta'),
    };

    return {
      latest,
      platforms,
      error: null,
      channels,
    };
  }

  /**
   * 处理单个渠道的数据
   *
   * @param data - 原始版本数据响应
   * @param channel - 渠道名称
   * @returns 渠道版本数据
   */
  private processChannel(
    data: DesktopIndexResponse,
    channel: 'stable' | 'beta'
  ): { latest: DesktopVersion | null; all: DesktopVersion[] } {
    if (!data.channels || !data.channels[channel]) {
      return { latest: null, all: [] };
    }

    const channelInfo = data.channels[channel];
    const channelVersions = data.versions.filter((v) =>
      channelInfo.versions.includes(v.version)
    );

    // 查找最新版本
    const latestVersion =
      channelVersions.find((v) => v.version === channelInfo.latest) || null;

    return {
      latest: latestVersion,
      all: channelVersions,
    };
  }
}

// 导出单例获取方法
export const getVersionManager = (): VersionManager => {
  return VersionManager.getInstance();
};

// 导出便捷方法
export const setDesktopServerData = (data: DesktopIndexResponse): void => {
  getVersionManager().setServerData(data);
};

export const getDesktopVersionData = (): Promise<DesktopVersionData> => {
  return getVersionManager().getVersionData();
};

export const getDesktopChannelData = (
  channel: 'stable' | 'beta'
): Promise<{
  latest: DesktopVersion | null;
  all: DesktopVersion[];
  platforms: PlatformGroup[];
  error: string | null;
}> => {
  return getVersionManager().getChannelVersionData(channel);
};

export const isDesktopVersionInitialized = (): boolean => {
  return getVersionManager().isInitialized();
};

export const clearDesktopVersionCache = (): void => {
  getVersionManager().clearCache();
};
