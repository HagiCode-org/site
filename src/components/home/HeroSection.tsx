import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './HeroSection.module.css';
import { FEATURE_SITE_STEAM_ENABLED } from '@/config/features';
import { WEBSITE_TRACKING_EVENTS } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/tracker';
import { getLinkWithLocale } from '@/lib/shared/links';
import { getBundledSteamStoreLink, loadSteamStoreLink } from '@/lib/shared/steam-store-link';
import { getBundledWindowsStoreLink, loadWindowsStoreLink } from '@/lib/shared/windows-store-link';
import MicrosoftStoreBadge from '@/components/common/MicrosoftStoreBadge';
import HeroWorkflowBoard from './HeroWorkflowBoard';
import ProductOverviewVideoSection from './ProductOverviewVideoSection';
import type { FeaturedVideosByProvider } from './video-showcase-model';
import type { HomepageAgentChooserCopy, HomepageHeroCopy, HomepageWorkflowBoardCopy } from '@/lib/homepage-runtime-copy';

interface HeroAgentChoice {
  slug: string;
  agentName: string;
  href: string;
  localizedLocale: string;
}

interface HeroSectionProps {
  desktopVersion?: unknown;
  desktopPlatforms?: unknown[];
  desktopVersionError?: unknown;
  desktopChannels?: unknown;
  [key: string]: unknown;
  locale: string;
  copy: HomepageHeroCopy;
  workflowBoardCopy: HomepageWorkflowBoardCopy;
  agentChoices?: HeroAgentChoice[];
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

function formatAgentName(name: string) {
  return name;
}

const AGENT_ACCENT_PALETTE = [
  ['#60a5fa', 'rgba(96, 165, 250, 0.22)'],
  ['#34d399', 'rgba(52, 211, 153, 0.22)'],
  ['#a78bfa', 'rgba(167, 139, 250, 0.22)'],
  ['#f59e0b', 'rgba(245, 158, 11, 0.22)'],
  ['#fb7185', 'rgba(251, 113, 133, 0.22)'],
  ['#22d3ee', 'rgba(34, 211, 238, 0.22)'],
  ['#f97316', 'rgba(249, 115, 22, 0.22)'],
  ['#f472b6', 'rgba(244, 114, 182, 0.22)'],
  ['#38bdf8', 'rgba(56, 189, 248, 0.22)'],
  ['#4ade80', 'rgba(74, 222, 128, 0.22)'],
];

function AgentChooser({
  locale,
  copy,
  agentChoices,
}: {
  locale: string;
  copy: HomepageAgentChooserCopy;
  agentChoices: HeroAgentChoice[];
}) {
  const isChineseLocale = locale.toLowerCase().startsWith('zh');
  const shouldReduceMotion = Boolean(useReducedMotion());

  if (agentChoices.length === 0) {
    return null;
  }

  const cardBaseDelay = shouldReduceMotion ? 0 : 0.28;
  const cardStaggerMs = shouldReduceMotion ? 0 : 65;

  return (
    <section className={styles.agentChooser} aria-labelledby="hero-agent-chooser-title">
      <div className={styles.agentChooserGlow} aria-hidden="true" />
      <motion.div
        className={styles.agentChooserHeader}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={styles.agentChooserBadge}>
          <span className={styles.agentChooserBadgeDot} aria-hidden="true" />
          <span className={styles.agentChooserBadgeLabel}>{copy.badge}</span>
        </span>
        <div className={styles.agentChooserCopy}>
          <h2 id="hero-agent-chooser-title" className={styles.agentChooserTitle}>{copy.title}</h2>
          <p className={styles.agentChooserDescription}>{copy.description}</p>
        </div>
      </motion.div>
      <div className={styles.agentChooserGrid} role="list">
        {agentChoices.map((agent, index) => {
          const [accentColor, accentGlow] = AGENT_ACCENT_PALETTE[index % AGENT_ACCENT_PALETTE.length];
          const cardStyle = {
            '--card-accent': accentColor,
            '--card-glow': accentGlow,
          } as React.CSSProperties;

          return (
            <motion.a
              key={agent.slug}
              role="listitem"
              className={styles.agentChooserCard}
              href={agent.href}
              style={cardStyle}
              initial={{ opacity: 0, y: 24, scale: 0.94, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 0.52,
                delay: cardBaseDelay + index * cardStaggerMs / 1000,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className={styles.agentChooserCardLabel}>{formatAgentName(agent.agentName)}</span>
              <span className={styles.agentChooserCardRoute} aria-hidden="true">
                <span>Agent</span>
                <span className={styles.agentChooserCardArrow}>→</span>
                <span>HagiCode</span>
              </span>
              <span className={styles.agentChooserCardMeta}>
                {isChineseLocale ? '查看对比' : 'Compare now'}
              </span>
            </motion.a>
          );
        })}
      </div>
    </section>
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
  agentChoices = [],
  productOverviewVideo,
}: HeroSectionProps) {
  const [steamStoreLink, setSteamStoreLink] = useState(() => getBundledSteamStoreLink());
  const [windowsStoreLink, setWindowsStoreLink] = useState(() => getBundledWindowsStoreLink());

  const desktopUrl = getLinkWithLocale('desktop', locale);
  const containerUrl = getLinkWithLocale('container', locale);
  const docsUrl = getLinkWithLocale('productOverview', locale);
  const isChineseLocale = locale.toLowerCase().startsWith('zh');
  const heroStatement = isChineseLocale
    ? '全球不唯一，但是超级好用的 Agentic Coding 软件就在这里'
    : 'Not globally unique, but exceptionally usable Agentic Coding software lives here.';
  const primaryButtonHint = 'Windows · macOS · Linux';
  const steamLabel = 'Steam';
  const steamAriaLabel = copy.steamAriaLabel || (isChineseLocale ? '打开 Hagicode Steam 商店页' : 'Open Hagicode on Steam');
  const windowsStoreAriaLabel = copy.windowsStoreAriaLabel || (
    isChineseLocale ? '打开 Hagicode Windows 商店页' : 'Open Hagicode on Microsoft Store'
  );
  const ctaGroupLabel = copy.ctaGroupLabel || (isChineseLocale ? '首页主要操作' : 'Primary homepage actions');
  const showSteamButton = FEATURE_SITE_STEAM_ENABLED && Boolean(steamStoreLink.href);
  const showWindowsStoreButton = Boolean(windowsStoreLink.href);

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

  useEffect(() => {
    if (!FEATURE_SITE_STEAM_ENABLED) {
      return;
    }

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
            <div className={styles.heroPrimaryActions}>
              <a href={desktopUrl} className={styles.buttonPrimary}>
                <span className={styles.buttonPrimaryContent}>
                  <DownloadIcon className={styles.buttonIcon} />
                  <span className={styles.buttonTextStack}>
                    <span className={styles.buttonPrimaryLabel}>{copy.buttons.desktopApp}</span>
                    <span className={styles.buttonPrimaryMeta}>{primaryButtonHint}</span>
                  </span>
                </span>
              </a>

              {showWindowsStoreButton && (
                <MicrosoftStoreBadge
                  href={windowsStoreLink.href}
                  locale={locale}
                  size="large"
                  aria-label={windowsStoreAriaLabel}
                  className={`${styles.windowsStoreBadgeButton} ${styles.windowsStoreBadgePrimary}`}
                  badgeClassName={styles.windowsStoreBadgeElement}
                  badgeAttributes={{ 'data-windows-store-entry': 'site-home-hero' }}
                />
              )}
            </div>

            <div className={styles.heroSecondaryActions}>
              <a href={containerUrl} className={styles.buttonSecondary}>
                <ContainerIcon className={styles.buttonIcon} />
                <span>{copy.buttons.containerApp}</span>
              </a>

              {showSteamButton && (
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
              <AgentChooser locale={locale} copy={copy.agentChooser} agentChoices={agentChoices} />
            </div>

            <HeroWorkflowBoard locale={locale} copy={workflowBoardCopy} />
          </div>
        </div>
      </div>
    </section>
  );
}
