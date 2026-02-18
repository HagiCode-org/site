# baidu-analytics Specification

## ADDED Requirements

### Requirement: 集成百度统计网站分析工具

文档站点 **SHALL** 集成百度统计网站分析工具,用于收集中国用户访问数据,包括页面浏览量、访问来源、用户行为路径和地域分布。

#### Scenario: 生产环境加载百度统计脚本

**Given** 用户访问生产环境的文档站点
**And** 已配置 `BAIDU_ANALYTICS_ID` 环境变量
**When** 页面加载完成
**Then** 浏览器应自动加载百度统计脚本
**And** 百度统计脚本应从 `https://hm.baidu.com/hm.js?<analytics-id>` 加载
**And** 脚本应异步加载,不阻塞页面渲染

#### Scenario: 开发环境不加载百度统计脚本

**Given** 开发者运行 `npm run dev` 启动本地开发服务器
**When** 访问 `http://localhost:4321/`
**Then** 浏览器不应加载百度统计脚本
**And** Network 面板不应包含 `hm.baidu.com` 相关请求
**And** 避免开发环境数据污染生产数据

#### Scenario: 未配置 Analytics ID 时不加载脚本

**Given** 生产构建但未配置 `BAIDU_ANALYTICS_ID` 环境变量
**When** 页面加载完成
**Then** 不应尝试加载百度统计脚本
**And** 页面应正常工作,无 JavaScript 错误
**And** 构建过程不应报错

---

### Requirement: 百度统计组件封装

项目 **SHALL** 创建可复用的 `BaiduAnalytics.astro` 组件,封装百度统计脚本逻辑。

#### Scenario: BaiduAnalytics 组件正确注入脚本

**Given** `BaiduAnalytics.astro` 组件已创建
**And** 组件使用 `is:inline` 特性确保脚本不被 Vite 处理
**And** 组件使用 `define:vars` 特性传递 Analytics ID
**When** 组件在生产环境渲染
**Then** 应在 HTML `<body>` 中注入百度统计脚本
**And** 脚本中的 `baiduAnalyticsId` 变量应替换为实际 Analytics ID

#### Scenario: BaiduAnalytics 组件支持环境变量配置

**Given** `astro.config.mjs` 中配置了 `vite.define`
**And** 环境变量 `BAIDU_ANALYTICS_ID` 设置为 `26c9739b2f3cddbe36c649e0823ee2de`
**When** 构建生产版本
**Then** `import.meta.env.VITE_BAIDU_ANALYTICS_ID` 应替换为 `"26c9739b2f3cddbe36c649e0823ee2de"`
**And** 百度统计脚本应使用该 ID 加载

---

### Requirement: 文档站点布局集成

项目 **SHALL** 在文档站点的所有页面布局中集成百度统计组件,确保全站用户行为追踪。

#### Scenario: Starlight 布局集成百度统计

**Given** `StarlightWrapper.astro` 是 Starlight 的自定义布局包装器
**When** 在 `StarlightWrapper.astro` 中引入 `BaiduAnalytics` 组件
**And** 将 `<BaiduAnalytics />` 放置在 `StarlightLayout` 内部
**Then** 所有使用 Starlight 布局的页面应自动加载百度统计脚本
**And** 包括首页、文档页、博客页等所有页面

---

### Requirement: 营销站点首页集成

项目 **SHALL** 在营销站点的首页中集成百度统计组件,追踪营销落地页的用户访问数据。

#### Scenario: 营销站点首页集成百度统计

**Given** `apps/website/src/pages/index.astro` 是营销站点的首页
**When** 在 `index.astro` 中引入 `BaiduAnalytics` 组件
**And** 将 `<BaiduAnalytics />` 放置在 `<body>` 结束标签之前
**Then** 首页应加载百度统计脚本
**And** 百度统计应记录首页的浏览数据

#### Scenario: 营销站点与其他分析工具共存

**Given** 首页已集成 Microsoft Clarity 分析
**When** 同时集成百度统计
**Then** 两个分析工具应同时正常工作
**And** 不应相互冲突或影响页面功能

---

### Requirement: CI/CD 环境变量配置

项目 **SHALL** 支持通过 GitHub Secrets 配置 `BAIDU_ANALYTICS_ID`,在生产构建时自动注入。

#### Scenario: GitHub Actions 传递百度统计 ID

**Given** GitHub 仓库 Secrets 中配置了 `BAIDU_ANALYTICS_ID`
**And** `.github/workflows/deploy-docs.yml` 中包含环境变量配置
**When** GitHub Actions 执行构建
**Then** `npm run build` 应接收到 `BAIDU_ANALYTICS_ID` 环境变量
**And** Vite 应将 Analytics ID 注入到客户端代码
**And** 部署的站点应包含正确配置的百度统计脚本

#### Scenario: 两个站点的独立配置

**Given** 文档站点和营销站点使用不同的 GitHub Actions 工作流
**When** 配置 `BAIDU_ANALYTICS_ID` Secret
**Then** 两个工作流应独立配置相同或不同的 Analytics ID
**And** 支持为不同站点使用独立的百度统计账号

---

### Requirement: 性能影响控制

项目 **SHALL** 确保百度统计集成对页面加载性能的影响最小化。

#### Scenario: 百度统计脚本异步加载不阻塞渲染

**Given** 百度统计脚本使用异步脚本注入模式
**When** 页面开始加载
**Then** 百度统计脚本不应阻塞 First Contentful Paint (FCP)
**And** 百度统计脚本不应阻塞 Largest Contentful Paint (LCP)
**And** Lighthouse 性能评分降低应小于 2 分

#### Scenario: 百度统计脚本加载失败不影响页面功能

**Given** 用户网络不稳定或百度统计 CDN 不可用
**When** 百度统计脚本加载失败
**Then** 页面应正常工作,所有功能可用
**And** 浏览器控制台可显示网络错误(但不影响用户)
**And** 不应影响其他 JavaScript 代码执行

---

### Requirement: 与 Microsoft Clarity 共存

项目 **SHALL** 确保百度统计与 Microsoft Clarity 分析工具同时集成时互不冲突。

#### Scenario: 两个分析工具同时加载

**Given** 页面同时集成 Clarity 和百度统计
**When** 页面加载完成
**Then** 两个分析工具的脚本应都成功加载
**And** 两个工具应独立收集数据
**And** 不应产生 JavaScript 错误或冲突

#### Scenario: 开发环境两个工具都不加载

**Given** 开发环境运行 `npm run dev`
**When** 访问任何页面
**Then** Clarity 和百度统计脚本都不应加载
**And** 保持开发环境的纯净性

---

### Requirement: 安全和隐私合规

项目 **SHALL** 确保百度统计集成符合安全和隐私保护要求。

#### Scenario: 百度统计不收集敏感数据

**Given** 百度统计已集成到站点
**When** 用户在站点浏览
**Then** 百度统计不应收集表单输入内容
**And** 百度统计不应收集密码字段内容
**And** 应遵循百度统计的标准隐私政策

#### Scenario: Analytics ID 公开无安全风险

**Given** 百度统计 Analytics ID 硬编码到客户端代码
**When** 攻击者查看页面源代码
**Then** Analytics ID 不应暴露敏感信息
**And** Analytics ID 应仅用于发送数据到百度统计(只读权限)
**And** 攻击者无法使用 Analytics ID 访问百度统计后台数据

---

### Requirement: 双应用一致性

项目 **SHALL** 确保文档站点和营销站点的百度统计实现保持一致,遵循相同的组件模式和配置方式。

#### Scenario: 两个应用使用相同的组件结构

**Given** 文档站点和营销站点都需要集成百度统计
**When** 创建 `BaiduAnalytics.astro` 组件
**Then** 两个应用的组件应使用相同的结构
**And** 都应使用 `is:inline` 和 `define:vars` 特性
**And** 都应支持生产环境条件渲染

#### Scenario: 两个应用使用相同的环境变量命名

**Given** 文档站点和营销站点配置环境变量
**When** 在 `astro.config.mjs` 中配置 `vite.define`
**Then** 两个应用都应使用 `VITE_BAIDU_ANALYTICS_ID` 命名
**And** 保持环境变量配置的一致性

---

### Requirement: 构建时变量替换

项目 **SHALL** 使用 Vite 的 `define` 功能在构建时替换环境变量,确保百度统计 ID 正确注入。

#### Scenario: Vite define 正确替换 Analytics ID

**Given** `astro.config.mjs` 配置了 `define: { 'import.meta.env.VITE_BAIDU_ANALYTICS_ID': JSON.stringify(process.env.BAIDU_ANALYTICS_ID) }`
**When** 执行 `npm run build`
**Then** 构建产物中 `import.meta.env.VITE_BAIDU_ANALYTICS_ID` 应替换为实际的 Analytics ID 字符串
**And** 不应保留 `import.meta.env` 引用

#### Scenario: 环境变量未传递时使用空字符串

**Given** 构建时未传递 `BAIDU_ANALYTICS_ID` 环境变量
**When** 执行 `npm run build`
**Then** `import.meta.env.VITE_BAIDU_ANALYTICS_ID` 应替换为空字符串或 `undefined`
**And** 组件的条件渲染逻辑应正确处理未配置的情况

---

### Requirement: 百度统计数据验证

项目 **SHALL** 提供验证机制,确保百度统计集成正确工作。

#### Scenario: 生产环境验证脚本加载

**Given** 生产环境已部署百度统计集成
**When** 使用浏览器 DevTools 检查 Network 面板
**Then** 应能看到对 `hm.baidu.com/hm.js?<analytics-id>` 的请求
**And** 请求状态应为 200 (成功)
**And** Response 应包含百度统计代码

#### Scenario: 百度统计 Dashboard 数据验证

**Given** 百度统计已集成并部署
**When** 等待 24-48 小时后访问百度统计 Dashboard
**Then** 应能看到站点访问数据
**And** 数据应包括页面浏览量、访客数等基础指标
