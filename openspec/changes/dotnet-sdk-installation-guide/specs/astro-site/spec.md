## ADDED Requirements

### Requirement: .NET 10 SDK 安装指南文档

文档站点 MUST 提供完整的 .NET 10 SDK 安装指南，帮助用户在 Windows、macOS 和 Linux 系统上安装和配置 .NET 10 SDK 运行时环境。

#### Scenario: 用户访问 .NET SDK 安装指南

- **GIVEN** 用户访问文档站点
- **WHEN** 导航到 `/docs/related-software-installation/dotnet/install-dotnet-sdk`
- **THEN** 必须显示 .NET 10 SDK 安装指南页面
- **AND** 页面标题必须为 ".NET 10 SDK 安装指南"
- **AND** 页面描述必须说明这是运行 Hagicode 所需的依赖项

#### Scenario: 文档内容结构完整性

- **GIVEN** 用户访问 .NET SDK 安装指南页面
- **WHEN** 查看页面内容
- **THEN** 必须包含以下章节：
  - .NET SDK 简介
  - 版本要求说明
  - Windows 安装步骤
  - macOS 安装步骤
  - Linux 安装步骤（Ubuntu/Debian/CentOS/Fedora）
  - 验证安装
  - 故障排除
  - 后续步骤

#### Scenario: 使用 Tabs 组件组织平台特定内容

- **GIVEN** 文档包含多个操作系统的安装说明
- **WHEN** 查看 Windows/macOS/Linux 安装步骤章节
- **THEN** 必须使用 Starlight 的 Tabs 组件组织内容
- **AND** 每个 Tab 必须有清晰的标签（Windows/macOS/Ubuntu/CentOS/Fedora）
- **AND** Tab 内容必须包含具体的安装命令和步骤

#### Scenario: 版本要求说明

- **GIVEN** 用户查看版本要求章节
- **WHEN** 阅读版本说明
- **THEN** 必须明确说明项目需要 .NET 10 SDK
- **AND** 必须提供验证命令检查已安装版本
- **AND** 必须说明如何查看当前安装的 .NET 版本

#### Scenario: Windows 安装步骤

- **GIVEN** 用户选择 Windows Tab
- **WHEN** 查看 Windows 安装步骤
- **THEN** 必须包含官方安装包下载链接
- **AND** 必须包含安装向导步骤说明
- **AND** 必须包含验证安装的命令
- **AND** 必须包含使用 winget 安装的替代方法

#### Scenario: macOS 安装步骤

- **GIVEN** 用户选择 macOS Tab
- **WHEN** 查看 macOS 安装步骤
- **THEN** 必须包含官方安装包下载链接
- **AND** 必须包含使用 Homebrew 安装的方法
- **AND** 必须包含验证安装的命令
- **AND** 必须说明如何验证 .NET SDK 已正确添加到 PATH

#### Scenario: Linux 安装步骤

- **GIVEN** 用户选择 Linux Tab（Ubuntu/Debian/CentOS/Fedora）
- **WHEN** 查看对应发行版的安装步骤
- **THEN** 必须包含使用包管理器安装的命令
- **AND** 必须包含 Microsoft 官方 GPG 密钥配置步骤
- **AND** 必须包含验证安装的命令
- **AND** 必须说明不同发行版的包名称差异

#### Scenario: 验证安装步骤

- **GIVEN** 用户完成 .NET SDK 安装
- **WHEN** 查看验证安装章节
- **THEN** 必须提供 `dotnet --version` 验证命令
- **AND** 必须提供 `dotnet --info` 详细信息命令
- **AND** 必须说明预期的输出格式
- **AND** 必须包含版本号示例

#### Scenario: 故障排除

- **GIVEN** 用户在安装过程中遇到问题
- **WHEN** 查看故障排除章节
- **THEN** 必须包含常见问题及解决方案：
  - 命令未找到（PATH 问题）
  - 版本不匹配
  - 权限错误
  - 网络下载问题
- **AND** 每个问题必须提供清晰的解决步骤

#### Scenario: 文档格式规范

- **GIVEN** .NET SDK 安装指南文档已创建
- **WHEN** 比较与其他相关软件安装文档
- **THEN** 必须遵循与 `setup-openspec.md` 和 `installation.md` 相同的结构和风格
- **AND** 必须使用简体中文内容
- **AND** 必须包含 title 和 description frontmatter
- **AND** frontmatter 必须包含 `sidebar_position` 属性
- **AND** 所有代码块必须使用正确的语言标识（如 `bash`、`powershell`）

#### Scenario: 文档构建验证

- **GIVEN** .NET SDK 安装指南文档已创建
- **WHEN** 运行 `npm run build:docs`
- **THEN** 构建必须成功完成
- **AND** 必须没有断链错误
- **AND** 生成的 HTML 必须包含完整的文档内容
- **AND** Tabs 组件必须正确渲染

#### Scenario: 文档在侧边栏中可见

- **GIVEN** .NET SDK 安装指南文档已创建
- **WHEN** 文档站点构建完成
- **THEN** 新文档必须自动出现在 Starlight 侧边栏的"相关软件安装"分组下
- **AND** 文档顺序必须由 `sidebar_position` 控制
- **AND** 文档必须可以通过侧边栏导航访问

#### Scenario: 后续步骤链接

- **GIVEN** 用户阅读完 .NET SDK 安装指南
- **WHEN** 查看后续步骤章节
- **THEN** 必须提供到其他相关软件安装指南的链接
- **AND** 必须提供到主安装指南的链接
- **AND** 所有链接必须使用正确的路径格式

#### Scenario: 响应式设计

- **GIVEN** 用户在移动设备上访问 .NET SDK 安装指南
- **WHEN** 查看页面
- **THEN** Tabs 组件必须在移动设备上正常工作
- **AND** 代码块必须在小屏幕上可滚动
- **AND** 内容必须不需要水平滚动即可阅读
