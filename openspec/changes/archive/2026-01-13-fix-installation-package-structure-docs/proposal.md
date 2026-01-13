# Change: 修复安装说明中，对于软件包本体的结构以及配置的说明

## Why

当前安装指南的"部署软件包"章节存在以下问题：
1. 目录结构说明不清晰：文档未详细说明解压后的软件包目录结构，用户不清楚包含哪些文件和文件夹
2. 配置文件位置不准确：文档提到的配置文件格式已过时（提到 `appsettings.Production.json`），实际上现在使用 YAML 格式的 `appsettings.yml`
3. 配置文件位置不明确：未说明 `config/` 目录的用途和配置层级加载机制
4. 缺少软件包内容概览：用户无法预览解压后将获得哪些文件和组件
5. 平台差异说明不足：不同平台的软件包结构差异未在文档中体现

参考的 Linux 软件包位于 `/home/newbe36524/repos/newbe36524/pcode/deployment/releases/pcode-linux-x64-structured`，该目录包含已解压的完整软件包结构。

**实际的软件包结构**：
- `config/` - 用户配置覆盖目录，包含 `appsettings.yml` 和 `README.md`（配置说明文档）
- `lib/` - 应用程序依赖和运行时文件，包含主程序 `PCode.Web.dll` 和所有依赖库
- `start.sh`（Linux/macOS）或 `start.bat`（Windows）- 启动脚本
- `README.md` - 软件包说明文档
- `README_en.md` - 英文版软件包说明文档

**配置加载优先级**（从低到高）：
1. `lib/appsettings.yml`（基础配置）
2. `lib/appsettings.Production.yml`（生产环境配置）
3. `config/appsettings.yml`（用户覆盖配置，最高优先级）

## What Changes

- 在 `docs/quick-start/installation.md` 的"部署软件包"章节后添加"软件包结构"小节
- 使用 Tabs 组件展示不同平台（Windows/macOS/Linux）的目录结构差异
- 添加完整的目录结构 ASCII 树状图，展示所有主要文件和文件夹
- 更新配置文件说明：
  - 配置文件格式为 YAML（`appsettings.yml`），而非 JSON
  - 配置文件位于 `config/` 目录
  - 说明配置加载优先级机制
  - 引用 `config/README.md` 作为详细配置参考
- 说明 `lib/` 目录包含应用依赖和运行时文件（包括 `PCode.Web.dll` 主程序）
- 说明启动脚本 `start.sh`（Linux/macOS）或 `start.bat`（Windows）的位置和用途
- 添加根目录 `README.md` 和 `README_en.md` 的说明

## Impact

- **Affected specs**: `docusaurus-site` (MODIFIED: Installation guide package structure documentation)
- **Affected code**:
  - `docs/quick-start/installation.md` - 在"部署软件包"章节后添加新的"软件包结构"小节
