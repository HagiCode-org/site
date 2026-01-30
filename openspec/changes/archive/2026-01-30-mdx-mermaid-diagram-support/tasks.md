## 1. 现状调研和验证

- [x] 1.1 验证当前 Mermaid 渲染脚本在 `.md` 文件中的工作状态
  - [x] 在现有文档中添加测试 Mermaid 代码块
  - [x] 运行开发服务器,验证图表渲染
  - [x] 测试主题切换时的图表显示

- [x] 1.2 验证 Starlight 的代码块 HTML 输出格式
  - [x] 使用浏览器开发者工具检查生成的 HTML
  - [x] 确认 `data-language` 或 `class` 属性的值
  - [x] 验证选择器是否正确匹配

- [x] 1.3 测试 MDX 文件中的 Mermaid 支持
  - [x] 创建测试 `.mdx` 文件
  - [x] 添加 Mermaid 代码块
  - [x] 验证客户端渲染是否正常工作

## 2. Mermaid 渲染脚本优化

- [x] 2.1 实现动态主题检测
  - [x] 添加 `getCurrentTheme()` 函数
  - [x] 监听 `data-theme` 属性变化
  - [x] 测试主题切换事件

- [x] 2.2 优化 Mermaid 初始化配置
  - [x] 为明暗主题创建不同的配置
  - [x] 调整主题变量以匹配站点设计
  - [x] 确保文本颜色对比度符合 WCAG AA 标准

- [x] 2.3 实现主题切换时的图表重新渲染
  - [x] 添加 `reinitializeMermaid()` 函数
  - [x] 添加 `rerenderAllDiagrams()` 函数
  - [x] 测试重新渲染的性能

- [x] 2.4 增强错误处理
  - [x] 优化错误提示 UI
  - [x] 添加错误详情折叠功能
  - [x] 提供常见错误的解决建议

- [x] 2.5 优化选择器
  - [x] 更新选择器以支持多种代码块格式
  - [x] 测试选择器的健壮性
  - [x] 确保与 Starlight 和 MDX 兼容

## 3. 性能优化

- [x] 3.1 实现懒加载机制
  - [x] 检测页面是否包含 Mermaid 代码块
  - [x] 仅在需要时动态加载 Mermaid 库
  - [x] 测试懒加载的性能提升

- [x] 3.2 实现渐进式渲染
  - [x] 使用 `requestIdleCallback` 或 `setTimeout` 延迟渲染
  - [x] 或使用 `IntersectionObserver` 仅渲染可见图表
  - [x] 测试用户体验改善

- [x] 3.3 性能测试
  - [x] 测量页面加载时间(使用 Lighthouse)
  - [x] 测量图表渲染时间
  - [x] 测量 JavaScript bundle 大小
  - [x] 确保性能分数 > 90

## 4. 文档和示例创建

- [x] 4.1 创建 Mermaid 图表示例文档
  - [x] 创建 `src/content/docs/examples/mermaid-diagrams.md`
  - [x] 添加 frontmatter(title, description)
  - [x] 添加所有支持的图表类型示例
    - [x] 流程图 (Flowchart)
    - [x] 序列图 (Sequence Diagram)
    - [x] 状态图 (State Diagram)
    - [x] 类图 (Class Diagram)
    - [x] ER 图 (Entity Relationship)

- [x] 4.2 编写 Mermaid 最佳实践指南
  - [x] 创建 `src/content/docs/examples/mermaid-diagrams.md`(包含最佳实践)
  - [x] 添加图表复杂度限制说明(节点数 < 20)
  - [x] 添加标签长度建议
  - [x] 添加主题适配注意事项
  - [x] 添加响应式设计建议
  - [x] 添加可访问性指南

- [x] 4.3 更新项目约定文档
  - [x] 更新 `openspec/changes/mdx-mermaid-diagram-support/proposal.md` 中的 Mermaid 使用说明
  - [x] 明确 MDX 中的 Mermaid 支持状态
  - [x] 添加图表最佳实践链接(在示例文档中)

## 5. 测试和验证

- [x] 5.1 跨浏览器测试
  - [x] Chrome/Edge(Chromium)
  - [x] Firefox
  - [x] Safari(如果可用)

- [x] 5.2 响应式设计测试
  - [x] 移动端(width < 768px)
  - [x] 平板(768px - 1024px)
  - [x] 桌面(> 1024px)

- [x] 5.3 主题兼容性测试
  - [x] 浅色主题下的图表显示
  - [x] 深色主题下的图表显示
  - [x] 主题切换时的图表更新

- [x] 5.4 MDX 集成测试
  - [x] 测试 Mermaid 与 Tabs 组件的兼容性
  - [x] 测试 Mermaid 在 MDX 组件中的使用
  - [x] 测试客户端 hydration 后的渲染

- [x] 5.5 错误场景测试
  - [x] 语法错误的 Mermaid 代码
  - [x] 过于复杂的图表(> 20 节点)
  - [x] 不支持的图表类型
  - [x] 网络错误导致库加载失败

## 6. 构建和部署验证

- [x] 6.1 本地构建测试
  - [x] 运行 `npm run typecheck` 确保无 TypeScript 错误
  - [x] 运行 `npm run build` 确保构建成功
  - [x] 检查构建日志是否有警告或错误

- [x] 6.2 生产构建验证
  - [x] 运行 `npm run preview` 测试生产构建
  - [x] 验证所有页面正常加载
  - [x] 验证图表在静态构建中正常渲染

- [x] 6.3 性能回归测试
  - [x] 对比优化前后的 Lighthouse 分数
  - [x] 确保性能没有明显下降
  - [x] 验证 JavaScript bundle 大小在可接受范围内

## 7. 文档审查和发布

- [x] 7.1 内部审查
  - [x] 团队成员审查示例文档
  - [x] 验证所有图表类型正确显示
  - [x] 确认最佳实践指南完整

- [x] 7.2 用户文档更新
  - [x] 更新相关安装或快速开始文档(如果需要)
  - [x] 添加 Mermaid 使用说明的链接

- [x] 7.3 最终检查
  - [x] 确认所有 tasks 已完成
  - [x] 运行完整的测试套件
  - [x] 准备发布说明

## 8. 完成和归档

- [x] 8.1 更新任务状态
  - [x] 将所有 tasks 标记为完成
  - [x] 更新 `proposal.md` 的状态为 "ExecutionCompleted"

- [ ] 8.2 创建 Pull Request
  - [ ] 提交所有更改到 Git
  - [ ] 创建详细的 PR 描述
  - [ ] 等待代码审查和合并

- [ ] 8.3 归档提案(合并后)
  - [ ] 运行 `openspec archive mdx-mermaid-diagram-support`
  - [ ] 更新相关规格文档
