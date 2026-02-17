# Change: 为产品概述文档添加AI生成配图

## Why

产品概述文档 (`apps/docs/src/content/docs/product-overview.md`) 目前包含大量文字内容和少量 Mermaid 图表，但缺乏视觉化的配图来增强内容的表现力和用户理解。文档中的核心概念（如"提案驱动开发"、"只读/编辑双模式"等）较为抽象，用户难以通过纯文字快速建立直观认知。同时，现有的视觉元素缺乏统一的风格体系，无法形成独特的品牌识别度。

项目已具备 AI 图片生成基础设施（`scripts/generate-image.sh` 和 `scripts/image-base-prompt.json`），可以通过统一的基底提示词系统生成风格一致的配图，解决上述问题。

## What Changes

- **新增**: 为产品概述文档的关键章节添加 AI 生成的配图（共 12 张）
  - 价值主张章节：4 张示意图（提案驱动开发、双模式会话、AI 辅助编码、自举特性）
  - 产品定位章节：1 张竞品对比图
  - 自举证明章节：3 张流程图（文档系统自举、仓库管理自举、持续迭代自举）
  - 核心特性详解：1 张三层架构总览图
  - 真实使用故事：3 张场景插图

- **新增**: 配图提示词配置管理体系
  - 为每张配图创建独立的提示词配置文件 (`prompt.json`)
  - 目录结构：`apps/docs/src/content/docs/img/product-overview/<主题>/prompt.json`
  - 配置文件包含：基底提示词、上下文类型、自定义提示词、生成参数、版本信息

- **新增**: 便捷的批量生成脚本
  - 支持从 JSON 配置文件批量生成图片
  - 支持保存和加载提示词配置
  - 添加 npm 脚本：`generate:product-images` 和 `regenerate:product-images`

- **修改**: `scripts/generate-image.sh`
  - 添加 `--batch-config <file>` 参数：从 JSON 配置文件批量生成图片
  - 添加 `--save-prompt <path>` 参数：保存完整提示词配置到指定路径
  - 添加 `--load-prompt <path>` 参数：加载提示词配置并重新生成

- **修改**: `package.json`
  - 添加 `npm run generate:product-images` 批量生成所有配图
  - 添加 `npm run regenerate:product-images` 基于现有配置重新生成

## Impact

### Affected Specs

- **build-scripts** - 图片生成脚本功能的扩展

### Affected Code

- **新增**: `apps/docs/src/content/docs/img/product-overview/*/` - 配图和提示词配置目录
- **修改**: `apps/docs/src/content/docs/product-overview.md` - 添加配图引用
- **修改**: `scripts/generate-image.sh` - 添加批量生成和配置保存功能
- **修改**: `package.json` - 添加便捷脚本命令

### Expected Benefits

1. **提升阅读体验** - 视觉化元素缓解文字密度，降低阅读疲劳
2. **增强概念理解** - 抽象概念通过图片具象化，降低认知门槛
3. **强化品牌识别** - 统一的视觉风格建立独特的品牌印象
4. **提高文档转化率** - 丰富的视觉内容吸引用户注意力，提高留存率
5. **可维护的图片资产** - 提示词配置文件实现图片的可追溯和可更新

## UI Design Changes

### 配图布局示例

在产品概述文档中，配图将采用以下布局方式：

```
## 为什么选择 Hagicode?

### 你是否在开发过程中发现 AI 自主混乱的操作?

**Hagicode 的解决方案:提案驱动开发**

Hagicode 的**提案会话模式**将抽象想法转化为结构化的实施计划...

![提案驱动开发示意图](./img/product-overview/value-proposition-proposal-driven/illustration.png)

> "从想法到代码的规范路径,让每一次变更都可追溯、可审查、可复用。"
```

### 配图尺寸和样式

- **尺寸**: 1024x1024 (默认) 或 1792x1024 (宽图)
- **格式**: PNG
- **质量**: high
- **风格**: 统一使用 `scripts/image-base-prompt.json` 定义的基底提示词

## Open Questions

1. **配图数量和位置** - 是否需要调整配图的数量或位置？
2. **视觉风格偏好** - 基底提示词是否需要调整以更好地反映品牌调性？
3. **生成优先级** - 是否需要先为特定章节生成配图，还是一次性完成所有配图？
