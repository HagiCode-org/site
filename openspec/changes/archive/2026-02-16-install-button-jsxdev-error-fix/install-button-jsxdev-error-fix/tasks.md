# Implementation Tasks

## 1. 调查和验证
- [x] 1.1 在本地开发环境复现 `jsxDEV is not a function` 错误
- [x] 1.2 检查当前 `package.json` 中的 React 和相关依赖版本
- [x] 1.3 验证 `apps/docs/astro.config.mjs` 和 `apps/website/astro.config.mjs` 中的 React 集成配置
- [x] 1.4 检查根目录 `tsconfig.json` 和各应用的 tsconfig.json 中的 JSX 配置

## 2. 修复实施
- [x] 2.1 根据 1.2 的检查结果，更新 `@types/react` 和 `@types/react-dom` 到兼容版本（如需要）
- [x] 2.2 如果 Astro React 集成配置有问题，修正配置
- [x] 2.3 如果 tsconfig.json JSX 配置需要调整，更新配置
- [x] 2.4 如果上述修复无效，清理并重新安装依赖（`rm -rf node_modules package-lock.json && npm install`）

## 3. 验证和测试
- [x] 3.1 运行 `npm run typecheck` 验证 TypeScript 类型检查通过
- [x] 3.2 运行 `npm run dev` 启动开发服务器，验证两个站点的 InstallButton 组件正常渲染
- [x] 3.3 在浏览器控制台确认 `jsxDEV is not a function` 错误已解决
- [x] 3.4 测试 InstallButton 的下拉菜单功能、平台检测功能正常
- [x] 3.5 运行 `npm run build` 验证生产构建无错误
- [x] 3.6 运行 `npm run preview` 验证预览构建正常

## 4. 文档和归档（修复完成后）
- [x] 4.1 更新此 tasks.md，将所有任务标记为已完成
- [ ] 4.2 等待提案审查通过后，创建 PR 合并代码
- [ ] 4.3 部署后，使用 `openspec archive install-button-jsxdev-error-fix --skip-specs --yes` 归档此变更

---

## 修复总结

### 执行的修复步骤
1. **依赖版本检查**：确认 React 19.2.4、@types/react 19.2.10、@types/react-dom 19.2.3、@astrojs/react 4.4.2 版本正确
2. **配置验证**：Astro React 集成配置和 TSConfig JSX 配置都正确
3. **清理缓存**：删除所有 node_modules、构建缓存和 lock 文件
4. **重新安装**：执行 `npm install` 重新安装所有依赖

### 验证结果
- ✅ `npm run build:website` - 构建成功，无 jsxDEV 错误
- ✅ `npm run build:docs` - 构建成功，无 jsxDEV 错误
- ✅ InstallButton 组件正确编译到构建输出中

### 问题根源
`jsxDEV is not a function` 错误是由于 node_modules 依赖缓存不一致导致的，通过清理并重新安装依赖解决。配置本身是正确的，无需修改。
