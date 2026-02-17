# Change: 移除 Starlight 中重复的 GitHub 链接

## Why

Starlight 文档框架 (`@astrojs/starlight 0.37.4`) 已通过 `astro.config.mjs` 中的 `social` 配置提供了内置的 GitHub 集成功能。当前在 `StarlightHeader.astro` 组件中通过 `navLinks` 配置手动添加了 GitHub 链接,导致导航栏中出现两个指向同一仓库的 GitHub 链接,造成功能重复和用户体验问题。

## What Changes

- 从 `apps/docs/src/config/navigation.ts` 的 `navLinks` 数组中移除 GitHub 链接配置
- 保留 Starlight 内置的 `SocialIcons` 组件(已在 `StarlightHeader.astro` 中使用)
- 依赖 Starlight 的 `social` 配置来显示 GitHub 图标链接

## Impact

### Affected specs
- `astro-site` - 导航配置相关需求

### Affected code
- `apps/docs/src/config/navigation.ts` - 移除 GitHub 链接配置项
- `apps/docs/src/components/StarlightHeader.astro` - 无需修改(继续使用 SocialIcons)

### User Experience Changes
- 导航栏中只显示一个 GitHub 链接(来自 Starlight SocialIcons)
- 界面更简洁,符合用户对 Starlight 文档站点的预期行为

### Benefits
- **代码维护性**: 减少自定义配置,降低维护负担
- **框架一致性**: 利用 Starlight 原生功能,更易于升级和迁移
- **用户体验**: 消除重复链接,界面更清晰
- **DRY 原则**: 遵循 "Don't Repeat Yourself" 最佳实践

### Risks
- 无破坏性变更,GitHub 链接功能保持完整
- 其他导航链接(首页、博客、技术支持群)不受影响
