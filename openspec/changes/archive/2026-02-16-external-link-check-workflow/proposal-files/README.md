# External Link Check Workflow

外部链接自动检查工作流实现文档。

## 概述

本项目实现了基于 `astro-link-validator` 的外部链接自动检查机制，通过 GitHub Actions 工作流每天定时检查文档站点和营销站点中的外部链接，并在发现失效链接时自动创建或更新 GitHub Issue。

## 实现组件

### 1. Astro 集成

**docs 站点**: `apps/docs/astro.config.mjs`
**website 站点**: `apps/website/astro.config.mjs`

两个站点都配置了 `astro-link-validator` 集成：

```javascript
linkValidator({
    // 仅在 CI 环境中启用外部链接检查
    checkExternal: process.env.CI === 'true',
    // 外部链接超时时间（毫秒）
    externalTimeout: 10000,
    // 仅在 CI 环境中对失效链接使构建失败
    failOnBrokenLinks: process.env.CI === 'true',
    // 详细输出（用于调试）
    verbose: process.env.CI === 'true',
    // 排除某些路径
    exclude: [],
})
```

### 2. GitHub Actions 工作流

**文件**: `.github/workflows/link-check.yml`

工作流特性：
- **定时触发**: 每天 UTC 2:00 (北京时间 10:00)
- **手动触发**: 支持从 GitHub Actions UI 手动触发
- **PR 触发**: 当文档或网站文件变更时触发
- **权限**: 需要 `contents: read` 和 `issues: write`

### 3. 链接检查解析脚本

**文件**: `scripts/parse-link-check.js`

功能：
- 解析 astro-link-validator 的构建日志
- 提取失效链接信息
- 生成 JSON 格式报告
- 设置 GitHub Actions 输出变量

## 使用方法

### 本地测试

```bash
# 测试网站构建（不检查外部链接）
cd apps/website
npm run build

# 测试文档站点构建（不检查外部链接）
cd apps/docs
npm run build

# 启用外部链接检查（仅推荐在 CI 环境使用）
CI=true npm run build
```

### 手动触发 GitHub Actions

1. 访问 GitHub 仓库的 Actions 页面
2. 选择 "Link Check" 工作流
3. 点击 "Run workflow" 按钮
4. 选择分支并运行

### 配置排除规则

如需排除特定路径或域名，可在 `astro.config.mjs` 中配置 `exclude` 选项：

```javascript
linkValidator({
    exclude: [
        '/api/*',
        '/admin/*',
        'https://example.com/*'
    ]
})
```

## GitHub Issue 格式

当发现失效链接时，会自动创建或更新 GitHub Issue：

**标题格式**: `[链接检查] 发现失效外部链接 - YYYY-MM-DD`

**Issue 内容**:
```markdown
## 检查日期
2026-02-16

## 检查结果
发现 5 个失效的外部链接：

| 站点 | 文件路径 | 行号 | 链接 | 状态码 |
|------|---------|------|------|--------|
| docs | src/content/docs/guide.md | 42 | `https://example.com/broken` | 404 |

## 建议操作
- 修复失效链接
- 或将其添加到排除列表（在 astro.config.mjs 中配置 exclude 选项）

---
此 Issue 由链接检查工作流自动创建
**运行详情**: [链接到运行]
```

## 维护

### 更新 astro-link-validator

```bash
# 在两个应用目录中分别更新
cd apps/docs
npm update github:rodgtr1/astro-link-validator

cd apps/website
npm update github:rodgtr1/astro-link-validator
```

### 调整检查时间

编辑 `.github/workflows/link-check.yml` 中的 cron 表达式：

```yaml
schedule:
    - cron: '0 2 * * *'  # 每天 UTC 2:00
```

### 调整超时时间

在 `astro.config.mjs` 中修改 `externalTimeout` 选项（单位：毫秒）。

## 故障排查

### 构建失败

如果 GitHub Actions 构建失败，检查：
1. 构建日志中的失效链接信息
2. 是否有网络问题导致外部链接检查超时
3. astro-link-validator 是否正常工作

### 本地构建缓慢

如果本地构建缓慢，确保 `checkExternal` 在非 CI 环境中设置为 `false`。

### Issue 未创建

如果发现失效链接但 Issue 未创建，检查：
1. GitHub Actions 权限是否正确
2. `GITHUB_TOKEN` 是否可用
3. 查看工作流日志中的错误信息

## 参考资料

- [astro-link-validator GitHub](https://github.com/rodgtr1/astro-link-validator)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [OpenSpec 提案](./proposal.md)
