# 修复 InstallButton React Hook 错误 - 实施任务

## 1. 诊断阶段

- [ ] 1.1 验证当前问题
  - [ ] 运行 `npm run dev:docs` 启动文档站点开发服务器
  - [ ] 导航到 `/installation/desktop` 页面
  - [ ] 确认浏览器控制台中的错误信息：`Cannot read properties of null (reading 'useState')`
  - [ ] 记录完整的错误堆栈信息

- [ ] 1.2 检查 Astro React 集成配置
  - [ ] 验证 `apps/docs/astro.config.mjs` 中 React 集成是否正确配置
  - [ ] 确认 `@astrojs/react` 版本（当前版本 ^4.4.2）
  - [ ] 检查 React 集成是否在 `integrations` 数组中正确注册
  - [ ] 验证 `@astrojs/mdx` 集成配置（MDX 支持）

- [ ] 1.3 分析 InstallButton 组件实现
  - [ ] 审查 `apps/docs/src/components/InstallButton.tsx` 组件代码
  - [ ] 确认所有 React Hooks 调用（useState、useEffect、useMemo）
  - [ ] 检查组件是否仅使用客户端可用的 API
  - [ ] 验证组件导入语句（React、useState 等）

## 2. 修复实施

- [ ] 2.1 调整客户端指令策略（首选方案）
  - [ ] 修改 `apps/docs/src/content/docs/installation/desktop.mdx`
  - [ ] 将 `client:load` 改为 `client:visible`
  - [ ] 测试组件在页面可见时正确水合
  - [ ] 如果 `client:visible` 不工作，尝试 `client:idle`

- [ ] 2.2 添加服务端兼容性检查（备选方案）
  - [ ] 在 `InstallButton.tsx` 组件中添加环境检查
  - [ ] 在使用 Hooks 前检查 `typeof window !== 'undefined'`
  - [ ] 添加服务端渲染的降级 UI（显示简单链接）
  - [ ] 确保客户端水合后显示完整功能

- [ ] 2.3 验证 React 集成配置（如需要）
  - [ ] 检查 `astro.config.mjs` 中的 React 集成配置
  - [ ] 确认 React 集成版本与 Astro 版本兼容
  - [ ] 验证 MDX 集成与 React 集成的协同工作
  - [ ] 如需要，更新 `@astrojs/react` 到最新兼容版本

## 3. 测试验证

- [ ] 3.1 开发环境测试
  - [ ] 运行 `npm run dev:docs` 启动开发服务器
  - [ ] 导航到 `/installation/desktop` 页面
  - [ ] 检查浏览器控制台是否清除错误
  - [ ] 验证下载按钮正常显示
  - [ ] 测试平台检测功能
  - [ ] 测试下拉菜单展开/收起
  - [ ] 测试不同平台选项的显示

- [ ] 3.2 生产构建测试
  - [ ] 运行 `npm run build:docs` 构建文档站点
  - [ ] 确保构建无错误或警告
  - [ ] 运行 `npm run preview:docs` 预览生产构建
  - [ ] 验证生产环境中的组件功能正常

- [ ] 3.3 TypeScript 类型检查
  - [ ] 运行 `npm run typecheck` 确保无类型错误
  - [ ] 验证组件 Props 接口正确
  - [ ] 确认所有导入语句类型正确

- [ ] 3.4 跨浏览器测试
  - [ ] 在 Chrome 中测试组件功能
  - [ ] 在 Firefox 中测试组件功能
  - [ ] 在 Safari 中测试组件功能
  - [ ] 在 Edge 中测试组件功能
  - [ ] 验证所有浏览器中控制台无错误

## 4. 文档更新

- [ ] 4.1 更新代码注释
  - [ ] 在 `desktop.mdx` 中添加注释说明客户端指令的选择原因
  - [ ] 在 `InstallButton.tsx` 中添加环境检查的说明（如适用）
  - [ ] 更新组件 JSDoc 注释

- [ ] 4.2 更新项目文档（如需要）
  - [ ] 如创建了新的组件使用模式，更新相关文档
  - [ ] 如修复了通用问题，考虑在项目中共享经验

## 5. 清理和收尾

- [ ] 5.1 代码审查准备
  - [ ] 确保所有更改符合项目代码风格
  - [ ] 移除任何调试代码或 console.log
  - [ ] 验证代码符合 TypeScript 严格模式要求

- [ ] 5.2 提交前最终检查
  - [ ] 运行完整的测试套件
  - [ ] 确认所有任务都已完成
  - [ ] 准备清晰的 PR 描述
