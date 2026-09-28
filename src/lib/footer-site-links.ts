import { resolveSiteLinks, type RelatedSite } from '@hagicode/hagilight/site-links';
import footerSitesSnapshot from '@/data/footer-sites.snapshot.json';
import { getLinkWithLocale } from '@/lib/shared/links';

export function getFooterRelatedSites(locale: string): RelatedSite[] {
  const snapshotSites = footerSitesSnapshot.entries.map((entry) => ({
    id: entry.id,
    name: entry.title,
    description: entry.description,
    url: entry.id === 'hagicode-docs' ? getLinkWithLocale('docs', locale) : entry.url,
  }));
  const bundledSites = resolveSiteLinks(locale).relatedSites.map((site) => ({
    id: site.id,
    name: site.name,
    description: site.description,
    url: site.href,
  }));

  return [...snapshotSites, ...bundledSites];
}
