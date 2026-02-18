# analytics Specification

## Purpose
TBD - created by archiving change microsoft-clarity-integration. Update Purpose after archive.
## Requirements
### Requirement: 集成 Microsoft Clarity 用户行为分析工具

文档站点 **SHALL** 集成 Microsoft Clarity 用户行为分析工具,用于收集用户行为数据,包括热图、会话录制和错误追踪。

#### Scenario: 生产环境加载 Clarity 脚本

**Given** 用户访问生产环境的文档站点
**And** 已配置 `CLARITY_PROJECT_ID` 环境变量
**When** 页面加载完成
**Then** 浏览器应自动加载 Microsoft Clarity 脚本
**And** Clarity 脚本应从 `https://www.clarity.ms/tag/<project-id>` 加载
**And** 脚本应异步加载,不阻塞页面渲染

#### Scenario: 开发环境不加载 Clarity 脚本

**Given** 开发者运行 `npm run dev` 启动本地开发服务器
**When** 访问 `http://localhost:4321/`
**Then** 浏览器不应加载 Microsoft Clarity 脚本
**And** Network 面板不应包含 `clarity.ms` 相关请求
**And** 避免开发环境数据污染生产数据

#### Scenario: 未配置 Project ID 时不加载脚本

**Given** 生产构建但未配置 `CLARITY_PROJECT_ID` 环境变量
**When** 页面加载完成
**Then** 不应尝试加载 Clarity 脚本
**And** 页面应正常工作,无 JavaScript 错误
**And** 构建过程不应报错

---

### Requirement: Clarity 组件封装

项目 **SHALL** 创建可复用的 `Clarity.astro` 组件,封装 Microsoft Clarity 脚本逻辑。

#### Scenario: Clarity 组件正确注入脚本

**Given** `Clarity.astro` 组件已创建
**And** 组件使用 `is:inline` 特性确保脚本不被 Vite 处理
**And** 组件使用 `define:vars` 特性传递 Project ID
**When** 组件在生产环境渲染
**Then** 应在 HTML `<head>` 或 `<body>` 中注入 Clarity 脚本
**And** 脚本中的 `clarityProjectId` 变量应替换为实际 Project ID

#### Scenario: Clarity 组件支持环境变量配置

**Given** `astro.config.mjs` 中配置了 `vite.define`
**And** 环境变量 `CLARITY_PROJECT_ID` 设置为 `abc123`
**When** 构建生产版本
**Then** `import.meta.env.CLARITY_PROJECT_ID` 应替换为 `"abc123"`
**And** Clarity 脚本应使用 `abc123` 作为 Project ID

---

### Requirement: 布局集成

项目 **SHALL** 在所有文档页面的布局中集成 Clarity 组件,确保全站用户行为追踪。

#### Scenario: Starlight 布局集成 Clarity

**Given** `StarlightWrapper.astro` 是 Starlight 的自定义布局包装器
**When** 在 `StarlightWrapper.astro` 中引入 `Clarity` 组件
**And** 将 `<Clarity />` 放置在 `StarlightLayout` 内部
**Then** 所有使用 Starlight 布局的页面应自动加载 Clarity 脚本
**And** 包括首页、文档页、博客页等所有页面

---

### Requirement: CI/CD 环境变量配置

项目 **SHALL** 支持通过 GitHub Secrets 配置 `CLARITY_PROJECT_ID`,在生产构建时自动注入。

#### Scenario: GitHub Actions 传递 Clarity Project ID

**Given** GitHub 仓库 Secrets 中配置了 `CLARITY_PROJECT_ID`
**And** `.github/workflows/deploy.yml` 中包含环境变量配置
**When** GitHub Actions 执行构建
**Then** `npm run build` 应接收到 `CLARITY_PROJECT_ID` 环境变量
**And** Vite 应将 Project ID 注入到客户端代码
**And** 部署的站点应包含正确配置的 Clarity 脚本

---

### Requirement: 性能影响控制

项目 **SHALL** 确保 Clarity 集成对页面加载性能的影响最小化。

#### Scenario: Clarity 脚本异步加载不阻塞渲染

**Given** Clarity 脚本使用 `<script async>` 模式加载
**When** 页面开始加载
**Then** Clarity 脚本不应阻塞 First Contentful Paint (FCP)
**And** Clarity 脚本不应阻塞 Largest Contentful Paint (LCP)
**And** Lighthouse 性能评分降低应小于 2 分

#### Scenario: Clarity 脚本加载失败不影响页面功能

**Given** 用户网络不稳定或 Clarity CDN 不可用
**When** Clarity 脚本加载失败
**Then** 页面应正常工作,所有功能可用
**And** 浏览器控制台可显示网络错误(但不影响用户)
**And** 不应影响其他 JavaScript 代码执行

---

### Requirement: 安全和隐私合规

项目 **SHALL** 确保 Clarity 集成符合安全和隐私保护要求。

#### Scenario: Clarity 不收集敏感数据

**Given** Clarity 已集成到站点
**When** 用户在文档站点浏览
**Then** Clarity 不应收集表单输入内容
**And** Clarity 不应收集密码字段内容
**And** Clarity 应符合 GDPR 和 CCPA 隐私标准

#### Scenario: Project ID 公开无安全风险

**Given** Clarity Project ID 硬编码到客户端代码
**When** 攻击者查看页面源代码
**Then** Project ID 不应暴露敏感信息
**And** Project ID 应仅用于发送数据到 Clarity(只读权限)
**And** 攻击者无法使用 Project ID 访问 Clarity Dashboard 数据

---

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

# analytics Specification (Delta)

## MODIFIED Requirements

### Requirement: 集成 Microsoft Clarity 用户行为分析工具

文档站点 **SHALL** 集成 Microsoft Clarity 用户行为分析工具,用于收集用户行为数据,包括热图、会话录制和错误追踪。**此外,站点还应同时支持百度统计集成,为中国市场提供更精准的流量分析。**

#### Scenario: 生产环境加载 Clarity 脚本

**Given** 用户访问生产环境的文档站点
**And** 已配置 `CLARITY_PROJECT_ID` 环境变量
**When** 页面加载完成
**Then** 浏览器应自动加载 Microsoft Clarity 脚本
**And** Clarity 脚本应从 `https://www.clarity.ms/tag/<project-id>` 加载
**And** 脚本应异步加载,不阻塞页面渲染
**And** 页面应同时加载百度统计脚本(如果已配置 `BAIDU_ANALYTICS_ID`)

#### Scenario: 开发环境不加载 Clarity 脚本

**Given** 开发者运行 `npm run dev` 启动本地开发服务器
**When** 访问 `http://localhost:4321/`
**Then** 浏览器不应加载 Microsoft Clarity 脚本
**And** 浏览器不应加载百度统计脚本
**And** Network 面板不应包含 `clarity.ms` 或 `hm.baidu.com` 相关请求
**And** 避免开发环境数据污染生产数据

#### Scenario: 未配置 Project ID 时不加载脚本

**Given** 生产构建但未配置 `CLARITY_PROJECT_ID` 环境变量
**When** 页面加载完成
**Then** 不应尝试加载 Clarity 脚本
**And** 页面应正常工作,无 JavaScript 错误
**And** 如果配置了 `BAIDU_ANALYTICS_ID`,百度统计仍应正常加载

---

### Requirement: 布局集成

项目 **SHALL** 在所有文档页面的布局中集成 Clarity 组件,确保全站用户行为追踪。**同时,布局也应集成百度统计组件,实现多分析工具支持。**

#### Scenario: Starlight 布局集成 Clarity 和百度统计

**Given** `StarlightWrapper.astro` 是 Starlight 的自定义布局包装器
**When** 在 `StarlightWrapper.astro` 中引入 `Clarity` 和 `BaiduAnalytics` 组件
**And** 将 `<Clarity />` 和 `<BaiduAnalytics />` 放置在 `StarlightLayout` 内部
**Then** 所有使用 Starlight 布局的页面应自动加载 Clarity 脚本
**And** 所有使用 Starlight 布局的页面应自动加载百度统计脚本(如果已配置)
**And** 包括首页、文档页、博客页等所有页面

---

### Requirement: CI/CD 环境变量配置

项目 **SHALL** 支持通过 GitHub Secrets 配置 `CLARITY_PROJECT_ID`,在生产构建时自动注入。**同时,也应支持配置 `BAIDU_ANALYTICS_ID`。**

#### Scenario: GitHub Actions 传递 Clarity Project ID 和百度统计 ID

**Given** GitHub 仓库 Secrets 中配置了 `CLARITY_PROJECT_ID`
**And** GitHub 仓库 Secrets 中配置了 `BAIDU_ANALYTICS_ID`
**And** `.github/workflows/deploy.yml` 中包含环境变量配置
**When** GitHub Actions 执行构建
**Then** `npm run build` 应接收到 `CLARITY_PROJECT_ID` 和 `BAIDU_ANALYTICS_ID` 环境变量
**And** Vite 应将 Project ID 和 Analytics ID 注入到客户端代码
**And** 部署的站点应包含正确配置的 Clarity 脚本和百度统计脚本

---

### Requirement: 性能影响控制

项目 **SHALL** 确保 Clarity 集成对页面加载性能的影响最小化。**当同时集成百度统计时,总体性能影响仍应控制在可接受范围内。**

#### Scenario: 多个分析脚本异步加载不阻塞渲染

**Given** Clarity 脚本和百度统计脚本都使用异步加载模式
**When** 页面开始加载
**Then** Clarity 脚本不应阻塞 First Contentful Paint (FCP)
**And** 百度统计脚本不应阻塞 First Contentful Paint (FCP)
**And** 两个脚本都不应阻塞 Largest Contentful Paint (LCP)
**And** Lighthouse 性能评分降低应小于 5 分(考虑多个脚本)

#### Scenario: 任一分析脚本加载失败不影响页面功能

**Given** 用户网络不稳定或任一分析工具 CDN 不可用
**When** Clarity 脚本或百度统计脚本加载失败
**Then** 页面应正常工作,所有功能可用
**And** 另一个分析工具应继续正常工作(如果其 CDN 可用)
**And** 浏览器控制台可显示网络错误(但不影响用户)

---

### Requirement: 安全和隐私合规

项目 **SHALL** 确保 Clarity 集成符合安全和隐私保护要求。**同时集成百度统计时,也应确保其符合安全和隐私要求。**

#### Scenario: 多个分析工具不收集敏感数据

**Given** Clarity 和百度统计都已集成到站点
**When** 用户在文档站点浏览
**Then** Clarity 不应收集表单输入内容
**And** 百度统计不应收集表单输入内容
**And** 两个工具都不应收集密码字段内容
**And** 应符合各自隐私政策(Clarity: GDPR/CCPA, 百度统计: 中国隐私法规)

---

### Requirement: 文档和博客页面集成 Clarity 分析

文档站点 **SHALL** 在所有文档和博客页面集成 Microsoft Clarity 用户行为分析工具,扩展现有的首页 Clarity 集成,实现全站用户行为数据收集。**同时,所有页面也应集成百度统计。**

#### Scenario: 文档页面加载 Clarity 和百度统计脚本

**Given** 用户访问生产环境的文档页面(如 `/docs/product-overview`)
**And** 已配置 `CLARITY_PROJECT_ID` 环境变量
**And** 已配置 `BAIDU_ANALYTICS_ID` 环境变量
**When** 页面加载完成
**Then** 浏览器应加载 Microsoft Clarity 脚本
**And** 浏览器应加载百度统计脚本
**And** 两个脚本应异步加载,不阻塞页面渲染

#### Scenario: Starlight 布局统一集成多个分析工具

**Given** `StarlightWrapper.astro` 是 Starlight 的自定义布局包装器
**And** `Clarity.astro` 和 `BaiduAnalytics.astro` 组件已创建
**When** 在 `StarlightWrapper.astro` 中引入两个组件
**And** 将 `<Clarity />` 和 `<BaiduAnalytics />` 放置在 `StarlightLayout` 内部
**Then** 所有使用 Starlight 布局的页面应自动加载 Clarity 脚本
**And** 所有使用 Starlight 布局的页面应自动加载百度统计脚本
**And** 包括文档页、博客列表页、博客文章页等所有页面

---

### Requirement: Clarity 数据全站覆盖

Clarity 分析工具 **SHALL** 收集所有主要页面类型的用户行为数据,包括首页、文档页面和博客页面,提供完整的用户旅程数据。**百度统计应提供相同的数据覆盖范围,实现双重分析覆盖。**

#### Scenario: 追踪从首页到文档的用户旅程(多工具)

**Given** 用户从首页(`/`)点击链接进入文档页面(`/docs/...`)
**When** 用户在文档页面浏览
**Then** Clarity Dashboard 应显示完整的用户会话录制
**And** 百度统计 Dashboard 应显示页面访问路径
**And** 可追踪用户从首页到文档的完整路径
**And** 可分析用户在文档页面的停留时间和交互行为

#### Scenario: 按页面路径过滤多工具数据

**Given** Clarity 和百度统计 Dashboard 都收集了全站用户行为数据
**When** 需要分析特定页面类型的数据
**Then** Clarity 应可按路径前缀过滤(如 `/docs/*`, `/blog/*`)
**And** 百度统计应可按路径前缀过滤(如 `/docs/*`, `/blog/*`)
**And** 应可区分文档页面和博客页面的热图数据(Clarity)
**And** 应可区分文档页面和博客页面的访问数据(百度统计)

---

### Requirement: 集成最小化原则

Clarity 集成 **SHALL** 遵循最小化原则,复用现有组件和配置,避免不必要的代码重复。**百度统计集成也应遵循相同原则。**

#### Scenario: 复用现有分析组件模式

**Given** `Clarity.astro` 组件已定义了分析工具的集成模式
**When** 创建 `BaiduAnalytics.astro` 组件
**Then** 应遵循与 `Clarity.astro` 相同的结构和模式
**And** 应使用相同的 `is:inline` 和 `define:vars` 特性
**And** 应使用相同的生产环境条件渲染逻辑

#### Scenario: 扩展现有环境变量配置

**Given** `astro.config.mjs` 已配置 `VITE_CLARITY_PROJECT_ID` 环境变量
**When** 添加百度统计集成
**Then** 应添加 `VITE_BAIDU_ANALYTICS_ID` 配置,保持模式一致
**And** 不应修改现有的 `VITE_CLARITY_PROJECT_ID` 配置

#### Scenario: 最小化代码变更(多工具)

**Given** 需要为文档和博客页面集成百度统计
**When** 实施集成
**Then** 应仅修改 `StarlightWrapper.astro` 一个文件(添加百度统计)
**And** 应添加 2 行代码(1 行 import + 1 行组件)
**And** 不应修改现有的 Clarity 集成代码

---

### Requirement: 向后兼容性

Clarity 集成扩展 **SHALL** 不影响现有功能,确保向后兼容。**添加百度统计集成也应保持向后兼容性。**

#### Scenario: 首页多工具集成保持兼容

**Given** 首页 `index.astro` 已直接引入 `Clarity.astro` 组件
**When** 为首页添加百度统计集成
**Then** 首页的 Clarity 集成方式应保持不变
**Then** 应在 `<body>` 中添加 `<BaiduAnalytics />` 组件
**And** 两个组件应独立工作,互不影响

#### Scenario: 子路径部署兼容性(多工具)

**Given** 项目通过 `VITE_SITE_BASE` 环境变量支持子路径部署
**When** 部署在子路径(如 `/site`)下
**Then** Clarity 脚本应正常加载
**And** 百度统计脚本应正常加载
**And** 两个工具的 Dashboard 都应正确记录页面路径
**And** 不应因子路径部署导致任一工具失效
