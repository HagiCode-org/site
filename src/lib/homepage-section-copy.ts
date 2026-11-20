import { resolveSiteLocale } from '@/i18n/locale-metadata';
import { getLocaleResourceValue } from '@/i18n/resource-lookup';
import { getLinkWithLocale } from '@/lib/shared/links';

type LocaleInput = string | null | undefined;

type ShowcaseScreenshotKey =
  | 'sessionBoard'
  | 'proposalWorkflow'
  | 'agentRoster'
  | 'agentCli'
  | 'skillsGallery'
  | 'vault'
  | 'tokenUsage'
  | 'achievements'
  | 'gitManagement'
  | 'scheduledPlans';

const SHOWCASE_SCREENSHOT_KEYS: ShowcaseScreenshotKey[] = [
  'sessionBoard',
  'proposalWorkflow',
  'agentRoster',
  'agentCli',
  'skillsGallery',
  'vault',
  'tokenUsage',
  'achievements',
  'gitManagement',
  'scheduledPlans',
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
    zoomIn: string;
    zoomOut: string;
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


/** Terminology worlds of the product's Document Subject Themes, in the order the product lists them. */
export const HOMEPAGE_WORLD_KEYS = [
  'agents',
  'fantasyAdventure',
  'cattleRanching',
  'animeAcademy',
  'imperialCourt',
  'alienLaboratory',
  'hiveColony',
  'oceanSphereColony',
  'clockworkWorkshop',
  'pastoralPlanting',
] as const;

export type HomepageWorldKey = (typeof HOMEPAGE_WORLD_KEYS)[number];

/**
 * One Agent CLI as the homepage CLI bay shows it. Every field comes from that CLI's own comparison
 * article (see `getHomepageCliProfiles`), so the homepage states nothing the article does not.
 */
export interface HomepageCliProfile {
  /** Comparison article slug without the `-vs-hagicode` suffix, e.g. `claude`. */
  key: string;
  agentName: string;
  /** Name for a compact tile: no trailing "CLI", no parenthetical alias. */
  shortName: string;
  href: string;
  /** Locale of the article the text was read from; differs from the page locale for short-template locales. */
  contentLocale: string;
  whatItIs: string;
  runsOn: string;
  models: string;
  start: string;
  /** How HagiCode relays the CLI's questions; empty when the article has no such row. */
  questions: string;
  strengths: string[];
}

export interface HomepageFeaturesCopy {
  showcase: {
    title: string;
    subtitle: string;
  };
  smart: {
    title: string;
    subtitle: string;
    artifactsTitle: string;
    description: string;
    paused: string;
    workflowStages: Array<{
      key: string;
      label: string;
      desc: string;
    }>;
  };
  convenient: {
    title: string;
    subtitle: string;
    traditional: string;
    multiThread: string;
    description: string;
    cliBay: {
      title: string;
      hint: string;
      chain: { agent: string; model: string };
      labels: Record<'whatItIs' | 'models' | 'runsOn' | 'start' | 'questions' | 'strengths' | 'compare', string>;
    };
    agentMatrix: {
      title: string;
      badge: string;
      status: string;
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
    worlds: {
      title: string;
      labels: Record<'agent' | 'group' | 'job' | 'log', string>;
      items: Array<{
        key: HomepageWorldKey;
        name: string;
        agent: string;
        group: string;
        job: string;
        log: string;
      }>;
    };
    agents: {
      caption: string;
      items: Array<{
        key: string;
        name: string;
        trait: string;
      }>;
    };
    progress: {
      title: string;
      token: string;
      achievements: string;
      tiers: Record<'star' | 'moon' | 'sun' | 'crown', string>;
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
      zoomIn: getCommonString(resolvedLocale, 'showcase.controls.zoomIn'),
      zoomOut: getCommonString(resolvedLocale, 'showcase.controls.zoomOut'),
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
    },
    smart: {
      title: getHomeString(resolvedLocale, 'features.smart.title'),
      subtitle: getHomeString(resolvedLocale, 'features.smart.subtitle'),
      artifactsTitle: getHomeString(resolvedLocale, 'features.smart.artifactsTitle'),
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
      title: getHomeString(resolvedLocale, 'features.convenient.title'),
      subtitle: getHomeString(resolvedLocale, 'features.convenient.subtitle'),
      traditional: getHomeString(resolvedLocale, 'features.convenient.traditional'),
      multiThread: getHomeString(resolvedLocale, 'features.convenient.multiThread'),
      description: getHomeString(resolvedLocale, 'features.convenient.description'),
      cliBay: {
        title: getHomeString(resolvedLocale, 'features.convenient.cliBay.title'),
        hint: getHomeString(resolvedLocale, 'features.convenient.cliBay.hint'),
        chain: {
          agent: getHomeString(resolvedLocale, 'features.convenient.cliBay.chain.agent'),
          model: getHomeString(resolvedLocale, 'features.convenient.cliBay.chain.model'),
        },
        labels: Object.fromEntries(
          ['whatItIs', 'models', 'runsOn', 'start', 'questions', 'strengths', 'compare'].map((key) => [
            key,
            getHomeString(resolvedLocale, 'features.convenient.cliBay.labels.' + key),
          ]),
        ) as HomepageFeaturesCopy['convenient']['cliBay']['labels'],
      },
      agentMatrix: {
        title: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.title'),
        badge: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.badge'),
        status: getHomeString(resolvedLocale, 'features.convenient.agentMatrix.status'),
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
      worlds: {
        title: getHomeString(resolvedLocale, 'features.interesting.worlds.title'),
        labels: {
          agent: getHomeString(resolvedLocale, 'features.interesting.worlds.labels.agent'),
          group: getHomeString(resolvedLocale, 'features.interesting.worlds.labels.group'),
          job: getHomeString(resolvedLocale, 'features.interesting.worlds.labels.job'),
          log: getHomeString(resolvedLocale, 'features.interesting.worlds.labels.log'),
        },
        items: HOMEPAGE_WORLD_KEYS.map((key) => {
          const base = 'features.interesting.worlds.items.' + key + '.';
          return {
            key,
            name: getHomeString(resolvedLocale, base + 'name'),
            agent: getHomeString(resolvedLocale, base + 'agent'),
            group: getHomeString(resolvedLocale, base + 'group'),
            job: getHomeString(resolvedLocale, base + 'job'),
            log: getHomeString(resolvedLocale, base + 'log'),
          };
        }),
      },
      agents: {
        caption: getHomeString(resolvedLocale, 'features.interesting.agents.caption'),
        items: ['strategist', 'runner', 'artist'].map((key) => ({
          key,
          name: getHomeString(resolvedLocale, 'features.interesting.agents.items.' + key + '.name'),
          trait: getHomeString(resolvedLocale, 'features.interesting.agents.items.' + key + '.trait'),
        })),
      },
      progress: {
        title: getHomeString(resolvedLocale, 'features.interesting.progress.title'),
        token: getHomeString(resolvedLocale, 'features.interesting.progress.token'),
        achievements: getHomeString(resolvedLocale, 'features.interesting.progress.achievements'),
        tiers: {
          star: getHomeString(resolvedLocale, 'features.interesting.progress.tiers.star'),
          moon: getHomeString(resolvedLocale, 'features.interesting.progress.tiers.moon'),
          sun: getHomeString(resolvedLocale, 'features.interesting.progress.tiers.sun'),
          crown: getHomeString(resolvedLocale, 'features.interesting.progress.tiers.crown'),
        },
      },
    },
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
