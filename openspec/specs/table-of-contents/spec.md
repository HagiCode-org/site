# table-of-contents Specification

## Purpose
TBD - created by archiving change table-of-contents-for-docs-and-blog. Update Purpose after archive.
## Requirements
### Requirement: 目录组件

The site MUST provide a reusable table of contents component for displaying content structure navigation in documentation and blog pages.

站点必须提供可复用的目录组件,用于在文档和博客页面中显示内容结构导航。

#### Scenario: 在文档页面显示目录

**Given** 用户访问一个包含多个章节的文档页面
**And** 该文档至少包含 3 个标题(H2-H6)
**When** 页面加载完成
**Then** 右侧边栏必须显示目录组件
**And** 目录必须包含文档的所有二级到六级标题
**And** 目录必须正确显示标题层级关系(缩进)
**And** 目录必须使用站点现有的主题系统(颜色、字体、间距)

#### Scenario: 在博客页面显示目录

**Given** 用户访问一篇包含多个章节的博客文章
**And** 该文章至少包含 3 个标题(H2-H6)
**When** 页面加载完成
**Then** 右侧边栏或内容顶部必须显示目录组件
**And** 目录必须包含文章的所有二级到六级标题
**And** 目录样式必须与文档页面一致

#### Scenario: 短内容不显示目录

**Given** 用户访问一个包含少于 3 个标题的页面
**When** 页面加载完成
**Then** 目录组件不应显示
**And** 页面布局不应为目录留出空白区域

---

### Requirement: 标题提取和锚点生成

The TOC MUST automatically extract headings from Markdown/MDX content and generate anchor links.

目录必须自动从 Markdown/MDX 内容中提取标题并生成锚点链接。

#### Scenario: 自动提取标题层级

**Given** MDX 内容包含以下标题结构:
```markdown
# 页面标题(H1)

