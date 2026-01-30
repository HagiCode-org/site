# Design: Astro 框架首页功能重构实现

## Architecture Overview

### 组件架构

首页采用 **组件化架构**,将原有的 Docusaurus React 组件适配为 Astro 兼容的 React 组件。

```
src/pages/index.astro (Astro 页面)
├── HeroSection.tsx (React 组件)
├── ActivityMetricsSection.tsx (React 组件)
├── FeaturesShowcase.tsx (React 组件)
├── VideoPlayer.tsx (React 组件)
├── BilibiliVideo.tsx (React 组件)
├── ShowcaseSection.tsx (React 组件)
└── QuickStartSection.tsx (React 组件)
```

### 技术栈选择

**前端框架**
- **Astro 5.16** - 静态站点生成器,零 JS 默认
- **React 18.2** - 交互组件 UI 库
- **@astrojs/react 4.4** - Astro React 集成
- **TypeScript 5.3** - 类型安全

**动画库**
- **Framer Motion 12.26** - 声明式动画库
  - 用于数字滚动动画
  - 用于特性展示的交互式动画
  - 用于页面元素进入动画

**样式方案**
- **CSS Modules (`.module.css`)** - 模块化样式
- **Starlight CSS Variables** - 复用主题变量
- **CSS Custom Properties** - 动态主题切换

### 数据流架构

```
public/activity-metrics.json (静态数据)
    ↓
ActivityMetricsSection.tsx (组件)
    ↓
fetch + JSON.parse
    ↓
useState + useEffect (状态管理)
    ↓
UI 渲染 + 动画
```

## Component Design

### 1. HeroSection 组件

**职责**: 展示产品标题、描述和 CTA 按钮

**Props**: 无

**State**: 无

**关键功能**:
- 显示 Hagicode 标题和标语
- 两个 CTA 按钮 (开始使用、了解更多)
- QQ 群加入卡片

**样式设计**:
- 使用 Starlight 的颜色变量
- 大标题居中显示
- 按钮使用 Starlight 的 button 样式类
- 渐变背景增强视觉效果

**水合策略**: `client:idle` (低优先级,不阻塞首屏)

### 2. ActivityMetricsSection 组件

**职责**: 展示活动指标数据

**Props**: 无

**State**:
```typescript
{
  data: ActivityMetricsData | null
  isLoading: boolean
  error: Error | null
}
```

**关键功能**:
- 从 `/activity-metrics.json` 加载数据
- 显示 Docker Hub 拉取量
- 显示 Clarity 活跃用户和会话数
- 数字滚动动画 (CountUp 组件)
- 骨架屏加载状态
- 错误处理和空状态

**样式设计**:
- 卡片式布局 (Grid)
- 渐变背景卡片
- 响应式网格 (mobile: 1列, tablet: 2列, desktop: 3列)
- 暗色模式适配

**水合策略**: `client:visible` (进入视口时加载)

**性能优化**:
- 使用 `requestAnimationFrame` 实现平滑动画
- 使用 `useInView` 钩子延迟动画启动
- 缓动函数 (easeOutQuart) 提升动画质感

### 3. FeaturesShowcase 组件

**职责**: 展示产品三大特性 (智能、便捷、有趣)

**Props**: 无

**State**:
```typescript
{
  activeStage: number (SmartFeature)
  animateBars: boolean (ConvenientFeature)
  showTooltip: boolean (InterestingFeature)
}
```

**关键功能**:
- **SmartFeature**: OpenSpec 工作流动画
  - 9 个阶段的循环动画 (Idea → Archive)
  - 进度条动画
  - 效率提升图表 (300%)
- **ConvenientFeature**: 多线程会话管理
  - 并发会话柱状图动画
  - 响应式布局展示
- **InterestingFeature**: 成就系统
  - 成就徽章展示
  - Tooltip 交互

**样式设计**:
- 三个独立的功能区域
- 渐变色主题区分 (Smart: 紫色系, Convenient: 蓝色系, Interesting: 橙色系)
- 背景图案装饰
- 响应式布局 (mobile: 堆叠, desktop: 水平排列)

**水合策略**: `client:visible` (进入视口时加载)

**性能优化**:
- 使用 `setInterval` 控制动画节奏
- 使用 `AnimatePresence` 优化动画切换

### 4. VideoPlayer 和 BilibiliVideo 组件

**职责**: 视频内容展示

**Props**:
```typescript
interface VideoPlayerProps {
  videoId: string
  title: string
}
```

**关键功能**:
- 嵌入 Bilibili 视频 (iframe)
- 响应式视频容器
- 懒加载优化

**样式设计**:
- 16:9 宽高比容器
- 圆角边框
- 阴影效果

**水合策略**: `client:lazy` (延迟加载)

### 5. ShowcaseSection 组件

**职责**: 社区项目展示

**Props**: 无 (或从配置文件读取)

**关键功能**:
- 展示社区项目列表
- 项目卡片布局
- 链接到项目仓库

**样式设计**:
- 网格布局
- 卡片悬停效果
- 渐变边框

**水合策略**: `client:idle` (低优先级)

### 6. QuickStartSection 组件

**职责**: 快速开始引导

**Props**: 无

**关键功能**:
- 快速开始步骤卡片
- 文档链接
- 安装命令展示

**样式设计**:
- 步骤式布局
- 编号徽章
- 箭头连接线

**水合策略**: `client:idle` (低优先级)

## Styling Strategy

### CSS Variables 复用

使用 Starlight 主题的 CSS 变量确保视觉一致性:

```css
/* 颜色变量 */
--sl-hairline
--sl-border
--sl-text
--sl-text-low
--sl-bg
--sl-bg-alt
--sl-bg-inset
--sl-color-accent
--sl-color-accent-low
--sl-color-white
--sl-color-black

/* 间距变量 */
--space-xs
--space-sm
--space-md
--space-lg
--space-xl

/* 字体变量 */
--sl-text-sm
--sl-text-base
--sl-text-lg
--sl-text-h1
--sl-text-h2
--sl-text-h3

/* 圆角变量 */
--sl-radius-sm
--sl-radius-md
--sl-radius-lg
```

### 模块化 CSS 模式

每个组件使用独立的 `.module.css` 文件:

```css
/* HeroSection.module.css */
.heroSection {
  /* 组件样式 */
}

.heroTitle {
  /* 子元素样式 */
}
```

### 响应式设计断点

```css
/* Mobile First */
.component {
  /* mobile styles (默认) */
}

@media (min-width: 768px) {
  /* tablet styles */
}

@media (min-width: 1024px) {
  /* desktop styles */
}
```

### 暗色模式适配

使用 CSS 变量自动适配暗色模式:

```css
.card {
  background: var(--sl-bg);
  color: var(--sl-text);
  border: 1px solid var(--sl-border);
}
```

## Data Management

### Activity Metrics 数据结构

```typescript
interface ActivityMetricsData {
  lastUpdated: string; // ISO 8601 日期
  dockerHub: {
    pullCount: number;
    repository: string;
  };
  clarity: {
    activeUsers: number;
    activeSessions: number;
    dateRange: string;
  };
}
```

### 数据加载策略

1. **组件挂载时加载**: `useEffect` 触发 `fetch`
2. **错误处理**: `try-catch` 捕获异常
3. **加载状态**: 显示骨架屏
4. **空数据处理**: 显示友好的空状态 UI
5. **缓存策略**: 组件级状态管理 (无全局缓存)

## Animation Design

### Framer Motion 动画模式

**进入动画**:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

**数字滚动动画**:
```typescript
// 使用缓动函数 easeOutQuart
const easeOutQuart = 1 - Math.pow(1 - progress, 4);
```

**工作流动画**:
```typescript
<motion.div
  animate={{
    opacity: activeStage === index ? 1 : 0.4,
    scale: activeStage === index ? 1.1 : 1,
  }}
  transition={{ duration: 0.3 }}
>
```

### 性能优化

**选择性水合**:
- 首屏必需组件: `client:load` (HeroSection)
- 视口内组件: `client:visible` (ActivityMetricsSection, FeaturesShowcase)
- 低优先级组件: `client:idle` (VideoPlayer, QuickStartSection)
- 延迟加载组件: `client:lazy` (BilibiliVideo)

**动画优化**:
- 使用 `transform` 和 `opacity` (GPU 加速)
- 避免动画 `width`, `height` (触发 reflow)
- 使用 `will-change` 提示浏览器优化
- 限制同时运行动画数量

## Accessibility Design

### 键盘导航

- 所有交互元素支持键盘访问
- 焦点顺序逻辑清晰
- 可见焦点指示器

### 屏幕阅读器

- 语义化 HTML (`<section>`, `<h2>`, `<button>`)
- ARIA 标签 (`aria-label`, `aria-describedby`)
- `alt` 文本描述

### 减少动画偏好

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing Strategy

### 手动测试检查点

**功能测试**:
- [ ] 所有按钮和链接可点击
- [ ] 活动指标数据正确加载
- [ ] 动画流畅无卡顿
- [ ] 视频播放器正常工作

**视觉测试**:
- [ ] 亮色模式显示正常
- [ ] 暗色模式显示正常
- [ ] 响应式布局正确
- [ ] 无视觉破损或错位

**性能测试**:
- [ ] Lighthouse 性能分数 > 90
- [ ] 首屏加载时间 < 2s
- [ ] 无明显 CLS
- [ ] 动画 60fps

**兼容性测试**:
- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] Edge 最新版

### 自动化测试

**类型检查**:
```bash
npm run typecheck
```

**构建验证**:
```bash
npm run build
```

## Migration Notes

### 从 Docusaurus 组件迁移

**保持不变的部分**:
- 组件逻辑和状态管理
- 大部分 JSX 结构
- CSS 样式逻辑

**需要修改的部分**:
1. **Link 组件**: 从 `@docusaurus/Link` 改为 Astro `<a>` 标签或 `<Link>` (Astro 组件)
2. **样式导入**: 从 Docusaurus Infima CSS 变量改为 Starlight CSS 变量
3. **组件导出**: 确保 React 组件正确导出 (`.tsx` 文件)
4. **客户端指令**: 在 `.astro` 文件中添加 `client:*` 指令

**示例迁移**:

**Docusaurus 版本**:
```tsx
import Link from '@docusaurus/Link';

export default function HeroSection() {
  return (
    <section>
      <Link to="/docs/installation" className="button button--primary">
        开始使用
      </Link>
    </section>
  );
}
```

**Astro 版本**:
```tsx
export default function HeroSection() {
  return (
    <section>
      <a href="/docs/installation" className="button button--primary">
        开始使用
      </a>
    </section>
  );
}
```

**在 Astro 页面中使用**:
```astro
---
import HeroSection from '../components/home/HeroSection';
---

<html>
  <body>
    <HeroSection client:load />
  </body>
</html>
```

## Security Considerations

### XSS 防护

- React 自动转义 JSX 中的内容
- 避免 `dangerouslySetInnerHTML` (除非必要且内容已净化)
- 使用 `textContent` 而非 `innerHTML`

### 外方内容 (iframe)

- Bilibili 视频 iframe 使用 `sandbox` 属性限制权限
- 设置 `allowfullscreen` 仅当需要时

### 数据验证

- Activity Metrics 数据加载后验证类型
- 使用 Zod 或类似库进行运行时验证 (可选)

## Performance Budgets

### JavaScript Bundle Size

- 首屏 JS: < 100 KB (gzip)
- 总 JS: < 300 KB (gzip)

### Performance Metrics

- FCP (First Contentful Paint): < 1.5s
- LCP (Largest Contentful Paint): < 2.5s
- TTI (Time to Interactive): < 3.0s
- CLS (Cumulative Layout Shift): < 0.1

### 优化策略

1. **代码分割**: 使用动态导入 (`import()`)
2. **懒加载**: `client:visible` 和 `client:lazy`
3. **预加载**: 关键资源使用 `<link rel="preload">`
4. **压缩**: Astro 自动压缩 JS 和 CSS
5. **图片优化**: 使用 WebP 格式 (如果有图片)

## Future Considerations

### 可扩展性

**组件复用**: 首页组件可在其他页面复用 (如 `/about`)

**国际化**: 虽然当前仅支持中文,但架构上支持未来扩展为多语言

**主题定制**: CSS 变量设计允许未来自定义主题

### 维护性

**类型安全**: TypeScript 提供完整类型定义

**文档注释**: 关键组件添加 JSDoc 注释

**单元测试**: 未来可添加 React 组件测试 (Jest + React Testing Library)

**E2E 测试**: 未来可添加 Playwright 测试

---

*本文档描述了 Astro 首页重构的技术设计,作为提案实施的参考指南。*
