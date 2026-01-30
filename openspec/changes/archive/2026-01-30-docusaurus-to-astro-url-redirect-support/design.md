# Docusaurus 到 Astro URL 重定向支持 - 设计文档

## 设计概述

本文档详细说明了从旧 Docusaurus URL 结构到新 Astro URL 结构的重定向机制的架构设计、技术选型和实现细节。

## 设计目标

1. **静态托管兼容**: 解决 GitHub Pages 不支持服务器端重定向配置的限制
2. **SEO 友好**: 最大化搜索引擎权重传递,降低排名损失
3. **用户体验**: 提供即时、透明的重定向体验
4. **可维护性**: 简单、可扩展的实现,便于未来维护
5. **部署灵活性**: 支持不同部署场景(根路径/子路径)

## 架构设计

### 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户浏览器                               │
│  访问旧 URL: https://hagicode-org.github.io/site/blog/2026/01/28/slug │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       GitHub Pages                               │
│  静态托管服务,返回对应的 HTML 文件                                │
│  文件路径: dist/blog/2026/01/28/slug.html                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HTML 重定向页面                                │
│  1. <meta http-equiv="refresh" content="0;url=/blog/2026-01-28-slug/"> │
│  2. JavaScript: window.location.replace('/blog/2026-01-28-slug/')    │
│  3. 显示友好的跳转提示信息                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      新页面 (Astro)                               │
│  URL: https://hagicode-org.github.io/site/blog/2026-01-28-slug/  │
│  正常显示内容                                                      │
└─────────────────────────────────────────────────────────────────┘
```

### 构建时流程图

```
┌──────────────────┐
│  Astro 构建      │
│  astro build     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  生成静态 HTML    │
│  到 dist/ 目录   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  scripts/generate-redirects.js          │
│  1. 扫描内容集合                          │
│  2. 生成 URL 映射规则                     │
│  3. 为每个旧 URL 创建 HTML 重定向页面      │
│  4. 输出到 dist/ 对应路径                 │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  scripts/        │
│  custom-404.js   │
│  (自定义 404)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  构建完成        │
│  准备部署        │
└──────────────────┘
```

## 技术选型

### 方案对比矩阵

| 方案 | 技术实现 | 优点 | 缺点 | 推荐度 |
|------|----------|------|------|--------|
| **Astro redirects 配置** | `astro.config.mjs` 中配置 `redirects` | 原生支持,真 301 重定向 | 仅适用于适配器支持的部署<br/>GitHub Pages 不支持 | ❌ 不适用 |
| **服务器配置 (.htaccess)** | Apache/Nginx 配置文件 | 标准 301 重定向 | GitHub Pages 是静态托管,<br/>不支持服务器配置 | ❌ 不适用 |
| **HTML meta refresh** | `<meta http-equiv="refresh">` | 兼容所有静态托管 | 非 HTTP 301,<br/>SEO 效果较差 | ⚠️ 可用 |
| **JavaScript 重定向** | `window.location.replace()` | 客户端控制,可保留参数 | 依赖 JavaScript,<br/>非 301 | ⚠️ 可用 |
| **构建时 HTML 重定向页面** | 结合 meta refresh + JS | 兼容性好,<br/>用户体验佳 | 非 301,<br/>构建复杂度增加 | ✅ **推荐** |
| **Cloudflare Workers** | 边缘计算重定向 | 真 301 重定向 | 需要 Cloudflare 账号,<br/>增加成本 | ⚠️ 备选 |

### 最终选择:构建时 HTML 重定向页面

**选择理由**:

1. **静态托管兼容**: 不依赖服务器配置,适用于 GitHub Pages
2. **用户体验佳**: 结合 meta refresh 和 JavaScript,即时重定向
3. **SEO 友好**: 通过 canonical 链接帮助搜索引擎识别规范 URL
4. **可控性强**: 完全控制重定向逻辑,易于调试和维护
5. **成本为零**: 无需额外服务或配置

**权衡考虑**:

- ⚠️ 非 HTTP 301 重定向,SEO 权重传递不如真 301
- ✅ 通过 canonical 链接和 Google Search Console 地址变更通知缓解
- ✅ 未来可迁移到 Netlify/Vercel 等支持服务器配置的平台

## 数据流设计

### URL 映射生成

```
输入: 内容集合文件系统
├─ src/content/docs/blog/
│  ├─ 2026-01-28-streamjsonrpc-integration-in-hagicode.md
│  └─ 2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github.md
└─ src/content/docs/quick-start/
   └─ create-first-project.md

处理: generateRedirects() 脚本
├─ 步骤 1: 扫描文件系统
├─ 步骤 2: 解析文件名/路径
├─ 步骤 3: 生成 URL 映射
└─ 步骤 4: 创建 HTML 文件

输出: 重定向页面
├─ dist/blog/2026/01/28/streamjsonrpc-integration-in-hagicode.html
├─ dist/blog/2026/01/25/how-to-sync-docker-hub-to-azure-acr-with-github.html
└─ dist/docs/quick-start/create-first-project.html
```

### URL 转换规则

#### 博客文章 URL 转换

**文件名解析**:
```
输入: 2026-01-28-streamjsonrpc-integration-in-hagicode.md

正则匹配: /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/
分组:
  $1 = 2026  (年)
  $2 = 01    (月)
  $3 = 28    (日)
  $4 = streamjsonrpc-integration-in-hagicode  (slug)

旧 URL: /blog/2026/01/28/streamjsonrpc-integration-in-hagicode
新 URL: /blog/2026-01-28-streamjsonrpc-integration-in-hagicode/
```

**代码实现**:
```javascript
function parseBlogFilename(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) return null;

  return {
    year: match[1],
    month: match[2],
    day: match[3],
    slug: match[4],
    oldUrl: `/blog/${match[1]}/${match[2]}/${match[3]}/${match[4]}`,
    newUrl: `/blog/${match[1]}-${match[2]}-${match[3]}-${match[4]}/`
  };
}
```

#### 文档页面 URL 转换

**文件路径解析**:
```
输入: src/content/docs/quick-start/create-first-project.md

路径处理:
  1. 移除前缀: src/content/docs/
  2. 分割路径: ['quick-start', 'create-first-project.md']
  3. 提取分类: quick-start
  4. 提取 slug: create-first-project (移除 .md)

旧 URL: /docs/quick-start/create-first-project
新 URL: /quick-start/create-first-project/
```

**代码实现**:
```javascript
function parseDocPath(filepath) {
  const relativePath = filepath
    .replace('src/content/docs/', '')
    .replace('.md', '');

  const parts = relativePath.split('/');
  if (parts.length < 2) return null; // 跳过根目录文件

  const category = parts[0];
  const slug = parts[1];

  return {
    category,
    slug,
    oldUrl: `/docs/${category}/${slug}`,
    newUrl: `/${category}/${slug}/`
  };
}
```

## 重定向页面设计

### HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO 优化: canonical 链接 -->
  <link rel="canonical" href="{new-url}">

  <!-- 主要重定向方法: meta refresh -->
  <meta http-equiv="refresh" content="0;url={new-url}">

  <!-- 页面样式 -->
  <style>
    /* 居中布局,卡片设计 */
  </style>
</head>
<body>
  <div class="container">
    <h1>页面已迁移</h1>
    <p>您访问的页面已移动到新地址,正在为您自动跳转...</p>
    <p>如果没有自动跳转,请<a href="{new-url}">点击这里</a>。</p>

    <!-- 显示旧地址和新地址,便于用户理解 -->
    <p class="old-url">旧地址: {old-url}</p>
    <p class="new-url">新地址: {new-url}</p>
  </div>

  <!-- 双重保险: JavaScript 重定向 -->
  <script>
    // 保留查询参数
    const search = window.location.search;
    const targetUrl = '{new-url}' + search;

    // 使用 replace 避免用户按后退键再次重定向
    window.location.replace(targetUrl);
  </script>
</body>
</html>
```

### 设计考虑

#### 1. 双重重定向机制

**为什么同时使用 meta refresh 和 JavaScript?**

- **Meta refresh**: 主重定向方法,浏览器原生支持,不依赖 JavaScript
- **JavaScript**: 双重保险,处理边缘情况(如浏览器禁用 meta refresh)
- **两者结合**: 最大化重定向成功率,覆盖所有浏览器和环境

#### 2. 使用 `window.location.replace()` 而非 `window.location.href`

**为什么?**

- `replace()`: 替换当前历史记录条目,用户按后退键不会再次重定向
- `href`: 添加新的历史记录条目,用户按后退键会回到重定向页面,形成循环

**用户体验对比**:
```
使用 href:
用户访问旧 URL → 重定向页面 → 新 URL
用户按后退 → 重定向页面 → 自动再次重定向 ❌ (循环)

使用 replace():
用户访问旧 URL → 重定向页面 → 新 URL (替换历史记录)
用户按后退 → 返回到访问旧 URL 之前的页面 ✅ (正常)
```

#### 3. 查询参数保留

**实现**:
```javascript
const search = window.location.search; // 获取 ?utm_source=twitter
const targetUrl = newUrl + search;
```

**好处**:
- UTM 参数保留,便于流量来源追踪
- 其他查询参数(如 `?id=123`)也能正常工作
- 数据分析和统计不受影响

#### 4. Canonical 链接

**作用**:
```html
<link rel="canonical" href="https://hagicode-org.github.io/site/blog/2026-01-28-slug/">
```

**SEO 优化**:
- 告诉搜索引擎该页面的规范 URL 是新地址
- 搜索引擎会将权重传递到新 URL
- 避免重复内容惩罚
- 部分缓解非 301 重定向的 SEO 影响

## 部署场景设计

### 根路径部署 (VITE_SITE_BASE=/)

**场景**: 部署到域名根路径,如 `https://hagicode.com/`

**URL 结构**:
```
旧: https://hagicode.com/blog/2026/01/28/slug
新: https://hagicode.com/blog/2026-01-28-slug/
```

**重定向页面路径**:
```
dist/blog/2026/01/28/slug.html
```

**构建命令**:
```bash
npm run build  # VITE_SITE_BASE 默认为 /
```

### 子路径部署 (VITE_SITE_BASE=/site)

**场景**: 部署到子路径,如 `https://hagicode-org.github.io/site/`

**URL 结构**:
```
旧: https://hagicode-org.github.io/site/blog/2026/01/28/slug
新: https://hagicode-org.github.io/site/blog/2026-01-28-slug/
```

**重定向页面路径**:
```
dist/blog/2026/01/28/slug.html
# 注意: 文件系统路径不包含 /site,因为 GitHub Pages 自动处理
```

**重定向页面内容**:
```javascript
const newUrl = '/site/blog/2026-01-28-slug/';  // 包含 base 前缀
```

**构建命令**:
```bash
npm run build:site  # VITE_SITE_BASE=/site
```

### Base 路径处理逻辑

```javascript
// 从环境变量读取 base 路径
const base = process.env.VITE_SITE_BASE || '/';

// 生成新 URL
const newUrl = `${base}/blog/${year}-${month}-${day}-${slug}/`;

// 生成 canonical 链接
const canonicalUrl = `https://hagicode-org.github.io${base}/blog/${year}-${month}-${day}-${slug}/`;
```

## 错误处理设计

### 文件系统错误

**场景**: 文件读取失败或目录不存在

**处理**:
```javascript
try {
  const files = fs.readdirSync(blogDir);
} catch (error) {
  console.error(`错误: 无法读取目录 ${blogDir}`, error.message);
  process.exit(1); // 退出构建,避免生成不完整的重定向
}
```

### 文件名格式错误

**场景**: 博客文件名不符合 `YYYY-MM-DD-slug.md` 格式

**处理**:
```javascript
const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
if (!match) {
  console.warn(`警告: 跳过格式不符的文件 ${filename}`);
  continue; // 跳过此文件,继续处理其他文件
}
```

### 路径解析错误

**场景**: 文档路径深度不足或格式异常

**处理**:
```javascript
const parts = relativePath.split('/');
if (parts.length < 2) {
  console.warn(`警告: 跳过根目录文件 ${relativePath}`);
  continue;
}
```

### 输出目录创建错误

**场景**: 无法创建输出目录或写入文件

**处理**:
```javascript
try {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');
} catch (error) {
  console.error(`错误: 无法写入重定向页面 ${outputPath}`, error.message);
  throw error; // 中断构建,要求人工干预
}
```

## 性能考虑

### 构建时性能

**影响**:
- 扫描文件系统: 取决于文件数量
- 生成 HTML 文件: 每个重定向约 1KB
- 总体影响: 构建时间增加 < 5 秒

**优化**:
- 使用 `fs.readdirSync()` 同步读取,减少异步复杂度
- 避免重复读取同一文件
- 使用流式写入(如果未来文件数量很大)

### 运行时性能

**影响**:
- 用户访问旧 URL 时加载 HTML 重定向页面
- 页面大小: ~2KB (包含样式和脚本)
- 重定向延迟: < 100ms (浏览器即时处理)

**优化**:
- 内联 CSS,避免额外请求
- 最小化 HTML 和 JavaScript
- 使用 CDN 缓存重定向页面(如果配置)

### 存储空间

**影响**:
- 每个重定向页面 ~2KB
- 100 个重定向 = ~200KB
- 对 GitHub Pages 1GB 限制可忽略

## 安全考虑

### XSS 防护

**风险**: URL 参数可能包含恶意脚本

**缓解**:
```javascript
// 在生成 HTML 时转义特殊字符
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

const safeOldUrl = escapeHtml(oldUrl);
const safeNewUrl = escapeHtml(newUrl);
```

### 开放式重定向

**风险**: 恶意构造的查询参数可能导致重定向到外部站点

**缓解**:
- 只重定向到预定义的新 URL
- 查询参数仅追加,不修改目标 URL
- 不接受用户输入的重定向目标

## 测试策略

### 单元测试

**测试内容**:
- URL 解析函数
- 路径转换函数
- HTML 生成函数

**示例**:
```javascript
// tests/generate-redirects.test.js
import { parseBlogFilename, parseDocPath } from '../scripts/generate-redirects.js';

test('解析博客文件名', () => {
  const result = parseBlogFilename('2026-01-28-slug.md');
  expect(result.oldUrl).toBe('/blog/2026/01/28/slug');
  expect(result.newUrl).toBe('/blog/2026-01-28-slug/');
});

test('解析文档路径', () => {
  const result = parseDocPath('src/content/docs/quick-start/guide.md');
  expect(result.oldUrl).toBe('/docs/quick-start/guide');
  expect(result.newUrl).toBe('/quick-start/guide/');
});
```

### 集成测试

**测试内容**:
- 完整的重定向页面生成流程
- 输出文件结构验证

**方法**:
```bash
# 运行构建脚本
npm run build

# 验证输出
ls dist/blog/2026/01/28/slug.html
cat dist/docs/quick-start/guide.html | grep "http-equiv"
```

### 端到端测试

**测试内容**:
- 用户访问旧 URL,验证自动跳转
- 检查浏览器历史记录
- 验证查询参数保留

**方法**:
- 使用 Playwright 自动化测试
- 或手动测试主要 URL

### 边界测试

**测试用例**:
1. 不存在的旧 URL → 404
2. 带查询参数的 URL → 参数保留
3. 中文 slug → URL 编码正确
4. 特殊字符(如 `-`, `_`) → 正确处理

## 监控与维护

### 构建日志

**输出格式**:
```
开始生成重定向页面...
Base 路径: /

✓ 扫描博客文章: 5 个
✓ 生成: /blog/2026/01/28/slug → /blog/2026-01-28-slug/
✓ 生成: /blog/2026/01/25/other-slug → /blog/2026-01-25-other-slug/

✓ 扫描文档页面: 10 个
✓ 生成: /docs/quick-start/guide → /quick-start/guide/
✓ 生成: /docs/installation/docker-compose → /installation/docker-compose/

完成! 共生成 15 个重定向页面。
```

### 监控指标

1. **构建时间**: 重定向脚本运行时间
2. **文件数量**: 生成的重定向页面数量
3. **错误率**: 跳过或失败的文件数量

### 维护任务

1. **定期检查**: 每次新增内容时验证重定向
2. **404 监控**: 在 GitHub Pages 或 Google Analytics 查看 404 日志
3. **规则更新**: 当 URL 结构变化时更新转换逻辑

## 未来演进

### 短期优化 (1-3 个月)

1. **添加单元测试**: 使用 Vitest 或 Jest
2. **改进错误处理**: 更详细的错误信息
3. **性能监控**: 跟踪重定向使用情况

### 中期优化 (3-6 个月)

1. **迁移到 Netlify/Vercel**: 使用真正的 301 重定向
2. **自动化测试**: 集成到 CI/CD 流程
3. **监控面板**: 可视化重定向统计

### 长期演进 (6-12 个月)

1. **通用重定向框架**: 支持任意 URL 映射
2. **自动规则生成**: 从内容集合自动推断规则
3. **多语言支持**: 扩展到其他语言站点

## 参考资源

### 技术文档
- [MDN - meta http-equiv="refresh"](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/http-equiv)
- [MDN - window.location.replace()](https://developer.mozilla.org/en-US/docs/Web/API/Location/replace)
- [Google - Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Astro - Static Builds](https://docs.astro.build/en/guides/deploy/)

### 最佳实践
- [A List Apart - URL Migration](https://alistapart.com/article/survivor-url-redirection/)
- [SEO - 301 Redirects](https://ahrefs.com/seo/redirects/)
- [Netlify - Redirects](https://docs.netlify.com/routing/redirects/)

### 类似实现
- [Jekyll Redirect From](https://github.com/github/jekyll-redirect-from)
- [Hugo Aliases](https://gohugo.io/content-management/urls/#aliases)
