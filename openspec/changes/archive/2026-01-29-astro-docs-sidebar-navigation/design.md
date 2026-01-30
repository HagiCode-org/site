# Design: Astro 文档站点侧边栏导航

## 架构设计

### 组件层次结构

```
DocsLayout.astro (布局容器)
├── Navbar.astro (顶部导航栏,已存在)
├── .docs-layout (文档布局容器)
│   ├── Sidebar.astro (新增,左侧边栏)
│   └── .docs-main (主内容区域)
│       └── <slot /> (文档内容)
└── Footer.astro (页脚,已存在)
```

### 数据流

```
Astro Content Collections (docs)
    ↓
getCollection('docs') 获取所有文档
    ↓
构建树形结构 (TreeNode[])
    ↓
Sidebar.astro 渲染导航树
    ↓
根据当前 URL 高亮和展开节点
```

## 数据结构设计

### TreeNode 接口

```typescript
interface TreeNode {
  id: string;              // 唯一标识符
  type: 'folder' | 'file'; // 节点类型
  title: string;           // 显示标题
  slug?: string;           // 文档 slug (仅文件节点)
  children?: TreeNode[];   // 子节点 (仅文件夹节点)
  depth: number;           // 深度层级
}
```

### 文档树构建算法

**输入**: 所有文档的 `CollectionEntry<'docs'>[]`
**输出**: 树形结构的 `TreeNode[]`

**算法步骤**:

1. 遍历所有文档,提取所有唯一的文件夹路径
2. 为每个文件夹创建 `TreeNode` (type: 'folder')
3. 为每个文档创建 `TreeNode` (type: 'file')
4. 根据路径层级构建父子关系
5. 按 `sidebar_position` 排序(如果存在)

**示例**:

```
文档列表:
- quick-start/installation.md
- quick-start/create-first-project.md
- session-management/session-list.md
- contributor-guide/mermaid-guide.md

树形结构:
├── Quick Start (folder)
│   ├── Installation (file)
│   └── Create First Project (file)
├── Session Management (folder)
│   └── Session List (file)
└── Contributor Guide (folder)
    └── Mermaid Guide (file)
```

## UI/UX 设计

### 桌面端布局

```
+------------------------------------------+
|  Navbar (固定在顶部)                       |
+----------------------+-------------------+
|                      |                   |
|  Sidebar (280px)     |  Main Content     |
|  - 固定宽度           |  - 自适应宽度      |
|  - 可滚动             |  - 最大宽度 800px  |
|  - 独立滚动区域        |                   |
|                      |                   |
+----------------------+-------------------+
|  Footer                                      |
+------------------------------------------+
```

**布局特性**:
- 侧边栏宽度: 280px (可配置)
- 侧边栏最大高度: calc(100vh - navbar_height - footer_height)
- 侧边栏 overflow-y: auto (独立滚动)
- 主内容区域: flex: 1,最大宽度 800px

### 移动端布局

```
+------------------------------------------+
|  Navbar                                   |
|  [☰] Hagicode          [主题切换]         |
+------------------------------------------+
|  Main Content (全屏宽度)                   |
|                                            |
+------------------------------------------+
|  Footer                                    |
+------------------------------------------+

点击 [☰] 后:
+------------------------------------------+
|  [×] Close                                |
+------------------------------------------+
|  Sidebar (全屏抽屉)                        |
|  - 从左侧滑入                               |
|  - 覆盖主内容                               |
+------------------------------------------+
```

**交互特性**:
- 侧边栏默认隐藏
- 点击汉堡菜单从左侧滑入
- 点击遮罩层或关闭按钮隐藏
- 使用 CSS transform 实现滑动动画

### 视觉设计

#### 侧边栏样式

```css
/* 容器 */
.sidebar {
  width: 280px;
  background-color: var(--color-background);
  border-right: 1px solid var(--color-border);
}

/* 树节点 */
.sidebar-node {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* 悬停状态 */
.sidebar-node:hover {
  background-color: var(--ifm-color-primary-light);
  opacity: 0.1;
}

/* 当前页面高亮 */
.sidebar-node.active {
  background-color: var(--ifm-color-primary-light);
  color: var(--ifm-color-primary-dark);
  border-left: 3px solid var(--ifm-color-primary);
  font-weight: 600;
}

/* 文件夹节点 */
.sidebar-node.folder {
  font-weight: 600;
}

/* 文件节点 */
.sidebar-node.file {
  padding-left: 1.5rem; /* 缩进 */
}

/* 展开/折叠图标 */
.sidebar-node .toggle-icon {
  margin-right: 0.5rem;
  transition: transform 0.2s;
}

.sidebar-node.expanded .toggle-icon {
  transform: rotate(90deg);
}
```

#### 响应式断点

```css
/* 桌面端 */
@media (min-width: 997px) {
  .sidebar {
    display: block;
    position: sticky;
    top: navbar_height;
  }
}

/* 平板端 */
@media (max-width: 996px) {
  .docs-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
}

/* 移动端 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
```

## 组件设计

### Sidebar.astro 组件接口

```typescript
interface Props {
  currentSlug: string;       // 当前文档的 slug
  allDocs: CollectionEntry<'docs'>[]; // 所有文档数据
}

// 示例用法
<Sidebar
  currentSlug={currentDoc.slug}
  allDocs={allDocs}
/>
```

### 组件职责

1. **数据获取**: 接收所有文档数据作为 props
2. **树构建**: 将文档列表转换为树形结构
3. **当前页面识别**: 根据 `currentSlug` 确定当前页面位置
4. **节点渲染**: 递归渲染树节点
5. **交互处理**: 处理展开/折叠和链接跳转

### 组件状态管理

```typescript
// 客户端状态 (React 或 Alpine.js)
const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

// 初始化:自动展开当前文档的父节点
useEffect(() => {
  const parentPaths = getParentPaths(currentSlug);
  setExpandedNodes(new Set(parentPaths));
}, [currentSlug]);

// 切换节点展开状态
function toggleNode(nodeId: string) {
  const newExpanded = new Set(expandedNodes);
  if (newExpanded.has(nodeId)) {
    newExpanded.delete(nodeId);
  } else {
    newExpanded.add(nodeId);
  }
  setExpandedNodes(newExpanded);
}
```

## 实现策略

### 阶段 1: 核心组件 (桌面端)

1. 创建 `Sidebar.astro` 组件
2. 实现文档树构建算法
3. 实现树节点递归渲染
4. 实现当前页面高亮
5. 修改 `DocsLayout.astro` 集成侧边栏
6. 桌面端样式开发

### 阶段 2: 交互增强

1. 实现展开/折叠功能
2. 添加展开/折叠动画
3. 优化树节点图标(文件夹/文档)
4. 添加悬停效果

### 阶段 3: 响应式和移动端

1. 添加响应式布局
2. 移动端抽屉式侧边栏
3. 汉堡菜单按钮集成
4. 移动端交互优化

### 阶段 4: 优化和测试

1. 性能优化(构建时数据生成)
2. 主题适配测试
3. 跨浏览器测试
4. 可访问性测试

## 性能考虑

### 构建时优化

- **数据生成**: 在 `[...slug].astro` 中一次性获取所有文档数据
- **树构建**: 在构建时完成,避免运行时计算
- **静态生成**: 侧边栏 HTML 静态生成,减少客户端 JavaScript

### 运行时优化

- **状态管理**: 使用轻量级状态管理(Alpine.js 或 React)
- **事件委托**: 使用事件委托处理节点点击
- **CSS 优化**: 使用 CSS 变量和 transform 优化动画性能

### 性能指标

- 侧边栏构建时间 < 50ms
- 交互响应时间 < 100ms
- 额外的 JavaScript bundle < 10KB (gzipped)

## 可访问性设计

### ARIA 属性

```html
<nav aria-label="文档导航">
  <ul role="tree">
    <li role="treeitem" aria-expanded="true">
      <button aria-label="切换文件夹">...</button>
      <a href="/docs/quick-start" aria-current="page">...</a>
    </li>
  </ul>
</nav>
```

### 键盘导航

- Tab: 焦点在树节点间移动
- Enter/Space: 展开/折叠文件夹
- Arrow keys: 在树节点间导航
- Home/End: 跳转到第一个/最后一个节点

### 屏幕阅读器支持

- 使用语义化 HTML (`<nav>`, `<ul>`, `<li>`)
- 提供 `aria-label` 和 `aria-current` 属性
- 图标使用 `aria-hidden="true"`

## 兼容性设计

### VITE_SITE_BASE 支持

```typescript
// 处理站点基础路径
function getDocPath(slug: string): string {
  const basePath = import.meta.env.PUBLIC_SITE_BASE || '/';
  return `${basePath}docs/${slug}`;
}
```

### 现有功能兼容

- 目录路由:侧边栏不影响现有的 `[...slug].astro` 路由逻辑
- 目录索引页面:侧边栏与 `DirectoryIndex.astro` 组件共存
- 主题系统:使用现有的 CSS 变量,无需修改主题逻辑

## 测试策略

### 单元测试

- 文档树构建算法测试
- TreeNode 数据结构验证
- 当前页面识别逻辑测试

### 集成测试

- 侧边栏与 DocsLayout 集成测试
- 路由跳转测试
- 多语言路径测试(未来扩展)

### 视觉回归测试

- 桌面端布局测试
- 移动端布局测试
- 亮色/暗色主题测试

### 手动测试清单

- [ ] 所有文档页面侧边栏正常显示
- [ ] 当前页面正确高亮
- [ ] 文件夹展开/折叠正常工作
- [ ] 移动端抽屉式侧边栏正常工作
- [ ] 亮色主题下样式正常
- [ ] 暗色主题下样式正常
- [ ] 不同屏幕尺寸下布局正常
- [ ] 键盘导航功能正常
- [ ] 屏幕阅读器可正常使用

## 风险缓解

### 风险 1: 移动端实现复杂度

**缓解**:
- 优先实现桌面端
- 使用现有的响应式断点
- 参考主流文档站的移动端实现

### 风险 2: 性能影响

**缓解**:
- 构建时生成树结构
- 避免运行时复杂数据处理
- 使用轻量级交互库(Alpine.js)

### 风险 3: 主题适配问题

**缓解**:
- 使用现有的 CSS 变量系统
- 在两种主题下充分测试
- 避免硬编码颜色值

## 参考资料

- Astro 组件文档: https://docs.astro.build/en/core-concepts/astro-components/
- 响应式设计最佳实践: https://web.dev/responsive-web-design/
- WAI-ARIA 树形视图指南: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- Docusaurus 侧边栏实现(参考): https://docusaurus.io/docs/sidebar
