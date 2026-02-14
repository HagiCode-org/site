## 1. Implementation

- [ ] 1.1 在 `packages/shared/src/version.ts` 中添加 `compareVersions` 和 `parseSemver` 函数导出
- [ ] 1.2 更新 `packages/shared/src/index.ts` 导出新函数
- [ ] 1.3 创建 `packages/shared/test/version.test.ts` 测试文件
- [ ] 1.4 添加边界情况测试用例（v0.1.9 vs v0.1.10、v1.10.0 vs v1.9.9、预发布版本）
- [ ] 1.5 运行测试验证所有用例通过
- [ ] 1.6 运行 TypeScript 类型检查
- [ ] 1.7 运行构建验证无错误
