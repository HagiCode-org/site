# Astro 站点规范

## 规范元数据

- **规范 ID**: `astro-site`
- **提案 ID**: `migrate-docusaurus-to-astro`
- **创建日期**: 2026-01-29
- **状态**: 活跃

---

## 项目概述

Hagicode 文档站点使用 Astro 框架构建,提供高性能的文档和博客展示。

### 技术栈

- **框架**: Astro 5.x
- **UI 集成**: React 18.x
- **内容格式**: MDX + Markdown
- **样式**: CSS (保留 Infima 变量)
- **类型**: TypeScript 5.3.x
- **部署**: GitHub Pages

---

## 目录结构

```
pcode-docs/
├── astro.config.mjs              # Astro 配置文件
├── src/
│   ├── components/               # 组件目录
│   │   ├── home/                # 首页 React 组件
│   │   ├── Navbar.astro         # 导航栏
│   │   └── Footer.astro         # 页脚
│   ├── layouts/                 # 布局组件
│   │   ├── Layout.astro         # 根布局
│   │   └── DocsLayout.astro     # 文档布局
│   ├── pages/                   # 页面路由
│   │   ├── index.astro          # 首页
│   │   ├── docs/                # 文档路由
│   │   │   └── [...slug].astro  # 动态文档路由
│   │   └── blog/                # 博客路由
│   │       ├── index.astro      # 博客列表
│   │       └── [...slug].astro  # 博客详情
│   ├── content/                 # 内容集合
│   │   ├── config.ts            # 集合配置
│   │   ├── docs/                # 文档内容
│   │   └── blog/                # 博客内容
│   └── styles/                  # 样式文件
│       └── global.css           # 全局样式
└── public/                       # 静态资源
    ├── img/                     # 图片
    └── videos/                  # 视频
```

---

## 配置规范

### Astro 配置 (`astro.config.mjs`)

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import mermaid from '@astrojs/mermaid';

export default defineConfig({
  site: 'https://pcode-org.github.io',
  base: '/site',
  output: 'static',
  integrations: [
    react(),
    mdx(),
    mermaid(),
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
```

### TypeScript 配置 (`tsconfig.json`)

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 内容集合规范

### 文档集合

**路径**: `src/content/docs/`

**Frontmatter 要求**:

```yaml
---
title: 文档标题
description: 文档描述(可选)
---
```

**URL 结构**:
```
/site/docs/文件路径
```

### 博客集合

**路径**: `src/content/blog/`

**Frontmatter 要求**:

```yaml
---
title: 文章标题
description: 文章描述(可选)
publishDate: YYYY-MM-DD
author: 作者名(可选)
tags:
  - 标签1
  - 标签2
---
```

**URL 结构**:
```
/site/blog/文件路径
```

---

## 组件开发规范

### Astro 组件

- 文件扩展名: `.astro`
- 使用 `---` 分隔 frontmatter 和模板
- 优先使用静态组件,仅在必要时使用 `client:` 指令

```astro
---
// Frontmatter: 服务端代码
const title = "Hello";
---

<!-- Template: HTML -->
<h1>{title}</h1>
```

### React 组件

- 文件扩展名: `.tsx`
- 使用适当的 `client:` 指令
- 交互式组件必须使用 `client:load` 或 `client:visible`

```tsx
export default function Component() {
  return <div>Interactive Content</div>;
}
```

在 Astro 中使用:

```astro
---
import Component from './Component';
---

<Component client:visible />
```

### Client 指令指南

- `client:load` - 页面加载后立即 hydration(关键交互)
- `client:visible` - 元素可见时 hydration(默认推荐)
- `client:idle` - 浏览器空闲时 hydration(非关键)
- 无 `client:` 指令 - 静态 HTML(性能最优)

---

## 样式规范

### CSS 变量

保留 Infima 变量以维持一致性:

```css
:root {
  --ifm-color-primary: #2e8555;
  --ifm-font-size-base: 16px;
  --ifm-spacing-horizontal: 2rem;
}

[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
}
```

### 全局样式

- 文件路径: `src/styles/global.css`
- 在 `Layout.astro` 中导入
- 包含重置样式和基础样式

### 作用域样式

在 `.astro` 文件中使用 `<style>` 标签:

```astro
<div class="container">Content</div>

<style>
  .container {
    padding: 1rem;
  }
</style>
```

---

## 路由规范

### 文件系统路由

```
src/pages/index.astro          → /
src/pages/about.astro          → /about
src/pages/blog/index.astro     → /blog
```

### 动态路由

```
src/pages/blog/[slug].astro    → /blog/:slug
src/pages/docs/[...slug].astro → /docs/:path*
```

### getStaticPaths

用于动态路由生成静态页面:

```astro
---
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
---
```

---

## 性能优化规范

### 图片优化

使用 Astro Image 组件:

```astro
---
import { Image } from 'astro:assets';
---

<Image src={src} alt="Description" widths={[400, 800]} />
```

### 代码分割

- 仅对交互式组件使用 `client:` 指令
- 避免在顶层导入大型库
- 使用动态导入进行代码分割

### 构建优化

- 启用 `compressHTML: true`
- 使用 `inlineStylesheets: 'auto'`
- 避免不必要的依赖

---

## 插件和集成

### React 集成

- 包名: `@astrojs/react`
- 配置: `astro.config.mjs`
- 用途: 支持 React 组件

### MDX 集成

- 包名: `@astrojs/mdx`
- 配置: `astro.config.mjs`
- 用途: 支持 MDX 格式内容

### Mermaid 集成

- 包名: `@astrojs/mermaid`
- 配置: `astro.config.mjs`
- 用途: 渲染 Mermaid 图表

---

## 开发工作流

### 本地开发

```bash
npm run dev
```

访问: `http://localhost:4321/site/`

### 类型检查

```bash
npm run typecheck
```

### 构建生产版本

```bash
npm run build
```

输出目录: `dist/`

### 预览生产构建

```bash
npm run preview
```

---

## 部署规范

### 构建输出

- 目录: `dist/`
- 格式: 静态 HTML
- 包含: 所有资源文件

### 环境变量

创建 `.env` 文件:

```
CLARITY_PROJECT_ID=your_project_id
```

### CI/CD

- 触发条件: 推送到 `main` 分支
- 构建命令: `npm run build`
- 上传目录: `./dist`
- 部署平台: GitHub Pages

---

## 测试规范

### 视觉回归测试

- 手动检查所有页面
- 验证响应式布局
- 测试深色主题切换

### 性能测试

- 使用 Lighthouse
- 目标分数: >90
- 关键指标:
  - FCP < 1.5s
  - LCP < 2.5s
  - TTI < 3.5s

### 链接检查

- 验证所有内部链接
- 检查外部链接
- 确保无 404 错误

---

## 维护规范

### 依赖更新

定期更新依赖:

```bash
npm update
npm audit fix
```

### 内容更新

1. 编辑 `src/content/` 中的文件
2. 遵循 frontmatter 规范
3. 本地预览验证

### 组件更新

1. 修改组件文件
2. 确保类型正确
3. 运行类型检查

---

## 故障排除

### 常见问题

**构建失败**:
- 检查 TypeScript 错误
- 验证 frontmatter 格式
- 检查依赖版本

**样式问题**:
- 清除浏览器缓存
- 检查 CSS 变量
- 验证选择器

**路由问题**:
- 检查文件命名
- 验证 `getStaticPaths`
- 确认 URL 结构

---

## 参考资料

- [Astro 官方文档](https://docs.astro.build)
- [React 集成文档](https://docs.astro.build/en/guides/integrations-guide/react/)
- [内容集合文档](https://docs.astro.build/en/guides/content-collections/)
- [性能优化指南](https://docs.astro.build/en/guides/performance/)
