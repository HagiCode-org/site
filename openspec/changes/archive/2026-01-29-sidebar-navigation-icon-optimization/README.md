# 侧栏导航图标优化提案

**状态**: 📋 待审查
**创建日期**: 2026-01-29
**提案 ID**: `sidebar-navigation-icon-optimization`

---

## 快速概览

本提案旨在优化 Hagicode 文档站点的侧栏导航组件,解决图标尺寸异常、视觉比例失调和加载延迟问题,提升整体用户体验和视觉一致性。

### 核心问题

1. **图标尺寸异常**: 切换图标 12px,文件夹图标 14px,文件图标 13px - 尺寸过小且不统一
2. **视觉比例失调**: 图标与文本间距过小(0.375rem),缺乏呼吸感
3. **层级表达不明确**: 不同层级使用相同的视觉样式
4. **加载性能问题**: 存在轻微的布局偏移

### 建议方案

- **统一图标尺寸**: 所有图标规范化为 16px-18px
- **优化间距**: 图标与文本间距增加到 0.5rem,节点垂直间距增加到 0.25rem
- **改进视觉层次**: 文件夹图标略大(18px)以突出导航结构
- **性能优化**: 减少布局偏移,实现更流畅的加载效果

---

## 提案文件结构

```
openspec/changes/sidebar-navigation-icon-optimization/
├── proposal.md                    # 主提案文档
├── tasks.md                       # 实施任务清单
├── specs/                         # 规范增量
│   └── sidebar-navigation-visual-design/
│       └── spec.md               # 视觉设计规范增量
└── README.md                      # 本文件
```

### 文件说明

#### `proposal.md`

包含完整的提案说明,包括:
- **背景**: 项目现状和发现的问题
- **目标**: 主要目标和次要目标
- **建议方案**: 详细的优化策略和实施要点
- **影响范围**: 正面影响、潜在风险和缓解措施
- **替代方案**: 最小化修改 vs 全面重新设计
- **验收标准**: 功能、视觉、性能、兼容性和代码质量验收
- **时间估算**: 约 2-3 天
- **相关资源**: 相关文件、参考资料和提案

#### `tasks.md`

详细的实施任务清单,包括:
- **阶段 1**: 准备和验证(0.5 天)
- **阶段 2**: 图标尺寸优化(1 天)
- **阶段 3**: 间距和视觉层次优化(0.5 天)
- **阶段 4**: 加载性能和响应式优化(0.5 天)
- **阶段 5**: 测试和验证(0.5 天)
- **阶段 6**: 文档和收尾(0.5 天)

每个任务包含:
- 明确的目标和步骤
- 详细的验收标准
- 依赖关系和后续任务

#### `specs/sidebar-navigation-visual-design/spec.md`

规范增量文档,定义:
- **MODIFIED Requirements**: 对现有规范的修改和增强
  - 侧栏导航图标尺寸标准
  - 侧栏导航间距标准
  - 侧栏导航图标透明度标准
  - 侧栏导航响应式设计
  - 侧栏导航加载性能

每个需求包含:
- 明确的要求(MUST/SHOULD)
- 详细的场景(Scenario)
- 验收标准(Quality Gates)

---

## 快速开始

### 审查提案

1. 阅读 `proposal.md` 了解提案背景和方案
2. 查看 `tasks.md` 了解实施计划
3. 查看 `specs/sidebar-navigation-visual-design/spec.md` 了解规范变更

### 验证提案

```bash
# 验证提案结构和格式
npx openspec validate sidebar-navigation-icon-optimization --strict

# 查看提案摘要
npx openspec show sidebar-navigation-icon-optimization

# 查看规范增量
npx openspec show sidebar-navigation-icon-optimization --deltas-only
```

### 批准提案

如果提案符合预期,请:
1. 在代码审查中批准提案
2. 开始按照 `tasks.md` 中的任务清单实施
3. 完成后更新任务清单中的复选框

### 归档提案

实施完成后:
```bash
# 归档提案(可选:如果需要更新规范,省略 --skip-specs)
npx openspec archive sidebar-navigation-icon-optimization --skip-specs --yes
```

---

## 技术亮点

### CSS 变量驱动

使用 CSS 自定义属性集中管理样式,便于后续调整和维护:

```css
:root {
  --sidebar-icon-size-base: 16px;
  --sidebar-icon-size-folder: 18px;
  --sidebar-icon-size-toggle: 16px;
  --sidebar-icon-text-gap: 0.5rem;
  --sidebar-node-padding-vertical: 0.25rem;
}
```

### 渐进式优化

分阶段实施改进,降低风险,便于验证:
- 阶段 1: 图标尺寸(核心改进)
- 阶段 2: 间距和层次
- 阶段 3: 性能和响应式
- 阶段 4: 全面测试

### 性能优先

优化加载性能,减少布局偏移:
- 使用 `contain: layout style` 限制布局重计算
- 使用 `will-change` 提示浏览器优化
- 目标 CLS < 0.1

### 可访问性

符合 WCAG 2.1 标准:
- 键盘导航完整支持
- 屏幕阅读器兼容
- 颜色对比度符合 AA 标准
- 触摸目标尺寸至少 44×44px

---

## 验收标准概览

### 功能验收
- ✅ 侧栏导航在所有文档页面正常显示
- ✅ 展开/折叠功能正常工作
- ✅ 当前页面高亮显示正确
- ✅ 响应式布局在各种屏幕尺寸下正常工作
- ✅ 暗色主题切换正常

### 视觉验收
- ✅ 所有图标尺寸统一且合适(16px-18px)
- ✅ 图标与文本间距合理,视觉平衡良好
- ✅ 不同层级有清晰的视觉区分
- ✅ 悬停和激活状态的视觉反馈明显

### 性能验收
- ✅ CLS < 0.1
- ✅ 滚动时帧率保持 60fps
- ✅ `npm run build` 成功,无警告

### 兼容性验收
- ✅ 主流浏览器(Chrome, Firefox, Safari, Edge)正常显示
- ✅ 移动设备(iOS, Android)触摸交互正常
- ✅ 键盘导航功能完整
- ✅ 屏幕阅读器兼容性良好

### 代码质量验收
- ✅ `npm run typecheck` 通过
- ✅ 代码符合项目规范
- ✅ 无控制台错误或警告

---

## 预期效果

### 用户体验提升
- 更清晰的视觉层次,提高导航效率
- 更舒适的视觉体验,减少视觉疲劳
- 更流畅的加载效果,减少视觉干扰

### 品牌一致性
- 与 Hagicode 项目的整体设计风格更加统一
- 提升文档站点的专业性和可信度

### 可维护性提升
- 使用 CSS 变量集中管理样式,便于后续调整
- 更清晰的代码结构和注释
- 建立设计标准,便于未来维护

---

## 相关资源

### 相关文件
- `src/components/Sidebar.astro` - 侧栏组件主要实现
- `src/styles/global.css` - 全局样式定义
- `src/layouts/DocsLayout.astro` - 文档页面布局
- `openspec/specs/astro-site/spec.md` - Astro 站点规范

### 相关提案
- `openspec/changes/archive/2026-01-29-astro-docs-sidebar-navigation/` - 侧栏导航初始实现
- `openspec/changes/archive/2026-01-29-table-of-contents-for-docs-and-blog/` - 目录导航实现

### 参考资料
- [Material Design Icons - Iconography](https://m3.material.io/styles/icons/overview)
- [WCAG 2.1 - Understanding Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [Astro Styling Guide](https://docs.astro.build/en/guides/styling/)

---

## 联系方式

如有任何关于本提案的问题或建议,请在代码审查或项目讨论中提出。

---

**提案验证状态**: ✅ 通过 (`npx openspec validate --strict`)
**最后更新**: 2026-01-29
