# Spec Delta: Sidebar Navigation

## Capability: Sidebar Navigation

此规格定义了 Astro 文档站点的侧边栏导航功能,提供文档目录树展示、当前页面高亮、响应式布局等核心功能。

---

## ADDED Requirements

### Requirement: Sidebar Component

The site MUST provide a sidebar navigation component to display the documentation table of contents.

#### Scenario: 在文档页面显示侧边栏

**Given** 用户访问任意文档页面(例如 `/docs/quick-start/installation`)
**When** 页面渲染完成
**Then** 页面左侧必须显示侧边栏导航
**And** 侧边栏宽度必须为 280px(桌面端)
**And** 侧边栏必须独立于主内容区域滚动

#### Scenario: 侧边栏组件结构

**Given** 侧边栏组件已实现
**When** 检查组件文件 `src/components/Sidebar.astro`
**Then** 组件必须接受以下 props:
  - `currentSlug: string` - 当前文档的 slug
  - `allDocs: CollectionEntry<'docs'>[]` - 所有文档数据
**And** 组件必须基于文档数据自动生成导航树

---

### Requirement: Document Tree Structure

The sidebar MUST display the documentation directory hierarchy in a tree structure.

#### Scenario: 自动生成文档树

**Given** `src/content/docs/` 目录包含以下文档:
  - `quick-start/installation.md`
  - `quick-start/create-first-project.md`
  - `session-management/session-list.md`
  - `contributor-guide/mermaid-guide.md`
**When** 侧边栏渲染时
**Then** 侧边栏必须显示以下树形结构:
  ```
  Quick Start (folder)
    ├── Installation
    └── Create First Project
  Session Management (folder)
    └── Session List
  Contributor Guide (folder)
    └── Mermaid Guide
  ```

#### Scenario: 支持多级嵌套目录

**Given** 文档目录包含多层嵌套(例如 `a/b/c/d.md`)
**When** 侧边栏渲染时
**Then** 侧边栏必须正确显示所有层级的文件夹
**And** 文件夹和文档节点必须有清晰的视觉区分(图标、缩进)

#### Scenario: 树节点数据结构

**Given** 侧边栏正在构建文档树
**When** 将文档列表转换为树形结构
**Then** 每个节点必须包含以下字段:
  - `id: string` - 唯一标识符
  - `type: 'folder' | 'file'` - 节点类型
  - `title: string` - 显示标题
  - `slug?: string` - 文档 slug(仅文件节点)
  - `children?: TreeNode[]` - 子节点(仅文件夹节点)
  - `depth: number` - 深度层级

---

### Requirement: Current Page Highlighting

The sidebar MUST automatically identify and highlight the currently viewed documentation page.

#### Scenario: 自动高亮当前页面

**Given** 用户正在访问 `/docs/quick-start/installation`
**When** 侧边栏渲染时
**Then** "Installation" 节点必须显示为高亮状态
**And** 高亮样式必须包括:
  - 背景色变化
  - 左侧边框指示器(3px solid primary color)
  - 字体加粗

#### Scenario: 自动展开当前页面路径

**Given** 用户正在访问 `/docs/quick-start/installation`
**When** 侧边栏渲染时
**Then** "Quick Start" 文件夹必须自动展开
**And** "Installation" 文档必须在可见区域内
**And** 其他未相关的文件夹可以保持折叠状态

#### Scenario: 页面切换时更新高亮

**Given** 用户正在浏览 `/docs/quick-start/installation`
**When** 用户点击侧边栏中的 "Create First Project" 链接
**Then** 页面导航到 `/docs/quick-start/create-first-project`
**And** "Create First Project" 节点变为高亮状态
**And** "Installation" 节点的高亮状态移除

---

### Requirement: Expand and Collapse

The sidebar MUST support expand and collapse interactions for folder nodes.

#### Scenario: 点击箭头展开/折叠文件夹

**Given** 侧边栏显示文档树
**When** 用户点击文件夹节点前的展开/折叠箭头
**Then** 文件夹的子节点必须在展开和折叠状态之间切换
**And** 箭头图标必须旋转 90 度指示展开状态

#### Scenario: 默认展开当前页面路径

**Given** 页面初次加载时
**When** 当前文档为 `/docs/quick-start/installation`
**Then** "Quick Start" 文件夹必须默认展开
**And** 其他不相关的文件夹可以保持折叠状态

#### Scenario: 展开状态持久化(可选)

**Given** 用户手动展开或折叠了某些文件夹
**When** 用户导航到其他文档页面
**Then** 用户的展开/折叠选择应该在会话期间保持
**And** 但当前页面的父节点必须始终展开

---

### Requirement: Responsive Layout

The sidebar MUST provide a good user experience across all device sizes.

#### Scenario: 桌面端布局(≥ 997px)

**Given** 用户使用桌面设备访问站点(屏幕宽度 ≥ 997px)
**When** 文档页面加载
**Then** 侧边栏必须固定显示在页面左侧
**And** 侧边栏宽度必须为 280px
**And** 侧边栏必须独立滚动(`overflow-y: auto`)
**And** 主内容区域必须占据剩余空间

#### Scenario: 平板端布局(768px - 996px)

**Given** 用户使用平板设备访问站点(屏幕宽度 768px - 996px)
**When** 文档页面加载
**Then** 侧边栏可以:
  - 缩小宽度至 200px,或
  - 移动到页面顶部显示为水平菜单
**And** 布局必须确保侧边栏和主内容不重叠

#### Scenario: 移动端布局(< 768px)

**Given** 用户使用移动设备访问站点(屏幕宽度 < 768px)
**When** 文档页面初次加载
**Then** 侧边栏必须默认隐藏
**And** 页面必须显示汉堡菜单按钮
**When** 用户点击汉堡菜单
**Then** 侧边栏必须从左侧滑入,覆盖部分主内容
**And** 侧边栏宽度必须为 280px
**And** 背景必须显示半透明遮罩层
**When** 用户点击遮罩层或关闭按钮
**Then** 侧边栏必须滑出隐藏

---

### Requirement: Theme Adaptation

The sidebar MUST correctly adapt to light and dark themes.

#### Scenario: 亮色主题样式

**Given** 用户选择了亮色主题
**When** 侧边栏渲染时
**Then** 侧边栏背景色必须使用 `var(--color-background)`
**And** 文字颜色必须使用 `var(--color-text)`
**And** 边框颜色必须使用 `var(--color-border)`
**And** 高亮颜色必须使用 `var(--ifm-color-primary)`

#### Scenario: 暗色主题样式

**Given** 用户切换到暗色主题
**When** 侧边栏重新渲染
**Then** 侧边栏必须正确显示暗色主题样式
**And** 所有颜色必须使用暗色主题的 CSS 变量
**And** 颜色对比度必须符合可访问性标准(WCAG AA)

#### Scenario: 主题切换时样式更新

**Given** 用户正在浏览文档页面
**When** 用户点击主题切换按钮(亮色 ⇄ 暗色)
**Then** 侧边栏必须立即更新为新主题的样式
**And** 更新过程中不能出现闪烁或样式错乱

---

### Requirement: Sidebar Links

All links in the sidebar MUST correctly navigate to their corresponding documentation pages.

#### Scenario: 点击文档链接跳转

**Given** 用户在侧边栏中看到 "Installation" 文档链接
**When** 用户点击该链接
**Then** 页面必须导航到 `/docs/quick-start/installation`
**And** 侧边栏必须更新高亮状态为 "Installation"
**And** 浏览器 URL 必须更新为对应路径

#### Scenario: 链接支持 VITE_SITE_BASE

**Given** 站点配置了 `VITE_SITE_BASE=/site`
**When** 侧边栏生成链接路径
**Then** 所有链接必须包含基础路径(例如 `/site/docs/quick-start/installation`)
**And** 点击链接必须正确导航到带基础路径的 URL

#### Scenario: 文件夹节点点击行为

**Given** 侧边栏中的 "Quick Start" 文件夹
**When** 用户点击文件夹标题或图标
**Then** 文件夹必须切换展开/折叠状态
**And** 不会触发页面导航(除非文件夹本身也是一个文档页面)

---

### Requirement: Layout Integration

The sidebar MUST be properly integrated into the documentation page layout.

#### Scenario: DocsLayout 布局结构

**Given** `src/layouts/DocsLayout.astro` 布局文件
**When** 检查布局结构
**Then** 布局必须包含:
  - 顶部导航栏(`Navbar.astro`)
  - 文档布局容器(`.docs-layout`)
  - 侧边栏组件(`Sidebar.astro`)
  - 主内容区域(`.docs-main`)
  - 页脚(`Footer.astro`)
**And** 侧边栏和主内容区域必须使用 Flexbox 或 Grid 布局

#### Scenario: 侧边栏与主内容的间距

**Given** 侧边栏和主内容区域并排显示
**When** 检查布局样式
**Then** 侧边栏和主内容之间必须有 2rem 的间距(gap)
**And** 整个布局容器必须有最大宽度 1400px 并居中

#### Scenario: 侧边栏固定定位

**Given** 用户滚动浏览长文档
**When** 主内容区域滚动
**Then** 侧边栏必须保持固定在视口左侧(使用 `position: sticky`)
**And** 侧边栏必须独立于主内容滚动

---

### Requirement: Accessibility

The sidebar MUST meet accessibility standards and support screen readers and keyboard navigation.

#### Scenario: ARIA 属性

**Given** 侧边栏组件已渲染
**When** 检查 HTML 结构
**Then** 侧边栏容器必须有 `<nav aria-label="文档导航">`
**And** 树形结构必须有 `<ul role="tree">`
**And** 树节点必须有 `<li role="treeitem">`
**And** 文件夹节点必须有 `aria-expanded="true/false"`
**And** 当前页面必须有 `aria-current="page"`

#### Scenario: 键盘导航支持

**Given** 侧边栏已获得焦点
**When** 用户使用 Tab 键
**Then** 焦点必须在可交互元素间移动(链接、按钮)
**And** 每个焦点元素必须有可见的焦点指示器
**When** 用户在文件夹节点上按 Enter 或 Space 键
**Then** 文件夹必须切换展开/折叠状态

#### Scenario: 屏幕阅读器支持

**Given** 用户使用屏幕阅读器(如 NVDA、JAWS)
**When** 用户导航到侧边栏
**Then** 屏幕阅读器必须朗读"文档导航,树形结构"
**And** 必须能识别当前高亮的页面
**And** 必须能识别文件夹的展开/折叠状态

---

### Requirement: Performance

The sidebar implementation MUST be efficient and not significantly impact site performance.

#### Scenario: 构建时性能

**Given** 站点包含 100 篇文档
**When** 运行 `npm run build`
**Then** 构建时间增加必须小于 10%
**And** 构建必须成功完成,无错误或警告

#### Scenario: 运行时性能

**Given** 用户访问文档页面
**When** 页面加载和侧边栏渲染
**Then** 侧边栏交互响应时间必须小于 100ms
**And** 展开/折叠动画必须流畅(60fps)
**And** 额外的 JavaScript bundle 大小必须小于 10KB(gzipped)

#### Scenario: 静态生成

**Given** 侧边栏组件已实现
**When** 检查构建输出
**Then** 侧边栏 HTML 必须在构建时静态生成
**And** 不能依赖客户端 JavaScript 进行数据渲染
**And** 只有交互功能(展开/折叠)使用客户端 JavaScript

---

## MODIFIED Requirements

### Requirement: Navigation (astro-site/spec.md)

The documentation navigation MUST provide a structured navigation menu (sidebar) that reflects the documentation hierarchy, highlights the current page, and supports folder expand/collapse functionality.

#### Scenario: Documentation navigation (modified)

**Given** 用户在任意文档页面
**When** 查看页面左侧
**Then** 他们必须看到结构化的导航菜单(侧边栏)
**And** 菜单必须反映文档的目录结构
**And** 当前页面必须在菜单中高亮显示
**And** 菜单必须支持文件夹展开和折叠

---

## Quality Gates

- [ ] 所有文档页面左侧显示侧边栏导航
- [ ] 侧边栏正确显示文档目录树结构
- [ ] 当前页面在侧边栏中高亮显示
- [ ] 当前页面所属目录自动展开
- [ ] 点击侧边栏链接可正确跳转
- [ ] 移动端侧边栏可正常收起/展开
- [ ] 亮色/暗色主题下样式正常
- [ ] 构建时间增加 < 10%
- [ ] Lighthouse 性能分数保持 > 90
- [ ] 所有主流浏览器功能正常
- [ ] 键盘导航功能正常
- [ ] 屏幕阅读器可正常使用

---

## Version History

- **2026-01-29**: 初始侧边栏导航规格定义
