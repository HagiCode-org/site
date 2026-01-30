# 规范增量: Astro 站点

## MODIFIED Requirements

### Requirement: 文档站点技术栈
**ID**: `ASTRO-SITE-TECH-STACK`

站点 **MUST** 使用 Astro 5.x 框架构建,而不是 Docusaurus。**MUST** 在项目文档中准确反映当前技术栈,避免误导开发者。

#### Scenario: 开发者查看项目技术栈

**Given** 开发者打开 `README.md`
**When** 阅读技术栈描述部分
**Then** 应显示 "基于 Astro 构建",而不是 "基于 Docusaurus 构建"
**And** 底部链接应指向 `https://astro.build/`,而不是 `https://docusaurus.io/`

#### Scenario: 开发者运行快速开始命令

**Given** 开发者克隆项目并安装依赖
**When** 按照 README 中的快速开始指南操作
**Then** 启动开发服务器的命令应为 `npm run dev`
**And** 不应包含 `npm start` 命令(这是 Docusaurus 的命令)

### Requirement: Astro 目录结构
**ID**: `ASTRO-SITE-STRUCTURE`

站点 **MUST** 使用 Astro 的标准目录结构,而不是 Docusaurus 的目录结构。项目文档 **SHALL** 准确描述 Astro 目录结构,不包含 Docusaurus 特定文件说明。

#### Scenario: 开发者查看项目结构说明

**Given** 开发者阅读 README 中的项目结构部分
**When** 查看目录树
**Then** 应包含 Astro 特定目录:
  - `astro.config.mjs` - Astro 配置文件
  - `src/content/` - 内容集合
  - `src/layouts/` - 布局组件
  - `src/components/` - React 和 Astro 组件
  - `src/pages/` - 文件系统路由
  - `public/` - 静态资源
**And** 不应包含 Docusaurus 特定文件:
  - `docusaurus.config.ts`
  - `sidebars.ts`
  - `src/theme/`

### Requirement: 开发者文档准确性
**ID**: `ASTRO-SITE-DOCS-ACCURACY`

所有项目文档 **MUST** 准确反映 Astro 技术栈,不包含过时的 Docusaurus 引用。文档更新 **SHALL** 确保新开发者不会被过时信息误导。

#### Scenario: 新开发者查阅项目文档

**Given** 新开发者克隆项目
**When** 阅读 README.md 和 openspec/project.md
**Then** 所有技术栈引用应指向 Astro
**And** 所有命令示例应使用 Astro 命令
**And** 不应包含 Docusaurus 相关的配置说明

#### Scenario: 开发者搜索 Docusaurus 引用

**Given** 开发者在项目根目录搜索 "docusaurus" 或 "Docusaurus"
**When** 运行 `grep -r "docusaurus\|Docusaurus" --exclude-dir=node_modules --exclude-dir=.astro --exclude-dir=dist --exclude-dir=.git --exclude-dir=archive --exclude-dir=openspec/specs/docusaurus-site`
**Then** 应返回 "无残留 Docusaurus 引用" 或仅返回 `openspec/specs/docusaurus-site/` 中的引用
**And** `docusaurus-site` 规范应标记为 deprecated

---

## ADDED Requirements

### Requirement: Astro 站点规范
**ID**: `ASTRO-SITE-SPEC`

项目 **MUST** 有完整的 Astro 站点规范,描述 Astro 特定的功能和配置。规范 **SHALL** 包含技术栈、目录结构、内容集合配置和构建部署流程的完整说明。

#### Scenario: 开发者查阅 Astro 站点规范

**Given** 开发者打开 `openspec/specs/astro-site/spec.md`
**When** 阅读规范内容
**Then** 应包含 Astro 技术栈描述
**And** 应包含 Astro 目录结构说明
**And** 应包含 Astro 内容集合配置
**And** 应包含 Astro 构建和部署流程
**And** 不应包含 Docusaurus 相关内容

### Requirement: Docusaurus 规范归档
**ID**: `DEPRECATED-DOCUSAURUS-SPEC`

旧的 Docusaurus 站点规范 **MUST** 标记为 deprecated,并 **SHALL** 指向新的 Astro 规范。标记 **MUST** 清晰说明当前项目使用 Astro,而不是 Docusaurus。

#### Scenario: 开发者查阅旧的 Docusaurus 规范

**Given** 开发者打开 `openspec/specs/docusaurus-site/spec.md`
**When** 阅读规范顶部
**Then** 应显示明显的 deprecated 警告
**And** 应包含指向新 Astro 规范的链接
**And** 警告应说明当前项目使用 Astro,而不是 Docusaurus

---

## REMOVED Requirements

(此部分不适用于 astro-site 规范,因为这是一个全新的规范)

---

## RENAMED Requirements

### Requirement: 站点规范重命名
**ID**: `RENAMED-SITE-SPEC`

将 `docusaurus-site` 规范重命名为 `astro-site` 规范,反映当前技术栈。

#### Scenario: 开发者列出所有规范

**Given** 开发者运行 `openspec list --specs`
**When** 查看规范列表
**Then** 应包含 `astro-site` 规范
**And** `docusaurus-site` 规范应标记为 deprecated(如果仍存在)
**And** 规范列表应反映当前技术栈状态
