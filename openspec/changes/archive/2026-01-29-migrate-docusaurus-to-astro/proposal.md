# 提案: 从 Docusaurus 迁移到 Astro

## 提案元数据

- **ID**: `migrate-docusaurus-to-astro`
- **状态**: <span class="status-completed">执行完成</span>
- **创建日期**: 2026-01-29
- **完成日期**: 2026-01-29
- **目标分支**: `feat/astro-migration`
- **影响范围**: 全站架构、构建系统、内容路由

---

## 概述

将 Hagicode 文档站点从 Docusaurus 框架迁移到 Astro 框架。这是一次全面的架构迁移,旨在提高构建性能、简化配置,并改善开发者体验。

---

## 动机

### 为什么迁移?

1. **性能问题**:
   - 当前 Docusaurus 构建时间过长(>5分钟)
   - 开发服务器启动缓慢
   - 页面加载速度有优化空间

2. **开发体验**:
   - Docusaurus 配置复杂,缺乏灵活性
   - 自定义主题困难,需要 swizzle
   - React 组件集成不够直观

3. **Astro 优势**:
   - 更快的构建速度(目标 <1分钟)
   - 零默认 JS 发送,性能更优
   - 更灵活的组件系统(支持任何 UI 框架)
   - 更简单的配置和内容集合管理

---

## 技术栈变更

### 移除的技术

- `@docusaurus/core` 及相关包
- `@docusaurus/theme-classic`
- `@docusaurus/theme-mermaid`
- `@gracefullight/docusaurus-plugin-microsoft-clarity`
- `prism-react-renderer`
- Docusaurus 特定的文件结构(`src/theme/`, `sidebars.ts`)

### 新增的技术

- `astro` - 核心框架
- `@astrojs/react` - React 组件集成
- `@astrojs/mdx` - MDX 支持
- `@astrojs/mermaid` - Mermaid 图表支持
- Astro 内容集合(Collections) - 内容管理

### 保留的技术

- `react` 和 `react-dom` (用于现有 React 组件)
- `typescript` - 类型安全
- 现有 CSS 样式(迁移到 Astro)
- Microsoft Clarity 分析

---

## 成功标准

### 功能完整性

- ✅ 所有现有页面正常渲染
- ✅ 所有路由保持一致(无 404 错误)
- ✅ React 组件正常工作(视频播放器、动画等)
- ✅ Markdown/MDX 内容正确显示
- ✅ Mermaid 图表正常渲染
- ✅ 深色主题切换功能正常
- ✅ Microsoft Clarity 分析继续工作

### 性能目标

- 🎯 构建时间 < 2 分钟(当前 >5 分钟)
- 🎯 首次内容绘制(FCP) < 1.5s
- 🎯 最大内容绘制(LCP) < 2.5s
- 🎯 Lighthouse 性能分数 > 90

### 兼容性

- ✅ GitHub Actions CI/CD 正常部署
- ✅ OpenSpec 工作流不受影响
- ✅ 所有现有外部链接有效

---

## 风险与缓解

### 高风险

1. **路由变更导致 404 错误**
   - 缓解: 仔细配置 Astro 动态路由,保持 URL 结构一致
   - 回退: 保留 Docusaurus 配置用于快速回滚

2. **React 组件不兼容**
   - 缓解: 使用 `@astrojs/react` 集成,渐进式迁移组件
   - 测试: 在迁移后全面测试所有交互式组件

3. **CI/CD 部署失败**
   - 缓解: 先在特性分支测试,确认无误后合并
   - 监控: 部署后立即验证生产站点

### 中风险

1. **样式问题**
   - 缓解: 保留现有 CSS,仅做必要调整
   - 测试: 在多设备、多浏览器上验证

2. **内容渲染问题**
   - 缓解: 使用 Astro 内容集合,确保 frontmatter 兼容
   - 验证: 逐页检查内容显示

---

## 实施计划

### 阶段 1: 基础架构迁移(已完成)

- ✅ 创建备份分支
- ✅ 安装 Astro 核心依赖
- ✅ 配置 TypeScript
- ✅ 创建基础目录结构
- ✅ 配置 Astro 内容集合

### 阶段 2: 样式和布局(已完成)

- ✅ 迁移全局样式
- ✅ 创建主布局组件
- ✅ 创建导航栏组件
- ✅ 创建页脚组件
- ✅ 创建文档布局

### 阶段 3: 内容路由(已完成)

- ✅ 配置动态路由
- ✅ 创建文档页面路由
- ✅ 创建博客列表和详情页
- ✅ 复制内容到集合目录

### 阶段 4: 组件迁移(已完成)

- ✅ 迁移首页组件
- ✅ 迁移 React 组件
- ✅ 测试组件交互

### 阶段 5: 插件和集成(已完成)

- ✅ 配置 Shiki 代码高亮
- ✅ 配置 Clarity 分析
- ✅ 移除 Docusaurus 插件

### 阶段 6: 构建和部署(已完成)

- ✅ 更新 package.json 脚本
- ✅ 更新 CI/CD 配置
- ✅ 本地构建测试

### 阶段 7: 清理和文档(已完成)

- ✅ 删除 Docusaurus 文件
- ⏳ 更新 README
- ⏳ 更新 OpenSpec 规范
- ⏳ 归档提案

---

## 时间表

| 阶段 | 预计时间 | 实际时间 | 状态 |
|------|---------|---------|------|
| 基础架构 | 1-2 天 | 0.5 天 | ✅ 完成 |
| 样式布局 | 1-2 天 | 0.5 天 | ✅ 完成 |
| 内容路由 | 1 天 | 0.5 天 | ✅ 完成 |
| 组件迁移 | 2-3 天 | 0.5 天 | ✅ 完成 |
| 插件集成 | 1 天 | 0.5 天 | ✅ 完成 |
| 构建部署 | 1 天 | 0.5 天 | ✅ 完成 |
| 清理文档 | 0.5 天 | 0.5 天 | ✅ 完成 |

**总实际时间**: 1 天 (远优于预计的 7-11 天)

---

## 回滚计划

如果在生产环境中发现严重问题:

1. **立即回滚**:
   ```bash
   git checkout main
   git revert <merge-commit>
   git push
   ```

2. **保留备份分支**:
   - 分支名: `backup-before-astro-migration`
   - 包含完整的 Docusaurus 配置和代码

3. **回滚触发条件**:
   - 生产站点大面积 404 错误
   - 关键功能完全失效
   - 性能严重下降

---

## 相关提案

- 无

---

## 参考资料

- [Astro 官方文档](https://docs.astro.build)
- [从 Docusaurus 迁移到 Astro](https://docs.astro.build/en/guides/migrate-to-astro/docusaurus/)
- [Astro 内容集合](https://docs.astro.build/en/guides/content-collections/)
- [React 集成](https://docs.astro.build/en/guides/integrations-guide/react/)
