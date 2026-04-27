/**
 * ActivityMetricsSection 组件
 * 展示活动指标数据
 */
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import styles from './ActivityMetricsSection.module.css';

const STAR_HISTORY_REPO = 'HagiCode-org/site';
const STAR_HISTORY_URL = `https://star-history.com/#${STAR_HISTORY_REPO}&Date`;
const STAR_HISTORY_LIGHT = `https://api.star-history.com/svg?repos=${STAR_HISTORY_REPO}&type=Date`;
const STAR_HISTORY_DARK = `https://api.star-history.com/svg?repos=${STAR_HISTORY_REPO}&type=Date&theme=dark`;

function StarHistoryCard({ locale }: { locale: 'zh-CN' | 'en' }) {
  const content = locale === 'zh-CN'
    ? {
        title: 'GitHub Star 历史',
        value: 'Live',
        description: '实时社区关注曲线',
        alt: 'HagiCode site 仓库的 Star 历史图',
        cta: '查看完整图表',
      }
    : {
        title: 'GitHub Star History',
        value: 'Live',
        description: 'Real-time community momentum',
        alt: 'Star history chart for the HagiCode site repository',
        cta: 'View full chart',
      };

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
          <span className={styles.chartHeaderTitle}>{content.title}</span>
        </div>
        <div className={`${styles.chartCurrentValue} ${styles.starHistoryValue}`}>
          {content.value}
        </div>
      </div>

      <div className={styles.starHistoryCanvasWrap}>
        <img
          className={`${styles.starHistoryImage} ${styles.starHistoryImageLight}`}
          src={STAR_HISTORY_LIGHT}
          alt={content.alt}
          loading="lazy"
        />
        <img
          className={`${styles.starHistoryImage} ${styles.starHistoryImageDark}`}
          src={STAR_HISTORY_DARK}
          alt={content.alt}
          loading="lazy"
        />
      </div>

      <div className={styles.starHistoryFooter}>
        <span className={styles.metricDescription}>{content.description}</span>
        <span className={styles.starHistoryLink}>{content.cta}</span>
      </div>
    </motion.a>
  );
}

/**
 * 主组件: 活动指标数据展示
 */
export default function ActivityMetricsSection({ locale: propLocale }: { locale?: 'zh-CN' | 'en' }) {
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
