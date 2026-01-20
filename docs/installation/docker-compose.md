---
title: Docker Compose 部署
description: 使用 Docker Compose 一键部署完整的 Hagicode 系统
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Docker Compose 部署

本指南介绍如何使用 Docker Compose 一键部署完整的 Hagicode 系统。这是**推荐的部署方式**，适合大多数用户，特别是开发、测试和生产环境。

:::info 使用配置生成器
**推荐使用我们的 [交互式 Docker Compose 配置生成器](/docker-compose-generator)**！

通过简单的表单填写，即可快速生成符合您需求的 `docker-compose.yml` 配置文件。生成器支持：
- 自定义端口、容器名称等基础配置
- 选择内置数据库或外部数据库
- 自动配置 Windows/Linux 平台差异
- 智能处理文件权限问题

[🚀 立即使用生成器 →](/docker-compose-generator)
:::

:::tip 推荐方式
Docker Compose 部署是首选的安装方式，具有以下优势：
- 环境隔离，避免依赖冲突
- 一键启动所有服务（PostgreSQL + Hagicode）
- 易于管理和维护
- 适合快速体验和测试
:::

## 前置要求

在开始之前，请确保您的系统已安装 Docker 和 Docker Compose。

### 安装 Docker

<Tabs>
  <TabItem value="win" label="Windows">
    下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)

    安装完成后，确保 Docker Desktop 正在运行。
  </TabItem>
  <TabItem value="mac" label="macOS">
    下载并安装 [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)

    安装完成后，确保 Docker Desktop 正在运行。
  </TabItem>
  <TabItem value="linux" label="Linux">
    使用您的包管理器安装 Docker：

```bash title="在 Ubuntu/Debian 上安装 Docker"
sudo apt-get update
sudo apt-get install docker.io docker-compose-plugin
```

安装完成后，启动 Docker 服务：

```bash
sudo systemctl start docker
sudo systemctl enable docker
```
  </TabItem>
</Tabs>

### 验证安装

安装完成后，运行以下命令验证 Docker 和 Docker Compose 是否正确安装：

```bash
docker --version
docker compose version
```

## 快速开始

:::tip 使用配置生成器
**不想手动编辑配置文件？** 使用我们的 [交互式 Docker Compose 配置生成器](/docker-compose-generator) 可以自动生成符合您需求的配置文件，支持自定义端口、数据库、工作目录等各种选项。

[🚀 打开生成器](/docker-compose-generator)
:::

### 1. 准备 docker-compose.yml 文件

从 Hagicode 仓库下载 `docker-compose.yml` 文件，或者使用以下示例创建：

```yaml title="docker-compose.yml"
services:
  hagicode:
    image: newbe36524/hagicode:latest
    container_name: hagicode-app
    environment:
      ASPNETCORE_ENVIRONMENT: Production
      ASPNETCORE_URLS: http://+:45000
      TZ: Asia/Shanghai
      ConnectionStrings__Default: "Host=postgres;Port=5432;Database=hagicode;Username=postgres;Password=postgres"
      License__Activation__LicenseKey: "${HAGICODE_LICENSE_KEY:-D76B5C-EC0A70-AEA453-BC9414-0A198D-V3}"
      # 用户和组 ID 配置（用于文件权限管理）
      # 详细说明请参考"用户权限管理"章节
      # 将 1000 替换为您在宿主机的实际用户 ID 和组 ID
      # - PUID=1000
      # - PGID=1000
      # 智谱 AI API Key（必须配置 - 容器部署必需）
      # 取消注释并设置您的密钥
      # 购买链接：https://www.bigmodel.cn/claude-code?ic=14BY54APZA
      # ZAI_API_KEY: "${ZAI_API_KEY}"
    ports:
      - "45000:45000"
    volumes:
      # 主机路径映射：将主机目录挂载到容器中
      # 这使您可以在主机上操作文件，容器内实时生效
      - /path/to/your/repos:/app/workdir
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - pcode-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:45000/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s

  postgres:
    image: bitnami/postgresql:latest
    container_name: hagicode-postgres
    environment:
      POSTGRES_DATABASE: hagicode
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_HOST_AUTH_METHOD: trust
      TZ: Asia/Shanghai
    volumes:
      - postgres-data:/bitnami/postgresql
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 10s
      timeout: 3s
      retries: 3
    networks:
      - pcode-network
    restart: unless-stopped

volumes:
  postgres-data:

networks:
  pcode-network:
    driver: bridge
```

:::note 路径映射说明
Docker Compose 配置中包含了重要的路径映射：
- **主机路径**: `/path/to/your/repos`（请根据实际情况修改）
- **容器路径**: `/app/workdir`

这种映射允许您在主机上直接操作文件，Hagicode 容器可以实时访问这些文件。请将 `/path/to/your/repos` 替换为您实际的代码仓库路径。
:::

### 2. 配置环境变量

创建 `.env` 文件（与 `docker-compose.yml` 同目录）来配置敏感信息：

```env title=".env"
# Hagicode 许可证密钥（可选）
# 如果不设置，将使用公测阶段的通用密钥
# HAGICODE_LICENSE_KEY=D76B5C-EC0A70-AEA453-BC9414-0A198D-V3

# 智谱 AI API Key（必须配置）
# 获取方式：请访问智谱 AI 官网购买订阅后获取
ZAI_API_KEY=your-zai-api-key-here
```

:::info 公测阶段通用密钥
Hagicode 当前处于公测阶段，提供以下通用激活密钥：
```
D76B5C-EC0A70-AEA453-BC9414-0A198D-V3
```
:::

:::warning 必须配置智谱 AI API Key
Hagicode 容器部署必须使用智谱 AI 作为 Claude API 提供商。**请先购买智谱 AI 订阅并获得 API Key**。

**购买智谱 AI 订阅（10% 优惠链接）**：[https://www.bigmodel.cn/claude-code?ic=14BY54APZA](https://www.bigmodel.cn/claude-code?ic=14BY54APZA)

- 建议购买 **Coding Plan** 作为日常使用，成本更优
- 初次体验可以购买 **Lite 版本**，价格更低

购买后，在此地址创建 API Key：[https://bigmodel.cn/usercenter/proj-mgmt/apikeys](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)

**智谱 AI 优势**：
- **响应更快**：优化的网络路由，国内访问更稳定
- **更好兼容**：与 Hagicode 功能完美集成，支持全部特性
- **成本优势**：相比直接使用 Anthropic API 更具性价比
- **本地化支持**：针对中文用户优化的服务体验
:::

### 3. 启动服务

在 `docker-compose.yml` 所在目录执行以下命令：

```bash
docker compose up -d
```

此命令将：
- 下载并启动 PostgreSQL 容器
- 下载并启动 Hagicode 应用容器
- 创建并配置网络
- 初始化数据库连接

### 4. 验证服务状态

检查容器是否正在运行：

```bash
docker compose ps
```

您应该看到两个容器都处于 "running" 状态。

查看服务日志：

```bash
# 查看所有服务日志
docker compose logs

# 查看 Hagicode 服务日志
docker compose logs hagicode

# 实时跟踪日志
docker compose logs -f hagicode
```

## 配置说明

:::tip 快速生成自定义配置
如果您需要自定义配置（如修改端口、使用外部数据库、调整卷挂载路径等），推荐使用我们的 [交互式 Docker Compose 配置生成器](/docker-compose-generator)，可以自动生成符合您需求的配置文件。

[🚀 打开生成器](/docker-compose-generator)
:::

### 智谱 AI API 密钥配置（必须配置）

:::warning 必须配置智谱 AI API Key
Hagicode 容器部署**必须使用智谱 AI** 作为 Claude API 提供商。

**购买智谱 AI 订阅（10% 优惠链接）**：[https://www.bigmodel.cn/claude-code?ic=14BY54APZA](https://www.bigmodel.cn/claude-code?ic=14BY54APZA)

- 建议购买 **Coding Plan** 作为日常使用，成本更优
- 初次体验可以购买 **Lite 版本**，价格更低

购买后，在此地址创建 API Key：[https://bigmodel.cn/usercenter/proj-mgmt/apikeys](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)

**智谱 AI 优势**：
- **响应更快**：优化的网络路由，国内访问更稳定
- **更好兼容**：与 Hagicode 功能完美集成，支持全部特性
- **成本优势**：相比直接使用 Anthropic API 更具性价比
- **本地化支持**：针对中文用户优化的服务体验
:::

智谱 AI API Key 的配置非常简单，只需在 `docker-compose.yml` 或 `.env` 文件中添加一个环境变量：

在 `docker-compose.yml` 中添加：

```yaml
services:
  hagicode:
    environment:
      # 智谱 AI API Key（必须配置）
      # 设置后将使用智谱 AI 优化的 Claude API 端点
      ZAI_API_KEY: "${ZAI_API_KEY}"
```

或在 `.env` 文件中设置（推荐方式）：

```env title=".env"
# 智谱 AI API Key（必须配置）
# 获取方式：请访问智谱 AI 官网购买订阅后获取
ZAI_API_KEY=your-zai-api-key-here
```

:::tip 最佳实践
- 将智谱 AI API Key 配置在 `.env` 文件中，避免密钥泄露
- 重启容器后配置即可生效：`docker compose restart hagicode`
- 配置后，Claude Code 将自动使用智谱 AI 优化的 API 端点
:::

### 路径映射详解

路径映射（Volume Mounts）允许 Hagicode 容器访问主机上的代码仓库，这是容器部署的关键配置。

**为什么需要路径映射？**

Hagicode 需要访问您的代码仓库才能进行 AI 辅助编程：
- **读取代码**：AI 需要理解您的项目结构和代码
- **修改代码**：AI 生成的代码需要应用到您的项目中
- **实时同步**：主机上的代码修改会立即反映到容器中

**路径映射配置**：

```yaml
services:
  hagicode:
    volumes:
      # 代码工作目录映射（必需）
      # 请将 /path/to/your/repos 替换为您的实际代码仓库路径
      - /path/to/your/repos:/app/workdir
```

:::tip 路径映射说明
- `/path/to/your/repos`：主机上的代码仓库路径（请根据实际情况修改）
- `/app/workdir`：容器内的工作目录（固定路径，无需修改）
- 建议使用绝对路径，避免路径解析问题
:::

### 端口映射说明

Docker Compose 配置中的端口映射将容器端口暴露到主机：

```yaml
services:
  hagicode:
    ports:
      - "45000:5000"
```

**端口说明**：

| 服务 | 容器端口 | 主机端口 | 用途 |
|------|----------|----------|------|
| Hagicode | 5000 | 45000 | Web 应用访问 |

:::note
- **PostgreSQL** 不需要暴露到主机，Hagicode 容器通过内部网络 `pcode-network` 直接访问
- 如需从主机连接数据库，可以使用 `docker exec -it hagicode-postgres psql -U postgres -d hagicode`
:::

:::note 端口冲突
如果主机端口已被占用，可以修改映射：
```yaml
ports:
  - "45001:5000"  # 使用 45001 代替 45000
```
:::

## 用户权限管理

### 为什么需要关注用户权限

在使用 Docker Compose 部署 Hagicode 时，容器内外用户权限的映射是一个重要的问题。如果不正确配置，可能会导致文件读写权限冲突。

**问题根源**：

- **用户 ID 映射不匹配**：Docker 容器内的用户 ID 是通过 Hash Code 生成的，与宿主机的用户 ID 可能不一致
- **文件权限冲突**：当使用 root 用户在宿主机创建目录并挂载到容器时，容器内的非 root 用户可能无法读写这些文件
- **权限不一致导致的问题**：
  - 容器内应用无法修改挂载目录中的文件
  - 容器内创建的文件在宿主机上显示为不同所有者
  - 影响正常的文件读写操作和开发体验

### 方案一：用户 ID 映射配置（推荐）

这是最安全和推荐的解决方案。通过配置环境变量 `PUID` 和 `PGID`，可以让容器内的进程以指定的用户 ID 和组 ID 运行，从而与宿主机的用户权限保持一致。

**配置步骤**：

1. **获取宿主机用户 ID 和组 ID**

在宿主机上运行以下命令：

```bash
id username
```

将 `username` 替换为您的实际用户名。如果使用 root 用户操作，可以创建一个非 root 用户：

```bash
# 创建新用户（如果需要）
sudo useradd -m -s /bin/bash hagicode
# 获取用户 ID
id hagicode
```

输出示例：
```
uid=1000(hagicode) gid=1000(hagicode) groups=1000(hagicode)
```

记下 `uid` 和 `gid` 的值（示例中为 1000）。

2. **配置 docker-compose.yml**

在 `docker-compose.yml` 的 `environment` 部分添加 `PUID` 和 `PGID` 环境变量：

```yaml
services:
  hagicode:
    environment:
      # 用户和组 ID 配置（用于文件权限管理）
      # 请将 1000 替换为您在宿主机的实际用户 ID 和组 ID
      - PUID=1000
      - PGID=1000
```

3. **重启容器使配置生效**

```bash
docker compose restart hagicode
```

4. **验证配置**

检查容器内用户是否正确配置：

```bash
docker exec hagicode-app id
```

应该显示您配置的用户 ID 和组 ID。

**适用场景**：
- 宿主机使用 root 用户操作
- 需要安全的权限配置
- 生产环境部署

**优点**：
- 安全性高，符合最小权限原则
- 文件权限清晰，易于管理
- 适用于多用户环境

**缺点**：
- 需要额外配置步骤
- 需要了解用户 ID 和组 ID

### 方案二：权限设置

这是一个快速但不够安全的解决方案。通过直接设置目录权限为 777，允许所有用户读写，但不推荐用于生产环境。

:::warning 安全警告
此方案仅适用于开发环境和测试环境。在生产环境中使用 777 权限存在安全风险，任何用户都可以读写目录中的文件。
:::

**操作步骤**：

1. **使用 root 创建工作目录**

```bash
sudo mkdir -p /path/to/repos
```

2. **设置目录权限为 777**

```bash
sudo chmod 777 /path/to/repos
```

3. **验证权限**

```bash
ls -la /path/to/repos
```

输出示例：
```
drwxrwxrwx 2 root root 4096 Jan 15 10:00 .
```

**适用场景**：
- 开发环境
- 单用户环境
- 需要快速解决权限问题

**优点**：
- 操作简单，快速解决
- 无需修改 Docker 配置

**缺点**：
- 安全性较低，任何用户都可以读写
- 不适合生产环境
- 多用户环境可能存在风险

### 故障排除

以下是常见的权限问题及解决方法：

| 问题现象 | 可能原因 | 解决方案 |
|---------|---------|---------|
| 容器内无法写文件 | 用户 ID 不匹配 | 配置 PUID/PGID 或设置目录权限 |
| 容器内创建的文件宿主机无法访问 | 所有者 ID 不一致 | 使用方案一配置用户 ID 映射 |
| Permission denied 错误 | 文件或目录权限不足 | 检查并修改文件/目录权限 |

**诊断命令**：

```bash
# 检查宿主机文件权限
ls -la /path/to/repos

# 检查容器内用户
docker exec hagicode-app id

# 检查容器内文件权限
docker exec hagicode-app ls -la /app/workdir

# 测试容器内文件写入
docker exec hagicode-app touch /app/workdir/test.txt
```

**预防权限问题的最佳实践**：

1. 优先使用方案一（用户 ID 映射配置）
2. 在宿主机上使用专用的非 root 用户运行 Hagicode
3. 避免在生产环境使用 777 权限
4. 定期检查挂载目录的文件权限

## 访问应用

### Web 界面

服务启动成功后，通过浏览器访问：

```
http://localhost:45000
```

### 数据库连接

如果您需要直接连接到 PostgreSQL 数据库，可以通过 `docker exec` 命令进入容器：

```bash
# 进入 PostgreSQL 容器并连接到数据库
docker exec -it hagicode-postgres psql -U postgres -d hagicode
```

**容器内连接信息**：
- **主机**: `localhost` 或 `127.0.0.1`（容器内）
- **端口**: `5432`（PostgreSQL 默认端口）
- **用户名**: `postgres`
- **密码**: `postgres`
- **数据库**: `hagicode`

:::tip
PostgreSQL 未暴露到主机端口，这样更安全且避免端口冲突。如需从主机访问数据库，请使用 `docker exec` 命令。
:::

## 后续步骤

现在您已经成功部署了 Hagicode，请继续[创建第一个项目](/docs/quick-start/create-first-project)以开始使用。

如果您更喜欢使用软件包方式部署，请参阅[软件包部署指南](/docs/installation/package-deployment)。
