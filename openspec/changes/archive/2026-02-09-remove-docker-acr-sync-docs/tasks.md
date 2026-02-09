# 移除 Docker ACR 同步工作流 - 实施任务

**关联提案**: [remove-docker-acr-sync-docs](./proposal.md)
**变更 ID**: `remove-docker-acr-sync-docs`

**重要**: 本变更仅移除工作流和内部设计文档，用户文档保持不变。

---

## 任务清单

### 阶段 1: 准备与验证

- [ ] **1.1 确认外部依赖检查**
  - 搜索是否有外部文档链接到将要删除的内容
  - 如有，记录需要更新的外部引用

- [ ] **1.2 创建功能分支**
  ```bash
  git checkout -b remove-docker-acr-sync-docs
  ```

### 阶段 2: 删除文件

- [ ] **2.1 删除 GitHub Actions 工作流**
  ```bash
  rm .github/workflows/sync-docker-acr.yml
  ```

- [ ] **2.2 删除 OpenSpec 设计文档**
  ```bash
  rm -rf openspec/changes/archive/2026-01-25-github-actions-docker-acr-sync/
  rm -rf openspec/changes/archive/2026-01-28-aliyun-mirror-repository-sync/
  ```

### 阶段 3: 验证用户文档完整性

- [ ] **3.1 确认用户文档保持不变**
  - 确认 `src/content/docs/blog/2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github.mdx` 存在
  - 确认 `src/content/docs/installation/docker-compose.mdx` 中的 ACR 镜像源配置保留
  - 确认 `.media-console/sync-manifest.json` 未被修改

### 阶段 4: 验证

- [ ] **4.1 类型检查**
  ```bash
  npm run typecheck
  ```

- [ ] **4.2 构建检查**
  ```bash
  npm run build
  ```
  - 确保无链接错误
  - 确保无构建警告

- [ ] **4.3 本地开发服务器测试**
  ```bash
  npm run dev
  ```
  - 访问 http://localhost:4321
  - 检查站点是否正常运行
  - 检查导航菜单是否正常

- [ ] **4.4 验证已删除内容**
  - 确认工作流文件已删除
  - 确认 OpenSpec 设计文档已删除

- [ ] **4.5 验证用户文档保持完整**
  - 确认博客文章仍可访问
  - 确认部署文档中 ACR 镜像源配置保留

### 阶段 5: 提交与 PR

- [ ] **5.1 提交变更**
  ```bash
  git add .
  git commit -m "$(cat <<'EOF'
chore: remove Docker ACR sync workflow

- Remove GitHub Actions workflow for ACR sync
- Remove OpenSpec design docs for ACR sync
- User documentation remains unchanged

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
  ```

- [ ] **5.2 推送分支**
  ```bash
  git push -u origin remove-docker-acr-sync-docs
  ```

- [ ] **5.3 创建 Pull Request**
  - 使用 `gh pr create` 或在 GitHub Web UI 中创建 PR
  - PR 标题: "chore: remove Docker ACR sync workflow"
  - PR 描述引用此提案

---

## 回滚计划

如需回滚此变更：

1. 恢复已删除的文件：
   ```bash
   git revert <commit-hash>
   ```

2. 或从主分支重新创建功能分支并恢复内容

---

## 完成确认

- [ ] 所有任务已完成
- [ ] CI/CD 检查通过
- [ ] 代码审查已通过
- [ ] PR 已合并到主分支
- [ ] 功能分支已删除
