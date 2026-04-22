/**
 * BilibiliVideo 组件
 * 保留现有组件边界,但实际透传通用视频描述给播放器
 */
import VideoPlayer from './VideoPlayer';
import type { VideoShowcaseItem } from './video-showcase-model';

interface BilibiliVideoProps {
  video: Pick<VideoShowcaseItem, 'provider' | 'embedId' | 'title'>;
}

export default function BilibiliVideo({ video }: BilibiliVideoProps) {
  return <VideoPlayer video={video} />;
}
