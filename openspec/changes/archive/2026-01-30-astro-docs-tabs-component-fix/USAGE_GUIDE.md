# Tabs 组件使用指南

## 概述

在 Hagicode 文档中，Tabs 组件用于展示跨平台内容（如 Windows、macOS、Linux 的安装说明）。由于 Astro + MDX 环境的限制，我们使用**原生 HTML 结构 + 数据属性**的方式实现 Tabs，而非导入 React 或 Astro 组件。

## 为什么使用原生 HTML？

根据之前的调研（`openspec/changes/archive/2026-01-30-astro-tabs-component-migration/`），在 Astro + MDX 环境中：

- ❌ **Astro 组件**无法在 `.mdx` 文件中使用（MDX 解析器不识别）
- ❌ **React 组件**即使使用 `client:load` 也无法可靠渲染
- ✅ **原生 HTML** 100% 可靠，零依赖，MDX 原生支持

## 基本语法

### 完整模板

````mdx
---
title: 你的文档标题
description: 文档描述
---

<div class="tabs-component" data-default-value="win">
  <div>
    <div data-value="win" data-label="Windows"></div>
    <div data-value="mac" data-label="macOS"></div>
    <div data-value="linux" data-label="Linux"></div>
  </div>
  <div>
    <div data-value="win">
      ### Windows 内容

      这里写 Windows 平台的说明...

      ```powershell
      # Windows 命令示例
      npm install -g package
      ```
    </div>
    <div data-value="mac">
      ### macOS 内容

      这里写 macOS 平台的说明...

      ```bash
      # macOS 命令示例
      npm install -g package
      ```
    </div>
    <div data-value="linux">
      ### Linux 内容

      这里写 Linux 平台的说明...

      ```bash
      # Linux 命令示例
      npm install -g package
      ```
    </div>
  </div>
</div>
````

### 结构说明

```
┌─────────────────────────────────────────────────────────┐
│ <div class="tabs-component" data-default-value="win">  │ ← 容器，指定默认标签
│   ├─ <div>                                             │ ← 标签头容器（自动生成按钮）
│   │  ├─ <div data-value="win" data-label="Windows">   │ ← Windows 标签定义
│   │  ├─ <div data-value="mac" data-label="macOS">     │ ← macOS 标签定义
│   │  └─ <div data-value="linux" data-label="Linux">   │ ← Linux 标签定义
│   └─ <div>                                             │ ← 内容面板容器
│      ├─ <div data-value="win">                         │ ← Windows 内容
│      ├─ <div data-value="mac">                         │ ← macOS 内容
│      └─ <div data-value="linux">                       │ ← Linux 内容
└─────────────────────────────────────────────────────────┘
```

## 属性说明

### 容器属性

| 属性 | 必需 | 说明 | 示例 |
|------|------|------|------|
| `class="tabs-component"` | ✅ | 标识这是一个 Tabs 组件 | - |
| `data-default-value` | ✅ | 指定默认显示的标签 | `data-default-value="win"` |
| `data-group-id` | ❌ | 可选的分组 ID（用于多个 Tabs 联动） | `data-group-id="install-tabs"` |

### 标签头属性

| 属性 | 必需 | 说明 | 示例 |
|------|------|------|------|
| `data-value` | ✅ | 标签的唯一标识符 | `data-value="win"` |
| `data-label` | ✅ | 显示在按钮上的文本 | `data-label="Windows"` |

### 内容面板属性

| 属性 | 必需 | 说明 | 示例 |
|------|------|------|------|
| `data-value` | ✅ | 与标签头的 `data-value` 对应 | `data-value="win"` |

## 使用示例

### 示例 1: 安装指南

````mdx
## 安装 Node.js

<div class="tabs-component" data-default-value="win">
  <div>
    <div data-value="win" data-label="Windows"></div>
    <div data-value="mac" data-label="macOS"></div>
    <div data-value="linux" data-label="Linux"></div>
  </div>
  <div>
    <div data-value="win">
      访问 [Node.js 官网](https://nodejs.org/) 下载 Windows 安装程序，双击运行并按照提示完成安装。

      或使用 Chocolatey:
      ```powershell
      choco install nodejs
      ```
    </div>
    <div data-value="mac">
      使用 Homebrew 安装:
      ```bash
      brew install node
      ```
    </div>
    <div data-value="linux">
      使用包管理器安装:

      **Ubuntu/Debian:**
      ```bash
      sudo apt install nodejs npm
      ```

      **Fedora:**
      ```bash
      sudo dnf install nodejs npm
      ```
    </div>
  </div>
</div>
````

### 示例 2: 配置文件路径

````mdx
## 配置文件位置

<div class="tabs-component" data-default-value="win">
  <div>
    <div data-value="win" data-label="Windows"></div>
    <div data-value="mac" data-label="macOS"></div>
    <div data-value="linux" data-label="Linux"></div>
  </div>
  <div>
    <div data-value="win">
      配置文件位于:
      ```
      %APPDATA%\YourApp\config.json
      ```

      即:
      ```
      C:\Users\YourName\AppData\Roaming\YourApp\config.json
      ```
    </div>
    <div data-value="mac">
      配置文件位于:
      ```
      ~/Library/Application Support/YourApp/config.json
      ```
    </div>
    <div data-value="linux">
      配置文件位于:
      ```
      ~/.config/YourApp/config.json
      ```

      遵循 [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)。
    </div>
  </div>
</div>
````

### 示例 3: 两个标签

````mdx
<div class="tabs-component" data-default-value="npm">
  <div>
    <div data-value="npm" data-label="npm"></div>
    <div data-value="yarn" data-label="Yarn"></div>
  </div>
  <div>
    <div data-value="npm">
      使用 npm 安装:
      ```bash
      npm install your-package
      ```
    </div>
    <div data-value="yarn">
      使用 Yarn 安装:
      ```bash
      yarn add your-package
      ```
    </div>
  </div>
</div>
````

## 常见错误

### ❌ 错误 1: 使用 React 组件导入

````mdx
---
title: 错误示例
---

import { Tabs, TabItem } from '@/components/Tabs';  <!-- ❌ 不要这样做！ -->

<Tabs client:load>
  <TabItem value="win" label="Windows">
    内容...
  </TabItem>
</Tabs>
````

**问题**: React 组件在 MDX 中无法可靠渲染。

**正确做法**:
````mdx
---
title: 正确示例
---

<!-- 不需要 import 语句 -->

<div class="tabs-component" data-default-value="win">
  <!-- ... -->
</div>
````

### ❌ 错误 2: data-value 不匹配

````mdx
<div class="tabs-component" data-default-value="win">
  <div>
    <div data-value="windows" data-label="Windows"></div>  <!-- ❌ 应该是 "win" -->
  </div>
  <div>
    <div data-value="win">  <!-- ❌ 这里的 "win" 与上面不匹配 -->
      内容...
    </div>
  </div>
</div>
````

**问题**: 标签头的 `data-value` 必须与内容面板的 `data-value` 完全一致。

### ❌ 错误 3: 缺少必需属性

````mdx
<div class="tabs-component">  <!-- ❌ 缺少 data-default-value -->
  <div>
    <div data-label="Windows"></div>  <!-- ❌ 缺少 data-value -->
  </div>
  <div>
    <div>  <!-- ❌ 缺少 data-value -->
      内容...
    </div>
  </div>
</div>
````

### ❌ 错误 4: HTML 结构错误

````mdx
<div class="tabs-component" data-default-value="win">
  <!-- ❌ 缺少中间的 <div> 容器 -->
  <div data-value="win">
    内容...
  </div>
</div>
````

**问题**: 必须有两个嵌套的 `<div>` 容器，第一个用于标签头，第二个用于内容面板。

## 最佳实践

### 1. 使用语义化的标签值

```html
<!-- ✅ 好: 简洁、清晰 -->
<div data-value="win" data-label="Windows"></div>
<div data-value="mac" data-label="macOS"></div>
<div data-value="linux" data-label="Linux"></div>

<!-- ❌ 差: 冗长、不易维护 -->
<div data-value="windows-operating-system" data-label="Windows"></div>
```

### 2. 保持标签值的一致性

在文档中统一使用相同的标签值：
- Windows: `win`
- macOS: `mac`
- Linux: `linux`

### 3. 合理设置默认标签

选择最常用的平台作为默认标签：
- 如果面向全球用户，默认 `win`（Windows 用户最多）
- 如果面向开发者，默认 `mac` 或 `linux`（可能更合适）

### 4. 在内容中使用完整的 Markdown

内容面板内可以使用任何 Markdown 语法：
- 标题（`###`, `####`）
- 列表（有序、无序）
- 代码块（```` ```powershell` ````、```` ```bash` ````）
- 提示框（`:::tip`, `:::warning`）
- 链接、图片、表格

````mdx
<div data-value="win">
  ### Windows 安装步骤

  1. 下载安装程序
  2. 双击运行
  3. 按照提示完成安装

  ```powershell
  # 验证安装
  node --version
  ```

  :::tip
  建议使用 LTS 版本以获得更好的稳定性。
  :::

  [查看详细文档](/docs/windows-guide)
</div>
````

### 5. 添加适当的标题层级

在内容面板中使用 `###` 或 `####` 标题，避免使用 `##`（因为页面已经有主要标题）：

````mdx
## 安装指南  <!-- 页面主标题 -->

<div class="tabs-component" data-default-value="win">
  <div>
    <div data-value="win" data-label="Windows"></div>
    <div data-value="mac" data-label="macOS"></div>
  </div>
  <div>
    <div data-value="win">
      ### Windows 安装  <!-- ✅ 使用 ### -->
      ...
    </div>
    <div data-value="mac">
      ### macOS 安装  <!-- ✅ 使用 ### -->
      ...
    </div>
  </div>
</div>
````

## 测试检查清单

添加 Tabs 组件后，请验证：

- [ ] 开发服务器运行正常（`npm run dev`）
- [ ] 标签按钮可见且样式正确
- [ ] 点击标签可以切换内容
- [ ] 默认标签内容正确显示
- [ ] 键盘导航可用（Tab, ArrowLeft, ArrowRight, Home, End）
- [ ] 暗色模式下样式正确
- [ ] 移动端响应式布局良好
- [ ] 构建成功（`npm run build`）
- [ ] 类型检查通过（`npm run typecheck`）
- [ ] 浏览器控制台无错误

## 技术细节

### 初始化脚本位置

`src/components/Tabs.astro` 包含自动初始化脚本，会在页面加载时：
1. 查找所有 `.tabs-component` 元素
2. 读取 `data-*` 属性
3. 创建按钮元素
4. 绑定事件监听器
5. 显示默认内容面板

### 样式定义

Tabs 组件的样式在 `src/components/Tabs.astro` 的 `<style>` 块中定义：
- 使用 CSS custom properties（`--color-primary`, `--color-background` 等）
- 支持暗色模式（`[data-theme='dark']` 选择器）
- 响应式设计（`@media (max-width: 768px)`）
- 减少动画偏好（`@media (prefers-reduced-motion: reduce)`）

### 无障碍支持

- 标签按钮: `role="tab"`
- 内容面板: `role="tabpanel"`
- 状态: `aria-selected="true/false"`
- 关联: `aria-controls`, `aria-labelledby`
- 键盘导航: Tab, ArrowLeft, ArrowRight, Home, End, Enter, Space

## 参考资源

- **项目规范**: `openspec/specs/astro-site/spec.md`
- **组件源码**: `src/components/Tabs.astro`
- **相关变更**: `openspec/changes/astro-docs-tabs-component-fix/`
- **历史调研**: `openspec/changes/archive/2026-01-30-astro-tabs-component-migration/`

## 需要帮助？

如果遇到问题：
1. 检查浏览器控制台是否有 JavaScript 错误
2. 验证 HTML 结构是否符合模板
3. 确认所有 `data-*` 属性正确且一致
4. 查看 `src/components/Tabs.astro` 脚本是否加载
5. 参考 `setup-openspec.md` 中的工作示例

---

**最后更新**: 2026-01-30
**版本**: 1.0
