/**
 * VideoShowcase 组件
 * 视频展示区块 - 集成 Bilibili 视频
 * 首页视频按精选数组维护,并默认将第一条作为主展示位
 * 设计系统: HUD/Sci-Fi FUI + Glassmorphism
 */
import { ExternalLink } from 'lucide-react';
import BilibiliVideo from './BilibiliVideo';
import styles from './VideoShowcase.module.css';

export interface VideoShowcaseItem {
  bvid: string;
  title: string;
  description: string;
  url: string;
}

interface VideoShowcaseProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  featuredLabel?: string;
  supportingLabel?: string;
  videos: VideoShowcaseItem[];
}

export default function VideoShowcase({
  eyebrow = 'Real Product Walkthroughs',
  title = 'See Hagicode in real coding sessions',
  description = 'Start with the daily workflow, then compare two focused demos that show how playful and capable the product feels in practice.',
  ctaLabel = 'Open on Bilibili',
  featuredLabel = 'Featured walkthrough',
  supportingLabel = 'Focused demo',
  videos,
}: VideoShowcaseProps) {
  return (
    <section className={styles.videoShowcase} aria-labelledby="video-showcase-title">
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
                key={video.bvid}
                className={`${styles.videoCard} ${isFeatured ? styles.featuredCard : styles.supportingCard}`}
              >
                <div className={styles.videoPanel}>
                  <BilibiliVideo bvid={video.bvid} title={video.title} />
                </div>

                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>
                    {isFeatured ? featuredLabel : supportingLabel}
                  </span>
                  <h3 className={styles.cardTitle}>{video.title}</h3>
                  <p className={styles.cardDescription}>{video.description}</p>
                  <a
                    className={styles.cardAction}
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${ctaLabel}: ${video.title}`}
                  >
                    <span>{ctaLabel}</span>
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
