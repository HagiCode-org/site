# 设计文档:首页产品截图展示重构

## 概述

本文档详细说明"首页产品截图展示重构"的技术方案、架构决策和实现细节。此重构涉及组件结构调整、样式设计优化和资源管理策略。

---

## 架构决策

### 决策 1: 组件数据结构设计

**问题**: 如何组织截图展示数据?

**选项对比**:

| 方案 | 优点 | 缺点 | 选择 |
|------|------|------|------|
| **方案 A: 内嵌数组** | 简单直观,易于维护 | 数据与逻辑耦合 | ✅ 采用 |
| 方案 B: 外部 JSON | 数据分离,便于编辑 | 需要额外文件和导入 | - |
| 方案 C: Content Collection | 类型安全,可扩展 | 对于静态内容过度设计 | - |

**最终决策**: 方案 A - 内嵌数组

**理由**:
1. 6 张截图数据量小,无需外部文件管理
2. 说明文案与图片展示逻辑紧密相关,内嵌更便于上下文理解
3. 符合项目现有组件模式(如 FeaturesShowcase)
4. 降低文件复杂度,减少维护成本

**实现**:
```typescript
interface ScreenshotItem {
  src: string;
  title: string;
  description: string;
  alt: string;
}

const screenshots: ScreenshotItem[] = [
  {
    src: '/img/home/亮色主题主界面.png',
    title: '亮色主题主界面',
    description: '简洁直观的界面设计,让 AI 编码体验更加舒适流畅',
    alt: 'Hagicode 亮色主题主界面截图'
  },
  // ... 其他 5 项
];
```

---

### 决策 2: 布局方式选择

**问题**: 如何设计截图展示的网格布局?

**选项对比**:

| 方案 | 优点 | 缺点 | 选择 |
|------|------|------|------|
| **方案 A: 固定网格** | 布局稳定,易于实现 | 截图比例不一时可能裁剪 | ✅ 采用 |
| 方案 B: 瀑布流(Masonry) | 适配不同高度 | 需要额外库(如 Masonry.js) | - |
| 方案 C: 轮播(Carousel) | 节省空间,聚焦内容 | 一次只能看到一张,浏览成本高 | - |

**最终决策**: 方案 A - 固定网格

**理由**:
1. 用户可一次性浏览所有截图,无需交互操作
2. 6 张截图适合 3x2 网格,符合黄金比例
3. 响应式设计可优雅降级为 2x3 或 6x1
4. 无需引入额外依赖,降低构建体积

**响应式断点**:
```css
/* 桌面端 (≥996px): 3 列 */
.screenshotsGrid {
  grid-template-columns: repeat(3, 1fr);
}

/* 平板 (768-995px): 2 列 */
@media (max-width: 995px) {
  .screenshotsGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 移动端 (<768px): 1 列 */
@media (max-width: 767px) {
  .screenshotsGrid {
    grid-template-columns: 1fr;
  }
}
```

---

### 决策 3: 图片优化策略

**问题**: 如何处理图片加载和性能优化?

**选项对比**:

| 方案 | 优点 | 缺点 | 选择 |
|------|------|------|------|
| **方案 A: 延迟加载** | 减少初始加载时间 | 用户滚动到位置才加载 | ✅ 采用 |
| 方案 B: WebP 转换 | 文件体积减少 30-50% | 需要降级方案,增加复杂度 | 后续优化 |
| 方案 C: Astro Image | 自动优化,响应式图片 | 需要额外集成,构建时间增加 | 后续优化 |

**最终决策**: 方案 A - 延迟加载(Astro 原生支持)

**理由**:
1. 首页已使用 `client:idle` 指令,组件在浏览器空闲时加载
2. 6 张 PNG 总大小约 880KB,可接受
3. 无需额外配置,利用 Astro 默认优化
4. WebP 转换和 Astro Image 可在后续迭代优化

**实现**:
```astro
<!-- 首页已有延迟加载 -->
<ShowcaseSection client:idle />
```

---

### 决策 4: 组件命名

**问题**: 是否重命名组件?

**选项对比**:

| 方案 | 优点 | 缺点 | 选择 |
|------|------|------|------|
| **方案 A: 保持 ShowcaseSection** | 无需更新引用 | 名称与实际用途不符 | ✅ 采用(最小变更) |
| 方案 B: 改为 ProductScreenshotsSection | 名称更准确 | 需要更新多处引用 | 可选 |
| 方案 C: 改为 ProductShowcaseSection | 简洁,保持一致性 | 略显模糊 | 可选 |

**最终决策**: 方案 A - 保持 ShowcaseSection

**理由**:
1. 最小化变更范围,降低引入错误风险
2. Showcase 含义广泛,可涵盖截图展示
3. 可通过组件内部注释和文案明确用途
4. 如未来需要重命名,可在单独 PR 中完成

**备注**: 任务清单中将组件重命名列为可选任务(任务 10),开发者可根据偏好选择。

---

## 技术实现

### 组件结构

**改造前**(社区项目链接):
```tsx
<section className={styles.showcaseSection}>
  <div className="container">
    <div className={styles.sectionHeader}>
      <h2>社区展示</h2>
      <p>探索我们构建的精彩项目</p>
    </div>
    <div className={styles.showcaseGrid}>
      {showcaseItems.map((item) => (
        <a href={item.url} target="_blank" className={styles.showcaseCard}>
          <div className={styles.cardIcon}>{item.icon}</div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </a>
      ))}
    </div>
  </div>
</section>
```

**改造后**(产品截图展示):
```tsx
<section className={styles.showcaseSection}>
  <div className="container">
    <div className={styles.sectionHeader}>
      <h2>产品展示</h2>
      <p>探索 Hagicode 的强大功能和精美界面</p>
    </div>
    <div className={styles.screenshotsGrid}>
      {screenshots.map((screenshot) => (
        <figure className={styles.screenshotCard}>
          <img
            src={screenshot.src}
            alt={screenshot.alt}
            className={styles.screenshotImage}
            onError={(e) => handleImageError(e)}
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
```

**关键变更**:
1. `<a>` → `<figure>`: 从链接改为语义化图片容器
2. `showcaseItems` → `screenshots`: 数据源变更
3. 移除 `cardIcon`、`cardLink`: 不再需要外部链接相关元素
4. 添加 `onError` 事件处理: 图片加载失败时的降级显示

---

### 样式设计

**设计系统**: HUD/Sci-Fi FUI + Glassmorphism(保持现有风格)

**核心样式**:
```css
/* 截图网格 - 桌面端 3 列 */
.screenshotsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  position: relative;
  z-index: 1;
}

/* 截图卡片 - 玻璃态效果 */
.screenshotCard {
  background: var(--color-surface-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}

/* 悬停效果 - 缩放 + 阴影 + 边框高亮 */
.screenshotCard:hover {
  transform: translateY(-8px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg), 0 0 30px rgba(0, 128, 255, 0.15);
}

[data-theme='dark'] .screenshotCard:hover {
  border-color: var(--color-secondary);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 255, 255, 0.12);
}

/* 图片样式 - 保持比例,适配容器 */
.screenshotImage {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
  background: var(--color-surface-placeholder);
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 标题和描述 */
.screenshotTitle {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 1rem 1rem 0.5rem;
  color: var(--color-text);
  font-family: var(--font-display);
}

.screenshotDescription {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  padding: 0 1rem 1rem;
}
```

**响应式设计**:
```css
/* 平板 (768-995px): 2 列 */
@media (max-width: 995px) {
  .screenshotsGrid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* 移动端 (<768px): 1 列 */
@media (max-width: 767px) {
  .showcaseSection {
    padding: 3rem 0;
  }

  .screenshotsGrid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .screenshotTitle {
    font-size: 1.1rem;
  }

  .screenshotDescription {
    font-size: 0.9rem;
  }
}
```

---

## 错误处理

### 图片加载失败处理

**问题**: 截图文件缺失或路径错误时如何降级显示?

**实现方案**:
```typescript
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.currentTarget;
  target.style.display = 'none'; // 隐藏损坏的图片

  // 显示占位符
  const parent = target.parentElement;
  if (parent) {
    const placeholder = document.createElement('div');
    placeholder.className = styles.screenshotPlaceholder;
    placeholder.textContent = '图片加载失败';
    parent.insertBefore(placeholder, target.nextSibling);
  }
};
```

**占位符样式**:
```css
.screenshotPlaceholder {
  aspect-ratio: 16 / 9;
  background: var(--color-surface-placeholder);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}
```

**预防措施**:
1. 在构建时检查 `/public/img/home/` 目录中的文件存在性
2. 在组件注释中明确说明依赖的图片资源
3. 考虑添加单元测试验证图片路径正确性

---

## 性能考虑

### 图片加载性能

**当前资源分析**:
```
亮色主题主界面.png - 242 KB
暗色主题主界面.png - 138 KB
每日编写代码获得的成就.png - 386 KB
每日成就报告.png - 107 KB
使用 AI 的效率提升报告.png - 77 KB
实时token消耗报告.png - 35 KB
────────────────────────────────────
总计: 985 KB
```

**优化措施**(已实施):
1. ✅ 使用 `client:idle` 延迟加载组件
2. ✅ 图片懒加载(浏览器原生 `<img loading="lazy">`)
3. ✅ 响应式图片(同一次请求,不同设备显示)

**未来优化方向**(可选):
1. 转换为 WebP 格式(预计减少 30-40% 体积)
2. 使用 Astro Image 组件自动优化
3. 添加图片预加载提示(`<link rel="preload">`)
4. 实现渐进式图片加载(低分辨率 → 高分辨率)

### 渲染性能

**组件优化**:
1. 静态数据(`screenshots`)避免重复创建
2. CSS 动画使用 `transform` 和 `opacity`(GPU 加速)
3. 避免在渲染路径中创建新函数或对象

**示例**:
```typescript
// ✅ 好的做法 - 数据在组件外部定义
const screenshots: ScreenshotItem[] = [...];

export default function ShowcaseSection() {
  return (
    <div className={styles.screenshotsGrid}>
      {screenshots.map((screenshot) => (
        <ScreenshotCard key={screenshot.src} item={screenshot} />
      ))}
    </div>
  );
}

// ❌ 避免的做法 - 每次渲染都创建新数组
export default function ShowcaseSection() {
  const screenshots = [...]; // 每次渲染都重新创建
  // ...
}
```

---

## 可访问性(Accessibility)

### 语义化 HTML

1. **使用 `<figure>` 和 `<figcaption>`**:
   - `<figure>`: 标记自包含的图片内容
   - `<figcaption>`: 提供图片标题和描述
   - 屏幕阅读器可正确识别图片和说明的关系

2. **Alt 文本**:
   - 为每张截图提供描述性 alt 文本
   - 格式: `"Hagicode [功能名称] 截图"`
   - 避免冗余(如 "图片 of...")

3. **键盘导航**:
   - 移除外部链接后,无需额外键盘交互
   - 如未来添加放大功能,需支持 `Enter`/`Space` 激活

### 颜色对比度

**确保符合 WCAG AA 标准**:
- 正文文本(说明文字): 对比度 ≥ 4.5:1
- 大文本(标题): 对比度 ≥ 3:1
- 使用 CSS 变量 `--color-text` 和 `--color-text-secondary` 确保一致性

### 动画和过渡

**减少运动敏感度**:
```css
@media (prefers-reduced-motion: reduce) {
  .screenshotCard {
    transition: none;
  }

  .screenshotImage {
    animation: none;
    opacity: 1;
  }
}
```

---

## 测试策略

### 单元测试(可选)

使用 Vitest 和 React Testing Library:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShowcaseSection from './ShowcaseSection';

describe('ShowcaseSection', () => {
  it('renders 6 screenshots', () => {
    render(<ShowcaseSection />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(6);
  });

  it('displays screenshot titles and descriptions', () => {
    render(<ShowcaseSection />);
    expect(screen.getByText('亮色主题主界面')).toBeInTheDocument();
    expect(screen.getByText(/简洁直观的界面设计/)).toBeInTheDocument();
  });
});
```

**注意**: 当前项目未配置测试框架,此项为可选扩展。

### 视觉回归测试(可选)

使用 Playwright 或 Percy 进行截图对比:

```typescript
test('ShowcaseSection visual regression', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('section.showcaseSection');
  await expect(section).toHaveScreenshot('showcase-section.png');
});
```

### 手动测试清单

- [ ] 所有截图正确加载
- [ ] 响应式布局在三种尺寸下正常
- [ ] 主题切换无样式问题
- [ ] 悬停效果流畅
- [ ] 控制台无错误
- [ ] 图片 alt 文本正确
- [ ] 键盘导航正常(如适用)

---

## 维护指南

### 更新截图

**流程**:
1. 准备新的截图文件(PNG 格式)
2. 替换 `/public/img/home/` 目录中的对应文件
3. 如文件名变更,更新 `screenshots` 数组中的 `src` 字段
4. 运行 `npm run build` 验证构建成功
5. 本地测试 `npm run dev` 确认显示正确

**命名规范**:
- 使用描述性的中文文件名
- 格式: `[功能名称].png`
- 示例: `亮色主题主界面.png`, `实时token消耗报告.png`

### 更新文案

**流程**:
1. 编辑 `ShowcaseSection.tsx` 中的 `screenshots` 数组
2. 修改 `description` 字段内容
3. 确保文案长度一致(建议 1-2 句话,约 20-30 字)
4. 测试不同主题下的显示效果

**文案原则**:
- 突出用户价值和功能亮点
- 语言简洁明了,避免技术术语
- 与产品定位保持一致
- 中文表达自然流畅

### 扩展截图数量

**如需添加更多截图**:
1. 将新截图放入 `/public/img/home/`
2. 在 `screenshots` 数组中添加新项
3. 调整网格布局:
   - 如总数 > 6,考虑改为 4 列(桌面端)
   - 或实现分页/轮播功能
4. 更新响应式断点(如需要)

---

## 风险和限制

### 已知风险

1. **图片资源依赖**:
   - **风险**: 截图文件缺失会导致组件显示异常
   - **缓解**: 添加错误处理和占位符
   - **监控**: 在构建时检查文件存在性

2. **响应式布局复杂性**:
   - **风险**: 不同设备尺寸下可能出现布局错位
   - **缓解**: 充分测试三种断点(桌面/平板/移动)
   - **回退**: 使用 `minmax()` 和 `auto-fit` 增强弹性

3. **性能影响**:
   - **风险**: 6 张图片总大小约 985KB,可能影响加载速度
   - **缓解**: 使用 `client:idle` 延迟加载
   - **监控**: 使用 Lighthouse 测试性能得分

### 限制条件

1. **静态内容**: 当前设计不支持动态配置,如需 CMS 管理,需重构数据源
2. **图片格式**: 仅支持 PNG/JPG/WebP,不支持 SVG(产品截图非矢量图)
3. **浏览器兼容性**: CSS Grid 和 `backdrop-filter` 需要现代浏览器支持

---

## 未来增强方向

### 短期优化(1-2 周内)

1. **图片压缩**: 使用 TinyPNG 或 Squoosh 压缩 PNG 文件
2. **WebP 转换**: 添加 WebP 格式支持,PNG 作为降级
3. **加载动画**: 添加骨架屏或进度指示器

### 中期增强(1-2 月内)

1. **图片放大查看**: 点击截图弹出模态框查看大图
2. **轮播模式**: 添加轮播切换功能,节省空间
3. **A/B 测试**: 对比"截图展示"与"视频演示"的转化效果

### 长期演进(3-6 月内)

1. **CMS 集成**: 使用 Astro Content Collections 管理截图数据
2. **多语言支持**: 截图说明支持 i18n(如网站国际化)
3. **智能推荐**: 根据用户偏好动态调整截图展示顺序

---

## 总结

本设计文档详细说明了"首页产品截图展示重构"的技术方案和实现细节。核心决策包括:

1. **数据结构**: 内嵌数组,简单高效
2. **布局方式**: 固定网格,响应式友好
3. **图片优化**: 延迟加载,性能平衡
4. **组件命名**: 保持原名,最小变更

通过遵循此设计方案,开发者可以系统性地实现组件重构,确保代码质量、用户体验和可维护性的平衡。
