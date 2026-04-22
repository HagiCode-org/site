export type VideoProvider = 'bilibili' | 'youtube';

export interface VideoShowcaseItem {
  provider: VideoProvider;
  embedId: string;
  title: string;
  description: string;
  watchUrl: string;
  ctaLabel: string;
}

export interface FeaturedVideosByProvider {
  bilibili: VideoShowcaseItem;
  youtube: VideoShowcaseItem;
}

export type HomepageVideoLocale = 'en' | 'zh-CN';

export function getHomepageFallbackProvider(locale: HomepageVideoLocale): VideoProvider {
  return locale.toLowerCase().startsWith('zh') ? 'bilibili' : 'youtube';
}

export function resolveHomepageVideoProvider(
  browserLanguage: string | null | undefined,
  fallbackProvider: VideoProvider,
): VideoProvider {
  if (typeof browserLanguage !== 'string' || browserLanguage.trim() === '') {
    return fallbackProvider;
  }

  return browserLanguage.toLowerCase().startsWith('zh') ? 'bilibili' : 'youtube';
}

export function getVideoProviderLabel(provider: VideoProvider): string {
  return provider === 'youtube' ? 'YouTube' : 'Bilibili';
}

export function getVideoEmbedUrl(video: Pick<VideoShowcaseItem, 'provider' | 'embedId'>): string {
  if (video.provider === 'youtube') {
    return `https://www.youtube.com/embed/${video.embedId}?rel=0&playsinline=1`;
  }

  return `https://player.bilibili.com/player.html?bvid=${video.embedId}&page=1&high_quality=1&danmaku=0&autoplay=0`;
}
