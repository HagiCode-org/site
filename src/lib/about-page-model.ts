import { getAbsoluteSiteUrl, type SiteLocale } from '@/lib/locale-routing';
import {
  getBundledAboutSnapshot,
  type AboutSnapshotData,
  type AboutSnapshotContactEntry,
  type AboutSnapshotEntry,
  type AboutSnapshotLinkEntry,
  type AboutSnapshotMediaEntry,
} from '@/lib/about-snapshot-source';
import {
  getLocaleRegionPriority,
  getLocalizedAboutEntryAlt,
  getLocalizedAboutEntryDetail,
  getLocalizedAboutEntryLabel,
  getLocalizedAboutEntryLinkText,
} from '@/lib/about-page-media-catalog';

export interface AboutPageEntryPresentation {
  readonly theme: 'default' | 'steam' | 'youtube';
  readonly icon?: 'steam' | 'youtube';
  readonly badgeLabel?: string;
}

export interface AboutPageLinkCard {
  readonly id: string;
  readonly kind: 'link';
  readonly kindLabel: string;
  readonly label: string;
  readonly detail: string;
  readonly href: string;
  readonly linkText: string;
  readonly presentation?: AboutPageEntryPresentation;
}

export interface AboutPageContactCard {
  readonly id: string;
  readonly kind: 'contact';
  readonly kindLabel: string;
  readonly label: string;
  readonly detail: string;
  readonly value: string;
  readonly href?: string;
  readonly linkText?: string;
  readonly presentation?: AboutPageEntryPresentation;
}

export interface AboutPageMediaCard {
  readonly id: string;
  readonly kind: 'media';
  readonly kindLabel: string;
  readonly label: string;
  readonly detail: string;
  readonly href: string;
  readonly linkText: string;
  readonly imageUrl: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly presentation?: AboutPageEntryPresentation;
}

export interface AboutPageComboCard {
  readonly id: string;
  readonly kind: 'combo';
  readonly kindLabel: string;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly href: string;
  readonly linkText: string;
  readonly imageUrl: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly presentation?: AboutPageEntryPresentation;
}

export type AboutPageEntry = AboutPageLinkCard | AboutPageContactCard | AboutPageMediaCard | AboutPageComboCard;

export type AboutPageSectionId = 'store' | 'community' | 'content';

export interface AboutPageSection {
  readonly id: AboutPageSectionId;
  readonly title: string;
  readonly entries: readonly AboutPageEntry[];
}

export interface AboutPageModel {
  readonly locale: SiteLocale;
  readonly routePath: string;
  readonly alternatePath: string;
  readonly snapshot: {
    readonly version: string;
    readonly updatedAt: string;
  };
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly canonicalUrl: string;
    readonly alternateUrl: string;
  };
  readonly header: {
    readonly title: string;
  };
  readonly sections: readonly AboutPageSection[];
}

const STORE_ENTRY_IDS = new Set(['steam']);
const COMMUNITY_ENTRY_IDS = new Set(['qq-group', 'feishu-group', 'discord']);

const ENTRY_ORDER = [
  'feishu-group',
  'qq-group',
  'discord',
  'youtube',
  'steam',
  'bilibili',
  'xiaohongshu',
  'douyin-account',
  'douyin-qr',
  'wechat-account',
  'juejin',
  'zhihu',
  'devto',
  'x',
  'linkedin',
  'infoq',
  'csdn',
  'cnblogs',
  'tencent-cloud',
  'oschina',
  'segmentfault',
  'facebook',
  'xiaoheihe',
];

const ENTRY_PRIORITY = new Map(ENTRY_ORDER.map((id, index) => [id, index]));

const localeCopy = {
  en: {
    seoTitle: 'About the HagiCode Team',
    seoDescription:
      'Meet the HagiCode team and browse official stores, group channels, content platforms, and scannable cards from the latest bundled about snapshot.',
    title: 'Grow through exchange',
    sections: {
      store: {
        title: 'Stores',
      },
      community: {
        title: 'Grow through exchange',
      },
      content: {
        title: 'Follow where the team publishes',
      },
    },
    kindLabels: {
      link: 'Channel',
      contact: 'Handle',
      qr: 'QR Card',
      image: 'Image Card',
    },
    contactFallbackDetail: 'Use this handle in the app',
    comboLabel: 'Channel + QR',
    platformBadges: {
      steam: 'Official store',
      youtube: 'Official channel',
    },
  },
  'zh-CN': {
    seoTitle: '关于 HagiCode 团队',
    seoDescription: '查看 HagiCode 团队的官方商店、官方群组、内容平台与可扫码卡片，快速找到我们在不同平台上的官方入口。',
    title: '增进交流，共同成长',
    sections: {
      store: {
        title: '商店',
      },
      community: {
        title: '增进交流，共同成长',
      },
      content: {
        title: '关注团队持续发布的内容',
      },
    },
    kindLabels: {
      link: '平台',
      contact: '账号',
      qr: '二维码卡片',
      image: '图片卡片',
    },
    contactFallbackDetail: '在应用内搜索该账号',
    comboLabel: '账号 + 二维码',
    platformBadges: {
      steam: '官方商店',
      youtube: '官方频道',
    },
  },
} as const;

function getRoutePath(locale: SiteLocale): string {
  return locale === 'zh-CN' ? '/zh-CN/about/' : '/about/';
}

function getHostnameLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function getEntryPresentation(
  locale: SiteLocale,
  entry: Pick<AboutSnapshotEntry, 'id'>,
): AboutPageEntryPresentation | undefined {
  if (entry.id === 'youtube') {
    return {
      theme: 'youtube',
      icon: 'youtube',
      badgeLabel: localeCopy[locale].platformBadges.youtube,
    };
  }

  if (entry.id === 'steam') {
    return {
      theme: 'steam',
      icon: 'steam',
      badgeLabel: localeCopy[locale].platformBadges.steam,
    };
  }

  return undefined;
}

function isMediaEntry(entry: AboutSnapshotEntry | undefined): entry is AboutSnapshotMediaEntry {
  return entry?.type === 'qr' || entry?.type === 'image';
}

function buildLinkCard(locale: SiteLocale, entry: AboutSnapshotLinkEntry): AboutPageLinkCard {
  const copy = localeCopy[locale];

  return {
    id: entry.id,
    kind: 'link',
    kindLabel: copy.kindLabels.link,
    label: getLocalizedAboutEntryLabel(locale, entry),
    detail: getLocalizedAboutEntryDetail(locale, entry, getHostnameLabel(entry.url)),
    href: entry.url,
    linkText: getLocalizedAboutEntryLinkText(locale, entry),
    presentation: getEntryPresentation(locale, entry),
  };
}

function buildContactCard(locale: SiteLocale, entry: AboutSnapshotContactEntry): AboutPageContactCard {
  const copy = localeCopy[locale];

  return {
    id: entry.id,
    kind: 'contact',
    kindLabel: copy.kindLabels.contact,
    label: getLocalizedAboutEntryLabel(locale, entry),
    detail: getLocalizedAboutEntryDetail(
      locale,
      entry,
      entry.description ?? (entry.url ? getHostnameLabel(entry.url) : copy.contactFallbackDetail),
    ),
    value: entry.value,
    href: entry.url,
    linkText: entry.url ? getLocalizedAboutEntryLinkText(locale, entry) : undefined,
    presentation: getEntryPresentation(locale, entry),
  };
}

function buildMediaCard(locale: SiteLocale, entry: AboutSnapshotMediaEntry): AboutPageMediaCard {
  const copy = localeCopy[locale];
  const kindLabel = entry.type === 'qr' ? copy.kindLabels.qr : copy.kindLabels.image;

  return {
    id: entry.id,
    kind: 'media',
    kindLabel,
    label: getLocalizedAboutEntryLabel(locale, entry),
    detail: getLocalizedAboutEntryDetail(locale, entry, entry.description ?? entry.alt),
    href: entry.url ?? entry.resolvedImageUrl,
    linkText: getLocalizedAboutEntryLinkText(locale, entry),
    imageUrl: entry.resolvedImageUrl,
    alt: getLocalizedAboutEntryAlt(locale, entry),
    width: entry.width,
    height: entry.height,
    presentation: getEntryPresentation(locale, entry),
  };
}

function buildDouyinComboCard(
  locale: SiteLocale,
  accountEntry: AboutSnapshotContactEntry,
  qrEntry: AboutSnapshotMediaEntry,
): AboutPageComboCard {
  const copy = localeCopy[locale];

  return {
    id: 'douyin',
    kind: 'combo',
    kindLabel: copy.comboLabel,
    label: getLocalizedAboutEntryLabel(locale, accountEntry),
    value: accountEntry.value,
    detail: getLocalizedAboutEntryDetail(locale, qrEntry, qrEntry.description ?? qrEntry.alt),
    href: accountEntry.url ?? qrEntry.url ?? qrEntry.resolvedImageUrl,
    linkText: getLocalizedAboutEntryLinkText(locale, qrEntry),
    imageUrl: qrEntry.resolvedImageUrl,
    alt: getLocalizedAboutEntryAlt(locale, qrEntry),
    width: qrEntry.width,
    height: qrEntry.height,
    presentation: getEntryPresentation(locale, accountEntry),
  };
}

function buildAboutPageEntry(locale: SiteLocale, entry: AboutSnapshotEntry): AboutPageEntry {
  if (entry.type === 'link') {
    return buildLinkCard(locale, entry);
  }

  if (entry.type === 'contact') {
    return buildContactCard(locale, entry);
  }

  return buildMediaCard(locale, entry);
}

function sortEntries(locale: SiteLocale, entries: readonly AboutSnapshotEntry[]): AboutSnapshotEntry[] {
  const preferredRegionPriority = getLocaleRegionPriority(locale);

  return [...entries].sort((left, right) => {
    const leftLocalePriority = left.regionPriority === preferredRegionPriority ? 0 : 1;
    const rightLocalePriority = right.regionPriority === preferredRegionPriority ? 0 : 1;

    if (leftLocalePriority !== rightLocalePriority) {
      return leftLocalePriority - rightLocalePriority;
    }

    const leftPriority = ENTRY_PRIORITY.get(left.id) ?? Number.MAX_SAFE_INTEGER;
    const rightPriority = ENTRY_PRIORITY.get(right.id) ?? Number.MAX_SAFE_INTEGER;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.label.localeCompare(right.label, 'zh-CN');
  });
}

function isCommunityEntry(entry: AboutSnapshotEntry): boolean {
  return COMMUNITY_ENTRY_IDS.has(entry.id);
}

function isStoreEntry(entry: AboutSnapshotEntry): boolean {
  return STORE_ENTRY_IDS.has(entry.id);
}

function buildStoreEntries(locale: SiteLocale, entries: readonly AboutSnapshotEntry[]): AboutPageEntry[] {
  return sortEntries(locale, entries.filter((entry) => isStoreEntry(entry))).map((entry) =>
    buildAboutPageEntry(locale, entry),
  );
}

function buildContentEntries(locale: SiteLocale, entries: readonly AboutSnapshotEntry[]): AboutPageEntry[] {
  const contentEntries = sortEntries(
    locale,
    entries.filter((entry) => !isCommunityEntry(entry) && !isStoreEntry(entry)),
  );
  const douyinAccount = contentEntries.find((entry) => entry.id === 'douyin-account');
  const douyinQr = contentEntries.find((entry) => entry.id === 'douyin-qr');
  const canBuildDouyinCombo = locale === 'zh-CN' && douyinAccount?.type === 'contact' && isMediaEntry(douyinQr);

  return contentEntries.flatMap((entry) => {
    if (canBuildDouyinCombo && entry.id === 'douyin-account') {
      return [buildDouyinComboCard(locale, douyinAccount, douyinQr)];
    }

    if (canBuildDouyinCombo && entry.id === 'douyin-qr') {
      return [];
    }

    if (locale === 'zh-CN' && entry.id === 'douyin-account') {
      return [buildAboutPageEntry(locale, entry)];
    }

    return [buildAboutPageEntry(locale, entry)];
  });
}

export function buildAboutPageModel(
  locale: SiteLocale,
  snapshot: AboutSnapshotData = getBundledAboutSnapshot(),
): AboutPageModel {
  const copy = localeCopy[locale];
  const alternateLocale: SiteLocale = locale === 'zh-CN' ? 'en' : 'zh-CN';
  const storeEntries = buildStoreEntries(locale, snapshot.entries);
  const communityEntries = sortEntries(locale, snapshot.entries.filter((entry) => isCommunityEntry(entry)));
  const contentEntries = buildContentEntries(locale, snapshot.entries);
  const sections: AboutPageSection[] = [];

  if (storeEntries.length > 0) {
    sections.push({
      id: 'store',
      title: copy.sections.store.title,
      entries: storeEntries,
    });
  }

  sections.push(
    {
      id: 'community',
      title: copy.sections.community.title,
      entries: communityEntries.map((entry) => buildAboutPageEntry(locale, entry)),
    },
    {
      id: 'content',
      title: copy.sections.content.title,
      entries: contentEntries,
    },
  );

  return {
    locale,
    routePath: getRoutePath(locale),
    alternatePath: getRoutePath(alternateLocale),
    snapshot: {
      version: snapshot.version,
      updatedAt: snapshot.updatedAt,
    },
    seo: {
      title: copy.seoTitle,
      description: copy.seoDescription,
      canonicalUrl: getAbsoluteSiteUrl('/about/', locale),
      alternateUrl: getAbsoluteSiteUrl('/about/', alternateLocale),
    },
    header: {
      title: copy.title,
    },
    sections,
  };
}

function getAboutPageEntrySignature(entry: AboutPageEntry): string {
  switch (entry.kind) {
    case 'link':
      return JSON.stringify([
        entry.kind,
        entry.id,
        entry.kindLabel,
        entry.label,
        entry.detail,
        entry.href,
        entry.linkText,
        entry.presentation?.theme ?? null,
        entry.presentation?.icon ?? null,
        entry.presentation?.badgeLabel ?? null,
      ]);
    case 'contact':
      return JSON.stringify([
        entry.kind,
        entry.id,
        entry.kindLabel,
        entry.label,
        entry.detail,
        entry.value,
        entry.href ?? null,
        entry.linkText ?? null,
        entry.presentation?.theme ?? null,
        entry.presentation?.icon ?? null,
        entry.presentation?.badgeLabel ?? null,
      ]);
    case 'media':
      return JSON.stringify([
        entry.kind,
        entry.id,
        entry.kindLabel,
        entry.label,
        entry.detail,
        entry.href,
        entry.linkText,
        entry.imageUrl,
        entry.alt,
        entry.width,
        entry.height,
        entry.presentation?.theme ?? null,
        entry.presentation?.icon ?? null,
        entry.presentation?.badgeLabel ?? null,
      ]);
    case 'combo':
      return JSON.stringify([
        entry.kind,
        entry.id,
        entry.kindLabel,
        entry.label,
        entry.value,
        entry.detail,
        entry.href,
        entry.linkText,
        entry.imageUrl,
        entry.alt,
        entry.width,
        entry.height,
        entry.presentation?.theme ?? null,
        entry.presentation?.icon ?? null,
        entry.presentation?.badgeLabel ?? null,
      ]);
  }
}

function getAboutPageSectionSignature(section: AboutPageSection): string {
  return JSON.stringify([section.id, section.title, section.entries.length]);
}

export function hasAboutPageModelMaterialChange(
  current: AboutPageModel,
  candidate: AboutPageModel,
): boolean {
  if (current.locale !== candidate.locale) {
    return true;
  }

  if (
    current.routePath !== candidate.routePath ||
    current.alternatePath !== candidate.alternatePath ||
    current.snapshot.version !== candidate.snapshot.version ||
    current.snapshot.updatedAt !== candidate.snapshot.updatedAt ||
    current.header.title !== candidate.header.title ||
    current.seo.title !== candidate.seo.title ||
    current.seo.description !== candidate.seo.description ||
    current.seo.canonicalUrl !== candidate.seo.canonicalUrl ||
    current.seo.alternateUrl !== candidate.seo.alternateUrl
  ) {
    return true;
  }

  if (current.sections.length !== candidate.sections.length) {
    return true;
  }

  for (let sectionIndex = 0; sectionIndex < current.sections.length; sectionIndex += 1) {
    const currentSection = current.sections[sectionIndex];
    const candidateSection = candidate.sections[sectionIndex];

    if (!currentSection || !candidateSection) {
      return true;
    }

    if (getAboutPageSectionSignature(currentSection) !== getAboutPageSectionSignature(candidateSection)) {
      return true;
    }

    for (let entryIndex = 0; entryIndex < currentSection.entries.length; entryIndex += 1) {
      const currentEntry = currentSection.entries[entryIndex];
      const candidateEntry = candidateSection.entries[entryIndex];

      if (!currentEntry || !candidateEntry) {
        return true;
      }

      if (getAboutPageEntrySignature(currentEntry) !== getAboutPageEntrySignature(candidateEntry)) {
        return true;
      }
    }
  }

  return false;
}
