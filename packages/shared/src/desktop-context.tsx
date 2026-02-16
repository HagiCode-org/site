/**
 * Desktop 版本数据的 React Context
 *
 * 提供 React Context 和 Hook 用于在组件树中共享版本数据
 * 这是可选的功能，用于需要 React 状态管理的场景
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  DesktopVersion,
  PlatformGroup,
  DesktopIndexResponse,
} from './types/desktop';
import type { DesktopVersionData } from './version-manager';
import {
  setDesktopServerData,
  getDesktopVersionData,
  isDesktopVersionInitialized,
} from './version-manager';

/**
 * Context 数据接口
 */
interface DesktopVersionContextValue {
  /** 最新版本 */
  latest: DesktopVersion | null;
  /** 平台分组 */
  platforms: PlatformGroup[];
  /** 错误信息 */
  error: string | null;
  /** 是否正在加载 */
  loading: boolean;
  /** 稳定版数据 */
  stable: {
    latest: DesktopVersion | null;
    all: DesktopVersion[];
  };
  /** 测试版数据 */
  beta: {
    latest: DesktopVersion | null;
    all: DesktopVersion[];
  };
}

/**
 * Context 默认值
 */
const defaultValue: DesktopVersionContextValue = {
  latest: null,
  platforms: [],
  error: null,
  loading: true,
  stable: { latest: null, all: [] },
  beta: { latest: null, all: [] },
};

/**
 * Desktop 版本 Context
 */
export const DesktopVersionContext = createContext<DesktopVersionContextValue>(
  defaultValue
);

/**
 * Provider Props
 */
export interface DesktopVersionProviderProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 渠道选择（可选） */
  channel?: 'stable' | 'beta';
  /** 服务端数据（用于 SSR） */
  serverData?: DesktopIndexResponse;
}

/**
 * Desktop 版本数据 Provider
 *
 * 使用示例：
 * ```tsx
 * // 客户端模式
 * <DesktopVersionProvider>
 *   <YourComponent />
 * </DesktopVersionProvider>
 *
 * // 服务端模式
 * <DesktopVersionProvider serverData={serverData}>
 *   <YourComponent />
 * </DesktopVersionProvider>
 *
 * // 指定渠道
 * <DesktopVersionProvider channel="beta">
 *   <YourComponent />
 * </DesktopVersionProvider>
 * ```
 */
export const DesktopVersionProvider: React.FC<DesktopVersionProviderProps> = ({
  children,
  channel,
  serverData,
}) => {
  const [data, setData] = useState<DesktopVersionContextValue>(defaultValue);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // 如果有服务端数据，先注入
      if (serverData) {
        setDesktopServerData(serverData);
      }

      try {
        const versionData = await getDesktopVersionData();

        if (!isMounted) return;

        setData({
          latest: versionData.latest,
          platforms: versionData.platforms,
          error: versionData.error,
          loading: false,
          stable: {
            latest: versionData.channels.stable.latest,
            all: versionData.channels.stable.all,
          },
          beta: {
            latest: versionData.channels.beta.latest,
            all: versionData.channels.beta.all,
          },
        });
      } catch (error) {
        if (!isMounted) return;

        setData({
          latest: null,
          platforms: [],
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false,
          stable: { latest: null, all: [] },
          beta: { latest: null, all: [] },
        });
      }
    };

    // 如果已经初始化且有服务端数据，直接使用
    if (isDesktopVersionInitialized() && !serverData) {
      getDesktopVersionData().then((versionData) => {
        if (isMounted) {
          setData({
            latest: versionData.latest,
            platforms: versionData.platforms,
            error: versionData.error,
            loading: false,
            stable: {
              latest: versionData.channels.stable.latest,
              all: versionData.channels.stable.all,
            },
            beta: {
              latest: versionData.channels.beta.latest,
              all: versionData.channels.beta.all,
            },
          });
        }
      });
    } else {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [serverData]);

  const contextValue: DesktopVersionContextValue = {
    ...data,
    // 如果指定了渠道，优先返回该渠道的数据
    ...(channel && {
      latest: data[channel].latest || data.latest,
      platforms: data.platforms,
    }),
  };

  return (
    <DesktopVersionContext.Provider value={contextValue}>
      {children}
    </DesktopVersionContext.Provider>
  );
};

/**
 * 使用 Desktop 版本数据的 Hook
 *
 * 使用示例：
 * ```tsx
 * function MyComponent() {
 *   const { latest, platforms, loading, error } = useDesktopVersion();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       <h2>Latest: {latest?.version}</h2>
 *       {platforms.map(p => (
 *         <div key={p.platform}>{p.platform}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useDesktopVersion = (): DesktopVersionContextValue => {
  const context = useContext(DesktopVersionContext);

  if (context === defaultValue) {
    console.warn(
      'useDesktopVersion used outside of DesktopVersionProvider, ' +
        'data will be fetched but not shared across components'
    );
  }

  return context;
};
