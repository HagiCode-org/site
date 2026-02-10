---
title: "Docusaurus 3.x 到 Astro 5.x 迁移实战：利用 Islands 架构实现性能与构建速度双重提升"
englishSlug: "migrate-docusaurus-to-astro-with-islands-architecture"
date: 2026-01-31
---

# 从 Docusaurus 3.x 到 Astro 5.x：HagiCode 站点迁移实战复盘

> 本文复盘了我们将 HagiCode 官方网站从 Docusaurus 3.x 迁移至 Astro 5.x 的全过程。我们将深入探讨如何通过 Astro 的 Islands 架构解决性能瓶颈，同时保留现有的 React 组件资产，实现构建速度与加载性能的双重提升。

<!-- truncate -->

## 背景

2026 年 1 月，我们对 HagiCode 的官方站点进行了一次"心脏移植手术"——将核心框架从 Docusaurus 3.x 全面迁移至 Astro 5.x。这不是一次冲动的大重构，而是经过深思熟虑的技术抉择。

在迁移前，我们的站点虽然功能完善，但逐渐显露出一些"富贵病"：构建产物体积臃肿、JavaScript 负载过高，且页面加载速度在复杂文档页面下不够理想。作为一个 AI 代码助手项目，HagiCode 需要频繁更新文档和功能介绍，构建效率直接影响发布速度。同时，我们希望站点对搜索引擎（SEO）更加友好，以便让更多开发者发现这个项目。

为了解决这些痛点，我们做了一个大胆的决定：整个构建系统推倒重来，迁移到 Astro。这个决定带来的变化，可能比你想象的还要大——稍后我会具体说。

## 关于 HagiCode

本文分享的站点迁移方案，来自我们在 [HagiCode](https://github.com/HagiCode-org/site) 项目中的实践经验。

HagiCode 是一款致力于提升开发效率的 AI 代码助手，我们不仅关注核心功能的迭代，同样重视开发者体验。这次站点的重构，也是为了让用户在浏览文档和官网时能获得极致的加载速度。

## 为什么要放弃成熟的 Docusaurus？

在 React 生态中，Docusaurus 一直是文档站点的"标准答案"。它开箱即用，插件丰富，社区活跃。但是，随着 HagiCode 功能的增加，我们也感受到了它的局限性：

1.  **性能瓶颈**：Docusaurus 本质上是一个 React SPA（单页应用）。哪怕你是写纯静态页面，客户端也需要加载 React 运行时并进行水合，这对于简单的文档页面来说太重了。
2.  **资源体积**：即便页面内容很少，打包后的 JS 体积也相对固定，这对移动端用户和网络较差的环境不够友好。
3.  **灵活性不足**：虽然也能扩展，但在构建流程的定制上，我们渴望拥有更底层的控制权。

Astro 的出现正好解决了这些问题。它提供了一个全新的"岛屿架构"（Islands Architecture）：默认情况下，Astro 生成零 JavaScript 的静态 HTML，只有需要交互的组件才会"激活"并加载 JS。这意味着我们的站点大部分内容都是纯 HTML，速度极快。

## 迁移核心策略：架构平滑过渡

迁移不是简单的复制粘贴，而是思维模式的转变。我们从 Docusaurus 的"全 React 模式"切换到了 Astro 的"Core + Islands"模式。

### 1. 配置系统的重构

首先，我们需要从 `docusaurus.config.ts` 转向 `astro.config.mjs`。这不仅是文件名的变化，更是路由和构建逻辑的重写。

在 Docusaurus 中，一切皆插件；而在 Astro 中，一切皆集成。我们需要重新定义站点的基础路径、构建输出模式（静态 vs SSR）以及资源压缩策略。

**迁移前：**
```typescript
// docusaurus.config.ts
export default {
  title: 'HagiCode',
  url: 'https://hagicode.com',
  baseUrl: '/',
  // ... 更多配置
};
```

**迁移后：**
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://hagicode.com',
  base: '/',
  // 针对静态资源的优化配置
  build: {
    inlineStylesheets: 'auto',
  },
});
```

### 2. React 组件的去留与改造

这是迁移中最头疼的部分。我们现有的站点有很多 React 组件（比如 Tabs 组件、代码高亮、反馈按钮等）。直接扔掉太可惜，全都保留又会导致 JS 负载过重。

HagiCode 采用了**渐进式水合**策略：
*   **纯静态组件**：对于展示型内容（如页眉、页脚、纯文本文档），重写为 Astro 组件（`.astro` 文件），在构建时直接渲染为 HTML。
*   **交互式岛屿**：对于必须保留交互的组件（如主题切换器、Tabs 切换、代码块复制按钮），保留 React 实现，并添加 `client:load` 或 `client:visible` 指令。

例如，我们的文档中常用的 Tabs 组件：

```jsx
// src/components/Tabs.jsx
import { useState } from 'react';
import './Tabs.css'; // 引入样式

export default function Tabs({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // ... 状态逻辑
  return (
    <div className="tabs-wrapper">
      {/* 渲染逻辑 */}
    </div>
  );
}
```

在 Markdown 中使用时，我们明确告诉 Astro："这个组件需要 JS"：

```markdown
// src/content/docs/example.mdx
import Tabs from '../../components/Tabs.jsx';

<!-- 只在组件进入视口时才加载 JS -->
<Tabs client:visible items={...} />
```

这样，非视口内的交互组件不会抢占带宽，极大地优化了首屏加载速度。

### 3. 样式系统的适配：CSS Modules 到 Scoped

Docusaurus 默认支持 CSS Modules，而 Astro 推崇使用 Scoped CSS（通过 `<style>` 标签）。两者的核心思想都是隔离样式，但语法不同。

在 HagiCode 的迁移中，我们将大部分复杂的 CSS Modules 拆解为 Astro 的 Scoped 样式。这其实是件好事，因为在 `.astro` 文件中，样式和模板写在同一个文件里，维护起来更加直观。

**改造前：**
```css
/* Tabs.module.css */
.wrapper { background: var(--ifm-background-color); }
```

**改造后 (Astro Scoped):**
```html
<!-- Tabs.astro -->
<div class="tabs-wrapper">
  <slot />
</div>

<style>
  .tabs-wrapper {
    /* 直接使用 CSS 变量，适配主题 */
    background: var(--bg-color);
    padding: 1rem;
  }
</style>
```

同时，我们统一了全局 CSS 变量系统，利用 Astro 的环境感知能力，确保暗色模式在不同页面间的切换无缝衔接。

## 实践中的坑与解决方案

在 HagiCode 的实际迁移过程中，我们遇到了不少坑，这里挑几个最典型的分享一下。

### 1. 路径与环境变量的痛点

HagiCode 支持子路径部署（比如部署到 GitHub Pages 的子目录）。在 Docusaurus 中，它自动处理 `baseUrl`。但在 Astro 中，处理图片链接和 API 请求时，我们需要更小心。

我们引入了环境变量机制来统一管理：

```javascript
// 在构建脚本中处理路径
const getBasePath = () => import.meta.env.VITE_SITE_BASE || '/';
```

切记，不要在代码中硬编码 `/` 开头的路径。在开发环境和生产环境，或者配置了 `base` 路径后，这会导致资源 404。

### 2. CommonJS 脚本的兼容

我们的旧站点有一些 Node.js 脚本（用于自动抓取 Metrics 数据、更新 sitemap 等），它们是用 CommonJS (`require`) 写的。Astro 和现代构建工具全面拥抱 ES Modules (`import`/`export`)。

如果你也有类似的脚本，记得把它们全部重构为 ES Modules。这是大势所趋，早点改了早点省心。

```javascript
// 旧方式
const fs = require('fs');

// 新方式
import fs from 'fs';
```

### 3. 别忘了 SEO 与重定向

搜索引擎已经收录了 HagiCode 旧的 Docusaurus 页面。如果直接切到 Astro，URL 结构发生变化，会导致大量 404，权重大跌。

我们在 Astro 中配置了重定向规则：

```javascript
// astro.config.mjs
export default defineConfig({
  redirects: {
    '/docs/old-path': '/docs/new-path',
    // 批量映射旧链接到新链接
  }
});
```
或者在服务器配置层面处理。确保旧链接能 301 重定向到新地址，这对 SEO 至关重要。

## 总结

从 Docusaurus 迁移到 Astro，对 HagiCode 来说，不仅仅是一次框架升级，更是一次对"性能优先"理念的实践。

**我们的收获：**
*   **极致的 Lighthouse 分数**：迁移后，HagiCode 站点的性能评分轻松接近满分。
*   **更快的构建速度**：Astro 的增量构建让我们文档更新的发布时间缩短了一半。
*   **保留了灵活性**：通过 Islands 架构，我们没有牺牲任何交互功能，依然可以在需要的地方使用 React。

如果你也在维护文档型站点，并且深受打包体积或加载速度的困扰，不妨试试 Astro。虽然迁移过程需要动动手术（比如把 PCode 的名字改成 HagiCode，把组件一个个挖过来），但换来的是如丝般顺滑的用户体验，绝对值得。

本文分享的构建系统，正是我们在开发 HagiCode 过程中实际踩坑、实际优化出来的方案。如果你觉得这套方案有价值，说明我们的工程实力还不错——那么 HagiCode 本身也值得关注一下。

## 参考资料

- [Astro 官方文档](https://docs.astro.build)
- [从 Docusaurus 迁移指南](https://docs.astro.build/en/guides/migrate-to-astro/migrate-from-docusaurus/)
- [Islands 架构详解](https://docs.astro.build/en/core-concepts/islands/)
- **HagiCode 项目地址**：[github.com/HagiCode-org/site](https://github.com/HagiCode-org/site)
- **HagiCode 官网**：[hagicode-org.github.io/site](https://hagicode-org.github.io/site)
- **一键安装体验**：[hagicode-org.github.io/site/docs/installation/docker-compose](https://hagicode-org.github.io/site/docs/installation/docker-compose)

如果本文对你有帮助，欢迎来 GitHub 给个 Star，公测已经开始啦！



---

感谢您的阅读,如果您觉得本文有用,快点击下方点赞按钮👍,让更多的人看到本文。

本内容采用人工智能辅助协作,经本人审核,符合本人观点与立场。

- **本文作者:** [newbe36524](https://www.newbe.pro)
- **本文链接:** [https://hagicode-org.github.io/site/blog/2026-01-31-migrate-docusaurus-to-astro-with-islands-architecture/](https://hagicode-org.github.io/site/blog/2026-01-31-migrate-docusaurus-to-astro-with-islands-architecture/)
- **版权声明:** 本博客所有文章除特别声明外,均采用 BY-NC-SA 许可协议。转载请注明出处!