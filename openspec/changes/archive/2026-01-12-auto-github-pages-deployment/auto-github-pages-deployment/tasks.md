# Tasks: 自动发布 GitHub Page

## 1. GitHub Actions 工作流配置

- [x] 1.1 创建 `.github/workflows/` 目录
- [x] 1.2 创建 `deploy.yml` 工作流文件
- [x] 1.3 配置工作流触发条件（`push` 到 `main` 分支）
- [x] 1.4 配置 Node.js 环境（版本 >= 18.0）
- [x] 1.5 配置构建步骤（`npm ci` + `npm run build`）
- [x] 1.6 配置部署步骤（使用 `peaceiris/actions-gh-pages` action）
- [x] 1.7 配置部署目标分支为 `gh-pages`

## 2. GitHub 仓库配置

- [ ] 2.1 在 GitHub 仓库设置中启用 GitHub Pages 功能
- [ ] 2.2 配置 GitHub Pages 源为 `gh-pages` 分支
- [ ] 2.3 在 GitHub 仓库设置中配置 GitHub Actions 权限
- [ ] 2.4 确保 GitHub Actions 有 `contents: write` 权限
- [ ] 2.5 确保 GitHub Actions 有 `pages: write` 权限

## 3. 验证和测试

- [x] 3.1 验证工作流文件 YAML 语法正确
- [ ] 3.2 提交工作流配置到仓库
- [ ] 3.3 推送到 `main` 分支触发工作流
- [ ] 3.4 验证工作流成功执行构建步骤
- [ ] 3.5 验证工作流成功执行部署步骤
- [ ] 3.6 访问 GitHub Pages URL 确认站点更新
- [ ] 3.7 验证 `onBrokenLinks: 'throw'` 配置正常工作（无 broken links）

## 4. 文档更新

- [x] 4.1 更新 `openspec/project.md` 中的部署配置说明
- [ ] 4.2 添加 CI/CD 相关说明到贡献者文档（如需要）
