const INDEX_ORIGIN = 'https://index.hagicode.com';
const CATALOG_URL = `${INDEX_ORIGIN}/index-catalog.json`;
const FALLBACK_FLAGS_URL = `${INDEX_ORIGIN}/promote.json`;
const FALLBACK_CONTENT_URL = `${INDEX_ORIGIN}/promote_content.json`;

type FetchLike = typeof fetch;
type PromoteLocale = 'zh' | 'en';
type JsonRecord = Record<string, unknown>;

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
  link: string;
  targetPlatform?: string;
};

export type ActivePromotion = {
  id: string;
  title: string;
  description: string;
  link: string;
  platform: string | null;
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
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

function mapLocale(locale: string | null | undefined): PromoteLocale {
  return locale?.toLowerCase().startsWith('en') ? 'en' : 'zh';
}

function pickLocalized(value: Record<string, string>, locale: PromoteLocale): string | null {
  const keys = locale === 'en' ? ['en', 'zh', 'zh-CN'] : ['zh', 'zh-CN', 'en'];
  for (const key of keys) {
    const candidate = value[key];
    if (isNonEmptyString(candidate)) return candidate.trim();
  }
  return Object.values(value).find(isNonEmptyString)?.trim() ?? null;
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
    if (Object.keys(title).length === 0 || Object.keys(description).length === 0) return [];
    return [{ id: entry.id, title, description, link: entry.link, targetPlatform: isNonEmptyString(entry.targetPlatform) ? entry.targetPlatform : undefined }];
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
  const promoteLocale = mapLocale(locale);
  const contentById = new Map(contents.map((entry) => [entry.id, entry]));

  return flags.flatMap((flag) => {
    if (!isPromoteFlagActive(flag, now)) return [];
    const content = contentById.get(flag.id);
    if (!content) return [];
    const title = pickLocalized(content.title, promoteLocale);
    const description = pickLocalized(content.description, promoteLocale);
    if (!title || !description) return [];
    return [{ id: content.id, title, description, link: content.link, platform: content.targetPlatform?.trim() || null }];
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
