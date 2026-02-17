# Change: 添加 Hagicode Desktop 安装指南

## Why

Hagicode Documentation 文档站点当前的安装指南部分包含两篇文章：Docker Compose 部署和软件包部署。然而，缺少 Hagicode Desktop 桌面应用程序的安装指南文档。

当前文档站点存在以下问题：
1. 缺少 Desktop 安装文档，用户无法了解如何下载、安装和使用桌面应用程序
2. 现有的安装方式（Docker Compose、软件包部署）无法满足所有用户的需求
3. Desktop 用户需要详细的安装向导说明，包括依赖项安装、服务启动等步骤
4. 截图资源已准备好，但缺少配套的文字说明文档

## What Changes

- 创建新的 Desktop 安装指南文档 `apps/docs/src/content/docs/installation/desktop.md`
- 使用准备好的 12 张截图说明安装向导的四个步骤
- 遵循现有安装指南的格式和风格（参考 `docker-compose.md`）
- 配置 frontmatter（title, description, sidebar_position）
- 使用相对路径引用截图资源 (`/img/install-desktop/文件名.png`)

## Impact

### 影响的规格
- `astro-site` - 添加 Desktop 安装指南文档需求

### 影响的文件/目录
- 新增：`apps/docs/src/content/docs/installation/desktop.md`
- 已有资源：`apps/docs/public/img/install-desktop/` 目录（13 张截图）
- 自动更新：Starlight 侧边栏将自动包含新文档

### 预期成果
- 用户可以通过完整的安装指南顺利安装 Hagicode Desktop
- 与现有安装指南（Docker Compose、软件包部署）形成完整覆盖
- 新文档将自动出现在 Starlight 侧边栏的"安装指南"分组下
- 遵循项目约定：kebab-case 文件命名、简体中文内容
- 保持与现有安装指南相同的结构和风格
