import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import type { HomepageShowcaseCopy } from '@/lib/homepage-section-copy';
import ShowcaseLightbox from './ShowcaseLightbox';
import {
  ChevronIcon,
  ExpandIcon,
  Shot,
  formatOrder,
  prefersReducedMotion,
  type ScreenshotId,
  type ScreenshotItem,
  type ShowcaseImageSources,
} from './ShowcaseParts';
import styles from './ShowcaseSection.module.css';

/** Keep in step with --showcase-enter-duration in ShowcaseSection.module.css. */
const ENTER_MS = 560;
const SWIPE_DISTANCE = 48;
const STAGE_SIZES = '(min-width: 75rem) 1200px, 100vw';

/** The slide being brought in; it is only revealed once its capture is decoded. */
interface Incoming {
  to: number;
  dir: 1 | -1;
  ready: boolean;
}

interface Props {
  copy: HomepageShowcaseCopy;
  images: Record<ScreenshotId, ShowcaseImageSources>;
}

export default function ShowcaseSection({ copy, images }: Props) {
  // `target` is what the visitor asked for and is the only thing input changes. `shown` is what the stage
  // fully displays. The effect below walks `shown` toward `target` one decoded, animated step at a time,
  // so a fast run of clicks never leaves two half-finished transitions stacked on each other.
  const [target, setTarget] = useState(0);
  const [shown, setShown] = useState(0);
  const [incoming, setIncoming] = useState<Incoming | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });
  const stageRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const swipedRef = useRef(false);
  const panelId = 'homepage-showcase-panel';

  const screenshots: ScreenshotItem[] = useMemo(
    () => copy.screenshots.map((screenshot) => ({
      ...screenshot,
      sources: images[screenshot.id],
    })),
    [copy.screenshots, images],
  );

  const last = screenshots.length - 1;
  const visible = incoming?.ready ? incoming.to : shown;

  useEffect(() => {
    if (incoming?.ready) {
      return;
    }
    if (target === shown) {
      if (incoming) {
        setIncoming(null);
      }
      return;
    }
    if (incoming?.to === target) {
      return;
    }
    setIncoming({ to: target, dir: target > shown ? 1 : -1, ready: false });
  }, [target, shown, incoming]);

  const commit = useCallback((to: number) => {
    setShown(to);
    setIncoming(null);
  }, []);

  const markReady = useCallback((to: number) => {
    setIncoming((current) => (current && current.to === to ? { ...current, ready: true } : current));
  }, []);

  // The reveal ends on animationend; this covers reduced motion (no animation) and any missed event.
  useEffect(() => {
    if (!incoming?.ready) {
      return undefined;
    }

    const { to } = incoming;
    if (prefersReducedMotion()) {
      commit(to);
      return undefined;
    }

    const timer = window.setTimeout(() => commit(to), ENTER_MS + 240);
    return () => window.clearTimeout(timer);
  }, [incoming, commit]);

  // Keep the chosen tab centred in the filmstrip without ever scrolling the page itself.
  useEffect(() => {
    const strip = stripRef.current;
    const tab = tabRefs.current[target];
    if (!strip || !tab || strip.scrollWidth <= strip.clientWidth) {
      return;
    }

    strip.scrollTo({
      left: tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [target]);

  const syncEdges = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) {
      return;
    }

    const start = strip.scrollLeft <= 1;
    const end = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
    setEdges((current) => (current.start === start && current.end === end ? current : { start, end }));
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener('resize', syncEdges);
    return () => window.removeEventListener('resize', syncEdges);
  }, [syncEdges]);

  if (screenshots.length === 0) {
    return null;
  }

  const visibleShot = screenshots[visible];
  const previousDisabled = target === 0;
  const nextDisabled = target === last;

  const step = (delta: number) => setTarget((current) => Math.min(last, Math.max(0, current + delta)));

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') {
      next = Math.min(last, index + 1);
    } else if (event.key === 'ArrowLeft') {
      next = Math.max(0, index - 1);
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = last;
    } else {
      return;
    }

    event.preventDefault();
    setTarget(next);
    tabRefs.current[next]?.focus();
  };

  const handleFrameKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target as HTMLElement).dataset.stageHit) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    }
  };

  const handleStagePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    swipedRef.current = false;
    swipeRef.current = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY };
  };

  const handleStagePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const swipe = swipeRef.current;
    swipeRef.current = null;
    if (!swipe) {
      return;
    }

    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swipedRef.current = true;
      step(dx < 0 ? 1 : -1);
    }
  };

  const renderLayer = (index: number, phase: 'rest' | 'leave' | 'wait' | 'enter', dir: 1 | -1) => {
    const item = screenshots[index];
    const isIncoming = phase === 'wait' || phase === 'enter';

    return (
      <span
        key={`shot-${item.id}`}
        className={styles.layer}
        data-phase={phase}
        style={{ '--dir': dir } as CSSProperties}
        aria-hidden={phase === 'leave' || phase === 'wait' ? true : undefined}
        onAnimationEnd={
          phase === 'enter'
            ? (event) => {
              if (event.target === event.currentTarget) {
                commit(index);
              }
            }
            : undefined
        }
      >
        <Shot
          sources={item.sources}
          sizes={STAGE_SIZES}
          alt={item.alt}
          fallbackLabel={copy.controls.imageUnavailable}
          loading={index === 0 && !incoming ? 'lazy' : 'eager'}
          onSettled={isIncoming ? () => markReady(index) : undefined}
        />
      </span>
    );
  };

  const neighbours = [shown - 1, shown + 1].filter((i) => i >= 0 && i <= last && i !== incoming?.to);

  return (
    <section className={styles.showcaseSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{copy.title}</h2>
          <p className={styles.sectionDescription}>{copy.description}</p>
        </div>

        <div className={styles.cinema}>
          <div
            className={styles.frame}
            id={panelId}
            role="tabpanel"
            aria-labelledby={`${panelId}-tab-${target}`}
            onKeyDown={handleFrameKeyDown}
          >
            <div className={styles.bar}>
              <p className={styles.counter}>
                <span className={styles.counterNow}>{formatOrder(visible)}</span> / {formatOrder(last)}
              </p>
              <button
                type="button"
                className={styles.enlarge}
                onClick={() => setLightboxOpen(true)}
                aria-label={`${copy.controls.openFullscreen}${visibleShot.title}`}
              >
                <ExpandIcon />
                <span className={styles.enlargeText}>{copy.controls.openFullscreenHint}</span>
              </button>
            </div>

            <div
              ref={stageRef}
              className={styles.stage}
              data-busy={incoming && !incoming.ready ? 'true' : undefined}
            >
              {renderLayer(shown, incoming?.ready ? 'leave' : 'rest', incoming?.dir ?? 1)}
              {incoming ? renderLayer(incoming.to, incoming.ready ? 'enter' : 'wait', incoming.dir) : null}
              <button
                type="button"
                className={styles.stageHit}
                data-stage-hit="true"
                tabIndex={-1}
                aria-hidden="true"
                onPointerDown={handleStagePointerDown}
                onPointerUp={handleStagePointerUp}
                onPointerCancel={() => {
                  swipeRef.current = null;
                }}
                onClick={() => {
                  if (swipedRef.current) {
                    swipedRef.current = false;
                    return;
                  }
                  setLightboxOpen(true);
                }}
              />
            </div>

            <div className={styles.foot}>
              <div className={styles.captions}>
                {screenshots.map((screenshot, index) => (
                  <div
                    key={screenshot.id}
                    className={styles.caption}
                    data-active={index === visible ? 'true' : 'false'}
                    aria-hidden={index === visible ? undefined : true}
                  >
                    <h3 className={styles.captionTitle}>{screenshot.title}</h3>
                    <p className={styles.captionText}>{screenshot.description}</p>
                  </div>
                ))}
              </div>

              <div className={styles.navGroup}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => step(-1)}
                  disabled={previousDisabled}
                  aria-label={copy.controls.previous}
                  aria-controls={panelId}
                >
                  <ChevronIcon direction="left" />
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => step(1)}
                  disabled={nextDisabled}
                  aria-label={copy.controls.next}
                  aria-controls={panelId}
                >
                  <ChevronIcon direction="right" />
                </button>
              </div>
            </div>
          </div>

          <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
            {visibleShot.title}
          </p>

          <div className={styles.stripWrap} data-start={edges.start} data-end={edges.end}>
            <div
              ref={stripRef}
              className={styles.strip}
              role="tablist"
              aria-label={copy.controls.railLabel}
              onScroll={syncEdges}
            >
              {screenshots.map((screenshot, index) => {
                const isSelected = index === target;

                return (
                  <button
                    key={screenshot.id}
                    type="button"
                    role="tab"
                    id={`${panelId}-tab-${index}`}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    className={styles.tab}
                    aria-selected={isSelected}
                    aria-controls={panelId}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setTarget(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                  >
                    <span className={styles.tabThumb}>
                      <Shot
                        sources={screenshot.sources.thumb}
                        alt=""
                        fallbackLabel={copy.controls.imageUnavailable}
                        loading="lazy"
                      />
                    </span>
                    <span className={styles.tabTitle}>{screenshot.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div hidden aria-hidden="true">
        {neighbours.map((i) => (
          <Shot
            key={screenshots[i].id}
            sources={screenshots[i].sources}
            sizes={STAGE_SIZES}
            alt=""
            fallbackLabel=""
            loading="eager"
          />
        ))}
      </div>

      {lightboxOpen ? (
        <ShowcaseLightbox
          screenshots={screenshots}
          index={target}
          copy={copy}
          getOrigin={() => stageRef.current}
          onNavigate={setTarget}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </section>
  );
}
