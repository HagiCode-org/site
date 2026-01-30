# 设计文档:文件夹路由和目录索引

## 目录

1. [架构设计](#架构设计)
2. [数据流](#数据流)
3. [组件设计](#组件设计)
4. [路由逻辑](#路由逻辑)
5. [样式系统](#样式系统)
6. [错误处理](#错误处理)
7. [性能考虑](#性能考虑)

---

## 架构设计

### 系统组件关系

```
┌─────────────────────────────────────────────────────────────┐
│                     Astro 路由系统                            │
│                  src/pages/docs/[...slug].astro              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─► 单文档路径
                              │   └─► 渲染 Markdown 内容
                              │
                              └─► 文件夹路径
                                  └─► DirectoryIndex.astro
                                      └─► DocsLayout.astro
```

### 关键决策

**决策 1: 在现有路由文件中检测文件夹**

**选项 A**: 创建新的路由文件 `src/pages/docs/[...slug]/index.astro`
- **优点**: 路由分离清晰
- **缺点**: 无法与单文档路由共享逻辑,需要复制代码

**选项 B**: 在现有 `[...slug].astro` 中添加检测(✓ 已选择)
- **优点**: 共享路由逻辑,代码复用性高,符合 DRY 原则
- **缺点**: 单个文件逻辑稍复杂
- **缓解措施**: 使用清晰的函数封装和注释

**决策 2: 使用 Content Collections API 而非文件系统直接访问**

**选项 A**: 直接读取 `src/content/docs/` 文件系统
- **优点**: 更灵活的控制
- **缺点**: 绕过 Astro 的类型系统,frontmatter 验证失效

**选项 B**: 使用 `getCollection('docs')` API(✓ 已选择)
- **优点**: 类型安全,自动 frontmatter 验证,符合 Astro 最佳实践
- **缺点**: 需要额外的路径前缀匹配逻辑
- **缓解措施**: 封装可复用的路径匹配函数

---

## 数据流

### 请求处理流程

```
用户请求 /docs/quick-start/
         │
         ▼
┌──────────────────────────────────────┐
│  [...slug].astro                     │
│  slug = ['quick-start']              │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  getCollection('docs')               │
│  获取所有文档                         │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  路径前缀匹配                         │
│  docs/quick-start/*                  │
└──────────────────────────────────────┘
         │
         ├─► 匹配到多个文档 ──► 文件夹访问
         │                           │
         │                           ▼
         │              ┌──────────────────────────┐
         │              │  DirectoryIndex.astro    │
         │              │  - 渲染文档列表           │
         │              │  - 按位置排序             │
         │              └──────────────────────────┘
         │
         └─► 匹配到一个文档 ──► 单文档访问
                                     │
                                     ▼
                        ┌──────────────────────────┐
                        │  渲染 Markdown 内容       │
                        │  <Content />              │
                        └──────────────────────────┘
```

### 数据转换示例

**输入**: 用户访问 `/docs/quick-start/`

```typescript
// 1. 路由参数
Astro.params.slug = ['quick-start']

// 2. 从 Content Collection 获取原始数据
const rawDocs = [
  { slug: 'docs/quick-start/installation', data: { title: '安装指南', ... } },
  { slug: 'docs/quick-start/create-first-project', data: { title: '创建第一个项目', ... } },
  { slug: 'docs/installation/docker-compose', data: { title: 'Docker Compose 部署', ... } }
]

// 3. 路径前缀匹配
const folderPath = 'docs/quick-start/'
const childDocs = rawDocs.filter(doc => doc.slug.startsWith(folderPath))
// 结果: 前两个文档

// 4. 数据转换(传递给 DirectoryIndex)
const transformedDocs = [
  {
    slug: 'quick-start/installation',
    title: '安装指南',
    description: '...',
    sidebar_position: 1
  },
  {
    slug: 'quick-start/create-first-project',
    title: '创建第一个项目',
    description: '...',
    sidebar_position: 2
  }
]
```

---

## 组件设计

### DirectoryIndex.astro 组件规范

**职责**:
- 渲染文件夹中的文档列表
- 提供文档导航链接
- 显示文档元数据(标题、描述)

**Props 接口**:

```typescript
interface Props {
  // 文档数组
  documents: Array<{
    slug: string;              // 文档 slug(相对路径,不含 /docs/ 前缀)
    title: string;             // 文档标题
    description?: string;      // 文档描述(可选)
    sidebar_position?: number; // 侧边栏位置(可选,用于排序)
  }>;

  // 当前文件夹路径(用于面包屑或标题)
  folderPath: string;
}
```

**组件结构**:

```astro
---
interface Props {
  documents: Array<{
    slug: string;
    title: string;
    description?: string;
    sidebar_position?: number;
  }>;
  folderPath: string;
}

const { documents, folderPath } = Astro.props;

// 排序逻辑:如果有 sidebar_position,按其排序;否则按字母顺序
const sortedDocs = [...documents].sort((a, b) => {
  if (a.sidebar_position !== undefined && b.sidebar_position !== undefined) {
    return a.sidebar_position - b.sidebar_position;
  }
  if (a.sidebar_position !== undefined) return -1;
  if (b.sidebar_position !== undefined) return 1;
  return a.title.localeCompare(b.title, 'zh-CN');
});
---

<div class="directory-index">
  <header class="directory-header">
    <h1>目录索引</h1>
    <p class="directory-path">{folderPath}</p>
  </header>

  <ul class="document-list">
    {sortedDocs.map(doc => (
      <li class="document-item">
        <a href={`/docs/${doc.slug}`} class="document-link">
          <h2 class="document-title">{doc.title}</h2>
          {doc.description && (
            <p class="document-description">{doc.description}</p>
          )}
        </a>
      </li>
    ))}
  </ul>

  {sortedDocs.length === 0 && (
    <div class="empty-state">
      <p>此文件夹为空</p>
    </div>
  )}
</div>

<style>
  /* 组件样式 */
</style>
```

**设计原则**:
1. **单一职责**: 只负责文档列表渲染,不处理路由逻辑
2. **可复用性**: 可以在其他地方使用(如搜索结果页)
3. **类型安全**: 使用 TypeScript 接口确保类型正确
4. **可测试性**: 纯展示组件,易于测试

---

## 路由逻辑

### 路径检测算法

```typescript
/**
 * 检测给定 slug 是否为文件夹路径
 * @param slug 当前路由的 slug(如 'quick-start' 或 'quick-start/installation')
 * @param allDocs 所有文档的集合
 * @returns 是否为文件夹路径
 */
function isFolderPath(
  slug: string,
  allDocs: CollectionEntry<'docs'>[]
): boolean {
  // 构建路径前缀
  const prefix = slug ? `docs/${slug}/` : 'docs/';

  // 检查是否有任何文档以该前缀开头
  return allDocs.some(doc => doc.slug.startsWith(prefix));
}

/**
 * 获取文件夹下的所有子文档
 * @param folderSlug 文件夹 slug
 * @param allDocs 所有文档的集合
 * @returns 子文档数组
 */
function getChildDocs(
  folderSlug: string,
  allDocs: CollectionEntry<'docs'>[]
): Array<{
  slug: string;
  title: string;
  description?: string;
  sidebar_position?: number;
}> {
  const prefix = folderSlug ? `docs/${folderSlug}/` : 'docs/';

  return allDocs
    .filter(doc => doc.slug.startsWith(prefix))
    .map(doc => ({
      slug: doc.slug.replace(/^docs\//, ''),
      title: doc.data.title,
      description: doc.data.description,
      sidebar_position: doc.data.sidebar_position,
    }));
}
```

### 路由决策树

```
[...slug].astro
     │
     ├─► slug 存在?
     │   ├─► 是 ──► 继续检测
     │   └─► 否 ──► 显示所有文档(/docs/)
     │
     ├─► 是文件夹路径?
     │   ├─► 是 ──► 渲染 DirectoryIndex
     │   └─► 否 ──► 继续检测
     │
     ├─► 是单文档路径?
     │   ├─► 是 ──► 渲染单文档内容
     │   └─► 否 ──► 返回 404
```

### 边界情况处理

| 场景 | 示例 URL | 预期行为 |
|------|----------|----------|
| 根路径 | `/docs/` | 显示所有文档的索引 |
| 文件夹路径(带斜杠) | `/docs/quick-start/` | 显示文件夹索引 |
| 文件夹路径(不带斜杠) | `/docs/quick-start` | 重定向到带斜杠版本或显示索引 |
| 单文档路径 | `/docs/quick-start/installation` | 显示文档内容 |
| 不存在的路径 | `/docs/non-existent/` | 返回 404 |
| 空文件夹 | `/docs/empty-folder/` | 显示空状态提示 |

---

## 样式系统

### 设计规范

**颜色变量**:
```css
/* 复用现有 CSS 变量 */
--ifm-color-primary: #25c2a0;
--ifm-color-secondary: #6c757d;
--color-background: #f8f9fa;
--color-border: #dee2e6;
```

**响应式断点**:
```css
/* 移动优先设计 */
.directory-index {
  /* 移动端默认样式 */
}

@media (min-width: 768px) {
  /* 平板端 */
}

@media (min-width: 1024px) {
  /* 桌面端 */
}
```

### 组件样式设计

**文档列表项**:
- 使用卡片式设计,增加视觉层次
- 添加 hover 效果,提供交互反馈
- 使用 Flexbox 布局,确保对齐
- 添加适当的 padding 和 margin

**空状态**:
- 居中显示
- 使用友好的图标和文字
- 提供返回首页或上级目录的链接

**动画效果**:
- 列表项淡入动画(使用 CSS transitions)
- hover 时轻微上浮和阴影加深
- 符合 Material Design 动效原则

---

## 错误处理

### 错误场景和策略

| 错误类型 | 场景 | 处理策略 |
|---------|------|----------|
| 404 Not Found | 访问不存在的路径 | 返回 Astro 默认 404 页面 |
| 空文件夹 | 文件夹中没有 Markdown 文件 | 显示友好空状态提示 |
| 数据异常 | frontmatter 缺少必需字段 | Content Collections 自动验证,构建失败 |
| 路径冲突 | 同时存在 `folder.md` 和 `folder/index.md` | 优先匹配单文档,后者需要手动处理 |

### 错误边界

虽然 Astro 组件不支持 React 风格的 Error Boundaries,但可以通过以下方式提高鲁棒性:

1. **TypeScript 类型检查**: 确保所有数据访问都是类型安全的
2. **Content Collections 验证**: 在构建时验证 frontmatter
3. **防御性编程**: 使用可选链和空值合并
4. **日志记录**: 开发环境记录调试信息

---

## 性能考虑

### 构建时性能

**文档查询优化**:
- `getCollection('docs')` 只在构建时执行一次
- 路径匹配在内存中完成,无 I/O 开销
- 使用 `.filter()` 和 `.map()` 链式调用,减少中间数组

**内存使用**:
- 所有文档数据在构建时加载到内存
- 对于小型文档站(< 1000 页)完全没问题
- 如果将来文档规模扩大,考虑分批处理

### 运行时性能

**页面大小**:
- 目录索引页面是纯静态 HTML
- 无客户端 JavaScript(除了 Framer Motion 动画)
- 预估页面大小 < 30KB

**加载性能**:
- 使用 Astro 的静态生成,所有页面在构建时生成
- 无服务端渲染延迟
- CDN 友好,可以完全缓存

### 性能监控指标

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| 构建时间增量 | < 10% | 对比前后构建时间 |
| First Contentful Paint | < 1.5s | Lighthouse 测试 |
| Largest Contentful Paint | < 2.5s | Lighthouse 测试 |
| 页面大小 | < 50KB | Network 面板查看 |

---

## 技术债务和未来改进

### 已知限制

1. **无限滚动**: 当前实现一次性显示所有文档,大型文件夹可能需要分页
2. **搜索功能**: 当前不支持在目录页内搜索文档
3. **面包屑导航**: 需要手动实现或等待后续需求

### 未来优化方向

1. **性能优化**:
   - 添加虚拟滚动(大型文件夹)
   - 实现懒加载图片
   - 优化 CSS 加载

2. **功能增强**:
   - 添加文档标签和分类
   - 支持文档搜索和过滤
   - 面包屑导航
   - 最近的文档更新时间

3. **可访问性**:
   - 添加 ARIA 标签
   - 键盘导航支持
   - 屏幕阅读器优化

---

## 参考资源

- [Astro Content Collections 文档](https://docs.astro.build/en/guides/content-collections/)
- [Astro 动态路由文档](https://docs.astro.build/en/core-concepts/routing/#dynamic-routes)
- [Astro 静态生成最佳实践](https://docs.astro.build/en/guides/server-side-rendering/#static-site-generation)
- 项目现有代码: `src/pages/docs/[...slug].astro`
- 项目现有代码: `src/layouts/DocsLayout.astro`
