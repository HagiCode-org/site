/**
 * VideoPlayer 组件
 * 视频播放器容器组件
 */
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  return (
    <div className={styles['video-player-container']}>
      <div className={styles['video-player']}>
        <div className={styles['video-iframe-wrapper']}>
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${videoId}&page=1&high_quality=1&danmaku=0&autoplay=0`}
            title={title}
            allowFullScreen={true}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"
          />
        </div>
      </div>
    </div>
  );
}
