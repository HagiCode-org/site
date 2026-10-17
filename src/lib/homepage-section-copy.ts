import { resolveSiteLocale } from '@/i18n/locale-metadata';
import { getLocaleResourceValue } from '@/i18n/resource-lookup';
import { getLinkWithLocale } from '@/lib/shared/links';
import { DEFAULT_WINDOWS_STORE_URL } from '@/lib/shared/windows-store-link';

type LocaleInput = string | null | undefined;

type ShowcaseScreenshotKey =
  | 'proposalWorkflow'
  | 'sessionBoard'
  | 'tokenAnalytics'
  | 'workspaceManagement'
  | 'achievementProgress';

const SHOWCASE_SCREENSHOT_KEYS: ShowcaseScreenshotKey[] = [
  'proposalWorkflow',
  'sessionBoard',
  'tokenAnalytics',
  'workspaceManagement',
  'achievementProgress',
];

function getNamespacedString(locale: LocaleInput, namespace: 'common' | 'home', key: string) {
  const resolvedLocale = resolveSiteLocale(locale);
  const value = getLocaleResourceValue(resolvedLocale, namespace, key);

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return key;
}

function getHomeString(locale: LocaleInput, key: string) {
  return getNamespacedString(locale, 'home', key);
}

function getCommonString(locale: LocaleInput, key: string) {
  return getNamespacedString(locale, 'common', key);
}

export interface HomepageShowcaseScreenshotCopy {
  id: ShowcaseScreenshotKey;
  title: string;
  description: string;
  alt: string;
}

export interface HomepageShowcaseCopy {
  title: string;
  description: string;
  controls: {
    openFullscreen: string;
    imageUnavailable: string;
    openFullscreenHint: string;
    current: string;
    activeState: string;
    previewState: string;
    previous: string;
    next: string;
    railLabel: string;
    selectPrefix: string;
    closeFullscreen: string;
  };
  screenshots: HomepageShowcaseScreenshotCopy[];
}


export interface HomepageFeaturesCopy {
  showcase: {
    title: string;
    subtitle: string;
    demoLabel: string;
    previewLabel: string;
  };
  smart: {
    title: string;
    subtitle: string;
    description: string;
    workflowStages: Array<{
      key: string;
      label: string;
      desc: string;
    }>;
  };
  convenient: {
    title: string;
    subtitle: string;
    description: string;
    agentMatrix: {
      title: string;
      badge: string;
      supportedProvidersTitle: string;
      supportedProviders: Array<{
        key: string;
        name: string;
      }>;
      agentLanes: Array<{
        key: string;
        name: string;
        role: string;
        instances: string[];
      }>;
    };
  };
  interesting: {
    title: string;
    subtitle: string;
    description: string;
    features: Array<{
      key: string;
      label: string;
      desc: string;
    }>;
  };
}

export function getHomepageShowcaseCopy(locale: LocaleInput): HomepageShowcaseCopy {
  const resolvedLocale = resolveSiteLocale(locale);

  return {
    title: getCommonString(resolvedLocale, 'showcase.title'),
    description: getCommonString(resolvedLocale, 'showcase.description'),
    controls: {
      openFullscreen: getCommonString(resolvedLocale, 'showcase.controls.openFullscreen'),
      imageUnavailable: getCommonString(resolvedLocale, 'showcase.controls.imageUnavailable'),
      openFullscreenHint: getCommonString(resolvedLocale, 'showcase.controls.openFullscreenHint'),
      current: getCommonString(resolvedLocale, 'showcase.controls.current'),
      activeState: getCommonString(resolvedLocale, 'showcase.controls.activeState'),
      previewState: getCommonString(resolvedLocale, 'showcase.controls.previewState'),
      previous: getCommonString(resolvedLocale, 'showcase.controls.previous'),
      next: getCommonString(resolvedLocale, 'showcase.controls.next'),
      railLabel: getCommonString(resolvedLocale, 'showcase.controls.railLabel'),
      selectPrefix: getCommonString(resolvedLocale, 'showcase.controls.selectPrefix'),
      closeFullscreen: getCommonString(resolvedLocale, 'showcase.controls.closeFullscreen'),
    },
    screenshots: SHOWCASE_SCREENSHOT_KEYS.map((key) => ({
      id: key,
      title: getCommonString(resolvedLocale, `showcase.screenshots.${key}.title`),
      description: getCommonString(resolvedLocale, `showcase.screenshots.${key}.description`),
      alt: getCommonString(resolvedLocale, `showcase.screenshots.${key}.alt`),
    })),
  };
}


export function getHomepageFeaturesCopy(locale: LocaleInput): HomepageFeaturesCopy {
  const resolvedLocale = resolveSiteLocale(locale);

  return {
    showcase: {
      title: getHomeString(resolvedLocale, 'features.showcase.title'),
      subtitle: getHomeString(resolvedLocale, 'features.showcase.subtitle'),
      demoLabel: getHomeString(resolvedLocale, 'features.showcase.demoLabel'),
      previewLabel: getHomeString(resolvedLocale, 'features.showcase.previewLabel'),
    },
    smart: {
      title: getHomeString(resolvedLocale, 'features.smart.title'),
      subtitle: getHomeString(resolvedLocale, 'features.smart.subtitle'),
      description: getHomeString(resolvedLocale, 'features.smart.description'),
      workflowStages: [
        'review',
        'scaffold',
        'spec',
        'design',
        'tasks',
        'validate',
        'apply',
        'archive',
      ].map((key) => ({
        key,
        label: getHomeString(resolvedLocale, 'features.smart.workflow.' + key + '.label'),
        desc: getHomeString(resolvedLocale, 'features.smart.workflow.' + key + '.desc'),
      })),
    },
    convenient: {
      title: getHomeString(resolvedLocale, 'features.convenient.title'),
      subtitle: getHomeString(resolvedLocale, 'features.convenient.subtitle'),
      description: getHomeString(resolvedLocale, 'features.convenient.description'),
      agentMatrix: {
        title: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.title'),
        badge: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.badge'),
        supportedProvidersTitle: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.supportedNames.title'),
        supportedProviders: [
          'ClaudeCodeCli',
          'CodexCli',
          'GitHubCopilot',
          'OpenCodeCli',
          'HermesCli',
          'QoderCli',
          'KiroCli',
          'KimiCli',
          'GeminiCli',
          'PiCli',
          'ReasonixCli',
          'DeepAgentsCli',
          'CodebuddyCli',
        ].map((key, index) => ({
          key,
          name: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.supportedNames.names.' + index),
        })),
        agentLanes: [
          {
            key: 'claude',
            name: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.claude.name'),
            role: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.claude.role'),
            instances: [
              getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.claude.instances.0'),
              getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.claude.instances.1'),
              getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.claude.instances.2'),
            ],
          },
          {
            key: 'codex',
            name: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.codex.name'),
            role: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.codex.role'),
            instances: [
              getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.codex.instances.0'),
              getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.codex.instances.1'),
              getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.codex.instances.2'),
            ],
          },
          {
            key: 'router',
            name: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.router.name'),
            role: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.router.role'),
            instances: [
              getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.router.instances.0'),
              getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.router.instances.1'),
              getHomeString(resolvedLocale, 'features.convenient.agentMatrix.agents.router.instances.2'),
            ],
          },
        ],
      },
    },
    interesting: {
      title: getHomeString(resolvedLocale, 'features.interesting.title'),
      subtitle: getHomeString(resolvedLocale, 'features.interesting.subtitle'),
      description: getHomeString(resolvedLocale, 'features.interesting.description'),
      features: [
        {
          key: 'planning',
          label: getHomeString(resolvedLocale, 'features.interesting.features.planning.label'),
          desc: getHomeString(resolvedLocale, 'features.interesting.features.planning.desc'),
        },
        {
          key: 'execution',
          label: getHomeString(resolvedLocale, 'features.interesting.features.execution.label'),
          desc: getHomeString(resolvedLocale, 'features.interesting.features.execution.desc'),
        },
        {
          key: 'workspace',
          label: getHomeString(resolvedLocale, 'features.interesting.features.workspace.label'),
          desc: getHomeString(resolvedLocale, 'features.interesting.features.workspace.desc'),
        },
      ],
    },
  };
}

export type ActionLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type EditionColumn = {
  title: string;
  action?: ActionLink;
};

export type FeatureCell = {
  type: 'check' | 'cross' | 'text';
  value?: string;
  href?: string;
  external?: boolean;
  footnote?: string;
};

export type FeatureRow = {
  feature: string;
  desktop: FeatureCell;
  microsoftStore: FeatureCell;
  microsoftStoreExclusive?: boolean;
};

export type PricingContent = {
  title: string;
  limitTitle: string;
  limitDescription: string;
  unlockFootnoteMarker: string;
  unlockFootnote: string;
  featureHeader: string;
  includedLabel: string;
  notIncludedLabel: string;
  desktopEdition: EditionColumn;
  microsoftStoreEdition: EditionColumn;
  rows: FeatureRow[];
};

export function getPricingContent(locale: LocaleInput): PricingContent {
  const resolvedLocale = resolveSiteLocale(locale);
  const pricingRows = {
    entryPoint: getHomeString(resolvedLocale, 'pricing.rows.entryPoint'),
    allFreeFeaturesIncluded: getHomeString(resolvedLocale, 'pricing.rows.allFreeFeaturesIncluded'),
    vault: getHomeString(resolvedLocale, 'pricing.rows.vault'),
    skills: getHomeString(resolvedLocale, 'pricing.rows.skills'),
    proposalWorkflow: getHomeString(resolvedLocale, 'pricing.rows.proposalWorkflow'),
    localAchievements: getHomeString(resolvedLocale, 'pricing.rows.localAchievements'),
    allAgentCliIntegrations: getHomeString(resolvedLocale, 'pricing.rows.allAgentCliIntegrations'),
    speechRecognition: getHomeString(resolvedLocale, 'pricing.rows.speechRecognition'),
    omniRouteIntegration: getHomeString(resolvedLocale, 'pricing.rows.omniRouteIntegration'),
    githubIntegration: getHomeString(resolvedLocale, 'pricing.rows.githubIntegration'),
    gitManagement: getHomeString(resolvedLocale, 'pricing.rows.gitManagement'),
    maximumConcurrentProposals: getHomeString(resolvedLocale, 'pricing.rows.maximumConcurrentProposals'),
    documentThemes: getHomeString(resolvedLocale, 'pricing.rows.documentThemes'),
    customCommitSignature: getHomeString(resolvedLocale, 'pricing.rows.customCommitSignature'),
    brandCustomization: getHomeString(resolvedLocale, 'pricing.rows.brandCustomization'),
    customAvatarUploads: getHomeString(resolvedLocale, 'pricing.rows.customAvatarUploads'),
    avatarPacks: getHomeString(resolvedLocale, 'pricing.rows.avatarPacks'),
  };
  const pricingValues = {
    desktopInstall: getHomeString(resolvedLocale, 'pricing.values.desktopInstall'),
    microsoftStoreInstall: getHomeString(resolvedLocale, 'pricing.values.microsoftStoreInstall'),
  };
  const desktopHref = getLinkWithLocale('desktop', resolvedLocale);
  const unlockFootnoteMarker = '1';
  const rows: FeatureRow[] = [
    {
      feature: pricingRows.entryPoint,
      desktop: { type: 'text', value: pricingValues.desktopInstall, href: desktopHref },
      microsoftStore: { type: 'text', value: pricingValues.microsoftStoreInstall, href: DEFAULT_WINDOWS_STORE_URL, external: true },
    },
    { feature: pricingRows.allFreeFeaturesIncluded, desktop: { type: 'check' }, microsoftStore: { type: 'check' } },
    { feature: pricingRows.vault, desktop: { type: 'check' }, microsoftStore: { type: 'check' } },
    { feature: pricingRows.skills, desktop: { type: 'check' }, microsoftStore: { type: 'check' } },
    { feature: pricingRows.proposalWorkflow, desktop: { type: 'check' }, microsoftStore: { type: 'check' } },
    { feature: pricingRows.localAchievements, desktop: { type: 'check' }, microsoftStore: { type: 'check' } },
    { feature: pricingRows.allAgentCliIntegrations, desktop: { type: 'check' }, microsoftStore: { type: 'check' } },
    { feature: pricingRows.speechRecognition, desktop: { type: 'check' }, microsoftStore: { type: 'check' } },
    { feature: pricingRows.omniRouteIntegration, desktop: { type: 'check' }, microsoftStore: { type: 'check' } },
    { feature: pricingRows.githubIntegration, desktop: { type: 'check' }, microsoftStore: { type: 'check' } },
    { feature: pricingRows.gitManagement, desktop: { type: 'check' }, microsoftStore: { type: 'check' } },
    {
      feature: pricingRows.maximumConcurrentProposals,
      desktop: { type: 'text', value: '3' },
      microsoftStore: { type: 'text', value: '32', footnote: unlockFootnoteMarker },
      microsoftStoreExclusive: true,
    },
    {
      feature: pricingRows.documentThemes,
      desktop: { type: 'cross' },
      microsoftStore: { type: 'check', footnote: unlockFootnoteMarker },
      microsoftStoreExclusive: true,
    },
    {
      feature: pricingRows.customCommitSignature,
      desktop: { type: 'cross' },
      microsoftStore: { type: 'check', footnote: unlockFootnoteMarker },
      microsoftStoreExclusive: true,
    },
    {
      feature: pricingRows.brandCustomization,
      desktop: { type: 'cross' },
      microsoftStore: { type: 'check', footnote: unlockFootnoteMarker },
      microsoftStoreExclusive: true,
    },
    {
      feature: pricingRows.customAvatarUploads,
      desktop: { type: 'cross' },
      microsoftStore: { type: 'check', footnote: unlockFootnoteMarker },
      microsoftStoreExclusive: true,
    },
    {
      feature: pricingRows.avatarPacks,
      desktop: { type: 'cross' },
      microsoftStore: { type: 'check', footnote: unlockFootnoteMarker },
      microsoftStoreExclusive: true,
    },
  ];

  return {
    title: getHomeString(resolvedLocale, 'pricing.title'),
    limitTitle: getHomeString(resolvedLocale, 'pricing.limitTitle'),
    limitDescription: getHomeString(resolvedLocale, 'pricing.limitDescription'),
    unlockFootnoteMarker,
    unlockFootnote: getHomeString(resolvedLocale, 'pricing.unlockFootnote'),
    featureHeader: getHomeString(resolvedLocale, 'pricing.featureHeader'),
    includedLabel: getHomeString(resolvedLocale, 'pricing.includedLabel'),
    notIncludedLabel: getHomeString(resolvedLocale, 'pricing.notIncludedLabel'),
    desktopEdition: {
      title: getHomeString(resolvedLocale, 'pricing.editions.desktop.title'),
      action: { label: 'Desktop', href: desktopHref },
    },
    microsoftStoreEdition: {
      title: getHomeString(resolvedLocale, 'pricing.editions.microsoftStore.title'),
      action: { label: 'Microsoft Store', href: DEFAULT_WINDOWS_STORE_URL, external: true },
    },
    rows,
  };
}

export interface HomepageWorkflowStepsCopy {
  eyebrow: string;
  title: string;
  description: string;
  /** Names the return arc: the archive feeding the next proposal. */
  loopLabel: string;
  steps: Array<{ key: 'proposal' | 'execution' | 'archive'; label: string; description: string }>;
}

export function getHomepageWorkflowStepsCopy(locale: LocaleInput): HomepageWorkflowStepsCopy {
  const resolvedLocale = resolveSiteLocale(locale);

  return {
    eyebrow: getHomeString(resolvedLocale, 'workflowSteps.eyebrow'),
    title: getHomeString(resolvedLocale, 'workflowSteps.title'),
    description: getHomeString(resolvedLocale, 'workflowSteps.description'),
    loopLabel: getHomeString(resolvedLocale, 'workflowSteps.loopLabel'),
    steps: (['proposal', 'execution', 'archive'] as const).map((key) => ({
      key,
      label: getHomeString(resolvedLocale, `workflowSteps.steps.${key}.label`),
      description: getHomeString(resolvedLocale, `workflowSteps.steps.${key}.description`),
    })),
  };
}
