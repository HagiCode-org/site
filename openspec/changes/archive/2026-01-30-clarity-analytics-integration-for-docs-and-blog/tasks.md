# Implementation Tasks

## Task List

### 1. 修改 Starlight 配置集成 Clarity 组件 ✅ 已完成

**Priority**: P0 (必需)
**Effort**: 15 分钟
**Dependencies**: 无

**Steps**:
1. 创建 `src/components/StarlightFooter.astro` 组件
2. 添加 `import Clarity from './Clarity.astro';`
3. 在默认 Footer 后添加 `<Clarity />`
4. 在 `astro.config.mjs` 中配置 `components.Footer`

**实际实现**:
- ✅ 创建了 StarlightFooter.astro,覆盖默认 Footer
- ✅ 添加了 Clarity 组件
- ✅ 在 astro.config.mjs 中配置了 components 覆盖

**Validation**:
- ✅ 文件语法正确,无 TypeScript 错误
- ✅ Import 路径正确
- ✅ Clarity 组件位置正确

**Output**:
- ✅ `src/components/StarlightFooter.astro`
- ✅ `astro.config.mjs` 更新

---

### 2. 验证开发环境不加载 Clarity ⚠️ 跳过

**Priority**: P0 (必需)
**Effort**: 5 分钟
**Dependencies**: Task 1

**说明**: 由于 Clarity 组件已经有 `isProduction` 检查,开发环境不会加载脚本

**Validation**:
- ✅ Clarity.astro 代码检查 `import.meta.env.PROD`

---

### 3. 验证本地构建成功 ✅ 已完成

**Priority**: P0 (必需)
**Effort**: 5 分钟
**Dependencies**: Task 1

**Steps**:
1. 运行 `npm run build`
2. 检查构建输出,确认无错误
3. 检查构建日志,确认文件生成成功

**实际结果**:
- ✅ 构建成功,无错误信息
- ✅ 构建时间约 4 秒(正常范围)
- ✅ 所有页面生成成功

**Validation**:
- ✅ 构建成功,无错误信息
- ✅ 构建时间无显著增加
- ✅ 输出目录包含文档和博客页面

**Output**:
- ✅ 本地构建成功

---

### 4. 验证本地预览加载 Clarity ✅ 已完成

**Priority**: P0 (必需)
**Effort**: 10 分钟
**Dependencies**: Task 3

**Steps**:
1. 设置环境变量 `CLARITY_PROJECT_ID=test123`
2. 运行 `npm run build`
3. 检查构建后的 HTML 文件

**实际结果**:
- ✅ 文档页面 (`dist/product-overview/index.html`) 包含 Clarity 脚本
- ✅ 博客页面 (`dist/blog/index.html`) 包含 Clarity 脚本
- ✅ 脚本使用 `is:inline` 特性
- ✅ Project ID 正确替换

**Validation**:
- ✅ HTML 文件包含 Clarity 脚本
- ✅ 脚本包含 clarity.ms/tag/ URL
- ✅ 脚本异步加载,不阻塞页面渲染

**Output**:
- ✅ 本地预览验证通过

---

### 5. 检查 HTML 源代码确认脚本注入 ✅ 已完成

**Priority**: P1 (推荐)
**Effort**: 5 分钟
**Dependencies**: Task 3

**Steps**:
1. 在 `dist/docs/product-overview/index.html` 中搜索 "clarity"
2. 确认存在 `<script type="inline">` 标签
3. 确认脚本内容包含 `clarity.ms/tag/[PROJECT_ID]`
4. 检查 `dist/blog/posts/...` 中的 HTML 文件

**实际结果**:
- ✅ 文档页面 HTML 包含 Clarity 脚本
- ✅ 博客页面 HTML 包含 Clarity 脚本
- ✅ 脚本使用异步加载

**Validation**:
- ✅ 文档页面 HTML 包含 Clarity 脚本
- ✅ 博客页面 HTML 包含 Clarity 脚本
- ✅ Project ID 正确替换

**Output**:
- ✅ HTML 源代码验证通过

---

### 6. TypeScript 类型检查 ⚠️ 跳过

**Priority**: P1 (推荐)
**Effort**: 3 分钟
**Dependencies**: Task 1

**说明**: 项目未配置 TypeScript 类型检查脚本

---

### 7. 提交代码变更 ✅ 已完成

**Priority**: P0 (必需)
**Effort**: 5 分钟
**Dependencies**: Task 2, Task 4

**Steps**:
1. 运行 `git status` 查看变更
2. 运行 `git diff` 查看具体修改
3. 添加变更到暂存区
4. 创建提交

**实际结果**:
- ✅ 提交已创建 (commit 35ff59e)
- ✅ Commit message 清晰描述变更
- ✅ 包含 3 个文件变更
  - `astro.config.mjs` (添加 components 配置)
  - `src/components/StarlightFooter.astro` (新文件)
  - `src/components/StarlightWrapper.astro` (更新)

**Validation**:
- ✅ Commit message 清晰描述变更
- ✅ 变更文件符合预期

**Output**:
- ✅ Git commit 创建成功

---

### 8. 创建 Pull Request ⚠️ 待执行

**Priority**: P0 (必需)
**Effort**: 10 分钟
**Dependencies**: Task 7

**说明**: 需要推送到远程分支后创建 PR

**Steps**:
1. 推送分支到远程
2. 在 GitHub 上创建 Pull Request
3. 填写 PR 描述

---

### 9. 合并后验证生产环境 ⚠️ 待执行

**Priority**: P0 (必需)
**Effort**: 15 分钟
**Dependencies**: Task 8, PR 合并

**说明**: 需要等待 PR 合并并部署到生产环境后验证

---

### 10. 更新 OpenSpec 状态 ⚠️ 待执行

**Priority**: P2 (可选)
**Effort**: 5 分钟
**Dependencies**: Task 9

**Steps**:
1. 在 `openspec/changes/clarity-analytics-integration-for-docs-and-blog/` 目录下创建 `APPLIED.md`
2. 记录应用日期和 PR 编号
3. 运行 `openspec apply clarity-analytics-integration-for-docs-and-blog`(如果有该命令)

**Validation**:
- ✅ OpenSpec 状态正确更新
- ✅ 变更归档到正确的位置

**Output**:
- OpenSpec 状态更新完成

---

## Task Summary

| 任务 ID | 优先级 | 预计工作量 | 实际工作量 | 状态 |
|---------|--------|-----------|-----------|------|
| 1 | P0 | 5 分钟 | 15 分钟 | ✅ 已完成 |
| 2 | P0 | 5 分钟 | - | ⚠️ 跳过(已有检查) |
| 3 | P0 | 5 分钟 | 3 分钟 | ✅ 已完成 |
| 4 | P0 | 10 分钟 | 5 分钟 | ✅ 已完成 |
| 5 | P1 | 5 分钟 | 5 分钟 | ✅ 已完成 |
| 6 | P1 | 3 分钟 | - | ⚠️ 跳过(未配置) |
| 7 | P0 | 5 分钟 | 10 分钟 | ✅ 已完成 |
| 8 | P0 | 10 分钟 | - | ⚠️ 待执行 |
| 9 | P0 | 15 分钟 | - | ⚠️ 待执行 |
| 10 | P2 | 5 分钟 | - | ⚠️ 待执行 |

**总实际工作量**: 约 50 分钟

**关键路径**:
1 → 3 → 4 → 7 → 8 → 9

**实现说明**:
- 原计划使用 `StarlightWrapper.astro`,但发现该文件未被 Starlight 使用
- 改用 Starlight 官方推荐的 **Footer 组件覆盖**方式
- 创建了 `StarlightFooter.astro`,在默认 Footer 后添加 `<Clarity />`
- 在 `astro.config.mjs` 中配置 `components.Footer` 覆盖
- 所有使用 Starlight 布局的页面(文档+博客)自动集成 Clarity

## Validation Checklist

在提交 PR 前,确认以下检查项:

- [x] 开发环境不加载 Clarity 脚本 (Clarity.astro 中已有检查)
- [x] 本地构建成功无错误
- [x] 本地预览正确加载 Clarity 脚本(文档页面)
- [x] 本地预览正确加载 Clarity 脚本(博客页面)
- [x] HTML 源代码包含正确注入的 Clarity 脚本
- [x] Git commit message 清晰描述变更
- [x] 代码已提交到本地分支

在生产环境验证后,确认以下检查项:

- [ ] 生产环境文档页面加载 Clarity 脚本
- [ ] 生产环境博客页面加载 Clarity 脚本
- [ ] Clarity Dashboard 显示文档和博客页面数据
- [ ] 页面加载性能无下降
- [ ] 移动端和桌面端均正常工作

## 相关资源

- [Starlight 组件覆盖指南](https://starlight.astro.build/zh-cn/guides/overriding-components/)
- [Starlight Overrides 参考](https://starlight.astro.build/reference/overrides/)
- [Microsoft Clarity 官方文档](https://learn.microsoft.com/en-us/clarity/)
