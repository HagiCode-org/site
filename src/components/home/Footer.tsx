/**
 * Footer 组件
 * 首页页脚 - 提供导航链接、版权信息和社交媒体链接
 * 设计系统: 与首页整体风格保持一致 (Glassmorphism + Tech Dark)
 */
import { useMemo } from 'react';
import styles from './Footer.module.css';
import { withBasePath } from '../../utils/path';

/**
 * Footer 组件 Props
 */
interface FooterProps {
  /**
   * 额外的 CSS 类名
   */
  className?: string;
}

/**
 * 链接配置接口
 */
interface FooterLink {
  /** 链接显示文字 */
  label: string;
  /** 链接目标 URL */
  href: string;
  /** 是否外部链接 */
  external?: boolean;
  /** ARIA 标签 */
  ariaLabel?: string;
}

/**
 * GitHub 图标组件
 */
function GitHubIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

/**
 * Footer 组件
 *
 * 提供网站核心区域的快速导航链接、版权信息和社交媒体链接
 */
export default function Footer({ className = '' }: FooterProps) {
  // 根据当前 base path 动态生成链接
  const links = useMemo((): FooterLink[] => [
    {
      label: '文档',
      href: withBasePath('/product-overview'),
      external: false,
      ariaLabel: '查看文档',
    },
    {
      label: '博客',
      href: withBasePath('/blog'),
      external: false,
      ariaLabel: '查看博客',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/HagiCode-org/site',
      external: true,
      ariaLabel: '访问 GitHub 仓库',
    },
  ], []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.content}>
        {/* 版权区块 */}
        <div className={styles.copyrightSection}>
          <p className={styles.copyrightText}>
            © {currentYear} Hagicode. All rights reserved.
          </p>
        </div>

        {/* 链接区块 */}
        <nav className={styles.linksSection} aria-label="页脚导航">
          {links.map((link) => (
            <a
              key={link.href}
              className={styles.link}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              aria-label={link.ariaLabel}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* 社交区块 */}
        <div className={styles.socialSection}>
          <a
            className={styles.socialLink}
            href="https://github.com/HagiCode-org/site"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="在 GitHub 上查看我们"
          >
            <GitHubIcon className={styles.socialIcon} />
          </a>
        </div>
      </div>

      {/* 备案信息区块 - 独立一行，居中显示 */}
      <div className={styles.icpSection}>
        <a
          className={styles.icpLink}
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="查看 ICP 备案信息"
        >
          闽ICP备2026004153号-1
        </a>
      </div>
    </footer>
  );
}
