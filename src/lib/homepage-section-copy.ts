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
  };
  smart: {
    badge: string;
    title: string;
    subtitle: string;
    efficiency: string;
    traditional: string;
    hagicode: string;
    description: string;
    paused: string;
    workflowStages: Array<{
      key: string;
      label: string;
      desc: string;
    }>;
  };
  convenient: {
    badge: string;
    title: string;
    subtitle: string;
    traditional: string;
    multiThread: string;
    boost: string;
    boostValue: string;
    description: string;
    agentMatrix: {
      title: string;
      badge: string;
      status: string;
      supportedProvidersTitle: string;
      supportedProvidersNote: string;
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
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    features: Array<{
      key: string;
      label: string;
      desc: string;
    }>;
    battleReport: {
      title: string;
      badge: string;
      note: string;
      metrics: Array<{
        key: string;
        value: string;
        label: string;
      }>;
    };
    dungeonCards: Array<{
      key: string;
      title: string;
      desc: string;
      status: string;
    }>;
    roster: {
      title: string;
      heroes: Array<{
        key: string;
        name: string;
        role: string;
      }>;
    };
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
  const isChineseLocale = resolvedLocale.toLowerCase().startsWith('zh');

  return {
    showcase: {
      title: getHomeString(resolvedLocale, 'features.showcase.title'),
      subtitle: getHomeString(resolvedLocale, 'features.showcase.subtitle'),
    },
    smart: {
      badge: getHomeString(resolvedLocale, 'features.smart.badge'),
      title: getHomeString(resolvedLocale, 'features.smart.title'),
      subtitle: getHomeString(resolvedLocale, 'features.smart.subtitle'),
      efficiency: getHomeString(resolvedLocale, 'features.smart.efficiency'),
      traditional: getHomeString(resolvedLocale, 'features.smart.traditional'),
      hagicode: getHomeString(resolvedLocale, 'features.smart.hagicode'),
      description: getHomeString(resolvedLocale, 'features.smart.description'),
      paused: getHomeString(resolvedLocale, 'features.smart.paused'),
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
      badge: getHomeString(resolvedLocale, 'features.convenient.badge'),
      title: getHomeString(resolvedLocale, 'features.convenient.title'),
      subtitle: getHomeString(resolvedLocale, 'features.convenient.subtitle'),
      traditional: getHomeString(resolvedLocale, 'features.convenient.traditional'),
      multiThread: getHomeString(resolvedLocale, 'features.convenient.multiThread'),
      boost: getHomeString(resolvedLocale, 'features.convenient.boost'),
      boostValue: getHomeString(resolvedLocale, 'features.convenient.boostValue'),
      description: getHomeString(resolvedLocale, 'features.convenient.description'),
      agentMatrix: {
        title: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.title'),
        badge: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.badge'),
        status: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.status'),
        supportedProvidersTitle: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.supportedNames.title'),
        supportedProvidersNote: isChineseLocale
          ? 'OpenCode 可继承共享的 OmniRoute 模型目录，同时保留分支级原始模型覆写。'
          : 'OpenCode can inherit the shared OmniRoute catalog while keeping branch-level raw model overrides editable.',
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
      badge: getHomeString(resolvedLocale, 'features.interesting.badge'),
      title: getHomeString(resolvedLocale, 'features.interesting.title'),
      subtitle: getHomeString(resolvedLocale, 'features.interesting.subtitle'),
      description: getHomeString(resolvedLocale, 'features.interesting.description'),
      features: [
        {
          key: 'dungeons',
          label: getHomeString(resolvedLocale, 'features.interesting.features.dungeons.label'),
          desc: getHomeString(resolvedLocale, 'features.interesting.features.dungeons.desc'),
        },
        {
          key: 'captains',
          label: getHomeString(resolvedLocale, 'features.interesting.features.captains.label'),
          desc: getHomeString(resolvedLocale, 'features.interesting.features.captains.desc'),
        },
        {
          key: 'battle',
          label: getHomeString(resolvedLocale, 'features.interesting.features.battle.label'),
          desc: getHomeString(resolvedLocale, 'features.interesting.features.battle.desc'),
        },
      ],
      battleReport: {
        title: getHomeString(resolvedLocale, 'features.interesting.battleReport.title'),
        badge: getHomeString(resolvedLocale, 'features.interesting.battleReport.badge'),
        note: getHomeString(resolvedLocale, 'features.interesting.battleReport.note'),
        metrics: [
          {
            key: 'dungeons',
            value: getHomeString(resolvedLocale, 'features.interesting.battleReport.metrics.dungeons.value'),
            label: getHomeString(resolvedLocale, 'features.interesting.battleReport.metrics.dungeons.label'),
          },
          {
            key: 'level',
            value: getHomeString(resolvedLocale, 'features.interesting.battleReport.metrics.level.value'),
            label: getHomeString(resolvedLocale, 'features.interesting.battleReport.metrics.level.label'),
          },
          {
            key: 'xp',
            value: getHomeString(resolvedLocale, 'features.interesting.battleReport.metrics.xp.value'),
            label: getHomeString(resolvedLocale, 'features.interesting.battleReport.metrics.xp.label'),
          },
        ],
      },
      dungeonCards: [
        {
          key: 'proposal',
          title: getHomeString(resolvedLocale, 'features.interesting.dungeonCards.proposal.title'),
          desc: getHomeString(resolvedLocale, 'features.interesting.dungeonCards.proposal.desc'),
          status: getHomeString(resolvedLocale, 'features.interesting.dungeonCards.proposal.status'),
        },
        {
          key: 'autotask',
          title: getHomeString(resolvedLocale, 'features.interesting.dungeonCards.autotask.title'),
          desc: getHomeString(resolvedLocale, 'features.interesting.dungeonCards.autotask.desc'),
          status: getHomeString(resolvedLocale, 'features.interesting.dungeonCards.autotask.status'),
        },
        {
          key: 'prompt',
          title: getHomeString(resolvedLocale, 'features.interesting.dungeonCards.prompt.title'),
          desc: getHomeString(resolvedLocale, 'features.interesting.dungeonCards.prompt.desc'),
          status: getHomeString(resolvedLocale, 'features.interesting.dungeonCards.prompt.status'),
        },
      ],
      roster: {
        title: getHomeString(resolvedLocale, 'features.interesting.roster.title'),
        heroes: [
          {
            key: 'strategist',
            name: getHomeString(resolvedLocale, 'features.interesting.roster.heroes.strategist.name'),
            role: getHomeString(resolvedLocale, 'features.interesting.roster.heroes.strategist.role'),
          },
          {
            key: 'runner',
            name: getHomeString(resolvedLocale, 'features.interesting.roster.heroes.runner.name'),
            role: getHomeString(resolvedLocale, 'features.interesting.roster.heroes.runner.role'),
          },
          {
            key: 'artist',
            name: getHomeString(resolvedLocale, 'features.interesting.roster.heroes.artist.name'),
            role: getHomeString(resolvedLocale, 'features.interesting.roster.heroes.artist.role'),
          },
        ],
      },
    },
  };
}

function getPendingLabel(locale: string): string {
  return locale.toLowerCase().startsWith('zh') ? '待定' : 'Pending';
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
};

export type FeatureRow = {
  feature: string;
  desktop: FeatureCell;
  container: FeatureCell;
  steam: FeatureCell;
  turbo: FeatureCell;
  steamExclusive?: boolean;
};

export type PricingContent = {
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
};

export function getPricingContent(locale: LocaleInput): PricingContent {
  const resolvedLocale = resolveSiteLocale(locale);
  const pricingRows = {
    pricing: getHomeString(resolvedLocale, 'pricing.rows.pricing'),
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
    copySwitchingSupport: getHomeString(resolvedLocale, 'pricing.rows.copySwitchingSupport'),
    turboEngineAvatarPacks: getHomeString(resolvedLocale, 'pricing.rows.turboEngineAvatarPacks'),
    customAvatarUploads: getHomeString(resolvedLocale, 'pricing.rows.customAvatarUploads'),
    customLogo: getHomeString(resolvedLocale, 'pricing.rows.customLogo'),
    customTitle: getHomeString(resolvedLocale, 'pricing.rows.customTitle'),
    customCoAuthoredByInfo: getHomeString(resolvedLocale, 'pricing.rows.customCoAuthoredByInfo'),
  };
  const pricingValues = {
    free: getHomeString(resolvedLocale, 'pricing.values.free'),
    viewOnSteam: getHomeString(resolvedLocale, 'pricing.values.viewOnSteam'),
  };
  const pendingLabel = getPendingLabel(resolvedLocale);
  const desktopHref = getLinkWithLocale('desktop', resolvedLocale);
  const containerHref = getLinkWithLocale('container', resolvedLocale);
  const rows: FeatureRow[] = [
    {
      feature: pricingRows.pricing,
      desktop: { type: 'text', value: pricingValues.free },
      container: { type: 'text', value: pricingValues.free },
      steam: { type: 'text', value: pricingValues.free },
      turbo: {
        type: 'text',
        value: pendingLabel,
      },
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
    {
      feature: pricingRows.maximumConcurrentProposals,
      desktop: { type: 'text', value: '6' },
      container: { type: 'text', value: '6' },
      steam: { type: 'text', value: '6' },
      turbo: { type: 'text', value: '32' },
    },
    { feature: pricingRows.copySwitchingSupport, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
    { feature: pricingRows.turboEngineAvatarPacks, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
    { feature: pricingRows.customAvatarUploads, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
    { feature: pricingRows.customLogo, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
    { feature: pricingRows.customTitle, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
    { feature: pricingRows.customCoAuthoredByInfo, desktop: { type: 'cross' }, container: { type: 'cross' }, steam: { type: 'cross' }, turbo: { type: 'check' } },
  ];

  return {
    title: getHomeString(resolvedLocale, 'pricing.title'),
    limitTitle: getHomeString(resolvedLocale, 'pricing.limitTitle'),
    limitDescription: getHomeString(resolvedLocale, 'pricing.limitDescription'),
    plusTitle: getHomeString(resolvedLocale, 'pricing.plusTitle'),
    plusDescription: getHomeString(resolvedLocale, 'pricing.plusDescription'),
    featureHeader: getHomeString(resolvedLocale, 'pricing.featureHeader'),
    includedLabel: getHomeString(resolvedLocale, 'pricing.includedLabel'),
    notIncludedLabel: getHomeString(resolvedLocale, 'pricing.notIncludedLabel'),
    desktopEdition: {
      title: getHomeString(resolvedLocale, 'pricing.editions.desktop.title'),
      action: { label: 'Desktop', href: desktopHref },
    },
    containerEdition: {
      title: getHomeString(resolvedLocale, 'pricing.editions.container.title'),
      action: { label: 'Container', href: containerHref },
    },
    steamEdition: {
      title: 'Windows Store',
      action: { label: 'Windows Store', href: DEFAULT_WINDOWS_STORE_URL, external: true },
    },
    turboEdition: {
      title: 'Hagicode Plus',
    },
    rows,
  };
}


