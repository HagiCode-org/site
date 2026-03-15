/**
 * VideoPlayer 组件
 * 视频播放器容器组件
 */
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  bvid: string;
  title: string;
}

export default function VideoPlayer({ bvid, title }: VideoPlayerProps) {
  return (
    <div className={styles['video-player-container']}>
      <div className={styles['video-player']}>
        <div className={styles['video-iframe-wrapper']}>
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`}
            title={`Bilibili player: ${title}`}
            loading="lazy"
            allowFullScreen={true}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"
          />
        </div>
      </div>
    </div>
  );
}
