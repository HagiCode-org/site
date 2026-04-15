/**
 * DesktopHero 组件 - 统一下载按钮 UI
 * 桌面页面的 Hero 区域，包含版本选择和下载功能
 * - 统一按钮组布局，显示所有平台
 * - 检测到的系统显示为主要按钮（渐变背景）
 * - 其他平台显示为次要按钮（灰色背景）
 * - 每个按钮支持下拉菜单选择版本
 * - 版本历史需要注册/登录后访问
 */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  DESKTOP_HISTORY_FALLBACK_URL,
  getDesktopVersionData,
  type DesktopVersionData,
} from '@/lib/shared/version-manager';
import {
  detectOS,
  getAssetTypeLabel,
  getDownloadActionLabel,
  getPrimaryDownloadSourceLabel,
  groupAssetsByPlatform,
  resolvePrimaryDownloadActionPair,
} from '@/lib/shared/desktop-utils';
import { FEATURE_MAC_DOWNLOAD_ENABLED } from '@/config/features';
import { MAC_DOWNLOAD_DISABLED_NOTICE, MAC_DOWNLOAD_DISABLED_NOTICE_EN } from '@/constants/downloadMessages';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import { getLinkWithLocale } from '@/lib/shared/links';
import type {
  AssetType,
  DesktopVersion,
  DownloadAction,
} from '@/lib/shared/types/desktop';
import { getDesktopDownloadEventName } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/tracker';
import type {
  PrimaryDownloadActionPair,
  PrimaryDownloadSourceKey,
} from '@/lib/shared/desktop-utils';
import styles from './DesktopHero.module.css';

// 下载选项接口
interface DownloadOption {
  label: string;
  url: string;
  assetType: AssetType;
  sourceActions: DownloadAction[];
}

// 平台下载数据接口
interface PlatformDownloads {
  platform: 'windows' | 'macos' | 'linux';
  platformLabel: string;
  options: DownloadOption[];
}

type DesktopPlatformKey = 'windows' | 'macos' | 'linux';

interface DesktopDropdownPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

export interface DesktopHeroVisiblePrimaryAction {
  source: PrimaryDownloadSourceKey;
  action: DownloadAction;
  label: string;
  ariaLabel: string;
}

// SVG 图标组件
const WindowsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4h-13.05M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
  </svg>
);

const MacIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const LinuxIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M19.15 8a2 2 0 0 0-2-2H4.85a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12.3a2 2 0 0 0 2-2V8M5.85 14.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m2-3.5a1 1 0 1 1 0-3 1.5 1.5 0 0 1 0 2m9 3.5a1 1 0 1 1 0-2 1 1.5 1.5 0 0 1 0 2m2-3.5a1 1 0 1 1 0-3 1.5 1.5 0 0 1 0 2m9 3.5a1 1 0 1 1 0-3 1.5 1.5 0 0 1 0 3m9 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2m2-3.5a1 1 0 1 1 0-3 1.5 1.5 0 0 1 0 2"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const platformIcons = {
  windows: WindowsIcon,
  macos: MacIcon,
  linux: LinuxIcon,
} as const;

// 将版本文件转换为平台下载数据
export function convertVersionToPlatformDownloads(version: DesktopVersion): PlatformDownloads[] {
  const platformLabels = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };

  // index 站的新结构以 assets 为准
  if (!version.assets || !Array.isArray(version.assets)) {
    return [];
  }

  // 使用已有的平台分组逻辑
  const platformGroups = groupAssetsByPlatform(version.assets);

  if (!platformGroups || !Array.isArray(platformGroups)) {
    return [];
  }

  return platformGroups.map(platform => ({
    platform: platform.platform,
    platformLabel: platformLabels[platform.platform],
    options: platform.downloads.map(download => ({
      label: download.filename,
      url: download.url,
      assetType: download.assetType,
      sourceActions: download.sourceActions,
    }))
  }));
}

export function resolveDesktopHeroPrimaryActions(
  option: DownloadOption | null,
): PrimaryDownloadActionPair {
  return resolvePrimaryDownloadActionPair(
    option ? { sourceActions: option.sourceActions } : null,
  );
}

export function resolveDesktopHeroCurrentVersion(
  versionData: DesktopVersionData | null,
): DesktopVersion | null {
  if (!versionData) {
    return null;
  }

  return versionData.channels.stable.latest || versionData.latest;
}

interface DesktopHeroActionBarProps {
  isOpen: boolean;
  locale: 'zh-CN' | 'en';
  toggleLabel: string;
  visiblePrimaryActions: DesktopHeroVisiblePrimaryAction[];
  onToggle: () => void;
  onPrimaryActionClick: (action: DesktopHeroVisiblePrimaryAction) => void;
}

export function DesktopHeroActionBar({
  isOpen,
  locale,
  toggleLabel,
  visiblePrimaryActions,
  onToggle,
  onPrimaryActionClick,
}: DesktopHeroActionBarProps) {
  return (
    <div className={styles.actionBar} data-action-bar="platform">
      <div className={styles.primarySourceActions} data-segment-role="primary-actions">
        {visiblePrimaryActions.map((entry) => (
          <a
            key={entry.source}
            href={entry.action.url}
            className={`${styles.sourceActionButton} ${styles[`sourceActionButton--${entry.source}`]}`}
            download
            onClick={() => onPrimaryActionClick(entry)}
            aria-label={entry.ariaLabel}
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
            <span>{entry.label}</span>
          </a>
        ))}
      </div>

      <button
        type="button"
        className={styles.btnDropdownToggle}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={toggleLabel}
        data-segment-role="toggle"
      >
        <span>{locale === 'en' ? 'More versions' : '更多版本 / 架构'}</span>
        <ChevronDownIcon />
      </button>
    </div>
  );
}

interface DesktopHeroProps {
  desktopVersion?: any;
  desktopPlatforms?: any;
  desktopVersionError?: any;
  desktopChannels?: any;
  locale?: 'zh-CN' | 'en';
}

export interface DesktopHeroFallbackState {
  fallbackTarget: string;
  shouldAutoRedirect: boolean;
  message: string;
  detail: string | null;
}

export function resolveDesktopHeroFallbackState(
  locale: 'zh-CN' | 'en',
  versionData: DesktopVersionData | null,
  runtimeError: string | null,
  hasCurrentVersion: boolean,
): DesktopHeroFallbackState | null {
  const fallbackTarget = versionData?.fallbackTarget ?? DESKTOP_HISTORY_FALLBACK_URL;
  const detail = versionData?.failedAttemptSummary ?? runtimeError;
  const isFatal = Boolean(runtimeError) || versionData?.status === 'fatal' || !hasCurrentVersion;

  if (!isFatal) {
    return null;
  }

  return {
    fallbackTarget,
    shouldAutoRedirect: true,
    message:
      locale === 'en'
        ? 'Unable to load desktop packages here. Redirecting to the Index version history...'
        : '此页暂无法加载桌面端安装包，正在跳转到 Index 版本历史页。',
    detail,
  };
}

export default function DesktopHero(props: DesktopHeroProps) {
  const { locale: detectedLocale } = useLocale();
  const locale = props.locale || detectedLocale;
  const { t } = useTranslation(locale);
  const [versionData, setVersionData] = useState<DesktopVersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userOS = useMemo(() => detectOS(), []);
  const [openDropdown, setOpenDropdown] = useState<DesktopPlatformKey | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DesktopDropdownPosition | null>(null);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const dropdownTriggerRefs = useRef<Partial<Record<DesktopPlatformKey, HTMLButtonElement | null>>>({});

  const loadVersionData = useCallback(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    getDesktopVersionData()
      .then((data) => {
        if (!mounted) {
          return;
        }

        setVersionData(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) {
          return;
        }

        setError(err instanceof Error ? err.message : t('desktopHero.download.unknown'));
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [t]);

  const updateDropdownPosition = useCallback((platform: DesktopPlatformKey) => {
    if (typeof window === 'undefined') {
      return;
    }

    const trigger = dropdownTriggerRefs.current[platform];
    if (!trigger) {
      setDropdownPosition(null);
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const preferredWidth = Math.max(rect.width, 520);
    const width = Math.min(preferredWidth, window.innerWidth - 32);
    const left = Math.min(
      Math.max(16, rect.right - width),
      Math.max(16, window.innerWidth - width - 16),
    );
    const top = rect.bottom + 8;
    const maxHeight = Math.max(180, window.innerHeight - top - 16);

    setDropdownPosition({
      top,
      left,
      width,
      maxHeight,
    });
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!openDropdown) {
        return;
      }

      const trigger = dropdownTriggerRefs.current[openDropdown];
      if (dropdownMenuRef.current?.contains(target) || trigger?.contains(target as Node)) {
        return;
      }

      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  useEffect(() => {
    if (!openDropdown) {
      setDropdownPosition(null);
      return;
    }

    const syncDropdownPosition = () => {
      updateDropdownPosition(openDropdown);
    };

    syncDropdownPosition();
    window.addEventListener('resize', syncDropdownPosition);
    window.addEventListener('scroll', syncDropdownPosition, true);

    return () => {
      window.removeEventListener('resize', syncDropdownPosition);
      window.removeEventListener('scroll', syncDropdownPosition, true);
    };
  }, [openDropdown, updateDropdownPosition]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [openDropdown]);

  useEffect(() => {
    return loadVersionData();
  }, [loadVersionData]);

  // 转换平台数据格式
  const platformData = useMemo(() => {
    const currentVersion = resolveDesktopHeroCurrentVersion(versionData);
    if (!currentVersion) return [];
    return convertVersionToPlatformDownloads(currentVersion);
  }, [versionData]);

  const visiblePlatformData = useMemo(() => {
    if (FEATURE_MAC_DOWNLOAD_ENABLED) {
      return platformData;
    }
    return platformData.filter((platform) => platform.platform !== 'macos');
  }, [platformData]);

  const showMacDownloadNotice = useMemo(() => {
    if (FEATURE_MAC_DOWNLOAD_ENABLED) {
      return false;
    }
    return platformData.some((platform) => platform.platform === 'macos');
  }, [platformData]);

  const toggleDropdown = useCallback((platform: DesktopPlatformKey) => {
    setDropdownPosition(null);
    setOpenDropdown(prev => prev === platform ? null : platform);
  }, []);

  const currentVersion = resolveDesktopHeroCurrentVersion(versionData);
  const macDownloadNotice = locale === 'en'
    ? `For macOS users: ${MAC_DOWNLOAD_DISABLED_NOTICE_EN}`
    : `Mac 用户：${MAC_DOWNLOAD_DISABLED_NOTICE}`;
  const containerPageUrl = useMemo(() => getLinkWithLocale('container', locale), [locale]);
  const fallbackCtaLabel = locale === 'en' ? 'Open version history' : '打开版本历史页';
  const fallbackContainerLabel = locale === 'en' ? 'Open Container page' : '前往 Container 页面';
  const runtimeError = error || versionData?.error || null;
  const fallbackState = resolveDesktopHeroFallbackState(locale, versionData, runtimeError, Boolean(currentVersion));
  const fallbackError = fallbackState?.message || runtimeError || t('desktopHero.download.unknown');
  const getDownloadAriaLabel = (platformLabel: string) =>
    t('desktopHero.download.ariaLabel').replace('{platform}', platformLabel);
  const getSelectOtherVersionsLabel = (platformLabel: string) =>
    t('desktopHero.selectOtherVersions').replace('{platform}', platformLabel);
  const primarySourceOrder: PrimaryDownloadSourceKey[] = ['github', 'accelerated'];
  const tablePlatformLabel = locale === 'en' ? 'Platform' : '平台';
  const tableGithubLabel = 'GitHub';
  const tableChinaLabel = locale === 'en' ? 'China' : '中国大陆';
  const tableMoreLabel = locale === 'en' ? 'More Downloads' : '更多下载';
  const moreDownloadsButtonLabel = locale === 'en' ? 'More Downloads' : '更多下载';
  const dropdownPackageLabel = locale === 'en' ? 'Package' : '安装包';

  useEffect(() => {
    if (!fallbackState?.shouldAutoRedirect || typeof window === 'undefined') {
      return;
    }

    const timer = window.setTimeout(() => {
      window.location.assign(fallbackState.fallbackTarget);
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fallbackState]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <p>{t('desktopHero.loading')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={DESKTOP_HISTORY_FALLBACK_URL} className="btn btn-primary">
            {fallbackCtaLabel}
          </a>
          <a href={containerPageUrl} className="btn btn-secondary">
            {fallbackContainerLabel}
          </a>
        </div>
      </div>
    );
  }

  if (runtimeError || (!currentVersion && !loading)) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>{t('desktopHero.error.title')}</h3>
        <p>{fallbackError}</p>
        {fallbackState?.detail && <p>{fallbackState.detail}</p>}
        <div className="flex flex-wrap justify-center gap-3">
          <a href={fallbackState?.fallbackTarget ?? DESKTOP_HISTORY_FALLBACK_URL} className="btn btn-primary">
            {fallbackCtaLabel}
          </a>
          <button type="button" className="btn btn-secondary" onClick={loadVersionData}>
            {locale === 'en' ? 'Retry' : '重试'}
          </button>
          <a href={containerPageUrl} className="btn btn-secondary">
            {fallbackContainerLabel}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hero-value-prop">
        <div className="value-point">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
          <span>{t('desktopHero.valuePoints.local')}</span>
        </div>
        <div className="value-point">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{t('desktopHero.valuePoints.fast')}</span>
        </div>
        <div className="value-point">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{t('desktopHero.valuePoints.oneClick')}</span>
        </div>
      </div>

        {currentVersion && (visiblePlatformData.length > 0 || showMacDownloadNotice) && (
          <>
            {/* 统一下载按钮组 */}
            <div className={styles.downloadSection}>
              {visiblePlatformData.length > 0 && (
                <div className={styles.buttonGroup}>
                  <div className={styles.platformTableScroll}>
                    <table className={styles.platformTable} data-platform-table="desktop-downloads">
                      <thead>
                        <tr>
                          <th scope="col">{tablePlatformLabel}</th>
                          <th scope="col">{tableGithubLabel}</th>
                          <th scope="col">{tableChinaLabel}</th>
                          <th scope="col">{tableMoreLabel}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visiblePlatformData.map((platform) => {
                          const isPrimary = userOS !== 'unknown' && platform.platform === userOS;
                          const isOpen = openDropdown === platform.platform;
                          const defaultOption = platform.options[0];
                          const defaultActionPair = resolveDesktopHeroPrimaryActions(defaultOption ?? null);
                          const githubAction = defaultActionPair.github
                            ? {
                                source: 'github' as const,
                                action: defaultActionPair.github,
                                label: getPrimaryDownloadSourceLabel('github', locale),
                                ariaLabel: `${getDownloadAriaLabel(platform.platformLabel)} (${getPrimaryDownloadSourceLabel('github', locale)})`,
                              }
                            : null;
                          const acceleratedAction = defaultActionPair.accelerated
                            ? {
                                source: 'accelerated' as const,
                                action: defaultActionPair.accelerated,
                                label: getPrimaryDownloadSourceLabel('accelerated', locale),
                                ariaLabel: `${getDownloadAriaLabel(platform.platformLabel)} (${getPrimaryDownloadSourceLabel('accelerated', locale)})`,
                              }
                            : null;
                          const PlatformIcon = platformIcons[platform.platform];

                          return (
                            <tr
                              key={platform.platform}
                              className={`${styles.platformButton} ${isPrimary ? styles.platformButtonPrimary : styles.platformButtonSecondary}`}
                              aria-expanded={isOpen}
                            >
                              <td className={styles.platformIdentityCell}>
                                <span className={styles.platformButtonLabel}>
                                  <span className={styles.platformIconWrap}>
                                    <PlatformIcon />
                                  </span>
                                  <span className={styles.platformName}>{platform.platformLabel}</span>
                                  {isPrimary && <span className={styles.recommendedBadge}>{t('desktopHero.download.recommended')}</span>}
                                </span>
                              </td>
                              <td className={styles.platformSourceCell}>
                                {githubAction ? (
                                  <a
                                    href={githubAction.action.url}
                                    className={`${styles.sourceActionButton} ${styles.sourceActionButtonStandalone} ${styles[`sourceActionButton--${githubAction.source}`]}`}
                                    download
                                    aria-label={githubAction.ariaLabel}
                                    onClick={() => {
                                      if (defaultOption) {
                                        trackEvent(getDesktopDownloadEventName(defaultOption.assetType), {
                                          source: `desktop-hero-${platform.platform}-primary-${githubAction.action.kind}`,
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
                                    <span>{githubAction.label}</span>
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    className={`${styles.sourceActionButton} ${styles.sourceActionButtonStandalone} ${styles.sourceActionButtonDisabled} ${styles.sourceActionButtonGithubDisabled}`}
                                    disabled
                                    aria-label="GitHub"
                                  >
                                    <span>GitHub</span>
                                  </button>
                                )}
                              </td>
                              <td className={styles.platformSourceCell}>
                                {acceleratedAction ? (
                                  <a
                                    href={acceleratedAction.action.url}
                                    className={`${styles.sourceActionButton} ${styles.sourceActionButtonStandalone} ${styles[`sourceActionButton--${acceleratedAction.source}`]}`}
                                    download
                                    aria-label={acceleratedAction.ariaLabel}
                                    onClick={() => {
                                      if (defaultOption) {
                                        trackEvent(getDesktopDownloadEventName(defaultOption.assetType), {
                                          source: `desktop-hero-${platform.platform}-primary-${acceleratedAction.action.kind}`,
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
                                    <span>{acceleratedAction.label}</span>
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    className={`${styles.sourceActionButton} ${styles.sourceActionButtonStandalone} ${styles.sourceActionButtonDisabled}`}
                                    disabled
                                    aria-label={tableChinaLabel}
                                  >
                                    <span>{tableChinaLabel}</span>
                                  </button>
                                )}
                              </td>
                              <td className={styles.platformActionsCell}>
                              <button
                                type="button"
                                className={`${styles.btnDropdownToggle} ${styles.btnDropdownToggleStandalone}`}
                                ref={(node) => {
                                  dropdownTriggerRefs.current[platform.platform] = node;
                                }}
                                onClick={() => toggleDropdown(platform.platform)}
                                aria-expanded={isOpen}
                                aria-haspopup="menu"
                                aria-label={getSelectOtherVersionsLabel(platform.platformLabel)}
                                data-segment-role="toggle"
                                >
                                  <span>{moreDownloadsButtonLabel}</span>
                                </button>

                              {isOpen && (
                                typeof document !== 'undefined' && dropdownPosition
                                  ? createPortal(
                                      <div
                                        ref={dropdownMenuRef}
                                        className={`${styles.dropdownMenu} ${styles.dropdownMenuOpen}`}
                                        style={{
                                          top: `${dropdownPosition.top}px`,
                                          left: `${dropdownPosition.left}px`,
                                          width: `${dropdownPosition.width}px`,
                                          maxHeight: `${dropdownPosition.maxHeight}px`,
                                        }}
                                      >
                                        <div
                                          className={`${styles.dropdownGroupLabel} ${styles[`platform--${platform.platform}`]}`}
                                        >
                                          <span className={styles.platformLabel}>{platform.platformLabel}</span>
                                        </div>
                                        <div className={styles.dropdownList}>
                                          <div className={`${styles.dropdownTableRow} ${styles.dropdownTableHeader}`} aria-hidden="true">
                                            <span className={`${styles.dropdownTableCell} ${styles.dropdownLabelCell}`}>{dropdownPackageLabel}</span>
                                            <span className={styles.dropdownTableCell}>{tableGithubLabel}</span>
                                            <span className={styles.dropdownTableCell}>{tableChinaLabel}</span>
                                            <span className={`${styles.dropdownTableCell} ${styles.dropdownMoreCell}`}>{tableMoreLabel}</span>
                                          </div>
                                          {platform.options.map((option, idx) => {
                                            const actionPair = resolveDesktopHeroPrimaryActions(option);
                                            const githubOptionAction = actionPair.github;
                                            const acceleratedOptionAction = actionPair.accelerated;

                                            return (
                                              <div
                                                key={`${platform.platform}-${option.url}-${idx}`}
                                                className={`${styles.dropdownItem} ${styles.dropdownTableRow}`}
                                              >
                                                <div className={`${styles.dropdownTableCell} ${styles.dropdownLabelCell}`}>
                                                  <span className={styles.dropdownItemLabel}>{getAssetTypeLabel(option.assetType)}</span>
                                                </div>
                                                <div className={styles.dropdownTableCell}>
                                                  {githubOptionAction ? (
                                                    <a
                                                      href={githubOptionAction.url}
                                                      className={`${styles.dropdownSourceAction} ${styles[`dropdownSourceAction--github`]}`}
                                                      download
                                                      onClick={() => {
                                                        trackEvent(getDesktopDownloadEventName(option.assetType), {
                                                          source: `desktop-hero-${platform.platform}-source-${githubOptionAction.kind}`,
                                                        });
                                                        setOpenDropdown(null);
                                                      }}
                                                    >
                                                      <span>{getPrimaryDownloadSourceLabel('github', locale)}</span>
                                                    </a>
                                                  ) : (
                                                    <span className={`${styles.dropdownSourceAction} ${styles.dropdownSourceActionDisabled}`}>
                                                      {locale === 'en' ? 'Unavailable' : '暂无'}
                                                    </span>
                                                  )}
                                                </div>
                                                <div className={styles.dropdownTableCell}>
                                                  {acceleratedOptionAction ? (
                                                    <a
                                                      href={acceleratedOptionAction.url}
                                                      className={`${styles.dropdownSourceAction} ${styles[`dropdownSourceAction--accelerated`]}`}
                                                      download
                                                      onClick={() => {
                                                        trackEvent(getDesktopDownloadEventName(option.assetType), {
                                                          source: `desktop-hero-${platform.platform}-source-${acceleratedOptionAction.kind}`,
                                                        });
                                                        setOpenDropdown(null);
                                                      }}
                                                    >
                                                      <span>{getPrimaryDownloadSourceLabel('accelerated', locale)}</span>
                                                    </a>
                                                  ) : (
                                                    <span className={`${styles.dropdownSourceAction} ${styles.dropdownSourceActionDisabled}`}>
                                                      {locale === 'en' ? 'Unavailable' : '暂无'}
                                                    </span>
                                                  )}
                                                </div>
                                                <div className={`${styles.dropdownTableCell} ${styles.dropdownMoreCell}`}>
                                                  <div className={styles.dropdownSourceActions}>
                                                    {actionPair.secondary.length > 0 ? actionPair.secondary.map((action) => (
                                                      <a
                                                        key={`${option.url}-${action.kind}`}
                                                        href={action.url}
                                                        className={`${styles.dropdownSourceAction} ${styles.dropdownSourceActionSecondary}`}
                                                        download
                                                        onClick={() => {
                                                          trackEvent(getDesktopDownloadEventName(option.assetType), {
                                                            source: `desktop-hero-${platform.platform}-source-${action.kind}`,
                                                          });
                                                          setOpenDropdown(null);
                                                        }}
                                                      >
                                                        <span>{getDownloadActionLabel(action.kind, locale)}</span>
                                                      </a>
                                                    )) : (
                                                      <span className={`${styles.dropdownSourceAction} ${styles.dropdownSourceActionDisabled}`}>
                                                        {locale === 'en' ? 'No extra source' : '无额外来源'}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>,
                                      document.body,
                                    )
                                  : null
                              )}
                            </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {showMacDownloadNotice && (
                <p className={styles.macNotice} role="status">
                  ⚠ {macDownloadNotice}
                </p>
              )}
            </div>
          </>
        )}
      <div className="hero-features">
        <span className="feature-tag">{t('desktopHero.features.privacy')}</span>
        <span className="feature-tag">{t('desktopHero.features.fast')}</span>
        <span className="feature-tag">{t('desktopHero.features.crossPlatform')}</span>
      </div>
    </>
  );
}
