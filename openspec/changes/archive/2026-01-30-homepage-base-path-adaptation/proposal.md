# 首页图片和 Metrics 数据路径适配子路径部署

## 概述

修复首页组件在子路径部署场景下图片资源和 metrics 数据加载失败的问题。确保所有资源 URL 正确适配 `VITE_SITE_BASE` 环境变量,支持根路径 (`/`) 和子路径 (`/site`) 两种部署场景。

## 背景

### 当前问题

首页 (`src/pages/index.astro`) 包含两类动态数据加载:

1. **图片资源**: `src/components/home/ShowcaseSection.tsx` 中硬编码了图片路径 `/img/home/*.png`
2. **Metrics 数据**: `src/components/home/ActivityMetricsSection.tsx:225` 硬编码了数据路径 `/activity-metrics.json`

站点支持两种部署模式:
- 根路径部署: `VITE_SITE_BASE=/` 或未设置
- 子路径部署: `VITE_SITE_BASE=/site`

### 根本原因

- 图片路径和数据 URL 未使用现有的 `src/utils/path.ts` 工具函数
- 直接使用硬编码的绝对路径,未考虑 Astro 的 `base` 配置
- 组件未从运行时环境读取正确的 base 路径

### 现有基础设施

项目已具备完整的路径处理工具:
- `src/utils/path.ts`: 提供 `getBasePath()` 和 `withBasePath()` 函数
- `src/pages/index.astro:22`: 在 HTML 根元素设置 `data-site-base` 属性
- `src/components/home/HeroSection.tsx:135-136`: 已正确使用 `withBasePath()` 处理导航链接

## 影响范围

### 受影响的组件

| 组件 | 问题 | 影响 |
|------|------|------|
| `ShowcaseSection.tsx` | 图片路径硬编码 `/img/home/*.png` | 子路径部署时图片加载失败 (404) |
| `ActivityMetricsSection.tsx` | 数据 URL 硬编码 `/activity-metrics.json` | 子路径部署时数据加载失败 (404) |

### 不受影响的部分

- `HeroSection.tsx`: 已使用 `withBasePath()` 处理链接
- 其他首页组件: 未涉及动态资源加载

## 解决方案

### 技术方案

1. **修改 ShowcaseSection.tsx**
   - 导入 `withBasePath` 工具函数
   - 使用 `withBasePath()` 包装所有图片路径
   - 保持现有的错误处理逻辑

2. **修改 ActivityMetricsSection.tsx**
   - 导入 `withBasePath` 工具函数
   - 使用 `withBasePath('/activity-metrics.json')` 构建数据 URL
   - 保持现有的错误处理和空状态展示

### 代码示例

```typescript
// ShowcaseSection.tsx
import { withBasePath } from '../../utils/path';

const screenshots: ScreenshotItem[] = [
  {
    src: withBasePath('/img/home/亮色主题主界面.png'),
    // ...
  },
  // ...
];

// ActivityMetricsSection.tsx
import { withBasePath } from '../../utils/path';

useEffect(() => {
  fetch(withBasePath('/activity-metrics.json'))
    .then((res) => res.json())
    // ...
}, []);
```

## 兼容性

### 向后兼容

- ✅ 根路径部署 (`base=/`): `withBasePath('/img/...')` → `/img/...` (行为不变)
- ✅ 子路径部署 (`base=/site`): `withBasePath('/img/...')` → `/site/img/...` (修复问题)

### 环境变量

- `VITE_SITE_BASE`: 由 `npm run dev:site` 和 `npm run build:site` 设置
- 未设置时默认为 `/`,保持向后兼容

## 测试计划

### 验证场景

1. **根路径部署**
   ```bash
   npm run dev:root
   # 访问 http://localhost:4321/
   # 验证: 图片正常显示, metrics 数据正常加载
   ```

2. **子路径部署**
   ```bash
   npm run dev:site
   # 访问 http://localhost:4321/site/
   # 验证: 图片正常显示, metrics 数据正常加载
   ```

3. **生产构建验证**
   ```bash
   # 根路径构建
   npm run build
   npm run preview

   # 子路径构建
   npm run build:site
   npm run preview
   ```

### 验证清单

- [ ] ShowcaseSection: 所有 6 张图片正常加载
- [ ] ActivityMetricsSection: metrics 数据正常加载
- [ ] 无浏览器控制台 404 错误
- [ ] 两种部署模式下功能一致

## 风险评估

### 风险等级: 低

- 修改范围小,仅涉及两个组件
- 使用已验证的工具函数,风险可控
- 不影响其他组件和功能
- 向后兼容,不破坏现有功能

### 潜在问题

- 无明显风险点
- 修改后需在两种部署模式下全面测试

## 相关文件

### 修改文件

- `src/components/home/ShowcaseSection.tsx`
- `src/components/home/ActivityMetricsSection.tsx`

### 参考文件 (不修改)

- `src/utils/path.ts` - 路径工具函数
- `src/pages/index.astro` - 首页入口
- `src/components/home/HeroSection.tsx` - 正确使用示例

## 参考资料

- Astro Base Path 配置: https://docs.astro.build/en/reference/configuration-reference/#base
- 现有实现: `src/components/home/HeroSection.tsx:135-136`
