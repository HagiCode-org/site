## 1. 实现准备

- [ ] 1.1 阅读并理解 `openspec/changes/fix-docs-base-path-links/proposal.md`
- [ ] 1.2 阅读并理解 `openspec/changes/fix-docs-base-path-links/specs/astro-site/spec.md` 中的规范变更

## 2. 代码修改

- [ ] 2.1 修改 `packages/shared/src/links.ts` 中的 `getDocsBasePath()` 函数
  - [ ] 2.1.1 将生产环境返回值从 `/docs` 改为 `/`
  - [ ] 2.1.2 更新函数注释说明当前部署架构

- [ ] 2.2 更新 `packages/shared/src/links.ts` 中的 `SITE_LINKS` 配置
  - [ ] 2.2.1 更新 `SITE_LINKS.docs.prod` 从 `https://hagicode.com/docs/` 改为 `https://docs.hagicode.com/`
  - [ ] 2.2.2 更新 `SITE_LINKS.blog.prod` 从 `https://hagicode.com/docs/blog/` 改为 `https://docs.hagicode.com/blog/`
  - [ ] 2.2.3 更新 `SITE_LINKS.productOverview.prod` 从 `https://hagicode.com/docs/product-overview/` 改为 `https://docs.hagicode.com/product-overview/`
  - [ ] 2.2.4 更新 `SITE_LINKS.dockerCompose.prod` 从 `https://hagicode.com/docs/installation/docker-compose/` 改为 `https://docs.hagicode.com/installation/docker-compose/`
  - [ ] 2.2.5 更新 `SITE_LINKS.rss.prod` 从 `https://hagicode.com/docs/blog/rss.xml` 改为 `https://docs.hagicode.com/blog/rss.xml`

## 3. 验证和测试

- [ ] 3.1 运行 TypeScript 类型检查
  - [ ] 3.1.1 执行 `npm run typecheck` 确保没有类型错误

- [ ] 3.2 本地开发环境测试
  - [ ] 3.2.1 启动文档站点 `npm run dev:docs`
  - [ ] 3.2.2 验证导航菜单链接正确
  - [ ] 3.2.3 验证页面间跳转功能正常
  - [ ] 3.2.4 验证面包屑显示正确

- [ ] 3.3 启动营销站点测试
  - [ ] 3.3.1 启动营销站点 `npm run dev:website`
  - [ ] 3.3.2 验证指向文档的链接正确
  - [ ] 3.3.3 验证跨站点导航功能

- [ ] 3.4 生产构建测试
  - [ ] 3.4.1 执行 `npm run build`
  - [ ] 3.4.2 验证构建成功无错误
  - [ ] 3.4.3 检查生成的站点地图包含正确的 URL
  - [ ] 3.4.4 执行 `npm run preview:docs` 验证生产构建

## 4. 部署配置

- [ ] 4.1 检查 Azure Static Web Apps 配置
  - [ ] 4.1.1 验证 `apps/docs/public/staticwebapp.config.json` 路由配置
  - [ ] 4.1.2 确认不需要额外的重定向规则

- [ ] 4.2 准备重定向规则（如需要）
  - [ ] 4.2.1 评估是否需要配置从 `https://hagicode.com/docs/*` 到 `https://docs.hagicode.com/*` 的重定向
  - [ ] 4.2.2 如需要，更新 `staticwebapp.config.json` 添加重定向规则

## 5. 文档更新

- [ ] 5.1 更新相关文档（如有）
  - [ ] 5.1.1 检查是否有文档中硬编码了旧的 `/docs/` 路径
  - [ ] 5.1.2 更新相关配置文档

## 6. 完成确认

- [ ] 6.1 所有 tasks.md 中的任务已完成
- [ ] 6.2 代码已提交并创建 Pull Request
- [ ] 6.3 变更已通过代码审查
- [ ] 6.4 变更已部署到生产环境
- [ ] 6.5 生产环境验证通过
- [ ] 6.6 准备归档此变更提案
