const INDEX_ORIGIN = 'https://index.hagicode.com';
const CATALOG_URL = `${INDEX_ORIGIN}/index-catalog.json`;
const FALLBACK_FLAGS_URL = `${INDEX_ORIGIN}/promote.json`;
const FALLBACK_CONTENT_URL = `${INDEX_ORIGIN}/promote_content.json`;

type FetchLike = typeof fetch;
type JsonRecord = Record<string, unknown>;
type PromoteLocaleCode =
  | 'zh-CN'
  | 'zh-Hant'
  | 'en-US'
  | 'ja-JP'
  | 'ko-KR'
  | 'de-DE'
  | 'fr-FR'
  | 'es-ES'
  | 'pt-BR'
  | 'ru-RU';

type PromoteFlag = {
  id: string;
  on: boolean;
  startTime?: string;
  endTime?: string;
};
type PromoteContent = {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  cta?: Record<string, string>;
  link: string;
  targetPlatform?: string;
  image?: PromotionImage;
};

export type PromotionImage = {
  src: string;
  alt: string;
  variant?: string;
  width?: number;
  height?: number;
};

export type ActivePromotion = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  link: string;
  platform: string | null;
  image: PromotionImage | null;
};

const DEFAULT_PROMOTE_LOCALE: PromoteLocaleCode = 'zh-CN';
const UNSUPPORTED_PROMOTE_LOCALE_FALLBACK: PromoteLocaleCode = 'en-US';
const SUPPORTED_PROMOTE_LOCALE_CODES = [
  'zh-CN',
  'zh-Hant',
  'en-US',
  'ja-JP',
  'ko-KR',
  'de-DE',
  'fr-FR',
  'es-ES',
  'pt-BR',
  'ru-RU',
] as const satisfies readonly PromoteLocaleCode[];
const PROMOTE_LOCALE_FALLBACKS: Record<PromoteLocaleCode, readonly PromoteLocaleCode[]> = {
  'zh-CN': ['en-US'],
  'zh-Hant': ['zh-CN', 'en-US'],
  'en-US': ['en-US'],
  'ja-JP': ['en-US'],
  'ko-KR': ['en-US'],
  'de-DE': ['en-US'],
  'fr-FR': ['en-US'],
  'es-ES': ['en-US'],
  'pt-BR': ['en-US'],
  'ru-RU': ['en-US'],
};
const DEFAULT_PROMOTE_CTA_LABELS: Record<PromoteLocaleCode, string> = {
  'zh-CN': '立即前往',
  'zh-Hant': '立即前往',
  'en-US': 'GO',
  'ja-JP': '今すぐ見る',
  'ko-KR': '바로 보기',
  'de-DE': 'Ansehen',
  'fr-FR': 'Voir',
  'es-ES': 'Ver ahora',
  'pt-BR': 'Ver agora',
  'ru-RU': 'Открыть',
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function canonicalizeLocale(locale: string): string {
  const candidate = locale.trim().replace(/_/g, '-');
  if (!candidate) {
    return '';
  }

  try {
    return Intl.getCanonicalLocales(candidate)[0] ?? candidate;
  } catch {
    return candidate;
  }
}

async function readJson(fetchImpl: FetchLike, url: string): Promise<unknown> {
  const response = await fetchImpl(url, { headers: { accept: 'application/json' }, cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.includes('application/json') && !contentType.includes('+json')) {
    throw new Error(`Expected JSON from ${url}`);
  }

  return response.json();
}

function normalizePromoteLocale(locale: string | null | undefined): PromoteLocaleCode | null {
  if (!locale) {
    return null;
  }

  const canonical = canonicalizeLocale(locale);
  const normalized = canonical.toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized === 'zh-hant' || normalized.includes('-hant') || ['zh-tw', 'zh-hk', 'zh-mo'].includes(normalized)) {
    return 'zh-Hant';
  }

  if (normalized === 'zh' || normalized.includes('-hans') || ['zh-cn', 'zh-sg'].includes(normalized)) {
    return 'zh-CN';
  }

  for (const supportedCode of SUPPORTED_PROMOTE_LOCALE_CODES) {
    if (supportedCode.toLowerCase() === normalized) {
      return supportedCode;
    }
  }

  const [languagePart] = normalized.split('-');
  switch (languagePart) {
    case 'en':
      return 'en-US';
    case 'ja':
      return 'ja-JP';
    case 'ko':
      return 'ko-KR';
    case 'de':
      return 'de-DE';
    case 'fr':
      return 'fr-FR';
    case 'es':
      return 'es-ES';
    case 'pt':
      return 'pt-BR';
    case 'ru':
      return 'ru-RU';
    default:
      return null;
  }
}

function resolvePromoteLocale(locale: string | null | undefined): PromoteLocaleCode {
  if (locale === undefined || locale === null || locale.trim().length === 0) {
    return DEFAULT_PROMOTE_LOCALE;
  }

  return normalizePromoteLocale(locale) ?? UNSUPPORTED_PROMOTE_LOCALE_FALLBACK;
}

function getLocalizedKeys(locale: string | null | undefined): string[] {
  const resolvedLocale = resolvePromoteLocale(locale);
  const fallbackCodes = PROMOTE_LOCALE_FALLBACKS[resolvedLocale];
  const keys = [
    resolvedLocale,
    resolvedLocale.split('-')[0] ?? resolvedLocale,
    ...fallbackCodes,
    ...fallbackCodes.map((code) => code.split('-')[0] ?? code),
  ];

  return [...new Set(keys)];
}

function pickLocalized(value: Record<string, string>, locale: string | null | undefined): string | null {
  for (const key of getLocalizedKeys(locale)) {
    const candidate = value[key];
    if (isNonEmptyString(candidate)) return candidate.trim();
  }
  return Object.values(value).find(isNonEmptyString)?.trim() ?? null;
}

function resolveCtaLabel(value: Record<string, string> | undefined, locale: string | null | undefined): string {
  if (value) {
    const localized = pickLocalized(value, locale);
    if (localized) return localized;
  }
  return DEFAULT_PROMOTE_CTA_LABELS[resolvePromoteLocale(locale)];
}

function parseDimension(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return undefined;
  return Math.round(value);
}

function normalizeIndexAssetUrl(src: string): string {
  return src.startsWith('/') ? new URL(src, INDEX_ORIGIN).toString() : src;
}

function parseImageDescriptor(value: unknown): Omit<PromotionImage, 'alt'> | null {
  if (isNonEmptyString(value)) {
    return { src: normalizeIndexAssetUrl(value.trim()) };
  }

  if (!isRecord(value)) {
    return null;
  }

  const src = isNonEmptyString(value.src)
    ? value.src.trim()
    : isNonEmptyString(value.url)
      ? value.url.trim()
      : isNonEmptyString(value.imageUrl)
        ? value.imageUrl.trim()
        : null;

  if (!src) {
    return null;
  }

  return {
    src: normalizeIndexAssetUrl(src),
    variant: isNonEmptyString(value.variant) ? value.variant.trim() : undefined,
    width: parseDimension(value.width),
    height: parseDimension(value.height),
  };
}

function parsePromotionImage(record: JsonRecord): PromotionImage | undefined {
  const imageCandidate = parseImageDescriptor(record.image)
    ?? parseImageDescriptor(record.imageUrl)
    ?? parseImageDescriptor(record.imageURL);

  if (!imageCandidate) {
    return undefined;
  }

  const imageRecord = isRecord(record.image) ? record.image : {};
  const alt = isNonEmptyString(imageRecord.alt)
    ? imageRecord.alt.trim()
    : isNonEmptyString(record.imageAlt)
      ? record.imageAlt.trim()
      : '';

  return {
    ...imageCandidate,
    alt,
  };
}

function resolveImage(image: PromotionImage | undefined, title: string): PromotionImage | null {
  if (!image?.src) {
    return null;
  }

  return {
    ...image,
    src: normalizeIndexAssetUrl(image.src),
    alt: isNonEmptyString(image.alt) ? image.alt.trim() : title,
  };
}

function parseOptionalTimestamp(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function parseTimestamp(value: string | undefined): number | null {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : Number.NaN;
}

function isPromoteFlagActive(flag: PromoteFlag, now = Date.now()): boolean {
  if (!flag.on) return false;

  const startTime = parseTimestamp(flag.startTime);
  const endTime = parseTimestamp(flag.endTime);

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return false;
  }

  if (startTime !== null && endTime !== null && startTime >= endTime) {
    return false;
  }

  if (startTime !== null && now < startTime) {
    return false;
  }

  if (endTime !== null && now >= endTime) {
    return false;
  }

  return true;
}

function parseFlags(payload: unknown): PromoteFlag[] {
  if (!isRecord(payload) || !Array.isArray(payload.promotes)) return [];
  return payload.promotes.flatMap((entry) => {
    if (!isRecord(entry) || !isNonEmptyString(entry.id) || typeof entry.on !== 'boolean') return [];
    return [{
      id: entry.id,
      on: entry.on,
      startTime: parseOptionalTimestamp(entry.startTime),
      endTime: parseOptionalTimestamp(entry.endTime),
    }];
  });
}

function parseContent(payload: unknown): PromoteContent[] {
  if (!isRecord(payload) || !Array.isArray(payload.contents)) return [];
  return payload.contents.flatMap((entry) => {
    if (!isRecord(entry) || !isNonEmptyString(entry.id) || !isRecord(entry.title) || !isRecord(entry.description) || !isNonEmptyString(entry.link)) return [];
    const title = Object.fromEntries(Object.entries(entry.title).filter(([, value]) => isNonEmptyString(value))) as Record<string, string>;
    const description = Object.fromEntries(Object.entries(entry.description).filter(([, value]) => isNonEmptyString(value))) as Record<string, string>;
    const cta = isRecord(entry.cta)
      ? Object.fromEntries(Object.entries(entry.cta).filter(([, value]) => isNonEmptyString(value))) as Record<string, string>
      : undefined;
    if (Object.keys(title).length === 0 || Object.keys(description).length === 0) return [];
    return [{
      id: entry.id,
      title,
      description,
      cta: cta && Object.keys(cta).length > 0 ? cta : undefined,
      link: entry.link,
      targetPlatform: isNonEmptyString(entry.targetPlatform) ? entry.targetPlatform : undefined,
      image: parsePromotionImage(entry),
    }];
  });
}

export async function resolvePromoteUrls(fetchImpl: FetchLike = fetch): Promise<{ flagsUrl: string; contentUrl: string; source: 'catalog' | 'fallback' }> {
  try {
    const catalog = await readJson(fetchImpl, CATALOG_URL);
    const entries = isRecord(catalog) && Array.isArray(catalog.entries) ? catalog.entries : [];
    const flags = entries.find((entry) => isRecord(entry) && entry.id === 'promotion-flags' && isNonEmptyString(entry.path));
    const content = entries.find((entry) => isRecord(entry) && entry.id === 'promotion-content' && isNonEmptyString(entry.path));
    if (isRecord(flags) && isRecord(content) && isNonEmptyString(flags.path) && isNonEmptyString(content.path)) {
      return {
        flagsUrl: new URL(flags.path, INDEX_ORIGIN).toString(),
        contentUrl: new URL(content.path, INDEX_ORIGIN).toString(),
        source: 'catalog',
      };
    }
  } catch {
    // Fallback endpoints are the stable public contract when catalog discovery fails.
  }

  return { flagsUrl: FALLBACK_FLAGS_URL, contentUrl: FALLBACK_CONTENT_URL, source: 'fallback' };
}

export function selectActivePromotions(flags: PromoteFlag[], contents: PromoteContent[], locale: string | null | undefined, now = Date.now()): ActivePromotion[] {
  const contentById = new Map(contents.map((entry) => [entry.id, entry]));

  return flags.flatMap((flag) => {
    if (!isPromoteFlagActive(flag, now)) return [];
    const content = contentById.get(flag.id);
    if (!content) return [];
    const title = pickLocalized(content.title, locale);
    const description = pickLocalized(content.description, locale);
    if (!title || !description) return [];
    const image = resolveImage(content.image, title);
    return [{
      id: content.id,
      title,
      description,
      ctaLabel: resolveCtaLabel(content.cta, locale),
      link: content.link,
      platform: content.targetPlatform?.trim() || null,
      image,
    }];
  });
}

export async function loadActivePromotions(options: { locale?: string | null; fetchImpl?: FetchLike; now?: number } = {}): Promise<ActivePromotion[]> {
  const { locale, fetchImpl = fetch, now = Date.now() } = options;
  try {
    const urls = await resolvePromoteUrls(fetchImpl);
    const [flagsPayload, contentPayload] = await Promise.all([readJson(fetchImpl, urls.flagsUrl), readJson(fetchImpl, urls.contentUrl)]);
    return selectActivePromotions(parseFlags(flagsPayload), parseContent(contentPayload), locale, now);
  } catch {
    return [];
  }
}

export async function loadFirstActivePromotion(options: { locale?: string | null; fetchImpl?: FetchLike; now?: number } = {}): Promise<ActivePromotion | null> {
  return (await loadActivePromotions(options))[0] ?? null;
}
