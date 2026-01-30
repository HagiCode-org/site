# 外部链接新标签页打开 - 设计文档

## 架构设计

### 系统架构

本文档描述如何在 Hagicode 文档站点中实现外部链接在新标签页打开的功能。实现基于 Astro 的 Markdown/MDX 渲染管道,通过 rehype 插件在构建时自动处理外部链接。

```
┌─────────────────────────────────────────────────────────────────┐
│                     内容创作层                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Markdown 文件 │  │  MDX 文件     │  │  React 组件   │          │
│  │ .md          │  │  .mdx        │  │  .tsx        │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Astro 构建管道                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Content Collections                                     │   │
│  │  - 读取 frontmatter                                      │   │
│  │  - 验证内容结构                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Markdown/MDX 渲染                                        │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  rehypePlugins:                                    │  │   │
│  │  │  1. rehypeRaw (已存在)                            │  │   │
│  │  │  2. rehypeMermaid (已存在)                        │  │   │
│  │  │  3. rehypeExternalLinks (新增) ← 在此添加          │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              rehypeExternalLinks 插件处理                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  遍历 HTML 树中的 <a> 标签                                │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  对于每个 <a> 标签:                                 │  │   │
│  │  │  1. 检查 href 属性                                  │  │   │
│  │  │  2. 判断是否为外部链接:                             │  │   │
│  │  │     - 以 http:// 或 https:// 开头                   │  │   │
│  │  │     - 域名不在内部白名单中                          │  │   │
│  │  │  3. 如果是外部链接:                                 │  │   │
│  │  │     - 添加 target="_blank"                         │  │   │
│  │  │     - 添加 rel="noopener noreferrer"               │  │   │
│  │  │  4. 如果是内部链接:                                 │  │   │
│  │  │     - 保持不变                                      │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      输出层                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ 静态 HTML    │  │  客户端 JS   │  │  资源文件     │          │
│  │ 所有外部     │  │  (按需)      │  │  CSS, 图片    │          │
│  │ 链接已处理   │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 技术选型

#### 选项 1: rehype-external-links (推荐)

**优点**:
- 专门为 rehype 设计的成熟插件
- 配置简单,开箱即用
- 维护活跃,社区支持好
- 支持灵活的白名单/黑名单配置

**缺点**:
- 需要额外依赖
- 可能与其他 rehype 插件有兼容性问题(需测试)

**实现示例**:
```javascript
// astro.config.mjs
import rehypeExternalLinks from 'rehype-external-links'

export default defineConfig({
  markdown: {
    rehypePlugins: [
      rehypeRaw,
      rehypeMermaid,
      [rehypeExternalLinks, {
        target: '_blank',
        rel: ['noopener', 'noreferrer'],
        // 排除内部域名
        exclude: []
      }]
    ],
  },
})
```

#### 选项 2: 自定义 rehype 插件

**优点**:
- 完全控制逻辑
- 无额外依赖
- 可以根据项目需求定制

**缺点**:
- 需要维护自定义代码
- 需要了解 rehype AST 结构
- 测试和调试更复杂

**实现示例**:
```javascript
// src/integrations/rehype-external-links.ts
import type { Options } from 'rehype'
import { visit } from 'unist-util-visit'

export default function rehypeExternalLinks(options: Options = {}) {
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'a' && node.properties) {
        const href = node.properties.href
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
          // 检查是否为内部域名
          const internalDomains = ['hagicode-org.github.io', 'localhost']
          const isExternal = !internalDomains.some(domain =>
            href.includes(domain)
          )

          if (isExternal) {
            node.properties.target = '_blank'
            node.properties.rel = ['noopener', 'noreferrer']
          }
        }
      }
    })
  }
}
```

#### 选项 3: ESLint 规则 + 组件包装器

**优点**:
- 强制开发人员使用正确的组件
- 类型安全
- 运行时控制

**缺点**:
- 无法处理现有 Markdown 文件
- 需要大量代码修改
- 不适用于纯 Markdown 内容

**不推荐原因**: 覆盖范围有限,维护成本高

### 最终选择

**推荐使用选项 1 (rehype-external-links)**,原因如下:

1. **覆盖范围完整**: 处理所有 Markdown/MDX 内容中的链接
2. **实现简单**: 最小化代码修改
3. **维护成本低**: 使用成熟的社区插件
4. **性能影响小**: 构建时处理,不影响运行时性能

## 配置设计

### 内部域名白名单

需要排除的域名列表:

1. **生产域名**:
   - `hagicode-org.github.io` (GitHub Pages)
   - `hagicode.org` (如果使用自定义域名)

2. **本地开发域名**:
   - `localhost`
   - `127.0.0.1`

3. **预览域名** (如果使用):
   - `preview.hagicode.org`
   - `*.vercel.app` (如果使用 Vercel)
   - `*.netlify.app` (如果使用 Netlify)

### 插件配置参数

```javascript
{
  // 目标属性
  target: '_blank',

  // rel 属性值
  rel: ['noopener', 'noreferrer'],

  // 排除的内部域名(可选,如果插件支持)
  exclude: [],

  // 包含的协议(可选)
  protocols: ['http', 'https'],

  // 是否处理内部文件扩展名(可选)
  extensions: ['.html', '.htm'],
}
```

### Astro 配置集成

在 `astro.config.mjs` 中的集成方式:

```javascript
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightBlog from 'starlight-blog'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import mermaidInjector from './src/integrations/mermaid-injector.ts'
import rehypeMermaid from 'rehype-mermaid'
import rehypeRaw from 'rehype-raw'
import rehypeExternalLinks from 'rehype-external-links' // 新增

export default defineConfig({
  base: import.meta.env.VITE_SITE_BASE || '/',
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid', 'math'],
    },
    rehypePlugins: [
      rehypeRaw,
      rehypeMermaid,
      // 新增: 外部链接在新标签页打开
      [rehypeExternalLinks, {
        target: '_blank',
        rel: ['noopener', 'noreferrer'],
      }]
    ],
  },
  // ... 其他配置保持不变
})
```

## 测试策略

### 单元测试

创建测试用例验证不同类型的链接处理:

```typescript
// tests/external-links.test.ts
import { describe, it, expect } from 'vitest'

describe('外部链接处理', () => {
  it('应该为外部 HTTP 链接添加 target 和 rel', () => {
    const input = '[链接](http://example.com)'
    const output = processMarkdown(input)
    expect(output).toContain('target="_blank"')
    expect(output).toContain('rel="noopener noreferrer"')
  })

  it('应该为外部 HTTPS 链接添加 target 和 rel', () => {
    const input = '[链接](https://example.com)'
    const output = processMarkdown(input)
    expect(output).toContain('target="_blank"')
    expect(output).toContain('rel="noopener noreferrer"')
  })

  it('不应该修改内部链接', () => {
    const input = '[内部链接](/docs/guide)'
    const output = processMarkdown(input)
    expect(output).not.toContain('target=')
  })

  it('不应该修改锚点链接', () => {
    const input = '[锚点](#section)'
    const output = processMarkdown(input)
    expect(output).not.toContain('target=')
  })

  it('不应该修改相对路径链接', () => {
    const input = '[相对链接](./other.md)'
    const output = processMarkdown(input)
    expect(output).not.toContain('target=')
  })
})
```

### 集成测试

创建测试页面包含各种类型的链接:

```markdown
<!-- src/content/tests/external-links-test.md -->
# 外部链接测试页面

## 外部链接

- HTTP 链接: [Example](http://example.com)
- HTTPS 链接: [GitHub](https://github.com)
- 带查询参数: [搜索](https://google.com/search?q=test)

## 内部链接

- 文档链接: [快速开始](/docs/quick-start)
- 博客链接: [博客](/blog)
- 相对链接: [其他页面](./other.md)

## 锚点链接

- [章节 1](#section-1)
- [章节 2](#section-2)
```

### 手动测试清单

- [ ] 点击外部链接,验证在新标签页打开
- [ ] 点击内部链接,验证在同一标签页打开
- [ ] 检查浏览器开发者工具中的 HTML,确认属性正确添加
- [ ] 测试不同页面(文档、博客、首页)中的链接
- [ ] 测试移动端和桌面端
- [ ] 测试明暗主题切换后链接行为

### 构建验证

```bash
# 1. 本地开发测试
npm run dev
# 访问 http://localhost:4321,手动测试链接

# 2. 构建测试
npm run build
# 确保构建成功,无警告

# 3. 生产构建预览
npm run preview
# 验证生产构建中的链接行为

# 4. TypeScript 类型检查
npm run typecheck
# 确保类型定义正确
```

## 兼容性分析

### 与现有插件的兼容性

| 插件 | 兼容性 | 说明 |
|------|--------|------|
| `rehypeRaw` | ✅ 完全兼容 | 处理 HTML 内容,不影响链接 |
| `rehypeMermaid` | ✅ 完全兼容 | 处理代码块,不影响链接 |
| `@astrojs/mdx` | ✅ 完全兼容 | 支持 MDX 中的 Markdown 内容 |

### 已知问题

1. **MDX 中的 JSX 链接**: MDX 文件中直接写的 `<a href="...">` 可能不会被 rehype 插件处理
   - **解决方案**: MDX 中的 Markdown 链接语法 `[文本](URL)` 会被处理,JSX 语法需要手动处理或使用包装器组件

2. **React 组件中的链接**: `.tsx` 文件中的链接不会被 rehype 插件处理
   - **解决方案**: 评估是否需要手动更新这些组件,或创建 ESLint 规则强制使用通用组件

3. **动态生成的链接**: JavaScript 运行时生成的链接不会被处理
   - **解决方案**: 在组件代码中手动添加属性

## 性能影响

### 构建时性能

- **额外构建时间**: 预计增加 < 1%
- **原因**: rehype 插件在构建时遍历 HTML 树,开销很小
- **缓解措施**: 无需特殊措施,影响可忽略

### 运行时性能

- **JavaScript 包大小**: 增加 0 KB (构建时处理,无运行时代码)
- **页面加载时间**: 无影响
- **交互性能**: 无影响

## 安全考虑

### `rel="noopener noreferrer"` 的作用

1. **noopener**:
   - 防止新页面访问 `window.opener`
   - 避免新页面控制原始页面
   - 防止反向标签页劫持(Tabnabbing)攻击

2. **noreferrer**:
   - 不在 `Referer` 头中传递源页面 URL
   - 保护用户隐私
   - 防止敏感信息泄露

### OWASP 建议

根据 [OWASP Tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing):
- 使用 `target="_blank"` 的所有链接都应包含 `rel="noopener"`
- 建议同时包含 `rel="noreferrer"` 以增强隐私保护

## 可访问性考虑

### WCAG 2.1 合规性

此改进不影响 WCAG 合规性,反而可能提升可访问性:

1. **用户控制**: 用户可以保持当前页面打开,符合"用户控制"原则
2. **可预测性**: 所有外部链接行为一致,符合"可预测性"原则
3. **视觉指示**: 未来可以添加图标或样式,明确标识外部链接

### 屏幕阅读器支持

- 屏幕阅读器会朗读"在新窗口/标签页打开"的提示
- 用户可以通过快捷键在新标签页打开链接(通常是 Ctrl+Enter 或 Cmd+Enter)
- 此功能与屏幕阅读器辅助功能兼容

## 维护指南

### 更新依赖

```bash
# 检查 rehype-external-links 的更新
npm outdated rehype-external-links

# 更新到最新版本
npm update rehype-external-links
```

### 添加新的内部域名

如果添加新的内部域名(如使用新的部署平台),更新 `astro.config.mjs`:

```javascript
[rehypeExternalLinks, {
  target: '_blank',
  rel: ['noopener', 'noreferrer'],
  // 添加新域名到排除列表
  exclude: ['new-domain.com'],
}]
```

### 故障排查

**问题**: 外部链接没有在新标签页打开

**排查步骤**:
1. 检查浏览器开发者工具,确认 HTML 是否包含 `target="_blank"`
2. 检查 `astro.config.mjs` 配置是否正确
3. 检查链接是否在 MDX 的 JSX 部分或 React 组件中
4. 尝试清理构建缓存: `rm -rf dist && rm -rf .astro`
5. 查看构建日志,确认插件已加载

**问题**: 内部链接在新标签页打开

**排查步骤**:
1. 检查链接是否以 `/` 开头(相对路径)
2. 检查插件配置,确认内部域名在排除列表中
3. 手动测试链接,确认域名匹配规则

## 实施检查清单

### 准备阶段

- [ ] 阅读 `rehype-external-links` 文档
- [ ] 创建功能分支 `feat/external-links-new-tab`
- [ ] 安装依赖 `npm install rehype-external-links`

### 实施阶段

- [ ] 更新 `astro.config.mjs` 添加插件配置
- [ ] 创建测试页面验证各种链接类型
- [ ] 本地运行 `npm run dev` 测试
- [ ] 手动测试各种链接行为
- [ ] 运行 `npm run build` 验证构建成功
- [ ] 运行 `npm run preview` 验证生产构建

### 验证阶段

- [ ] 测试文档页面中的外部链接
- [ ] 测试博客文章中的外部链接
- [ ] 测试首页组件中的外部链接
- [ ] 验证内部链接不受影响
- [ ] 验证锚点链接不受影响
- [ ] 检查浏览器控制台无错误
- [ ] 使用 Lighthouse 验证性能和可访问性

### 文档阶段

- [ ] 更新 `openspec/project.md` 记录配置
- [ ] 创建变更日志
- [ ] 提交 PR 请求审查
- [ ] 合并后归档提案

## 参考资源

- [rehype-external-links GitHub](https://github.com/rehypejs/rehype-external-links)
- [Astro Markdown 配置](https://docs.astro.build/en/guides/markdown-content/)
- [MDN - rel="noopener"](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noopener)
- [OWASP - Tabnabbing 攻击](https://owasp.org/www-community/attacks/Reverse_Tabnabbing)
- [WCAG 2.1 - 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
