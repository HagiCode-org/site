# 简化 .NET SDK 安装文档为运行依赖指南

**状态**: 提案中
**创建日期**: 2026-02-16
**变更 ID**: `dotnet-sdk-runtime-dependency-guide`
**负责人**: 待定

## 概述

将 .NET SDK 安装文档从面向开发者的"开发环境安装指南"简化为面向终端用户的"运行依赖安装指南"。当前文档包含大量与 Hagicode 用户需求无关的开发相关内容（如 `dotnet new`、`dotnet build`、项目模板、global.json 版本管理等），需要精简为聚焦于"安装即可用"的核心需求。

## 背景

### 当前状态

现有 .NET SDK 安装文档（`apps/docs/src/content/docs/related-software-installation/dotnet/install-dotnet-sdk.md`）位于"相关软件安装"分类下，但内容定位为完整的开发环境安装指南，包含：

| 章节类型 | 内容示例 | 是否需要保留 |
|---------|---------|-------------|
| **开发工具介绍** | .NET SDK 包含 CLI 工具、编译器、项目模板 | 删除 |
| **开发命令示例** | `dotnet new console`、`dotnet build`、`dotnet run` | 删除 |
| **版本管理** | global.json 固定项目版本、多版本 SDK 管理 | 删除 |
| **项目创建验证** | 创建测试项目验证安装 | 删除 |
| **基础安装方法** | 官方安装包、winget、Homebrew、apt 等 | 保留 |
| **基础验证** | `dotnet --version`、`dotnet --info` | 保留 |
| **故障排除** | PATH 问题、版本检查 | 简化保留 |
| **镜像加速** | NuGet 镜像源配置 | 简化保留 |
| **卸载方法** | 各操作系统卸载步骤 | 保留（移至附录） |

### 问题陈述

1. **目标用户错位**: Hagicode 用户将 .NET SDK 作为运行依赖使用，不需要了解如何创建项目、编译代码等开发流程

2. **信息冗余**: 当前文档约 630 行，其中约 40% 内容（开发相关章节）对依赖安装用户不必要

3. **内容结构问题**:
   - "什么是 .NET SDK" 章节对终端用户过于技术化
   - 验证安装步骤过于复杂（创建测试项目超出依赖安装需求）
   - 混用 `<Tabs>` 和独立标题，结构不够清晰

4. **文档定位不符**: 作为 `related-software-installation/` 分类下的文档，应聚焦于快速安装依赖使其可用，而非开发环境搭建

## 变更内容

### 1. 简化文档定位

将文档定位从"开发环境安装指南"调整为"运行依赖安装指南"：

**删除的开发相关章节**:
- "什么是 .NET SDK" 中关于 CLI 工具、编译器、项目模板的说明
- `dotnet new console`、`dotnet build`、`dotnet run` 等创建项目示例
- global.json 版本管理章节
- `dotnet --list-sdks`、`dotnet --list-runtimes` 版本列表命令
- "创建测试项目"验证步骤

**保留的核心安装内容**:
- 各操作系统快速安装方法（官方安装包 + 包管理器）
- 基础验证（`dotnet --version`）
- PATH 问题排查
- 中国大陆用户加速（简化版）
- 卸载方法（移至附录）

### 2. 重新组织内容结构

新的文档结构（精简版）：

```markdown
# 安装 .NET SDK（运行依赖）

## 简要说明
- .NET SDK 是 Hagicode 运行所需的依赖
- 安装后即可使用，无需额外配置

## 快速安装
<Tabs>
  <TabItem label="Windows">
  - 官方安装包
  - winget
  </TabItem>

  <TabItem label="macOS">
  - 官方安装包
  - Homebrew
  </TabItem>

  <TabItem label="Linux">
  - Ubuntu/Debian
  - CentOS/RHEL
  - Fedora
  - Arch Linux
  </TabItem>
</Tabs>

## 验证安装
```bash
dotnet --version
```

## 常见问题
<Tabs>
  <TabItem label="命令不可用">
  </TabItem>
  <TabItem label="版本检查">
  </TabItem>
</Tabs>

## 附录：卸载 .NET SDK
<Tabs>
  <TabItem label="Windows">
  </TabItem>
  <TabItem label="macOS">
  </TabItem>
  <TabItem label="Linux">
  </TabItem>
</Tabs>
```

### 3. 精简内容描述

**描述字段调整**:
```markdown
旧: "本指南将详细说明如何在 Windows、macOS 和 Linux 操作系统上安装 .NET 10 SDK。.NET SDK 是使用 .NET 进行应用开发所需的工具集..."
新: "本指南帮助您在 Windows、macOS 和 Linux 系统上安装 .NET SDK 运行依赖。"
```

**Tip 内容调整**:
```markdown
旧: "PCode 推荐使用 .NET 10 SDK（最低支持 .NET >= 8.0）。建议安装最新的 .NET 10 版本以获得最佳性能和功能支持..."
新: "Hagicode 需要 .NET 10 SDK 作为运行依赖（最低 .NET >= 8.0）"
```

### 4. 简化保留内容

以下内容予以保留但简化：

- **中国大陆用户加速**: 简化为"如果下载速度慢，可使用镜像源"，删除详细的 NuGet.Config 手动编辑步骤
- **卸载方法**: 保留但移至文档末尾的"附录"章节
- **故障排除**: 精简为"PATH 问题"和"版本检查"两个最常见场景

### 5. 文件路径调整（可选）

当前文件路径 `related-software-installation/dotnet/install-dotnet-sdk.md` 保持不变（URL 兼容性），但调整文档描述以符合"运行依赖"定位。

## 影响分析

### 用户体验改进

| 方面 | 描述 |
|------|------|
| 降低认知负荷 | 删除不相关的开发内容，用户可更快完成安装 |
| 减少困惑 | 避免用户误以为需要学习 .NET 开发才能使用 Hagicode |
| 提升效率 | 聚焦"安装即可用"的核心需求 |

### 技术影响

| 方面 | 描述 |
|------|------|
| 无破坏性更改 | 仅调整现有文档内容，不涉及代码或配置 |
| SEO 影响 | 可能略微降低".NET SDK 开发"相关搜索的排名，但提升".NET 运行依赖"相关搜索的匹配度 |
| 向后兼容 | 现有 URL (`/docs/related-software-installation/dotnet/install-dotnet-sdk`) 保持不变 |

### 文档维护

| 方面 | 描述 |
|------|------|
| 减少维护负担 | 精简后的文档更易维护和更新 |
| 降低过时风险 | 删除与 .NET SDK 开发工具相关的频繁变更内容 |

### 风险评估

| 风险 | 级别 | 缓解措施 |
|------|------|----------|
| 部分用户仍需要开发相关信息 | 低 | 在文档末尾保留"了解更多"链接，指向 .NET 官方文档 |
| 现有链接失效 | 极低 | URL 保持不变，仅调整内容 |

## 成功标准

变更完成的标准：

- [ ] 文档描述字段更新为运行依赖定位
- [ ] 删除"什么是 .NET SDK"中的开发工具介绍
- [ ] 删除 `dotnet new`、`dotnet build`、`dotnet run` 等开发命令示例
- [ ] 删除 global.json 版本管理章节
- [ ] 删除"创建测试项目"验证步骤
- [ ] 简化故障排除章节（仅保留 PATH 和版本检查）
- [ ] 简化中国大陆用户加速章节
- [ ] 将卸载方法移至"附录"章节
- [ ] 在文档末尾添加"了解更多"链接指向 .NET 官方文档
- [ ] `npm run build` 构建成功，无链接失效
- [ ] 相关 PR 已通过代码审查

## 替代方案

### 方案 A：仅简化内容（推荐）

删除开发相关内容，保留核心安装步骤，添加"了解更多"链接。

**优点**:
- 聚焦核心需求，降低认知负荷
- 保持 URL 不变，无破坏性更改
- 易于维护

**缺点**:
- 可能无法满足少数需要开发信息的用户

### 方案 B：创建新文档

创建新的"运行依赖安装"文档，保留原文档不变。

**优点**: 保留完整信息供有需要的用户

**缺点**:
- 维护两份文档，增加维护负担
- 可能造成用户困惑（不知该读哪个）

### 方案 C：移动文档路径

将文档移动到 `related-software-installation/dotnet-runtime/`。

**优点**: 路径更符合定位

**缺点**:
- URL 变更可能导致外部链接失效
- 需要配置重定向

**推荐采用方案 A**，在现有路径上简化内容，保持 URL 兼容性。

## 时间线

| 阶段 | 描述 |
|------|------|
| 提案审批 | 等待此提案获得批准 |
| 实施 | 按照任务清单执行文档简化 |
| 验证 | 运行构建检查，确认无链接失效 |
| 发布 | 合并 PR 到主分支 |

## 参考资料

- [OpenSpec 规范](../../AGENTS.md)
- [项目文档约定](../../project.md)
- [.NET 官方文档](https://learn.microsoft.com/zh-cn/dotnet/core/install/)
- 当前文档: `apps/docs/src/content/docs/related-software-installation/dotnet/install-dotnet-sdk.md`
