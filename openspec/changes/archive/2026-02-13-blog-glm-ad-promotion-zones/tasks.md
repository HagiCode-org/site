## 1. 准备工作

- [ ] 1.1 在 `packages/shared/src/links.ts` 中添加 GLM 推广链接配置常量
- [ ] 1.2 导出 GLM 相关链接配置（API Token 获取链接、官方文档链接）

## 2. 组件开发

- [ ] 2.1 创建 `apps/docs/src/components/BlogHeaderAd.astro` 组件
  - 开头广告组件，简洁的推广卡片样式
  - 包含 GLM 推荐文案和购买链接
  - 样式与 Starlight 主题保持一致（使用 CSS 变量）
- [ ] 2.2 创建 `apps/docs/src/components/BlogFooterAd.astro` 组件
  - 结尾广告组件，扩展的链接列表样式
  - 包含 GLM 和 Docker Compose 指南链接
  - 样式与 Starlight 主题保持一致（使用 CSS 变量）
- [ ] 2.3 确保两个组件的外部链接都使用 `target="_blank"` 和 `rel="noopener noreferrer"`

## 3. 博客布局集成

- [ ] 3.1 研究 starlight-blog 插件的博客文章渲染机制
- [ ] 3.2 确定广告组件注入点（文章开头和结尾）
- [ ] 3.3 在博客文章布局开头位置集成 `BlogHeaderAd.astro` 组件
- [ ] 3.4 在博客文章布局结尾位置集成 `BlogFooterAd.astro` 组件
- [ ] 3.5 支持通过 frontmatter `hideAd: true` 属性隐藏广告（可选功能）

## 4. 测试验证

- [ ] 4.1 本地启动开发服务器 `npm run dev:docs`
- [ ] 4.2 访问博客文章页面，验证 `BlogHeaderAd` 开头广告显示正确
- [ ] 4.3 验证 `BlogFooterAd` 结尾广告显示正确
- [ ] 4.4 验证两个组件的外部链接打开行为（新标签页）
- [ ] 4.5 验证暗色/亮色主题下两个广告组件样式正常
- [ ] 4.6 运行 `npm run build:docs` 确保构建成功
- [ ] 4.7 运行 `npm run typecheck` 确保类型检查通过

## 5. 文档更新

- [ ] 5.1 更新 `packages/shared/src/links.ts` 的注释说明新增的 GLM 配置
- [ ] 5.2 如需要，更新 `openspec/project.md` 中关于博客组件的说明
