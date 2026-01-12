# Proposal: 添加语言切换按钮

**Status:** ExecutionCompleted
**Created:** 2026-01-12
**Author:** AI Assistant
**Change ID:** `language-switcher-button`

---

## Overview

在 PCode 文档站点的导航栏右上角添加语言切换按钮，使用户能够便捷地在英文（en）和简体中文（zh-CN）之间切换。

## Background

当前 PCode 文档站点基于 Docusaurus 3.x 构建，已配置完整的国际化（i18n）支持：

- **配置文件**: `docusaurus.config.ts` 中已定义 `i18n` 配置
  - 默认语言: `en` (English)
  - 支持语言: `['en', 'zh-CN']`
  - 语言标签: English, 简体中文

- **翻译文件**: `i18n/zh-CN/` 目录下已存在完整的中文翻译
  - `docusaurus-theme-classic/navbar.json` - 导航栏翻译
  - `docusaurus-theme-classic/footer.json` - 页脚翻译
  - `docusaurus-plugin-content-docs/current.json` - 文档翻译
  - `docusaurus-plugin-content-blog/` - 博客翻译

- **当前问题**: 尽管后端 i18n 配置完整，但缺少前端 UI 控件供用户切换语言

## Problem Statement

1. **缺少语言切换入口**：用户需要通过修改 URL（如添加 `/zh-CN/` 路径前缀）或更改浏览器设置来切换语言，体验不友好

2. **导航栏布局不完整**：导航栏右上角当前仅包含 GitHub 链接和主题切换按钮，未充分利用可用空间

3. **功能可发现性不足**：双语支持已存在但用户难以感知和使用，降低了国际化功能的实际价值

## Proposed Solution

### 功能需求

在导航栏右上角添加语言切换按钮：

- **位置**: 放置在主题切换按钮的左侧
- **功能**: 点击后在当前页面路径保持不变的情况下切换语言
- **UI 集成**: 与 Docusaurus 经典主题的导航栏风格保持一致

### 技术实现方案

#### 方案 A: 使用 Docusaurus 内置语言下拉菜单（推荐）

Docusaurus 3.x 经典主题已内置语言切换功能，但需要通过 `themeConfig` 启用：

```typescript
// docusaurus.config.ts
themeConfig: {
  navbar: {
    items: [
      // ... existing items
      {
        type: 'localeDropdown',
        position: 'right',
      },
      {
        href: 'https://github.com/pcode/pcode-docs',
        label: 'GitHub',
        position: 'right',
      },
    ],
  },
}
```

**优点**:
- 官方支持，开箱即用
- 自动处理语言切换和 URL 重定向
- 与主题风格完美集成
- 支持未来扩展更多语言

**缺点**:
- 下拉菜单样式可能与现有设计略有不同

#### 方案 B: 自定义语言切换按钮

创建自定义 React 组件实现简化的语言切换按钮：

```typescript
// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useLocations } from '@docusaurus/router';
import { useLocale } from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';

export default function LanguageSwitcher(): JSX.Element {
  const { i18n } = useLocale();
  const { currentLocale } = i18n;
  const toggleLocale = () => {
    // Implementation
  };

  return <button onClick={toggleLocale}>...</button>;
}
```

通过 swizzling Navbar 组件集成自定义按钮。

**优点**:
- 完全控制 UI 样式
- 可以实现更紧凑的按钮设计

**缺点**:
- 需要手动维护自定义组件
- 升级 Docusaurus 时可能需要调整代码
- 实现复杂度更高

### 推荐方案

**方案 A（内置 localeDropdown）** 是首选方案，原因：
1. 最小化代码改动和维护成本
2. 获得官方持续支持和 bug 修复
3. 自动处理边缘情况（如页面不存在时的降级）
4. 更好的可访问性和移动端支持

如果团队有特定 UI 需求，可在后续迭代中考虑方案 B。

---

## Scope

### Included

- [ ] 在 `docusaurus.config.ts` 中配置 `localeDropdown` navbar item
- [ ] 更新中文翻译文件以添加语言切换器相关的翻译（如需要）
- [ ] 测试语言切换功能在所有主要页面的表现
- [ ] 验证移动端响应式布局兼容性

### Excluded

- 自定义语言切换器 UI 组件（如方案 B 被选中则包含）
- 非导航栏位置的语言切换入口（如页脚）
- 新语言的支持（仅限于现有 en 和 zh-CN）

## Impact Analysis

### User Experience

| 影响 | 描述 |
|------|------|
| **正面** | 用户可一键切换文档语言，降低使用门槛 |
| **正面** | 语言切换后保持在同一页面内容，提升连续性 |
| **中性** | 下拉菜单占用导航栏空间，但在可接受范围内 |

### Technical Impact

| 组件 | 影响 |
|------|------|
| **docusaurus.config.ts** | 添加 navbar item 配置 |
| **i18n/** | 可能需要添加少量翻译键值 |
| **构建产物** | 轻微增加 JavaScript bundle 大小 |

### Performance

- **首次加载**: 无显著影响（组件懒加载）
- **切换操作**: 即时响应，无需额外请求

## Risks & Mitigations

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 某些页面缺少对应语言的翻译 | 低 | 中 | Docusaurus 自动降级到默认语言 |
| 移动端导航栏空间不足 | 低 | 低 | Docusaurus 内置响应式处理 |
| 翻译文件不完整导致显示问题 | 中 | 中 | 审核现有翻译文件完整性 |

## Success Criteria

1. **功能完整性**: 点击语言切换器后，当前页面正确重定向到对应语言的相同路径
2. **UI 一致性**: 语言切换器样式与现有导航栏风格一致
3. **响应式支持**: 在桌面和移动设备上均正常工作
4. **可访问性**: 符合 WCAG 2.1 AA 标准（键盘导航、屏幕阅读器支持）
5. **零回归**: 现有导航栏功能不受影响

## Alternatives Considered

| 方案 | 优点 | 缺点 | 未选择原因 |
|------|------|------|------------|
| URL 手动修改 | 无需代码改动 | 用户体验差 | 不符合产品需求 |
| 浏览器语言检测 | 自动化 | 用户无法手动切换 | 缺乏控制权 |
| 页脚链接 | 实现简单 | 可发现性低 | 不是最佳 UX 实践 |

## Open Questions

1. **UI 偏好**: 团队是否接受下拉菜单样式，还是期望更紧凑的切换按钮？
2. **位置确认**: 语言切换器是否必须放置在主题切换按钮的左侧？

## Related Changes

- 无关联的现有提案

## Timeline

- **配置修改**: 预计 15 分钟
- **测试验证**: 预计 30 分钟
- **总计**: 约 45 分钟

## References

- [Docusaurus i18n Documentation](https://docusaurus.io/docs/i18n/introduction)
- [Docusaurus Navbar Configuration](https://docusaurus.io/docs/api/themes/configuration#navbar-item)
- [LocaleDropdown Component Source](https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-theme-classic/src/theme)
