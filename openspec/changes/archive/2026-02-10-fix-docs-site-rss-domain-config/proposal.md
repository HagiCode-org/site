# 修复文档站点 RSS 链接域名配置

<!-- OPENSPEC:STATUS -->
**状态**: ExecutionCompleted
**执行日期**: 2026-02-10
**提交**: e026c8f
<!-- OPENSPEC:STATUS:END -->

## Overview

将 `apps/docs/` 文档站点的 `site` 配置从 `https://hagicode.com` 修正为 `https://docs.hagicode.com`，确保 RSS feed、sitemap 和 canonical URL 使用正确的文档站点域名。

## Background

项目使用 Astro 5.x + Starlight 构建了一个包含两个独立站点的 monorepo：
- `apps/docs/` - 技术文档站点（应部署至 `docs.hagicode.com`）
- `apps/website/` - 营销落地页站点（部署至 `hagicode.com`）

当前文档站点的 `astro.config.mjs` 中 `site` 配置错误地指向了主站域名，这会影响所有基于站点基础 URL 的功能。

## Problem Statement

**问题位置**: `apps/docs/astro.config.mjs:30`

```javascript
site: 'https://hagicode.com',  // ❌ 错误：指向主站域名
```

**影响范围**:
1. **Canonical URLs** - 所有页面的规范链接指向错误域名
2. **Sitemap** - `sitemap-index.xml` 中的链接使用错误域名
3. **RSS Feeds** - 如果启用 RSS，feed 中的所有链接将指向错误域名
4. **SEO** - 搜索引擎索引使用错误的规范 URL

**注意**: 当前 `starlight-blog` 插件的 `rss` 选项设置为 `false`（RSS 功能禁用），但 `site` 配置错误仍会在未来启用 RSS 时造成问题，且当前已影响 sitemap 和 canonical URLs。

## Proposed Solution

**核心修改**: 将 `apps/docs/astro.config.mjs` 中的 `site` 配置更新为正确的文档站点域名。

```javascript
site: 'https://docs.hagicode.com',  // ✅ 正确：指向文档站点域名
```

**配置检查清单**:
1. ✅ 更新 `site` 配置项
2. ✅ 验证 `robotsTxt` 配置中的 sitemap URL（line 64）
3. ✅ 确认 `base` 配置保持不变（开发环境 `/`，生产环境 `/docs`）

## Scope

### In Scope
- 修改 `apps/docs/astro.config.mjs` 中的 `site` 配置
- 验证并更新相关的 sitemap URL 引用
- 构建测试以确认生成的 XML 文件使用正确域名

### Out of Scope
- 修改 `apps/website/` 营销站点配置
- 启用 `starlight-blog` 的 RSS 功能（当前保持 `rss: false`）
- 修改博客文章 frontmatter
- 部署配置（CI/CD 流程）

## Impact Assessment

### Positive Impact
- ✅ RSS feed 链接将正确指向 `docs.hagicode.com`
- ✅ Sitemap 索引使用正确的文档站点域名
- ✅ Canonical URLs 正确指向文档站点
- ✅ SEO 和搜索引擎索引得到改善

### Risk Assessment
- 🟡 **低风险**: 配置修改简单直接，无架构变更
- 🟡 **测试需求**: 需要本地构建验证生成的 XML 文件

### Breaking Changes
- 无 API 破坏性变更
- 对现有用户无影响（配置未在生产环境正确部署）

## Success Criteria

1. **构建验证**: `turbo run build --filter=docs` 成功执行
2. **Sitemap 检查**: 生成的 `sitemap-index.xml` 中所有链接使用 `docs.hagicode.com`
3. **Canonical URL 检查**: HTML 页面的 `<link rel="canonical">` 使用正确域名
4. **RSS 验证**（如启用）: RSS XML 文件中所有链接使用 `docs.hagicode.com`

## Alternatives Considered

| 方案 | 描述 | 结论 |
|------|------|------|
| 保持现状 | 不修改配置，继续使用主站域名 | ❌ 不正确：文档站点应使用独立域名 |
| 环境变量 | 使用环境变量动态配置 site | ❌ 过度设计：文档站点域名固定，无需动态配置 |

## Dependencies

- Astro 5.x
- @astrojs/starlight
- @astrojs/sitemap
- starlight-blog (v0.25.2)

## References

- [Astro Site Configuration](https://docs.astro.build/en/reference/configuration-reference/#site)
- [Starlight Blog RSS Configuration](https://starlight.blog/guides/rss)
