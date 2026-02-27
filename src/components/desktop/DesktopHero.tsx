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
import { getDesktopVersionData, type DesktopVersionData } from '@/lib/shared/version-manager';
import { detectOS, getAssetTypeLabel, groupAssetsByPlatform } from '@/lib/shared/desktop-utils';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import type { DesktopVersion, AssetType } from '@/lib/shared/types/desktop';
import styles from './DesktopHero.module.css';

// 下载选项接口
interface DownloadOption {
  label: string;
  url: string;
  assetType: AssetType;
}

// 平台下载数据接口
interface PlatformDownloads {
  platform: 'windows' | 'macos' | 'linux';
  platformLabel: string;
  options: DownloadOption[];
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
function convertVersionToPlatformDownloads(version: DesktopVersion): PlatformDownloads[] {
  const platformLabels = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };

  // 检查 version.files 是否存在
  if (!version.files || !Array.isArray(version.files)) {
    return [];
  }

  // 使用已有的平台分组逻辑
  const platformGroups = groupAssetsByPlatform(version.files);

  if (!platformGroups || !Array.isArray(platformGroups)) {
    return [];
  }

  return platformGroups.map(platform => ({
    platform: platform.platform,
    platformLabel: platformLabels[platform.platform],
    options: platform.downloads.map(download => ({
      label: download.filename,
      url: download.url,
      assetType: download.assetType
    }))
  }));
}

interface DesktopHeroProps {
  desktopVersion?: any;
  desktopPlatforms?: any;
  desktopVersionError?: any;
  desktopChannels?: any;
  locale?: 'zh-CN' | 'en';
}

export default function DesktopHero(props: DesktopHeroProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [versionData, setVersionData] = useState<DesktopVersionData | null>(null);
  const [currentChannel, setCurrentChannel] = useState<'stable' | 'beta'>('stable');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userOS, setUserOS] = useState<'windows' | 'macos' | 'linux' | 'unknown'>(() => detectOS());
  const [openDropdown, setOpenDropdown] = useState<'windows' | 'macos' | 'linux' | null>(null);

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
    let mounted = true;

    async function loadVersionData() {
      try {
        const data = await getDesktopVersionData();
        if (mounted) {
          setVersionData(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : t('desktopHero.error.unknown'));
          setLoading(false);
        }
      }
    }

    loadVersionData();
    return () => { mounted = false; };
  }, []);

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

  const toggleDropdown = useCallback((platform: 'windows' | 'macos' | 'linux') => {
    setOpenDropdown(prev => prev === platform ? null : platform);
  }, []);

  const currentVersion = getCurrentVersion();
  const hasChannels = versionData?.channels.stable.latest || versionData?.channels.beta.latest;
  const isBeta = currentChannel === 'beta';

  if (loading) {
    return (
      <section className="hero">
        <div className="tech-grid-bg" />
        <div className="bgGlow" />
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <p>{t('desktopHero.loading')}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="hero">
        <div className="tech-grid-bg" />
        <div className="bgGlow" />
        <div className="hero-content">
          <div className="hero-badge">{t('desktopHero.badge')}</div>
          <h1>Hagicode Desktop</h1>
          <p className="hero-tagline">{t('desktopHero.tagline')}</p>

          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>{t('desktopHero.error.title')}</h3>
            <p>{error}</p>
            <a
              href="https://desktop.dl.hagicode.com/"
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('desktopHero.error.gotoDownload')}
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="tech-grid-bg" />
      <div className="bgGlow" />
      <div className="hero-content">
        <div className="hero-badge">{t('desktopHero.badge')}</div>
        <h1>{t('desktopHero.title')}</h1>
        <p className="hero-tagline">{t('desktopHero.tagline')}</p>

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

        {currentVersion && platformData.length > 0 && (
          <>
            {/* 统一下载按钮组 */}
            <div className={styles.downloadSection}>
              <div className={styles.buttonGroup}>
                {platformData.map((platform) => {
                  const isPrimary = userOS !== 'unknown' && platform.platform === userOS;
                  const isOpen = openDropdown === platform.platform;

                  // 获取该平台的默认下载选项（优先推荐版本）
                  const defaultOption = platform.options[0];

                  return (
                    <div
                      key={platform.platform}
                      className={`${styles.platformButton} ${isPrimary ? styles.platformButtonPrimary : styles.platformButtonSecondary}`}
                      aria-expanded={isOpen}
                    >
                      <div className={styles.splitButtonContainer}>
                        {/* 主下载按钮 - 左侧 */}
                        <a
                          href={defaultOption.url}
                          className={styles.btnDownloadMain}
                          download
                          onClick={() => setOpenDropdown(null)}
                          aria-label={t('desktopHero.download.ariaLabel', { platform: platform.platformLabel })}
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
                          aria-haspopup="listbox"
                          aria-label={t('desktopHero.selectOtherVersions', { platform: platform.platformLabel })}
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
                              {platform.options.map((option, idx) => (
                                <a
                                  key={idx}
                                  href={option.url}
                                  className={styles.dropdownItem}
                                  download
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <span className={styles.dropdownItemLabel}>{getAssetTypeLabel(option.assetType)}</span>
                                  <DownloadIcon />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 版本信息 */}
            <p className="version-info">
              {t('desktopHero.versionInfo', { version: currentVersion.version })}
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
      </div>
    </section>
  );
}
