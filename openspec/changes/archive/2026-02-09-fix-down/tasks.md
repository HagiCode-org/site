## 1. 代码审查与分析

- [ ] 1.1 审查 `src/pages/index.astro` 中的版本数据获取逻辑
- [ ] 1.2 审查 `src/components/home/Navbar.tsx` 中的 props 接收和传递
- [ ] 1.3 审查 `src/components/home/HeroSection.tsx` 中的 props 接收和传递
- [ ] 1.4 审查 `src/components/home/InstallButton.tsx` 中的 props 接口定义
- [ ] 1.5 检查 `src/utils/desktop.ts` 中的 `fetchDesktopVersions` 和 `groupAssetsByPlatform` 函数

## 2. 验证版本数据传递链路

- [ ] 2.1 确认 `index.astro` 在构建时正确调用 `fetchDesktopVersions()`
- [ ] 2.2 确认 `desktopVersionData` 对象包含正确的 `latest`、`platforms`、`error` 字段
- [ ] 2.3 验证 Navbar 组件接收到 `desktopVersion`、`desktopPlatforms`、`desktopVersionError` props
- [ ] 2.4 验证 HeroSection 组件接收到相同的 props
- [ ] 2.5 确认 InstallButton 组件在两个父组件中都正确接收版本 props

## 3. 检查组件 Props 传递

- [ ] 3.1 验证 Navbar 中 Desktop 版本的 InstallButton 接收 `version={desktopVersion}`
- [ ] 3.2 验证 Navbar 中 Desktop 版本的 InstallButton 接收 `platforms={desktopPlatforms}`
- [ ] 3.3 验证 Navbar 中 Desktop 版本的 InstallButton 接收 `versionError={desktopVersionError}`
- [ ] 3.4 验证移动菜单中的 InstallButton 也接收相同的 props
- [ ] 3.5 验证 HeroSection 中的 InstallButton 接收相同的 props

## 4. 修复发现的问题

- [ ] 4.1 如果发现 props 未正确传递，修复 `index.astro` 中的组件调用
- [ ] 4.2 如果发现组件未正确声明 props，修复组件的 TypeScript 接口
- [ ] 4.3 如果发现版本数据格式不匹配，修复数据转换逻辑
- [ ] 4.4 如果发现构建时数据获取失败，修复 `fetchDesktopVersions` 函数

## 5. 本地测试验证

- [ ] 5.1 启动开发服务器：`npm run dev`
- [ ] 5.2 在首页测试 Navbar 中"立即安装"按钮的下拉菜单
- [ ] 5.3 验证下拉菜单显示所有平台的版本选项（Windows、macOS、Linux）
- [ ] 5.4 验证每个平台的下载链接正确且可访问
- [ ] 5.5 测试所有主题变体（亮色、暗色、农历新年）
- [ ] 5.6 测试响应式布局（移动端视图和移动菜单）
- [ ] 5.7 验证 HeroSection 中的安装按钮也显示正确的版本信息

## 6. 构建验证

- [ ] 6.1 运行构建命令：`npm run build`
- [ ] 6.2 确认构建无错误或警告
- [ ] 6.3 验证构建产物的 HTML 包含正确的版本数据
- [ ] 6.4 如果使用静态数据生成，确认版本数据已正确注入到页面中

## 7. 代码审查与提交

- [ ] 7.1 自查代码变更，确保 props 传递正确
- [ ] 7.2 更新相关组件的类型定义和注释
- [ ] 7.3 提交代码并创建 PR（如需要）
