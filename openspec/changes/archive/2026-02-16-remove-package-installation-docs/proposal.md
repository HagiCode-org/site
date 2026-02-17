# 移除软件包安装相关文档

## 概述

移除 Hagicode 文档站点中已废弃的软件包安装方式（Package Deployment）相关文档和图片资源。软件包部署方式不再是我们支持的安装方式，保留这些内容会导致用户困惑并与当前主推的 Desktop 安装方式产生冲突。

## 问题陈述

### 当前状况

- `apps/docs/src/content/docs/installation/package-deployment.md` 存在并描述已废弃的软件包安装方式
- `docker-compose.md` 中包含指向该文档的引用链接
- 公共图片目录中可能存在与软件包安装相关的图片资源

### 影响分析

| 维度 | 影响 |
|------|------|
| **用户体验** | 用户可能尝试使用已废弃的安装方式，导致困惑和失败 |
| **维护成本** | 需要维护不再使用的文档内容 |
| **产品策略** | 与当前主推的 Desktop 安装方式产生冲突 |

## 解决方案

### 1. 删除文档文件

删除 `apps/docs/src/content/docs/installation/package-deployment.md`

### 2. 更新内部链接引用

更新 `apps/docs/src/content/docs/installation/docker-compose.md`：
- 将第 239 行指向 `package-deployment` 的链接改为指向 **Desktop 安装页面**
- 更新链接文本以反映当前推荐的安装方式

**理由**: 当前产品推荐的两种部署模式为 **Docker Compose** 和 **Desktop**，移除软件包部署链接后应引导用户使用 Desktop 安装方式。

### 3. 删除图片资源

检查并删除 `apps/docs/public/img/` 目录中与软件包安装直接相关的图片文件

### 4. 验证构建

- 确保 `npm run build:docs` 构建成功
- 验证没有断链（项目配置 `onBrokenLinks: 'throw'`）

## 范围

### 包含

- 删除 `package-deployment.md` 文件
- 更新 `docker-compose.md` 中的引用链接，改为指向 Desktop 安装页面
- 删除与软件包安装直接相关的图片资源
- 验证构建和链接完整性

### 不包含

- 修改其他安装方式文档（Desktop、Docker Compose）
- 更新站点导航配置（使用 `autogenerate` 自动生成）
- 修改其他功能文档内容

## 实施计划

实施任务详见 [tasks.md](./tasks.md)

## 风险与缓解

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| 外部网站/文档存在死链 | SEO 和用户体验影响 | 中 | 服务器配置 301 重定向 |
| 用户书签失效 | 用户访问失败 | 低 | 提供 Desktop 安装替代 |
| 图片误删 | 其他功能受影响 | 低 | 人工审核图片依赖 |

## 成功标准

1. ✅ `package-deployment.md` 文件已删除
2. ✅ `docker-compose.md` 中链接已更新为指向 Desktop 安装页面
3. ✅ 构建成功无错误（`npm run build:docs`）
4. ✅ 无断链错误（Astro `onBrokenLinks: 'throw'` 通过）
5. ✅ 本地预览验证导航和内容正常
6. ✅ Docker Compose 页面正确引导用户使用 Desktop 作为替代安装方式

## 发布后检查

- 确认 Azure 部署后线上站点功能正常
- 验证安装指南页面导航清晰指向 Desktop 安装

## 相关链接

- 原始需求: `remove-package-installation-docs`
- Astro 配置: `apps/docs/astro.config.mjs`
