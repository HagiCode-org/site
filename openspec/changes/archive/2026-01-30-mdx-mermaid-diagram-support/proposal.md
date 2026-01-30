# Change: MDX 中启用 Mermaid 图表支持

## Why

项目已从 Docusaurus 3.x 迁移至 Astro 5.x,当前使用 **@astrojs/starlight** 作为文档框架。虽然项目技术栈中已安装 **mermaid** (v11.12.2) 作为依赖,并且已通过 `StarlightWrapper.astro` 和自定义脚本实现了 Markdown 文件中的 Mermaid 渲染,但在 MDX 文件中 Mermaid 图表渲染功能尚未完全验证和标准化。

项目约定中明确要求使用 Mermaid 绘制需要版本控制和主题支持的技术图表(流程图、状态图、序列图等),并限制图表复杂度(建议节点数不超过 20 个)。当前存在以下限制:

- 无法在技术文档中直接嵌入 Mermaid 代码块(特别是在 MDX 内容中)
- 需要使用静态图片替代可维护的图表代码
- 无法享受 Mermaid 与 Astro 主题系统的集成优势
- 降低技术文档的可维护性和版本控制友好性

## What Changes

### 1. 配置验证和优化

- 验证当前 Mermaid 渲染脚本在 Starlight 环境中的兼容性
- 优化 `mermaid-renderer.astro` 脚本以支持动态主题切换
- 确保脚本正确处理 Mermaid 代码块的渲染和错误处理

### 2. MDX 兼容性增强

- 验证 Mermaid 渲染在 MDX 文件中的正常工作
- 确保与 Starlight 的 Markdown/MDX 处理管道兼容
- 测试 Mermaid 代码块在 `.md` 和 `.mdx` 文件中的一致性

### 3. 文档约定和最佳实践

- 更新项目约定以明确 MDX 中 Mermaid 的使用规范
- 提供完整的 Mermaid 图表使用指南
- 创建示例文档展示各种图表类型(流程图、序列图、状态图等)

### 4. 测试验证

- 在示例文档中测试常见 Mermaid 图表类型的渲染效果
- 验证主题切换时的图表颜色适配
- 确保图表在移动端和桌面端的响应式显示

### 5. 性能优化

- 评估 Mermaid 渲染对构建性能的影响
- 优化图表加载和渲染策略
- 确保符合 Lighthouse 性能标准(> 90 分)

## Impact

### 影响的规格

- `astro-site` - 更新 Mermaid 图表支持需求,增强 MDX 兼容性要求

### 影响的文件/目录

**修改文件**:
- `src/scripts/mermaid-renderer.astro` - 优化 Mermaid 渲染逻辑
- `src/components/StarlightWrapper.astro` - 验证集成方式
- `openspec/project.md` - 更新 Mermaid 使用约定

**新增文件**:
- `src/content/docs/examples/mermaid-diagrams.md` - Mermaid 图表示例文档
- 可选: `src/content/docs/guides/mermaid-best-practices.md` - Mermaid 最佳实践指南

**配置文件**:
- `astro.config.mjs` - 可能需要调整 Markdown 配置

### 预期成果

- 用户能够在 MDX 文件中直接使用 Mermaid 代码块绘制技术图表
- 统一 Markdown 和 MDX 内容的图表绘制方式
- 改善文档编辑体验(无需生成静态图片)
- 与现有 Astro Mermaid 集成保持一致
- 图表自动适配明暗主题切换
- 提升技术文档的可维护性和版本控制友好性

### 风险控制

- 需验证构建性能影响(Mermaid 渲染可能增加构建时间)
- 确保图表在暗色主题下的可读性
- 限制图表复杂度以避免渲染问题
- 确保错误处理和降级方案正常工作

## Status

**ExecutionCompleted** (已完成)
