# Change: 在 Hagicode 文档站点添加备案信息展示

**Status**: ExecutionCompleted

## Why

Hagicode 文档站点已部署到 GitHub Pages,需要符合中国大陆的网站备案法规要求。根据相关规定,中国大陆的网站必须在页面底部显著位置展示 ICP 备案号。当前站点的首页和文档页面 Footer 组件中均未显示备案信息,存在合规性风险。

## What Changes

- **首页 Footer 更新** (`src/components/home/Footer.tsx`):
  - 在现有版权信息下方添加备案信息展示区块
  - 备案号: `闽ICP备2026004153号-1`
  - 添加指向工业和信息化部备案查询系统的链接 (https://beian.miit.gov.cn/)
  - 使用语义化的 HTML 结构和适当的 ARIA 标签

- **Starlight 文档页面 Footer 更新** (`src/components/StarlightFooter.astro`):
  - 利用 Starlight 的 slot 机制在官方 Footer 基础上添加备案信息
  - 确保备案信息在所有文档页面底部统一显示
  - 保持与 Starlight 主题视觉风格的一致性

- **样式调整**:
  - 首页: 更新 `src/components/home/Footer.module.css`
  - 文档页: 创建专用的备案信息样式类,使用 CSS 变量以支持主题切换
  - 确保在深色/浅色/农历新年主题下均保持良好的可读性
  - 遵循现有的 CSS 自定义属性约定

## UI Design Changes

```
┌─────────────────────────────────────────────────────────┐
│                    Footer (首页)                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  © 2025 Hagicode. All rights reserved.                 │
│                                                         │
│  [文档] [博客] [GitHub]                                │
│                                                         │
│  [GitHub Icon]                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  新增: 备案信息区块                                    │
│                                                         │
│  闽ICP备2026004153号-1                                 │
│  (链接到 https://beian.miit.gov.cn/)                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**视觉设计规范**:
- 字体大小: 0.875rem (14px)
- 文字颜色: 使用现有 CSS 变量 `--sl-color-gray-3` (次要文本颜色)
- 悬停效果: 继承现有链接样式,下划线显示
- 间距: 顶部 margin 为 1rem,与版权区块保持一致
- 对齐方式: 居中对齐,与 Footer 整体布局一致

## Impact

- **Affected specs**: `site-compliance`
- **Affected code**:
  - `src/components/home/Footer.tsx` - 添加备案信息展示区块
  - `src/components/home/Footer.module.css` - 添加备案信息样式
  - `src/components/StarlightFooter.astro` - 利用 slot 添加备案信息
  - `src/styles/starlight-override.css` - 添加文档页面备案信息样式 (如需要)

- **Testing requirements**:
  - 本地验证: 使用 `npm run dev` 在首页和文档页面检查显示效果
  - 构建验证: 使用 `npm run build` 确保构建成功
  - 主题切换: 验证在深色/浅色/农历新年主题下的样式一致性
  - 链接验证: 确保备案号链接正确指向 https://beian.miit.gov.cn/
  - 响应式测试: 在移动端和桌面端验证布局正确性

## Migration Plan

无需数据迁移。部署后立即生效。

## Compliance Note

此变更确保 Hagicode 文档站点符合中国大陆网站备案法规要求:
- 《互联网信息服务管理办法》规定,经营性网站必须办理 ICP 备案
- 备案信息必须在网站首页底部显著位置展示
- 备案号必须可链接至工信部备案系统供公众查询
