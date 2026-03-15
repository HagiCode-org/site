/**
 * BilibiliVideo 组件
 * Bilibili 视频嵌入组件
 */
import VideoPlayer from './VideoPlayer';

interface BilibiliVideoProps {
  bvid: string;
  title: string;
}

export default function BilibiliVideo({ bvid, title }: BilibiliVideoProps) {
  return <VideoPlayer bvid={bvid} title={title} />;
}
