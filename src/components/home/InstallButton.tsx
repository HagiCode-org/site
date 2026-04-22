/**
 * InstallButton 组件 - 全局统一安装按钮 (React 版本)
 * 支持自动平台检测、下拉菜单选择版本、Docker 版本跳转
 * 可用于 Header（紧凑模式）和 Hero 区域（完整模式）
 *
 * 版本数据从共享的 VersionManager 获取
 */
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './InstallButton.module.css';
import { FEATURE_MAC_DOWNLOAD_ENABLED } from '@/config/features';
import { MAC_DOWNLOAD_DISABLED_NOTICE, MAC_DOWNLOAD_DISABLED_NOTICE_EN } from '@/constants/downloadMessages';
import type {
  AssetType,
  DesktopVersion,
  DownloadAction,
  DownloadSourceProbeStateMap,
  PlatformDownload,
  PlatformGroup,
} from '@/lib/shared/desktop';
import type { DesktopVersionSource } from '@/lib/shared/desktop-utils';
import {
  ensureDownloadSourceProbes,
  detectOS,
  collectDownloadSourceProbeTargets,
  getCachedDownloadSourceProbeStates,
  getDownloadActionLabel,
  getPrimaryDownloadSourceLabel,
  getArchitectureLabel,
  getAssetTypeLabel,
  getFileExtension,
  groupAssetsByPlatform,
  PLATFORM_ICONS,
  resolvePrimaryDownloadAction,
  resolvePrimaryDownloadActionPair,
} from '@/lib/shared/desktop-utils';
import type { PrimaryDownloadActionPair, PrimaryDownloadSourceKey } from '@/lib/shared/desktop-utils';
import { getLinkWithLocale } from '@/lib/shared/links';
import { getBundledSteamStoreLink, loadSteamStoreLink } from '@/lib/shared/steam-store-link';
import type {
  DesktopVersionData,
  DesktopVersionState,
} from '@/lib/shared/version-manager';
import {
  DESKTOP_HISTORY_FALLBACK_URL,
  getDesktopVersionData,
} from '@/lib/shared/version-manager';
import { getDesktopDownloadEventName, WEBSITE_TRACKING_EVENTS } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/tracker';

export interface DownloadOption {
  label: string;
  url: string;
  size?: string;
  assetType: AssetType;
  sourceActions: DownloadAction[];
}

export interface PlatformDownloads {
  platform: 'windows' | 'macos' | 'linux';
  platformLabel: string;
  options: DownloadOption[];
}

export interface InstallButtonPrimaryTarget {
  href: string;
  option: DownloadOption | null;
  action: DownloadAction | null;
}

export interface InstallButtonRuntimeSnapshot {
  version: DesktopVersion | null;
  platforms: PlatformGroup[];
  error: string | null;
  status: DesktopVersionState | 'loading';
  source: DesktopVersionSource | null;
  fallbackTarget: string | null;
  failedAttemptSummary: string | null;
}

export interface InstallButtonMenuState {
  mode: 'loading' | 'ready' | 'fatal';
  hasDownloads: boolean;
}

function SteamIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      data-steam-icon="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="16.8" cy="7.8" r="2.15" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="9.1" cy="15.1" r="1.45" fill="currentColor" />
      <path
        d="M10.2 14.2L14.7 10.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15.6 9.2a1.75 1.75 0 1 0 2.4-2.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M7.5 14.6l2.8 1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface InstallButtonProps {
  /**
   * Desktop 版本数据（构建时获取，向后兼容）
   */
  version?: DesktopVersion | null;

  /**
   * Desktop 平台下载数据（构建时获取，向后兼容）
   */
  platforms?: PlatformGroup[];

  /**
   * 版本数据获取错误信息（如有）
   */
  versionError?: string | null;

  /**
   * 显示模式
   * - full: 完整模式，用于 Hero 区域
   * - compact: 紧凑模式，用于 Header 导航栏
   */
  variant?: 'full' | 'compact';

  /**
   * 是否显示下拉菜单（默认 true）
   */
  showDropdown?: boolean;

  /**
   * 可选的额外类名
   */
  className?: string;

  /**
   * 版本渠道（默认 'stable'）
   * - stable: 稳定版
   * - beta: 测试版
   */
  channel?: 'stable' | 'beta';

  /**
   * 页面语言环境
   */
  locale?: 'zh-CN' | 'en';
}

interface DropdownPosition {
  top: number;
  left: number;
  maxHeight: number;
}

/**
 * 将 PlatformGroup[] 转换为 PlatformDownloads[] 格式
 */
export function convertPlatformGroups(platforms: PlatformGroup[]): PlatformDownloads[] {
  const platformLabels = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };

  return platforms.map((platform) => ({
    platform: platform.platform,
    platformLabel: platformLabels[platform.platform],
    options: platform.downloads.map((download) => ({
      label: download.filename,
      url: download.url,
      size: download.size,
      assetType: download.assetType,
      sourceActions: download.sourceActions,
    })),
  }));
}

function isUnsupportedPublicDownload(
  download: Pick<PlatformDownload, 'assetType' | 'filename'>,
): boolean {
  const assetType = String(download.assetType);
  return assetType === 'linux-deb'
    || assetType === 'linux-arm64-deb'
    || download.filename.toLowerCase().endsWith('.deb');
}

export function filterSupportedPlatformGroups(platforms: PlatformGroup[]): PlatformGroup[] {
  return platforms
    .map((platform) => ({
      ...platform,
      downloads: platform.downloads.filter((download) => !isUnsupportedPublicDownload(download)),
    }))
    .filter((platform) => platform.downloads.length > 0);
}

export function resolveInstallButtonPrimaryTarget(
  platformData: PlatformDownloads[],
  probeStates: DownloadSourceProbeStateMap,
  userOS: 'windows' | 'macos' | 'linux' | 'unknown',
  desktopPageUrl: string,
): InstallButtonPrimaryTarget {
  if (platformData.length === 0) {
    return {
      href: desktopPageUrl,
      option: null,
      action: null,
    };
  }

  const userPlatform = platformData.find((platform) => platform.platform === userOS);
  const preferredPlatform = userPlatform ?? platformData[0];
  const preferredOption = preferredPlatform.options[0] ?? null;
  const action = preferredOption
    ? resolvePrimaryDownloadAction({ sourceActions: preferredOption.sourceActions }, probeStates)
    : null;

  return {
    href: action?.url ?? preferredOption?.url ?? desktopPageUrl,
    option: preferredOption,
    action,
  };
}

export function createInstallButtonPropSnapshot({
  version,
  platforms,
  versionError,
}: {
  version: DesktopVersion | null;
  platforms: PlatformGroup[];
  versionError: string | null;
}): InstallButtonRuntimeSnapshot {
  const supportedPlatforms = filterSupportedPlatformGroups(platforms);

  if (versionError) {
    return {
      version: version ?? null,
      platforms: supportedPlatforms.length > 0 ? supportedPlatforms : version ? groupAssetsByPlatform(version.assets) : [],
      error: versionError,
      status: 'fatal',
      source: null,
      fallbackTarget: DESKTOP_HISTORY_FALLBACK_URL,
      failedAttemptSummary: versionError,
    };
  }

  if (version || platforms.length > 0) {
    return {
      version: version ?? null,
      platforms: supportedPlatforms.length > 0 ? supportedPlatforms : version ? groupAssetsByPlatform(version.assets) : [],
      error: null,
      status: 'ready',
      source: null,
      fallbackTarget: null,
      failedAttemptSummary: null,
    };
  }

  return {
    version: null,
    platforms: [],
    error: null,
    status: 'loading',
    source: null,
    fallbackTarget: null,
    failedAttemptSummary: null,
  };
}

export function resolveInstallButtonRuntimeSnapshot(
  data: DesktopVersionData,
  channel: 'stable' | 'beta',
): InstallButtonRuntimeSnapshot {
  const stableVersion = data.channels.stable.latest || data.latest;
  const version = data.channels[channel].latest || stableVersion;
  const platforms = !version
    ? []
    : channel === 'stable' && stableVersion?.version === version.version && data.platforms.length > 0
      ? data.platforms
      : groupAssetsByPlatform(version.assets);

  return {
    version,
    platforms: filterSupportedPlatformGroups(platforms),
    error: data.error,
    status: data.status,
    source: data.source,
    fallbackTarget: data.fallbackTarget,
    failedAttemptSummary: data.failedAttemptSummary,
  };
}

export function getInstallButtonMenuState(
  snapshot: InstallButtonRuntimeSnapshot,
  visiblePlatformCount: number,
): InstallButtonMenuState {
  if (snapshot.status === 'loading') {
    return { mode: 'loading', hasDownloads: false };
  }

  if (snapshot.version && visiblePlatformCount > 0) {
    return { mode: 'ready', hasDownloads: true };
  }

  if (snapshot.status === 'fatal' || snapshot.error) {
    return { mode: 'fatal', hasDownloads: false };
  }

  return { mode: 'fatal', hasDownloads: false };
}

function createFatalRuntimeData(message: string): DesktopVersionData {
  return {
    latest: null,
    platforms: [],
    error: message,
    source: null,
    status: 'fatal',
    attempts: [],
    fallbackTarget: DESKTOP_HISTORY_FALLBACK_URL,
    failedAttemptSummary: message,
    channels: {
      stable: { latest: null, all: [] },
      beta: { latest: null, all: [] },
    },
  };
}

export default function InstallButton({
  version = null,
  platforms = [],
  versionError = null,
  variant = 'full',
  showDropdown = true,
  className = '',
  channel = 'stable',
  locale = 'zh-CN',
}: InstallButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState<DesktopVersionData | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const [downloadSourceProbeStates, setDownloadSourceProbeStates] = useState<DownloadSourceProbeStateMap>({});
  const [steamStoreLink, setSteamStoreLink] = useState(() => getBundledSteamStoreLink());
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const buttonId = useId();
  const needsRuntimeFetch = !version && platforms.length === 0 && !versionError;
  const desktopPageUrl = useMemo(() => getLinkWithLocale('desktop', locale), [locale]);
  const containerUrl = useMemo(() => getLinkWithLocale('container', locale), [locale]);
  const macDisabledNotice = locale === 'en' ? MAC_DOWNLOAD_DISABLED_NOTICE_EN : MAC_DOWNLOAD_DISABLED_NOTICE;
  const containerDeploymentLabel = locale === 'en' ? 'Container Deployment' : '容器部署';
  const goToContainerLabel = locale === 'en' ? 'Go to Container page' : '前往 Container 页面';
  const installButtonLabel = locale === 'en' ? 'Install now' : '立即安装';
  const installDesktopAriaLabel =
    locale === 'en' ? 'Install Hagicode Desktop' : '立即安装 Hagicode Desktop';
  const selectOtherVersionsLabel = locale === 'en' ? 'Choose other versions' : '选择其他版本';
  const selectDownloadVersionLabel = locale === 'en' ? 'Choose download version' : '选择下载版本';
  const recommendedLabel = locale === 'en' ? 'Recommended' : '推荐';
  const loadingLatestLabel = locale === 'en' ? 'Fetching latest version...' : '正在获取最新版本...';
  const errorFallbackLabel =
    locale === 'en'
      ? 'Latest version is unavailable. Use the Index version history instead.'
      : '暂时无法获取最新版本，请改用 Index 版本历史页。';
  const desktopFallbackCta = locale === 'en' ? 'Open version history' : '打开版本历史页';
  const pendingMenuLabel = locale === 'en' ? 'Versions are still loading' : '版本数据仍在加载';
  const unavailableMenuLabel = locale === 'en' ? 'Version data is temporarily unavailable' : '版本数据暂时不可用';
  const desktopFallbackMenuLabel = locale === 'en' ? 'Open version history' : '打开版本历史页';
  const loadingPrimaryLabel = locale === 'en' ? 'Loading...' : '获取中...';
  const steamShortcutLabel = 'Steam';
  const steamShortcutAriaLabel =
    locale === 'en' ? 'Open Hagicode on Steam' : '打开 Hagicode Steam 商店页';
  const showSteamShortcut = variant === 'compact' && steamStoreLink.href.length > 0;

  useEffect(() => {
    let mounted = true;

    void loadSteamStoreLink().then((nextLink) => {
      if (mounted) {
        setSteamStoreLink(nextLink);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!needsRuntimeFetch) {
      return;
    }

    let mounted = true;

    // Keep fetch + normalization on mount so opening the dropdown only toggles UI.
    getDesktopVersionData()
      .then((data) => {
        if (!mounted) {
          return;
        }
        setFetchedData(data);
      })
      .catch((error) => {
        if (!mounted) {
          return;
        }
        const message = error instanceof Error ? error.message : errorFallbackLabel;
        console.error('Failed to fetch desktop versions:', error);
        setFetchedData(createFatalRuntimeData(message));
      });

    return () => {
      mounted = false;
    };
  }, [needsRuntimeFetch, errorFallbackLabel]);

  const runtimeSnapshot = useMemo(
    () =>
      fetchedData
        ? resolveInstallButtonRuntimeSnapshot(fetchedData, channel)
        : createInstallButtonPropSnapshot({ version, platforms, versionError }),
    [fetchedData, channel, version, platforms, versionError],
  );

  const allPlatformData = useMemo(() => {
    if (!runtimeSnapshot.platforms || runtimeSnapshot.platforms.length === 0) {
      return [];
    }
    return convertPlatformGroups(runtimeSnapshot.platforms);
  }, [runtimeSnapshot.platforms]);

  const platformData = useMemo(() => {
    if (FEATURE_MAC_DOWNLOAD_ENABLED) {
      return allPlatformData;
    }

    return allPlatformData.filter((platform) => platform.platform !== 'macos');
  }, [allPlatformData]);

  const macPlatform = useMemo(
    () => allPlatformData.find((platform) => platform.platform === 'macos') || null,
    [allPlatformData],
  );
  const currentVersion = runtimeSnapshot.version;
  const menuState = useMemo(
    () => getInstallButtonMenuState(runtimeSnapshot, platformData.length),
    [runtimeSnapshot, platformData.length],
  );
  const historyFallbackTarget = runtimeSnapshot.fallbackTarget ?? DESKTOP_HISTORY_FALLBACK_URL;

  useEffect(() => {
    const probeTargets = collectDownloadSourceProbeTargets(runtimeSnapshot.platforms);
    const cachedStates = getCachedDownloadSourceProbeStates(probeTargets);
    setDownloadSourceProbeStates(cachedStates);

    const hasPendingProbe = Object.values(cachedStates).some(
      (state) => state === 'unknown' || state === 'probing',
    );

    if (Object.keys(probeTargets).length === 0 || !hasPendingProbe) {
      return;
    }

    let mounted = true;
    void ensureDownloadSourceProbes(probeTargets).then((states) => {
      if (mounted) {
        setDownloadSourceProbeStates(states);
      }
    });

    return () => {
      mounted = false;
    };
  }, [runtimeSnapshot.platforms]);

  const statusMessage = useMemo(() => {
    if (menuState.mode === 'loading') {
      return loadingLatestLabel;
    }

    if (menuState.mode === 'fatal') {
      return runtimeSnapshot.failedAttemptSummary || runtimeSnapshot.error || errorFallbackLabel;
    }

    if (runtimeSnapshot.status === 'local_snapshot') {
      return locale === 'en'
        ? 'Primary sources are unavailable. Showing the local snapshot, which may be stale.'
        : '主版本源暂不可用，当前显示站内快照，信息可能滞后。';
    }

    if (runtimeSnapshot.status === 'degraded') {
      return locale === 'en'
        ? 'Primary source is unavailable. Showing the backup index.'
        : '主版本源暂不可用，当前显示备用索引数据。';
    }

    return null;
  }, [
    errorFallbackLabel,
    loadingLatestLabel,
    locale,
    menuState.mode,
    runtimeSnapshot.error,
    runtimeSnapshot.failedAttemptSummary,
    runtimeSnapshot.status,
  ]);

  const primarySourceOrder: PrimaryDownloadSourceKey[] = ['github', 'accelerated'];

  const primaryTarget = useMemo(() => {
    const userOS = detectOS();
    if (!FEATURE_MAC_DOWNLOAD_ENABLED && userOS === 'macos') {
      return {
        href: desktopPageUrl,
        option: null,
        action: null,
        actionPair: null,
      };
    }

    const resolved = resolveInstallButtonPrimaryTarget(
      platformData,
      downloadSourceProbeStates,
      userOS,
      desktopPageUrl,
    );
    const actionPair = resolved.option
      ? resolvePrimaryDownloadActionPair({ sourceActions: resolved.option.sourceActions })
      : null;

    return { ...resolved, actionPair };
  }, [desktopPageUrl, downloadSourceProbeStates, platformData]);

  const primaryActions = useMemo(() => {
    if (!primaryTarget.actionPair) {
      return [];
    }
    return primarySourceOrder
      .map((source) => ({
        source,
        action: primaryTarget.actionPair![source],
        label: getPrimaryDownloadSourceLabel(source, locale),
      }))
      .filter((entry) => Boolean(entry.action));
  }, [primaryTarget.actionPair, primarySourceOrder, locale]);

  const primaryHref =
    menuState.mode === 'fatal'
      ? historyFallbackTarget
      : menuState.hasDownloads
        ? primaryActions[0]?.action?.url ?? primaryTarget.href
        : desktopPageUrl;
  const primaryText =
    menuState.mode === 'fatal'
      ? desktopFallbackCta
      : menuState.mode === 'loading' && variant === 'compact'
        ? loadingPrimaryLabel
        : installButtonLabel;
  const primaryAriaLabel = menuState.hasDownloads
    ? `${installDesktopAriaLabel}${primaryActions[0] ? ` (${primaryActions[0].label})` : ''}`
    : menuState.mode === 'loading'
      ? loadingLatestLabel
      : desktopFallbackCta;

  const updateDropdownPosition = useCallback(() => {
    if (!buttonRef.current || typeof window === 'undefined') {
      return null;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportPadding = 16;
    const gap = 4;
    const estimatedWidth = Math.min(
      400,
      Math.max(window.innerWidth * 0.4, 280),
      window.innerWidth - viewportPadding * 2,
    );
    const actualWidth = menuRef.current
      ? Math.min(menuRef.current.offsetWidth, window.innerWidth - viewportPadding * 2)
      : estimatedWidth;
    const preferredMaxHeight = Math.min(560, window.innerHeight - viewportPadding * 2);
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;
    const actualHeight = menuRef.current
      ? Math.min(menuRef.current.scrollHeight, preferredMaxHeight)
      : preferredMaxHeight;
    const openUpward = spaceBelow < Math.min(actualHeight, 320) && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      180,
      Math.min(preferredMaxHeight, openUpward ? spaceAbove - gap : spaceBelow - gap),
    );
    const renderedHeight = Math.min(actualHeight, maxHeight);
    const top = openUpward
      ? Math.max(viewportPadding, rect.top - gap - renderedHeight)
      : Math.min(rect.bottom + gap, window.innerHeight - viewportPadding - renderedHeight);
    const left = Math.min(
      Math.max(viewportPadding, rect.left),
      window.innerWidth - viewportPadding - actualWidth,
    );

    const nextPosition = { top, left, maxHeight };
    setDropdownPosition(nextPosition);
    return nextPosition;
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) {
      return;
    }

    const handlePointerDownOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        target &&
        (buttonRef.current?.contains(target) || menuRef.current?.contains(target))
      ) {
        return;
      }

      setIsDropdownOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    return () => document.removeEventListener('mousedown', handlePointerDownOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) {
      return;
    }

    let rafId = window.requestAnimationFrame(() => {
      updateDropdownPosition();
    });

    const handleViewportChange = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        updateDropdownPosition();
      });
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [isDropdownOpen, updateDropdownPosition]);

  const handleToggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    const nextOpen = !isDropdownOpen;
    setIsDropdownOpen(nextOpen);
    if (!nextOpen) {
      setDropdownPosition(null);
    }
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  const handlePrimaryInstallClick = () => {
    if (!menuState.hasDownloads || !primaryTarget.option) {
      return;
    }

    trackEvent(getDesktopDownloadEventName(primaryTarget.option.assetType), {
      source: `install-button-${variant}-primary-${primaryTarget.action?.kind ?? 'official'}`,
    });
  };

  const handlePlatformDownloadClick = (assetType: AssetType, sourceKind: DownloadAction['kind']) => {
    trackEvent(getDesktopDownloadEventName(assetType), {
      source: `install-button-${variant}-source-${sourceKind}`,
    });
    handleLinkClick();
  };

  const handleContainerNavigationClick = (source: string) => {
    trackEvent(WEBSITE_TRACKING_EVENTS.openContainerPage, { source });
    handleLinkClick();
  };

  const renderStatusBlock = () => {
    const title = menuState.mode === 'loading' ? pendingMenuLabel : unavailableMenuLabel;
    const message = statusMessage || errorFallbackLabel;

    return (
      <li role="none">
        <span
          className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}
          role="presentation"
          aria-disabled="true"
        >
          <span className={styles.dropdownItemLabel}>{title}</span>
          <span className={styles.dropdownItemDisabledNotice}>{message}</span>
        </span>
      </li>
    );
  };

  const dropdownMenu =
    isDropdownOpen &&
    typeof document !== 'undefined'
      ? createPortal(
          <ul
            ref={menuRef}
            className={`${styles.dropdownMenu} ${styles.dropdownMenuOpen}`}
            id={`${buttonId}-menu`}
            role="menu"
            aria-label={selectDownloadVersionLabel}
            style={{
              top: dropdownPosition ? `${dropdownPosition.top}px` : '16px',
              left: dropdownPosition ? `${dropdownPosition.left}px` : '16px',
              maxHeight: dropdownPosition ? `${dropdownPosition.maxHeight}px` : undefined,
              opacity: dropdownPosition ? undefined : 0,
              visibility: dropdownPosition ? undefined : 'hidden',
              pointerEvents: dropdownPosition ? undefined : 'none',
            }}
          >
            {menuState.mode !== 'ready' && renderStatusBlock()}
            {menuState.hasDownloads &&
              platformData.map((platformGroup) => (
                <React.Fragment key={platformGroup.platform}>
                  <div
                    className={`${styles.dropdownGroupLabel} ${styles[`platform--${platformGroup.platform}`]}`}
                    role="presentation"
                  >
                    <span className={styles.platformIcon}>{PLATFORM_ICONS[platformGroup.platform]}</span>
                    <span className={styles.platformName}>{platformGroup.platformLabel}</span>
                    {currentVersion?.version && (
                      <span className={styles.versionTag}>{currentVersion.version}</span>
                    )}
                  </div>
                  {platformGroup.options.map((option, idx) => {
                    const archLabel = getArchitectureLabel(option.assetType);
                    const fileExt = getFileExtension(option.assetType);
                    const isRecommended = idx === 0;
                    const resolvedAction = resolvePrimaryDownloadAction(
                      { sourceActions: option.sourceActions },
                      downloadSourceProbeStates,
                    );
                    return (
                      <li key={`${platformGroup.platform}-${option.url}`} role="none">
                        <div
                          className={`${styles.dropdownItem} ${styles.dropdownItemMultiSource} ${isRecommended ? styles.dropdownItemRecommended : ''}`}
                        >
                          <div className={styles.dropdownItemMeta}>
                            <span className={styles.dropdownItemLabel}>
                              {getAssetTypeLabel(option.assetType)}
                              {archLabel && <span className={styles.archLabel}> ({archLabel})</span>}
                              {fileExt && <span className={styles.fileExtBadge}>{fileExt}</span>}
                              {isRecommended && (
                                <span className={styles.recommendedBadge}>
                                  ⭐{recommendedLabel}
                                </span>
                              )}
                            </span>
                            {option.size && (
                              <span className={styles.dropdownItemSize}>{option.size}</span>
                            )}
                          </div>
                          <div className={styles.dropdownSourceActions}>
                            {option.sourceActions.map((action) => {
                              const isSmartDefault = resolvedAction?.kind === action.kind;
                              return (
                                <a
                                  key={`${option.url}-${action.kind}`}
                                  href={action.url}
                                  className={`${styles.dropdownSourceAction} ${isSmartDefault ? styles.dropdownSourceActionDefault : ''}`}
                                  role="menuitem"
                                  download
                                  aria-label={`${getAssetTypeLabel(option.assetType)} ${getDownloadActionLabel(action.kind, locale)}`}
                                  onClick={() => handlePlatformDownloadClick(option.assetType, action.kind)}
                                >
                                  <span>{getDownloadActionLabel(action.kind, locale)}</span>
                                  {isSmartDefault && (
                                    <span className={styles.dropdownSourceActionBadge}>
                                      {locale === 'en' ? 'Default' : '默认'}
                                    </span>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </React.Fragment>
              ))}
            {!FEATURE_MAC_DOWNLOAD_ENABLED && macPlatform && (
              <>
                <div
                  className={`${styles.dropdownGroupLabel} ${styles['platform--macos']}`}
                  role="presentation"
                >
                  <span className={styles.platformIcon}>{PLATFORM_ICONS.macos}</span>
                  <span className={styles.platformName}>{macPlatform.platformLabel}</span>
                  {currentVersion?.version && (
                    <span className={styles.versionTag}>{currentVersion.version}</span>
                  )}
                </div>
                <li role="none">
                  <span
                    className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}
                    role="presentation"
                    aria-disabled="true"
                  >
                    <span className={styles.dropdownItemLabel}>macOS</span>
                    <span className={styles.dropdownItemDisabledNotice}>{macDisabledNotice}</span>
                  </span>
                </li>
                <li role="none">
                  <a
                    href={containerUrl}
                    className={styles.dropdownItem}
                    role="menuitem"
                    onClick={() => handleContainerNavigationClick('install-button-macos-fallback')}
                  >
                    <span className={styles.dropdownItemLabel}>{goToContainerLabel}</span>
                  </a>
                </li>
              </>
            )}
            <li role="separator" className={styles.dropdownSeparator} />
            {!menuState.hasDownloads && (
              <li role="none">
                <a
                  href={historyFallbackTarget}
                  className={styles.dropdownItem}
                  role="menuitem"
                  onClick={handleLinkClick}
                >
                  <span className={styles.dropdownItemLabel}>{desktopFallbackMenuLabel}</span>
                </a>
              </li>
            )}
            <li role="none">
              <a
                href={containerUrl}
                className={`${styles.dropdownItem} ${styles.dropdownItemDocker}`}
                role="menuitem"
                onClick={() => handleContainerNavigationClick('install-button-container-link')}
              >
                <svg className={styles.dockerIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.185.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z" />
                </svg>
                <span className={styles.dropdownItemLabel}>{containerDeploymentLabel}</span>
                <svg className={styles.externalIcon} viewBox="0 0 24 24" fill="none">
                  <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </li>
          </ul>,
          document.body,
        )
      : null;

  return (
    <div
      className={`${styles.installButtonWrapper} ${styles[`installButtonWrapper--${variant}`]} ${className}`}
      ref={buttonRef}
    >
      <div
        className={`${styles.splitButtonContainer} ${variant === 'compact' ? styles.splitButtonContainerSegmented : ''}`}
        data-action-group={variant === 'compact' ? 'segmented' : 'default'}
      >
        {primaryActions.length > 0 ? (
          <div
            className={`${styles.primarySourceActions} ${variant === 'compact' ? styles.primarySourceActionsGrouped : ''}`}
            data-segment-role="primary-actions"
          >
            {primaryActions.map(({ source, action, label }) => (
              <a
                key={source}
                href={action?.url ?? '#'}
                className={`${styles.sourceActionButton} ${styles[`sourceActionButton--${source}`]}`}
                aria-busy={menuState.mode === 'loading'}
                aria-label={`${installDesktopAriaLabel} (${label})`}
                download
                onClick={() => {
                  if (primaryTarget.option && action) {
                    trackEvent(getDesktopDownloadEventName(primaryTarget.option.assetType), {
                      source: `install-button-${variant}-primary-${action.kind}`,
                    });
                  }
                }}
              >
                <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={styles.btnText}>{label}</span>
              </a>
            ))}
          </div>
        ) : (
          <a
            href={primaryHref}
            className={styles.btnDownloadMain}
            aria-busy={menuState.mode === 'loading'}
            aria-label={primaryAriaLabel}
            onClick={handlePrimaryInstallClick}
          >
            <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.btnText}>{primaryText}</span>
          </a>
        )}

        {showSteamShortcut && (
          <a
            href={steamStoreLink.href}
            className={`${styles.steamShortcut} ${showDropdown ? styles.steamShortcutWithDropdown : styles.steamShortcutLast}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={steamShortcutAriaLabel}
            data-steam-entry="site-header-install"
          >
            <SteamIcon className={styles.downloadIcon} />
            <span className={styles.btnText}>{steamShortcutLabel}</span>
          </a>
        )}

        {showDropdown && (
          <button
            className={styles.btnDropdownToggle}
            type="button"
            aria-expanded={isDropdownOpen}
            aria-controls={`${buttonId}-menu`}
            aria-haspopup="menu"
            aria-busy={menuState.mode === 'loading'}
            aria-label={selectOtherVersionsLabel}
            data-runtime-state={menuState.mode}
            data-segment-role="toggle"
            onClick={handleToggleDropdown}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </svg>
          </button>
        )}
      </div>
      {variant === 'full' && statusMessage && (
        <p className={styles.installButtonStatus} role="status">{statusMessage}</p>
      )}
      {dropdownMenu}
    </div>
  );
}
