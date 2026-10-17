import { DEFAULT_LOCALE, type SiteLocale } from '@/i18n/locale-metadata';

/**
 * Copy for the "/" entry page. The page speaks in the locale it just resolved, so it needs a few
 * words in every site locale before any translated bundle can load. Keep it to these five strings.
 */
export interface LandingEntryCopy {
  /** Heading while the redirect runs. */
  opening: string;
  /** Status line while the redirect runs. */
  hint: string;
  /** Status line once the visitor has stopped the redirect. */
  paused: string;
  /** Label of the language list. */
  language: string;
  /** Marks the input that decided the language. */
  used: string;
}

export const LANDING_ENTRY_COPY: Record<SiteLocale, LandingEntryCopy> = {
  'en-US': {
    opening: 'Opening HagiCode',
    hint: 'Redirecting now. Select a language to go there directly.',
    paused: 'Redirect stopped. Select a language to continue.',
    language: 'Language',
    used: 'used',
  },
  'zh-CN': {
    opening: '正在打开 HagiCode',
    hint: '即将跳转。点选任一语言可直接前往。',
    paused: '已停止跳转。选择一种语言继续。',
    language: '语言',
    used: '采用',
  },
  'zh-Hant': {
    opening: '正在開啟 HagiCode',
    hint: '即將跳轉。點選任一語言可直接前往。',
    paused: '已停止跳轉。選擇一種語言繼續。',
    language: '語言',
    used: '採用',
  },
  'ja-JP': {
    opening: 'HagiCode を開いています',
    hint: 'まもなく移動します。言語を選ぶと、その言語へ直接移動します。',
    paused: '移動を停止しました。言語を選んで続行してください。',
    language: '言語',
    used: '採用',
  },
  'ko-KR': {
    opening: 'HagiCode 여는 중',
    hint: '곧 이동합니다. 언어를 선택하면 바로 이동합니다.',
    paused: '이동을 멈췄습니다. 언어를 선택해 계속하세요.',
    language: '언어',
    used: '사용됨',
  },
  'de-DE': {
    opening: 'HagiCode wird geöffnet',
    hint: 'Weiterleitung läuft. Wähle eine Sprache, um direkt dorthin zu gehen.',
    paused: 'Weiterleitung gestoppt. Wähle eine Sprache, um fortzufahren.',
    language: 'Sprache',
    used: 'verwendet',
  },
  'fr-FR': {
    opening: 'Ouverture de HagiCode',
    hint: 'Redirection en cours. Choisissez une langue pour y aller directement.',
    paused: 'Redirection arrêtée. Choisissez une langue pour continuer.',
    language: 'Langue',
    used: 'utilisé',
  },
  'es-ES': {
    opening: 'Abriendo HagiCode',
    hint: 'Redirigiendo. Elige un idioma para ir directamente.',
    paused: 'Redirección detenida. Elige un idioma para continuar.',
    language: 'Idioma',
    used: 'usado',
  },
  'pt-BR': {
    opening: 'Abrindo o HagiCode',
    hint: 'Redirecionando. Escolha um idioma para ir direto.',
    paused: 'Redirecionamento interrompido. Escolha um idioma para continuar.',
    language: 'Idioma',
    used: 'usado',
  },
  'ru-RU': {
    opening: 'Открываем HagiCode',
    hint: 'Выполняется переход. Выберите язык, чтобы перейти сразу.',
    paused: 'Переход остановлен. Выберите язык, чтобы продолжить.',
    language: 'Язык',
    used: 'выбрано',
  },
};

export function getLandingEntryCopy(locale: SiteLocale): LandingEntryCopy {
  return LANDING_ENTRY_COPY[locale] ?? LANDING_ENTRY_COPY[DEFAULT_LOCALE];
}
