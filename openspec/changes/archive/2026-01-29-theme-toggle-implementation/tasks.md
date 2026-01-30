## 1. 准备阶段

- [x] 1.1 创建 `src/theme.ts` 工具函数文件
  - 定义 `Theme` 类型（'light' | 'dark'）
  - 实现 `getInitialTheme()` 函数
  - 实现 `getSystemTheme()` 函数
  - 实现 `setTheme()` 函数
  - 实现 `applyTheme()` 函数
  - 定义 `THEME_KEY` 常量

- [x] 1.2 创建 `src/hooks/useTheme.tsx` Hook 文件
  - 实现 `useTheme()` Hook
  - 添加 `theme` 状态管理
  - 添加 `toggleTheme()` 函数
  - 添加系统主题变化监听
  - 导出类型和函数

- [x] 1.3 TypeScript 类型定义验证
  - 确保 `Theme` 类型在所有文件中一致
  - 为所有函数添加 JSDoc 注释
  - 运行 `npm run typecheck` 验证类型正确性

## 2. 样式系统扩展

- [x] 2.1 完善 `src/styles/global.css` 中的亮色主题变量
  - 补全 `:root` 中的颜色变量
  - 添加 `--color-background` 背景色变量
  - 添加 `--color-text` 文字颜色变量
  - 添加 `--color-border` 边框颜色变量
  - 添加其他必要的颜色和间距变量

- [x] 2.2 完善 `src/styles/global.css` 中的暗色主题变量
  - 补全 `[data-theme='dark']` 中的颜色变量
  - 确保与亮色主题变量一一对应
  - 调整暗色主题的颜色对比度

- [x] 2.3 添加主题切换过渡动画
  - 为 `html` 和 `body` 添加 CSS transition
  - 设置过渡时长为 300ms
  - 确保过渡效果自然流畅

- [x] 2.4 验证现有组件的样式兼容性
  - 检查 `.hero` 组件在两种主题下的显示
  - 检查 `.toc` 组件在两种主题下的显示
  - 检查代码块和 admonition 在两种主题下的显示
  - 修复任何样式冲突

## 3. React 组件开发

- [x] 3.1 创建 `src/components/ThemeButton.tsx` 组件
  - 导入必要的依赖（React, Framer Motion）
  - 定义 `ThemeButton` 函数组件
  - 集成 `useTheme` Hook
  - 实现太阳/月亮图标 SVG
  - 添加 Framer Motion 动画效果
  - 添加悬停和点击交互
  - 添加无障碍属性（aria-label）

- [x] 3.2 实现主题切换按钮的动画效果
  - 定义图标切换动画 variants
  - 定义按钮交互动画 variants
  - 配置动画时长和缓动函数
  - 测试动画流畅度（目标：60fps）

- [x] 3.3 为主题按钮添加无障碍支持
  - 添加 `aria-label` 属性（当前主题状态）
  - 添加 `role="button"` 属性
  - 确保键盘导航支持（Tab 键聚焦）
  - 添加键盘事件处理（Enter/Space 键触发）

## 4. 导航栏集成

- [x] 4.1 修改 `src/components/Navbar.astro`
  - 在 `<script>` 标签中导入 `ThemeButton` 组件
  - 在 `navbar__items` div 中添加 `<ThemeButton client:load />`
  - 调整导航栏布局以容纳新按钮
  - 确保按钮在最右侧位置

- [x] 4.2 为移动端添加主题切换按钮
  - 在移动端菜单中添加主题切换按钮（与桌面端相同）
  - 确保按钮可以直接点击切换主题（无需展开子菜单）
  - 点击后立即应用主题并更新图标

- [x] 4.3 调整导航栏响应式布局
  - 测试桌面端按钮显示效果（直接点击切换）
  - 测试移动端（< 768px）菜单显示效果（直接点击切换）
  - 调整间距和样式以确保视觉一致性
  - 修复任何布局冲突或溢出问题
  - 确保无下拉菜单，交互简洁直接

## 5. 布局与初始化

- [x] 5.1 修改 `src/layouts/Layout.astro`
  - 在 `<html>` 根元素添加 `data-theme="dark"` 默认属性
  - 在 `<head>` 中添加内联初始化脚本
  - 实现 localStorage 优先读取逻辑
  - 实现系统偏好检测逻辑
  - 确保 SSR 时不会报错（typeof window 检查）

- [x] 5.2 验证主题初始化无闪烁
  - 测试首次访问时的页面加载
  - 测试刷新页面时的主题保持
  - 测试在不同浏览器下的初始化行为
  - 确保无 FOUC（Flash of Unstyled Content）

- [x] 5.3 确保 SSR 兼容性
  - 验证服务端渲染时不会访问浏览器 API
  - 验证客户端 hydration 时主题状态一致
  - 测试构建时无 TypeScript 错误
  - 测试构建时无运行时错误

## 6. 测试与验证

- [x] 6.1 功能测试
  - 点击主题按钮能正确切换主题（直接点击，无下拉菜单）
  - 刷新页面后主题选择保持不变
  - 首次访问默认为暗色主题
  - 移动端和桌面端按钮均能直接点击切换
  - localStorage 正确保存和读取主题

- [ ] 6.2 兼容性测试
  - Chrome/Edge (最新版) 测试
  - Firefox (最新版) 测试
  - Safari (最新版) 测试
  - iOS Safari 测试
  - Android Chrome 测试

- [ ] 6.3 性能测试
  - 使用 Lighthouse 测试性能得分
  - 验证页面加载时间增加 < 100ms
  - 验证 JS bundle 大小增加 < 5KB
  - 验证主题切换动画流畅度（≥ 60fps）

- [ ] 6.4 样式兼容性测试
  - 首页在两种主题下的显示效果
  - 文档页面在两种主题下的显示效果
  - 博客页面在两种主题下的显示效果
  - 代码高亮在两种主题下的可读性
  - 表格、链接、按钮在两种主题下的显示

## 7. 构建验证

- [ ] 7.1 TypeScript 类型检查
  - 运行 `npm run typecheck`
  - 修复所有类型错误
  - 确保所有新文件包含在 tsconfig.json 中

- [x] 7.2 生产构建测试
  - 运行 `npm run build`
  - 确保构建成功无错误
  - 检查构建产物大小
  - 验证所有资源正确生成

- [ ] 7.3 本地预览测试
  - 运行 `npm run preview`
  - 测试生产构建版本的功能
  - 验证主题切换在生产环境中正常工作
  - 检查控制台无错误或警告

## 8. 文档与清理

- [x] 8.1 代码注释和文档
  - 为所有新函数添加 JSDoc 注释
  - 为复杂的逻辑添加解释性注释
  - 确保代码符合项目风格指南

- [x] 8.2 清理调试代码
  - 移除所有 console.log 调试语句
  - 移除未使用的导入
  - 清理测试用的临时代码

- [ ] 8.3 最终验证
  - 再次运行完整的测试流程
  - 确保所有 tasks 已完成
  - 确认所有测试用例通过
  - 准备提交 Pull Request
