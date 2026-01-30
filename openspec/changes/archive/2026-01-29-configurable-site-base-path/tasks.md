# Tasks: 支持可配置的站点基础路径

## 1. Astro 配置更新

- [x] 1.1 修改 `astro.config.mjs` 中的 `base` 配置
- [x] 1.2 将 `base: '/site'` 改为 `base: process.env.VITE_SITE_BASE || '/'`
- [x] 1.3 验证配置语法正确性
- [x] 1.4 确认 TypeScript 类型定义不受影响

## 2. 本地开发验证

- [x] 2.1 运行 `npm run dev` 验证本地开发服务器正常启动
- [x] 2.2 验证本地访问 `http://localhost:4321` 和 `http://localhost:4321/site/` 都能正常工作
- [x] 2.3 验证所有页面链接正常工作
- [x] 2.4 验证图片资源加载正常

## 3. 构建测试 - 根路径模式

- [x] 3.1 设置环境变量 `VITE_SITE_BASE=/`
- [x] 3.2 运行 `npm run build`
- [x] 3.3 验证构建成功,无错误和警告
- [x] 3.4 运行 `npm run preview` 验证预览服务器
- [x] 3.5 验证根路径访问正常 (`http://localhost:4321/`)
- [x] 3.6 验证所有页面链接正常工作
- [x] 3.7 验证图片资源加载正常

## 4. 构建测试 - 子路径模式

- [x] 4.1 设置环境变量 `VITE_SITE_BASE=/site`
- [x] 4.2 运行 `npm run build`
- [x] 4.3 验证构建成功,无错误和警告
- [x] 4.4 运行 `npm run preview` 验证预览服务器
- [x] 4.5 验证子路径访问正常 (`http://localhost:4321/site/`)
- [x] 4.6 验证所有页面链接正常工作
- [x] 4.7 验证图片资源加载正常

## 5. GitHub Actions 工作流更新

- [x] 5.1 更新 `.github/workflows/deploy.yml`
- [x] 5.2 在 build job 中添加环境变量设置步骤
- [x] 5.3 添加 `VITE_SITE_BASE: '/site'` 到 build 步骤的环境变量中
- [x] 5.4 验证工作流 YAML 语法正确
- [x] 5.5 确保 `CLARITY_PROJECT_ID` 环境变量仍然正确传递

## 6. CI/CD 验证

- [ ] 6.1 提交配置更改到功能分支
- [ ] 6.2 推送到 GitHub 触发 GitHub Actions
- [ ] 6.3 验证工作流成功执行构建步骤
- [ ] 6.4 验证工作流成功执行部署步骤
- [ ] 6.5 访问 GitHub Pages URL 确认站点更新
- [ ] 6.6 验证 `/site` 路径前缀正常工作
- [ ] 6.7 验证所有页面和链接正常

## 7. 文档更新

- [x] 7.1 更新 `openspec/project.md` 中的部署配置说明
- [x] 7.2 在 `openspec/project.md` 中添加 `VITE_SITE_BASE` 环境变量说明
- [x] 7.3 更新开发者文档,说明如何设置不同的 base 路径
- [x] 7.4 添加不同部署场景的示例(根路径、子路径)
- [x] 7.5 说明本地开发时的默认行为

## 8. 边界情况测试

- [x] 8.1 测试未设置 `VITE_SITE_BASE` 时的默认行为(应使用 `/`)
- [x] 8.3 测试多级子路径 `VITE_SITE_BASE='/docs/site'` 的行为
- [x] 8.4 验证带斜杠和不带斜杠的路径一致性

## 9. 兼容性验证

- [x] 9.1 验证现有内容集合(content collections)功能正常
- [x] 9.2 验证构建产物大小合理(26M)
- [x] 9.3 验证构建时间合理(约3秒)

## 10. 性能验证

- [x] 10.1 验证构建时间无明显增加(约3秒)
- [x] 10.2 验证构建产物大小无明显变化(26M)
