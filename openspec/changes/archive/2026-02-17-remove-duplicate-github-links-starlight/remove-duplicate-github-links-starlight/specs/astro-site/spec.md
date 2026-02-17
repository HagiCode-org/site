## REMOVED Requirements

### Requirement: 导航链接中的 GitHub 链接

**Reason**: Starlight 框架已通过 `social` 配置提供内置的 GitHub 集成,无需在自定义导航链接中重复添加。`SocialIcons` 组件已自动渲染 GitHub 图标链接。

**Migration**: 移除 `navLinks` 配置中的 GitHub 项后,GitHub 链接仍将通过 Starlight 的 `SocialIcons` 组件正常显示。用户无需进行任何操作或配置更改。

#### Scenario: GitHub 链接由 SocialIcons 组件渲染

- **GIVEN** Starlight 配置中已设置 `social` 选项包含 GitHub 链接
- **WHEN** 文档站点的 Header 组件被渲染
- **THEN** GitHub 链接必须通过 `SocialIcons` 组件显示在导航栏右侧
- **AND** 自定义导航链接区域(`custom-nav-links`)不应包含 GitHub 链接

#### Scenario: 其他导航链接保持不变

- **GIVEN** 导航配置被修改,移除了 GitHub 链接
- **WHEN** 用户查看导航栏
- **THEN** 其他导航链接(首页、博客、技术支持群)必须正常显示
- **AND** 这些链接的功能和样式不受影响
