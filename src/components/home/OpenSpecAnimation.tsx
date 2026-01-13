import React, { useState, useEffect } from 'react';
import OpenSpecNode from './OpenSpecNode';
import FlowArrow from './FlowArrow';
import styles from './home.module.css';

interface Stage {
  id: string;
  label: string;
  icon: string;
  description: string;
  detail: string;
}

const stages: Stage[] = [
  {
    id: 'idea',
    label: 'Idea',
    icon: '💡',
    description: '从想法开始快速记录',
    detail: 'AI 辅助生成',
  },
  {
    id: 'proposal',
    label: 'Proposal',
    icon: '📄',
    description: 'AI 辅助生成提案',
    detail: '自动化评审',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: '⚙️',
    description: '任务驱动高效开发',
    detail: '驱动开发',
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: '✅',
    description: '自动归档知识沉淀',
    detail: '归档文档',
  },
];

const STAGE_DURATION = 2000; // 2 seconds per stage

// Custom hook for media query
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEventMap['change']) => setMatches(e.matches);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

export default function OpenSpecAnimation(): JSX.Element {
  const [activeStage, setActiveStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isPaused || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, STAGE_DURATION);

    return () => clearInterval(interval);
  }, [isPaused, mounted, prefersReducedMotion]);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  // Determine direction based on screen width
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const arrowDirection = isMobile || isTablet ? 'vertical' : 'horizontal';

  return (
    <section className={styles.openspecSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>OpenSpec 工作流</h2>
        <p className={styles.sectionSubtitle}>悬停查看详情 • 自动播放 • 循环演示</p>

        <div
          className={`${styles.openspecContainer} ${
            isMobile ? styles.mobile : isTablet ? styles.tablet : styles.desktop
          }`}
        >
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <OpenSpecNode
                stage={stage}
                isActive={activeStage === index}
                isPaused={isPaused}
                onHover={handlePause}
                onLeave={handleResume}
              />
              {index < stages.length - 1 && (
                <FlowArrow
                  isActive={activeStage === index}
                  direction={arrowDirection}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
