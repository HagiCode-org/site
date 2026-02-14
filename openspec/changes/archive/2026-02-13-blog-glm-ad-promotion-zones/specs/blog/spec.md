## ADDED Requirements

### Requirement: 博客广告推广区域

博客文章页面 SHALL 在文章开头和结尾显示 GLM（智谱 AI）推广广告区域，用于展示 API Token 购买链接和相关推广信息。

#### Scenario: 博客文章开头显示推广广告

- **WHEN** 用户访问任意博客文章页面
- **THEN** 文章标题下方、正文内容上方显示推广广告卡片
- **AND** 广告卡片标题为："速来拼好模，智谱 GLM Coding 超值订阅"
- **AND** 广告卡片描述为："Claude Code、Cline 等 20+ 大编程工具无缝支持，'码力'全开，越拼越爽！立即开拼，享限时惊喜价！"
- **AND** 广告卡片包含"立即开拼"链接
- **AND** 链接指向 `https://www.bigmodel.cn/glm-coding?ic=14BY54APZA`

#### Scenario: 博客文章结尾显示推广广告

- **WHEN** 用户访问任意博客文章页面
- **THEN** 文章正文内容下方显示推广链接区域
- **AND** 推广区域包含 GLM Coding 链接，描述为："20+ 大编程工具无缝支持"
- **AND** 推广区域包含 Docker Compose 部署指南链接
- **AND** 所有外部链接在新标签页打开

#### Scenario: 通过 frontmatter 隐藏广告

- **WHEN** 博客文章的 frontmatter 包含 `hideAd: true`
- **THEN** 该博客文章不显示开头和结尾的广告区域

### Requirement: GLM 推广链接配置

系统 SHALL 在共享模块中集中管理 GLM 推广链接配置，便于跨应用复用和统一更新。

#### Scenario: 获取 GLM Coding 推广链接

- **WHEN** 组件需要展示 GLM Coding 推广链接
- **THEN** 从 `packages/shared/src/links.ts` 获取配置
- **AND** 链接为 `https://www.bigmodel.cn/glm-coding?ic=14BY54APZA`

#### Scenario: 链接配置支持环境切换

- **WHEN** 应用在不同环境运行（开发/生产）
- **THEN** GLM 推广链接保持一致（外部链接无需环境切换）

### Requirement: 广告组件样式一致性

博客广告组件 SHALL 与 Starlight 主题风格保持一致，支持暗色和亮色主题切换。

#### Scenario: 暗色主题下广告样式

- **WHEN** 用户使用暗色主题浏览博客
- **THEN** 广告区域背景色与 Starlight 暗色主题协调
- **AND** 文字颜色具有良好的可读性

#### Scenario: 亮色主题下广告样式

- **WHEN** 用户使用亮色主题浏览博客
- **THEN** 广告区域背景色与 Starlight 亮色主题协调
- **AND** 文字颜色具有良好的可读性
