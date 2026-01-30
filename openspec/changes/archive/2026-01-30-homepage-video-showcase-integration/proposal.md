# 首页集成视频展示区块

## 概述

为首页添加视频展示区块,集成现有的 `BilibiliVideo.tsx` 组件,通过多媒体形式直观展示产品功能,提升用户体验和内容完整性。

## 背景

当前首页(`src/pages/index.astro`)已集成多个功能区块,包括 HeroSection、ActivityMetricsSection、FeaturesShowcase、ShowcaseSection 和 QuickStartSection。组件库中已存在 `BilibiliVideo.tsx` 组件(`src/components/home/BilibiliVideo.tsx`),该组件封装了 Bilibili 视频嵌入功能,基于 `VideoPlayer` 组件实现。

**技术环境**:
- **Astro 5.16** - 静态站点生成器,支持 React 组件混合渲染
- **React 18.2** - UI 框架,用于交互式组件
- **TypeScript 5.3** - 严格模式类型检查
- **组件位置**: `src/components/home/BilibiliVideo.tsx`
- **首页文件**: `src/pages/index.astro`
- **样式系统**: CSS Modules + 全局样式(`src/styles/homepage.css`)

## 问题

首页缺少视频展示区块,具体表现为:

1. **未集成现有组件**: `BilibiliVideo.tsx` 组件已实现但未在首页中使用
2. **缺少视频展示**: 用户无法通过首页直接观看产品演示视频
3. **内容不完整**: 作为产品文档站首页,缺少多媒体内容展示维度

## 解决方案

### 实施步骤

1. **创建视频展示区块组件** (`src/components/home/VideoShowcase.tsx`)
   - 使用 React + TypeScript 实现
   - 集成 `BilibiliVideo` 组件
   - 遵循项目命名规范(PascalCase)
   - 添加 CSS Modules 样式文件(`.module.css`)

2. **集成到首页** (`src/pages/index.astro`)
   - 在现有区块间插入视频展示组件
   - 使用 Astro 客户端指令(`client:load` 或 `client:visible`)优化性能
   - 保持区块加载优先级逻辑(Hero → Metrics → Features → Showcase → Video → QuickStart)

3. **样式适配** (`src/styles/homepage.css`)
   - 添加视频区块的全局样式变量
   - 确保响应式布局适配
   - 遵循项目 CSS 变量规范(定义在 `src/css/custom.css`)

4. **类型安全**
   - 确保 TypeScript 严格模式通过(`tsc --noEmit`)
   - 定义清晰的 Props 接口

### 技术细节

- **视频源**: Bilibili 平台
- **视频内容**:
  - **链接**: https://www.bilibili.com/video/BV1pirZBuEzq/
  - **标题**: 每天哈基半小时,AI多任务编程实战
  - **BV ID**: `BV1pirZBuEzq`
- **组件接口**:
  ```typescript
  interface BilibiliVideoProps {
    bvid: string;      // Bilibili 视频 ID (默认: "BV1pirZBuEzq")
    title?: string;    // 可选标题
  }
  ```
- **水合策略**: `client:visible`(视口内加载)或 `client:load`(首屏必需)

## 影响

### 预期成果

1. **用户体验提升**: 通过视频形式直观展示产品功能
2. **内容完整性**: 补充多媒体展示维度
3. **组件复用**: 有效利用现有 `BilibiliVideo.tsx` 组件

### 验证标准

- **本地开发测试**: `npm run dev` 无错误
- **类型检查**: `npm run typecheck` 通过
- **生产构建**: `npm run build` 成功
- **链接完整性**: 无断链导致构建失败(`onBrokenLinks: 'throw'`)

### 风险评估

- **低风险**: 组件已存在,仅需集成和样式调整
- **兼容性**: Bilibili 嵌入需要网络访问中国大陆资源
- **性能影响**: 使用延迟水合策略最小化 JS 束分影响

## 相关规格

- **astro-site**: 本提案将扩展此规格,添加首页视频展示区块的能力

## 时间线

- 预计实施时间: 1-2 小时
- 任务分解详见 `tasks.md`
