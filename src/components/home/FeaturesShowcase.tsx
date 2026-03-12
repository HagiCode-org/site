/**
 * FeaturesShowcase 组件 - 科技感设计风格
 * 展示产品三大特性: 智能、高效、有趣
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

interface CliIconProps {
  providerKey: string;
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

type GalleryAsset = {
  src: string;
  label: string;
};

const humanizeGalleryLabel = (fileName: string) => fileName
  .replace(/\.(webp|png|jpe?g)$/i, '')
  .split('-')
  .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
  .join(' ');

const buildGalleryAssets = (group: 'dungeons' | 'heroes', files: string[]): GalleryAsset[] => (
  files.map((file) => ({
    src: `/img/home/interesting/${group}/${file}`,
    label: humanizeGalleryLabel(file),
  }))
);

const interestingDungeonGallery = buildGalleryAssets('dungeons', [
  'docs-editorial-still-life.webp',
  'proposal-ff-futurist-poster.webp',
  'annotation-notebook-scrapbook.webp',
  'proposal-name-badge-forge.webp',
  'proposal-new-fantasy-sketch.webp',
  'index-blueprint-network.webp',
  'proposal-apply-cyber-forge.webp',
  'description-soft-editorial-room.webp',
  'title-minimal-editorial.webp',
  'proposal-explore-abstract-atlas.webp',
]);

const interestingHeroGallery = buildGalleryAssets('heroes', [
  'cat-line-03.webp',
  'cat-ink-09.webp',
  'cat-sticker-02.webp',
  'cat-sticker-08.webp',
  'thorn-06.webp',
  'cat-paper-04.webp',
  'tide-09.webp',
  'royal-10.webp',
  'cat-oil-09.webp',
  'aurora-04.webp',
]);

function SupportedCliIcon({ providerKey }: CliIconProps) {
  switch (providerKey) {
    case 'ClaudeCodeCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 6.5C6.62 6.5 5.5 7.62 5.5 9v6c0 1.38 1.12 2.5 2.5 2.5h1.25a2.25 2.25 0 0 0 2.25-2.25v-6.5A2.25 2.25 0 0 0 9.25 6.5H8Z" fill="currentColor" />
          <path d="M16 6.5c1.38 0 2.5 1.12 2.5 2.5v6c0 1.38-1.12 2.5-2.5 2.5h-1.25a2.25 2.25 0 0 1-2.25-2.25v-6.5a2.25 2.25 0 0 1 2.25-2.25H16Z" fill="currentColor" opacity="0.75" />
        </svg>
      );
    case 'CodexCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3.5 19 7.5v9L12 20.5 5 16.5v-9L12 3.5Z" stroke="currentColor" strokeWidth="2" />
          <path d="m8.5 10.2 3.5-2.2 3.5 2.2v3.6L12 16l-3.5-2.2v-3.6Z" fill="currentColor" opacity="0.45" />
        </svg>
      );
    case 'GitHubCopilot':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="9" cy="11" r="3" fill="currentColor" />
          <circle cx="15" cy="11" r="3" fill="currentColor" opacity="0.7" />
          <path d="M7 17c1.4-1.33 2.96-2 5-2 2.04 0 3.6.67 5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'OpenCodeCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m9 7-4 5 4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m15 7 4 5-4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m13.5 5.5-3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'CodebuddyCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4.5" y="7" width="6.5" height="10" rx="3.25" stroke="currentColor" strokeWidth="2" />
          <rect x="13" y="7" width="6.5" height="10" rx="3.25" stroke="currentColor" strokeWidth="2" />
          <path d="M11 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'IFlowCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 9.5c1.8-2 4.1-3 7-3 2.4 0 4.72.64 7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 14c1.8-2 4.1-3 7-3 2.4 0 4.72.64 7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.78" />
          <path d="M5 18.5c1.8-2 4.1-3 7-3 2.4 0 4.72.64 7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        </svg>
      );
    default:
      return <span className={styles.supportedProviderFallback}>CLI</span>;
  }
}

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
 * 高效特性区域 - 多 Agent / 多实例并行
 * 优化: 让并行能力从抽象效率数字变成可读的 Agent x Instance 视图
 */
function ConvenientFeature() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [animateBars, setAnimateBars] = useState(true);

  useEffect(() => {
    setAnimateBars(true);
  }, []);

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const agentLanes = [
    {
      key: 'claude',
      icon: <BrainIcon className={styles.agentLaneIcon} />,
      name: t('features.convenient.agentMatrix.agents.claude.name'),
      role: t('features.convenient.agentMatrix.agents.claude.role'),
      instances: [
        t('features.convenient.agentMatrix.agents.claude.instances.0'),
        t('features.convenient.agentMatrix.agents.claude.instances.1'),
        t('features.convenient.agentMatrix.agents.claude.instances.2'),
      ],
    },
    {
      key: 'codex',
      icon: <ZapIcon className={styles.agentLaneIcon} />,
      name: t('features.convenient.agentMatrix.agents.codex.name'),
      role: t('features.convenient.agentMatrix.agents.codex.role'),
      instances: [
        t('features.convenient.agentMatrix.agents.codex.instances.0'),
        t('features.convenient.agentMatrix.agents.codex.instances.1'),
        t('features.convenient.agentMatrix.agents.codex.instances.2'),
      ],
    },
    {
      key: 'router',
      icon: <TargetIcon className={styles.agentLaneIcon} />,
      name: t('features.convenient.agentMatrix.agents.router.name'),
      role: t('features.convenient.agentMatrix.agents.router.role'),
      instances: [
        t('features.convenient.agentMatrix.agents.router.instances.0'),
        t('features.convenient.agentMatrix.agents.router.instances.1'),
        t('features.convenient.agentMatrix.agents.router.instances.2'),
      ],
    },
  ];

  const supportedProviders = [
    {
      key: 'ClaudeCodeCli',
      name: t('features.convenient.agentMatrix.supportedNames.names.0'),
    },
    {
      key: 'CodexCli',
      name: t('features.convenient.agentMatrix.supportedNames.names.1'),
    },
    {
      key: 'GitHubCopilot',
      name: t('features.convenient.agentMatrix.supportedNames.names.2'),
    },
    {
      key: 'CodebuddyCli',
      name: t('features.convenient.agentMatrix.supportedNames.names.3'),
    },
    {
      key: 'OpenCodeCli',
      name: t('features.convenient.agentMatrix.supportedNames.names.4'),
    },
    {
      key: 'IFlowCli',
      name: t('features.convenient.agentMatrix.supportedNames.names.5'),
    },
  ];

  return (
    <motion.div className={`${styles.featureZone} ${styles.convenient}`}>
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
                  animate={{ width: animateBars ? '22%' : '0%' }}
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

          <p className={styles.featureDesc}>{t('features.convenient.description')}</p>
        </div>

        <div className={styles.parallelShowcase}>
          <div className={styles.parallelHeader}>
            <span className={styles.parallelTitle}>{t('features.convenient.agentMatrix.title')}</span>
            <span className={styles.parallelBadge}>{t('features.convenient.agentMatrix.badge')}</span>
          </div>

          <div className={styles.supportedProvidersPanel}>
            <div className={styles.supportedProvidersTitle}>
              {t('features.convenient.agentMatrix.supportedNames.title')}
            </div>
            <div className={styles.supportedProvidersGrid}>
              {supportedProviders.map((provider) => (
                <span key={provider.key} className={styles.supportedProviderPill}>
                  <span className={styles.supportedProviderIcon} data-provider={provider.key} aria-hidden="true">
                    <SupportedCliIcon providerKey={provider.key} />
                  </span>
                  <span className={styles.supportedProviderName}>{provider.name}</span>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.agentMatrix}>
            {agentLanes.map((lane, index) => (
              <motion.div
                key={lane.key}
                className={styles.agentLane}
                data-agent={lane.key}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                transition={{ delay: 0.15 * index }}
              >
                <div className={styles.agentInfo}>
                  <div className={styles.agentIconBadge}>{lane.icon}</div>
                  <div>
                    <div className={styles.agentName}>{lane.name}</div>
                    <div className={styles.agentRole}>{lane.role}</div>
                  </div>
                </div>

                <div className={styles.instanceStrip}>
                  {lane.instances.map((instance) => (
                    <motion.span
                      key={instance}
                      className={styles.instancePill}
                      animate={{ opacity: [0.82, 1, 0.82] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {instance}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.agentStatus}
            animate={{ opacity: [1, 0.72, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className={styles.statusDot} />
            {t('features.convenient.agentMatrix.status')}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 有趣特性区域 - Hero Dungeon 游戏化工作流
 */
function InterestingFeature() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const dungeonGalleryLoop = [...interestingDungeonGallery, ...interestingDungeonGallery];
  const heroGalleryLoop = [...interestingHeroGallery, ...interestingHeroGallery];

  const dungeonCards = [
    {
      key: 'proposal',
      icon: <TargetIcon className={styles.gameIcon} />,
      title: t('features.interesting.dungeonCards.proposal.title'),
      desc: t('features.interesting.dungeonCards.proposal.desc'),
      status: t('features.interesting.dungeonCards.proposal.status'),
    },
    {
      key: 'autotask',
      icon: <ZapIcon className={styles.gameIcon} />,
      title: t('features.interesting.dungeonCards.autotask.title'),
      desc: t('features.interesting.dungeonCards.autotask.desc'),
      status: t('features.interesting.dungeonCards.autotask.status'),
    },
    {
      key: 'prompt',
      icon: <FlameIcon className={styles.gameIcon} />,
      title: t('features.interesting.dungeonCards.prompt.title'),
      desc: t('features.interesting.dungeonCards.prompt.desc'),
      status: t('features.interesting.dungeonCards.prompt.status'),
    },
  ];

  const rosterHeroes = [
    {
      key: 'strategist',
      icon: <BrainIcon className={styles.gameIcon} />,
      name: t('features.interesting.roster.heroes.strategist.name'),
      role: t('features.interesting.roster.heroes.strategist.role'),
    },
    {
      key: 'runner',
      icon: <ZapIcon className={styles.gameIcon} />,
      name: t('features.interesting.roster.heroes.runner.name'),
      role: t('features.interesting.roster.heroes.runner.role'),
    },
    {
      key: 'artist',
      icon: <AwardIcon className={styles.gameIcon} />,
      name: t('features.interesting.roster.heroes.artist.name'),
      role: t('features.interesting.roster.heroes.artist.role'),
    },
  ];

  const battleMetrics = [
    {
      key: 'dungeons',
      value: t('features.interesting.battleReport.metrics.dungeons.value'),
      label: t('features.interesting.battleReport.metrics.dungeons.label'),
    },
    {
      key: 'level',
      value: t('features.interesting.battleReport.metrics.level.value'),
      label: t('features.interesting.battleReport.metrics.level.label'),
    },
    {
      key: 'xp',
      value: t('features.interesting.battleReport.metrics.xp.value'),
      label: t('features.interesting.battleReport.metrics.xp.label'),
    },
  ];

  return (
    <motion.div className={`${styles.featureZone} ${styles.interesting}`}>
      <div className={styles.hudCorner} data-position="top-left" />
      <div className={styles.hudCorner} data-position="top-right" />
      <div className={styles.hudCorner} data-position="bottom-left" />
      <div className={styles.hudCorner} data-position="bottom-right" />

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
              { icon: <TrophyIcon className={styles.gameIcon} />, label: t('features.interesting.features.dungeons.label'), desc: t('features.interesting.features.dungeons.desc') },
              { icon: <TargetIcon className={styles.gameIcon} />, label: t('features.interesting.features.captains.label'), desc: t('features.interesting.features.captains.desc') },
              { icon: <FlameIcon className={styles.gameIcon} />, label: t('features.interesting.features.battle.label'), desc: t('features.interesting.features.battle.desc') },
            ].map((feature) => (
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

          <p className={styles.featureDesc}>{t('features.interesting.description')}</p>

          <div className={styles.interestingLowerGrid}>
            <div className={styles.battlePanel}>
              <div className={styles.reportHeader}>
                <span className={styles.reportTitle}>{t('features.interesting.battleReport.title')}</span>
                <span className={styles.parallelBadge}>{t('features.interesting.battleReport.badge')}</span>
              </div>
              <div className={styles.battleMetrics}>
                {battleMetrics.map((metric) => (
                  <div key={metric.key} className={styles.battleMetric}>
                    <span className={styles.battleMetricValue}>{metric.value}</span>
                    <span className={styles.battleMetricLabel}>{metric.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.battleProgressTrack}>
                <motion.div
                  className={styles.battleProgressFill}
                  animate={{ width: ['38%', '84%', '62%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <p className={styles.battleNote}>{t('features.interesting.battleReport.note')}</p>
            </div>
          </div>
        </div>

        <div className={styles.dungeonShowcase}>
          <div className={styles.dungeonGrid}>
            {dungeonCards.map((card, index) => (
              <motion.div
                key={card.key}
                className={styles.dungeonCard}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                transition={{ delay: 0.12 * index }}
              >
                <div className={styles.dungeonCardTop}>
                  <span className={styles.dungeonCardIcon}>{card.icon}</span>
                  <span className={styles.dungeonStatus}>{card.status}</span>
                </div>
                <span className={styles.dungeonName}>{card.title}</span>
                <p className={styles.dungeonDesc}>{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className={styles.galleryShowcase}>
            <div className={styles.galleryPanel}>
              <div className={styles.galleryViewport}>
                <div className={styles.galleryTrack}>
                  {dungeonGalleryLoop.map((asset, index) => (
                    <div
                      key={`${asset.src}-${index}`}
                      className={styles.galleryCard}
                      data-kind="dungeon"
                    >
                      <img
                        src={asset.src}
                        alt={asset.label}
                        className={styles.galleryImage}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.galleryPanel}>
              <div className={styles.galleryViewport}>
                <div className={`${styles.galleryTrack} ${styles.galleryTrackReverse}`}>
                  {heroGalleryLoop.map((asset, index) => (
                    <div
                      key={`${asset.src}-${index}`}
                      className={styles.galleryCard}
                      data-kind="hero"
                    >
                      <img
                        src={asset.src}
                        alt={asset.label}
                        className={styles.galleryImage}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rosterPanel}>
            <div className={styles.rosterHeader}>
              <span className={styles.reportTitle}>{t('features.interesting.roster.title')}</span>
            </div>
            <div className={styles.rosterList}>
              {rosterHeroes.map((hero) => (
                <div key={hero.key} className={styles.rosterHero}>
                  <span className={styles.rosterAvatar}>{hero.icon}</span>
                  <div>
                    <div className={styles.rosterName}>{hero.name}</div>
                    <div className={styles.rosterRole}>{hero.role}</div>
                  </div>
                </div>
              ))}
            </div>
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
