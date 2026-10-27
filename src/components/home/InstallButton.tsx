/**
 * InstallButton 组件 - 全局统一安装按钮 (React 版本)
 * 支持自动平台检测、下拉菜单选择版本
 * 可用于 Header（紧凑模式）和 Hero 区域（完整模式）
 *
 * 版本数据从共享的 VersionManager 获取
 */
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './InstallButton.module.css';
import { FEATURE_MAC_DOWNLOAD_ENABLED, FEATURE_SITE_STEAM_ENABLED } from '@/config/features';
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
import { getDesktopDownloadEventName } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/tracker';
import MicrosoftStoreBadge from '@/components/common/MicrosoftStoreBadge';

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

const EMPTY_PLATFORM_GROUPS: PlatformGroup[] = [];
const PLATFORM_LABELS = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
} as const;

function areDownloadSourceProbeStatesEqual(
  left: DownloadSourceProbeStateMap,
  right: DownloadSourceProbeStateMap,
): boolean {
  const leftKeys = Object.keys(left) as Array<keyof DownloadSourceProbeStateMap>;
  const rightKeys = Object.keys(right) as Array<keyof DownloadSourceProbeStateMap>;

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => left[key] === right[key]);
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

const WINDOWS_STORE_URL = 'https://apps.microsoft.com/detail/9N3PM0N3SVDW';

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
  locale?: string;
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
  return platforms.map((platform) => ({
    platform: platform.platform,
    platformLabel: PLATFORM_LABELS[platform.platform],
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

function prioritizeCurrentPlatform<T extends { platform: 'windows' | 'macos' | 'linux' }>(
  platforms: T[],
  currentOS: 'windows' | 'macos' | 'linux' | 'unknown',
): T[] {
  if (platforms.length <= 1 || currentOS === 'unknown') {
    return platforms;
  }

  const currentIndex = platforms.findIndex((platform) => platform.platform === currentOS);
  if (currentIndex <= 0) {
    return platforms;
  }

  return [
    platforms[currentIndex],
    ...platforms.slice(0, currentIndex),
    ...platforms.slice(currentIndex + 1),
  ];
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
  platforms = EMPTY_PLATFORM_GROUPS,
  versionError = null,
  variant = 'full',
  showDropdown = true,
  className = '',
  channel = 'stable',
  locale = 'zh-CN',
}: InstallButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformDownloads['platform'] | null>(null);
  const [fetchedData, setFetchedData] = useState<DesktopVersionData | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const [downloadSourceProbeStates, setDownloadSourceProbeStates] = useState<DownloadSourceProbeStateMap>({});
  const [steamStoreLink, setSteamStoreLink] = useState(() => getBundledSteamStoreLink());
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const buttonId = useId();
  const isDropdownPositioned = dropdownPosition !== null;
  const isChineseLocale = locale.toLowerCase().startsWith('zh');
  const legacyLocale = isChineseLocale ? 'zh-CN' : 'en';
  const needsRuntimeFetch = !version && platforms.length === 0 && !versionError;
  const desktopPageUrl = useMemo(() => getLinkWithLocale('desktop', locale), [locale]);
  const installButtonLabel = isChineseLocale ? '立即安装' : 'Install now';
  const installDesktopAriaLabel =
    isChineseLocale ? '立即安装 HagiCode Desktop' : 'Install HagiCode Desktop';
  const selectOtherVersionsLabel = isChineseLocale ? '选择下载平台和安装包' : 'Choose platform and package';
  const recommendedLabel = isChineseLocale ? '推荐' : 'Recommended';
  const loadingLatestLabel = isChineseLocale ? '正在获取最新版本...' : 'Fetching latest version...';
  const errorFallbackLabel =
    isChineseLocale
      ? '暂时无法获取最新版本，请改用 Index 版本历史页。'
      : 'Latest version is unavailable. Use the Index version history instead.';
  const desktopFallbackCta = isChineseLocale ? '打开版本历史页' : 'Open version history';
  const pendingMenuLabel = isChineseLocale ? '版本数据仍在加载' : 'Versions are still loading';
  const unavailableMenuLabel = isChineseLocale ? '版本数据暂时不可用' : 'Version data is temporarily unavailable';
  const desktopFallbackMenuLabel = isChineseLocale ? '打开版本历史页' : 'Open version history';
  const loadingPrimaryLabel = isChineseLocale ? '获取中...' : 'Loading...';
  const dropdownTitleLabel = isChineseLocale ? '下载桌面版' : 'Download Desktop';
  const choosePlatformLabel = isChineseLocale ? '选择操作系统' : 'Choose operating system';
  const allDownloadsLabel = isChineseLocale ? '查看全部下载与安装说明' : 'All downloads and installation guide';
  const currentDeviceLabel = isChineseLocale ? '当前设备' : 'Current device';
  const otherInstallPathsLabel = isChineseLocale ? '其他安装路径' : 'Other install paths';
  const steamShortcutLabel = 'Steam';
  const steamShortcutAriaLabel =
    isChineseLocale ? '打开 HagiCode Steam 商店页' : 'Open HagiCode on Steam';
  const windowsStoreShortcutAriaLabel =
    isChineseLocale ? '打开 HagiCode Microsoft Store 页面' : 'Open HagiCode on Microsoft Store';
  const showSteamShortcut = FEATURE_SITE_STEAM_ENABLED && variant === 'compact' && steamStoreLink.href.length > 0;

  useEffect(() => {
    if (!FEATURE_SITE_STEAM_ENABLED) {
      return;
    }

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
  const currentOS = useMemo(() => detectOS(), []);
  const orderedPlatformData = useMemo(
    () => prioritizeCurrentPlatform(platformData, currentOS),
    [currentOS, platformData],
  );
  const activePlatform = orderedPlatformData.find((platform) => platform.platform === selectedPlatform)
    ?? orderedPlatformData[0];

  const currentVersion = runtimeSnapshot.version;
  const menuState = useMemo(
    () => getInstallButtonMenuState(runtimeSnapshot, platformData.length),
    [runtimeSnapshot, platformData.length],
  );
  const historyFallbackTarget = runtimeSnapshot.fallbackTarget ?? DESKTOP_HISTORY_FALLBACK_URL;

  useEffect(() => {
    const probeTargets = collectDownloadSourceProbeTargets(runtimeSnapshot.platforms);
    const cachedStates = getCachedDownloadSourceProbeStates(probeTargets);
    setDownloadSourceProbeStates((current) =>
      areDownloadSourceProbeStatesEqual(current, cachedStates) ? current : cachedStates,
    );

    const hasPendingProbe = Object.values(cachedStates).some(
      (state) => state === 'unknown' || state === 'probing',
    );

    if (Object.keys(probeTargets).length === 0 || !hasPendingProbe) {
      return;
    }

    let mounted = true;
    void ensureDownloadSourceProbes(probeTargets).then((states) => {
      if (mounted) {
        setDownloadSourceProbeStates((current) =>
          areDownloadSourceProbeStatesEqual(current, states) ? current : states,
        );
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
      return isChineseLocale
        ? '主版本源暂不可用，当前显示站内快照，信息可能滞后。'
        : 'Primary sources are unavailable. Showing the local snapshot, which may be stale.';
    }

    if (runtimeSnapshot.status === 'degraded') {
      return isChineseLocale
        ? '主版本源暂不可用，当前显示备用索引数据。'
        : 'Primary source is unavailable. Showing the backup index.';
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
    if (!FEATURE_MAC_DOWNLOAD_ENABLED && currentOS === 'macos') {
      return {
        href: desktopPageUrl,
        option: null,
        action: null,
        actionPair: null,
      };
    }

    const resolved = resolveInstallButtonPrimaryTarget(
      orderedPlatformData,
      downloadSourceProbeStates,
      currentOS,
      desktopPageUrl,
    );
    const actionPair = resolved.option
      ? resolvePrimaryDownloadActionPair({ sourceActions: resolved.option.sourceActions })
      : null;

    return { ...resolved, actionPair };
  }, [currentOS, desktopPageUrl, downloadSourceProbeStates, orderedPlatformData]);

  const primaryActions = useMemo(() => {
    if (!primaryTarget.actionPair) {
      return [];
    }
    return primarySourceOrder
      .map((source) => ({
        source,
        action: primaryTarget.actionPair![source],
        label: getPrimaryDownloadSourceLabel(source, legacyLocale),
      }))
      .filter((entry) => Boolean(entry.action));
  }, [primaryTarget.actionPair, primarySourceOrder, locale]);

  const preferWindowsStorePrimary = currentOS === 'windows' && menuState.hasDownloads;
  const showWindowsStoreShortcut = variant === 'compact' && !preferWindowsStorePrimary;
  const windowsStorePrimaryLabel = isChineseLocale ? 'Microsoft Store 安装' : 'Install from Microsoft Store';
  const windowsStorePrimaryAriaLabel = isChineseLocale
    ? '通过 Microsoft Store 安装 HagiCode Desktop'
    : 'Install HagiCode Desktop from Microsoft Store';
  const showPrimarySourceButtons = primaryActions.length > 0 && !preferWindowsStorePrimary;

  const primaryHref =
    menuState.mode === 'fatal'
      ? historyFallbackTarget
      : preferWindowsStorePrimary
        ? WINDOWS_STORE_URL
      : menuState.hasDownloads
        ? primaryActions[0]?.action?.url ?? primaryTarget.href
        : desktopPageUrl;
  const primaryText =
    menuState.mode === 'fatal'
      ? desktopFallbackCta
      : preferWindowsStorePrimary
        ? windowsStorePrimaryLabel
      : menuState.mode === 'loading' && variant === 'compact'
        ? loadingPrimaryLabel
        : installButtonLabel;
  const primaryAriaLabel = preferWindowsStorePrimary
    ? windowsStorePrimaryAriaLabel
    : menuState.hasDownloads
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
    const estimatedWidth = Math.min(400, window.innerWidth - viewportPadding * 2);
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
      0,
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

    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        event.preventDefault();
        setIsDropdownOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isDropdownOpen && isDropdownPositioned) {
      menuRef.current?.focus({ preventScroll: true });
    }
  }, [isDropdownOpen, isDropdownPositioned]);

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
  }, [isDropdownOpen, activePlatform, menuState.mode, updateDropdownPosition]);

  const handleToggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    const nextOpen = !isDropdownOpen;
    if (nextOpen) {
      setSelectedPlatform(null);
    }
    setIsDropdownOpen(nextOpen);
    if (!nextOpen) {
      setDropdownPosition(null);
    }
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
    toggleRef.current?.focus();
  };

  const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') {
      return;
    }
    const controls = menuRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
    const first = controls?.[0];
    const last = controls?.[controls.length - 1];
    if ((event.shiftKey && (event.target === first || event.target === menuRef.current))
      || (!event.shiftKey && event.target === last)) {
      event.preventDefault();
      handleLinkClick();
    }
  };

  const handlePrimaryInstallClick = () => {
    if (preferWindowsStorePrimary) {
      return;
    }

    if (!menuState.hasDownloads || !primaryTarget.option) {
      return;
    }

    trackEvent(getDesktopDownloadEventName(primaryTarget.option.assetType), {
      source: `install-button-${variant}-primary-${primaryTarget.action?.kind ?? 'official'}`,
      url: primaryTarget.action?.url,
    });
  };

  const handlePlatformDownloadClick = (assetType: AssetType, action: DownloadAction) => {
    trackEvent(getDesktopDownloadEventName(assetType), {
      source: `install-button-${variant}-source-${action.kind}`,
      url: action.url,
    });
    handleLinkClick();
  };

  const renderStatusBlock = () => {
    const title = menuState.mode === 'loading' ? pendingMenuLabel : unavailableMenuLabel;
    const message = statusMessage || errorFallbackLabel;

    return (
      <div
        className={`${styles.dropdownItem} ${styles.dropdownItemDisabled} ${styles.dropdownStatusBlock}`}
        role="status"
      >
        <span className={styles.dropdownItemTextBlock}>
          <span className={styles.dropdownItemLabel}>{title}</span>
          <span className={styles.dropdownItemDisabledNotice}>{message}</span>
        </span>
      </div>
    );
  };

  const dropdownMenu =
    isDropdownOpen &&
    typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            className={`${styles.dropdownMenu} ${styles.dropdownMenuOpen}`}
            id={`${buttonId}-menu`}
            role="dialog"
            aria-labelledby={`${buttonId}-title`}
            tabIndex={-1}
            onKeyDown={handlePanelKeyDown}
            style={{
              top: dropdownPosition ? `${dropdownPosition.top}px` : '16px',
              left: dropdownPosition ? `${dropdownPosition.left}px` : '16px',
              maxHeight: dropdownPosition ? `${dropdownPosition.maxHeight}px` : undefined,
              opacity: dropdownPosition ? undefined : 0,
              visibility: dropdownPosition ? undefined : 'hidden',
              pointerEvents: dropdownPosition ? undefined : 'none',
            }}
          >
            <div className={styles.dropdownHeader} role="presentation">
              <span id={`${buttonId}-title`} className={styles.dropdownTitle}>{dropdownTitleLabel}</span>
              {currentVersion?.version && <span className={styles.versionTag}>{currentVersion.version}</span>}
            </div>
            {menuState.hasDownloads && (
              <div className={styles.dropdownPlatformPicker} role="group" aria-label={choosePlatformLabel}>
                {orderedPlatformData.map((platformGroup) => (
                  <button
                    key={platformGroup.platform}
                    type="button"
                    className={styles.dropdownPlatformButton}
                    aria-pressed={activePlatform?.platform === platformGroup.platform}
                    aria-controls={`${buttonId}-packages`}
                    onClick={() => setSelectedPlatform(platformGroup.platform)}
                  >
                    {platformGroup.platformLabel}
                  </button>
                ))}
              </div>
            )}
            <div className={styles.dropdownBody}>
              {menuState.mode !== 'ready' && renderStatusBlock()}
              {menuState.hasDownloads &&
                orderedPlatformData.filter((platformGroup) => platformGroup === activePlatform).map((platformGroup) => {
                  const isCurrentPlatform = platformGroup.platform === currentOS;

                  return (
                    <section
                      key={platformGroup.platform}
                      id={`${buttonId}-packages`}
                      className={styles.dropdownPlatformSection}
                      role="group"
                      aria-label={platformGroup.platformLabel}
                    >
                      <div className={styles.dropdownGroupLabel} role="presentation">
                        {isCurrentPlatform ? `${currentDeviceLabel} · ` : ''}{platformGroup.platformLabel}
                      </div>
                      <div className={styles.dropdownItemStack}>
                        {platformGroup.options.map((option, idx) => {
                          const archLabel = getArchitectureLabel(option.assetType);
                          const fileExt = getFileExtension(option.assetType, option.label);
                          const isRecommended = idx === 0;
                          const resolvedAction = resolvePrimaryDownloadAction(
                            { sourceActions: option.sourceActions },
                            downloadSourceProbeStates,
                          );

                          return (
                            <div
                              key={`${platformGroup.platform}-${option.url}`}
                              className={`${styles.dropdownItem} ${styles.dropdownItemMultiSource}`}
                            >
                              <div className={styles.dropdownItemMeta}>
                                <span className={styles.dropdownItemLabel}>
                                  {getAssetTypeLabel(option.assetType)}
                                  {isRecommended && (
                                    <span className={styles.recommendedBadge}>{recommendedLabel}</span>
                                  )}
                                </span>
                                <span className={styles.dropdownItemSize}>
                                  {[archLabel, fileExt, option.size].filter(Boolean).join(' · ')}
                                </span>
                              </div>
                              <div className={styles.dropdownSourceActions}>
                                {[
                                  ...option.sourceActions.filter((action) => action.kind === resolvedAction?.kind),
                                  ...option.sourceActions.filter((action) => action.kind !== resolvedAction?.kind),
                                ].map((action) => {
                                  const isSmartDefault = resolvedAction?.kind === action.kind;
                                  const sourceLabel = action.kind === 'github-release' ? 'GitHub' : getDownloadActionLabel(action.kind, legacyLocale);
                                  const actionLabel = `${isSmartDefault ? `${isChineseLocale ? '下载' : 'Download'} · ` : ''}${sourceLabel}`;

                                  return (
                                    <a
                                      key={`${option.url}-${action.kind}`}
                                      href={action.url}
                                      className={`${styles.dropdownSourceAction} ${isSmartDefault ? styles.dropdownSourceActionDefault : ''}`}
                                      download
                                      aria-label={`${actionLabel} — ${platformGroup.platformLabel} ${getAssetTypeLabel(option.assetType)} ${archLabel} ${fileExt}${isSmartDefault ? ` (${isChineseLocale ? '默认' : 'Default'})` : ''}`}
                                      onClick={() => handlePlatformDownloadClick(option.assetType, action)}
                                    >
                                      <span>{actionLabel}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              {!menuState.hasDownloads && (
                <section className={styles.dropdownUtilitySection} role="group" aria-label={otherInstallPathsLabel}>
                  <div className={styles.dropdownUtilityHeader} role="presentation">
                    <span className={styles.dropdownUtilityTitle}>{otherInstallPathsLabel}</span>
                  </div>
                  <div className={styles.dropdownItemStack}>
                    <a
                      href={historyFallbackTarget}
                      className={styles.dropdownItem}
                      onClick={handleLinkClick}
                    >
                      <span className={styles.dropdownItemTextBlock}>
                        <span className={styles.dropdownItemLabel}>{desktopFallbackMenuLabel}</span>
                        <span className={styles.dropdownItemDescription}>{errorFallbackLabel}</span>
                      </span>
                    </a>
                  </div>
                </section>
              )}
            </div>
            {menuState.hasDownloads && (
              <a
                href={desktopPageUrl}
                className={styles.dropdownFooter}
                onClick={() => {
                  trackEvent('open_desktop_page', { source: `install-button-${variant}-all-downloads`, url: desktopPageUrl });
                  handleLinkClick();
                }}
              >
                {allDownloadsLabel}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>,
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
        {showPrimarySourceButtons ? (
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
                      url: action.url,
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

        {showWindowsStoreShortcut && (
          <MicrosoftStoreBadge
            href={WINDOWS_STORE_URL}
            locale={locale}
            aria-label={windowsStoreShortcutAriaLabel}
            className={`${styles.microsoftStoreBadgeSlot} ${styles[`microsoftStoreBadgeSlot--${variant}`]}`}
            badgeClassName={styles.microsoftStoreBadgeElement}
            badgeAttributes={{ 'data-windows-store-entry': 'site-header-install' }}
          />
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
            ref={toggleRef}
            className={styles.btnDropdownToggle}
            type="button"
            aria-expanded={isDropdownOpen}
            aria-controls={`${buttonId}-menu`}
            aria-haspopup="dialog"
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
