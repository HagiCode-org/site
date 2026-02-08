# 实施任务清单

**提案 ID**: `desktop-homepage-design-alignment`
**创建时间**: 2025-02-08

---

## 概览

本文档包含将 Desktop 页面与首页设计风格对齐的详细实施任务。

任务按依赖关系组织，应按顺序执行。

---

## 阶段 1：样式系统对齐

### 任务 1.1：导入首页样式系统
**优先级**: 高
**预估时间**: 15 分钟
**文件**: `src/pages/desktop/index.astro`

**步骤**:
1. 在 Desktop 页面添加 `homepage.css` 导入：
   ```astro
   import '../styles/homepage.css';
   ```
2. 在 `<body>` 标签添加 `homepage` 类：
   ```astro
   <body class="homepage">
   ```
3. 验证页面加载正常，检查控制台是否有样式冲突

**验收标准**:
- [ ] `homepage.css` 成功导入
- [ ] 页面无控制台错误
- [ ] 现有功能正常工作

---

### 任务 1.2：替换 CSS 变量
**优先级**: 高
**预估时间**: 30 分钟
**文件**: `src/pages/desktop/index.astro` (内联样式部分)

**步骤**:
1. 在 `:root` 中删除 Desktop 特定变量，改为映射到首页变量：
   ```css
   :root {
     --desktop-primary: var(--color-primary);
     --desktop-primary-hover: var(--color-primary-dark);
     --desktop-text-primary: var(--color-text);
     --desktop-text-secondary: var(--color-text-secondary);
     --desktop-bg-card: var(--color-surface);
     --desktop-bg-inline-code: var(--color-surface-hover);
     --desktop-border-card: var(--color-border);
   }
   ```
2. 逐步替换所有使用 `--desktop-*` 变量的地方为直接使用首页变量

**验收标准**:
- [ ] 所有颜色使用首页 CSS 变量
- [ ] 亮色和暗色主题下样式正常
- [ ] 视觉效果与首页一致

---

### 任务 1.3：应用渐变和发光效果
**优先级**: 中
**预估时间**: 20 分钟
**文件**: `src/pages/desktop/index.astro`

**步骤**:
1. 更新 Hero 标题渐变：
   ```css
   .hero-content h1 {
     background: var(--gradient-primary);
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     background-clip: text;
   }
   ```
2. 为按钮添加发光效果：
   ```css
   .btn-primary {
     box-shadow: var(--shadow-glow);
   }
   ```
3. 为卡片添加玻璃态效果

**验收标准**:
- [ ] 标题使用首页渐变效果
- [ ] 按钮具有发光效果
- [ ] 卡片具有玻璃态效果

---

## 阶段 2：主题系统完整支持

### 任务 2.1：添加农历新年主题初始化
**优先级**: 高
**预估时间**: 15 分钟
**文件**: `src/pages/desktop/index.astro`

**步骤**:
1. 替换现有的主题初始化脚本为首页的完整版本
2. 确保 `isLunarNewYearPeriod()` 函数包含最新日期：
   - 2026年马年: 2026-02-17 至 2026-03-03

**验收标准**:
- [ ] 主题初始化脚本与首页一致
- [ ] 农历新年期间自动切换到新年主题
- [ ] 主题切换无闪烁

---

### 任务 2.2：添加新年主题样式
**优先级**: 高
**预估时间**: 25 分钟
**文件**: `src/pages/desktop/index.astro`

**步骤**:
1. 为新年主题添加特定样式：
   ```css
   [data-theme='lunar-new-year'] .hero-content h1 {
     background: linear-gradient(135deg, #FFD54F 0%, #FFA000 100%);
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
   }
   ```
2. 为按钮添加金色光晕：
   ```css
   [data-theme='lunar-new-year'] .btn-primary {
     background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
     box-shadow: 0 0 20px rgba(229, 57, 53, 0.5);
   }
   ```

**验收标准**:
- [ ] 新年主题下所有元素正确显示
- [ ] 金色光晕效果正常
- [ ] 红金配色协调

---

### 任务 2.3：测试主题切换
**优先级**: 中
**预估时间**: 15 分钟

**步骤**:
1. 在三种主题下手动测试页面
2. 检查所有主要元素的显示效果
3. 确保主题切换响应及时

**验收标准**:
- [ ] 亮色主题正常
- [ ] 暗色主题正常
- [ ] 农历新年主题正常
- [ ] 主题切换无延迟或闪烁

---

## 阶段 3：组件复用与布局统一

### 任务 3.1：引入 Navbar 组件
**优先级**: 高
**预估时间**: 20 分钟
**文件**: `src/pages/desktop/index.astro`

**步骤**:
1. 添加 Navbar 导入：
   ```astro
   import Navbar from '@/components/home/Navbar';
   ```
2. 在 `<body class="homepage">` 后添加：
   ```astro
   <Navbar client:load />
   ```
3. 移除现有的任何导航栏代码（如果有）

**验收标准**:
- [ ] Navbar 正确显示
- [ ] 导航链接工作正常
- [ ] 主题切换按钮正常
- [ ] 移动端菜单正常

---

### 任务 3.2：引入 Footer 组件
**优先级**: 高
**预估时间**: 15 分钟
**文件**: `src/pages/desktop/index.astro`

**步骤**:
1. 添加 Footer 导入：
   ```astro
   import Footer from '@/components/home/Footer';
   ```
2. 在 `</body>` 前添加：
   ```astro
   <Footer client:load />
   ```
3. 移除现有的任何页脚代码（如果有）

**验收标准**:
- [ ] Footer 正确显示
- [ ] 链接工作正常
- [ ] 备案信息显示正确

---

### 任务 3.3：更新布局结构
**优先级**: 中
**预估时间**: 20 分钟
**文件**: `src/pages/desktop/index.astro`

**步骤**:
1. 将主要内容包裹在 `main.homepage` 容器中：
   ```astro
   <main class="homepage">
     <!-- 现有的 desktop-page 内容 -->
   </main>
   ```
2. 移除 `.desktop-page` 容器的 `max-width` 和 `margin`（由 homepage.css 处理）
3. 确保所有 section 使用正确的布局结构

**验收标准**:
- [ ] 内容区域宽度限制为 1200px
- [ ] 内容居中显示
- [ ] 响应式布局正常

---

### 任务 3.4：添加科技感装饰元素
**优先级**: 低
**预估时间**: 30 分钟
**文件**: `src/pages/desktop/index.astro`

**步骤**:
1. 在 Hero section 添加装饰元素：
   ```astro
   <div class="tech-grid-bg" />
   <div class="bgGlow" />
   ```
2. 为关键卡片添加 `tech-border-glow` 类
3. 添加 HUD 装饰边框（如需要）

**验收标准**:
- [ ] 网格背景显示正常
- [ ] 光晕效果正常
- [ ] 发光边框效果正常

---

## 阶段 4：动画与交互增强

### 任务 4.1：为关键元素添加 Framer Motion 动画
**优先级**: 中
**预估时间**: 45 分钟
**文件**: 需要创建新的 TSX 组件或改造现有结构

**步骤**:
1. 将 Hero section 改造为 React 组件，或使用内联 `motion.div`
2. 添加渐入动画：
   ```tsx
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.5 }}
   >
   ```
3. 为按钮添加悬停动画
4. 为功能卡片添加交错动画

**验收标准**:
- [ ] Hero 元素渐入动画流畅
- [ ] 按钮悬停效果正常
- [ ] 卡片动画按顺序出现

---

### 任务 4.2：添加新年主题金色光晕动画
**优先级**: 低
**预估时间**: 20 分钟

**步骤**:
1. 为新年主题下的关键元素添加金色光晕动画
2. 确保动画性能良好

**验收标准**:
- [ ] 新年主题下金色光晕效果明显
- [ ] 动画流畅，无卡顿

---

## 阶段 5：代码优化

### 任务 5.1：抽取内联样式到独立文件
**优先级**: 中
**预估时间**: 30 分钟

**步骤**:
1. 创建 `src/styles/desktop.css` 文件
2. 将 Desktop 页面特有的样式移动到该文件
3. 在 Desktop 页面导入该文件
4. 保留 `homepage.css` 导入

**验收标准**:
- [ ] 内联样式减少到最低限度
- [ ] 样式文件结构清晰
- [ ] 页面样式正常

---

### 任务 5.2：TypeScript 类型检查
**优先级**: 低
**预估时间**: 15 分钟

**步骤**:
1. 确保 Desktop 页面的 TypeScript 类型定义完整
2. 修复任何类型错误

**验收标准**:
- [ ] 无 TypeScript 类型错误
- [ ] 类型定义准确

---

## 最终验收

### 视觉回归测试
**优先级**: 高
**预估时间**: 30 分钟

**检查清单**:
- [ ] 亮色主题下所有元素正常显示
- [ ] 暗色主题下所有元素正常显示
- [ ] 农历新年主题下所有元素正常显示
- [ ] 响应式布局在不同屏幕尺寸下正常
- [ ] 所有链接可点击
- [ ] 所有按钮工作正常
- [ ] 动画流畅无卡顿
- [ ] 无控制台错误或警告

---

## 依赖关系

```
任务 1.1 (导入样式)
    ↓
任务 1.2 (替换变量) → 任务 1.3 (渐变效果)
    ↓
任务 2.1 (主题初始化)
    ↓
任务 2.2 (新年样式) → 任务 2.3 (主题测试)
    ↓
任务 3.1 (Navbar) → 任务 3.2 (Footer) → 任务 3.3 (布局) → 任务 3.4 (装饰)
    ↓
任务 4.1 (动画) → 任务 4.2 (新年动画)
    ↓
任务 5.1 (抽取样式) → 任务 5.2 (类型检查)
    ↓
最终验收
```

---

## 总预估时间

- 阶段 1：65 分钟
- 阶段 2：55 分钟
- 阶段 3：85 分钟
- 阶段 4：65 分钟
- 阶段 5：45 分钟
- 最终验收：30 分钟

**总计**：约 5.5 小时
