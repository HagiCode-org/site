# Starlight 文档主题集成 - 使用指南

## 提案概述

本提案旨在引入 **@astrojs/starlight** 作为文档站点的主题系统,替换当前的自定义主题组件,以获得专业级的文档功能、更好的 SEO 优化和更低的维护成本。

## 快速开始

### 1. 前置准备

在开始实施前,请确保:

- [ ] 已阅读 `proposal.md`,了解变更的背景和影响
- [ ] 已阅读 `design.md`,理解技术设计决策
- [ ] 已查看 `tasks.md`,了解所有实施步骤
- [ ] 已创建 feature 分支:`git checkout -b feat/starlight-integration`
- [ ] 已备份当前代码(创建分支或提交)

### 2. 安装 Starlight

```bash
# 使用 Astro CLI 自动安装
npx astro add starlight

# 或手动安装
npm install @astrojs/starlight
```

安装过程中,Cli 会询问:
- 是否需要自动配置 `astro.config.mjs`? 选择 **Yes**
- 是否需要创建示例文档? 选择 **No**(我们已有文档内容)

### 3. 配置 Starlight

编辑 `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    starlight({
      // 基础配置
      title: 'Hagicode Docs',
      description: 'Hagicode 项目文档',
      locale: 'zh-CN',

      // 侧边栏配置
      sidebar: [
        {
          label: '快速开始',
          autogenerate: { directory: 'quick-start' }
        },
        {
          label: '安装指南',
          autogenerate: { directory: 'installation' }
        },
        // ... 其他文档部分
      ],

      // 自定义 CSS
      customCss: [
        './src/styles/starlight-override.css'
      ],

      // 编辑链接(可选)
      editLink: {
        baseUrl: 'https://github.com/Hagicode-org/hagicode-docs/edit/main/'
      }
    }),
    react(),
    mdx()
  ]
});
```

### 4. 创建样式覆盖文件

创建 `src/styles/starlight-override.css`:

```css
/**
 * Starlight 样式覆盖
 * 将现有 CSS 变量映射到 Starlight 变量
 */

:root {
  /* 品牌颜色 */
  --sl-color-white: var(--color-background);
  --sl-color-text: var(--color-text);
  --sl-color-accent: var(--ifm-color-primary);
  --sl-color-accent-low: ...;

  /* 深色主题 */
  --sl-color-dark: var(--color-background);
  --sl-color-text-dark: var(--color-text);

  /* 边框和背景 */
  --sl-color-gray-1: var(--color-surface);
  --sl-color-gray-2: var(--color-border);
}
```

### 5. 更新 Content Collections Schema

编辑 `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  // 扩展 schema 以支持 Starlight 字段
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().optional(),

    // Starlight 特定字段
    sidebar: z.enum(['auto', 'left', 'right']).optional(),
    sidebarLabel: z.string().optional(),
    head: z.array(z.any()).optional(),

    // 保留现有字段
    // ... 其他自定义字段
  })
});

export const collections = { docs, blog };
```

### 6. 移除自定义组件

删除以下文件(Starlight 会替代它们):

```bash
# 备份到 src/components/_archive/
mkdir -p src/components/_archive
mkdir -p src/layouts/_archive

# 移动文件到备份目录
mv src/layouts/DocsLayout.astro src/layouts/_archive/
mv src/components/Navbar.astro src/components/_archive/
mv src/components/Footer.astro src/components/_archive/
mv src/components/Sidebar.astro src/components/_archive/
mv src/components/Tabs.* src/components/_archive/
mv src/components/ThemeButton.tsx src/components/_archive/
mv src/components/TableOfContents.* src/components/_archive/

# 删除文档路由
rm src/pages/docs/[...slug].astro
```

### 7. 测试

```bash
# 开发模式测试
npm run dev

# 构建测试
npm run build

# 预览构建
npm run preview

# 类型检查
npm run typecheck
```

## 常见问题

### Q: 如何自定义侧边栏顺序?

**A**: 在文档 frontmatter 中添加 `sidebar` 字段:

```yaml
---
title: 我的文档
sidebar:
  order: 1
---
```

### Q: 如何在侧边栏中隐藏某个文档?

**A**: 在文档 frontmatter 中添加:

```yaml
---
title: 内部文档
sidebar:
  hidden: true
---
```

### Q: 如何自定义 Starlight 组件?

**A**: 创建 `src/components/` 下的覆盖组件:

```astro
---
// src/components/StarlightHeader.astro
import Header from '@astrojs/starlight/components/Header.astro';
---

<!-- 自定义 Header -->
<Header />
```

然后在 `astro.config.mjs` 中配置:

```javascript
starlight({
  components: {
    Header: './src/components/StarlightHeader.astro'
  }
})
```

### Q: 如何集成搜索功能?

**A**: 使用 Pagefind 插件:

```bash
npx astro add starlight-pagefind
```

配置:

```javascript
starlight({
  plugins: [
    pagefind({
      // 配置选项
    })
  ]
})
```

### Q: 如何保留首页自定义设计?

**A**: 首页继续使用独立的路由和布局,不受 Starlight 影响:

- `src/pages/index.astro` 使用 `Layout.astro`
- 文档页面 `src/content/docs/*` 使用 Starlight 布局

### Q: 如何适配博客功能?

**A**: 博客继续使用自定义布局和路由,不受 Starlight 影响:

- `src/pages/blog/*` 继续使用 `BlogLayout.astro`
- `src/content/blog/*` Content Collections 保持不变

### Q: 样式冲突如何解决?

**A**:

1. 使用 CSS 变量映射,避免直接覆盖
2. 在 `starlight-override.css` 中使用更高优先级的选择器
3. 使用 `!important` 作为最后手段
4. 参考 [Starlight 主题定制指南](https://starlight.astro.build/guides/css-and-tailwind/)

## 验证清单

迁移完成后,请验证以下项目:

### 功能验证

- [ ] 所有文档页面正常显示
- [ ] 侧边栏导航正确显示
- [ ] 当前页面在侧边栏中高亮
- [ ] 主题切换功能正常(深色/浅色模式)
- [ ] 移动端响应式布局正常
- [ ] 搜索功能可用(如已集成)
- [ ] 面包屑导航显示正确
- [ ] 上一页/下一页导航正常

### 样式验证

- [ ] 品牌颜色正确显示
- [ ] 深色模式样式正确
- [ ] 浅色模式样式正确
- [ ] 代码块高亮正常
- [ ] 链接样式正确
- [ ] 按钮交互流畅

### 技术验证

- [ ] TypeScript 类型检查通过(`npm run typecheck`)
- [ ] 构建成功(`npm run build`)
- [ ] 开发服务器启动正常(`npm run dev`)
- [ ] 没有控制台错误
- [ ] SEO 元数据正确生成

### 性能验证

- [ ] Lighthouse 性能分数 > 90
- [ ] Lighthouse SEO 分数 > 90
- [ ] Lighthouse a11y 分数 > 90
- [ ] 构建时间合理(< 5 分钟)

### 兼容性验证

- [ ] Chrome/Edge 正常
- [ ] Firefox 正常
- [ ] Safari 正常(如可测试)
- [ ] 移动端浏览器正常

## 回滚计划

如果迁移遇到重大问题,可以按以下步骤回滚:

```bash
# 1. 切换回主分支
git checkout main

# 2. 删除 feature 分支
git branch -D feat/starlight-integration

# 3. 或者,如果需要保留工作
git checkout -b backup-starlight-attempt
git checkout main
git checkout feat/starlight-integration -- src/components/_archive/
```

## 参考资源

- [Starlight 官方文档](https://starlight.astro.build)
- [Starlight 配置参考](https://starlight.astro.build/reference/configuration/)
- [Starlight 主题定制](https://starlight.astro.build/guides/css-and-tailwind/)
- [Starlight 组件覆盖](https://starlight.astro.build/guides/overriding-components/)
- [Pagefind 文档](https://pagefind.app/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)

## 进阶定制

### 自定义主题颜色

在 `astro.config.mjs` 中:

```javascript
starlight({
  brand: {
    logo: {
      src: './src/assets/logo.svg',
      replacesTitle: true
    },
    favicon: './src/assets/favicon.ico'
  }
})
```

### 添加多语言支持(未来)

```javascript
starlight({
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN'
    },
    en: {
      label: 'English',
      lang: 'en'
    }
  }
})
```

### 自定义 404 页面

创建 `src/pages/404.md`:

```yaml
---
template: splash
title: 未找到页面
---

# 404 - 页面未找到

抱歉,您访问的页面不存在。
```

## 获取帮助

如果遇到问题:

1. 查看 [Starlight FAQ](https://starlight.astro.build/reference/faq/)
2. 在 [Starlight GitHub Discussions](https://github.com/withastro/starlight/discussions) 搜索
3. 查看 [Astro Discord](https://astro.build/chat) 的 #starlight 频道
4. 查看本项目的 `design.md` 了解技术决策

## 更新日志

在完成迁移后,请更新以下文档:

- [ ] `openspec/project.md` - 更新技术栈描述
- [ ] `README.md` - 更新项目介绍
- [ ] 创建迁移总结文档

---

**注意**: 本指南应与 `tasks.md` 一起使用,确保所有步骤都已完成。
