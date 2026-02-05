## 1. Implementation

### 1.1 创建 Azure Static Web Apps 配置文件

- [x] 1.1.1 在 `public/` 目录创建 `staticwebapp.config.json` 文件（**重要：文件名必须是 `staticwebapp.config.json`，这是 Azure Static Web Apps 识别配置文件的标准名称**）
- [x] 1.1.2 添加全局路由回退规则配置
- [x] 1.1.3 配置所有路径回退到 `index.html` 并返回 200 状态码
- [x] 1.1.4 添加配置文件注释说明各配置项的作用（注意：JSON 格式不支持注释，使用清晰的字段名和结构即可）
- [x] 1.1.5 验证 Astro 构建后文件自动复制到 `dist/` 目录

### 1.2 配置路由回退规则

- [x] 1.2.1 使用 `navigationFallback` 配置路由回退（Azure Static Web Apps 官方推荐方式）
- [x] 1.2.2 配置重写规则: `rewrite: "index.html"`
- [x] 1.2.3 确认配置比使用 `routes` 数组更简洁且符合官方标准

### 1.3 支持多种部署场景

- [x] 1.3.1 验证根路径部署场景 (`/`)
- [x] 1.3.2 验证子路径部署场景 (如 `/site/`)
- [x] 1.3.3 确保配置与 `astro.config.mjs` 中的 `base` 配置兼容
- [x] 1.3.4 确保配置与 `VITE_SITE_BASE` 环境变量兼容

## 2. Verification

### 2.1 本地构建验证

- [x] 2.1.1 运行 `npm run build` 确保构建成功
- [x] 2.1.2 检查 `dist/` 目录包含 `index.html` 文件
- [x] 2.1.3 验证配置文件语法正确性

### 2.2 Azure Static Web Apps 部署验证

- [ ] 2.2.1 提交代码到 `main` 分支触发 Azure Static Web Apps CI/CD
- [ ] 2.2.2 确认 GitHub Actions 工作流成功执行
- [ ] 2.2.3 确认 Azure Static Web Apps 部署成功
- [ ] 2.2.4 访问部署后的站点根路径,确认首页正常加载

### 2.3 路由回退功能验证

- [ ] 2.3.1 直接访问文档子路径 URL (如 `/docs/quick-start/installation`)
- [ ] 2.3.2 刷新浏览器,确认页面正常加载不出现 404 错误
- [ ] 2.3.3 测试多个不同的文档页面路径
- [ ] 2.3.4 测试博客文章路径 (如 `/blog/2026-01-25-how-to-sync-docker-hub-to-azure-acr-with-github`)

### 2.4 多部署场景兼容性验证

- [ ] 2.4.1 验证 GitHub Pages 部署仍正常工作
- [ ] 2.4.2 验证 Azure Static Web Apps 根路径部署正常工作
- [ ] 2.4.3 验证 Azure Static Web Apps 子路径部署 (如配置) 正常工作
- [ ] 2.4.4 确认两个部署平台的路由回退机制都正常工作

## 3. Documentation

### 3.1 更新项目文档

- [x] 3.1.1 在 `openspec/project.md` 中添加 Azure Static Web Apps 部署说明
- [x] 3.1.2 记录 `staticwebapp.config.json` 配置文件的作用和配置项（**强调：这是 Azure Static Web Apps 的标准配置文件名，必须使用此名称**）
- [x] 3.1.3 添加路由回退规则的配置说明
- [x] 3.1.4 更新部署场景文档,说明根路径和子路径部署的配置差异
- [x] 3.1.5 添加配置文件命名规范说明，解释为何必须使用 `staticwebapp.config.json`

### 3.2 配置验证清单

- [x] 3.2.1 确认配置文件名为 `staticwebapp.config.json`（Azure Static Web Apps 标准配置文件名）
- [x] 3.2.2 确认配置文件位于 `public/` 目录，构建后自动复制到 `dist/`
- [x] 3.2.3 确认配置文件支持两种部署场景（根路径和子路径）
- [x] 3.2.4 确认配置不影响现有的 GitHub Pages 部署
- [x] 3.2.5 确认配置文件格式符合 Azure Static Web Apps 规范
- [x] 3.2.6 确认配置文件使用有效的 JSON 格式（无注释，字段名清晰）
- [x] 3.2.7 验证构建后 `dist/staticwebapp.config.json` 文件存在

