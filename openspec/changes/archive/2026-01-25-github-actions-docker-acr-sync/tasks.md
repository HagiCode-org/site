# Tasks: 使用 GitHub Actions 自动同步 Docker 镜像到 Azure ACR

## 1. 工作流创建
- [x] 1.1 在 `.github/workflows/` 目录下创建 `sync-docker-acr.yml` 工作流文件
- [x] 1.2 配置工作流的触发条件（每日 UTC 00:00 定时触发和手动触发）
- [x] 1.3 配置工作流的运行环境（ubuntu-latest）和权限

## 2. image-syncer 工具集成
- [x] 2.1 添加下载 image-syncer 二进制文件的步骤
- [x] 2.2 创建 image-syncer 配置文件生成逻辑
- [x] 2.3 配置同步规则（源仓库和目标仓库映射）
- [x] 2.4 设置并发线程数和日志级别参数

## 3. 认证配置
- [x] 3.1 配置 Azure ACR 认证信息（在 config.json 中）
- [x] 3.2 从 GitHub Secrets 读取 `AZURE_ACR_USERNAME` 和 `AZURE_ACR_PASSWORD`
- [x] 3.3 文档化需要配置的 GitHub Secrets
- [x] 3.4 验证公开镜像无需 Docker Hub 认证

## 4. 镜像同步实现
- [x] 4.1 执行 image-syncer 命令进行镜像同步
- [x] 4.2 配置增量同步机制（image-syncer 内置）
- [x] 4.3 支持同步所有标签（使用 `*` 通配符）
- [x] 4.4 配置失败重试机制（image-syncer 内置，默认 3 次）

## 5. 错误处理和日志
- [x] 5.1 添加 image-syncer 执行失败时的错误处理
- [x] 5.2 配置详细的日志输出（info 级别）
- [x] 5.3 上传同步日志为 GitHub Actions artifact
- [x] 5.4 添加同步成功的通知和统计信息

## 6. 验证和测试
- [x] 6.1 测试手动触发同步功能
- [x] 6.2 验证定时触发功能（检查 cron 表达式）
- [x] 6.3 检查同步后的镜像标签一致性
- [x] 6.4 验证增量同步功能（仅同步变更的镜像层）
- [x] 6.5 测试网络中断后的断点续传功能
- [x] 6.6 测试认证失败场景的错误处理

## 7. 文档更新
- [x] 7.1 更新项目文档，添加 image-syncer 同步机制说明
- [x] 7.2 添加 GitHub Secrets 配置指南
- [x] 7.3 添加 image-syncer 配置文件示例和说明
- [x] 7.4 添加故障排查指南
