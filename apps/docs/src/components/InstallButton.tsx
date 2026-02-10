/**
 * InstallButton 组件 - 文档站点版本 (React)
 * 支持自动平台检测、下拉菜单选择版本、Docker 版本跳转
 * 用于 Header 导航栏
 */
import { useState, useMemo, useEffect } from 'react';
import { getLink } from '@shared/links';
import {
  fetchDesktopVersions,
  groupAssetsByPlatform,
  getRecommendedDownload,
  detectOS,
  getAssetTypeLabel,
  inferAssetType
} from '@shared/desktop-utils';
import type { DesktopVersion, PlatformGroup } from '@shared/desktop';

interface DownloadOption {
  label: string;
  url: string;
  size?: string;
  assetType: string;
}

interface PlatformDownloads {
  platform: 'windows' | 'macos' | 'linux';
  platformLabel: string;
  options: DownloadOption[];
}

interface InstallButtonProps {
  /**
   * 显示模式
   * - full: 完整模式（预留）
   * - compact: 紧凑模式，用于 Header 导航栏
   */
  variant?: 'full' | 'compact';

  /**
   * 可选的额外类名
   */
  className?: string;

  /**
   * 版本数据（服务端传入，优先使用）
   */
  initialVersion?: DesktopVersion | null;

  /**
   * 平台数据（服务端传入，优先使用）
   */
  initialPlatforms?: PlatformGroup[];

  /**
   * 错误信息
   */
  versionError?: string | null;
}

/**
 * 将 PlatformGroup[] 转换为 PlatformDownloads[] 格式
 */
function convertPlatformGroups(platforms: PlatformGroup[]): PlatformDownloads[] {
  const platformLabels = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };

  return platforms.map(platform => ({
    platform: platform.platform,
    platformLabel: platformLabels[platform.platform],
    options: platform.downloads.map(download => ({
      label: download.filename,
      url: download.url,
      size: download.size,
      assetType: download.assetType
    }))
  }));
}

export default function InstallButton({
  variant = 'compact',
  className = '',
  initialVersion = null,
  initialPlatforms = [],
  versionError = null
}: InstallButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [version, setVersion] = useState<DesktopVersion | null>(initialVersion);
  const [platforms, setPlatforms] = useState<PlatformGroup[]>(initialPlatforms);
  const [error, setError] = useState<string | null>(versionError);

  // 客户端数据获取（如果服务端没有提供数据）
  useEffect(() => {
    if (initialVersion || initialPlatforms.length > 0 || versionError) {
      return; // 已有数据或错误，无需重新获取
    }

    let mounted = true;
    fetchDesktopVersions()
      .then((data) => {
        if (!mounted) return;
        if (data.versions.length > 0) {
          const latest = data.versions[0];
          setVersion(latest);
          setPlatforms(groupAssetsByPlatform(latest.assets));
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Failed to fetch desktop versions:', err);
        setError(err.message);
      });

    return () => {
      mounted = false;
    };
  }, [initialVersion, initialPlatforms, versionError]);

  // 生成唯一的组件 ID
  const buttonId = useMemo(() => `install-button-${Math.random().toString(36).substring(2, 11)}`, []);

  // 转换平台数据格式
  const platformData = useMemo(() => {
    if (!platforms || platforms.length === 0) return [];
    return convertPlatformGroups(platforms);
  }, [platforms]);

  // 根据用户系统设置默认下载链接
  const currentUrl = useMemo(() => {
    if (platformData.length === 0) {
      return getLink('desktop');
    }

    const userOS = detectOS();
    const userPlatform = platformData.find(p => p.platform === userOS);

    if (userPlatform) {
      // 优先选择推荐版本
      const recommended = userPlatform.options.find(opt => {
        const label = opt.label.toLowerCase();
        if (userOS === 'windows') return label.includes('setup');
        if (userOS === 'macos') return label.includes('arm64');
        if (userOS === 'linux') return label.includes('appimage');
        return false;
      });
      return recommended ? recommended.url : userPlatform.options[0].url;
    }

    return platformData[0].options[0].url;
  }, [platformData]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // ESC 键关闭下拉菜单
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 点击下拉菜单中的链接后关闭菜单
  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  // 如果有错误或没有数据，显示降级链接
  if (error || !version || platformData.length === 0) {
    return (
      <div className={`install-button-wrapper install-button-wrapper--${variant} ${className}`}>
        <div className="split-button-container">
          <a href={getLink('desktop')} className="btn-download-main">
            <svg className="download-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="btn-text">立即安装</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`install-button-wrapper install-button-wrapper--${variant} ${className}`}>
      <div className="split-button-container">
        {/* 主下载按钮 */}
        <a
          href={currentUrl}
          className="btn-download-main"
          aria-label="立即安装 Hagicode Desktop"
        >
          <svg className="download-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="btn-text">立即安装</span>
        </a>

        {/* 下拉切换按钮 */}
        {platformData.length > 0 && (
          <>
            <button
              className="btn-dropdown-toggle"
              type="button"
              aria-expanded={isDropdownOpen}
              aria-controls={`${buttonId}-menu`}
              aria-haspopup="listbox"
              aria-label="选择其他版本"
              onClick={handleToggleDropdown}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </svg>
            </button>

            {/* 下拉菜单 */}
            <ul
              className={`dropdown-menu ${isDropdownOpen ? 'dropdown-menu-open' : ''}`}
              id={`${buttonId}-menu`}
              role="listbox"
              aria-label="选择下载版本"
            >
              {platformData.map((platformGroup) => (
                <li key={platformGroup.platform}>
                  {/* 平台分组标签 */}
                  <div
                    className={`dropdown-group-label platform--${platformGroup.platform}`}
                    role="presentation"
                  >
                    <span className="platform-name">{platformGroup.platformLabel}</span>
                  </div>
                  {platformGroup.options.map((option, idx) => (
                    <li key={idx} role="none">
                      <a
                        href={option.url}
                        className="dropdown-item"
                        role="option"
                        download
                        onClick={handleLinkClick}
                      >
                        <span className="dropdown-item-label">{getAssetTypeLabel(option.assetType)}</span>
                        {option.size && (
                          <span className="dropdown-item-size">{option.size}</span>
                        )}
                      </a>
                    </li>
                  ))}
                </li>
              ))}
              {/* Docker 版本选项 - 带分隔线 */}
              <li role="separator" className="dropdown-separator" />
              <li role="none">
                <a
                  href={getLink('dockerCompose')}
                  className="dropdown-item dropdown-item-docker"
                  role="option"
                  onClick={handleLinkClick}
                >
                  <svg className="docker-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.185.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z"/>
                  </svg>
                  <span className="dropdown-item-label">安装 Docker 版本</span>
                  <svg className="external-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
