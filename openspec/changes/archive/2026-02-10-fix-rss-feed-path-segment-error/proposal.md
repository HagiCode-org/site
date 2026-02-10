# Change: 修复 RSS 订阅源中的错误路径段

## Why

Hagicode 文档站点的 RSS 订阅源中包含错误的 `/docs` 路径段，导致所有文章链接指向 404 页面。

**问题详情**：
- 当前生成的 URL：`https://docs.hagicode.com/docs/blog/article-title/`（错误）
- 期望的正确 URL：`https://docs.hagicode.com/blog/article-title/`
- 根本原因：文档站点现在是**独立部署**的站点（docs.hagicode.com），完全不需要 `base: '/docs'` 前缀

这影响 RSS 阅读器用户体验（链接指向 404）和搜索引擎索引。

## What Changes

- **移除 `base: '/docs'` 配置**，将其改为 `base: '/'`，因为文档站点现在是独立部署的
- 确保 `starlight-blog` 插件生成的 RSS feed 不包含任何错误的前缀路径

## Impact

- Affected specs: `blog` (RSS feed generation)
- Affected code: `apps/docs/astro.config.mjs`
- 修复后所有 RSS 链接将正确指向 `https://docs.hagicode.com/blog/article-title/`（无 `/docs` 段）
- 无需迁移任何内容文件，仅修改配置即可

## Success Criteria

1. `apps/docs/astro.config.mjs` 中的 `base` 配置改为 `'/'`（移除 `/docs` 前缀）
2. `apps/docs/astro.config.mjs` 中的 `site` 配置保持为 `https://docs.hagicode.com`
3. 构建后生成的 `dist/blog/rss.xml` 中所有链接不包含 `/docs` 路径段
4. 正确的 URL 格式：`https://docs.hagicode.com/blog/article-title/`
5. 所有站点页面（不仅是 RSS）都使用正确的根路径 URL

## Related Changes

**架构说明**：文档站点现在是**独立部署**在 docs.hagicode.com 的站点，不再是某个更大站点的子路径。因此：
- 不需要 `base: '/docs'` 配置
- 应该使用 `base: '/'` 作为根路径
- 所有 URL（包括文档页面、博客文章、RSS feed）都应该从根路径开始

**修复方案**：
将 `getBasePath()` 函数的返回值从生产环境的 `/docs` 改为 `/`，使开发和生产环境都使用根路径。

## Status

**Status**: ExecutionCompleted

**Execution Summary**:
- Modified `apps/docs/astro.config.mjs` - updated `getBasePath()` to return `'/'`
- Modified `apps/docs/src/pages/blog/rss.xml.ts` - updated `getBasePath()` to return `'/'`
- Updated robots.txt sitemap URL to remove `/docs` prefix
- Verified RSS feed now generates correct URLs without `/docs` segment
- Committed changes: `fix(docs): remove /docs base path prefix for standalone deployment`
