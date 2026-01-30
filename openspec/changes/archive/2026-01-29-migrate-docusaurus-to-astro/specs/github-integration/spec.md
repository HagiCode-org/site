# GitHub 集成规范

## 规范元数据

- **规范 ID**: `github-integration`
- **提案 ID**: `migrate-docusaurus-to-astro`
- **创建日期**: 2026-01-29
- **状态**: 活跃

---

## 概述

该规范定义了 GitHub 与 Hagicode 文档站点的集成配置,包括 CI/CD 工作流和发布流程。

---

## CI/CD 配置

### GitHub Actions 工作流

**文件**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          CLARITY_PROJECT_ID: ${{ secrets.CLARITY_PROJECT_ID }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 工作流详解

#### 触发条件

```yaml
on:
  push:
    branches:
      - main
```

- 仅当代码推送到 `main` 分支时触发
- 支持取消正在进行的任务

#### 权限配置

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

- `contents: read` - 读取仓库内容
- `pages: write` - 写入 GitHub Pages
- `id-token: write` - 生成 OIDC token 用于部署

#### 构建过程

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: "20"
      cache: "npm"
  - run: npm ci
  - run: npm run build
  - uses: actions/upload-pages-artifact@v3
    with:
      path: ./dist
```

- 使用 Node.js 20 版本
- 启用 npm 缓存
- 安装所有依赖
- 运行生产构建
- 上传构建产物到 GitHub Pages

#### 部署过程

```yaml
deploy:
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  runs-on: ubuntu-latest
  needs: build
  steps:
    - uses: actions/deploy-pages@v4
```

- 部署到 `github-pages` 环境
- 显示部署后的页面 URL
- 使用官方的部署操作

---

## 环境变量

### 机密变量 (Secrets)

#### CLARITY_PROJECT_ID

**用途**: 配置 Microsoft Clarity 分析 ID

**设置位置**:
1. 仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 名称: `CLARITY_PROJECT_ID`
4. 值: 从 Clarity 控制台获取的项目 ID

#### 范围

```yaml
env:
  CLARITY_PROJECT_ID: ${{ secrets.CLARITY_PROJECT_ID }}
```

- 仅在 `build` 步骤中可用
- 安全地传递到构建过程
- 在构建时注入到 `astro.config.mjs` 中

---

## 构建配置

### 输出目录

**设置**: `astro.config.mjs`

```javascript
export default defineConfig({
  build: {
    outDir: 'dist',
  },
});
```

**上传路径**: `.github/workflows/deploy.yml`

```yaml
- uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

### 构建命令

**设置**: `package.json`

```json
{
  "scripts": {
    "build": "astro build"
  }
}
```

**执行**: `.github/workflows/deploy.yml`

```yaml
- name: Build
  run: npm run build
```

---

## 分支策略

### 保护分支

**Main 分支保护**:
- 要求通过 PR 合并
- 禁止直接推送
- 要求状态检查通过

### 分支命名规范

**生产分支**:
- `main` - 生产环境

**特性分支**:
- `feat/` - 新功能
- `fix/` - 修复
- `docs/` - 文档
- `chore/` - 杂项

### PR 流程

1. 从 `main` 分支创建新分支
2. 进行修改
3. 创建 PR 到 `main` 分支
4. 至少一个审查者批准
5. 状态检查通过
6. 合并到 `main` 触发部署

---

## 发布流程

### 自动部署

每次代码推送到 `main` 分支:

```
Push → GitHub Actions → Build → Deploy → GitHub Pages
```

### 部署时间

- 构建时间: < 2 分钟
- 部署时间: < 1 分钟
- 总时间: < 3 分钟

### 部署状态

在 PR 页面显示:

- ✅ 已部署
- ⏳ 部署中
- ❌ 部署失败

---

## 监控和告警

### 部署通知

GitHub Pages 部署提供:
- PR 页面状态指示器
- 部署历史记录
- 失败时发送通知

### 性能监控

使用 Microsoft Clarity 和 Lighthouse:
- 实时用户会话记录
- 页面性能指标
- 错误追踪

---

## 回滚策略

### 快速回滚

如果生产环境发现严重问题:

1. 查看 PR 历史记录
2. 找到导致问题的 PR
3. 在 PR 页面点击 "Revert"
4. 创建回滚 PR 并合并
5. 自动部署新的生产版本

### 备份分支

每个迁移阶段创建备份分支:

```bash
git checkout -b backup-astro-migration-<date>
```

### 手动回滚

```bash
# 查看历史提交
git log --oneline

# 回滚到指定提交
git revert <commit-hash>

# 或者硬回滚(谨慎使用)
git reset --hard <commit-hash>
git push --force
```

---

## 故障排除

### 部署失败

#### 常见原因

1. **依赖安装失败**
   - 网络问题
   - npm registry 问题

2. **构建失败**
   - TypeScript 错误
   - 文件路径问题
   - 资源不存在

3. **部署失败**
   - Pages 服务问题
   - 权限问题
   - 资源限制

#### 调试步骤

1. 查看 Actions 日志
2. 检查构建过程输出
3. 在本地重现问题
4. 修复后重新触发

### 性能问题

#### 构建时间过长

- 优化依赖
- 减少文件扫描范围
- 并行处理任务

#### 页面加载缓慢

- 优化图片资源
- 减少 JavaScript
- 使用 CDN 加速

---

## 版本控制规范

### 提交消息格式

```
type(scope): subject
```

**类型**:
- `feat` - 新功能
- `fix` - 修复
- `docs` - 文档
- `style` - 样式
- `refactor` - 重构
- `test` - 测试
- `chore` - 杂项

**范围**:
- `site` - 站点架构
- `content` - 内容
- `ci` - CI/CD
- `config` - 配置

**示例**:
```
feat(site): 添加博客列表页面
fix(content): 修复文档路由
docs(ci): 更新部署说明
```

### 标签和发布

使用语义化版本控制:
- `v1.0.0` - 主要版本
- `v1.1.0` - 次要版本
- `v1.1.1` - 补丁版本

---

## 安全规范

### 机密管理

- 所有机密必须存储在 GitHub Secrets 中
- 禁止硬编码机密到代码中
- 定期轮换机密

### 依赖安全

定期检查依赖安全:

```bash
npm audit
npm audit fix
```

### 代码审查

- 所有 PR 必须经过至少一个审查者
- 审查者应检查安全问题
- 禁止直接推送生产分支

---

## 最佳实践

### 预部署测试

在 PR 阶段进行:

1. 类型检查
2. 构建测试
3. 视觉回归测试

### 渐进式交付

使用 Canary 分支:

```bash
# 创建 Canary 分支
git checkout -b canary/feature-name

# 测试后合并到 main
git checkout main
git merge canary/feature-name
```

### 部署窗口

选择低流量时段部署,例如:
- 夜间(UTC 夜间)
- 周末
- 维护窗口

---

## 参考资料

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Pages 部署](https://docs.github.com/en/pages)
- [OpenSpec 文档](https://github.com/open-spec)
- [Astro 部署指南](https://docs.astro.build/en/guides/deploy/github/)
