# Starlight 站点规范

## 范围

本规范定义了 Hagicode 文档站点中 Starlight 功能的使用标准,包括 Markdown 扩展语法、组件使用和最佳实践。

## MODIFIED Requirements

### Requirement: 在 Starlight 文档中使用 Aside 语法

文档作者 **MUST** 使用 Starlight 原生的 `:::tip`、`:::note`、`:::caution`、`:::danger` 语法来创建提示性内容块,**MUST NOT** 使用 JSX `<Aside>` 组件或 Docusaurus 特有的其他语法,**SHOULD** 根据内容语义选择合适的类型。

#### Scenario: 创建提示信息 (Tip)

**Given** 一个 Starlight MDX 文档文件
**When** 作者需要添加提示性内容、建议或最佳实践
**Then** 应该使用 `:::tip` 语法

**示例**:
```markdown
---
title: 创建您的第一个项目
---

## 步骤 1: 准备代码仓库

:::tip

Hagicode 适合管理任何您想要通过 AI 辅助开发和优化的代码项目,包括:

- 正在开发的功能项目
- 需要重构或优化的现有代码
- 团队协作的项目
- 个人开源项目

:::
```

**验证**:
- 使用 `:::tip` 开始标记
- 使用 `:::` 结束标记
- type 属性值为 "tip"
- 标记正确闭合

#### Scenario: 创建注释信息 (Note)

**Given** 一个 Starlight MDX 文档文件
**When** 作者需要添加补充说明、参考信息或备注
**Then** 应该使用 `:::note` 语法

**示例**:
```markdown
:::note

**注意**: 提交归档的规划文件时,使用以下命令确保包含所有相关文件:

```bash
git add .
git commit -m "添加新功能"
```

:::
```

**验证**:
- type 属性值为 "note"
- 内容可以包含代码块、列表等 Markdown 格式

#### Scenario: 创建警告信息 (Caution)

**Given** 一个 Starlight MDX 文档文件
**When** 作者需要添加注意事项、警告或潜在问题
**Then** 应该使用 `:::caution` 语法

**示例**:
```markdown
:::caution

归档不会自动将代码提交到您的存储库。您应该审查变更并使用 [Git](https://git-scm.com/) 手动提交。

:::
```

**验证**:
- type 属性值为 "caution"
- 内容清晰说明需要注意的事项

#### Scenario: 创建危险警告 (Danger)

**Given** 一个 Starlight MDX 文档文件
**When** 作者需要添加重要警告、危险操作或数据丢失风险
**Then** 应该使用 `:::note` 语法

**示例**:
```markdown
:::danger

**警告**: 此操作将永久删除数据,且无法恢复!请谨慎操作。

:::
```

**验证**:
- type 属性值为 "danger"
- 内容使用强调文本突出严重性
- 包含明确的警告标识

#### Scenario: 使用自定义标题

**Given** 一个 Starlight MDX 文档文件
**When** 作者需要为 aside 添加自定义标题
**Then** 应该使用 `:::type[标题]` 语法

**示例**:
```markdown
:::tip[你知道吗?]

Astro 帮助您构建更快的网站,使用"Islands Architecture"。

:::
```

**验证**:
- 自定义标题在方括号中
- 标题简明扼要
- 标题与内容相关

#### Scenario: 使用自定义图标

**Given** 一个 Starlight MDX 文档文件
**When** 作者需要为 aside 使用自定义图标
**Then** 应该使用 `:::type{icon="图标名"}` 语法

**示例**:
```markdown
:::tip{icon="heart"}

Astro 帮助您构建更快的网站。

:::
```

**验证**:
- 图标名称在引号中
- 使用 Starlight 内置图标
- 图标与内容语义匹配

---

### Requirement: 使用语义化的 Aside 类型

文档作者 **MUST** 根据提示性内容的语义选择正确的 aside 类型,**MUST** 确保类型使用与内容意图一致,**SHALL NOT** 为了视觉效果而误用类型。

#### Scenario: 选择合适的类型

**Given** 需要添加提示性内容
**When** 内容具有特定的语义(提示、注释、警告、危险)
**Then** 应使用对应语义的类型

**类型选择指南**:

| 类型 | 语义 | 使用场景 | 不应使用 |
|------|------|----------|----------|
| `tip` | 提示、建议 | 有用的建议、最佳实践、技巧、优化建议 | 普通说明、参考信息 |
| `note` | 注释、补充 | 补充说明、参考信息、备注、额外信息 | 重要警告、危险操作 |
| `caution` | 警告、注意 | 注意事项、警告、潜在问题、可能的问题 | 危险操作、数据丢失 |
| `danger` | 危险、严重警告 | 重要警告、危险操作、数据丢失风险、不可逆操作 | 一般提示、注意事项 |

**示例**:

```markdown
# ✅ 正确: 使用 tip 提供建议
:::tip
为了获得最佳性能,建议定期清理缓存。
:::

# ❌ 错误: 应该使用 note
:::tip
参考文档版本 2.0。
:::

# ✅ 正确: 使用 note 提供参考信息
:::note
参考文档版本 2.0。
:::

# ✅ 正确: 使用 caution 提醒注意事项
:::caution
此操作可能影响其他正在运行的任务。
:::

# ✅ 正确: 使用 danger 警告危险操作
:::danger
此操作将永久删除数据,且无法恢复!
:::

# ❌ 错误: 应该使用 caution
:::danger
此操作可能影响其他正在运行的任务。
:::
```

**验证**:
- 类型选择符合内容语义
- 避免为了视觉效果而误用类型
- 保持类型使用的语义一致性

---

### Requirement: 保持 Aside 内容简洁和格式规范

文档作者 **SHOULD** 保持 aside 内的内容简洁明了,**MUST** 遵循正确的格式规范,包括标记闭合、空行和结构化内容。

#### Scenario: 内容简洁性

**Given** 一个 aside
**When** 组件包含大量文本
**Then** 应考虑将内容移到主文档,或在 aside 中使用列表提高可读性

**反例**:
```markdown
:::tip
这是一个非常长的提示,包含大量的详细信息、历史背景、技术细节、实现原理、使用示例、注意事项、最佳实践、常见问题、故障排除、性能优化、安全建议等内容。这样的内容不适合放在提示框中,应该放在主文档中。
:::
```

**正例**:
```markdown
:::tip

为了获得最佳性能,建议:

- 定期清理缓存
- 使用最新版本
- 避免不必要的重新渲染

详见[性能优化指南](/docs/performance)。

:::
```

**验证**:
- 提示框内容简明扼要(建议不超过 200 字)
- 使用列表提高可读性
- 详细内容放在主文档或链接到其他页面

#### Scenario: 格式规范

**Given** 一个 aside
**When** 组件包含多行内容或嵌套结构
**Then** 应该保持良好的格式

**示例**:
```markdown
# ✅ 正确: 良好的格式
:::tip

Hagicode 适合管理各种项目:

- 正在开发的功能项目
- 需要重构或优化的现有代码
- 团队协作的项目

更多信息,请访问[项目文档](https://example.com)。

:::

# ❌ 错误: 格式混乱
:::tip
Hagicode 适合管理各种项目:
- 正在开发的功能项目
- 需要重构或优化的现有代码
- 团队协作的项目:::
```

**验证**:
- 开始标记 `:::type` 独占一行
- 结束标记 `:::` 独占一行
- 多段落之间有空行分隔
- 列表、代码块等结构清晰

#### Scenario: 特殊字符处理

**Given** 一个 aside
**When** 组件内容包含 Markdown 特殊字符
**Then** 应该使用正确的 Markdown 语法

**示例**:
```markdown
# ✅ 正确: 使用反引号
:::tip
使用 \`<code>\` 标签来标记代码。
:::

# ✅ 正确: 使用代码块
:::note

示例代码:

\`\`\`bash
npm install <package-name>
\`\`\`

:::
```

**验证**:
- 代码使用反引号标记
- 代码块使用三反引号
- 避免使用 HTML 标签(除非必要)

---

### Requirement: 确保 Aside 组件的可访问性

文档作者 **MUST** 确保 aside 的使用符合可访问性标准,**SHALL** 遵循 WCAG 2.1 AA 标准,**MUST NOT** 使用影响可访问性的格式。

#### Scenario: 语义化使用

**Given** 一个 aside
**When** 组件用于特定语义的提示
**Then** 应该使用对应的 type,让组件生成正确的语义

**说明**:
Starlight 的 aside 会自动根据 type 生成语义化的角色标签:

```html
<!-- type="tip" -->
<div role="note" class="starlight-aside starlight-aside--tip">
  <!-- 内容 -->
</div>
```

**验证**:
- 不需要手动添加 ARIA 标签
- type 属性值准确反映内容语义
- 屏幕阅读器可以正确识别提示类型

#### Scenario: 颜色对比度

**Given** 一个 aside
**When** 组件在浅色或深色主题下显示
**Then** 应该确保文本与背景的对比度符合 WCAG AA 标准(≥ 4.5:1)

**说明**:
Starlight 的 aside 默认样式已符合 WCAG 标准,作者应该:

- 避免在组件内使用低对比度的自定义颜色
- 测试暗色模式下的显示效果
- 确保所有文本清晰可读

**验证**:
- 组件在不同主题下都可读
- 使用浏览器开发者工具检查对比度
- 不覆盖默认的样式颜色

#### Scenario: 键盘可访问性

**Given** 一个 aside
**When** 组件包含交互元素(链接、按钮)
**Then** 应该确保这些元素可以通过键盘访问

**示例**:
```markdown
:::note

更多信息,请访问[项目文档](https://example.com)。

\`\`\`bash
npm install
\`\`\`

:::
```

**验证**:
- 组件内的链接可以通过 Tab 键导航
- 代码块可以复制(如果提供了复制按钮)
- 不包含需要鼠标才能访问的元素

---

### Requirement: 在团队中统一 Aside 使用规范

文档团队 **SHALL** 建立和维护统一的 aside 使用规范,**MUST** 确保所有文档作者遵循相同的最佳实践,**SHOULD** 定期审查和更新使用指南。

#### Scenario: 建立使用指南

**Given** 一个文档团队
**When** 团队开始使用 Starlight aside
**Then** 应该创建详细的使用指南和示例

**使用指南应包含**:

1. **语法说明**
   ```markdown
   :::type
   内容
   :::

   :::type[自定义标题]
   内容
   :::

   :::type{icon="图标名"}
   内容
   :::
   ```

2. **类型选择指南**
   - Tip: 提示、建议、最佳实践
   - Note: 补充说明、参考信息
   - Caution: 注意事项、警告
   - Danger: 危险警告、重要警告

3. **示例代码库**
   - 提供常见场景的完整示例
   - 包含复杂内容的格式示例

4. **VS Code 代码片段**
   - 为每种类型创建快捷片段
   - 提高编写效率

#### Scenario: PR 审查检查清单

**Given** 一个文档 PR
**When** PR 包含对 MDX 文件的修改
**Then** 审查者应该检查 aside 的使用是否规范

**检查清单**:
- [ ] 类型名称正确(tip/note/caution/danger)
- [ ] 开始和结束标记匹配
- [ ] 标记正确闭合
- [ ] 内容格式规范
- [ ] 特殊字符正确处理
- [ ] 内容简洁,适合放在提示框中
- [ ] 类型选择符合语义
- [ ] 符合可访问性标准

#### Scenario: 持续改进

**Given** 使用 aside 的实践经验
**When** 团队发现新的最佳实践或问题
**Then** 应该及时更新使用指南和规范

**改进机制**:
- 定期审查使用指南的准确性
- 收集文档作者的反馈
- 分享优秀示例和常见错误
- 根据需要更新 VS Code 代码片段

---

## 技术参考

### 语法格式

**基础语法**:
```markdown
:::type
内容
:::
```

**自定义标题**:
```markdown
:::type[标题]
内容
:::
```

**自定义图标**:
```markdown
:::type{icon="图标名"}
内容
:::
```

**组合使用**:
```markdown
:::type[标题]{icon="图标名"}
内容
:::
```

### 支持的类型

| 类型 | 英文 | 颜色 | 用途 |
|------|------|------|------|
| 提示 | tip | 蓝色 | 有用的建议、最佳实践 |
| 注释 | note | 灰色 | 补充说明、参考信息 |
| 警告 | caution | 黄色 | 注意事项、警告 |
| 危险 | danger | 红色 | 危险警告、重要警告 |

### HTML 输出

Starlight 会将 aside 语法转换为以下 HTML:

```html
<div class="starlight-aside starlight-aside--tip">
  <p class="starlight-aside__title">
    <span class="icon">...</span>
    Tip
  </p>
  <div class="starlight-aside__content">
    <p>内容</p>
  </div>
</div>
```

### 样式特性

- 主题集成: 自动适配浅色/深色模式
- 响应式: 支持移动端、平板、桌面
- 可访问性: 符合 WCAG AA 标准
- 零 JavaScript: 完全静态优化

---

## 参考资源

- [Starlight - Asides 官方文档](https://starlight.docs.astro.build/guides/components-and-props/#asides)
- [Starlight - 内置图标](https://starlight.docs.astro.build/en/reference/icons/)
- [WCAG 2.1 - Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [ARIA - Landmark Roles](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

---

## 变更历史

### 2026-01-30: 修复和更新

- **修复**: 阐明 Starlight 原生支持 `:::tip` 语法,无需迁移到 JSX 组件
- **更新**: 移除关于 JSX `<Aside>` 组件的内容
- **添加**: 自定义标题和图标的使用场景
- **更新**: 类型选择指南和最佳实践
- **修正**: 技术参考部分,使用 Starlight 特定的语法
- 与修复提案相关: `openspec/changes/docusaurus-tip-to-astro-aside-migration/`

### 2026-01-30: 初始版本(已废弃)

- 原计划迁移到 Astro JSX `<Aside>` 组件
- 发现 Starlight 原生支持兼容语法,已修正
