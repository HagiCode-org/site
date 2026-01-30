# 修复 Starlight Aside 组件渲染问题提案

## 概述

验证并修复 Hagicode 文档站点中的 Starlight Aside 组件(提示框)渲染问题,确保 `:::tip`、`:::note`、`:::caution`、`:::danger` 语法能够正确显示,提升文档一致性和可读性。

## 背景

### 站点架构

Hagicode 文档站点于 2026 年 1 月从 **Docusaurus 3.x** 迁移到 **Astro 5.x + Starlight**,文档内容使用 **MDX** 格式编写。站点使用以下技术栈:

- **Astro 5.x**: 现代化的静态站点生成器
- **Starlight**: Astro 的官方文档工具包
- **MDX**: Markdown + JSX 的增强格式

### Starlight Aside 支持

**重要发现**: Starlight 原生支持 `:::tip`、`:::note`、`:::caution`、`:::danger` 语法,这与 Docusaurus 的语法**完全兼容**!

根据 [Starlight 官方文档](https://starlight.docs.astro.build/guides/components-and-props/#asides):

> Asides (also known as "admonitions" or "callouts") are useful for displaying secondary information alongside a page's main content.
>
> Starlight provides a custom Markdown syntax for rendering asides. Aside blocks are indicated using a pair of triple colons `:::` to wrap your content, and can be of type `note`, `tip`, `caution` or `danger`.

**语法示例**:
```markdown
:::note
Starlight is a documentation website toolkit built with Astro.
:::

:::tip[Did you know?]
Astro helps you build faster websites with "Islands Architecture".
:::

:::caution
This operation requires caution.
:::

:::danger
Warning: This is a dangerous operation!
:::
```

### 当前问题

通过扫描现有文档,发现 9 个文件使用了 `:::tip`、`:::note`、`:::caution`、`:::danger` 语法:

1. `src/content/docs/quick-start/create-first-project.mdx`
2. `src/content/docs/quick-start/proposal-session.mdx`
3. `src/content/docs/quick-start/conversation-session.mdx`
4. `src/content/docs/installation/docker-compose.mdx`
5. `src/content/docs/installation/package-deployment.mdx`
6. `src/content/docs/related-software-installation/openspec/setup-openspec.mdx`
7. `src/content/docs/related-software-installation/nodejs/installation.mdx`
8. `src/content/docs/related-software-installation/postgresql/install-on-windows.mdx`
9. `src/content/docs/related-software-installation/claude-code/setup-claude-code-with-zai.mdx`

**潜在问题**:

1. **配置问题**: Starlight 插件可能未正确配置
2. **语法问题**: 语法格式可能不符合 Starlight 要求
3. **样式问题**: 样式可能被自定义 CSS 覆盖
4. **渲染问题**: MDX 解析器可能未正确处理 aside 语法

### 调查方向

**方向 1: 验证 Starlight 配置**

检查 `astro.config.mjs` 中的 Starlight 配置:
- Starlight 插件是否正确初始化
- 是否有自定义配置影响 aside 渲染
- Markdown 配置是否正确

**方向 2: 验证语法格式**

检查现有文档中的 aside 语法:
- 语法格式是否符合 Starlight 规范
- 缩进和换行是否正确
- 是否有不兼容的嵌套结构

**方向 3: 验证样式加载**

检查样式是否正确加载:
- Starlight 默认样式是否被覆盖
- 自定义 CSS 是否影响 aside 显示
- 主题变量是否正确

**方向 4: 验证构建输出**

检查构建过程中的问题:
- MDX 解析是否成功
- 是否有构建错误或警告
- 输出的 HTML 是否包含正确的 aside 标签

## 目标

### 主要目标

1. **问题诊断**: 确定 aside 组件无法正确渲染的根本原因
2. **配置修复**: 修复 Starlight 或 Markdown 配置问题
3. **语法修复**: 修复不符合规范的 aside 语法
4. **样式修复**: 确保样式正确加载和显示
5. **验证测试**: 创建测试页面验证所有类型的 aside

### 成功标准

- [ ] 确定 aside 渲染问题的根本原因
- [ ] 所有现有文档中的 aside 正确显示
- [ ] 4 种类型的 aside(tip/note/caution/danger)都能正常工作
- [ ] 样式与 Starlight 主题一致
- [ ] 构建无错误,类型检查通过
- [ ] 创建测试页面验证所有 aside 类型
- [ ] 更新文档编写规范,说明正确用法

## 范围

### 包含内容

✅ **在范围内**:

1. **问题诊断**
   - 检查 Starlight 配置
   - 检查 Markdown 配置
   - 检查现有文档语法
   - 检查样式加载

2. **问题修复**
   - 修复配置问题
   - 修复语法问题
   - 修复样式问题
   - 更新不符合规范的语法

3. **文档范围**
   - `src/content/docs/**/*.mdx` 中的所有 MDX 文档
   - `src/content/blog/**/*.mdx` 中的所有博客文章
   - 共 9 个已知文件使用了 aside 语法

4. **测试验证**
   - 创建测试页面
   - 验证所有 aside 类型
   - 测试暗色模式
   - 测试响应式布局

5. **文档更新**
   - 更新编写规范
   - 创建使用指南
   - 提供示例代码

### 排除内容

❌ **不在范围内**:

1. **语法迁移**
   - 不需要迁移到 JSX `<Aside>` 组件
   - 继续使用 `:::tip` 语法
   - 保持与 Docusaurus 兼容

2. **自定义组件**
   - 不创建自定义 aside 组件
   - 使用 Starlight 原生支持

3. **框架更换**
   - 不更换 Starlight 框架
   - 不修改 Astro 配置(除非必要)

## 技术方案

### 诊断策略

采用分层诊断策略,从配置到内容逐步排查:

#### 第 1 层: 配置检查

**检查项**:

1. **Starlight 插件配置**
   ```javascript
   // astro.config.mjs
   starlight({
     // 检查基本配置
     title: 'Hagicode Docs',
     // 检查自定义 CSS
     customCss: ['./src/styles/starlight-override.css'],
   })
   ```

2. **Markdown 配置**
   ```javascript
   // astro.config.mjs
   markdown: {
     syntaxHighlight: 'shiki',
     rehypePlugins: [...],
     remarkPlugins: [...], // 检查是否需要 remark 插件
   }
   ```

3. **依赖版本**
   - 检查 `@astrojs/starlight` 版本
   - 检查 `astro` 版本
   - 检查其他相关依赖

#### 第 2 层: 语法检查

**检查现有文档的 aside 语法**:

**正确格式**:
```markdown
:::tip
内容
:::

:::tip[自定义标题]
内容
:::

:::tip{icon="heart"}
内容
:::
```

**需要检查的问题**:
- aside 类型是否拼写正确(tip/note/caution/danger)
- 开始和结束标记是否匹配(`:::`)
- 内容缩进是否正确
- 是否有特殊字符干扰
- 是否有嵌套的代码块或组件

#### 第 3 层: 样式检查

**检查样式加载**:

1. **浏览器开发者工具**
   - 检查 aside 元素的 HTML 结构
   - 检查应用的 CSS 类
   - 检查计算后的样式
   - 检查是否有样式被覆盖

2. **Starlight 默认样式**
   - 验证 Starlight 的 CSS 是否加载
   - 检查自定义 CSS 是否影响 aside
   - 验证主题变量是否正确

#### 第 4 层: 构建输出检查

**检查构建过程**:

1. **开发服务器**
   ```bash
   npm run dev
   ```
   - 检查控制台是否有错误
   - 检查页面渲染是否正常
   - 检查 HTML 输出

2. **生产构建**
   ```bash
   npm run build
   ```
   - 检查构建日志
   - 检查是否有警告
   - 验证输出文件

3. **HTML 输出**
   - 检查生成的 HTML 是否包含正确的 aside 标签
   - 验证结构和类名

### 修复方案

根据诊断结果,可能需要以下修复:

#### 方案 1: 配置修复

**如果问题是配置导致的**:

1. **添加 remark 插件**(如果需要)
   ```javascript
   // astro.config.mjs
   import remarkDirective from 'remark-directive';

   markdown: {
     remarkPlugins: [remarkDirective],
     // ...
   }
   ```

2. **更新 Starlight 配置**
   ```javascript
   starlight({
     // 确保 aside 功能未禁用
     components: {
       // 不覆盖默认的 aside 组件
     }
   })
   ```

#### 方案 2: 语法修复

**如果问题是语法格式导致的**:

修复不符合规范的语法:

**常见问题**:
- 类型名称错误(如使用 `:::info` 而不是 `:::tip`)
- 标记不匹配(如 `:::tip` 但结束标记是 `:::` 缺少闭合)
- 缩进错误
- 特殊字符未转义

**修复示例**:
```markdown
// ❌ 错误: 类型名称错误
:::info
内容
:::

// ✅ 正确: 使用标准类型
:::tip
内容
:::

// ❌ 错误: 未闭合
:::tip
内容

// ✅ 正确: 正确闭合
:::tip
内容
:::
```

#### 方案 3: 样式修复

**如果问题是样式导致的**:

1. **检查自定义 CSS**
   ```css
   /* src/styles/starlight-override.css */
   /* 移除可能影响 aside 的样式覆盖 */
   ```

2. **确保 Starlight 样式加载**
   - 不覆盖 Starlight 的 aside 样式
   - 只调整必要的样式变量

3. **使用主题变量**
   ```css
   :root {
     /* 调整主题变量而不是直接覆盖样式 */
   }
   ```

#### 方案 4: 重新安装依赖

**如果问题是依赖损坏导致的**:

```bash
# 清理依赖
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 清理构建缓存
rm -rf .astro dist

# 重新构建
npm run build
```

### 实施架构

```
诊断与修复流程:
1. 配置检查阶段
   ├─ 检查 Starlight 配置
   ├─ 检查 Markdown 配置
   ├─ 检查依赖版本
   └─ 生成诊断报告

2. 语法检查阶段
   ├─ 扫描所有 MDX 文件
   ├─ 验证 aside 语法格式
   └─ 识别问题模式

3. 样式检查阶段
   ├─ 使用浏览器工具检查
   ├─ 检查 CSS 加载顺序
   └─ 验证主题变量

4. 构建检查阶段
   ├─ 运行开发服务器
   ├─ 检查构建输出
   └─ 验证 HTML 结构

5. 修复实施阶段
   ├─ 应用配置修复
   ├─ 修复语法问题
   ├─ 修复样式问题
   └─ 重新测试验证

6. 文档更新阶段
   ├─ 更新编写规范
   ├─ 创建使用指南
   └─ 创建测试页面
```

## 风险与挑战

### 潜在风险

#### 风险 1: 问题根因不明

**概率**: 中
**影响**: 高

**问题描述**:
- aside 无法正确显示的原因可能多种多样
- 配置、语法、样式都可能是问题
- 需要系统性的诊断

**缓解措施**:
- 采用分层诊断策略
- 逐一排查每个可能的原因
- 记录诊断过程和结果
- 如需要,寻求 Starlight 社区支持

#### 风险 2: 修复可能影响其他功能

**概率**: 低
**影响**: 中

**问题描述**:
- 修改配置可能影响其他 Markdown 功能
- 修改样式可能影响整体外观

**缓解措施**:
- 小步骤修改,每次修改后验证
- 在测试分支上进行修改
- 全面测试所有 Markdown 功能
- 保留原始配置备份

#### 风险 3: 兼容性问题

**概率**: 低
**影响**: 低

**问题描述**:
- Starlight 版本可能有 aside 支持的差异
- 与其他插件的兼容性

**缓解措施**:
- 检查 Starlight 版本文档
- 验证与现有插件的兼容性
- 如需要,升级到最新稳定版本

#### 风险 4: 文档更新工作量

**概率**: 中
**影响**: 低

**问题描述**:
- 9 个文件可能需要语法修复
- 文档规范需要更新

**缓解措施**:
- 大部分文件可能无需修改
- 批量处理相似问题
- 创建清晰的修复指南

### 挑战与解决方案

#### 挑战 1: 如何快速定位问题

**挑战**: aside 不显示的原因可能很多,如何快速定位?

**解决方案**:
1. **使用排除法**: 从最可能的原因开始排查
2. **创建最小示例**: 创建包含 aside 的最简单文档测试
3. **对比测试**: 对比正常工作的 Starlight 项目
4. **查看官方示例**: 参考 Starlight 官方示例项目

**测试文件**: `src/content/docs/tests/aside-test.mdx`
```markdown
---
title: Aside 测试
---

:::tip
这是一个提示
:::

:::note
这是一个注释
:::

:::caution
这是一个警告
:::

:::danger
这是一个危险警告
:::
```

#### 挑战 2: 如何验证修复有效

**挑战**: 如何确保修复后 aside 正确显示?

**解决方案**:
1. **浏览器验证**: 在多个浏览器中测试
2. **构建验证**: 确保构建成功
3. **响应式测试**: 测试不同屏幕尺寸
4. **主题测试**: 测试浅色/深色主题
5. **内容测试**: 测试各种复杂内容(列表、代码块等)

#### 挑战 3: 如何避免引入新问题

**挑战**: 修复 aside 问题时不引入其他问题?

**解决方案**:
1. **备份配置**: 修改前备份原始配置
2. **增量修改**: 一次只修改一项
3. **全面测试**: 每次修改后测试所有功能
4. **代码审查**: 让团队成员审查修改

#### 挑战 4: 如何保持文档一致性

**挑战**: 确保所有文档使用一致的 aside 语法?

**解决方案**:
1. **创建规范**: 制定清晰的 aside 使用规范
2. **提供示例**: 提供常用 aside 示例
3. **PR 检查**: 在代码审查时检查 aside 使用
4. **自动化检查**: 添加 lint 规则(如可能)

## 实施计划

### 阶段 1: 问题诊断 (预计 30-60 分钟)

**目标**: 确定 aside 无法正确渲染的根本原因。

1. **创建测试文件**
   - 创建 `src/content/docs/tests/aside-test.mdx`
   - 包含所有 4 种类型的 aside
   - 包含各种复杂场景

2. **配置检查**
   - 检查 `astro.config.mjs` 配置
   - 验证 Starlight 插件配置
   - 检查 Markdown 配置
   - 记录配置详情

3. **依赖检查**
   - 检查 `@astrojs/starlight` 版本
   - 检查 `astro` 版本
   - 对比官方文档要求的版本

4. **语法检查**
   - 检查现有文档的 aside 语法
   - 识别语法模式
   - 记录问题实例

5. **开发服务器测试**
   - 运行 `npm run dev`
   - 访问测试文件
   - 检查控制台错误
   - 使用浏览器工具检查 HTML

**输出**: 诊断报告,包含问题根因和修复建议

### 阶段 2: 问题修复 (预计 30-60 分钟)

**目标**: 根据诊断结果修复问题。

1. **配置修复**(如需要)
   - 修改 Starlight 配置
   - 添加必要的插件
   - 调整 Markdown 设置
   - 备份原始配置

2. **语法修复**(如需要)
   - 修复不符合规范的语法
   - 统一 aside 使用格式
   - 处理特殊字符
   - 验证修复结果

3. **样式修复**(如需要)
   - 移除样式覆盖
   - 调整自定义 CSS
   - 确保主题变量正确

4. **依赖更新**(如需要)
   - 更新 Starlight 版本
   - 更新 Astro 版本
   - 重新安装依赖

**输出**: 修复后的配置和文档

### 阶段 3: 验证测试 (预计 30 分钟)

**目标**: 确保修复有效且无副作用。

1. **开发环境测试**
   - 运行 `npm run dev`
   - 访问所有包含 aside 的文档
   - 验证渲染效果
   - 测试暗色模式
   - 测试响应式布局

2. **构建验证**
   - 运行 `npm run build`
   - 检查构建输出
   - 验证无错误和警告

3. **类型检查**
   - 运行 `npm run typecheck`(如配置)
   - 修复类型错误

4. **功能回归测试**
   - 测试其他 Markdown 功能
   - 测试代码高亮
   - 测试链接跳转
   - 确保无功能退化

**输出**: 测试报告,确认修复成功

### 阶段 4: 文档与规范 (预计 30 分钟)

**目标**: 更新文档规范,防止问题重现。

1. **更新项目文档**
   - 在 `openspec/project.md` 中记录修复
   - 更新编写规范
   - 添加 aside 使用指南

2. **创建使用指南**
   - 创建 aside 语法参考
   - 提供示例代码
   - 说明常见问题

3. **创建测试页面**
   - 创建 `src/content/docs/tests/aside-components-test.mdx`
   - 包含所有类型的示例
   - 包含复杂场景示例

4. **创建 VS Code 片段**(可选)
   - 为每种类型创建代码片段
   - 提高编写效率
   - 确保语法正确

**输出**: 完整的文档和使用指南

## 验证标准

### 功能验证

- [ ] `:::tip` 正确显示为提示框
- [ ] `:::note` 正确显示为注释框
- [ ] `:::caution` 正确显示为警告框
- [ ] `:::danger` 正确显示为危险警告框
- [ ] 自定义标题功能正常: `:::tip[标题]`
- [ ] 自定义图标功能正常: `:::tip{icon="heart"}`
- [ ] 内容完全显示,无截断或错位

### 技术验证

- [ ] 构建成功无错误(`npm run build`)
- [ ] 开发服务器正常运行(`npm run dev`)
- [ ] 无控制台错误或警告
- [ ] HTML 输出包含正确的 aside 标签
- [ ] Starlight 样式正确加载

### 视觉验证

- [ ] Tip 显示为蓝色/信息样式
- [ ] Note 显示为灰色/注释样式
- [ ] Caution 显示为黄色/警告样式
- [ ] Danger 显示为红色/危险样式
- [ ] 样式与 Starlight 主题一致
- [ ] 图标正确显示
- [ ] 边框和背景颜色正确

### 主题验证

- [ ] 浅色模式显示正常
- [ ] 暗色模式显示正常
- [ ] 主题切换正常
- [ ] 主题变量正确应用

### 响应式验证

- [ ] 桌面端显示正常(> 1024px)
- [ ] 平板端显示正常(768px - 1024px)
- [ ] 移动端显示正常(< 768px)
- [ ] 文字大小和间距合适

### 内容验证

- [ ] 纯文本内容正确显示
- [ ] 列表内容正确显示
- [ ] 代码块正确高亮
- [ ] 链接可点击
- [ ] 嵌套结构正确

### 文档验证

- [ ] 项目文档已更新
- [ ] 编写规范已更新
- [ ] 使用指南已创建
- [ ] 测试页面已创建
- [ ] 常见问题已记录

## 后续考虑

### 未来优化

1. **增强功能**
   - 使用自定义标题: `:::tip[标题]`
   - 使用自定义图标: `:::tip{icon="heart"}`
   - 探索 Starlight 的其他 aside 功能

2. **性能优化**
   - 监控 aside 渲染性能
   - 优化大量 aside 的页面
   - 减少不必要的重渲染

3. **辅助功能增强**
   - 验证屏幕阅读器支持
   - 验证键盘导航
   - 验证高对比度模式

4. **文档质量**
   - 收集用户反馈
   - 优化 aside 使用建议
   - 提供更多示例

### 维护建议

1. **定期检查**
   - 新文档是否使用正确语法
   - Starlight 版本更新是否有 breaking changes
   - 样式是否正常

2. **版本升级**
   - 关注 Starlight 版本更新
   - 阅读更新日志
   - 测试新版本的 aside 功能

3. **团队协作**
   - 新成员培训 aside 使用
   - PR 审查时检查 aside 语法
   - 分享最佳实践

4. **问题跟踪**
   - 记录常见问题
   - 维护 FAQ
   - 更新排查指南

## 相关规格

此提案将修改以下规格:

- **openspec/specs/starlight-site/spec.md**: 更新 Starlight aside 使用需求
- **openspec/project.md**: 更新文档编写规范和修复记录

## 参考资料

- [Starlight - Asides 官方文档](https://starlight.docs.astro.build/guides/components-and-props/#asides)
- [Astro - Markdown 配置](https://docs.astro.build/en/guides/markdown-content/)
- [Starlight - 配置参考](https://starlight.docs.astro.build/reference/configuration/)
- [Starlight - GitHub 仓库](https://github.com/withastro/starlight)

## 变更类型

- **类型**: Bug 修复
- **复杂度**: 低-中
- **风险评估**: 低
- **向后兼容**: 是(仅修复配置或语法,不改变功能)
- **用户可见**: 是(提示框能够正确显示)

## 批准状态

- [ ] 问题诊断已完成
- [ ] 修复方案已批准
- [ ] 风险评估已完成
- [ ] 准备开始实施
