# 实施任务清单

## 1. 版本文件迁移

- [ ] 1.1 验证当前版本文件状态
  - [ ] 确认 `public/version-index.json` 存在
  - [ ] 确认 `apps/docs/public/version-index.json` 存在
  - [ ] 确认 `apps/website/public/version-index.json` 存在
  - [ ] 比较三个文件内容是否一致

- [ ] 1.2 迁移版本文件到 Docs 应用
  - [ ] 确认 `apps/docs/public/version-index.json` 为权威版本
  - [ ] 删除根目录 `public/version-index.json`
  - [ ] 删除 `apps/website/public/version-index.json`

- [ ] 1.3 更新 .gitignore (如需要)
  - [ ] 检查 `public/version-index.json` 是否需要添加到 .gitignore

## 2. Version Monitor 脚本更新

- [ ] 2.1 更新 version-monitor.js
  - [ ] 修改 `VERSION_INDEX_FILE` 常量: `'public/version-index.json'` → `'apps/docs/public/version-index.json'`
  - [ ] 更新 `updateLocalVersionIndex` 函数中的目录创建逻辑
  - [ ] 验证文件路径引用正确

- [ ] 2.2 添加错误处理
  - [ ] 确保在写入文件时 `apps/docs/public` 目录存在
  - [ ] 添加详细的日志输出用于调试

## 3. 共享工具函数创建

- [ ] 3.1 创建 version.ts
  - [ ] 创建 `packages/shared/src/version.ts`
  - [ ] 实现 `getVersionIndex()` 函数
  - [ ] 实现 `getLatestVersion()` 函数
  - [ ] 添加 TypeScript 类型定义
  - [ ] 添加 JSDoc 注释

- [ ] 3.2 导出版本工具函数
  - [ ] 更新 `packages/shared/src/index.ts`
  - [ ] 添加 `export * from './version'`

## 4. GitHub Actions 工作流更新

- [ ] 4.1 更新 version-monitor.yml
  - [ ] 更新 "Commit version changes" 步骤中的 git add 路径
  - [ ] 更新 PR 描述中的文件路径引用
  - [ ] 验证工作流可以正确访问和修改新路径

- [ ] 4.2 测试工作流
  - [ ] 手动触发 version-monitor 工作流
  - [ ] 验证 PR 创建成功
  - [ ] 验证 PR 包含正确的文件

## 5. Website 应用集成

- [ ] 5.1 验证共享包依赖
  - [ ] 确认 `apps/website/package.json` 包含 `@pcode-docs/shared` 依赖
  - [ ] 确认版本号正确

- [ ] 5.2 更新 Website 应用代码 (如需要)
  - [ ] 检查 Website 应用中是否有引用 `public/version-index.json` 的代码
  - [ ] 如果有,更新为使用共享包的版本工具函数
  - [ ] 测试版本数据获取功能

## 6. 部署验证

- [ ] 6.1 验证 Docs 应用部署
  - [ ] 确认 `deploy-docs.yml` 工作流包含 `apps/docs/public/version-index.json`
  - [ ] 验证部署后版本文件可访问

- [ ] 6.2 验证 Version Monitor 集成
  - [ ] 确认 Version Monitor PR 合并后触发 Docs 应用部署
  - [ ] 验证部署后的版本文件是最新的

## 7. 清理和文档

- [ ] 7.1 清理冗余文件
  - [ ] 删除 `public/version-index.json` (如果存在)
  - [ ] 删除 `apps/website/public/version-index.json` (如果存在)

- [ ] 7.2 更新相关文档
  - [ ] 更新 MonoRepo 架构文档
  - [ ] 更新 Version Monitor 使用说明
  - [ ] 更新开发者指南

## 8. 测试和验证

- [ ] 8.1 本地测试
  - [ ] 运行 `scripts/version-monitor.js` 验证路径更新
  - [ ] 验证文件写入到正确位置
  - [ ] 验证版本工具函数正常工作

- [ ] 8.2 CI/CD 测试
  - [ ] 触发 version-monitor 工作流
  - [ ] 验证 PR 创建成功
  - [ ] 合并 PR 验证 Docs 应用部署

- [ ] 8.3 回归测试
  - [ ] 验证现有功能未受影响
  - [ ] 验证 Website 应用正常运行
  - [ ] 验证 Docs 应用正常运行

## 9. 归档和完成

- [ ] 9.1 更新提案状态
  - [ ] 将所有任务标记为完成
  - [ ] 更新 proposal.md 中的状态为 "执行完成"

- [ ] 9.2 归档提案
  - [ ] 运行 `openspec archive adapt-version-monitor-for-monorepo-arg-value`
  - [ ] 验证归档成功
