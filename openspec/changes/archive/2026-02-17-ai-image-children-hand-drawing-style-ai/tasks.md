# Tasks: 统一 AI 生成图片为儿童手绘风格

**关联提案**: [proposal.md](./proposal.md)

**变更 ID**: `ai-image-children-hand-drawing-style-ai`

---

## Phase 1: 配置更新

### Task 1.1: 更新基底提示词配置

**文件**: `scripts/image-base-prompt.json`

**操作**:
1. 更新 `basePrompt` 字段为儿童手绘风格描述
2. 更新所有 `contexts` 中的上下文提示词以匹配新风格
3. 保持 `defaultEnabled` 为 `true`

**新 basePrompt 内容**:
```
Children's hand-drawing style illustration with crayon or colored pencil texture.
Use simple, playful lines with a friendly and educational aesthetic. Incorporate
bright, cheerful colors that maintain good contrast for accessibility. Keep technical
concepts clear while presenting them in an approachable, non-intimidating way. Style
should feel like a warm classroom illustration that makes technology feel friendly
and accessible to newcomers.
```

**新 contexts 内容**:
```json
{
  "session-management": "Show session lifecycle as a simple, colorful flowchart with hand-drawn arrows and friendly icons. Use cheerful colors to represent continuity, persistence, and smooth user experience in a classroom doodle style.",
  "api-integration": "Illustrate connectivity with playful dotted lines and cute icons connecting to each other. Keep it simple like a child's drawing of how things connect, with clear but friendly visual metaphors for data exchange.",
  "code-generation": "Highlight code creation with simplified code blocks drawn in crayon style. Include hand-drawn elements like lightbulbs for ideas and checkmarks for completed tasks, keeping technical concepts accessible and fun.",
  "desktop-app": "Showcase desktop interfaces with simple, rounded window frames and friendly UI elements drawn in colored pencil. Emphasize productivity tools in a warm, approachable way that feels like a helpful study companion.",
  "web-app": "Feature web application design with simple browser windows and playful icons representing online features. Keep layouts clean and friendly, like a well-organized notebook doodle.",
  "brand-marketing": "Elevate brand presence with cheerful, hand-drawn style visuals that maintain professionalism while feeling warm and welcoming. Focus on memorability through friendly aesthetic choices."
}
```

**验证标准**:
- [ ] JSON 格式正确
- [ ] 所有提示词体现儿童手绘风格
- [ ] 提示词长度合理（不超过 4000 字符）

---

### Task 1.2: 调整产品概述图片提示词

**文件**: `scripts/product-images-batch.json`

**背景**:
现有提示词包含与儿童手绘风格冲突的描述术语，如：
- "clean flowchart style" → 过于技术化
- "split-screen illustration" → 几何描述不适合手绘风格
- "layered diagram with clear visual hierarchy" → 过于复杂
- "comparison chart" → 太正式

**操作**:
调整每个图片的 `prompt` 和 `customPrompt` 字段，移除冲突术语，替换为儿童手绘风格友好的描述。

**调整原则**:
1. 移除精确几何描述（split-screen, pyramid, layered）
2. 移除专业/技术术语（flowchart, diagram, chart）
3. 添加友好性描述（simple, playful, cute, friendly）
4. 使用儿童友好的比喻（notebook doodle, classroom drawing）

**具体调整**:

| 图片名称 | 原描述冲突 | 新描述建议 |
|---------|-----------|-----------|
| value-proposition-proposal-driven | "clean flowchart style" | "simple hand-drawn flow with doodle arrows" |
| value-proposition-dual-mode | "split-screen illustration" | "side-by-side drawing with simple divider" |
| positioning-competitive-comparison | "comparison chart" | "friendly comparison doodle like notebook notes" |
| core-features-architecture | "layered diagram", "pyramid" | "simple stacked drawing with connected elements" |

**完整调整后的示例**:
```json
{
  "name": "value-proposition-proposal-driven",
  "prompt": "A hand-drawn doodle showing the proposal-driven development workflow. Show the journey from idea to plan with simple crayon-style elements: a lightbulb for ideas, a document with checkmarks for tasks, and friendly arrows showing progress. Like a classroom notebook illustration.",
  "context": "code-generation",
  "customPrompt": "Include playful task lists and verification checkmarks drawn in colored pencil style.",
  "output": "apps/docs/src/content/docs/img/product-overview/value-proposition-proposal-driven/illustration.png",
  "saveConfig": "apps/docs/src/content/docs/img/product-overview/value-proposition-proposal-driven/prompt.json",
  "size": "1024x1024",
  "quality": "high",
  "format": "png"
}
```

**验证标准**:
- [ ] JSON 格式正确
- [ ] 所有 12 张图片的提示词已调整
- [ ] 移除了与手绘风格冲突的术语
- [ ] 保留了原有的内容语义

---

## Phase 2: 图片重新生成

### Task 2.1: 备份现有图片（可选）

**操作**:
1. 确认现有图片已提交到 git（历史记录中）
2. 如需额外备份，可创建临时分支保存

**验证标准**:
- [ ] git 状态显示无未提交的图片变更

---

### Task 2.2: 重新生成产品概述图片

**命令**:
```bash
npm run regenerate:product-images
```

**说明**:
- 此命令会读取 `scripts/product-images-batch.json`
- 使用更新后的基底提示词生成所有 12 张产品概述插图
- 自动覆盖现有图片文件

**预期输出**:
```
Processing batch configuration from: scripts/product-images-batch.json
Found 12 images to generate...
==========================================
Processing image 1 of 12
==========================================
Generating: value-proposition-proposal-driven
Output: apps/docs/src/content/docs/img/product-overview/value-proposition-proposal-driven/illustration.png
✓ Image generated successfully: ...
...
==========================================
Batch generation complete
==========================================
Success: 12/12
Failed: 0/12
```

**验证标准**:
- [ ] 所有 12 张图片成功生成
- [ ] 生成的图片呈现儿童手绘风格
- [ ] 图片文件大小合理（非空）

---

### Task 2.3: 验证新风格图片质量

**操作**:
1. 人工检查每张生成的图片
2. 确认以下方面：
   - 儿童手绘风格明显
   - 色彩对比度足够（符合可访问性标准）
   - 技术概念仍然清晰可辨
   - 没有明显的生成错误或扭曲

**检查清单**:
- [ ] `value-proposition-proposal-driven/illustration.png`
- [ ] `value-proposition-dual-mode/illustration.png`
- [ ] `value-proposition-ai-assisted-coding/illustration.png`
- [ ] `value-proposition-self-bootstrapping/illustration.png`
- [ ] `positioning-competitive-comparison/illustration.png`
- [ ] `self-bootstrapping-documentation/illustration.png`
- [ ] `self-bootstrapping-repository/illustration.png`
- [ ] `self-bootstrapping-iteration/illustration.png`
- [ ] `core-features-architecture/illustration.png`
- [ ] `story-newcomer-onboarding/illustration.png`
- [ ] `story-complex-change/illustration.png`
- [ ] `story-team-knowledge/illustration.png`

---

## Phase 3: 验证和测试

### Task 3.1: 本地构建验证

**命令**:
```bash
npm run build
```

**验证标准**:
- [ ] 构建成功完成
- [ ] 无 TypeScript 类型错误
- [ ] 图片资源正确加载

---

### Task 3.2: 本地预览检查

**命令**:
```bash
npm run dev
```

**操作**:
1. 访问本地开发服务器
2. 导航到产品概述页面
3. 确认图片显示正常

**验证标准**:
- [ ] 所有图片正确显示
- [ ] 图片风格一致
- [ ] 页面布局未受影响

---

### Task 3.3: 色彩对比度验证

**操作**:
1. 使用浏览器开发工具检查关键图片
2. 确保重要元素与背景的对比度符合 WCAG AA 标准（至少 4.5:1）

**验证标准**:
- [ ] 主要视觉元素对比度足够
- [ ] 文字/图标清晰可辨

---

## Phase 4: 文档和收尾

### Task 4.1: 更新提示词配置注释

**文件**: `scripts/image-base-prompt.json`

**操作**:
1. 更新 `_comment` 字段以反映新风格
2. 确保注释准确描述当前配置

**验证标准**:
- [ ] 注释与实际配置一致

---

### Task 4.2: 提交变更

**命令**:
```bash
git add scripts/image-base-prompt.json
git add apps/docs/src/content/docs/img/product-overview/*/illustration.png
git commit -m "feat: update AI image style to children's hand-drawing style

- Update base prompt in image-base-prompt.json to children's hand-drawing style
- Update all context prompts to match new friendly aesthetic
- Regenerate all 12 product overview illustrations with new style
- Maintain technical clarity while improving brand friendliness"
```

**验证标准**:
- [ ] 变更已提交
- [ ] 提交信息清晰描述变更内容

---

## Task Dependencies

```
Phase 1 (配置更新)
    ├── Task 1.1: 更新基底提示词配置
    └── Task 1.2: 调整产品概述图片提示词
            ↓
Phase 2 (图片重新生成)
    ↓
Phase 3 (验证和测试)
    ↓
Phase 4 (文档和收尾)
```

**关键依赖**:
- Task 1.2 必须在 Task 1.1 完成后执行（保持配置一致性）
- Task 2.2 必须在 Task 1.1 和 1.2 完成后执行
- Task 3.1 和 3.2 必须在 Task 2.2 完成后执行
- Task 4.2 必须在所有验证任务完成后执行

---

## 风险和缓解

| 风险 | 缓解措施 |
|------|----------|
| API 生成失败 | 检查 API 配额和密钥，必要时重试 |
| 图片质量不达标 | 调整提示词并重新生成 |
| 构建失败 | 检查图片文件完整性，确保文件格式正确 |

---

## 完成标准

当满足以下条件时，此任务列表视为完成：

1. [ ] 所有配置文件已更新
2. [ ] 所有产品概述图片已重新生成并采用新风格
3. [ ] 本地构建和预览验证通过
4. [ ] 变更已提交到版本控制
5. [ ] 相关文档（如需要）已更新
