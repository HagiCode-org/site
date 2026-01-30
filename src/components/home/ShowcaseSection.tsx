/**
 * ShowcaseSection 组件
 * 产品功能截图展示
 *
 * 展示 Hagicode 的核心功能界面截图,包括:
 * - 亮色/暗色主题主界面
 * - Token 消耗报告
 * - 效率提升报告
 * - 成就系统
 */
import { withBasePath } from '../../utils/path';
import styles from './ShowcaseSection.module.css';

interface ScreenshotItem {
  src: string;
  title: string;
  description: string;
  alt: string;
}

// 产品截图数据,按推荐顺序排列
const screenshots: ScreenshotItem[] = [
  {
    src: withBasePath('/img/home/亮色主题主界面.png'),
    title: '亮色主题主界面',
    description: '简洁直观的界面设计,让 AI 编码体验更加舒适流畅',
    alt: 'Hagicode 亮色主题主界面截图'
  },
  {
    src: withBasePath('/img/home/暗色主题主界面.png'),
    title: '暗色主题主界面',
    description: '护眼暗色模式,支持一键切换主题,适应不同使用场景',
    alt: 'Hagicode 暗色主题主界面截图'
  },
  {
    src: withBasePath('/img/home/实时token消耗报告.png'),
    title: '实时 token 消耗报告',
    description: '透明化成本监控,实时追踪每次会话的 AI 使用量',
    alt: 'Hagicode 实时 token 消耗报告截图'
  },
  {
    src: withBasePath('/img/home/使用 AI 的效率提升报告.png'),
    title: '使用 AI 的效率提升报告',
    description: '数据驱动效率分析,量化 AI 辅助编程带来的生产力提升',
    alt: 'Hagicode 使用 AI 的效率提升报告截图'
  },
  {
    src: withBasePath('/img/home/每日成就报告.png'),
    title: '每日成就报告',
    description: '游戏化激励机制,让编码过程充满乐趣和成就感',
    alt: 'Hagicode 每日成就报告截图'
  },
  {
    src: withBasePath('/img/home/每日编写代码获得的成就.png'),
    title: '每日编写代码获得的成就',
    description: '成就系统见证成长轨迹,记录每一次编码里程碑',
    alt: 'Hagicode 每日编写代码获得的成就截图'
  }
];

// 图片加载错误处理
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.currentTarget;
  target.style.display = 'none'; // 隐藏损坏的图片

  // 显示占位符
  const parent = target.parentElement;
  if (parent && !parent.querySelector(`.${styles.screenshotPlaceholder}`)) {
    const placeholder = document.createElement('div');
    placeholder.className = styles.screenshotPlaceholder;
    placeholder.textContent = '图片加载失败';
    parent.insertBefore(placeholder, target.nextSibling);
  }
};

export default function ShowcaseSection() {
  return (
    <section className={styles.showcaseSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>产品展示</h2>
          <p className={styles.sectionDescription}>
            探索 Hagicode 的强大功能和精美界面
          </p>
        </div>

        <div className={styles.screenshotsGrid}>
          {screenshots.map((screenshot) => (
            <figure key={screenshot.src} className={styles.screenshotCard}>
              <img
                src={screenshot.src}
                alt={screenshot.alt}
                className={styles.screenshotImage}
                onError={handleImageError}
                loading="lazy"
              />
              <figcaption>
                <h3 className={styles.screenshotTitle}>{screenshot.title}</h3>
                <p className={styles.screenshotDescription}>{screenshot.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
