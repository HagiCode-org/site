---
title: 安装 Claude Code
description: 本指南将帮助您安装 Claude Code 并配置智谱 AI (ZAI) 模型。
sidebar_position: 10
---

# 安装 Claude Code

Claude Code 是一个强大的 AI 辅助编程工具，能够显著提升开发效率和代码质量。本指南将指导您安装 Claude Code 并配置智谱 AI (ZAI) 模型。

## 安装 Claude Code

### 为什么不推荐官方安装方式

Claude Code 官方提供了两种安装方式：
- **Native 安装**：需要从 GitHub Releases 下载二进制文件
- **官方脚本安装**：需要执行官方提供的安装脚本

由于网络原因，上述方式在国内网络环境下可能无法正常使用。因此，我们推荐使用 **NPM 安装方式**，这种方式更稳定且在国内网络环境下表现更好。

### 使用 NPM 安装

通过 NPM 可以非常方便地安装 Claude Code。请确保您已经安装了 Node.js 环境。

```bash
npm install -g @anthropic-ai/claude-code
```

安装完毕之后，可以通过以下命令验证安装是否成功：

```bash
claude --version
```

## 购买 ZAI 订阅

使用 ZAI 您需要先购买订阅并获得 API Key。对于代码编写来说，建议购买 Coding Plan 作为日常使用，这样会更加节约成本。

可以通过以下链接购买获得 **10% 优惠**：[https://www.bigmodel.cn/claude-code?ic=14BY54APZA](https://www.bigmodel.cn/claude-code?ic=14BY54APZA)

:::tip
初次体验可以购买 lite 版本，价格更低。
:::

购买成功之后可以通过以下地址创建 API Key：[https://bigmodel.cn/usercenter/proj-mgmt/apikeys](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)

## 在 Claude Code 中配置 ZAI

官方提供了文档来说明如何在 Claude Code 中配置 ZAI 模型：[https://docs.bigmodel.cn/cn/coding-plan/tool/claude](https://docs.bigmodel.cn/cn/coding-plan/tool/claude)

ZAI 现在提供了一个简单的命令行工具 `coding-helper` 来帮助您配置 Claude Code。

```bash
# 进入命令行界面，执行如下运行 Coding Tool Helper
npx @z_ai/coding-helper
```

运行之后会进入一个交互式的命令行界面，按照提示输入您的 API Key 并选择 Claude Code 即可完成配置。

## 初次体验

完成配置之后，您就可以在 Claude Code 中使用 ZAI 模型了。在命令行中输入：

```bash
claude
```

即可进入 Claude Code 的交互界面。在交互界面中，可以进行围绕当前文件夹的上下文进行代码生成和修改。

:::note
如果第一次呼出的时候要求填写一个 API Key，您可以随便输入一个字符串，因为这不是我们需要的 Key，真正的 Key 已经通过 `coding-helper` 工具配置好了。
:::

## IDE 插件

Claude Code 也提供了 VSCode 和 JetBrains 系列 IDE 的插件，可以让您在熟悉的开发环境中使用 Claude Code 和 ZAI 模型。

- **VSCode 插件市场链接**：[https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code)
- **JetBrains 插件市场链接**：[https://plugins.jetbrains.com/plugin/27310-claude-code-beta-](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-)

:::tip
使用 IDE 插件比起命令行工具来说，体验会更好一些，因为它可以识别到您鼠标选中的代码片段，以及您当前打开的文件，从而提供更精准的代码生成和修改建议。
:::
