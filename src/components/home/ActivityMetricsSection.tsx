/**
 * ActivityMetricsSection 组件
 * 展示活动指标数据 (Docker Hub 拉取量、Clarity 活跃用户等)
 */
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { withBasePath } from '../../utils/path';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import styles from './ActivityMetricsSection.module.css';
import ActivityMetricsChart, { type HistoryEntry } from './ActivityMetricsChart';

interface ActivityMetricsData {
  lastUpdated: string;
  dockerHub: {
    pullCount: number;
    repository: string;
  };
  clarity: {
    activeUsers: number;
    activeSessions: number;
    dateRange: string;
  };
  history?: HistoryEntry[];
}

type TimeRange = 7 | 30 | 90;

interface ActivityMetricCardProps {
  icon: string;
  title: string;
  value: number | string;
  description: string;
  gradient: string;
  index: number;
  isLoading: boolean;
  locale: 'zh-CN' | 'en';
}

/**
 * 数字滚动动画组件
 */
function CountUp({
  value,
  duration = 1.5,
  locale,
}: {
  value: number;
  duration?: number;
  locale: 'zh-CN' | 'en';
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated && value > 0) {
      setHasAnimated(true);
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);

        // 缓动函数实现平滑动画
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.floor(easeOutQuart * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [hasAnimated, value, duration]);

  const formatValue = (val: number): string => {
    return new Intl.NumberFormat(locale === 'zh-CN' ? 'zh-CN' : 'en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(val);
  };

  return <span>{formatValue(displayValue)}</span>;
}

/**
 * 骨架屏加载器
 */
function MetricCardSkeleton() {
  return (
    <div className={`${styles.metricCard} ${styles.skeleton}`}>
      <div className={styles.skeletonIcon} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonValue} />
      <div className={styles.skeletonDescription} />
    </div>
  );
}

/**
 * 空状态展示
 */
function EmptyState({ locale }: { locale: 'zh-CN' | 'en' }) {
  const { t } = useTranslation(locale);

  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>📊</div>
      <h3 className={styles.emptyTitle}>{t('activityMetrics.emptyState.title')}</h3>
      <p className={styles.emptyDescription}>
        {t('activityMetrics.emptyState.description')}
      </p>
      <motion.div
        className={styles.pulseIndicator}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

/**
 * 单个指标卡片组件
 */
function ActivityMetricCard({
  icon,
  title,
  value,
  description,
  gradient,
  index,
  isLoading,
  locale,
}: ActivityMetricCardProps) {
  if (isLoading) {
    return <MetricCardSkeleton />;
  }

  const getValue = (): number | string => {
    if (typeof value === 'string') return value;
    if (value === 0) return '--';
    return value;
  };

  return (
    <motion.div
      className={styles.metricCard}
      style={{ '--card-gradient': gradient } as React.CSSProperties}
      whileHover={{
        translateY: -8,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      {/* 渐变边框 */}
      <div className={styles.cardBorder} />

      {/* 玻璃态效果覆盖层 */}
      <div className={styles.glassOverlay} />

      {/* 悬停时的闪光效果 */}
      <div className={styles.shimmer} />

      <div className={styles.cardContent}>
        {/* 带浮动动画的图标 */}
        <motion.div
          className={styles.metricIcon}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.2,
          }}
        >
          {icon}
        </motion.div>

        <h3 className={styles.metricTitle}>{title}</h3>

        <div className={styles.metricValue}>
          {typeof value === 'number' && value > 0 ? (
            <CountUp value={value} locale={locale} />
          ) : (
            getValue()
          )}
        </div>

        <p className={styles.metricDescription}>{description}</p>
      </div>

      {/* 装饰性粒子 */}
      <div className={styles.particles}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            initial={{
              x: '50%',
              y: '50%',
              opacity: 0,
            }}
            animate={{
              x: ['50%', `${50 + (Math.random() - 0.5) * 100}%`],
              y: ['50%', `${50 + (Math.random() - 0.5) * 100}%`],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * 主组件: 活动指标数据展示
 */
export default function ActivityMetricsSection({ locale: propLocale }: { locale?: 'zh-CN' | 'en' }) {
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);
  const [data, setData] = useState<ActivityMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(7);

  useEffect(() => {
    // 从 public 目录加载数据
    fetch(withBasePath('/activity-metrics.json'))
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load activity metrics');
        }
        return res.json();
      })
      .then((jsonData: ActivityMetricsData) => {
        setData(jsonData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading activity metrics:', err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  // 根据时间范围过滤历史数据
  const filteredHistory = useMemo(() => {
    if (!data?.history) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);

    return data.history.filter((entry) => new Date(entry.date) >= cutoffDate);
  }, [data?.history, timeRange]);

  // 时间范围选择器
  const TimeRangeSelector = () => (
    <div className={styles.timeRangeSelector}>
      {([7, 30, 90] as TimeRange[]).map((days) => (
        <button
          key={days}
          className={`${styles.timeRangeButton} ${timeRange === days ? styles.active : ''}`}
          onClick={() => setTimeRange(days)}
        >
          {locale === 'en' ? `${days}d` : `${days}天`}
        </button>
      ))}
    </div>
  );

  // 错误状态
  if (error) {
    return (
      <section className={styles.activityMetricsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t('activityMetrics.title')}</h2>
          </div>
          <EmptyState locale={locale} />
        </div>
      </section>
    );
  }

  // 默认占位数据
  const defaultData: ActivityMetricsData = {
    lastUpdated: new Date().toISOString(),
    dockerHub: {
      pullCount: 0,
      repository: 'newbe36524/hagicode',
    },
    clarity: {
      activeUsers: 0,
      activeSessions: 0,
      dateRange: '3Days',
    },
  };

  const currentData = data || defaultData;
  const hasRealData =
    currentData.dockerHub.pullCount > 0 ||
    currentData.clarity.activeUsers > 0 ||
    currentData.clarity.activeSessions > 0;

  const metrics: ActivityMetricCardProps[] = [
    {
      icon: '🐳',
      title: t('activityMetrics.dockerHub'),
      value: currentData.dockerHub.pullCount,
      description: t('activityMetrics.pullCount'),
      gradient: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
      index: 0,
      isLoading,
      locale,
    },
    {
      icon: '👥',
      title: t('activityMetrics.activeUsers'),
      value: currentData.clarity.activeUsers,
      description: t('activityMetrics.recentDays'),
      gradient: 'linear-gradient(135deg, #FF6B6B, #6C5CE7)',
      index: 1,
      isLoading,
      locale,
    },
    {
      icon: '💬',
      title: t('activityMetrics.activeSessions'),
      value: currentData.clarity.activeSessions,
      description: t('activityMetrics.recentDays'),
      gradient: 'linear-gradient(135deg, #A29BFE, #FD79A8)',
      index: 2,
      isLoading,
      locale,
    },
  ];

  // 定义图表配置
  const chartConfigs = [
    {
      type: 'area' as const,
      title: t('activityMetrics.dockerHub'),
      currentValue: currentData.dockerHub.pullCount,
      icon: '🐳',
      color: '#4ECDC4',
      dataKey: 'dockerHub' as const,
      valueKey: 'pullCount' as const,
    },
    {
      type: 'line' as const,
      title: t('activityMetrics.activeUsers'),
      currentValue: currentData.clarity.activeUsers,
      icon: '👥',
      color: '#6C5CE7',
      dataKey: 'clarity' as const,
      valueKey: 'activeUsers' as const,
    },
    {
      type: 'line' as const,
      title: t('activityMetrics.activeSessions'),
      currentValue: currentData.clarity.activeSessions,
      icon: '💬',
      color: '#FD79A8',
      dataKey: 'clarity' as const,
      valueKey: 'activeSessions' as const,
    },
  ];

  // 检查是否有历史数据
  const hasHistoryData = data?.history && data.history.length > 0;

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

        {/* 时间范围选择器 */}
        {hasHistoryData && !isLoading && (
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <TimeRangeSelector />
          </div>
        )}

        <div className={styles.metricsGrid}>
          <AnimatePresence mode="wait">
            {!hasRealData && !isLoading ? (
              <EmptyState locale={locale} />
            ) : isLoading ? (
              // 加载状态显示骨架屏
              [...Array(3)].map((_, i) => (
                <MetricCardSkeleton key={i} />
              ))
            ) : hasHistoryData ? (
              // 显示图表
              chartConfigs.map((config, index) => (
                <ActivityMetricsChart
                  key={config.title}
                  type={config.type}
                  data={filteredHistory}
                  title={config.title}
                  currentValue={config.currentValue}
                  icon={config.icon}
                  color={config.color}
                  dataKey={config.dataKey}
                  valueKey={config.valueKey}
                />
              ))
            ) : (
              // 没有历史数据时显示静态卡片（向后兼容）
              metrics.map((metric) => (
                <ActivityMetricCard key={metric.title} {...metric} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
