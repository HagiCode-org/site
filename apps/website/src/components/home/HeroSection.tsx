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
import { getLink } from '@shared/links';

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
  desktopVersionError = null,
  desktopChannels
}: HeroSectionProps) {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState<Theme>(undefined);

  // 根据当前 base path 动态生成链接
  const installUrl = useMemo(() => getLink('dockerCompose'), []);
  const docsUrl = useMemo(() => getLink('productOverview'), []);

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

        {/* 增强的描述 - 问题-解决方案-收益框架 */}
        <motion.p className={styles.heroDescription}>
            传统 AI 编码工具的<span className={styles.highlight}>痛点</span>：
            上下文受限、会话混乱、缺乏协作。
        </motion.p>

        <motion.p className={styles.heroDescriptionSecondary}>
          <span className={styles.highlightPrimary}>Hagicode</span> 用
          <span className={styles.highlight}>OpenSpec 工作流</span>、
          <span className={styles.highlight}>多线程会话管理</span>、
          <span className={styles.highlight}>成就系统</span>
          重新定义 AI 编码体验。
        </motion.p>

        {/* 核心价值卡片 */}
        <motion.div className={styles.valueCards} variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className={styles.valueCard} variants={itemVariants}>
            <div className={styles.valueIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.valueContent}>
              <h4>效率提升 300%</h4>
              <p>多线程并发处理</p>
            </div>
          </motion.div>
          <motion.div className={styles.valueCard} variants={itemVariants}>
            <div className={styles.valueIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.valueContent}>
              <h4>数据隐私保障</h4>
              <p>完全本地化部署</p>
            </div>
          </motion.div>
          <motion.div className={styles.valueCard} variants={itemVariants}>
            <div className={styles.valueIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21V19a2 2 0 00-2-2H5a2 2 0 00-2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a2 2 0 00-2-2-3-3 0 01-3-3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.valueContent}>
              <h4>团队协作</h4>
              <p>OpenSpec 标准化流程</p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA 按钮组 */}
        <motion.div className={styles.heroButtons}>
          {/* 桌面应用安装按钮 - 主按钮 */}
          <a
            href={withBasePath('/desktop')}
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
            <span>立即安装桌面应用</span>
          </a>

          {/* 容器应用安装按钮 - 次要按钮 */}
          <a
            href={withBasePath('/container')}
            className={styles.buttonSecondary}
          >
            <svg className={styles.dockerIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.185.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z"/>
            </svg>
            <span>立即安装容器应用</span>
          </a>

          {/* 了解更多按钮 */}
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
