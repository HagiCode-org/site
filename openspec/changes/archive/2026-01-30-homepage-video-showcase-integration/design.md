# 技术设计文档 - 首页视频展示区块

## 设计目标

创建一个视频展示区块组件,集成现有的 Bilibili 嵌入功能,并将其添加到首页。设计需遵循项目现有的设计系统(HUD/Sci-Fi FUI + Glassmorphism)和技术栈(Astro + React + TypeScript)。

## 架构设计

### 组件层次结构

```
src/pages/index.astro
└── <main>
    ├── HeroSection (client:load)
    ├── ActivityMetricsSection (client:visible)
    ├── FeaturesShowcase (client:visible)
    ├── ShowcaseSection (client:idle)
    ├── VideoShowcase (client:visible) ← 新增
    │   └── BilibiliVideo
    │       └── VideoPlayer
    │           └── <iframe> (Bilibili Player)
    └── QuickStartSection (client:idle)
```

### 组件职责

#### VideoShowcase 组件
- **职责**: 视频展示区块的容器组件
- **功能**:
  - 显示区块标题和描述
  - 集成 BilibiliVideo 组件
  - 提供进入动画效果
  - 管理布局和样式

#### BilibiliVideo 组件(已存在)
- **职责**: Bilibili 视频嵌入封装
- **功能**:
  - 接收 BV ID 参数
  - 调用 VideoPlayer 组件
  - 提供简洁的 API

#### VideoPlayer 组件(已存在)
- **职责**: 视频播放器容器
- **功能**:
  - 渲染 Bilibili iframe
  - 管理响应式布局(16:9 比例)
  - 提供样式包装

## 技术实现

### TypeScript 接口设计

```typescript
// VideoShowcase 组件 Props
interface VideoShowcaseProps {
  title?: string;        // 区块标题
  description?: string;  // 区块描述
  videoId: string;       // Bilibili 视频 BV ID (默认: "BV1pirZBuEzq")
  autoplay?: boolean;    // 是否自动播放(默认 false)
}

// BilibiliVideo 组件 Props(已存在)
interface BilibiliVideoProps {
  bvid: string;          // Bilibili 视频 ID
  title?: string;        // 可选标题
}

// VideoPlayer 组件 Props(已存在)
interface VideoPlayerProps {
  videoId: string;       // 视频 ID
  title: string;         // 视频标题
}
```

**默认视频内容**:
- **Bilibili 链接**: https://www.bilibili.com/video/BV1pirZBuEzq/
- **视频标题**: 每天哈基半小时,AI多任务编程实战
- **BV ID**: `BV1pirZBuEzq`

### 组件实现细节

#### 1. VideoShowcase.tsx

```typescript
import { motion } from 'framer-motion';
import BilibiliVideo from './BilibiliVideo';
import styles from './VideoShowcase.module.css';

interface VideoShowcaseProps {
  title?: string;
  description?: string;
  videoId: string;
}

export default function VideoShowcase({
  title = '每天哈基半小时,AI多任务编程实战',
  description = '通过视频了解 Hagicode 的核心功能',
  videoId = 'BV1pirZBuEzq'
}: VideoShowcaseProps) {
  return (
    <section className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.videoWrapper}>
          <BilibiliVideo bvid={videoId} title={title} />
        </div>
      </motion.div>
    </section>
  );
}
```

#### 2. VideoShowcase.module.css

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-section-vertical, 4rem) var(--spacing-horizontal, 2rem);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: var(--gradient-primary, linear-gradient(135deg, #0080FF 0%, #22C55E 100%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  font-size: 1.125rem;
  color: var(--color-text-secondary, #475569);
  max-width: 600px;
  margin: 0 auto;
}

.videoWrapper {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

/* 响应式 */
@media (max-width: 767px) {
  .container {
    padding: 3rem 1.5rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .description {
    font-size: 1rem;
  }
}
```

### 集成到首页

#### src/pages/index.astro 修改

```astro
---
// 导入 VideoShowcase 组件
import VideoShowcase from '../components/home/VideoShowcase';
---

<main class="homepage">
  <HeroSection client:load />
  <ActivityMetricsSection client:visible />
  <FeaturesShowcase client:visible />
  <ShowcaseSection client:idle />

  <!-- 新增视频展示区块 -->
  <VideoShowcase
    videoId="BV1pirZBuEzq"
    title="每天哈基半小时,AI多任务编程实战"
    description="通过视频快速了解 Hagicode 的核心功能和使用方法"
    client:visible
  />

  <QuickStartSection client:idle />
</main>
```

### 水合策略选择

使用 `client:visible` 而非 `client:load` 的原因:

1. **性能优化**: 视频区块不在首屏,延迟加载减少初始 JS 束大小
2. **用户体验**: 当用户滚动到视频区块时才开始水合,避免不必要的资源消耗
3. **渐进增强**: 即使水合失败,页面其他功能仍正常工作

替代方案对比:

| 指令 | 加载时机 | 适用场景 | JS 束影响 |
|------|----------|----------|-----------|
| `client:load` | 页面加载时立即 | 首屏必需组件 | 高 |
| `client:visible` | 进入视口时 | 首屏以下的交互组件 | 中 |
| `client:idle` | 浏览器空闲时 | 低优先级组件 | 低 |

## 设计系统对齐

### 样式一致性

VideoShowcase 组件遵循项目设计系统:

1. **色彩系统**:
   - 使用 CSS 变量 `--color-primary`, `--color-secondary`
   - 渐变使用 `--gradient-primary`
   - 文字颜色使用 `--color-text-secondary`

2. **间距系统**:
   - 使用变量 `--spacing-section-vertical`, `--spacing-horizontal`
   - 保持与其他区块一致的垂直间距(4rem)

3. **圆角系统**:
   - VideoPlayer 已使用 `--sl-radius-lg`
   - VideoShowcase 保持一致

4. **动画系统**:
   - 使用 Framer Motion 实现
   - 动画参数与 HeroSection、FeaturesShowcase 保持一致
   - `viewport={{ once: true }}` 确保动画只播放一次

### 响应式设计

断点与现有组件一致:

- **移动端**: < 768px (padding 减小,字体缩小)
- **平板**: 768px - 1024px (中等布局)
- **桌面**: > 1024px (完整布局)

## 性能优化

### 1. 延迟水合

```astro
<VideoShowcase client:visible />
```

### 2. iframe 优化

VideoPlayer 组件已实现:
- `sandbox` 属性限制 iframe 权限
- `loading="lazy"` 浏览器原生延迟加载(可添加)

### 3. CSS 优化

- 使用 CSS Modules 避免全局污染
- 所有样式限定在组件作用域

### 4. 预加载策略(可选)

如果视频在首屏,可添加 DNS 预解析:

```astro
<head>
  <link rel="dns-prefetch" href="//player.bilibili.com">
</head>
```

## 可访问性考虑

### 1. 语义化 HTML

使用 `<section>` 标签包裹视频区块:
```html
<section aria-labelledby="video-showcase-title">
  <h2 id="video-showcase-title">产品演示视频</h2>
  <!-- 视频内容 -->
</section>
```

### 2. 键盘导航

Bilibili iframe 需要确保可聚焦(focusable):
- VideoPlayer 的 iframe 已正确设置属性
- 用户可通过 Tab 键导航到视频播放器

### 3. 屏幕阅读器

- 添加 `title` 属性到 iframe(已实现)
- 区块标题使用 `<h2>` 语义标签

## 测试策略

### 单元测试(可选)

```typescript
// VideoShowcase.test.tsx
describe('VideoShowcase', () => {
  it('renders title and description', () => {
    // 测试标题和描述渲染
  });

  it('integrates BilibiliVideo component', () => {
    // 测试视频组件集成
  });
});
```

### 手动测试清单

- [ ] 视频区块在首页正确显示
- [ ] 视频能正常播放
- [ ] 响应式布局在移动端/平板/桌面正常
- [ ] 深色主题切换正常
- [ ] 滚动动画流畅
- [ ] 无控制台错误

### 自动化测试

```bash
# 类型检查
npm run typecheck

# 构建验证
npm run build

# 链接完整性检查(由 Astro 自动完成)
```

## 风险与缓解

### 风险 1: Bilibili 访问限制

**风险**: 某些地区或网络环境无法访问 Bilibili

**缓解方案**:
- 当前方案仅支持 Bilibili
- 未来可扩展支持其他平台(YouTube、Vimeo)
- 添加错误处理:iframe 加载失败时显示提示

### 风险 2: 性能影响

**风险**: iframe 加载可能影响页面性能

**缓解方案**:
- 使用 `client:visible` 延迟水合
- 未来可添加 `loading="lazy"` 到 iframe
- 监控 LCP(Largest Contentful Paint)指标

### 风险 3: 响应式问题

**风险**: 不同设备上视频显示不一致

**缓解方案**:
- VideoPlayer 已实现 16:9 固定比例
- VideoShowcase 使用响应式 padding 和字体大小
- 充分测试多设备

## 未来扩展

### 1. 多视频支持

```typescript
interface VideoShowcaseProps {
  videos: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
}
```

### 2. 播放列表支持

集成 Bilibili 播放列表功能,展示多个相关视频。

### 3. 视频统计集成

使用 Microsoft Clarity 或其他分析工具跟踪视频播放数据。

### 4. 备用视频源

当 Bilibili 不可用时,自动切换到备用视频源(如本地视频或其他平台)。

## 总结

本设计文档详细说明了首页视频展示区块的技术实现方案。设计遵循项目现有的架构模式、设计系统和最佳实践,确保集成后代码一致性和可维护性。实施时请参考 `tasks.md` 的详细任务清单。
