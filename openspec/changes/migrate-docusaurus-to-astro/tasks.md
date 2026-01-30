## 1. 基础设置与准备

- [ ] 1.1 创建当前分支的备份分支 (以防需要回滚)
- [ ] 1.2 记录当前 Docusaurus 站点的关键功能和配置 (用于后续验证)
- [ ] 1.3 记录当前站点 URL 结构和路由 (用于验证迁移后的路由一致性)

## 2. Astro 项目初始化

- [ ] 2.1 安装 Astro CLI 并初始化新项目 (`npm create astro@latest`)
- [ ] 2.2 安装 React 集成 (`@astrojs/react`)
- [ ] 2.3 安装 MDX 集成 (`@astrojs/mdx`)
- [ ] 2.4 安装 TypeScript 支持和类型定义
- [ ] 2.5 安装 Tailwind CSS (可选,用于样式迁移) 或保留现有 CSS 方案
- [ ] 2.6 配置 `astro.config.mjs`:
  - 设置站点基础 URL 和标题
  - 配置 React 集成
  - 配置 MDX 集成
  - 设置构建输出目录为 `dist`

## 3. TypeScript 配置迁移

- [ ] 3.1 更新 `tsconfig.json` 以适配 Astro
- [ ] 3.2 配置路径别名 (保持 `@/*` 映射到 `src/*`)
- [ ] 3.3 配置 Astro 和 MDX 的类型定义

## 4. 样式迁移

- [ ] 4.1 迁移 `src/css/custom.css` 到 Astro 全局样式
- [ ] 4.2 调整 CSS 变量以适配 Astro 的默认样式系统 (或保留 Infima,如果需要)
- [ ] 4.3 确保深色主题支持正常工作
- [ ] 4.4 测试响应式布局在不同设备上的表现

## 5. 内容路由迁移

- [ ] 5.1 创建 `src/pages/docs/[...page].astro` 动态路由以处理文档页面
- [ ] 5.2 创建 `src/pages/blog/[...page].astro` 动态路由以处理博客文章
- [ ] 5.3 配置 Astro 集合 (Collections) 用于 `docs/` 和 `blog/` 内容
- [ ] 5.4 实现侧边栏导航组件 (替代 Docusaurus 的 sidebar)
- [ ] 5.5 实现面包屑导航组件
- [ ] 5.6 确保所有现有 URL 路由保持一致 (避免 404 错误)

## 6. Markdown/MDX 内容迁移

- [ ] 6.1 验证 `docs/` 目录中的所有 Markdown 文件在 Astro 下正常渲染
- [ ] 6.2 检查并调整 frontmatter 格式 (Astro 使用 `frontmatter` schema)
- [ ] 6.3 确保 `_category_.json` 元数据迁移到 Astro 集合配置中
- [ ] 6.4 验证代码高亮正常工作 (使用 Astro 的 `@astrojs/prism` 或 Shiki)
- [ ] 6.5 验证 Mermaid 图表渲染 (使用 Astro Mermaid 集成)
- [ ] 6.6 迁移 `blog/` 目录内容到博客集合

## 7. React 组件迁移

- [ ] 7.1 迁移 `src/components/home/` 中的首页组件
  - [ ] 7.1.1 HeroSection.tsx
  - [ ] 7.1.2 FeaturesSection.tsx
  - [ ] 7.1.3 QuickStartSection.tsx
  - [ ] 7.1.4 ShowcaseSection.tsx
  - [ ] 7.1.5 ScreenshotGallery.tsx
  - [ ] 7.1.6 OpenSpecAnimation.tsx 和 OpenSpecNode.tsx
  - [ ] 7.1.7 FlowArrow.tsx
  - [ ] 7.1.8 FeaturesShowcase.tsx
  - [ ] 7.1.9 VideoPlayer.tsx
- [ ] 7.2 确保 React 组件在 Astro 中正确导入和使用 (`.astro` 文件中使用 `<Component />` 或 `<Component.client: />`)
- [ ] 7.3 测试所有交互式组件的功能 (视频播放器、动画等)

## 8. 布局和主题迁移

- [ ] 8.1 创建 `src/layouts/Layout.astro` 作为主布局
- [ ] 8.2 实现导航栏组件 (替代 Docusaurus navbar)
  - [ ] 8.2.1 Docs 下拉菜单
  - [ ] 8.2.2 博客链接
  - [ ] 8.2.3 外部链接 (QQ群、下载安装包、Docker Hub 等)
- [ ] 8.3 实现页脚组件 (替代 Docusaurus footer)
- [ ] 8.4 实现文档页面布局 (包含侧边栏)
- [ ] 8.5 实现博客页面布局
- [ ] 8.6 实现首页布局 (`src/pages/index.astro`)
- [ ] 8.7 确保移动端响应式导航正常工作 (汉堡菜单)

## 9. 插件和集成迁移

- [ ] 9.1 配置 Mermaid 图表支持
- [ ] 9.2 配置 Microsoft Clarity 分析插件 (使用 Astro 脚本集成)
- [ ] 9.3 配置代码语法高亮 (Prism 或 Shiki,支持 bash/csharp/fsharp/powershell)
- [ ] 9.4 移除 Docusaurus 特定插件:
  - [ ] 9.4.1 移除 `@docusaurus/theme-mermaid`
  - [ ] 9.4.2 移除 `@gracefullight/docusaurus-plugin-microsoft-clarity`
  - [ ] 9.4.3 移除 `prism-react-renderer`

## 10. 包管理和脚本更新

- [ ] 10.1 更新 `package.json` 依赖:
  - [ ] 10.1.1 移除所有 `@docusaurus/*` 包
  - [ ] 10.1.2 添加 Astro 核心包 (`astro`, `@astrojs/react`, `@astrojs/mdx`)
  - [ ] 10.1.3 移除 `react` 和 `react-dom` (如果不再需要,保留用于 React 组件)
- [ ] 10.2 更新 npm 脚本:
  - [ ] 10.2.1 将 `docusaurus start` 改为 `astro dev`
  - [ ] 10.2.2 将 `docusaurus build` 改为 `astro build`
  - [ ] 10.2.3 将 `docusaurus serve` 改为 `astro preview`
  - [ ] 10.2.4 移除 `docusaurus clear` 脚本
- [ ] 10.3 更新 `engines` 配置 (Astro 支持 Node.js >=18.0,保持一致)
- [ ] 10.4 运行 `npm install` 安装新依赖

## 11. CI/CD 更新

- [ ] 11.1 更新 `.github/workflows/deploy.yml`:
  - [ ] 11.1.1 更新构建命令从 `npm run build` 到 `astro build` (保持脚本名不变)
  - [ ] 11.1.2 更新上传目录从 `./build` 到 `./dist`
- [ ] 11.2 确保 CLARITY_PROJECT_ID 环境变量仍然传递
- [ ] 11.3 测试 GitHub Actions 工作流 (通过创建测试分支)

## 12. 静态资源迁移

- [ ] 12.1 迁移 `static/` 目录到 `public/` (Astro 默认静态资源目录)
- [ ] 12.2 确保所有图片、favicon、logo 等资源路径正确
- [ ] 12.3 验证 social card 图片正常加载

## 13. OpenSpec 兼容性验证

- [ ] 13.1 确认 `openspec/` 目录结构不受影响
- [ ] 13.2 验证 OpenSpec 工作流与新构建系统兼容
- [ ] 13.3 测试本地开发服务器时能正常访问 OpenSpec 文档

## 14. 测试和验证

- [ ] 14.1 本地开发服务器测试:
  - [ ] 14.1.1 运行 `npm run dev` 确保开发服务器正常启动
  - [ ] 14.1.2 验证首页正常渲染
  - [ ] 14.1.3 验证所有文档页面可访问
  - [ ] 14.1.4 验证博客页面可访问
  - [ ] 14.1.5 验证导航栏链接正确
  - [ ] 14.1.6 验证侧边栏导航正确
  - [ ] 14.1.7 验证深色主题切换正常
- [ ] 14.2 生产构建测试:
  - [ ] 14.2.1 运行 `npm run build` 确保构建成功
  - [ ] 14.2.2 检查构建输出到 `dist/` 目录
  - [ ] 14.2.3 运行 `npm run serve` 预览生产构建
  - [ ] 14.2.4 验证所有页面在预览模式下正常工作
- [ ] 14.3 类型检查测试:
  - [ ] 14.3.1 运行 `npm run typecheck` 确保无 TypeScript 错误
- [ ] 14.4 链接验证:
  - [ ] 14.4.1 手动检查所有内部链接正常工作
  - [ ] 14.4.2 验证没有死链接 (404 错误)
- [ ] 14.5 性能测试:
  - [ ] 14.5.1 对比迁移前后的构建时间
  - [ ] 14.5.2 使用 Lighthouse 测试页面性能指标

## 15. 清理和文档

- [ ] 15.1 删除所有 Docusaurus 相关文件:
  - [ ] 15.1.1 删除 `docusaurus.config.ts`
  - [ ] 15.1.2 删除 `sidebars.ts`
  - [ ] 15.1.3 删除 `src/theme/` (如果存在)
  - [ ] 15.1.4 删除 `src/client/` (如果不再需要)
- [ ] 15.2 更新 `README.md` 中的 Docusaurus 引用为 Astro
- [ ] 15.3 更新 `openspec/project.md` 中的技术栈描述
- [ ] 15.4 添加 Astro 相关的开发文档 (如有必要)

## 16. 部署和监控

- [ ] 16.1 合并到 `main` 分支并触发 GitHub Actions
- [ ] 16.2 监控 GitHub Actions 构建日志,确保部署成功
- [ ] 16.3 验证 GitHub Pages 上的生产站点正常工作
- [ ] 16.4 使用 Google Lighthouse 或 WebPageTest 测试生产站点性能
- [ ] 16.5 验证 Google Search Console 能正确索引新站点
- [ ] 16.6 监控 Clarity 分析数据,确保追踪正常

## 17. 归档和更新规范

- [ ] 17.1 使用 `openspec archive migrate-docusaurus-to-astro` 归档此变更
- [ ] 17.2 更新 `specs/astro-site/spec.md` 规范文件
- [ ] 17.3 删除或重命名 `specs/docusaurus-site/` (如果完全迁移)
- [ ] 17.4 更新 `specs/github-integration/spec.md` 以反映新的构建配置
