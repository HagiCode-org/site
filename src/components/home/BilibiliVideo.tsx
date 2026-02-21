/**
 * BilibiliVideo 组件
 * Bilibili 视频嵌入组件
 */
import VideoPlayer from './VideoPlayer';

interface BilibiliVideoProps {
  bvid: string;
  title?: string;
}

export default function BilibiliVideo({ bvid, title = 'Bilibili Video' }: BilibiliVideoProps) {
  return <VideoPlayer videoId={bvid} title={title} />;
}
