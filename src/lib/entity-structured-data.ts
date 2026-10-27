import {
  buildOrganizationStructuredData,
  buildSoftwareApplicationStructuredData,
  type StructuredData,
} from '@hagicode/hagilight-core/seo';
import { getEntityDefinition } from '@hagicode/hagilight-core/entity-definition';
import type { SiteLocale } from '@/i18n/locale-metadata';
import { getAbsoluteSiteUrl } from '@/lib/locale-routing';
import { FEATURE_MAC_DOWNLOAD_ENABLED } from '@/config/features';
import { SITE_LINKS } from '@/lib/shared/links';
import { DEFAULT_WINDOWS_STORE_URL } from '@/lib/shared/windows-store-link';

/**
 * The verified facts behind the homepage and desktop page JSON-LD. Both pages build their blocks
 * here, so the visible name, the links, the platforms and the download URL cannot diverge.
 *
 * Deliberately omitted:
 * - `offers`: the site copy does not establish the terms of a free or paid offer (see brand-audit.md).
 * - Steam: its storefront is hidden by `FEATURE_SITE_STEAM_ENABLED` by default.
 * - QQ group: it has no stable public profile page.
 */

export const ENTITY_NAME = 'HagiCode';
export const ENTITY_APPLICATION_CATEGORY = 'DeveloperApplication';

/** `https://github.com/<org>/<repo>` → `https://github.com/<org>`, from the existing repository link. */
export function githubOrganizationUrl(repositoryUrl: string): string {
  const url = new URL(repositoryUrl);
  const organization = url.pathname.split('/').filter(Boolean)[0];
  if (!organization) throw new TypeError('GitHub repository link must name an organization.');
  return `${url.origin}/${organization}`;
}

/** Official destinations that identify the product, in display order, read from the site's links. */
export function getEntitySameAs(): string[] {
  return [
    githubOrganizationUrl(SITE_LINKS.github.prod),
    DEFAULT_WINDOWS_STORE_URL,
    SITE_LINKS.discord.prod,
  ];
}

/** Platforms the desktop page offers for download, in the order it lists them. */
export function getEntityOperatingSystems(macDownloadEnabled: boolean = FEATURE_MAC_DOWNLOAD_ENABLED): string[] {
  return macDownloadEnabled ? ['Windows', 'macOS', 'Linux'] : ['Windows', 'Linux'];
}

export interface EntityStructuredDataOptions {
  locale: SiteLocale;
  siteBase?: string;
  macDownloadEnabled?: boolean;
}

/**
 * Build the Organization and SoftwareApplication blocks for one locale. Each page emits exactly one
 * of each, both named "HagiCode" and sharing the same `sameAs`.
 */
export function buildEntityStructuredData({
  locale,
  siteBase = '',
  macDownloadEnabled = FEATURE_MAC_DOWNLOAD_ENABLED,
}: EntityStructuredDataOptions): StructuredData[] {
  const homeUrl = getAbsoluteSiteUrl('/', locale, siteBase);
  const desktopUrl = getAbsoluteSiteUrl('/desktop/', locale, siteBase);
  const sameAs = getEntitySameAs();

  return [
    buildOrganizationStructuredData({
      name: ENTITY_NAME,
      url: homeUrl,
      sameAs,
    }),
    buildSoftwareApplicationStructuredData({
      name: ENTITY_NAME,
      applicationCategory: ENTITY_APPLICATION_CATEGORY,
      operatingSystem: getEntityOperatingSystems(macDownloadEnabled).join(', '),
      downloadUrl: desktopUrl,
      url: desktopUrl,
      description: getEntityDefinition(locale),
      sameAs,
    }),
  ];
}
