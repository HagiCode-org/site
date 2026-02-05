## ADDED Requirements

### Requirement: 百度搜索引擎验证

站点 MUST 在所有页面的 HTML `<head>` 标签中包含百度站点验证 meta 标签,以通过百度站长平台的站点所有权验证。

#### Scenario: 验证标签正确添加
- **WHEN** 用户访问站点任意页面
- **THEN** 页面 HTML `<head>` 标签中应包含 `<meta name="baidu-site-verification" content="codeva-A9s3yT3z5m" />`

#### Scenario: 验证标签位置正确
- **WHEN** 查看页面源代码
- **THEN** 百度验证 meta 标签应位于 `<head>` 标签内,在其他 meta 标签附近
- **AND** 验证标签应在 SEO meta 标签之后添加

#### Scenario: 所有页面生效
- **WHEN** 访问站点任意路由(包括首页、文档页面、博客文章等)
- **THEN** 所有页面的 HTML 源代码中都应包含百度验证 meta 标签
- **AND** 验证代码的 content 属性值必须保持一致
