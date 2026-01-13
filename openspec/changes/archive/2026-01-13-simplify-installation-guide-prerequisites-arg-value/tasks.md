---
proposal: simplify-installation-guide-prerequisites
title: 简化安装指南中关于前置条件的描述
status: proposed
created: 2026-01-13
---

# 实现任务清单

## 阶段 1：准备工作

### Task 1.1: 验证链接目标文档存在
**优先级**: P0（必须）
**预估时间**: 5 分钟

**描述**：确认所有要引用的独立安装指南文档存在且路径正确。

**检查步骤**：
1. [ ] 验证 `docs/related-software-installation/nodejs/installation.md` 存在
2. [ ] 验证 `docs/related-software-installation/openspec/setup-openspec.md` 存在
3. [ ] 验证 `docs/related-software-installation/claude-code/setup-claude-code-with-zai.md` 存在
4. [ ] 确认各文档的 frontmatter 中定义的 slug 与引用路径一致

**验收标准**：所有目标文档路径有效

---

### Task 1.2: 备份当前安装指南
**优先级**: P0（必须）
**预估时间**: 2 分钟

**描述**：在修改前备份当前安装指南，以便出现问题时快速回滚。

**步骤**：
```bash
cp docs/quick-start/installation.md docs/quick-start/installation.md.backup
```

**验收标准**：备份文件已创建

---

## 阶段 2：文档修改

### Task 2.1: 简化 Node.js 和 npm 部分
**优先级**: P0（必须）
**预估时间**: 10 分钟

**描述**：将 Node.js 和 npm 安装说明简化为链接引用，保留版本要求和验证命令。

**修改位置**：`docs/quick-start/installation.md` 第 69-106 行

**修改内容**：

删除内容：
```markdown
#### 验证 Node.js 安装

```bash
node --version
```

如果 Node.js 未安装或您的版本低于 18.0：

<Tabs>
  <TabItem value="win" label="Windows">
    从 [nodejs.org](https://nodejs.org/) 下载并安装 LTS 版本
  </TabItem>
  <TabItem value="mac" label="macOS">
    使用 Homebrew 安装：

```bash
brew install node
```
  </TabItem>
  <TabItem value="linux" label="Linux">
    使用您的包管理器安装：

```bash title="Ubuntu/Debian"
sudo apt-get install nodejs npm
```
  </TabItem>
</Tabs>

#### 验证 npm 安装

```bash
npm --version
```
```

替换为：
```markdown
**安装指南**：请参阅 [Node.js 安装指南](/docs/related-software-installation/nodejs/installation)

**验证安装**：
```bash
node --version
npm --version
```
```

**验收标准**：
- [ ] 移除了所有平台特定的安装说明
- [ ] 添加了独立安装指南的链接
- [ ] 保留了版本要求说明
- [ ] 保留了验证命令

---

### Task 2.2: 简化 OpenSpec CLI 部分
**优先级**: P0（必须）
**预估时间**: 5 分钟

**描述**：将 OpenSpec CLI 安装说明简化为链接引用。

**修改位置**：`docs/quick-start/installation.md` 第 107-123 行

**修改内容**：

删除内容：
```markdown
OpenSpec 是一个用于管理提案和规范的工具。全局安装它：

```bash
npm install -g @fission-ai/openspec@latest
```

验证安装：

```bash
openspec --version
```

:::tip 详细的安装指南
需要更详细的 OpenSpec 安装和配置说明，包括故障排除和多平台支持，请参阅 **[安装 OpenSpec](/docs/related-software-installation/openspec/setup-openspec)**。
:::
```

替换为：
```markdown
OpenSpec 是一个用于管理提案和规范的工具。

**安装指南**：请参阅 [OpenSpec 安装指南](/docs/related-software-installation/openspec/setup-openspec)

**验证安装**：
```bash
openspec --version
```
```

**验收标准**：
- [ ] 移除了 npm 安装命令
- [ ] 移除了原有的 tip 提示框
- [ ] 添加了独立的安装指南链接
- [ ] 保留了验证命令

---

### Task 2.3: 完善 Claude Code CLI 部分
**优先级**: P1（建议）
**预估时间**: 3 分钟

**描述**：为 Claude Code CLI 部分添加验证命令，保持与其他部分的一致性。

**修改位置**：`docs/quick-start/installation.md` 第 125-133 行

**修改内容**：

当前内容：
```markdown
### Claude Code CLI

PCode 的 AI 驱动功能需要 Claude Code CLI。详细的安装和配置指南请参阅：**[安装 Claude Code](/docs/related-software-installation/claude-code/setup-claude-code-with-zai)**

验证安装：

```bash
claude --version
```
```

修改为：
```markdown
### Claude Code CLI

PCode 的 AI 驱动功能需要 Claude Code CLI。

**安装指南**：请参阅 [Claude Code 安装指南](/docs/related-software-installation/claude-code/setup-claude-code-with-zai)

**验证安装**：
```bash
claude --version
```
```

**验收标准**：
- [ ] 添加了"**安装指南**："前缀，与其他部分保持一致
- [ ] 链接文本简化为"Claude Code 安装指南"
- [ ] 保留了验证命令

---

## 阶段 3：验证与测试

### Task 3.1: 验证内部链接
**优先级**: P0（必须）
**预估时间**: 5 分钟

**描述**：确保所有新增的内部链接在构建时有效。

**验证步骤**：
1. [ ] 运行 `npm run build`
2. [ ] 确认构建过程中没有出现 broken link 错误
3. [ ] 如果出现链接错误，修复路径后重新构建

**命令**：
```bash
npm run build
```

**验收标准**：构建成功，无链接错误

---

### Task 3.2: 本地预览验证
**优先级**: P1（建议）
**预估时间**: 5 分钟

**描述**：在本地预览修改后的文档，确认链接可正常跳转。

**验证步骤**：
1. [ ] 运行 `npm run start`
2. [ ] 在浏览器中打开安装指南页面
3. [ ] 点击所有新增的链接，确认能正确跳转
4. [ ] 确认页面布局和样式正常

**命令**：
```bash
npm run start
```

**验收标准**：所有链接可正常跳转，页面显示正常

---

### Task 3.3: 文档质量检查
**优先级**: P1（建议）
**预估时间**: 5 分钟

**描述**：检查修改后的文档是否符合质量标准。

**检查清单**：
1. [ ] Markdown 格式正确，无语法错误
2. [ ] frontmatter 保持完整
3. [ ] 中文文本保持专业、准确
4. [ ] 代码块语法高亮正确
5. [ ] 环境检查脚本部分保持不变（第 135-207 行）

**验收标准**：所有检查项通过

---

## 阶段 4：清理与提交

### Task 4.1: 清理备份文件
**优先级**: P2（可选）
**预估时间**: 1 分钟

**描述**：在确认修改无误后，删除备份文件。

**步骤**：
```bash
rm docs/quick-start/installation.md.backup
```

**验收标准**：备份文件已删除

---

### Task 4.2: 更新变更日志
**优先级**: P1（建议）
**预估时间**: 5 分钟

**描述**：在相关变更日志或提交信息中记录本次修改。

**提交信息模板**：
```
docs: simplify installation guide prerequisites

- Replace Node.js installation steps with link reference
- Replace OpenSpec CLI installation steps with link reference
- Add verification command to Claude Code CLI section
- Keep PostgreSQL installation details in main guide

This reduces documentation redundancy and improves maintenance
efficiency by referencing existing installation guides.
```

**验收标准**：变更已记录

---

## 验收总结

### 必须完成（P0）
- [x] Task 1.1: 验证链接目标文档存在
- [x] Task 1.2: 备份当前安装指南
- [x] Task 2.1: 简化 Node.js 和 npm 部分
- [x] Task 2.2: 简化 OpenSpec CLI 部分
- [x] Task 3.1: 验证内部链接

### 建议完成（P1）
- [x] Task 2.3: 完善 Claude Code CLI 部分
- [x] Task 3.2: 本地预览验证
- [x] Task 3.3: 文档质量检查
- [x] Task 4.2: 更新变更日志

### 可选完成（P2）
- [ ] Task 4.1: 清理备份文件

---

## 预期效果

完成后，安装指南的"先决条件"部分将更加简洁：
- Node.js 和 npm：约 10 行（原 38 行）
- OpenSpec CLI：约 7 行（原 17 行）
- Claude Code CLI：约 7 行（原 9 行，格式统一）
- PostgreSQL：保持不变

总计减少约 50 行冗余内容，提升文档可读性和维护效率。
