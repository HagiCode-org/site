---
title: 创建您的第一个项目
description: 学习如何在 Hagicode 中创建和配置您的第一个项目，从仓库准备到 OpenSpec 初始化。
sidebar_position: 20
---

欢迎来到 Hagicode！安装完成后,让我们创建你的第一个项目。本指南会带你一步步完成设置,从准备代码仓库到初始化 OpenSpec,就像朋友手把手教你一样。

## 先决条件

在创建第一个项目之前，请确保你具备：

- 一个想要使用 Hagicode 管理的代码仓库
- 已安装并配置 Git
- 对命令行操作的基本了解

别担心，这些都很简单！

## 步骤 1：准备您的代码仓库

在将项目添加到 Hagicode 之前，您需要准备一个想要用 Hagicode 管理的代码仓库。

### 克隆您的代码仓库

如果您想要管理的代码已经在远程仓库（GitHub、GitLab 等）中，请将其克隆到本地：

```bash
# 克隆您的代码仓库到本地
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

克隆后，记下仓库的本地路径（例如：`C:\Users\YourName\Projects\your-repo` 或 `/home/yourname/projects/your-repo`），在下一步中您将需要这个路径。

:::tip
Hagicode 适合管理任何您想要通过 AI 辅助开发和优化的代码项目，包括：
- 正在开发的功能项目
- 需要重构或优化的现有代码
- 团队协作的项目
- 个人开源项目
:::

### 如果您的代码只在本地

如果您想要管理的代码还在本地，尚未推送到远程仓库：

```bash
cd /path/to/your/project
git init
git add .
git commit -m "Initial commit"
```

建议在 GitHub/GitLab 上创建远程仓库并推送：

```bash
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

## 步骤 2：在 Hagicode 界面中添加项目

现在让我们将项目添加到 Hagicode 界面。

### 访问项目页面

1. 在浏览器中导航到 `http://127.0.0.1:34567`
2. 点击导航侧边栏中的 **Projects**（项目）
3. 点击 **Add Project**（添加项目）按钮

![点击新建项目按钮](/img/create-project/step1-click-new-project-button.png)

### 配置项目设置

填写项目信息：

![填写项目的一般信息](/img/create-project/step2-fill-project-information.png)

:::note
仓库路径必须指向本地计算机上有效的 Git 仓库。
:::

:::note[Docker Compose 部署注意事项]
如果您使用的是 **Docker Compose 部署方式**，在填写仓库路径时需要注意：

- **使用容器内路径**：填写的是容器内的路径，而不是主机的路径
- **路径映射关系**：根据 `docker-compose.yml` 中的路径映射配置
  - 主机路径：`/path/to/your/repos`（您在 docker-compose.yml 中配置的）
  - 容器路径：`/app/workdir`（固定路径）

**示例**：
如果您的 `docker-compose.yml` 配置为：
```yaml
volumes:
  - /home/user/myproject:/app/workdir
```

那么在填写仓库路径时应该使用容器内路径：
```
/app/workdir
```

**重要提示**：
- 确保您的代码仓库已经映射到容器的 `/app/workdir` 路径
- 如果使用软件包部署方式，则直接填写主机上的实际路径即可
:::

### 创建项目

填写完必填信息后：

1. 点击 **创建项目**按钮添加项目
2. Hagicode 将验证仓库路径
3. 您的项目将出现在项目列表中

![新建项目之后，在项目列表当中就可以看到这个项目](/img/create-project/step3-project-list-view.png)

## 步骤 3：初始化 SDD

SDD（软件设计文档）是 Hagicode 中用于管理项目设计和变更的重要组件。在项目中初始化 SDD 会创建管理变更所需的必要结构。

### 运行 SDD 初始化

在项目概览中，找到 SDD 部分：

1. 点击项目的 SDD tab

![点击项目的 SDD tab，可以对 SDD 进行初始化](/img/create-project/step4-click-sdd-tab.png)

2. 点击 **初始化 SDD** 按钮

![初始化完 SDD 之后显示的状态](/img/create-project/step5-sdd-initialized-status.png)

## 步骤 4：优化 project.md

Hagicode 会自动为您优化 `project.md` 文件，添加详细的项目信息和提示词配置。

### 运行优化

1. 在项目详情页面，点击右上角的 **优化** 按钮

![点击优化按钮，可以优化 Project.md](/img/create-project/step6-click-optimize-button.png)

2. Hagicode 将自动分析您的代码仓库并生成优化的 project.md 内容

:::note
优化过程可能需要较长时间，具体取决于您的项目规模和复杂度。点击优化按钮后，您可以暂时离开，Hagicode 会在后台完成优化工作。
:::

## 步骤 5：提交到版本控制

完成 SDD 初始化和 project.md 优化后，需要将这些重要的配置文件提交到您的版本控制系统。

### 提交所有更改

将所有生成的文件和优化后的配置提交到您的仓库：

```bash
cd /path/to/your/project
git add .
git commit -m "初始化 SDD 并优化 project.md"
```

:::tip
将这些文件保留在版本控制中非常重要，因为：
- **SDD 相关文件**包含了项目的提案、规范和变更管理结构，确保团队协作和变更追踪
- **project.md** 文件包含了项目的重要元数据和 AI 交互的提示词配置，是 Hagicode 正常工作的关键

将这些文件纳入版本控制，可以确保整个团队使用一致的配置，并完整记录项目的所有设计和决策过程。
:::

## 后续步骤

恭喜！您已经在 Hagicode 中创建了第一个项目。以下是一些推荐的后续步骤：

- **[对话会话](/quick-start/conversation-session)** - 了解如何使用 AI 驱动的编码会话
- **[提案会话](/quick-start/proposal-session)** - 深入了解管理提案
