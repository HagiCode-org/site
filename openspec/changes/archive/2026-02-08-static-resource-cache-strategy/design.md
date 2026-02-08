# Design: 静态资源缓存策略

## Context

**项目背景**
- 使用 Astro 5.16 作为静态站点生成器（SSG）
- 构建输出位于 `dist/` 目录，部署到 GitHub Pages 和 Azure Static Web Apps
- Astro 在 `_astro/` 目录下生成的文件名包含哈希值（如 `client.Dc9Vh3na.js`）

**哈希特性**
- 文件内容变化时会生成新的哈希值，文件名随之改变
- 同一哈希值的文件内容永远不会改变（不可变特性）
- 理论上可以为哈希资源设置极长的缓存时间

**当前状况**
- 项目已有 `public/staticwebapp.config.json`（仅包含 fallback 重写规则）
- 项目没有 `.htaccess` 文件

## Goals / Non-Goals

**Goals**
- 为哈希资源配置长达 1 年的不可变缓存
- 为非哈希静态资源（图片、字体）配置适度的缓存时间
- 确保 HTML 文档不被缓存，保证内容更新及时生效
- 在两个部署平台（GitHub Pages 和 Azure SWA）实现一致的缓存策略

**Non-Goals**
- 不修改 Astro 构建配置
- 不改变站点内容或结构
- 不引入额外的构建工具或依赖

## Decisions

### Decision 1: 使用 `.htaccess` 配置 GitHub Pages 缓存

**选择理由**
- GitHub Pages 基于 Apache 服务器，支持 `.htaccess` 配置
- `.htaccess` 是 Apache 的标准配置方式，语法成熟稳定
- 无需修改构建流程，文件会被自动复制到 `dist/` 目录

**Alternatives considered**
- 使用 GitHub Actions 注入缓存头：过于复杂，增加 CI/CD 负担
- 使用前端 JavaScript 控制：不可靠，无法控制 CDN 缓存

### Decision 2: 缓存策略分层

| 资源类型 | 模式 | 缓存策略 | 原因 |
|---------|------|----------|------|
| 哈希资源 | `_astro/*.js`, `_astro/*.css` | `public, max-age=31536000, immutable` | 文件名包含哈希，内容永不改变 |
| 非哈希静态资源 | `img/**/*`, `*.ico`, `*.svg` 等 | `public, max-age=86400` | 内容可能更新，但频率较低 |
| HTML 文档 | `*.html` | `public, max-age=0, must-revalidate` | 内容经常更新，需要及时生效 |

### Decision 3: Azure SWA 使用 `globalOverrides` 配置全局缓存

**选择理由**
- `globalOverrides` 可以覆盖所有路由的默认缓存行为
- 支持基于文件扩展名的精细化配置
- 语法简洁，维护方便

**Alternatives considered**
- 为每个路由单独配置：配置冗长，维护成本高
- 使用 Azure Front Door：过度设计，增加复杂度

## Technical Design

### 文件结构

```
public/
├── .htaccess                    # 新增：GitHub Pages 缓存配置
├── staticwebapp.config.json     # 修改：Azure SWA 缓存配置
├── favicon.ico
├── logo.svg
└── img/
```

### GitHub Pages 配置（`.htaccess`）

```apache
# 为哈希资源配置 1 年不可变缓存
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  # _astro 目录下的资源包含哈希，可以安全地长期缓存
  <FilesMatch "_astro/.*\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  # 图片和字体资源缓存 1 天
  <FilesMatch "\.(jpg|jpeg|png|gif|ico|svg|webp|woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=86400"
  </FilesMatch>

  # HTML 文档不缓存
  <FilesMatch "\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>
```

### Azure SWA 配置（`staticwebapp.config.json`）

```json
{
  "navigationFallback": {
    "rewrite": "index.html"
  },
  "globalHeaders": {
    "cache-control": "public, max-age=0, must-revalidate"
  },
  "overrides": {
    "route": "/_astro/*",
    "headers": {
      "cache-control": "public, max-age=31536000, immutable"
    }
  },
  "mimeTypes": {
    "fileExtension": {
      ".svg": "image/svg+xml"
    }
  }
}
```

**注意**：Azure SWA 的配置需要根据实际 API 调整，上述示例仅供参考。

### 验证方法

1. **浏览器开发者工具验证**
   - 打开 Network 面板
   - 刷新页面，检查资源的 Response Headers
   - 验证 `Cache-Control` 头是否符合预期

2. **Lighthouse 性能评分**
   - 运行 Lighthouse 审计
   - 检查"使用高效缓存策略"指标是否提升

3. **缓存命中验证**
   - 刷新页面
   - 检查 `Size` 列是否显示 `(from disk cache)` 或 `(from memory cache)`

## Risks / Trade-offs

### Risk 1: 缓存配置可能不被支持

**风险**：某些托管平台可能不支持 `.htaccess` 或自定义缓存头

**缓解措施**：
- GitHub Pages 明确支持 `.htaccess`
- Azure SWA 支持 `staticwebapp.config.json` 的缓存配置
- 部署后验证缓存头是否生效

### Risk 2: HTML 文档不缓存可能影响首次加载性能

**风险**：`max-age=0` 意味着每次都需要验证文档新鲜度

**缓解措施**：
- HTML 文档通常很小，验证开销较低
- CDN 仍然可以缓存 HTML，只是需要验证
- 保证内容更新及时生效更重要

### Risk 3: 非哈希资源缓存可能导致陈旧内容

**风险**：图片等资源可能在更新后仍显示旧内容

**缓解措施**：
- 1 天的缓存时间是合理的平衡
- 内容更新不频繁，影响可控
- 必要时可以通过 URL 参数强制刷新

## Migration Plan

**步骤**
1. 添加 `public/.htaccess` 文件
2. 更新 `public/staticwebapp.config.json`
3. 构建并部署到两个平台
4. 验证缓存头是否正确设置
5. 监控 Lighthouse 性能评分变化

**回滚**
- 直接删除 `.htaccess` 文件
- 恢复 `staticwebapp.config.json` 到原始状态
- 重新部署

## Open Questions

- [ ] Azure Static Web Apps 的缓存配置语法是否需要调整？（需要查阅最新文档确认）
- [ ] 是否需要为 `pagefind/` 目录（搜索索引）配置特殊缓存策略？
- [ ] 图片资源是否需要根据类型（PNG vs SVG）设置不同的缓存策略？
