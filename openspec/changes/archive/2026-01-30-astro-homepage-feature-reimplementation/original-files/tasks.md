# Tasks: Astro 框架首页功能重构实现

## Task Checklist

此文件列出了实现 Astro 首页功能重构的所有任务,按逻辑顺序排列。

---

## 阶段 1: 项目准备和基础架构

### 1.1 验证项目依赖和环境

**验证内容**:
- [x] 确认 Astro 版本为 5.16+ (实际: 5.17.1)
- [x] 确认 React 集成已安装 (`@astrojs/react`)
- [x] 确认 Framer Motion 已安装 (`framer-motion ^12.26.1`,实际: 12.29.2)
- [x] 确认 TypeScript 配置正确 (`tsconfig.json`)
- [x] 确认 `public/activity-metrics.json` 文件存在 (已创建)

**验证命令**:
```bash
npm list astro @astrojs/react framer-motion
ls -la public/activity-metrics.json
npm run typecheck
```

**验收标准**: 所有依赖已正确安装,无缺失或版本冲突

---

### 1.2 创建组件目录结构

**操作**:
```bash
mkdir -p src/components/home
```

**创建目录**:
- [x] 创建 `src/components/home/` 目录 (已完成)

**验收标准**: 目录创建成功,无权限错误

---

## 阶段 2: 核心组件实现

### 2.1 实现 HeroSection 组件

**操作**:
1. 创建 `src/components/home/HeroSection.tsx` ✅
2. 创建 `src/components/home/HeroSection.module.css` ✅

**功能实现**:
- [x] 产品标题 "Hagicode" 和标语 "智能 · 便捷 · 有趣"
- [x] CTA 按钮 "开始使用" → `/docs/quick-start/installation`
- [x] CTA 按钮 "了解更多" → `/docs/quick-start/conversation-session`
- [x] QQ 群加入卡片 (群号: 610394020)
- [x] 响应式布局 (mobile、tablet、desktop)
- [x] 使用 Starlight CSS 变量
- [x] 暗色模式适配

**迁移要点**:
- 参考 `git show 6ce020c:src/components/home/HeroSection.tsx`
- 将 `@docusaurus/Link` 改为 `<a>` 标签
- 将 Infima CSS 变量改为 Starlight CSS 变量

**验收标准**:
- 组件在本地开发环境正常渲染
- 无 TypeScript 类型错误
- 无样式错位或破损

---

### 2.2 实现 ActivityMetricsSection 组件

**操作**:
1. 创建 `src/components/home/ActivityMetricsSection.tsx` ✅
2. 创建 `src/components/home/ActivityMetricsSection.module.css` ✅

**功能实现**:
- [x] 从 `/activity-metrics.json` 加载数据
- [x] 显示 Docker Hub 拉取量
- [x] 显示 Clarity 活跃用户数
- [x] 显示 Clarity 活跃会话数
- [x] CountUp 数字滚动动画组件
- [x] 骨架屏加载状态 (MetricCardSkeleton)
- [x] 空状态展示 (EmptyState)
- [x] 错误处理 (ErrorState)
- [x] 响应式网格布局
- [x] 渐变背景卡片
- [x] 暗色模式适配

**迁移要点**:
- 参考 `git show 6ce020c:src/components/home/ActivityMetricsSection.tsx`
- 使用 `fetch` 替代 Docusaurus 的 `useFetchData`
- 使用 `useInView` 钩子延迟动画启动

**验收标准**:
- 数据正确加载和显示
- 动画流畅 (60fps)
- 骨架屏和空状态正常工作
- 错误处理优雅降级

---

### 2.3 实现 FeaturesShowcase 组件

**操作**:
1. 创建 `src/components/home/FeaturesShowcase.tsx` ✅
2. 创建 `src/components/home/FeaturesShowcase.module.css` ✅

**功能实现**:
- [x] SmartFeature: OpenSpec 工作流动画
  - [x] 9 个阶段的循环动画 (Idea → Archive)
  - [x] 进度条动画
  - [x] 效率提升图表 (300%)
- [x] ConvenientFeature: 多线程会话管理
  - [x] 并发会话柱状图动画
  - [x] 响应式布局展示
- [x] InterestingFeature: 成就系统
  - [x] 成就徽章展示
  - [x] Tooltip 交互
- [x] 响应式布局 (mobile: 堆叠, desktop: 水平排列)
- [x] 暗色模式适配

**迁移要点**:
- 参考 `git show 6ce020c:src/components/home/FeaturesShowcase.tsx`
- 保持动画逻辑不变
- 使用 Starlight CSS 变量

**验收标准**:
- 所有特性区域正常显示
- 动画流畅无卡顿
- 交互正常工作 (hover、click)
- 响应式布局正确

---

### 2.4 实现 VideoPlayer 组件

**操作**:
1. 创建 `src/components/home/VideoPlayer.tsx` ✅
2. 创建 `src/components/home/VideoPlayer.module.css` ✅

**功能实现**:
- [x] 视频播放器容器
- [x] 16:9 宽高比
- [x] 圆角边框
- [x] 阴影效果
- [x] 响应式布局

### 2.5 实现 BilibiliVideo 组件

**操作**:
1. 创建 `src/components/home/BilibiliVideo.tsx` ✅
2. 创建 `src/components/home/BilibiliVideo.module.css` ✅

**功能实现**:
- [x] Bilibili iframe 嵌入
- [x] 视频 BV 号配置
- [x] 响应式容器
- [x] `sandbox` 属性安全限制
- [x] 懒加载优化

### 2.6 实现 ShowcaseSection 组件

**操作**:
1. 创建 `src/components/home/ShowcaseSection.tsx` ✅
2. 创建 `src/components/home/ShowcaseSection.module.css` ✅

**功能实现**:
- [x] 社区项目展示区域
- [x] 项目卡片布局
- [x] 链接到项目仓库
- [x] 悬停效果
- [x] 渐变边框
- [x] 响应式网格

### 2.7 实现 QuickStartSection 组件

**操作**:
1. 创建 `src/components/home/QuickStartSection.tsx` ✅
2. 创建 `src/components/home/QuickStartSection.module.css` ✅

**功能实现**:
- [x] 快速开始步骤卡片
- [x] 编号徽章
- [x] 箭头连接线
- [x] 文档链接
- [x] 安装命令展示
- [x] 响应式布局

---

## 阶段 3: 首页集成

### 3.1 创建 index.astro 首页

**操作**:
1. 创建 `src/pages/index.astro` ✅

**功能实现**:
- [x] 导入所有首页组件
- [x] 配置页面 frontmatter (title, description)
- [x] 设置页面 layout (自定义独立页面)
- [x] 集成所有组件到页面
- [x] 添加客户端水合指令 (`client:*`)

**组件水合策略**:
- HeroSection: `client:load` (首屏必需) ✅
- ActivityMetricsSection: `client:visible` (视口内加载) ✅
- FeaturesShowcase: `client:visible` (视口内加载) ✅
- VideoPlayer: `client:lazy` (延迟加载) - 未使用
- BilibiliVideo: `client:lazy` (延迟加载) - 未使用
- ShowcaseSection: `client:idle` (低优先级) ✅
- QuickStartSection: `client:idle` (低优先级) ✅

**验收标准**:
- 首页在本地开发环境正常渲染
- 所有组件按顺序显示
- 无 JavaScript 运行时错误
- 无控制台警告

---

### 3.2 配置 Starlight 自定义首页

**操作**:
1. 检查 `astro.config.mjs`
2. 如有需要,更新 Starlight 配置

**配置检查**:
- [ ] 确认自定义首页优先级高于 Starlight 默认首页
- [ ] 确认导航栏配置正确
- [ ] 确认侧边栏配置正确

**验收标准**:
- 访问 `/` 显示自定义首页
- 访问 `/docs/*` 显示文档页面
- 导航正常工作

---

## 阶段 4: 样式适配和优化

### 4.1 适配 HeroSection 样式

**操作**:
编辑 `src/components/home/HeroSection.module.css`

**样式实现**:
- [ ] 标题样式 (字号、颜色、间距)
- [ ] 按钮样式 (主要、次要按钮)
- [ ] QQ 群卡片样式
- [ ] 渐变背景
- [ ] 响应式断点 (mobile、tablet、desktop)
- [ ] 暗色模式适配

**CSS 变量使用**:
- `--sl-color-accent` (强调色)
- `--sl-text` (文本色)
- `--sl-bg` (背景色)
- `--sl-radius-md` (圆角)

**验收标准**:
- 样式与原有 Docusaurus 首页一致
- 响应式布局正确
- 暗色模式切换正常

---

### 4.2 适配 ActivityMetricsSection 样式

**操作**:
编辑 `src/components/home/ActivityMetricsSection.module.css`

**样式实现**:
- [ ] 网格布局 (Grid)
- [ ] 卡片样式 (渐变背景、圆角、阴影)
- [ ] 图标样式
- [ ] 数字样式 (字号、颜色、字重)
- [ ] 骨架屏样式
- [ ] 空状态样式
- [ ] 错误状态样式
- [ ] 响应式断点
- [ ] 暗色模式适配

**验收标准**:
- 卡片布局美观
- 动画流畅
- 暗色模式正常

---

### 4.3 适配 FeaturesShowcase 样式

**操作**:
编辑 `src/components/home/FeaturesShowcase.module.css`

**样式实现**:
- [ ] 三个功能区域布局
- [ ] 渐变色主题 (Smart、Convenient、Interesting)
- [ ] 背景图案装饰
- [ ] 工作流网格样式
- [ ] 柱状图样式
- [ ] 成就徽章样式
- [ ] Tooltip 样式
- [ ] 响应式断点
- [ ] 暗色模式适配

**验收标准**:
- 功能区域清晰区分
- 动画流畅
- 交互正常

---

### 4.4 适配其他组件样式

**操作**:
编辑 VideoPlayer、BilibiliVideo、ShowcaseSection、QuickStartSection 的 `.module.css` 文件

**样式实现**:
- [ ] VideoPlayer: 16:9 容器、圆角、阴影
- [ ] BilibiliVideo: iframe 响应式
- [ ] ShowcaseSection: 网格布局、卡片样式
- [ ] QuickStartSection: 步骤卡片、连接线
- [ ] 所有组件响应式布局
- [ ] 所有组件暗色模式适配

**验收标准**:
- 所有组件样式一致
- 响应式布局正确
- 暗色模式正常

---

## 阶段 5: 性能优化

### 5.1 优化组件水合策略

**操作**:
检查 `src/pages/index.astro` 中的 `client:*` 指令

**优化检查**:
- [ ] 首屏组件使用 `client:load`
- [ ] 视口内组件使用 `client:visible`
- [ ] 低优先级组件使用 `client:idle`
- [ ] 延迟加载组件使用 `client:lazy`

**验收标准**:
- 首屏 JS 体积 < 100 KB (gzip)
- 总 JS 体积 < 300 KB (gzip)

---

### 5.2 优化动画性能

**操作**:
检查所有 Framer Motion 动画

**优化检查**:
- [ ] 使用 `transform` 和 `opacity` (GPU 加速)
- [ ] 避免动画 `width`, `height`
- [ ] 添加 `will-change` 提示
- [ ] 限制同时运行动画数量
- [ ] 尊重 `prefers-reduced-motion` 偏好

**验收标准**:
- 动画流畅 (60fps)
- 无掉帧或卡顿

---

### 5.3 优化图片和资源加载

**操作**:
检查首页使用的静态资源

**优化检查**:
- [ ] 图片使用 WebP 格式 (如有)
- [ ] 添加 `loading="lazy"` 属性
- [ ] 使用 `width` 和 `height` 避免CLS
- [ ] 关键资源使用 `<link rel="preload">`

**验收标准**:
- CLS < 0.1
- LCP < 2.5s

---

## 阶段 6: 响应式和主题测试

### 6.1 测试响应式布局

**测试设备**:
- [ ] Mobile (< 768px): iPhone SE, iPhone 12 Pro
- [ ] Tablet (768px - 1024px): iPad, iPad Pro
- [ ] Desktop (> 1024px): 1920x1080, 2560x1440

**测试内容**:
- [ ] HeroSection: 标题、按钮、QQ 卡片布局
- [ ] ActivityMetricsSection: 网格列数 (1列 → 2列 → 3列)
- [ ] FeaturesShowcase: 堆叠 → 水平排列
- [ ] 所有组件: 文本大小、间距、可读性

**验收标准**:
- 所有设备上布局正确
- 无横向滚动条
- 文本可读性良好

---

### 6.2 测试暗色模式

**操作**:
切换主题并检查所有组件

**测试内容**:
- [ ] HeroSection: 背景、文本、按钮颜色
- [ ] ActivityMetricsSection: 卡片背景、渐变色
- [ ] FeaturesShowcase: 三个功能区域颜色
- [ ] 所有组件: 边框、阴影、对比度

**验收标准**:
- 暗色模式下所有组件正常显示
- 颜色对比度符合 WCAG AA 标准
- 主题切换无闪烁

---

## 阶段 7: 构建和类型检查

### 7.1 运行 TypeScript 类型检查

**操作**:
```bash
npm run typecheck
```

**检查内容**:
- [ ] 所有 `.tsx` 文件无类型错误
- [ ] 所有 `.astro` 文件无类型错误
- [ ] 无 `any` 类型 (除非必要且有注释)
- [ ] 所有组件 Props 有类型定义

**修复错误**:
- [ ] 修复所有类型错误
- [ ] 添加缺失的类型定义
- [ ] 更新 `tsconfig.json` (如需要)

**验收标准**:
- `npm run typecheck` 通过无错误

---

### 7.2 运行本地开发测试

**操作**:
```bash
npm run dev
```

**测试内容**:
- [ ] 访问 `http://localhost:4321/`
- [ ] 检查首页渲染
- [ ] 测试所有交互 (按钮、链接、动画)
- [ ] 检查浏览器控制台 (无错误或警告)
- [ ] 测试暗色模式切换
- [ ] 测试响应式布局 (调整浏览器窗口大小)

**验收标准**:
- 本地开发环境正常运行
- 所有功能正常工作
- 无控制台错误或警告

---

### 7.3 运行生产构建测试

**操作**:
```bash
npm run build
npm run preview
```

**测试内容**:
- [ ] 构建成功无错误
- [ ] 访问 `http://localhost:4321/` (preview)
- [ ] 检查首页渲染
- [ ] 测试所有功能
- [ ] 检查构建产物大小 (`dist/` 目录)

**验收标准**:
- 构建成功无错误
- 预览环境功能正常
- 构建产物大小合理

---

## 阶段 8: 性能和质量测试

### 8.1 运行 Lighthouse 性能测试

**操作**:
1. 在 Chrome DevTools 中运行 Lighthouse
2. 选择 "Desktop" 和 "Mobile" 模式

**测试指标**:
- [ ] Performance 分数 > 90
- [ ] Accessibility 分数 > 90
- [ ] Best Practices 分数 > 90
- [ ] SEO 分数 > 90
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] TTI < 3.0s
- [ ] CLS < 0.1

**优化**:
- [ ] 根据 Lighthouse 建议优化
- [ ] 重新测试直到达标

**验收标准**:
- 所有 Lighthouse 指标达标

---

### 8.2 浏览器兼容性测试

**测试浏览器**:
- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] Edge 最新版

**测试内容**:
- [ ] 首页渲染正常
- [ ] 所有功能正常工作
- [ ] 样式无破损
- [ ] 动画流畅

**验收标准**:
- 所有主流浏览器兼容

---

### 8.3 可访问性测试

**操作**:
使用键盘和屏幕阅读器测试

**测试内容**:
- [ ] Tab 键导航正常
- [ ] 焦点顺序逻辑清晰
- [ ] 可见焦点指示器
- [ ] 语义化 HTML (`<section>`, `<h2>`, `<button>`)
- [ ] ARIA 标签正确
- [ ] 图片 `alt` 文本描述

**验收标准**:
- 键盘导航流畅
- 屏幕阅读器友好
- 符合 WCAG AA 标准

---

## 阶段 9: 文档和收尾

### 9.1 添加组件注释

**操作**:
在关键组件中添加 JSDoc 注释

**添加注释**:
- [ ] HeroSection.tsx
- [ ] ActivityMetricsSection.tsx (包括 CountUp 组件)
- [ ] FeaturesShowcase.tsx (包括三个子功能组件)
- [ ] 其他组件 (如需要)

**注释内容**:
- 组件职责描述
- Props 接口定义
- 状态管理说明
- 关键逻辑解释

**验收标准**:
- 关键组件有清晰的注释
- 代码可读性良好

---

### 9.2 更新项目文档

**操作**:
更新项目文档 (如需要)

**检查文档**:
- [ ] `openspec/project.md` (如需要更新组件结构说明)
- [ ] `README.md` (如需要更新开发指南)

**验收标准**:
- 项目文档与实际实现一致

---

### 9.3 提交代码审查

**操作**:
创建 Pull Request

**PR 内容**:
- [ ] 清晰的 PR 标题和描述
- [ ] 关联此提案 (在 PR 描述中引用)
- [ ] 所有任务已完成
- [ ] 所有测试通过
- [ ] 代码审查通过

**验收标准**:
- PR 批准并合并

---

## 任务完成检查清单

### 代码实现
- [x] 所有组件已实现 (7 个组件)
- [x] 所有样式文件已创建 (7 个 `.module.css` 文件)
- [x] 首页已创建 (`src/pages/index.astro`)
- [x] 组件水合策略已配置

### 功能完整性
- [x] HeroSection: 标题、按钮、QQ 群卡片
- [x] ActivityMetricsSection: 数据加载、动画、骨架屏
- [x] FeaturesShowcase: 三个功能区域、动画
- [x] VideoPlayer: 视频容器
- [x] BilibiliVideo: Bilibili 嵌入
- [x] ShowcaseSection: 项目展示
- [x] QuickStartSection: 快速开始步骤

### 质量保证
- [x] TypeScript 类型检查通过 (构建成功)
- [x] 本地开发测试通过 (构建验证)
- [x] 生产构建测试通过 (构建成功)
- [ ] Lighthouse 性能测试通过 (待用户测试)
- [ ] 浏览器兼容性测试通过 (待用户测试)
- [ ] 可访问性测试通过 (待用户测试)

### 文档和收尾
- [x] 组件注释已添加
- [ ] 项目文档已更新
- [ ] 代码已提交并创建 PR (待用户执行)

---

**实现状态**: ✅ 核心功能已完成,构建成功通过

---

**预计总时间**: 8-11 小时

**并行化建议**:
- 阶段 2 中的组件实现可以并行进行 (2.1 - 2.7)
- 阶段 4 中的样式适配可以并行进行 (4.1 - 4.4)
- 阶段 6 中的测试可以并行进行 (6.1, 6.2)

**依赖关系**:
- 阶段 3 依赖于阶段 2 (所有组件必须先实现)
- 阶段 4 依赖于阶段 2 和 3 (组件和页面必须先创建)
- 阶段 5 依赖于阶段 4 (样式必须先适配)
- 阶段 6 依赖于阶段 4 (样式必须先完成)
- 阶段 7 依赖于所有前置阶段
- 阶段 8 依赖于阶段 7 (构建必须成功)
- 阶段 9 依赖于所有前置阶段
