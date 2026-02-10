# Implementation Tasks

## 1. 基础设施搭建

### 1.1 创建 MonoRepo 目录结构
- [ ] 1.1.1 创建 `apps/` 目录
- [ ] 1.1.2 创建 `apps/docs/` 目录
- [ ] 1.1.3 创建 `apps/website/` 目录
- [ ] 1.1.4 创建 `packages/` 目录
- [ ] 1.1.5 创建 `packages/shared/` 目录（可选）

### 1.2 配置包管理器
- [ ] 1.2.1 配置 npm workspaces
- [ ] 1.2.2 更新根级 `package.json` 的 `workspaces` 字段
- [ ] 1.2.3 更新根级 `package.json`
  - [ ] 1.2.3.1 添加 `workspaces` 配置
  - [ ] 1.2.3.2 添加统一的开发脚本（`dev:all`, `build:all`, `test:all`）
  - [ ] 1.2.3.3 配置共享的 devDependencies
- [ ] 1.2.4 更新根级 `tsconfig.json`
  - [ ] 1.2.4.1 配置 monorepo TypeScript references
  - [ ] 1.2.4.2 设置 `composite: true` 和 `declarationMap` 支持

### 1.3 配置共享工具
- [ ] 1.3.1 创建 `.npmrc`（如需要）
- [ ] 1.3.2 配置 ESLint 和 Prettier 共享配置
- [ ] 1.3.3 配置 TypeScript 项目引用

## 2. 文档站点迁移 (apps/docs)

### 2.1 创建 docs 应用基础结构
- [ ] 2.1.1 在 `apps/docs/` 创建 `package.json`
  - [ ] 2.1.1.1 继承根级依赖
  - [ ] 2.1.1.2 添加 Astro 相关依赖
  - [ ] 2.1.1.3 添加 Starlight 依赖
- [ ] 2.1.2 创建 `apps/docs/astro.config.mjs`
  - [ ] 2.1.2.1 配置 Starlight 集成
  - [ ] 2.1.2.2 配置 `base` 路径（`/docs`）
  - [ ] 2.1.2.3 配置站点元数据
- [ ] 2.1.3 创建 `apps/docs/src/` 目录结构
- [ ] 2.1.4 创建 `apps/docs/public/` 目录

### 2.2 迁移文档内容

**策略**: 先复制完整站点，再删除非必要部分

- [ ] 2.2.1 复制整个站点到 `apps/docs/`
  - [ ] 2.2.1.1 复制根级 `package.json` 到 `apps/docs/package.json`
  - [ ] 2.2.1.2 复制根级 `astro.config.mjs` 到 `apps/docs/astro.config.mjs`
  - [ ] 2.2.1.3 复制 `src/` 目录到 `apps/docs/src/`
  - [ ] 2.2.1.4 复制 `public/` 目录到 `apps/docs/public/`
- [ ] 2.2.2 删除文档站点不需要的内容
  - [ ] 2.2.2.1 删除 `apps/docs/src/pages/index.astro`（首页）
  - [ ] 2.2.2.2 删除 `apps/docs/src/components/home/`（首页组件）
  - [ ] 2.2.2.3 删除 `apps/docs/src/components/` 中的营销专用组件
  - [ ] 2.2.2.4 保留 `apps/docs/src/content/docs/`（文档内容）
  - [ ] 2.2.2.5 保留 `apps/docs/src/pages/docs/`（文档路由）
- [ ] 2.2.3 更新 `apps/docs/package.json`
  - [ ] 2.2.3.1 移除营销站点专用依赖
  - [ ] 2.2.3.2 添加 Starlight 依赖
  - [ ] 2.2.3.3 更新应用名称为 "docs"
- [ ] 2.2.4 更新 `apps/docs/astro.config.mjs`
  - [ ] 2.2.4.1 配置 Starlight 集成
  - [ ] 2.2.4.2 配置 `base: "/docs"`
  - [ ] 2.2.4.3 移除营销站点相关配置
- [ ] 2.2.5 验证文档站点完整性
  - [ ] 2.2.5.1 检查所有文档文件存在
  - [ ] 2.2.5.2 验证 frontmatter 完整性
  - [ ] 2.2.5.3 确认无营销相关内容残留

### 2.3 配置 Starlight
- [ ] 2.3.1 配置 Starlight 侧边栏和导航
- [ ] 2.3.2 配置 Starlight 主题（颜色、字体）
- [ ] 2.3.3 配置搜索功能
- [ ] 2.3.4 配置多语言（如需要，当前仅中文）

### 2.4 文档站点样式
- [ ] 2.4.1 迁移文档相关样式到 `apps/docs/src/styles/`
- [ ] 2.4.2 配置 CSS 变量和主题
- [ ] 2.4.3 验证 Starlight 默认样式与自定义样式兼容

## 3. 营销站点迁移 (apps/website)

### 3.1 创建 website 应用基础结构
- [ ] 3.1.1 在 `apps/website/` 创建 `package.json`
  - [ ] 3.1.1.1 继承根级依赖
  - [ ] 3.1.1.2 添加 Astro 相关依赖（不含 Starlight）
  - [ ] 3.1.1.3 添加 React 和其他 UI 依赖
- [ ] 3.1.2 创建 `apps/website/astro.config.mjs`
  - [ ] 3.1.2.1 配置 Astro 集成（React, MDX）
  - [ ] 3.1.2.2 配置 `base` 路径（根路径 `/`）
  - [ ] 3.1.2.3 配置站点元数据
  - [ ] 3.1.2.4 **不配置** Starlight
- [ ] 3.1.3 创建 `apps/website/src/` 目录结构
- [ ] 3.1.4 创建 `apps/website/public/` 目录

### 3.2 迁移营销内容

**策略**: 先复制完整站点，再删除非必要部分

- [ ] 3.2.1 复制整个站点到 `apps/website/`
  - [ ] 3.2.1.1 复制根级 `package.json` 到 `apps/website/package.json`
  - [ ] 3.2.1.2 复制根级 `astro.config.mjs` 到 `apps/website/astro.config.mjs`
  - [ ] 3.2.1.3 复制 `src/` 目录到 `apps/website/src/`
  - [ ] 3.2.1.4 复制 `public/` 目录到 `apps/website/public/`
- [ ] 3.2.2 删除营销站点不需要的内容
  - [ ] 3.2.2.1 删除 `apps/website/src/content/docs/`（文档内容）
  - [ ] 3.2.2.2 删除 `apps/website/src/pages/docs/`（文档路由）
  - [ ] 3.2.2.3 删除 `apps/website/src/content/config.ts`（Starlight 配置）
  - [ ] 3.2.2.4 保留 `apps/website/src/pages/index.astro`（首页）
  - [ ] 3.2.2.5 保留 `apps/website/src/components/home/`（首页组件）
- [ ] 3.2.3 更新 `apps/website/package.json`
  - [ ] 3.2.3.1 移除 Starlight 依赖
  - [ ] 3.2.3.2 添加 React 和 UI 库依赖
  - [ ] 3.2.3.3 更新应用名称为 "website"
- [ ] 3.2.4 更新 `apps/website/astro.config.mjs`
  - [ ] 3.2.4.1 移除 Starlight 集成
  - [ ] 3.2.4.2 配置 React 和 MDX 集成
  - [ ] 3.2.4.3 配置 `base: "/"`
  - [ ] 3.2.4.4 移除文档站点相关配置
- [ ] 3.2.5 验证营销站点完整性
  - [ ] 3.2.5.1 检查首页功能正常
  - [ ] 3.2.5.2 验证组件导入路径正确
  - [ ] 3.2.5.3 确认无文档相关内容残留

### 3.3 营销站点独立设计
- [ ] 3.3.1 创建自定义导航栏（不含文档链接或链接到独立文档站点）
- [ ] 3.3.2 创建自定义页脚
- [ ] 3.3.3 设计营销页面布局
- [ ] 3.3.4 确保 CSS 变量不与 Starlight 冲突

## 4. 共享代码处理

### 4.1 识别共享代码
- [ ] 4.1.1 审核当前代码库中的共享组件
- [ ] 4.1.2 审核当前代码库中的共享工具函数
- [ ] 4.1.3 审核当前代码库中的共享类型定义
- [ ] 4.1.4 决定是否需要 `packages/shared`

### 4.2 创建共享包（如需要）
- [ ] 4.2.1 创建 `packages/shared/package.json`
  - [ ] 4.2.1.1 配置 `main` 和 `types` 入口
  - [ ] 4.2.1.2 配置 `exports` 字段
- [ ] 4.2.2 迁移共享组件到 `packages/shared/components/`
- [ ] 4.2.3 迁移共享工具到 `packages/shared/utils/`
- [ ] 4.2.4 迁移共享类型到 `packages/shared/types/`
- [ ] 4.2.5 配置 TypeScript 编译输出

### 4.3 更新导入路径
- [ ] 4.3.1 在 `apps/docs` 中更新导入路径使用共享包
- [ ] 4.3.2 在 `apps/website` 中更新导入路径使用共享包
- [ ] 4.3.3 验证所有导入路径正确

## 5. 静态资源处理

### 5.1 处理 public 目录
- [ ] 5.1.1 审核当前 `public/` 目录内容
- [ ] 5.1.2 识别文档专用资源（logo, favicon 等）
- [ ] 5.1.3 识别营销专用资源（视频, 图片等）
- [ ] 5.1.4 识别共享资源（如全局图标）
- [ ] 5.1.5 复制资源到各自应用的 `public/` 目录

### 5.2 处理图片和视频
- [ ] 5.2.1 更新文档中的图片路径
- [ ] 5.2.2 更新营销站点中的图片路径
- [ ] 5.2.3 验证所有资源引用正确

## 6. CI/CD 配置更新

### 6.1 GitHub Actions - 文档站点部署
- [ ] 6.1.1 创建 `.github/workflows/deploy-docs.yml`
  - [ ] 6.1.1.1 配置触发条件（push to main, PR）
  - [ ] 6.1.1.2 配置 Node.js 版本
  - [ ] 6.1.1.3 配置缓存策略
  - [ ] 6.1.1.4 配置构建步骤（`cd apps/docs && npm run build`）
  - [ ] 6.1.1.5 配置 GitHub Pages 部署
  - [ ] 6.1.1.6 配置环境变量（`CLARITY_PROJECT_ID`）

### 6.2 GitHub Actions - 营销站点部署
- [ ] 6.2.1 创建 `.github/workflows/deploy-website.yml`
  - [ ] 6.2.1.1 配置触发条件（push to main, PR）
  - [ ] 6.2.1.2 配置 Node.js 版本
  - [ ] 6.2.1.3 配置缓存策略
  - [ ] 6.2.1.4 配置构建步骤（`cd apps/website && npm run build`）
  - [ ] 6.2.1.5 配置部署目标（Azure Static Web Apps）
  - [ ] 6.2.1.6 配置环境变量

### 6.3 通知工作流更新
- [ ] 6.3.1 更新 `deploy-docs.yml` 添加 Feishu 通知
- [ ] 6.3.2 更新 `deploy-website.yml` 添加 Feishu 通知
- [ ] 6.3.3 配置成功和失败通知

### 6.4 其他工作流
- [ ] 6.4.1 更新 `version-monitor.yml`（如需要）
- [ ] 6.4.2 更新 `update-activity-metrics.yml`（如需要）
- [ ] 6.4.3 检查其他自定义工作流

## 7. 开发体验优化

### 7.1 开发脚本
- [ ] 7.1.1 在根级 `package.json` 添加 `dev:all` 脚本
  - [ ] 7.1.1.1 同时启动 docs 和 website 开发服务器
  - [ ] 7.1.1.2 配置不同端口（docs: 4321, website: 4322）
- [ ] 7.1.2 添加 `dev:docs` 脚本
- [ ] 7.1.3 添加 `dev:website` 脚本
- [ ] 7.1.4 添加 `build:all` 脚本
- [ ] 7.1.5 添加 `build:docs` 和 `build:website` 脚本

### 7.2 IDE 配置
- [ ] 7.2.1 更新 VS Code workspace 配置
- [ ] 7.2.2 配置 TypeScript 服务以支持 monorepo
- [ ] 7.2.3 添加调试配置（launch.json）

### 7.3 本地开发指南
- [ ] 7.3.1 创建 README 或贡献指南说明 monorepo 结构
- [ ] 7.3.2 文档化常见开发任务
- [ ] 7.3.3 创建故障排除指南

## 8. 测试和验证

### 8.1 本地验证
- [ ] 8.1.1 运行 `npm run dev:all` 验证两个应用同时启动
- [ ] 8.1.2 访问 `http://localhost:4321` 验证文档站点
- [ ] 8.1.3 访问 `http://localhost:4322` 验证营销站点
- [ ] 8.1.4 测试所有文档链接
- [ ] 8.1.5 测试营销站点所有页面

### 8.2 构建验证
- [ ] 8.2.1 运行 `npm run build:docs` 验证文档站点构建
- [ ] 8.2.2 运行 `npm run build:website` 验证营销站点构建
- [ ] 8.2.3 运行 `npm run build:all` 验证同时构建
- [ ] 8.2.4 检查构建产物大小
- [ ] 8.2.5 验证无 TypeScript 错误
- [ ] 8.2.6 验证无 ESLint 错误

### 8.3 部署验证
- [ ] 8.3.1 在测试环境部署文档站点
- [ ] 8.3.2 在测试环境部署营销站点
- [ ] 8.3.3 验证所有链接正确
- [ ] 8.3.4 验证 SEO 和元数据
- [ ] 8.3.5 测试性能和加载速度

## 9. 文档更新

### 9.1 项目文档
- [ ] 9.1.1 更新 README.md 说明新的 monorepo 结构
- [ ] 9.1.2 更新 `openspec/project.md` 架构部分
- [ ] 9.1.3 创建迁移指南（如有其他项目参考）
- [ ] 9.1.4 更新贡献指南

### 9.2 代码注释
- [ ] 9.2.1 在关键文件添加注释说明 monorepo 结构
- [ ] 9.2.2 更新配置文件中的注释

## 10. 清理和收尾

**重要**: 由于采用了"复制然后删除"的迁移策略，原始代码在整个迁移过程中始终保持完整。

### 10.1 迁移前准备
- [ ] 10.1.1 确认两个应用都已成功复制
- [ ] 10.1.2 确认两个应用都能独立构建和运行
- [ ] 10.1.3 创建备份分支保存原始状态

### 10.2 清理旧代码
- [ ] 10.2.1 验证 `apps/docs/` 和 `apps/website/` 都正常工作
- [ ] 10.2.2 删除根级 `src/` 目录（内容已复制到 apps/）
- [ ] 10.2.3 删除旧的 `astro.config.mjs`（已复制到各应用）
- [ ] 10.2.4 更新根级 `package.json` 移除旧脚本

### 10.3 依赖清理
- [ ] 10.3.1 清理重复的依赖
- [ ] 10.3.2 将共享依赖提升到根级
- [ ] 10.3.3 运行 `npm install` 清理 node_modules

### 10.4 最终验证
- [ ] 10.4.1 运行完整的测试套件
- [ ] 10.4.2 执行本地开发完整流程
- [ ] 10.4.3 验证 CI/CD 流程
- [ ] 10.4.4 获取团队审查和批准

## 11. 发布和监控

### 11.1 发布准备
- [ ] 11.1.1 创建发布计划
- [ ] 11.1.2 准备回滚计划
- [ ] 11.1.3 通知团队成员变更

### 11.2 发布执行
- [ ] 11.2.1 合并主分支
- [ ] 11.2.2 监控 CI/CD 流程
- [ ] 11.2.3 验证部署成功
- [ ] 11.2.4 监控错误日志

### 11.3 发布后监控
- [ ] 11.3.1 监控站点性能
- [ ] 11.3.2 监控用户反馈
- [ ] 11.3.3 监控错误报告
- [ ] 11.3.4 记录经验教训

## 12. 性能优化（可选）

**说明**: 根据实际构建性能决定是否实施本阶段任务

### 12.1 性能评估
- [ ] 12.1.1 测量当前构建时间
  - [ ] 12.1.1.1 记录完整构建时间 (`npm run build`)
  - [ ] 12.1.1.2 记录增量构建时间（修改单个文件后）
  - [ ] 12.1.1.3 记录 CI/CD 构建时间
- [ ] 12.1.2 分析构建瓶颈
  - [ ] 12.1.2.1 识别耗时最长的构建步骤
  - [ ] 12.1.2.2 分析依赖关系
  - [ ] 12.1.2.3 评估缓存命中率
- [ ] 12.1.3 评估优化需求
  - [ ] 12.1.3.1 构建时间是否超过 5 分钟？
  - [ ] 12.1.3.2 CI/CD 成本是否成为问题？
  - [ ] 12.1.3.3 团队协作是否需要远程缓存？

### 12.2 Turborepo 实施（如需要）

**触发条件**: 构建时间超过 5 分钟或团队需要更好的构建缓存

- [ ] 12.2.1 安装 Turborepo
  - [ ] 12.2.1.1 添加 `turbo` 到根级 devDependencies
  - [ ] 12.2.1.2 运行 `npm install -D turbo`
  - [ ] 12.2.1.3 验证安装成功
- [ ] 12.2.2 创建 `turbo.json` 配置
  - [ ] 12.2.2.1 配置 build 任务和依赖关系
  - [ ] 12.2.2.2 配置 dev 任务（禁用缓存）
  - [ ] 12.2.2.3 配置 lint 和 typecheck 任务
  - [ ] 12.2.2.4 定义输出目录模式
- [ ] 12.2.3 更新构建脚本
  - [ ] 12.2.3.1 更新根级 `package.json` 脚本使用 turbo
  - [ ] 12.2.3.2 更新 `dev` 脚本为 `turbo run dev`
  - [ ] 12.2.3.3 更新 `build` 脚本为 `turbo run build`
  - [ ] 12.2.3.4 更新 `lint` 脚本为 `turbo run lint`
- [ ] 12.2.4 配置应用级 turbo 引用
  - [ ] 12.2.4.1 在 `apps/docs/package.json` 添加 `turbo` 配置
  - [ ] 12.2.4.2 在 `apps/website/package.json` 添加 `turbo` 配置
- [ ] 12.2.5 配置远程缓存（可选）
  - [ ] 12.2.5.1 注册 Vercel 或 Turborepo Teams 账户
  - [ ] 12.2.5.2 获取远程缓存 token
  - [ ] 12.2.5.3 配置 CI/CD 环境变量
- [ ] 12.2.6 更新 CI/CD 工作流
  - [ ] 12.2.6.1 添加 Turborepo 缓存步骤
  - [ ] 12.2.6.2 配置 `turbo prune` 优化
  - [ ] 12.2.6.3 测试 CI/CD 构建
- [ ] 12.2.7 验证和测试
  - [ ] 12.2.7.1 运行 `turbo run build` 验证构建
  - [ ] 12.2.7.2 测试增量构建缓存效果
  - [ ] 12.2.7.3 对比优化前后构建时间
  - [ ] 12.2.7.4 验证所有输出正确
- [ ] 12.2.8 文档和培训
  - [ ] 12.2.8.1 更新 README 说明 Turborepo 使用
  - [ ] 12.2.8.2 团队培训 Turborepo 命令
  - [ ] 12.2.8.3 文档化常见问题排查

### 12.3 其他优化选项

- [ ] 12.3.1 配置更激进的 Astro 缓存策略
- [ ] 12.3.2 优化依赖安装（使用 `npm ci` 替代 `npm install`）
- [ ] 12.3.3 配置 Docker 层缓存（如使用 Docker）
- [ ] 12.3.4 考虑使用 Nx（替代 Turborepo）

## 回滚任务（如需要）

- [ ] R.1 从备份分支恢复原始单体应用代码
- [ ] R.2 恢复原始 `astro.config.mjs`
- [ ] R.3 恢复原始 `package.json`
- [ ] R.4 恢复原始 CI/CD 配置
- [ ] R.5 验证回滚后应用正常工作
- [ ] R.6 分析回滚原因
- [ ] R.7 计划修复后重新迁移
