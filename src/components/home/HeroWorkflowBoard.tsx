/**
 * Hero "agent lanes": several agents, each taking its own task through the four stages
 * (ideate -> propose -> execute -> archive) and starting over the moment a run is archived.
 *
 * The motion is the point and it costs almost nothing: every lane is one CSS timeline
 * (`--d` long, started `--delay` seconds in), and every mark on it (fill, node, stage label,
 * occupancy pip, task name, return arc) is a keyframe window over that same timeline. There is
 * no JS tick, no state per frame, and the markup is identical on the server and the client. The
 * lanes run at different periods, so they drift out of step instead of marching in lockstep.
 *
 * The only client logic is the courtesy layer: a pause control (WCAG 2.2.2), and pausing while
 * the board is off screen or the tab is hidden. `prefers-reduced-motion` freezes the same
 * timelines on a snapshot where every lane sits in a different stage.
 *
 * The stage windows here and the keyframe percentages in the stylesheet are one set of numbers:
 * ideate 0-16%, propose 16-40%, execute 40-78%, archive 78-90%, "complete" 90-98%.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './HeroWorkflowBoard.module.css';
import type { HomepageWorkflowBoardCopy } from '@/lib/homepage-runtime-copy';

interface HeroWorkflowBoardProps {
  locale?: string;
  copy: HomepageWorkflowBoardCopy;
}

type Lane = {
  agent: string;
  /** Seconds for one run, ideate through archive. */
  durationS: number;
  /** Where in its run the lane is at first paint, 0-1. Spread so every stage is occupied. */
  startFraction: number;
};

// Product names, not localized copy. Periods differ so the lanes never line up.
const LANES: Lane[] = [
  { agent: 'Claude Code', durationS: 13, startFraction: 0.62 },
  { agent: 'Codex', durationS: 16, startFraction: 0.3 },
  { agent: 'GitHub Copilot', durationS: 14, startFraction: 0.08 },
  { agent: 'OpenCode', durationS: 18, startFraction: 0.83 },
  { agent: 'Hermes', durationS: 15, startFraction: 0.5 },
];

const STAGES = [0, 1, 2, 3] as const;

function mod(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function seconds(value: number) {
  return `${Number(value.toFixed(3))}s`;
}

function formatList(items: string[], locale: string) {
  try {
    return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(items);
  } catch {
    return items.join(', ');
  }
}

function laneTimeline(lane: Lane): CSSProperties {
  return {
    '--d': seconds(lane.durationS),
    '--delay': seconds(-lane.startFraction * lane.durationS),
  } as CSSProperties;
}

/**
 * Task names rotate on a timeline four runs long, one name per run, shifted per lane so each
 * lane starts on a different task. Returns the delay that puts task `taskIndex` on its turn.
 */
function taskDelay(lane: Lane, laneIndex: number, taskIndex: number, taskCount: number) {
  const runsBeforeShowing = mod(taskIndex - laneIndex, taskCount);
  const elapsed = mod(
    lane.startFraction * lane.durationS - runsBeforeShowing * lane.durationS,
    taskCount * lane.durationS,
  );
  return seconds(-elapsed);
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <rect x="3.5" y="3" width="3" height="10" rx="0.75" fill="currentColor" />
      <rect x="9.5" y="3" width="3" height="10" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path d="M4.5 2.75v10.5L13 8z" fill="currentColor" />
    </svg>
  );
}

export default function HeroWorkflowBoard({ locale = 'en-US', copy }: HeroWorkflowBoardProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [idle, setIdle] = useState(false);

  // Nothing animates while nobody can see it.
  useEffect(() => {
    const root = rootRef.current;
    let onScreen = true;
    let tabVisible = typeof document === 'undefined' || document.visibilityState !== 'hidden';

    const sync = () => setIdle(!onScreen || !tabVisible);
    const handleVisibility = () => {
      tabVisible = document.visibilityState !== 'hidden';
      sync();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | undefined;
    if (root && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          onScreen = entries.some((entry) => entry.isIntersecting);
          sync();
        },
        { rootMargin: '80px 0px' },
      );
      observer.observe(root);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer?.disconnect();
    };
  }, []);

  const diagramLabel = copy.diagramLabel
    .replace('{agents}', formatList(LANES.map((lane) => lane.agent), locale))
    .replace('{stages}', formatList(copy.steps, locale));
  const taskCount = copy.tasks.length;

  return (
    <section
      ref={rootRef}
      className={styles.board}
      data-paused={userPaused || idle ? 'true' : undefined}
      aria-labelledby="hero-workflow-title"
    >
      <header className={styles.header}>
        <div className={styles.intro}>
          <h3 id="hero-workflow-title" className={styles.title}>
            {copy.title}
          </h3>
          <p className={styles.description}>{copy.description}</p>
        </div>

        <div className={styles.controls}>
          <span className={styles.tag}>{copy.illustrative}</span>
          <button
            type="button"
            className={styles.toggle}
            aria-label={userPaused ? copy.play : copy.pause}
            onClick={() => setUserPaused((value) => !value)}
          >
            {userPaused ? <PlayIcon /> : <PauseIcon />}
            <span className={styles.toggleLabel}>{userPaused ? copy.play : copy.pause}</span>
          </button>
        </div>
      </header>

      <div className={styles.diagram} role="img" aria-label={diagramLabel}>
        <div className={styles.head} aria-hidden="true">
          <span className={styles.headSummary}>{copy.headerSummary}</span>
          {STAGES.map((stage) => (
            <div key={stage} className={styles.headCell} data-stage={stage}>
              <span className={styles.headLabel}>
                <span className={styles.key} />
                {copy.steps[stage]}
              </span>
              {/* One pip per lane; it lights while that lane is in this stage. */}
              <span className={styles.pips}>
                {LANES.map((lane) => (
                  <span key={lane.agent} className={styles.pip}>
                    <span className={styles.pipLit} style={laneTimeline(lane)} />
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

        <ol className={styles.lanes} aria-hidden="true">
          {LANES.map((lane, laneIndex) => (
            <li key={lane.agent} className={styles.lane} style={laneTimeline(lane)}>
              <div className={styles.agent}>
                <span className={styles.agentName}>{lane.agent}</span>
                <span className={styles.tasks}>
                  {copy.tasks.map((task, taskIndex) => (
                    <span
                      key={task}
                      className={styles.task}
                      style={
                        {
                          '--task-d': seconds(lane.durationS * taskCount),
                          '--task-delay': taskDelay(lane, laneIndex, taskIndex, taskCount),
                        } as CSSProperties
                      }
                    >
                      {task}
                    </span>
                  ))}
                </span>
              </div>

              {STAGES.map((stage) => (
                <div key={stage} className={styles.cell} data-stage={stage}>
                  <span className={styles.track} />
                  <span className={styles.node} />
                  <span className={styles.progress}>
                    <span className={styles.seg} />
                    <span className={styles.nodeFill} />
                    <span className={styles.pulse}>
                      <span className={styles.ring} />
                    </span>
                    {stage === STAGES.length - 1 && <span className={styles.cap} />}
                  </span>
                  <span className={styles.state}>{copy.activeStates[stage]}</span>
                  {stage === STAGES.length - 1 && (
                    <span className={`${styles.state} ${styles.stateDone}`}>{copy.completedState}</span>
                  )}
                </div>
              ))}
            </li>
          ))}
        </ol>

        {/* Archive feeds the next proposal: the arc lights each time a lane finishes a run. */}
        <div className={styles.loop} aria-hidden="true">
          <span className={styles.loopArc}>
            {LANES.map((lane) => (
              <span key={lane.agent} className={styles.loopSweep} style={laneTimeline(lane)} />
            ))}
          </span>
          <span className={styles.loopHead} />
          <span className={styles.loopLabel}>{copy.loopLabel}</span>
        </div>
      </div>
    </section>
  );
}
