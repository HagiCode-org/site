/**
 * Footer 组件 - 三栏高栏布局
 * 首页页脚 - 提供导航链接、版权信息和社交媒体链接
 * 设计系统: 与首页整体风格保持一致 (Glassmorphism + Tech Dark)
 * 使用共享链接库管理所有站点间链接
 */
import { resolveSiteLinks } from '@hagicode/hagilight/site-links';
import { hagicodeCompliance } from '@/config/compliance';
import { getServerTranslation } from '@/i18n/translation-resources';
import { useLocale } from '@/lib/useLocale';
import styles from './Footer.module.css';
import { getLinkWithLocale } from '@/lib/shared/links';
import { getFooterRelatedSites } from '@/lib/footer-site-links';

/**
 * Footer 组件 Props
 */
interface FooterProps {
  /**
   * 额外的 CSS 类名
   */
  className?: string;
  locale?: string;
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
export default function Footer({ className = '', locale: propLocale }: FooterProps) {
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = getServerTranslation(locale);

  const currentYear = new Date().getFullYear();
  const footerData = resolveSiteLinks(locale, {
    siteId: 'hagicode-main',
    relatedSites: getFooterRelatedSites(locale),
    rssFeedUrl: getLinkWithLocale('rss', locale),
    overrides: {
      downloadClient: { href: getLinkWithLocale('desktop', locale) },
      productDocs: { href: getLinkWithLocale('productOverview', locale) },
      blogPosts: { href: getLinkWithLocale('blog', locale) },
      github: { href: getLinkWithLocale('github', locale) },
      discord: { href: getLinkWithLocale('discord', locale) },
      qqGroup: { href: getLinkWithLocale('qqGroup', locale) },
    },
    removeLinks: { quick: ['microsoftStore', 'dockerCompose', 'about'] },
    extraLinks: {
      community: [
        {
          id: 'costCalculator',
          label: t('footer.costCalculator'),
          href: getLinkWithLocale('costCalculator', locale),
          external: true,
        },
        {
          id: 'steam',
          label: t('footer.steam'),
          href: 'https://store.steampowered.com/app/4625540/Hagicode/',
          external: true,
        },
      ],
    },
  });

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
            <h3 className={styles.sectionTitle}>{footerData.labels.relatedSites}</h3>
            <nav className={styles.sectionLinks} aria-label={footerData.labels.navigation.relatedSites}>
              {footerData.relatedSites.map((link) => (
                <a
                  key={link.id}
                  className={styles.sectionLink}
                  href={link.href}
                  target={link.target}
                  rel={link.rel}
                  aria-label={t('footer.visitPage').replace('{title}', link.name)}
                >
                  <span className={styles.sectionLinkText}>{link.name}</span>
                  {link.description ? (
                    <span className={styles.sectionLinkDescription}>{link.description}</span>
                  ) : null}
                </a>
              ))}
            </nav>
          </div>

          {/* 快速链接 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{footerData.labels.quickLinks}</h3>
            <nav className={styles.sectionLinks} aria-label={footerData.labels.navigation.quickLinks}>
              {footerData.quick.map((link) => (
                <a
                  key={link.id}
                  className={styles.sectionLink}
                  href={link.href}
                  target={link.target}
                  rel={link.rel}
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* 社区与支持 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{footerData.labels.community}</h3>
            <nav className={styles.sectionLinks} aria-label={footerData.labels.navigation.community}>
              {footerData.community.map((link) => (
                <a
                  key={link.id}
                  className={styles.sectionLink}
                  href={link.href}
                  target={link.target}
                  rel={link.rel}
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
