# Proposal: 集成 Microsoft Clarity 用户行为分析

## Overview

为 Hagicode 文档站点集成 Microsoft Clarity 用户行为分析工具,以提供热图、会话录制和错误追踪等能力,帮助团队了解用户实际使用情况并基于数据优化文档结构和内容。

## Background

### Current State
- Hagicode 文档站点基于 Astro 5.x (Starlight 主题)构建,已完成从 Docusaurus 3.x 的迁移
- 当前站点**未集成任何用户行为分析工具**
- 缺乏对用户在文档页面实际浏览行为的了解
- 文档优化缺乏数据驱动支持
- 无法追踪 JavaScript 错误或页面加载问题

### Problem Statement
1. **缺乏用户行为洞察**: 无法了解用户在文档页面的点击、滚动、停留时间等行为模式
2. **无用户体验数据**: 无法识别用户在哪些页面停留时间较长或遇到困难
3. **优化依据不足**: 文档结构和内容优化依赖主观判断,缺乏真实用户数据支持
4. **无错误追踪能力**: 无法发现 JavaScript 错误、死链接或页面加载问题

## Proposed Solution

### High-Level Approach
集成 Microsoft Clarity 到 Astro 文档站点,通过以下方式实现:

1. **环境变量配置**
   - 在 `astro.config.mjs` 的 Vite 配置中添加 `CLARITY_PROJECT_ID` 环境变量
   - 支持从 GitHub Secrets 注入 Project ID

2. **Clarity 脚本组件**
   - 创建 `Clarity.astro` 组件封装 Clarity 脚本逻辑
   - 使用 Astro 的 `define:vars` 和 `is:inline` 特性确保脚本正确注入
   - 仅在生产环境且有 Project ID 时加载

3. **布局集成**
   - 在 `StarlightWrapper.astro` 中引入 Clarity 组件
   - 利用 Starlight 自定义布局机制确保所有页面加载 Clarity

4. **开发环境处理**
   - 检查 `import.meta.env.MODE` 或 `import.meta.env.PROD`
   - 仅在生产构建中启用 Clarity(避免污染数据)

### Technical Implementation Details

#### 1. Clarity 脚本组件 (`src/components/Clarity.astro`)

```astro
---
/**
 * Microsoft Clarity 用户行为分析集成组件
 * 仅在生产环境加载 Clarity 脚本
 */
const clarityProjectId = import.meta.env.CLARITY_PROJECT_ID;
const isProduction = import.meta.env.PROD;
---

{isProduction && clarityProjectId && (
  <script is:inline define:vars={{clarityProjectId}}>
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", clarityProjectId);
  </script>
)}
```

**设计决策**:
- `is:inline`: 确保 Clarity 脚本在 HTML 中内联,避免被 Vite 处理
- `define:vars`: 使用 Astro 的变量定义特性,将 Project ID 传递到脚本中
- 条件渲染: 仅在生产环境且有 Project ID 时加载

#### 2. 布局集成 (`src/components/StarlightWrapper.astro`)

在现有的 `StarlightWrapper.astro` 中添加 Clarity 组件:

```astro
---
import { Layout as StarlightLayout } from '@astrojs/starlight/components';
import Clarity from './Clarity.astro';
---

<StarlightLayout {...Astro.props}>
  <slot />
  <Clarity />
</StarlightLayout>
```

#### 3. Vite 环境变量配置 (`astro.config.mjs`)

在 `defineConfig` 的 Vite 配置中添加:

```javascript
vite: {
  define: {
    'import.meta.env.CLARITY_PROJECT_ID': JSON.stringify(process.env.CLARITY_PROJECT_ID || ''),
  }
}
```

**注意**: Astro 5.x 使用 Vite 的环境变量机制,需要通过 `vite.define` 将 Node.js 环境变量传递到客户端。

#### 4. GitHub Actions 配置

当前 `.github/workflows/deploy.yml` **已包含** `CLARITY_PROJECT_ID` 环境变量配置(line 36):

```yaml
env:
  CLARITY_PROJECT_ID: ${{ secrets.CLARITY_PROJECT_ID }}
  VITE_SITE_BASE: '/site'
```

**无需修改 deploy.yml**。

## Scope

### In Scope
- ✅ 创建 `Clarity.astro` 组件封装 Clarity 脚本逻辑
- ✅ 在 `StarlightWrapper.astro` 中集成 Clarity 组件
- ✅ 更新 `astro.config.mjs` 以支持 `CLARITY_PROJECT_ID` 环境变量
- ✅ 确保仅在生产环境加载 Clarity 脚本
- ✅ 本地开发和构建测试验证

### Out of Scope
- ❌ 创建 Microsoft Clarity 项目和获取 Project ID(需手动完成)
- ❌ 配置 Clarity 热图、录制等具体功能(Clarity 平台操作)
- ❌ 用户隐私合规性配置(如 GDPR 同意横幅)
- ❌ 其他分析工具集成(如 Google Analytics、Plausible)

## Impact Analysis

### Benefits
1. **用户行为洞察**
   - 通过热图了解用户点击和滚动行为
   - 通过会话录制观察用户真实操作流程
   - 识别用户交互模式和痛点

2. **数据驱动优化**
   - 基于真实用户数据优化文档结构
   - 识别高频访问页面和低效内容
   - 改进导航和信息架构

3. **问题发现**
   - 快速识别用户遇到的导航困难
   - 发现内容理解障碍
   - 追踪 JavaScript 错误和死链接

4. **性能监控**
   - 追踪页面加载时间
   - 识别性能瓶颈
   - 监控 JavaScript 错误率

5. **零成本**
   - Microsoft Clarity 完全免费
   - 无流量限制
   - 无额外的服务器或带宽成本

### Technical Impact
1. **构建配置**
   - 修改 `astro.config.mjs` 添加 Vite 环境变量配置
   - 不影响现有 Vite 插件和构建流程

2. **组件扩展**
   - 新增 `Clarity.astro` 组件(~15 行代码)
   - 修改 `StarlightWrapper.astro` 添加 Clarity 引入(~2 行代码)

3. **CI/CD 兼容性**
   - GitHub Actions `deploy.yml` 已配置 `CLARITY_PROJECT_ID`,无需修改
   - 构建时间影响可忽略(Clarity 脚本仅 ~1KB)

4. **性能影响**
   - Clarity 脚本异步加载,不阻塞页面渲染
   - 对 First Contentful Paint (FCP) 和 Largest Contentful Paint (LCP) 影响可忽略
   - 网络开销: ~1KB JavaScript + 初始化请求

5. **兼容性**
   - ✅ 完全兼容 Astro 5.x 和 Starlight 主题
   - ✅ 不影响现有 MDX 内容和 React 组件
   - ✅ 支持根路径部署和子路径部署 (`VITE_SITE_BASE`)
   - ✅ 开发环境自动禁用(避免数据污染)

### Risks & Mitigations

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| **隐私合规问题** | 用户隐私数据可能被收集 | Microsoft Clarity 已符合 GDPR 和 CCPA 标准,未来可添加同意横幅 |
| **性能影响** | 脚本加载可能影响页面性能 | Clarity 脚本异步加载,对 FCP/LCP 影响可忽略;可使用 Lighthouse 验证 |
| **数据污染** | 开发环境数据混入生产数据 | 严格检查 `import.meta.env.PROD`,仅在生产环境加载 |
| **配置错误** | Project ID 未配置导致脚本失败 | 使用可选链 `clarityProjectId && ...`,确保无 Project ID 时不报错 |
| **Starlight 版本升级** | 自定义布局可能不兼容 | `StarlightWrapper.astro` 使用官方推荐模式,升级风险低 |

### Alternatives Considered

1. **Google Analytics 4**
   - ✅ 优点: 市场标准,集成成熟
   - ❌ 缺点: 需配置 Cookie 同意横幅(GDPR),学习曲线陡峭
   - **结论**: Clarity 更适合快速上手,未来可并行集成 GA4

2. **Plausible Analytics**
   - ✅ 优点: 注重隐私,轻量级
   - ❌ 缺点: 付费($9/月起),无热图和会话录制功能
   - **结论**: Clarity 提供更丰富的功能且完全免费

3. **PostHog**
   - ✅ 优点: 开源,功能丰富
   - ❌ 缺点: 需自托管或使用付费云服务,配置复杂
   - **结论**: 对于文档站点,Clarity 的开箱即用体验更优

4. **不集成任何分析工具**
   - ✅ 优点: 零隐私风险,零性能影响
   - ❌ 缺点: 完全盲飞,无法优化用户体验
   - **结论**: 当前阶段需要用户行为数据支持优化

## Success Criteria

### Functional Requirements
- ✅ Clarity 脚本在所有生产页面正确加载
- ✅ 开发环境不加载 Clarity 脚本
- ✅ GitHub Actions 构建成功,无 `CLARITY_PROJECT_ID` 时不报错
- ✅ 本地 `npm run build` 和 `npm run preview` 验证通过

### Technical Validation
- ✅ TypeScript 类型检查通过 (`npm run typecheck`)
- ✅ 生产构建无错误 (`npm run build`)
- ✅ Lighthouse 性能评分降低 < 2 分(在允许范围内)
- ✅ Clarity Dashboard 显示实时数据(配置 Project ID 后)

### User Acceptance
- ✅ 文档站点页面加载体验无明显变化
- ✅ 浏览器开发者工具 Network 面板显示 Clarity 脚本加载
- ✅ Clarity Dashboard 显示会话录制和热图数据

## Dependencies

### External Dependencies
- **Microsoft Clarity Account**: 需手动创建 Clarity 项目并获取 Project ID
- **GitHub Secrets**: 需在 GitHub 仓库设置中配置 `CLARITY_PROJECT_ID`

### Internal Dependencies
- `src/components/StarlightWrapper.astro`: 现有自定义布局组件
- `astro.config.mjs`: Astro 配置文件
- `.github/workflows/deploy.yml`: CI/CD 配置(已完成)

### Prerequisites
1. 在 [Microsoft Clarity](https://clarity.microsoft.com/) 创建新项目
2. 获取 Clarity Project ID (格式: `xxxxxxxxxx`)
3. 在 GitHub 仓库 Secrets 中添加 `CLARITY_PROJECT_ID`

## Timeline Estimate

| 阶段 | 任务 | 预计工作量 |
|------|------|-----------|
| 准备 | 创建 Clarity 项目并获取 Project ID | 10 分钟(手动) |
| 实现 | 创建 Clarity.astro 组件 | 15 分钟 |
| 实现 | 更新 StarlightWrapper.astro | 5 分钟 |
| 实现 | 配置 astro.config.mjs 环境变量 | 10 分钟 |
| 测试 | 本地开发和构建验证 | 15 分钟 |
| 部署 | 配置 GitHub Secrets 并验证生产环境 | 10 分钟 |
| **总计** | | **约 1 小时** |

## Open Questions

1. **是否需要添加 Cookie 同意横幅?**
   - 当前状态: Microsoft Clarity 已符合 GDPR 和 CCPA 标准
   - 建议: 先集成基础功能,根据实际需求后续添加同意横幅

2. **是否需要同时集成 Google Analytics 4?**
   - 当前状态: 仅集成 Clarity
   - 建议: 先验证 Clarity 提供的数据是否满足需求,再考虑 GA4

3. **是否需要在开发环境启用 Clarity(用于测试)?**
   - 当前状态: 仅生产环境加载
   - 建议: 保持当前设计,避免数据污染;可使用 Clarity 的测试环境功能

## Related Changes

- 无关联的 OpenSpec 提案

## References

- [Microsoft Clarity 官方文档](https://learn.microsoft.com/en-us/clarity/)
- [Astro 环境变量文档](https://docs.astro.build/en/guides/environment-variables/)
- [Starlight 自定义布局文档](https://starlight.astro.build/guides/components/
