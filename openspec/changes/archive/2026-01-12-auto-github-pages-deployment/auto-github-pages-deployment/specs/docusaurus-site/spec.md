## ADDED Requirements

### Requirement: GitHub Actions 自动部署

当代码推送到 `main` 分支时，系统 MUST 自动触发 GitHub Actions 工作流，构建并部署文档站点到 GitHub Pages。

#### Scenario: 推送到 main 分支触发自动构建和部署

- **GIVEN** GitHub Actions 工作流文件 `.github/workflows/deploy.yml` 已配置
- **AND** GitHub 仓库已启用 GitHub Pages 功能
- **AND** GitHub Actions 已配置必要的权限（`contents: write` 和 `pages: write`）
- **WHEN** 开发者推送代码到 `main` 分支
- **THEN** GitHub Actions 工作流 MUST 自动触发
- **AND** 工作流 MUST 使用 Node.js >= 18.0 环境
- **AND** 工作流 MUST 执行 `npm ci` 安装依赖
- **AND** 工作流 MUST 执行 `npm run build` 生成静态站点
- **AND** 构建成功后，工作流 MUST 自动部署到 GitHub Pages
- **AND** GitHub Pages 站点 MUST 更新为最新内容

#### Scenario: 推送到非 main 分支不触发部署

- **GIVEN** GitHub Actions 工作流文件 `.github/workflows/deploy.yml` 已配置
- **WHEN** 开发者推送代码到非 `main` 分支（如 feature 分支）
- **THEN** GitHub Actions 工作流 MUST 不触发部署流程
- **AND** GitHub Pages 站点 MUST 保持不变

#### Scenario: 构建失败时工作流报告错误

- **GIVEN** GitHub Actions 工作流文件 `.github/workflows/deploy.yml` 已配置
- **WHEN** 推送到 `main` 分支触发工作流
- **AND** 构建过程中出现错误（如代码有 broken links）
- **THEN** 工作流 MUST 标记为失败状态
- **AND** 工作流 MUST 提供详细的错误日志
- **AND** GitHub Pages MUST 不更新（保持上一版本）
- **AND** 开发者 MUST 收到 GitHub Actions 失败通知

#### Scenario: 部署使用 gh-pages 分支

- **GIVEN** GitHub Actions 工作流配置为使用 `peaceiris/actions-gh-pages` action
- **WHEN** 构建成功并执行部署
- **THEN** 工作流 MUST 将 `build/` 目录内容推送到 `gh-pages` 分支
- **AND** GitHub Pages MUST 从 `gh-pages` 分支提供站点内容
- **AND** `main` 分支 MUST 保持干净（不包含构建产物）
