---
title: 创建您的第一个项目
description: 学习如何在 PCode 中创建和配置您的第一个项目，从仓库准备到 OpenSpec 初始化。
sidebar_position: 20
---

# 创建您的第一个项目

现在您已经安装并运行了 PCode，让我们创建您的第一个项目。本指南将引导您完成在 PCode 中设置项目的完整过程，从准备仓库到初始化 OpenSpec。

## 先决条件

在创建第一个项目之前，请确保您具备：

- 已安装并运行的 PCode（参见[安装指南](/docs/quick-start/installation)）
- 一个想要使用 PCode 管理的代码仓库
- 已安装并配置 Git
- 对命令行操作的基本了解

## 步骤 1：准备您的仓库

在将项目添加到 PCode 之前，请确保您的仓库已准备就绪。

### 初始化 Git（如果尚未完成）

如果您的项目还不是 Git 仓库，请初始化它：

```bash
cd /path/to/your/project
git init
git add .
git commit -m "Initial commit"
```

### 远程仓库设置

如果您使用远程仓库（GitHub、GitLab 等），请添加远程仓库：

```bash
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

:::tip
建议将您的仓库放在像 GitHub 这样的远程平台上，以便更好地协作和备份。
:::

## 步骤 2：在 PCode 界面中添加项目

现在让我们将项目添加到 PCode 界面。

### 访问项目页面

1. 在浏览器中导航到 `http://127.0.0.1:34567`
2. 点击导航侧边栏中的 **Projects**（项目）
3. 点击 **Add Project**（添加项目）按钮

### 配置项目设置

填写项目信息：

| 字段 | 描述 | 示例 |
|------|------|------|
| **名称** | 项目的友好名称 | `我的网站` |
| **仓库路径** | 仓库的本地路径 | `/Users/john/projects/my-website` |
| **描述** | 可选的项目描述 | `使用 React 构建的个人网站` |
| **标签** | 可选的组织标签 | `web, 前端, react` |

:::note
仓库路径必须指向本地计算机上有效的 Git 仓库。
:::

### 保存项目

填写完必填信息后：

1. 点击 **Save**（保存）添加项目
2. PCode 将验证仓库路径
3. 您的项目将出现在项目列表中

## 步骤 3：初始化 OpenSpec

OpenSpec 是 PCode 的提案和规范管理系统。在项目中初始化 OpenSpec 会创建管理变更所需的必要结构。

### 导航到项目详情

1. 在项目列表中点击您新创建的项目
2. 您将看到项目概览页面

### 运行 OpenSpec 初始化

在项目概览中，找到 **OpenSpec** 部分：

1. 点击 **Initialize OpenSpec**（初始化 OpenSpec）
2. PCode 将在您的仓库中创建以下结构：

```
your-repository/
└── openspec/
    ├── project.md          # 项目元数据和配置
    ├── changes/            # 变更提案目录
    │   └── .gitkeep
    ├── specs/              # 规范目录（可选）
    │   └── .gitkeep
    └── AGENTS.md           # OpenSpec 代理指令
```

### 提交 OpenSpec 结构

初始化后，将新文件提交到您的仓库：

```bash
cd /path/to/your/project
git add openspec/
git commit -m "初始化 OpenSpec 结构"
```

:::tip
将 OpenSpec 结构保留在版本控制中，以跟踪所有提案和规范。
:::

## 步骤 4：优化 project.md

`openspec/project.md` 文件包含有关您项目的重要元数据。让我们根据您的需求进行自定义。

### 编辑 project.md

在文本编辑器中打开 `openspec/project.md`：

```bash
cd /path/to/your/project
code openspec/project.md  # 或使用您首选的编辑器
```

### 了解 project.md 结构

该文件包含以下部分：

```markdown
---
id: your-project-id
name: Your Project Name
description: A brief description of your project
version: 0.1.0
created: YYYY-MM-DD
---

# 项目元数据

此文件包含有关您项目的基本信息...
```

### 为您的项目自定义

更新字段以匹配您的项目：

| 字段 | 描述 | 示例 |
|------|------|------|
| **id** | 唯一标识符（短横线命名法） | `my-awesome-website` |
| **name** | 显示名称 | `我的精彩网站` |
| **description** | 简短描述 | `展示我工作的个人网站` |
| **version** | 当前版本 | `0.1.0` |
| **tags** | 项目标签 | `web, 个人, 作品集` |

### project.md 示例

```markdown
---
id: my-portfolio-website
name: 我的作品集网站
description: 使用 Next.js 和 Tailwind CSS 构建的个人作品集网站
version: 0.1.0
created: 2025-01-12
tags:
  - web
  - portfolio
  - nextjs
  - tailwind
---

# 项目元数据

该项目是一个展示我开发工作的个人作品集网站...
```

### 保存并提交

自定义后：

```bash
git add openspec/project.md
git commit -m "自定义项目元数据"
```

## 验证您的设置

让我们验证一切是否正常工作。

### 在 PCode 中检查项目

1. 返回 PCode 界面
2. 导航到您的项目
3. 验证 OpenSpec 部分显示为已初始化
4. 检查项目元数据是否正确显示

### 创建您的第一个提案（可选）

要测试 OpenSpec 工作流程，请尝试创建一个简单的提案：

1. 在您的项目中，点击 **New Proposal**（新建提案）
2. 输入标题："添加关于页面"
3. 描述您想要进行的变更
4. 保存提案
5. 使用显示的 CLI 命令管理提案

:::tip
有关管理提案的更多详细信息，请参阅 [提案会话](/docs/quick-start/proposal-session)。
:::

## 常见问题

### 找不到仓库路径

如果 PCode 找不到您的仓库：

1. **验证路径**是否正确且为绝对路径
2. **检查权限** - PCode 需要目录的读取权限
3. **确保它是 Git 仓库** - 在目录中运行 `git status`

### OpenSpec 初始化失败

如果初始化失败：

1. **检查目录权限** - 确保您可以写入仓库
2. **验证 Git 已初始化** - 在项目目录中运行 `git status`
3. **检查现有的 openspec 文件夹** - 如果存在则删除它并重试

### Project.md 未更新

如果对 `project.md` 的更改未反映：

1. **保存文件** - 确保编辑器保存了更改
2. **在 PCode 中刷新页面**
3. **提交更改** - PCode 可能只跟踪已提交的更改

## 后续步骤

恭喜！您已经在 PCode 中创建了第一个项目。以下是一些推荐的后续步骤：

- **[对话会话](/docs/quick-start/conversation-session)** - 了解如何使用 AI 驱动的编码会话
- **[提案会话](/docs/quick-start/proposal-session)** - 深入了解管理提案

## 总结

在本指南中，您学习了如何：

1. 为 PCode 准备仓库
2. 通过 PCode 界面添加项目
3. 在项目中初始化 OpenSpec
4. 使用项目元数据自定义 `project.md`
5. 验证您的设置

现在您已经准备好将 PCode 的强大功能用于您的开发工作流程！
