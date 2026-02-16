## ADDED Requirements

### Requirement: Desktop 页面快速安装区域样式

Desktop 页面 (`apps/website/src/pages/desktop/index.astro`) 的快速安装区域（位于 FAQ 上方，使用静态 HTML 结构）必须具有清晰的视觉层次和交互状态，与页面设计系统（HUD/Sci-Fi FUI + Glassmorphism）保持一致。

#### Scenario: 快速安装区域视觉层次

- **GIVEN** 用户访问 Desktop 页面并滚动到快速安装区域
- **WHEN** 快速安装区域被渲染
- **THEN** 该区域必须显示为具有清晰视觉层次的步骤卡片组，而非纯文本
- **AND** 4 个步骤卡片必须具有明显的玻璃态效果（glassmorphism）
- **AND** 每个步骤卡片必须包含渐变背景的圆形编号徽章
- **AND** 步骤卡片必须使用网格布局（桌面端四列，平板端两列，移动端单列）

#### Scenario: 步骤卡片交互状态

- **GIVEN** 快速安装区域的步骤卡片已显示
- **WHEN** 用户将鼠标悬停在步骤卡片上
- **THEN** 卡片必须显示增强的视觉反馈（背景变深、边框高亮、阴影增强）
- **AND** 卡片必须向上平移 4px
- **AND** 过渡动画必须平滑（约 300ms）
- **AND** 光标必须变为 pointer

- **WHEN** 用户使用 Tab 键聚焦到步骤卡片
- **THEN** 卡片必须显示焦点环（3px 蓝色轮廓 + 6px 半透明外发光）
- **AND** 焦点样式必须清晰可见
- **AND** 焦点顺序必须符合逻辑（从左到右，从上到下）

#### Scenario: 步骤卡片样式规范

- **GIVEN** 快速安装区域的步骤卡片已显示
- **WHEN** 查看卡片的正常状态样式
- **THEN** 卡片背景必须是半透明白色（rgba(255, 255, 255, 0.08)）加上 backdrop-filter
- **AND** 卡片边框必须是 1px 半透明白色（rgba(255, 255, 255, 0.15)）
- **AND** 卡片圆角必须是 0.75rem
- **AND** 卡片阴影必须是轻微的（0 2px 8px rgba(0, 0, 0, 0.1)）
- **AND** 卡片内边距必须是 1.5rem
- **AND** 步骤编号必须是圆形的（48x48px），具有蓝→青→绿渐变背景

#### Scenario: 主题适配一致性

- **GIVEN** 站点支持多主题（light、dark、lunar-new-year）
- **WHEN** 用户切换主题
- **THEN** 快速安装区域的所有元素必须适配当前主题
- **AND** 步骤卡片的背景和边框颜色必须与主题一致
- **AND** 步骤编号的渐变背景必须正确应用：
  - light/dark 主题: 蓝→青→绿 渐变
  - lunar-new-year 主题: 红→橙→金 渐变
- **AND** 标题和描述文字颜色必须与主题一致
- **AND** 所有文字对比度必须 >= 4.5:1（WCAG AA 标准）

#### Scenario: 响应式设计

- **GIVEN** 快速安装区域在不同设备上显示
- **WHEN** 在桌面端（宽度 >= 768px）查看
- **THEN** 步骤卡片必须显示为四列网格布局
- **AND** 卡片之间的间距必须是 1.5rem

- **WHEN** 在平板端（481px - 768px）查看
- **THEN** 步骤卡片必须显示为两列网格布局
- **AND** 卡片之间的间距必须是 1rem

- **WHEN** 在移动端（宽度 <= 480px）查看
- **THEN** 步骤卡片必须显示为单列垂直堆叠布局
- **AND** 卡片之间的间距必须是 0.875rem
- **AND** 触摸目标尺寸必须符合移动设备标准（最小 44x44px）

#### Scenario: 可访问性支持

- **GIVEN** 用户使用键盘导航或辅助技术
- **WHEN** 用户使用 Tab 键导航到步骤卡片
- **THEN** 焦点必须可见（3px 蓝色轮廓 + 6px 半透明外发光）
- **AND** 焦点顺序必须符合逻辑（从左到右，从上到下）
- **WHEN** 用户使用屏幕阅读器
- **THEN** 步骤卡片必须使用语义化 HTML 标签（section、h2、div、h3、p）
- **AND** 步骤编号必须被屏幕阅读器正确识别
- **AND** 标题和描述文字必须清晰表达步骤内容

#### Scenario: 全局样式管理

- **GIVEN** 快速安装区域使用静态 HTML 结构
- **WHEN** 样式被应用
- **THEN** 所有样式必须通过 desktop.css 全局样式表管理
- **AND** 样式类名必须是 .installation-steps、.steps-grid、.step-card、.step-number
- **AND** 样式不得泄漏到其他组件（使用明确的类名选择器）
- **AND** 样式必须支持通过 data-theme 属性进行主题切换

#### Scenario: 性能优化

- **GIVEN** 快速安装区域包含过渡动画和玻璃态效果
- **WHEN** 页面加载
- **THEN** 动画必须使用 transform 和 opacity（避免重排）
- **AND** 动画帧率必须 >= 60fps
- **WHEN** 用户系统设置了 `prefers-reduced-motion: reduce`
- **THEN** 所有过渡动画必须被禁用
- **AND** 元素交互（悬停、焦点）必须保持功能，但不显示动画效果
