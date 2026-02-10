# github-integration Specification Delta

## MODIFIED Requirements

### Requirement: Version Monitor 工作流 SHALL 在 MonoRepo 架构下适配新的文件路径

系统 SHALL 修改现有的 `version-monitor.yml` GitHub Actions 工作流,以支持 MonoRepo 架构下的版本文件路径。

#### Scenario: 监控 Hagicode Desktop 新版本发布

- **WHEN** 定时任务每 30 分钟触发一次 (cron: "*/30 * * * *")
- **THEN** 系统 SHALL 从 `https://desktop.dl.hagicode.com/index.json` 获取最新版本
- **AND** 系统 SHALL 与本地 `apps/docs/public/version-index.json` 进行版本比较
- **AND** 系统 SHALL 检测版本变化 (支持 semver 版本比较)

#### Scenario: 创建版本更新 PR

- **WHEN** 检测到新版本
- **THEN** 系统 SHALL 创建新的 feature 分支 (格式: `version-update-{version}`)
- **AND** 系统 SHALL 运行 `node scripts/version-monitor.js` 更新版本文件
- **AND** 系统 SHALL 使用 `git add apps/docs/public/version-index.json` 添加更改
- **AND** 系统 SHALL 提交更改 (commit message: "chore: update version to {version}")
- **AND** 系统 SHALL 推送分支到远程仓库

#### Scenario: 使用 gh CLI 创建 Pull Request

- **WHEN** 分支推送成功后
- **THEN** 系统 SHALL 使用 `gh pr create` 创建 Pull Request
- **AND** PR 标题 SHALL 为 "chore: update version to {version}"
- **AND** PR 基础分支 SHALL 为 `main`
- **AND** PR SHALL 包含标签 `automation` 和 `version`
- **AND** PR 描述 SHALL 包含以下信息:
  - 新版本号
  - 数据源 URL
  - 检查时间戳
  - 更新的文件路径 (`apps/docs/public/version-index.json`)
  - 合并后的后续步骤说明

#### Scenario: 关闭旧的版本更新 PR

- **WHEN** 创建新的版本更新 PR
- **THEN** 系统 SHALL 查找所有包含 "chore: update version to in:head" 的开放 PR
- **AND** 系统 SHALL 使用 `gh pr close` 关闭这些旧 PR
- **AND** 关闭原因 SHALL 为 "由于新的版本更新 PR 自动关闭"

#### Scenario: 飞书通知

- **WHEN** PR 创建成功
- **THEN** 系统 SHALL 通过 haginotifier 发送飞书通知
- **AND** 通知标题 SHALL 为 "Version Monitor"
- **AND** 通知内容 SHALL 包含:
  - 状态: 🔄 发现新版本
  - 新版本号
  - 仓库名称
  - PR 链接
  - 工作流运行详情链接

#### Scenario: 工作流失败通知

- **WHEN** 工作流运行失败
- **THEN** 系统 SHALL 通过 haginotifier 发送飞书通知
- **AND** 通知内容 SHALL 包含:
  - 状态: ❌ 失败
  - 仓库名称
  - 触发者
  - 工作流运行详情链接

#### Scenario: 手动触发工作流

- **WHEN** 用户从 GitHub Actions UI 手动触发工作流
- **THEN** 系统 SHALL 执行完整的版本监控流程
- **AND** 系统 SHALL 支持通过 `workflow_dispatch` 事件触发

#### Scenario: 版本文件路径更新

- **GIVEN** MonoRepo 架构下的新文件结构
- **WHEN** 工作流运行 `scripts/version-monitor.js`
- **THEN** 脚本 SHALL 读写 `apps/docs/public/version-index.json`
- **AND** 脚本 SHALL 确保 `apps/docs/public` 目录存在
- **AND** 工作流 SHALL 正确提交新路径下的文件

#### Scenario: 工作流配置

- **GIVEN** GitHub Actions 工作流配置
- **WHEN** 检查工作流权限和配置
- **THEN** 工作流 SHALL 设置 `permissions: contents: write, pull-requests: write`
- **AND** 工作流 SHALL 使用 Node.js 20 运行环境
- **AND** 工作流 SHALL 支持通过环境变量配置:
  - `VERSION_SOURCE_URL`: 版本数据源 URL
  - `REQUEST_TIMEOUT`: 请求超时时间 (默认 30000ms)
  - `MAX_RETRIES`: 最大重试次数 (默认 3)

#### Scenario: 版本比较逻辑

- **GIVEN** 版本监控脚本运行
- **WHEN** 比较本地版本和远程版本
- **THEN** 系统 SHALL 使用 semver 规范进行比较
- **AND** 系统 SHALL 支持预发布版本比较 (alpha, beta, rc 等)
- **AND** 系统 SHALL 正确处理版本号格式 (如 v0.1.4)
- **AND** 仅在检测到新版本时才创建 PR

#### Scenario: 工作流输出

- **GIVEN** 工作流运行完成
- **WHEN** 检查工作流输出
- **THEN** 工作流 SHALL 设置以下输出:
  - `update_needed`: 是否需要更新 (true/false)
  - `new_version`: 新版本号
  - `pr_created`: 是否创建 PR (true/false)
  - `pr_url`: 创建的 PR URL
