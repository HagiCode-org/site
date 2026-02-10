## 1. 脚本配置更新

- [ ] 1.1 更新 `scripts/update-activity-metrics.js` 中的 `CONFIG.outputFile` 路径
  - 从: `path.join(__dirname, '../public/activity-metrics.json')`
  - 改为: `path.join(__dirname, '../apps/website/public/activity-metrics.json')`

- [ ] 1.2 本地测试脚本确保输出到正确位置
  ```bash
  npm run update-metrics
  cat apps/website/public/activity-metrics.json
  ```

## 2. GitHub Action 工作流更新

- [ ] 2.1 更新 `.github/workflows/update-activity-metrics.yml` 第 54 行
  - 从: `NEW_DATA=$(cat public/activity-metrics.json)`
  - 改为: `NEW_DATA=$(cat apps/website/public/activity-metrics.json)`

- [ ] 2.2 更新 `.github/workflows/update-activity-metrics.yml` 第 58 行
  - 从: `git show main:public/activity-metrics.json`
  - 改为: `git show main:apps/website/public/activity-metrics.json`

- [ ] 2.3 更新 `.github/workflows/update-activity-metrics.yml` 第 194 行
  - 从: `git add public/activity-metrics.json`
  - 改为: `git add apps/website/public/activity-metrics.json`

- [ ] 2.4 更新 `.github/workflows/update-activity-metrics.yml` 第 240-243 行
  - 从: `jq -r '.dockerHub.pullCount' public/activity-metrics.json`
  - 改为: `jq -r '.dockerHub.pullCount' apps/website/public/activity-metrics.json`
  - 从: `jq -r '.clarity.activeUsers' public/activity-metrics.json`
  - 改为: `jq -r '.clarity.activeUsers' apps/website/public/activity-metrics.json`
  - 从: `jq -r '.clarity.activeSessions' public/activity-metrics.json`
  - 改为: `jq -r '.clarity.activeSessions' apps/website/public/activity-metrics.json`
  - 从: `jq -r '.lastUpdated' public/activity-metrics.json`
  - 改为: `jq -r '.lastUpdated' apps/website/public/activity-metrics.json`

- [ ] 2.5 更新 `.github/workflows/update-activity-metrics.yml` 第 281-286 行
  - 同样更新 Summary 步骤中的路径引用

## 3. 数据文件迁移

- [ ] 3.1 创建 `apps/website/public/` 目录（如果不存在）
- [ ] 3.2 从现有位置复制 `activity-metrics.json` 到 `apps/website/public/`
  - 优先从根目录 `public/activity-metrics.json` 复制
  - 如果根目录不存在，从 `apps/docs/public/activity-metrics.json` 复制

- [ ] 3.3 验证 `apps/website/public/activity-metrics.json` 文件内容格式正确
  ```bash
  jq . apps/website/public/activity-metrics.json
  ```

## 4. 清理残留文件

- [ ] 4.1 确认 `apps/website/public/activity-metrics.json` 存在且包含最新数据
- [ ] 4.2 删除根目录的 `public/activity-metrics.json`（如果存在）
- [ ] 4.3 删除根目录的 `data/activity-metrics.json`（如果存在）
- [ ] 4.4 删除 `apps/docs/public/activity-metrics.json`（如果存在，这是误放的位置）

## 5. 验证和测试

- [ ] 5.1 本地运行脚本验证输出路径
  ```bash
  npm run update-metrics
  ```

- [ ] 5.2 验证文件内容格式正确
  ```bash
  jq . apps/website/public/activity-metrics.json
  ```

- [ ] 5.3 通过 GitHub Actions UI 手动触发工作流测试
  - 使用 `workflow_dispatch` 触发 `Update Activity Metrics`
  - 验证 PR 能正确创建
  - 验证 PR 中的文件路径正确（`apps/website/public/activity-metrics.json`）

- [ ] 5.4 合并 PR 后验证自动部署正常工作

## 6. 更新文档

- [ ] 6.1 更新相关文档中的路径引用（如有）
- [ ] 6.2 更新 README 或贡献指南中的环境变量配置说明（如有）
