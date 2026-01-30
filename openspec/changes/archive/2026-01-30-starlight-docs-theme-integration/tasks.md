# 引入 Starlight 文档主题 - 实施任务

## 阶段 1: 准备工作

- [x] 1.1 创建 feature 分支 `feat/starlight-integration`
- [x] 1.2 备份当前文档页面配置(截图、导出侧边栏配置)
- [x] 1.3 阅读 Starlight 官方文档和配置参考
- [x] 1.4 创建 `src/styles/starlight-override.css` 样式覆盖文件

## 阶段 2: 安装和基础配置

- [x] 2.1 运行 `npx astro add starlight` 安装 Starlight 集成
- [x] 2.2 更新 `astro.config.mjs`,添加 Starlight 集成配置
  - [x] 2.2.1 配置 `title`、`description`
  - [x] 2.2.2 配置基础侧边栏结构(使用 autogenerate)
  - [x] 2.2.3 配置 `customCss` 指向 `starlight-override.css`
  - [x] 2.2.4 配置 `editLink` 和 `social`
- [x] 2.3 安装依赖 `npm install`
- [x] 2.4 运行 `npm run dev` 验证开发服务器启动
- [x] 2.5 运行 `npm run build` 验证构建成功

## 阶段 3: Content Collections 适配

- [x] 3.1 更新 `src/content/config.ts`,扩展 docs schema
  - [x] 3.1.1 添加 Starlight 特定字段(`sidebar`、`sidebarLabel`、`head`)
  - [x] 3.1.2 保持现有字段兼容性
  - [ ] 3.1.3 运行 TypeScript 类型检查验证
- [ ] 3.2 更新现有文档 frontmatter(可选)
  - [ ] 3.2.1 为关键页面添加 `sidebarLabel`(如需要)
  - [ ] 3.2.2 添加自定义 SEO meta(如需要)

## 阶段 4: 样式系统适配

- [x] 4.1 创建 CSS 变量映射
  - [x] 4.1.1 在 `starlight-override.css` 中映射 Starlight 变量到现有品牌颜色
  - [x] 4.1.2 设置 `--sl-color-accent` 映射到 `--ifm-color-primary`
  - [x] 4.1.3 设置 `--sl-color-text` 映射到 `--color-text`
  - [x] 4.1.4 设置 `--sl-color-bg` 映射到 `--color-background`
- [ ] 4.2 测试主题切换
  - [ ] 4.2.1 验证深色模式样式正确
  - [ ] 4.2.2 验证浅色模式样式正确
  - [ ] 4.2.3 验证主题切换动画流畅
- [ ] 4.3 响应式测试
  - [ ] 4.3.1 测试移动端布局(宽度 < 768px)
  - [ ] 4.3.2 测试平板布局(768px - 1024px)
  - [ ] 4.3.3 测试桌面布局(> 1024px)
- [ ] 4.4 调整特定组件样式(如需要)
  - [ ] 4.4.1 调整导航栏样式
  - [ ] 4.4.2 调整侧边栏样式
  - [ ] 4.4.3 调整代码块样式

## 阶段 5: 组件迁移和清理

- [x] 5.1 备份要移除的组件(移动到 `src/components/_archive/`)
  - [x] 5.1.1 备份 `DocsLayout.astro`
  - [x] 5.1.2 备份 `Navbar.astro`
  - [x] 5.1.3 备份 `Footer.astro`
  - [x] 5.1.4 备份 `Sidebar.astro`
  - [x] 5.1.5 备份 `Tabs.astro` 和 `Tabs.tsx`
- [x] 5.2 移除文档路由
  - [x] 5.2.1 删除 `src/pages/docs/[...slug].astro`
- [ ] 5.3 更新 MDX 内容中的组件
  - [ ] 5.3.1 替换自定义 `<Tabs>` 组件为 Starlight 语法
  - [ ] 5.3.2 测试所有包含 Tabs 的页面
- [x] 5.4 移除已备份的组件
  - [x] 5.4.1 删除 `src/layouts/DocsLayout.astro` (已备份)
  - [x] 5.4.2 保留 `src/components/Navbar.astro` (首页需要)
  - [x] 5.4.3 保留 `src/components/Footer.astro` (首页需要)
  - [x] 5.4.4 删除 `src/components/Sidebar.astro` (已备份)
  - [x] 5.4.5 删除 `src/components/Tabs.astro` 和 `Tabs.tsx` (已备份)
  - [x] 5.4.6 删除 `src/components/ThemeButton.tsx` (已备份,后恢复)
  - [x] 5.4.7 删除 `src/components/TableOfContents.*` (已备份)
- [x] 5.5 验证首页和博客不受影响
  - [x] 5.5.1 测试首页加载和功能
  - [x] 5.5.2 测试博客列表和文章页面

## 阶段 6: 导航配置

- [x] 6.1 配置 Starlight 侧边栏
  - [x] 6.1.1 为 "快速开始" 配置 `autogenerate: { directory: 'quick-start' }`
  - [x] 6.1.2 为 "安装指南" 配置 `autogenerate: { directory: 'installation' }`
  - [x] 6.1.3 为其他主要部分配置侧边栏
  - [x] 6.1.4 配置嵌套和分组(如需要)
- [ ] 6.2 调整文档排序(如需要)
  - [ ] 6.2.1 通过 frontmatter `sidebar: { order: 1 }` 调整
  - [ ] 6.2.2 验证侧边栏顺序符合预期
- [ ] 6.3 测试导航功能
  - [ ] 6.3.1 测试侧边栏展开/折叠
  - [ ] 6.3.2 测试当前页面高亮
  - [ ] 6.3.3 测试移动端菜单

## 阶段 7: 搜索功能集成(可选)

- [ ] 7.1 安装 Pagefind 插件(如使用)
  - [ ] 7.1.1 运行 `npx astro add starlight-pagefind`
  - [ ] 7.1.2 配置 Starlight 插件选项
- [ ] 7.2 测试搜索功能
  - [ ] 7.2.1 测试搜索框显示
  - [ ] 7.2.2 测试搜索结果准确性
  - [ ] 7.2.3 测试搜索高亮显示
- [ ] 7.3 自定义搜索配置(如需要)
  - [ ] 7.3.1 配置搜索语言(zh-CN)
  - [ ] 7.3.2 配置搜索索引属性

## 阶段 8: 功能验证

- [ ] 8.1 文档页面测试
  - [ ] 8.1.1 测试所有快速开始文档
  - [ ] 8.1.2 测试所有安装指南文档
  - [ ] 8.1.3 测试其他主要文档部分
- [ ] 8.2 主题功能测试
  - [ ] 8.2.1 测试深色模式切换
  - [ ] 8.2.2 测试浅色模式切换
  - [ ] 8.2.3 测试主题偏好持久化
- [ ] 8.3 导航功能测试
  - [ ] 8.3.1 测试侧边栏导航
  - [ ] 8.3.2 测试面包屑导航
  - [ ] 8.3.3 测试上一页/下一页导航
  - [ ] 8.3.4 测试目录(Table of Contents)
- [ ] 8.4 SEO 测试
  - [ ] 8.4.1 验证页面 title 和 description
  - [ ] 8.4.2 验证 Open Graph 标签
  - [ ] 8.4.3 验证 sitemap.xml 生成
  - [ ] 8.4.4 使用 Lighthouse SEO 工具审计
- [ ] 8.5 无障碍访问测试
  - [ ] 8.5.1 测试键盘导航(Tab、Shift+Tab)
  - [ ] 8.5.2 测试焦点指示器可见性
  - [ ] 8.5.3 使用 Lighthouse a11y 工具审计
  - [ ] 8.5.4 验证 ARIA 标签正确性

## 阶段 9: 性能测试和优化

- [ ] 9.1 性能基准测试
  - [ ] 9.1.1 使用 Lighthouse 运行性能审计
  - [ ] 9.1.2 记录 Performance、SEO、a11y 分数
  - [ ] 9.1.3 对比迁移前的性能指标
- [ ] 9.2 构建性能测试
  - [ ] 9.2.1 运行 `time npm run build` 测量构建时间
  - [ ] 9.2.2 检查输出目录大小
  - [ ] 9.2.3 检查 JavaScript bundle 大小
- [ ] 9.3 优化(如需要)
  - [ ] 9.3.1 移除未使用的 CSS
  - [ ] 9.3.2 优化图片加载(如适用)
  - [ ] 9.3.3 减少客户端 JavaScript

## 阶段 10: 类型检查和修复

- [ ] 10.1 运行 TypeScript 类型检查
  - [ ] 10.1.1 运行 `npm run typecheck`
  - [ ] 10.1.2 修复所有类型错误
- [ ] 10.2 更新类型定义(如需要)
  - [ ] 10.2.1 添加 Starlight 相关的类型
  - [ ] 10.2.2 更新组件 props 类型

## 阶段 11: 文档和代码清理

- [ ] 11.1 更新项目文档
  - [ ] 11.1.1 更新 `openspec/project.md`(如需要)
  - [ ] 11.1.2 更新 README.md(如需要)
  - [ ] 11.1.3 记录 Starlight 特定配置
- [ ] 11.2 清理未使用的代码
  - [ ] 11.2.1 移除未使用的导入
  - [ ] 11.2.2 移除未使用的样式
  - [ ] 11.2.3 移除未使用的依赖(如适用)
- [ ] 11.3 代码格式化和 lint
  - [ ] 11.3.1 运行代码格式化工具(如使用)
  - [ ] 11.3.2 运行 linter(如使用)

## 阶段 12: 最终验证

- [ ] 12.1 本地预览测试
  - [ ] 12.1.1 运行 `npm run build`
  - [ ] 12.1.2 运行 `npm run preview`
  - [ ] 12.1.3 手动测试所有主要功能
- [ ] 12.2 跨浏览器测试
  - [ ] 12.2.1 测试 Chrome/Edge
  - [ ] 12.2.2 测试 Firefox
  - [ ] 12.2.3 测试 Safari(如可访问)
- [ ] 12.3 移动端测试
  - [ ] 12.3.1 测试 iOS Safari
  - [ ] 12.3.2 测试 Android Chrome
- [ ] 12.4 确认所有任务完成
  - [ ] 12.4.1 确认构建成功
  - [ ] 12.4.2 确认类型检查通过
  - [ ] 12.4.3 确认所有功能正常
  - [ ] 12.4.4 确认性能达标

## 阶段 13: 提交和 PR

- [ ] 13.1 提交代码
  - [ ] 13.1.1 `git add` 所有更改
  - [ ] 13.1.2 创建清晰的 commit message
  - [ ] 13.1.3 推送到远程分支
- [ ] 13.2 创建 Pull Request
  - [ ] 13.2.1 编写 PR 描述,说明变更内容
  - [ ] 13.2.2 添加测试截图(对比前后效果)
  - [ ] 13.2.3 引用相关的 OpenSpec proposal
- [ ] 13.3 等待审查和合并

## 阶段 14: 部署后验证

- [ ] 14.1 等待 GitHub Actions 部署完成
- [ ] 14.2 在生产环境测试所有功能
- [ ] 14.3 验证 SEO 元数据(使用 SEO 工具)
- [ ] 14.4 监控错误日志(如果有)

## 可选任务(按需)

- [ ] 自定义 Starlight 组件(如需要)
  - [ ] 覆盖 Header 组件
  - [ ] 覆盖 Footer 组件
  - [ ] 添加自定义文档组件
- [ ] 集成其他 Starlight 插件
  - [ ] 博客插件(如需要)
  - [ ] 评论插件(如需要)
  - [ ] 社交分享插件(如需要)
- [ ] 高级样式定制
  - [ ] 完全迁移到 Starlight 原生 CSS 变量
  - [ ] 自定义 Starlight 主题颜色
  - [ ] 添加自定义动画效果

## 回滚计划(如需要)

如果迁移遇到重大问题:

- [ ] 回滚到迁移前的分支
- [ ] 移除 `@astrojs/starlight` 依赖
- [ ] 恢复 `astro.config.mjs` 配置
- [ ] 恢复所有备份的组件
- [ ] 评估问题并调整方案

## 注意事项

1. **顺序执行**: 大多数任务应按顺序执行,因为存在依赖关系
2. **充分测试**: 每个阶段完成后应进行测试,确保功能正常
3. **保持备份**: 在删除组件前务必备份,以便需要时恢复
4. **文档记录**: 遇到问题或特殊配置时应记录下来
5. **性能监控**: 关注构建时间和 bundle size 的变化

## 预计时间

- 阶段 1-2: 1-2 小时
- 阶段 3-4: 2-3 小时
- 阶段 5-6: 2-3 小时
- 阶段 7-9: 1-2 小时
- 阶段 10-12: 1-2 小时
- 阶段 13-14: 1 小时

**总计**: 约 1-2 个工作日(取决于测试和调试时间)
