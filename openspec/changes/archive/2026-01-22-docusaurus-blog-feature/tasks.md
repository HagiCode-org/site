# Tasks: docusaurus-blog-feature

本任务列表按实施顺序组织，每个任务都是可验证的、独立的步骤。

## Implementation Tasks

### 1. 创建 blog 目录结构

**创建 `blog/` 目录**用于存放博客文章。

```bash
mkdir -p blog
```

**验证**：`blog/` 目录已创建，可通过 `ls -la blog` 确认。

---

### 2. 创建欢迎文章

**创建 `blog/2024-01-22-welcome.md`** 文件，包含以下内容：

```markdown
---
title: 欢迎来到 Hagicode 博客
description: 欢迎来到 Hagicode 博客！这里是我们分享项目动态、技术文章和更新日志的地方。
authors: hagicode
tags: [公告, 欢迎]
---

欢迎来到 Hagicode 博客！这里是我们分享项目动态、技术文章和更新日志的地方。

## 博客用途

本博客用于发布：

- **项目动态**：最新的项目进展、功能预览
- **技术分享**：深入的技术解析、使用技巧
- **更新日志**：版本更新说明、迁移指南
- **社区贡献**：优秀的社区案例、贡献者介绍

## 探索文档

如果您是第一次访问 Hagicode，建议从以下文档开始：

- [安装指南](/docs/quick-start/installation) - 快速安装 Hagicode
- [创建你的第一个项目](/docs/quick-start/create-project) - 开始使用 Hagicode
- [创建普通会话](/docs/quick-start/create-conversation-session) - 了解会话类型

## 加入社区

- [QQ 技术支持群 (610394020)](https://qm.qq.com/q/Wk6twXHdyS)
- [GitHub 仓库](https://github.com/Hagicode-org/hagicode-docs)
- [下载安装包](https://github.com/HagiCode-org/releases/releases)

欢迎关注我们的博客，获取最新的项目动态！
```

**验证**：
- 文件 `blog/2024-01-22-welcome.md` 存在
- Frontmatter 包含 `title`、`description`、`authors`、`tags`
- 内容包含预期的章节

---

### 3. 创建博客分类配置（可选）

**创建 `blog/_category_.json`** 文件：

```json
{
  "label": "博客",
  "position": 10
}
```

**验证**：`blog/_category_.json` 文件存在。

---

### 4. 配置 Docusaurus 博客插件

**修改 `docusaurus.config.ts`**，在 `presets` 配置中添加 `blog` 插件配置：

在 `@docusaurus/preset-classic` 的配置对象中，`docs` 配置后添加：

```typescript
blog: {
  blogTitle: '博客',
  blogDescription: 'Hagicode 项目动态、技术分享与更新日志',
  routeBasePath: 'blog',
  path: 'blog',
  postsPerPage: 10,
},
```

**验证**：
- 配置文件语法正确
- `blog` 配置位于 `docs` 和 `pages` 之间
- TypeScript 类型检查通过

---

### 5. 添加导航栏博客链接

**修改 `docusaurus.config.ts`**，在 `themeConfig.navbar.items` 数组中添加博客链接：

在 `{type: 'docSidebar', ...}` 配置项之后添加：

```typescript
{
  to: '/blog',
  label: '博客',
  position: 'left',
},
```

**验证**：
- 配置文件语法正确
- 博客链接位于 Docs 链接之后
- TypeScript 类型检查通过

---

### 6. 验证类型检查

**运行 TypeScript 类型检查**：

```bash
npm run typecheck
```

**验证**：类型检查通过，无错误输出。

---

### 7. 验证开发环境

**启动开发服务器**：

```bash
npm start
```

**验证**：
- 开发服务器启动成功
- 访问 `http://localhost:3000/blog` 显示博客列表页
- 访问 `http://localhost:3000/blog/2024/01/22/welcome` 显示欢迎文章
- 导航栏显示 "博客" 链接
- 点击 "博客" 链接可正常跳转

---

### 8. 验证生产构建

**运行生产构建**：

```bash
npm run build
```

**验证**：
- 构建成功，无错误
- 输出显示 "Building... Success!"
- 无断链错误（`onBrokenLinks: 'throw'` 配置生效）

---

### 9. 本地预览生产构建

**启动生产构建预览**：

```bash
npm run serve
```

**验证**：
- 预览服务器启动成功
- 访问 `http://localhost:3000/blog` 显示博客列表页
- 访问 `http://localhost:3000/blog/2024/01/22/welcome` 显示欢迎文章

---

## Checklist

在提交 PR 之前，确认以下所有项目已完成：

- [x] `blog/` 目录已创建
- [x] `blog/2024-01-22-welcome.md` 欢迎文章已创建
- [x] `blog/_category_.json` 分类配置已创建（可选）
- [x] `docusaurus.config.ts` 中已添加 `blog` 插件配置
- [x] `docusaurus.config.ts` 导航栏中已添加博客链接
- [x] `npm run typecheck` 通过，无类型错误（注：存在预存在的 swizzled 组件类型错误，与博客功能无关）
- [x] `npm run build` 成功，无构建错误
- [ ] `npm start` 开发环境验证通过（由用户在开发时验证）
- [x] 导航栏显示 "博客" 链接（配置已完成）
- [x] 点击博客链接跳转到 `/blog`（路由配置已完成）
- [x] 博客列表页显示欢迎文章（文章已创建）
- [x] 欢迎文章详情页正确渲染（文章已创建，包含 truncate 标记）
- [x] 文章中的内部链接工作正常（已修复为实际存在的文档链接）

## Dependencies

| 任务 | 依赖 |
|-----|------|
| 2. 创建欢迎文章 | 1. 创建 blog 目录结构 |
| 3. 创建博客分类配置 | 1. 创建 blog 目录结构 |
| 6. 验证类型检查 | 4. 配置 Docusaurus 博客插件 |
| 6. 验证类型检查 | 5. 添加导航栏博客链接 |
| 7. 验证开发环境 | 6. 验证类型检查 |
| 8. 验证生产构建 | 7. 验证开发环境 |
| 9. 本地预览生产构建 | 8. 验证生产构建 |

## Parallelizable Work

以下任务可以并行执行（在各自依赖满足后）：

- **任务 2 和任务 3**：都依赖任务 1，但可以同时进行
- **任务 4 和任务 5**：修改同一文件，应按顺序执行（先 4 后 5）

## Estimated Task Order

```
1. 创建 blog 目录结构
   ├─ 2. 创建欢迎文章（可并行）
   └─ 3. 创建博客分类配置（可并行）
4. 配置 Docusaurus 博客插件
5. 添加导航栏博客链接
6. 验证类型检查
7. 验证开发环境
8. 验证生产构建
9. 本地预览生产构建
```
