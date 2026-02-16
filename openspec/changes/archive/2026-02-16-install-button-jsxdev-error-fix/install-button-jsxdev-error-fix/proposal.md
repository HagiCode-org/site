# Change: 修复 InstallButton jsxDEV 错误

## Why

InstallButton 组件在浏览器控制台报错 `Uncaught TypeError: jsxDEV is not a function`（第 206 行），导致组件渲染异常。此错误通常由 React 开发工具版本不兼容、React/React-DOM 版本与 JSX 转换配置不匹配，或 Astro React 集成配置问题引起。修复此错误对于确保用户能够正常使用下载功能至关重要。

## What Changes

- **更新 React 类型定义版本**：将 `@types/react` 和 `@types/react-dom` 更新到与 React 19.2.4 兼容的版本
- **验证 Astro React 集成配置**：确保 `astro.config.mjs` 中的 React 集成正确配置
- **检查 tsconfig.json JSX 配置**：验证 JSX 设置与 React 19 兼容（当前为 `jsx: "react-jsx"`）
- **重新安装依赖**：如果需要，清理并重新安装 node_modules 以确保依赖一致性

## UI Design Changes

无 UI 设计变更。此修复仅涉及依赖版本和配置调整，不改变组件的用户界面。

## Code Flow Changes

无代码流程变更。此修复仅涉及依赖版本和配置调整，不改变组件的执行逻辑。

## Impact

- **影响范围**：
  - `apps/docs/src/components/InstallButton.tsx` - 文档站点的 Header 导航栏
  - `apps/website/src/components/home/InstallButton.tsx` - 营销站点的 Hero 区域或 Header
- **影响功能**：InstallButton 组件的渲染和交互（平台检测、下拉菜单、版本选择）
- **回归风险**：低（仅涉及依赖更新，不修改组件逻辑）
- **测试要求**：
  - 在开发环境（`npm run dev`）测试两个站点的 InstallButton 组件
  - 在生产构建（`npm run build`）验证无错误
  - 确保下拉菜单功能、平台检测功能正常

## Affected Specs

- `specs/astro-site/spec.md` - React 集成配置要求
