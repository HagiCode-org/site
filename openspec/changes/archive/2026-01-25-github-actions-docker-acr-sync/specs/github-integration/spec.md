## ADDED Requirements

### Requirement: Docker 镜像自动同步到 Azure ACR

系统 SHALL 提供 GitHub Actions 工作流，实现 Docker 镜像从 Docker Hub 到 Azure ACR 的自动同步功能。

#### Scenario: 定时同步触发
- **WHEN** 每天 UTC 00:00 定时触发
- **THEN** 系统 SHALL 自动运行镜像同步工作流
- **AND** 系统 SHALL 同步 `newbe36524/hagicode` 镜像到 `hagicode.azurecr.io`

#### Scenario: 手动同步触发
- **WHEN** 用户通过 GitHub UI 手动触发工作流
- **THEN** 系统 SHALL 立即运行镜像同步工作流
- **AND** 系统 SHALL 同步 `newbe36524/hagicode` 镜像到 `hagicode.azurecr.io`

#### Scenario: 全标签同步
- **WHEN** 同步工作流运行
- **THEN** 系统 SHALL 同步 Docker Hub 上的所有标签
- **AND** 系统 SHALL 保持标签名称不变地推送到 Azure ACR
- **AND** 系统 SHALL 确保所有标签的一致性

#### Scenario: Azure ACR 认证
- **WHEN** 工作流运行
- **THEN** 系统 SHALL 使用 `AZURE_ACR_USERNAME` 和 `AZURE_ACR_PASSWORD` 进行认证
- **AND** 认证信息 SHALL 从 GitHub Secrets 中获取
- **AND** 系统 SHALL 在认证失败时停止工作流并报告错误

#### Scenario: 错误处理
- **WHEN** Docker Hub 镜像拉取失败
- **THEN** 系统 SHALL 记录错误日志
- **AND** 系统 SHALL 停止工作流并报告失败
- **WHEN** Azure ACR 推送失败
- **THEN** 系统 SHALL 记录错误日志
- **AND** 系统 SHALL 停止工作流并报告失败

#### Scenario: 同步成功通知
- **WHEN** 镜像同步成功完成
- **THEN** 系统 SHALL 记录成功日志
- **AND** 系统 SHALL 显示同步的标签数量
- **AND** 系统 SHALL 提供同步的详细信息

### Requirement: GitHub Secrets 配置

系统 SHALL 支持通过 GitHub Secrets 配置 Azure ACR 的认证信息。

#### Scenario: 配置 ACR 用户名
- **WHEN** 配置同步工作流
- **THEN** 系统 SHALL 从 `AZURE_ACR_USERNAME` 密钥中读取 ACR 用户名
- **AND** 系统 SHALL 使用该用户名进行 Azure ACR 认证

#### Scenario: 配置 ACR 密码
- **WHEN** 配置同步工作流
- **THEN** 系统 SHALL 从 `AZURE_ACR_PASSWORD` 密钥中读取 ACR 密码
- **AND** 系统 SHALL 使用该密码进行 Azure ACR 认证

#### Scenario: Secrets 验证
- **WHEN** 工作流运行前
- **THEN** 系统 SHALL 验证所需的 Secrets 是否存在
- **AND** 系统 SHALL 在 Secrets 缺失时停止工作流并报告错误
