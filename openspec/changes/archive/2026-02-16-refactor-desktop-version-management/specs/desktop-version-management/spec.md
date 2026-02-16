## ADDED Requirements

### Requirement: 统一 Desktop 类型定义
系统 MUST 在 `packages/shared/src/types/desktop.ts` 中提供统一的 Desktop 相关类型定义，确保两个应用使用相同的类型契约。

#### Scenario: 类型定义完整性
- **WHEN** 开发者在任何应用中导入 Desktop 类型
- **THEN** 应从 `@shared/desktop` 导入，而非本地类型文件
- **AND** 类型定义包含 AssetType、DesktopAsset、DesktopVersion、DesktopIndexResponse、PlatformDownload、PlatformGroup、PlatformRecommendation

#### Scenario: 渠道信息支持
- **WHEN** 类型定义包含渠道信息
- **THEN** MUST 定义 ChannelInfo 接口，包含 latest 和 versions 字段
- **AND** DesktopIndexResponse 可选包含 channels 字段

### Requirement: 统一 Desktop 工具函数
系统 MUST 在 `packages/shared/src/utils/desktop.ts` 中提供统一的 Desktop 版本数据处理工具函数。

#### Scenario: 工具函数可用性
- **WHEN** 开发者需要处理 Desktop 版本数据
- **THEN** 应从 `@shared/desktop-utils` 导入工具函数
- **AND** 可用函数包括：inferAssetType、formatFileSize、getAssetTypeLabel、fetchDesktopVersions、groupAssetsByPlatform、getRecommendedDownload、detectOS

#### Scenario: 版本比较功能
- **WHEN** 需要比较两个版本号
- **THEN** MUST 提供版本比较函数，支持 semver 格式
- **AND** 返回 -1、0、1 表示小于、等于、大于

### Requirement: 版本数据管理器
系统 MUST 提供单例模式的版本数据管理器，确保版本数据只获取一次并在组件间共享。

#### Scenario: 服务端数据注入（SSR）
- **WHEN** Astro 页面在服务端渲染时
- **THEN** MUST 调用 VersionManager.setServerData() 注入版本数据
- **AND** 注入的数据包括：latest 版本、平台分组、渠道信息

#### Scenario: 客户端数据获取
- **WHEN** 组件在客户端需要版本数据
- **THEN** MUST 调用 VersionManager.getVersionData() 获取数据
- **AND** 如果服务端已注入数据，直接返回缓存数据
- **AND** 如果服务端未注入数据，自动调用 fetchDesktopVersions() 获取

#### Scenario: 单例模式
- **WHEN** 多个组件同时访问版本数据
- **THEN** MUST 使用同一个 VersionManager 实例
- **AND** 版本数据只获取一次，后续访问使用缓存

#### Scenario: 渠道版本管理
- **WHEN** 应用需要支持多个发布渠道（stable、beta）
- **THEN** VersionManager MUST 支持按渠道获取版本
- **AND** 提供 getChannelVersionData(channel) 方法

### Requirement: 组件接口简化
安装按钮组件 MUST 支持无需传递版本信息 props 的使用方式。

#### Scenario: 无 props 使用（推荐方式）
- **WHEN** 开发者使用 InstallButton 组件
- **THEN** 可以不传递任何版本相关 props
- **AND** 组件内部通过 VersionManager 获取版本数据
- **AND** 示例：`<InstallButton />` 或 `<InstallButton channel="stable" />`

#### Scenario: 向后兼容（旧方式）
- **WHEN** 开发者传递了 initialVersion 等 props
- **THEN** 组件 MUST 优先使用传入的 props
- **AND** 保持与旧版本组件的兼容性
- **AND** 示例：`<InstallButton initialVersion={v} initialPlatforms={p} />`

### Requirement: React Context 支持（可选）
如果实现 React Context Provider，系统 MUST 提供完整的类型定义和 Hook 接口。

#### Scenario: Context Provider 实现
- **WHEN** 选择使用 React Context 管理版本状态
- **THEN** MUST 提供 DesktopVersionProvider 组件
- **AND** MUST 提供 useDesktopVersion() Hook 访问版本数据
- **AND** Context MUST 与 VersionManager 保持数据同步

#### Scenario: Context 数据同步
- **WHEN** VersionManager 的版本数据更新
- **THEN** Context MUST 自动更新所有订阅的组件
- **AND** MUST 触发组件重新渲染以反映最新版本

### Requirement: Astro SSR 集成
系统 MUST 支持 Astro 服务端渲染场景，允许在构建时或请求时获取版本数据。

#### Scenario: 构建时数据获取
- **WHEN** Astro 页面在构建时渲染
- **THEN** 页面 MUST 调用 fetchDesktopVersions() 获取版本数据
- **AND** 通过 VersionManager.setServerData() 注入数据
- **AND** 版本数据序列化到页面 HTML 中

#### Scenario: 请求时数据获取（可选）
- **WHEN** Astro 页面配置为 hybrid 或 server 模式
- **THEN** 页面 MAY 在每次请求时获取最新版本数据
- **AND** 更新 VersionManager 的缓存

### Requirement: 缓存和性能优化
版本数据管理器 MUST 实现缓存机制，避免重复的网络请求。

#### Scenario: 缓存命中
- **WHEN** 版本数据已被缓存
- **THEN** VersionManager MUST 直接返回缓存数据
- **AND** 不发起额外的网络请求

#### Scenario: 缓存失效
- **WHEN** 版本数据过期（可选 TTL 机制）
- **THEN** VersionManager MAY 重新获取版本数据
- **AND** 更新缓存并通知所有订阅者

#### Scenario: 错误处理
- **WHEN** 版本数据获取失败
- **THEN** VersionManager MUST 返回错误状态
- **AND** 组件根据错误状态显示降级 UI

### Requirement: 类型安全
所有 Desktop 相关的类型和函数 MUST 通过 TypeScript 严格类型检查。

#### Scenario: 类型导出
- **WHEN** 开发者从 `@shared/desktop` 导入类型
- **THEN** 所有类型 MUST 正确导出和使用
- **AND** TypeScript 类型检查无错误

#### Scenario: 函数签名
- **WHEN** 使用 Desktop 工具函数
- **THEN** 函数参数和返回值 MUST 有正确的类型注解
- **AND** TypeScript 推断类型正确
