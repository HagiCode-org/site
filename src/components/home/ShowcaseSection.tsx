import { useEffect, useState } from 'react';
import { withBasePath } from '../../utils/path';
import { useTranslation } from '@/i18n/ui';
import { useLocale } from '@/lib/useLocale';
import styles from './ShowcaseSection.module.css';

interface ScreenshotItem {
  id: string;
  src: string;
  title: string;
  description: string;
  alt: string;
}

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

export default function ShowcaseSection({ locale: propLocale }: { locale?: 'zh-CN' | 'en' }) {
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Docs screenshot sources:
  // classic-proposal-view, kanban-view, token-metrics, vault-view, achivement-view
  const screenshots: ScreenshotItem[] = [
    {
      id: 'proposalWorkflow',
      src: withBasePath('/img/home/showcase-proposal-workflow.png'),
      title: t('showcase.screenshots.proposalWorkflow.title'),
      description: t('showcase.screenshots.proposalWorkflow.description'),
      alt: t('showcase.screenshots.proposalWorkflow.alt')
    },
    {
      id: 'sessionBoard',
      src: withBasePath('/img/home/showcase-session-board.png'),
      title: t('showcase.screenshots.sessionBoard.title'),
      description: t('showcase.screenshots.sessionBoard.description'),
      alt: t('showcase.screenshots.sessionBoard.alt')
    },
    {
      id: 'tokenAnalytics',
      src: withBasePath('/img/home/showcase-token-analytics.png'),
      title: t('showcase.screenshots.tokenAnalytics.title'),
      description: t('showcase.screenshots.tokenAnalytics.description'),
      alt: t('showcase.screenshots.tokenAnalytics.alt')
    },
    {
      id: 'workspaceManagement',
      src: withBasePath('/img/home/showcase-workspace-management.png'),
      title: t('showcase.screenshots.workspaceManagement.title'),
      description: t('showcase.screenshots.workspaceManagement.description'),
      alt: t('showcase.screenshots.workspaceManagement.alt')
    },
    {
      id: 'achievementProgress',
      src: withBasePath('/img/home/showcase-achievement-progress.png'),
      title: t('showcase.screenshots.achievementProgress.title'),
      description: t('showcase.screenshots.achievementProgress.description'),
      alt: t('showcase.screenshots.achievementProgress.alt')
    }
  ];

  const activeScreenshot = screenshots[activeIndex] ?? screenshots[0];
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

  return (
    <section className={styles.showcaseSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('showcase.title')}</h2>
          <p className={styles.sectionDescription}>{t('showcase.description')}</p>
        </div>

        <div className={styles.showcaseLayout}>
          <article className={styles.featuredPanel}>
            <div className={styles.featuredMedia}>
              <button
                type="button"
                className={styles.featuredPreviewButton}
                onClick={() => setIsFullscreenOpen(true)}
                aria-label={`${t('showcase.controls.openFullscreen')}${activeScreenshot.title}`}
              >
                <img
                  key={activeScreenshot.id}
                  src={activeScreenshot.src}
                  alt={activeScreenshot.alt}
                  className={styles.featuredImage}
                  onError={handleImageError}
                  data-fallback-label={t('showcase.controls.imageUnavailable')}
                  loading="lazy"
                />
                <span className={styles.featuredPreviewHint}>
                  {t('showcase.controls.openFullscreenHint')}
                </span>
              </button>
            </div>

            <div className={styles.featuredContent} aria-live="polite" aria-atomic="true">
              <div className={styles.featuredCopy}>
                <p className={styles.featuredEyebrow}>
                  {t('showcase.controls.current')}
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
                  aria-label={t('showcase.controls.previous')}
                >
                  {t('showcase.controls.previous')}
                </button>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={goToNext}
                  disabled={nextDisabled}
                  aria-label={t('showcase.controls.next')}
                >
                  {t('showcase.controls.next')}
                </button>
              </div>
            </div>
          </article>

          <div className={styles.thumbnailRail} aria-label={t('showcase.controls.railLabel')}>
            {screenshots.map((screenshot, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={screenshot.id}
                  type="button"
                  className={`${styles.thumbnailButton} ${isActive ? styles.thumbnailButtonActive : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  aria-label={`${t('showcase.controls.selectPrefix')}${screenshot.title}`}
                >
                  <span className={styles.thumbnailOrder}>{formatOrder(index)}</span>

                  <span className={styles.thumbnailPreview} aria-hidden="true">
                    <img
                      src={screenshot.src}
                      alt=""
                      className={styles.thumbnailImage}
                      onError={handleImageError}
                      data-fallback-label={t('showcase.controls.imageUnavailable')}
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
              aria-label={t('showcase.controls.closeFullscreen')}
            >
              {t('showcase.controls.closeFullscreen')}
            </button>

            <figure className={styles.lightboxFigure}>
              <img
                src={activeScreenshot.src}
                alt={activeScreenshot.alt}
                className={styles.lightboxImage}
                onError={handleImageError}
                data-fallback-label={t('showcase.controls.imageUnavailable')}
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
