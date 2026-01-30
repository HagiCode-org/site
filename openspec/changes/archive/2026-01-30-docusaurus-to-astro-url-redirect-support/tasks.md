# Docusaurus 到 Astro URL 重定向支持 - 实施任务

## 任务概览

本变更将通过构建时生成 HTML 重定向页面的方式,实现从旧 Docusaurus URL 到新 Astro URL 的自动重定向。实施分为 5 个阶段,预计完成时间: **2-2.5 小时**。

## 阶段 1: 准备与环境搭建 (预计 25 分钟)

### 任务 1.1: 研究博客路由配置

**优先级**: 高
**依赖**: 无
**预计时间**: 10 分钟

**步骤**:
1. 检查 `src/content/docs/blog/` 目录结构
2. 查看 Starlight Blog 插件配置
3. 确认新 URL 格式规则
4. 列出现有的博客文章文件名

**验证标准**:
- 明确博客文章的新 URL 格式
- 确认是否使用 `/blog/` 前缀
- 了解文件命名规则

**命令**:
```bash
ls src/content/docs/blog/
# 查看配置文件中的 blog 相关配置
```

---

### 任务 1.2: 研究静态托管重定向最佳实践

**优先级**: 中
**依赖**: 无
**预计时间**: 15 分钟

**步骤**:
1. 搜索 Astro 静态托管重定向方案
2. 查看 GitHub Pages + Jekyll 重定向实践
3. 了解 HTML meta refresh 的 SEO 影响
4. 确认最终技术方案

**验证标准**:
- 确认使用构建时生成 HTML 重定向页面方案
- 了解 SEO 最佳实践
- 明确实现细节

**参考资源**:
- [Astro Redirects 文档](https://docs.astro.build/en/guides/routing/#redirects)
- [GitHub Pages 静态站点最佳实践](https://docs.github.com/en/pages)

---

### 任务 1.3: 创建测试用例列表

**优先级**: 中
**依赖**: 任务 1.1
**预计时间**: 5 分钟

**步骤**:
1. 列出需要重定向的旧 URL 示例
2. 列出对应的新 URL
3. 创建测试清单

**验证标准**:
- 至少包含 5 个博客 URL 测试用例
- 至少包含 5 个文档 URL 测试用例
- 包含边界情况(中文 slug、特殊字符等)

**示例测试用例**:
```
博客:
- /blog/2026/01/28/streamjsonrpc-integration-in-hagicode → /blog/2026-01-28-streamjsonrpc-integration-in-hagicode/
- /blog/2026/01/25/how-to-sync-docker-hub-to-azure-acr-with-github → /blog/2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github/

文档:
- /docs/quick-start/create-first-project → /quick-start/create-first-project/
- /docs/installation/docker-compose → /installation/docker-compose/
```

---

## 阶段 2: 创建重定向配置和脚本 (预计 1-1.5 小时)

### 任务 2.1: 创建重定向配置文件

**优先级**: 高
**依赖**: 任务 1.3
**预计时间**: 15 分钟

**步骤**:
1. 在项目根目录创建 `redirects.json` 文件
2. 定义配置结构:
   ```json
   {
     "redirects": [
       { "from": "/old-url", "to": "/new-url" }
     ]
   }
   ```
3. 添加所有需要重定向的博客文章 URL
4. 添加所有需要重定向的文档页面 URL

**验证标准**:
- `redirects.json` 文件创建成功
- JSON 格式正确
- 包含所有现有的旧 URL 到新 URL 的映射
- 至少包含所有迁移时已存在的内容

**文件**:
- `redirects.json`

**示例配置**:
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

---

### 任务 2.2: 创建重定向脚本文件

**优先级**: 高
**依赖**: 任务 2.1
**预计时间**: 10 分钟

**步骤**:
1. 创建 `scripts/generate-redirects.js`
2. 添加基础结构:
   - 导入必要的 Node.js 模块
   - 定义重定向配置读取函数
   - 定义 HTML 重定向页面生成函数
3. 添加命令行参数处理(支持 `--base` 参数)

**验证标准**:
- 脚本文件创建成功
- 可以独立运行: `node scripts/generate-redirects.js`
- 输出基础日志信息

**文件**:
- `scripts/generate-redirects.js`

**基础代码结构**:
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 配置
const CONFIG = {
  redirectConfig: 'redirects.json',
  outputDir: 'dist',
  base: process.env.VITE_SITE_BASE || '/',
};

// 主函数
async function generateRedirects() {
  console.log('开始生成重定向页面...');
  console.log(`Base 路径: ${CONFIG.base}`);
  // TODO: 读取配置并生成重定向页面
}

generateRedirects().catch(console.error);
```

---

### 任务 2.3: 实现重定向配置读取和页面生成逻辑

**优先级**: 高
**依赖**: 任务 2.2
**预计时间**: 30 分钟

**步骤**:
1. 实现配置文件读取函数
2. 解析 JSON 配置,提取重定向规则
3. 遍历重定向规则,生成 HTML 页面
4. 处理 base 路径前缀

**验证标准**:
- 正确读取 `redirects.json` 文件
- 解析所有重定向规则
- 为每个规则生成对应的 HTML 重定向页面
- 正确处理 base 路径

**代码逻辑**:
```javascript
// 读取重定向配置
function loadRedirectConfig() {
  const configPath = path.join(process.cwd(), CONFIG.redirectConfig);
  const configContent = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(configContent);
}

// 生成所有重定向页面
async function generateRedirects() {
  console.log('开始生成重定向页面...');
  console.log(`Base 路径: ${CONFIG.base}`);

  const config = loadRedirectConfig();
  const { redirects } = config;

  console.log(`找到 ${redirects.length} 个重定向规则`);

  redirects.forEach(({ from, to }) => {
    // 添加 base 前缀
    const fullFrom = CONFIG.base + from;
    const fullTo = CONFIG.base + to;

    // 生成输出路径
    const outputPath = path.join(process.cwd(), 'dist', from + '.html');

    // 生成重定向页面
    generateRedirectPage(fullFrom, fullTo, outputPath);
  });

  console.log(`✓ 成功生成 ${redirects.length} 个重定向页面`);
}
```

---

### 任务 2.4: 实现重定向页面模板

**优先级**: 高
**依赖**: 任务 2.3
**预计时间**: 15 分钟

**步骤**:
1. 设计 HTML 重定向页面模板
2. 包含以下元素:
   - `<meta http-equiv="refresh" content="0;url={new-url}">`
   - JavaScript 双重保险: `window.location.replace()`
   - Canonical 链接
   - 用户友好的提示信息
   - 样式
3. 实现模板函数

**验证标准**:
- 重定向页面包含所有必要的 HTML 标签
- 样式简洁美观
- 提示信息清晰易懂
- JavaScript 处理边界情况(如查询参数)

**模板代码**:
```javascript
function generateRedirectPage(oldUrl, newUrl, outputPath) {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>正在重定向</title>
  <link rel="canonical" href="${newUrl}">
  <meta http-equiv="refresh" content="0;url=${newUrl}">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 2rem;
      background: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 500px;
      text-align: center;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 { margin: 0 0 1rem 0; font-size: 1.5rem; }
    p { margin: 0.5rem 0; line-height: 1.6; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .old-url { font-size: 0.875rem; color: #666; word-break: break-all; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>页面已迁移</h1>
    <p>您访问的页面已移动到新地址,正在为您自动跳转...</p>
    <p>如果没有自动跳转,请<a href="${newUrl}">点击这里</a>。</p>
    <p class="old-url">旧地址: ${oldUrl}</p>
    <p class="old-url">新地址: ${newUrl}</p>
  </div>
  <script>
    // 保留查询参数
    const search = window.location.search;
    const targetUrl = '${newUrl}' + search;

    // 使用 replace 而不是 href,避免用户按后退键再次重定向
    window.location.replace(targetUrl);
  </script>
</body>
</html>`;

  // 确保输出目录存在
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // 写入文件
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`✓ 生成重定向: ${oldUrl} → ${newUrl}`);
}
```

---

### 任务 2.5: 添加错误处理和日志

**优先级**: 中
**依赖**: 任务 2.4
**预计时间**: 10 分钟

**步骤**:
1. 添加 try-catch 错误处理
2. 添加详细的日志输出:
   - 扫描到的文件数量
   - 生成的重定向页面数量
   - 跳过的文件(格式不匹配)
   - 错误信息
3. 添加摘要统计

**验证标准**:
- 脚本运行无崩溃
- 日志信息清晰易读
- 错误信息包含足够的上下文

**日志格式**:
```
开始生成重定向页面...
Base 路径: /

读取重定向配置...
✓ 找到 15 个重定向规则

生成重定向页面...
✓ 生成: /blog/2026/01/28/streamjsonrpc-integration-in-hagicode → /blog/2026-01-28-streamjsonrpc-integration-in-hagicode/
✓ 生成: /docs/quick-start/create-first-project → /quick-start/create-first-project/
...

完成! 共生成 15 个重定向页面。
```

---

### 任务 2.5: 集成到构建流程

**优先级**: 高
**依赖**: 任务 2.4
**预计时间**: 5 分钟

**步骤**:
1. 更新 `package.json` 的 build 脚本
2. 在 `astro build` 后运行重定向脚本
3. 同时更新根路径和子路径构建脚本

**验证标准**:
- `npm run build` 在构建后自动生成重定向页面
- `npm run build:site` 在子路径构建后生成重定向页面
- 构建脚本无错误

**修改 package.json**:
```json
{
  "scripts": {
    "build": "astro build && node scripts/generate-redirects.js && node scripts/custom-404.js",
    "build:site": "VITE_SITE_BASE=/site astro build && node scripts/generate-redirects.js && node scripts/custom-404.js"
  }
}
```

---

## 阶段 3: 本地测试与验证 (预计 30 分钟)

### 任务 3.1: 根路径构建测试

**优先级**: 高
**依赖**: 任务 2.5
**预计时间**: 5 分钟

**步骤**:
1. 运行 `npm run build`
2. 检查构建输出,确认重定向脚本成功运行
3. 检查 `dist/` 目录结构
4. 验证生成的重定向文件

**验证标准**:
- 构建无错误
- `dist/blog/2026/01/28/streamjsonrpc-integration-in-hagicode.html` 文件存在
- `dist/docs/quick-start/create-first-project.html` 文件存在
- 控制台输出显示生成的重定向数量

**命令**:
```bash
npm run build
ls dist/blog/2026/01/28/
ls dist/docs/quick-start/
```

---

### 任务 3.2: 根路径重定向功能测试

**优先级**: 高
**依赖**: 任务 3.1
**预计时间**: 10 分钟

**步骤**:
1. 运行 `npm run preview`
2. 在浏览器中访问旧博客 URL
3. 验证自动跳转到新 URL
4. 检查浏览器地址栏,确认 URL 变化
5. 使用浏览器开发者工具检查网络请求

**验证标准**:
- 访问 `/blog/2026/01/28/streamjsonrpc-integration-in-hagicode` 自动跳转到 `/blog/2026-01-28-streamjsonrpc-integration-in-hagicode/`
- 重定向页面显示友好的提示信息
- 浏览器历史记录正确(可以使用后退按钮)
- 查询参数保留(如 `?utm_source=twitter`)

**测试清单**:
```bash
# 启动预览服务器
npm run preview

# 在浏览器中测试以下 URL:
http://localhost:4321/blog/2026/01/28/streamjsonrpc-integration-in-hagicode
http://localhost:4321/blog/2026/01/25/how-to-sync-docker-hub-to-azure-acr-with-github
http://localhost:4321/docs/quick-start/create-first-project
http://localhost:4321/docs/installation/docker-compose
```

---

### 任务 3.3: 子路径构建测试

**优先级**: 高
**依赖**: 任务 3.2
**预计时间**: 5 分钟

**步骤**:
1. 运行 `npm run build:site`
2. 检查构建输出
3. 验证生成的重定向文件包含正确的 base 路径

**验证标准**:
- 构建无错误
- 重定向页面中的新 URL 包含 `/site` 前缀
- `<link rel="canonical">` 指向正确的完整 URL

**命令**:
```bash
npm run build:site
# 检查生成的重定向页面中的 URL
grep -r "http-equiv" dist/ | head -3
```

---

### 任务 3.4: 子路径重定向功能测试

**优先级**: 高
**依赖**: 任务 3.3
**预计时间**: 10 分钟

**步骤**:
1. 使用 `vite preview --base /site` 或手动配置
2. 在浏览器中访问子路径下的旧 URL
3. 验证重定向到正确的新 URL
4. 检查 base 路径是否正确

**验证标准**:
- 访问 `/site/blog/2026/01/28/slug` 跳转到 `/site/blog/2026-01-28-slug/`
- 访问 `/site/docs/category/slug` 跳转到 `/site/category/slug/`
- 所有链接和资源路径正确

**测试命令**:
```bash
# 可能需要手动设置 base 运行 preview
npx serve dist --base /site
# 或者
npm run preview -- --base /site
```

---

## 阶段 4: 边界情况与兼容性测试 (预计 15 分钟)

### 任务 4.1: 测试查询参数保留

**优先级**: 中
**依赖**: 任务 3.2
**预计时间**: 5 分钟

**步骤**:
1. 访问带查询参数的旧 URL
2. 验证重定向后参数保留

**验证标准**:
- `/blog/2026/01/28/slug?utm_source=twitter` → `/blog/2026-01-28-slug/?utm_source=twitter`
- `/blog/2026/01/28/slug?ref=homepage&id=123` 参数完整保留

---

### 任务 4.2: 测试不存在的旧 URL

**优先级**: 中
**依赖**: 任务 3.2
**预计时间**: 5 分钟

**步骤**:
1. 访问不存在的旧 URL
2. 验证返回 404 错误
3. 验证 404 页面正常显示

**验证标准**:
- `/blog/2025/12/31/nonexistent-post` 返回自定义 404 页面
- `/docs/nonexistent/category` 返回自定义 404 页面
- 404 页面样式正常

---

### 任务 4.3: 测试特殊字符和中文 slug

**优先级**: 中
**依赖**: 任务 3.2
**预计时间**: 5 分钟

**步骤**:
1. 如果有包含中文或特殊字符的文件
2. 验证 URL 编码正确处理
3. 测试重定向是否正常

**验证标准**:
- 中文 slug 正确编码为 URL 格式
- 特殊字符(如 `-`, `_`)正确处理
- 重定向功能正常

---

### 任务 4.4: 兼容性验证

**优先级**: 高
**依赖**: 任务 3.4
**预计时间**: 10 分钟

**步骤**:
1. 验证现有功能不受影响
2. 测试主题切换
3. 测试导航菜单
4. 测试 Mermaid 图表
5. 测试外部链接功能

**验证标准**:
- 主题切换正常
- 导航菜单可正常访问所有页面
- Mermaid 图表正确渲染
- 外部链接在新标签页打开
- 控制台无 JavaScript 错误

---

## 阶段 5: 文档与验证 (预计 20 分钟)

### 任务 5.1: 更新项目文档

**优先级**: 中
**依赖**: 任务 4.4
**预计时间**: 10 分钟

**步骤**:
1. 打开 `openspec/project.md`
2. 在 "Development Scripts" 部分添加重定向脚本说明
3. 在 "Deployment" 部分添加重定向机制说明
4. 更新 "Recent Changes" 添加此变更记录

**验证标准**:
- 文档更新完成
- 说明清晰准确
- 格式符合文档规范

**文件**:
- `openspec/project.md`

**更新内容**:
```markdown
## Development Scripts

```bash
# 生产构建(包含重定向页面生成)
npm run build         # 创建根路径部署生产构建
npm run build:site    # 创建子路径部署生产构建 (VITE_SITE_BASE=/site)
```

构建过程包含:
1. Astro 静态站点生成
2. 生成从旧 Docusaurus URL 到新 Astro URL 的重定向页面
3. 生成自定义 404 错误页面

## URL 重定向

站点实现了从旧 Docusaurus URL 结构到新 Astro URL 结构的自动重定向:

- **博客文章**: `/blog/YYYY/MM/DD/slug` → `/blog/YYYY-MM-DD-slug/`
- **文档页面**: `/docs/category/slug` → `/category/slug/`

重定向通过构建时生成 HTML 页面实现,兼容静态托管(GitHub Pages)。
```

---

### 任务 5.2: 部署后验证

**优先级**: 高
**依赖**: 任务 5.1
**预计时间**: 10 分钟

**步骤**:
1. 等待 GitHub Actions 部署完成
2. 访问生产环境的旧 URL
3. 验证重定向功能
4. 使用在线工具检查 HTTP 状态码

**验证标准**:
- 旧 URL 自动跳转到新 URL
- 重定向页面显示正常
- 无 404 错误

**测试 URL**:
```
https://hagicode-org.github.io/site/blog/2026/01/28/streamjsonrpc-integration-in-hagicode
https://hagicode-org.github.io/site/docs/quick-start/create-first-project
```

---

## 并行任务

以下任务可以并行执行以提高效率:

**并行组 1** (任务 1.1, 1.2):
- 任务 1.1: 研究博客路由配置
- 任务 1.2: 研究静态托管重定向最佳实践

**并行组 2** (任务 2.3, 2.4):
- 任务 2.3: 实现重定向配置读取和页面生成逻辑(依赖任务 2.2)
- 任务 2.4: 实现重定向页面模板(依赖任务 2.2)

**并行组 3** (任务 3.1, 3.3):
- 任务 3.1: 根路径构建测试(依赖任务 2.5)
- 任务 3.3: 子路径构建测试(依赖任务 2.5)

**并行组 4** (任务 4.1, 4.2, 4.3, 5.1):
- 任务 4.1: 测试查询参数保留(依赖任务 3.2)
- 任务 4.2: 测试不存在的旧 URL(依赖任务 3.2)
- 任务 4.3: 测试特殊字符和中文 slug(依赖任务 3.2)
- 任务 5.1: 更新项目文档(依赖任务 4.4)

## 关键路径

关键路径(必须按顺序执行的任务):

1. 任务 1.1 → 任务 1.3 → 任务 2.1 → 任务 2.2 → 任务 2.3 → 任务 2.4 → 任务 2.5 → 任务 3.1 → 任务 3.2 → 任务 4.4 → 任务 5.1 → 任务 5.2

**预计总时间**: 约 2-2.5 小时(考虑并行执行后)

## 风险与缓解措施

### 风险 1: HTML 重定向的 SEO 效果不如 HTTP 301

**概率**: 高
**影响**: 中

**缓解措施**:
- 使用 `<link rel="canonical">` 指向新 URL
- 在 Google Search Console 提交地址变更通知
- 监控搜索流量变化
- 考虑未来迁移到 Netlify/Vercel 等支持服务器配置的平台

### 风险 2: 子路径部署时 base 路径处理错误

**概率**: 中
**影响**: 高

**缓解措施**:
- 从环境变量读取 `VITE_SITE_BASE`
- 在所有生成的 URL 中统一添加 base 前缀
- 针对两种场景分别测试

### 风险 3: 构建脚本与其他构建流程冲突

**概率**: 低
**影响**: 中

**缓解措施**:
- 保持脚本独立,不修改 Astro 构建过程
- 在 Astro 构建后运行
- 添加错误处理,避免中断整个构建

## 成功标准

### 功能完整性

- [x] 博客文章 URL 正确重定向
- [x] 文档页面 URL 正确重定向
- [x] 查询参数保留
- [x] 不存在的 URL 返回 404

### 部署兼容性

- [x] 根路径部署正常
- [x] 子路径部署正常
- [x] 构建无错误

### 用户体验

- [x] 重定向即时(无延迟或极短延迟)
- [x] 重定向页面友好美观
- [x] 新旧 URL 自动跳转

### SEO 优化

- [x] Canonical 链接指向新 URL
- [x] 重定向页面可被搜索引擎索引
- [x] 搜索权重传递最大化

## 后续优化建议

1. **监控和报告**
   - 集成 Google Analytics,跟踪重定向使用情况
   - 定期检查 404 日志,识别遗漏的重定向规则
   - 自动向内容作者报告断链

2. **性能优化**
   - 使用 CDN 缓存重定向页面
   - 优化重定向页面大小
   - 考虑预渲染常用重定向

3. **用户体验改进**
   - 在重定向页面添加站点搜索功能
   - 添加"返回首页"链接
   - 提供更详细的迁移说明

4. **平台迁移**
   - 评估迁移到 Netlify/Vercel 的可行性
   - 使用真正的 301 重定向配置
   - 简化重定向管理

## 参考资料

- [Astro - Routing](https://docs.astro.build/en/guides/routing/)
- [GitHub Pages - Static Sites](https://docs.github.com/en/pages)
- [Google - Move your site](https://developers.google.com/search/docs/crawling-indexing/site-moves)
- [HTTP Status 301](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301)
- [Meta Refresh](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/http-equiv)
