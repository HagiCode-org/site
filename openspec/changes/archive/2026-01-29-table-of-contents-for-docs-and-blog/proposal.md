# 提案：为文档和博客页面添加目录功能

## 概述

为 Hagicode 文档站点的文档页面和博客页面添加**目录(Table of Contents, TOC)**功能,提升用户浏览长内容时的导航效率和阅读体验。

## 背景

当前站点基于 Astro 5.x 构建,包含两大主要内容区域:
- **文档**(`src/content/docs/`):技术文档、快速开始指南、功能说明
- **博客**(`src/content/blog/`):文章和博客内容

两个内容区域都使用 Astro Content Collections 进行类型安全管理,并通过动态路由 `[...slug].astro` 渲染。

## 问题

当前文档和博客页面缺少目录功能,存在以下用户体验问题:

1. **导航效率低**:用户在浏览长篇幅文档时,无法快速定位到特定章节
2. **内容概览缺失**:用户无法直观了解文档的结构和章节层级
3. **阅读体验不佳**:需要手动滚动查找内容,降低了文档的可读性和可用性

## 解决方案

### 核心功能

为文档和博客页面添加以下目录功能:

1. **自动生成目录**
   - 基于 Markdown/MDX 内容的标题层级(H2-H6)自动生成
   - 跳过 H1 标题(因为 H1 通常是页面标题)
   - 支持多级嵌套结构

2. **双区域支持**
   - 文档页面:`src/pages/docs/[...slug].astro`
   - 博客页面:`src/pages/blog/[...slug].astro`

3. **交互功能**
   - 点击目录项平滑滚动到对应章节
   - 滚动页面时高亮当前阅读位置(Intersection Observer)
   - 移动端响应式适配

4. **UI 设计**
   - 文档页面:右侧边栏固定显示(桌面端)
   - 博客页面:内容顶部内联显示或侧边显示
   - 使用现有 CSS 变量和主题系统
   - 缩进显示层级关系

### 技术实现

#### 组件设计

创建可复用的 `TableOfContents.astro` 组件:

```typescript
// src/components/TableOfContents.astro
interface Props {
  headings: Array<{
    text: string;
    slug: string;
    level: number;
  }>;
  labels?: {
    title?: string;
    goToTop?: string;
  };
}
```

#### 标题提取方法

使用 Astro 的 MDX 集成或 remark/rehype 插件提取标题结构:

**方案 1**:使用 `remark-extract-headings` 或类似插件在构建时提取
**方案 2**:使用 React 组件在客户端通过 `document.querySelectorAll('h2, h3, h4, h5, h6')` 提取

**推荐方案**:使用客户端 React 组件,原因:
- 零配置,无需修改 Astro MDX 配置
- 与现有 React 集成兼容
- 支持动态标题提取

#### 状态管理

使用 React hooks 管理交互状态:
- `useState` 存储激活的目录项
- `useEffect` + `IntersectionObserver` 监听滚动位置
- `scrollTo` 实现平滑滚动

#### 布局调整

修改 `src/layouts/DocsLayout.astro`:

```astro
<div class="docs-layout">
  <main class="docs-main">
    <slot />
  </main>
  <aside class="docs-sidebar">
    <TableOfContents headings={headings} />
  </aside>
</div>
```

移动端使用 `@media` 查询隐藏侧边栏或将目录移至内容顶部。

## 影响分析

### 用户体验提升

- ✅ 提供快速导航能力,减少用户查找时间
- ✅ 改善长文档的可读性和结构感知
- ✅ 提升站点的专业性和可用性
- ✅ 符合现代文档站点的标准体验

### 技术影响

#### 新增文件
- `src/components/TableOfContents.astro` - 目录组件

#### 修改文件
- `src/layouts/DocsLayout.astro` - 添加侧边栏布局
- `src/pages/docs/[...slug].astro` - 集成目录组件
- `src/pages/blog/[...slug].astro` - 集成目录组件
- `src/styles/global.css` - 添加目录相关样式变量

#### 依赖影响
- 无需新增外部依赖
- 使用现有的 React 和 Astro 集成
- 保持零 JS 或最小 JS 水合(仅在需要交互时)

### 性能考虑

- **构建时**:目录标题在客户端提取,不影响构建性能
- **运行时**:
  - 使用 `IntersectionObserver` API(原生浏览器支持,性能优异)
  - 防抖滚动事件,避免频繁重渲染
  - 可选:仅在内容超过一定长度时显示目录

### 兼容性

- ✅ 支持所有现代浏览器(Chrome, Firefox, Safari, Edge)
- ✅ 移动端响应式适配
- ✅ 兼容现有的深色模式主题
- ✅ 不影响现有内容和路由结构
- ✅ 不影响 SEO(目录内容不作为主要内容索引)

## 实施范围

### 包含内容

- ✅ 创建 `TableOfContents.astro` 组件
- ✅ 集成到文档页面(`docs/[...slug].astro`)
- ✅ 集成到博客页面(`blog/[...slug].astro`)
- ✅ 修改 `DocsLayout.astro` 布局
- ✅ 添加样式和响应式设计
- ✅ 实现滚动高亮交互
- ✅ 添加国际化文本支持(中文)

### 不包含内容

- ❌ 左侧导航边栏(已有 DirectoryIndex 组件)
- ❌ 目录搜索功能
- ❌ 目录打印优化
- ❌ 目录导出功能

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 标题 anchor 链接不存在 | 目录点击无效 | 确保 MDX 配置为标题自动生成 id |
| 样式冲突 | UI 显示异常 | 使用 BEM 命名约定和 CSS 模块 |
| 移动端体验差 | 移动用户难以使用 | 响应式设计,小屏幕隐藏或折叠 |
| 性能问题 | 滚动卡顿 | 使用 `IntersectionObserver` 而非 scroll 事件监听 |

## 成功标准

1. **功能完整性**
   - [ ] 文档页面正确显示目录
   - [ ] 博客页面正确显示目录
   - [ ] 点击目录项平滑滚动到对应章节
   - [ ] 滚动时正确高亮当前章节

2. **视觉一致性**
   - [ ] 目录样式与现有设计系统一致
   - [ ] 深色模式下目录样式正确
   - [ ] 响应式设计在各种屏幕尺寸下正常工作

3. **代码质量**
   - [ ] TypeScript 类型检查通过(`npm run typecheck`)
   - [ ] 构建成功无错误(`npm run build`)
   - [ ] 遵循项目代码规范

4. **用户体验**
   - [ ] 目录在内容较短时不显示(避免空白)
   - [ ] 目录层级缩进清晰
   - [ ] 移动端体验良好

## 替代方案

### 方案 A:使用第三方库
**选项**:`@astrojs/starlight` 的目录组件

**优点**:
- 成熟稳定
- 功能完善

**缺点**:
- 引入额外依赖
- 可能与现有布局不兼容
- 配置复杂

**决策**:❌ 不采用,保持项目轻量级

### 方案 B:仅文档页面添加目录
**选项**:只为文档页面添加目录,博客页面不添加

**优点**:
- 实施范围小
- 博客通常较短,不需要目录

**缺点**:
- 长博客文章体验不佳
- 不一致性

**决策**:❌ 不采用,两区域统一添加

### 方案 C:服务端渲染目录
**选项**:在构建时通过 remark/rehype 插件提取标题

**优点**:
- 零客户端 JS
- SEO 友好

**缺点**:
- 配置复杂
- 灵活性差
- 无法动态更新

**决策**:❌ 不采用,客户端方案更灵活

## 相关资源

- [Astro Content Collections 文档](https://docs.astro.build/en/guides/content-collections/)
- [Astro MDX 集成文档](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [MDX 自动生成标题 ID](https://www.npmjs.com/package/rehype-slug)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## 时间估算

- 组件开发:2-3 小时
- 布局调整:1-2 小时
- 样式和响应式:1-2 小时
- 测试和调试:1-2 小时
- **总计**:5-9 小时

## 审批流程

1. ✅ 提案创建
2. ✅ 技术评审
3. ✅ 设计评审
4. ✅ 实施批准
5. ✅ 实施
6. ⏳ 验收测试
7. ⏳ 部署上线

---

**提案创建时间**:2026-01-29
**提案状态**:实施完成
**提案负责人**:AI Assistant
**相关规格**:参见 `specs/table-of-contents/spec.md`
