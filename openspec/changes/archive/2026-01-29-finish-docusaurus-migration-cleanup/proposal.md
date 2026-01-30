# 提案: 完成 Docusaurus 迁移清理工作

## 提案元数据

- **ID**: `finish-docusaurus-migration-cleanup`
- **状态**: <span class="status-completed">执行完成</span>
- **创建日期**: 2026-01-29
- **完成日期**: 2026-01-29
- **目标分支**: `feat/astro-migration`
- **影响范围**: 文档、配置、依赖、规范

---

## 概述

项目已于 2026-01-29 完成从 Docusaurus 3.x 到 Astro 5.x 的框架迁移(提案 `migrate-docusaurus-to-astro`)。当前工作区状态整洁,但代码库中仍残留 Docusaurus 相关的文档、配置引用和过时规范。本提案旨在彻底清理这些残留内容,确保项目完全迁移到 Astro 生态,避免对开发者造成困扰。

---

## 动机

### 为什么需要清理?

1. **文档过时**:
   - `README.md` 仍引用 Docusaurus,与实际技术栈不符
   - `openspec/specs/docusaurus-site/spec.md` 已过时,应更新或归档
   - 项目文档中可能仍包含 Docusaurus 相关说明

2. **避免混淆**:
   - 新开发者可能被过时的文档误导
   - Docusaurus 相关命令和配置已不再适用
   - 技术栈描述不一致可能导致维护困难

3. **维护规范**:
   - OpenSpec 规范应反映当前技术栈(Astro)
   - 项目上下文文档(`openspec/project.md`)需要更新
   - 归档旧的迁移提案,保持变更目录整洁

### 当前状态分析

**已完成的工作**:
- ✅ Git 工作区整洁(无未提交的 Docusaurus 文件)
- ✅ `package.json` 已清理,无 Docusaurus 依赖
- ✅ CI/CD 配置(`.github/workflows/deploy.yml`)已更新为 Astro 构建命令
- ✅ `openspec/project.md` 已更新为 Astro 技术栈

**待清理的内容**:
- ❌ `README.md` 仍引用 Docusaurus(第 322、364、378 行)
- ❌ `openspec/specs/docusaurus-site/` 规范目录未归档或重命名
- ❌ `openspec/changes/migrate-docusaurus-to-astro/` 未归档到 `archive/`

---

## 技术变更

### 文档更新

**`README.md`**:
- 将 "基于 Docusaurus 构建" 更新为 "基于 Astro 构建"
- 更新快速开始命令:`npm start` → `npm run dev`
- 更新项目结构描述,反映 Astro 目录结构
- 更新 Docusaurus 链接为 Astro 链接

**`openspec/project.md`**:
- 移除 Rollback Instructions 章节(第 261-304 行)
  - 该章节描述如何恢复 Docusaurus 双语支持,已不再适用
  - 迁移已完成,不需要回滚指南
- 更新 Recent Changes 章节,确认迁移状态

### OpenSpec 规范处理

**选项 A: 重命名规范目录**:
- 将 `openspec/specs/docusaurus-site/` 重命名为 `openspec/specs/astro-site/`
- 更新规范内的技术栈描述

**选项 B: 归档旧规范**:
- 将 `docusaurus-site` 规范标记为 deprecated
- 创建新的 `astro-site` 规范

**推荐选项 B**: 保持规范历史清晰,创建新规范而非修改旧规范。

### 提案归档

- 将 `openspec/changes/migrate-docusaurus-to-astro/` 移动到 `openspec/changes/archive/2026-01-29-migrate-docusaurus-to-astro/`
- 更新提案状态为 "执行完成"

---

## 成功标准

### 文档一致性

- ✅ `README.md` 无 Docusaurus 引用
- ✅ 项目结构描述与 Astro 目录一致
- ✅ 开发命令适用于 Astro 项目

### OpenSpec 规范

- ✅ 创建新的 `astro-site` 规范或更新现有规范
- ✅ 旧的 `docusaurus-site` 规范已归档或标记为 deprecated
- ✅ `openspec/project.md` 移除过时的回滚指南

### 提案管理

- ✅ 迁移提案已归档到 `archive/` 目录
- ✅ 变更目录整洁,无活动状态的过期提案

### 验证

- ✅ `openspec validate --strict` 通过
- ✅ `npm run build` 成功构建
- ✅ `npm run typecheck` 类型检查通过
- ✅ `npm run preview` 本地预览正常

---

## 风险与缓解

### 低风险

1. **文档更新遗漏**
   - 缓解: 使用 `grep -r "docusaurus\|Docusaurus" --exclude-dir=node_modules --exclude-dir=.astro --exclude-dir=dist --exclude-dir=.git` 全面搜索
   - 验证: 检查搜索结果,确保所有引用已更新

2. **规范重命名影响其他提案**
   - 缓解: 使用 `openspec list --specs` 检查规范依赖
   - 回退: 保留旧规范,仅标记为 deprecated

3. **归档提案导致历史丢失**
   - 缓解: Git 历史保留完整记录,归档仅是目录移动
   - 验证: 归档后确认 Git 提交历史完整

---

## 实施计划

### 阶段 1: 全面搜索和分析(5 分钟)

- 搜索所有 Docusaurus 引用
- 分析影响范围
- 确认更新优先级

### 阶段 2: 更新 README.md(10 分钟)

- 更新技术栈描述
- 更新快速开始命令
- 更新项目结构
- 更新链接和引用

### 阶段 3: 处理 OpenSpec 规范(15 分钟)

- 创建新的 `astro-site` 规范
- 标记 `docusaurus-site` 为 deprecated
- 更新 `openspec/project.md`

### 阶段 4: 归档迁移提案(5 分钟)

- 移动提案到 `archive/` 目录
- 更新提案状态

### 阶段 5: 验证和测试(10 分钟)

- 运行 `openspec validate --strict`
- 运行 `npm run build`
- 运行 `npm run typecheck`
- 本地预览测试

**总预计时间**: 45 分钟

---

## 相关提案

- `migrate-docusaurus-to-astro` (已完成,待归档) - 从 Docusaurus 迁移到 Astro 的主提案

---

## 参考资料

- [Astro 官方文档](https://docs.astro.build)
- [OpenSpec AGENTS.md](../AGENTS.md) - OpenSpec 工作流指南
- [迁移提案](./archive/2026-01-29-migrate-docusaurus-to-astro/proposal.md) - Docusaurus 到 Astro 迁移详情
