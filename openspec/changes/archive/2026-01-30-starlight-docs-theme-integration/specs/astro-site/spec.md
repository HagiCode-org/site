# astro-site Specification Delta

## ADDED Requirements

### Requirement: Starlight 文档主题集成

文档站点 MUST 使用 **@astrojs/starlight** 作为文档主题系统,以提供专业级的文档功能和用户体验。

#### Scenario: Starlight 集成初始化

**Given** Astro 配置文件已正确设置
**When** 我运行 `npm install` 和 `npm run dev`
**Then** Starlight 主题 MUST 成功加载
**And** 文档页面 MUST 使用 Starlight 布局渲染
**And** 开发服务器 MUST 启动无错误

#### Scenario: 文档路由自动生成

**Given** Starlight 集成已配置
**When** 我访问 `/docs/*` 路径
**Then** Starlight MUST 自动从 `src/content/docs/` 生成文档页面
**And** 每个文档页面 MUST 使用 Starlight 的默认布局
**And** URL 路径 MUST 与文档文件结构对应

#### Scenario: Starlight 组件可用性

**Given** 文档内容使用 MDX 格式
**When** 我在内容中使用 Starlight 组件(如 `<Tabs>`, `<Card>`, `<Steps>`)
**Then** 这些组件 MUST 正确渲染
**And** 组件样式 MUST 符合 Starlight 主题设计
**And** 组件交互功能 MUST 正常工作

### Requirement: Starlight 侧边栏导航

文档站点 MUST 使用 Starlight 的侧边栏系统,提供清晰的结构化导航。

#### Scenario: 自动生成侧边栏

**Given** Starlight 配置中启用了 `autogenerate` 选项
**When** 文档文件添加到指定目录
**Then** 侧边栏 MUST 自动包含新文档的链接
**And** 链接顺序 MUST 按照文件名或 frontmatter 排序
**And** 无需手动更新配置

#### Scenario: 手动配置侧边栏

**Given** Starlight 配置中定义了侧边栏结构
**When** 我访问文档页面
**Then** 左侧 MUST 显示配置的导航菜单
**And** 当前页面 MUST 在侧边栏中高亮显示
**And** 可折叠的分组 MUST 支持展开/折叠

#### Scenario: 侧边栏标签自定义

**Given** 文档 frontmatter 包含 `sidebarLabel` 字段
**When** 该文档在侧边栏中显示
**Then** MUST 使用 `sidebarLabel` 的值作为显示文本
**And** 如果未指定, MUST 使用文档的 `title` 字段

### Requirement: Starlight 搜索功能

文档站点 MUST 提供搜索功能,帮助用户快速找到相关文档。

#### Scenario: 搜索框显示

**Given** Starlight 搜索功能已启用
**When** 我访问任何文档页面
**Then** 页面 MUST 显示搜索框(通常在右上角)
**And** 搜索框 MUST 有清晰的占位符文本
**And** 搜索框 MUST 支持键盘快捷键(如 `/` 或 `Ctrl+K`)

#### Scenario: 搜索结果准确性

**Given** 搜索功能已启用
**When** 我输入搜索关键词并提交
**Then** 搜索结果 MUST 包含匹配的文档
**And** 结果 MUST 按相关性排序
**And** 搜索关键词 MUST 在结果中高亮显示

### Requirement: Starlight 主题系统

文档站点 MUST 使用 Starlight 的主题系统,支持深色和浅色模式。

#### Scenario: 主题切换按钮

**Given** 文档页面使用 Starlight 主题
**When** 我点击主题切换按钮
**Then** 页面 MUST 在深色和浅色模式间切换
**And** 主题偏好 MUST 保存到 localStorage
**And** 主题切换 MUST 有平滑的过渡动画

#### Scenario: 系统主题偏好检测

**Given** 用户首次访问文档站点
**When** 用户未设置主题偏好
**Then** Starlight MUST 检测操作系统的主题偏好
**And** MUST 自动应用对应的主题(深色或浅色)

### Requirement: Starlight SEO 优化

文档站点 MUST 自动生成 SEO 元数据,提升搜索引擎可见性。

#### Scenario: 页面元数据生成

**Given** 文档 frontmatter 包含 `title` 和 `description`
**When** 页面渲染时
**Then** HTML `<head>` MUST 包含对应的 `<title>` 标签
**And** MUST 包含 `<meta name="description">` 标签
**And** MUST 包含 Open Graph 标签用于社交分享

#### Scenario: Sitemap 生成

**Given** Starlight 集成已配置
**When** 站点构建完成
**Then** MUST 生成 `sitemap-index.xml` 文件
**And** sitemap MUST 包含所有文档页面
**And** sitemap MUST 包含所有博客页面(如配置)

#### Scenario: 结构化数据

**Given** 文档页面使用 Starlight 布局
**When** 页面渲染时
**Then** HTML MUST 包含 Schema.org 结构化数据
**And** 结构化数据 MUST 包含面包屑导航信息
**And** 结构化数据 MUST 符合搜索引擎标准

### Requirement: Starlight 无障碍访问

文档站点 MUST 符合 WCAG 2.1 AA 级无障碍访问标准。

#### Scenario: 键盘导航支持

**Given** 用户使用键盘导航
**When** 我使用 `Tab` 键在页面中移动
**Then** 所有交互元素 MUST 可获得焦点
**And** 焦点顺序 MUST 符合逻辑顺序
**And** MUST 有清晰的焦点指示器

#### Scenario: 屏幕阅读器支持

**Given** 用户使用屏幕阅读器
**When** 我访问文档页面
**Then** 所有链接和按钮 MUST 有描述性的 ARIA 标签
**And** 页面 MUST 使用语义化的 HTML 结构
**And** MUST 正确使用 heading 层级(h1, h2, h3)

#### Scenario: 跳过导航链接

**Given** 用户使用键盘导航
**When** 我按 `Tab` 键页面加载时
**Then** MUST 提供"跳到内容"链接
**And** 该链接 MUST 允许跳过导航,直接到主内容
**And** 该链接 MUST 在获得焦点时可见

### Requirement: Starlight 响应式设计

文档站点 MUST 在各种设备和屏幕尺寸上正常显示和功能。

#### Scenario: 移动端布局

**Given** 用户使用移动设备(宽度 < 768px)
**When** 我访问文档页面
**Then** 侧边栏 MUST 默认隐藏
**And** MUST 提供汉堡菜单按钮打开侧边栏
**And** 内容宽度 MUST 适配屏幕宽度

#### Scenario: 平板和桌面布局

**Given** 用户使用平板(768px - 1024px)或桌面(> 1024px)
**When** 我访问文档页面
**Then** 侧边栏 MUST 默认显示在左侧
**And** 内容和侧边栏 MUST 并排显示
**And** 布局 MUST 充分利用可用空间

#### Scenario: 触摸交互优化

**Given** 用户使用触摸设备
**When** 我点击或滑动交互元素
**Then** 交互元素 MUST 有足够大的触摸目标(至少 44x44px)
**And** MUST 支持滑动手势(如侧边栏开关)
**And** 交互响应 MUST 及时,无延迟

## MODIFIED Requirements

### Requirement: Content Collections

文档站点 MUST 使用 Astro Content Collections 进行类型安全的内容管理,并且文档集合 MUST 兼容 Starlight 的 frontmatter 要求。

**Change**: 原 "Astro Core Configuration" 需求已扩展,以包含 Starlight frontmatter 字段支持。

#### Scenario: Starlight frontmatter 兼容性

**Given** 文档使用 Content Collections 定义
**When** 我编写文档 frontmatter
**Then** schema MUST 包含 Starlight 必需字段(`title`, `description`)
**And** schema MAY 包含 Starlight 可选字段(`sidebar`, `sidebarLabel`, `head`)
**And** TypeScript 类型检查 MUST 验证这些字段

### Requirement: Navigation

文档站点 MUST 使用 Starlight 的导航系统为文档内容提供清晰一致的导航。博客内容 MAY 使用自定义导航。

**Change**: 原 "Navigation" 需求已修改,文档导航使用 Starlight 系统,博客导航保持自定义。

#### Scenario: 文档导航使用 Starlight

**Given** 用户在文档页面
**When** 他们查看页面左侧
**Then** 他们 MUST 看到 Starlight 生成的侧边栏导航
**And** 当前页面 MUST 在侧边栏中高亮
**And** 侧边栏 MUST 支持展开和折叠分组

#### Scenario: 面包屑导航

**Given** 用户在深层文档页面
**When** 他们查看页面顶部
**Then** 他们 MUST 看到面包屑导航
**And** 面包屑 MUST 显示从首页到当前页面的路径
**And** 面包屑链接 MUST 可点击

### Requirement: Dark Mode Theme Support

站点 MUST 使用 Starlight 的主题系统支持浅色和深色主题。

**Change**: 原 "Dark Mode Theme Support" 需求已修改,使用 Starlight 内置主题系统替代自定义实现。

#### Scenario: Starlight 主题切换

**Given** 用户在文档页面
**When** 他们点击 Starlight 的主题切换按钮
**Then** 页面 MUST 在浅色和深色主题间切换
**And** Starlight MUST 处理主题切换逻辑
**And** 主题偏好 MUST 持久化保存

## REMOVED Requirements

### Requirement: 自定义文档布局组件

**Reason**: Starlight 提供了完整的文档布局系统,不再需要自定义的 `DocsLayout.astro` 组件。

#### Scenario: 文档使用 Starlight 布局

**Given** 文档路由被访问
**When** 页面渲染
**Then** MUST 使用 Starlight 的默认布局
**And** 不再使用 `src/layouts/DocsLayout.astro`

### Requirement: 自定义导航栏组件

**Reason**: Starlight 提供了内置的 Header 组件,不再需要自定义的 `Navbar.astro` 组件。

#### Scenario: 导航使用 Starlight Header

**Given** 用户在文档页面
**When** 他们查看页面顶部
**Then** MUST 看到 Starlight 生成的 Header
**And** Header MUST 包含站点标题、导航链接和主题切换按钮
**And** 不再使用 `src/components/Navbar.astro`

### Requirement: 自定义侧边栏组件

**Reason**: Starlight 提供了智能侧边栏系统,不再需要自定义的 `Sidebar.astro` 组件。

#### Scenario: 侧边栏使用 Starlight Sidebar

**Given** 用户在文档页面
**When** 他们查看页面左侧
**Then** MUST 看到 Starlight 生成的侧边栏
**And** 侧边栏 MUST 基于配置自动生成
**And** 不再使用 `src/components/Sidebar.astro`

### Requirement: 自定义页脚组件

**Reason**: Starlight 提供了内置的 Footer 组件,不再需要自定义的 `Footer.astro` 组件(针对文档页面)。

#### Scenario: 页脚使用 Starlight Footer

**Given** 用户滚动到文档页面底部
**When** 他们查看页脚
**Then** MUST 看到 Starlight 生成的 Footer
**And** Footer MAY 包含版权信息、链接等
**And** 不再使用 `src/components/Footer.astro`(文档页面)

### Requirement: 自定义主题切换组件

**Reason**: Starlight 提供了内置的主题切换功能,不再需要自定义的 `ThemeButton.tsx` 组件。

#### Scenario: 主题切换使用 Starlight 功能

**Given** 用户在文档页面
**When** 他们想要切换主题
**Then** MUST 使用 Starlight 的主题切换按钮
**And** Starlight MUST 处理所有主题逻辑
**And** 不再使用 `src/components/ThemeButton.tsx`

### Requirement: 自定义目录组件

**Reason**: Starlight 提供了内置的 Table of Contents 功能,不再需要自定义的 `TableOfContents` 组件。

#### Scenario: 目录使用 Starlight TOC

**Given** 用户在文档页面
**When** 文档有多个标题
**Then** Starlight MUST 在右侧自动生成目录
**And** 目录 MUST 列出所有主要标题
**And** 不再使用 `src/components/TableOfContents.*`

### Requirement: 自定义 Tabs 组件

**Reason**: Starlight 提供了内置的 Tabs 组件,不再需要自定义的 `Tabs.astro` 或 `Tabs.tsx` 组件。

#### Scenario: Tabs 使用 Starlight 组件

**Given** 文档内容需要标签页
**When** 我使用 Starlight 的 `<Tabs>` MDX 组件
**Then** Tabs MUST 正确渲染
**And** MUST 符合 Starlight 主题样式
**And** 不再使用 `src/components/Tabs.*`

---

## Migration Notes

### 保留的组件

以下组件继续使用,不受 Starlight 影响:
- `src/layouts/Layout.astro` - 用于首页
- `src/components/home/*` - 首页专属组件
- 博客相关组件(如使用独立布局)

### 样式迁移

- 保留现有的 CSS 变量系统(`--color-*`, `--ifm-*`)
- 通过 `src/styles/starlight-override.css` 映射到 Starlight 变量
- 逐步适配 Starlight 的样式系统

### 内容迁移

- 所有 `src/content/docs/*` 内容保持不变
- 可能需要更新 frontmatter 以添加 Starlight 特定字段
- MDX 内容中的 `<Tabs>` 组件需要更新为 Starlight 语法

### 配置迁移

- `astro.config.mjs` 需要添加 Starlight 集成配置
- 侧边栏配置从自定义组件逻辑迁移到 Starlight 配置
- SEO 元数据从自定义组件迁移到 Starlight 自动生成
