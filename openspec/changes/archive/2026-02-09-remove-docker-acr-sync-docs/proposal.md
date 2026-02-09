# 移除 Docker 镜像同步到 ACR 工作流

**状态**: 提案中
**创建日期**: 2026-02-09
**变更 ID**: `remove-docker-acr-sync-docs`
**负责人**: 待定

## 概述

从 Hagicode 文档站点中移除 Docker 镜像同步到 Azure Container Registry (ACR) 和阿里云容器镜像服务的 GitHub Actions 工作流，以及相关的内部设计文档。镜像同步功能已在其他仓库中实现，当前仓库不再需要维护此工作流。

**重要**: 用户文档（博客文章、部署指南等）保持不变，仅移除工作流和内部设计文档。

## 背景

### 当前状态

Hagicode 文档站点包含以下 ACR 相关内容：

| 类型 | 文件 | 描述 | 变更计划 |
|------|------|------|----------|
| **工作流** | `.github/workflows/sync-docker-acr.yml` | 自动同步 Docker 镜像到 Azure ACR 和阿里云 ACR | **删除** |
| **设计文档** | `openspec/changes/archive/2026-01-25-github-actions-docker-acr-sync/` | Azure ACR 同步设计 | **删除** |
| **设计文档** | `openspec/changes/archive/2026-01-28-aliyun-mirror-repository-sync/` | 阿里云镜像同步设计 | **删除** |
| 博客文章 | `src/content/docs/blog/2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github.mdx` | 介绍如何使用 GitHub Actions + image-syncer 实现镜像同步 | **保持不变** |
| 部署文档 | `src/content/docs/installation/docker-compose.mdx` | 包含 ACR 镜像源选择配置 | **保持不变** |
| 配置 | `.media-console/sync-manifest.json` | 包含相关博客文章的记录 | **保持不变** |

### 问题陈述

1. **功能已迁移**: Docker 镜像同步功能的 GitHub Actions 工作流已在其他仓库中实现
2. **重复维护**: 当前仓库中的工作流与实际执行同步的工作流重复，造成维护负担
3. **职责分离**: 文档站点应专注于提供用户文档，而非执行 CI/CD 工作流

## 变更内容

### 移除范围

#### 1. 删除文件

以下文件将被完全删除：

```
.github/workflows/sync-docker-acr.yml
openspec/changes/archive/2026-01-25-github-actions-docker-acr-sync/
openspec/changes/archive/2026-01-28-aliyun-mirror-repository-sync/
```

### 保持不变

以下内容**保持不变**：

- 用户文档（博客文章、部署指南等）
  - `src/content/docs/blog/2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github.mdx`
  - `src/content/docs/installation/docker-compose.mdx`
  - `.media-console/sync-manifest.json`
- 站点部署工作流
  - `.github/workflows/deploy.yml` (GitHub Pages)
  - `.github/workflows/azure-static-web-apps-ashy-flower-0f8ed9400.yml` (Azure Static Web Apps)
- 其他与 Docker 镜像同步无关的内容

## 影响分析

### 正面影响

| 方面 | 描述 |
|------|------|
| 简化维护 | 减少不相关内容的维护负担 |
| 避免混淆 | 用户不会在文档中遇到与其使用场景无关的内容 |
| 保持一致性 | 确保文档内容与 Hagicode 项目的核心功能定位一致 |

### 风险评估

| 风险 | 级别 | 缓解措施 |
|------|------|----------|
| 内部链接断裂 | 低 | 运行构建检查，修复所有断开的链接 |
| 外部引用失效 | 低 | 如有外部文档链接，提供重定向或更新引用 |
| 用户体验影响 | 极低 | 此功能已迁移至其他仓库，用户可在新位置获取相关信息 |

## 成功标准

变更完成的标准：

- [ ] GitHub Actions 工作流 `sync-docker-acr.yml` 已删除
- [ ] 相关 OpenSpec 设计文档已删除
- [ ] `npm run build` 构建成功
- [ ] `npm run typecheck` 类型检查通过
- [ ] 本地开发服务器 (`npm run dev`) 正常运行
- [ ] 用户文档内容保持完整且可访问
- [ ] 相关 PR 已通过代码审查

## 替代方案

### 方案 A：仅移除工作流（推荐）

删除 GitHub Actions 工作流和内部设计文档，保留所有用户文档。

**优点**:
- 移除冗余的 CI/CD 工作流
- 保持用户文档完整，不影响用户体验
- 清理内部设计文档，避免混淆

**缺点**:
- 用户文档中描述的工作流与实际执行的工作流不在同一仓库

### 方案 B：完全移除

删除所有 ACR 相关内容，包括用户文档。

**优点**: 最彻底的清理
**缺点**: 丢失有用的用户指南内容

**推荐采用方案 A**，因为用户文档提供了有价值的技术参考，而工作流本身已在其他仓库中维护。

## 时间线

| 阶段 | 描述 |
|------|------|
| 提案审批 | 等待此提案获得批准 |
| 实施 | 执行删除和修改操作 |
| 验证 | 运行构建和类型检查 |
| 发布 | 合并 PR 到主分支 |

## 参考资料

- [OpenSpec 规范](../../AGENTS.md)
- [项目迁移历史](../archive/2025-01-docusaurus-to-astro-migration/)
- 原有设计文档:
  - [GitHub Actions Docker ACR 同步设计](../archive/2026-01-25-github-actions-docker-acr-sync/design.md)
  - [阿里云镜像仓库同步设计](../archive/2026-01-28-aliyun-mirror-repository-sync/design.md)
