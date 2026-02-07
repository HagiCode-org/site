# Change: 更新域名至生产环境

**Status**: ExecutionCompleted

## Why

Hagicode 项目已完成正式上线部署,配置了正式生产域名 `hagicode.com`。当前文档和代码中仍存在大量指向旧版 GitHub Pages 托管地址 (`hagicode-org.github.io`) 的引用,需要更新为正式的生产环境域名以确保用户访问正确的站点。

## What Changes

- **更新站点配置**: 将 `astro.config.mjs` 中的 `site` 和 `sitemap` 配置从 `hagicode-org.github.io/site` 更新为 `hagicode.com`
- **更新导航链接**: 将 `src/config/navigation.ts` 中的 Docker Compose Builder 链接从 `hagicode-org.github.io/docker-compose-builder/` 更新为 `builder.hagicode.com`
- **更新 README 链接**: 将 `README.md` 中的官网链接更新为 `hagicode.com`
- **更新文档内容**: 更新所有文档文件中的旧域名引用
  - SEO 配置文档 (`src/content/docs/seo-config.md`)
  - SEO 检查清单 (`src/content/docs/seo-checklist.md`)
  - 搜索引擎提交文档 (`src/content/docs/search-engine-submission.md`)
  - 安装指南 (`src/content/docs/installation/docker-compose.mdx`)
  - 博客文章中的链接引用
- **更新组件配置**: 将 `src/components/StarlightHead.astro` 中的社交卡片图片 URL 从 `hagicode-org.github.io` 更新为 `hagicode.com`
- **更新项目元数据**: 将 `openspec/project.md` 中的域名示例更新为新域名
- **更新规范文件**: 更新 `openspec/specs/url-redirect/spec.md` 中的 canonical 链接示例

## Impact

- Affected specs: `astro-site`, `url-redirect`
- Affected code:
  - `astro.config.mjs` - Astro 框架配置
  - `src/config/navigation.ts` - 导航配置
  - `src/components/StarlightHead.astro` - 页面头部组件
  - `README.md` - 项目说明文件
  - `openspec/project.md` - 项目配置文档
  - `openspec/specs/url-redirect/spec.md` - URL 重定向规范
  - `src/content/docs/` - 所有文档内容文件

## User Experience Improvements

- 用户访问文档时将直接看到正确的生产环境域名
- 避免因旧域名引用导致的用户混淆
- 提升品牌一致性(统一使用 hagicode.com 域名)

## SEO Benefits

- 正式域名有利于搜索引擎索引和排名
- Canonical 链接指向新的生产环境 URL
- 统一的域名结构有助于 SEO 权重积累

## Maintenance Improvements

- 减少因多域名引用造成的维护混淆
- 确保文档与实际部署环境一致
- 为后续更新提供准确的引用基础
