import footerSitesSnapshot from '@/data/footer-sites.snapshot.json';

export interface FooterCatalogLink {
  siteId: string;
  title: string;
  description: string;
  href: string;
}

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
  const pathname = normalized.pathname.replace(/\/+$/, '');
  normalized.pathname = pathname || '/';
  return normalized.toString();
}

export function resolveSiteFooterCatalogLinks({
  localLinks = [],
}: {
  localLinks?: ReadonlyArray<{ href: string; siteId?: string }>;
}): FooterCatalogLink[] {
  const localIds = new Set(localLinks.flatMap((link) => (link.siteId ? [link.siteId] : [])));
  const localUrls = new Set(localLinks.map((link) => normalizeUrl(link.href)));
  const snapshotById = new Map(footerSitesSnapshot.entries.map((entry) => [entry.id, entry]));

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
        title: entry.title,
        description: entry.description,
        href: entry.url,
      },
    ];
  });
}
