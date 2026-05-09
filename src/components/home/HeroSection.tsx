import { useEffect, useState } from 'react';
import styles from './HeroSection.module.css';
import { WEBSITE_TRACKING_EVENTS } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/tracker';
import { getLinkWithLocale } from '@/lib/shared/links';
import { getBundledSteamStoreLink, loadSteamStoreLink } from '@/lib/shared/steam-store-link';
import HeroWorkflowBoard from './HeroWorkflowBoard';
import ProductOverviewVideoSection from './ProductOverviewVideoSection';
import type { FeaturedVideosByProvider } from './video-showcase-model';
import type { HomepageHeroCopy, HomepageWorkflowBoardCopy } from '@/lib/homepage-runtime-copy';

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

function ContainerIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3.75" y="5.25" width="16.5" height="13.5" rx="2.25" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.25 5.25V18.75M15.75 5.25V18.75M3.75 9.75H20.25M3.75 14.25H20.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SteamIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      data-steam-icon="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="16.8" cy="7.8" r="2.15" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="9.1" cy="15.1" r="1.45" fill="currentColor" />
      <path d="M10.2 14.2L14.7 10.3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M15.6 9.2a1.75 1.75 0 1 0 2.4-2.4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M7.5 14.6l2.8 1.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
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
  const [steamStoreLink, setSteamStoreLink] = useState(() => getBundledSteamStoreLink());

  const desktopUrl = getLinkWithLocale('desktop', locale);
  const containerUrl = getLinkWithLocale('container', locale);
  const docsUrl = getLinkWithLocale('productOverview', locale);
  const isChineseLocale = locale.toLowerCase().startsWith('zh');
  const heroStatement = isChineseLocale
    ? '全球不唯一，但是超级好用的 Agentic Coding 软件就在这里'
    : 'Not globally unique, but exceptionally usable Agentic Coding software lives here.';
  const steamLabel = 'Steam';
  const steamAriaLabel = copy.steamAriaLabel || (isChineseLocale ? '打开 Hagicode Steam 商店页' : 'Open Hagicode on Steam');
  const ctaGroupLabel = copy.ctaGroupLabel || (isChineseLocale ? '首页主要操作' : 'Primary homepage actions');

  useEffect(() => {
    let mounted = true;

    void loadSteamStoreLink().then((nextLink) => {
      if (mounted) {
        setSteamStoreLink(nextLink);
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
              <span className={styles.titleWord}>Hagi</span>
              <span className={styles.titleAccent}>code</span>
            </h1>

            <p className={styles.heroDescription}>{heroStatement}</p>
          </div>

          <div className={styles.heroActions} role="group" aria-label={ctaGroupLabel}>
            <a href={desktopUrl} className={styles.buttonPrimary}>
              <DownloadIcon className={styles.buttonIcon} />
              <span>{copy.buttons.desktopApp}</span>
            </a>

            <a href={containerUrl} className={styles.buttonSecondary}>
              <ContainerIcon className={styles.buttonIcon} />
              <span>{copy.buttons.containerApp}</span>
            </a>

            {steamStoreLink.href && (
              <a
                href={steamStoreLink.href}
                className={`${styles.buttonSecondary} ${styles.buttonSteam}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={steamAriaLabel}
                data-steam-entry="site-home-hero"
                onClick={() =>
                  trackEvent(WEBSITE_TRACKING_EVENTS.openSteamStore, {
                    source: 'hero-section-steam',
                  })
                }
              >
                <SteamIcon className={styles.buttonIcon} />
                <span>{steamLabel}</span>
              </a>
            )}

            <a className={styles.buttonSecondary} href={docsUrl}>
              <span>{copy.buttons.learnMore}</span>
            </a>
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
