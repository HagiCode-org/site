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
    title: 'Hagicode - Proposal-Driven AI Coding Workspace',
    description:
      'Turn AI coding from chat into reviewable proposals. Align on a plan, execute with Claude Code, Codex, GitHub Copilot and more, then archive what you learned as team knowledge. Get it on Microsoft Store.',
  },
  'zh-CN': {
    title: 'Hagicode - 提案驱动的 AI 编码工作台',
    description:
      '把 AI 编码从聊天变成可审阅、可复用的提案流程：先对齐方案，再用 Claude Code、Codex、GitHub Copilot 等 Agent 执行，完成后沉淀为团队知识。可通过 Microsoft Store 获取。',
  },
  'zh-Hant': {
    title: 'Hagicode - 提案驅動的 AI 編碼工作台',
    description:
      '把 AI 編碼從聊天變成可審閱、可重複使用的提案流程：先對齊方案，再用 Claude Code、Codex、GitHub Copilot 等 Agent 執行，完成後沉澱為團隊知識。可透過 Microsoft Store 取得。',
  },
  'ja-JP': {
    title: 'Hagicode - 提案駆動の AI コーディングワークスペース',
    description:
      'AI コーディングをチャットから、レビューできる提案フローへ。方針をそろえ、Claude Code・Codex・GitHub Copilot などで実行し、得られた知見をチームの資産に。Microsoft Store から入手できます。',
  },
  'ko-KR': {
    title: 'Hagicode - 제안 중심 AI 코딩 워크스페이스',
    description:
      'AI 코딩을 채팅에서 검토 가능한 제안 흐름으로. 방향을 맞추고 Claude Code, Codex, GitHub Copilot 등으로 실행한 뒤, 얻은 경험을 팀 지식으로 남기세요. Microsoft Store에서 받을 수 있습니다.',
  },
  'de-DE': {
    title: 'Hagicode - Vorschlagsbasierter KI-Coding-Workspace',
    description:
      'KI-Coding vom Chat zu prüfbaren Vorschlägen: Plan abstimmen, mit Claude Code, Codex, GitHub Copilot und mehr umsetzen und das Gelernte als Teamwissen archivieren. Erhältlich im Microsoft Store.',
  },
  'fr-FR': {
    title: 'Hagicode - Espace de codage IA piloté par propositions',
    description:
      "Du chat à des propositions vérifiables : alignez le plan, exécutez avec Claude Code, Codex, GitHub Copilot et plus, puis archivez l'expérience en connaissance d'équipe. Disponible sur le Microsoft Store.",
  },
  'es-ES': {
    title: 'Hagicode - Espacio de programación con IA basado en propuestas',
    description:
      'Del chat a propuestas revisables: acuerda el plan, ejecútalo con Claude Code, Codex, GitHub Copilot y más, y archiva lo aprendido como conocimiento del equipo. Disponible en Microsoft Store.',
  },
  'pt-BR': {
    title: 'Hagicode - Espaço de programação com IA orientado a propostas',
    description:
      'Do chat para propostas revisáveis: alinhe o plano, execute com Claude Code, Codex, GitHub Copilot e mais, e arquive o aprendizado como conhecimento da equipe. Disponível na Microsoft Store.',
  },
  'ru-RU': {
    title: 'Hagicode - ИИ-среда для кодинга на основе предложений',
    description:
      'От чата к проверяемым предложениям: согласуйте план, выполните его с Claude Code, Codex, GitHub Copilot и другими, а опыт сохраните как знания команды. Доступно в Microsoft Store.',
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
