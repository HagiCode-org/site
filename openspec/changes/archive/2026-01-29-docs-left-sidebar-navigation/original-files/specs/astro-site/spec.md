## ADDED Requirements

### Requirement: 左侧导航栏

文档页面 MUST 在桌面端提供固定在左侧的导航栏,显示文档的层级结构。

#### Scenario: 桌面端显示左侧导航栏

**Given** 用户在宽度大于 1280px 的设备上访问文档页面
**When** 页面加载完成
**Then** 左侧 MUST 显示导航栏
**And** 导航栏宽度 MUST 为 280px
**And** 导航栏 MUST 固定在左侧(sticky 定位)
**And** 导航栏 MUST 显示所有文档的层级结构

#### Scenario: 移动端隐藏左侧导航栏

**Given** 用户在宽度小于 1280px 的设备上访问文档页面
**When** 页面加载完成
**Then** 左侧导航栏 MUST 默认隐藏
**And** 页面顶部 MUST 显示汉堡菜单按钮
**And** 点击汉堡菜单 MUST 显示抽屉式导航栏

### Requirement: 当前页面高亮

左侧导航栏 MUST 高亮显示当前正在浏览的文档页面。

#### Scenario: 高亮当前文档

**Given** 用户正在浏览 `/docs/quick-start/create-first-project`
**When** 查看左侧导航栏
**Then** "创建您的第一个项目" 导航项 MUST 被高亮显示
**And** 高亮样式 MUST 包括主题色背景
**And** 高亮样式 MUST 包括左侧指示条
**And** 高亮项文字 MUST 加粗

#### Scenario: 导航到其他页面时更新高亮

**Given** 用户在当前页面看到某个导航项被高亮
**When** 点击导航栏中的其他文档
**And** 新页面加载完成
**Then** 高亮 MUST 更新到新对应的导航项
**And** 旧的高亮样式 MUST 被移除

### Requirement: 导航树层级结构

左侧导航栏 MUST 根据 `src/content/docs/` 目录结构自动生成层级化的导航树。

#### Scenario: 显示文档层级关系

**Given** 文档目录结构为:
```
docs/
├── quick-start/
│   ├── installation.md
│   └── create-first-project.md
└── installation/
    └── docker-compose.md
```
**When** 渲染左侧导航栏
**Then** 导航树 MUST 显示为:
```
📖 快速开始
  ├─ 安装指南
  └─ 创建您的第一个项目
📦 安装
  └─ Docker Compose 部署
```
**And** 父级节点 MUST 显示分组名称
**And** 子级节点 MUST 缩进显示
**And** 层级关系 MUST 通过缩进和视觉元素清晰呈现

#### Scenario: 支持多级嵌套

**Given** 文档目录包含三级或更深嵌套
**When** 渲染左侧导航栏
**Then** 导航栏 MUST 支持至少 3 级嵌套
**And** 每一级 MUST 有适当的缩进
**And** 层级关系 MUST 清晰可辨

### Requirement: 导航排序自定义

左侧导航栏 MUST 支持通过 frontmatter 中的 `sidebar_position` 字段自定义文档排序。

#### Scenario: 使用 sidebar_position 排序

**Given** 两个文档 frontmatter 分别为:
```yaml
# doc1.md
title: "文档 A"
sidebar_position: 10
```
```yaml
# doc2.md
title: "文档 B"
sidebar_position: 5
```
**When** 渲染左侧导航栏
**Then** "文档 B" MUST 显示在 "文档 A" 之前
**And** 排序 MUST 按照 `sidebar_position` 数值升序排列

#### Scenario: 默认排序(无 sidebar_position)

**Given** 文档没有定义 `sidebar_position` 字段
**When** 渲染左侧导航栏
**Then** 文档 MUST 按照文件名或标题的字母顺序排列
**And** 排序 MUST 在同级别内保持一致

### Requirement: 响应式移动端导航

左侧导航栏 MUST 在移动端提供抽屉式的展开/收起交互。

#### Scenario: 移动端展开导航

**Given** 用户在移动设备(宽度 < 1280px)上访问文档页面
**When** 点击顶部导航栏的汉堡菜单按钮
**Then** 左侧导航栏 MUST 从左侧滑入
**And** 页面 MUST 显示半透明遮罩层
**And** 页面滚动 MUST 被锁定
**And** 汉堡菜单按钮 MUST 变为关闭按钮(X)

#### Scenario: 移动端关闭导航

**Given** 移动端导航栏处于展开状态
**When** 用户执行以下任一操作:
  - 点击遮罩层
  - 点击关闭按钮
  - 按 ESC 键
  - 点击导航项跳转
**Then** 导航栏 MUST 滑出屏幕
**And** 遮罩层 MUST 消失
**And** 页面滚动 MUST 恢复
**And** 汉堡菜单按钮 MUST 恢复为打开状态

### Requirement: 暗色主题支持

左侧导航栏 MUST 继承站点的暗色主题系统,在主题切换时保持视觉一致性。

#### Scenario: 亮色主题下的导航栏样式

**Given** 用户当前使用亮色主题
**When** 查看左侧导航栏
**Then** 导航栏背景色 MUST 匹配亮色主题
**And** 导航项文字颜色 MUST 与主题一致
**And** 悬停和高亮效果 MUST 使用亮色主题色

#### Scenario: 切换到暗色主题

**Given** 用户当前使用亮色主题
**When** 切换到暗色主题
**Then** 左侧导航栏颜色 MUST 立即更新
**And** 更新 MUST 不出现闪烁
**And** 所有导航项 MUST 保持可读性
**And** 高亮样式 MUST 适应暗色主题

### Requirement: 导航栏布局集成

左侧导航栏 MUST 正确集成到文档页面布局中,与主内容区和右侧目录协调显示。

#### Scenario: 桌面端三栏布局

**Given** 用户在桌面端(宽度 > 1280px)访问文档页面
**When** 页面渲染完成
**Then** 页面 MUST 显示为三栏布局:
  - 左侧:导航栏(280px 宽)
  - 中间:主内容区(自适应宽度)
  - 右侧:页面目录 TOC(280px 宽)
**And** 主内容区 MUST 有最大宽度限制(900px)
**And** 所有栏 MUST 垂直对齐到顶部

#### Scenario: 移动端单栏布局

**Given** 用户在移动端(宽度 < 1280px)访问文档页面
**When** 页面渲染完成
**Then** 页面 MUST 显示为单栏布局(主内容区)
**And** 左侧导航栏 MUST 隐藏
**And** 右侧目录 MUST 隐藏
**And** 导航栏 MUST 通过汉堡菜单触发显示

### Requirement: 零 JavaScript 默认特性

左侧导航栏 MUST 遵循 Astro 零 JavaScript 默认原则,导航树必须在构建时生成静态 HTML。

#### Scenario: 静态 HTML 导航

**Given** 站点执行生产构建(`npm run build`)
**When** 构建完成
**Then** 导航栏 MUST 渲染为纯静态 HTML
**And** 导航栏 MUST 不依赖客户端 JavaScript hydration
**And** 导航结构 MUST 在构建时确定
**And** 生成的 HTML MUST 包含完整的导航树

#### Scenario: 移动端交互的最小化 JavaScript

**Given** 移动端导航需要展开/收起交互
**When** 实现交互功能
**Then** JavaScript MUST 仅用于 CSS 类切换
**And** MUST 不使用大型交互框架
**And** MUST 保持 JavaScript 代码最小化(少于 100 行)

### Requirement: 类型安全

左侧导航栏组件 MUST 利用 Astro Content Collections 的类型系统确保类型安全。

#### Scenario: 组件 Props 类型定义

**Given** `Sidebar.astro` 组件接收文档数据
**When** 定义组件 Props
**Then** Props MUST 使用 TypeScript 类型定义
**And** 类型 MUST 包含 `allDocs: CollectionEntry<'docs'>[]`
**And** 类型 MUST 包含 `currentSlug?: string`
**And** 类型检查 MUST 通过 `npm run typecheck`

#### Scenario: 导航树节点类型定义

**Given** 导航栏需要处理层级结构
**When** 定义导航树节点类型
**Then** MUST 定义 `SidebarNode` 接口
**And** 接口 MUST 包含 `slug: string`
**And** 接口 MUST 包含 `title: string`
**And** 接口 MUST 包含 `children?: SidebarNode[]`
**And** 类型 MUST 在组件中被正确使用
