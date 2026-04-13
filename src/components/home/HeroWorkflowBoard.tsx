import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import styles from './HeroWorkflowBoard.module.css';
import { withBasePath } from '@/utils/path';

type Locale = 'zh-CN' | 'en';

type AgentSpec = {
  name: string;
  accent: string;
  glow: string;
};

type LanePhase = 'entering' | 'running' | 'completed';

type LaneCycle = {
  laneId: number;
  taskId: number;
  agent: AgentSpec;
  heroVariant: number;
  startedAt: number;
  phaseStartedAt: number;
  stageDurations: number[];
  totalDuration: number;
  speed: number;
  phase: LanePhase;
  completedAt: number | null;
};

type SimulationSnapshot = {
  startedAt: number;
  now: number;
  completedTasks: number;
  accumulatedTaskMs: number;
  lanes: LaneCycle[];
};

type BoardCopy = {
  titleLines: string[];
  taskLabel: string;
  headerSummary: string;
  steps: string[];
  activeStates: string[];
  completedState: string;
  metrics: {
    completed: string;
    efficiency: string;
    serialTime: string;
    elapsedTime: string;
    formula: string;
    serialHint: string;
  };
};

interface HeroWorkflowBoardProps {
  locale?: Locale;
}

const AGENTS: AgentSpec[] = [
  { name: 'Claude Code', accent: '#34d399', glow: 'rgba(52, 211, 153, 0.34)' },
  { name: 'Codex', accent: '#60a5fa', glow: 'rgba(96, 165, 250, 0.34)' },
  { name: 'GitHub Copilot', accent: '#a78bfa', glow: 'rgba(167, 139, 250, 0.34)' },
  { name: 'OpenCode', accent: '#fb7185', glow: 'rgba(251, 113, 133, 0.34)' },
  { name: 'Hermes', accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.34)' },
  { name: 'Kiro', accent: '#22d3ee', glow: 'rgba(34, 211, 238, 0.34)' },
  { name: 'QoderCLI', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.34)' },
  { name: 'Kimi', accent: '#f472b6', glow: 'rgba(244, 114, 182, 0.34)' },
  { name: 'Gemini CLI', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.34)' },
  { name: 'DeepAgents', accent: '#4ade80', glow: 'rgba(74, 222, 128, 0.34)' },
  { name: 'Codebuddy', accent: '#facc15', glow: 'rgba(250, 204, 21, 0.34)' },
];

const LANE_COUNT = 5;
const BASE_STAGE_DURATIONS = [1200, 2100, 2900, 1100] as const;
const BASE_TOTAL_DURATION = BASE_STAGE_DURATIONS.reduce((sum, value) => sum + value, 0);
const CARD_EXIT_MS = 460;
const CARD_ENTER_MS = 420;
const HERO_IMAGES = [
  '/img/home/interesting/heroes/aurora-04.webp',
  '/img/home/interesting/heroes/cat-ink-09.webp',
  '/img/home/interesting/heroes/cat-line-03.webp',
  '/img/home/interesting/heroes/cat-oil-09.webp',
  '/img/home/interesting/heroes/cat-paper-04.webp',
  '/img/home/interesting/heroes/cat-sticker-02.webp',
  '/img/home/interesting/heroes/cat-sticker-08.webp',
  '/img/home/interesting/heroes/royal-10.webp',
  '/img/home/interesting/heroes/thorn-06.webp',
  '/img/home/interesting/heroes/tide-09.webp',
] as const;

const COPY: Record<Locale, BoardCopy> = {
  'zh-CN': {
    titleLines: ['主流 Agent 全面支持', '并行管理效率10X', 'OpenSpec 减少幻觉'],
    taskLabel: '任务',
    headerSummary: '任务 / Agent',
    steps: ['新建主意', '生成提案', '执行提案', '归档提案'],
    activeStates: ['构思中', '提案中', '执行中', '归档中'],
    completedState: '已完成',
    metrics: {
      completed: '已完成任务',
      efficiency: '当前效率',
      serialTime: '累计串行工时',
      elapsedTime: '自然流逝时间',
      formula: '运行效率 = 累计串行工时 / 自然流逝时间',
      serialHint: '相当于单串行的持续提速',
    },
  },
  en: {
    titleLines: ['Mainstream Agents Supported', '10x Parallel Management Efficiency', 'OpenSpec Reduces Hallucinations'],
    taskLabel: 'Task',
    headerSummary: 'Task / Agent',
    steps: ['Ideate', 'Propose', 'Execute', 'Archive'],
    activeStates: ['Ideating', 'Proposing', 'Executing', 'Archiving'],
    completedState: 'Complete',
    metrics: {
      completed: 'Completed Tasks',
      efficiency: 'Live Efficiency',
      serialTime: 'Equivalent Serial Time',
      elapsedTime: 'Elapsed Time',
      formula: 'Efficiency = equivalent serial work / natural elapsed time',
      serialHint: 'relative to a single serial worker',
    },
  },
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickAgent(previousName?: string) {
  const candidates = AGENTS.filter((agent) => agent.name !== previousName);
  const pool = candidates.length > 0 ? candidates : AGENTS;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? AGENTS[0];
}

function pickHeroVariant(previousVariant?: number) {
  const variants = Array.from({ length: HERO_IMAGES.length }, (_, index) => index);
  const pool = variants.filter((variant) => variant !== previousVariant);
  const candidates = pool.length > 0 ? pool : variants;
  return candidates[Math.floor(Math.random() * candidates.length)] ?? 0;
}

function createLaneCycle(
  laneId: number,
  startedAt: number,
  taskId: number,
  previousAgentName?: string,
  phase: LanePhase = 'running',
  phaseStartedAt = startedAt,
): LaneCycle {
  const agent = pickAgent(previousAgentName);
  const pace = randomBetween(0.72, 1.34);
  const laneBias = 0.92 + laneId * 0.035;

  const stageDurations = BASE_STAGE_DURATIONS.map((duration, index) => {
    const stageBias = index === 2 ? randomBetween(1.02, 1.18) : randomBetween(0.84, 1.12);
    return Math.max(640, Math.round(duration * pace * laneBias * stageBias));
  });

  const totalDuration = stageDurations.reduce((sum, value) => sum + value, 0);
  const speed = Number((BASE_TOTAL_DURATION / totalDuration).toFixed(2));

  return {
    laneId,
    taskId,
    agent,
    heroVariant: pickHeroVariant(),
    startedAt,
    phaseStartedAt,
    stageDurations,
    totalDuration,
    speed,
    phase,
    completedAt: null,
  };
}

function createInitialSnapshot(now: number): SimulationSnapshot {
  return {
    startedAt: now,
    now,
    completedTasks: 0,
    accumulatedTaskMs: 0,
    lanes: Array.from({ length: LANE_COUNT }, (_, laneIndex) => {
      const offset = laneIndex * 180;
      return createLaneCycle(laneIndex, now - offset, laneIndex + 1);
    }),
  };
}

function advanceSimulation(snapshot: SimulationSnapshot, now: number): SimulationSnapshot {
  let completedTasks = snapshot.completedTasks;
  let accumulatedTaskMs = snapshot.accumulatedTaskMs;

  const lanes = snapshot.lanes.map((lane) => {
    let currentLane = lane;

    while (true) {
      if (currentLane.phase === 'running' && now >= currentLane.startedAt + currentLane.totalDuration) {
        const finishedAt = currentLane.startedAt + currentLane.totalDuration;
        completedTasks += 1;
        accumulatedTaskMs += currentLane.totalDuration;
        currentLane = {
          ...currentLane,
          phase: 'completed',
          phaseStartedAt: finishedAt,
          completedAt: finishedAt,
        };
        continue;
      }

      if (currentLane.phase === 'completed' && currentLane.completedAt !== null && now >= currentLane.phaseStartedAt + CARD_EXIT_MS) {
        const enteringAt = currentLane.phaseStartedAt + CARD_EXIT_MS;
        const nextLane = createLaneCycle(
          currentLane.laneId,
          enteringAt + CARD_ENTER_MS,
          currentLane.taskId + LANE_COUNT,
          currentLane.agent.name,
          'entering',
          enteringAt,
        );
        currentLane = {
          ...nextLane,
          heroVariant: pickHeroVariant(currentLane.heroVariant),
        };
        continue;
      }

      if (currentLane.phase === 'entering' && now >= currentLane.phaseStartedAt + CARD_ENTER_MS) {
        currentLane = {
          ...currentLane,
          phase: 'running',
          phaseStartedAt: currentLane.startedAt,
        };
        continue;
      }

      break;
    }

    return currentLane;
  });

  return {
    startedAt: snapshot.startedAt,
    now,
    completedTasks,
    accumulatedTaskMs,
    lanes,
  };
}

function getLaneProgress(lane: LaneCycle, now: number) {
  if (lane.phase === 'entering') {
    return {
      activeStepIndex: 0,
      stepProgresses: lane.stageDurations.map(() => 0),
      overallProgress: 0,
      isCompleted: false,
    };
  }

  if (lane.phase === 'completed') {
    return {
      activeStepIndex: lane.stageDurations.length - 1,
      stepProgresses: lane.stageDurations.map(() => 0),
      overallProgress: 0,
      isCompleted: true,
    };
  }

  const elapsed = Math.max(0, Math.min(now - lane.startedAt, lane.totalDuration));
  let consumed = 0;
  let activeStepIndex = lane.stageDurations.length - 1;
  let activeSet = false;

  const stepProgresses = lane.stageDurations.map((duration, index) => {
    const stepElapsed = Math.max(0, Math.min(elapsed - consumed, duration));
    const progress = duration === 0 ? 1 : stepElapsed / duration;

    if (!activeSet && elapsed < consumed + duration) {
      activeStepIndex = index;
      activeSet = true;
    }

    consumed += duration;
    return progress;
  });

  return {
    activeStepIndex,
    stepProgresses,
    overallProgress: lane.totalDuration === 0 ? 1 : elapsed / lane.totalDuration,
    isCompleted: false,
  };
}

function formatDuration(durationMs: number, locale: Locale) {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (locale === 'zh-CN') {
    if (minutes > 0) {
      return `${minutes}分 ${seconds.toString().padStart(2, '0')}秒`;
    }

    return `${seconds}秒`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  }

  return `${seconds}s`;
}

export default function HeroWorkflowBoard({ locale = 'zh-CN' }: HeroWorkflowBoardProps) {
  const copy = COPY[locale];
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [snapshot, setSnapshot] = useState<SimulationSnapshot>(() => createInitialSnapshot(0));
  const snapshotRef = useRef<SimulationSnapshot>(snapshot);

  useEffect(() => {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const initialSnapshot = createInitialSnapshot(now);
    snapshotRef.current = initialSnapshot;
    setSnapshot(initialSnapshot);

    const intervalMs = shouldReduceMotion ? 420 : 160;
    const timerId = window.setInterval(() => {
      const currentNow = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const nextSnapshot = advanceSimulation(snapshotRef.current, currentNow);
      snapshotRef.current = nextSnapshot;
      setSnapshot(nextSnapshot);
    }, intervalMs);

    return () => {
      window.clearInterval(timerId);
    };
  }, [shouldReduceMotion]);

  const metrics = useMemo(() => {
    const elapsedMs = Math.max(snapshot.now - snapshot.startedAt, 1000);
    const inFlightWorkMs = snapshot.lanes.reduce((sum, lane) => {
      return sum + Math.max(0, Math.min(snapshot.now - lane.startedAt, lane.totalDuration));
    }, 0);

    const equivalentSerialMs = snapshot.accumulatedTaskMs + inFlightWorkMs;
    const efficiency = equivalentSerialMs / elapsedMs;
    const formatter = new Intl.NumberFormat(locale === 'zh-CN' ? 'zh-CN' : 'en-US');

    return {
      completedTasks: formatter.format(snapshot.completedTasks),
      efficiency: `${efficiency.toFixed(1)}x`,
      equivalentSerial: formatDuration(equivalentSerialMs, locale),
      elapsed: formatDuration(elapsedMs, locale),
    };
  }, [locale, snapshot]);

  return (
    <motion.section
      className={styles.boardSection}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.9, 0.2, 1] }}
      aria-labelledby="hero-workflow-title"
    >
      <div className={styles.boardHeader}>
        <h3 id="hero-workflow-title" className={styles.title}>
          {copy.titleLines.map((line) => (
            <span key={line} className={styles.titleLine}>{line}</span>
          ))}
        </h3>
      </div>

      <div className={styles.boardPanel}>
        <div className={styles.sparkle} aria-hidden="true" />
        <div className={styles.sparkleTwo} aria-hidden="true" />

        <div className={styles.tableHeader}>
          <span className={styles.summaryHeader}>{copy.headerSummary}</span>
          <div className={styles.stepHeaderGrid}>
            {copy.steps.map((step) => (
              <span key={step} className={styles.stepHeaderCell}>{step}</span>
            ))}
          </div>
        </div>

        <div className={styles.laneStack}>
          {snapshot.lanes.map((lane) => {
            const progress = getLaneProgress(lane, snapshot.now);
            const laneStyle = {
              '--lane-accent': lane.agent.accent,
              '--lane-glow': lane.agent.glow,
            } as CSSProperties;

            return (
              <article
                key={lane.laneId}
                className={styles.laneRow}
                style={laneStyle}
                data-phase={lane.phase}
              >
                <div className={styles.laneSummary}>
                  <div className={styles.summaryTopline}>
                    <span className={styles.heroAvatar}>
                      <img
                        src={withBasePath(HERO_IMAGES[lane.heroVariant] ?? HERO_IMAGES[0])}
                        alt=""
                        className={styles.heroAvatarImage}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className={styles.agentBadge}>{lane.agent.name}</span>
                    <span className={styles.taskBadge}>{copy.taskLabel} #{lane.taskId}</span>
                  </div>
                </div>

                <div className={styles.stepGrid}>
                  {copy.steps.map((step, stepIndex) => {
                    const stepProgress = Math.max(0, Math.min(progress.stepProgresses[stepIndex] ?? 0, 1));
                    const stepState = progress.isCompleted
                      ? 'celebrate'
                      : stepProgress >= 1
                        ? 'done'
                        : stepIndex === progress.activeStepIndex
                          ? 'active'
                          : 'idle';
                    const stepStyle = {
                      '--step-progress': `${stepProgress * 100}%`,
                      '--step-index': stepIndex,
                    } as CSSProperties;

                    return (
                      <div
                        key={`${lane.laneId}-${step}`}
                        className={styles.stepCell}
                        data-state={stepState}
                        style={stepStyle}
                        aria-label={`${step} ${progress.isCompleted ? copy.completedState : copy.activeStates[Math.min(stepIndex, copy.activeStates.length - 1)]}`}
                      />
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.metricsPanel}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{copy.metrics.completed}</span>
            <strong className={styles.metricValue}>{metrics.completedTasks}</strong>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{copy.metrics.efficiency}</span>
            <strong className={styles.metricValue}>{metrics.efficiency}</strong>
            <span className={styles.metricHint}>{copy.metrics.serialHint}</span>
          </div>
        </div>

        <div className={styles.metricsFooter}>
          <span>{copy.metrics.serialTime}: {metrics.equivalentSerial}</span>
          <span>{copy.metrics.elapsedTime}: {metrics.elapsed}</span>
          <span>{copy.metrics.formula}</span>
        </div>
      </div>
    </motion.section>
  );
}
