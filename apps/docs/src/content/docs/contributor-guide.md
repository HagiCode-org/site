---
title: 文档贡献指南
description: 了解如何为 Hagicode 文档项目做出贡献，包括文档编写规范、图片引用方式和提交流程。
sidebar_position: 100
---

感谢您对 Hagicode 文档项目的关注！本指南将帮助您了解如何为文档做出贡献。

## 贡献方式

我们欢迎各种形式的贡献：

- 📝 **修正错误**：修复文档中的错别字、链接错误或过时信息
- ✨ **改进内容**：增强文档的清晰度、添加示例或补充说明
- 🖼️ **添加图片**：为文档添加截图、图表或其他视觉元素
- 🌐 **翻译文档**：将文档翻译成其他语言

## 开始贡献

### 1. 准备工作

在开始之前，请确保：

- 您有一个 GitHub 账号
- 熟悉基本的 Markdown 语法
- 了解 Git 的基本操作

### 2. Fork 和克隆

1. Fork 本仓库到您的 GitHub 账号
2. 克隆您的 Fork 到本地：
   ```bash
   git clone https://github.com/your-username/pcode-docs.git
   cd pcode-docs
   ```

### 3. 创建分支

为您的更改创建一个新分支：
```bash
git checkout -b feat/your-change-description
```

### 4. 进行更改

在您喜欢的编辑器中进行修改。

## 文档编写规范

### Markdown 语法

我们使用标准的 Markdown 语法，并支持以下扩展：

- **标题**：使用 `#` 表示标题级别
- **列表**：支持有序和无序列表
- **代码块**：使用三个反引号包围代码，可指定语言
- **表格**：使用 Markdown 表格语法
- **链接**：使用 `[文本](URL)` 格式

### 内容组织

- **清晰简洁**：使用简单直接的语言表达
- **结构化**：合理使用标题和子标题组织内容
- **示例丰富**：提供实际的代码示例和截图
- **更新及时**：确保内容与最新版本一致

### 语言风格

- **使用中文**：主要使用简体中文编写文档
- **专业术语**：保留英文技术术语的原样（如 API、CLI 等）
- **友好语气**：使用友好、帮助性的语气

## 图片引用规范

### 图片存储位置

文档相关的图片必须存储在 `src/content/docs/img/` 目录下，与内容文件保持关联。

```
apps/docs/src/content/docs/img/
├── quick-start/              # 快速开始文档图片
│   ├── create-normal-session/
│   ├── create-project/
│   └── create-proposal-session/
├── installation/             # 安装指南文档图片
│   ├── desktop/
│   └── docker-compose/
├── related-software-installation/  # 相关软件安装图片
│   └── postgresql/
├── product-overview/         # 产品概述图片
└── shared/                   # 共享图片资源
```

### 图片引用方式

:::important[重要规范]
**必须使用相对路径引用图片**，而不是绝对路径。

:::

#### ✅ 正确示例

使用相对路径，从 Markdown 文件位置计算到图片目录的路径：

```markdown
<!-- 在 docs 根目录的文件，如 product-overview.md -->
<!-- ![产品概述](./img/product-overview/value-proposition-proposal-driven/illustration.png) -->

<!-- 在 quick-start/ 子目录的文件，如 quick-start/conversation-session.md -->
<!-- ![创建会话](../img/quick-start/create-normal-session/01-create-normal-session.png) -->

<!-- 在 related-software-installation/postgresql/ 子目录的文件 -->
<!-- ![安装界面](../../img/installation/install-postgres-windows/1.打开安装界面.png) -->
```

:::tip[示例说明]
以上示例展示了不同位置文件的相对路径写法。实际使用时，请根据您的文件位置和图片路径进行调整。
:::

#### ❌ 错误示例

**不要使用绝对路径引用文档图片**：

```markdown
<!-- ❌ 错误：使用绝对路径 -->
<!-- ![图片](/img/create-normal-session/01-create-normal-session.png) -->
```

:::note[为什么使用相对路径？]
- **类型安全**：Astro Content Collections 会在开发阶段验证图片路径
- **IDE 支持**：编辑器可以提供自动补全和预览
- **更好的维护性**：图片与内容文件关联更紧密
- **性能优化**：可以利用 Astro 的图片优化功能
:::

### 相对路径计算规则

从 Markdown 文件位置计算到 `src/content/docs/img/` 的相对路径：

```
文件位置: src/content/docs/file.md
相对路径前缀: ./img/
<!-- 示例: ![图片](./img/category/image.png) -->

文件位置: src/content/docs/category/file.md
相对路径前缀: ../img/
<!-- 示例: ![图片](../img/category/image.png) -->

文件位置: src/content/docs/category/subcategory/file.md
相对路径前缀: ../../img/
<!-- 示例: ![图片](../../img/category/image.png) -->
```

### 图片命名建议

- **使用描述性名称**：如 `create-project-step1.png` 而不是 `image1.png`
- **使用连字符分隔**：如 `installation-wizard.png` 而不是 `installation_wizard.png`
- **包含序号**：多步骤截图使用序号，如 `step1-xxx.png`、`step2-xxx.png`
- **中文名称支持**：允许使用中文文件名，但建议使用英文

### 图片格式要求

- **推荐格式**：PNG（截图）、JPG（照片）、SVG（图标）
- **文件大小**：单个图片文件建议不超过 500KB
- **图片尺寸**：宽度建议在 800-1200px 之间
- **清晰度**：确保文字清晰可读

### 添加图片的步骤

1. **放置图片文件**：将图片放到 `src/content/docs/img/` 对应的子目录中
2. **使用相对路径引用**：在 Markdown 中使用正确的相对路径
3. **验证引用**：运行开发服务器确认图片正常显示

```bash
# 启动开发服务器
npm run dev

# 在浏览器中访问文档页面，确认图片正常显示
```

## 本地预览

在提交更改之前，建议本地预览您的修改：

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:4321` 查看您的更改。

### 构建验证

确保构建成功：

```bash
npm run build
```

## 提交更改

### 1. 提交您的更改

```bash
git add .
git commit -m "描述您的更改"
```

### 2. 推送到您的 Fork

```bash
git push origin feat/your-change-description
```

### 3. 创建 Pull Request

1. 访问原仓库的 GitHub 页面
2. 点击 "New Pull Request"
3. 选择您的分支
4. 填写 PR 描述，说明您的更改
5. 提交 PR

### PR 描述模板

```markdown
## 变更说明
简要描述您做了哪些更改。

## 相关问题
关联相关的 Issue 或 PR。

## 测试
- [ ] 已在本地测试通过
- [ ] 已检查链接有效性
- [ ] 已验证图片正常显示

## 截图
如果有界面变更，请提供截图。
```

## 代码审查

我们的维护者会审查您的 PR，可能会：

- 提出修改建议
- 请求额外的更改
- 或直接合并您的 PR

请保持关注 PR 的通知，及时回应反馈。

## 发布流程

合并后的更改会自动发布到生产环境。通常：

1. PR 合并到 main 分支
2. CI/CD 自动构建和部署
3. 更改在几分钟内生效

## 获取帮助

如果您在贡献过程中遇到问题：

- 📧 [提交 Issue](https://github.com/HagiCode-org/site/issues)
- 💬 加入我们的技术交流群
- 📖 查看 [Astro 官方文档](https://docs.astro.build)

## 许可证

通过贡献到本项目，您同意您的贡献将在与项目相同的许可证下发布。

---

再次感谢您的贡献！🎉
