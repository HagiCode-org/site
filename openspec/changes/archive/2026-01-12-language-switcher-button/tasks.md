# Implementation Tasks

**Proposal:** 添加语言切换按钮
**Change ID:** `language-switcher-button`

---

## Task Overview

本任务列表按照推荐方案（Docusaurus 内置 localeDropdown）编写。如选择自定义方案，请参考 proposal.md 中的方案 B。

---

## Phase 1: Configuration

### 1.1 Configure localeDropdown in navbar

**File:** `docusaurus.config.ts`

**Description:** 在导航栏配置中添加 localeDropdown 组件

**Changes:**
```typescript
// 在 themeConfig.navbar.items 数组中添加
{
  type: 'localeDropdown',
  position: 'right',
},
```

**位置:** 将此配置项放置在 GitHub 链接之前，使其显示在主题切换按钮的左侧

**Validation:**
- [x] 配置语法正确，TypeScript 编译通过
- [x] localeDropdown 显示在导航栏右上角
- [x] 位置在 GitHub 链接和主题切换按钮之间

**Estimated effort:** 5 minutes

---

### 1.2 Update navbar translations (if needed)

**File:** `i18n/zh-CN/docusaurus-theme-classic/navbar.json`

**Description:** 确保语言切换器的翻译标签正确配置

**Changes:**
```json
{
  "theme.SearchBar.label": {
    "message": "搜索",
    "description": "The ARIA label and placeholder for search button"
  },
  "theme.navbar.languageDropdown.label": {
    "message": "语言",
    "description": "The label for the language dropdown"
  }
}
```

**Validation:**
- [x] 中文环境下语言切换器显示正确的标签
- [x] 英文环境下显示 "Languages" 或类似标签

**Estimated effort:** 5 minutes

---

## Phase 2: Verification

### 2.1 Check translation coverage

**Description:** 审核现有翻译文件，确保主要页面和导航元素都有对应的中文翻译

**Files to check:**
- `i18n/zh-CN/docusaurus-theme-classic/navbar.json`
- `i18n/zh-CN/docusaurus-theme-classic/footer.json`
- `i18n/zh-CN/docusaurus-plugin-content-docs/current.json`

**Validation:**
- [x] 所有导航栏项目都有中文翻译
- [x] 页脚链接都有中文翻译
- [x] 主要文档页面都有对应的 `.md` 文件在 `i18n/zh-CN/docusaurus-plugin-content-docs/current/` 目录下

**Estimated effort:** 10 minutes

---

### 2.2 Test language switching on main pages

**Description:** 在关键页面上测试语言切换功能

**Test cases:**
| 页面 | 当前语言 | 切换后 | 预期结果 |
|------|----------|--------|----------|
| 首页 (/) | en | zh-CN | 重定向到 /zh-CN/ |
| 首页 (/zh-CN/) | zh-CN | en | 重定向到 / |
| 文档页 (/docs/...) | en | zh-CN | 重定向到 /zh-CN/docs/... |
| 博客页 (/blog) | en | zh-CN | 重定向到 /zh-CN/blog |

**Validation:**
- [x] 点击语言选项后立即跳转
- [x] 页面路径保持一致（仅语言前缀变化）
- [x] 如果目标语言翻译不存在，降级到默认语言

**Estimated effort:** 10 minutes

---

### 2.3 Verify mobile responsiveness

**Description:** 测试移动设备上的语言切换器行为

**Test environments:**
- 移动浏览器视口（宽度 < 996px）
- 平板浏览器视口（996px <= 宽度 < 1200px）
- 桌面浏览器视口（宽度 >= 1200px）

**Validation:**
- [x] 移动端汉堡菜单中语言切换器可访问
- [x] 下拉菜单在触摸设备上正常工作
- [x] 布局不发生溢出或重叠

**Estimated effort:** 10 minutes

---

## Phase 3: Polish

### 3.1 Accessibility check

**Description:** 验证语言切换器的可访问性

**Checks:**
- [x] 键盘导航：Tab 键可以聚焦到语言切换器
- [x] 屏幕阅读器：ARIA 标签正确宣告
- [x] 对比度：文本与背景颜色对比符合 WCAG AA 标准

**Tools:**
- 浏览器开发者工具的 Lighthouse Accessibility Audit
- 手动键盘导航测试

**Estimated effort:** 5 minutes

---

### 3.2 Cross-browser testing

**Description:** 在不同浏览器中验证功能一致性

**Browsers to test:**
- [x] Chrome/Edge (Chromium)
- [x] Firefox
- [x] Safari

**Validation:**
- [x] 所有浏览器中语言切换正常工作
- [x] UI 渲染一致

**Estimated effort:** 5 minutes

---

## Phase 4: Documentation

### 4.1 Update project documentation

**Description:** 如项目有贡献者文档，记录 i18n 工作流程

**Optional tasks:**
- [ ] 记录如何为新页面添加翻译
- [ ] 说明翻译文件的命名和组织规范
- [ ] 更新开发环境设置说明（如需要）

**Estimated effort:** Optional

---

## Rollback Plan

如果实现过程中遇到问题，可以快速回滚：

1. **配置回滚:** 从 `docusaurus.config.ts` 中删除 `localeDropdown` 配置项
2. **翻译回滚:** 删除新增的翻译键值（如果有）

回滚后站点恢复到当前状态（无语言切换器）

---

## Summary

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| 1. Configuration | 2 | 10 min |
| 2. Verification | 3 | 30 min |
| 3. Polish | 2 | 10 min |
| 4. Documentation | 1 | Optional |
| **Total** | **8** | **~50 min** |
