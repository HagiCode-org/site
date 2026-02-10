# Activity Metrics Automation

## Overview

活动指标自动化系统通过 GitHub Actions 定时获取 Docker Hub 和 Microsoft Clarity 的数据，更新官网营销站点的活动指标显示。

**重要**：此功能仅用于 `apps/website`（官网营销站点），文档站点（`apps/docs`）不需要此功能。

## ADDED Requirements

### Requirement: MonoRepo 路径配置

活动指标自动化系统 SHALL 支持 MonoRepo 架构下的路径配置。

#### Scenario: 脚本输出到正确路径
- **WHEN** 更新脚本执行时
- **THEN** 输出文件 SHALL 写入 `apps/website/public/activity-metrics.json`

#### Scenario: 工作流读取正确路径的数据
- **WHEN** GitHub Actions 工作流执行时
- **THEN** 所有文件读取操作 SHALL 使用 `apps/website/public/activity-metrics.json` 路径

#### Scenario: Git 操作使用正确路径
- **WHEN** 工作流执行 git add 或 git show 操作时
- **THEN** git 命令 SHALL 引用 `apps/website/public/activity-metrics.json`

### Requirement: 应用职责隔离

活动指标数据 SHALL 仅用于官网营销站点。

#### Scenario: 文档站点不使用活动指标
- **GIVEN** `apps/docs` 是文档站点
- **THEN** 文档站点 SHALL NOT 使用或引用活动指标数据

#### Scenario: 营销站点使用活动指标
- **GIVEN** `apps/website` 是官网营销站点
- **THEN** 营销站点首页 SHALL 读取并展示 `apps/website/public/activity-metrics.json` 中的数据

## MODIFIED Requirements

### Requirement: 活动指标数据更新

系统 SHALL 每日自动从 Docker Hub 和 Microsoft Clarity 获取最新数据，更新活动指标文件，并在检测到数据变化时创建 Pull Request。

#### Scenario: 定时任务执行成功
- **GIVEN** 系统已配置正确的 API 密钥
- **WHEN** GitHub Actions 定时触发（每天 UTC 00:00）
- **THEN** 系统 SHALL 成功获取 Docker Hub 拉取次数和 Clarity 活跃用户/会话数据
- **AND** 数据 SHALL 写入 `apps/website/public/activity-metrics.json`

#### Scenario: 检测到数据变化时创建 PR
- **GIVEN** 新获取的数据与 `main:apps/website/public/activity-metrics.json` 中的数据不同
- **WHEN** 数据比较完成
- **THEN** 系统 SHALL 创建 `metrics-update` 分支
- **AND** 提交更新的 `apps/website/public/activity-metrics.json` 文件
- **AND** 创建包含数据对比表格的 Pull Request

#### Scenario: 数据无变化时不创建 PR
- **GIVEN** 新获取的数据与历史数据相同
- **WHEN** 数据比较完成
- **THEN** 系统 SHALL 结束工作流
- **AND** 不创建新的 Pull Request

#### Scenario: 手动触发工作流
- **GIVEN** 用户通过 GitHub UI 手动触发工作流
- **WHEN** 工作流执行
- **THEN** 系统 SHALL 执行与定时触发相同的逻辑
- **AND** 支持测试和调试场景
