# Change: 更新安装指南中 Windows 的关于 PostgreSQL 的部分

## Why

PCode 安装指南（`docs/quick-start/installation.md`）中的 **PostgreSQL 数据库**部分目前仅提供了通过 Docker 安装 PostgreSQL 的说明。在实际的 Windows 安装选项卡中，用户可以看到 Docker Desktop 的下载链接，但缺少使用 EXE 安装程序直接安装 PostgreSQL 的替代方案。

项目已提供了 PostgreSQL Windows EXE 安装方式的详细文档（`docs/related-software-installation/postgresql/install-on-windows.md`），该文档位于「相关软件安装」分类下，但在快速开始指南中未建立链接关系。

**问题点**：
1. **安装方式单一**：仅提供了 Docker Desktop 安装方式，没有提供 EXE 安装程序的选项
2. **文档链接缺失**：未链接到已存在的 PostgreSQL Windows 安装详细文档
3. **用户体验不完整**：部分 Windows 用户可能更倾向于使用原生 EXE 安装程序而非 Docker

## What Changes

修改 `docs/quick-start/installation.md` 文件，在 **PostgreSQL 数据库 > 安装 Docker > Windows TabItem** 部分添加 EXE 安装方式的链接提示。

### 具体修改

文件：`docs/quick-start/installation.md`
位置：PostgreSQL 数据库 > 安装 Docker > Windows TabItem（约第 24-27 行）

**修改前**：
```markdown
<TabItem value="win" label="Windows">
  下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
</TabItem>
```

**修改后**：
```markdown
<TabItem value="win" label="Windows">
  下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)

  :::tip 替代安装方式
  如果您更倾向于使用原生安装程序，可以参阅 **[在 Windows 上安装 PostgreSQL](/docs/related-software-installation/postgresql/install-on-windows)** 获取详细的 EXE 安装步骤。
  :::
</TabItem>
```

### 设计理由

1. **保留 Docker 为主要推荐**：维持 Docker Desktop 作为主要推荐方式，保持与文档整体风格一致
2. **使用 tip 组件**：与文档中已有的 OpenSpec 和 Claude Code 安装提示样式保持一致
3. **清晰的链接文本**：明确说明这是"替代安装方式"，避免用户混淆
4. **链接到详细文档**：复用已存在的详细安装文档，避免在快速开始指南中重复详细步骤

## Impact

### 影响的规格
- `docusaurus-site` - 更新安装指南的 PostgreSQL 安装部分

### 影响的文件/目录
- 修改：`docs/quick-start/installation.md`（Windows TabItem 部分）

### 预期成果
- Windows 用户可以获得更灵活的 PostgreSQL 安装选项
- 将现有的相关软件安装文档与快速开始指南进行连接
- 复用已存在的详细安装文档，避免重复
- 与文档中已有的 OpenSpec 和 Claude Code 安装提示保持一致的链接风格

## Status

**ExecutionCompleted** (2026-01-13)
