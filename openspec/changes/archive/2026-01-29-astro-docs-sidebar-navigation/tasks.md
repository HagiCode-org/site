# Tasks: Astro 文档站点侧边栏导航

## 实施任务清单

### 阶段 1: 数据结构和算法

#### Task 1.1: 定义 TreeNode 接口

**描述**: 在 `Sidebar.astro` 中定义 TreeNode TypeScript 接口

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 创建 `src/components/Sidebar.astro` 文件
2. 定义 `TreeNode` 接口,包含以下字段:
   - `id: string` - 唯一标识符
   - `type: 'folder' | 'file'` - 节点类型
   - `title: string` - 显示标题
   - `slug?: string` - 文档 slug (仅文件节点)
   - `children?: TreeNode[]` - 子节点 (仅文件夹节点)
   - `depth: number` - 深度层级

**验证**:
- TypeScript 类型检查通过
- 接口定义符合设计文档规范

**依赖**: 无

---

#### Task 1.2: 实现文档树构建算法

**描述**: 实现将文档列表转换为树形结构的算法

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 实现 `buildDocTree` 函数
2. 输入: `CollectionEntry<'docs'>[]` - 所有文档数据
3. 输出: `TreeNode[]` - 树形结构
4. 算法步骤:
   - 遍历所有文档的 slug
   - 提取所有唯一的文件夹路径
   - 为每个文件夹创建 TreeNode (type: 'folder')
   - 为每个文档创建 TreeNode (type: 'file')
   - 根据路径层级构建父子关系
   - 如果存在 `sidebar_position` 字段,按其排序

**验证**:
- 单元测试:给定文档列表能正确构建树结构
- 测试数据:
  - 简单单层文档
  - 多层嵌套文档
  - 空 slug (根路径)
  - 包含 `sidebar_position` 的文档

**依赖**: Task 1.1

---

### 阶段 2: 核心组件开发

#### Task 2.1: 实现 Sidebar 组件 Props 接口

**描述**: 定义 Sidebar 组件的 Props 接口

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 定义组件 Props 接口:
   ```typescript
   interface Props {
     currentSlug: string;       // 当前文档的 slug
     allDocs: CollectionEntry<'docs'>[]; // 所有文档数据
   }
   ```
2. 添加组件 Props 解构
3. 从 `astro:content` 导入 `type CollectionEntry`

**验证**:
- TypeScript 类型检查通过
- Props 接口与设计文档一致

**依赖**: Task 1.2

---

#### Task 2.2: 实现树节点递归渲染

**描述**: 实现递归渲染树节点的函数

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 创建 `SidebarNode` 子组件或内部函数
2. 实现 `renderTree` 函数,递归渲染树节点
3. 为每个节点类型(folder/file)应用不同的样式
4. 文件夹节点:
   - 显示文件夹图标(使用 SVG 或 Unicode)
   - 显示展开/折叠箭头
   - 递归渲染子节点
5. 文件节点:
   - 显示文档图标
   - 渲染链接 `<a href={...}>`
   - 根据深度添加缩进

**验证**:
- 侧边栏能正确显示多级嵌套结构
- 图标和缩进正确显示
- 链接路径正确

**依赖**: Task 2.1

---

#### Task 2.3: 实现当前页面高亮逻辑

**描述**: 实现自动识别和高亮当前页面的逻辑

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 实现 `isCurrentPage` 函数
2. 比较节点的 slug 和 `currentSlug`
3. 为当前页面节点添加 `active` class
4. 实现 `getParentPaths` 函数,获取当前页面的所有父节点路径
5. 初始化展开状态,自动展开当前页面的父节点

**验证**:
- 访问任意文档页面,对应节点在侧边栏中高亮
- 当前页面的所有父文件夹自动展开
- 其他未访问的节点不高亮

**依赖**: Task 2.2

---

### 阶段 3: 布局集成

#### Task 3.1: 修改 DocsLayout 布局结构

**描述**: 修改 `DocsLayout.astro` 以容纳侧边栏

**文件**: `src/layouts/DocsLayout.astro`

**步骤**:
1. 修改 `.docs-layout` 容器结构
2. 添加侧边栏占位区域
3. 更新布局样式:
   - 使用 `display: grid` 或 `display: flex`
   - 侧边栏宽度: 280px
   - 主内容区域: `flex: 1`,最大宽度 800px
   - gap: 2rem
4. 导入 Sidebar 组件(暂时注释掉,等组件完成后再启用)

**验证**:
- 布局结构符合设计文档
- TypeScript 类型检查通过
- 不影响现有文档页面显示

**依赖**: Task 2.3

---

#### Task 3.2: 集成 Sidebar 组件到 DocsLayout

**描述**: 在 DocsLayout 中导入和使用 Sidebar 组件

**文件**: `src/layouts/DocsLayout.astro`

**步骤**:
1. 在 `DocsLayout.astro` 中导入 Sidebar 组件
2. 从 `[...slug].astro` 传递必要的 props:
   - `currentSlug`: 当前文档的 slug
   - `allDocs`: 所有文档数据
3. 由于 Astro 的组件通信限制,可能需要:
   - 在 `[...slug].astro` 中获取所有文档数据
   - 通过 props 传递给 DocsLayout
   - DocsLayout 再传递给 Sidebar

**验证**:
- 所有文档页面左侧显示侧边栏
- 侧边栏正确显示文档树
- 页面无报错

**依赖**: Task 3.1, 需要先修改 `[...slug].astro`

---

#### Task 3.3: 修改 [...slug].astro 传递文档数据

**描述**: 修改动态路由页面以传递文档数据给 Sidebar

**文件**: `src/pages/docs/[...slug].astro`

**步骤**:
1. 在 `getStaticPaths` 中获取所有文档数据(已存在)
2. 修改 props 结构,包含所有文档数据
3. 将 `allDocs` 数据传递给 `DocsLayout`
4. 确保文件夹页面和单文档页面都能正确传递数据

**验证**:
- 所有文档页面能正常渲染
- Sidebar 能接收到完整的文档数据
- 不影响现有的目录索引功能

**依赖**: Task 3.2

---

### 阶段 4: 样式开发

#### Task 4.1: 实现侧边栏基础样式

**描述**: 添加侧边栏的基础 CSS 样式

**文件**: `src/components/Sidebar.astro` (scoped styles)

**步骤**:
1. 在 `Sidebar.astro` 中添加 `<style>` 标签
2. 实现以下样式:
   - `.sidebar` 容器样式
   - `.sidebar-tree` 树容器样式
   - `.sidebar-node` 节点基础样式
   - `.sidebar-node.folder` 文件夹样式
   - `.sidebar-node.file` 文件样式
3. 使用现有的 CSS 变量:
   - `var(--color-background)` - 背景色
   - `var(--color-border)` - 边框色
   - `var(--color-text)` - 文字色
   - `var(--ifm-color-primary)` - 主色调

**验证**:
- 侧边栏样式符合设计文档
- 亮色主题下显示正常
- 布局不出现溢出或错位

**依赖**: Task 3.3

---

#### Task 4.2: 实现交互状态样式

**描述**: 添加悬停、高亮等交互状态样式

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 实现悬停状态:
   - `.sidebar-node:hover` 背景色变化
   - 过渡动画 `transition: background-color 0.2s`
2. 实现当前页面高亮:
   - `.sidebar-node.active` 样式
   - 左侧边框指示器
   - 字体加粗
3. 实现展开/折叠图标样式:
   - 使用 SVG 箭头图标
   - 旋转动画 `transform: rotate(90deg)`

**验证**:
- 鼠标悬停时节点背景色变化
- 当前页面节点有明显高亮
- 展开/折叠图标显示和旋转正常

**依赖**: Task 4.1

---

#### Task 4.3: 实现暗色主题适配

**描述**: 确保侧边栏在暗色主题下正常显示

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 测试暗色主题下的样式
2. 调整颜色对比度
3. 确保 CSS 变量正确引用主题色
4. 验证所有交互状态在暗色主题下正常

**验证**:
- 切换到暗色主题,侧边栏显示正常
- 所有颜色对比度符合可访问性标准
- 高亮和悬停效果在暗色主题下可见

**依赖**: Task 4.2

---

### 阶段 5: 交互功能

#### Task 5.1: 实现展开/折叠功能

**描述**: 实现文件夹节点的展开和折叠交互

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 选择交互实现方案:
   - 方案 A: 使用 Alpine.js (推荐,轻量级)
   - 方案 B: 使用 React (已有集成)
   - 方案 C: 使用原生 JavaScript
2. 实现状态管理:
   - 维护 `expandedNodes` 集合
   - 初始化时自动展开当前页面的父节点
3. 实现切换函数 `toggleNode(nodeId)`
4. 为文件夹节点添加点击事件处理
5. 根据展开状态显示/隐藏子节点

**验证**:
- 点击文件夹箭头能展开/折叠子节点
- 页面加载时当前文档路径自动展开
- 展开/折叠状态变化有平滑动画

**依赖**: Task 4.3

---

#### Task 5.2: 优化节点图标和视觉反馈

**描述**: 添加文件夹和文档的图标,优化视觉效果

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 设计或选择图标:
   - 文件夹图标: 📁 或 SVG
   - 文档图标: 📄 或 SVG
   - 展开/折叠箭头: ▶ / ▼
2. 为不同节点类型添加对应图标
3. 优化图标大小和间距
4. 确保图标在不同主题下清晰可见

**验证**:
- 所有节点都有对应的图标
- 图标大小和位置协调
- 图标在亮色和暗色主题下都清晰

**依赖**: Task 5.1

---

### 阶段 6: 响应式和移动端

#### Task 6.1: 实现平板端响应式布局

**描述**: 优化平板设备(768px - 996px)上的布局

**文件**: `src/layouts/DocsLayout.astro`, `src/components/Sidebar.astro`

**步骤**:
1. 添加媒体查询 `@media (max-width: 996px)`
2. 调整布局:
   - 侧边栏宽度: 200px (缩小)
   - 或改为水平布局(侧边栏在顶部)
3. 调整间距和字体大小
4. 测试不同平板屏幕尺寸

**验证**:
- 在 iPad (768px - 1024px) 上布局正常
- 侧边栏和主内容不重叠
- 内容可读性良好

**依赖**: Task 5.2

---

#### Task 6.2: 实现移动端抽屉式侧边栏

**描述**: 为移动设备(< 768px)实现抽屉式侧边栏

**文件**: `src/layouts/DocsLayout.astro`, `src/components/Sidebar.astro`, `src/components/Navbar.astro`

**步骤**:
1. 在 Navbar 中添加汉堡菜单按钮
2. 添加移动端侧边栏样式:
   - `position: fixed; left: 0; top: 0`
   - `width: 280px; height: 100vh`
   - `transform: translateX(-100%)` (默认隐藏)
   - `transition: transform 0.3s ease`
3. 实现打开/关闭逻辑:
   - 点击汉堡菜单:添加 `open` class
   - 点击遮罩层或关闭按钮:移除 `open` class
4. 添加遮罩层(overlay)
5. 确保侧边栏在所有内容之上(`z-index: 1000`)

**验证**:
- 移动端默认不显示侧边栏
- 点击汉堡菜单,侧边栏从左侧滑入
- 点击遮罩层或关闭按钮,侧边栏滑出
- 动画流畅,无卡顿

**依赖**: Task 6.1

---

#### Task 6.3: 优化移动端交互体验

**描述**: 优化移动端的交互细节

**文件**: `src/components/Sidebar.astro`, `src/layouts/DocsLayout.astro`

**步骤**:
1. 优化触摸目标大小(至少 44x44px)
2. 添加页面滚动锁定(侧边栏打开时)
3. 优化点击链接后自动关闭侧边栏
4. 测试在不同移动设备上的表现

**验证**:
- 所有可点击元素触摸区域足够大
- 打开侧边栏时背景页面不滚动
- 点击文档链接后侧边栏自动关闭
- 在 iOS 和 Android 设备上测试通过

**依赖**: Task 6.2

---

### 阶段 7: 性能优化

#### Task 7.1: 优化侧边栏数据生成

**描述**: 优化文档树构建性能,避免重复计算

**文件**: `src/pages/docs/[...slug].astro`

**步骤**:
1. 在 `getStaticPaths` 中一次性构建所有文档树
2. 将构建好的树结构作为 prop 传递给 Sidebar
3. 避免在每个页面重复构建树
4. 考虑添加缓存机制(如果需要)

**验证**:
- 构建时间增加 < 10%
- 页面切换流畅,无卡顿

**依赖**: Task 6.3

---

#### Task 7.2: 优化 JavaScript bundle 大小

**描述**: 最小化侧边栏交互功能的 JavaScript bundle

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 如果使用 React,考虑迁移到 Alpine.js(更轻量)
2. 检查打包后的 bundle 大小
3. 移除未使用的代码
4. 使用代码分割(如果需要)

**验证**:
- 额外的 JavaScript bundle < 10KB (gzipped)
- 页面加载速度无明显影响

**依赖**: Task 7.1

---

### 阶段 8: 可访问性

#### Task 8.1: 添加 ARIA 属性

**描述**: 为侧边栏添加完整的 ARIA 属性,支持屏幕阅读器

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 添加语义化 HTML:
   - `<nav aria-label="文档导航">`
   - `<ul role="tree">`
   - `<li role="treeitem" aria-expanded="true/false">`
2. 为当前页面添加 `aria-current="page"`
3. 为图标添加 `aria-hidden="true"`
4. 为按钮添加描述性的 `aria-label`

**验证**:
- 使用屏幕阅读器测试(NVDA, JAWS)
- 树形结构能正确朗读
- 当前页面位置能正确识别

**依赖**: Task 7.2

---

#### Task 8.2: 实现键盘导航

**描述**: 实现完整的键盘导航支持

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 实现键盘事件处理:
   - Tab: 在可聚焦元素间移动
   - Enter/Space: 展开/折叠文件夹
   - Arrow keys: 在树节点间导航(可选,高级功能)
   - Home/End: 跳转到首尾节点(可选)
2. 添加可见的焦点指示器
3. 确保焦点顺序符合逻辑

**验证**:
- 使用键盘能完整操作侧边栏
- 焦点指示器清晰可见
- 焦点顺序符合预期

**依赖**: Task 8.1

---

### 阶段 9: 测试和修复

#### Task 9.1: 跨浏览器测试

**描述**: 在所有主流浏览器上测试侧边栏功能

**步骤**:
1. 测试浏览器:
   - Chrome (最新版)
   - Firefox (最新版)
   - Safari (最新版)
   - Edge (最新版)
2. 测试内容:
   - 布局显示
   - 交互功能
   - 主题切换
   - 响应式布局
3. 记录并修复发现的问题

**验证**:
- 所有主流浏览器功能正常
- 无浏览器兼容性问题

**依赖**: Task 8.2

---

#### Task 9.2: 性能和构建测试

**描述**: 测试构建性能和运行时性能

**步骤**:
1. 运行 `npm run build`,检查构建时间
2. 检查构建后的 `dist/` 目录大小
3. 运行 Lighthouse 性能审计
4. 测试页面加载速度
5. 测试交互响应速度

**验证**:
- 构建时间增加 < 10%
- Lighthouse 性能分数保持 > 90
- 交互响应时间 < 100ms

**依赖**: Task 9.1

---

#### Task 9.3: 修复发现的问题

**描述**: 修复测试阶段发现的所有问题

**步骤**:
1. 汇总所有测试发现的问题
2. 按优先级排序(高/中/低)
3. 逐个修复问题
4. 回归测试,确保修复不引入新问题

**验证**:
- 所有高优先级问题已修复
- 中低优先级问题已评估或修复
- 回归测试通过

**依赖**: Task 9.2

---

### 阶段 10: 文档和发布准备

#### Task 10.1: 更新项目文档

**描述**: 更新相关文档以反映新增的侧边栏功能

**文件**: `openspec/project.md`, README.md

**步骤**:
1. 在 `openspec/project.md` 中添加侧边栏组件说明
2. 更新导航相关的内容结构说明
3. 在 README.md 中添加侧边栏功能介绍(如果需要)
4. 更新组件架构图(如果需要)

**验证**:
- 文档准确反映实际实现
- 无过时或错误信息

**依赖**: Task 9.3

---

#### Task 10.2: 创建使用示例

**描述**: 为侧边栏组件创建使用示例和注释

**文件**: `src/components/Sidebar.astro`

**步骤**:
1. 在组件文件中添加详细注释
2. 说明 Props 接口和用法
3. 添加数据结构示例
4. 说明定制化选项

**验证**:
- 组件有清晰的注释和文档
- 其他开发者能理解组件用法

**依赖**: Task 10.1

---

#### Task 10.3: 最终验证和发布

**描述**: 最终验证所有功能,准备合并代码

**步骤**:
1. 完整的功能测试清单验证:
   - [ ] 所有文档页面侧边栏正常显示
   - [ ] 当前页面正确高亮
   - [ ] 文件夹展开/折叠正常工作
   - [ ] 移动端抽屉式侧边栏正常工作
   - [ ] 亮色主题下样式正常
   - [ ] 暗色主题下样式正常
   - [ ] 不同屏幕尺寸下布局正常
   - [ ] 键盘导航功能正常
   - [ ] 屏幕阅读器可正常使用
2. 运行 `npm run build`,确保无构建错误
3. 运行 `npm run typecheck`,确保无类型错误
4. 检查所有待办事项已完成
5. 创建 PR 或合并到主分支

**验证**:
- 所有测试项通过
- 构建和类型检查无错误
- 代码已准备好合并

**依赖**: Task 10.2

---

## 并行化机会

以下任务可以并行开发:
- Task 1.1, Task 1.2: 数据结构和算法(与后续任务串行)
- Task 4.x 样式任务可以与 Task 5.x 交互任务部分并行
- Task 8.x 可访问性任务可以在功能完成后并行进行

## 关键路径

关键路径(必须串行执行):
1. Task 1.1 → Task 1.2 → Task 2.1 → Task 2.2 → Task 2.3
2. Task 3.1 → Task 3.2 → Task 3.3
3. Task 4.1 → Task 4.2 → Task 4.3 → Task 5.1 → Task 5.2
4. Task 6.1 → Task 6.2 → Task 6.3
5. Task 7.1 → Task 7.2
6. Task 9.1 → Task 9.2 → Task 9.3 → Task 10.1 → Task 10.2 → Task 10.3

## 总工作量估算

- 数据结构和算法: 0.5 天
- 核心组件开发: 1 天
- 布局集成: 0.5 天
- 样式开发: 0.5 天
- 交互功能: 0.5 天
- 响应式和移动端: 0.5 天
- 性能优化: 0.5 天
- 可访问性: 0.5 天
- 测试和修复: 0.5 天
- 文档和发布: 0.5 天

**总计**: 约 3 天

## 依赖关系总结

```
Task 1.1 (定义接口)
  ↓
Task 1.2 (构建算法)
  ↓
Task 2.1 (Props 接口)
  ↓
Task 2.2 (渲染逻辑) → Task 4.1 (基础样式) → Task 4.2 (交互样式) → Task 4.3 (主题适配)
  ↓
Task 2.3 (高亮逻辑) → Task 5.1 (展开折叠) → Task 5.2 (图标优化)
  ↓
Task 3.1 (布局结构) → Task 3.2 (组件集成) → Task 3.3 (路由修改)
  ↓
Task 6.1 (平板响应式) → Task 6.2 (移动端) → Task 6.3 (移动端优化)
  ↓
Task 7.1 (数据优化) → Task 7.2 (Bundle 优化)
  ↓
Task 8.1 (ARIA) → Task 8.2 (键盘导航)
  ↓
Task 9.1 (浏览器测试) → Task 9.2 (性能测试) → Task 9.3 (修复问题)
  ↓
Task 10.1 (更新文档) → Task 10.2 (使用示例) → Task 10.3 (最终验证)
```
