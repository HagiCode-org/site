import { getAbsoluteSiteUrl, type SiteLocale } from '@/lib/locale-routing';
import {
  getBundledAboutSnapshot,
  type AboutSnapshotContactEntry,
  type AboutSnapshotEntry,
  type AboutSnapshotLinkEntry,
  type AboutSnapshotMediaEntry,
} from '@/lib/about-snapshot-source';

export interface AboutPageLinkCard {
  readonly id: string;
  readonly kind: 'link';
  readonly kindLabel: string;
  readonly label: string;
  readonly detail: string;
  readonly href: string;
}

export interface AboutPageContactCard {
  readonly id: string;
  readonly kind: 'contact';
  readonly kindLabel: string;
  readonly label: string;
  readonly detail: string;
  readonly value: string;
  readonly href?: string;
}

export interface AboutPageMediaCard {
  readonly id: string;
  readonly kind: 'media';
  readonly kindLabel: string;
  readonly label: string;
  readonly href: string;
  readonly imageUrl: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface AboutPageComboCard {
  readonly id: string;
  readonly kind: 'combo';
  readonly kindLabel: string;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly href: string;
  readonly imageUrl: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export type AboutPageEntry = AboutPageLinkCard | AboutPageContactCard | AboutPageMediaCard | AboutPageComboCard;

export interface AboutPageSection {
  readonly id: 'community' | 'content';
  readonly title: string;
  readonly entries: readonly AboutPageEntry[];
}

export interface AboutPageModel {
  readonly locale: SiteLocale;
  readonly routePath: string;
  readonly alternatePath: string;
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

const COMMUNITY_ENTRY_IDS = new Set(['qq-group', 'feishu-group', 'discord']);

const ENTRY_ORDER = [
  'feishu-group',
  'qq-group',
  'discord',
  'bilibili',
  'xiaohongshu',
  'douyin-account',
  'douyin-qr',
  'wechat-account',
  'juejin',
  'zhihu',
  'x',
  'linkedin',
  'devto',
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
      'Meet the HagiCode team and browse official group channels, content platforms, and scannable cards from the latest bundled about snapshot.',
    title: 'Grow through exchange',
    sections: {
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
    comboLabel: 'Channel + QR',
  },
  'zh-CN': {
    seoTitle: '关于 HagiCode 团队',
    seoDescription: '查看 HagiCode 团队的官方群组、内容平台与可扫码卡片，快速找到我们在不同平台上的官方入口。',
    title: '增进交流，共同成长',
    sections: {
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
    comboLabel: '账号 + 二维码',
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

function buildLinkCard(locale: SiteLocale, entry: AboutSnapshotLinkEntry): AboutPageLinkCard {
  const copy = localeCopy[locale];

  return {
    id: entry.id,
    kind: 'link',
    kindLabel: copy.kindLabels.link,
    label: entry.label,
    detail: getHostnameLabel(entry.url),
    href: entry.url,
  };
}

function buildContactCard(locale: SiteLocale, entry: AboutSnapshotContactEntry): AboutPageContactCard {
  const copy = localeCopy[locale];

  return {
    id: entry.id,
    kind: 'contact',
    kindLabel: copy.kindLabels.contact,
    label: entry.label,
    detail: entry.url ? getHostnameLabel(entry.url) : entry.value,
    value: entry.value,
    href: entry.url,
  };
}

function buildMediaCard(locale: SiteLocale, entry: AboutSnapshotMediaEntry): AboutPageMediaCard {
  const copy = localeCopy[locale];
  const kindLabel = entry.type === 'qr' ? copy.kindLabels.qr : copy.kindLabels.image;

  return {
    id: entry.id,
    kind: 'media',
    kindLabel,
    label: entry.label,
    href: entry.url ?? entry.resolvedImageUrl,
    imageUrl: entry.resolvedImageUrl,
    alt: entry.alt,
    width: entry.width,
    height: entry.height,
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
    label: accountEntry.label,
    value: accountEntry.value,
    detail: qrEntry.label,
    href: accountEntry.url ?? qrEntry.url ?? qrEntry.resolvedImageUrl,
    imageUrl: qrEntry.resolvedImageUrl,
    alt: qrEntry.alt,
    width: qrEntry.width,
    height: qrEntry.height,
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

function sortEntries(entries: readonly AboutSnapshotEntry[]): AboutSnapshotEntry[] {
  return [...entries].sort((left, right) => {
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

function buildContentEntries(locale: SiteLocale, entries: readonly AboutSnapshotEntry[]): AboutPageEntry[] {
  const contentEntries = sortEntries(entries.filter((entry) => !isCommunityEntry(entry)));
  const douyinAccount = contentEntries.find((entry) => entry.id === 'douyin-account');
  const douyinQr = contentEntries.find((entry) => entry.id === 'douyin-qr');

  return contentEntries.flatMap((entry) => {
    if (entry.id === 'douyin-account') {
      if (douyinAccount?.type === 'contact' && douyinQr?.type !== undefined && douyinQr.type !== 'link' && douyinQr.type !== 'contact') {
        return [buildDouyinComboCard(locale, douyinAccount, douyinQr)];
      }

      return [buildAboutPageEntry(locale, entry)];
    }

    if (entry.id === 'douyin-qr') {
      return [];
    }

    return [buildAboutPageEntry(locale, entry)];
  });
}

export function buildAboutPageModel(locale: SiteLocale): AboutPageModel {
  const copy = localeCopy[locale];
  const alternateLocale: SiteLocale = locale === 'zh-CN' ? 'en' : 'zh-CN';
  const snapshot = getBundledAboutSnapshot();
  const communityEntries = sortEntries(snapshot.entries.filter((entry) => isCommunityEntry(entry)));
  const contentEntries = buildContentEntries(locale, snapshot.entries);

  return {
    locale,
    routePath: getRoutePath(locale),
    alternatePath: getRoutePath(alternateLocale),
    seo: {
      title: copy.seoTitle,
      description: copy.seoDescription,
      canonicalUrl: getAbsoluteSiteUrl('/about/', locale),
      alternateUrl: getAbsoluteSiteUrl('/about/', alternateLocale),
    },
    header: {
      title: copy.title,
    },
    sections: [
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
    ],
  };
}
