# Change: 迁移 Docusaurus 到 Astro

## Why

当前 Docusaurus 构建方式存在 SEO 性能不够极致、构建速度较慢、资源占用较大等问题。迁移到 Astro 可以显著提升站点性能、改善搜索引擎优化,并获得更快的构建速度和更小的产物体积。

## What Changes

### 核心框架变更
- **BREAKING**: 将静态站点生成器从 Docusaurus 3.x 迁移到 Astro 4.x+
- 移除所有 Docusaurus 特定的依赖和配置
- 添加 Astro 核心依赖和 React 集成

### 配置变更
- **BREAKING**: 替换 `docusaurus.config.ts` 为 `astro.config.mjs`
- **BREAKING**: 移除 `sidebars.ts` (Docusaurus 侧边栏配置)
- 更新 `tsconfig.json` 配置以适配 Astro
- 更新 package.json 脚本命令 (start, build, serve)

### 内容迁移
- 保留 `docs/` 目录中的 Markdown 文件结构
- 调整 frontmatter 格式以适配 Astro (如有必要)
- 迁移 `blog/` 目录内容

### 组件迁移
- 迁移 `src/components/` 中的 React 组件到 Astro 兼容格式
- 保留 `src/pages/` 中的页面,调整为 Astro 路由
- 迁移 `src/css/custom.css` 样式到 Astro 全局样式

### CI/CD 更新
- **BREAKING**: 更新 `.github/workflows/deploy.yml` 构建脚本
- 调整构建输出目录从 `build/` 到 `dist/` (Astro 默认)
- 保持 GitHub Pages 部署流程不变

### 功能保持
- 保留单语言支持 (简体中文)
- 保留 Markdown/MDX 内容支持
- 保留 TypeScript 类型安全
- 保留 React 组件支持 (通过 Astro React 集成)
- 保留 Mermaid 图表支持
- 保留 Microsoft Clarity 分析插件

## Impact

### Affected Specs
- `docusaurus-site` - 将重命名为 `astro-site`
- `github-integration` - 需要更新构建配置

### Affected Code
- `docusaurus.config.ts` - 删除,替换为 `astro.config.mjs`
- `sidebars.ts` - 删除,使用 Astro 集合和路由配置
- `src/` - 迁移和调整组件结构
- `package.json` - 更新依赖和脚本
- `tsconfig.json` - 更新 TypeScript 配置
- `.github/workflows/deploy.yml` - 更新构建命令和输出目录

### Expected Benefits
- **SEO 提升**: 零 JS HTML 输出,搜索引擎爬虫能更高效索引内容
- **性能提升**: 更快的页面加载速度和 Core Web Vitals 指标
- **构建加速**: 岛屿架构大幅提升构建速度
- **更小产物**: 默认零 JS 发送到客户端,减少资源体积
- **更好的开发体验**: 更简洁的项目结构和更快的开发服务器启动

### Risks & Mitigations
- **迁移成本**: 需要重写 Docusaurus 特定配置 → 分阶段迁移,先实现核心功能
- **功能差异**: 部分 Docusaurus 插件需要 Astro 替代方案 → 使用 Astro 生态系统替代品
- **兼容性风险**: React 组件可能需要调整 → 保留 React 集成,最小化组件改动
- **学习曲线**: 团队需要熟悉 Astro 新概念 → 提供文档和培训

### Rollback Plan
如果迁移失败,可以通过以下步骤回滚:
1. 从 git 恢复 Docusaurus 配置文件
2. 恢复 package.json 中的 Docusaurus 依赖
3. 恢复 `.github/workflows/deploy.yml` 构建脚本
4. 运行 `npm install` 重新安装依赖
