import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { gaEventAttributes, type GaCategory } from '@hagicode/hagilight-core/analytics-events';
import styles from './HeroSection.module.css';
import { getLinkWithLocale } from '@/lib/shared/links';
import { getBundledWindowsStoreLink, loadWindowsStoreLink } from '@/lib/shared/windows-store-link';
import MicrosoftStoreBadge from '@/components/common/MicrosoftStoreBadge';
import HeroWorkflowBoard from './HeroWorkflowBoard';
import ProductOverviewVideoSection from './ProductOverviewVideoSection';
import type { FeaturedVideosByProvider } from './video-showcase-model';
import type { HomepageHeroCopy, HomepageWorkflowBoardCopy } from '@/lib/homepage-runtime-copy';
import { getEntityDefinition } from '@hagicode/hagilight-core/entity-definition';

interface HeroSectionProps {
  desktopVersion?: unknown;
  desktopPlatforms?: unknown[];
  desktopVersionError?: unknown;
  desktopChannels?: unknown;
  [key: string]: unknown;
  locale: string;
  copy: HomepageHeroCopy;
  workflowBoardCopy: HomepageWorkflowBoardCopy;
  productOverviewVideo?: {
    copy: {
      title: string;
    };
    featuredVideos: FeaturedVideosByProvider;
  };
}

interface IconProps {
  className?: string;
}

function DownloadIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 3.75V14.25M12 14.25L7.5 9.75M12 14.25L16.5 9.75M4.5 16.5V18.375C4.5 19.4105 5.33947 20.25 6.375 20.25H17.625C18.6605 20.25 19.5 19.4105 19.5 18.375V16.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HERO_GA_LOCATION = 'home_hero';

function heroGaAttributes(category: GaCategory, label: string, url?: string) {
  return gaEventAttributes({ category, label, location: HERO_GA_LOCATION, url });
}

export default function HeroSection({
  desktopVersion = null,
  desktopPlatforms = [],
  desktopVersionError = null,
  desktopChannels,
  locale,
  copy,
  workflowBoardCopy,
  productOverviewVideo,
}: HeroSectionProps) {
  const [windowsStoreLink, setWindowsStoreLink] = useState(() => getBundledWindowsStoreLink());
  const [windowsStoreBadgeSize, setWindowsStoreBadgeSize] = useState<'small' | 'large'>('large');
  const titleRunRef = useRef<HTMLSpanElement>(null);

  const desktopUrl = getLinkWithLocale('desktop', locale);
  const docsUrl = getLinkWithLocale('productOverview', locale);
  const primaryButtonHint = 'Windows · macOS · Linux';
  const windowsStoreAriaLabel = copy.windowsStoreAriaLabel;
  const ctaGroupLabel = copy.ctaGroupLabel;
  const showWindowsStoreButton = Boolean(windowsStoreLink.href);

  // The large badge is a fixed 381px wide; phones only have room for the small one.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const query = window.matchMedia('(max-width: 479px)');
    const syncBadgeSize = () => setWindowsStoreBadgeSize(query.matches ? 'small' : 'large');

    syncBadgeSize();
    query.addEventListener('change', syncBadgeSize);

    return () => query.removeEventListener('change', syncBadgeSize);
  }, []);

  // Hovering the wordmark re-runs the sweep once it is idle. The two replay names alternate so the
  // CSS animation restarts; reduced-motion and touch visitors never trigger it.
  useEffect(() => {
    const titleRun = titleRunRef.current;
    if (!titleRun || typeof window.matchMedia !== 'function') {
      return;
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let flip = false;

    const replay = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !finePointer.matches || reducedMotion.matches) {
        return;
      }
      if (titleRun.getAnimations().some((animation) => animation.playState === 'running')) {
        return;
      }
      flip = !flip;
      titleRun.dataset.run = flip ? 'replay-a' : 'replay-b';
    };

    titleRun.addEventListener('pointerenter', replay);
    return () => titleRun.removeEventListener('pointerenter', replay);
  }, []);

  useEffect(() => {
    let mounted = true;

    void loadWindowsStoreLink().then((nextLink) => {
      if (mounted) {
        setWindowsStoreLink(nextLink);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.bgAurora} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.bgPulse} aria-hidden="true" />

      <div className={styles.heroShell}>
        <div className={styles.heroIntro}>
          <div className={styles.copyColumn}>
            <h1 className={styles.heroTitle}>
              {/* One run of the proposal workflow: outline (proposed) -> solid (executed) -> lit rail (archived). */}
              <span ref={titleRunRef} className={styles.titleRun} data-run="intro">
                {/* The outline layer is drawn from data-text so the h1's text stays "HagiCode". */}
                <span className={styles.titleGhost} aria-hidden="true">
                  <span data-text="Hagi" />
                  <span data-text="code" />
                </span>
                <span className={styles.titleSolid}>
                  <span className={styles.titleWord}>Hagi</span>
                  <span className={styles.titleAccent}>code</span>
                </span>
                <span className={styles.titleBeam} aria-hidden="true" />
                <span className={styles.titleRail} aria-hidden="true">
                  <i style={{ '--at': 0 } as CSSProperties} />
                  <i style={{ '--at': 0.5 } as CSSProperties} />
                  <i style={{ '--at': 1 } as CSSProperties} />
                </span>
              </span>
            </h1>

            <p className={styles.heroHeadline}>{copy.headline}</p>
            <p className={styles.heroDescription}>{copy.subheadline}</p>
            <p className={styles.heroDefinition}>{getEntityDefinition(locale)}</p>
          </div>

          <div className={styles.heroActions} role="group" aria-label={ctaGroupLabel}>
            <div className={styles.heroPrimaryActions}>
              {showWindowsStoreButton && (
                <div className={styles.storeCta}>
                  <span className={styles.storeCtaTag}>{copy.storeRecommended}</span>
                  <MicrosoftStoreBadge
                    href={windowsStoreLink.href}
                    locale={locale}
                    size={windowsStoreBadgeSize}
                    aria-label={windowsStoreAriaLabel}
                    className={`${styles.windowsStoreBadgeButton} ${styles.windowsStoreBadgePrimary}`}
                    badgeClassName={styles.windowsStoreBadgeElement}
                    badgeAttributes={{
                      'data-windows-store-entry': 'site-home-hero',
                      ...heroGaAttributes('store', 'microsoftStore', windowsStoreLink.href),
                    }}
                  />
                  <span className={styles.storeCtaNote}>{copy.storeNote}</span>
                </div>
              )}

              <a
                href={desktopUrl}
                className={styles.buttonPrimary}
                {...heroGaAttributes('navigation', 'openDesktopPage')}
              >
                <span className={styles.buttonPrimaryContent}>
                  <DownloadIcon className={styles.buttonIcon} />
                  <span className={styles.buttonTextStack}>
                    <span className={styles.buttonPrimaryLabel}>{copy.buttons.desktopApp}</span>
                    <span className={styles.buttonPrimaryMeta}>{primaryButtonHint}</span>
                  </span>
                </span>
              </a>
            </div>

            <div className={styles.heroSecondaryActions}>
              <a
                className={styles.buttonSecondary}
                href={docsUrl}
                {...heroGaAttributes('navigation', 'productDocs')}
              >
                <span>{copy.buttons.learnMore}</span>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.heroStage}>
          <div className={styles.posterFrame}>
            <div className={styles.stagePanel}>
              {productOverviewVideo && (
                <div className={styles.videoSlot}>
                  <ProductOverviewVideoSection
                    locale={locale}
                    copy={productOverviewVideo.copy}
                    featuredVideos={productOverviewVideo.featuredVideos}
                    placement="hero"
                  />
                </div>
              )}
            </div>

            <HeroWorkflowBoard locale={locale} copy={workflowBoardCopy} />
          </div>
        </div>
      </div>
    </section>
  );
}
