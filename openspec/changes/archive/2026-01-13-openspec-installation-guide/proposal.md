# Change: 新建 OpenSpec 安装说明文档

## Why

PCode 文档站点已包含详细的 **Claude Code** 安装指南，但作为项目核心的 **OpenSpec**（规范驱动开发工具）缺乏同等详细程度的安装说明。主安装指南仅简单提及通过 `npm install -g @fission-ai/openspec@latest` 安装，未提供详细的步骤说明、配置指导、验证步骤和故障排除。这导致用户在安装 OpenSpec 时面临困难，无法确认工具是否正确安装并可用。

## What Changes

- **新增** OpenSpec 安装说明文档 `docs/related-software-installation/openspec/setup-openspec.md`
- **新增** OpenSpec 子目录分类元数据 `docs/related-software-installation/openspec/_category_.json`
- **更新** 主安装指南中 OpenSpec 部分，添加到新详细安装指南的链接
- **新增** OpenSpec 安装验证和环境检查脚本

### Document Structure

The new `setup-openspec.md` document will include:

1. **OpenSpec 简介**
   - 说明 OpenSpec 的作用（规范驱动开发工具）
   - 在 PCode 项目中的应用场景

2. **安装方式**
   - 通过 NPM 全局安装（主要方式）
   - 多平台支持说明（Windows/macOS/Linux）
   - 安装验证步骤

3. **配置说明**
   - 基本配置（如需）
   - 与 Git 仓库的集成
   - 环境变量配置（如需）

4. **验证和测试**
   - 安装验证命令
   - 基本功能测试（如 `openspec list`、`openspec validate`）
   - 完整的环境验证脚本

5. **常见问题和故障排除**
   - 权限问题解决
   - 网络问题处理
   - 版本兼容性问题

### Technical Requirements

- 使用 Docusaurus 的 MDX 格式
- 遵循项目文档约定（kebab-case 文件命名、frontmatter 包含 title 和 description）
- 使用 Tabs 组件展示多平台命令（与 Claude Code 安装指南保持一致）
- 使用 callouts（`:::tip`、`:::note`、`:::warning`）提供重要提示
- 添加代码块语法高亮（bash、powershell）

## Impact

### Affected Specs

- `specs/docusaurus-site/spec.md` - 添加新的文档需求

### Affected Code

- `docs/quick-start/installation.md` - 更新 OpenSpec 安装部分，添加到详细指南的链接
- `docs/related-software-installation/openspec/setup-openspec.md` - 新建
- `docs/related-software-installation/openspec/_category_.json` - 新建

### User Benefits

- 用户可以按照结构化指南轻松完成 OpenSpec 安装
- 减少因安装问题导致的使用障碍
- 通过验证脚本快速定位和解决安装问题
- 与 Claude Code 安装指南形成配套文档，提升文档完整性
