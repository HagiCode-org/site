/**
 * VideoPlayer 组件
 * 视频播放器容器组件
 */
import styles from './VideoPlayer.module.css';
import {
  getVideoEmbedUrl,
  getVideoProviderLabel,
  type VideoShowcaseItem,
} from './video-showcase-model';

interface VideoPlayerProps {
  video: Pick<VideoShowcaseItem, 'provider' | 'embedId' | 'title'>;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const providerLabel = getVideoProviderLabel(video.provider);

  return (
    <div className={styles['video-player-container']}>
      <div className={styles['video-player']}>
        <div className={styles['video-iframe-wrapper']}>
          <iframe
            src={getVideoEmbedUrl(video)}
            title={`${providerLabel} player: ${video.title}`}
            loading="lazy"
            allowFullScreen={true}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"
          />
        </div>
      </div>
    </div>
  );
}
