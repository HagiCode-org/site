# 移除首页快速开始区块

## 概述

从首页完全移除"快速开始"(QuickStartSection)区块,简化首页布局并减少代码维护负担。该区块已不再符合当前首页设计理念,且功能可通过导航栏和其他区块替代。

## 背景

当前首页 (`src/pages/index.astro`) 包含一个"快速开始"区块,通过 React 组件展示 4 步快速入门指南:

1. 安装 Hagicode (Docker Compose)
2. 访问 Web 界面
3. 创建第一个项目
4. 开始编码

该区块使用:
- `src/components/home/QuickStartSection.tsx` - React 组件
- `src/components/home/QuickStartSection.module.css` - 样式模块
- 首页中的组件引用 (`<QuickStartSection client:load />`)

## 问题陈述

保留"快速开始"区块导致以下问题:

1. **首页内容冗余**: 功能与导航栏和 HeroSection 重复
2. **维护负担**: 需要维护不必要的代码和样式
3. **用户注意力分散**: 过多的行动号召影响核心信息传达
4. **与当前设计理念不符**: 首页应聚焦于展示产品特性和价值

## 解决方案

从首页完全移除 QuickStartSection 相关内容和文件:

### 代码层面变更

1. **移除组件引用**: 从 `src/pages/index.astro` 删除 QuickStartSection 导入和渲染
2. **删除组件文件**: 删除 `src/components/home/QuickStartSection.tsx`
3. **删除样式文件**: 删除 `src/components/home/QuickStartSection.module.css`

### 保留不变

- ✅ 快速开始文档内容 (`src/content/docs/quick-start/`) 完全保留
- ✅ 其他首页区块不受影响 (HeroSection, FeaturesShowcase, VideoShowcase, ActivityMetricsSection, ShowcaseSection, Footer)
- ✅ 导航栏和页脚保持原样
- ✅ 路径工具 (`src/utils/path.ts`) 和其他共享工具保留

## 影响范围

### 受影响区域

| 区域 | 影响 | 变更类型 |
|------|------|----------|
| `src/pages/index.astro` | 移除 QuickStartSection 导入和组件 | 文件修改 |
| `src/components/home/QuickStartSection.tsx` | 完全删除 | 文件删除 |
| `src/components/home/QuickStartSection.module.css` | 完全删除 | 文件删除 |

### 不受影响区域

| 区域 | 状态 | 说明 |
|------|------|------|
| 快速开始文档 | ✅ 不变 | `src/content/docs/quick-start/` 完全保留 |
| HeroSection | ✅ 不变 | 首屏区块保持原样 |
| FeaturesShowcase | ✅ 不变 | 功能展示区块保持原样 |
| VideoShowcase | ✅ 不变 | 视频展示区块保持原样 |
| ShowcaseSection | ✅ 不变 | 产品截图展示保持原样 |
| ActivityMetricsSection | ✅ 不变 | 活动指标区块保持原样 |
| Footer | ✅ 不变 | 页脚保持原样 |
| Navbar | ✅ 不变 | 导航栏保持原样 |

## 实施计划

详细的实施步骤请参阅 `tasks.md` 文件。

主要步骤包括:

1. 移除首页中的 QuickStartSection 引用
2. 删除组件和样式文件
3. 验证首页正常渲染
4. 验证构建和类型检查通过
5. 更新相关规范文档

## 验收标准

### 功能验证

- ✅ 首页加载正常,所有区块正确渲染
- ✅ 首页不包含"快速开始"区块内容
- ✅ 快速开始文档仍可通过导航访问

### 构建验证

- ✅ `npm run dev` - 开发服务器正常启动
- ✅ `npm run build` - 生产构建成功无错误
- ✅ `npm run typecheck` - TypeScript 类型检查通过
- ✅ `npm run preview` - 预览构建正常工作

### 规范验证

- ✅ OpenSpec 验证通过 (`openspec validate --strict`)

## 风险评估

### 低风险变更

- ✅ 仅删除未使用的组件
- ✅ 不影响核心功能
- ✅ 不影响文档内容
- ✅ 不影响其他首页区块
- ✅ 易于回滚 (可恢复删除的文件)

### 潜在问题

无显著风险。这是一个简单的代码清理变更。

## 预期收益

1. **代码简化**: 减少 ~150 行 TypeScript 代码和 ~240 行 CSS 代码
2. **维护负担降低**: 减少需要维护的组件数量
3. **首页更聚焦**: 突出核心产品特性展示
4. **构建产物优化**: 轻微减小 JavaScript bundle 大小

## 相关链接

- 相关规范: `openspec/specs/astro-site/spec.md` (Homepage 相关需求)
- 首页文件: `src/pages/index.astro`
- 组件目录: `src/components/home/`
