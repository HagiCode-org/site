# github-integration Specification

## Purpose
TBD - created by archiving change github-pr-metrics-diff-display. Update Purpose after archive.
## Requirements
### Requirement: update-activity-metrics 工作流 SHALL 增强指标对比功能

系统 SHALL 修改现有的 `update-activity-metrics.yml` GitHub Actions 工作流，在创建 PR 时自动计算并展示指标的变化对比。

#### Scenario: 定时触发工作流
- **WHEN** 每天 UTC 00:00 定时触发
- **THEN** 系统 SHALL 运行 `npm run update-metrics` 获取最新数据
- **AND** 系统 SHALL 更新 `data/activity-metrics.json` 文件

#### Scenario: 计算指标差值
- **WHEN** 新数据更新完成后
- **THEN** 系统 SHALL 从 main 分支读取旧的 `activity-metrics.json` 数据
- **AND** 系统 SHALL 读取新的 `activity-metrics.json` 数据
- **AND** 系统 SHALL 计算每个指标的差值（新值 - 旧值）
- **AND** 系统 SHALL 计算变化百分比（(新值 - 旧值) / 旧值 * 100）

#### Scenario: 首次运行处理
- **WHEN** main 分支不存在 `activity-metrics.json` 文件（首次运行）
- **THEN** 系统 SHALL 跳过指标对比计算
- **AND** 系统 SHALL 在 PR 描述中显示"首次运行，无历史数据对比"的消息

### Requirement: PR 描述增强

系统 SHALL 在创建的 PR 描述中展示指标的变化对比表格。

#### Scenario: 对比表格格式
- **WHEN** 生成 PR 描述
- **THEN** 系统 SHALL 使用 Markdown 表格格式展示对比
- **AND** 表格 SHALL 包含四列：指标名称、原值、新值、变化
- **AND** 变化列 SHALL 显示绝对差值和百分比（如 "↑23 (▲6.6%)"）

#### Scenario: 视觉区分
- **WHEN** 指标值增长（如 pullCount、activeUsers、activeSessions）
- **THEN** 系统 SHALL 使用 ↑ 和 ▲ 箭头标识增长
- **AND** 显示格式 SHALL 为 "↑{差值} (▲{百分比}%)"
- **WHEN** 指标值下降
- **THEN** 系统 SHALL 使用 ↓ 和 ▼ 箭头标识下降
- **AND** 显示格式 SHALL 为 "↓{差值} (▼{百分比}%)"
- **WHEN** 指标值无变化
- **THEN** 系统 SHALL 使用 → 和 ▶ 箭头标识
- **AND** 显示格式 SHALL 为 "→0"

#### Scenario: 摘要统计
- **WHEN** 生成 PR 描述
- **THEN** 系统 SHALL 在对比表格下方显示摘要
- **AND** 摘要 SHALL 包含变化指标的总数
- **AND** 摘要 SHALL 包含增长和下降的指标数量
- **AND** 摘要 SHALL 包含趋势标识（如 "全部呈现增长趋势 📈"）

### Requirement: 指标数据解析

系统 SHALL 使用 jq 工具解析 `activity-metrics.json` 中的指标数据。

#### Scenario: 解析指标值
- **WHEN** 解析 JSON 数据
- **THEN** 系统 SHALL 提取 `dockerHub.pullCount` 字段
- **AND** 系统 SHALL 提取 `clarity.activeUsers` 字段
- **AND** 系统 SHALL 提取 `clarity.activeSessions` 字段

#### Scenario: 处理缺失字段
- **WHEN** JSON 中某个指标字段不存在
- **THEN** 系统 SHALL 将该指标值视为 null
- **AND** 系统 SHALL 在对比表格中显示 "N/A"
- **AND** 系统 SHALL 不导致工作流失败

### Requirement: 边界情况处理

系统 SHALL 妥善处理数值计算的边界情况。

#### Scenario: 除零处理
- **WHEN** 计算百分比时旧值为 0
- **THEN** 系统 SHALL 显示百分比 "N/A"
- **AND** 系统 SHALL 仍显示绝对差值

#### Scenario: 非数值处理
- **WHEN** 提取的值不是有效数值
- **THEN** 系统 SHALL 在对比表格中显示 "N/A"
- **AND** 系统 SHALL 记录警告日志

#### Scenario: JSON 解析失败
- **WHEN** `activity-metrics.json` 文件格式无效
- **THEN** 系统 SHALL 记录错误日志
- **AND** 系统 SHALL 在 PR 描述中显示警告消息
- **AND** 系统 SHALL 仍创建 PR（仅对比部分失败）

### Requirement: 兼容性

修改后的工作流 SHALL 保持与现有功能的兼容性。

#### Scenario: 保留现有功能
- **WHEN** 工作流运行
- **THEN** 系统 SHALL 保留原有的数据获取逻辑
- **AND** 系统 SHALL 保留原有的分支创建和提交逻辑
- **AND** 系统 SHALL 保留原有的旧 PR 关闭逻辑

#### Scenario: PR 标签和标题
- **WHEN** 创建 PR
- **THEN** 系统 SHALL 使用相同的标题格式
- **AND** 系统 SHALL 使用相同的标签（automation, metrics）

