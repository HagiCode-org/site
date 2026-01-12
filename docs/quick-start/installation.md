---
title: 安装指南
description: 了解如何在本地机器上安装和设置 PCode。
sidebar_position: 10
---

# 安装指南

本指南将引导您完成在本地机器上安装和设置 PCode 的过程。在开始安装之前，PCode 需要先安装一些先决条件。

## 先决条件

在安装 PCode 之前，请确保您的系统上已安装以下软件：

### PostgreSQL 数据库

PCode 使用 PostgreSQL 作为其数据库。运行 PostgreSQL 的推荐方式是通过 Docker。

#### 安装 Docker

- **Windows**: 下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- **macOS**: 下载并安装 [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
- **Linux**: 使用您的包管理器安装 Docker

```bash title="在 Ubuntu/Debian 上安装 Docker"
sudo apt-get update
sudo apt-get install docker.io docker-compose
```

#### 使用 Docker 运行 PostgreSQL

安装 Docker 后，您可以使用以下命令运行 PostgreSQL：

```bash
docker run --name pcode-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pcode \
  -p 5432:5432 \
  -d postgres:16
```

此命令：
- 创建一个名为 `pcode-postgres` 的容器
- 将用户名设置为 `postgres`
- 将密码设置为 `postgres`
- 创建一个名为 `pcode` 的数据库
- 将主机上的端口 5432 映射到容器

:::note 安全提示
默认凭据 (`postgres/postgres`) 仅用于本地开发。对于生产环境，请使用强密码和唯一的密码。
:::

### Node.js 和 npm

PCode 需要 Node.js 18.0 或更高版本。

#### 验证 Node.js 安装

```bash
node --version
```

如果 Node.js 未安装或您的版本低于 18.0：

- **Windows**: 从 [nodejs.org](https://nodejs.org/) 下载并安装
- **macOS**: 使用 Homebrew: `brew install node`
- **Linux**: 使用您的包管理器：

```bash title="Ubuntu/Debian"
sudo apt-get install nodejs npm
```

#### 验证 npm 安装

```bash
npm --version
```

### OpenSpec CLI

OpenSpec 是一个用于管理提案和规范的工具。全局安装它：

```bash
npm install -g @openspec/cli
```

验证安装：

```bash
openspec --version
```

### Claude Code CLI

PCode 的 AI 驱动功能需要 Claude Code CLI。全局安装它：

```bash
npm install -g @anthropic-ai/claude-code
```

验证安装：

```bash
claude --version
```

## 验证您的环境

在继续之前，使用此脚本验证所有先决条件是否已正确安装：

```bash title="check-environment.sh"
#!/bin/bash

echo "检查 PCode 先决条件..."
echo ""

# 检查 Node.js
echo -n "Node.js: "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ $NODE_VERSION"
else
    echo "✗ 未安装"
fi

# 检查 npm
echo -n "npm: "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ $NPM_VERSION"
else
    echo "✗ 未安装"
fi

# 检查 Docker
echo -n "Docker: "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo "✓ $DOCKER_VERSION"
else
    echo "✗ 未安装"
fi

# 检查 PostgreSQL
echo -n "PostgreSQL: "
if docker ps --filter "name=pcode-postgres" --format "{{.Names}}" | grep -q "pcode-postgres"; then
    echo "✓ 运行中 (pcode-postgres 容器)"
else
    echo "✗ 未运行"
fi

# 检查 OpenSpec CLI
echo -n "OpenSpec CLI: "
if command -v openspec &> /dev/null; then
    OPENSPEC_VERSION=$(openspec --version)
    echo "✓ $OPENSPEC_VERSION"
else
    echo "✗ 未安装"
fi

# 检查 Claude Code CLI
echo -n "Claude Code CLI: "
if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version)
    echo "✓ $CLAUDE_VERSION"
else
    echo "✗ 未安装"
fi

echo ""
echo "环境检查完成！"
```

将此脚本保存为 `check-environment.sh`，使其可执行并运行：

```bash
chmod +x check-environment.sh
./check-environment.sh
```

## 部署软件包

PCode 以软件包的形式分发，您需要下载并解压到本地机器。

### Windows

1. 下载 PCode 软件包（`.zip` 格式）
2. 将软件包解压到所需位置，例如：`D:\code\pcode`
3. 打开命令提示符或 PowerShell 并导航到解压目录：

```powershell
cd D:\code\pcode
```

### Linux

1. 下载 PCode 软件包（`.tar.gz` 格式）
2. 解压软件包：

```bash
tar -xzf pcode-package.tar.gz
cd pcode
```

或使用图形化解压工具将其解压到所需位置。

### macOS

1. 下载 PCode 软件包（`.tar.gz` 格式）
2. 解压软件包：

```bash
tar -xzf pcode-package.tar.gz
cd pcode
```

或在 Finder 中双击压缩包进行解压。

## 配置数据库连接

PCode 需要连接到您的 PostgreSQL 数据库。数据库连接在 `appsettings.Production.json` 文件中配置。

1. 导航到 PCode 目录
2. 在文本编辑器中打开 `appsettings.Production.json`
3. 找到连接字符串部分：

```json
{
  "ConnectionStrings": {
    "Default": "Host=127.0.0.1;Port=5432;Database=pcode;Username=postgres;Password=postgres"
  }
}
```

4. 如果您使用不同的凭据，请更新连接字符串：
   - `Host`: 您的 PostgreSQL 主机（默认：`127.0.0.1`）
   - `Port`: 您的 PostgreSQL 端口（默认：`5432`）
   - `Database`: 您的数据库名称（默认：`pcode`）
   - `Username`: 您的 PostgreSQL 用户名（默认：`postgres`）
   - `Password`: 您的 PostgreSQL 密码（默认：`postgres`）

:::tip
如果您使用上面的 Docker PostgreSQL 命令，默认配置将无需任何更改即可工作。
:::

## 启动服务

PCode 为不同平台提供了启动脚本。

### Windows

使用提供的批处理文件启动服务：

```powershell
start.bat
```

此脚本将：
1. 检查 PostgreSQL 是否正在运行
2. 应用数据库迁移
3. 启动 PCode 服务
4. 显示访问 URL

### Linux/macOS

使用提供的 shell 脚本启动服务：

```bash
chmod +x start.sh
./start.sh
```

此脚本将：
1. 检查 PostgreSQL 是否正在运行
2. 应用数据库迁移
3. 启动 PCode 服务
4. 显示访问 URL

### 启动故障排除

如果服务启动失败：

1. **检查 PostgreSQL 是否正在运行**：
   ```bash
   docker ps | grep pcode-postgres
   ```

2. **如果已停止则启动 PostgreSQL**：
   ```bash
   docker start pcode-postgres
   ```

3. **查看日志**以获取详细的错误消息：
   ```bash
   tail -f logs/pcode.log
   ```

4. **验证连接字符串**在 `appsettings.Production.json` 中

5. **检查端口可用性**：确保端口 `34567` 未被其他应用程序使用

## 访问界面

服务运行后，您可以通过浏览器访问 PCode Web 界面。

### 在浏览器中打开

导航到：

```
http://127.0.0.1:34567
```

PCode 界面应该会加载，显示主仪表板。

### 默认访问

- **URL**: `http://127.0.0.1:34567`
- **端口**: `34567`（默认）
- **主机**: `127.0.0.1`（本地主机）

:::note
端口 `34567` 是 PCode 使用的默认端口。如果您需要更改它，可以在 `appsettings.Production.json` 中修改配置。
:::

### 停止服务

要停止 PCode 服务：

- **Windows**: 在运行服务的命令窗口中按 `Ctrl+C`
- **Linux/macOS**: 在运行服务的终端中按 `Ctrl+C`，或使用：
  ```bash
  ./stop.sh
  ```

要停止 PostgreSQL：

```bash
docker stop pcode-postgres
```

## 后续步骤

现在您已经安装并运行了 PCode，请继续[创建第一个项目](/docs/quick-start/create-first-project)以开始使用 PCode。

## 故障排除

### PostgreSQL 连接问题

如果您看到连接错误：

1. 验证 PostgreSQL 是否正在运行：`docker ps | grep pcode-postgres`
2. 检查 `appsettings.Production.json` 中的连接字符串
3. 确保端口 `5432` 未被防火墙阻止

### 端口已被占用

如果端口 `34567` 已被占用：

1. 查找使用该端口的进程：
   ```bash
   lsof -i :34567  # Linux/macOS
   netstat -ano | findstr :34567  # Windows
   ```
2. 停止冲突的进程或在配置中更改端口

### 迁移失败

如果数据库迁移失败：

1. 删除并重新创建数据库：
   ```bash
   docker exec -it pcode-postgres psql -U postgres -c "DROP DATABASE IF EXISTS pcode;"
   docker exec -it pcode-postgres psql -U postgres -c "CREATE DATABASE pcode;"
   ```
2. 再次运行启动脚本

### 需要更多帮助？

如果您遇到此处未涵盖的问题：

1. 查看 [GitHub Issues](https://github.com/pcode/pcode-docs/issues) 寻找类似问题
2. 访问我们的[社区论坛](https://github.com/pcode/pcode-docs/discussions)寻求帮助
