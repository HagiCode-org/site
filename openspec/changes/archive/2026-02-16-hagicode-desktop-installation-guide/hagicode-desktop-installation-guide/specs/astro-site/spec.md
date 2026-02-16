## ADDED Requirements

### Requirement: Desktop 安装指南文档

文档站点 MUST 提供完整的 Hagicode Desktop 桌面应用程序安装指南，帮助用户顺利下载、安装和使用 Desktop 应用程序。

#### Scenario: Desktop 安装指南文档存在

- **GIVEN** 用户访问文档站点
- **WHEN** 导航到 `/docs/installation/desktop`
- **THEN** 必须显示 Desktop 安装指南页面
- **AND** 页面标题必须为"Desktop 安装"
- **AND** 页面描述必须为"Hagicode Desktop 桌面应用程序安装指南"

#### Scenario: Desktop 安装指南文档结构

- **GIVEN** 用户访问 `/docs/installation/desktop` 页面
- **WHEN** 查看页面内容
- **THEN** 必须包含以下章节：
  - 下载 Desktop
  - 安装向导步骤（四个步骤）
  - 首次使用
  - 版本管理
  - 启动和停止服务
  - 后续步骤
- **AND** 每个章节必须使用清晰的 Markdown 标题结构

#### Scenario: 安装向导步骤说明

- **GIVEN** 用户查看安装向导步骤章节
- **WHEN** 阅读四个安装步骤
- **THEN** 第一步必须说明如何启动安装向导
- **AND** 必须包含截图：向导第一步，点击开始安装.png
- **AND** 第二步必须说明自动下载最新版本的过程
- **AND** 必须包含截图：向导第二步，自动下载最新版本安装.png
- **AND** 第三步必须说明依赖项检查和安装过程
- **AND** 必须包含以下截图：
  - 向导第三步，检查版本的依赖项.png
  - 向导第三步，检查完成之后可以一键安装依赖项.png
  - 向导第三步，正在安装dotnet 运行时的一个示例.png
  - 向导第三步，安装所有依赖项完成.png
- **AND** 第四步必须说明如何启动 Hagicode Server
- **AND** 必须包含以下截图：
  - 向导第四步，正在启动 hagicode server.png
  - 向导第四步，server 启动之后可以点击 hagicode 开始使用.png

#### Scenario: 首次使用说明

- **GIVEN** 用户查看首次使用章节
- **WHEN** 阅读首次使用说明
- **THEN** 必须说明如何创建项目
- **AND** 必须包含截图：进入hagicode 之后可以通过内部向导开始创建项目.png
- **AND** 必须说明如何导入 Git 仓库
- **AND** 必须包含截图：通过输入一个文件夹，可以扫描这个文件夹地下所有的 git 仓库进行导入.png
- **AND** 必须包含截图：hagicode desktop 正在安装中.png

#### Scenario: 版本管理说明

- **GIVEN** 用户查看版本管理章节
- **WHEN** 阅读版本管理说明
- **THEN** 必须说明如何切换不同版本
- **AND** 必须包含截图：可以在版本管理页面对不同的版本进行切换.png

#### Scenario: 启动和停止服务说明

- **GIVEN** 用户查看启动和停止服务章节
- **WHEN** 阅读服务管理说明
- **THEN** 必须说明如何启动 Hagicode Server
- **AND** 必须说明如何停止 Hagicode Server
- **AND** 必须包含截图：在首页可以通过启动服务来启动hagicode server.png

#### Scenario: 图片路径引用

- **GIVEN** Desktop 安装指南文档包含截图
- **WHEN** 引用图片资源
- **THEN** 所有图片必须使用相对路径：`/img/install-desktop/文件名.png`
- **AND** 所有图片必须有描述性的 alt 文本
- **AND** 所有图片必须在 `apps/docs/public/img/install-desktop/` 目录中存在

#### Scenario: 文档格式和风格一致性

- **GIVEN** Desktop 安装指南文档已创建
- **WHEN** 比较与其他安装指南文档
- **THEN** 必须遵循与 `docker-compose.md` 相同的结构和风格
- **AND** 必须使用简体中文内容
- **AND** 必须包含 title 和 description frontmatter
- **AND** frontmatter 必须包含 `sidebar_position: 30`

#### Scenario: Starlight 侧边栏集成

- **GIVEN** Desktop 安装指南文档已创建
- **WHEN** 文档站点构建
- **THEN** 新文档必须自动出现在 Starlight 侧边栏的"安装指南"分组下
- **AND** 文档顺序必须由 `sidebar_position` 控制
- **AND** 文档必须可以通过侧边栏导航访问

#### Scenario: 后续步骤链接

- **GIVEN** 用户阅读完 Desktop 安装指南
- **WHEN** 查看后续步骤章节
- **THEN** 必须提供到快速开始指南的链接
- **AND** 必须提供到相关文档的链接
- **AND** 所有链接必须使用正确的路径格式

#### Scenario: 文档构建验证

- **GIVEN** Desktop 安装指南文档已创建
- **WHEN** 运行 `npm run build:docs`
- **THEN** 构建必须成功完成
- **AND** 必须没有断链错误
- **AND** 生成的 HTML 必须包含完整的文档内容
- **AND** 所有图片必须正确引用
