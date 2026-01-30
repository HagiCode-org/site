# Starlight 文档主题集成 - 技术设计

## 架构设计

### 当前架构

```
src/
├── layouts/
│   ├── Layout.astro           # 基础布局
│   └── DocsLayout.astro       # 文档布局(将被替换)
├── components/
│   ├── Navbar.astro           # 导航栏(将被替换)
│   ├── Footer.astro           # 页脚(将被替换)
│   ├── Sidebar.astro          # 侧边栏(将被替换)
│   ├── Tabs.astro/.tsx        # 标签页组件(将被替换)
│   ├── TableOfContents.astro  # 目录(保留可能需要适配)
│   └── home/                  # 首页组件(保留不变)
├── styles/
│   └── global.css             # 全局样式(需要适配)
└── content/
    ├── docs/                  # 文档内容(保留)
    └── blog/                  # 博客内容(保留)
```

### 目标架构

```
src/
├── layouts/
│   ├── Layout.astro           # 基础布局(保留用于首页)
│   └── BlogLayout.astro       # 博客布局(保留用于博客)
├── components/
│   ├── home/                  # 首页组件(保留不变)
│   └── [Starlight overrides]  # Starlight 组件覆盖(如需要)
├── styles/
│   └── global.css             # 全局样式 + Starlight 覆盖
└── content/
    ├── docs/                  # 文档内容(Starlight 自动读取)
    └── blog/                  # 博客内容(保留现有逻辑)
```

## 技术方案

### 1. Starlight 集成配置

#### 安装

```bash
npx astro add starlight
```

#### astro.config.mjs 配置

```javascript
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Hagicode Docs',
      description: 'Hagicode 项目文档',
      locale: 'zh-CN',
      isDevelopment: process.env.NODE_MODE === 'development',
      // 使用现有的 docs content collection
      sidebar: [
        {
          label: '快速开始',
          items: [
            { label: '安装', link: '/docs/quick-start/installation' },
            // ... 自动从 content collection 生成
          ]
        }
      ],
      // 保留现有主题变量
      customCss: [
        './src/styles/starlight-override.css'
      ],
      // 禁用默认的编辑链接(如不需要)
      editLink: {
        baseUrl: 'https://github.com/Hagicode-org/hagicode-docs/edit/main/'
      }
    }),
    react(),
    mdx()
  ]
});
```

**设计决策**:
- 使用 Starlight 的自动路由功能,从 `src/content/docs/` 读取内容
- 配置侧边栏以匹配现有的文档结构
- 保留 React 集成以支持首页组件
- 自定义 CSS 以保持品牌一致性

### 2. 导航结构迁移

#### 当前方式

当前使用 `src/content/config.ts` 定义 Content Collection,并在 `Sidebar.astro` 中手动构建导航树。

#### Starlight 方式

**选项 A: 自动侧边栏(推荐)**

```javascript
sidebar: [
  {
    label: '快速开始',
    autogenerate: { directory: 'quick-start' }
  },
  {
    label: '安装指南',
    autogenerate: { directory: 'installation' }
  }
]
```

**优点**:
- 自动从文件结构生成
- 添加新文档时无需手动更新配置

**缺点**:
- 需要调整 frontmatter 以控制排序和标签

**选项 B: 手动侧边栏**

```javascript
sidebar: [
  {
    label: '快速开始',
    items: [
      { label: '安装指南', link: '/docs/quick-start/installation' },
      { label: '创建项目', link: '/docs/quick-start/create-project' }
    ]
  }
]
```

**优点**:
- 完全控制导航结构
- 可以自定义排序和标签

**缺点**:
- 每次添加新文档需要手动更新配置

**设计决策**:
- 初期使用**混合方式**: 主要部分使用 `autogenerate`,特殊情况手动配置
- 评估后可调整为完全自动或完全手动

### 3. 样式系统适配

#### 现有 CSS 变量

当前在 `src/styles/global.css` 中定义的变量:

```css
:root {
  --ifm-color-primary: #2e8555;
  --color-text: #1c1e21;
  --color-background: #ffffff;
  --color-border: #e5e7eb;
  /* ... */
}
```

#### Starlight CSS 变量

Starlight 使用自己的 CSS 变量系统:

```css
--sl-color-white: ...
--sl-color-gray: ...
--sl-color-accent: ...
--sl-color-text: ...
--sl-color-bg: ...
```

#### 适配策略

**方案 A: 完全替换为 Starlight 变量**

- 移除现有的 `--color-*` 和 `--ifm-*` 变量
- 使用 Starlight 的 `--sl-*` 变量
- 通过 Starlight 配置自定义品牌颜色

**优点**:
- 完全利用 Starlight 的主题系统
- 减少变量冲突

**缺点**:
- 需要大量修改现有代码
- 可能丢失某些自定义样式

**方案 B: 保留现有变量 + 覆盖 Starlight 样式(推荐)**

1. 保留现有的 CSS 变量系统
2. 在 `starlight-override.css` 中映射 Starlight 变量到现有变量:

```css
/* 映射 Starlight 变量到现有品牌颜色 */
:root {
  --sl-color-accent: var(--ifm-color-primary);
  --sl-color-accent-low: ...;
  --sl-color-white: var(--color-background);
  --sl-color-text: var(--color-text);
  /* ... */
}
```

3. 覆盖特定组件样式以保持品牌一致性

**优点**:
- 保留现有的品牌设计
- 渐进式迁移,风险较低
- 可以逐步调整

**缺点**:
- 需要维护两套变量映射
- 可能存在变量名冲突

**设计决策**:
- 初期使用**方案 B**: 保留现有变量,映射到 Starlight
- 创建 `src/styles/starlight-override.css` 用于 Starlight 特定的覆盖
- 评估后可考虑迁移到 Starlight 原生变量

### 4. 组件迁移策略

#### 组件迁移映射

| 现有组件 | Starlight 对应 | 迁移策略 |
|---------|---------------|----------|
| `DocsLayout.astro` | Starlight 布局 | 替换为 Starlight 布局 |
| `Navbar.astro` | Starlight Header | 移除,使用 Starlight Header |
| `Footer.astro` | Starlight Footer | 移除,使用 Starlight Footer |
| `Sidebar.astro` | Starlight 侧边栏 | 移除,配置 Starlight 侧边栏 |
| `Tabs.astro/.tsx` | Starlight Tabs | 替换为 `<Tabs>` MDX 组件 |
| `TableOfContents.astro` | Starlight TOC | 移除,Starlight 内置 TOC |
| `ThemeButton.tsx` | Starlight 主题切换 | 移除,Starlight 内置 |
| `home/` 组件 | - | 保留,使用独立布局 |

#### 首页和博客处理

**首页** (`src/pages/index.astro`):
- 继续使用自定义的 `Layout.astro`
- 不使用 Starlight 布局
- 保留现有的 `home/` 组件

**博客** (`src/pages/blog/*.astro`):
- 继续使用自定义的 `BlogLayout.astro`
- 不使用 Starlight 布局
- 保留现有的博客功能

**文档页面** (`src/pages/docs/[...slug].astro`):
- **选项 A**: 移除自定义路由,让 Starlight 自动处理 `/docs/*`
- **选项 B**: 保留路由,内部使用 Starlight 组件

**设计决策**:
- 使用**选项 A**: 移除 `src/pages/docs/[...slug].astro`,让 Starlight 完全接管文档路由
- 保留首页和博客的独立布局和路由

### 5. Content Collections 适配

#### 当前配置

`src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // ... 其他 frontmatter 字段
  })
});

export const collections = { docs, blog };
```

#### Starlight 要求

Starlight 需要特定的 frontmatter 字段:
- `title`: 页面标题
- `description`: 页面描述
- `sidebar`: 侧边栏配置(可选)
- `sidebarLabel`: 自定义侧边栏标签(可选)
- `head`: 自定义 `<head>` 标签(可选)

#### 适配策略

**扩展 frontmatter schema**:

```typescript
const docs = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sidebar: z.enum(['left', 'right']).optional(), // Starlight
    sidebarLabel: z.string().optional(),          // Starlight
    head: z.array(z.any()).optional(),            // Starlight
    // 保留现有字段
    draft: z.boolean().optional(),
    // ...
  })
});
```

**设计决策**:
- 扩展现有 schema 以兼容 Starlight
- 所有现有 frontmatter 字段保留
- 逐步添加 Starlight 特定字段

### 6. 构建和部署适配

#### 构建配置

Starlight 会自动处理:
- 文档页面的路由生成
- SEO 元数据注入
- sitemap.xml 生成
- 搜索索引生成(如使用 Pagefind)

#### 环境变量

现有环境变量保持不变:
- `VITE_SITE_BASE`: 站点基础路径
- `CLARITY_PROJECT_ID`: Microsoft Clarity 分析 ID

#### GitHub Actions

无需修改现有的部署工作流:
- `npm run build` 会自动构建 Starlight 文档
- 输出目录仍为 `dist/`
- GitHub Pages 配置保持不变

### 7. 搜索功能集成

#### 选项

**A. Pagefind (推荐)**

```javascript
starlight({
  plugins: [
    pagefind({
      // 配置选项
    })
  ]
})
```

**优点**:
- 零配置,自动索引
- 无需构建时处理
- 搜索体验好

**缺点**:
- 需要额外的客户端 JavaScript

**B. 自定义搜索后端**

**优点**:
- 完全控制搜索逻辑

**缺点**:
- 需要维护搜索服务
- 增加复杂度

**设计决策**:
- 初期使用 **Pagefind**
- 评估后可考虑自定义搜索(如需要更高级功能)

### 8. 无障碍访问

Starlight 内置支持:
- 键盘导航(Tab、Shift+Tab、Enter、Space)
- 屏幕阅读器优化(ARIA 标签、语义化 HTML)
- 焦点指示器
- 跳过导航链接

**设计决策**:
- 完全依赖 Starlight 的 a11y 支持
- 移除自定义的 a11y 代码(如果有)
- 验证 WCAG 2.1 AA 级合规性

## 迁移步骤

### 阶段 1: 准备工作

1. 备份当前代码(创建分支)
2. 阅读Starlight官方文档
3. 创建 `src/styles/starlight-override.css`

### 阶段 2: 安装和基础配置

1. 安装 `@astrojs/starlight`
2. 配置 `astro.config.mjs`
3. 配置基础侧边栏
4. 测试构建

### 阶段 3: 样式适配

1. 映射 Starlight CSS 变量到现有变量
2. 覆盖特定组件样式
3. 测试深色/浅色模式
4. 测试响应式布局

### 阶段 4: 组件迁移

1. 移除 `DocsLayout.astro`、`Navbar.astro`、`Footer.astro`、`Sidebar.astro`
2. 移除 `src/pages/docs/[...slug].astro`
3. 更新 MDX 内容中的 `<Tabs>` 组件为 Starlight 语法
4. 测试所有文档页面

### 阶段 5: 功能验证

1. 测试导航功能
2. 测试主题切换
3. 测试搜索功能(如集成 Pagefind)
4. 测试 SEO 元数据
5. 测试移动端体验
6. 测试无障碍访问

### 阶段 6: 优化和清理

1. 移除未使用的自定义组件和样式
2. 更新 TypeScript 类型定义
3. 更新文档(如有必要)
4. 性能测试和优化

## 风险和缓解措施

### 风险 1: 样式冲突

**缓解措施**:
- 使用 CSS 变量映射,避免直接覆盖
- 逐步迁移样式,充分测试
- 使用 Starlight 的 `customCss` 选项注入覆盖样式

### 风险 2: 功能缺失

**缓解措施**:
- 提前评估 Starlight 功能是否满足需求
- 对于缺失功能,通过自定义组件补充
- 必要时覆盖 Starlight 组件

### 风险 3: 构建失败

**缓解措施**:
- 在 feature 分支进行开发
- 每个阶段后运行 `npm run build` 验证
- 使用 `--verbose` 模式调试构建问题

### 风险 4: 性能下降

**缓解措施**:
- 监控构建时间和输出大小
- 使用 Lighthouse 测试性能
- 只在必要时加载额外的 JavaScript

## 回滚计划

如果迁移失败或无法满足需求:

1. **立即回滚**:
   - 恢复到迁移前的 Git 分支
   - 移除 `@astrojs/starlight` 依赖
   - 恢复 `astro.config.mjs` 配置

2. **部分回滚**:
   - 保留 Starlight,但回滚样式更改
   - 恢复自定义组件,与 Starlight 并存

3. **长期支持**:
   - 保留原有组件代码在独立分支
   - 必要时可以快速切换回旧架构

## 测试策略

### 单元测试

- TypeScript 类型检查: `npm run typecheck`
- 组件渲染测试(如使用 Vitest)

### 集成测试

- 本地开发服务器: `npm run dev`
- 手动测试所有文档页面
- 测试导航、主题切换、搜索等功能

### 端到端测试

- 构建测试: `npm run build`
- 预览构建: `npm run preview`
- Lighthouse 审计(性能、SEO、a11y)
- 跨浏览器测试(Chrome、Firefox、Safari、Edge)

### 回归测试

- 首页功能正常
- 博客功能正常
- 所有文档页面正常显示
- 深色/浅色模式切换正常
- 移动端响应式布局正常

## 性能指标

### 目标

- **构建时间**: < 3 分钟(当前 < 5 分钟)
- **首次内容绘制(FCP)**: < 1.2 秒
- **可交互时间(TTI)**: < 3 秒
- **Lighthouse 性能分数**: > 90
- **Bundle size**: 不增加超过 50 KB gzipped

### 监控

- 使用 `npm run build -- --verbose` 监控构建时间
- 使用 Lighthouse CI 监控性能指标
- 使用 Bundle Analyzer 监控 bundle size

## 未来考虑

### 短期(1-3 个月)

- 评估是否需要自定义 Starlight 组件
- 优化搜索功能(如需要)
- 改进移动端体验

### 长期(3-6 个月)

- 评估是否迁移到 Starlight 原生 CSS 变量
- 考虑添加更多文档组件(如集成代码沙盒)
- 考虑添加用户反馈功能(如点赞、评论)

### 可选增强

- 集成 Algolia 搜索(替代 Pagefind)
- 添加多语言支持(如需要)
- 自定义 Starlight 主题颜色
- 添加文档版本控制

## 参考

- [Starlight 官方文档](https://starlight.astro.build)
- [Starlight 配置参考](https://starlight.astro.build/reference/configuration/)
- [Starlight 主题定制](https://starlight.astro.build/guides/overriding-components/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
