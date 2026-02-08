## 1. GitHub Pages 缓存配置

- [x] 1.1 创建 `public/.htaccess` 文件
- [x] 1.2 为 `_astro/` 目录下的哈希资源配置 1 年不可变缓存
- [x] 1.3 为图片、字体等静态资源配置 1 天缓存
- [x] 1.4 为 HTML 文档配置不缓存或必须重新验证策略

## 2. Azure Static Web Apps 缓存配置

- [x] 2.1 更新 `public/staticwebapp.config.json`
- [x] 2.2 添加全局缓存规则（`globalOverrides`）
- [x] 2.3 为哈希资源配置 1 年不可变缓存
- [x] 2.4 为非哈希静态资源配置 1 天缓存
- [x] 2.5 为 HTML 文档配置不缓存策略

## 3. 验证与测试

- [x] 3.1 本地构建验证配置文件正确复制到 `dist/` 目录
- [ ] 3.2 部署到 GitHub Pages 后验证缓存头（通过浏览器开发者工具）
- [ ] 3.3 部署到 Azure Static Web Apps 后验证缓存头
- [ ] 3.4 使用 Lighthouse 验证性能评分提升
- [ ] 3.5 验证重复访问时资源从浏览器缓存加载

## 4. 文档更新

- [ ] 4.1 更新部署文档（如有）说明缓存策略配置
