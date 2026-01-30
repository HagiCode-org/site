# 目录路由功能 Spec Delta

本文档定义了文件夹路由和目录索引功能的需求变更,这些需求将添加到 `astro-site` 规范中。

---

## ADDED Requirements

### Requirement: Directory Path Routing

The documentation site MUST support folder path routing, where when a user accesses a folder path, the system SHALL automatically generate and display a directory index page of all documents within that folder.

#### Scenario: 访问文件夹路径显示目录索引

**Given** 文档站点中存在 `src/content/docs/quick-start/` 目录
**And** 该目录下包含多个 Markdown 文件(如 `installation.md`, `create-first-project.md`)
**When** 用户访问 `/docs/quick-start/` 路径
**Then** 系统必须返回一个目录索引页面
**And** 该页面必须列出 `quick-start/` 目录下的所有文档
**And** 每个文档项必须显示标题和描述
**And** 每个文档项必须提供指向完整文档的链接

#### Scenario: 访问根文档路径显示全局索引

**Given** 文档站点中存在多个文档目录
**When** 用户访问 `/docs/` 根路径
**Then** 系统必须返回包含所有文档的全局索引页面
**And** 索引页面必须按目录结构组织文档
**And** 用户可以看到所有可用的文档

#### Scenario: 文件夹路径检测逻辑

**Given** 用户访问任何 `/docs/*` 路径
**When** 路由系统处理该请求
**Then** 系统必须检测该路径是文件夹还是单个文档
**And** 检测逻辑必须使用路径前缀匹配算法
**And** 如果路径前缀匹配多个文档,则视为文件夹访问
**And** 如果路径前缀只匹配一个文档或没有匹配,则使用现有的单文档路由逻辑

#### Scenario: 带和不带尾部斜杠的 URL 处理

**Given** 用户访问 `/docs/quick-start` (不带尾部斜杠)
**When** 请求到达路由系统
**Then** 系统必须将其视为文件夹路径
**And** 返回与 `/docs/quick-start/` 相同的目录索引页面
**Or** 自动重定向到带斜杠的版本

---

### Requirement: Directory Index Component

The system MUST provide a reusable directory index component that SHALL render a list of documents within a folder with proper styling and navigation links.

#### Scenario: 组件渲染文档列表

**Given** `DirectoryIndex.astro` 组件接收到文档数组
**And** 每个文档对象包含 `slug`, `title`, `description` 等字段
**When** 组件渲染
**Then** 必须显示所有文档的列表
**And** 每个列表项必须包含文档标题
**And** 如果文档有描述,必须显示描述内容
**And** 每个列表项必须链接到 `/docs/{slug}` 路径

#### Scenario: 按 sidebar_position 排序

**Given** 文档数组中的某些文档包含 `sidebar_position` 字段
**When** 组件渲染文档列表
**Then** 有 `sidebar_position` 的文档必须按数值升序排列
**And** 没有 `sidebar_position` 的文档必须排在有值的文档之后
**And** 相同 `sidebar_position` 或都没有的文档按标题字母顺序排列

#### Scenario: 空文件夹处理

**Given** 用户访问一个空的文件夹路径
**When** 组件渲染
**Then** 必须显示友好的空状态提示
**And** 提示信息应该说明"此文件夹为空"或类似内容
**And** 可选地提供返回首页或上级目录的链接

#### Scenario: 组件类型安全

**Given** `DirectoryIndex.astro` 组件使用 TypeScript
**When** 开发者编写组件代码
**Then** 组件必须定义明确的 Props 接口
**And** 接口必须包含 `documents` 和 `folderPath` 属性
**And** `documents` 数组的每个元素必须包含 `slug`, `title`, `description?(可选)`, `sidebar_position?(可选)` 字段
**And** 代码必须通过 `npm run typecheck` 验证

---

### Requirement: Directory Index Styling

The directory index page MUST follow site design specifications and SHALL provide a consistent and beautiful user experience across all device sizes with proper responsive design.

#### Scenario: 响应式布局

**Given** 用户在不同设备上查看目录索引页面
**When** 页面在移动端(宽度 < 768px)渲染
**Then** 文档列表必须使用单列布局
**And** 每个列表项必须占据全宽
**And** 文本大小必须适合移动端阅读

**Given** 页面在平板端(768px - 1024px)渲染
**When** 页面渲染
**Then** 文档列表可以使用两列布局(如果内容适合)
**Or** 保持单列布局但增加间距

**Given** 页面在桌面端(宽度 > 1024px)渲染
**When** 页面渲染
**Then** 文档列表可以使用多列网格布局
**And** 每列宽度必须适当,确保内容可读性

#### Scenario: 使用站点 CSS 变量

**Given** `DirectoryIndex.astro` 组件定义样式
**When** 组件使用颜色和间距
**Then** 必须使用项目定义的 CSS 变量
**And** 主色调使用 `var(--ifm-color-primary)`
**And** 次要色调使用 `var(--ifm-color-secondary)`
**And** 背景色使用 `var(--color-background)`
**And** 边框色使用 `var(--color-border)`

#### Scenario: 交互效果

**Given** 用户鼠标悬停在文档列表项上
**When** hover 状态触发
**Then** 列表项必须有视觉反馈
**And** 反馈效果可以包括:
  - 背景色变化
  - 轻微上浮(transform: translateY)
  - 阴影加深
**And** 过渡动画必须流畅(transition duration 200-300ms)

**Given** 用户在触摸设备上点击列表项
**When** 点击发生
**Then** 必须有即时的视觉反馈
**And** 反馈效果适合触摸交互

#### Scenario: 与 DocsLayout 一致性

**Given** 目录索引页面使用 `DocsLayout.astro` 布局
**When** 页面渲染
**Then** 页面整体风格必须与单文档页面一致
**And** 导航栏和页脚必须正常显示
**And** 页面间距和字体必须与站点规范一致
**And** 用户不应感觉切换到了不同的站点

---

### Requirement: Backward Compatibility

The addition of folder routing MUST maintain complete backward compatibility with existing documentation routes and SHALL NOT break any current functionality.

#### Scenario: 现有单文档路由不受影响

**Given** 站点中存在现有的单文档路由(如 `/docs/quick-start/installation`)
**When** 用户访问这些现有路径
**Then** 页面必须正常显示文档内容
**And** 页面渲染行为必须与添加文件夹路由功能前完全一致
**And** 不应有任何视觉或功能上的变化

#### Scenario: 构建输出不破坏现有流程

**Given** 开发者运行 `npm run build`
**When** 构建过程完成
**Then** 所有现有的静态页面必须正常生成
**And** 新增的文件夹路径页面必须也成功生成
**And** 构建时间增加不应超过 10%
**And** 构建必须无错误完成

#### Scenario: Content Collections 集成

**Given** 站点使用 Astro Content Collections 管理内容
**When** 文件夹路由功能使用 `getCollection('docs')` API
**Then** 必须遵循 Content Collections 的最佳实践
**And** frontmatter 验证必须继续生效
**And** 类型安全必须保持
**And** 不应绕过或破坏 Content Collections 的任何现有功能

#### Scenario: 链接完整性

**Given** 站点配置了 `onBrokenLinks: 'throw'`
**When** 运行构建或开发服务器
**Then** 所有现有的内部链接必须继续有效
**And** 新增的目录索引链接必须也有效
**And** 不应有任何 broken links 错误
**And** 文档之间的相互引用必须正常工作

---

### Requirement: Directory Index Navigation

The navigation system MUST provide clear context and navigation options for directory index pages.

#### Scenario: 文档结构导航

**Given** 用户在查看目录索引页面(如 `/docs/quick-start/`)
**When** 用户查看导航结构
**Then** 导航系统必须清楚地标识当前位置
**And** 用户必须能够从目录页导航到任何子文档
**And** 用户应该能够返回上级目录或首页

---

## REMOVED Requirements

无。此变更不删除任何现有需求。

---

## Implementation Notes

### 技术约束

- 必须使用 Astro Content Collections API (`getCollection('docs')`)
- 必须使用 TypeScript 严格模式
- 必须遵循项目的代码风格指南(kebab-case 文件名,PascalCase 组件名)
- 必须复用现有的 `DocsLayout.astro` 布局
- 必须使用项目定义的 CSS 变量

### 性能要求

- 构建时间增加不超过 10%
- 目录索引页面大小 < 50KB
- First Contentful Paint (FCP) 不超过现有文档页面的 120%
- 必须支持增量构建(添加新文档时只重建相关页面)

### 测试要求

- 必须在开发环境中测试所有边界情况
- 必须在不同设备尺寸下测试响应式设计
- 必须通过 `npm run typecheck` 和 `npm run build` 验证
- 必须在 `npm run preview` 中测试生产构建

### 验收标准

- [ ] 访问 `/docs/quick-start/` 显示目录索引页面
- [ ] 访问 `/docs/` 显示全局文档索引
- [ ] 现有单文档路由(`/docs/quick-start/installation`)正常工作
- [ ] 目录索引页面样式与站点一致
- [ ] 响应式设计在所有设备上正常工作
- [ ] `npm run typecheck` 无错误
- [ ] `npm run build` 无错误
- [ ] 构建时间增加 < 10%

---

## Related Specifications

- **astro-site**: 本 spec delta 扩展了 `astro-site` 规范
- **现有路由系统**: 基于 `src/pages/docs/[...slug].astro`
- **Content Collections**: 基于 `src/content/config.ts` 配置

---

## Migration Guide

对于从 Docusaurus 迁移的用户,需要注意:

- Docusaurus 的自动生成索引功能在 Astro 中需要手动实现
- Docusaurus 的 `index.md` 文件在 Astro 中不是必需的(但如果存在,可以优先显示其内容)
- URL 结构保持一致,无需修改现有链接

---

## Future Enhancements

以下功能不在本次变更范围内,但可以在未来考虑:

- 添加面包屑导航
- 为大型文件夹实现分页或虚拟滚动
- 在目录页中集成搜索和过滤功能
- 支持自定义文件夹元数据(如图标、颜色、描述)
- 如果文件夹中存在 `index.md` 或 `README.md`,在目录页顶部显示其内容
