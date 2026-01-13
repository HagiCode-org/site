---
title: 安装 Node.js
description: 本指南将帮助您在 Windows、macOS 和 Linux 系统上安装 Node.js 运行时环境。
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 安装 Node.js

本指南将详细说明如何在 Windows、macOS 和 Linux 操作系统上安装 Node.js 运行时环境。Node.js 是 PCode 运行所需的核心依赖。

:::info 版本要求
PCode 推荐使用 **Node.js 24+**（最低支持 Node.js >= 18.0）。建议安装最新的 LTS 版本以获得最佳性能和安全性。在安装完成后，请验证您的版本满足此要求。
:::

## 安装 Node.js

<Tabs>
  <TabItem value="windows" label="Windows" default>

### 方法一：官方安装包（推荐）

1. 访问 [Node.js 官方网站](https://nodejs.org/)
2. 下载 **LTS（长期支持）**版本的 Windows 安装程序（`.msi` 文件）
3. 双击运行安装程序
4. 按照安装向导的提示完成安装：
   - 接受许可协议
   - 选择安装路径（默认即可）
   - 确保勾选 "Automatically install the necessary tools"（自动安装必要的工具）
   - 点击 "Install" 开始安装
5. 安装完成后，点击 "Finish"

### 方法二：使用 winget

打开 PowerShell 或命令提示符，运行以下命令：

```powershell
winget install OpenJS.NodeJS.LTS
```

安装完成后，重新打开终端以使更改生效。

  </TabItem>
  <TabItem value="macos" label="macOS">

### 方法一：官方安装包（推荐）

1. 访问 [Node.js 官方网站](https://nodejs.org/)
2. 下载 **LTS（长期支持）**版本的 macOS 安装程序（`.pkg` 文件）
3. 双击运行安装程序
4. 按照安装向导的提示完成安装：
   - 点击 "继续"
   - 接受许可协议
   - 选择安装磁盘
   - 点击 "安装" 并输入管理员密码
5. 安装完成后，点击 "关闭"

### 方法二：使用 Homebrew

如果您已经安装了 [Homebrew](https://brew.sh/)，可以通过终端安装 Node.js：

```bash
brew install node
```

:::tip
Homebrew 会自动将 Node.js 添加到您的 PATH 中。如果命令不可用，请重新启动终端或运行：
```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
```
:::

  </TabItem>
  <TabItem value="ubuntu" label="Ubuntu/Debian">

### 使用 NodeSource 仓库（推荐）

这是获取最新 Node.js 版本的最佳方式：

```bash
# 使用 curl 下载安装脚本
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 使用 apt 包管理器

如果您不需要最新版本，可以使用 Ubuntu 自带的软件仓库：

```bash
sudo apt-get update
sudo apt-get install -y nodejs npm
```

:::note
默认仓库中的 Node.js 版本可能较旧。安装后请检查版本，确保满足 Node.js >= 18.0 的要求（推荐使用 Node.js 24+）。
:::

  </TabItem>
  <TabItem value="centos" label="CentOS/RHEL">

### 使用 NodeSource 仓库（推荐）

```bash
# 使用 curl 下载安装脚本
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs
```

### 使用 yum 包管理器

```bash
sudo yum install -y nodejs npm
```

  </TabItem>
  <TabItem value="fedora" label="Fedora">

### 使用 dnf 包管理器

```bash
sudo dnf install -y nodejs npm
```

:::tip
Fedora 的软件仓库通常包含较新的 Node.js 版本，可以直接使用 dnf 安装。
:::

  </TabItem>
</Tabs>

## 使用版本管理工具

如果您需要在多个 Node.js 版本之间切换，可以使用版本管理工具。

### nvm (Node Version Manager)

<Tabs>
  <TabItem value="nvm-install" label="安装 nvm" default>

#### Linux/macOS

```bash
# 使用 curl 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 或使用 wget 安装
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

安装完成后，重新加载您的 shell 配置：

```bash
source ~/.bashrc
# 或对于 Zsh 用户
source ~/.zshrc
```

#### Windows

在 Windows 上，推荐使用 [nvm-windows](https://github.com/coreybutler/nvm-windows)：

1. 从 [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases) 下载最新的 `nvm-setup.exe`
2. 运行安装程序
3. 重新打开命令提示符或 PowerShell

  </TabItem>
  <TabItem value="nvm-use" label="使用 nvm">

安装 nvm 后，您可以使用它来安装和管理 Node.js 版本：

```bash
# 安装最新的 LTS 版本（推荐）
nvm install --lts

# 安装 Node.js 24（推荐版本）
nvm install 24

# 安装特定的 Node.js 版本
nvm install 18.20.0

# 列出已安装的版本
nvm list

# 切换到指定的 Node.js 版本
nvm use 24

# 设置默认版本
nvm alias default 24

# Windows nvm-windows 语法略有不同
nvm install 24
nvm use 24
```

  </TabItem>
</Tabs>

### fnm (Fast Node Manager)

fnm 是一个更快、更简单的 Node.js 版本管理工具，使用 Rust 构建。

<Tabs>
  <TabItem value="fnm-install" label="安装 fnm" default>

#### Linux/macOS

```bash
# 使用 curl 安装
curl -fsSL https://fnm.vercel.app/install | bash

# 安装完成后，重新加载 shell 配置
source ~/.bashrc
# 或对于 Zsh 用户
source ~/.zshrc
```

#### Windows

使用 [scoop](https://scoop.sh/) 或 [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/)：

```powershell
# 使用 scoop
scoop install fnm

# 或使用 winget
winget install Schniz.fnm
```

  </TabItem>
  <TabItem value="fnm-use" label="使用 fnm">

```bash
# 安装最新的 LTS 版本（推荐）
fnm install --lts

# 安装 Node.js 24（推荐版本）
fnm install 24

# 安装特定的 Node.js 版本
fnm install 18.20.0

# 列出已安装的版本
fnm list

# 切换到指定的 Node.js 版本
fnm use 24

# 设置默认版本
fnm default 24
```

  </TabItem>
</Tabs>

## 中国大陆用户加速

如果您在中国大陆地区，下载 Node.js 和 npm 包可能会遇到速度慢的问题。以下是一些加速方案。

### 使用国内镜像源

#### npm 淘宝镜像（推荐）

```bash
# 临时使用淘宝镜像
npm install --registry=https://registry.npmmirror.com

# 永久设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证镜像是否设置成功
npm config get registry
```

#### 使用 nrm 管理镜像源

nrm (npm registry manager) 可以帮助您快速切换 npm 镜像源：

```bash
# 安装 nrm
npm install -g nrm

# 列出可用的镜像源
nrm ls

# 切换到淘宝镜像
nrm use taobao

# 测试镜像源速度
nrm test
```

### 下载 Node.js 安装包加速

<Tabs>
  <TabItem value="cnpm-mirror" label="淘宝 Node.js 镜像" default>

淘宝提供了 Node.js 安装包的镜像下载：

- **下载地址**: https://npmmirror.com/mirrors/node/

访问以上地址，选择您需要的版本进行下载。

  </TabItem>
  <TabItem value="fastgit" label="FastGit 加速">

如果从 GitHub 下载 nvm 或其他工具速度慢，可以使用 FastGit 镜像：

```bash
# 使用 FastGit 加速 nvm 安装
curl -o- https://fastgit.org/nvm-sh/nvm/raw/master/install.sh | bash
```

:::note
FastGit 服务可能会变动，请以官方信息为准。
:::

  </TabItem>
</Tabs>

### Homebrew 国内镜像

如果您在中国大陆使用 Homebrew，可以配置国内镜像加速：

```bash
# 安装 Homebrew 时使用国内镜像
/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"

# 或使用中科大的镜像
export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles
```

### 中国大陆特有包管理器

#### cnpm

cnpm 是淘宝团队提供的 npm 客户端，默认使用淘宝镜像：

```bash
# 安装 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com

# 使用 cnpm 安装包
cnpm install <package-name>
```

:::tip
cnpm 与 npm 命令基本兼容，可以直接替换使用。
:::

### 验证镜像加速效果

设置镜像后，可以通过以下命令验证：

```bash
# 测试下载速度
time npm install express --registry=https://registry.npmmirror.com

# 对比官方源速度
time npm install express --registry=https://registry.npmjs.org
```

## 验证安装

安装完成后，请验证 Node.js 和 npm 是否正确安装：

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version
```

:::info
确保 Node.js 版本 >= 18.0（推荐使用 Node.js 24+）。如果版本过低，请按照上述方法重新安装或使用版本管理工具安装正确的版本。
:::

### 验证命令输出示例

成功的验证输出应该类似：

```
$ node --version
v24.3.0

$ npm --version
10.2.3
```

## 故障排除

### Windows 问题

<Tabs>
  <TabItem value="win-path" label="命令不可用">

如果在安装后 `node` 或 `npm` 命令不可用：

1. 重新启动命令提示符或 PowerShell
2. 如果仍然不可用，手动将 Node.js 添加到 PATH：
   - 搜索 "环境变量" 并打开 "编辑系统环境变量"
   - 点击 "环境变量"
   - 在 "系统变量" 中找到 "Path"，点击 "编辑"
   - 添加 Node.js 的安装路径（默认：`C:\Program Files\nodejs\`）
   - 点击 "确定" 保存更改

  </TabItem>
  <TabItem value="win-policy" label="PowerShell 执行策略">

如果在使用 nvm 时遇到执行策略错误：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

  </TabItem>
</Tabs>

### macOS 问题

<Tabs>
  <TabItem value="mac-perm" label="权限错误">

如果在安装全局 npm 包时遇到权限错误：

```bash
# 修复 npm 权限
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

  </TabItem>
  <TabItem value="mac-path" label="命令不可用">

如果安装后命令不可用，请重新启动终端或手动添加到 PATH（通常在 `/usr/local/bin`）。

  </TabItem>
</Tabs>

### Linux 问题

<Tabs>
  <TabItem value="linux-perm" label="权限错误">

如果在安装全局 npm 包时遇到权限错误，建议使用 Node.js 版本管理工具（如 nvm 或 fnm）而不是系统包管理器。

  </TabItem>
  <TabItem value="linux-old" label="版本过旧">

如果通过系统包管理器安装的 Node.js 版本过旧：

1. 使用 NodeSource 仓库（推荐，见上文）
2. 或使用版本管理工具（nvm/fnm）

  </TabItem>
</Tabs>

### 检查环境

如果验证失败，检查以下内容：

<Tabs>
  <TabItem value="win-check" label="Windows">

```powershell
# 检查 Node.js 是否在 PATH 中
where node

# 检查安装路径
Get-Command node
```

  </TabItem>
  <TabItem value="mac-check" label="macOS">

```bash
# 检查 Node.js 是否在 PATH 中
which node

# 检查安装路径
ls -l $(which node)
```

  </TabItem>
  <TabItem value="linux-check" label="Linux">

```bash
# 检查 Node.js 是否在 PATH 中
which node

# 检查安装路径
ls -l $(which node)

# 检查版本详细信息
node -v
```

  </TabItem>
</Tabs>

## 下一步

Node.js 安装完成后，[返回 PCode 安装指南](/docs/quick-start/installation)继续配置 PCode。

## 需要更多帮助？

如果您遇到此处未涵盖的问题：

1. 访问 [Node.js 官方文档](https://nodejs.org/en/docs/)
2. 查看 [GitHub Issues](https://github.com/pcode/pcode-docs/issues) 寻找类似问题
3. 访问我们的[社区论坛](https://github.com/pcode/pcode-docs/discussions)寻求帮助
