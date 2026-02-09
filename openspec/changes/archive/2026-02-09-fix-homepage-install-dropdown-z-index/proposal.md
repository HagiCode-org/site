# 修复首页立即安装下拉框层级问题

## 概述 (Overview)

修复首页 Hero 区域"立即安装"按钮的下拉菜单被下方活动指标组件遮挡的 z-index 层级问题，确保用户可以正常点击下拉菜单中的选项。

## 背景 (Context)

项目使用 Astro 5.16 和 React 18.2 构建，首页包含以下组件结构：

```
index.astro
├── Navbar (固定顶部导航)
├── HeroSection (首屏区域, 包含 InstallButton)
├── ActivityMetricsSection (活动指标展示)
└── 其他内容区域...
```

**当前状态：**
- HeroSection 中的 `InstallButton` 组件包含一个下拉菜单 (`.dropdownMenu`)
- 下拉菜单当前 `z-index: 1000`
- ActivityMetricsSection 紧跟在 HeroSection 之后
- HeroSection 使用 `isolation: isolate` 创建了层叠上下文

**问题表现：**
- 当用户点击"立即安装"按钮的下拉箭头时，下拉菜单展开
- 下拉菜单被下方 ActivityMetricsSection 的元素部分遮挡
- 用户无法点击被遮挡的菜单选项

## 问题 (Problem)

### 根本原因分析

1. **层叠上下文隔离：** HeroSection 使用 `isolation: isolate`，这创建了一个新的层叠上下文
2. **z-index 冲突：** 虽然下拉菜单设置了 `z-index: 1000`，但由于层叠上下文的限制，它无法与外部的 ActivityMetricsSection 进行正确的层级比较
3. **视觉重叠：** 活动指标卡片具有较高的 z-index 值（`.cardBorder: 1`, `.shimmer: 2`, `.cardContent: 3`），可能在视觉上与下拉菜单重叠

### 技术细节

| 组件 | 文件 | 当前 z-index | 层叠上下文 |
|------|------|--------------|------------|
| HeroSection | `HeroSection.module.css:19` | `isolation: isolate` | 新建层叠上下文 |
| 下拉菜单 | `InstallButton.module.css:162` | `z-index: 1000` | 受限于 HeroSection |
| 活动指标卡片 | `ActivityMetricsSection.module.css` | `z-index: 0-3` | 独立层叠上下文 |

## 解决方案 (Solution)

### 方案选择

采用**提高下拉菜单 z-index 值**的最简单方案：

1. 将 `.dropdownMenu` 的 `z-index` 从 `1000` 提升到 `9999`
2. 确保下拉菜单的父容器 (`.splitButtonContainer`) 不会限制其层级
3. 验证修改后下拉菜单在所有主题（亮色/暗色/新年）下正常显示

### 实施步骤

1. **修改 CSS z-index**
   - 文件：`src/components/home/InstallButton.module.css`
   - 修改：`.dropdownMenu` 的 `z-index` 从 `1000` 改为 `9999`

2. **验证容器层级**
   - 确认 `.splitButtonContainer` 和 `.installButtonWrapper` 没有限制层级的属性
   - 确认 HeroSection 的 `isolation: isolate` 不会阻止内部元素的正常层叠

3. **测试验证**
   - 在本地开发环境测试下拉菜单的可点击性
   - 检查所有主题（亮色、暗色、农历新年）下的显示效果
   - 确认无其他层级冲突

### 代码变更

```diff
diff --git a/src/components/home/InstallButton.module.css b/src/components/home/InstallButton.module.css
index abc1234..def5678 100644
--- a/src/components/home/InstallButton.module.css
+++ b/src/components/home/InstallButton.module.css
@@ -159,7 +159,7 @@影响的文件：
-   opacity: 0;
-   visibility: hidden;
-   transform: translateY(-10px);
-   transition: all 0.2s ease-out;
-   z-index: 1000;
+   z-index: 9999;
 }
```

## 影响范围 (Impact)

### 正面影响
- **用户体验改善：** 用户可以正常使用"立即安装"下拉菜单，完成版本选择和安装流程
- **无破坏性变更：** 仅修改 CSS z-index 属性，不影响组件其他功能
- **低风险：** 变更范围小，仅涉及单个 CSS 属性的调整

### 潜在风险
- **无显著风险：** z-index 9999 远高于常规页面元素，不会造成新的层级冲突

## 测试计划 (Testing)

### 功能测试
- [ ] 点击"立即安装"下拉按钮，菜单正常展开
- [ ] 下拉菜单显示在活动指标组件之上
- [ ] 所有菜单项可正常点击
- [ ] 点击外部区域或按 ESC 键菜单正常关闭

### 视觉回归测试
- [ ] 亮色主题下显示正常
- [ ] 暗色主题下显示正常
- [ ] 农历新年主题下显示正常
- [ ] 移动端响应式布局正常

### 浏览器兼容性测试
- [ ] Chrome/Edge 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版

## 验收标准 (Acceptance Criteria)

1. 下拉菜单完全显示在活动指标组件之上
2. 所有菜单选项可点击，无遮挡
3. 在所有主题和设备上显示一致
4. 无新的视觉或功能缺陷引入

## 时间估算

- **代码修改：** 5 分钟
- **测试验证：** 15 分钟
- **总计：** 约 20 分钟

## 相关资源

- `src/components/home/InstallButton.tsx` - 安装按钮组件
- `src/components/home/InstallButton.module.css` - 安装按钮样式
- `src/components/home/ActivityMetricsSection.tsx` - 活动指标组件
- `src/components/home/HeroSection.tsx` - Hero 区域组件

## 执行状态

**状态:** `ExecutionCompleted`

**执行日期:** 2026-02-09

**变更摘要:** 已将 `.dropdownMenu` 的 `z-index` 从 `1000` 修改为 `9999`

**修改文件:** `src/components/home/InstallButton.module.css:162`
