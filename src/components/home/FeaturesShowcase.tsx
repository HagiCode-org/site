/**
 * FeaturesShowcase 组件 - 科技感设计风格
 * 展示产品三大特性: 智能、便捷、有趣
 * 设计系统: HUD/Sci-Fi FUI + Glassmorphism
 *
 * 优化要点:
 * - 微交互: hover 状态增强、视觉反馈、平滑过渡
 * - HUD 元素: 角标装饰、扫描线、数据流动画
 * - 主题适配: 亮/暗模式对比度优化
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import styles from './FeaturesShowcase.module.css';

// 定义 Variants 类型
type Variants = {
  [key: string]: {
    [key: string]: any;
  };
};

// Icon props type
interface IconProps {
  className?: string;
}

// SVG Icons
const BrainIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const ZapIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const TrophyIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const TargetIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const FlameIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const AwardIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

// Workflow stage icons
const workflowIcons: Record<string, React.ReactElement> = {
  idea: <ZapIcon className={styles.workflowIcon} />,
  proposal: <TargetIcon className={styles.workflowIcon} />,
  review: <BrainIcon className={styles.workflowIcon} />,
  tasks: <TargetIcon className={styles.workflowIcon} />,
  code: <BrainIcon className={styles.workflowIcon} />,
  test: <TargetIcon className={styles.workflowIcon} />,
  refactor: <BrainIcon className={styles.workflowIcon} />,
  docs: <TargetIcon className={styles.workflowIcon} />,
  archive: <AwardIcon className={styles.workflowIcon} />,
};

/**
 * 智能特性区域 - OpenSpec 工作流
 * 优化: 添加暂停交互、增强视觉反馈、数据流动画
 */
function SmartFeature() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [activeStage, setActiveStage] = useState(0);
  const [efficiencyAnimating, setEfficiencyAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const stages = [
    { id: 'idea', label: 'Idea', desc: t('features.smart.workflow.idea.desc'), icon: '💡' },
    { id: 'proposal', label: 'Proposal', desc: t('features.smart.workflow.proposal.desc'), icon: '📋' },
    { id: 'review', label: 'Review', desc: t('features.smart.workflow.review.desc'), icon: '👁️' },
    { id: 'tasks', label: 'Tasks', desc: t('features.smart.workflow.tasks.desc'), icon: '✂️' },
    { id: 'code', label: 'Code', desc: t('features.smart.workflow.code.desc'), icon: '⌨️' },
    { id: 'test', label: 'Test', desc: t('features.smart.workflow.test.desc'), icon: '🧪' },
    { id: 'refactor', label: 'Refactor', desc: t('features.smart.workflow.refactor.desc'), icon: '🔄' },
    { id: 'docs', label: 'Docs', desc: t('features.smart.workflow.docs.desc'), icon: '📚' },
    { id: 'archive', label: 'Archive', desc: t('features.smart.workflow.archive.desc'), icon: '🏆' },
  ];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setActiveStage((prev) => (prev + 1) % stages.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [stages.length, isPaused]);

  // 容器动画变体
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`${styles.featureZone} ${styles.smart}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* HUD 角标装饰 */}
      <div className={styles.hudCorner} data-position="top-left" />
      <div className={styles.hudCorner} data-position="top-right" />
      <div className={styles.hudCorner} data-position="bottom-left" />
      <div className={styles.hudCorner} data-position="bottom-right" />

      {/* 扫描线效果 */}
      <div className={styles.scanline} />

      <div className={styles.featurePattern} />
      <div className={styles.featureContent}>
        <div className={styles.featureText}>
          <div>
            <span className={styles.featureBadge}>{t('features.smart.badge')}</span>
            <h2 className={styles.featureTitle}>{t('features.smart.title')}</h2>
            <p className={styles.featureSubtitle}>{t('features.smart.subtitle')}</p>
          </div>

          <div className={styles.efficiencyHighlight}>
            <motion.div
              className={styles.efficiencyValue}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={efficiencyAnimating ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
            >
              <span className={styles.efficiencyNumber}>300</span>
              <span className={styles.efficiencyPercent}>%</span>
            </motion.div>
            <div className={styles.efficiencyLabel}>{t('features.smart.efficiency')}</div>
            <div className={styles.efficiencyChart}>
              <motion.div
                className={`${styles.chartBar} ${styles.barShort}`}
                initial={{ height: 0 }}
                animate={efficiencyAnimating ? { height: '30%' } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              >
                <span className={styles.chartLabel}>{t('features.smart.traditional')}</span>
              </motion.div>
              <motion.div
                className={`${styles.chartBar} ${styles.barFull}`}
                initial={{ height: 0 }}
                animate={efficiencyAnimating ? { height: '100%' } : {}}
                transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              >
                <span className={styles.chartLabel}>{t('features.smart.hagicode')}</span>
              </motion.div>
            </div>
          </div>

          <p className={styles.featureDesc}>
            {t('features.smart.description')}
          </p>
        </div>

        <div
          className={styles.workflowAnimation}
        >
          <div className={styles.workflowGrid}>
            {stages.map((stage, index) => (
              <motion.div
                key={stage.id}
                className={`${styles.workflowNode} ${activeStage === index ? styles.active : ''}`}
                animate={{
                  opacity: activeStage === index ? 1 : 0.4,
                  scale: activeStage === index ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => setActiveStage(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.workflowIconWrapper}>
                  {workflowIcons[stage.id] || <ZapIcon className={styles.workflowIcon} />}
                  {activeStage === index && (
                    <motion.div
                      className={styles.iconGlow}
                      layoutId="activeGlow"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span className={styles.workflowLabel}>{stage.label}</span>
                <span className={styles.workflowDesc}>{stage.desc}</span>
                {/* 连接线 */}
                {index < stages.length - 1 && (
                  <div className={styles.nodeConnector} data-active={activeStage >= index ? 'true' : 'false'} />
                )}
              </motion.div>
            ))}
          </div>
          <div className={styles.workflowProgress}>
            <motion.div
              className={styles.progressFill}
              animate={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
          {/* 暂停指示器 */}
          {isPaused && (
            <motion.div
              className={styles.pausedIndicator}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span>{t('features.smart.paused')}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 便捷特性区域 - 多线程操作
 * 优化: 增强线程可视化、添加暂停交互、改进数据对比展示
 */
function ConvenientFeature() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [animateBars, setAnimateBars] = useState(true);

  // 设置为初始状态即为动画完成
  useEffect(() => {
    setAnimateBars(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`${styles.featureZone} ${styles.convenient}`}
    >
      {/* HUD 角标装饰 */}
      <div className={styles.hudCorner} data-position="top-left" />
      <div className={styles.hudCorner} data-position="top-right" />
      <div className={styles.hudCorner} data-position="bottom-left" />
      <div className={styles.hudCorner} data-position="bottom-right" />

      <div className={styles.featurePattern} />
      <div className={styles.featureContent}>
        <div className={styles.featureText}>
          <div>
            <span className={styles.featureBadge}>{t('features.convenient.badge')}</span>
            <h2 className={styles.featureTitle}>{t('features.convenient.title')}</h2>
            <p className={styles.featureSubtitle}>{t('features.convenient.subtitle')}</p>
          </div>

          <div className={styles.quotaComparison}>
            <div className={styles.quotaItem}>
              <div className={styles.quotaBar}>
                <motion.div
                  className={styles.quotaFill}
                  style={{ background: 'linear-gradient(135deg, #666, #999)' }}
                  animate={{ width: animateBars ? '20%' : '0%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                <div className={styles.quotaGlow} />
              </div>
              <span className={styles.quotaLabel}>{t('features.convenient.traditional')}</span>
            </div>
            <div className={styles.quotaArrow}>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
              >
                →
              </motion.span>
            </div>
            <div className={styles.quotaItem}>
              <div className={styles.quotaBar}>
                <motion.div
                  className={styles.quotaFill}
                  style={{ background: 'var(--gradient-primary)' }}
                  animate={{ width: animateBars ? '100%' : '0%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <div className={styles.quotaGlow} />
              </div>
              <span className={styles.quotaLabel}>{t('features.convenient.multiThread')}</span>
            </div>
          </div>

          <motion.div
            className={styles.boostRange}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={animateBars ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className={styles.boostLabel}>{t('features.convenient.boost')}</span>
            <span className={styles.boostValue}>{t('features.convenient.boostValue')}</span>
          </motion.div>

          <p className={styles.featureDesc}>
            {t('features.convenient.description')}
          </p>
        </div>

        <div
          className={styles.threadVisualization}
        >
          <div className={styles.threadContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.thread}>
                <div className={styles.threadTask}>
                  <ZapIcon className={styles.threadIcon} />
                  <span className={styles.threadLabel}>Task {i}</span>
                </div>
                <motion.div
                  className={styles.threadProgress}
                  style={{ background: 'var(--gradient-primary)' }}
                  animate={['20%', '100%', '20%']}
                  transition={{
                    duration: 2 + Math.random() * 0.3,
                    delay: 0.3 * i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className={styles.threadGlow} />
                </motion.div>
              </div>
            ))}
          </div>
          <motion.div
            className={styles.threadLabel}
            animate={{
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className={styles.statusDot} />
            {t('features.convenient.multiThread')}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 有趣特性区域 - 游戏化
 * 优化: 增强成就卡片交互、添加闪烁动画、改进评级展示
 */
function InterestingFeature() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const achievements = [
    { icon: <ZapIcon className="" />, name: t('features.interesting.achievements.firstFlight'), rarity: 'common', glow: 'rgba(156, 163, 175, 0.5)' },
    { icon: <BrainIcon className="" />, name: t('features.interesting.achievements.codeMaster'), rarity: 'rare', glow: 'rgba(59, 130, 246, 0.5)' },
    { icon: <FlameIcon className="" />, name: t('features.interesting.achievements.streak'), rarity: 'epic', glow: 'rgba(168, 85, 247, 0.5)' },
    { icon: <TrophyIcon className="" />, name: t('features.interesting.achievements.legendary'), rarity: 'legendary', glow: 'rgba(245, 158, 11, 0.5)' },
    { icon: <TargetIcon className="" />, name: t('features.interesting.achievements.precision'), rarity: 'epic', glow: 'rgba(168, 85, 247, 0.5)' },
    { icon: <AwardIcon className="" />, name: t('features.interesting.achievements.fullAttendance'), rarity: 'rare', glow: 'rgba(59, 130, 246, 0.5)' },
  ];

  return (
    <motion.div
      className={`${styles.featureZone} ${styles.interesting}`}
    >
      {/* HUD 角标装饰 */}
      <div className={styles.hudCorner} data-position="top-left" />
      <div className={styles.hudCorner} data-position="top-right" />
      <div className={styles.hudCorner} data-position="bottom-left" />
      <div className={styles.hudCorner} data-position="bottom-right" />

      {/* 粒子装饰 */}
      <div className={styles.particleDecoration} />

      <div className={styles.featurePattern} />
      <div className={styles.featureContent}>
        <div className={styles.featureText}>
          <div>
            <span className={styles.featureBadge}>{t('features.interesting.badge')}</span>
            <h2 className={styles.featureTitle}>{t('features.interesting.title')}</h2>
            <p className={styles.featureSubtitle}>{t('features.interesting.subtitle')}</p>
          </div>

          <div className={styles.gameFeatures}>
            {[
              { icon: <TrophyIcon className={styles.gameIcon} />, label: t('features.interesting.features.achievements.label'), desc: t('features.interesting.features.achievements.desc') },
              { icon: <TargetIcon className={styles.gameIcon} />, label: t('features.interesting.features.rating.label'), desc: t('features.interesting.features.rating.desc') },
              { icon: <FlameIcon className={styles.gameIcon} />, label: t('features.interesting.features.gameUI.label'), desc: t('features.interesting.features.gameUI.desc') },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                className={styles.gameFeature}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{ cursor: 'pointer' }}
              >
                {feature.icon}
                <span className={styles.gameLabel}>{feature.label}</span>
                <p className={styles.gameDesc}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <p className={styles.featureDesc}>
            {t('features.interesting.description')}
          </p>
        </div>

        <div
          className={styles.achievementShowcase}
        >
          <div className={styles.achievementGrid}>
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                className={`${styles.achievementCard} ${styles[achievement.rarity]}`}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
                style={{ cursor: 'pointer' }}
              >
                {/* 发光背景 */}
                <motion.div
                  className={styles.achievementGlow}
                  style={{ background: achievement.glow }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className={styles.achievementIcon}>{achievement.icon}</span>
                <span className={styles.achievementName}>{achievement.name}</span>
                <span className={styles.achievementRarity}>{achievement.rarity}</span>
                {/* 稀有度光晕 */}
                <div className={styles.rarityGlow} data-rarity={achievement.rarity} />
              </motion.div>
            ))}
          </div>

          {/* 每日评级卡片 */}
          <div
            className={styles.dailyReport}
          >
            <div className={styles.reportHeader}>
              <span className={styles.reportTitle}>{t('features.interesting.dailyReport.title')}</span>
              <motion.span
                className={`${styles.reportGrade} ${styles.gradeS}`}
                animate={{
                  textShadow: [
                    '0 0 10px rgba(0, 255, 255, 0.3)',
                    '0 0 20px rgba(0, 255, 255, 0.6)',
                    '0 0 10px rgba(0, 255, 255, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                S
              </motion.span>
            </div>
            <div className={styles.reportStats}>
              {[
                { value: '1,234', label: t('features.interesting.dailyReport.stats.tokens'), delay: 0 },
                { value: '12', label: t('features.interesting.dailyReport.stats.achievements'), delay: 0.1 },
                { value: '89%', label: t('features.interesting.dailyReport.stats.efficiency'), delay: 0.2 },
              ].map((stat) => (
                <div
                key={stat.label}
                className={styles.stat}
              >
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
            {/* 级别光效 */}
            <div className={styles.gradeShine} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 主组件: 三大特性展示
 * 优化: 添加头部进入动画、增强视觉层次
 */
export default function FeaturesShowcase({ locale: propLocale }: { locale?: 'zh-CN' | 'en' }) {
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);

  return (
    <section className={styles.featuresShowcase}>
      <div className="container">
        <div className={styles.showcaseHeader}>
          <h2 className={styles.showcaseTitle}>
            <span className={styles.titleHighlight}>{t('features.showcase.title')}</span>
          </h2>
          <p className={styles.showcaseSubtitle}>
            {t('features.showcase.subtitle')}
          </p>
        </div>

        <div className={styles.zonesContainer}>
          <SmartFeature />
          <ConvenientFeature />
          <InterestingFeature />
        </div>
      </div>
    </section>
  );
}
