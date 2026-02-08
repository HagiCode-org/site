## 1. 准备阶段

- [ ] 1.1 确认需求范围和验收标准
- [ ] 1.2 创建功能分支 `feature/footer-design-unification`
- [ ] 1.3 备份现有 Footer 组件（`src/components/home/Footer.tsx` 和 `src/components/StarlightFooter.astro`）

## 2. 样式系统扩展

- [ ] 2.1 在 `src/styles/homepage.css` 中添加 Footer 专用 CSS 变量
  - [ ] 添加 `--footer-bg`（支持亮色/暗色主题）
  - [ ] 添加 `--footer-border`
  - [ ] 添加 `--footer-link-color`
  - [ ] 添加 `--footer-link-hover`
  - [ ] 添加 `--footer-section-gap`
  - [ ] 添加 `--footer-grid-template`（响应式布局）

## 3. 首页 Footer 重构

- [ ] 3.1 重构 `src/components/home/Footer.tsx` 组件
  - [ ] 定义三栏内容数据结构（产品信息、快速链接、社区与支持）
  - [ ] 添加三栏布局 JSX 结构
  - [ ] 保持现有接口兼容性（`FooterProps`）

- [ ] 3.2 更新 `src/components/home/Footer.module.css` 样式
  - [ ] 实现三栏 Grid/Flexbox 布局
  - [ ] 添加响应式断点（移动端单栏、平板两栏、桌面三栏）
  - [ ] 应用新的 CSS 变量系统
  - [ ] 确保暗色/亮色主题切换平滑过渡

## 4. Starlight Footer 统一

- [ ] 4.1 重构 `src/components/StarlightFooter.astro` 组件
  - [ ] 复制首页 Footer 的三栏布局结构
  - [ ] 保留 Starlight 特有功能（EditLink、LastUpdated、Pagination）
  - [ ] 确保与 Starlight 主题系统兼容

- [ ] 4.2 更新 Starlight Footer 样式
  - [ ] 添加三栏布局样式（与首页 Footer 保持一致）
  - [ ] 确保 Starlight 变量与自定义 CSS 变量正确映射
  - [ ] 测试与 Starlight 暗色模式的兼容性

## 5. TypeScript 类型定义

- [ ] 5.1 为 Footer 内容定义 TypeScript 接口
  - [ ] 创建 `FooterSection` 接口（标题、链接列表）
  - [ ] 创建 `FooterLink` 接口（标签、URL、外部链接标识）
  - [ ] 创建 `FooterData` 接口（完整的 Footer 数据结构）

## 6. 响应式设计测试

- [ ] 6.1 测试移动端布局（<768px）
  - [ ] 验证单栏垂直布局
  - [ ] 验证触摸目标尺寸（最小 44x44px）
  - [ ] 验证文字大小和可读性

- [ ] 6.2 测试平板端布局（768px-1023px）
  - [ ] 验证两栏水平布局
  - [ ] 验证间距和对齐

- [ ] 6.3 测试桌面端布局（≥1024px）
  - [ ] 验证三栏水平布局
  - [ ] 验证最大宽度限制和居中对齐

## 7. 主题切换验证

- [ ] 7.1 测试亮色主题下 Footer 显示
- [ ] 7.2 测试暗色主题下 Footer 显示
- [ ] 7.3 测试主题切换时的平滑过渡动画
- [ ] 7.4 验证主题切换后 Footer 内容正确渲染

## 8. 无障碍性检查

- [ ] 8.1 验证语义化 HTML 结构（使用 `<footer>`, `<nav>` 等语义标签）
- [ ] 8.2 验证 ARIA 标签完整性（`aria-label` 属性）
- [ ] 8.3 验证键盘导航支持（Tab 键顺序）
- [ ] 8.4 验证屏幕阅读器兼容性

## 9. 浏览器兼容性测试

- [ ] 9.1 测试 Chrome 最新版
- [ ] 9.2 测试 Firefox 最新版
- [ ] 9.3 测试 Safari 最新版
- [ ] 9.4 测试 Edge 最新版
- [ ] 9.5 测试移动端浏览器（iOS Safari、Chrome Mobile）

## 10. 构建验证

- [ ] 10.1 运行 `npm run typecheck` 确保 TypeScript 类型检查通过
- [ ] 10.2 运行 `npm run build` 确保构建成功
- [ ] 10.3 运行 `npm run preview` 本地预览生产构建
- [ ] 10.4 验证首页 Footer 在生产环境中正确显示
- [ ] 10.5 验证文档区 Footer 在生产环境中正确显示

## 11. 内容和文案确认

- [ ] 11.1 确认产品信息栏内容（Hagicode 简介、版本信息、更新日志）
- [ ] 11.2 确认快速链接栏内容（产品文档、博客文章、API 参考、快速开始）
- [ ] 11.3 确认社区与支持栏内容（GitHub 仓库、许可证、问题反馈、联系邮箱）
- [ ] 11.4 确认备案信息显示正确（闽ICP备2026004153号-1）

## 12. SEO 优化验证

- [ ] 12.1 验证 Footer 链接使用正确的 `rel` 属性（外部链接使用 `noopener noreferrer`）
- [ ] 12.2 验证 Footer 链接 URL 正确性（支持 `VITE_SITE_BASE` 环境变量）
- [ ] 12.3 验证 canonical 链接完整性

## 13. 文档更新

- [ ] 13.1 更新组件使用说明（如有需要）
- [ ] 13.2 记录 CSS 变量使用规范
- [ ] 13.3 更新响应式断点文档

## 14. 代码审查

- [ ] 14.1 自我审查代码质量和一致性
- [ ] 14.2 确保代码符合项目 TypeScript 规范
- [ ] 14.3 确保代码符合项目 CSS 命名规范
- [ ] 14.4 提交 Pull Request 进行代码审查

## 15. 部署准备

- [ ] 15.1 确保所有测试通过
- [ ] 15.2 更新 CHANGELOG（如有需要）
- [ ] 15.3 合并到主分支
- [ ] 15.4 监控部署后表现（GitHub Pages、Azure Static Web Apps）
