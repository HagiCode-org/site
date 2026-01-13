---
proposal: simplify-installation-guide-prerequisites
title: 简化安装指南中关于前置条件的描述
status: ExecutionCompleted
created: 2026-01-13
---

## 概述

简化 `docs/quick-start/installation.md` 的内容结构，通过链接引用已有的独立安装指南文档，减少文档冗余，降低维护成本，提升用户体验。

## 背景

当前安装指南中包含了详细的前置软件安装说明，导致文档篇幅较长（约 460 行）且维护成本较高。项目已为多数前置依赖创建了独立的安装指南文档：
- Node.js 安装指南：`docs/related-software-installation/nodejs/installation.md`
- Claude Code 安装指南：`docs/related-software-installation/claude-code/setup-claude-code-with-zai.md`
- OpenSpec 安装指南：`docs/related-software-installation/openspec/setup-openspec.md`

## 问题陈述

1. **文档冗余**：安装指南中包含了大量与其他文档重复的安装说明
2. **维护负担**：当某个软件的安装步骤更新时，需要同时修改多个文件
3. **用户体验**：过长的安装指南影响阅读效率，用户难以快速获取核心信息
4. **例外情况**：PostgreSQL 目前缺少独立的安装指南文档，仍需在主安装指南中保留详细说明

## 解决方案

### 内容结构调整

简化 `docs/quick-start/installation.md` 的"先决条件"部分：

1. **保留前置条件列表**：清晰列出所有需要安装的软件及版本要求
2. **添加文档链接引用**：为已有独立安装指南的软件提供链接引用
3. **保留 PostgreSQL 详细说明**：由于 PostgreSQL 暂无独立文档，在主安装指南中保留完整的安装步骤
4. **采用一致的文档结构**：使用标准的 Docusaurus markdown 格式和 frontmatter 规范

### 具体修改内容

#### Node.js 和 npm 部分（第 69-106 行）

**当前状态**：包含详细的分平台安装说明

**修改后**：简化为版本要求 + 验证命令 + 链接引用

```markdown
### Node.js 和 npm

PCode 需要 Node.js 18.0 或更高版本。

**安装指南**：请参阅 [Node.js 安装指南](/docs/related-software-installation/nodejs/installation)

**验证安装**：
```bash
node --version
npm --version
```
```

#### OpenSpec CLI 部分（第 107-123 行）

**当前状态**：包含基本安装命令，已有 tip 提示引用详细文档

**修改后**：简化为版本要求 + 链接引用

```markdown
### OpenSpec CLI

OpenSpec 是一个用于管理提案和规范的工具。

**安装指南**：请参阅 [OpenSpec 安装指南](/docs/related-software-installation/openspec/setup-openspec)

**验证安装**：
```bash
openspec --version
```
```

#### Claude Code CLI 部分（第 125-133 行）

**当前状态**：仅包含链接引用（已是良好状态）

**修改后**：保持现状，添加版本验证命令

```markdown
### Claude Code CLI

PCode 的 AI 驱动功能需要 Claude Code CLI。

**安装指南**：请参阅 [Claude Code 安装指南](/docs/related-software-installation/claude-code/setup-claude-code-with-zai)

**验证安装**：
```bash
claude --version
```
```

#### PostgreSQL 部分（第 18-68 行）

**当前状态**：包含完整的 Docker 安装和使用说明

**修改后**：保持现状，保留所有详细安装步骤

**理由**：PostgreSQL 暂无独立的安装指南文档，需要保留详细说明

## 影响分析

### 正面影响

- **文档维护**：降低维护成本，单一职责原则更明确
- **用户体验**：安装指南更加简洁，用户可快速浏览前置条件
- **内容组织**：符合 Docusaurus 文档分层最佳实践，便于未来扩展

### 风险评估

- **链接有效性**：需确保所有内部链接在构建时无错误（`docusaurus.config.ts` 设置了 `onBrokenLinks: 'throw'`）
- **信息完整性**：需确保链接文档包含足够的安装细节

### 缓解措施

- 在简化后的文档中明确标注版本要求
- 保留验证安装的命令，方便用户确认安装成功
- 在构建流程中验证所有内部链接

## 验收标准

1. **文档修改**
   - [ ] `docs/quick-start/installation.md` 的 Node.js 部分简化为链接引用
   - [ ] `docs/quick-start/installation.md` 的 OpenSpec 部分简化为链接引用
   - [ ] `docs/quick-start/installation.md` 的 Claude Code 部分添加验证命令
   - [ ] PostgreSQL 部分保持不变

2. **链接验证**
   - [ ] 所有内部链接指向有效的文档路径
   - [ ] `npm run build` 成功完成，无链接错误

3. **内容完整性**
   - [ ] 保留所有版本要求说明
   - [ ] 保留所有验证安装的命令
   - [ ] 环境检查脚本保持不变

4. **文档质量**
   - [ ] 使用一致的 Markdown 格式
   - [ ] frontmatter 规范完整
   - [ ] 中文文本保持专业、准确

## 替代方案

### 方案 A：为所有依赖创建独立安装指南

为 PostgreSQL 也创建独立的安装指南，完全移除主安装指南中的详细安装步骤。

**优点**：完全消除文档冗余

**缺点**：增加文档维护成本，用户需要在多个文档间跳转

**决策**：不采用，PostgreSQL 安装相对简单，保留在主指南中更合理

### 方案 B：保持现状

不修改文档结构，继续在主安装指南中包含所有详细安装步骤。

**优点**：无需修改，信息集中

**缺点**：维护成本高，文档冗余

**决策**：不采用，不符合文档最佳实践

## 参考资料

- [Docusaurus 文档链接最佳实践](https://docusaurus.io/docs/docs-introduction#linking)
- 当前安装指南：`docs/quick-start/installation.md`
- Node.js 安装指南：`docs/related-software-installation/nodejs/installation.md`
- Claude Code 安装指南：`docs/related-software-installation/claude-code/setup-claude-code-with-zai.md`
- OpenSpec 安装指南：`docs/related-software-installation/openspec/setup-openspec.md`
