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
import type { DesktopVersion, PlatformGroup } from '@/lib/shared/desktop';
import type { DesktopVersionSource } from '@/lib/shared/desktop-utils';
import {
  detectOS,
  getArchitectureLabel,
  getAssetTypeLabel,
  getFileExtension,
  groupAssetsByPlatform,
  PLATFORM_ICONS,
} from '@/lib/shared/desktop-utils';
import { getLinkWithLocale } from '@/lib/shared/links';
import type {
  DesktopVersionData,
  DesktopVersionState,
} from '@/lib/shared/version-manager';
import { getDesktopVersionData } from '@/lib/shared/version-manager';
import type { AssetType } from '@/lib/shared/desktop';
import { getDesktopDownloadEventName, WEBSITE_TRACKING_EVENTS } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/tracker';

export interface DownloadOption {
  label: string;
  url: string;
  size?: string;
  assetType: AssetType;
}

export interface PlatformDownloads {
  platform: 'windows' | 'macos' | 'linux';
  platformLabel: string;
  options: DownloadOption[];
}

export interface InstallButtonRuntimeSnapshot {
  version: DesktopVersion | null;
  platforms: PlatformGroup[];
  error: string | null;
  status: DesktopVersionState | 'loading';
  source: DesktopVersionSource | null;
}

export interface InstallButtonMenuState {
  mode: 'loading' | 'ready' | 'fatal';
  hasDownloads: boolean;
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
    })),
  }));
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
  if (versionError) {
    return {
      version: version ?? null,
      platforms: platforms.length > 0 ? platforms : version ? groupAssetsByPlatform(version.assets) : [],
      error: versionError,
      status: 'fatal',
      source: null,
    };
  }

  if (version || platforms.length > 0) {
    return {
      version: version ?? null,
      platforms: platforms.length > 0 ? platforms : version ? groupAssetsByPlatform(version.assets) : [],
      error: null,
      status: 'ready',
      source: null,
    };
  }

  return {
    version: null,
    platforms: [],
    error: null,
    status: 'loading',
    source: null,
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
    platforms,
    error: data.error,
    status: data.status,
    source: data.source,
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
      ? 'Latest version is unavailable, use Desktop page instead'
      : '暂时无法获取最新版本，请先前往 Desktop 页面';
  const desktopFallbackCta = locale === 'en' ? 'Open Desktop page' : '前往 Desktop 页面';
  const pendingMenuLabel = locale === 'en' ? 'Versions are still loading' : '版本数据仍在加载';
  const unavailableMenuLabel = locale === 'en' ? 'Version data is temporarily unavailable' : '版本数据暂时不可用';
  const desktopFallbackMenuLabel = locale === 'en' ? 'Browse Desktop downloads' : '浏览 Desktop 下载页';
  const loadingPrimaryLabel = locale === 'en' ? 'Loading...' : '获取中...';

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

  const statusMessage = useMemo(() => {
    if (menuState.mode === 'loading') {
      return loadingLatestLabel;
    }

    if (menuState.mode === 'fatal') {
      return runtimeSnapshot.error || errorFallbackLabel;
    }

    return null;
  }, [
    errorFallbackLabel,
    loadingLatestLabel,
    menuState.mode,
    runtimeSnapshot.error,
  ]);

  const currentUrl = useMemo(() => {
    if (platformData.length === 0) {
      return desktopPageUrl;
    }

    const userOS = detectOS();

    if (!FEATURE_MAC_DOWNLOAD_ENABLED && userOS === 'macos') {
      return desktopPageUrl;
    }

    const userPlatform = platformData.find((platform) => platform.platform === userOS);

    if (userPlatform) {
      const recommended = userPlatform.options.find((option) => {
        const label = option.label.toLowerCase();
        if (userOS === 'windows') return label.includes('setup');
        if (userOS === 'macos') return label.includes('arm64');
        if (userOS === 'linux') return label.includes('appimage');
        return false;
      });
      return recommended ? recommended.url : userPlatform.options[0].url;
    }

    return platformData[0].options[0].url;
  }, [desktopPageUrl, platformData]);

  const primaryHref = menuState.hasDownloads ? currentUrl : desktopPageUrl;
  const primaryText =
    menuState.mode === 'fatal'
      ? desktopFallbackCta
      : menuState.mode === 'loading' && variant === 'compact'
        ? loadingPrimaryLabel
        : installButtonLabel;
  const primaryAriaLabel = menuState.hasDownloads
    ? installDesktopAriaLabel
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
    trackEvent(WEBSITE_TRACKING_EVENTS.downloadDesktop, { source: `install-button-${variant}-primary` });
  };

  const handlePlatformDownloadClick = (assetType: AssetType) => {
    trackEvent(getDesktopDownloadEventName(assetType), { source: `install-button-${variant}-platform` });
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
          role="option"
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
            role="listbox"
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
                    return (
                      <li key={`${platformGroup.platform}-${option.url}`} role="none">
                        <a
                          href={option.url}
                          className={`${styles.dropdownItem} ${isRecommended ? styles.dropdownItemRecommended : ''}`}
                          role="option"
                          download
                          onClick={() => handlePlatformDownloadClick(option.assetType)}
                        >
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
                        </a>
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
                    role="option"
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
                    role="option"
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
                  href={desktopPageUrl}
                  className={styles.dropdownItem}
                  role="option"
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
                role="option"
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
      <div className={styles.splitButtonContainer}>
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

        {showDropdown && (
          <button
            className={styles.btnDropdownToggle}
            type="button"
            aria-expanded={isDropdownOpen}
            aria-controls={`${buttonId}-menu`}
            aria-haspopup="listbox"
            aria-busy={menuState.mode === 'loading'}
            aria-label={selectOtherVersionsLabel}
            data-runtime-state={menuState.mode}
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
