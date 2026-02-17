# 分离链接验证与构建流程

## 概述

将链接验证逻辑从 Astro 构建过程中分离，使构建和链接质量检查成为独立的流程。这确保站点发布不会因链接问题被阻塞，同时保留独立链接检查工作流作为质量保障手段。

## 背景

### 当前状态

项目使用 **astro-link-validator** 集成在两个站点的构建配置中：

- `apps/docs/astro.config.mjs` - 文档站点
- `apps/website/astro.config.mjs` - 营销站点

两个配置均设置了：

```javascript
linkValidator({
  checkExternal: process.env.CI === "true",
  failOnBrokenLinks: process.env.CI === "true",
  // ...
})
```

同时项目拥有独立的 **Link Check GitHub Action** (`.github/workflows/link-check.yml`)，定期执行链接检查并通过 Issue 报告结果。

### 部署流程

- **生产环境**: Azure Static Web Apps
- **部署触发**: push 到 main 分支
- **部署工作流**:
  - `.github/workflows/azure-deploy-docs.yml`
  - `.github/workflows/azure-deploy-website.yml`

## 问题

1. **构建与验证耦合** - `failOnBrokenLinks: true` 导致链接验证失败时阻止整个构建
2. **发布阻塞风险** - 损坏的链接会阻止站点正常部署到生产环境
3. **职责混淆** - 构建的目标是生成静态站点，链接验证应该是独立的质量检查步骤
4. **重复验证** - 已有独立的 LinkValidator Action，构建时的验证显得冗余

## 解决方案

### 核心变更

将 `astro-link-validator` 的 `failOnBrokenLinks` 配置从 `true` 改为 `false`，使链接损坏时仅发出警告而不抛出错误。

### 修改范围

| 文件 | 变更 |
|------|------|
| `apps/docs/astro.config.mjs` | `failOnBrokenLinks: process.env.CI === "true"` → `failOnBrokenLinks: false` |
| `apps/website/astro.config.mjs` | `failOnBrokenLinks: process.env.CI === "true"` → `failOnBrokenLinks: false` |

### 保留的验证

独立的 `link-check.yml` 工作流继续执行：
- 定时检查（每日 UTC 2:00）
- PR 检查（当文档内容变更时）
- Issue 报告（发现失效链接时自动创建或更新）

## 影响

### 正面影响

| 方面 | 改善 |
|------|------|
| **部署可靠性** | 站点发布不再因链接问题被阻塞 |
| **职责清晰** | 构建负责生成站点，LinkValidator 负责质量检查 |
| **开发体验** | 本地构建和 CI 构建更加稳定 |
| **灵活性** | 可以先部署站点，稍后修复链接问题 |

### 需要注意

| 关注点 | 说明 |
|--------|------|
| **链接质量** | 需要定期查看 LinkValidator 的检查报告 |
| **PR 审查** | 建议在 PR 合并前确认 LinkValidator 检查通过 |
| **文档更新** | 可能需要更新开发文档，说明新的验证流程 |

## 实施策略

1. 修改两个 `astro.config.mjs` 文件中的 `failOnBrokenLinks` 配置
2. 验证本地构建和 CI 构建正常工作
3. 确认 `link-check.yml` 工作流继续正常运作

## 成功标准

- [ ] 构建不再因损坏的链接而失败
- [ ] 损坏的链接在构建日志中显示为警告
- [ ] `link-check.yml` 工作流继续正常检测和报告失效链接
- [ ] 站点能够成功部署到 Azure Static Web Apps（即使存在损坏链接）

## 替代方案

### 方案 A（已选）：修改 failOnBrokenLinks

**优点**：配置简单，影响范围明确
**缺点**：构建时链接问题仅警告，可能被忽略

### 方案 B：完全移除 astro-link-validator

**优点**：彻底解耦
**缺点**：失去构建时的即时反馈

### 方案 C：保持现状

**优点**：严格的质量控制
**缺点**：链接问题会阻塞部署

## 相关资源

- [astro-link-validator 文档](https://github.com/HiDeoo/astro-link-validator)
- `.github/workflows/link-check.yml` - 独立链接检查工作流
- `.github/workflows/azure-deploy-docs.yml` - 文档站点部署
- `.github/workflows/azure-deploy-website.yml` - 营销站点部署
