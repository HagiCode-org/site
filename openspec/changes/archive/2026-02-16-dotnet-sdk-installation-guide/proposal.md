# Change: 新增 .NET 10 SDK 安装指南文档

## Why

当前文档站点缺少 .NET 10 SDK 的安装指南，这是项目当前版本所需的依赖。用户在设置开发环境时需要参考此文档来正确安装和配置 .NET 10 SDK。

## What Changes

- 在 `apps/docs/src/content/docs/related-software-installation/` 目录下创建 `dotnet` 子目录
- 创建 `install-dotnet-sdk.md` 文档文件
- 文档包含系统要求、Windows/macOS/Linux 安装步骤、验证安装、常见问题等内容
- 文档遵循现有相关软件安装文档的结构和风格（使用 Tabs 组件、简体中文、包含 frontmatter）

## Impact

- **Affected specs**: astro-site（文档内容扩展）
- **Affected code**:
  - 新增：`apps/docs/src/content/docs/related-software-installation/dotnet/install-dotnet-sdk.md`
  - 新增：`apps/docs/public/img/dotnet/`（如需要截图）
- **User impact**: 用户可以通过文档站点获取 .NET 10 SDK 的安装指导
- **Maintenance**: 符合现有文档规范，易于维护和更新
