# Change: 将 Docusaurus Tabs 组件迁移到 Astro

## Why

当前 OpenSpec 文档 (`/docs/related-software-installation/openspec/setup-openspec.md`) 中使用了 Docusaurus 3.x 风格的 Tabs 组件导入语法 (`@theme/Tabs`, `@theme/TabItem`)。在 2026-01-29 迁移到 Astro 5.x 后,这种语法不再有效,导致:

1. **功能失效**: Tabs 组件无法渲染,用户看不到平台切换的 UI 效果
2. **架构冲突**: Astro + MDX 环境中不存在 `@theme/` 别名路径
3. **用户体验下降**: 所有平台的代码块可能同时显示,降低文档可读性

需要创建与 Astro + MDX 兼容的 Tabs 组件,恢复文档的多平台展示功能。

## What Changes

### 组件开发
- **ADDED**: 创建 `src/components/Tabs.astro` 组件,实现选项卡切换功能
- **ADDED**: 创建 `src/components/TabItem.astro` 子组件,表示单个选项卡
- **ADDED**: 使用 Astro 客户端指令 (`client:load` 或 `client:visible`) 实现交互
- **ADDED**: 支持常用 props: `defaultValue`, `values`, `groupId`, `label`, `value`

### 文档更新
- **MODIFIED**: 更新 `/docs/related-software-installation/openspec/setup-openspec.md` 中的 Tabs 导入语法
- **MODIFIED**: 将 `import Tabs from '@theme/Tabs'` 改为 `import Tabs from '@/components/Tabs'`
- **MODIFIED**: 将 `import TabItem from '@theme/TabItem'` 改为 `import TabItem from '@/components/TabItem'`

### 样式适配
- **ADDED**: 为 Tabs 组件添加符合项目主题的样式 (使用 CSS 变量)
- **ADDED**: 确保暗色模式兼容性
- **ADDED**: 响应式布局支持 (移动端适配)

### 构建验证
- 验证 `npm run build` 无错误
- 验证 `npm run typecheck` 类型检查通过
- 测试 Tabs 组件在开发服务器中的交互功能

## Impact

### Affected Specs
- `astro-site` - 添加 Tabs 组件支持需求

### Affected Code
- `src/components/Tabs.astro` - **ADDED** (新文件)
- `src/components/TabItem.astro` - **ADDED** (新文件)
- `docs/related-software-installation/openspec/setup-openspec.md` - **MODIFIED** (更新导入语法)

### Expected Benefits
- **功能恢复**: OpenSpec 文档中的平台切换 UI 正常显示
- **用户体验改善**: 用户可以方便地切换查看不同平台的安装步骤
- **架构对齐**: 移除遗留的 Docusaurus 依赖语法,与 Astro 架构保持一致
- **可复用性**: 新的 Tabs 组件可用于其他文档页面
- **性能优化**: 使用 Astro 按需水合策略,最小化 JS 体积

### Risks & Mitigations
- **组件兼容性**: 确保组件在所有文档页面中正常工作 → 先在单个页面测试,确认无问题后再推广
- **移动端体验**: 验证触摸交互体验 → 添加响应式样式,测试移动端显示效果
- **样式一致性**: 确保与项目整体 UI 风格匹配 → 使用项目的 CSS 变量和颜色系统
- **破坏性变更**: 导入路径变更可能影响其他未发现的文档 → 全局搜索 `@theme/Tabs` 使用情况

### Rollback Plan
如果新组件出现问题:
1. 恢复文档文件的原始导入语法
2. 临时使用替代方案 (如 `<details>` 折叠块)
3. 保留新组件代码以便后续调试和改进

### Affected Content Sections

在 `setup-openspec.md` 中,Tabs 组件用于以下部分:

1. **安装步骤** (第 64-110 行):
   - Windows/macOS/Linux 平台的 npm 安装命令
   - 各平台的权限问题解决方案

2. **故障排除 - 权限错误** (第 140-171 行):
   - 不同平台的权限错误解决方案

3. **命令未找到问题** (第 252-303 行):
   - Windows/macOS/Linux 的 PATH 配置方法

4. **卸载指南** (第 321-352 行):
   - 各平台的卸载命令

## Migration Approach

根据输入描述中的三种解决方案,推荐使用 **方案一: Astro + Tabs 组件**,理由如下:

1. **完全兼容**: 与 Astro + MDX 架构完美集成
2. **用户体验好**: 提供 Tabs 切换 UI,最接近原始 Docusaurus 体验
3. **可维护性高**: 组件化设计,便于后续维护和扩展
4. **性能优化**: 支持 Astro 零 JS 默认和按需水合策略

替代方案 (如果方案一遇到问题):
- **方案二**: 使用 `<details>` 折叠块 - 降级方案,无 JS 依赖
- **方案三**: 重组内容结构 - 最后选择,损失用户体验

## Dependencies

### Technical Requirements
- Astro 5.16+ (已安装)
- @astrojs/react 4.4+ (已安装)
- @astrojs/mdx 4.3+ (已安装)
- TypeScript 5.3+ (已安装)

### External Dependencies
- 无需新增外部 npm 包
- 使用原生 Astro 组件和客户端指令

## Success Criteria

- [ ] Tabs 组件在 `setup-openspec.md` 中正确渲染
- [ ] 用户可以点击切换不同平台的安装步骤
- [ ] 暗色模式下样式正常显示
- [ ] 移动端响应式布局正常
- [ ] `npm run build` 构建成功无错误
- [ ] `npm run typecheck` 类型检查通过
- [ ] 组件可在其他 MDX 文档中复用

## Open Questions

1. **组件交互方式**: 是否需要保持 URL 同步? (即点击 Tab 更新 URL hash)
   - 初步实现暂不支持,后续可根据需求添加
2. **默认值策略**: 如何检测用户平台并设置默认 Tab?
   - 使用 `defaultValue="win"` 作为默认值 (Windows 用户最多)
3. **可访问性**: 是否需要键盘导航支持?
   - 是,确保 Tab 切换支持键盘焦点和方向键
