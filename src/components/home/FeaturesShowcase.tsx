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
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSiteAssetUrl } from '@/assets/siteAssetUrls';
import type { HomepageFeaturesCopy } from '@/lib/homepage-section-copy';
import styles from './FeaturesShowcase.module.css';

type Variants = {
  [key: string]: {
    [key: string]: any;
  };
};

interface IconProps {
  className?: string;
}

interface CliIconProps {
  providerKey: string;
}

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
    src: getSiteAssetUrl(`img/home/interesting/${group}/${file}`),
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
    case 'HermesCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'QoderCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="5.5" stroke="currentColor" strokeWidth="2" />
          <path d="m15.5 15.5 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'KiroCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4 6 9.5 12 20l6-10.5L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 8v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'KimiCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14.5 4.5a7 7 0 1 0 5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M15 8.5h4.5V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'GeminiCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4.5 14 10l5.5 2-5.5 2-2 5.5-2-5.5L4.5 12 10 10 12 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'DeepAgentsCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="7" cy="8" r="2" fill="currentColor" />
          <circle cx="17" cy="8" r="2" fill="currentColor" opacity="0.75" />
          <circle cx="12" cy="17" r="2" fill="currentColor" opacity="0.55" />
          <path d="M8.6 9.2 10.9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M15.4 9.2 13.1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 8h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
    default:
      return <span className={styles.supportedProviderFallback}>CLI</span>;
  }
}

const smartStageLabels = ['Idea', 'Proposal', 'Review', 'Tasks', 'Code', 'Test', 'Refactor', 'Docs', 'Archive'];

function SmartFeature({ copy }: { copy: HomepageFeaturesCopy['smart'] }) {
  const [activeStage, setActiveStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stages = smartStageLabels.map((label, index) => ({
    id: label.toLowerCase(),
    label,
    desc: copy.workflowDescriptions[index] ?? '',
  }));

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused, stages.length]);

  return (
    <motion.div
      className={`${styles.featureZone} ${styles.smart}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.hudCorner} data-position="top-left" />
      <div className={styles.hudCorner} data-position="top-right" />
      <div className={styles.hudCorner} data-position="bottom-left" />
      <div className={styles.hudCorner} data-position="bottom-right" />
      <div className={styles.scanline} />
      <div className={styles.featurePattern} />
      <div className={styles.featureContent}>
        <div className={styles.featureText}>
          <div>
            <span className={styles.featureBadge}>{copy.badge}</span>
            <h2 className={styles.featureTitle}>{copy.title}</h2>
            <p className={styles.featureSubtitle}>{copy.subtitle}</p>
          </div>

          <div className={styles.efficiencyHighlight}>
            <motion.div
              className={styles.efficiencyValue}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
            >
              <span className={styles.efficiencyNumber}>300</span>
              <span className={styles.efficiencyPercent}>%</span>
            </motion.div>
            <div className={styles.efficiencyLabel}>{copy.efficiency}</div>
            <div className={styles.efficiencyChart}>
              <motion.div
                className={`${styles.chartBar} ${styles.barShort}`}
                initial={{ height: 0 }}
                animate={{ height: '30%' }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              >
                <span className={styles.chartLabel}>{copy.traditional}</span>
              </motion.div>
              <motion.div
                className={`${styles.chartBar} ${styles.barFull}`}
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              >
                <span className={styles.chartLabel}>{copy.hagicode}</span>
              </motion.div>
            </div>
          </div>

          <p className={styles.featureDesc}>{copy.description}</p>
        </div>

        <div className={styles.workflowAnimation}>
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
                  {activeStage === index ? (
                    <motion.div
                      className={styles.iconGlow}
                      layoutId="activeGlow"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  ) : null}
                </div>
                <span className={styles.workflowLabel}>{stage.label}</span>
                <span className={styles.workflowDesc}>{stage.desc}</span>
                {index < stages.length - 1 ? (
                  <div className={styles.nodeConnector} data-active={activeStage >= index ? 'true' : 'false'} />
                ) : null}
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
          {isPaused ? (
            <motion.div className={styles.pausedIndicator} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span>{copy.paused}</span>
            </motion.div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

function ConvenientFeature({ copy }: { copy: HomepageFeaturesCopy['convenient'] }) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const agentLanes = [
    {
      ...copy.agentMatrix.agentLanes[0],
      icon: <BrainIcon className={styles.agentLaneIcon} />,
    },
    {
      ...copy.agentMatrix.agentLanes[1],
      icon: <ZapIcon className={styles.agentLaneIcon} />,
    },
    {
      ...copy.agentMatrix.agentLanes[2],
      icon: <TargetIcon className={styles.agentLaneIcon} />,
    },
  ].filter((lane) => lane.key);

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
            <span className={styles.featureBadge}>{copy.badge}</span>
            <h2 className={styles.featureTitle}>{copy.title}</h2>
            <p className={styles.featureSubtitle}>{copy.subtitle}</p>
          </div>

          <div className={styles.quotaComparison}>
            <div className={styles.quotaItem}>
              <div className={styles.quotaBar}>
                <motion.div
                  className={styles.quotaFill}
                  style={{ background: 'linear-gradient(135deg, #666, #999)' }}
                  animate={{ width: '22%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                <div className={styles.quotaGlow} />
              </div>
              <span className={styles.quotaLabel}>{copy.traditional}</span>
            </div>
            <div className={styles.quotaArrow}>
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}>
                →
              </motion.span>
            </div>
            <div className={styles.quotaItem}>
              <div className={styles.quotaBar}>
                <motion.div
                  className={styles.quotaFill}
                  style={{ background: 'var(--gradient-primary)' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <div className={styles.quotaGlow} />
              </div>
              <span className={styles.quotaLabel}>{copy.multiThread}</span>
            </div>
          </div>

          <motion.div className={styles.boostRange} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }}>
            <span className={styles.boostLabel}>{copy.boost}</span>
            <span className={styles.boostValue}>{copy.boostValue}</span>
          </motion.div>

          <p className={styles.featureDesc}>{copy.description}</p>
        </div>

        <div className={styles.parallelShowcase}>
          <div className={styles.parallelHeader}>
            <span className={styles.parallelTitle}>{copy.agentMatrix.title}</span>
            <span className={styles.parallelBadge}>{copy.agentMatrix.badge}</span>
          </div>

          <div className={styles.supportedProvidersPanel}>
            <div className={styles.supportedProvidersTitle}>{copy.agentMatrix.supportedProvidersTitle}</div>
            <div className={styles.supportedProvidersGrid}>
              {copy.agentMatrix.supportedProviders.map((provider) => (
                <span key={provider.key} className={styles.supportedProviderPill}>
                  <span className={styles.supportedProviderIcon} data-provider={provider.key} aria-hidden="true">
                    <SupportedCliIcon providerKey={provider.key} />
                  </span>
                  <span className={styles.supportedProviderName}>{provider.name}</span>
                </span>
              ))}
            </div>
            <p className={styles.supportedProvidersNote}>{copy.agentMatrix.supportedProvidersNote}</p>
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

          <motion.div className={styles.agentStatus} animate={{ opacity: [1, 0.72, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <span className={styles.statusDot} />
            {copy.agentMatrix.status}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function InterestingFeature({ copy }: { copy: HomepageFeaturesCopy['interesting'] }) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const dungeonGalleryLoop = [...interestingDungeonGallery, ...interestingDungeonGallery];
  const heroGalleryLoop = [...interestingHeroGallery, ...interestingHeroGallery];

  const dungeonCards = [
    { ...copy.dungeonCards[0], icon: <TargetIcon className={styles.gameIcon} /> },
    { ...copy.dungeonCards[1], icon: <ZapIcon className={styles.gameIcon} /> },
    { ...copy.dungeonCards[2], icon: <FlameIcon className={styles.gameIcon} /> },
  ].filter((card) => card.key);

  const rosterHeroes = [
    { ...copy.roster.heroes[0], icon: <BrainIcon className={styles.gameIcon} /> },
    { ...copy.roster.heroes[1], icon: <ZapIcon className={styles.gameIcon} /> },
    { ...copy.roster.heroes[2], icon: <AwardIcon className={styles.gameIcon} /> },
  ].filter((hero) => hero.key);

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
            <span className={styles.featureBadge}>{copy.badge}</span>
            <h2 className={styles.featureTitle}>{copy.title}</h2>
            <p className={styles.featureSubtitle}>{copy.subtitle}</p>
          </div>

          <div className={styles.gameFeatures}>
            {copy.features.map((feature) => {
              const icon = feature.key === 'dungeons'
                ? <TrophyIcon className={styles.gameIcon} />
                : feature.key === 'captains'
                  ? <TargetIcon className={styles.gameIcon} />
                  : <FlameIcon className={styles.gameIcon} />;

              return (
                <motion.div key={feature.key} className={styles.gameFeature} whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ cursor: 'pointer' }}>
                  {icon}
                  <span className={styles.gameLabel}>{feature.label}</span>
                  <p className={styles.gameDesc}>{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <p className={styles.featureDesc}>{copy.description}</p>

          <div className={styles.interestingLowerGrid}>
            <div className={styles.battlePanel}>
              <div className={styles.reportHeader}>
                <span className={styles.reportTitle}>{copy.battleReport.title}</span>
                <span className={styles.parallelBadge}>{copy.battleReport.badge}</span>
              </div>
              <div className={styles.battleMetrics}>
                {copy.battleReport.metrics.map((metric) => (
                  <div key={metric.key} className={styles.battleMetric}>
                    <span className={styles.battleMetricValue}>{metric.value}</span>
                    <span className={styles.battleMetricLabel}>{metric.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.battleProgressTrack}>
                <motion.div className={styles.battleProgressFill} animate={{ width: ['38%', '84%', '62%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
              </div>
              <p className={styles.battleNote}>{copy.battleReport.note}</p>
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
                    <div key={`${asset.src}-${index}`} className={styles.galleryCard} data-kind="dungeon">
                      <img src={asset.src} alt={asset.label} className={styles.galleryImage} width={128} height={128} loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.galleryPanel}>
              <div className={styles.galleryViewport}>
                <div className={`${styles.galleryTrack} ${styles.galleryTrackReverse}`}>
                  {heroGalleryLoop.map((asset, index) => (
                    <div key={`${asset.src}-${index}`} className={styles.galleryCard} data-kind="hero">
                      <img src={asset.src} alt={asset.label} className={styles.galleryImage} width={128} height={128} loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rosterPanel}>
            <div className={styles.rosterHeader}>
              <span className={styles.reportTitle}>{copy.roster.title}</span>
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

interface Props {
  copy: HomepageFeaturesCopy;
}

export default function FeaturesShowcase({ copy }: Props) {
  return (
    <section className={styles.featuresShowcase}>
      <div className="container">
        <div className={styles.showcaseHeader}>
          <h2 className={styles.showcaseTitle}>
            <span className={styles.titleAccent}>{copy.showcase.title}</span>
          </h2>
          <p className={styles.showcaseSubtitle}>{copy.showcase.subtitle}</p>
        </div>

        <div className={styles.zonesContainer}>
          <SmartFeature copy={copy.smart} />
          <ConvenientFeature copy={copy.convenient} />
          <InterestingFeature copy={copy.interesting} />
        </div>
      </div>
    </section>
  );
}
