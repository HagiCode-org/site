/**
 * ActivityMetricsSection 组件
 * 展示活动指标数据
 */
import { motion } from 'framer-motion';
import { type SiteLocale } from '@/i18n/locale-metadata';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import styles from './ActivityMetricsSection.module.css';

const STAR_HISTORY_REPO = 'HagiCode-org/site';
const STAR_HISTORY_URL = `https://star-history.com/#${STAR_HISTORY_REPO}&Date`;
const STAR_HISTORY_LIGHT = `https://api.star-history.com/svg?repos=${STAR_HISTORY_REPO}&type=Date`;
const STAR_HISTORY_DARK = `https://api.star-history.com/svg?repos=${STAR_HISTORY_REPO}&type=Date&theme=dark`;

function StarHistoryCard({ locale }: { locale: SiteLocale }) {
  const { t } = useTranslation(locale);

  return (
    <motion.a
      className={`${styles.chartCard} ${styles.starHistoryCard} ${styles.starHistoryRow}`}
      href={STAR_HISTORY_URL}
      target="_blank"
      rel="noreferrer"
      whileHover={{
        translateY: -8,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      <div className={styles.chartHeader}>
        <div className={styles.chartMeta}>
          <span className={styles.chartHeaderIcon}>⭐</span>
          <span className={styles.chartHeaderTitle}>{t('activityMetrics.starHistory.title')}</span>
        </div>
        <div className={`${styles.chartCurrentValue} ${styles.starHistoryValue}`}>
          {t('activityMetrics.starHistory.value')}
        </div>
      </div>

      <div className={styles.starHistoryCanvasWrap}>
        <img
          className={`${styles.starHistoryImage} ${styles.starHistoryImageLight}`}
          src={STAR_HISTORY_LIGHT}
          alt={t('activityMetrics.starHistory.alt')}
          loading="lazy"
        />
        <img
          className={`${styles.starHistoryImage} ${styles.starHistoryImageDark}`}
          src={STAR_HISTORY_DARK}
          alt={t('activityMetrics.starHistory.alt')}
          loading="lazy"
        />
      </div>

      <div className={styles.starHistoryFooter}>
        <span className={styles.metricDescription}>{t('activityMetrics.starHistory.description')}</span>
        <span className={styles.starHistoryLink}>{t('activityMetrics.starHistory.cta')}</span>
      </div>
    </motion.a>
  );
}

/**
 * 主组件: 活动指标数据展示
 */
export default function ActivityMetricsSection({ locale: propLocale }: { locale?: SiteLocale }) {
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);

  return (
    <section className={styles.activityMetricsSection}>
      {/* 动画背景网格 */}
      <div className={styles.bgMesh} />
      <div className={styles.bgGradient} />

      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('activityMetrics.title')}</h2>
          <p className={styles.sectionDescription}>
            {t('activityMetrics.description')}
          </p>
        </div>

        <StarHistoryCard locale={locale} />
      </div>
    </section>
  );
}
