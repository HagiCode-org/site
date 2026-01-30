# Capability: Analytics (分析能力)

本规范定义 Hagicode 文档站点的用户行为分析能力。

---

## ADDED Requirements

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

## Implementation Notes

### 技术实现要点

1. **Clarity.astro 组件**
   - 使用 `is:inline` 特性避免 Vite 处理脚本
   - 使用 `define:vars` 特性传递 Project ID
   - 条件渲染: `isProduction && projectId`

2. **astro.config.mjs 配置**
   ```javascript
   vite: {
     define: {
       'import.meta.env.CLARITY_PROJECT_ID': JSON.stringify(
         process.env.CLARITY_PROJECT_ID || ''
       ),
     },
   }
   ```

3. **StarlightWrapper.astro 集成**
   ```astro
   ---
   import Clarity from './Clarity.astro';
   ---
   <StarlightLayout {...Astro.props}>
     <slot />
     <Clarity />
   </StarlightLayout>
   ```

### 环境变量说明

| 环境变量 | 类型 | 必需 | 说明 |
|---------|------|------|------|
| `CLARITY_PROJECT_ID` | string | 可选 | Microsoft Clarity 项目 ID,格式为 `xxxxxxxxxx` |

### 测试验证

- ✅ 开发环境不加载 Clarity 脚本
- ✅ 生产环境加载 Clarity 脚本
- ✅ 无 Project ID 时不报错
- ✅ Lighthouse 性能评分符合要求
- ✅ Clarity Dashboard 显示实时数据

---

## Related Capabilities

- **Deployment**: CI/CD 集成和环境变量管理
- **Performance**: 页面加载性能监控
- **Security**: 隐私保护和数据安全

---

## Future Enhancements

- 添加 Cookie 同意横幅(GDPR/CCPA 合规)
- 集成 Google Analytics 4 提供更丰富的流量分析
- 自定义 Clarity 事件追踪(搜索关键词、外部链接点击等)
- A/B 测试集成,基于 Clarity 数据优化用户体验
