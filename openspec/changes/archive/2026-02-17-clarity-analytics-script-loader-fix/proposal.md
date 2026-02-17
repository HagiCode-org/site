# 修复 Clarity 分析脚本加载问题

## 概述

Microsoft Clarity 分析脚本在 HagiCode 项目的三个网站中未能正常加载。本提案旨在诊断并修复 Clarity 集成问题，确保用户行为数据能够被准确追踪。

### 受影响的环境

| 网站 URL | 站点类型 | 框架 |
|----------|----------|------|
| docs.hagicode.com | 文档站点 | @astrojs/starlight |
| hagicode.com | 营销落地页 | Astro + React |
| hagicode.com/desktop/ | 桌面版下载页 | Astro + React |

## 背景

### 技术栈

- **框架**: Astro 5.6 + React 19.2
- **文档框架**: @astrojs/starlight 0.37.4
- **分析工具**: Microsoft Clarity
- **部署**:
  - docs.hagicode.com: GitHub Pages
  - hagicode.com: Azure Static Web Apps

### 最近变更

- **2026-02-04**: 添加了 Microsoft Clarity 分析集成，创建了 Clarity.astro 组件
- **2026-02-10**: 迁移到 monorepo 架构，分离了 docs 和 website 应用

### 当前集成方式

**docs 应用**:
- Clarity 组件位于 `apps/docs/src/components/Clarity.astro`
- 在 `StarlightFooter.astro` 中全局引用
- 环境变量通过 `vite.define` 映射

**website 应用**:
- Clarity 组件位于 `apps/website/src/components/Clarity.astro`
- 在每个页面单独引用 (index.astro, desktop/index.astro, container/index.astro)
- 环境变量通过 `vite.define` 映射

## 问题陈述

### 当前症状

Microsoft Clarity 分析脚本在以下环境中失效：
- docs.hagicode.com 的所有页面
- hagicode.com 首页
- hagicode.com/desktop/ 页面

### 预期行为

- 所有页面应正确加载 Microsoft Clarity 分析脚本
- 浏览器 Network 标签应显示 Clarity 脚本请求
- Clarity Dashboard 应显示实时用户数据

## 根因分析（待验证）

基于代码审查，可能的问题原因包括：

### 1. 环境变量传递问题

**问题描述**: `CLARITY_PROJECT_ID` 未正确从 GitHub Secrets 传递到构建过程

**验证点**:
- GitHub Actions 中 `CLARITY_PROJECT_ID` secret 是否已配置
- 构建时日志中是否显示环境变量已注入

### 2. Vite 构建时配置问题

**问题描述**: `vite.define` 配置可能在构建时未正确评估 `import.meta.env.PROD`

**当前配置**:
```javascript
define: {
  "import.meta.env.VITE_CLARITY_PROJECT_ID": JSON.stringify(
    process.env.CLARITY_PROJECT_ID || ""
  ),
  "import.meta.env.PROD": JSON.stringify(
    process.env.NODE_ENV === "production"
  ),
}
```

**潜在问题**:
- `process.env.NODE_ENV` 可能未在 Astro 构建时正确设置
- `import.meta.env.PROD` 可能被评估为 `false`

### 3. Clarity 组件逻辑问题

**问题描述**: Clarity.astro 组件的条件渲染逻辑可能存在缺陷

**当前逻辑**:
```astro
const shouldLoadClarity = isProduction && clarityProjectId;
```

**潜在问题**:
- 如果 `isProduction` 为 `false`，脚本将不会加载
- 如果 `clarityProjectId` 为空字符串，脚本将不会加载

### 4. Starlight 组件覆盖问题

**问题描述**: StarlightFooter.astro 可能未在所有页面正确覆盖

**验证点**:
- 博客页面是否使用自定义 Footer
- 某些特殊页面是否使用不同的布局

## 解决方案

### 诊断阶段

#### 步骤 1: 验证环境变量配置

1. 检查 GitHub Secrets 中 `CLARITY_PROJECT_ID` 是否已配置
2. 在构建日志中验证环境变量已正确传递
3. 使用 `CLARITY_DEBUG=1` 启用调试日志

#### 步骤 2: 本地构建验证

1. 执行带环境变量的本地构建：
   ```bash
   CLARITY_PROJECT_ID=test_id npm run build:docs
   CLARITY_PROJECT_ID=test_id npm run build:website
   ```
2. 检查 `dist/` 目录中的 HTML 是否包含 Clarity 脚本
3. 验证 `import.meta.env.PROD` 在构建时是否正确评估

#### 步骤 3: 检查构建输出

1. 在生成的 HTML 中搜索 `clarity.ms` 字符串
2. 验证脚本标签是否包含正确的 Project ID
3. 检查 `is:inline` 属性是否保留

### 修复阶段（根据诊断结果）

#### 可能的修复方案 A: 环境变量修复

如果问题是环境变量未正确传递：

1. 确保 GitHub Actions 中的 `env` 部分正确设置
2. 验证 Astro 配置中的 `vite.define` 正确读取环境变量
3. 如果需要，添加回退值以确保不为空

#### 可能的修复方案 B: 构建配置修复

如果问题是 `import.meta.env.PROD` 评估：

1. 修改构建脚本确保 `NODE_ENV=production` 被正确传递
2. 或者修改 Clarity 组件逻辑，使用 `Astro.env` 替代 `import.meta.env.PROD`

#### 可能的修复方案 C: 组件集成修复

如果问题是组件未正确集成：

1. 对于 docs: 确保 StarlightFooter.astro 在所有页面被使用
2. 对于 website: 考虑创建布局包装器而非在每个页面单独引用

## 影响

### 预期成果

修复完成后：
- 所有页面应正确加载 Microsoft Clarity 分析脚本
- 用户行为数据将被准确追踪
- 部署流程应稳定可靠地传递环境变量

### 验证标准

1. **构建验证**: 本地构建输出的 HTML 应包含 Clarity `<script>` 标签
2. **生产验证**: 在生产环境页面中，浏览器开发者工具 Network 标签应显示 Clarity 脚本已加载
3. **数据验证**: Clarity Dashboard 应显示实时用户数据
4. **CI/CD 验证**: GitHub Actions 部署日志应显示环境变量成功注入

### 风险评估

- **低风险**: 修复仅涉及分析脚本，不影响核心功能
- **回退方案**: 如有问题可临时移除 Clarity 组件
- **测试要求**: 修复后需在本地和生产环境验证

## 依赖关系

### 依赖

- GitHub Secrets `CLARITY_PROJECT_ID` 已配置
- Astro 5.6 构建配置正常工作

### 阻塞因素

无

## 后续工作

- [ ] 诊断并确定根因
- [ ] 实施修复方案
- [ ] 本地验证
- [ ] 生产部署
- [ ] 验证 Clarity 数据收集

## 参考资料

- [Microsoft Clarity 官方文档](https://learn.microsoft.com/en-us/clarity/)
- [Astro 环境变量文档](https://docs.astro.build/en/guides/environment-variables/)
- [Starlight 组件覆盖指南](https://starlight.astro.build/guides/overriding-components/)
- [之前关于 Clarity 集成的博客文章](https://hagicode.com/blog/2026-02-04-starlight-docs-integration-microsoft-clarity/)
