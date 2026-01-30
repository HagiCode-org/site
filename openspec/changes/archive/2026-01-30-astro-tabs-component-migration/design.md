# Design: Astro Tabs 组件设计与实现

## Overview

本设计文档描述如何为 Astro + MDX 环境创建兼容的 Tabs 组件,替代之前 Docusaurus 的 `@theme/Tabs` 和 `@theme/TabItem` 组件。新组件需要提供选项卡切换功能,支持多平台内容展示,并保持与项目整体 UI 风格的一致性。

## UI/UX Design

### 组件结构设计

```
┌─────────────────────────────────────────────────────────┐
│ Tab Headers (可点击切换)                                  │
├─────────────────────────────────────────────────────────┤
│ [Windows] [macOS] [Linux]                                │
│ ─────────                                               │
│                                                          │
│ Tab Content (当前选中的内容)                              │
│                                                          │
│ Windows 平台的具体内容...                                │
│                                                          │
│ npm install -g @fission-ai/openspec@0.23.0             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 交互状态

**默认状态**:
- 显示第一个 Tab 的内容 (或通过 `defaultValue` 指定)
- Tab header 使用项目主题色高亮
- 内容区域正常显示

**悬停状态**:
- 鼠标悬停在 Tab header 上时,显示背景色变化
- 光标变为手型指针 (`cursor: pointer`)

**激活状态**:
- 当前激活的 Tab header 使用主题背景色和文字颜色
- 底部显示下划线指示器

**键盘导航**:
- 支持 Tab 键焦点移动
- 支持左右方向键切换 Tab
- 支持 Enter/Space 键激活 Tab

## 技术设计

### 组件架构

使用 Astro 原生组件 (`.astro` 文件) 实现,利用客户端指令添加交互功能:

```
Tabs.astro (容器组件)
  ├── 状态管理 (activeTab)
  ├── Tab header 渲染
  ├── Tab content 切换逻辑
  └── 样式应用

TabItem.astro (子组件)
  ├── 接收 value 和 label props
  └── 渲染对应的内容
```

### 组件 API 设计

#### Tabs.astro Props

```typescript
interface TabsProps {
  groupId?: string;      // 可选的分组 ID (用于多组 Tabs 联动)
  defaultValue?: string; // 默认激活的 Tab value
  children: any;         // TabItem 子组件
}
```

#### TabItem.astro Props

```typescript
interface TabItemProps {
  value: string;   // Tab 的唯一标识
  label: string;   // Tab 显示的文本
  children: any;   // Tab 内容
}
```

### 数据流

```
用户点击 Tab header
       ↓
更新 activeTab 状态
       ↓
重新渲染组件
       ↓
显示对应的 TabItem 内容
       ↓
隐藏其他 TabItem 内容
```

### 状态管理

使用原生 JavaScript 和 Astro 客户端指令实现轻量级状态管理:

```javascript
// Tabs.astro 中的客户端脚本
let activeTab = defaultValue;

function setActiveTab(value) {
  activeTab = value;
  updateUI();
}
```

## 实现细节

### 核心代码片段

#### Tabs.astro 结构

```astro
---
// Tabs.astro
const { groupId, defaultValue = 'win', children } = Astro.props;
const tabs = Array.isArray(children) ? children : [children];
---

<div class="tabs-container" data-group-id={groupId}>
  <div class="tabs-header" role="tablist">
    {tabs.map((tab) => (
      <button
        class="tab-button"
        data-value={tab.value}
        role="tab"
        aria-selected={tab.value === defaultValue ? 'true' : 'false'}
      >
        {tab.label}
      </button>
    ))}
  </div>

  <div class="tabs-content">
    {tabs.map((tab) => (
      <div
        class="tab-panel"
        data-value={tab.value}
        style={{ display: tab.value === defaultValue ? 'block' : 'none' }}
        role="tabpanel"
      >
        <slot name={tab.value} />
      </div>
    ))}
  </div>
</div>

<style>
  /* 组件样式 */
</style>

<script define:client={{load: true}}>
  // 客户端交互逻辑
</script>
```

#### 客户端交互逻辑

```javascript
<script define:client={{load: true}}>
  const container = document.currentScript.closest('.tabs-container');
  const buttons = container.querySelectorAll('.tab-button');
  const panels = container.querySelectorAll('.tab-panel');
  let activeTab = '{{defaultValue}}';

  function setActiveTab(value) {
    activeTab = value;

    // 更新按钮状态
    buttons.forEach(btn => {
      const isActive = btn.dataset.value === value;
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.classList.toggle('active', isActive);
    });

    // 更新内容显示
    panels.forEach(panel => {
      panel.style.display = panel.dataset.value === value ? 'block' : 'none';
    });
  }

  // 绑定点击事件
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveTab(btn.dataset.value);
    });
  });

  // 键盘导航支持
  container.addEventListener('keydown', (e) => {
    // 实现方向键切换
  });
</script>
```

### 样式设计

使用项目现有的 CSS 变量 (定义在 `src/styles/global.css`):

```css
/* 亮色模式 */
--tabs-bg: var(--bg-color);
--tabs-border: var(--border-color);
--tabs-text: var(--text-color);
--tabs-active-bg: var(--primary-color);
--tabs-active-text: #ffffff;
--tabs-hover-bg: var(--hover-bg);

/* 暗色模式 */
.dark {
  --tabs-bg: var(--dark-bg-color);
  --tabs-border: var(--dark-border-color);
  --tabs-text: var(--dark-text-color);
  --tabs-active-bg: var(--dark-primary-color);
  --tabs-active-text: #ffffff;
  --tabs-hover-bg: var(--dark-hover-bg);
}
```

### 配置变更

无全局配置变更,所有配置在组件内部处理。

## 可访问性 (Accessibility)

### ARIA 属性

- `role="tablist"` - Tab headers 容器
- `role="tab"` - 每个 Tab header 按钮
- `role="tabpanel"` - 每个 Tab content 容器
- `aria-selected` - 标识当前激活的 Tab
- `aria-controls` - 关联 Tab 和其对应的 content

### 键盘导航

- `Tab` - 在 Tabs 之间移动焦点
- `Shift+Tab` - 反向移动焦点
- `ArrowLeft/ArrowRight` - 在 Tabs 之间切换
- `Enter/Space` - 激活当前焦点 Tab

### 屏幕阅读器支持

- 使用语义化的 HTML 结构
- 提供清晰的 ARIA 标签
- 状态变化时提供语音反馈

## 测试策略

### 单元测试

- [ ] Tab 切换逻辑正确性
- [ ] 默认值设置正确
- [ ] 键盘导航功能

### 集成测试

- [ ] 在 MDX 文档中正确渲染
- [ ] 与其他组件无冲突
- [ ] 暗色模式切换正常

### 手动测试

- [ ] 点击切换 Tabs
- [ ] 键盘导航
- [ ] 移动端触摸交互
- [ ] 不同浏览器兼容性 (Chrome, Firefox, Safari, Edge)

### 视觉回归测试

- [ ] 亮色模式样式
- [ ] 暗色模式样式
- [ ] 响应式布局 (移动端/桌面端)

## 性能考虑

### JavaScript 体积

- 使用原生 JavaScript,无外部依赖
- 仅在有 Tabs 组件的页面加载交互脚本
- 预计增加 < 2KB gzipped

### 水合策略

- 使用 `client:load` 在页面加载时立即水合
- 可选使用 `client:visible` 在进入视口时才水合 (延迟加载)

### CSS 体积

- 使用项目现有 CSS 变量,减少重复样式定义
- 预计增加 < 1KB CSS

## 替代方案对比

### 方案一: Astro Tabs 组件 (推荐)

**优点**:
- 完全兼容 Astro + MDX
- 可自定义样式
- 零外部依赖
- 符合项目架构

**缺点**:
- 需要自行开发和维护
- 需要实现交互逻辑

### 方案二: 使用 `<details>` 折叠块

**优点**:
- 实现简单
- 原生 HTML,无需 JS
- 性能最优

**缺点**:
- 用户体验较差 (折叠/展开 vs Tab 切换)
- 不符合原始设计意图
- 移动端体验不佳

### 方案三: 重组内容结构

**优点**:
- 实现最简单
- 无任何 JS
- SEO 友好

**缺点**:
- 页面长度增加
- 用户需要滚动查看不同平台内容
- 失去 Tab 切换的便利性

## 迁移路径

### 第一阶段: 组件开发

1. 创建 `Tabs.astro` 和 `TabItem.astro`
2. 实现基础 UI 和交互逻辑
3. 添加样式和暗色模式支持
4. 本地测试组件功能

### 第二阶段: 文档更新

1. 更新 `setup-openspec.md` 中的导入语法
2. 测试所有 Tabs 实例
3. 验证平台切换交互
4. 检查构建输出

### 第三阶段: 验证和优化

1. 运行 `npm run build` 确保无错误
2. 运行 `npm run typecheck` 验证类型
3. 浏览器兼容性测试
4. 移动端响应式测试
5. 性能优化 (如需要)

## 风险和缓解措施

### 技术风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| Astro 客户端指令不工作 | 低 | 高 | 先在测试页面验证,使用标准模式 |
| MDX 集成问题 | 低 | 中 | 参考 Astro 官方 MDX 文档示例 |
| 样式冲突 | 中 | 低 | 使用 CSS Modules 或 BEM 命名 |
| 性能回归 | 低 | 中 | 使用 Chrome DevTools 性能分析 |

### 兼容性风险

| 风险 | 缓解措施 |
|------|----------|
| 旧浏览器不支持 | 提供降级方案 (显示所有内容) |
| 移动端体验差 | 响应式设计,触摸优化 |
| 屏幕阅读器问题 | 完整的 ARIA 属性支持 |

## 后续优化方向

1. **URL 同步**: 支持 Tab 状态与 URL hash 同步,便于分享链接
2. **平台检测**: 自动检测用户平台并设置默认 Tab
3. **动画效果**: 添加 Tab 切换的过渡动画
4. **持久化**: 使用 localStorage 记住用户的 Tab 选择
5. **搜索优化**: 确保 Tab 内容能被站内搜索索引
