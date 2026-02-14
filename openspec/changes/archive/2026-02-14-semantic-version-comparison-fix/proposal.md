# Change: 修复语义化版本号比较逻辑

## Why

当前版本监控系统的语义化版本比较逻辑存在两个问题：

1. **实现重复**：`scripts/version-monitor.js` 中已有完整的 `compareVersions` 和 `parseSemver` 实现，但没有被其他模块复用
2. **缺失导出**：`packages/shared/src/version.ts` 仅提供版本数据读取功能，没有导出版本比较工具供其他模块使用
3. **缺少测试**：版本比较逻辑没有自动化测试覆盖，边界情况（如 `v0.1.9` vs `v0.1.10`）未经验证

这导致：
- 版本监控脚本虽然内部实现正确，但无法被文档站点、营销站点的其他模块使用
- 未来若需在客户端或服务端进行版本比较，需要重复实现相同逻辑
- 无法保证版本比较逻辑的正确性和一致性

## What Changes

- 在 `packages/shared/src/version.ts` 中导出语义化版本比较函数（`compareVersions`、`parseSemver`）
- 添加完整的单元测试覆盖边界情况
- 更新 `packages/shared/src/index.ts` 导出新增的比较函数
- 为版本监控系统创建独立规范文档

**技术要点**：
- 复用 `scripts/version-monitor.js` 中已验证的实现逻辑
- 支持预发布标签比较（alpha、beta、rc、preview 等）
- TypeScript 类型安全
- 测试覆盖：`v0.1.9` vs `v0.1.10`、`v1.10.0` vs `v1.9.9`、`v2.0.0` vs `v1.99.99`、预发布版本

## Impact

- Affected specs: `version-monitoring` (new)
- Affected code:
  - `packages/shared/src/version.ts` - 添加比较函数导出
  - `packages/shared/src/index.ts` - 更新导出列表
  - `packages/shared/test/version.test.ts` - 新增测试文件
