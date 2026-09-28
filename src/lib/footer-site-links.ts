import type { RelatedSite } from '@hagicode/hagilight/site-links';
import footerSitesSnapshot from '@/data/footer-sites.snapshot.json';
import { getLinkWithLocale } from '@/lib/shared/links';

export function getFooterRelatedSites(locale: string): RelatedSite[] {
  return footerSitesSnapshot.entries.map((entry) => ({
    id: entry.id,
    name: entry.title,
    description: entry.description,
    url: entry.id === 'hagicode-docs' ? getLinkWithLocale('docs', locale) : entry.url,
  }));
}
