---
title: 安装指南
description: 了解如何在本地机器上安装和设置 PCode。
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 安装指南

本指南将引导您完成在本地机器上安装和设置 PCode 的过程。在开始安装之前，PCode 需要先安装一些先决条件。

## 先决条件

在安装 PCode 之前，请确保您的系统上已安装以下软件：

### PostgreSQL 数据库

PCode 使用 PostgreSQL 作为其数据库。运行 PostgreSQL 的推荐方式是通过 Docker。

#### 安装 Docker

<Tabs>
  <TabItem value="win" label="Windows">
    下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)

    :::tip 替代安装方式
    如果您更倾向于使用原生安装程序，可以参阅 **[在 Windows 上安装 PostgreSQL](/docs/related-software-installation/postgresql/install-on-windows)** 获取详细的 EXE 安装步骤。
    :::
  </TabItem>
  <TabItem value="mac" label="macOS">
    下载并安装 [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
  </TabItem>
  <TabItem value="linux" label="Linux">
    使用您的包管理器安装 Docker

```bash title="在 Ubuntu/Debian 上安装 Docker"
sudo apt-get update
sudo apt-get install docker.io docker-compose
```
  </TabItem>
</Tabs>

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

**安装指南**：请参阅 [Node.js 安装指南](/docs/related-software-installation/nodejs/installation)

**验证安装**：

```bash
node --version
npm --version
```

### OpenSpec CLI

OpenSpec 是一个用于管理提案和规范的工具。

**安装指南**：请参阅 [OpenSpec 安装指南](/docs/related-software-installation/openspec/setup-openspec)

**验证安装**：

```bash
openspec --version
```

### Claude Code CLI

PCode 的 AI 驱动功能需要 Claude Code CLI。

**安装指南**：请参阅 [Claude Code 安装指南](/docs/related-software-installation/claude-code/setup-claude-code-with-zai)

**验证安装**：

```bash
claude --version
```

## 部署软件包

PCode 以软件包的形式分发，您需要下载并解压到本地机器。

<Tabs>
  <TabItem value="win" label="Windows">
    1. 下载 PCode 软件包（`.zip` 格式）
    2. 将软件包解压到所需位置，例如：`D:\code\pcode`
    3. 打开命令提示符或 PowerShell 并导航到解压目录：

```powershell
cd D:\code\pcode
```
  </TabItem>
  <TabItem value="mac" label="macOS">
    1. 下载 PCode 软件包（`.tar.gz` 格式）
    2. 解压软件包：

```bash
tar -xzf pcode-package.tar.gz
cd pcode
```

    或在 Finder 中双击压缩包进行解压。
  </TabItem>
  <TabItem value="linux" label="Linux">
    1. 下载 PCode 软件包（`.tar.gz` 格式）
    2. 解压软件包：

```bash
tar -xzf pcode-package.tar.gz
cd pcode
```

    或使用图形化解压工具将其解压到所需位置。
  </TabItem>
</Tabs>

## 软件包结构

解压后的 PCode 软件包包含以下目录结构和文件：

<Tabs>
  <TabItem value="win" label="Windows">
    ```text
    pcode/
    ├── config/                          # 用户配置覆盖目录
    │   ├── appsettings.yml             # 用户配置文件（YAML 格式，最高优先级）
    │   └── README.md                   # 配置系统详细说明文档
    ├── lib/                             # 应用依赖和运行时文件目录
    │   ├── PCode.Web.dll               # 主程序
    │   ├── appsettings.yml             # 基础配置
    │   ├── appsettings.Production.yml  # 生产环境配置
    │   └── [其他依赖库...]
    ├── start.bat                        # Windows 启动脚本
    ├── README.md                        # 软件包说明文档（中文）
    └── README_en.md                     # 软件包说明文档（英文）
    ```
  </TabItem>
  <TabItem value="mac" label="macOS">
    ```text
    pcode/
    ├── config/                          # 用户配置覆盖目录
    │   ├── appsettings.yml             # 用户配置文件（YAML 格式，最高优先级）
    │   └── README.md                   # 配置系统详细说明文档
    ├── lib/                             # 应用依赖和运行时文件目录
    │   ├── PCode.Web.dll               # 主程序
    │   ├── appsettings.yml             # 基础配置
    │   ├── appsettings.Production.yml  # 生产环境配置
    │   └── [其他依赖库...]
    ├── start.sh                         # macOS/Linux 启动脚本
    ├── README.md                        # 软件包说明文档（中文）
    └── README_en.md                     # 软件包说明文档（英文）
    ```
  </TabItem>
  <TabItem value="linux" label="Linux">
    ```text
    pcode/
    ├── config/                          # 用户配置覆盖目录
    │   ├── appsettings.yml             # 用户配置文件（YAML 格式，最高优先级）
    │   └── README.md                   # 配置系统详细说明文档
    ├── lib/                             # 应用依赖和运行时文件目录
    │   ├── PCode.Web.dll               # 主程序
    │   ├── appsettings.yml             # 基础配置
    │   ├── appsettings.Production.yml  # 生产环境配置
    │   └── [其他依赖库...]
    ├── start.sh                         # macOS/Linux 启动脚本
    ├── README.md                        # 软件包说明文档（中文）
    └── README_en.md                     # 软件包说明文档（英文）
    ```
  </TabItem>
</Tabs>

### 目录说明

| 目录/文件 | 说明 |
|-----------|------|
| **config/** | 用户配置覆盖目录。此目录中的配置文件具有最高优先级，会覆盖其他位置的配置。 |
| **config/appsettings.yml** | 用户配置文件（YAML 格式）。这是您应该修改的主要配置文件，具有最高优先级。 |
| **config/README.md** | 配置系统的详细说明文档，包含所有配置选项的完整参考。 |
| **lib/** | 应用程序依赖和运行时文件目录，包含主程序和所有依赖库。 |
| **lib/PCode.Web.dll** | PCode 的主程序（.NET 程序集）。 |
| **lib/appsettings.yml** | 基础配置文件，包含默认配置值。 |
| **lib/appsettings.Production.yml** | 生产环境配置文件，包含生产环境的默认值。 |
| **start.sh** / **start.bat** | 启动脚本（Linux/macOS 使用 `.sh`，Windows 使用 `.bat`）。 |
| **README.md** / **README_en.md** | 软件包说明文档，包含基本的使用信息和注意事项。 |

### 配置加载优先级

PCode 使用三层配置加载机制，优先级从低到高为：

1. **lib/appsettings.yml** - 基础配置（默认值）
2. **lib/appsettings.Production.yml** - 生产环境配置（环境特定值）
3. **config/appsettings.yml** - 用户配置覆盖（最高优先级）

当同一配置项在多个文件中定义时，优先级更高的配置会覆盖优先级较低的配置。这种设计允许您：
- 保留默认配置不变
- 在 `config/` 目录中仅覆盖需要修改的配置项
- 升级软件包时无需重新配置（只需保留 `config/` 目录）

:::tip 推荐做法
修改配置时，请在 `config/appsettings.yml` 中进行修改，而不是直接编辑 `lib/` 目录中的文件。这样在软件包升级时，您的配置更改将被保留。
:::

## 配置数据库连接

PCode 需要连接到您的 PostgreSQL 数据库。数据库连接在 `config/appsettings.yml` 文件中配置。

1. 导航到 PCode 目录
2. 在文本编辑器中打开 `config/appsettings.yml`
3. 找到连接字符串部分：

```yaml
ConnectionStrings:
  Default: "Host=127.0.0.1;Port=5432;Database=pcode;Username=postgres;Password=postgres"
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

<Tabs>
  <TabItem value="win" label="Windows">
    使用提供的批处理文件启动服务：

```powershell
start.bat
```

此脚本将：
1. 检查 PostgreSQL 是否正在运行
2. 应用数据库迁移
3. 启动 PCode 服务
4. 显示访问 URL
  </TabItem>
  <TabItem value="mac" label="macOS">
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
  </TabItem>
  <TabItem value="linux" label="Linux">
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
  </TabItem>
</Tabs>

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

4. **验证连接字符串**在 `config/appsettings.yml` 中

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
端口 `34567` 是 PCode 使用的默认端口。如果您需要更改它，可以在 `config/appsettings.yml` 中修改配置。
:::

### 停止服务

要停止 PCode 服务：

<Tabs>
  <TabItem value="win" label="Windows">
    在运行服务的命令窗口中按 `Ctrl+C`
  </TabItem>
  <TabItem value="mac" label="macOS">
    在运行服务的终端中按 `Ctrl+C`，或使用：

```bash
./stop.sh
```
  </TabItem>
  <TabItem value="linux" label="Linux">
    在运行服务的终端中按 `Ctrl+C`，或使用：

```bash
./stop.sh
```
  </TabItem>
</Tabs>

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
2. 检查 `config/appsettings.yml` 中的连接字符串
3. 确保端口 `5432` 未被防火墙阻止

### 端口已被占用

如果端口 `34567` 已被占用：

1. 查找使用该端口的进程：

<Tabs>
  <TabItem value="win" label="Windows">

```powershell
netstat -ano | findstr :34567
```
  </TabItem>
  <TabItem value="mac" label="macOS">

```bash
lsof -i :34567
```
  </TabItem>
  <TabItem value="linux" label="Linux">

```bash
lsof -i :34567
```
  </TabItem>
</Tabs>

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
