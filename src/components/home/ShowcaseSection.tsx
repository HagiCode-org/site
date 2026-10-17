import { useEffect, useMemo, useRef, useState, type ImgHTMLAttributes } from 'react';
import { flushSync } from 'react-dom';
import type { HomepageShowcaseCopy } from '@/lib/homepage-section-copy';
import styles from './ShowcaseSection.module.css';

type ScreenshotId = HomepageShowcaseCopy['screenshots'][number]['id'];

interface ShowcaseImageSources {
  avif: string;
  webp: string;
  src: string;
}

interface ScreenshotItem {
  id: ScreenshotId;
  sources: ShowcaseImageSources;
  title: string;
  description: string;
  alt: string;
}

function ScreenshotPicture({
  sources,
  ...imgProps
}: ImgHTMLAttributes<HTMLImageElement> & { sources: ShowcaseImageSources }) {
  return (
    <picture>
      <source type="image/avif" srcSet={sources.avif} />
      <source type="image/webp" srcSet={sources.webp} />
      <img src={sources.src} {...imgProps} />
    </picture>
  );
}

const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.currentTarget;
  target.style.display = 'none';

  const anchor = target.closest('picture') ?? target;
  const parent = anchor.parentElement;
  if (parent && !parent.querySelector(`.${styles.screenshotPlaceholder}`)) {
    const placeholder = document.createElement('div');
    placeholder.className = styles.screenshotPlaceholder;
    placeholder.textContent = target.dataset.fallbackLabel || 'Image unavailable';
    parent.insertBefore(placeholder, anchor.nextSibling);
  }
};

function formatOrder(index: number) {
  return String(index + 1).padStart(2, '0');
}

/** Keep in step with --showcase-wipe-duration in ShowcaseSection.module.css. */
const WIPE_SETTLE_MS = 820;

interface OutgoingShot {
  index: number;
  direction: 1 | -1;
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface Props {
  copy: HomepageShowcaseCopy;
  images: Record<ScreenshotId, ShowcaseImageSources>;
}

export default function ShowcaseSection({ copy, images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [shownIndex, setShownIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<OutgoingShot | null>(null);
  const previewButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const railRef = useRef<HTMLOListElement | null>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const featuredPanelId = 'homepage-showcase-featured';

  const screenshots: ScreenshotItem[] = useMemo(
    () => copy.screenshots.map((screenshot) => ({
      ...screenshot,
      sources: images[screenshot.id],
    })),
    [copy.screenshots, images],
  );

  const activeScreenshot = screenshots[activeIndex] ?? screenshots[0];

  // The stage keeps the previous capture underneath while the next one is
  // revealed over it, so a switch never flashes an empty frame.
  if (shownIndex !== activeIndex) {
    setOutgoing({ index: shownIndex, direction: activeIndex > shownIndex ? 1 : -1 });
    setShownIndex(activeIndex);
  }

  useEffect(() => {
    if (!outgoing) {
      return undefined;
    }

    const timer = window.setTimeout(
      () => setOutgoing(null),
      prefersReducedMotion() ? 0 : WIPE_SETTLE_MS,
    );

    return () => window.clearTimeout(timer);
  }, [outgoing]);

  const outgoingScreenshot = outgoing ? screenshots[outgoing.index] : undefined;

  // Same-document View Transition: the featured capture grows into the lightbox
  // and shrinks back on close. Browsers without the API just toggle the state.
  const setFullscreen = (open: boolean) => {
    const startViewTransition = (document as Document & {
      startViewTransition?: (update: () => void) => unknown;
    }).startViewTransition?.bind(document);

    if (!startViewTransition || prefersReducedMotion()) {
      setIsFullscreenOpen(open);
      return;
    }

    startViewTransition(() => flushSync(() => setIsFullscreenOpen(open)));
  };

  useEffect(() => {
    if (!isFullscreenOpen || typeof window === 'undefined') {
      return undefined;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    const returnTarget = previewButtonRef.current;

    return () => {
      body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      returnTarget?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreenOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const steps = stepRefs.current.filter((step): step is HTMLElement => step instanceof HTMLElement);
    if (steps.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const nextTarget = visibleEntries[0]?.target as HTMLElement | undefined;
        if (!nextTarget) {
          return;
        }

        const nextIndex = Number(nextTarget.dataset.index ?? '-1');
        if (Number.isFinite(nextIndex) && nextIndex >= 0) {
          setActiveIndex(nextIndex);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -35% 0px',
        threshold: [0.35, 0.55, 0.75],
      },
    );

    steps.forEach((step) => observer.observe(step));

    return () => {
      observer.disconnect();
    };
  }, [screenshots.length]);

  useEffect(() => {
    const railNode = railRef.current;
    const activeNode = stepRefs.current[activeIndex];

    if (!railNode || !activeNode) {
      return;
    }

    const isCompact = window.matchMedia('(max-width: 1080px)').matches;
    if (!isCompact) {
      return;
    }

    activeNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [activeIndex]);

  if (!activeScreenshot) {
    return null;
  }

  const totalScreenshots = String(screenshots.length).padStart(2, '0');
  const previousDisabled = activeIndex === 0;
  const nextDisabled = activeIndex === screenshots.length - 1;

  const goToPrevious = () => {
    if (!previousDisabled) {
      setActiveIndex((currentIndex) => currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (!nextDisabled) {
      setActiveIndex((currentIndex) => currentIndex + 1);
    }
  };

  return (
    <section className={styles.showcaseSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{copy.title}</h2>
          <p className={styles.sectionDescription}>{copy.description}</p>
        </div>

        <div className={styles.showcaseLayout}>
          <article className={styles.featuredPanel} id={featuredPanelId}>
            <div className={styles.featuredPanelTopline}>
              <p className={styles.featuredEyebrow}>
                <span>{copy.controls.current}</span>
                <span className={styles.featuredCounter}>
                  {formatOrder(activeIndex)} / {totalScreenshots}
                </span>
              </p>

              <div className={styles.featuredControls}>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={goToPrevious}
                  disabled={previousDisabled}
                  aria-label={copy.controls.previous}
                  aria-controls={featuredPanelId}
                >
                  {copy.controls.previous}
                </button>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={goToNext}
                  disabled={nextDisabled}
                  aria-label={copy.controls.next}
                  aria-controls={featuredPanelId}
                >
                  {copy.controls.next}
                </button>
              </div>
            </div>

            <div className={styles.featuredMedia}>
              <button
                type="button"
                ref={previewButtonRef}
                className={styles.featuredPreviewButton}
                onClick={() => setFullscreen(true)}
                aria-label={`${copy.controls.openFullscreen}${activeScreenshot.title}`}
              >
                <span className={styles.stage}>
                  {outgoingScreenshot ? (
                    <span
                      key={`out-${outgoingScreenshot.id}`}
                      className={styles.stageLayer}
                      aria-hidden="true"
                    >
                      <ScreenshotPicture
                        sources={outgoingScreenshot.sources}
                        alt=""
                        className={styles.featuredImage}
                        onError={handleImageError}
                        data-fallback-label={copy.controls.imageUnavailable}
                      />
                    </span>
                  ) : null}
                  <span
                    key={activeScreenshot.id}
                    className={`${styles.stageLayer} ${outgoing ? styles.stageEnter : ''} ${isFullscreenOpen ? '' : styles.morphSource}`}
                    data-direction={outgoing?.direction === -1 ? 'back' : 'forward'}
                  >
                    <ScreenshotPicture
                      sources={activeScreenshot.sources}
                      alt={activeScreenshot.alt}
                      className={styles.featuredImage}
                      onError={handleImageError}
                      data-fallback-label={copy.controls.imageUnavailable}
                      fetchPriority="high"
                    />
                  </span>
                </span>
                <span className={styles.featuredPreviewHint}>
                  {copy.controls.openFullscreenHint}
                </span>
              </button>
            </div>

            <div className={styles.featuredContent} aria-live="polite" aria-atomic="true">
              <div
                className={`${styles.featuredCopy} ${outgoing ? styles.copyEnter : ''}`}
                key={activeScreenshot.id}
              >
                <p className={styles.featuredState}>{copy.controls.activeState}</p>
                <h3 className={styles.featuredTitle}>{activeScreenshot.title}</h3>
                <p className={styles.featuredDescription}>{activeScreenshot.description}</p>
              </div>
            </div>
          </article>

          <ol className={styles.tourRail} aria-label={copy.controls.railLabel} ref={railRef}>
            {screenshots.map((screenshot, index) => {
              const isActive = index === activeIndex;

              return (
                <li
                  key={screenshot.id}
                  className={`${styles.tourStep} ${isActive ? styles.tourStepActive : ''}`}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  data-index={index}
                >
                  <button
                    type="button"
                    className={styles.thumbnailButton}
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`${copy.controls.selectPrefix}${screenshot.title}`}
                    aria-controls={featuredPanelId}
                  >
                    <span className={styles.thumbnailMeta}>
                      <span className={styles.thumbnailOrder}>{formatOrder(index)}</span>
                      <span className={styles.thumbnailStatus}>
                        {isActive ? copy.controls.activeState : copy.controls.previewState}
                      </span>
                    </span>

                    <span className={styles.thumbnailText}>
                      <span className={styles.thumbnailTitle}>{screenshot.title}</span>
                      <span className={styles.thumbnailDescription}>{screenshot.description}</span>
                    </span>

                    <span className={styles.thumbnailPreview} aria-hidden="true">
                      <ScreenshotPicture
                        sources={screenshot.sources}
                        alt=""
                        className={styles.thumbnailImage}
                        onError={handleImageError}
                        data-fallback-label={copy.controls.imageUnavailable}
                        loading="lazy"
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {isFullscreenOpen ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activeScreenshot.title}
          onClick={() => setFullscreen(false)}
        >
          <div className={styles.lightboxInner} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              ref={closeButtonRef}
              className={styles.lightboxClose}
              onClick={() => setFullscreen(false)}
              aria-label={copy.controls.closeFullscreen}
            >
              {copy.controls.closeFullscreen}
            </button>

            <figure className={styles.lightboxFigure}>
              <ScreenshotPicture
                sources={activeScreenshot.sources}
                alt={activeScreenshot.alt}
                className={`${styles.lightboxImage} ${styles.morphSource}`}
                onError={handleImageError}
                data-fallback-label={copy.controls.imageUnavailable}
              />
              <figcaption className={styles.lightboxCaption}>
                <h3 className={styles.lightboxTitle}>{activeScreenshot.title}</h3>
                <p className={styles.lightboxDescription}>{activeScreenshot.description}</p>
              </figcaption>
            </figure>
          </div>
        </div>
      ) : null}
    </section>
  );
}
