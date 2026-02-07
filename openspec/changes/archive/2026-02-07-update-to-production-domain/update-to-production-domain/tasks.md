## 1. 更新核心配置文件

- [ ] 1.1 更新 `astro.config.mjs` 中的 `site` 配置
  - 从 `https://hagicode-org.github.io/site` 更新为 `https://hagicode.com`
- [ ] 1.2 更新 `astro.config.mjs` 中的 `sitemap` 配置
  - 从 `https://hagicode-org.github.io/site/sitemap-index.xml` 更新为 `https://hagicode.com/sitemap-index.xml`

## 2. 更新导航配置

- [ ] 2.1 更新 `src/config/navigation.ts` 中的 Docker Compose Builder 链接
  - 从 `https://hagicode-org.github.io/docker-compose-builder/` 更新为 `https://builder.hagicode.com/`

## 3. 更新组件文件

- [ ] 3.1 更新 `src/components/StarlightHead.astro` 中的社交卡片图片 URL
  - 从 `https://hagicode-org.github.io` 更新为 `https://hagicode.com`

## 4. 更新文档文件

- [ ] 4.1 更新 `src/content/docs/seo-config.md` 中的域名引用
  - 更新所有 `hagicode-org.github.io/site` 为 `hagicode.com`
- [ ] 4.2 更新 `src/content/docs/seo-checklist.md` 中的域名引用
  - 更新 sitemap 和 robots.txt URL
- [ ] 4.3 更新 `src/content/docs/search-engine-submission.md` 中的域名引用
  - 更新所有站点 URL 示例
- [ ] 4.4 更新 `src/content/docs/installation/docker-compose.mdx` 中的 Docker Compose Builder 链接
  - 从 `https://hagicode-org.github.io/docker-compose-builder/` 更新为 `https://builder.hagicode.com/`

## 5. 更新博客文章

- [ ] 5.1 更新所有博客文章中的官网链接
  - `src/content/docs/blog/2026-02-04-starlight-docs-integration-microsoft-clarity.md`
  - `src/content/docs/blog/2026-02-03-hagicode-react-19-hydration-splash-screen.md`
  - `src/content/docs/blog/2026-02-01-net-core-双数据库实战优雅融合-postgresql-与-sqlite-的最佳实践.md`
  - `src/content/docs/blog/2026-01-28-利用-worker-threads-优化-vite-构建性能的实战.mdx`
  - `src/content/docs/blog/2026-01-28-streamjsonrpc-integration-in-hagicode.mdx`
  - `src/content/docs/blog/2026-01-26-modern-build-system-with-csharp-and-nuke.mdx`
  - `src/content/docs/blog/2026-01-26-docusaurus-auto-deployment-with-github-actions.mdx`
  - `src/content/docs/blog/2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github.mdx`

## 6. 更新项目元数据

- [ ] 6.1 更新 `README.md` 中的官网链接
  - 从 `https://hagicode-org.github.io/site/` 更新为 `https://hagicode.com/`

## 7. 更新 OpenSpec 规范

- [ ] 7.1 更新 `openspec/project.md` 中的域名示例
  - 从 `pcode-org.github.io` 更新为 `hagicode.com`
- [ ] 7.2 更新 `openspec/specs/url-redirect/spec.md` 中的 canonical 链接示例
  - 从 `hagicode-org.github.io/site` 更新为 `hagicode.com`

## 8. 验证和测试

- [ ] 8.1 运行 `npm run build` 确保构建成功
- [ ] 8.2 运行 `npm run typecheck` 确保类型检查通过
- [ ] 8.3 本地预览 (`npm run preview`) 验证所有链接正常
- [ ] 8.4 检查生成的 sitemap.xml 是否包含正确的域名
- [ ] 8.5 验证社交卡片图片 URL 是否正确
