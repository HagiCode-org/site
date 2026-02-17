# 实施任务清单

## 任务概述

本变更将链接验证从 Astro 构建过程中分离，使构建失败不再因链接问题而被阻塞。

---

## 阶段 1：配置修改

### 任务 1.1：修改文档站点配置

**文件**: `apps/docs/astro.config.mjs`

**操作**: 修改 `linkValidator` 配置

```javascript
// 修改前
linkValidator({
  checkExternal: process.env.CI === "true",
  failOnBrokenLinks: process.env.CI === "true",
  // ...
})

// 修改后
linkValidator({
  checkExternal: process.env.CI === "true",
  failOnBrokenLinks: false,  // 改为 false
  // ...
})
```

**验证**: 确认配置已正确更新

---

### 任务 1.2：修改营销站点配置

**文件**: `apps/website/astro.config.mjs`

**操作**: 修改 `linkValidator` 配置（同任务 1.1）

```javascript
// 修改前
linkValidator({
  checkExternal: process.env.CI === 'true',
  failOnBrokenLinks: process.env.CI === 'true',
  // ...
})

// 修改后
linkValidator({
  checkExternal: process.env.CI === 'true',
  failOnBrokenLinks: false,  // 改为 false
  // ...
})
```

**验证**: 确认配置已正确更新

---

## 阶段 2：本地验证

### 任务 2.1：验证本地构建

**命令**:
```bash
npm run build:docs
npm run build:website
```

**预期结果**:
- 构建成功完成
- 即使存在损坏的链接，构建也不会失败
- 损坏的链接会在构建输出中显示为警告

**验证点**:
- [ ] 文档站点构建成功
- [ ] 营销站点构建成功
- [ ] 构建日志中如有损坏链接，显示为警告而非错误

---

## 阶段 3：CI 验证

### 任务 3.1：验证部署工作流

**操作**: 创建测试 PR 或推送到分支

**验证点**:
- [ ] Azure 部署工作流成功完成
- [ ] 即使存在损坏链接，部署也能成功
- [ ] 站点能够正常访问

---

### 任务 3.2：验证链接检查工作流

**操作**: 手动触发或等待定时执行 `.github/workflows/link-check.yml`

**验证点**:
- [ ] 链接检查工作流正常执行
- [ ] 如有损坏链接，Issue 能够正确创建或更新
- [ ] 检查结果包含完整的链接信息

---

## 阶段 4：文档更新（可选）

### 任务 4.1：更新开发文档

**说明**: 如项目有关于构建和部署流程的文档，更新相关说明

**内容**:
- 链接验证由独立的 `link-check.yml` 工作流负责
- 构建不再因链接问题而失败
- 定期查看链接检查报告

---

## 任务顺序

```
1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 4.1（可选）
                ↓
            (可并行)
```

---

## 完成标准

所有任务完成后，应满足以下条件：

1. **构建不受链接影响**: 即使存在损坏的链接，两个站点的构建都能成功完成
2. **警告正常显示**: 损坏的链接在构建日志中以警告形式显示
3. **部署正常工作**: Azure 部署工作流能够成功部署站点
4. **独立检查正常**: `link-check.yml` 继续正常检测和报告失效链接
5. **文档已更新**: 相关文档已反映新的验证流程（如适用）

---

## 回滚计划

如需回滚此变更：

1. 将两个 `astro.config.mjs` 文件中的 `failOnBrokenLinks` 改回 `process.env.CI === "true"`
2. 重新部署站点

---

## 相关文件

| 文件路径 | 说明 |
|----------|------|
| `apps/docs/astro.config.mjs` | 文档站点 Astro 配置 |
| `apps/website/astro.config.mjs` | 营销站点 Astro 配置 |
| `.github/workflows/azure-deploy-docs.yml` | 文档站点部署工作流 |
| `.github/workflows/azure-deploy-website.yml` | 营销站点部署工作流 |
| `.github/workflows/link-check.yml` | 独立链接检查工作流 |
