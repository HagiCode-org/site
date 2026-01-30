# 首页产品截图展示重构

## 概述

将首页 `ShowcaseSection` 组件从"社区项目链接列表"重构为"产品功能截图展示",利用已有的 6 张产品截图资源,更直观地展示 Hagicode 的核心功能和界面。

## 背景

当前首页的 `ShowcaseSection` 组件(位于 `src/components/home/`)展示的是社区项目链接列表(Hagicode CLI、Hagicode Docs、Hagicode Templates),采用卡片式布局。这种展示方式存在以下问题:

1. **内容定位不准确**: 现有内容展示的是外部项目链接,而非产品功能展示,与首页其他部分(如 FeaturesShowcase)的定位不协调
2. **资源利用不足**: 项目已从 Docusaurus 迁移到 Astro 5.x,6 张产品截图已存放在 `/public/img/home/` 目录下,但未被使用
3. **展示效果受限**: 卡片式布局无法直观展示产品界面和功能特性,用户难以快速了解产品实际使用体验

## 解决方案

### 核心改造

重构 `ShowcaseSection` 组件,将内容从"社区项目链接"改为"产品功能截图展示":

1. **组件结构调整**:
   - 移除外部链接卡片布局(`ShowcaseItem[]` 接口和相关数据)
   - 采用截图+文字说明的展示方式
   - 使用 `/public/img/home/` 中的 6 张 PNG 截图资源

2. **展示内容**(按建议顺序):
   - 亮色主题主界面 - 展示整体 UI 布局和亮色主题效果
   - 暗色主题主界面 - 展示主题切换功能和暗色主题效果
   - 实时 token 消耗报告 - 展示会话管理和成本监控功能
   - 使用 AI 的效率提升报告 - 展示统计分析和效率评估功能
   - 每日成就报告 - 展示成就系统和激励机制
   - 每日编写代码获得的成就 - 展示游戏化设计元素

3. **样式设计**:
   - 更新 CSS Modules 文件,设计适合截图展示的网格或轮播布局
   - 确保响应式设计,支持桌面端、平板和移动端
   - 保持与首页其他组件(HeroSection、FeaturesShowcase 等)的视觉一致性
   - 继续使用科技感设计风格(HUD/Sci-Fi FUI + Glassmorphism)

4. **组件命名**(可选):
   - 考虑将组件名称从 `ShowcaseSection` 更改为 `ProductScreenshotsSection` 或 `ProductShowcaseSection`
   - 同步更新关联的 CSS 文件名和首页导入语句

### 技术栈

- React 18.2 (通过 @astrojs/react 集成)
- TypeScript 5.3 (严格模式)
- CSS Modules (`.module.css` 文件)
- Astro 静态资源路径: `/img/home/<filename>.png`

## 影响范围

### 用户体验改进

1. **更直观的产品展示**: 通过实际界面截图帮助用户快速了解产品功能和界面设计
2. **增强视觉吸引力**: 真实的产品界面比纯文本或外部链接更有说服力
3. **降低学习曲线**: 用户可以预先看到产品界面,降低初次使用门槛
4. **提升首页转化率**: 清晰的功能展示有助于引导用户尝试产品

### 技术影响

1. **组件重构**:
   - 修改 `src/components/home/ShowcaseSection.tsx` 组件结构
   - 更新 `src/components/home/ShowcaseSection.module.css` 样式文件
   - 可能需要更新 `src/pages/index.astro` 导入语句(如果重命名组件)

2. **性能影响**:
   - 6 张 PNG 图片总大小约 880KB,需要考虑图片懒加载和优化
   - 使用 Astro 的 `client:idle` 指令已有延迟加载,无需额外优化
   - 可考虑添加图片加载状态指示器或骨架屏

3. **维护性提升**:
   - 截图更新时只需替换 `/public/img/home/` 目录中的图片文件
   - 说明文字集中管理在组件内部,便于后续调整
   - 无需维护外部链接和图标资源

### 风险和限制

1. **图片资源依赖**:
   - 截图文件必须存在于 `/public/img/home/` 目录
   - 图片文件名必须与代码中的引用一致
   - 建议在组件中添加缺失图片的降级处理

2. **响应式布局挑战**:
   - 桌面端可采用网格布局(2-3 列)
   - 移动端需要单列堆叠或水平滚动
   - 需要在不同设备尺寸下测试布局效果

3. **内容维护**:
   - 产品界面更新时需要同步更新截图
   - 截图内容应与当前产品版本保持一致
   - 建议建立截图更新流程和规范

## 验收标准

### 功能完整性

- [x] 组件成功展示 6 张产品截图
- [x] 每张截图配有简短的中文说明文字(1-2 句话)
- [x] 截图按推荐顺序展示:亮色主题→暗色主题→token 报告→效率报告→成就报告→成就详情
- [x] 组件在首页正确渲染,无控制台错误

### 视觉设计

- [x] 截图展示布局清晰,图片质量良好
- [x] 响应式设计支持桌面端(≥996px)、平板(768-995px)、移动端(<768px)
- [x] 样式与首页其他组件保持视觉一致性
- [x] 悬停效果和过渡动画流畅(如有)

### 代码质量

- [x] TypeScript 类型检查通过(`npm run typecheck`)
- [x] 生产构建成功(`npm run build`)
- [x] 组件代码遵循项目规范(严格模式、CSS Modules、路径别名)
- [x] 无 ESLint 错误或警告

### 浏览器兼容性

- [x] Chrome/Edge 最新版本
- [x] Firefox 最新版本
- [x] Safari 最新版本
- [x] 移动端浏览器(iOS Safari, Chrome Mobile)

## 后续工作

此重构为后续优化奠定基础:

1. **图片优化**: 可考虑使用 WebP 格式减少文件大小,或使用 Astro 的图片优化组件
2. **交互增强**: 可添加图片放大查看、轮播切换等交互功能
3. **本地化**: 如未来支持多语言,截图说明文字需要支持 i18n
4. **A/B 测试**: 可对比"截图展示"与"视频演示"的转化效果

## 相关文件

### 现有文件
- `src/components/home/ShowcaseSection.tsx` - 需要重构的组件
- `src/components/home/ShowcaseSection.module.css` - 需要更新的样式
- `src/pages/index.astro` - 首页,组件使用处
- `/public/img/home/*.png` - 产品截图资源(6 张文件)

### 参考
- `src/components/home/FeaturesShowcase.tsx` - 参考现有首页组件的设计模式
- `src/styles/global.css` - 全局 CSS 变量和主题定义
- `openspec/project.md` - 项目技术栈和规范说明
