# table-of-contents Specification

## Purpose

定义文档和博客页面的目录(Table of Contents, TOC)功能需求,提升用户浏览长内容时的导航效率和阅读体验。

## Context

- **项目**: Hagicode Documentation
- **框架**: Astro 5.x + React 18.2
- **内容类型**: 文档页面(`docs`)和博客页面(`blog`)
- **语言**: 简体中文
- **相关规格**: `astro-site` (站点基础架构)

---

## ADDED Requirements

### Requirement: 目录组件

The site MUST provide a reusable table of contents component for displaying content structure navigation in documentation and blog pages.

站点必须提供可复用的目录组件,用于在文档和博客页面中显示内容结构导航。

#### Scenario: 在文档页面显示目录

**Given** 用户访问一个包含多个章节的文档页面
**And** 该文档至少包含 3 个标题(H2-H6)
**When** 页面加载完成
**Then** 右侧边栏必须显示目录组件
**And** 目录必须包含文档的所有二级到六级标题
**And** 目录必须正确显示标题层级关系(缩进)
**And** 目录必须使用站点现有的主题系统(颜色、字体、间距)

#### Scenario: 在博客页面显示目录

**Given** 用户访问一篇包含多个章节的博客文章
**And** 该文章至少包含 3 个标题(H2-H6)
**When** 页面加载完成
**Then** 右侧边栏或内容顶部必须显示目录组件
**And** 目录必须包含文章的所有二级到六级标题
**And** 目录样式必须与文档页面一致

#### Scenario: 短内容不显示目录

**Given** 用户访问一个包含少于 3 个标题的页面
**When** 页面加载完成
**Then** 目录组件不应显示
**And** 页面布局不应为目录留出空白区域

---

### Requirement: 标题提取和锚点生成

The TOC MUST automatically extract headings from Markdown/MDX content and generate anchor links.

目录必须自动从 Markdown/MDX 内容中提取标题并生成锚点链接。

#### Scenario: 自动提取标题层级

**Given** MDX 内容包含以下标题结构:
```markdown
# 页面标题(H1)
## 第一章节(H2)
### 第一小节(H3)
## 第二章节(H2)
#### 更深层的标题(H4)
```
**When** 目录组件渲染
**Then** 目录必须包含"H2 标题"和"H3 小节"(跳过 H1)
**And** "H3 小节"必须作为"H2 标题"的子项显示(缩进)
**And** "H4 更深层"必须作为"H2 标题"的子项显示

#### Scenario: 标题自动生成 ID

**Given** MDX 内容包含标题 `## 快速开始`
**When** MDX 转换为 HTML
**Then** 标题元素必须包含 `id` 属性(例如 `id="快速开始"` 或 `id="kuai-su-kai-shi"`)
**And** 目录链接的 `href` 必须匹配该 ID(例如 `href="#快速开始"`)

---

### Requirement: 目录交互功能

The TOC MUST provide interactive features including click-to-scroll and scroll-based active highlighting.

目录必须提供点击跳转和滚动高亮等交互功能。

#### Scenario: 点击目录项跳转到对应章节

**Given** 用户在浏览文档页面
**And** 目录包含"第二章节"链接
**When** 用户点击"第二章节"
**Then** 页面必须平滑滚动到"第二章节"位置
**And** URL 必须更新为 `#第二章节`(可选)
**And** 浏览器滚动行为必须使用 `scrollIntoView({ behavior: 'smooth' })`

#### Scenario: 滚动时高亮当前章节

**Given** 用户正在浏览文档页面
**And** 页面已滚动到"第三章节"可见区域
**When** 用户停止滚动
**Then** 目录中"第三章节"必须显示为激活状态
**And** 激活状态必须使用主题色高亮显示
**And** 其他目录项必须显示为非激活状态

#### Scenario: 返回顶部功能

**Given** 用户已滚动到页面底部
**And** 目录底部包含"返回顶部"按钮
**When** 用户点击"返回顶部"按钮
**Then** 页面必须平滑滚动到页面顶部
**And** 滚动完成后目录高亮状态应重置

---

### Requirement: 响应式设计

The TOC MUST provide good user experience across different screen sizes.

目录必须在不同屏幕尺寸下提供良好的用户体验。

#### Scenario: 桌面端布局

**Given** 用户使用桌面浏览器(屏幕宽度 >= 996px)
**And** 当前在文档页面
**When** 页面加载完成
**Then** 目录必须显示在右侧边栏
**And** 目录必须使用固定定位(sticky)跟随页面滚动
**And** 主内容区域和目录必须并排显示(双栏布局)

#### Scenario: 移动端布局

**Given** 用户使用移动设备(屏幕宽度 < 996px)
**And** 当前在文档页面
**When** 页面加载完成
**Then** 目录必须隐藏或显示在内容顶部
**And** 页面必须使用单栏布局(主内容占满宽度)
**And** 用户可以正常浏览文档内容

#### Scenario: 平板端布局

**Given** 用户使用平板设备(屏幕宽度 768px - 996px)
**And** 当前在文档页面
**When** 页面加载完成
**Then** 目录可以显示在侧边栏或内容顶部
**And** 布局必须适配屏幕宽度
**And** 目录宽度应小于桌面端(例如 200px 而非 280px)

---

### Requirement: 主题适配

The TOC MUST support the site's dark mode theme system.

目录必须支持站点的深色模式主题系统。

#### Scenario: 浅色模式样式

**Given** 用户已选择浅色主题
**And** 当前在文档页面
**When** 目录渲染
**Then** 目录背景色必须与页面背景一致
**And** 目录链接文本必须使用次要文本色(灰色或深灰色)
**And** 激活目录项必须使用主题色(绿色)
**And** 所有颜色必须符合浅色模式主题规范

#### Scenario: 深色模式样式

**Given** 用户已切换到深色主题
**And** 当前在文档页面
**When** 目录渲染
**Then** 目录背景色必须与深色模式页面背景一致
**And** 目录链接文本必须使用深色模式次要文本色(浅灰色)
**And** 激活目录项必须使用深色模式主题色(青色)
**And** 所有颜色必须符合深色模式主题规范

#### Scenario: 主题切换即时生效

**Given** 用户正在浏览包含目录的页面
**When** 用户切换主题(浅色 → 深色或深色 → 浅色)
**Then** 目录样式必须立即更新以匹配新主题
**And** 无需刷新页面

---

### Requirement: 性能和可访问性

The TOC feature MUST maintain good performance and accessibility standards.

目录功能必须保持良好的性能和可访问性标准。

#### Scenario: 页面加载性能

**Given** 文档页面包含 50 个标题
**When** 页面加载
**Then** 目录渲染时间不应超过 100ms
**And** 目录功能不应阻塞页面首次内容绘制(FCP)
**And** 目录组件应使用客户端水合(React `client:load` 或 `client:visible`)

#### Scenario: 滚动性能

**Given** 用户快速滚动长文档页面
**When** 滚动事件触发
**Then** 目录高亮更新不应导致滚动卡顿
**And** 滚动帧率必须保持 >= 60 FPS
**And** 应使用 `IntersectionObserver` API 而非 `scroll` 事件监听

#### Scenario: 键盘导航

**Given** 用户使用键盘浏览页面
**When** 用户使用 Tab 键聚焦到目录链接
**Then** 目录链接必须显示焦点指示器(边框或轮廓)
**When** 用户按 Enter 键激活链接
**Then** 页面必须跳转到对应章节

#### Scenario: 屏幕阅读器支持

**Given** 用户使用屏幕阅读器浏览页面
**When** 屏幕阅读器解析目录
**Then** 目录必须使用语义化 HTML(`<nav>`, `<ul>`, `<li>`)
**And** 导航区域必须包含 `aria-label="目录"` 或类似标签
**And** 激活的目录项应包含 `aria-current="true"` 属性

---

### Requirement: 国际化支持

The TOC component MUST support Chinese interface and custom labels.

目录组件必须支持中文界面和自定义标签。

#### Scenario: 默认中文界面

**Given** 用户的浏览器语言设置为中文(zh-CN)
**And** 目录使用默认配置
**When** 目录渲染
**Then** 目录标题必须显示"本页目录"
**And** 返回顶部按钮必须显示"↑ 返回顶部"

#### Scenario: 自定义标签文本

**Given** 开发者需要自定义目录标签
**When** 渲染目录组件并传入 `labels` 属性:
```tsx
<TableOfContents labels={{ title: '文章目录', goToTop: '↑ 回到顶部' }} />
```
**Then** 目录标题必须显示"文章目录"
**And** 返回顶部按钮必须显示"↑ 回到顶部"

---

## Implementation Notes

### 技术栈

- **框架**: Astro 5.16 + React 18.2
- **MDX 插件**: `rehype-slug`(自动生成标题 ID)
- **React Hooks**: `useState`, `useEffect`, `useRef`
- **Web API**: `IntersectionObserver`, `scrollIntoView`

### 组件接口

```typescript
// src/components/TableOfContents.tsx
interface Heading {
  text: string;    // 标题文本
  slug: string;    // 锚点 ID
  level: number;   // 标题级别 (2-6)
}

interface Props {
  labels?: {
    title?: string;        // 目录标题,默认"本页目录"
    goToTop?: string;      // 返回顶部文本,默认"↑ 返回顶部"
  };
}
```

### 布局结构

```astro
<!-- src/layouts/DocsLayout.astro -->
<div class="docs-layout">
  <main class="docs-main">
    <slot />
  </main>
  <aside class="docs-sidebar">
    <slot name="sidebar" />
  </aside>
</div>
```

### 使用示例

```astro
---
import TableOfContents from '@components/TableOfContents.astro';
---

<DocsLayout title={title} description={description}>
  <article>{content}</article>
  <slot slot="sidebar">
    <TableOfContents client:load />
  </slot>
</DocsLayout>
```

---

## Non-Functional Requirements

### 性能要求

- 目录渲染时间 < 100ms
- 滚动帧率 >= 60 FPS
- 不应显著增加页面 JS bundle 大小(目标 < 10KB gzipped)

### 兼容性要求

- 支持所有现代浏览器(Chrome, Firefox, Safari, Edge 最新版本)
- 支持移动浏览器(iOS Safari, Chrome Android)
- `IntersectionObserver` API 支持(必要)

### 可维护性要求

- TypeScript 严格模式通过
- 遵循项目代码规范
- 组件可复用(文档和博客页面共享)
- 样式使用全局 CSS 变量

---

## Related Requirements

- **astro-site**:站点基础架构(Astro 配置、Content Collections、布局系统)
- **Content Collections**:文档和博客内容的类型安全管理
- **MDX Integration**:增强的 Markdown 支持

---

## Success Criteria

目录功能被视为成功实现,当满足以下标准:

1. **功能完整性**:
   - ✅ 文档和博客页面正确显示目录
   - ✅ 点击跳转和滚动高亮功能正常
   - ✅ 返回顶部功能正常

2. **用户体验**:
   - ✅ 桌面端和移动端体验良好
   - ✅ 深色模式样式正确
   - ✅ 交互流畅无卡顿

3. **技术质量**:
   - ✅ TypeScript 类型检查通过
   - ✅ 构建成功无错误
   - ✅ 性能测试通过(Lighthouse >= 90)

4. **可访问性**:
   - ✅ 键盘导航支持
   - ✅ 屏幕阅读器支持
   - ✅ 符合 WCAG 2.1 AA 标准

---

**规格版本**:1.0
**创建日期**:2026-01-29
**最后更新**:2026-01-29
**作者**:AI Assistant
**状态**:待评审
