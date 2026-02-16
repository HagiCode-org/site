# 实施任务清单

## 1. 创建目录结构
- [ ] 1.1 在 `apps/docs/src/content/docs/related-software-installation/` 下创建 `dotnet` 子目录

## 2. 创建 .NET 10 SDK 安装文档
- [ ] 2.1 创建 `install-dotnet-sdk.md` 文件
- [ ] 2.2 添加必需的 frontmatter（title, description, sidebar_position）
- [ ] 2.3 编写文档内容，包括：
  - [ ] 2.3.1 简介（什么是 .NET SDK）
  - [ ] 2.3.2 版本要求说明
  - [ ] 2.3.3 Windows 安装步骤（使用 Tabs 组件）
  - [ ] 2.3.4 macOS 安装步骤（使用 Tabs 组件）
  - [ ] 2.3.5 Linux 安装步骤（使用 Tabs 组件，包含 Ubuntu/Debian/CentOS/Fedora）
  - [ ] 2.3.6 验证安装步骤
  - [ ] 2.3.7 故障排除章节
  - [ ] 2.3.8 后续步骤链接

## 3. 验证文档质量
- [ ] 3.1 确保文档使用简体中文
- [ ] 3.2 确保代码块使用正确的语言标识
- [ ] 3.3 确保链接使用正确的路径格式
- [ ] 3.4 运行 `npm run build:docs` 验证构建成功
- [ ] 3.5 检查没有断链错误

## 4. 测试
- [ ] 4.1 本地预览文档页面
- [ ] 4.2 验证 Tabs 组件正常工作
- [ ] 4.3 验证文档在 Starlight 侧边栏中正确显示
- [ ] 4.4 验证移动端响应式布局
