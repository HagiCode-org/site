# analytics Spec Delta

## ADDED Requirements

### Requirement: 文档和博客页面集成 Clarity 分析

文档站点 **SHALL** 在所有文档和博客页面集成 Microsoft Clarity 用户行为分析工具,扩展现有的首页 Clarity 集成,实现全站用户行为数据收集。

#### Scenario: 文档页面加载 Clarity 脚本

**Given** 用户访问生产环境的文档页面(如 `/docs/product-overview`)
**And** 已配置 `CLARITY_PROJECT_ID` 环境变量
**When** 页面加载完成
**Then** 浏览器应加载 Microsoft Clarity 脚本
**And** Clarity 脚本应从 `https://www.clarity.ms/tag/<project-id>` 加载
**And** 脚本应异步加载,不阻塞页面渲染

#### Scenario: 博客列表页加载 Clarity 脚本

**Given** 用户访问生产环境的博客列表页 `/blog/`
**And** 已配置 `CLARITY_PROJECT_ID` 环境变量
**When** 页面加载完成
**Then** 浏览器应加载 Microsoft Clarity 脚本
**And** Clarity Dashboard 应记录博客列表页的浏览数据

#### Scenario: 博客文章页加载 Clarity 脚本

**Given** 用户访问生产环境的博客文章详情页 `/blog/posts/some-post`
**And** 已配置 `CLARITY_PROJECT_ID` 环境变量
**When** 页面加载完成
**Then** 浏览器应加载 Microsoft Clarity 脚本
**And** Clarity Dashboard 应记录博客文章的浏览数据

#### Scenario: Starlight 布局统一集成 Clarity

**Given** `StarlightWrapper.astro` 是 Starlight 的自定义布局包装器
**And** `Clarity.astro` 组件已创建
**When** 在 `StarlightWrapper.astro` 中引入 `Clarity` 组件
**And** 将 `<Clarity />` 放置在 `StarlightLayout` 内部
**Then** 所有使用 Starlight 布局的页面应自动加载 Clarity 脚本
**And** 包括文档页、博客列表页、博客文章页等所有页面

#### Scenario: 文档和博客页面开发环境不加载 Clarity

**Given** 开发者运行 `npm run dev` 启动本地开发服务器
**When** 访问文档页面 `http://localhost:4321/docs/...`
**And** 访问博客页面 `http://localhost:4321/blog/...`
**Then** 浏览器不应加载 Microsoft Clarity 脚本
**And** Network 面板不应包含 `clarity.ms` 相关请求
**And** 避免开发环境数据污染生产数据

---

### Requirement: Clarity 数据全站覆盖

Clarity 分析工具 **SHALL** 收集所有主要页面类型的用户行为数据,包括首页、文档页面和博客页面,提供完整的用户旅程数据。

#### Scenario: 追踪从首页到文档的用户旅程

**Given** 用户从首页(`/`)点击链接进入文档页面(`/docs/...`)
**When** 用户在文档页面浏览
**Then** Clarity Dashboard 应显示完整的用户会话录制
**And** 可追踪用户从首页到文档的完整路径
**And** 可分析用户在文档页面的停留时间和交互行为

#### Scenario: 追踪从首页到博客的用户旅程

**Given** 用户从首页(`/`)点击链接进入博客页面(`/blog/...`)
**When** 用户在博客页面浏览
**Then** Clarity Dashboard 应显示完整的用户会话录制
**And** 可追踪用户从首页到博客的完整路径
**And** 可分析用户在博客页面的阅读行为

#### Scenario: 按页面路径过滤 Clarity 数据

**Given** Clarity Dashboard 收集了全站用户行为数据
**When** 需要分析特定页面类型的数据
**Then** 应可按路径前缀过滤(如 `/docs/*`, `/blog/*`)
**And** 应可区分文档页面和博客页面的热图数据
**And** 应可分别查看文档和博客的会话录制

---

### Requirement: 集成最小化原则

Clarity 集成 **SHALL** 遵循最小化原则,复用现有组件和配置,避免不必要的代码重复。

#### Scenario: 复用现有 Clarity 组件

**Given** `Clarity.astro` 组件已在首页集成中创建
**And** 组件封装了完整的 Clarity 脚本逻辑
**When** 为文档和博客页面集成 Clarity
**Then** 应复用现有的 `Clarity.astro` 组件
**And** 不应创建新的 Clarity 组件
**And** 不应修改 `Clarity.astro` 组件的逻辑

#### Scenario: 复用现有环境变量配置

**Given** `astro.config.mjs` 已配置 `VITE_CLARITY_PROJECT_ID` 环境变量
**And** `.github/workflows/deploy.yml` 已配置 `CLARITY_PROJECT_ID` Secret
**When** 为文档和博客页面集成 Clarity
**Then** 应复用现有的环境变量配置
**And** 不应修改 `astro.config.mjs`
**And** 不应修改 GitHub Actions 配置

#### Scenario: 最小化代码变更

**Given** 需要为文档和博客页面集成 Clarity
**When** 实施集成
**Then** 应仅修改 `StarlightWrapper.astro` 一个文件
**And** 应仅添加 2 行代码(1 行 import + 1 行组件)
**And** 不应修改其他文件

---

### Requirement: 向后兼容性

Clarity 集成扩展 **SHALL** 不影响现有功能,确保向后兼容。

#### Scenario: 首页 Clarity 集成保持不变

**Given** 首页 `index.astro` 已直接引入 `Clarity.astro` 组件
**When** 为文档和博客页面集成 Clarity
**Then** 首页的 Clarity 集成方式应保持不变
**And** 首页应继续正常加载 Clarity 脚本
**And** 不应修改 `src/pages/index.astro` 文件

#### Scenario: Starlight 版本升级兼容性

**Given** `StarlightWrapper.astro` 使用 Starlight 官方推荐的布局包装模式
**When** Starlight 版本升级
**Then** 布局包装器应继续正常工作
**And** Clarity 集成不应失效
**And** 不应因 Clarity 集成导致升级失败

#### Scenario: 子路径部署兼容性

**Given** 项目通过 `VITE_SITE_BASE` 环境变量支持子路径部署
**When** 部署在子路径(如 `/site`)下
**Then** Clarity 脚本应正常加载
**And** Clarity Dashboard 应正确记录页面路径
**And** 不应因子路径部署导致 Clarity 失效

---
