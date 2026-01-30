# sidebar-navigation-visual-design Spec Delta

## 概述

本规范增量定义了 Hagicode 文档站点侧栏导航的视觉设计标准,包括图标尺寸、间距、透明度和响应式调整。这些标准旨在提升用户体验,确保清晰的视觉层次和一致的视觉风格。

---

## MODIFIED Requirements

### Requirement: 侧栏导航图标尺寸标准

侧栏导航中的所有图标 MUST 使用统一的尺寸标准,确保在不同设备和分辨率下清晰可见。

#### Scenario: 图标尺寸基准

**Given** 侧栏导航组件已渲染
**When** 我检查图标的 CSS `width` 和 `height` 属性
**Then** 图标 MUST 符合以下尺寸标准:
  - 切换图标(toggle-icon): **16px × 16px**
  - 文件夹图标(folder-icon): **18px × 18px**(略大以强调导航结构)
  - 文件图标(file-icon): **16px × 16px**
  - AND 所有尺寸 MUST 使用 CSS 变量定义(见下文)

#### Scenario: 图标尺寸实现方式

**Given** 侧栏导航组件已加载
**When** 我查看组件的样式定义
**Then** 图标尺寸 MUST 通过 CSS 变量设置:
  - `--sidebar-icon-size-toggle`: 16px (切换图标)
  - `--sidebar-icon-size-folder`: 18px (文件夹图标)
  - `--sidebar-icon-size-base`: 16px (文件图标)
  - AND 变量 MUST 在 `src/styles/global.css` 的 `:root` 选择器中定义
  - AND 组件 MUST 通过 `var()` 函数引用这些变量

#### Scenario: 图标尺寸可访问性

**Given** 侧栏导航已显示
**When** 我在各种设备上查看图标(桌面、平板、手机)
**Then** 图标 MUST 在所有设备上清晰可见
  - AND 在视网膜屏幕上边缘锐利,无模糊
  - AND 最小触摸目标尺寸至少 44×44px(移动端)
  - AND 图标颜色与背景对比度至少 3:1(WCAG AA 标准)

---

### Requirement: 侧栏导航间距标准

侧栏导航中的图标与文本之间、节点之间 MUST 使用统一的间距标准,确保良好的视觉呼吸感和可读性。

#### Scenario: 图标与文本间距

**Given** 侧栏导航节点已渲染
**When** 我检查图标与文本之间的间距(`gap` 属性)
**Then** 间距 MUST 设置为 **0.5rem** (约 8px,假设基础字体大小为 16px)
  - AND 间距 MUST 使用 CSS 变量 `--sidebar-icon-text-gap`
  - AND 间距 MUST 同时应用于文件夹切换按钮和文件链接

#### Scenario: 节点垂直间距

**Given** 侧栏导航树已渲染
**When** 我检查相邻节点之间的垂直间距(`margin` 属性)
**Then** 间距 MUST 设置为 **0.25rem** (约 4px)
  - AND 间距 MUST 使用 CSS 变量 `--sidebar-node-padding-vertical`
  - AND 间距 MUST 在所有层级保持一致

#### Scenario: 间距视觉平衡

**Given** 侧栏导航有多个层级的文档
**When** 我查看整体导航布局
**Then** 视觉平衡 MUST 符合以下标准:
  - 图标与文本间距足够大,不会显得拥挤
  - 节点垂直间距足够大,能够清晰区分不同节点
  - 整体布局不会显得过于稀疏或过于紧凑
  - AND 文本不会因间距过大而被挤出侧栏(侧栏宽度 260px)

---

### Requirement: 侧栏导航图标透明度标准

侧栏导航中的图标 MUST 使用统一的透明度标准,确保默认状态可见,同时提供清晰的交互反馈。

#### Scenario: 默认状态透明度

**Given** 侧栏导航已加载,用户尚未进行任何交互
**When** 我检查图标的默认透明度(`opacity` 属性)
**Then** 透明度 MUST 设置为 **0.7** (亮色主题)
  - AND 透明度 MUST 使用 CSS 变量 `--sidebar-icon-opacity-default`
  - AND 暗色主题下透明度 MUST 设置为 **0.75** (略高以补偿背景对比度)
  - AND 所有图标类型(切换、文件夹、文件) MUST 使用相同的默认透明度

#### Scenario: 悬停状态透明度

**Given** 侧栏导航已显示
**When** 我将鼠标悬停在导航节点上
**Then** 图标透明度 MUST 变为 **1.0** (完全不透明)
  - AND 透明度 MUST 使用 CSS 变量 `--sidebar-icon-opacity-hover`
  - AND 过渡动画 MUST 使用 `transition` 属性实现平滑变化
  - AND 过渡时长 MUST 约为 0.2s

#### Scenario: 激活状态透明度

**Given** 我正在查看当前页面的导航节点
**When** 我检查当前页面的图标透明度
**Then** 图标透明度 MUST 为 **1.0** (完全不透明)
  - AND 透明度 MUST 使用 CSS 变量 `--sidebar-icon-opacity-active`
  - AND 当前页面 MUST 通过 `aria-current="page"` 标识
  - AND 激活状态的颜色 MUST 使用主题色(`--ifm-color-primary`)

---

### Requirement: 侧栏导航响应式设计

侧栏导航 MUST 在不同屏幕尺寸下自适应调整图标尺寸和间距,确保良好的移动端体验。

#### Scenario: 移动端图标尺寸调整

**Given** 我正在使用移动设备(屏幕宽度 < 768px)
**When** 我查看侧栏导航
**Then** 图标尺寸 MUST 缩小以适应较小的屏幕:
  - 切换图标: **14px × 14px**
  - 文件夹图标: **16px × 16px**
  - 文件图标: **14px × 14px**
  - AND 调整 MUST 通过媒体查询 `@media (max-width: 768px)` 实现

#### Scenario: 移动端间距调整

**Given** 我正在使用移动设备(屏幕宽度 < 768px)
**When** 我查看侧栏导航的间距
**Then** 间距 MUST 适当减小以节省空间:
  - 图标与文本间距: **0.375rem** (桌面端原始值)
  - 节点垂直间距: **0.125rem** (桌面端原始值)
  - AND 调整 MUST 通过媒体查询 `@media (max-width: 768px)` 实现

#### Scenario: 移动端触摸目标尺寸

**Given** 我正在使用移动设备
**When** 我与侧栏导航进行交互(点击/触摸)
**Then** 每个交互元素的触摸目标尺寸 MUST 至少为 **44×44px**
  - AND 触摸目标 MUST 包括图标、文本和周围的填充空间
  - AND 触摸反馈 MUST 立即且明显

#### Scenario: 平板端显示

**Given** 我正在使用平板设备(屏幕宽度 768px - 996px)
**When** 我查看侧栏导航
**Then** 侧栏 MUST 使用桌面端的图标尺寸和间距标准
  - AND 侧栏宽度 MUST 为 100%(而非固定的 260px)
  - AND 最大高度 MUST 限制为 350px
  - AND 侧栏 MUST 显示为静态块(非固定定位)

---

### Requirement: 侧栏导航加载性能

侧栏导航 MUST 优化加载性能,减少布局偏移(Cumulative Layout Shift, CLS),提供流畅的用户体验。

#### Scenario: 布局稳定性优化

**Given** 我正在加载文档页面
**When** 侧栏导航组件开始渲染
**Then** 侧栏容器 MUST 应用以下 CSS 属性以优化布局稳定性:
  - `contain: layout style` - 限制布局重计算范围
  - `will-change: scroll-position` - 提示浏览器滚动位置将变化
  - `min-height: 0` - 确保内容加载时容器尺寸稳定
  - AND Lighthouse CLS 分数 MUST < 0.1

#### Scenario: 渲染性能优化

**Given** 侧栏导航已加载
**When** 我滚动侧栏或展开/折叠文件夹
**Then** 渲染性能 MUST 符合以下标准:
  - 滚动时帧率 MUST 保持 60fps
  - 展开/折叠动画 MUST 使用 GPU 加速(transform 和 opacity)
  - AND 主线程阻塞时间 MUST < 50ms

#### Scenario: 初始加载状态

**Given** 我正在首次访问文档页面
**When** 页面开始加载
**Then** 侧栏导航 MUST:
  - 快速显示基本结构(不等待完整数据)
  - 避免明显的布局跳动或闪烁
  - 在内容加载时保持容器尺寸稳定
  - AND First Contentful Paint (FCP) MUST < 1.5s

---

## Quality Gates

### 视觉设计验收

- [ ] 所有图标尺寸符合标准(16px-18px)
- [ ] 所有间距符合标准(0.5rem 和 0.25rem)
- [ ] 所有透明度符合标准(默认 0.7,悬停/激活 1.0)
- [ ] 视觉层次清晰,文件夹和文件节点有明显区分
- [ ] 整体视觉平衡良好,不拥挤也不稀疏
- [ ] 亮色和暗色主题视觉效果一致

### 性能验收

- [ ] Lighthouse Performance 分数 ≥ 90
- [ ] CLS(Cumulative Layout Shift) < 0.1
- [ ] 滚动时帧率保持 60fps
- [ ] `npm run build` 成功,无性能相关警告

### 可访问性验收

- [ ] 键盘导航功能完整,焦点顺序合理
- [ ] 所有交互元素都有可见的焦点指示器
- [ ] 屏幕阅读器能够正确读取导航结构
- [ ] 颜色对比度符合 WCAG AA 标准(图标 3:1,文本 4.5:1)
- [ ] 触摸目标尺寸至少 44×44px(移动端)

### 兼容性验收

- [ ] 在主流浏览器(Chrome, Firefox, Safari, Edge)中正常显示
- [ ] 在不同操作系统(Windows, macOS, Linux)上显示一致
- [ ] 在移动设备(iOS, Android)上触摸交互正常
- [ ] 响应式布局在各种屏幕尺寸下正常工作

### 代码质量验收

- [ ] TypeScript 类型检查通过(`npm run typecheck`)
- [ ] 生产构建成功(`npm run build`)
- [ ] 代码符合项目规范,注释清晰
- [ ] CSS 变量命名清晰,组织合理
- [ ] 无控制台错误或警告

---

## Implementation Notes

### CSS 变量定义位置

所有侧栏导航相关的 CSS 变量 MUST 定义在 `src/styles/global.css` 中:

```css
:root {
  /* 侧栏导航图标尺寸 */
  --sidebar-icon-size-base: 16px;
  --sidebar-icon-size-folder: 18px;
  --sidebar-icon-size-toggle: 16px;

  /* 侧栏导航间距 */
  --sidebar-icon-text-gap: 0.5rem;
  --sidebar-node-padding-vertical: 0.25rem;

  /* 侧栏导航图标透明度 */
  --sidebar-icon-opacity-default: 0.7;
  --sidebar-icon-opacity-hover: 1.0;
  --sidebar-icon-opacity-active: 1.0;
}

[data-theme='dark'] {
  /* 暗色主题下调整透明度 */
  --sidebar-icon-opacity-default: 0.75;
}
```

### 组件实现位置

侧栏导航组件位于 `src/components/Sidebar.astro`。所有样式和交互逻辑 MUST 在此文件中实现。

### 设计标准文档

详细的设计标准 SHOULD 记录在 `docs/contributor-guide/sidebar-navigation-visual-guide.md`(可选),便于后续维护和参考。

---

## Version History

- **2026-01-29**: 初始版本 - 定义侧栏导航视觉设计标准

---

## 相关规范

- **astro-site** - Astro 站点核心规范
- **sidebar-navigation** - 侧栏导航功能实现规范(如有)

---

## 参考资料

- [Material Design - Iconography](https://m3.material.io/styles/icons/overview)
- [WCAG 2.1 - Understanding Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [Web.dev - Optimizing CLS](https://web.dev/cls/)
