# 修复 Microsoft Clarity 分析集成

## 概述

修复主站（hagicode.com）和文档站点（docs.hagicode.com）的 Microsoft Clarity 分析集成，确保两个站点都能正常收集用户行为数据。

## 背景

**项目架构**
- **Hagicode Documentation** 是一个 monorepo，使用 npm workspaces 和 Turbopack 管理两个站点
- **apps/docs** - 基于 @astrojs/starlight (v0.37.4) 的技术文档站点，部署在 docs.hagicode.com
- **apps/website** - 基于 Astro 5.x + React 的营销落地页站点，部署在 hagicode.com
- **packages/shared** - 共享工具和类型包

**Microsoft Clarity 集成历史**
- 2026-02-04 已为文档站点添加 Microsoft Clarity 分析功能
- 通过 `Clarity.astro` 组件集成
- 使用 `CLARITY_PROJECT_ID` 环境变量配置

## 问题陈述

**核心问题（已确认）**
- **生产环境构建结果中没有生成 Clarity 相关的代码嵌入**
- 这是最关键的问题，即使组件存在，也没有在生产构建中输出 Clarity 脚本

**当前状态调查结果**

经代码审查，发现以下情况：

1. **组件实现状态**
   - 两个站点都已实现 `Clarity.astro` 组件
   - 文档站点：通过 `StarlightWrapper.astro` 统一引入
   - 营销站点：在各个页面中直接引入

2. **组件实现差异**
   - 文档站点 (`apps/docs/src/components/Clarity.astro`):
     - 检查 `isProduction` 和 `clarityProjectId`
     - 仅在生产环境且配置了 Project ID 时加载
   - 营销站点 (`apps/website/src/components/Clarity.astro`):
     - 仅检查 `clarityProjectId`
     - 可能在开发环境也会加载（如果配置了环境变量）

3. **环境变量配置**
   - 两个 `astro.config.mjs` 都配置了 Vite 环境变量定义
   - Azure 部署工作流都传递 `CLARITY_PROJECT_ID`

**根本原因分析**
虽然组件存在且环境变量已配置，但生产构建中没有生成 Clarity 代码。可能原因：
1. **组件条件渲染逻辑问题** - 组件的条件判断可能阻止了代码输出
2. **环境变量传递链断裂** - 从 GitHub Secrets → 构建环境 → Vite define → 组件的传递链条中某处断裂
3. **Astro 构建时的静态优化** - 组件可能在构建时被优化掉
4. **Partytown 集成问题** - 如果使用了 partytown，配置可能有问题
5. **Vite define 配置问题** - `import.meta.env.VITE_CLARITY_PROJECT_ID` 在构建时可能未正确替换

## 解决方案

**修复范围**
1. 诊断为什么生产构建中没有生成 Clarity 代码
2. 修复环境变量传递链（从构建时到运行时）
3. 确保组件在生产构建时正确输出 Clarity 脚本
4. 验证构建输出包含正确的 Clarity 代码

**实施策略**
1. **阶段 1：诊断环境变量传递**
   - 检查 Clarity 组件中的条件判断逻辑
   - 验证 `import.meta.env.VITE_CLARITY_PROJECT_ID` 在构建时的值
   - 添加构建时调试输出

2. **阶段 2：修复组件实现**
   - 确保组件条件渲染不会在生产构建时被优化掉
   - 如果使用 `isProduction` 检查，确保它在构建时正确评估
   - 考虑使用 Astro 的 `define:vars` 或其他构建时注入方式

3. **阶段 3：验证构建输出**
   - 检查 `dist/` 目录中的 HTML 文件
   - 搜索 Clarity 相关的脚本标签
   - 确保 partytown 配置正确（如果使用）

## 影响范围

**受影响的组件**
- `apps/website/src/components/Clarity.astro` - 更新组件逻辑
- `apps/docs/src/components/Clarity.astro` - 可选：添加调试日志

**不受影响的部分**
- 环境变量配置（已正确配置）
- 部署工作流（已正确传递环境变量）
- 组件引入位置（已正确引入）

## 验证标准

**构建验证（关键）**
- 检查 `apps/docs/dist/` 和 `apps/website/dist/` 中的 HTML 文件
- 确认包含 Clarity 脚本标签或 partytown 配置
- 验证环境变量正确注入到构建产物中

**本地验证**
- 开发环境不应加载 Clarity 脚本（符合预期）
- 设置 `CLARITY_PROJECT_ID` 后，生产构建应包含脚本

**部署验证**
- 部署后在浏览器中检查网络请求，确认 Clarity 脚本加载
- 在 Microsoft Clarity Dashboard 中确认数据接收

## 风险评估

**低风险**
- 修改仅限 Clarity 组件内部逻辑
- 不影响其他功能
- 如果修改后有问题，可以快速回滚

## 依赖项

**外部依赖**
- Microsoft Clarity 服务可用性
- GitHub Secrets 中的 `CLARITY_PROJECT_ID` 配置

**内部依赖**
- 无新增依赖
- 使用现有的环境变量配置
