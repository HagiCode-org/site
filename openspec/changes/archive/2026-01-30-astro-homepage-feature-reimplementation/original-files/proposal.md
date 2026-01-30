# Change: Astro 框架首页功能重构实现

## Why

项目已于 2026 年 1 月完成从 **Docusaurus 3.x** 到 **Astro 5.x** 的框架迁移。当前首页 (`src/pages/index.astro`) 尚未创建,需要重新实现原有的功能丰富的首页展示效果。

原有的首页在 Docusaurus 主题下实现了完整的用户引导和功能展示,包括:
- 产品核心特性展示 (智能、便捷、有趣三大特性)
- 快速开始入口
- 交互式组件和动画效果
- 活动指标数据集成 (Docker Hub 拉取量、Clarity 活跃用户)
- 视频展示 (Bilibili 视频)
- 社区展示区域

当前 Starlight 主题提供了基础的首页,但缺乏原有的自定义交互组件和动态数据展示。

## What Changes

### 核心变更

**移除 Starlight 默认首页**
- 移除 Starlight 提供的默认首页 Hero 组件
- 使用自定义 Astro 页面替代

**创建自定义首页组件架构**
- 在 `src/components/home/` 目录创建 React 组件
- 在 `src/pages/index.astro` 中集成组件
- 利用 Astro 的 React 集成 (`@astrojs/react`)
- 使用 Framer Motion 实现动画效果

**实现核心功能模块**

1. **HeroSection** - Hero 区域组件
   - 产品标题和描述 ("智能 · 便捷 · 有趣")
   - CTA 按钮 (开始使用、了解更多)
   - QQ 群加入卡片

2. **ActivityMetricsSection** - 活动指标数据展示
   - Docker Hub 镜像拉取量
   - Clarity 活跃用户数和会话数
   - 数字滚动动画效果
   - 骨架屏加载状态
   - 从 `/public/activity-metrics.json` 加载数据

3. **FeaturesShowcase** - 特性展示
   - 智能特性 (OpenSpec 工作流)
   - 便捷特性 (多线程会话管理)
   - 有趣特性 (成就系统)
   - 交互式动画效果

4. **VideoPlayer** 和 **BilibiliVideo** - 视频展示
   - 视频播放器组件
   - Bilibili 嵌入视频

5. **ShowcaseSection** - 社区展示
   - 社区项目展示
   - 用户案例展示

6. **QuickStartSection** - 快速开始引导
   - 安装指南入口
   - 快速开始文档链接

**样式适配**
- 创建 `src/components/home/*.module.css` 模块化样式
- 复用 Starlight 主题的 CSS 变量
- 保持与原有 Docusaurus 首页一致的视觉设计
- 支持暗色模式

**性能优化**
- 利用 Astro 的零 JS 默认特性
- 仅对交互组件进行选择性水合 (`client:load`, `client:visible`)
- 使用静态 HTML 优先的渲染策略

## Impact

### Affected Specs
- `astro-site` - 需要更新"Custom Homepage"需求

### Affected Code

**新增文件**
- `src/pages/index.astro` - 自定义首页
- `src/components/home/HeroSection.tsx` - Hero 区域组件
- `src/components/home/HeroSection.module.css` - Hero 样式
- `src/components/home/ActivityMetricsSection.tsx` - 活动指标组件
- `src/components/home/ActivityMetricsSection.module.css` - 活动指标样式
- `src/components/home/FeaturesShowcase.tsx` - 特性展示组件
- `src/components/home/FeaturesShowcase.module.css` - 特性展示样式
- `src/components/home/VideoPlayer.tsx` - 视频播放器组件
- `src/components/home/VideoPlayer.module.css` - 视频播放器样式
- `src/components/home/BilibiliVideo.tsx` - Bilibili 视频组件
- `src/components/home/BilibiliVideo.module.css` - Bilibili 视频样式
- `src/components/home/ShowcaseSection.tsx` - 社区展示组件
- `src/components/home/ShowcaseSection.module.css` - 社区展示样式
- `src/components/home/QuickStartSection.tsx` - 快速开始组件
- `src/components/home/QuickStartSection.module.css` - 快速开始样式

**修改文件**
- `astro.config.mjs` - 可能需要更新 Starlight 配置以支持自定义首页
- `public/activity-metrics.json` - 确保活动指标数据文件存在

**保留文件**
- `public/` - 静态资源 (图片、视频、数据文件)
- `src/styles/` - 全局样式

### Expected Benefits

**用户体验**
- 恢复首页的功能完整性,提供清晰的产品介绍
- 新用户可通过首页快速了解 Hagicode 的核心功能
- 现有用户可通过首页快速访问常用功能和文档
- 动态数据展示提升社区活跃度感知

**技术债务**
- 完成框架迁移的最后关键环节
- 建立符合 Astro 最佳实践的首页组件模式
- 为未来的功能迭代提供可维护的代码基础

**性能提升**
- 利用 Astro 的零 JS 默认特性,首屏加载更快
- 选择性水合减少不必要的 JavaScript
- 静态 HTML 优先提升 SEO

### Risks & Mitigations

**React 组件迁移成本**
- 风险: Docusaurus 特定组件需要调整为 Astro 兼容格式
- 缓解: 使用 Astro React 集成,最小化组件改动;保持组件逻辑不变

**样式适配复杂度**
- 风险: Docusaurus 主题样式与 Starlight 主题样式差异
- 缓解: 使用模块化 CSS,复用 Starlight CSS 变量,独立管理组件样式

**数据集成兼容性**
- 风险: 活动指标数据加载可能失败
- 缓解: 添加错误处理和骨架屏加载状态,确保优雅降级

**动画性能**
- 风险: Framer Motion 动画可能影响性能
- 缓解: 使用 `client:visible` 指令延迟加载,优化动画复杂度

**Starlight 集成**
- 风险: 自定义首页可能与 Starlight 主题冲突
- 缓解: 使用独立的页面文件,不修改 Starlight 核心组件

### Rollback Plan

如果实现失败或出现问题,可以通过以下步骤回滚:

1. 删除 `src/pages/index.astro` 文件
2. 删除 `src/components/home/` 目录
3. Starlight 将自动恢复默认首页
4. 从 git 恢复 `astro.config.mjs` (如果修改)

### Dependencies

**前置依赖**
- Astro 5.16 框架已配置
- React 集成 (`@astrojs/react`) 已启用
- Framer Motion 已安装 (`framer-motion ^12.26.1`)
- TypeScript 配置已完成

**数据依赖**
- `public/activity-metrics.json` - 活动指标数据 (已存在)

**外部依赖**
- Bilibili 视频嵌入 (iframe)
- Microsoft Clarity 数据 (已有集成)
- Docker Hub 数据 (已有集成)

## Success Criteria

### 验收标准

**功能完整性**
- ✅ 首页包含所有原有功能模块 (Hero、ActivityMetrics、Features、Video、Showcase、QuickStart)
- ✅ 所有交互组件正常工作 (动画、按钮、链接)
- ✅ 活动指标数据正确加载和显示
- ✅ 视频播放器正常工作

**构建和类型检查**
- ✅ 本地开发服务器 (`npm run dev`) 正常渲染首页
- ✅ 生产构建 (`npm run build`) 无错误
- ✅ TypeScript 类型检查通过 (`npm run typecheck`)
- ✅ 无 ESLint 或 TypeScript 警告

**响应式和主题**
- ✅ 响应式布局在不同设备上正常显示 (mobile、tablet、desktop)
- ✅ 暗色模式切换正常工作
- ✅ 所有组件在亮色和暗色主题下视觉一致

**性能和质量**
- ✅ Lighthouse 性能分数 > 90
- ✅ 无明显的 CLS (Cumulative Layout Shift)
- ✅ 首屏加载时间 < 2s
- ✅ 动画流畅 (60fps)

**兼容性**
- ✅ 所有主流浏览器正常渲染 (Chrome、Firefox、Safari、Edge)
- ✅ 无 JavaScript 运行时错误
- ✅ 所有链接正确导航

## Timeline Estimate

**阶段 1: 基础架构** (预计 2-3 小时)
- 创建目录结构
- 实现 HeroSection 组件
- 实现 ActivityMetricsSection 组件
- 集成到 index.astro

**阶段 2: 核心功能** (预计 4-5 小时)
- 实现 FeaturesShowcase 组件
- 实现 VideoPlayer 和 BilibiliVideo 组件
- 实现 ShowcaseSection 组件
- 实现 QuickStartSection 组件

**阶段 3: 样式和优化** (预计 2-3 小时)
- 适配所有组件样式
- 响应式布局调整
- 暗色模式适配
- 性能优化和测试

**总计**: 预计 8-11 小时

## Open Checklist

- [ ] 首页已创建 (`src/pages/index.astro`)
- [ ] HeroSection 组件已实现
- [ ] ActivityMetricsSection 组件已实现
- [ ] FeaturesShowcase 组件已实现
- [ ] VideoPlayer 组件已实现
- [ ] BilibiliVideo 组件已实现
- [ ] ShowcaseSection 组件已实现
- [ ] QuickStartSection 组件已实现
- [ ] 所有组件样式已适配
- [ ] 响应式布局已完成
- [ ] 暗色模式正常工作
- [ ] 本地开发测试通过
- [ ] 生产构建测试通过
- [ ] TypeScript 类型检查通过
- [ ] 性能测试通过
- [ ] 浏览器兼容性测试通过
