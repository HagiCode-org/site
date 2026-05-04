import { requireLocaleResourceString } from '@/i18n/resource-lookup';
import {
  DEFAULT_LOCALE,
  getSiteLocaleFallbackChain,
  resolveSiteLocale,
  type SiteLocale,
} from '@/i18n/locale-metadata';
import type {
  FeaturedVideosByProvider,
  VideoShowcaseItem,
} from '@/components/home/VideoShowcase';

type LocalizedSitePageCopy<T> = Partial<Record<SiteLocale, T>>;

function resolveSitePageCopy<T>(
  locale: SiteLocale,
  catalog: LocalizedSitePageCopy<T>,
  catalogName: string,
): T {
  for (const candidate of [locale, ...getSiteLocaleFallbackChain(locale)]) {
    const value = catalog[candidate];
    if (value) {
      return value;
    }
  }

  const fallbackValue = catalog[DEFAULT_LOCALE];
  if (!fallbackValue) {
    throw new Error(`Missing ${catalogName} fallback for ${DEFAULT_LOCALE}`);
  }

  return fallbackValue;
}

const homePageSeoCopy: LocalizedSitePageCopy<{ title: string; description: string }> = {
  'en-US': {
    title: 'Hagicode - Smart · Efficient · Fun AI Coding Assistant',
    description:
      'Redefine coding with AI. OpenSpec workflows, multi-agent multi-instance execution, and Hero Dungeon gameplay make building faster and more engaging.',
  },
  'zh-CN': {
    title: 'Hagicode - 智能 · 高效 · 有趣的 AI 编码助手',
    description:
      '用 AI 重新定义代码开发体验。OpenSpec 工作流、多 Agent 多实例并行、Hero Dungeon 游戏化，让编码更高效、更有趣。',
  },
  'zh-Hant': {
    title: 'Hagicode - 智慧 · 高效 · 有趣的 AI 程式設計助手',
    description:
      '用 AI 重新定義程式開發體驗。OpenSpec 工作流、多 Agent 多實例並行、Hero Dungeon 遊戲化，讓編碼更高效、更有趣。',
  },
  'ja-JP': {
    title: 'Hagicode - スマート・効率的・楽しい AI コーディングアシスタント',
    description:
      'AI でコーディング体験を再設計。OpenSpec ワークフロー、マルチエージェント並列実行、Hero Dungeon のゲーム化で、開発をより速く、より楽しくします。',
  },
  'ko-KR': {
    title: 'Hagicode - 스마트하고 효율적이며 재미있는 AI 코딩 어시스턴트',
    description:
      'AI로 코딩 경험을 재정의합니다. OpenSpec 워크플로, 멀티 에이전트 멀티 인스턴스 병렬 실행, Hero Dungeon 게임화로 개발을 더 빠르고 더 즐겁게 만듭니다.',
  },
  'de-DE': {
    title: 'Hagicode - Intelligenter, effizienter und unterhaltsamer KI-Coding-Assistent',
    description:
      'Definieren Sie das Programmieren mit KI neu. OpenSpec-Workflows, parallele Multi-Agent- und Multi-Instanz-Ausführung sowie Hero-Dungeon-Gamification machen Entwicklung schneller und spannender.',
  },
  'fr-FR': {
    title: 'Hagicode - Assistant de codage IA intelligent, efficace et ludique',
    description:
      "Réinventez le développement avec l'IA. Les workflows OpenSpec, l'exécution parallèle multi-agents et multi-instances, et la gamification Hero Dungeon rendent la création plus rapide et plus engageante.",
  },
  'es-ES': {
    title: 'Hagicode - Asistente de programación con IA inteligente, eficiente y divertido',
    description:
      'Redefine el desarrollo con IA. Los flujos OpenSpec, la ejecución paralela multiagente y multiinstancia, y la gamificación Hero Dungeon hacen que crear sea más rápido y atractivo.',
  },
  'pt-BR': {
    title: 'Hagicode - Assistente de programação com IA inteligente, eficiente e divertido',
    description:
      'Redefina o desenvolvimento com IA. Workflows OpenSpec, execução paralela com múltiplos agentes e instâncias e a gamificação Hero Dungeon tornam a construção mais rápida e envolvente.',
  },
  'ru-RU': {
    title: 'Hagicode - Умный, эффективный и увлекательный ИИ-помощник для программирования',
    description:
      'Переосмыслите разработку с ИИ. Workflow OpenSpec, параллельное выполнение с несколькими агентами и экземплярами и геймификация Hero Dungeon делают создание быстрее и интереснее.',
  },
};

const desktopRuntimeNoteCopy: LocalizedSitePageCopy<{
  label: string;
  copy: string;
  ariaLabel: string;
}> = {
  'en-US': {
    label: 'Fallback',
    copy:
      'If package loading fails here, this page redirects to the canonical Index Desktop version history:',
    ariaLabel: 'Package loading fallback notice',
  },
  'zh-CN': {
    label: '回退说明',
    copy: '若此页加载安装包失败，将自动跳转到 canonical 的 Index Desktop 版本历史页：',
    ariaLabel: '安装包加载失败回退说明',
  },
  'zh-Hant': {
    label: '回退說明',
    copy: '若此頁載入安裝套件失敗，將自動跳轉到 canonical 的 Index Desktop 版本歷史頁：',
    ariaLabel: '安裝套件載入失敗回退說明',
  },
  'ja-JP': {
    label: 'フォールバック',
    copy:
      'このページでパッケージの読み込みに失敗した場合は、公式の Index Desktop バージョン履歴ページへ移動します：',
    ariaLabel: 'パッケージ読み込み失敗時のフォールバック案内',
  },
  'ko-KR': {
    label: '대체 안내',
    copy:
      '이 페이지에서 패키지 로딩에 실패하면 공식 Index Desktop 버전 기록 페이지로 이동합니다:',
    ariaLabel: '패키지 로딩 실패 시 대체 안내',
  },
  'de-DE': {
    label: 'Fallback',
    copy:
      'Wenn das Laden der Pakete hier fehlschlägt, leitet diese Seite zum kanonischen Index-Desktop-Versionsverlauf weiter:',
    ariaLabel: 'Hinweis zum Fallback bei fehlgeschlagenem Paketladen',
  },
  'fr-FR': {
    label: 'Relais',
    copy:
      "Si le chargement du paquet échoue ici, cette page redirige vers l'historique canonical des versions Index Desktop :",
    ariaLabel: 'Avis de secours en cas d’échec du chargement du paquet',
  },
  'es-ES': {
    label: 'Alternativa',
    copy:
      'Si la carga del paquete falla aquí, esta página redirige al historial de versiones canonical de Index Desktop:',
    ariaLabel: 'Aviso de alternativa por fallo al cargar el paquete',
  },
  'pt-BR': {
    label: 'Fallback',
    copy:
      'Se o carregamento do pacote falhar aqui, esta página redireciona para o histórico canonical de versões do Index Desktop:',
    ariaLabel: 'Aviso de fallback para falha no carregamento do pacote',
  },
  'ru-RU': {
    label: 'Резервный путь',
    copy:
      'Если загрузка пакета здесь не удалась, эта страница перенаправит на canonical страницу истории версий Index Desktop:',
    ariaLabel: 'Уведомление о резервном переходе при ошибке загрузки пакета',
  },
};

export function getHomePageCopy(locale: SiteLocale) {
  const resolvedLocale = resolveSiteLocale(locale);
  const pageCopy = resolveSitePageCopy(resolvedLocale, homePageSeoCopy, 'home page SEO copy');

  return {
    title: pageCopy.title,
    description: pageCopy.description,
    featuredHomepageVideos: {
      youtube: {
        provider: 'youtube',
        embedId: 'AQ8oSTW6wNQ',
        title: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.overview.youtube.title',
        ),
        description: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.overview.youtube.description',
        ),
        watchUrl: 'https://www.youtube.com/watch?v=AQ8oSTW6wNQ',
        ctaLabel: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.overview.youtube.ctaLabel',
        ),
      },
      bilibili: {
        provider: 'bilibili',
        embedId: 'BV1z4oWB3EpY',
        title: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.overview.bilibili.title',
        ),
        description: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.overview.bilibili.description',
        ),
        watchUrl: 'https://www.bilibili.com/video/BV1z4oWB3EpY/',
        ctaLabel: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.overview.bilibili.ctaLabel',
        ),
      },
    } satisfies FeaturedVideosByProvider,
    supportingHomepageVideos: [
      {
        provider: 'bilibili',
        embedId: 'BV1KxwMzxEVK',
        title: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.supporting.first.title',
        ),
        description: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.supporting.first.description',
        ),
        watchUrl: 'https://www.bilibili.com/video/BV1KxwMzxEVK/',
        ctaLabel: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.supporting.first.ctaLabel',
        ),
      },
      {
        provider: 'bilibili',
        embedId: 'BV1yqPmzTEqP',
        title: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.supporting.second.title',
        ),
        description: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.supporting.second.description',
        ),
        watchUrl: 'https://www.bilibili.com/video/BV1yqPmzTEqP/',
        ctaLabel: requireLocaleResourceString(
          resolvedLocale,
          'home',
          'homepageVideos.supporting.second.ctaLabel',
        ),
      },
    ] satisfies VideoShowcaseItem[],
    productOverviewVideoCopy: {
      title: requireLocaleResourceString(resolvedLocale, 'home', 'productOverviewVideo.title'),
    },
    supportingSection: {
      eyebrow: requireLocaleResourceString(resolvedLocale, 'home', 'videoShowcase.eyebrow'),
      title: requireLocaleResourceString(resolvedLocale, 'home', 'videoShowcase.title'),
      description: requireLocaleResourceString(
        resolvedLocale,
        'home',
        'videoShowcase.description',
      ),
      supportingLabel: requireLocaleResourceString(
        resolvedLocale,
        'home',
        'videoShowcase.supportingLabel',
      ),
    },
  };
}

export function getDesktopPageCopy(locale: SiteLocale) {
  const resolvedLocale = resolveSiteLocale(locale);
  const runtimeNote = resolveSitePageCopy(
    resolvedLocale,
    desktopRuntimeNoteCopy,
    'desktop runtime note copy',
  );

  return {
    title: requireLocaleResourceString(resolvedLocale, 'desktop', 'desktop.title'),
    description: requireLocaleResourceString(resolvedLocale, 'desktop', 'desktop.description'),
    runtimeNoteLabel: runtimeNote.label,
    runtimeNoteCopy: runtimeNote.copy,
    runtimeNoteAriaLabel: runtimeNote.ariaLabel,
  };
}

export function getContainerPageCopy(locale: SiteLocale) {
  const resolvedLocale = resolveSiteLocale(locale);

  return {
    title: requireLocaleResourceString(resolvedLocale, 'container', 'container.title'),
    description: requireLocaleResourceString(resolvedLocale, 'container', 'container.description'),
  };
}
