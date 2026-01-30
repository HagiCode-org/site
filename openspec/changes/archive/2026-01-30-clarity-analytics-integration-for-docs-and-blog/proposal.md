# Proposal: 为文档和博客页面集成 Clarity 分析

## Overview

将 Microsoft Clarity 用户行为分析工具扩展到文档和博客页面,实现全站用户行为数据收集,以支持基于数据的内容优化决策。

## Background

### Current State
- **首页** (`src/pages/index.astro`) 已集成 Microsoft Clarity 分析工具
- **文档页面** 使用 Starlight 主题布局,未集成 Clarity
- **博客页面** 使用 starlight-blog 插件,未集成 Clarity
- `Clarity.astro` 组件已创建,封装了 Clarity 脚本逻辑
- `astro.config.mjs` 已配置 `VITE_CLARITY_PROJECT_ID` 环境变量
- `.github/workflows/deploy.yml` 已配置 `CLARITY_PROJECT_ID` Secret

### Problem Statement
1. **数据收集不完整**: 仅首页有 Clarity 分析,文档和博客页面缺乏用户行为数据
2. **用户旅程盲区**: 无法追踪用户从首页到文档/博客的完整浏览路径
3. **内容优化缺乏依据**: 无法评估文档和博客内容的实际效果和用户参与度
4. **分析价值受限**: Clarity 热图和会话录制功能仅覆盖首页,无法洞察主要内容区域

### Root Cause Analysis
- 首页直接引入 `Clarity.astro` 组件 (`src/pages/index.astro:77`)
- 文档页面使用 `StarlightWrapper.astro` 布局,但该布局未集成 Clarity 组件
- 博客页面由 starlight-blog 插件生成,同样未集成 Clarity

## Proposed Solution

### High-Level Approach
通过在 Starlight 布局包装器中集成 Clarity 组件,确保所有文档和博客页面自动加载 Clarity 脚本:

1. **修改 StarlightWrapper.astro**
   - 在现有的 `StarlightWrapper.astro` 中引入 `Clarity` 组件
   - 将 `<Clarity />` 放置在 `StarlightLayout` 内部
   - 确保所有使用 Starlight 布局的页面(文档、博客)自动加载 Clarity

2. **复用现有组件**
   - 使用已创建的 `Clarity.astro` 组件,无需修改
   - 利用现有的环境变量配置 (`VITE_CLARITY_PROJECT_ID`)
   - 保留生产环境检查逻辑

3. **验证集成**
   - 本地构建测试确认脚本正确注入
   - 开发环境验证 Clarity 不加载
   - 生产环境验证 Clarity Dashboard 接收数据

### Technical Implementation Details

#### 1. 修改 StarlightWrapper.astro

**当前代码** (`src/components/StarlightWrapper.astro`):
```astro
---
/**
 * Starlight 自定义布局包装器
 * 用于添加 Mermaid 渲染脚本
 */
import MermaidRenderer from '../scripts/mermaid-renderer.astro';
import { Layout as StarlightLayout } from '@astrojs/starlight/components';
---

<StarlightLayout {...Astro.props}>
  <slot />
  <MermaidRenderer />
</StarlightLayout>
```

**修改后代码**:
```astro
---
/**
 * Starlight 自定义布局包装器
 * 用于添加 Mermaid 渲染脚本和 Clarity 分析
 */
import MermaidRenderer from '../scripts/mermaid-renderer.astro';
import Clarity from './Clarity.astro';
import { Layout as StarlightLayout } from '@astrojs/starlight/components';
---

<StarlightLayout {...Astro.props}>
  <slot />
  <MermaidRenderer />
  <Clarity />
</StarlightLayout>
```

**变更说明**:
- 添加 `import Clarity from './Clarity.astro';` (第 6 行)
- 在 `<StarlightLayout>` 内添加 `<Clarity />` (第 13 行)
- 无需修改其他逻辑

#### 2. 工作原理

**Starlight 布局机制**:
- Starlight 使用 `StarlightWrapper.astro` 作为所有文档页面的自定义布局
- starlight-blog 插件也使用相同的布局包装器
- 修改 `StarlightWrapper.astro` 后,所有文档和博客页面自动继承 Clarity 集成

**Clarity 组件逻辑** (无需修改):
```astro
const shouldLoadClarity = isProduction && clarityProjectId;
```
- 仅在生产环境加载
- 仅在配置了 Project ID 时加载
- 开发环境自动禁用

**环境变量流程**:
1. GitHub Secrets `CLARITY_PROJECT_ID` → GitHub Actions env
2. GitHub Actions env → `process.env.CLARITY_PROJECT_ID` (Node.js)
3. `astro.config.mjs` `vite.define` → `import.meta.env.VITE_CLARITY_PROJECT_ID` (客户端)
4. `Clarity.astro` 读取环境变量并注入脚本

#### 3. 覆盖的页面类型

**文档页面**:
- 所有 `src/content/docs/**/*.md` 文件
- 通过 Starlight 的 `docs/[...slug].astro` 路由渲染
- 使用 `StarlightWrapper.astro` 布局

**博客页面**:
- 所有 `src/content/blog/**/*.md` 文件
- 通过 starlight-blog 插件的路由渲染
- 博客列表页 (`/blog/`)
- 博客文章详情页 (`/blog/posts/*`)
- 标签页 (`/blog/tags/*`)
- 作者页 (`/blog/authors/*`)

**首页**:
- 继续使用直接引入 `Clarity.astro` 的方式
- 无需修改,保持现状

## Scope

### In Scope
- ✅ 修改 `StarlightWrapper.astro` 集成 Clarity 组件
- ✅ 确保所有文档页面加载 Clarity 脚本
- ✅ 确保所有博客页面加载 Clarity 脚本
- ✅ 本地构建验证 (`npm run build`)
- ✅ 本地预览验证 (`npm run preview`)
- ✅ 开发环境验证 Clarity 不加载 (`npm run dev`)

### Out of Scope
- ❌ 修改 `Clarity.astro` 组件(已满足需求)
- ❌ 修改 `astro.config.mjs`(已配置环境变量)
- ❌ 修改 `.github/workflows/deploy.yml`(已配置 Secret)
- ❌ 修改首页 Clarity 集成方式(已正常工作)
- ❌ 添加 Cookie 同意横幅(未来需求)
- ❌ 配置 Clarity Dashboard 设置(Clarity 平台操作)

### Boundary Conditions
- **开发环境**: 必须不加载 Clarity 脚本
- **未配置 Project ID**: 必须不报错,页面正常工作
- **子路径部署**: 必须支持 `VITE_SITE_BASE` 环境变量
- **Starlight 版本升级**: 必须兼容未来 Starlight 版本

## Impact Analysis

### Benefits

1. **完整的用户行为数据**
   - 追踪用户从首页到文档/博客的完整旅程
   - 了解用户在文档页面的浏览路径和停留时间
   - 分析博客文章的阅读参与度

2. **数据驱动的内容优化**
   - 识别高频访问的文档页面
   - 发现用户经常退出的页面
   - 评估博客内容的实际效果

3. **改进用户体验**
   - 通过热图识别文档导航问题
   - 通过会话录制发现用户困惑点
   - 优化文档结构和信息架构

4. **技术问题发现**
   - 追踪文档页面的 JavaScript 错误
   - 发现死链接或加载失败的内容
   - 监控博客页面的性能问题

5. **实施成本极低**
   - 仅需修改 1 个文件,添加 2 行代码
   - 复用现有 Clarity 组件和环境变量配置
   - 无需额外的依赖或构建配置

### Technical Impact

1. **代码变更**
   - 修改文件: `src/components/StarlightWrapper.astro`
   - 新增代码: 2 行(1 行 import + 1 行组件)
   - 删除代码: 0 行
   - 影响文件总数: 1 个

2. **构建性能**
   - 构建时间影响: 可忽略(< 1 秒)
   - 构建产物大小: +0 字节(Clarity 组件已在首页使用)

3. **运行时性能**
   - 网络请求: +1 个(Clarity 脚本 ~1KB)
   - 页面加载时间: 无影响(Clarity 异步加载)
   - First Contentful Paint: 无影响
   - Largest Contentful Paint: 无影响

4. **兼容性**
   - ✅ Astro 5.16: 完全兼容
   - ✅ @astrojs/starlight: 完全兼容
   - ✅ starlight-blog: 完全兼容
   - ✅ React 18.2: 无影响
   - ✅ TypeScript: 无影响

5. **维护性**
   - 未来 Clarity 版本升级: 仅需修改 `Clarity.astro` 组件
   - Starlight 版本升级: 无影响(使用官方布局包装模式)
   - 环境变量配置: 无需修改

### Risks & Mitigations

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| **Clarity 脚本加载失败** | 文档/博客页面无分析数据 | 低 | Clarity 脚本异步加载,失败不影响页面功能 |
| **开发环境误加载 Clarity** | 污染生产数据 | 低 | `Clarity.astro` 已检查 `import.meta.env.PROD` |
| **Starlight 版本不兼容** | 布局包装器失效 | 低 | 使用官方推荐的布局包装模式 |
| **环境变量未配置** | 生产环境无分析数据 | 中 | GitHub Secrets 已配置,回退到首页仅集成 |
| **性能下降** | 页面加载变慢 | 极低 | Clarity 脚本异步加载,对 FCP/LCP 无影响 |
| **隐私合规问题** | 用户隐私数据被收集 | 低 | Microsoft Clarity 已符合 GDPR 和 CCPA |

### Alternatives Considered

1. **在每个页面单独引入 Clarity**
   - ✅ 优点: 灵活控制每个页面
   - ❌ 缺点: 代码重复,维护困难,容易遗漏页面
   - **结论**: 不推荐,应使用布局统一集成

2. **创建独立的 DocsLayout 和 BlogLayout**
   - ✅ 优点: 文档和博客可独立配置
   - ❌ 缺点: 增加维护成本,代码重复
   - **结论**: 不必要,StarlightWrapper 已覆盖所有页面

3. **使用 Astro 的 Slots 机制**
   - ✅ 优点: 更灵活的组件组合
   - ❌ 缺点: 过度设计,当前场景无需如此复杂
   - **结论**: 不推荐,直接集成更简单

4. **保持现状,仅首页集成 Clarity**
   - ✅ 优点: 零实施成本
   - ❌ 缺点: 数据收集不完整,无法分析主要用户行为
   - **结论**: 不满足需求,文档和博客是主要内容区域

## Success Criteria

### Functional Requirements
- ✅ 所有文档页面 (`/docs/**`) 在生产环境加载 Clarity 脚本
- ✅ 所有博客页面 (`/blog/**`) 在生产环境加载 Clarity 脚本
- ✅ 开发环境 (`npm run dev`) 不加载 Clarity 脚本
- ✅ 本地构建 (`npm run build`) 成功无错误
- ✅ 本地预览 (`npm run preview`) 页面正常工作

### Technical Validation
- ✅ 修改后的 `StarlightWrapper.astro` 语法正确
- ✅ TypeScript 类型检查通过 (`npm run typecheck`)
- ✅ 生产构建 HTML 包含 Clarity 脚本标签
- ✅ 浏览器开发者工具 Network 面板显示 Clarity 请求
- ✅ Clarity Dashboard 显示文档和博客页面数据

### User Acceptance
- ✅ 文档和博客页面加载体验无变化
- ✅ 用户不可见 Clarity 脚本加载过程
- ✅ 页面交互无延迟或卡顿
- ✅ 移动端和桌面端均正常工作

### Data Validation
- ✅ Clarity Dashboard 显示页面浏览量(Page Views)
- ✅ Clarity Dashboard 显示会话录制
- ✅ Clarity Dashboard 显示热图数据
- ✅ 可按页面路径过滤数据(区分 `/docs/` 和 `/blog/`)

## Dependencies

### External Dependencies
- **Microsoft Clarity Project**: 已创建,Project ID 已配置
- **GitHub Secrets**: `CLARITY_PROJECT_ID` 已配置(由首页集成完成)

### Internal Dependencies
- `src/components/Clarity.astro`: Clarity 组件(已存在)
- `src/components/StarlightWrapper.astro`: Starlight 布局包装器(需修改)
- `astro.config.mjs`: Astro 配置(已配置环境变量)
- `.github/workflows/deploy.yml`: CI/CD 配置(已配置 Secret)

### Prerequisites
1. 首页 Clarity 集成已完成(✅ 已完成)
2. GitHub Secrets 已配置 `CLARITY_PROJECT_ID` (✅ 已配置)
3. 本地开发环境可正常构建和预览(✅ 可用)

### Blockers
无已知阻塞因素。所有依赖已满足。

## Implementation Notes

### Testing Strategy

1. **本地开发验证**
   ```bash
   npm run dev
   # 访问 http://localhost:4321
   # 检查浏览器控制台,确认无 Clarity 相关请求
   # 检查 Network 面板,确认无 clarity.ms 请求
   ```

2. **本地构建验证**
   ```bash
   npm run build
   # 检查构建输出,确认无错误
   npm run preview
   # 访问 http://localhost:4321/docs/...
   # 检查 Network 面板,确认有 clarity.ms 请求
   ```

3. **生产环境验证**
   - 部署后访问生产站点
   - 打开浏览器开发者工具 → Network 面板
   - 过滤 "clarity",确认脚本加载
   - 访问 Clarity Dashboard,确认实时数据

### Rollback Plan

如果集成后出现问题,回滚步骤:

1. **立即回滚**: 从 `StarlightWrapper.astro` 移除 `<Clarity />` 组件
2. **提交回滚**: 创建 hotfix commit 并推送到 main 分支
3. **验证**: 确认文档和博客页面恢复正常

回滚影响:
- 文档和博客页面无 Clarity 分析数据
- 首页 Clarity 继续正常工作
- 无其他功能影响

## Open Questions

1. **是否需要在文档和博客页面使用不同的 Clarity Project?**
   - 当前状态: 使用相同的 Project ID
   - 建议: 保持单一 Project ID,可在 Clarity Dashboard 中按路径过滤

2. **是否需要排除某些页面(如内部文档)?**
   - 当前状态: 所有页面都集成 Clarity
   - 建议: 先全量集成,根据数据再决定是否需要排除

3. **是否需要添加 Clarity 自定义事件追踪?**
   - 当前状态: 仅收集基础页面浏览数据
   - 建议: 后续根据需求添加自定义事件(如文档搜索、博客标签点击等)

## Related Changes

- **microsoft-clarity-integration** (已归档): 首页 Clarity 集成,创建了 `Clarity.astro` 组件和环境变量配置

## References

- [Microsoft Clarity 官方文档](https://learn.microsoft.com/en-us/clarity/)
- [Starlight 自定义布局文档](https://starlight.astro.build/guides/components/)
- [Astro Slots 文档](https://docs.astro.build/en/core-concepts/astro-components/#slots)
- [现有 Clarity 集成提案](../archive/2026-01-30-microsoft-clarity-integration/proposal.md)
