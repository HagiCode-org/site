/**
 * HeroSection 组件
 * 首页 Hero 区域 - 科技感设计风格
 * 设计系统: HUD/Sci-Fi FUI + Glassmorphism
 * 支持农历新年主题
 */
import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import styles from './HeroSection.module.css';
import { withBasePath } from '../../utils/path';
import InstallButton from './InstallButton';
import type { DesktopVersion, PlatformGroup } from '@/types/desktop';

// 定义 Variants 类型
type Variants = {
  [key: string]: {
    [key: string]: any;
  };
};

// 定义主题类型
type Theme = 'light' | 'dark' | 'lunar-new-year' | undefined;

// HeroSection Props
interface HeroSectionProps {
  /** Desktop 版本数据（构建时获取） */
  desktopVersion?: DesktopVersion | null;
  /** Desktop 平台下载数据（构建时获取） */
  desktopPlatforms?: PlatformGroup[];
  /** Desktop 版本获取错误信息 */
  desktopVersionError?: string | null;
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

/**
 * ArrowRight Icon SVG
 */
function ArrowRightIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12H19" />
      <path d="M12 5L19 12L12 19" />
    </svg>
  );
}

/**
 * External Link Icon SVG
 */
function ExternalLinkIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" />
      <path d="M15 3H21V9" />
      <path d="M10 14L21 3" />
    </svg>
  );
}

/**
 * Users Icon SVG
 */
function UsersIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21V19C22.9993 17.1784 21.7658 15.5499 19.98 14.89" />
      <path d="M16 3.13C17.7898 3.79003 19.0263 5.41998 19.0263 7.24C19.0263 9.06002 17.7898 10.69 16 11.35" />
    </svg>
  );
}

// 普通主题打字机效果的标语
const normalTaglines = [
  '智能 · 便捷 · 有趣',
  'AI 驱动 · 效率倍增',
  'OpenSpec · 工作流革新',
  '多线程 · 会话管理',
];

// 农历新年主题标语
const lunarNewYearTaglines = [
  '新春快乐 · 马年大吉',
  'AI 赋能 · 码到成功',
  '智能编码 · 万事如意',
  'OpenSpec · 财源滚滚',
  '效率倍增 · 恭喜发财',
];

// 动画变体
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function HeroSection({
  desktopVersion = null,
  desktopPlatforms = [],
  desktopVersionError = null
}: HeroSectionProps) {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState<Theme>(undefined);

  // 根据当前 base path 动态生成链接
  const installUrl = useMemo(() => withBasePath('/installation/docker-compose'), []);
  const docsUrl = useMemo(() => withBasePath('/product-overview'), []);

  // 根据主题选择标语数组
  const taglines = theme === 'lunar-new-year' ? lunarNewYearTaglines : normalTaglines;

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

  // 重置打字机状态当主题切换时
  useEffect(() => {
    setCurrentTagline(0);
    setDisplayText('');
    setIsDeleting(false);
  }, [theme]);

  // 打字机效果
  useEffect(() => {
    const currentText = taglines[currentTagline];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentTagline((prev) => (prev + 1) % taglines.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTagline, taglines]);

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

        {/* 打字机效果副标题 */}
        <motion.p className={styles.heroTagline}>
          <span className={styles.taglineText}>{displayText}</span>
          <span className={styles.cursor} />
        </motion.p>

        {/* 描述 */}
        <motion.p className={styles.heroDescription}>
          用 AI 重新定义代码开发体验。
          <span className={styles.highlight}>OpenSpec 工作流</span>、
          <span className={styles.highlight}>多线程会话管理</span>、
          <span className={styles.highlight}>成就系统</span>，
          让编码更高效、更有趣。
        </motion.p>

        {/* CTA 按钮组 */}
        <motion.div className={styles.heroButtons}>
          <InstallButton
            variant="full"
            version={desktopVersion}
            platforms={desktopPlatforms}
            versionError={desktopVersionError}
          />
          <a
            className={styles.buttonSecondary}
            href={docsUrl}
          >
            <span className={styles.buttonText}>了解更多</span>
          </a>
        </motion.div>

        {/* 技术栈标签 */}
        <motion.div className={styles.techStack}>
          <span className={styles.techLabel}>Powered by</span>
          <span className={styles.techTag}>Claude AI</span>
          <span className={styles.techTag}>OpenSpec</span>
          <span className={styles.techTag}>GLM Pro</span>
        </motion.div>

        {/* QQ 群卡片 - 玻璃态设计 */}
        <motion.div
          className={styles.qqGroupCard}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.cardGlow} />
          <div className={styles.qqGroupIcon}>
            <UsersIcon />
          </div>
          <h3 className={styles.qqGroupTitle}>加入技术支持群组</h3>
          <p className={styles.qqGroupDescription}>
            Hagicode 技术支持 QQ 群
            <span className={styles.groupNumber}>610394020</span>
          </p>
          <a
            href="https://qm.qq.com/q/Wk6twXHdyS"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.buttonSmall}
          >
            <span>立即加入</span>
            <ExternalLinkIcon />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
