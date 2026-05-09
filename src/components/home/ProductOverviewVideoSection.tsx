/**
 * ProductOverviewVideoSection 组件
 * 首页主产品介绍视频区块,按用户当前选择的站点语言决定视频平台。
 */
import { ExternalLink } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import styles from './ProductOverviewVideoSection.module.css';
import {
  getHomepageFallbackProvider,
  type FeaturedVideosByProvider,
  type HomepageVideoLocale,
} from './video-showcase-model';

interface ProductOverviewVideoCopy {
  title: string;
}

interface ProductOverviewVideoSectionProps {
  locale: HomepageVideoLocale;
  copy: ProductOverviewVideoCopy;
  featuredVideos: FeaturedVideosByProvider;
  placement?: 'standalone' | 'hero';
}

export default function ProductOverviewVideoSection({
  locale,
  copy,
  featuredVideos,
  placement = 'standalone',
}: ProductOverviewVideoSectionProps) {
  const selectedProvider = getHomepageFallbackProvider(locale);
  const selectedVideo = featuredVideos[selectedProvider];

  return (
    <section
      className={`${styles.productOverviewVideo} ${placement === 'hero' ? styles.heroPlacement : ''}`}
      aria-labelledby="product-overview-video-title"
      data-overview-provider={selectedVideo.provider}
      data-video-placement={placement}
    >
      <div className={styles.container}>
        <div className={styles.videoShell} data-video-provider={selectedVideo.provider}>
          <VideoPlayer video={selectedVideo} />
        </div>

        <div className={styles.contentPanel}>
          <h2 id="product-overview-video-title" className={styles.srOnly}>
            {copy.title}
          </h2>
          {placement !== 'hero' ? (
            <a
              className={styles.watchAction}
              href={selectedVideo.watchUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${selectedVideo.ctaLabel}: ${selectedVideo.title}`}
            >
              <span>{selectedVideo.ctaLabel}</span>
              <ExternalLink size={18} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
