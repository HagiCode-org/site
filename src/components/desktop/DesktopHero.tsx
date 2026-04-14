/**
 * DesktopHero 组件 - 统一下载按钮 UI
 * 桌面页面的 Hero 区域，包含版本选择和下载功能
 * - 统一按钮组布局，显示所有平台
 * - 检测到的系统显示为主要按钮（渐变背景）
 * - 其他平台显示为次要按钮（灰色背景）
 * - 每个按钮支持下拉菜单选择版本
 * - 版本历史需要注册/登录后访问
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DESKTOP_HISTORY_FALLBACK_URL,
  getDesktopVersionData,
  type DesktopVersionData,
} from '@/lib/shared/version-manager';
import {
  detectOS,
  ensureDownloadSourceProbes,
  collectDownloadSourceProbeTargets,
  getCachedDownloadSourceProbeStates,
  getAssetTypeLabel,
  getDownloadActionLabel,
  groupAssetsByPlatform,
  resolvePrimaryDownloadAction,
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
  DownloadSourceProbeStateMap,
} from '@/lib/shared/types/desktop';
import { getDesktopDownloadEventName } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/tracker';
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

export interface DesktopHeroPrimaryTarget {
  href: string;
  action: DownloadAction | null;
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

export function resolveDesktopHeroPrimaryTarget(
  option: DownloadOption | null,
  probeStates: DownloadSourceProbeStateMap,
): DesktopHeroPrimaryTarget {
  if (!option) {
    return {
      href: '',
      action: null,
    };
  }

  const action = resolvePrimaryDownloadAction({ sourceActions: option.sourceActions }, probeStates);
  return {
    href: action?.url ?? option.url,
    action,
  };
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
  const [currentChannel, setCurrentChannel] = useState<'stable' | 'beta'>('stable');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadSourceProbeStates, setDownloadSourceProbeStates] = useState<DownloadSourceProbeStateMap>({});
  const [userOS, setUserOS] = useState<'windows' | 'macos' | 'linux' | 'unknown'>(() => detectOS());
  const [openDropdown, setOpenDropdown] = useState<'windows' | 'macos' | 'linux' | null>(null);

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

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 检查点击是否在下拉菜单或按钮外部
      if (openDropdown && !target.closest(`.${styles.platformButton}`)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  useEffect(() => {
    return loadVersionData();
  }, [loadVersionData]);

  const getCurrentVersion = (): DesktopVersion | null => {
    if (!versionData) return null;
    if (currentChannel === 'stable') {
      return versionData.channels.stable.latest || versionData.latest;
    }
    return versionData.channels.beta.latest || versionData.latest;
  };

  // 转换平台数据格式
  const platformData = useMemo(() => {
    const currentVersion = getCurrentVersion();
    if (!currentVersion) return [];
    return convertVersionToPlatformDownloads(currentVersion);
  }, [versionData, currentChannel]);

  const visiblePlatformData = useMemo(() => {
    if (FEATURE_MAC_DOWNLOAD_ENABLED) {
      return platformData;
    }
    return platformData.filter((platform) => platform.platform !== 'macos');
  }, [platformData]);
  const buttonGroupColumns = useMemo(
    () => Math.min(Math.max(visiblePlatformData.length, 1), 3),
    [visiblePlatformData.length],
  );

  const showMacDownloadNotice = useMemo(() => {
    if (FEATURE_MAC_DOWNLOAD_ENABLED) {
      return false;
    }
    return platformData.some((platform) => platform.platform === 'macos');
  }, [platformData]);

  useEffect(() => {
    const currentVersion = getCurrentVersion();
    const platformGroups = currentVersion ? groupAssetsByPlatform(currentVersion.assets) : [];
    const probeTargets = collectDownloadSourceProbeTargets(platformGroups);
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
  }, [versionData, currentChannel]);

  const toggleDropdown = useCallback((platform: 'windows' | 'macos' | 'linux') => {
    setOpenDropdown(prev => prev === platform ? null : platform);
  }, []);

  const currentVersion = getCurrentVersion();
  const hasChannels = versionData?.channels.stable.latest || versionData?.channels.beta.latest;
  const isBeta = currentChannel === 'beta';
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
  const versionInfoLabel = t('desktopHero.versionInfo').replace('{version}', currentVersion?.version ?? '');

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
                <div
                  className={styles.buttonGroup}
                  style={{ gridTemplateColumns: `repeat(${buttonGroupColumns}, minmax(0, 1fr))` }}
                >
                  {visiblePlatformData.map((platform) => {
                    const isPrimary = userOS !== 'unknown' && platform.platform === userOS;
                    const isOpen = openDropdown === platform.platform;
                    const defaultOption = platform.options[0];
                    const primaryTarget = resolveDesktopHeroPrimaryTarget(
                      defaultOption ?? null,
                      downloadSourceProbeStates,
                    );

                    return (
                      <div
                        key={platform.platform}
                        className={`${styles.platformButton} ${isPrimary ? styles.platformButtonPrimary : styles.platformButtonSecondary}`}
                        aria-expanded={isOpen}
                      >
                        <div className={styles.splitButtonContainer}>
                          {/* 主下载按钮 - 左侧 */}
                          <a
                            href={primaryTarget.href}
                            className={styles.btnDownloadMain}
                            download
                            onClick={() => {
                              if (defaultOption) {
                                trackEvent(getDesktopDownloadEventName(defaultOption.assetType), {
                                  source: `desktop-hero-${platform.platform}-primary-${primaryTarget.action?.kind ?? 'official'}`,
                                });
                              }
                              setOpenDropdown(null);
                            }}
                            aria-label={`${getDownloadAriaLabel(platform.platformLabel)}${primaryTarget.action ? ` (${getDownloadActionLabel(primaryTarget.action.kind, locale)})` : ''}`}
                          >
                            <span className={styles.platformButtonLabel}>
                              {isPrimary && <span className={styles.recommendedBadge}>{t('desktopHero.download.recommended')}</span>}
                              <span className={styles.platformName}>{platform.platformLabel}</span>
                            </span>
                          </a>

                          {/* 下拉切换按钮 - 右侧 */}
                          <button
                            type="button"
                            className={styles.btnDropdownToggle}
                            onClick={() => toggleDropdown(platform.platform)}
                            aria-expanded={isOpen}
                            aria-haspopup="menu"
                            aria-label={getSelectOtherVersionsLabel(platform.platformLabel)}
                          >
                            <ChevronDownIcon />
                          </button>

                          {/* 下拉菜单 */}
                          {isOpen && (
                            <div className={styles.dropdownMenu}>
                              <div
                                className={`${styles.dropdownGroupLabel} ${styles[`platform--${platform.platform}`]}`}
                              >
                                <span className={styles.platformLabel}>{platform.platformLabel}</span>
                              </div>
                              <div className={styles.dropdownList}>
                                {platform.options.map((option, idx) => {
                                  const resolvedAction = resolvePrimaryDownloadAction(
                                    { sourceActions: option.sourceActions },
                                    downloadSourceProbeStates,
                                  );

                                  return (
                                    <div
                                      key={`${platform.platform}-${option.url}-${idx}`}
                                      className={styles.dropdownItem}
                                    >
                                      <div className={styles.dropdownItemLabelRow}>
                                        <span className={styles.dropdownItemLabel}>{getAssetTypeLabel(option.assetType)}</span>
                                        <DownloadIcon />
                                      </div>
                                      <div className={styles.dropdownSourceActions}>
                                        {option.sourceActions.map((action) => {
                                          const isSmartDefault = resolvedAction?.kind === action.kind;
                                          return (
                                            <a
                                              key={`${option.url}-${action.kind}`}
                                              href={action.url}
                                              className={`${styles.dropdownSourceAction} ${isSmartDefault ? styles.dropdownSourceActionDefault : ''}`}
                                              download
                                              onClick={() => {
                                                trackEvent(getDesktopDownloadEventName(option.assetType), {
                                                  source: `desktop-hero-${platform.platform}-source-${action.kind}`,
                                                });
                                                setOpenDropdown(null);
                                              }}
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
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {showMacDownloadNotice && (
                <p className={styles.macNotice} role="status">
                  ⚠ {macDownloadNotice}
                </p>
              )}
            </div>

            {/* 版本信息 */}
            <p className="version-info">
              {versionInfoLabel}
              {currentChannel === 'beta' && ` ${t('desktopHero.testVersion')}`}
            </p>

            {/* 渠道选择器 */}
            {hasChannels && (
              <>
                <div className="channel-selector">
                  <button
                    className={`channel-tab ${currentChannel === 'stable' ? 'channel-tab--active' : ''}`}
                    onClick={() => setCurrentChannel('stable')}
                    aria-selected={currentChannel === 'stable'}
                  >
                    <span className="channel-icon">🟢</span>
                    <span className="channel-label">{t('desktopHero.channels.stable')}</span>
                  </button>
                  <button
                    className={`channel-tab ${currentChannel === 'beta' ? 'channel-tab--active' : ''}`}
                    onClick={() => setCurrentChannel('beta')}
                    aria-selected={currentChannel === 'beta'}
                  >
                    <span className="channel-icon">🧪</span>
                    <span className="channel-label">{t('desktopHero.channels.beta')}</span>
                  </button>
                </div>

                {/* Beta 警告 */}
                {isBeta && (
                  <div className="beta-warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="warning-icon">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 3.1.732 3z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="warning-content">
                      <strong>{t('desktopHero.betaWarning.title')}</strong>
                      <p>{t('desktopHero.betaWarning.description')}</p>
                    </div>
                  </div>
                )}
              </>
            )}
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
