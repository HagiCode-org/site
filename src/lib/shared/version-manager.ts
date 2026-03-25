/**
 * Desktop 版本数据管理器
 *
 * 提供单例模式的版本数据管理，支持服务端注入和客户端获取。
 * 运行时结果会保留数据来源、降级链路和并发请求复用状态。
 */

import type { DesktopIndexResponse, DesktopVersion, PlatformGroup } from './types/desktop';
import type {
  DesktopVersionFetchAttempt,
  DesktopVersionSource,
} from './desktop-utils';
import {
  DesktopVersionFetchError,
  fetchDesktopVersionResult,
  groupAssetsByPlatform,
} from './desktop-utils';

export type DesktopVersionState = 'ready' | 'degraded' | 'local_snapshot' | 'fatal';

/**
 * 版本数据接口
 * 包含最新版本、平台分组、错误信息、渠道数据和来源状态。
 */
export interface DesktopVersionData {
  /** 最新版本信息 */
  latest: DesktopVersion | null;
  /** 按平台分组的下载资源 */
  platforms: PlatformGroup[];
  /** 致命错误信息 */
  error: string | null;
  /** 当前返回数据的来源 */
  source: DesktopVersionSource | null;
  /** 当前返回数据的状态 */
  status: DesktopVersionState;
  /** 本次获取过程中发生过的失败尝试 */
  attempts: DesktopVersionFetchAttempt[];
  /** 渠道信息 */
  channels: {
    stable: {
      latest: DesktopVersion | null;
      all: DesktopVersion[];
    };
    beta: {
      latest: DesktopVersion | null;
      all: DesktopVersion[];
    };
  };
}

class VersionManager {
  private static instance: VersionManager | null = null;
  private data: DesktopVersionData | null = null;
  private initialized = false;
  private fetching = false;
  private pendingPromises: Array<{
    resolve: (data: DesktopVersionData) => void;
    reject: (error: Error) => void;
  }> = [];

  private constructor() {}

  static getInstance(): VersionManager {
    if (!VersionManager.instance) {
      VersionManager.instance = new VersionManager();
    }
    return VersionManager.instance;
  }

  /**
   * 设置服务端注入的数据（用于 SSR）。
   * 服务端注入的数据本质上等价于本地快照。
   */
  setServerData(data: DesktopIndexResponse): void {
    const versionData = this.transformToVersionData(data, 'local', []);
    this.setResolvedData(versionData);
  }

  async getVersionData(): Promise<DesktopVersionData> {
    if (this.initialized && this.data) {
      return this.data;
    }

    if (
      typeof window !== 'undefined' &&
      (window as { __DESKTOP_VERSION_DATA__?: DesktopIndexResponse }).__DESKTOP_VERSION_DATA__
    ) {
      const serverData = (window as { __DESKTOP_VERSION_DATA__?: DesktopIndexResponse }).__DESKTOP_VERSION_DATA__;
      if (serverData) {
        const versionData = this.transformToVersionData(serverData, 'local', []);
        this.data = versionData;
        this.initialized = true;
        delete (window as { __DESKTOP_VERSION_DATA__?: DesktopIndexResponse }).__DESKTOP_VERSION_DATA__;
        return versionData;
      }
    }

    if (this.fetching) {
      return new Promise((resolve, reject) => {
        this.pendingPromises.push({ resolve, reject });
      });
    }

    this.fetching = true;

    try {
      const responseData = await fetchDesktopVersionResult();
      const versionData = this.transformToVersionData(
        responseData.data,
        responseData.source,
        responseData.attempts,
      );

      this.setResolvedData(versionData);
      return versionData;
    } catch (error) {
      const errorData = this.createErrorData(error);
      this.setResolvedData(errorData);
      return errorData;
    } finally {
      this.fetching = false;
    }
  }

  async getChannelVersionData(
    channel: 'stable' | 'beta',
  ): Promise<{
    latest: DesktopVersion | null;
    all: DesktopVersion[];
    platforms: PlatformGroup[];
    error: string | null;
    source: DesktopVersionSource | null;
    status: DesktopVersionState;
    attempts: DesktopVersionFetchAttempt[];
  }> {
    const data = await this.getVersionData();
    const latest = data.channels[channel].latest;

    return {
      latest,
      all: data.channels[channel].all,
      platforms: latest ? groupAssetsByPlatform(latest.files) : [],
      error: data.error,
      source: data.source,
      status: data.status,
      attempts: data.attempts,
    };
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  clearCache(): void {
    this.data = null;
    this.initialized = false;
    this.fetching = false;

    for (const { reject } of this.pendingPromises) {
      reject(new Error('Cache cleared'));
    }
    this.pendingPromises = [];
  }

  private setResolvedData(versionData: DesktopVersionData): void {
    this.data = versionData;
    this.initialized = true;

    for (const { resolve } of this.pendingPromises) {
      resolve(versionData);
    }
    this.pendingPromises = [];
  }

  private createErrorData(error: unknown): DesktopVersionData {
    const attempts = error instanceof DesktopVersionFetchError ? error.attempts : [];
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return {
      latest: null,
      platforms: [],
      error: errorMessage,
      source: null,
      status: 'fatal',
      attempts,
      channels: {
        stable: { latest: null, all: [] },
        beta: { latest: null, all: [] },
      },
    };
  }

  private transformToVersionData(
    data: DesktopIndexResponse,
    source: DesktopVersionSource,
    attempts: DesktopVersionFetchAttempt[],
  ): DesktopVersionData {
    let latest: DesktopVersion | null = null;

    if (data.channels?.stable?.latest) {
      latest = data.versions.find((version) => version.version === data.channels?.stable?.latest) || null;
    }

    if (!latest && data.versions.length > 0) {
      latest = data.versions[0];
    }

    const platforms = latest ? groupAssetsByPlatform(latest.files) : [];
    const channels = {
      stable: this.processChannel(data, 'stable'),
      beta: this.processChannel(data, 'beta'),
    };

    return {
      latest,
      platforms,
      error: null,
      source,
      status: this.mapSourceToStatus(source),
      attempts,
      channels,
    };
  }

  private mapSourceToStatus(source: DesktopVersionSource): DesktopVersionState {
    if (source === 'primary') {
      return 'ready';
    }

    if (source === 'backup') {
      return 'degraded';
    }

    return 'local_snapshot';
  }

  private processChannel(
    data: DesktopIndexResponse,
    channel: 'stable' | 'beta',
  ): { latest: DesktopVersion | null; all: DesktopVersion[] } {
    if (!data.channels || !data.channels[channel]) {
      return { latest: null, all: [] };
    }

    const channelInfo = data.channels[channel];
    const channelVersions = data.versions.filter((version) =>
      channelInfo.versions.includes(version.version),
    );

    const latestVersion =
      channelVersions.find((version) => version.version === channelInfo.latest) || null;

    return {
      latest: latestVersion,
      all: channelVersions,
    };
  }
}

export const getVersionManager = (): VersionManager => {
  return VersionManager.getInstance();
};

export const setDesktopServerData = (data: DesktopIndexResponse): void => {
  getVersionManager().setServerData(data);
};

export const getDesktopVersionData = (): Promise<DesktopVersionData> => {
  return getVersionManager().getVersionData();
};

export const getDesktopChannelData = (
  channel: 'stable' | 'beta',
): Promise<{
  latest: DesktopVersion | null;
  all: DesktopVersion[];
  platforms: PlatformGroup[];
  error: string | null;
  source: DesktopVersionSource | null;
  status: DesktopVersionState;
  attempts: DesktopVersionFetchAttempt[];
}> => {
  return getVersionManager().getChannelVersionData(channel);
};

export const isDesktopVersionInitialized = (): boolean => {
  return getVersionManager().isInitialized();
};

export const clearDesktopVersionCache = (): void => {
  getVersionManager().clearCache();
};
