/**
 * InstallButton 组件 - 全局统一安装按钮 (React 版本)
 * 支持自动平台检测、下拉菜单选择版本、Docker 版本跳转
 * 可用于 Header（紧凑模式）和 Hero 区域（完整模式）
 */
import { useState, useEffect, useMemo } from 'react';
import styles from './InstallButton.module.css';
import { withBasePath } from '@/utils/path';

interface DownloadOption {
  label: string;
  url: string;
  size?: string;
}

interface PlatformDownloads {
  platform: 'windows' | 'macos' | 'linux';
  platformLabel: string;
  options: DownloadOption[];
}

interface InstallButtonProps {
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
}

// 平台检测函数
function detectOS(): 'windows' | 'macos' | 'linux' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';

  // 优先检查 URL 查询参数
  const urlParams = new URLSearchParams(window.location.search);
  const osParam = urlParams.get('os');
  if (osParam) {
    const validOS = ['windows', 'macos', 'linux'];
    const normalizedParam = osParam.toLowerCase();
    if (validOS.includes(normalizedParam)) {
      return normalizedParam as 'windows' | 'macos' | 'linux';
    }
  }

  // 基于 UserAgent 检测
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) {
    return 'windows';
  }
  if (userAgent.includes('Mac') || userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('Mac OS')) {
    return 'macos';
  }
  if (userAgent.includes('Linux')) {
    return 'linux';
  }
  return 'unknown';
}

// 获取资源类型标签
function getAssetTypeLabel(filename: string): string {
  const name = filename.toLowerCase();

  if (name.includes('setup') && name.endsWith('.exe')) return '安装程序';
  if (name.endsWith('.exe')) return '便携版';
  if (name.endsWith('.appx')) return 'Microsoft Store';
  if (name.includes('arm64') && name.endsWith('.dmg')) return 'Apple Silicon';
  if (name.endsWith('.dmg')) return 'Intel 版';
  if (name.endsWith('.appimage')) return 'AppImage';
  if (name.includes('_amd64.deb')) return 'Debian 包';
  if (name.includes('.tar.gz')) return '压缩包';

  return filename;
}

export default function InstallButton({
  variant = 'full',
  showDropdown = true,
  className = ''
}: InstallButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [platformData, setPlatformData] = useState<PlatformDownloads[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>(withBasePath('/desktop'));
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 生成唯一的组件 ID
  const buttonId = useMemo(() => `install-button-${Math.random().toString(36).substring(2, 11)}`, []);

  // 获取版本数据
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch('https://desktop.dl.hagicode.com/index.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const latest = data.versions?.[0];

        if (latest?.assets) {
          // 按平台分组
          const platformGroups = new Map<string, DownloadOption[]>();

          for (const asset of latest.assets) {
            const name = asset.name.toLowerCase();
            let platform: 'windows' | 'macos' | 'linux' | null = null;

            if (name.includes('.exe') || name.includes('.appx')) {
              platform = 'windows';
            } else if (name.includes('.dmg') || name.includes('-mac.zip')) {
              platform = 'macos';
            } else if (name.includes('.appimage') || name.includes('.deb') || name.includes('.tar.gz')) {
              platform = 'linux';
            }

            if (platform) {
              if (!platformGroups.has(platform)) {
                platformGroups.set(platform, []);
              }

              const sizeBytes = asset.size || 0;
              const sizeGB = sizeBytes / (1024 * 1024 * 1024);
              const sizeMB = sizeBytes / (1024 * 1024);
              const size = sizeGB >= 1 ? `${sizeGB.toFixed(1)} GB` : `${sizeMB.toFixed(0)} MB`;

              platformGroups.get(platform)!.push({
                label: asset.name,
                url: `https://desktop.dl.hagicode.com/${asset.path}`,
                size
              });
            }
          }

          // 转换为数组并排序
          const platforms: PlatformDownloads[] = [];
          const platformOrder: ('windows' | 'macos' | 'linux')[] = ['windows', 'macos', 'linux'];
          const platformLabels = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };

          for (const platform of platformOrder) {
            const downloads = platformGroups.get(platform);
            if (downloads && downloads.length > 0) {
              platforms.push({
                platform,
                platformLabel: platformLabels[platform],
                options: downloads
              });
            }
          }

          setPlatformData(platforms);

          // 根据用户系统设置默认下载链接
          const userOS = detectOS();
          const userPlatform = platforms.find(p => p.platform === userOS);
          if (userPlatform) {
            // 优先选择推荐版本
            const recommended = userPlatform.options.find(opt => {
              const label = opt.label.toLowerCase();
              if (userOS === 'windows') return label.includes('setup');
              if (userOS === 'macos') return label.includes('arm64');
              if (userOS === 'linux') return label.includes('appimage');
              return false;
            });
            setCurrentUrl(recommended ? recommended.url : userPlatform.options[0].url);
          } else if (platforms.length > 0) {
            setCurrentUrl(platforms[0].options[0].url);
          }
        }
      } catch (e) {
        console.error('Failed to fetch desktop versions:', e);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersions();
  }, []);

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

  if (isLoading) {
    return (
      <div className={`${styles.installButtonWrapper} ${styles[`installButtonWrapper--${variant}`]} ${className}`}>
        <div className={styles.splitButtonContainer}>
          <a className={styles.btnDownloadMain} style={{ opacity: 0.7 }}>
            <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.btnText}>加载中...</span>
          </a>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`${styles.installButtonWrapper} ${styles[`installButtonWrapper--${variant}`]} ${className}`}>
        <div className={styles.splitButtonContainer}>
          <a href={withBasePath('/desktop')} className={styles.btnDownloadMain}>
            <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.btnText}>立即安装</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.installButtonWrapper} ${styles[`installButtonWrapper--${variant}`]} ${className}`}>
      <div className={styles.splitButtonContainer}>
        {/* 主下载按钮 */}
        <a
          href={currentUrl}
          className={styles.btnDownloadMain}
          aria-label="立即安装 Hagicode Desktop"
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
          <span className={styles.btnText}>立即安装</span>
        </a>

        {/* 下拉切换按钮 */}
        {showDropdown && platformData.length > 0 && (
          <>
            <button
              className={styles.btnDropdownToggle}
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
              className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.dropdownMenuOpen : ''}`}
              id={`${buttonId}-menu`}
              role="listbox"
              aria-label="选择下载版本"
            >
              {platformData.map((platformGroup) => (
                <li key={platformGroup.platform}>
                  {/* 平台分组标签 */}
                  <div
                    className={`${styles.dropdownGroupLabel} ${styles[`platform--${platformGroup.platform}`]}`}
                    role="presentation"
                  >
                    <span className={styles.platformName}>{platformGroup.platformLabel}</span>
                  </div>
                  {platformGroup.options.map((option, idx) => (
                    <li key={idx} role="none">
                      <a
                        href={option.url}
                        className={styles.dropdownItem}
                        role="option"
                        download
                        onClick={handleLinkClick}
                      >
                        <span className={styles.dropdownItemLabel}>{getAssetTypeLabel(option.label)}</span>
                        {option.size && (
                          <span className={styles.dropdownItemSize}>{option.size}</span>
                        )}
                      </a>
                    </li>
                  ))}
                </li>
              ))}
              {/* Docker 版本选项 - 带分隔线 */}
              <li role="separator" className={styles.dropdownSeparator} />
              <li role="none">
                <a
                  href={withBasePath('/installation/docker-compose')}
                  className={`${styles.dropdownItem} ${styles.dropdownItemDocker}`}
                  role="option"
                  onClick={handleLinkClick}
                >
                  <svg className={styles.dockerIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.185.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z"/>
                  </svg>
                  <span className={styles.dropdownItemLabel}>安装 Docker 版本</span>
                  <svg className={styles.externalIcon} viewBox="0 0 24 24" fill="none">
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
