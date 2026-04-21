/**
 * HeroSection 组件
 * 首页 Hero 区域 - 科技感设计风格
 * 设计系统: HUD/Sci-Fi FUI + Glassmorphism
 * 支持农历新年主题
 */
import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import styles from './HeroSection.module.css';
import { WEBSITE_TRACKING_EVENTS } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/tracker';
import { getLinkWithLocale } from '@/lib/shared/links';
import { getBundledSteamStoreLink, loadSteamStoreLink } from '@/lib/shared/steam-store-link';
import HeroWorkflowBoard from './HeroWorkflowBoard';

// 定义主题类型
type Theme = 'light' | 'dark' | 'lunar-new-year' | undefined;

// HeroSection Props
interface HeroSectionProps {
  /** Desktop 版本数据（构建时获取，向后兼容） */
  desktopVersion?: any;
  /** Desktop 平台下载数据（构建时获取，向后兼容） */
  desktopPlatforms?: any;
  /** Desktop 版本获取错误信息（向后兼容） */
  desktopVersionError?: any;
  /** Desktop 渠道数据（向后兼容） */
  desktopChannels?: any;
  /** @deprecated 不再使用 InstallButton，保留这些 props 仅用于向后兼容 */
  [key: string]: any;
  /** Current locale from Astro context */
  locale?: 'zh-CN' | 'en';
}

// Icon props type
interface IconProps {
  className?: string;
}

/**
 * Code/Terminal Icon SVG - 科技感代码图标
 */
function CodeIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 4L10 20" stroke="url(#code-gradient)" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="code-gradient" x1="10" y1="4" x2="14" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-primary, #0080FF)" />
          <stop offset="1" stopColor="var(--color-secondary, #00FFFF)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * CPU/Chip Icon SVG - 处理器图标
 */
function ChipIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="url(#chip-gradient)" strokeWidth="2"/>
      <path d="M9 4V2M15 4V2M9 20V22M15 20V22M4 9H2M4 15H2M20 9H22M20 15H22" stroke="var(--color-primary, #0080FF)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 8V16M8 12H16" stroke="var(--color-secondary, #00FFFF)" strokeWidth="1.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="chip-gradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-primary, #0080FF)" />
          <stop offset="1" stopColor="var(--color-success, #22C55E)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SteamIcon({ className = '' }: IconProps) {
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

export default function HeroSection({
  desktopVersion = null,
  desktopPlatforms = [],
  desktopVersionError = null,
  desktopChannels,
  locale: propLocale
}: HeroSectionProps) {
  const { locale: detectedLocale } = useLocale();
  // Use prop locale if provided, otherwise use detected locale
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);

  const [theme, setTheme] = useState<Theme>(undefined);
  const [steamStoreLink, setSteamStoreLink] = useState(() => getBundledSteamStoreLink());

  // 根据当前 base path 动态生成链接
  const desktopUrl = useMemo(() => getLinkWithLocale('desktop', locale), [locale]);
  const containerUrl = useMemo(() => getLinkWithLocale('container', locale), [locale]);
  const docsUrl = useMemo(() => getLinkWithLocale('productOverview', locale), [locale]);
  const steamLabel = 'Steam';
  const steamAriaLabel = locale === 'en' ? 'Open Hagicode on Steam' : '打开 Hagicode Steam 商店页';
  const ctaGroupLabel = locale === 'en' ? 'Primary homepage actions' : '首页主要操作';

  // 检测主题变化
  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
      setTheme(currentTheme);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

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

  // 新年主题图标渲染
  const renderLogoIcons = () => {
    if (theme === 'lunar-new-year') {
      // 新年主题 - 灯笼和金币
      return (
        <>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lantern-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD54F" />
                <stop offset="100%" stopColor="#FF8F00" />
              </linearGradient>
            </defs>
            {/* 灯笼 */}
            <ellipse cx="12" cy="14" rx="6" ry="7" fill="url(#lantern-gold)" stroke="#FFD54F" strokeWidth="1"/>
            <rect x="9" y="6" width="6" height="2" rx="1" fill="#FFA000"/>
            <rect x="8" y="21" width="8" height="1" fill="#FFA000"/>
            {/* 福 */}
            <text x="12" y="16" textAnchor="middle" fill="#B71C1C" fontSize="6" fontWeight="bold">福</text>
          </svg>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" fill="url(#lantern-gold)" stroke="#FFD54F" strokeWidth="1"/>
            <text x="12" y="14" textAnchor="middle" fill="#B71C1C" fontSize="10" fontWeight="bold">元</text>
          </svg>
        </>
      );
    }
    // 默认科技图标
    return (
      <>
        <CodeIcon />
        <ChipIcon />
      </>
    );
  };

  return (
    <section className={styles.heroSection}>
      {/* 背景装饰 - 科技感网格 */}
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />
      <div className={styles.bgScanlines} />

      {/* 浮动装饰元素 */}
      <div className={styles.floatingElements}>
        <motion.div
          className={styles.techOrb}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className={`${styles.techOrb} ${styles.techOrb2}`}
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* HUD 装饰边框 */}
      <div className={styles.hudTopLeft} />
      <div className={styles.hudTopRight} />
      <div className={styles.hudBottomLeft} />
      <div className={styles.hudBottomRight} />

      <motion.div
        className={styles.heroContent}
      >
        {/* Logo/Icon - 科技感旋转 */}
        <motion.div
          className={styles.heroLogo}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className={styles.logoContainer}>
            {renderLogoIcons()}
          </div>
        </motion.div>

        {/* 主标题 */}
        <motion.h1 className={styles.heroTitle}>
          <span className={styles.titlePrefix}>Hagi</span>
          <span className={styles.titleGradient}>code</span>
        </motion.h1>

        {/* CTA 按钮组 */}
        <motion.div className={styles.heroButtons} role="group" aria-label={ctaGroupLabel}>
          {/* 桌面应用安装按钮 - 主按钮 */}
          <a
            href={desktopUrl}
            className={styles.buttonPrimary}
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
            <span>{t('hero.buttons.desktopApp')}</span>
          </a>

          {/* 容器应用安装按钮 - 次要按钮 */}
          <a
            href={containerUrl}
            className={styles.buttonSecondary}
          >
            <svg className={styles.dockerIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.185.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z"/>
            </svg>
            <span>{t('hero.buttons.containerApp')}</span>
          </a>

          {steamStoreLink.href && (
            <a
              href={steamStoreLink.href}
              className={`${styles.buttonSecondary} ${styles.buttonSteam}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={steamAriaLabel}
              data-steam-entry="site-home-hero"
              onClick={() =>
                trackEvent(WEBSITE_TRACKING_EVENTS.openSteamStore, {
                  source: 'hero-section-steam',
                })
              }
            >
              <SteamIcon className={styles.steamIcon} />
              <span>{steamLabel}</span>
            </a>
          )}

          {/* 了解更多按钮 */}
          <a
            className={styles.buttonSecondary}
            href={docsUrl}
          >
            <span className={styles.buttonText}>{t('hero.buttons.learnMore')}</span>
          </a>
        </motion.div>

        <HeroWorkflowBoard locale={locale} />
      </motion.div>
    </section>
  );
}
