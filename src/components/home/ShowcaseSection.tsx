import { useEffect, useState } from 'react';
import { homeShowcaseImages } from '@/assets/siteAssetUrls';
import type { HomepageShowcaseCopy } from '@/lib/homepage-section-copy';
import styles from './ShowcaseSection.module.css';

interface ScreenshotItem {
  id: HomepageShowcaseCopy['screenshots'][number]['id'];
  src: string;
  title: string;
  description: string;
  alt: string;
}

const screenshotSources: Record<HomepageShowcaseCopy['screenshots'][number]['id'], string> = {
  proposalWorkflow: homeShowcaseImages.proposalWorkflow,
  sessionBoard: homeShowcaseImages.sessionBoard,
  tokenAnalytics: homeShowcaseImages.tokenAnalytics,
  workspaceManagement: homeShowcaseImages.workspaceManagement,
  achievementProgress: homeShowcaseImages.achievementProgress,
};

const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.currentTarget;
  target.style.display = 'none';

  const parent = target.parentElement;
  if (parent && !parent.querySelector(`.${styles.screenshotPlaceholder}`)) {
    const placeholder = document.createElement('div');
    placeholder.className = styles.screenshotPlaceholder;
    placeholder.textContent = target.dataset.fallbackLabel || 'Image unavailable';
    parent.insertBefore(placeholder, target.nextSibling);
  }
};

function formatOrder(index: number) {
  return String(index + 1).padStart(2, '0');
}

interface Props {
  copy: HomepageShowcaseCopy;
}

export default function ShowcaseSection({ copy }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const featuredPanelId = 'homepage-showcase-featured';
  const screenshots: ScreenshotItem[] = copy.screenshots.map((screenshot) => ({
    ...screenshot,
    src: screenshotSources[screenshot.id],
  }));
  const activeScreenshot = screenshots[activeIndex] ?? screenshots[0];

  useEffect(() => {
    if (!isFullscreenOpen || typeof window === 'undefined') {
      return undefined;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreenOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreenOpen]);

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
            <div className={styles.featuredMedia}>
              <button
                type="button"
                className={styles.featuredPreviewButton}
                onClick={() => setIsFullscreenOpen(true)}
                aria-label={`${copy.controls.openFullscreen}${activeScreenshot.title}`}
              >
                <img
                  key={activeScreenshot.id}
                  src={activeScreenshot.src}
                  alt={activeScreenshot.alt}
                  className={styles.featuredImage}
                  onError={handleImageError}
                  data-fallback-label={copy.controls.imageUnavailable}
                  loading="lazy"
                />
                <span className={styles.featuredPreviewHint}>
                  {copy.controls.openFullscreenHint}
                </span>
              </button>
            </div>

            <div className={styles.featuredContent} aria-live="polite" aria-atomic="true">
              <div className={styles.featuredCopy}>
                <p className={styles.featuredEyebrow}>
                  {copy.controls.current}
                  <span className={styles.featuredCounter}>
                    {formatOrder(activeIndex)} / {totalScreenshots}
                  </span>
                </p>
                <h3 className={styles.featuredTitle}>{activeScreenshot.title}</h3>
                <p className={styles.featuredDescription}>{activeScreenshot.description}</p>
              </div>

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
          </article>

          <div className={styles.thumbnailRail} aria-label={copy.controls.railLabel}>
            {screenshots.map((screenshot, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={screenshot.id}
                  type="button"
                  className={`${styles.thumbnailButton} ${isActive ? styles.thumbnailButtonActive : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`${copy.controls.selectPrefix}${screenshot.title}`}
                  aria-controls={featuredPanelId}
                >
                  <span className={styles.thumbnailOrder}>{formatOrder(index)}</span>

                  <span className={styles.thumbnailPreview} aria-hidden="true">
                    <img
                      src={screenshot.src}
                      alt=""
                      className={styles.thumbnailImage}
                      onError={handleImageError}
                      data-fallback-label={copy.controls.imageUnavailable}
                      loading="lazy"
                    />
                  </span>

                  <span className={styles.thumbnailText}>
                    <span className={styles.thumbnailTitle}>{screenshot.title}</span>
                    <span className={styles.thumbnailDescription}>{screenshot.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isFullscreenOpen ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activeScreenshot.title}
          onClick={() => setIsFullscreenOpen(false)}
        >
          <div className={styles.lightboxInner} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setIsFullscreenOpen(false)}
              aria-label={copy.controls.closeFullscreen}
            >
              {copy.controls.closeFullscreen}
            </button>

            <figure className={styles.lightboxFigure}>
              <img
                src={activeScreenshot.src}
                alt={activeScreenshot.alt}
                className={styles.lightboxImage}
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
