# url-redirect Specification

## Purpose
TBD - created by archiving change docusaurus-to-astro-url-redirect-support. Update Purpose after archive.
## Requirements
### Requirement: 博客文章 URL 自动重定向

系统 MUST 在构建时为所有博客文章生成从旧 Docusaurus URL 格式到新 Astro URL 格式的重定向页面。

**优先级**: 高
**状态**: 待实现

**验收标准**:
- 博客文章文件名格式: `YYYY-MM-DD-slug.md`
- 旧 URL 格式: `/blog/YYYY/MM/DD/slug`
- 新 URL 格式: `/blog/YYYY-MM-DD-slug/`
- 重定向页面包含 `<meta http-equiv="refresh">` 标签
- 重定向页面包含 JavaScript 双重保险
- 重定向页面包含用户友好的提示信息
- 重定向页面包含 canonical 链接指向新 URL
- 支持根路径和子路径部署场景

#### Scenario: 博客文章 URL 格式转换和重定向

**Given** 博客文章文件名为 `2026-01-28-streamjsonrpc-integration-in-hagicode.md`

**When** 构建时生成重定向页面

**Then** 生成以下重定向规则:
- 旧 URL: `/blog/2026/01/28/streamjsonrpc-integration-in-hagicode`
- 新 URL: `/blog/2026-01-28-streamjsonrpc-integration-in-hagicode/`
- 重定向页面路径: `dist/blog/2026/01/28/streamjsonrpc-integration-in-hagicode.html`

**And** 重定向页面包含:
```html
<meta http-equiv="refresh" content="0;url=/blog/2026-01-28-streamjsonrpc-integration-in-hagicode/">
<link rel="canonical" href="/blog/2026-01-28-streamjsonrpc-integration-in-hagicode/">
<script>window.location.replace('/blog/2026-01-28-streamjsonrpc-integration-in-hagicode/')</script>
```

#### Scenario: 子路径部署时博客文章重定向

**Given** 站点部署在子路径 `/site`
**And** 博客文章文件名为 `2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github.md`

**When** 使用 `VITE_SITE_BASE=/site` 构建时生成重定向页面

**Then** 重定向页面中的新 URL 包含 base 前缀:
- 新 URL: `/site/blog/2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github/`
- Canonical 链接: `https://hagicode-org.github.io/site/blog/2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github/`

#### Scenario: 博客文章重定向保留查询参数

**Given** 用户访问旧博客 URL 并带有查询参数
```
/blog/2026/01/28/streamjsonrpc-integration-in-hagicode?utm_source=twitter&ref=homepage
```

**When** 重定向页面加载并执行重定向

**Then** 新 URL 包含完整的查询参数:
```
/blog/2026-01-28-streamjsonrpc-integration-in-hagicode/?utm_source=twitter&ref=homepage
```

#### Scenario: 博客文章重定向即时生效

**Given** 用户在浏览器中访问旧博客 URL
```
https://hagicode-org.github.io/site/blog/2026/01/28/streamjsonrpc-integration-in-hagicode
```

**When** 浏览器加载重定向页面

**Then** 浏览器立即跳转到新 URL
**And** 跳转延迟 < 100ms
**And** 用户看到友好的提示信息(如果浏览器处理较慢)
**And** 浏览器历史记录使用 `replace()` 方法,避免后退循环

---

### Requirement: 文档页面 URL 自动重定向

系统 MUST 在构建时为所有文档页面生成从旧 Docusaurus URL 格式到新 Astro URL 格式的重定向页面。

**优先级**: 高
**状态**: 待实现

**验收标准**:
- 文档文件路径格式: `src/content/docs/category/slug.md`
- 旧 URL 格式: `/docs/category/slug`
- 新 URL 格式: `/category/slug/`
- 重定向页面包含完整的重定向机制
- 支持多级目录结构
- 排除 `blog/` 子目录(由博客重定向处理)

#### Scenario: 文档页面 URL 格式转换和重定向

**Given** 文档文件路径为 `src/content/docs/quick-start/create-first-project.md`

**When** 构建时生成重定向页面

**Then** 生成以下重定向规则:
- 旧 URL: `/docs/quick-start/create-first-project`
- 新 URL: `/quick-start/create-first-project/`
- 重定向页面路径: `dist/docs/quick-start/create-first-project.html`

**And** 重定向页面包含:
```html
<meta http-equiv="refresh" content="0;url=/quick-start/create-first-project/">
<link rel="canonical" href="/quick-start/create-first-project/">
<script>window.location.replace('/quick-start/create-first-project/')</script>
```

#### Scenario: 多级目录文档重定向

**Given** 文档文件路径为 `src/content/docs/related-software-installation/openspec/setup-openspec.md`

**When** 构建时生成重定向页面

**Then** 重定向规则正确处理多级目录:
- 旧 URL: `/docs/related-software-installation/openspec/setup-openspec`
- 新 URL: `/related-software-installation/openspec/setup-openspec/`
- 重定向页面路径: `dist/docs/related-software-installation/openspec/setup-openspec.html`

#### Scenario: 文档页面排除 blog 子目录

**Given** `src/content/docs/blog/` 目录包含博客文章

**When** 构建时扫描文档页面生成重定向

**Then** 脚本跳过 `src/content/docs/blog/` 目录
**And** 博客文章仅由博客重定向逻辑处理
**And** 避免重复生成重定向页面

#### Scenario: 子路径部署时文档页面重定向

**Given** 站点部署在子路径 `/site`
**And** 文档文件路径为 `src/content/docs/installation/docker-compose.md`

**When** 使用 `VITE_SITE_BASE=/site` 构建时生成重定向页面

**Then** 重定向页面中的新 URL 包含 base 前缀:
- 新 URL: `/site/installation/docker-compose/`
- Canonical 链接: `https://hagicode-org.github.io/site/installation/docker-compose/`

---

### Requirement: 重定向页面用户体验

重定向页面 MUST 提供清晰、友好的用户提示,确保用户理解正在进行的跳转。

**优先级**: 中
**状态**: 待实现

**验收标准**:
- 显示"页面已迁移"标题
- 说明页面已移动到新地址
- 提供手动点击链接(如果自动跳转失败)
- 显示旧地址和新地址
- 使用居中、卡片式布局
- 样式简洁美观,响应式设计

#### Scenario: 用户友好的重定向提示

**Given** 用户访问旧 URL 并加载重定向页面

**When** 重定向页面在浏览器中渲染

**Then** 页面显示以下内容:
```
页面已迁移
您访问的页面已移动到新地址,正在为您自动跳转...
如果没有自动跳转,请点击这里。
旧地址: /docs/quick-start/create-first-project
新地址: /quick-start/create-first-project/
```

**And** 页面样式:
- 居中卡片布局
- 白色背景,圆角阴影
- 链接使用蓝色,可点击
- 移动端响应式适配

#### Scenario: 自动跳转失败时的手动点击选项

**Given** 用户浏览器禁用 JavaScript 或 meta refresh 延迟较高

**When** 重定向页面加载

**Then** 用户看到手动点击链接: "如果没有自动跳转,请点击这里。"
**And** 点击链接后跳转到新 URL
**And** 所有查询参数正确传递

---

### Requirement: SEO 优化

重定向机制 MUST 最大化搜索引擎权重传递,降低 URL 迁移对搜索排名的影响。

**优先级**: 高
**状态**: 待实现

**验收标准**:
- 每个重定向页面包含 `<link rel="canonical">` 指向新 URL
- 重定向页面可被搜索引擎索引
- 新 URL 在搜索引擎中替代旧 URL
- 建议在 Google Search Console 提交地址变更

#### Scenario: Canonical 链接指向规范 URL

**Given** 重定向页面生成

**When** 检查 HTML `<head>` 部分

**Then** 包含 canonical 链接:
```html
<link rel="canonical" href="https://hagicode-org.github.io/site/blog/2026-01-28-slug/">
```

**And** 搜索引擎识别新 URL 为规范 URL
**And** 旧 URL 的搜索权重传递到新 URL

#### Scenario: 搜索引擎索引重定向页面

**Given** 搜索引擎爬虫访问旧 URL

**When** 爬虫解析重定向页面

**Then** 爬虫识别 canonical 链接
**And** 爬虫将索引目标指向新 URL
**And** 搜索结果显示新 URL

---

### Requirement: 构建时性能与可靠性

重定向页面生成脚本 MUST 高效、可靠,不影响正常构建流程。

**优先级**: 中
**状态**: 待实现

**验收标准**:
- 脚本运行时间 < 5 秒(100 个重定向)
- 构建流程集成,自动执行
- 提供详细的日志输出
- 错误处理不中断构建(除非严重错误)
- 统计生成的重定向数量

#### Scenario: 成功生成重定向后的日志输出

**Given** 构建流程运行完成

**When** 执行 `npm run build`

**Then** 控制台输出:
```
开始生成重定向页面...
Base 路径: /

✓ 扫描博客文章: 5 个
✓ 生成: /blog/2026/01/28/slug → /blog/2026-01-28-slug/
✓ 生成: /blog/2026/01/25/other → /blog/2026-01-25-other/

✓ 扫描文档页面: 10 个
✓ 生成: /docs/quick-start/guide → /quick-start/guide/
✓ 生成: /docs/installation/docker-compose → /installation/docker-compose/

完成! 共生成 15 个重定向页面。
```

#### Scenario: 文件格式错误时的优雅处理

**Given** 博客目录包含格式不符的文件,如 `invalid-filename.md`

**When** 脚本扫描博客文章

**Then** 输出警告信息:
```
警告: 跳过格式不符的文件 invalid-filename.md
```

**And** 脚本继续处理其他文件
**And** 构建流程不中断

#### Scenario: 构建脚本集成到构建流程

**Given** 用户运行 `npm run build`

**When** Astro 构建完成

**Then** 自动执行重定向脚本
**And** 重定向脚本在 `custom-404.js` 之前运行
**And** 所有重定向页面生成到 `dist/` 目录
**And** 构建流程继续完成

---

### Requirement: 边界情况处理

系统 MUST 正确处理各种边界情况,避免 404 错误或重定向循环。

**优先级**: 中
**状态**: 待实现

**验收标准**:
- 不存在的旧 URL 返回自定义 404 页面
- 重定向页面使用 `window.location.replace()` 避免后退循环
- 特殊字符正确编码
- 空查询参数不影响重定向

#### Scenario: 不存在的旧 URL 返回 404

**Given** 用户访问不存在的旧 URL
```
/blog/2025/12/31/nonexistent-post
```

**When** 服务器处理请求

**Then** 返回自定义 404 页面
**And** 页面显示"页面未找到"
**And** 提供返回首页的链接
**And** HTTP 状态码为 404

#### Scenario: 浏览器后退按钮不触发重定向循环

**Given** 用户访问旧 URL → 重定向到新 URL
**And** 用户点击浏览器后退按钮

**When** 浏览器返回到上一页

**Then** 用户返回到访问旧 URL 之前的页面
**And** 不会再次触发重定向循环
**And** 历史记录正常工作

**原因**: 使用 `window.location.replace()` 替换历史记录条目

#### Scenario: 中文 slug 的 URL 编码

**Given** 博客文章文件名包含中文字符
```
2026-01-30-中文测试文章.md
```

**When** 生成重定向页面

**Then** URL 正确编码:
- 旧 URL: `/blog/2026/01/30/%E4%B8%AD%E6%96%87%E6%B5%8B%E8%AF%95%E6%96%87%E7%AB%A0`
- 新 URL: `/blog/2026-01-30-%E4%B8%AD%E6%96%87%E6%B5%8B%E8%AF%95%E6%96%87%E7%AB%A0/`

**And** 浏览器正确处理编码后的 URL
**And** 重定向功能正常

#### Scenario: 空查询参数不影响重定向

**Given** 用户访问旧 URL,不带查询参数
```
/blog/2026/01/28/slug
```

**When** 重定向页面执行

**Then** 新 URL 不包含 `?`:
```
/blog/2026-01-28-slug/
```

**And** JavaScript 代码正确处理空 `window.location.search`

---

