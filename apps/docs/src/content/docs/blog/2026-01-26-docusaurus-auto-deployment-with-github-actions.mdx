---
title: "HagiCode 实践:如何利用 GitHub Actions 实现 Docusaurus 自动部署"
date: 2026-01-26
truncate: true
englishSlug: "docusaurus-auto-deployment-with-github-actions"
---

# 为 HagiCode 添加 GitHub Pages 自动部署支持

> 本项目早期代号为 PCode，现已正式更名为 HagiCode。本文记录了如何为项目引入自动化静态站点部署能力，让内容发布像喝水一样简单。

## 背景/引言

在 HagiCode 的开发过程中，我们遇到了一个很现实的问题：随着文档和提案越来越多，如何高效地管理和展示这些内容成了当务之急。我们决定引入 GitHub Pages 来托管我们的静态站点，但是手动构建和部署实在是太麻烦了——每次改动都要本地构建、打包，然后手动推送到 `gh-pages` 分支。这不仅效率低下，还容易出错。

为了解决这个问题（主要是为了偷懒），我们需要一套自动化的部署流程。本文将详细记录如何为 HagiCode 项目添加 GitHub Actions 自动部署支持，让我们只需专注于内容创作，剩下的交给自动化流程。

## 关于 HagiCode

> 嘿，介绍一下我们正在做的东西

我们正在开发 **HagiCode**——一款 AI 驱动的代码智能助手，让开发体验变得更智能、更便捷、更有趣。

**智能**——AI 全程辅助，从想法到代码，让编码效率提升数倍。**便捷**——多线程并发操作，充分利用资源，开发流程顺畅无阻。**有趣**——游戏化机制和成就系统，让编码不再枯燥，充满成就感。

项目正在快速迭代中，如果你对技术写作、知识管理或者 AI 辅助开发感兴趣，欢迎来 [GitHub](https://github.com/HagiCode-org/site) 看看～

## 目标分析

在动手之前，我们得先明确这次任务到底要干啥。毕竟（这里打错了，应该是毕竟）磨刀不误砍柴工嘛。

### 核心需求

1.  **自动化构建**：当代码推送到 `main` 分支时，自动触发构建流程。
2.  **自动部署**：构建成功后，自动将生成的静态文件部署到 GitHub Pages。
3.  **环境一致性**：确保 CI 环境和本地构建环境一致，避免"本地能跑，线上报错"的尴尬。

### 技术选型

考虑到 HagiCode 是基于 Docusaurus 构建的（一种非常流行的 React 静态站点生成器），我们可以利用 GitHub Actions 来实现这一目标。

## 配置 GitHub Actions 工作流

GitHub Actions 是 GitHub 提供的 CI/CD 服务。通过在代码仓库中定义 YAML 格式的工作流文件，我们可以定制各种自动化任务。

### 创建工作流文件

我们需要在项目根目录下的 `.github/workflows` 文件夹中创建一个新的配置文件，比如叫 `deploy.yml`。如果文件夹不存在，记得先手动创建一下。

这个配置文件的核心逻辑如下：

1.  **触发条件**：监听 `main` 分支的 `push` 事件。
2.  **运行环境**：最新版的 Ubuntu。
3.  **构建步骤**：
    -   检出代码
    -   安装 Node.js
    -   安装依赖 (`npm install`)
    -   构建静态文件 (`npm run build`)
4.  **部署步骤**：使用官方提供的 `action-gh-pages` 将构建产物推送到 `gh-pages` 分支。

### 关键配置代码

以下是我们最终采用的配置模板：

```yaml
name: Deploy to GitHub Pages

# 触发条件：当推送到 main 分支时
on:
  push:
    branches:
      - main
    # 可以根据需要添加路径过滤，比如只有文档变动才构建
    # paths:
    #   - 'docs/**'
    #   - 'package.json'

# 设置权限，这对于部署到 GitHub Pages 很重要
permissions:
  contents: read
  pages: write
  id-token: write

# 并发控制：取消同一分支的旧构建
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        # 注意：必须设置 fetch-depth: 0，否则可能导致构建版本号不准确
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20 # 建议与本地开发环境保持一致
          cache: 'npm'     # 启用缓存可以加速构建过程

      - name: Install dependencies
        run: npm ci
        # 使用 npm ci 而不是 npm install，因为它更快、更严格，适合 CI 环境

      - name: Build website
        run: npm run build
        env:
          # 如果你的站点构建需要环境变量，在这里配置
          # NODE_ENV: production
          # PUBLIC_URL: /your-repo-name
          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./build # Docusaurus 默认输出目录

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 实施过程中的坑点

在实际操作中，我们遇到了一些问题，这里分享出来希望大家能避开（或者提前准备好解决方案）。

### 1. GitHub Token 权限问题

最开始配置的时候，部署总是报错 403 (Forbidden)。查了好久才发现，是因为 GitHub 默认的 `GITHUB_TOKEN` 并没有写入 Pages 的权限。

**解决方案**：在仓库的 `Settings` -> `Actions` -> `General` -> `Workflow permissions` 中，务必选择 **"Read and write permissions"**。

### 2. 构建目录路径错误

Docusaurus 默认把构建好的静态文件放在 `build` 目录。但是有些项目（比如 Create React App 默认是 `build`，Vite 默认是 `dist`）可能配置不一样。如果在 Actions 中报错找不到文件，记得去 `docusaurus.config.js` 里检查一下输出路径配置。

### 3. 子路径问题

如果你的仓库不是用户主页（即不是 `username.github.io`），而是项目主页（比如 `username.github.io/project-name`），你需要配置 `baseUrl`。

在 `docusaurus.config.js` 中：

```javascript
module.exports = {
  // ...
  url: 'https://hagicode.com', // 你的 Hagicode URL
  baseUrl: '/', // 根路径部署
  // ...
};
```
这一点很容易被忽略，配置不对会导致页面打开全是白屏，因为资源路径加载不到。

## 验证成果

配置完所有东西并推送代码后，我们就可以去 GitHub 仓库的 **Actions** 标签页看戏了。

你会看到黄色的圆圈（工作流正在运行），变绿就代表成功啦！如果变红了，点击进去查看日志，通常都能排查出问题（大部分时候是拼写错误或者路径配置不对）。

构建成功后，访问 `https://<你的用户名>.github.io/<仓库名>/` 就能看到崭新的站点了。

## 总结

通过引入 GitHub Actions，我们成功实现了 HagiCode 文档站的自动化部署。这不仅节省了手动操作的时间，更重要的是保证了发布流程的标准化。现在不管是哪位小伙伴更新了文档，只要合并到 `main` 分支，几分钟后就能在线上看到最新的内容。

**核心收益**：
- **效率提升**：从"手动打包、手动上传"变成"代码即发布"。
- **降低错误**：消除了人为操作失误的可能性。
- **体验优化**：让开发者更专注于内容质量，而不是被繁琐的部署流程困扰。

虽然配置 CI/CD 刚开始有点麻烦（尤其是各种权限和路径问题），但这是一次性投入，长期回报巨大的工作。强烈建议所有静态站点项目都接入类似的自动化流程。

## 参考资料

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Docusaurus 部署指南](https://docusaurus.io/docs/deployment)
- [actions-gh-pages Action 使用说明](https://github.com peaceiris/actions-gh-pages)



---

## 互动引导

感谢您的阅读,如果您觉得本文有用,快点击下方点赞按钮👍,让更多的人看到本文。

## AI 辅助声明

本内容采用人工智能辅助协作,经本人审核,符合本人观点与立场。

## 元信息

- **本文作者:** [newbe36524](https://www.newbe.pro)
- **本文链接:** [https://hagicode.com/blog/2026/01/25/docusaurus-auto-deployment-with-github-actions](https://hagicode.com/blog/2026/01/25/docusaurus-auto-deployment-with-github-actions)
- **版权声明:** 本博客所有文章除特别声明外,均采用 BY-NC-SA 许可协议。转载请注明出处!