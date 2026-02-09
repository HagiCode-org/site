## MODIFIED Requirements

### Requirement: GitHub Actions 飞书通知 SHALL 使用 haginotifier Composite Action

系统 SHALL 使用 `HagiCode-org/haginotifier` Composite Action（版本 `@v1`）发送飞书通知，替代已废弃的 Reusable Workflow 语法。

#### Scenario: deploy.yml 成功通知
- **WHEN** 部署工作流成功完成
- **THEN** 系统 SHALL 使用 `runs-on: ubuntu-latest` 运行通知任务
- **AND** 系统 SHALL 使用 `steps:` 数组定义步骤
- **AND** 系统 SHALL 使用 `uses: HagiCode-org/haginotifier@v1` 调用 Composite Action
- **AND** 系统 SHALL 在步骤级别通过 `env:` 传递 `FEISHU_WEBHOOK_URL`
- **AND** 系统 SHALL 发送包含状态、仓库、分支、提交、触发者和运行详情的通知

#### Scenario: deploy.yml 失败通知
- **WHEN** 部署工作流失败
- **THEN** 系统 SHALL 使用 `runs-on: ubuntu-latest` 运行通知任务
- **AND** 系统 SHALL 使用 `steps:` 数组定义步骤
- **AND** 系统 SHALL 使用 `uses: HagiCode-org/haginotifier@v1` 调用 Composite Action
- **AND** 系统 SHALL 在步骤级别通过 `env:` 传递 `FEISHU_WEBHOOK_URL`
- **AND** 系统 SHALL 发送包含失败状态和相关详情的通知

#### Scenario: version-monitor.yml 版本更新通知
- **WHEN** 版本监控工作流检测到新版本并创建 PR
- **THEN** 系统 SHALL 使用 `runs-on: ubuntu-latest` 运行通知任务
- **AND** 系统 SHALL 使用 `steps:` 数组定义步骤
- **AND** 系统 SHALL 使用 `uses: HagiCode-org/haginotifier@v1` 调用 Composite Action
- **AND** 系统 SHALL 在步骤级别通过 `env:` 传递 `FEISHU_WEBHOOK_URL`
- **AND** 系统 SHALL 发送包含新版本号和 PR 链接的通知

#### Scenario: version-monitor.yml 失败通知
- **WHEN** 版本监控工作流失败
- **THEN** 系统 SHALL 使用 `runs-on: ubuntu-latest` 运行通知任务
- **AND** 系统 SHALL 使用 `steps:` 数组定义步骤
- **AND** 系统 SHALL 使用 `uses: HagiCode-org/haginotifier@v1` 调用 Composite Action
- **AND** 系统 SHALL 在步骤级别通过 `env:` 传递 `FEISHU_WEBHOOK_URL`
- **AND** 系统 SHALL 发送包含失败状态的通知

#### Scenario: 版本固定
- **WHEN** 引用 haginotifier Action
- **THEN** 系统 SHALL 使用 `@v1` 版本标签（而非 `@main` 分支）
- **AND** 系统 SHALL 确保生产环境使用稳定版本

#### Scenario: 输出访问（如需要）
- **WHEN** 后续步骤需要访问通知结果
- **THEN** 系统 SHALL 使用 `steps.<step-id>.outputs.<output-name>` 语法
- **AND** 系统 SHALL 不再使用 `needs.<job-id>.outputs.<output-name>` 语法

#### Scenario: 向后兼容性
- **WHEN** 迁移后运行工作流
- **THEN** 通知内容 SHALL 保持与之前相同的格式和内容
- **AND** 通知触发条件 SHALL 保持不变（success/failure）
- **AND** `FEISHU_WEBHOOK_URL` 密钥配置 SHALL 保持不变
