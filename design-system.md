# Hagicode 设计系统

## 设计原则

基于 UI/UX Pro Max 设计指南，Hagicode 采用 **Glassmorphism + Tech Dark** 风格，结合现代渐变和流畅动画，打造专业的 AI 编码助手品牌形象。

## 设计模式

| 属性 | 值 |
|------|-----|
| **模式** | Hero + Features + CTA |
| **CTA 位置** | 首屏上方 + 底部 |
| **区块顺序** | Hero → 活动指标 → 特性展示 → 案例展示 → 快速开始 |

## 视觉风格

### 样式
- **主风格**: Glassmorphism (玻璃态)
- **特点**: 毛玻璃效果、透明度、背景模糊、分层、鲜艳背景、光源、深度感
- **适用**: 现代 SaaS、开发者工具、AI 产品

### 颜色系统

#### 亮色主题
| 角色 | Hex | CSS 变量 |
|------|-----|----------|
| Primary | #2e8555 | `--color-primary` |
| Primary Dark | #25c2a0 | `--color-primary-dark` |
| Background | #ffffff | `--color-background` |
| Surface | #f9fafb | `--color-surface` |
| Text | #1c1e21 | `--color-text` |
| Text Secondary | #6b7280 | `--color-text-secondary` |
| Border | #e5e7eb | `--color-border` |

#### 暗色主题
| 角色 | Hex | CSS 变量 |
|------|-----|----------|
| Primary | #25c2a0 | `--color-primary` |
| Primary Glow | #22C55E | `--color-primary-glow` |
| Background | #0a0a0a | `--color-background` |
| Surface | #171717 | `--color-surface` |
| Surface Glass | rgba(23, 23, 23, 0.8) | `--color-surface-glass` |
| Text | #f5f5f5 | `--color-text` |
| Text Secondary | #a3a3a3 | `--color-text-secondary` |
| Border | rgba(255, 255, 255, 0.1) | `--color-border` |

### 渐变色系
- **主渐变**: linear-gradient(135deg, #22C55E 0%, #25c2a0 50%, #06b6d4 100%)
- **玻璃渐变**: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)
- **辉光效果**: radial-gradient(circle at center, rgba(34, 197, 94, 0.15) 0%, transparent 70%)

## 字体系统

### 字体家族
| 用途 | 字体 | CSS |
|------|------|-----|
| 标题 | Space Grotesk | `font-family: 'Space Grotesk', system-ui, sans-serif` |
| 正文 | DM Sans | `font-family: 'DM Sans', system-ui, sans-serif` |
| 代码 | JetBrains Mono | `font-family: 'JetBrains Mono', monospace` |

### 字体比例
| 等级 | 大小 | 字重 | 行高 |
|------|------|------|------|
| Display | 4.5rem (72px) | 700 | 1.1 |
| H1 | 3rem (48px) | 700 | 1.2 |
| H2 | 2.25rem (36px) | 600 | 1.3 |
| H3 | 1.5rem (24px) | 600 | 1.4 |
| Body | 1rem (16px) | 400 | 1.6 |
| Small | 0.875rem (14px) | 400 | 1.5 |

## 间距系统

基于 8px 网格:
- `--spacing-xs`: 0.5rem (8px)
- `--spacing-sm`: 1rem (16px)
- `--spacing-md`: 1.5rem (24px)
- `--spacing-lg`: 2rem (32px)
- `--spacing-xl`: 3rem (48px)
- `--spacing-2xl`: 4rem (64px)

## 圆角系统

- `--radius-sm`: 0.375rem (6px)
- `--radius-md`: 0.5rem (8px)
- `--radius-lg`: 0.75rem (12px)
- `--radius-xl`: 1rem (16px)
- `--radius-full`: 9999px

## 阴影系统

### 亮色模式
- `--shadow-sm`: 0 1px 2px rgba(0, 0, 0, 0.05)
- `--shadow-md`: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- `--shadow-lg`: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
- `--shadow-xl`: 0 20px 25px -5px rgba(0, 0, 0, 0.1)

### 暗色模式
- `--shadow-sm`: 0 1px 2px rgba(0, 0, 0, 0.3)
- `--shadow-md`: 0 4px 6px -1px rgba(0, 0, 0, 0.4)
- `--shadow-lg`: 0 10px 15px -3px rgba(0, 0, 0, 0.4)
- `--shadow-glow`: 0 0 20px rgba(34, 197, 94, 0.3)

## 动画系统

### 持续时间
- `--duration-fast`: 150ms
- `--duration-normal`: 300ms
- `--duration-slow`: 500ms

### 缓动函数
- `--ease-out`: cubic-bezier(0.4, 0, 0.2, 1)
- `--ease-in-out`: cubic-bezier(0.4, 0, 0.6, 1)
- `--ease-bounce`: cubic-bezier(0.68, -0.55, 0.265, 1.55)

## 组件规范

### 按钮
- **最小触摸目标**: 44x44px
- **内边距**: 0.75rem 1.5rem
- **过渡**: all var(--duration-normal) var(--ease-out)
- **光标**: pointer
- **悬停**: 轻微提升 (translateY(-2px))

### 卡片
- **背景**: var(--color-surface-glass)
- **边框**: 1px solid var(--color-border)
- **圆角**: var(--radius-lg)
- **模糊**: backdrop-filter: blur(12px)
- **悬停**: translate3d(0, -4px, 0)

### 输入框
- **边框**: 1px solid var(--color-border)
- **聚焦**: border-color var(--color-primary)
- **聚焦环**: 0 0 0 3px rgba(34, 197, 94, 0.2)

## 可访问性

### 颜色对比度
- 正文文本: 最小 4.5:1
- 大号文本: 最小 3:1
- 交互元素: 最小 3:1

### 键盘导航
- 所有交互元素可通过 Tab 访问
- 清晰的焦点状态
- 焦点顺序符合视觉顺序

### 减少动画
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 反模式 (避免)

| 问题 | 避免 | 使用 |
|------|------|------|
| 图标 | 使用 emoji 作为图标 | SVG 图标 (Lucide/Heroicons) |
| 悬停 | scale 变换导致布局偏移 | color/opacity 过渡 |
| 动画 | 无限装饰动画 | 仅用于加载指示器 |
| 亮色玻璃 | bg-white/10 (太透明) | bg-white/80 或更高 |
| 边框亮色 | border-white/10 (不可见) | border-gray-200 |

## 页面区块设计

### Hero 区域
- 全屏高度或最小 600px
- 居中内容
- 渐变背景 + 辉光效果
- 大标题 + 描述 + 双 CTA

### 特性展示
- 3 列网格布局
- 玻璃态卡片
- 图标 + 标题 + 描述
- 悬停提升效果

### 数据可视化
- 大号数字展示
- 渐变进度条
- 流畅计数动画
- 响应式图表

### CTA 区域
- 醒目背景色
- 清晰行动号召
- 表单或按钮

## 响应式断点

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1280px
- **Wide**: > 1280px

## 图标系统

使用 **Lucide React** 图标库:
- 安装: `npm install lucide-react`
- 特点: 一致的设计风格、Tree-shakeable、支持 TypeScript
- 大小: 统一使用 24x24 viewBox
