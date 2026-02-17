# 配图管理指南

本文档说明如何为 Hagicode 文档生成和管理 AI 配图。

## 目录结构

```
apps/docs/src/content/docs/img/product-overview/
├── value-proposition-proposal-driven/
│   ├── illustration.png
│   └── prompt.json
├── value-proposition-dual-mode/
│   ├── illustration.png
│   └── prompt.json
└── ...
```

每个配图都有自己的目录,包含:
- `illustration.png` - 生成的配图
- `prompt.json` - 提示词配置文件

## 生成配图

### 批量生成所有配图

```bash
npm run generate:product-images
```

### 重新生成所有配图

```bash
npm run regenerate:product-images
```

### 单独生成一张配图

```bash
# 使用提示词配置
bash scripts/generate-image.sh --load-prompt apps/docs/src/content/docs/img/product-overview/value-proposition-proposal-driven/prompt.json --output apps/docs/src/content/docs/img/product-overview/value-proposition-proposal-driven/illustration.png

# 或使用自定义参数
bash scripts/generate-image.sh \
  --prompt "你的提示词" \
  --context code-generation \
  --output apps/docs/src/content/docs/img/product-overview/custom/illustration.png \
  --save-prompt apps/docs/src/content/docs/img/product-overview/custom/prompt.json
```

## 提示词配置格式

`prompt.json` 文件包含完整的提示词配置:

```json
{
  "_comment": "Image generation prompt configuration",
  "basePrompt": "基底提示词,定义统一视觉风格",
  "context": "上下文类型(如 code-generation)",
  "customPrompt": "自定义提示词增强",
  "userPrompt": "用户主要提示词",
  "generationParams": {
    "size": "1024x1024",
    "quality": "high",
    "format": "png"
  },
  "_metadata": {
    "generatedAt": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

## 批量配置文件

批量生成配置位于 `scripts/product-images-batch.json`,包含所有配图的配置:

```json
{
  "_comment": "Batch configuration for generating product overview illustrations",
  "images": [
    {
      "name": "配图名称",
      "prompt": "主要提示词",
      "context": "上下文类型",
      "customPrompt": "自定义提示词",
      "output": "输出路径",
      "saveConfig": "配置保存路径",
      "size": "1024x1024",
      "quality": "high",
      "format": "png"
    }
  ]
}
```

## 在文档中引用配图

在 Markdown 文档中使用相对路径引用配图:

```markdown
![配图说明](./img/product-overview/value-proposition-proposal-driven/illustration.png)
```

## 视觉风格规范

所有配图应遵循以下规范:

- **尺寸**: 1024x1024 (默认) 或 1792x1024 (宽图)
- **格式**: PNG
- **质量**: high
- **风格**: 使用 `scripts/image-base-prompt.json` 定义的基底提示词

### 可用上下文类型

- `session-management` - 会话生命周期可视化
- `api-integration` - API 集成和数据交换
- `code-generation` - 代码创建和 AI 辅助开发
- `desktop-app` - 桌面应用界面
- `web-app` - Web 应用设计
- `brand-marketing` - 品牌营销和推广

## 维护指南

### 更新现有配图

1. 修改对应的提示词配置
2. 重新生成配图
3. 验证配图在文档中的显示效果

### 添加新配图

1. 在 `scripts/product-images-batch.json` 中添加新配置
2. 创建对应的目录结构
3. 生成配图
4. 在文档中添加引用

### 审查流程

- 确保配图与上下文相关
- 验证视觉风格一致性
- 检查配图在不同主题下的显示效果
- 确认配图加载性能

## 环境配置

生成配图需要配置以下环境变量 (在 `.env` 文件中):

```bash
AZURE_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_API_KEY=your-api-key
```

## 工具说明

### generate-image.sh 参数

```
--prompt <text>       图片描述提示词
--output <path>       输出文件路径
--size <size>         图片尺寸 (1024x1024, 1792x1024, 1024x1792)
--quality <qual>      图片质量 (low, medium, high, auto)
--format <fmt>        输出格式 (png, jpeg)
--use-base-prompt     启用基底提示词
--no-base-prompt      禁用基底提示词
--context <type>      上下文类型
--custom-prompt <txt> 自定义提示词
--save-prompt <path>  保存提示词配置
--load-prompt <path>  加载提示词配置
--batch-config <file> 批量生成配置文件
--verbose             详细日志
--help                显示帮助信息
```

## 故障排查

### 配图未显示

- 检查文件路径是否正确
- 确认文件已生成
- 验证文件权限

### 生成失败

- 检查 API 凭据是否正确
- 验证网络连接
- 查看 API 配额

### 风格不一致

- 确认使用了基底提示词
- 检查上下文类型设置
- 验证自定义提示词影响

## 最佳实践

1. **始终保存提示词配置** - 便于后续更新和重现
2. **使用批量生成** - 提高效率,确保一致性
3. **定期审查** - 确保配图与文档内容保持同步
4. **版本控制** - 将提示词配置纳入版本管理
5. **性能优化** - 根据需要选择合适的图片质量和尺寸
