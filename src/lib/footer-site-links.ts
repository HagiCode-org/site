import footerSitesSnapshot from '@/data/footer-sites.snapshot.json';
import {
  DEFAULT_LOCALE,
  getSiteLocaleFallbackChain,
  resolveSiteLocale,
  type SiteLocale,
} from '@/i18n/locale-metadata';
import { getLinkWithLocale } from '@/lib/shared/links';

export interface FooterCatalogLink {
  siteId: string;
  title: string;
  description: string;
  href: string;
}

type LocalizedFooterField = string | Readonly<Partial<Record<SiteLocale, string>>>;

type FooterSnapshotEntry = {
  id: string;
  title: LocalizedFooterField;
  description: LocalizedFooterField;
  url: string;
};

const DEFAULT_RELATED_SITE_ORDER = [
  'hagicode-main',
  'hagicode-docs',
  'newbe-blog',
  'index-data',
  'compose-builder',
  'cost-calculator',
  'status-page',
  'awesome-design-gallery',
  'soul-builder',
  'trait-builder',
] as const;

const CURRENT_SITE_ID = 'hagicode-main';

function normalizeUrl(url: string) {
  const normalized = new URL(url);
  normalized.hash = '';
  normalized.search = '';
  const pathname = normalized.pathname.replace(/\/+$/u, '');
  normalized.pathname = pathname || '/';
  return normalized.toString();
}

function resolveLocalizedField(field: LocalizedFooterField, locale: SiteLocale): string {
  if (typeof field === 'string') {
    return field;
  }

  const resolutionChain = [locale, ...getSiteLocaleFallbackChain(locale), DEFAULT_LOCALE];
  for (const candidate of resolutionChain) {
    const value = field[candidate as SiteLocale];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }

  for (const value of Object.values(field)) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }

  return '';
}

export function resolveSiteFooterCatalogLinks({
  locale,
  localLinks = [],
}: {
  locale?: string;
  localLinks?: ReadonlyArray<{ href: string; siteId?: string }>;
}): FooterCatalogLink[] {
  const resolvedLocale = resolveSiteLocale(locale, DEFAULT_LOCALE);
  const localIds = new Set(localLinks.flatMap((link) => (link.siteId ? [link.siteId] : [])));
  const localUrls = new Set(localLinks.map((link) => normalizeUrl(link.href)));
  const snapshotById = new Map<string, FooterSnapshotEntry>(
    footerSitesSnapshot.entries.map((entry) => [entry.id, entry as FooterSnapshotEntry]),
  );

  return DEFAULT_RELATED_SITE_ORDER.flatMap((siteId) => {
    const entry = snapshotById.get(siteId);
    if (!entry || entry.id === CURRENT_SITE_ID) {
      return [];
    }

    if (localIds.has(entry.id) || localUrls.has(normalizeUrl(entry.url))) {
      return [];
    }

    return [
      {
        siteId: entry.id,
        title: resolveLocalizedField(entry.title, resolvedLocale),
        description: resolveLocalizedField(entry.description, resolvedLocale),
        href: entry.id === 'hagicode-docs' ? getLinkWithLocale('docs', resolvedLocale) : entry.url,
      },
    ];
  });
}
