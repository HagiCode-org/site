## 1. 创建 Desktop 安装指南文档

- [ ] 1.1 创建 `apps/docs/src/content/docs/installation/desktop.md` 文件
- [ ] 1.2 添加 frontmatter 配置
  - title: "Desktop 安装"
  - description: "Hagicode Desktop 桌面应用程序安装指南"
  - sidebar_position: 30

## 2. 编写文档内容

- [ ] 2.1 添加简介章节
  - 说明 Hagicode Desktop 是什么
  - 列出 Desktop 的优势和适用场景

- [ ] 2.2 编写"下载 Desktop"章节
  - 说明如何获取 Desktop 安装包
  - 提供下载链接或下载方式

- [ ] 2.3 编写"安装向导步骤"章节
  - 第一步：启动安装向导
    - 使用截图：向导第一步，点击开始安装.png
  - 第二步：下载最新版本
    - 使用截图：向导第二步，自动下载最新版本安装.png
  - 第三步：安装依赖项
    - 使用截图：
      - 向导第三步，检查版本的依赖项.png
      - 向导第三步，检查完成之后可以一键安装依赖项.png
      - 向导第三步，正在安装dotnet 运行时的一个示例.png
      - 向导第三步，安装所有依赖项完成.png
    - 说明依赖项（.NET 运行时等）的安装过程
  - 第四步：启动服务
    - 使用截图：
      - 向导第四步，正在启动 hagicode server.png
      - 向导第四步，server 启动之后可以点击 hagicode 开始使用.png
    - 说明服务启动过程

- [ ] 2.4 编写"首次使用"章节
  - 使用截图：
    - hagicode desktop 正在安装中.png
    - 进入hagicode 之后可以通过内部向导开始创建项目.png
  - 说明如何创建项目
  - 说明如何导入 Git 仓库
    - 使用截图：通过输入一个文件夹，可以扫描这个文件夹地下所有的 git 仓库进行导入.png

- [ ] 2.5 编写"版本管理"章节
  - 使用截图：可以在版本管理页面对不同的版本进行切换.png
  - 说明如何切换不同版本

- [ ] 2.6 编写"启动和停止服务"章节
  - 使用截图：在首页可以通过启动服务来启动hagicode server.png
  - 说明如何启动和停止 Hagicode Server

- [ ] 2.7 编写"后续步骤"章节
  - 链接到快速开始指南
  - 链接到相关文档

## 3. 图片引用验证

- [ ] 3.1 确保所有截图使用正确的相对路径
  - 路径格式：`/img/install-desktop/文件名.png`
- [ ] 3.2 确保所有图片都有合适的 alt 文本
- [ ] 3.3 验证所有截图文件都存在于 `apps/docs/public/img/install-desktop/` 目录

## 4. 文档格式和质量

- [ ] 4.1 使用 Markdown 语法格式化内容
- [ ] 4.2 使用 Starlight 组件（如 tip、note、caution 等）
- [ ] 4.3 确保内容使用简体中文
- [ ] 4.4 添加适当的代码块和命令示例
- [ ] 4.5 保持与现有安装指南一致的风格

## 5. 验证和测试

- [ ] 5.1 运行 `npm run typecheck` 确保无 TypeScript 错误
- [ ] 5.2 运行 `npm run build:docs` 确保构建成功，无断链错误
- [ ] 5.3 使用 `npm run dev:docs` 在本地预览文档
- [ ] 5.4 验证所有链接正确指向目标位置
- [ ] 5.5 验证侧边栏正确显示 Desktop 安装指南
- [ ] 5.6 验证所有图片正确加载
- [ ] 5.7 验证文档在移动端的显示效果

## 6. 完成

- [ ] 6.1 更新 tasks.md，将所有任务标记为完成
- [ ] 6.2 提交更改并等待审核批准
