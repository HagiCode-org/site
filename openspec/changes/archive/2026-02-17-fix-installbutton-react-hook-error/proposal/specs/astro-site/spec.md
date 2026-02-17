## ADDED Requirements

### Requirement: InstallButton 组件客户端水合

文档站点中的 InstallButton React 组件 SHALL 使用正确的客户端水合策略，确保 React Hooks 仅在客户端环境中调用。

#### Scenario: InstallButton 在 MDX 中使用 client:visible 指令

- **GIVEN** `desktop.mdx` 文件中使用了 InstallButton 组件
- **WHEN** 组件使用 `client:visible` 指令进行水合
- **THEN** 组件 MUST 在进入视口时正确水合
- **AND** React Hooks MUST 仅在客户端环境中调用
- **AND** 浏览器控制台 MUST NOT 出现 `Cannot read properties of null (reading 'useState')` 错误

#### Scenario: InstallButton 在 MDX 中使用 client:idle 指令

- **GIVEN** `desktop.mdx` 文件中使用了 InstallButton 组件
- **WHEN** 组件使用 `client:idle` 指令进行水合
- **THEN** 组件 MUST 在浏览器空闲时正确水合
- **AND** React Hooks MUST 仅在客户端环境中调用
- **AND** 浏览器控制台 MUST NOT 出现 React 相关错误

#### Scenario: InstallButton 组件环境兼容性检查

- **GIVEN** InstallButton 组件被渲染
- **WHEN** 组件在服务端渲染(SSR)阶段被渲染
- **THEN** 组件 MUST 提供服务端兼容的降级 UI
- **OR** 组件 MUST 延迟渲染直到客户端水合
- **AND** 组件 MUST NOT 在服务端环境中调用 React Hooks

#### Scenario: InstallButton 客户端水合后的功能完整性

- **GIVEN** InstallButton 组件已完成客户端水合
- **WHEN** 用户与组件交互
- **THEN** 所有 React 功能 MUST 正常工作：
  - **useState**: 下拉菜单状态管理
  - **useEffect**: 事件监听器和清理
  - **useMemo**: 性能优化的计算
  - **平台检测**: 用户操作系统自动识别
  - **下拉菜单**: 展开/收起功能
  - **版本选择**: 不同平台和版本的选择

#### Scenario: React 集成配置验证

- **GIVEN** 文档站点使用 @astrojs/react 集成
- **WHEN** 检查 `astro.config.mjs` 配置
- **THEN** React 集成 MUST 在 `integrations` 数组中正确注册
- **AND** @astrojs/react 版本 MUST 与 Astro 版本兼容
- **AND** @astrojs/mdx 集成 MUST 正确配置以支持 React 组件
- **AND** 配置 MUST 支持 MDX 文件中的客户端指令

#### Scenario: InstallButton 组件在生产构建中的正确性

- **GIVEN** 文档站点已完成生产构建
- **WHEN** 用户访问 `/installation/desktop` 页面
- **THEN** InstallButton 组件 MUST 正确显示
- **AND** 控制台 MUST NOT 有错误
- **AND** 所有交互功能 MUST 正常工作
- **AND** 组件 MUST 在所有支持的浏览器中一致工作
