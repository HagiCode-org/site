# Tabs 组件使用指南

由于 Astro + MDX 的限制,我们无法直接在 MDX 文件中使用 Astro 组件。因此,需要使用以下几种替代方案之一。

## 方案 1: 使用原始 HTML (推荐)

直接在 MDX 文件中编写 HTML 结构:

```html
<div class="tabs-component" data-default-value="win">
  <div>
    <div data-value="win" data-label="Windows" style="display: none;"></div>
    <div data-value="mac" data-label="macOS" style="display: none;"></div>
    <div data-value="linux" data-label="Linux" style="display: none;"></div>
  </div>
  <div>
    <div data-value="win">
      Windows 安装步骤:

```powershell
npm install -g @fission-ai/openspec@0.23.0
```

    </div>
    <div data-value="mac">
      macOS 安装步骤:

```bash
npm install -g @fission-ai/openspec@0.23.0
```

    </div>
    <div data-value="linux">
      Linux 安装步骤:

```bash
npm install -g @fission-ai/openspec@0.23.0
```

    </div>
  </div>
</div>
```

## 方案 2: 使用 React 组件

创建一个 React 版本的 Tabs 组件,然后在 MDX 中导入使用:

```jsx
import { Tabs, TabItem } from '@/components/TabsJSX';

<Tabs defaultValue="win">
  <TabItem value="win" label="Windows">
    Windows 内容
  </TabItem>
  <TabItem value="mac" label="macOS">
    macOS 内容
  </TabItem>
</Tabs>
```

## 方案 3: 使用 details/summary (最简单)

如果不介意交互方式,可以使用原生的 HTML 折叠块:

```html
<details>
  <summary>Windows</summary>
  Windows 内容
</details>

<details>
  <summary>macOS</summary>
  macOS 内容
</details>

<details>
  <summary>Linux</summary>
  Linux 内容
</details>
```

## 当前推荐方案

鉴于技术限制,**方案 1 (原始 HTML)** 是最可靠的选择。我们可以在后续优化中创建更好的开发体验。
