# Proposal: 统一 AI 生成图片为儿童手绘风格

## Overview

**变更 ID**: `ai-image-children-hand-drawing-style-ai`

**状态**: Proposal

**创建日期**: 2026-02-17

**负责人**: TBD

**类型**: 视觉风格调整

## Summary

将 Hagicode 文档站点和营销网站中所有 AI 生成图片的视觉风格统一为**儿童手绘风格**（children's hand-drawing style），以提升品牌友好性、改善文档阅读体验，并建立更一致的视觉识别度。

## Background

当前 Hagicode 项目使用 AI 生成图片服务于多个场景：

- **技术文档站点** (`apps/docs/`) - 用户指南和教程插图
- **营销网站** (`apps/website/`) - 产品展示和功能介绍
- **博客文章** - 技术内容插图

现有图片生成系统使用通用的基底提示词 (`scripts/image-base-prompt.json`)，描述为"Professional modern tech illustration with clean lines, minimalist design..."，产生的是专业的技术插图风格。

### 现状问题

1. **风格不一致**：当前图片风格在不同场景下缺乏统一性
2. **阅读体验**：过于复杂或精细的插图可能分散用户注意力
3. **品牌定位**：Hagicode 的友好、易读定位需要更轻松的视觉风格支持

## Motivation

### 为什么需要这个变更？

1. **品牌一致性**：统一的儿童手绘风格将增强 Hagicode 的友好形象
2. **可读性提升**：简化插图降低视觉复杂度，帮助用户专注于内容理解
3. **情感连接**：轻松的插画风格提升用户的情感舒适度，尤其适合新手用户

### 为什么选择儿童手绘风格？

- 与 Hagicode "让编程变得友好易读"的使命一致
- 降低技术内容的门槛感
- 在保持信息完整性的同时提供更温暖的视觉体验
- 与当前开发者工具市场普遍的"冷峻科技风"形成差异化

## Goals

- [ ] 更新全局基底提示词配置为儿童手绘风格
- [ ] 确保所有产品描述文档中的提示词与新风格兼容
- [ ] 验证新风格生成的图片质量和可读性
- [ ] 保持内容完整性和技术准确性

## Non-Goals

- 不改变图片生成的技术实现方式
- 不调整图片尺寸、格式等技术参数
- 不改变现有图片的组织结构和命名规范

## Proposed Solution

### 核心变更

修改 `scripts/image-base-prompt.json` 中的基底提示词，将风格从"专业现代科技插图"改为"儿童手绘风格"。

### 新基底提示词

```json
{
  "basePrompt": "Children's hand-drawing style illustration with crayon or colored pencil texture. Use simple, playful lines with a friendly and educational aesthetic. Incorporate bright, cheerful colors that maintain good contrast for accessibility. Keep technical concepts clear while presenting them in an approachable, non-intimidating way. Style should feel like a warm classroom illustration that makes technology feel friendly and accessible to newcomers."
}
```

### 上下文提示词调整

同时更新所有上下文提示词以匹配新风格：

- `session-management` - 强调简单流程图和友好的时间线
- `api-integration` - 使用轻松的连接示意图
- `code-generation` - 简化的代码元素和算法可视化
- `desktop-app` - 干净但亲切的界面展示
- `web-app` - 轻松的跨平台兼容性图示
- `brand-marketing` - 友好的品牌视觉元素

### 产品描述文档提示词

`scripts/product-images-batch.json` 中定义的 12 张产品概述插图提示词需要调整，因为：

1. 现有提示词包含与儿童手绘风格冲突的描述术语
2. 需要移除过于专业/技术化的视觉描述
3. 简化复杂几何描述，使用更友好的比喻

## Implementation Plan

详细的实施步骤请参阅 [tasks.md](./tasks.md)。

## Impact Assessment

### 预期收益

| 收益 | 描述 |
|------|------|
| 品牌一致性 | 统一的视觉风格增强 Hagicode 的友好形象 |
| 可读性提升 | 儿童手绘风格降低视觉复杂度，帮助用户专注于内容理解 |
| 情感连接 | 轻松的插画风格提升用户的情感舒适度，尤其适合新手用户 |
| 差异化 | 与其他开发者工具的"冷峻科技风"形成差异化 |

### 潜在风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 专业度感知 | 部分用户可能认为手绘风格不够专业 | 通过内容质量和技术准确性证明专业度 |
| 技术准确性 | 简化的插图可能影响技术概念的精确传达 | 确保关键细节在简化后仍然清晰可辨 |
| 用户接受度 | 现有用户可能不习惯风格变化 | 逐步推广，收集反馈后调整 |

### 受影响组件

- `scripts/image-base-prompt.json` - 基底提示词配置（必需修改）
- `scripts/product-images-batch.json` - 批量配置（需要调整提示词）
- `scripts/generate-image.sh` - 生成脚本（无需修改）
- `apps/docs/src/content/docs/img/product-overview/*/` - 现有图片（需要重新生成）

## Alternatives Considered

### 选项 1：保持当前风格

**优点**：
- 无需任何变更
- 已建立的用户认知

**缺点**：
- 无法解决品牌一致性问题
- 错失差异化机会

**选择原因**：不符合项目发展的需要

### 选项 2：部分使用新风格

**优点**：
- 降低变更风险
- 可以 A/B 测试效果

**缺点**：
- 风格不一致问题仍然存在
- 增加维护复杂度

**选择原因**：与统一风格的目标相悖

### 选项 3：完全采用新风格（本提案）

**优点**：
- 彻底解决一致性问题
- 最大化品牌差异化效果

**缺点**：
- 需要重新生成所有图片
- 用户需要适应期

**选择原因**：最符合长期战略目标

## Success Criteria

- [ ] 所有 AI 生成的图片采用统一的儿童手绘风格
- [ ] 图片色彩对比度符合 WCAG AA 标准
- [ ] 技术概念在新风格下仍然清晰可辨
- [ ] 文档构建和图片生成流程正常工作
- [ ] 现有提示词配置无需修改即可正常工作

## Open Questions

1. **是否需要为不同场景（文档 vs 营销）设置不同风格？**
   - 建议：先统一风格，根据反馈再考虑细分

2. **新风格是否会影响图片的可访问性？**
   - 建议：在生成后验证色彩对比度

3. **是否需要保留旧风格的图片？**
   - 建议：在 git 历史中保留，不需要单独存档

## Timeline Estimate

| 阶段 | 预估工作量 |
|------|-----------|
| 配置更新 | 1 小时 |
| 提示词调整 | 0.5 小时 |
| 图片重新生成 | 1-2 小时（受 API 速度影响） |
| 验证和调整 | 1 小时 |
| **总计** | **3.5-4.5 小时** |

## References

- 现有基底提示词配置：`scripts/image-base-prompt.json`
- 图片生成脚本：`scripts/generate-image.sh`
- 批量配置：`scripts/product-images-batch.json`
- 相关提案：`openspec/changes/archive/2026-02-17-product-overview-ai-illustrations/`
