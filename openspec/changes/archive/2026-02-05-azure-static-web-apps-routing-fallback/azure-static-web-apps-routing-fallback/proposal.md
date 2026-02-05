# Change: 为 Astro 文档站点配置 Azure Static Web Apps 路由回退规则

## Why

当前项目使用 Astro 5.16 作为静态站点生成器,已配置 Azure Static Web Apps CI/CD 流程。在部署到 Azure Static Web Apps 时,当用户直接访问文档站点的子路径页面(如 `/docs/quick-start/installation`)或刷新浏览器时,会出现 **404 Not Found** 错误。这是因为静态托管服务默认只能找到实际存在的文件,对于不存在的文件路径不会自动回退到 `index.html`,导致客户端路由无法接管。

## What Changes

- 在 `public/` 目录添加 `staticwebapp.config.json` 配置文件（**注意：文件名必须是 `staticwebapp.config.json`，这是 Azure Static Web Apps 的标准配置文件名**）
- 配置文件必须放在 `public/` 目录，Astro 构建时会自动复制到 `dist/` 目录供 Azure Static Web Apps 使用
- 使用 `navigationFallback` 配置全局路由回退规则，将所有不存在的文件路径重写到 `index.html`（Azure Static Web Apps 官方推荐方式）
- 支持根路径部署和子路径部署两种场景
- 确保与现有 GitHub Pages 部署配置保持兼容
- 更新 Azure Static Web Apps CI/CD 工作流文档说明

## Impact

- **Affected specs**: `astro-site`
- **Affected code**:
  - `public/staticwebapp.config.json` (新增) - Azure Static Web Apps 路由配置文件
  - `.github/workflows/azure-static-web-apps-ashy-flower-0f8ed9400.yml` (已有,无需修改)
- **用户体验提升**:
  - 用户可以直接访问任何子路径 URL,不会遇到 404 错误
  - 刷新浏览器时页面正常加载,保持当前路由状态
  - 分享文档链接时接收者可以直接访问对应页面
- **部署灵活性**:
  - 项目可以同时部署到 GitHub Pages 和 Azure Static Web Apps
  - 支持 CDN 加速和全球分发
  - 为未来迁移到其他静态托管平台提供配置参考
- **技术债务**:
  - 需要维护 Azure Static Web Apps 的配置文件
  - 需要验证不同部署场景(根路径/子路径)的配置正确性
