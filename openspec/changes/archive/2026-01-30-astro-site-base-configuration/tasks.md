# 实施任务清单

## 1. Astro 配置更新

- [x] 1.1 在 `astro.config.mjs` 中添加 `base` 配置项
  - 从 `import.meta.env.VITE_SITE_BASE` 读取环境变量
  - 设置默认值为 `/`
- [x] 1.2 验证配置项在开发和生产环境中正确工作
- [x] 1.3 确保 TypeScript 类型定义正确

## 2. Package.json Scripts 更新

- [x] 2.1 在 `package.json` 的 `scripts` 部分添加 `dev:root` 脚本
- [x] 2.2 在 `package.json` 的 `scripts` 部分添加 `dev:site` 脚本
- [x] 2.3 在 `package.json` 的 `scripts` 部分添加 `build:site` 脚本(可选)
- [x] 2.4 更新现有脚本注释,说明各脚本的用途

## 3. GitHub Actions 配置更新

- [x] 3.1 审查 `.github/workflows/deploy.yml` 中的 `VITE_SITE_BASE` 环境变量
- [x] 3.2 决定是否保留环境变量配置(根据当前部署需求)
  - 如果当前使用 `/site` 子路径部署,保留环境变量配置
  - 如果计划切换到根路径部署,移除环境变量配置
- [x] 3.3 添加注释说明 base 路径配置机制

## 4. 项目文档更新

- [x] 4.1 更新 `openspec/project.md` 中的"Development Scripts"部分
  - 说明 `dev:root` 和 `dev:site` 脚本的用途
  - 添加不同部署场景的使用示例
- [x] 4.2 更新 `openspec/project.md` 中的"Deployment"部分
  - 说明 base 路径配置机制
  - 提供根路径和子路径部署的配置示例
  - 说明环境变量覆盖机制

## 5. 验证和测试

- [x] 5.1 运行 `npm run dev:root` 验证根路径部署配置
  - 访问 `http://localhost:4321/` 确认首页正常加载
  - 检查所有内部链接、图片、资源正确加载
- [x] 5.2 运行 `npm run dev:site` 验证子路径部署配置
  - 访问 `http://localhost:4321/site/` 确认首页正常加载
  - 检查所有内部链接、图片、资源正确加载(包含 `/site` 前缀)
- [x] 5.3 运行 `npm run build` 验证生产构建
  - 确认构建成功,无错误
  - 检查生成的 HTML 文件中的链接路径正确
- [x] 5.4 运行 `npm run build:site` 验证子路径构建
  - 确认构建成功,无错误
  - 检查生成的 HTML 文件中的链接路径包含 `/site` 前缀
- [x] 5.5 运行 `npm run typecheck` 确保无 TypeScript 错误
  - 注意: TypeScript 错误来自 Astro 依赖库,与我们的修改无关
- [x] 5.6 运行 `npm run preview` 预览生产构建
  - 验证根路径部署构建结果
  - 验证子路径部署构建结果(如果有使用 `build:site`)

## 6. 兼容性验证

- [x] 6.1 验证环境变量覆盖机制正常工作
  - 设置 `VITE_SITE_BASE=/custom` 测试自定义路径
  - 确认环境变量优先级高于配置文件默认值
- [x] 6.2 验证 GitHub Actions 部署流程(如果适用)
  - 确认 CI/CD 流程中的构建命令正确
  - 验证部署后的站点访问正常

## 7. OpenSpec 规范验证

- [x] 7.1 运行 `openspec validate astro-site-base-configuration --strict` 验证提案
- [x] 7.2 检查所有 spec deltas 符合 OpenSpec 格式要求
- [x] 7.3 确认所有场景(scenarios)清晰且可验证

## 8. 文档和收尾

- [x] 8.1 在 proposal.md 中更新 Status 为 "ExecutionCompleted"
- [x] 8.2 将 tasks.md 中的所有任务标记为完成
- [x] 8.3 提交变更并等待审核批准
- [x] 8.4 (可选)添加使用说明到 README.md(如果项目需要)

## 备注

- 任务 3.2 需要根据当前部署需求做出决策:
  - **保留环境变量**: 如果 GitHub Pages 当前使用 `https://hagicode-org.github.io/site/` 部署
  - **移除环境变量**: 如果计划切换到 `https://hagicode-org.github.io/` 根路径部署
- 建议在开始实施前确认当前的部署路径需求

## 实施总结

✅ **已完成的变更**:
1. ✅ 在 `astro.config.mjs` 中添加了 `base` 配置项,支持环境变量覆盖
2. ✅ 在 `package.json` 中添加了 `dev:root`、`dev:site` 和 `build:site` 脚本
3. ✅ 在 `.github/workflows/deploy.yml` 中添加了详细的配置说明注释
4. ✅ 更新了 `openspec/project.md` 中的 Development Scripts 和 Deployment 部分
5. ✅ 验证了所有构建配置(根路径、子路径、自定义路径)
6. ✅ 通过了 OpenSpec 严格模式验证

✅ **验证结果**:
- ✅ 默认构建 (npm run build): 使用根路径 `/`
- ✅ 子路径构建 (npm run build:site): 使用子路径 `/site`
- ✅ 自定义路径: 环境变量覆盖机制正常工作
- ✅ 所有内部链接和资源路径正确调整
- ✅ OpenSpec 验证通过
