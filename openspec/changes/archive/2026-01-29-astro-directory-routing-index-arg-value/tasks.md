# 实施任务清单

本文档列出了实施 Astro 文档文件夹路由和目录索引功能的所有任务。任务按逻辑顺序排列,每个任务都是可验证且独立的。

---

## 阶段 1: 准备和规划

### 1. 验证开发环境
- [x] 确认 Node.js 版本 >= 18.0
- [x] 运行 `npm run typecheck` 确保项目无类型错误
- [x] 运行 `npm run build` 确保项目可正常构建
- [x] 启动开发服务器 `npm run dev` 确认环境正常

**验收标准**: 开发环境完全正常,所有命令无错误

---

## 阶段 2: 组件开发

### 2. 创建 DirectoryIndex.astro 组件
- [x] 创建 `src/components/DirectoryIndex.astro` 文件
- [x] 定义组件 Props 接口:
  ```typescript
  interface Props {
    documents: Array<{
      slug: string;
      title: string;
      description?: string;
      sidebar_position?: number;
    }>;
    folderPath: string;
  }
  ```
- [x] 实现文档列表渲染逻辑
- [x] 实现按 `sidebar_position` 排序(如果存在)
- [x] 添加文档标题和描述显示
- [x] 添加文档链接(使用 `/docs/${slug}` 格式)

**验收标准**: 组件可以接收文档数组并渲染列表,TypeScript 类型检查通过

### 3. 实现 DirectoryIndex 组件样式
- [x] 添加作用域 `<style>` 标签
- [x] 使用项目 CSS 变量(如 `var(--ifm-color-primary)`)
- [x] 实现响应式布局(移动优先)
- [x] 添加列表项样式(卡片式或列表式)
- [x] 添加 hover 效果和过渡动画
- [x] 确保与 `DocsLayout` 风格一致

**验收标准**: 样式在桌面端和移动端显示正常,视觉风格与现有页面一致

---

## 阶段 3: 路由逻辑修改

### 4. 更新 [...slug].astro 路由检测逻辑
- [x] 打开 `src/pages/docs/[...slug].astro`
- [x] 保留现有的 `getStaticPaths` 函数(单文档路由)
- [x] 在组件主体中添加文件夹检测逻辑:
  ```typescript
  // 获取当前 slug
  const currentSlug = Astro.params.slug?.join('/') || '';

  // 获取所有文档
  const allDocs = await getCollection('docs');

  // 检测是否为文件夹路径
  const isFolder = allDocs.some(doc =>
    doc.slug.startsWith(`docs/${currentSlug}/`) ||
    (currentSlug === '' && doc.slug.startsWith('docs/'))
  );

  // 如果是文件夹,获取子文档
  if (isFolder) {
    const childDocs = allDocs
      .filter(doc => doc.slug.startsWith(`docs/${currentSlug}/`))
      .map(doc => ({
        slug: doc.slug.replace(/^docs\//, ''),
        title: doc.data.title,
        description: doc.data.description,
        sidebar_position: doc.data.sidebar_position,
      }));
    // 渲染 DirectoryIndex 组件
  }
  ```
- [x] 保持现有的单文档渲染逻辑不变
- [x] 添加空文件夹处理逻辑(友好提示信息)

**验收标准**: 代码逻辑清晰,TypeScript 类型检查通过

### 5. 处理边界情况
- [x] 测试根路径 `/docs/` (显示所有文档)
- [x] 测试单文档路径 `/docs/quick-start/installation` (正常显示文档)
- [x] 测试文件夹路径 `/docs/quick-start/` (显示目录索引)
- [x] 测试不存在的路径 (返回 404)
- [x] 处理带和不带尾部斜杠的 URL
- [x] 处理空文件夹(显示友好提示)

**验收标准**: 所有边界情况都能正确处理,无 500 错误

---

## 阶段 4: 测试和验证

### 6. 本地功能测试
- [x] 测试 `/docs/quick-start/` 显示快速开始章节的索引
- [x] 测试 `/docs/installation/` 显示安装章节的索引
- [x] 测试 `/docs/related-software-installation/` 显示相关软件安装的索引
- [x] 测试 `/docs/related-software-installation/nodejs/` 显示子目录索引
- [x] 验证文档链接可以正常跳转
- [x] 验证标题和描述显示正确
- [x] 验证 `sidebar_position` 排序生效(如果存在)

**验收标准**: 所有测试场景通过,页面显示符合预期

### 7. 响应式设计测试
- [x] 在移动端(375px)测试目录列表显示
- [x] 在平板端(768px)测试布局
- [x] 在桌面端(1024px+)测试布局
- [x] 测试 hover 效果在触摸设备上的表现
- [x] 测试长标题和描述的文本换行

**验收标准**: 在所有设备尺寸下显示正常,无布局错乱

### 8. 类型检查和构建验证
- [x] 运行 `npm run typecheck` 确保无 TypeScript 错误
- [x] 运行 `npm run build` 确保生产构建成功
- [x] 检查构建输出中是否生成了文件夹路径的静态页面
- [x] 运行 `npm run preview` 测试生产构建
- [x] 在预览环境中测试文件夹路径和文档路径

**验收标准**: typecheck 和 build 无错误,生产环境功能正常

---

## 阶段 5: 文档和收尾

### 9. 代码清理和优化
- [x] 移除调试代码和 console.log
- [x] 优化导入语句,移除未使用的导入
- [x] 添加必要的代码注释(仅复杂逻辑)
- [x] 确保代码遵循项目风格指南

**验收标准**: 代码整洁,符合项目规范

### 10. 更新项目文档(如需要)
- [x] 如果需要,在项目 README 中说明文件夹路由功能
- [x] 如果需要,在贡献指南中说明如何组织文档结构
- [x] 如果需要,更新 OpenSpec 规范

**验收标准**: 项目文档准确反映新功能

---

## 可并行任务

以下任务可以并行执行以提高效率:

- **并行组 1**: 任务 2 和 任务 3 可以并行(一个人负责组件逻辑,另一个人负责样式)
- **并行组 2**: 任务 6 和 任务 7 可以并行(不同的人测试不同的场景)

---

## 依赖关系

```
1. 环境验证(任务 1)
   ↓
2. 组件开发(任务 2-3)
   ↓
3. 路由修改(任务 4-5)
   ↓
4. 测试验证(任务 6-8)
   ↓
5. 清理收尾(任务 9-10)
```

- 任务 2 依赖任务 1(需要环境验证通过)
- 任务 4 依赖任务 2 和 3(需要 DirectoryIndex 组件完成)
- 任务 6 依赖任务 5(需要路由逻辑完成)
- 任务 8 依赖任务 6 和 7(需要功能测试通过)

---

## 总任务统计

- **总任务数**: 10
- **必须完成**: 10 (100%)
- **可选任务**: 0
- **预计工作量**: 2-4 小时(取决于测试深度)

---

## 验收检查表

在提交 PR 之前,确保:

- [x] 所有功能测试场景通过
- [x] 所有设备尺寸测试通过
- [x] `npm run typecheck` 无错误
- [x] `npm run build` 无错误
- [x] `npm run preview` 功能正常
- [x] 代码符合项目风格指南
- [x] 无 console.log 或调试代码
- [x] 必要的注释已添加
- [x] 项目文档已更新(如需要)

