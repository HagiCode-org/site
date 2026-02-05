## ADDED Requirements

### Requirement: Azure Static Web Apps 路由回退配置

项目 MUST 提供 Azure Static Web Apps 路由回退配置,以支持静态站点的客户端路由功能。

#### Scenario: 配置文件存在性

**Given** 项目根目录存在
**When** 我检查 `staticwebapp.config.json` 文件
**Then** 该文件 MUST 存在
**And** 该文件 MUST 包含有效的 JSON 配置

#### Scenario: 全局路由回退规则

**Given** `staticwebapp.config.json` 文件存在
**When** 我检查配置文件内容
**Then** 它 MUST 包含 `routes` 数组配置
**And** 它 MUST 包含匹配所有路径的路由规则 `route: "/*"`
**And** 它 MUST 配置回退到 `serve: "/index.html"`
**And** 它 MUST 返回状态码 `status: 200`

#### Scenario: 直接访问子路径页面

**Given** Azure Static Web Apps 部署已完成
**When** 我直接访问文档子路径 URL (如 `/docs/quick-start/installation`)
**Then** 页面 MUST 正常加载,不出现 404 错误
**And** 页面 MUST 显示正确的内容
**And** 客户端路由 MUST 正常工作

#### Scenario: 刷新浏览器保持路由状态

**Given** 我正在浏览文档站点的子路径页面
**When** 我刷新浏览器
**Then** 页面 MUST 正常加载,不出现 404 错误
**And** 当前路由状态 MUST 保持不变
**And** 页面内容 MUST 正确显示

#### Scenario: 根路径部署兼容性

**Given** 站点部署到根路径 (`/`)
**When** 我访问任意页面或刷新浏览器
**Then** 路由回退规则 MUST 正常工作
**And** 所有链接 MUST 正确解析
**And** 页面 MUST 正常加载

#### Scenario: 子路径部署兼容性

**Given** 站点部署到子路径 (如 `/site/`)
**When** 我访问任意页面或刷新浏览器
**Then** 路由回退规则 MUST 正常工作
**And** 所有链接 MUST 包含正确的基础路径前缀
**And** 页面 MUST 正常加载

#### Scenario: GitHub Pages 部署不受影响

**Given** 项目同时部署到 GitHub Pages 和 Azure Static Web Apps
**When** 我访问 GitHub Pages 部署的站点
**Then** GitHub Pages 部署 MUST 正常工作
**And** `staticwebapp.config.json` MUST 不影响 GitHub Pages 的路由行为
**And** 两个部署平台的路由回退机制 MUST 各自独立工作

## MODIFIED Requirements

### Requirement: Deployment

The site MUST be automatically deployed via GitHub Actions and Azure Static Web Apps.

#### Scenario: GitHub Actions workflow for GitHub Pages

**Given** a commit is pushed to the `main` or `doc` branch
**When** the GitHub Actions workflow runs
**Then** the site MUST build successfully
**And** the build artifacts MUST be deployed to GitHub Pages
**And** the deployment MUST complete without errors

#### Scenario: Azure Static Web Apps CI/CD workflow

**Given** a commit is pushed to the `main` branch
**When** the Azure Static Web Apps CI/CD workflow runs
**Then** the site MUST build successfully
**And** the build artifacts MUST be deployed to Azure Static Web Apps
**And** the deployment MUST complete without errors
**And** the `staticwebapp.config.json` MUST be included in the deployment

#### Scenario: Preview deployment

**Given** a pull request is opened
**When** the GitHub Actions workflow runs
**Then** a preview deployment SHOULD be available (if configured)
**And** the preview MUST reflect the latest changes
