# Change: 为静态网站配置资源缓存策略

## Why

当前站点配置中没有显式定义静态资源的 HTTP 缓存头，未能充分利用 Astro 构建的哈希资源的不可变特性。这导致：
- 重复访问时用户可能需要重新验证或下载未变化的资源
- CDN 缓存能力未被充分利用
- 影响页面加载速度和 Lighthouse 性能评分

## What Changes

为 GitHub Pages 和 Azure Static Web Apps 两个部署平台配置静态资源缓存策略：

1. **GitHub Pages 部署**
   - 添加 `public/.htaccess` 文件配置 Apache 缓存规则

2. **Azure Static Web Apps 部署**
   - 更新 `public/staticwebapp.config.json` 添加全局缓存规则

3. **缓存策略分层**
   - **哈希资源**（`_astro/` 目录下的 `.js`、`.css` 文件）：`Cache-Control: public, max-age=31536000, immutable`（1年）
   - **非哈希静态资源**（图片、字体等）：`Cache-Control: public, max-age=86400`（1天）
   - **HTML 文档**：`Cache-Control: public, max-age=0, must-revalidate`（不缓存）

## Impact

- **受影响的代码文件**：
  - 新增：`public/.htaccess`
  - 修改：`public/staticwebapp.config.json`

- **受影响的部署平台**：
  - GitHub Pages（通过 `.htaccess`）
  - Azure Static Web Apps（通过 `staticwebapp.config.json`）

- **性能提升**：
  - 重复访问时用户可直接从浏览器缓存加载静态资源
  - 减少网络请求和带宽消耗
  - 提升 Lighthouse 性能评分

- **风险等级**：低风险
  - 仅影响缓存策略，不改变站点内容
  - 哈希资源的不可变特性确保缓存安全性

## Success Criteria

- [x] `.htaccess` 文件正确配置哈希资源的长期缓存
- [x] `staticwebapp.config.json` 正确配置分层缓存规则
- [ ] 部署后通过浏览器开发者工具验证缓存头正确设置
- [ ] Lighthouse 性能评分中"使用高效缓存策略"指标提升

## Status

**ExecutionCompleted** - 2026-02-08
