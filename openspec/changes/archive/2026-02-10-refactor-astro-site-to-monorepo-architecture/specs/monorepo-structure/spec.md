# MonoRepo 结构规范

## Purpose

定义 Hagicode 文档站点 MonoRepo 架构的要求，确保多个应用在同一仓库中协调开发和部署。

## Context

- **项目**: Hagicode Documentation
- **架构**: MonoRepo with npm workspaces
- **应用**: docs（Starlight 文档站点）、website（官方营销站点）
- **包管理器**: npm
- **根级目录**: `openspec/` 保持不变

---

## ADDED Requirements

### Requirement: Workspace 配置

仓库 MUST 使用 npm workspaces 实现 MonoRepo 架构。

#### Scenario: 根级 package.json workspaces 配置

- **GIVEN** 仓库根目录
- **WHEN** 检查 `package.json` 文件
- **THEN** 文件 MUST 存在
- **AND** 文件 MUST 包含 `workspaces` 字段
- **AND** `workspaces` MUST 包含以下配置：
  - `"workspaces": ["apps/*", "packages/*"]`

#### Scenario: apps 目录结构

- **GIVEN** `apps/` 目录存在
- **WHEN** 列出子目录
- **THEN** MUST 包含 `docs/` 目录
- **AND** MUST 包含 `website/` 目录
- **AND** 每个子目录 MUST 有独立的 `package.json`

#### Scenario: packages 目录结构

- **GIVEN** `packages/` 目录存在
- **WHEN** 列出子目录
- **THEN** MAY 包含 `shared/` 目录（如需要共享代码）
- **AND** 如果存在 shared 目录，MUST 有独立的 `package.json`

### Requirement: 根级 package.json 配置

仓库根目录的 `package.json` MUST 配置 workspace 统一管理。

#### Scenario: 根级 package.json 必需字段

- **GIVEN** 根级 `package.json` 文件
- **WHEN** 检查文件内容
- **THEN** MUST 包含以下字段：
  - `name: "pcode-docs-monorepo"`
  - `private: true`
  - `type: "module"`
  - `workspaces: ["apps/*", "packages/*"]`
  - `engines.node: ">=18.0"`
  - `engines.npm: ">=9.0"`

#### Scenario: 统一开发脚本

- **GIVEN** 根级 `package.json` 的 `scripts` 字段
- **WHEN** 列出所有脚本
- **THEN** MUST 包含以下脚本：
  - `dev` - 同时启动所有应用的开发服务器
  - `dev:docs` - 启动文档站点开发服务器
  - `dev:website` - 启动营销站点开发服务器
  - `build` - 构建所有应用
  - `build:docs` - 仅构建文档站点
  - `build:website` - 仅构建营销站点
  - `preview` - 预览所有应用的生产构建
  - `typecheck` - 对所有应用运行类型检查

#### Scenario: 共享 devDependencies

- **GIVEN** 根级 `package.json` 的 `devDependencies` 字段
- **WHEN** 检查依赖列表
- **THEN** MUST 包含以下共享依赖：
  - `astro`
  - `@astrojs/react`
  - `@astrojs/mdx`
  - `@astrojs/starlight`
  - `@astrojs/mermaid`
  - `typescript`
  - `prettier`

### Requirement: TypeScript 项目引用

MonoRepo MUST 使用 TypeScript 项目引用实现类型共享。

#### Scenario: 根级 tsconfig.json 配置

- **GIVEN** 根级 `tsconfig.json` 文件
- **WHEN** 检查 `compilerOptions`
- **THEN** MUST 包含以下配置：
  - `composite: true`
  - `declarationMap: true`
  - `baseUrl: "."`
  - `paths` 配置包含 `@docs/*`, `@website/*`, `@shared/*`
- **AND** MUST 包含 `references` 数组引用所有应用和包

#### Scenario: 应用级 tsconfig.json 配置

- **GIVEN** 应用目录中的 `tsconfig.json` 文件
- **WHEN** 检查 `compilerOptions`
- **THEN** MUST 包含 `composite: true`
- **AND** MUST 包含正确的 `extends` 配置

### Requirement: OpenSpec 目录位置

OpenSpec 规范和提案 MUST 保持在仓库根级别。

#### Scenario: openspec 目录结构

- **GIVEN** 仓库根目录
- **WHEN** 列出子目录
- **THEN** MUST 包含 `openspec/` 目录
- **AND** `openspec/` MUST 包含以下子目录：
  - `specs/` - 当前规范
  - `changes/` - 活跃提案
  - `changes/archive/` - 已完成提案
  - `AGENTS.md` - AI 助手说明
  - `PROPOSAL_DESIGN_GUIDELINES.md` - 设计指南

#### Scenario: OpenSpec 共享

- **GIVEN** MonoRepo 中的多个应用
- **WHEN** 使用 OpenSpec 工作流
- **THEN** 两个应用 MUST 共享同一个 `openspec/` 目录
- **AND** 提案和规范 MUST 适用于整个 MonoRepo
- **AND** 不得为每个应用创建独立的 OpenSpec 目录

### Requirement: 应用独立配置

每个应用 MUST 有独立的 Astro 配置和构建配置。

#### Scenario: docs 应用配置

- **GIVEN** `apps/docs/astro.config.mjs` 文件
- **WHEN** 检查配置内容
- **THEN** MUST 配置 `@astrojs/starlight` 集成
- **AND** MUST 配置 `base: "/docs"` 或通过环境变量配置
- **AND** MUST 包含站点元数据（title, description, locale）
- **AND** MUST 配置 `output: 'static'`

#### Scenario: website 应用配置

- **GIVEN** `apps/website/astro.config.mjs` 文件
- **WHEN** 检查配置内容
- **THEN** MUST NOT 配置 `@astrojs/starlight` 集成
- **AND** MUST 配置 `@astrojs/react` 集成
- **AND** MUST 配置 `@astrojs/mdx` 集成
- **AND** MUST 配置 `base: "/"` 或通过环境变量配置
- **AND** MUST 包含站点元数据

#### Scenario: 应用 package.json 名称

- **GIVEN** 应用目录中的 `package.json`
- **WHEN** 检查 `name` 字段
- **THEN** docs 应用 MUST 使用 `name: "docs"`
- **AND** website 应用 MUST 使用 `name: "website"`
- **AND** 两者 MUST 设置 `private: true`

### Requirement: 开发服务器端口配置

开发服务器 MUST 使用不同的端口以避免冲突。

#### Scenario: 默认端口分配

- **GIVEN** 运行开发服务器
- **WHEN** 启动 `npm run dev:docs`
- **THEN** 文档站点 MUST 使用默认端口 `4321`
- **WHEN** 启动 `npm run dev:website`
- **THEN** 营销站点 MUST 使用端口 `4322`

#### Scenario: 启动所有应用

- **GIVEN** 运行 `npm run dev`
- **WHEN** 命令执行
- **THEN** MUST 同时启动两个应用
- **AND** 两个应用 MUST 使用不同端口
- **AND** 控制台 MUST 显示两个应用的 URL

### Requirement: 共享包（可选）

如需要共享代码，MUST 通过 `packages/shared` 包实现。

#### Scenario: 共享包结构

- **GIVEN** `packages/shared/` 目录存在
- **WHEN** 列出子目录
- **THEN** MUST 包含 `package.json`
- **AND** MUST 包含 `src/` 目录
- **AND** `src/` 目录 MAY 包含：
  - `components/` - 共享 React/Astro 组件
  - `utils/` - 共享工具函数
  - `types/` - 共享 TypeScript 类型

#### Scenario: 共享包导出

- **GIVEN** `packages/shared/package.json`
- **WHEN** 检查 `exports` 字段
- **THEN** MUST 正确导出所有共享模块
- **AND** MUST 包含 `types` 字段指向类型定义

#### Scenario: 应用引用共享包

- **GIVEN** 应用的 `package.json`
- **WHEN** 检查依赖
- **THEN** 如使用共享包，MUST 声明为依赖
- **AND** 导入路径 MUST 使用 `@shared/*` 别名

### Requirement: 构建产物隔离

每个应用的构建产物 MUST 独立存储在各自目录中。

#### Scenario: 构建输出目录

- **GIVEN** 运行 `npm run build`
- **WHEN** 构建完成
- **THEN** docs 应用 MUST 输出到 `apps/docs/dist/`
- **AND** website 应用 MUST 输出到 `apps/website/dist/`
- **AND** 两个构建产物 MUST 互不干扰

#### Scenario: 独立构建

- **GIVEN** 运行 `npm run build:docs`
- **WHEN** 构建完成
- **THEN** MUST 仅构建 docs 应用
- **AND** MUST 生成 `apps/docs/dist/` 目录
- **AND** MUST 不影响 website 应用

### Requirement: 依赖管理策略

依赖管理 MUST 遵循 npm workspaces 的依赖解析策略。

#### Scenario: 共享依赖管理

- **GIVEN** 根级 `package.json` 的 `devDependencies`
- **WHEN** 安装依赖
- **THEN** 共享依赖 MUST 被提升到根级 node_modules
- **AND** 应用 MUST 能够访问根级依赖

#### Scenario: 应用特定依赖

- **GIVEN** 应用的 `package.json` 的 `dependencies`
- **WHEN** 检查依赖列表
- **THEN** 应用特定依赖（如 framer-motion）MUST 在应用级声明
- **AND** MUST 不在根级声明（除非被多个应用使用）
