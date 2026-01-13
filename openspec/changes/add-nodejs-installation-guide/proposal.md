# Change: 新建安装 Node 的说明

## Why

PCode 文档站点目前缺少 Node.js 运行时环境的安装说明。根据项目配置，PCode 要求 Node.js >=18.0，但现有文档仅在安装指南中简单提及，未提供各操作系统的详细安装指导。用户在开始使用 PCode 前，需要先正确安装 Node.js 环境，但目前缺少完整的安装说明文档。

## What Changes

- 新增 `docs/related-software-installation/nodejs/` 子目录
- 新增 `docs/related-software-installation/nodejs/_category_.json` 分类元数据文件
- 新增 `docs/related-software-installation/nodejs/installation.md` Node.js 安装指南文档
  - 包含 Windows、macOS、Linux 三个操作系统的安装方法
  - 使用 Docusaurus Tabs 组件组织跨平台内容
  - 覆盖官方安装包、包管理器、版本管理工具等多种安装方式
  - 包含安装验证步骤
  - 明确说明 Node.js >=18.0 的最低版本要求

## Impact

### 影响的规格
- `docusaurus-site` - 添加新的 Node.js 安装指南需求

### 影响的文件/目录
- 新增：`docs/related-software-installation/nodejs/_category_.json`
- 新增：`docs/related-software-installation/nodejs/installation.md`
- 无需修改 `sidebars.ts`（使用自动生成目录结构）

### 预期成果
- 用户能够在各操作系统上成功安装 Node.js >=18.0
- 与现有 PostgreSQL、Claude Code 安装指南形成完整的"相关软件安装"分类
- 降低用户入门门槛，提升 Quick Start 流程的完整性
- 保持与现有文档风格和格式的一致性

## Status

**ExecutionCompleted** (2026-01-13)
