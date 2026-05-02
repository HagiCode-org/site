import { startTransition, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './PricingComparisonSection.module.css';
import { getTranslation } from '@/i18n/ui';
import { getDocsAbsoluteUrl, getLinkWithLocale } from '@/lib/shared/links';
import { getBundledSteamStoreLink } from '@/lib/shared/steam-store-link';
import { getSteamProductImageRecord, type SteamProductImageRecord } from '@/data/steamImageDescriptors';

type Locale = string;

export const TURBO_ENGINE_STEAM_STORE_URL = 'https://store.steampowered.com/app/4635480/Hagicode__Turbo_Engine/';
export const HAGICODE_PLUS_BUNDLE_STEAM_URL = 'https://store.steampowered.com/bundle/73989/Hagicode_Plus/';

export function getHagicodePlusDocsIntroductionUrl(locale: Locale): string {
  return getDocsAbsoluteUrl('/bundles/hagicode-plus/', locale);
}

type ActionLink = {
  label: string;
  href: string;
  external?: boolean;
};

type EditionColumn = {
  title: string;
  action: ActionLink;
};

type FeatureCell = {
  type: 'check' | 'cross' | 'text';
  value?: string;
  href?: string;
  external?: boolean;
};

type FeatureRow = {
  feature: string;
  desktop: FeatureCell;
  container: FeatureCell;
  steam: FeatureCell;
  turbo: FeatureCell;
  steamExclusive?: boolean;
};

type DlcItem = {
  productKey?: string;
  category: string;
  title: string;
  price: string;
  description: string;
  bullets: string[];
  action: ActionLink;
  featured?: 'sponsor';
};

type SteamPreviewRecordMap = Record<string, SteamProductImageRecord | null | undefined>;
type SteamPreviewLabels = {
  openSteam: string;
  bundlePending: string;
  productPending: string;
  previewLabel: string;
  imageSuffix: string;
};

function getSteamVariantLabel(variant: string): string {
  return variant.replace(/[-_]+/g, ' ');
}

function renderSteamImagePreview(
  item: DlcItem,
  fallbackStoreUrl: string,
  records: SteamPreviewRecordMap,
  labels: SteamPreviewLabels,
) {
  if (!item.productKey) {
    return null;
  }

  const record = records[item.productKey] ?? null;
  const preview = record?.images[0];
  const displayName = record?.displayName ?? item.title;
  const storeUrl = record?.storeUrl ?? fallbackStoreUrl;

  return (
    <div className={styles.steamPreview} aria-label={`${displayName} ${labels.previewLabel}`}>
      {preview ? (
        <img
          src={preview.src}
          alt={preview.alt || `${displayName} ${getSteamVariantLabel(preview.variant)} ${labels.imageSuffix}`}
          width={preview.width}
          height={preview.height}
          className={styles.steamPreviewImage}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className={styles.steamPreviewFallback}>
          <span className={styles.steamPreviewBadge}>Steam</span>
          <strong>{displayName}</strong>
          <small>{record?.type === 'bundle' || item.productKey === 'hagicode-plus' ? labels.bundlePending : labels.productPending}</small>
        </div>
      )}
      <span className={styles.steamPreviewLinkHint}>{labels.openSteam}</span>
      <span className={styles.steamPreviewUrl}>{storeUrl}</span>
    </div>
  );
}

type PricingContent = {
  title: string;
  limitTitle: string;
  limitDescription: string;
  plusTitle: string;
  plusDescription: string;
  featureHeader: string;
  includedLabel: string;
  notIncludedLabel: string;
  desktopEdition: EditionColumn;
  containerEdition: EditionColumn;
  steamEdition: EditionColumn;
  turboEdition: EditionColumn;
  rows: FeatureRow[];
  dlcLabel: string;
  dlcTitle: string;
  dlcDescription?: string;
  steamPreviewLabels: SteamPreviewLabels;
  dlcItems: DlcItem[];
};

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 10.2 8.6 12.7 14 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m7 7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m13 7-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function getPricingContent(locale: Locale): PricingContent {
  const { t } = getTranslation(locale);
  const pricingRows = {
    pricing: t('pricing.rows.pricing'),
    allFreeFeaturesIncluded: t('pricing.rows.allFreeFeaturesIncluded'),
    vault: t('pricing.rows.vault'),
    skills: t('pricing.rows.skills'),
    proposalWorkflow: t('pricing.rows.proposalWorkflow'),
    localAchievements: t('pricing.rows.localAchievements'),
    allAgentCliIntegrations: t('pricing.rows.allAgentCliIntegrations'),
    speechRecognition: t('pricing.rows.speechRecognition'),
    omniRouteIntegration: t('pricing.rows.omniRouteIntegration'),
    githubIntegration: t('pricing.rows.githubIntegration'),
    gitManagement: t('pricing.rows.gitManagement'),
    maximumConcurrentProposals: t('pricing.rows.maximumConcurrentProposals'),
    copySwitchingSupport: t('pricing.rows.copySwitchingSupport'),
    turboEngineAvatarPacks: t('pricing.rows.turboEngineAvatarPacks'),
    customAvatarUploads: t('pricing.rows.customAvatarUploads'),
    customLogo: t('pricing.rows.customLogo'),
    customTitle: t('pricing.rows.customTitle'),
    customCoAuthoredByInfo: t('pricing.rows.customCoAuthoredByInfo'),
    steamCloudAchievements: t('pricing.rows.steamCloudAchievements'),
    freeDlcSupport: t('pricing.rows.freeDlcSupport'),
    steamWorkshopSupport: t('pricing.rows.steamWorkshopSupport'),
    cloudSaveSupport: t('pricing.rows.cloudSaveSupport'),
  };
  const pricingValues = {
    free: t('pricing.values.free'),
    viewOnSteam: t('pricing.values.viewOnSteam'),
  };
  const dlcCopy = {
    label: t('pricing.dlc.label'),
    title: t('pricing.dlc.title'),
    openSteam: t('pricing.dlc.actions.openSteam'),
    preview: {
      bundlePending: t('pricing.dlc.preview.bundlePending'),
      productPending: t('pricing.dlc.preview.productPending'),
      previewLabel: t('pricing.dlc.preview.previewLabel'),
      imageSuffix: t('pricing.dlc.preview.imageSuffix'),
    },
    allBeauties: {
      category: t('pricing.dlc.items.allBeauties.category'),
      title: t('pricing.dlc.items.allBeauties.title'),
      price: t('pricing.dlc.items.allBeauties.price'),
      description: t('pricing.dlc.items.allBeauties.description'),
      bullets: [
        t('pricing.dlc.items.allBeauties.bullets.0'),
        t('pricing.dlc.items.allBeauties.bullets.1'),
      ],
    },
    turboEngine: {
      category: t('pricing.dlc.items.turboEngine.category'),
      title: t('pricing.dlc.items.turboEngine.title'),
      price: t('pricing.dlc.items.turboEngine.price'),
      description: t('pricing.dlc.items.turboEngine.description'),
      bullets: [
        t('pricing.dlc.items.turboEngine.bullets.0'),
        t('pricing.dlc.items.turboEngine.bullets.1'),
        t('pricing.dlc.items.turboEngine.bullets.2'),
        t('pricing.dlc.items.turboEngine.bullets.3'),
        t('pricing.dlc.items.turboEngine.bullets.4'),
        t('pricing.dlc.items.turboEngine.bullets.5'),
      ],
    },
    hagicodePlus: {
      category: t('pricing.dlc.items.hagicodePlus.category'),
      title: t('pricing.dlc.items.hagicodePlus.title'),
      price: t('pricing.dlc.items.hagicodePlus.price'),
      description: t('pricing.dlc.items.hagicodePlus.description'),
      bullets: [
        t('pricing.dlc.items.hagicodePlus.bullets.0'),
        t('pricing.dlc.items.hagicodePlus.bullets.1'),
        t('pricing.dlc.items.hagicodePlus.bullets.2'),
      ],
    },
    sponsor: {
      category: t('pricing.dlc.items.sponsor.category'),
      title: t('pricing.dlc.items.sponsor.title'),
      price: t('pricing.dlc.items.sponsor.price'),
      description: t('pricing.dlc.items.sponsor.description'),
      bullets: [
        t('pricing.dlc.items.sponsor.bullets.0'),
        t('pricing.dlc.items.sponsor.bullets.1'),
        t('pricing.dlc.items.sponsor.bullets.2'),
      ],
    },
  };
  const steamHref = getBundledSteamStoreLink().href;
  const turboEngineSteamHref = TURBO_ENGINE_STEAM_STORE_URL;
  const hagicodePlusBundleHref = HAGICODE_PLUS_BUNDLE_STEAM_URL;
  const hagicodePlusDocsHref = getHagicodePlusDocsIntroductionUrl(locale);
  const desktopHref = getLinkWithLocale('desktop', locale);
  const containerHref = getLinkWithLocale('container', locale);

  if (!locale.toLowerCase().startsWith('zh')) {
    return {
      title: t('pricing.title'),
      limitTitle: t('pricing.limitTitle'),
      limitDescription: t('pricing.limitDescription'),
      plusTitle: t('pricing.plusTitle'),
      plusDescription: t('pricing.plusDescription'),
      featureHeader: t('pricing.featureHeader'),
      includedLabel: t('pricing.includedLabel'),
      notIncludedLabel: t('pricing.notIncludedLabel'),
      desktopEdition: {
        title: t('pricing.editions.desktop.title'),
        action: { label: 'Desktop', href: desktopHref },
      },
      containerEdition: {
        title: t('pricing.editions.container.title'),
        action: { label: 'Container', href: containerHref },
      },
      steamEdition: {
        title: 'Steam',
        action: { label: 'Steam', href: steamHref, external: true },
      },
      turboEdition: {
        title: 'Hagicode Plus',
        action: { label: 'Hagicode Plus', href: hagicodePlusDocsHref },
      },
      rows: [
        {
          feature: pricingRows.pricing,
          desktop: { type: 'text', value: pricingValues.free },
          container: { type: 'text', value: pricingValues.free },
          steam: { type: 'text', value: pricingValues.viewOnSteam, href: steamHref, external: true },
          turbo: { type: 'text', value: pricingValues.viewOnSteam, href: hagicodePlusBundleHref, external: true },
        },
        { feature: pricingRows.allFreeFeaturesIncluded, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: pricingRows.vault, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: pricingRows.skills, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: pricingRows.proposalWorkflow, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: pricingRows.localAchievements, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: pricingRows.allAgentCliIntegrations, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: pricingRows.speechRecognition, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: pricingRows.omniRouteIntegration, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: pricingRows.githubIntegration, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: pricingRows.gitManagement, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
        { feature: pricingRows.maximumConcurrentProposals, desktop: { type: 'text', value: '3' }, container: { type: 'text', value: '3' }, steam: { type: 'text', value: '3' }, turbo: { type: 'text', value: '32' } },
        { feature: pricingRows.copySwitchingSupport, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: pricingRows.turboEngineAvatarPacks, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: pricingRows.customAvatarUploads, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: pricingRows.customLogo, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: pricingRows.customTitle, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: pricingRows.customCoAuthoredByInfo, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
        { feature: pricingRows.steamCloudAchievements, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
        { feature: pricingRows.freeDlcSupport, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
        { feature: pricingRows.steamWorkshopSupport, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
        { feature: pricingRows.cloudSaveSupport, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      ],
      dlcLabel: dlcCopy.label,
      dlcTitle: dlcCopy.title,
      steamPreviewLabels: {
        openSteam: dlcCopy.openSteam,
        bundlePending: dlcCopy.preview.bundlePending,
        productPending: dlcCopy.preview.productPending,
        previewLabel: dlcCopy.preview.previewLabel,
        imageSuffix: dlcCopy.preview.imageSuffix,
      },
      dlcItems: [
        {
          category: dlcCopy.allBeauties.category,
          title: dlcCopy.allBeauties.title,
          price: dlcCopy.allBeauties.price,
          description: dlcCopy.allBeauties.description,
          bullets: dlcCopy.allBeauties.bullets,
          action: { label: dlcCopy.openSteam, href: steamHref, external: true },
        },
        {
          category: dlcCopy.turboEngine.category,
          productKey: 'turbo-engine',
          title: dlcCopy.turboEngine.title,
          price: dlcCopy.turboEngine.price,
          description: dlcCopy.turboEngine.description,
          bullets: dlcCopy.turboEngine.bullets,
          action: { label: dlcCopy.openSteam, href: turboEngineSteamHref, external: true },
        },
        {
          category: dlcCopy.hagicodePlus.category,
          productKey: 'hagicode-plus',
          title: dlcCopy.hagicodePlus.title,
          price: dlcCopy.hagicodePlus.price,
          description: dlcCopy.hagicodePlus.description,
          bullets: dlcCopy.hagicodePlus.bullets,
          action: { label: dlcCopy.openSteam, href: hagicodePlusBundleHref, external: true },
        },
        {
          category: dlcCopy.sponsor.category,
          title: dlcCopy.sponsor.title,
          price: dlcCopy.sponsor.price,
          description: dlcCopy.sponsor.description,
          bullets: dlcCopy.sponsor.bullets,
          action: { label: dlcCopy.openSteam, href: steamHref, external: true },
          featured: 'sponsor',
        },
      ],
    };
  }

  return {
    title: t('pricing.title'),
    limitTitle: t('pricing.limitTitle'),
    limitDescription: t('pricing.limitDescription'),
    plusTitle: t('pricing.plusTitle'),
    plusDescription: t('pricing.plusDescription'),
    featureHeader: t('pricing.featureHeader'),
    includedLabel: t('pricing.includedLabel'),
    notIncludedLabel: t('pricing.notIncludedLabel'),
    desktopEdition: {
      title: t('pricing.editions.desktop.title'),
      action: { label: 'Desktop', href: desktopHref },
    },
    containerEdition: {
      title: t('pricing.editions.container.title'),
      action: { label: 'Container', href: containerHref },
    },
    steamEdition: {
      title: 'Steam',
      action: { label: 'Steam', href: steamHref, external: true },
    },
    turboEdition: {
      title: 'Hagicode Plus',
      action: { label: 'Hagicode Plus', href: hagicodePlusDocsHref },
    },
    rows: [
      {
        feature: pricingRows.pricing,
        desktop: { type: 'text', value: pricingValues.free },
        container: { type: 'text', value: pricingValues.free },
        steam: { type: 'text', value: pricingValues.viewOnSteam, href: steamHref, external: true },
        turbo: { type: 'text', value: pricingValues.viewOnSteam, href: hagicodePlusBundleHref, external: true },
      },
      { feature: pricingRows.allFreeFeaturesIncluded, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: pricingRows.vault, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: pricingRows.skills, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: pricingRows.proposalWorkflow, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: pricingRows.localAchievements, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: pricingRows.allAgentCliIntegrations, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: pricingRows.speechRecognition, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: pricingRows.omniRouteIntegration, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: pricingRows.githubIntegration, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: pricingRows.gitManagement, desktop: { type: 'check' }, container: { type: 'check' }, steam: { type: 'check' }, turbo: { type: 'check' } },
      { feature: pricingRows.maximumConcurrentProposals, desktop: { type: 'text', value: '3' }, container: { type: 'text', value: '3' }, steam: { type: 'text', value: '3' }, turbo: { type: 'text', value: '32' } },
      { feature: pricingRows.copySwitchingSupport, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: pricingRows.turboEngineAvatarPacks, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: pricingRows.customAvatarUploads, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: pricingRows.customLogo, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: pricingRows.customTitle, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: pricingRows.customCoAuthoredByInfo, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
      { feature: pricingRows.steamCloudAchievements, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      { feature: pricingRows.freeDlcSupport, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      { feature: pricingRows.steamWorkshopSupport, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
      { feature: pricingRows.cloudSaveSupport, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'check' }, turbo: { type: 'check' }, steamExclusive: true },
    ],
    dlcLabel: dlcCopy.label,
    dlcTitle: dlcCopy.title,
    steamPreviewLabels: {
      openSteam: dlcCopy.openSteam,
      bundlePending: dlcCopy.preview.bundlePending,
      productPending: dlcCopy.preview.productPending,
      previewLabel: dlcCopy.preview.previewLabel,
      imageSuffix: dlcCopy.preview.imageSuffix,
    },
    dlcItems: [
      {
        category: dlcCopy.allBeauties.category,
        title: dlcCopy.allBeauties.title,
        price: dlcCopy.allBeauties.price,
        description: dlcCopy.allBeauties.description,
        bullets: dlcCopy.allBeauties.bullets,
        action: { label: dlcCopy.openSteam, href: steamHref, external: true },
      },
      {
        category: dlcCopy.turboEngine.category,
        productKey: 'turbo-engine',
        title: dlcCopy.turboEngine.title,
        price: dlcCopy.turboEngine.price,
        description: dlcCopy.turboEngine.description,
        bullets: dlcCopy.turboEngine.bullets,
        action: { label: dlcCopy.openSteam, href: turboEngineSteamHref, external: true },
      },
      {
        category: dlcCopy.hagicodePlus.category,
        productKey: 'hagicode-plus',
        title: dlcCopy.hagicodePlus.title,
        price: dlcCopy.hagicodePlus.price,
        description: dlcCopy.hagicodePlus.description,
        bullets: dlcCopy.hagicodePlus.bullets,
        action: { label: dlcCopy.openSteam, href: hagicodePlusBundleHref, external: true },
      },
      {
        category: dlcCopy.sponsor.category,
        title: dlcCopy.sponsor.title,
        price: dlcCopy.sponsor.price,
        description: dlcCopy.sponsor.description,
        bullets: dlcCopy.sponsor.bullets,
        action: { label: dlcCopy.openSteam, href: steamHref, external: true },
        featured: 'sponsor',
      },
    ],
  };
}

function renderCell(cell: FeatureCell, labels: { included: string; notIncluded: string }) {
  if (cell.type === 'check') {
    return (
      <span className={`${styles.cellBadge} ${styles.cellCheck}`} aria-label={labels.included}>
        <CheckIcon />
      </span>
    );
  }

  if (cell.type === 'cross') {
    return (
      <span className={`${styles.cellBadge} ${styles.cellCross}`} aria-label={labels.notIncluded}>
        <CrossIcon />
      </span>
    );
  }

  if (cell.href) {
    return (
      <a
        href={cell.href}
        className={`${styles.cellText} ${styles.cellLink}`}
        target={cell.external ? '_blank' : undefined}
        rel={cell.external ? 'noopener noreferrer' : undefined}
      >
        {cell.value}
      </a>
    );
  }

  return <span className={styles.cellText}>{cell.value}</span>;
}

function renderEditionHeader(column: EditionColumn, className?: string) {
  return (
    <div className={`${styles.columnHeading} ${className ?? ''}`.trim()}>
      <a
        href={column.action.href}
        className={styles.headerButton}
        target={column.action.external ? '_blank' : undefined}
        rel={column.action.external ? 'noopener noreferrer' : undefined}
      >
        {column.title}
      </a>
    </div>
  );
}

export default function PricingComparisonSection({ locale = 'zh-CN' }: { locale?: Locale }) {
  const content = useMemo(() => getPricingContent(locale), [locale]);
  const steamPreviewProductKeys = useMemo(
    () => Array.from(new Set(content.dlcItems.flatMap((item) => item.productKey ? [item.productKey] : []))),
    [content.dlcItems],
  );
  const [steamPreviewRecords, setSteamPreviewRecords] = useState<SteamPreviewRecordMap>({});
  const cellLabels = {
    included: content.includedLabel,
    notIncluded: content.notIncludedLabel,
  };

  useEffect(() => {
    if (!steamPreviewProductKeys.length) {
      return;
    }

    let cancelled = false;

    Promise.all(steamPreviewProductKeys.map(async (productKey) => [productKey, await getSteamProductImageRecord(productKey)] as const))
      .then((entries) => {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setSteamPreviewRecords(Object.fromEntries(entries));
        });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setSteamPreviewRecords(Object.fromEntries(steamPreviewProductKeys.map((productKey) => [productKey, null])));
        });
      });

    return () => {
      cancelled = true;
    };
  }, [steamPreviewProductKeys]);

  return (
    <section className={styles.section} aria-labelledby="pricing-comparison-title">
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.55 }}
        >
          <h2 id="pricing-comparison-title" className={styles.title}>
            {content.title}
          </h2>
        </motion.div>

        <motion.section
          className={styles.group}
          aria-labelledby="pricing-base-title"
          variants={SECTION_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className={styles.matrixWrap}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th scope="col" className={styles.featureHeading}>{content.featureHeader}</th>
                  <th scope="col">
                    {renderEditionHeader(content.turboEdition, styles.turboColumnHeading)}
                  </th>
                  <th scope="col">
                    {renderEditionHeader(content.steamEdition, styles.steamColumnHeading)}
                  </th>
                  <th scope="col">
                    {renderEditionHeader(content.desktopEdition, styles.desktopColumnHeading)}
                  </th>
                  <th scope="col">
                    {renderEditionHeader(content.containerEdition, styles.containerColumnHeading)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.rows.map((row) => (
                  <tr key={row.feature} className={row.steamExclusive ? styles.steamExclusiveRow : undefined}>
                    <th scope="row" className={styles.rowHeading}>{row.feature}</th>
                    <td className={styles.turboColumnCell} data-column={content.turboEdition.title}>{renderCell(row.turbo, cellLabels)}</td>
                    <td className={styles.steamColumnCell} data-column={content.steamEdition.title}>{renderCell(row.steam, cellLabels)}</td>
                    <td className={styles.desktopColumnCell} data-column={content.desktopEdition.title}>{renderCell(row.desktop, cellLabels)}</td>
                    <td className={styles.containerColumnCell} data-column={content.containerEdition.title}>{renderCell(row.container, cellLabels)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.matrixNote}>
            <span>{content.limitTitle}:</span>
            {' '}
            {content.limitDescription}
          </p>
          <p className={styles.matrixNote}>
            <span>{content.plusTitle}:</span>
            {' '}
            {content.plusDescription}
          </p>
        </motion.section>

        <motion.section
          className={styles.group}
          aria-labelledby="pricing-dlc-title"
          variants={SECTION_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className={styles.groupHeader}>
            <span className={styles.groupLabel}>{content.dlcLabel}</span>
            <h3 id="pricing-dlc-title" className={styles.groupTitle}>
              {content.dlcTitle}
            </h3>
            {content.dlcDescription ? (
              <p className={styles.groupDescription}>{content.dlcDescription}</p>
            ) : null}
          </div>

          <div className={styles.dlcList}>
            {content.dlcItems.map((item) => (
              <a
                key={item.title}
                href={item.action.href}
                className={`${styles.dlcRow} ${item.featured === 'sponsor' ? styles.sponsorRow : ''}`}
                target={item.action.external ? '_blank' : undefined}
                rel={item.action.external ? 'noopener noreferrer' : undefined}
              >
                <div className={styles.dlcTop}>
                  {renderSteamImagePreview(item, item.action.href, steamPreviewRecords, content.steamPreviewLabels)}
                  <div className={styles.dlcMain}>
                    <span className={styles.dlcCategory}>{item.category}</span>
                    <h4 className={styles.dlcTitle}>{item.title}</h4>
                    <p className={styles.dlcDescription}>{item.description}</p>
                  </div>
                  <div className={styles.dlcAside}>
                    <strong className={styles.dlcPrice}>{item.price}</strong>
                  </div>
                </div>
                <ul className={styles.dlcBullets}>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
        </motion.section>
      </div>
    </section>
  );
}
