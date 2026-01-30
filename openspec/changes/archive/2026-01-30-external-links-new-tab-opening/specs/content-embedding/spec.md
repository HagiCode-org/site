# 内容嵌入规格 - 外部链接处理

## ADDED Requirements

### REQ-CONTENT-001: 外部链接自动处理

系统应自动为 Markdown 和 MDX 内容中的所有外部链接添加 `target="_blank"` 和 `rel="noopener noreferrer"` 属性。

**优先级**: 高
**状态**: 已实现

**验收标准**:
- 所有以 `http://` 或 `https://` 开头的链接自动包含 `target="_blank"`
- 所有外部链接自动包含 `rel="noopener noreferrer"`
- 内部链接(以 `/` 开头)不包含 `target` 属性
- 锚点链接(以 `#` 开头)不受影响
- 相对路径链接不受影响

#### Scenario: 外部 HTTPS 链接自动添加属性

**Given** 用户在 Markdown 文件中创建外部 HTTPS 链接
```markdown
[Astro 文档](https://docs.astro.build)
```

**When** 站点构建时处理该 Markdown 文件

**Then** 生成的 HTML 包含以下属性:
```html
<a href="https://docs.astro.build" rel="noopener noreferrer" target="_blank">Astro 文档</a>
```

#### Scenario: 外部 HTTP 链接自动添加属性

**Given** 用户在 Markdown 文件中创建外部 HTTP 链接
```markdown
[Example](http://example.com)
```

**When** 站点构建时处理该 Markdown 文件

**Then** 生成的 HTML 包含以下属性:
```html
<a href="http://example.com" rel="noopener noreferrer" target="_blank">Example</a>
```

#### Scenario: 内部链接保持不变

**Given** 用户在 Markdown 文件中创建内部链接
```markdown
[快速开始](/quick-start/create-first-project)
```

**When** 站点构建时处理该 Markdown 文件

**Then** 生成的 HTML 不包含 `target` 属性:
```html
<a href="/quick-start/create-first-project">快速开始</a>
```

#### Scenario: 锚点链接保持不变

**Given** 用户在 Markdown 文件中创建锚点链接
```markdown
[回到顶部](#section-id)
```

**When** 站点构建时处理该 Markdown 文件

**Then** 生成的 HTML 不包含 `target` 属性:
```html
<a href="#section-id">回到顶部</a>
```

#### Scenario: 相对路径链接保持不变

**Given** 用户在 Markdown 文件中创建相对路径链接
```markdown
[其他页面](./other-page.md)
```

**When** 站点构建时处理该 Markdown 文件

**Then** 生成的 HTML 不包含 `target` 属性:
```html
<a href="./other-page.md">其他页面</a>
```

#### Scenario: MDX 文件中的外部链接

**Given** 用户在 MDX 文件中使用 Markdown 链接语法
```mdx
访问 [React](https://react.dev) 了解更多信息。
```

**When** 站点构建时处理该 MDX 文件

**Then** 生成的 HTML 包含正确的属性:
```html
访问 <a href="https://react.dev" rel="noopener noreferrer" target="_blank">React</a> 了解更多信息。
```

#### Scenario: 博客文章中的外部链接

**Given** 用户在博客文章中创建外部链接
```markdown
查看 [GitHub](https://github.com) 仓库。
```

**When** 站点构建时处理该博客文章

**Then** 生成的 HTML 包含正确的属性:
```html
查看 <a href="https://github.com" rel="noopener noreferrer" target="_blank">GitHub</a> 仓库。
```

### REQ-CONTENT-002: 安全性保障

系统应通过 `rel="noopener noreferrer"` 属性防止潜在的安全风险和隐私泄露。

**优先级**: 高
**状态**: 已实现

**验收标准**:
- 所有外部链接包含 `rel="noopener"`
- 所有外部链接包含 `rel="noreferrer"`
- 防止反向标签页劫持(Tabnabbing)攻击
- 不在新页面请求中传递 referrer 信息

#### Scenario: 防止 window.opener 访问

**Given** 外部链接包含 `rel="noopener"` 属性

**When** 用户点击外部链接在新标签页打开

**Then** 新页面无法访问 `window.opener` API
**And** 原页面不会被新页面操控

#### Scenario: 保护用户隐私

**Given** 外部链接包含 `rel="noreferrer"` 属性

**When** 用户点击外部链接

**Then** 浏览器不在 `Referer` 头中传递源页面 URL
**And** 用户访问的来源信息得到保护

### REQ-CONTENT-003: 用户体验增强

系统应通过在新标签页打开外部链接,提供更好的导航体验。

**优先级**: 中
**状态**: 已实现

**验收标准**:
- 用户可以在保持文档站点打开的同时查看外部资源
- 用户浏览上下文不被打断
- 用户无需手动使用"后退"按钮返回文档

#### Scenario: 查看外部资源时保持文档打开

**Given** 用户正在阅读文档页面
**And** 页面包含外部链接到 API 文档

**When** 用户点击外部链接

**Then** 外部资源在新标签页打开
**And** 原文档页面保持在当前标签页打开
**And** 用户可以轻松切换回文档继续阅读

#### Scenario: 链接行为一致性

**Given** 文档站点包含多个外部链接

**When** 用户点击不同的外部链接

**Then** 所有外部链接行为一致(都在新标签页打开)
**And** 用户体验可预测且统一

## 技术实现

### 实现方式

使用 `rehype-external-links` 插件在 Astro 的 Markdown 渲染管道中处理外部链接:

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
      }]
    ],
  },
})
```

### 覆盖范围

✅ **已覆盖**:
- Markdown 文件 (`.md`) 中的链接
- MDX 文件 (`.mdx`) 中的 Markdown 链接语法
- 博客文章中的链接
- 所有文档内容中的链接

❌ **未覆盖**:
- MDX 中的 JSX 语法 `<a href="...">`
- React 组件中的链接
- JavaScript 动态生成的链接

### 依赖项

- `rehype-external-links`: ^3.0.0
- Astro 5.x
- @astrojs/mdx 4.x

## 测试

### 测试页面

访问 `/tests/external-links-test` 查看各种链接类型的测试示例。

### 手动测试清单

- [ ] 外部 HTTP 链接在新标签页打开
- [ ] 外部 HTTPS 链接在新标签页打开
- [ ] 外部链接包含 `target="_blank"`
- [ ] 外部链接包含 `rel="noopener noreferrer"`
- [ ] 内部链接在当前标签页打开
- [ ] 内部链接不包含 `target` 属性
- [ ] 锚点链接正常工作
- [ ] 相对路径链接正常工作

### 构建验证

运行 `npm run build` 确保构建成功,无错误或警告。

## 参考资料

- [rehype-external-links GitHub](https://github.com/rehypejs/rehype-external-links)
- [Astro Markdown 配置](https://docs.astro.build/en/guides/markdown-content/)
- [MDN - rel="noopener"](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noopener)
- [OWASP - Tabnabbing 攻击](https://owasp.org/www-community/attacks/Reverse_Tabnabbing)
