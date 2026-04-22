/**
 * VideoShowcase 组件
 * 视频展示区块 - 支持根据浏览器语言在 YouTube 与 Bilibili 之间切换主展示位
 * 首页视频保持 SSR locale 回退,再由浏览器语言做最终平台决策
 * 设计系统: HUD/Sci-Fi FUI + Glassmorphism
 */
import { startTransition, useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import BilibiliVideo from './BilibiliVideo';
import styles from './VideoShowcase.module.css';
import {
  getHomepageFallbackProvider,
  getVideoProviderLabel,
  resolveHomepageVideoProvider,
  type FeaturedVideosByProvider,
  type HomepageVideoLocale,
  type VideoProvider,
  type VideoShowcaseItem,
} from './video-showcase-model';

export type {
  FeaturedVideosByProvider,
  HomepageVideoLocale,
  VideoProvider,
  VideoShowcaseItem,
} from './video-showcase-model';

interface VideoShowcaseProps {
  locale: HomepageVideoLocale;
  eyebrow?: string;
  title?: string;
  description?: string;
  featuredLabel?: string;
  supportingLabel?: string;
  featuredVideos: FeaturedVideosByProvider;
  supportingVideos?: VideoShowcaseItem[];
}

export default function VideoShowcase({
  locale,
  eyebrow = 'Real Product Walkthroughs',
  title = 'See Hagicode in real coding sessions',
  description = 'Start with the primary product walkthrough selected for your browser language, then compare two focused demos that keep the broader product story visible even before you open a new tab.',
  featuredLabel = 'Featured walkthrough',
  supportingLabel = 'Focused demo',
  featuredVideos,
  supportingVideos = [],
}: VideoShowcaseProps) {
  const fallbackProvider = getHomepageFallbackProvider(locale);
  const [featuredProvider, setFeaturedProvider] = useState<VideoProvider>(fallbackProvider);

  useEffect(() => {
    const browserLanguage =
      typeof navigator === 'undefined'
        ? undefined
        : navigator.languages?.find((language) => typeof language === 'string' && language.trim().length > 0) ??
          navigator.language;
    const resolvedProvider = resolveHomepageVideoProvider(browserLanguage, fallbackProvider);

    startTransition(() => {
      setFeaturedProvider((currentProvider) =>
        currentProvider === resolvedProvider ? currentProvider : resolvedProvider,
      );
    });
  }, [fallbackProvider]);

  const featuredVideo = featuredVideos[featuredProvider] ?? featuredVideos[fallbackProvider];
  const videos = [featuredVideo, ...supportingVideos];

  return (
    <section
      className={styles.videoShowcase}
      aria-labelledby="video-showcase-title"
      data-featured-provider={featuredProvider}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 id="video-showcase-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.videoGrid}>
          {videos.map((video, index) => {
            const isFeatured = index === 0;

            return (
              <article
                key={`${video.provider}:${video.embedId}`}
                className={`${styles.videoCard} ${isFeatured ? styles.featuredCard : styles.supportingCard}`}
                data-video-provider={video.provider}
              >
                <div className={styles.videoPanel}>
                  <BilibiliVideo video={video} />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardLabel}>
                      {isFeatured ? featuredLabel : supportingLabel}
                    </span>
                    <span className={styles.platformLabel}>{getVideoProviderLabel(video.provider)}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{video.title}</h3>
                  <p className={styles.cardDescription}>{video.description}</p>
                  <a
                    className={styles.cardAction}
                    href={video.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${video.ctaLabel}: ${video.title}`}
                  >
                    <span>{video.ctaLabel}</span>
                    <ExternalLink size={18} aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
