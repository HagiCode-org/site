/**
 * FeaturesShowcase: the three focus cards of the homepage.
 *
 * - Smart: proposal-driven changes. The artifact tree shows what each OpenSpec stage writes to disk.
 * - Efficient: many agents and instances in parallel lanes instead of one queue.
 * - Interesting: Scenarios, captains, XP and the battle report.
 *
 * Nothing here claims a measured number. Values that illustrate a mechanic are labelled as examples in the copy.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { HomepageCliProfile, HomepageFeaturesCopy, HomepageWorldKey } from '@/lib/homepage-section-copy';
import { pickR2PoolImage } from '@/scripts/r2-random-image';
import { loadR2RemoteFrame } from '@/scripts/r2-remote-frame';
import styles from './FeaturesShowcase.module.css';

type Variants = {
  [key: string]: {
    [key: string]: any;
  };
};

interface IconProps {
  className?: string;
}

/** Astro-resolved renditions of a vendored R2 image (AVIF, WebP and the fallback src). */
export interface R2ImageSources {
  avif: string;
  webp: string;
  src: string;
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

const TargetIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const AwardIcon = ({ className = '' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const workflowIcons: Record<string, React.ReactElement> = {
  review: <BrainIcon className={styles.workflowIcon} />,
  scaffold: <TargetIcon className={styles.workflowIcon} />,
  spec: <TargetIcon className={styles.workflowIcon} />,
  design: <BrainIcon className={styles.workflowIcon} />,
  tasks: <ZapIcon className={styles.workflowIcon} />,
  validate: <TargetIcon className={styles.workflowIcon} />,
  apply: <ZapIcon className={styles.workflowIcon} />,
  archive: <AwardIcon className={styles.workflowIcon} />,
};

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
    case 'PiCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M15 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'ReasonixCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 17.5v-11h6a3.5 3.5 0 1 1 0 7H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m12.5 13.5 4.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
    case 'OmpCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="2" />
          <path d="M9 10h6M11 10v4.5M13.5 10v4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'DshCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6.5 8 4 4-4 4M13 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'JunieCli':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14.5 6v8a3.5 3.5 0 0 1-7 0M11 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return <span className={styles.supportedProviderFallback}>CLI</span>;
  }
}

const CLI_PROVIDER_KEYS: Record<string, string> = {
  claude: 'ClaudeCodeCli',
  codex: 'CodexCli',
  copilot: 'GitHubCopilot',
  opencode: 'OpenCodeCli',
  hermes: 'HermesCli',
  qoder: 'QoderCli',
  kiro: 'KiroCli',
  kimi: 'KimiCli',
  gemini: 'GeminiCli',
  pi: 'PiCli',
  omp: 'OmpCli',
  reasonix: 'ReasonixCli',
  deepagents: 'DeepAgentsCli',
  codebuddy: 'CodebuddyCli',
  dsh: 'DshCli',
  junie: 'JunieCli',
};

const cliProviderKey = (key: string) => CLI_PROVIDER_KEYS[key] ?? key;

/** Comparison article cells mark commands with backticks; render those spans as code. */
function renderInlineCode(text: string): React.ReactNode {
  return text.split('`').map((part, index) => (index % 2 === 1 ? <code key={index} className={styles.cliInlineCode}>{part}</code> : part));
}

const zeroPad = (value: number) => String(value).padStart(2, '0');

type ArtifactRow = {
  key: string;
  path: string;
  kind: 'dir' | 'file' | 'command';
  depth: 0 | 1;
  /** First stage at which the row exists on disk (index into workflowStages). */
  born: number;
  /** Stages in which the row is being read or written. */
  active: number[];
};

// Mirrors the order of workflowStages: review, scaffold, spec, design, tasks, validate, apply, archive.
const artifactRows: ArtifactRow[] = [
  { key: 'specs', path: 'openspec/specs/', kind: 'dir', depth: 0, born: 0, active: [0] },
  { key: 'change', path: 'openspec/changes/<change-id>/', kind: 'dir', depth: 0, born: 1, active: [1] },
  { key: 'proposal', path: 'proposal.md', kind: 'file', depth: 1, born: 1, active: [1] },
  { key: 'design', path: 'design.md', kind: 'file', depth: 1, born: 1, active: [3] },
  { key: 'tasks', path: 'tasks.md', kind: 'file', depth: 1, born: 1, active: [4, 6] },
  { key: 'delta', path: 'specs/<capability>/spec.md', kind: 'file', depth: 1, born: 2, active: [2] },
  { key: 'validate', path: 'openspec validate --strict', kind: 'command', depth: 0, born: 5, active: [5] },
  { key: 'archive', path: 'openspec/changes/archive/', kind: 'dir', depth: 0, born: 7, active: [7] },
];

function ArtifactMarker({ state }: { state: 'idle' | 'done' | 'active' }) {
  return (
    <svg className={styles.artifactMarker} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {state === 'done' ? (
        <>
          <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.16" />
          <path d="m4.8 8.3 2.1 2.1 4.3-4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : state === 'active' ? (
        <>
          <circle className={styles.artifactMarkerRing} cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="3" fill="currentColor" />
        </>
      ) : (
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.4 2.6" />
      )}
    </svg>
  );
}

function SmartFeature({ copy }: { copy: HomepageFeaturesCopy['smart'] }) {
  const prefersReducedMotion = useReducedMotion();
  const [activeStage, setActiveStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stages = copy.workflowStages;

  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      return undefined;
    }

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 1700);

    return () => clearInterval(interval);
  }, [isPaused, prefersReducedMotion, stages.length]);

  const currentStage = stages[activeStage];
  const progressRatio = (activeStage + 1) / stages.length;

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
            <h2 className={styles.featureTitle}>{copy.title}</h2>
            <p className={styles.featureSubtitle}>{copy.subtitle}</p>
          </div>

          <div className={styles.artifactPanel}>
            <div className={styles.artifactHeader}>
              <span className={styles.artifactTitle}>{copy.artifactsTitle}</span>
              <motion.span
                key={currentStage.key}
                className={styles.artifactStage}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {zeroPad(activeStage + 1)} / {zeroPad(stages.length)} · {currentStage.label}
              </motion.span>
            </div>
            <ul className={styles.artifactTree}>
              {artifactRows.map((row) => {
                const state = row.active.includes(activeStage) ? 'active' : activeStage >= row.born ? 'done' : 'idle';

                return (
                  <li
                    key={row.key}
                    className={styles.artifactRow}
                    data-state={state}
                    data-kind={row.kind}
                    data-depth={row.depth}
                    aria-current={state === 'active' ? 'step' : undefined}
                  >
                    <ArtifactMarker state={state} />
                    <code className={styles.artifactPath}>
                      {row.kind === 'command' ? <span className={styles.artifactPrompt} aria-hidden="true">$ </span> : null}
                      {row.path}
                    </code>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className={styles.featureDesc}>{copy.description}</p>
        </div>

        <div className={styles.workflowAnimation}>
          <div className={styles.workflowBoard}>
            {stages.map((stage, index) => (
              <button
                type="button"
                key={stage.key}
                className={styles.workflowCard}
                data-state={index < activeStage ? 'done' : index === activeStage ? 'active' : 'idle'}
                onClick={() => {
                  setActiveStage(index);
                  setIsPaused(true);
                }}
              >
                <div className={styles.workflowStepMarker}>
                  {workflowIcons[stage.key] || <ZapIcon className={styles.workflowIcon} />}
                  <span className={styles.workflowStepIndex}>{zeroPad(index + 1)}</span>
                  {index === activeStage && !prefersReducedMotion ? (
                    <motion.span
                      className={styles.workflowStepPulse}
                      animate={{ scale: [1, 1.24, 1], opacity: [0.26, 0, 0.26] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                  ) : null}
                </div>
                <div className={styles.workflowCardContent}>
                  <span className={styles.workflowLabel}>{stage.label}</span>
                  <span className={styles.workflowDesc}>{stage.desc}</span>
                </div>
                <div className={styles.workflowStepMeter}>
                  <motion.span
                    className={styles.workflowStepMeterFill}
                    style={{ transformOrigin: 'left center' }}
                    animate={{
                      scaleX: index < activeStage ? 1 : index === activeStage ? 0.72 : 0.18,
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                {index === activeStage && !prefersReducedMotion ? (
                  <motion.span
                    className={styles.workflowCardGlow}
                    animate={{ opacity: [0.08, 0.18, 0.08] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ) : null}
              </button>
            ))}
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

function ConvenientFeature({ copy, cliProfiles }: { copy: HomepageFeaturesCopy['convenient']; cliProfiles: HomepageCliProfile[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [activityTick, setActivityTick] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCli, setActiveCli] = useState(0);

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

  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      return undefined;
    }

    const interval = setInterval(() => {
      setActivityTick((prev) => prev + 1);
    }, 1600);

    return () => clearInterval(interval);
  }, [isPaused, prefersReducedMotion]);

  const activeLane = agentLanes.length > 0 ? activityTick % agentLanes.length : 0;
  const activeProfile = cliProfiles[Math.min(activeCli, Math.max(cliProfiles.length - 1, 0))];
  const throughputScales = [0, 1, 2].map((laneIndex) => {
    const phase = (activityTick + laneIndex) % 3;

    if (phase === 0) {
      return 0.38;
    }

    if (phase === 1) {
      return 0.74;
    }

    return 1;
  });

  return (
    <motion.div
      className={`${styles.featureZone} ${styles.convenient}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.hudCorner} data-position="top-left" />
      <div className={styles.hudCorner} data-position="top-right" />
      <div className={styles.hudCorner} data-position="bottom-left" />
      <div className={styles.hudCorner} data-position="bottom-right" />
      <div className={styles.featurePattern} />
      <div className={styles.featureContent}>
        <div className={styles.featureText}>
          <div>
            <h2 className={styles.featureTitle}>{copy.title}</h2>
            <p className={styles.featureSubtitle}>{copy.subtitle}</p>
          </div>

          <div className={styles.convenientMetricsGrid}>
            <div className={styles.quotaComparison}>
              <div className={styles.quotaItem}>
                <span className={styles.quotaLabel}>{copy.traditional}</span>
                <div className={`${styles.quotaStack} ${styles.quotaStackSerial}`}>
                  <div className={styles.quotaLane}>
                    <motion.span
                      className={`${styles.quotaLaneFill} ${styles.quotaLaneFillMuted}`}
                      style={{ transformOrigin: 'left center' }}
                      animate={{ scaleX: 0.22 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {!prefersReducedMotion ? (
                      <motion.span
                        className={styles.quotaPacket}
                        animate={{ x: ['-14%', '130%'] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
              <div className={styles.quotaArrow}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className={styles.quotaItem}>
                <span className={styles.quotaLabel}>{copy.multiThread}</span>
                <div className={`${styles.quotaStack} ${styles.quotaStackParallel}`}>
                  {throughputScales.map((scale, laneIndex) => (
                    <div key={laneIndex} className={styles.quotaLane}>
                      <motion.span
                        className={`${styles.quotaLaneFill} ${styles.quotaLaneFillPrimary}`}
                        style={{ transformOrigin: 'left center' }}
                        animate={{ scaleX: scale }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      />
                      {!prefersReducedMotion ? (
                        <motion.span
                          className={styles.quotaPacket}
                          data-parallel="true"
                          animate={{ x: ['-14%', '130%'] }}
                          transition={{ duration: 1.35, repeat: Infinity, ease: 'linear', delay: laneIndex * 0.18 }}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className={styles.featureDesc}>{copy.description}</p>
        </div>

        <div className={styles.parallelShowcase}>
          <div className={styles.parallelHeader}>
            <div className={styles.parallelTitleGroup}>
              <span className={styles.parallelTitle}>{copy.agentMatrix.title}</span>
            </div>
            <span className={styles.parallelBadge}>{copy.agentMatrix.badge}</span>
          </div>

          <div className={styles.agentMatrix}>
            {agentLanes.map((lane, index) => (
              <motion.div
                key={lane.key}
                className={styles.agentLane}
                data-agent={lane.key}
                data-active={activeLane === index ? 'true' : 'false'}
                data-lane-index={String(index + 1).padStart(2, '0')}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                transition={{ delay: 0.15 * index }}
              >
                <div className={styles.agentInfo}>
                  <div className={styles.agentInfoMain}>
                    <div className={styles.agentIconBadge}>{lane.icon}</div>
                    <div>
                      <span className={styles.agentLaneIndex}>{String(index + 1).padStart(2, '0')}</span>
                      <div className={styles.agentName}>{lane.name}</div>
                      <div className={styles.agentRole}>{lane.role}</div>
                    </div>
                  </div>
                  <div className={styles.agentLaneMeter}>
                    <motion.span
                      className={styles.agentLaneMeterFill}
                      style={{ transformOrigin: 'left center' }}
                      animate={{ scaleX: activeLane === index ? 1 : 0.58, opacity: activeLane === index ? 1 : 0.72 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                <div className={styles.agentQueue}>
                  {lane.instances.map((instance, instanceIndex) => {
                    const phase = (activityTick + index + instanceIndex) % 4;

                    return (
                      <div key={instance} className={styles.agentJob} data-phase={String(phase)}>
                        <div className={styles.agentJobTopline}>
                          <span className={styles.agentJobIndex}>{String(instanceIndex + 1).padStart(2, '0')}</span>
                          <span className={styles.agentJobName}>{instance}</span>
                          <span className={styles.agentJobIndicator} data-active={phase >= 2 ? 'true' : 'false'} />
                        </div>
                        <div className={styles.agentJobTrack}>
                          <motion.span
                            className={styles.agentJobFill}
                            style={{ transformOrigin: 'left center' }}
                            animate={{
                              scaleX: phase === 0 ? 0.16 : phase === 1 ? 0.48 : phase === 2 ? 0.82 : 1,
                            }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          />
                          {!prefersReducedMotion && phase !== 0 ? (
                            <motion.span
                              className={styles.agentJobPulse}
                              animate={{ x: ['-8%', '108%'], opacity: [0, 0.78, 0] }}
                              transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut', delay: instanceIndex * 0.14 }}
                            />
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.agentStatus}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.72, 1, 0.72] }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className={styles.statusDot} />
            {copy.agentMatrix.status}
          </motion.div>
        </div>
      </div>

      {activeProfile ? (
        <div className={styles.supportedProvidersPanel}>
          <div className={styles.cliBayHeader}>
            <span className={styles.cliBayTitle}>{copy.cliBay.title}</span>
            <span className={styles.cliBayHint}>{copy.cliBay.hint}</span>
          </div>

          <div className={styles.cliBayBody}>
            <div className={styles.cliDock} role="group" aria-label={copy.cliBay.title}>
              {cliProfiles.map((profile, index) => (
                <button
                  type="button"
                  key={profile.key}
                  className={styles.cliTile}
                  aria-pressed={index === activeCli}
                  onClick={() => setActiveCli(index)}
                >
                  <span className={styles.supportedProviderIcon} data-provider={cliProviderKey(profile.key)} aria-hidden="true">
                    <SupportedCliIcon providerKey={cliProviderKey(profile.key)} />
                  </span>
                  <span className={styles.cliTileName}>{profile.shortName}</span>
                </button>
              ))}
            </div>

            <div className={styles.cliStage}>
              <ol className={styles.cliChain}>
                <li className={styles.cliNode}>
                  <span className={styles.cliNodeBadge}>
                    <BrainIcon className={styles.cliNodeGlyph} />
                  </span>
                  <span className={styles.cliNodeLabel}>{copy.cliBay.chain.agent}</span>
                </li>
                <li className={styles.cliLinkItem} aria-hidden="true">
                  <motion.span
                    key={`${activeProfile.key}-in`}
                    className={styles.cliLink}
                    style={{ transformOrigin: 'left center' }}
                    initial={prefersReducedMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  />
                </li>
                <li className={styles.cliNode} data-role="cli">
                  <motion.span
                    key={`${activeProfile.key}-node`}
                    className={`${styles.supportedProviderIcon} ${styles.cliNodeCli}`}
                    data-provider={cliProviderKey(activeProfile.key)}
                    aria-hidden="true"
                    initial={prefersReducedMotion ? false : { scale: 0.82, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <SupportedCliIcon providerKey={cliProviderKey(activeProfile.key)} />
                  </motion.span>
                  <span className={styles.cliNodeLabel}>{activeProfile.shortName}</span>
                </li>
                <li className={styles.cliLinkItem} aria-hidden="true">
                  <motion.span
                    key={`${activeProfile.key}-out`}
                    className={styles.cliLink}
                    style={{ transformOrigin: 'left center' }}
                    initial={prefersReducedMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />
                </li>
                <li className={styles.cliNode} data-role="model">
                  <span className={styles.cliNodeBadge} data-slot="model">
                    <svg className={styles.cliNodeGlyph} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <span className={styles.cliNodeLabel}>{copy.cliBay.chain.model}</span>
                </li>
              </ol>

              <motion.div
                key={activeProfile.key}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                lang={activeProfile.contentLocale}
              >
                <dl className={styles.cliFacts}>
                  {([
                    ['whatItIs', activeProfile.whatItIs],
                    ['models', activeProfile.models],
                    ['runsOn', activeProfile.runsOn],
                    ['start', activeProfile.start],
                    ['questions', activeProfile.questions],
                  ] as const)
                    .filter(([, value]) => value)
                    .map(([labelKey, value]) => (
                      <div key={labelKey} className={styles.cliFact}>
                        <dt className={styles.cliFactLabel}>{copy.cliBay.labels[labelKey]}</dt>
                        <dd className={styles.cliFactValue}>{renderInlineCode(value)}</dd>
                      </div>
                    ))}
                </dl>

                {activeProfile.strengths.length > 0 ? (
                  <div className={styles.cliStrengths}>
                    <span className={styles.cliFactLabel}>{copy.cliBay.labels.strengths}</span>
                    <ul className={styles.cliStrengthList}>
                      {activeProfile.strengths.map((strength) => (
                        <li key={strength} className={styles.cliStrength}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <a className={styles.cliCompareLink} href={activeProfile.href}>
                  {copy.cliBay.labels.compare}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14m-5-5 5 5-5 5" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

// Example agents: the Agent CLI names match the Efficient card. Avatars come from the page (R2 defaults and pool).
const exampleAgents: Record<string, { cli: string }> = {
  strategist: { cli: 'Claude Code' },
  runner: { cli: 'Codex' },
  artist: { cli: 'Qwen · GLM' },
};

const TROPHY_TIERS = ['star', 'moon', 'sun', 'crown'] as const;

function TrophyIcon({ tier }: { tier: (typeof TROPHY_TIERS)[number] }) {
  return (
    <svg className={styles.trophyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {tier === 'star' ? <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z" /> : null}
      {tier === 'moon' ? <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" /> : null}
      {tier === 'sun' ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
        </>
      ) : null}
      {tier === 'crown' ? <path d="M4 18h16M5 18 3.5 8l5 4 3.5-6 3.5 6 5-4L19 18" /> : null}
    </svg>
  );
}

/** Persona avatar: the vendored R2 default first, then at most one random pool entry after it loads. */
function PersonaAvatar({ sources, pool }: { sources: R2ImageSources; pool: string[] }) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      pickR2PoolImage(imageRef.current, pool);
    }
  }, []);

  return (
    <picture className={styles.personaPicture}>
      <source srcSet={sources.avif} type="image/avif" />
      <source srcSet={sources.webp} type="image/webp" />
      <img
        ref={imageRef}
        src={sources.src}
        alt=""
        aria-hidden="true"
        className={styles.personaAvatar}
        width={56}
        height={56}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

function InterestingFeature({
  copy,
  personaAvatars,
  personaPool,
  worldCovers,
  remoteWorldCovers,
  heroStrip = [],
}: {
  copy: HomepageFeaturesCopy['interesting'];
  personaAvatars?: Partial<Record<string, R2ImageSources>>;
  personaPool: string[];
  worldCovers?: Partial<Record<HomepageWorldKey, R2ImageSources>>;
  remoteWorldCovers?: Partial<Record<HomepageWorldKey, string>>;
  heroStrip?: R2ImageSources[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const worlds = copy.worlds.items;
  const [activeWorld, setActiveWorld] = useState(0);
  const [shownWorld, setShownWorld] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [hasPicked, setHasPicked] = useState(false);
  // Covers that can be shown: the vendored ones at once, a remote frame once its activation has loaded it.
  const [readyWorlds, setReadyWorlds] = useState<Set<HomepageWorldKey>>(
    () => new Set(worlds.filter((item) => worldCovers?.[item.key]).map((item) => item.key)),
  );
  const heroGalleryLoop = [...heroStrip, ...heroStrip];

  // Activating a remote cover requests it (only now). The previous cover stays on screen until it loads.
  useEffect(() => {
    const key = worlds[activeWorld].key;
    if (readyWorlds.has(key)) {
      setShownWorld(activeWorld);
      return undefined;
    }

    const url = remoteWorldCovers?.[key];
    if (!url) return undefined;
    return loadR2RemoteFrame(url, () => setReadyWorlds((prev) => new Set(prev).add(key)));
  }, [activeWorld]);

  useEffect(() => {
    if (readyWorlds.has(worlds[activeWorld].key)) {
      setShownWorld(activeWorld);
    }
  }, [activeWorld, readyWorlds]);

  // The world rotates on its own until the visitor hovers, focuses, or picks one.
  useEffect(() => {
    if (isHolding || hasPicked || prefersReducedMotion) {
      return undefined;
    }

    const interval = setInterval(() => {
      setActiveWorld((prev) => (prev + 1) % worlds.length);
    }, 3400);

    return () => clearInterval(interval);
  }, [isHolding, hasPicked, prefersReducedMotion, worlds.length]);

  const world = worlds[activeWorld];
  const termRows = (['agent', 'group', 'job', 'log'] as const).map((slot) => ({
    slot,
    label: copy.worlds.labels[slot],
    value: world[slot],
  }));

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
            <h2 className={styles.featureTitle}>{copy.title}</h2>
            <p className={styles.featureSubtitle}>{copy.subtitle}</p>
          </div>

          <p className={styles.featureDesc}>{copy.description}</p>

          <div
            className={styles.worldPanel}
            onMouseEnter={() => setIsHolding(true)}
            onMouseLeave={() => setIsHolding(false)}
            onFocus={() => setIsHolding(true)}
            onBlur={() => setIsHolding(false)}
          >
            <span className={styles.worldTitle}>{copy.worlds.title}</span>
            <div className={styles.worldChips} role="group" aria-label={copy.worlds.title}>
              {worlds.map((item, index) => (
                <button
                  type="button"
                  key={item.key}
                  className={styles.worldChip}
                  aria-pressed={index === activeWorld}
                  onClick={() => {
                    setActiveWorld(index);
                    setHasPicked(true);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <dl className={styles.worldTerms}>
              {termRows.map((row) => (
                <div key={row.slot} className={styles.worldTerm}>
                  <dt className={styles.worldTermLabel}>{row.label}</dt>
                  <motion.dd
                    key={`${world.key}-${row.slot}`}
                    className={styles.worldTermValue}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {row.value}
                  </motion.dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.progressPanel}>
            <span className={styles.worldTitle}>{copy.progress.title}</span>
            <div className={styles.progressRow}>
              <svg className={styles.levelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 11 6-6 6 6M6 19l6-6 6 6" />
              </svg>
              <p className={styles.progressText}>{copy.progress.token}</p>
            </div>
            <div className={styles.progressRow}>
              <span className={styles.progressLabel}>{copy.progress.achievements}</span>
              <ol className={styles.trophyLadder}>
                {TROPHY_TIERS.map((tier) => (
                  <li key={tier} className={styles.trophyStep} data-tier={tier}>
                    <TrophyIcon tier={tier} />
                    <span>{copy.progress.tiers[tier]}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className={styles.worldShowcase}>
          <figure className={styles.worldCover}>
            {worlds.map((item, index) => {
              const cover = worldCovers?.[item.key];
              const isShown = index === shownWorld;

              if (cover) {
                return (
                  <picture
                    key={item.key}
                    className={styles.worldCoverImage}
                    data-active={isShown ? 'true' : 'false'}
                  >
                    <source srcSet={cover.avif} type="image/avif" />
                    <source srcSet={cover.webp} type="image/webp" />
                    <img
                      src={cover.src}
                      alt={isShown ? item.name : ''}
                      aria-hidden={isShown ? undefined : true}
                      width={720}
                      height={480}
                      loading="eager"
                      decoding="async"
                    />
                  </picture>
                );
              }

              // A rotating remote frame exists in the DOM only after its activation has loaded it.
              const remote = remoteWorldCovers?.[item.key];
              if (!remote || !readyWorlds.has(item.key)) return null;

              return (
                <img
                  key={item.key}
                  src={remote}
                  alt={isShown ? item.name : ''}
                  aria-hidden={isShown ? undefined : true}
                  className={styles.worldCoverImage}
                  data-active={isShown ? 'true' : 'false'}
                  width={720}
                  height={480}
                  decoding="async"
                />
              );
            })}
            <figcaption className={styles.worldCoverCaption}>{world.name}</figcaption>
          </figure>

          <div className={styles.personaPanel}>
            <div className={styles.personaRow}>
              {copy.agents.items.map((agent) => {
                const profile = exampleAgents[agent.key];
                const avatarSources = personaAvatars?.[agent.key];

                return (
                  <div key={agent.key} className={styles.persona}>
                    {avatarSources ? <PersonaAvatar sources={avatarSources} pool={personaPool} /> : null}
                    <span className={styles.personaName}>{agent.name}</span>
                    <motion.span
                      key={`${world.key}-${agent.key}`}
                      className={styles.personaMeta}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {world.agent} · {profile.cli}
                    </motion.span>
                    <span className={styles.personaTrait}>{agent.trait}</span>
                  </div>
                );
              })}
            </div>
            <p className={styles.personaCaption}>{copy.agents.caption}</p>
          </div>

          <div className={styles.galleryShowcase}>
            <div className={styles.galleryPanel}>
              <div className={styles.galleryViewport}>
                <div className={styles.galleryTrack}>
                  {heroGalleryLoop.map((frame, index) => (
                    <div key={`${frame.src}-${index}`} className={styles.galleryCard} data-kind="hero">
                      <picture className={styles.galleryPicture}>
                        <source srcSet={frame.avif} type="image/avif" />
                        <source srcSet={frame.webp} type="image/webp" />
                        <img src={frame.src} alt="" aria-hidden="true" className={styles.galleryImage} width={128} height={128} loading="lazy" decoding="async" />
                      </picture>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface Props {
  copy: HomepageFeaturesCopy;
  /** Per-CLI profiles read from the comparison articles; the CLI bay is hidden when empty. */
  cliProfiles?: HomepageCliProfile[];
  /** Persona avatars keyed by example agent: vendored R2 defaults rendered by Astro. */
  personaAvatars?: Partial<Record<string, R2ImageSources>>;
  /** Absolute R2 URLs a persona avatar may swap to at random; empty means no swap. */
  personaPool?: string[];
  /** Fun-section world covers keyed by world: vendored R2 cat heads rendered by Astro. */
  worldCovers?: Partial<Record<HomepageWorldKey, R2ImageSources>>;
  /** Fun-section covers that are rotating remote frames, by world: their object URLs, requested on activation. */
  remoteWorldCovers?: Partial<Record<HomepageWorldKey, string>>;
  /** Fun-section hero strip frames in strip order: vendored R2 cat heads rendered by Astro. */
  heroStrip?: R2ImageSources[];
}

export default function FeaturesShowcase({ copy, cliProfiles = [], personaAvatars, personaPool = [], worldCovers, remoteWorldCovers, heroStrip }: Props) {
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
          <ConvenientFeature copy={copy.convenient} cliProfiles={cliProfiles} />
          <InterestingFeature
            copy={copy.interesting}
            personaAvatars={personaAvatars}
            personaPool={personaPool}
            worldCovers={worldCovers}
            remoteWorldCovers={remoteWorldCovers}
            heroStrip={heroStrip}
          />
        </div>
      </div>
    </section>
  );
}
