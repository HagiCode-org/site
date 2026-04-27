/**
 * VideoShowcase 组件
 * 视频展示区块 - 展示主产品介绍之后的补充演示视频
 * 设计系统: HUD/Sci-Fi FUI + Glassmorphism
 */
import { ExternalLink } from 'lucide-react';
import BilibiliVideo from './BilibiliVideo';
import styles from './VideoShowcase.module.css';
import {
  getVideoProviderLabel,
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
  supportingLabel?: string;
  supportingVideos: VideoShowcaseItem[];
}

export default function VideoShowcase({
  locale,
  eyebrow = 'Real Product Walkthroughs',
  title = 'See Hagicode in real coding sessions',
  description = 'Compare focused supporting demos that keep the broader product story visible after the main overview video.',
  supportingLabel = 'Focused demo',
  supportingVideos,
}: VideoShowcaseProps) {
  return (
    <section className={styles.videoShowcase} aria-labelledby="video-showcase-title" data-video-locale={locale}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 id="video-showcase-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.videoGrid}>
          {supportingVideos.map((video) => (
            <article
              key={`${video.provider}:${video.embedId}`}
              className={`${styles.videoCard} ${styles.supportingCard}`}
              data-video-provider={video.provider}
            >
              <div className={styles.videoPanel}>
                <BilibiliVideo video={video} />
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardLabel}>{supportingLabel}</span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
