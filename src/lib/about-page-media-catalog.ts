import type { SiteLocale } from '@/lib/locale-routing';
import type {
  AboutSnapshotEntry,
  AboutSnapshotMediaEntry,
  AboutSnapshotRegionPriority,
} from '@/lib/about-snapshot-source';

interface AboutEntryCopyOverride {
  readonly label?: string;
  readonly detail?: string;
  readonly linkText?: string;
  readonly alt?: string;
}

const localeRegionPriority: Record<SiteLocale, AboutSnapshotRegionPriority> = {
  en: 'international-first',
  'zh-CN': 'china-first',
};

const genericLinkText = {
  en: {
    link: 'Open page',
    contact: 'Open profile',
    qr: 'Open QR card',
    image: 'Open image',
  },
  'zh-CN': {
    link: '打开页面',
    contact: '打开主页',
    qr: '打开二维码',
    image: '打开图片',
  },
} as const;

const entryCopyOverrides = {
  en: {
    discord: {
      detail: 'Official community server',
      linkText: 'Open invite',
    },
    youtube: {
      detail: 'Official video channel',
      linkText: 'Open channel',
    },
    devto: {
      detail: 'Engineering blog',
      linkText: 'Read posts',
    },
    x: {
      detail: 'Release updates and short notes',
      linkText: 'Open profile',
    },
    linkedin: {
      detail: 'Company updates and professional posts',
      linkText: 'Open profile',
    },
    facebook: {
      detail: 'Social updates and announcements',
      linkText: 'Open page',
    },
  },
  'zh-CN': {
    'qq-group': {
      detail: '点击链接加入 HagiCode QQ 群',
      linkText: '打开加群链接',
    },
    'feishu-group': {
      detail: '扫码加入 HagiCode 飞书群',
      linkText: '打开群邀请',
      alt: 'HagiCode 飞书群二维码',
    },
    bilibili: {
      detail: '官方视频频道',
      linkText: '打开频道',
    },
    xiaohongshu: {
      detail: '官方小红书账号',
      linkText: '打开主页',
    },
    'douyin-account': {
      detail: '扫码查看 HagiCode 抖音账号',
      linkText: '打开抖音二维码',
    },
    'douyin-qr': {
      detail: '扫码查看 HagiCode 抖音账号',
      linkText: '打开抖音二维码',
      alt: 'HagiCode 抖音二维码',
    },
    'wechat-account': {
      detail: '扫码查看 HagiCode 微信公众号',
      linkText: '打开二维码',
      alt: 'HagiCode 微信公众号二维码',
    },
    juejin: {
      detail: '技术文章主页',
      linkText: '打开主页',
    },
    zhihu: {
      detail: '问答与长文输出',
      linkText: '打开主页',
    },
    infoq: {
      detail: '技术专栏主页',
      linkText: '打开主页',
    },
    csdn: {
      detail: '技术博客主页',
      linkText: '打开主页',
    },
    cnblogs: {
      detail: '开发随笔主页',
      linkText: '打开主页',
    },
    'tencent-cloud': {
      detail: '腾讯云开发者主页',
      linkText: '打开主页',
    },
    oschina: {
      detail: '开源中国主页',
      linkText: '打开主页',
    },
    segmentfault: {
      detail: '思否主页',
      linkText: '打开主页',
    },
    xiaoheihe: {
      detail: '小黑盒主页',
      linkText: '打开主页',
    },
  },
} as const satisfies Record<SiteLocale, Partial<Record<string, AboutEntryCopyOverride>>>;

function getEntryCopyOverride(locale: SiteLocale, entryId: string): AboutEntryCopyOverride | undefined {
  return entryCopyOverrides[locale][entryId];
}

export function getLocaleRegionPriority(locale: SiteLocale): AboutSnapshotRegionPriority {
  return localeRegionPriority[locale];
}

export function getLocalizedAboutEntryLabel(locale: SiteLocale, entry: Pick<AboutSnapshotEntry, 'id' | 'label'>): string {
  return getEntryCopyOverride(locale, entry.id)?.label ?? entry.label;
}

export function getLocalizedAboutEntryDetail(
  locale: SiteLocale,
  entry: Pick<AboutSnapshotEntry, 'id'>,
  fallbackDetail: string,
): string {
  return getEntryCopyOverride(locale, entry.id)?.detail ?? fallbackDetail;
}

export function getLocalizedAboutEntryLinkText(
  locale: SiteLocale,
  entry: Pick<AboutSnapshotEntry, 'id' | 'type'>,
): string {
  return getEntryCopyOverride(locale, entry.id)?.linkText ?? genericLinkText[locale][entry.type];
}

export function getLocalizedAboutEntryAlt(
  locale: SiteLocale,
  entry: Pick<AboutSnapshotMediaEntry, 'id' | 'alt'>,
): string {
  return getEntryCopyOverride(locale, entry.id)?.alt ?? entry.alt;
}
