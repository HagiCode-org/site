## MODIFIED Requirements

### Requirement: OpenSpec 版本文档说明

项目 SHALL 在 `openspec/AGENTS.md` 和所有相关文档中明确标注 OpenSpec 版本要求为 0.23.0，提供安装命令和验证步骤，确保开发者了解并使用正确的工具版本。

#### Scenario: 新开发者阅读项目文档

**Given** 新开发者加入 Hagicode 文档项目
**When** 开发者阅读 openspec/AGENTS.md 工作流文档
**Then** 文档应明确说明需要使用 OpenSpec 0.23.0 版本
**And** 提供安装命令示例：`npm install -g @fission-ai/openspec@0.23.0`
**And** 说明如何验证版本：`openspec --version`

#### Scenario: 版本检查验证

**Given** 开发者安装了 OpenSpec 工具
**When** 运行 `openspec --version` 命令
**Then** 输出应显示版本 0.23.0
**And** 所有 openspec 相关命令（validate、list、archive）应正常工作

#### Scenario: 文档准确性

**Given** 项目维护者更新了 OpenSpec 相关文档
**When** 开发者按照文档中的安装步骤操作
**Then** 应成功安装 OpenSpec 0.23.0 版本
**And** 版本验证命令应返回正确的版本号
