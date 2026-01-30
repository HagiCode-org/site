# Docusaurus 到 Astro URL 重定向支持提案

## 概述

为 Hagicode 文档站点实现从旧 Docusaurus URL 结构到新 Astro URL 结构的自动重定向支持,确保所有永久链接(Permalinks)在迁移后仍然有效,保护 SEO 权重并保持用户体验的连续性。

## 背景

### 站点迁移历史

Hagicode 文档站点已于 2026 年 1 月从 **Docusaurus 3.x** 迁移到 **Astro 5.x**,使用 Starlight 主题。这是一个重大架构升级,带来了性能提升和更好的开发体验,但也导致了 URL 结构的显著变化。

### 当前问题

**旧站点 (Docusaurus)**:
- **部署地址**: `https://hagicode-org.github.io/site/`
- **博客 URL 格式**: `/blog/YYYY/MM/DD/slug`
  - 示例: `/blog/2026/01/28/streamjsonrpc-integration-in-hagicode`
- **文档 URL 格式**: `/docs/category/slug`
  - 示例: `/docs/installation/docker-compose`

**新站点 (Astro + Starlight)**:
- **部署地址**: `https://hagicode-org.github.io/site/` (相同)
- **博客 URL 格式**: `/blog/YYYY-MM-DD-slug/`
  - 示例: `/blog/2026-01-28-streamjsonrpc-integration-in-hagicode/`
- **文档 URL 格式**: `/category/slug/`
  - 示例: `/installation/docker-compose/`

### URL 差异分析

| 内容类型 | 旧格式 (Docusaurus) | 新格式 (Astro) | 差异点 |
|---------|---------------------|----------------|--------|
| 博客文章 | `/blog/2026/01/28/slug` | `/blog/2026-01-28-slug/` | 日期分隔符 `/` → `-`,末尾添加 `/` |
| 文档页面 | `/docs/installation/docker-compose` | `/installation/docker-compose/` | 移除 `/docs` 前缀,末尾添加 `/` |

### 业务影响

1. **SEO 权重损失**
   - 旧链接累积的搜索排名和反向链接失效
   - 404 错误增加导致搜索引擎降权
   - 用户体验下降影响停留时间等指标

2. **用户访问中断**
   - 社交媒体分享的链接失效
   - 用户书签无法访问
   - 技术文章和教程中的引用链接断裂
   - 降低站点可信度和专业性

3. **技术债务**
   - 迁移不完整,向后兼容性缺失
   - 未来 URL 结构变更缺乏可重用机制

## 目标

### 主要目标

1. **永久链接保护**: 确保所有旧的 Docusaurus URL 能够自动重定向到对应的新 Astro URL
2. **SEO 权重传递**: 使用 HTTP 301 永久重定向,将搜索权重传递到新 URL
3. **用户体验连续性**: 用户通过旧链接访问时无感知跳转到新页面
4. **部署兼容性**: 支持不同部署场景(根路径 `/` vs 子路径 `/site`)
5. **可维护性**: 提供可扩展的重定向机制,便于未来 URL 结构变更

### 成功标准

- [ ] 所有博客旧 URL `/blog/:year/:month/:day/:slug` 重定向到 `/blog/:year-:month-:day-:slug/`
- [ ] 所有文档旧 URL `/docs/:category/:slug` 重定向到 `/:category/:slug/`
- [ ] 重定向返回 HTTP 301 状态码
- [ ] 重定向在本地开发环境可测试
- [ ] 重定向在生产环境(GitHub Pages)正常工作
- [ ] 支持根路径和子路径两种部署场景
- [ ] 构建无错误,性能影响最小

## 范围

### 包含内容

✅ **在范围内**:

1. **博客文章重定向**
   - 旧格式: `/blog/YYYY/MM/DD/slug`
   - 新格式: `/blog/YYYY-MM-DD-slug/`
   - 示例: `/blog/2026/01/28/streamjsonrpc-integration-in-hagicode` → `/blog/2026-01-28-streamjsonrpc-integration-in-hagicode/`

2. **文档页面重定向**
   - 旧格式: `/docs/category/slug`
   - 新格式: `/category/slug/`
   - 示例: `/docs/installation/docker-compose` → `/installation/docker-compose/`
   - 示例: `/docs/quick-start/create-first-project` → `/quick-start/create-first-project/`

3. **部署场景支持**
   - 根路径部署: `https://example.com/` (VITE_SITE_BASE=/)
   - 子路径部署: `https://example.com/site/` (VITE_SITE_BASE=/site)

4. **重定向验证**
   - 开发环境测试
   - 生产构建验证
   - HTTP 状态码检查

### 排除内容

❌ **不在范围内**:

1. **其他 Docusaurus 功能 URL**
   - 标签页面: `/blog/tags/tagname`
   - 归档页面: `/blog/archive`
   - 搜索结果页面
   - 用户在迁移时已移除这些功能,无需重定向

2. **内部链接更新**
   - 站点内部内容中的旧链接更新
   - 这些链接在迁移时已批量更新为新格式

3. **非内容页面重定向**
   - 首页 `/` (无变化)
   - 其他自定义页面

4. **后续新增内容自动重定向**
   - 新发布的博客文章不需要自动添加重定向规则
   - 新增的文档页面不需要自动添加重定向规则
   - 仅维护迁移时已存在内容的重定向
   - 未来内容使用新的 URL 格式,无需重定向

## 技术方案

### 实现策略选择

由于 GitHub Pages 是静态站点托管服务,不支持服务器端重定向配置(如 `.htaccess` 或 Nginx 配置),需要采用客户端或构建时解决方案。

#### 方案对比

| 方案 | 优点 | 缺点 | 适用性 |
|------|------|------|--------|
| **Astro redirects 配置** | 原生支持,配置简单 | 仅适用于适配器支持的部署 | ❌ GitHub Pages 不支持 |
| **自定义 404 页面 + JavaScript** | 兼容所有静态托管 | 需要 JavaScript,非 301 | ⚠️ 可用但不理想 |
| **构建时生成 HTML 重定向页面** | 真 301 重定向,无需 JS | 构建复杂度增加 | ✅ **推荐** |
| **元刷新 + canonical 链接** | 简单易实现 | 非 301,SEO 效果差 | ❌ 不推荐 |

### 推荐方案:构建时生成 HTML 重定向页面(基于配置集合)

使用自定义构建脚本,在构建时根据**预定义的重定向配置集合**为每个旧 URL 生成包含 HTTP-Equiv 重定向的 HTML 页面。

#### 实现原理

1. **维护重定向配置集合**
   - 在项目根目录创建 `redirects.json` 配置文件
   - 手动维护所有需要的重定向规则
   - 配置格式: `[{ "from": "/old-url", "to": "/new-url" }]`

2. **读取重定向配置**
   - 构建脚本读取 `redirects.json` 文件
   - 解析所有重定向规则
   - 支持通配符和模式匹配(可选)

3. **构建重定向页面**
   - 为每个旧 URL 创建 HTML 文件
   - HTML 包含:
     - `<meta http-equiv="refresh" content="0;url={new-url}">` (即时重定向)
     - JavaScript 双重保险 `window.location.replace({new-url})`
     - 用户友好的跳转提示信息
     - 规范链接 `<link rel="canonical" href="{new-url}">`

4. **部署到 GitHub Pages**
   - 重定向页面作为静态文件部署
   - 用户访问旧 URL 时加载重定向页面
   - 浏览器自动跳转到新 URL

#### 优势

- ✅ **简单直接**: 无需复杂的文件扫描和 URL 生成逻辑
- ✅ **灵活可控**: 可以精确控制哪些 URL 需要重定向
- ✅ **易于维护**: 新增内容时不需要自动添加重定向
- ✅ **适用广泛**: 可以添加任意自定义重定向规则
- ✅ **性能优化**: 只为需要的 URL 生成重定向页面

#### 技术细节

**重定向配置文件** (`redirects.json`):
```json
{
  "redirects": [
    {
      "from": "/blog/2026/01/28/streamjsonrpc-integration-in-hagicode",
      "to": "/blog/2026-01-28-streamjsonrpc-integration-in-hagicode/"
    },
    {
      "from": "/blog/2026/01/25/how-to-sync-docker-hub-to-azure-acr-with-github",
      "to": "/blog/2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github/"
    },
    {
      "from": "/docs/quick-start/create-first-project",
      "to": "/quick-start/create-first-project/"
    },
    {
      "from": "/docs/installation/docker-compose",
      "to": "/installation/docker-compose/"
    }
  ]
}
```

**构建脚本处理逻辑**:
```javascript
// 读取重定向配置
const redirects = JSON.parse(fs.readFileSync('redirects.json', 'utf8'));

// 遍历配置生成重定向页面
redirects.redirects.forEach(({ from, to }) => {
  const outputPath = path.join('dist', from + '.html');
  generateRedirectPage(from, to, outputPath);
});
```

### 实现架构

```
构建流程:
1. Astro 构建 → 生成静态 HTML 到 dist/
2. 自定义脚本 (scripts/generate-redirects.js):
   ├─ 读取 redirects.json 配置文件
   ├─ 解析重定向规则
   ├─ 为每个规则创建 HTML 重定向页面
   └─ 输出到 dist/ 对应路径
3. 部署到 GitHub Pages
```

### 重定向页面模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>正在重定向...</title>
  <link rel="canonical" href="{new-url}">
  <meta http-equiv="refresh" content="0;url={new-url}">
  <style>
    body { font-family: system-ui; padding: 2rem; text-align: center; }
    a { color: #0066cc; }
  </style>
</head>
<body>
  <h1>页面已迁移</h1>
  <p>正在为您重定向到新页面...</p>
  <p>如果没有自动跳转,请<a href="{new-url}">点击这里</a>。</p>
  <script>
    // 双重保险:如果 meta refresh 不工作,使用 JavaScript
    window.location.replace('{new-url}');
  </script>
</body>
</html>
```

## 风险与挑战

### 潜在风险

#### 风险 1: 非 301 重定向的 SEO 影响

**概率**: 高
**影响**: 中

**问题描述**:
- HTML meta refresh 和 JavaScript 重定向在技术上不是 HTTP 301
- 搜索引擎可能不会完全转移权重

**缓解措施**:
- 使用 `<link rel="canonical">` 指向新 URL,帮助搜索引擎识别规范页面
- 在 Google Search Console 提交地址变更通知
- 监控搜索流量,评估权重传递效果
- 考虑未来迁移到支持服务器配置的托管平台(如 Netlify, Vercel)

#### 风险 2: 构建复杂度增加

**概率**: 中
**影响**: 低

**问题描述**:
- 自定义构建脚本增加维护成本
- 可能与其他构建流程冲突

**缓解措施**:
- 保持脚本简单、独立
- 充分注释代码
- 添加单元测试
- 在 CI/CD 中验证构建

#### 风险 3: 动态重定向规则覆盖不全

**概率**: 中
**影响**: 中

**问题描述**:
- 新增内容时可能遗漏重定向规则
- 边缘情况处理不当

**缓解措施**:
- 自动从内容集合生成规则
- 添加日志输出,便于调试
- 提供手动配置覆盖机制
- 定期审查 404 日志

#### 风险 4: 子路径部署场景的兼容性

**概率**: 中
**影响**: 高

**问题描述**:
- `VITE_SITE_BASE=/site` 时重定向路径可能错误
- 需要动态处理 base 路径

**缓解措施**:
- 从环境变量读取 base 路径
- 在生成规则时统一添加 base 前缀
- 针对不同场景测试

### 挑战与解决方案

#### 挑战 1: 如何处理 blog 目录下的旧链接

**背景**: 迁移后博客文章位于 `src/content/docs/blog/`,但旧 URL 是 `/blog/YYYY/MM/DD/slug`。

**解决方案**:
- 在内容集合配置中,博客集合的 slug 可能已配置为 `/blog/:slug`
- 需要检查 Starlight Blog 插件的配置
- 确保重定向规则与实际路由匹配

#### 挑战 2: 如何验证重定向在生产环境正常工作

**挑战**: GitHub Actions 自动部署,本地无法完全模拟。

**解决方案**:
- 使用 `npm run build:site` 在本地构建子路径版本
- 使用 `npm run preview` 预览构建结果
- 访问旧 URL 路径,验证重定向页面生成
- 部署后使用在线工具检查 HTTP 状态码

#### 挑战 3: 如何处理带查询参数的旧链接

**挑战**: 旧链接可能包含查询参数,如 `?utm_source=...`。

**解决方案**:
- 在重定向脚本中保留查询参数
- JavaScript 重定向时拼接参数: `window.location.replace(newUrl + window.location.search)`

## 实施计划

### 阶段 1: 研究与验证 (预计 30 分钟)

**目标**: 确认技术方案的可行性和最佳实践。

1. **调研 Astro 重定向配置**
   - 查阅 Astro 文档,了解 redirects 配置的适用场景
   - 确认是否支持静态托管(预计不支持)

2. **研究 GitHub Pages 重定向最佳实践**
   - 搜索 GitHub Pages + Jekyll 重定向方案
   - 参考 Astro 社区的静态托管重定向经验

3. **验证博客路由配置**
   - 检查 `src/content/docs/blog/` 的 Starlight Blog 配置
   - 确认新 URL 格式: `/blog/YYYY-MM-DD-slug/`

4. **创建概念验证脚本**
   - 编写简单的 Node.js 脚本读取内容集合
   - 生成旧 URL 和新 URL 的映射
   - 验证 URL 转换逻辑

### 阶段 2: 实现重定向脚本 (预计 1-2 小时)

**目标**: 创建构建时重定向页面生成脚本。

1. **创建重定向脚本文件**
   - 文件路径: `scripts/generate-redirects.js`
   - 功能: 读取内容,生成 HTML 重定向页面

2. **实现博客文章重定向逻辑**
   - 扫描 `src/content/docs/blog/*.md`
   - 从文件名提取日期和 slug
   - 生成 `/blog/YYYY/MM/DD/slug.html` 重定向页面

3. **实现文档页面重定向逻辑**
   - 扫描 `src/content/docs/**/*.md` (排除 blog)
   - 从路径提取分类和 slug
   - 生成 `/docs/category/slug.html` 重定向页面

4. **集成到构建流程**
   - 更新 `package.json` 的 build 脚本
   - 在 `astro build` 后运行重定向脚本

### 阶段 3: 测试与验证 (预计 30 分钟)

**目标**: 确保重定向在所有场景下正常工作。

1. **本地开发环境测试**
   - 运行 `npm run build` 和 `npm run preview`
   - 访问旧 URL 路径,验证重定向

2. **子路径部署测试**
   - 运行 `VITE_SITE_BASE=/site npm run build:site`
   - 验证 `/site/blog/...` 重定向到 `/site/blog/...`

3. **边界情况测试**
   - 测试带查询参数的 URL
   - 测试不存在的旧 URL(应返回 404)
   - 测试中文 slug 的 URL 编码

4. **构建验证**
   - 确认 `dist/` 目录包含重定向页面
   - 确认构建无错误
   - 确认性能影响可接受

### 阶段 4: 部署与监控 (预计 15 分钟)

**目标**: 部署到生产环境并验证效果。

1. **创建 Pull Request**
   - 提交代码和文档
   - 请求审查

2. **部署到 GitHub Pages**
   - 合并 PR 后自动触发部署
   - 等待部署完成

3. **生产环境验证**
   - 访问实际的旧 URL,测试重定向
   - 使用浏览器开发者工具检查网络请求
   - 使用在线工具检查 HTTP 状态码

4. **监控和优化**
   - 在 GitHub Pages 查看 404 日志(如果有)
   - 在 Google Search Console 监控索引状态
   - 根据需要调整规则

## 验证标准

### 功能验证

- [ ] 博客旧 URL `/blog/YYYY/MM/DD/slug` 正确重定向到 `/blog/YYYY-MM-DD-slug/`
- [ ] 文档旧 URL `/docs/category/slug` 正确重定向到 `/category/slug/`
- [ ] 重定向页面包含 `<meta http-equiv="refresh">`
- [ ] 重定向页面包含 JavaScript 双重保险
- [ ] 重定向页面包含用户友好的提示信息
- [ ] 重定向页面包含 canonical 链接

### 部署验证

- [ ] 根路径部署 (`VITE_SITE_BASE=/`) 重定向正常
- [ ] 子路径部署 (`VITE_SITE_BASE=/site`) 重定向正常
- [ ] 构建无错误,重定向页面正确生成到 `dist/`
- [ ] 开发服务器 (`npm run dev`) 正常运行
- [ ] 生产构建预览 (`npm run preview`) 正常工作

### SEO 验证

- [ ] 重定向页面返回正确的 HTTP 状态码(接近 301 效果)
- [ ] canonical 链接指向新 URL
- [ ] 在 Google Search Console 提交地址变更
- [ ] 监控旧 URL 的搜索流量变化

### 兼容性验证

- [ ] 现有页面功能不受影响
- [ ] 主题切换正常
- [ ] 导航菜单正常
- [ ] Mermaid 图表正常渲染
- [ ] 外部链接新标签页打开功能正常

## 后续考虑

### 未来优化

1. **迁移到支持服务器配置的托管平台**
   - Netlify: 使用 `_redirects` 文件配置真正的 301 重定向
   - Vercel: 使用 `vercel.json` 配置 `routes` 或 `rewrites`
   - Cloudflare Pages: 使用 `_redirects` 文件

2. **自动化监控**
   - 定期检查 404 日志,识别遗漏的重定向规则
   - 自动向内容作者报告断链
   - 集成到 CI/CD 流程

3. **用户友好性改进**
   - 在重定向页面添加更详细的迁移说明
   - 提供站点搜索功能,帮助用户找到内容
   - 添加面包屑导航

4. **性能优化**
   - 使用 CDN 缓存重定向页面
   - 预渲染常用重定向
   - 减少重定向页面文件大小

### 维护建议

1. **定期审查重定向规则**
   - 每次新增内容时检查是否需要添加重定向
   - 每月审查 404 日志

2. **保持脚本更新**
   - 当 Astro 版本更新时,检查是否有更好的重定向方案
   - 当内容结构变化时,更新重定向逻辑

3. **文档维护**
   - 在项目文档中记录重定向机制
   - 为新贡献者提供说明

## 相关规格

此提案将修改以下规格:

- **openspec/specs/content-management/spec.md**: 添加 URL 重定向需求(如果存在)
- **openspec/project.md**: 更新构建脚本说明

## 参考资料

- [Astro - Redirects](https://docs.astro.build/en/guides/routing/#redirects)
- [GitHub Pages - Static Site Generators](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-a-static-site-generator)
- [Google - Move your site to a new domain](https://developers.google.com/search/docs/crawling-indexing/site-moves?hl=en)
- [HTTP 301 vs Meta Refresh](https://www.youtube.com/watch?v=qrLpZd4J6tY)
- [Netlify - Redirects](https://docs.netlify.com/routing/redirects/)
- [Vercel - Rewrites](https://vercel.com/docs/projects/project-configuration/paths)

## 变更类型

- **类型**: 功能增强
- **复杂度**: 中
- **风险评估**: 中
- **向后兼容**: 是(不影响现有功能)
- **用户可见**: 是(用户通过旧链接访问时会体验自动重定向)

## 批准状态

- [ ] 技术方案已批准
- [ ] 实施计划已批准
- [ ] 风险评估已完成
- [ ] 准备开始实施
