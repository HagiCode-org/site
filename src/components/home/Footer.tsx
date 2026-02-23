/**
 * Footer 组件 - 三栏高栏布局
 * 首页页脚 - 提供导航链接、版权信息和社交媒体链接
 * 设计系统: 与首页整体风格保持一致 (Glassmorphism + Tech Dark)
 * 使用共享链接库管理所有站点间链接
 */
import { useMemo } from 'react';
import styles from './Footer.module.css';
import { getLink, getLinkTarget, getLinkRel, ALIYUN_PROMO_LINKS } from '@/lib/shared/links';

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
 * Footer 链接接口
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
 * Footer 区块接口
 */
interface FooterSection {
  /** 区块标题 */
  title: string;
  /** 区块链接列表 */
  links: FooterLink[];
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
 * Hagicode Logo 组件
 */
function HagicodeLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <text x="0" y="24" fontFamily="system-ui" fontSize="20" fontWeight="700" fill="currentColor">
        Hagicode
      </text>
    </svg>
  );
}

/**
 * Footer 组件
 *
 * 三栏高栏布局：产品信息、快速链接、社区与支持
 * 使用共享链接库管理站点间链接
 */
export default function Footer({ className = '' }: FooterProps) {
  // 从共享库获取链接
  const docsLink = getLink('docs');
  const desktopLink = getLink('desktop');
  const githubLink = getLink('github');
  const qqGroupLink = getLink('qqGroup');
  const rssLink = getLink('rss');
  const { aistar } = ALIYUN_PROMO_LINKS;

  // 外部链接属性
  const externalTarget = getLinkTarget('github');
  const externalRel = getLinkRel('github');

  // 定义三栏内容数据结构
  const footerData = useMemo((): {
    productInfo: FooterSection;
    quickLinks: FooterSection;
    community: FooterSection;
  } => ({
    productInfo: {
      title: '产品',
      links: [
        {
          label: 'Hagicode 简介',
          href: docsLink + 'product-overview/',
          external: false,
          ariaLabel: '查看 Hagicode 产品简介',
        },
      ],
    },
    quickLinks: {
      title: '快速链接',
      links: [
        {
          label: '下载客户端',
          href: desktopLink,
          external: false,
          ariaLabel: '下载 Hagicode 桌面客户端',
        },
        {
          label: '产品文档',
          href: docsLink + 'product-overview/',
          external: false,
          ariaLabel: '查看产品文档',
        },
        {
          label: '博客文章',
          href: getLink('blog'),
          external: false,
          ariaLabel: '查看博客文章',
        },
        {
          label: 'RSS 订阅',
          href: rssLink,
          external: false,
          ariaLabel: '订阅博客 RSS 更新',
        },
      ],
    },
    community: {
      title: '社区',
      links: [
        {
          label: 'GitHub',
          href: githubLink,
          external: true,
          ariaLabel: '访问 GitHub 仓库',
        },
        {
          label: '问题反馈',
          href: 'https://github.com/HagiCode-org/site/issues',
          external: true,
          ariaLabel: '提交问题反馈',
        },
        {
          label: '联系邮箱',
          href: 'mailto:support@hagicode.com',
          external: true,
          ariaLabel: '通过邮件联系我们',
        },
        {
          label: 'QQ 群 610394020',
          href: qqGroupLink,
          external: true,
          ariaLabel: '加入 QQ 群',
        },
      ],
    },
  }), []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.container}>
        {/* Logo 和版权行 */}
        <div className={styles.headerRow}>
          <div className={styles.logoWrapper}>
            <HagicodeLogo className={styles.logo} />
            <span className={styles.copyright}>
              © {currentYear} Hagicode. All rights reserved.
            </span>
          </div>
        </div>

        {/* 分隔线 */}
        <div className={styles.divider} />

        {/* 推广链接区域 */}
        <div className={styles.promoSection}>
          <div className={styles.promoCard}>
            <h4 className={styles.promoTitle}>🚀 {aistar.title}</h4>
            <p className={styles.promoDescription}>{aistar.description}</p>
            <a
              href={aistar.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.promoButton}
              aria-label={`访问 ${aistar.title} 页面`}
            >
              {aistar.label}
            </a>
          </div>
        </div>

        {/* 分隔线 */}
        <div className={styles.divider} />

        {/* 三栏布局 */}
        <div className={styles.sections}>
          {/* 产品信息 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{footerData.productInfo.title}</h3>
            <nav className={styles.sectionLinks} aria-label={`${footerData.productInfo.title}链接`}>
              {footerData.productInfo.links.map((link) => (
                <a
                  key={link.href}
                  className={styles.sectionLink}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* 快速链接 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{footerData.quickLinks.title}</h3>
            <nav className={styles.sectionLinks} aria-label={`${footerData.quickLinks.title}链接`}>
              {footerData.quickLinks.links.map((link) => (
                <a
                  key={link.href}
                  className={styles.sectionLink}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* 社区与支持 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{footerData.community.title}</h3>
            <nav className={styles.sectionLinks} aria-label={`${footerData.community.title}链接`}>
              {footerData.community.links.map((link) => (
                <a
                  key={link.href}
                  className={styles.sectionLink}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
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
        <a
          className={styles.icpLink}
          href="http://www.beian.gov.cn/portal/registerSystemInfo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="查看公安备案信息"
        >
          闽公网安备35011102351148号
        </a>
      </div>
    </footer>
  );
}
