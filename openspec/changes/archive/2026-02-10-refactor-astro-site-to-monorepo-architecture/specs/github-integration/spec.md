# github-integration 规范更新

## MODIFIED Requirements

### Requirement: GitHub Actions 部署工作流

GitHub Actions MUST 支持独立部署 docs 和 website 两个应用。

#### Scenario: 文档站点部署工作流

- **GIVEN** `.github/workflows/deploy-docs.yml` 文件存在
- **WHEN** 检查工作流配置
- **THEN** 工作流 MUST 配置以下内容：
  - 触发条件：push to main 分支
  - Node.js 版本：20.x
  - 构建步骤：`cd apps/docs && npm run build`
  - 部署目标：GitHub Pages
  - 环境变量：`CLARITY_PROJECT_ID`（可选）
- **AND** 部署路径 MUST 为 `/docs/` 子路径
- **AND** MUST 配置成功和失败的 Feishu 通知

#### Scenario: 营销站点部署工作流

- **GIVEN** `.github/workflows/deploy-website.yml` 文件存在
- **WHEN** 检查工作流配置
- **THEN** 工作流 MUST 配置以下内容：
  - 触发条件：push to main 分支
  - Node.js 版本：20.x
  - 构建步骤：`cd apps/website && npm run build`
  - 部署目标：Azure Static Web Apps
  - 环境变量：`CLARITY_PROJECT_ID`（可选）
- **AND** 部署路径 MUST 为根路径 `/`
- **AND** MUST 配置成功和失败的 Feishu 通知

#### Scenario: 独立部署触发

- **GIVEN** 两个部署工作流都存在
- **WHEN** push 到 main 分支
- **THEN** 两个工作流 MUST 同时触发
- **AND** 两个应用的构建 MUST 并行执行
- **AND** 两个应用的部署 MUST 独立进行
- **AND** 一个应用的失败 MUST 不影响另一个应用的部署

#### Scenario: 工作流缓存配置

- **GIVEN** 部署工作流配置
- **WHEN** 检查缓存设置
- **THEN** MUST 配置 npm 缓存
- **AND** MUST 配置 Astro 构建缓存
- **AND** 缓存 key MUST 包含操作系统和 Node.js 版本

## REMOVED Requirements

### Requirement: GitHub Actions 部署工作流（单体应用版本）

**Reason**: 单体应用部署工作流已被多应用独立部署工作流替代

**Migration**:
- 原始 `deploy.yml` 已拆分为 `deploy-docs.yml` 和 `deploy-website.yml`
- 文档站点部署到 GitHub Pages
- 营销站点部署到 Azure Static Web Apps
- 原始 `azure-static-web-apps-*.yml` 已被 `deploy-website.yml` 替代

### Requirement: 单体应用构建步骤

**Reason**: 构建步骤已分离到各自应用的工作流中

**Migration**:
- 文档站点构建：`cd apps/docs && npm run build`
- 营销站点构建：`cd apps/website && npm run build`
- 不再存在根级的单一构建命令

## ADDED Requirements

### Requirement: MonoRepo 工作流支持

GitHub Actions 工作流 MUST 正确处理 MonoRepo 结构的依赖安装和构建。

#### Scenario: npm 依赖安装

- **GIVEN** 工作流执行环境
- **WHEN** 安装依赖
- **THEN** MUST 使用 `npm install` 命令
- **AND** MUST 配置 `setup-node` action 使用正确的 Node.js 版本
- **AND** npm MUST 正确解析 workspaces 依赖

#### Scenario: 构建目标定位

- **GIVEN** MonoRepo 目录结构
- **WHEN** 执行构建命令
- **THEN** 文档站点构建 MUST 使用 `cd apps/docs && npm run build`
- **AND** 营销站点构建 MUST 使用 `cd apps/website && npm run build`
- **AND** 构建产物 MUST 生成在各自的 `dist/` 目录中

#### Scenario: 工作流环境变量

- **GIVEN** 部署工作流配置
- **WHEN** 检查环境变量设置
- **THEN** docs 应用 MAY 设置 `VITE_SITE_BASE=/docs`
- **AND** website 应用 MAY 设置 `VITE_SITE_BASE=/` 或留空
- **AND** `CLARITY_PROJECT_ID` MUST 正确传递到各自应用

### Requirement: 部署隔离

两个应用的部署 MUST 完全隔离，互不影响。

#### Scenario: 部署目标分离

- **GIVEN** 两个部署工作流
- **WHEN** 检查部署配置
- **THEN** docs 应用 MUST 部署到 GitHub Pages
- **AND** website 应用 MUST 部署到 Azure Static Web Apps
- **AND** 两个部署 MUST 使用不同的认证凭据

#### Scenario: 部署状态通知

- **GIVEN** 部署工作流执行
- **WHEN** 部署完成
- **THEN** 每个工作流 MUST 发送独立的 Feishu 通知
- **AND** 通知 MUST 明确标识是 docs 还是 website 应用
- **AND** 失败通知 MUST 包含详细的错误信息
