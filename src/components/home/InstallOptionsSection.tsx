/**
 * InstallOptionsSection 组件
 * 安装选项展示区域 - 展示桌面应用安装入口
 */
import { motion } from 'framer-motion';
import styles from './InstallOptionsSection.module.css';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import { getLinkWithLocale } from '@/lib/shared/links';
import { WEBSITE_TRACKING_EVENTS } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/tracker';

// 定义选项类型
interface InstallOption {
  id: 'desktop';
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
  ctaLink: string;
  badge?: string;
  popular?: boolean;
}

// Desktop Icon
function DesktopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="10" r="2" fill="currentColor"/>
      <path d="M12 12V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Arrow Right Icon
function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Check Icon
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export default function InstallOptionsSection({ locale: propLocale }: { locale?: string }) {
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);

  const options: InstallOption[] = [
    {
      id: 'desktop',
      title: t('installOptions.desktop.title'),
      description: t('installOptions.desktop.description'),
      icon: <DesktopIcon />,
      features: [
        t('installOptions.desktop.features.0'),
        t('installOptions.desktop.features.1'),
        t('installOptions.desktop.features.2'),
        t('installOptions.desktop.features.3'),
        t('installOptions.desktop.features.4'),
      ],
      ctaText: t('installOptions.desktop.ctaText'),
      ctaLink: getLinkWithLocale('desktop', locale),
      badge: t('installOptions.badge'),
      popular: true,
    },
  ];

  return (
    <section className={styles.installSection}>
      {/* 背景装饰 */}
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />

      <div className="container">
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>{t('installOptions.sectionTitle')}</h2>
          <p className={styles.sectionDescription}>
            {t('installOptions.sectionDescription')}
          </p>
        </motion.div>

        <motion.div
          className={styles.optionsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {options.map((option) => (
            <motion.div
              key={option.id}
              className={`${styles.optionCard} ${option.popular ? styles.optionCardPopular : ''}`}
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              {/* Badge */}
              {option.badge && (
                <div className={styles.badge}>{option.badge}</div>
              )}

              {/* Icon */}
              <div className={styles.optionIcon}>
                {option.icon}
              </div>

              {/* Title & Description */}
              <h3 className={styles.optionTitle}>{option.title}</h3>
              <p className={styles.optionDescription}>{option.description}</p>

              {/* Features */}
              <ul className={styles.featuresList}>
                {option.features.map((feature, index) => (
                  <li key={index}>
                    <span className={styles.checkIcon}>
                      <CheckIcon />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={option.ctaLink}
                className={`${styles.ctaButton} ${option.popular ? styles.ctaButtonPrimary : styles.ctaButtonSecondary}`}
                onClick={() =>
                  trackEvent(WEBSITE_TRACKING_EVENTS.openDesktopPage, {
                    source: `install-options-${option.id}`,
                    url: option.ctaLink,
                  })
                }
              >
                <span>{option.ctaText}</span>
                <ArrowRightIcon />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
