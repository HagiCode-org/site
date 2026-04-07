/**
 * Footer 组件 - 三栏高栏布局
 * 首页页脚 - 提供导航链接、版权信息和社交媒体链接
 * 设计系统: 与首页整体风格保持一致 (Glassmorphism + Tech Dark)
 * 使用共享链接库管理所有站点间链接
 */
import { useMemo } from 'react';
import { hagicodeCompliance } from '@/config/compliance';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import styles from './Footer.module.css';
import { getLinkWithLocale } from '@/lib/shared/links';
import { resolveSiteFooterCatalogLinks } from '@/lib/footer-site-links';

/**
 * Footer 组件 Props
 */
interface FooterProps {
  /**
   * 额外的 CSS 类名
   */
  className?: string;
  locale?: 'zh-CN' | 'en';
}

/**
 * Footer 链接接口
 */
interface FooterLink {
  /** 链接显示文字 */
  label: string;
  /** 链接简介 */
  description?: string;
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
export default function Footer({ className = '', locale: propLocale }: FooterProps & { locale?: 'zh-CN' | 'en' }) {
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);

  const desktopLink = getLinkWithLocale('desktop', locale);
  const githubLink = getLinkWithLocale('github', locale);
  const qqGroupLink = getLinkWithLocale('qqGroup', locale);
  const costCalculatorLink = getLinkWithLocale('costCalculator', locale);
  const discordLink = getLinkWithLocale('discord', locale);
  const rssLink = getLinkWithLocale('rss', locale);
  const productOverviewLink = getLinkWithLocale('productOverview', locale);

  const currentYear = new Date().getFullYear();

  // 定义三栏内容数据结构
  const footerData = useMemo((): {
    relatedSites: FooterSection;
    quickLinks: FooterSection;
    community: FooterSection;
  } => {
    const communityLinks: FooterLink[] = [
      {
        label: t('footer.github'),
        href: githubLink,
        external: true,
        ariaLabel: t('footer.github'),
      },
      {
        label: t('footer.discord'),
        href: discordLink,
        external: true,
        ariaLabel: t('footer.discord'),
      },
      {
        label: t('footer.issueFeedback'),
        href: 'https://github.com/HagiCode-org/site/issues',
        external: true,
        ariaLabel: t('footer.issueFeedback'),
      },
      {
        label: t('footer.contactEmail'),
        href: 'mailto:support@hagicode.com',
        external: true,
        ariaLabel: t('footer.contactEmail'),
      },
      {
        label: t('footer.qqGroup'),
        href: qqGroupLink,
        external: true,
        ariaLabel: t('footer.qqGroup'),
      },
      {
        label: t('footer.costCalculator'),
        href: costCalculatorLink,
        external: true,
        ariaLabel: t('footer.costCalculator'),
      },
    ];

    const relatedSiteLinks: FooterLink[] = resolveSiteFooterCatalogLinks({
      localLinks: communityLinks.map((link) => ({ href: link.href })),
    }).map((link) => ({
      label: link.title,
      description: link.description,
      href: link.href,
      external: true,
      ariaLabel: t('footer.visitPage').replace('{title}', link.title),
    }));

    return {
      relatedSites: {
        title: locale === 'en' ? 'Related Sites' : '生态站点',
        links: relatedSiteLinks,
      },
      quickLinks: {
      title: t('footer.quickLinks'),
      links: [
        {
          label: t('footer.downloadClient'),
          href: desktopLink,
          external: false,
          ariaLabel: t('footer.downloadClient'),
        },
        {
          label: t('footer.productDocs'),
          href: productOverviewLink,
          external: false,
          ariaLabel: t('footer.productDocs'),
        },
        {
          label: t('footer.blogPosts'),
          href: getLinkWithLocale('blog', locale),
          external: false,
          ariaLabel: t('footer.blogPosts'),
        },
        {
          label: t('footer.rssSubscribe'),
          href: rssLink,
          external: false,
          ariaLabel: t('footer.rssSubscribe'),
        },
      ],
    },
    community: {
      title: t('footer.community'),
      links: communityLinks,
    },
  };
  }, [t, desktopLink, githubLink, discordLink, productOverviewLink, rssLink, qqGroupLink, costCalculatorLink, locale]);

  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.container}>
        {/* Logo 和版权行 */}
        <div className={styles.headerRow}>
          <div className={styles.logoWrapper}>
            <HagicodeLogo className={styles.logo} />
            <span className={styles.copyright}>
              {t('footer.copyright').replace('{year}', currentYear.toString())}
            </span>
          </div>
        </div>

        {/* 分隔线 */}
        <div className={styles.divider} />

        {/* 三栏布局 */}
        <div className={styles.sections}>
          {/* 产品信息 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{footerData.relatedSites.title}</h3>
            <nav className={styles.sectionLinks} aria-label={`${footerData.relatedSites.title}链接`}>
              {footerData.relatedSites.links.map((link) => (
                <a
                  key={link.href}
                  className={styles.sectionLink}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-label={link.ariaLabel}
                >
                  <span className={styles.sectionLinkText}>{link.label}</span>
                  {link.description ? (
                    <span className={styles.sectionLinkDescription}>{link.description}</span>
                  ) : null}
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
          href={hagicodeCompliance.icp.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('footer.icpLabel')}
        >
          {hagicodeCompliance.icp.label}
        </a>
        <a
          className={styles.icpLink}
          href={hagicodeCompliance.publicSecurity.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('footer.gonganLabel')}
        >
          {hagicodeCompliance.publicSecurity.label}
        </a>
      </div>
    </footer>
  );
}
