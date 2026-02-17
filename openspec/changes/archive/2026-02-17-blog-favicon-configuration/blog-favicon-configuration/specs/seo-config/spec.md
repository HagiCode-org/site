## MODIFIED Requirements

### Requirement: Meta 标签完整性

Each page MUST include complete meta tags to optimize display in search engines and social media.

每个页面 MUST 包含完整的 meta 标签,以优化搜索引擎和社交媒体的显示效果。

#### Scenario: 基础 Meta 标签

**Given** 用户访问站点的任何页面
**When** 检查页面 `<head>` 部分
**Then** 应该包含 `<title>` 标签,内容为"页面标题 - 站点名称"格式
**And** 应该包含 `<meta name="description">` 标签
**And** description 应该准确描述页面内容(长度 50-160 字符)
**And** 应该包含 `<meta charset="utf-8">` 标签
**And** 应该包含 `<meta name="viewport">` 标签用于响应式设计

#### Scenario: Canonical URL 标签

**Given** 用户访问站点的任何页面
**When** 检查页面 `<head>` 部分
**Then** 应该包含 `<link rel="canonical">` 标签
**And** canonical URL 应该指向页面的规范 URL
**And** canonical URL 应该使用 HTTPS 协议
**And** canonical URL 应该包含正确的 base path
**And** 每个页面应该有唯一的 canonical URL

#### Scenario: Open Graph (OG) 标签

**Given** 用户访问站点的任何页面
**When** 在社交媒体(如 Facebook、LinkedIn)分享页面链接
**Then** 页面应该包含以下 OG 标签:
  - `<meta property="og:title">` - 页面标题
  - `<meta property="og:description">` - 页面描述
  - `<meta property="og:type">` - 页面类型(如 `website`, `article`)
  - `<meta property="og:url">` - 页面 URL
  - `<meta property="og:image">` - 分享预览图片
  - `<meta property="og:site_name">` - 站点名称
**And** OG 标签内容应该与页面内容一致
**And** OG 图片应该存在且可访问

#### Scenario: Twitter Card 标签

**Given** 用户在 Twitter 分享页面链接
**When** Twitter 爬虫访问页面
**Then** 页面应该包含以下 Twitter Card 标签:
  - `<meta name="twitter:card">` - Card 类型(如 `summary`, `summary_large_image`)
  - `<meta name="twitter:title">` - 页面标题
  - `<meta name="twitter:description">` - 页面描述
  - `<meta name="twitter:image">` - 预览图片
**And** Twitter Card 标签应该与 OG 标签内容一致
**And** 应该提供良好的预览效果

#### Scenario: Favicon 配置

**Given** 用户在浏览器中访问站点
**When** 检查浏览器标签页
**Then** 应该显示站点 favicon
**And** `<head>` 应该包含 favicon link 标签
**And** favicon 文件应该存在于 `apps/docs/public/` 目录(使用现有的 favicon.ico)
**And** Starlight 配置应该显式指定 favicon 路径为 `/favicon.ico`
**And** favicon.ico 文件应该存在且可访问
