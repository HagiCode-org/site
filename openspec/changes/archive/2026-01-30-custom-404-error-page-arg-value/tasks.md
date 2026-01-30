# Implementation Tasks

## Task 1: 创建 404.astro 页面基础结构

**描述**: 在 `src/pages/` 目录下创建 `404.astro` 文件,设置页面的基础结构和元数据。

**文件**: `src/pages/404.astro`

**步骤**:
1. 创建 `src/pages/404.astro` 文件
2. 添加 frontmatter 配置:
   - 设置页面标题: "页面未找到 - Hagicode"
   - 设置页面描述: "您访问的页面不存在,请检查 URL 或使用以下导航链接"
   - 导入 `withBasePath` 工具函数
3. 创建基础 HTML 结构:
   - 使用 `<!doctype html>` 和 `<html lang="zh-CN">`
   - 设置 `data-site-base` 属性
   - 添加 `<head>` 部分,包含 meta 标签和标题
   - 添加 `<body>` 部分

**验证**:
- ✅ 文件创建成功
- ✅ 页面标题和描述设置正确
- ✅ HTML 结构符合 Astro 页面规范

---

## Task 2: 添加主题初始化脚本

**描述**: 在 404 页面的 `<head>` 部分添加内联脚本,在页面加载前初始化主题,避免主题闪烁。

**文件**: `src/pages/404.astro`

**步骤**:
1. 在 `<head>` 部分添加 `<script is:inline>` 标签
2. 复制与 `index.astro` 相同的主题初始化逻辑:
   - 从 localStorage 读取 `starlight-theme` 键
   - 检测系统主题偏好(`prefers-color-scheme`)
   - 设置 `data-theme` 属性到 `<html>` 元素

**代码参考**:
```javascript
<script is:inline>
  (function() {
    const stored = localStorage.getItem('starlight-theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = stored || system;
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

**验证**:
- ✅ 主题初始化脚本添加成功
- ✅ 脚本在页面加载前执行(无闪烁)

---

## Task 3: 集成 Navbar 组件

**描述**: 在 404 页面中集成 Navbar 组件,提供完整的站点导航功能。

**文件**: `src/pages/404.astro`

**步骤**:
1. 在 frontmatter 中导入 Navbar 组件:
   ```astro
   import Navbar from '../components/home/Navbar';
   ```
2. 在 `<body>` 中添加 Navbar 组件:
   ```astro
   <Navbar client:load />
   ```
3. 确保使用 `client:load` 指令进行水合

**验证**:
- ✅ Navbar 组件导入成功
- ✅ Navbar 在 404 页面上正常显示
- ✅ Navbar 的所有功能正常工作(主题切换、导航链接、移动端菜单)

---

## Task 4: 设计 404 页面主要内容区域

**描述**: 创建 404 页面的主要内容区域,包含错误提示信息和导航链接。

**文件**: `src/pages/404.astro`

**步骤**:
1. 在 `<body>` 中添加 `<main>` 元素
2. 创建以下内容结构:
   - **错误提示区域**:
     - 大标题: "404"
     - 副标题: "页面未找到"
     - 说明文字: "抱歉,您访问的页面不存在。请检查 URL 或从以下链接导航到其他页面。"
   - **导航链接区域**:
     - 首页链接
     - 安装指南链接
     - 快速开始链接
     - 产品概览链接
3. 使用 `withBasePath` 函数处理所有内部链接

**示例结构**:
```astro
<main class="not-found-container">
  <div class="not-found-content">
    <h1 class="error-code">404</h1>
    <h2 class="error-title">页面未找到</h2>
    <p class="error-description">
      抱歉,您访问的页面不存在。请检查 URL 或从以下链接导航到其他页面。
    </p>

    <nav class="not-found-nav" aria-label="快速导航">
      <a href={withBasePath('/')} class="nav-link">
        <span>首页</span>
      </a>
      <a href={withBasePath('/docs/installation/docker-compose')} class="nav-link">
        <span>安装指南</span>
      </a>
      <a href={withBasePath('/docs/quick-start/')} class="nav-link">
        <span>快速开始</span>
      </a>
      <a href={withBasePath('/docs/product-overview')} class="nav-link">
        <span>产品概览</span>
      </a>
    </nav>
  </div>
</main>
```

**验证**:
- ✅ 主要内容区域结构创建成功
- ✅ 错误提示文案清晰友好
- ✅ 所有导航链接使用 `withBasePath` 处理

---

## Task 5: 添加页面样式

**描述**: 为 404 页面添加样式,确保视觉一致性、响应式设计和主题支持。

**文件**: `src/pages/404.astro`

**步骤**:
1. 在 `<head>` 中添加 `<style>` 标签
2. 定义页面样式:
   - **容器样式**: 居中布局,最小高度 100vh,内边距
   - **错误码样式**: 大字体,渐变文字效果
   - **标题和描述样式**: 合适的字体大小和行高,使用 CSS 变量
   - **导航链接样式**:
     - 卡片式布局
     - 悬停效果(边框高亮、阴影、轻微平移)
     - 主题适配(浅色/深色主题)
   - **响应式设计**:
     - 移动设备(width < 768px): 单列布局
     - 平板和桌面(width >= 768px): 网格布局

**示例样式**:
```css
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.not-found-content {
  max-width: 600px;
  text-align: center;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  line-height: 1;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 var(--spacing-md) 0;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text);
}

.error-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xl) 0;
}

.not-found-nav {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: var(--color-surface-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--duration-normal) var(--ease-out);
}

.nav-link:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  transform: translate3d(0, -4px, 0);
}

@media (max-width: 767px) {
  .not-found-nav {
    grid-template-columns: 1fr;
  }

  .error-code {
    font-size: 6rem;
  }

  .error-title {
    font-size: 2rem;
  }
}
```

**验证**:
- ✅ 样式添加成功
- ✅ 使用站点 CSS 变量(颜色、间距、阴影等)
- ✅ 响应式布局在不同屏幕尺寸下正常工作
- ✅ 浅色和深色主题下样式都正常显示

---

## Task 6: 添加可访问性属性

**描述**: 为 404 页面添加适当的可访问性属性,确保残障用户也能正常使用。

**文件**: `src/pages/404.astro`

**步骤**:
1. 添加语义化 HTML 标签:
   - 使用 `<main>` 包裹主要内容
   - 使用 `<nav>` 包裹导航区域
2. 添加 ARIA 属性:
   - 为导航区域添加 `aria-label="快速导航"`
   - 为错误标题添加适当的层级(h1, h2)
3. 确保键盘导航:
   - 所有链接可通过 Tab 键访问
   - 焦点指示器可见
4. 验证颜色对比度:
   - 文本与背景对比度 >= 4.5:1(WCAG AA)
   - 大文本对比度 >= 3:1(WCAG AA)

**验证**:
- ✅ 语义化 HTML 标签使用正确
- ✅ ARIA 属性添加适当
- ✅ 键盘导航功能正常
- ✅ 颜色对比度符合 WCAG AA 标准

---

## Task 7: 本地开发测试

**描述**: 在本地开发环境中测试 404 页面的功能、样式和链接。

**命令**:
```bash
npm run dev
```

**测试步骤**:
1. 启动开发服务器
2. 访问不存在的 URL(如 `/test-404`)
3. 验证以下功能:
   - ✅ 显示自定义 404 页面而不是 Astro 默认页面
   - ✅ 页面标题和描述显示正确
   - ✅ 错误提示文案清晰友好
   - ✅ 所有导航链接显示正常
   - ✅ Navbar 组件集成正常
4. 测试导航链接:
   - ✅ 点击"首页"链接,跳转到 `/`
   - ✅ 点击"安装指南"链接,跳转到 `/docs/installation/docker-compose`
   - ✅ 点击"快速开始"链接,跳转到 `/docs/quick-start/`
   - ✅ 点击"产品概览"链接,跳转到 `/docs/product-overview`
5. 测试主题切换:
   - ✅ 浅色主题下页面显示正常
   - ✅ 深色主题下页面显示正常
   - ✅ 主题切换无闪烁
6. 测试响应式设计:
   - ✅ 移动设备(width < 768px)下布局正常
   - ✅ 平板设备(768px - 1024px)下布局正常
   - ✅ 桌面设备(> 1024px)下布局正常

**验证**:
- ✅ 所有本地开发测试通过

---

## Task 8: 生产构建测试

**描述**: 运行生产构建,验证 404 页面在生产环境中正常工作。

**命令**:
```bash
npm run build
npm run preview
```

**测试步骤**:
1. 运行生产构建:
   - ✅ 构建成功完成,无错误和警告
   - ✅ `dist/404.html` 文件正确生成
2. 启动预览服务器:
   - ✅ 预览服务器启动成功
3. 访问不存在的 URL:
   - ✅ 显示自定义 404 页面
   - ✅ 页面样式和功能与开发环境一致
   - ✅ 所有导航链接正常工作
   - ✅ 主题切换功能正常

**验证**:
- ✅ 生产构建成功
- ✅ 所有预览测试通过

---

## Task 9: TypeScript 类型检查

**描述**: 运行 TypeScript 类型检查,确保代码符合项目的严格模式要求。

**命令**:
```bash
npm run typecheck
```

**验证标准**:
- ✅ TypeScript 编译成功,无类型错误
- ✅ 所有类型推断正确
- ✅ 无 `any` 类型使用
- ✅ 严格模式检查通过

**注意**:
- 由于 `404.astro` 是纯 Astro 组件(不使用 TypeScript 类型),主要验证导入的组件和工具函数类型正确

---

## Task 10: Base Path 配置测试

**描述**: 测试 404 页面在不同 base path 配置下的链接功能。

**测试场景**:

### 场景 1: 根路径部署 (默认)

**命令**:
```bash
npm run dev
# 或
npm run dev:root
```

**测试步骤**:
1. 访问不存在的 URL
2. 点击所有导航链接
3. 验证:
   - ✅ 首页链接跳转到 `http://localhost:4321/`
   - ✅ 安装指南链接跳转到 `http://localhost:4321/docs/installation/docker-compose`
   - ✅ 快速开始链接跳转到 `http://localhost:4321/docs/quick-start/`
   - ✅ 产品概览链接跳转到 `http://localhost:4321/docs/product-overview`

### 场景 2: 子路径部署

**命令**:
```bash
npm run dev:site
```

**测试步骤**:
1. 访问不存在的 URL(如 `/site/test-404`)
2. 点击所有导航链接
3. 验证:
   - ✅ 首页链接跳转到 `http://localhost:4321/site/`
   - ✅ 安装指南链接跳转到 `http://localhost:4321/site/docs/installation/docker-compose`
   - ✅ 快速开始链接跳转到 `http://localhost:4321/site/docs/quick-start/`
   - ✅ 产品概览链接跳转到 `http://localhost:4321/site/docs/product-overview`

**验证**:
- ✅ 根路径部署测试通过
- ✅ 子路径部署测试通过
- ✅ `withBasePath` 函数在所有场景下正常工作

---

## Task 11: 文档和归档准备

**描述**: 确保 404 页面的实现符合项目规范,并准备相关文档。

**步骤**:
1. 验证代码符合项目规范:
   - ✅ 代码风格与现有代码一致
   - ✅ 使用项目的 CSS 变量和设计系统
   - ✅ 遵循 Astro 和 TypeScript 最佳实践
2. 添加必要的注释:
   - ✅ 文件顶部添加注释说明页面用途
   - ✅ 复杂逻辑添加说明注释(如有)
3. 准备变更说明:
   - ✅ 提交信息清晰描述变更内容
   - ✅ PR 描述包含功能说明和测试结果

**验证**:
- ✅ 代码符合项目规范
- ✅ 文档和注释完整
- ✅ 变更说明清晰

---

## Task 12: 最终验收

**描述**: 执行最终验收检查,确认所有要求都已满足。

**验收清单**:

### 功能完整性
- ✅ `src/pages/404.astro` 文件已创建
- ✅ 访问不存在的 URL 时显示自定义 404 页面
- ✅ 页面包含友好的中文错误提示
- ✅ 页面提供所有必需的导航链接(首页、安装指南、快速开始、产品概览)

### 链接功能
- ✅ 所有链接在根路径部署场景下正常工作
- ✅ 所有链接在子路径部署场景下正常工作
- ✅ `withBasePath` 函数正确处理链接路径

### 主题支持
- ✅ 页面在浅色主题下正常显示
- ✅ 页面在深色主题下正常显示
- ✅ 主题切换无闪烁
- ✅ 文本对比度符合 WCAG AA 标准

### 响应式设计
- ✅ 页面在移动设备(width < 768px)上正确显示
- ✅ 页面在平板设备(768px - 1024px)上正确显示
- ✅ 页面在桌面设备(> 1024px)上正确显示

### 构建和类型检查
- ✅ `npm run build` 成功完成
- ✅ `npm run typecheck` 无类型错误
- ✅ TypeScript 严格模式检查通过
- ✅ 无构建警告

### 可访问性
- ✅ 使用语义化 HTML 标签
- ✅ ARIA 属性添加适当
- ✅ 键盘导航功能正常
- ✅ 焦点指示器可见

### 代码质量
- ✅ 代码风格与项目一致
- ✅ 使用项目 CSS 变量和设计系统
- ✅ 遵循 Astro 和 TypeScript 最佳实践
- ✅ 文档和注释完整

**最终验收**:
- ✅ 所有验收标准通过
- ✅ 变更可以提交和部署

---

## 实施注意事项

1. **样式一致性**: 确保参考 `src/styles/global.css` 和 `index.astro` 的样式,保持视觉一致性。
2. **主题同步**: 确保 404 页面的主题初始化逻辑与 `index.astro` 完全一致,使用 `starlight-theme` localStorage 键。
3. **链接处理**: 所有内部链接必须使用 `withBasePath` 函数处理,确保在不同 base path 配置下都正常工作。
4. **性能优化**: 404 页面应该是纯静态页面,不需要 JavaScript 水合(除了 Navbar 组件)。
5. **无破坏性变更**: 仅新增文件,不修改任何现有文件。

## 完成标准

所有任务完成当且仅当:

1. 所有 Task 1-12 的验收标准都通过
2. 本地开发测试和生产构建测试都成功
3. 根路径和子路径部署场景下的链接功能都正常
4. TypeScript 类型检查通过,无类型错误
5. 代码符合项目规范和最佳实践
6. 所有功能要求、性能要求和可访问性要求都满足
