---
title: 安装 OpenSpec
description: 本指南将帮助您安装 OpenSpec 规范驱动开发工具。
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 安装 OpenSpec

OpenSpec 是一个规范驱动开发工具，用于管理提案、规范和变更。它帮助团队通过结构化的方式管理工作流程，确保所有变更都经过审查和验证。本指南将指导您完成 OpenSpec 的安装过程。

## 什么是 OpenSpec？

OpenSpec 是一个命令行工具，专门用于管理软件开发过程中的提案（Proposals）和规范（Specifications）。它提供了一套完整的工作流程，包括：

- **提案管理**：创建、审查和跟踪功能提案
- **规范验证**：确保代码变更符合预定义的规范
- **变更追踪**：记录所有经过审查的变更历史
- **团队协作**：支持多人协作开发

### 在 PCode 项目中的应用

在 PCode 项目中，OpenSpec 用于：

1. **管理功能开发**：所有新功能都需要通过 OpenSpec 提案流程
2. **代码审查**：确保变更符合项目规范
3. **文档同步**：保持文档与代码实现的一致性
4. **版本控制集成**：与版本控制工作流无缝集成

## 先决条件

在安装 OpenSpec 之前，请确保您的系统已满足以下要求：

### Node.js 和 npm

OpenSpec 通过 npm 分发，需要 Node.js 环境。OpenSpec 要求 **Node.js 18.0 或更高版本**。

验证 Node.js 安装：

```bash
node --version
```

验证 npm 安装：

```bash
npm --version
```

如果未安装或版本过低，请参考[主安装指南](/docs/quick-start/installation)中的 Node.js 和 npm 安装说明。

## 安装 OpenSpec

OpenSpec 通过 npm 全局安装，使其在系统的任何位置都可用。

### 使用 npm 全局安装

<Tabs>
  <TabItem value="win" label="Windows">
    在 PowerShell 或命令提示符中运行：

```powershell
npm install -g @fission-ai/openspec@latest
```

:::note Windows 权限问题
如果在安装过程中遇到权限错误，请以管理员身份运行 PowerShell 或命令提示符。
:::
  </TabItem>
  <TabItem value="mac" label="macOS">
    在终端中运行：

```bash
npm install -g @fission-ai/openspec@latest
```

:::note macOS 权限问题
如果遇到 `EACCES` 权限错误，可以尝试：
```bash
sudo npm install -g @fission-ai/openspec@latest
```
或使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本，避免权限问题。
:::
  </TabItem>
  <TabItem value="linux" label="Linux">
    在终端中运行：

```bash
npm install -g @fission-ai/openspec@latest
```

:::note Linux 权限问题
如果遇到 `EACCES` 权限错误，可以：
1. 使用 `sudo`：`sudo npm install -g @fission-ai/openspec@latest`
2. 配置 npm 使用用户目录：
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```
:::
  </TabItem>
</Tabs>

### 验证安装

安装完成后，验证 OpenSpec 是否正确安装：

```bash
openspec --version
```

如果安装成功，您将看到版本号输出，例如：

```
openspec/x.y.z linux-x64 node-v18.17.0
```

## 常见问题和故障排除

### 权限错误

#### 问题：`EACCES` 权限被拒绝

在安装或运行 OpenSpec 时遇到权限错误。

**解决方案**：

<Tabs>
  <TabItem value="win" label="Windows">
    以管理员身份运行 PowerShell 或命令提示符：
    1. 右键点击 PowerShell 或命令提示符
    2. 选择"以管理员身份运行"
    3. 重新运行安装命令
  </TabItem>
  <TabItem value="mac" label="macOS">
    使用 `sudo` 安装：

```bash
sudo npm install -g @fission-ai/openspec@latest
```

或使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js，避免全局安装权限问题。
  </TabItem>
  <TabItem value="linux" label="Linux">
    方案 1：使用 sudo
```bash
sudo npm install -g @fission-ai/openspec@latest
```

方案 2：配置 npm 使用用户目录
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @fission-ai/openspec@latest
```
  </TabItem>
</Tabs>

### 网络问题

#### 问题：npm 安装失败或速度很慢

由于网络原因，无法从 npm registry 下载 OpenSpec。

**解决方案**：

1. **使用国内 npm 镜像**：

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 然后重新安装
npm install -g @fission-ai/openspec@latest
```

2. **恢复官方源**（如果需要）：

```bash
npm config set registry https://registry.npmjs.org
```

3. **使用 cnpm**（可选）：

```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install -g @fission-ai/openspec@latest
```

:::tip
国内用户建议使用淘宝镜像，可以显著提升下载速度。
:::

### 版本兼容性问题

#### 问题：OpenSpec 命令运行异常或报错

安装的 OpenSpec 版本与当前环境不兼容。

**解决方案**：

1. **检查 Node.js 版本**：

```bash
node --version
```

确保版本为 18.0 或更高。如果版本过低，请升级 Node.js。

2. **检查 OpenSpec 版本**：

```bash
openspec --version
```

3. **更新到最新版本**：

```bash
npm update -g @fission-ai/openspec
```

4. **清理 npm 缓存**（如果问题持续）：

```bash
npm cache clean --force
npm install -g @fission-ai/openspec@latest
```

### 命令未找到

#### 问题：输入 `openspec` 命令提示"命令未找到"

OpenSpec 已安装但系统无法找到该命令。

**解决方案**：

<Tabs>
  <TabItem value="win" label="Windows">
    1. 确认 npm 全局安装路径：

```powershell
npm config get prefix
```

2. 将路径添加到系统 PATH：
   - 打开"系统属性" → "高级" → "环境变量"
   - 在"系统变量"中找到 `Path`
   - 添加 npm 全局路径（通常是 `C:\Users\<用户名>\AppData\Roaming\npm`）
   - 重启命令行窗口
  </TabItem>
  <TabItem value="mac" label="macOS">
    1. 确认 npm 全局安装路径：

```bash
npm config get prefix
```

2. 将路径添加到 PATH（在 `~/.zshrc` 或 `~/.bash_profile` 中）：

```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

3. 重新加载配置：

```bash
source ~/.zshrc
```
  </TabItem>
  <TabItem value="linux" label="Linux">
    1. 确认 npm 全局安装路径：

```bash
npm config get prefix
```

2. 将路径添加到 PATH（在 `~/.bashrc` 中）：

```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

3. 重新加载配置：

```bash
source ~/.bashrc
```
  </TabItem>
</Tabs>

## 升级 OpenSpec

定期升级 OpenSpec 以获得最新功能和安全更新：

```bash
npm update -g @fission-ai/openspec
```

或安装特定版本：

```bash
npm install -g @fission-ai/openspec@<version>
```

## 卸载 OpenSpec

如果需要卸载 OpenSpec：

<Tabs>
  <TabItem value="win" label="Windows">

```powershell
npm uninstall -g @fission-ai/openspec
```
  </TabItem>
  <TabItem value="mac" label="macOS">

```bash
npm uninstall -g @fission-ai/openspec
```

或使用 sudo：

```bash
sudo npm uninstall -g @fission-ai/openspec
```
  </TabItem>
  <TabItem value="linux" label="Linux">

```bash
npm uninstall -g @fission-ai/openspec
```

或使用 sudo：

```bash
sudo npm uninstall -g @fission-ai/openspec
```
  </TabItem>
</Tabs>

## 下一步

OpenSpec 安装完成后，您可以：

1. **学习 OpenSpec 基础**：了解提案和规范的基本概念
2. **在项目中使用**：在 PCode 项目中使用 OpenSpec 管理变更
3. **配置团队工作流**：为团队设置 OpenSpec 工作流程

:::tip
需要更详细的 OpenSpec 使用指南，请参考 [OpenSpec 官方文档](https://github.com/fission-ai/openspec)。
:::

## 需要更多帮助？

如果您遇到此处未涵盖的问题：

1. 查看 [OpenSpec GitHub Issues](https://github.com/fission-ai/openspec/issues) 寻找类似问题
2. 访问 [OpenSpec 官方文档](https://github.com/fission-ai/openspec) 获取更多信息
3. 参考 [PCode 文档站点](https://github.com/pcode/pcode-docs) 寻求帮助
