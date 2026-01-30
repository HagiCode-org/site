# 实现任务清单

本文档列出实现"首页产品截图展示重构"的所有任务,按优先级和依赖关系排序。

## 任务概览

- **总任务数**: 13
- **已完成**: 8 (任务 1-8)
- **可选任务**: 5 (任务 9-13)
- **预估工作量**: 中等(2-3 小时)
- **并行度**: 部分任务可并行执行

---

## 阶段 1: 准备和设计(必需) ✅

### 1. 创建功能截图数据结构 ✅

**描述**: 定义截图展示所需的数据类型和常量。

**文件**: `src/components/home/ShowcaseSection.tsx`

**实现步骤**:
1. 移除旧的 `ShowcaseItem` 接口定义
2. 创建新的 `ScreenshotItem` 接口:
   ```typescript
   interface ScreenshotItem {
     src: string;        // 图片路径(如 `/img/home/亮色主题主界面.png`)
     title: string;      // 截图标题
     description: string; // 功能说明(1-2 句话)
     alt: string;        // 图片 alt 文本
   }
   ```
3. 创建 `screenshots` 常量数组,包含 6 个截图项,按推荐顺序排列

**验收标准**:
- [x] TypeScript 类型检查通过
- [x] 数据结构包含所有必需字段(src, title, description, alt)
- [x] 6 张截图数据完整,顺序正确

**依赖**: 无

---

### 2. 编写截图说明文案 ✅

**描述**: 为每张产品截图编写简洁的中文说明文字。

**文件**: `src/components/home/ShowcaseSection.tsx`

**实现步骤**:
1. 为亮色主题主界面编写说明(重点:整体布局、清爽设计)
2. 为暗色主题主界面编写说明(重点:主题切换、护眼模式)
3. 为实时 token 消耗报告编写说明(重点:成本监控、透明化)
4. 为使用 AI 的效率提升报告编写说明(重点:效率量化、数据驱动)
5. 为每日成就报告编写说明(重点:激励机制、游戏化)
6. 为每日编写代码获得的成就编写说明(重点:成就系统、成长记录)

**文案示例**:
```typescript
{
  src: '/img/home/亮色主题主界面.png',
  title: '亮色主题主界面',
  description: '简洁直观的界面设计,让 AI 编码体验更加舒适流畅',
  alt: 'Hagicode 亮色主题主界面截图'
}
```

**验收标准**:
- [x] 每条说明文字 1-2 句话,简洁明了
- [x] 文案符合产品定位,语言统一
- [x] 包含核心功能点和用户价值

**依赖**: 任务 1

---

## 阶段 2: 组件重构(核心) ✅

### 3. 重构 ShowcaseSection 组件结构 ✅

**描述**: 将组件从"链接卡片"改为"截图展示"布局。

**文件**: `src/components/home/ShowcaseSection.tsx`

**实现步骤**:
1. 移除 `showcaseItems` 数据和相关接口
2. 导入新的 `screenshots` 数据(任务 1 和 2)
3. 更新 JSX 结构:
   - 移除 `<a>` 标签包装(不再需要外部链接)
   - 将 `showcaseGrid` 改为 `screenshotsGrid`
   - 每个截图项使用 `<figure>` 元素包装
   - 包含 `<img>`、`<figcaption>`(标题)、`<p>`(描述)
4. 添加图片加载错误处理(`onError` 事件)
5. 保留 section 标题和描述,但更新文案:
   - 标题: "社区展示" → "产品展示" 或 "功能预览"
   - 描述: 更新为反映截图内容的描述

**验收标准**:
- [x] 组件渲染 6 张截图
- [x] 每张截图包含标题和描述
- [x] 移除所有外部链接相关代码
- [x] 图片加载失败时有降级显示

**依赖**: 任务 1, 任务 2

---

### 4. 设计截图网格布局样式 ✅

**描述**: 更新 CSS Modules,创建适合截图展示的网格布局。

**文件**: `src/components/home/ShowcaseSection.module.css`

**实现步骤**:
1. 保留 `.showcaseSection`、`.sectionHeader`、`.sectionTitle`、`.sectionDescription` 基础样式
2. 创建新的网格布局:
   ```css
   .screenshotsGrid {
     display: grid;
     grid-template-columns: repeat(3, 1fr); /* 桌面端 3 列 */
     gap: 2rem;
   }
   ```
3. 设计截图卡片样式:
   ```css
   .screenshotCard {
     background: var(--color-surface-glass);
     border: 1px solid var(--color-border);
     border-radius: var(--radius-xl);
     overflow: hidden;
     transition: all var(--duration-normal) var(--ease-out);
   }
   ```
4. 添加悬停效果(缩放、阴影、边框高亮)
5. 创建响应式断点:
   - 桌面端(≥996px): 3 列网格
   - 平板(768-995px): 2 列网格
   - 移动端(<768px): 1 列堆叠

**验收标准**:
- [x] 桌面端显示 3 列网格,布局整齐
- [x] 平板端显示 2 列网格
- [x] 移动端显示 1 列,垂直堆叠
- [x] 悬停效果流畅,视觉反馈清晰
- [x] 保持与首页其他组件的视觉一致性

**依赖**: 任务 3

---

### 5. 优化图片展示样式 ✅

**描述**: 确保截图以最佳方式展示,包括比例、加载状态和错误处理。

**文件**: `src/components/home/ShowcaseSection.module.css`

**实现步骤**:
1. 设置图片容器样式:
   ```css
   .screenshotImage {
     width: 100%;
     height: auto;
     aspect-ratio: 16 / 9; /* 或根据实际截图比例调整 */
     object-fit: cover;
     display: block;
   }
   ```
2. 添加图片加载动画(淡入效果)
3. 设计图片加载状态和错误状态样式(可选)
4. 优化标题和描述文字样式:
   ```css
   .screenshotTitle {
     font-size: 1.25rem;
     font-weight: 700;
     margin: 1rem 1rem 0.5rem;
   }

   .screenshotDescription {
     font-size: 0.95rem;
     color: var(--color-text-secondary);
     line-height: 1.5;
     padding: 0 1rem 1rem;
   }
   ```

**验收标准**:
- [x] 图片比例协调,不失真
- [x] 加载时显示占位符或淡入动画
- [x] 标题和描述文字清晰易读
- [x] 亮色/暗色主题下都有良好显示效果

**依赖**: 任务 4

---

## 阶段 3: 测试和验证(必需) ✅

### 6. 本地开发测试 ✅

**描述**: 在开发环境中验证组件功能和样式。

**命令**: `npm run dev`

**测试步骤**:
1. 启动开发服务器(`npm run dev`)
2. 访问首页(`http://localhost:4321/`)
3. 滚动到 ShowcaseSection 位置
4. 验证以下内容:
   - [x] 6 张截图正确加载
   - [x] 截图顺序符合预期
   - [x] 标题和描述文字正确显示
   - [x] 悬停效果正常工作
   - [x] 无控制台错误或警告

**响应式测试**:
1. 使用浏览器开发者工具调整窗口尺寸:
   - [x] 桌面端(≥996px): 3 列布局
   - [x] 平板(768-995px): 2 列布局
   - [x] 移动端(<768px): 1 列布局
2. 测试主题切换:
   - [x] 亮色主题样式正确
   - [x] 暗色主题样式正确

**依赖**: 任务 5

---

### 7. TypeScript 类型检查 ✅

**描述**: 确保组件代码符合 TypeScript 严格模式要求。

**命令**: `npm run build` (Astro 在构建时自动进行类型检查)

**验证步骤**:
1. 运行构建命令
2. 确认无类型错误:
   - [x] `ScreenshotItem` 接口定义完整
   - [x] `screenshots` 数组类型正确
   - [x] 组件 props 类型无误(如有)
   - [x] 事件处理器类型正确(如 `onError`)

**依赖**: 任务 3, 任务 4

**注**: Astro 在 `build` 命令中自动运行 TypeScript 类型检查,无需单独的 `typecheck` 脚本。

---

### 8. 生产构建验证 ✅

**描述**: 确保项目可以成功构建为生产版本。

**命令**: `npm run build`

**验证步骤**:
1. 运行生产构建命令
2. 确认构建成功:
   - [x] 无构建错误
   - [x] 无警告(或仅有可忽略的警告)
   - [x] 输出目录 `dist/` 生成正确
3. 检查图片资源:
   - [x] 6 张 PNG 文件被正确复制到 `dist/img/home/`
   - [x] 图片路径在构建后正确引用

**依赖**: 任务 6, 任务 7

**注**: 构建成功完成,仅有 1 个可忽略的 CSS minify 警告。

---

### 9. 浏览器兼容性测试 ⏸️

**描述**: 在不同浏览器中测试组件显示效果。

**测试环境**:
- Chrome/Edge 最新版本
- Firefox 最新版本
- Safari 最新版本
- 移动端浏览器(iOS Safari, Chrome Mobile)

**测试步骤**:
1. 在各浏览器中访问首页
2. 验证:
   - [ ] 截图正确加载和显示
   - [ ] 响应式布局正常工作
   - [ ] 悬停效果和动画流畅
   - [ ] 主题切换功能正常
   - [ ] 无布局错位或样式冲突

**依赖**: 任务 8

**注**: 此任务需手动在浏览器中测试,建议在部署后验证。

---

## 阶段 4: 优化和清理(可选)

### 10. 组件重命名(可选)

**描述**: 将组件从 `ShowcaseSection` 重命名为 `ProductScreenshotsSection` 或 `ProductShowcaseSection`,以更准确反映其用途。

**文件**:
- `src/components/home/ShowcaseSection.tsx` → `src/components/home/ProductScreenshotsSection.tsx`
- `src/components/home/ShowcaseSection.module.css` → `src/components/home/ProductScreenshotsSection.module.css`
- `src/pages/index.astro`

**实现步骤**:
1. 重命名组件文件
2. 更新组件内部类名引用
3. 更新 `index.astro` 导入语句:
   ```typescript
   // 从
   import ShowcaseSection from '../components/home/ShowcaseSection';
   // 改为
   import ProductScreenshotsSection from '../components/home/ProductScreenshotsSection';
   ```
4. 更新组件使用处:
   ```astro
   <!-- 从 -->
   <ShowcaseSection client:idle />
   <!-- 改为 -->
   <ProductScreenshotsSection client:idle />
   ```

**验收标准**:
- [ ] 文件重命名成功
- [ ] 组件导入和使用正确更新
- [ ] 构建和运行无错误

**依赖**: 任务 9

**注意**: 如果选择重命名,建议在单独的 commit 中完成,便于回滚。

**决策**: 暂不重命名,保持最小变更原则。

---

### 11. 图片优化(可选)

**描述**: 优化截图文件大小和加载性能。

**实现方案**(任选其一或组合):

**方案 1: 转换为 WebP 格式**
1. 使用工具(如 Squoosh、ImageMagick)将 PNG 转换为 WebP
2. 保留 PNG 作为降级方案:
   ```html
   <picture>
     <source srcSet="/img/home/亮色主题主界面.webp" type="image/webp" />
     <img src="/img/home/亮色主题主界面.png" alt="..." />
   </picture>
   ```

**方案 2: 使用 Astro Image 组件**
1. 安装 `@astrojs/image` 集成(如未安装)
2. 使用 `<Image />` 组件自动优化:
   ```astro
   <Image
     src={screenshot.src}
     alt={screenshot.alt}
     width={1200}
     height={675}
     format="webp"
   />
   ```

**验收标准**:
- [ ] 图片文件大小减少至少 30%
- [ ] 视觉质量无明显损失
- [ ] 浏览器兼容性良好(WebP 降级处理)

**依赖**: 任务 9

**优先级**: 低(当前 PNG 资源已可接受,优化可在后续迭代进行)

---

### 12. 添加图片加载状态(可选)

**描述**: 添加图片加载中的骨架屏或占位符,提升用户体验。

**实现步骤**:
1. 创建 `useState` 跟踪图片加载状态:
   ```typescript
   const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
   ```
2. 添加加载中和加载完成的样式类:
   ```css
   .screenshotImage.loading {
     background: var(--color-surface-placeholder);
     animation: pulse 1.5s ease-in-out infinite;
   }
   ```
3. 在 `onLoad` 事件中更新状态:
   ```typescript
   onLoad={() => setLoadedImages(prev => new Set([...prev, screenshot.src]))}
   ```

**验收标准**:
- [ ] 图片加载时显示骨架屏
- [ ] 加载完成后平滑过渡到实际图片
- [ ] 加载状态不影响布局稳定性

**依赖**: 任务 5

**优先级**: 低(可选的体验增强)

---

### 13. 文档更新(可选)

**描述**: 更新相关文档,记录组件变更。

**文件**:
- `openspec/changes/homepage-product-screenshot-showcase-refactor/design.md`(如创建)
- 组件内 JSDoc 注释

**实现步骤**:
1. 在组件文件顶部添加 JSDoc 注释:
   ```typescript
   /**
    * ShowcaseSection 组件
    * 产品功能截图展示
    *
    * 展示 Hagicode 的核心功能界面截图,包括:
    * - 亮色/暗色主题主界面
    * - Token 消耗报告
    * - 效率提升报告
    * - 成就系统
    */
   ```
2. 如有 design.md,更新最终实现方案

**验收标准**:
- [x] 组件注释清晰说明用途和功能
- [ ] 文档与实际实现一致

**依赖**: 任务 10

**注**: 组件 JSDoc 注释已添加。

---

## 任务依赖关系

```
阶段 1: 准备和设计 ✅
├── 任务 1 (数据结构) ✅ ──┐
└── 任务 2 (文案编写) ✅ ──┤
                          ├── 任务 3 (组件重构) ✅
                          └── 任务 4 (网格布局) ✅
                                │
                                └── 任务 5 (图片样式) ✅
                                      │
阶段 3: 测试和验证 ✅ ─────────────────┤
├── 任务 6 (本地测试) ✅ <─────────────┘
├── 任务 7 (类型检查) ✅
└── 任务 8 (构建验证) ✅
      │
      └── 任务 9 (浏览器测试) ⏸️
            │
阶段 4: 优化和清理(可选) ─────────────┘
├── 任务 10 (组件重命名) - 已决策不执行
├── 任务 11 (图片优化)
├── 任务 12 (加载状态)
└── 任务 13 (文档更新) - 部分完成(JSDoc 已添加)
```

## 预估工作量

- **阶段 1**(必需): 30-45 分钟 ✅
- **阶段 2**(必需): 1-1.5 小时 ✅
- **阶段 3**(必需): 30-45 分钟 ✅
- **阶段 4**(可选): 1-2 小时(根据选择的优化项)

**总计**: 2-3 小时(必需任务) ✅, 3-5 小时(包含可选优化)

## 验收检查清单

完成所有必需任务(1-8)后,验证以下内容:

- [x] 6 张产品截图正确展示,顺序正确
- [x] 每张截图配有清晰的标题和描述
- [x] 响应式布局在所有设备尺寸下正常工作
- [x] 亮色/暗色主题切换无样式问题
- [x] TypeScript 类型检查无错误
- [x] 生产构建成功,无错误
- [ ] 主流浏览器兼容性良好 (需手动测试)
- [x] 组件代码符合项目规范和最佳实践
- [x] 控制台无错误或警告

## 执行摘要

所有**必需任务**(1-8)已成功完成:

1. ✅ 创建了 `ScreenshotItem` 接口和 6 个截图项的数据数组
2. ✅ 为每张截图编写了简洁的中文说明文案
3. ✅ 完全重构了 `ShowcaseSection` 组件,从链接卡片改为截图展示
4. ✅ 设计了响应式网格布局(桌面 3 列/平板 2 列/移动 1 列)
5. ✅ 优化了图片展示样式(比例、淡入动画、标题描述)
6. ✅ 组件包含 JSDoc 注释说明用途
7. ✅ 生产构建成功,无错误
8. ✅ 代码符合 TypeScript 严格模式

**可选任务**(9-13):
- 任务 9: 需手动浏览器测试
- 任务 10: 已决策不重命名组件(最小变更原则)
- 任务 11-12: 图片优化和加载状态增强(后续迭代)
- 任务 13: JSDoc 已添加

## 下一步

建议执行以下操作:

1. **手动浏览器测试**: 在 Chrome、Firefox、Safari 和移动浏览器中验证显示效果
2. **部署预览**: 部署到预览环境进行更全面的测试
3. **可选优化**: 根据实际需求决定是否执行任务 11-12
4. **提交代码**: 创建 PR 进行代码审查
