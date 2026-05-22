import { requireLocaleResourceString } from '@/i18n/resource-lookup';
import { resolveSiteLocale, type SiteLocale } from '@/i18n/locale-metadata';

export interface HomepageNavbarCopy {
  home: string;
  explore: string;
  docs: string;
  support: string;
  mobileOpenMenu: string;
  mobileCloseMenu: string;
  mobileNav: string;
}

export interface HomepageThemeToggleCopy {
  darkMode: string;
  lightMode: string;
  lunarNewYearMode: string;
}

export interface HomepageLanguageSwitcherCopy {
  label: string;
  dialogTitle: string;
  currentLocaleLabel: string;
  close: string;
  selectedState: string;
}

export interface HomepageHeroCopy {
  tagline: string;
  description: string;
  secondaryLine: string;
  taglines: {
    smart: string;
    aiDriven: string;
    openspec: string;
    multiThread: string;
  };
  problem: string;
  painPoint: string;
  painPoints: string;
  solution: string;
  features: string[];
  redefine: string;
  valueCards: {
    smart: {
      title: string;
      description: string;
    };
    efficient: {
      title: string;
      description: string;
    };
    interesting: {
      title: string;
      description: string;
    };
  };
  buttons: {
    desktopApp: string;
    containerApp: string;
    learnMore: string;
  };
  windowsStoreLabel: string;
  windowsStoreAriaLabel: string;
  steamAriaLabel: string;
  ctaGroupLabel: string;
}

export interface HomepageWorkflowBoardCopy {
  titleLines: string[];
  taskLabel: string;
  headerSummary: string;
  steps: string[];
  activeStates: string[];
  completedState: string;
  metrics: {
    completed: string;
    efficiency: string;
    serialTime: string;
    elapsedTime: string;
    formula: string;
    serialHint: string;
  };
}

export interface HomepageInteractiveCopy {
  navbar: HomepageNavbarCopy;
  themeToggle: HomepageThemeToggleCopy;
  languageSwitcher: HomepageLanguageSwitcherCopy;
  hero: HomepageHeroCopy;
  workflowBoard: HomepageWorkflowBoardCopy;
}

function resolveLocale(locale: SiteLocale) {
  return resolveSiteLocale(locale);
}

export function getHomepageNavbarCopy(locale: SiteLocale): HomepageNavbarCopy {
  const resolvedLocale = resolveLocale(locale);

  return {
    home: requireLocaleResourceString(resolvedLocale, 'common', 'navbar.home'),
    explore: requireLocaleResourceString(resolvedLocale, 'common', 'navbar.explore'),
    docs: requireLocaleResourceString(resolvedLocale, 'common', 'navbar.docs'),
    support: requireLocaleResourceString(resolvedLocale, 'common', 'navbar.support'),
    mobileOpenMenu: requireLocaleResourceString(resolvedLocale, 'common', 'navbar.mobileOpenMenu'),
    mobileCloseMenu: requireLocaleResourceString(resolvedLocale, 'common', 'navbar.mobileCloseMenu'),
    mobileNav: requireLocaleResourceString(resolvedLocale, 'common', 'navbar.mobileNav'),
  };
}

export function getHomepageThemeToggleCopy(locale: SiteLocale): HomepageThemeToggleCopy {
  const resolvedLocale = resolveLocale(locale);

  return {
    darkMode: requireLocaleResourceString(resolvedLocale, 'common', 'themeToggle.darkMode'),
    lightMode: requireLocaleResourceString(resolvedLocale, 'common', 'themeToggle.lightMode'),
    lunarNewYearMode: requireLocaleResourceString(resolvedLocale, 'common', 'themeToggle.lunarNewYearMode'),
  };
}

export function getHomepageLanguageSwitcherCopy(locale: SiteLocale): HomepageLanguageSwitcherCopy {
  const resolvedLocale = resolveLocale(locale);

  return {
    label: requireLocaleResourceString(resolvedLocale, 'common', 'languageSwitcher.label'),
    dialogTitle: requireLocaleResourceString(resolvedLocale, 'common', 'languageSwitcher.dialogTitle'),
    currentLocaleLabel: requireLocaleResourceString(resolvedLocale, 'common', 'languageSwitcher.currentLocaleLabel'),
    close: requireLocaleResourceString(resolvedLocale, 'common', 'languageSwitcher.close'),
    selectedState: requireLocaleResourceString(resolvedLocale, 'common', 'languageSwitcher.selectedState'),
  };
}

export function getHomepageHeroCopy(locale: SiteLocale): HomepageHeroCopy {
  const resolvedLocale = resolveLocale(locale);

  return {
    tagline: requireLocaleResourceString(resolvedLocale, 'home', 'hero.tagline'),
    description: requireLocaleResourceString(resolvedLocale, 'home', 'hero.description'),
    secondaryLine: requireLocaleResourceString(resolvedLocale, 'home', 'hero.secondaryLine'),
    taglines: {
      smart: requireLocaleResourceString(resolvedLocale, 'home', 'hero.taglines.smart'),
      aiDriven: requireLocaleResourceString(resolvedLocale, 'home', 'hero.taglines.aiDriven'),
      openspec: requireLocaleResourceString(resolvedLocale, 'home', 'hero.taglines.openspec'),
      multiThread: requireLocaleResourceString(resolvedLocale, 'home', 'hero.taglines.multiThread'),
    },
    problem: requireLocaleResourceString(resolvedLocale, 'home', 'hero.problem'),
    painPoint: requireLocaleResourceString(resolvedLocale, 'home', 'hero.painPoint'),
    painPoints: requireLocaleResourceString(resolvedLocale, 'home', 'hero.painPoints'),
    solution: requireLocaleResourceString(resolvedLocale, 'home', 'hero.solution'),
    features: [
      requireLocaleResourceString(resolvedLocale, 'home', 'hero.features.0'),
      requireLocaleResourceString(resolvedLocale, 'home', 'hero.features.1'),
      requireLocaleResourceString(resolvedLocale, 'home', 'hero.features.2'),
    ],
    redefine: requireLocaleResourceString(resolvedLocale, 'home', 'hero.redefine'),
    valueCards: {
      smart: {
        title: requireLocaleResourceString(resolvedLocale, 'home', 'hero.valueCards.smart.title'),
        description: requireLocaleResourceString(resolvedLocale, 'home', 'hero.valueCards.smart.description'),
      },
      efficient: {
        title: requireLocaleResourceString(resolvedLocale, 'home', 'hero.valueCards.efficient.title'),
        description: requireLocaleResourceString(resolvedLocale, 'home', 'hero.valueCards.efficient.description'),
      },
      interesting: {
        title: requireLocaleResourceString(resolvedLocale, 'home', 'hero.valueCards.interesting.title'),
        description: requireLocaleResourceString(resolvedLocale, 'home', 'hero.valueCards.interesting.description'),
      },
    },
    buttons: {
      desktopApp: requireLocaleResourceString(resolvedLocale, 'home', 'hero.buttons.desktopApp'),
      containerApp: requireLocaleResourceString(resolvedLocale, 'home', 'hero.buttons.containerApp'),
      learnMore: requireLocaleResourceString(resolvedLocale, 'home', 'hero.buttons.learnMore'),
    },
    windowsStoreLabel: requireLocaleResourceString(resolvedLocale, 'home', 'homepageVideos.hero.windowsStoreLabel'),
    windowsStoreAriaLabel: requireLocaleResourceString(
      resolvedLocale,
      'home',
      'homepageVideos.hero.windowsStoreAriaLabel',
    ),
    steamAriaLabel: requireLocaleResourceString(resolvedLocale, 'home', 'homepageVideos.hero.steamAriaLabel'),
    ctaGroupLabel: requireLocaleResourceString(resolvedLocale, 'home', 'homepageVideos.hero.ctaGroupLabel'),
  };
}

export function getHeroWorkflowBoardCopy(locale: SiteLocale): HomepageWorkflowBoardCopy {
  const resolvedLocale = resolveLocale(locale);

  return {
    titleLines: [
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.titleLines.0'),
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.titleLines.1'),
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.titleLines.2'),
    ],
    taskLabel: requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.taskLabel'),
    headerSummary: requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.headerSummary'),
    steps: [
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.steps.0'),
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.steps.1'),
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.steps.2'),
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.steps.3'),
    ],
    activeStates: [
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.activeStates.0'),
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.activeStates.1'),
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.activeStates.2'),
      requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.activeStates.3'),
    ],
    completedState: requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.completedState'),
    metrics: {
      completed: requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.metrics.completed'),
      efficiency: requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.metrics.efficiency'),
      serialTime: requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.metrics.serialTime'),
      elapsedTime: requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.metrics.elapsedTime'),
      formula: requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.metrics.formula'),
      serialHint: requireLocaleResourceString(resolvedLocale, 'home', 'workflowBoard.metrics.serialHint'),
    },
  };
}

export function getHomepageInteractiveCopy(locale: SiteLocale): HomepageInteractiveCopy {
  return {
    navbar: getHomepageNavbarCopy(locale),
    themeToggle: getHomepageThemeToggleCopy(locale),
    languageSwitcher: getHomepageLanguageSwitcherCopy(locale),
    hero: getHomepageHeroCopy(locale),
    workflowBoard: getHeroWorkflowBoardCopy(locale),
  };
}
