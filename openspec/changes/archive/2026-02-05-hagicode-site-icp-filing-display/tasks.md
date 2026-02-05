# 实施任务清单

## 1. 首页 Footer 实现

- [ ] 1.1 在 `src/components/home/Footer.tsx` 中添加备案信息 JSX 结构
  - 在版权区块 (`copyrightSection`) 下方添加新的备案信息区块
  - 使用语义化的 HTML 结构 (`<div className={styles.icpSection}>`)
  - 添加备案号文本: `闽ICP备2026004153号-1`
  - 添加指向工信部备案系统的链接 (`https://beian.miit.gov.cn/`)
  - 链接使用外部链接属性: `target="_blank" rel="noopener noreferrer"`
  - 添加适当的 ARIA 标签: `aria-label="查看 ICP 备案信息"`

- [ ] 1.2 在 `src/components/home/Footer.module.css` 中添加备案信息样式
  - 定义 `.icpSection` 样式类
    - `margin-top: 1rem` - 与版权区块保持间距
    - `text-align: center` - 居中对齐
    - `color: var(--color-text-secondary)` - 使用次要文本颜色变量
  - 定义 `.icpLink` 样式类
    - `color: inherit` - 继承父元素颜色
    - `text-decoration: none` - 默认无下划线
    - `:hover` 状态: `text-decoration: underline` - 悬停时显示下划线
  - 确保字体大小与 Footer 整体风格一致 (0.875rem)

## 2. 文档页面 Footer 实现

- [ ] 2.1 修改 `src/components/StarlightFooter.astro` 添加备案信息
  - 利用 Starlight Footer 的 `<slot />` 机制注入备案信息
  - 添加语义化的 HTML 结构
  - 使用 Astro 组件语法确保静态生成时正确渲染
  - 添加备案号和链接 (与首页保持一致)

- [ ] 2.2 创建文档页面备案信息样式
  - 在 `src/styles/starlight-override.css` 中添加样式规则
  - 使用 Starlight CSS 变量确保主题一致性:
    - `color: var(--sl-color-gray-3)` - 次要文本颜色
    - `font-size: var(--sl-text-sm)` - 小号字体
  - 添加链接样式:
    - `color: var(--sl-color-text-accent)` - 强调色
    - `:hover` 状态: `text-decoration: underline`
  - 确保响应式布局正确 (移动端字体大小适中)

## 3. 验证与测试

- [ ] 3.1 本地开发验证
  - 运行 `npm run dev` 启动开发服务器
  - 访问首页 (`/`) 验证 Footer 备案信息显示正确
  - 访问文档页面 (如 `/product-overview/`) 验证 Footer 备案信息显示正确
  - 检查备案号链接点击后正确跳转至 https://beian.miit.gov.cn/
  - 验证链接在新标签页打开

- [ ] 3.2 主题兼容性测试
  - 在首页测试深色/浅色/农历新年主题下的显示效果
  - 在文档页面测试 Starlight 主题切换时的显示效果
  - 确保备案信息在所有主题下均可清晰阅读
  - 检查 CSS 变量在主题切换时正确应用

- [ ] 3.3 响应式测试
  - 使用浏览器开发者工具模拟移动端视口 (375px, 768px)
  - 验证备案信息在移动设备上的布局和可读性
  - 确保字体大小在移动端适中 (建议不小于 12px)
  - 检查链接在触摸设备上易于点击

- [ ] 3.4 构建验证
  - 运行 `npm run build` 执行生产构建
  - 确保构建成功,无 TypeScript 错误
  - 检查构建输出中包含备案信息相关代码
  - 运行 `npm run preview` 在生产模式下验证显示效果

- [ ] 3.5 类型检查
  - 运行 `npm run typecheck` 验证 TypeScript 类型正确性
  - 确保新增的组件 Props 和样式类定义正确

## 4. 合规性验证

- [ ] 4.1 备案信息完整性检查
  - 确认备案号 `闽ICP备2026004153号-1` 显示正确
  - 确认链接指向 https://beian.miit.gov.cn/
  - 确认备案信息在首页和所有文档页面均可见
  - 确认位置在页面底部且符合"显著位置"要求

- [ ] 4.2 可访问性检查
  - 验证链接有适当的 `aria-label` 属性
  - 验证颜色对比度符合 WCAG AA 标准 (至少 4.5:1)
  - 验证屏幕阅读器能正确朗读备案信息

## 5. 文档更新 (可选)

- [ ] 5.1 更新项目文档 (如需要)
  - 在 `openspec/project.md` 的"Recent Changes"部分记录此变更
  - 添加关于合规性要求的说明
