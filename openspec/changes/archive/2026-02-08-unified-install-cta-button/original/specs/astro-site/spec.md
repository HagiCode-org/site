## ADDED Requirements

### Requirement: 统一安装 CTA 按钮

站点 MUST 提供统一的"立即安装"行动号召（CTA）按钮，作为安装相关内容的单一入口点。

#### Scenario: CTA 按钮在导航栏中显示

- **GIVEN** 用户访问站点的任何页面
- **WHEN** 查看主导航栏
- **THEN** 导航栏 MUST 显示一个视觉增强的"立即安装"按钮
- **AND** 该按钮 MUST 使用渐变背景 (`--gradient-primary`)
- **AND** 该按钮 MUST 包含向下箭头图标 (▼) 或下载图标
- **AND** 点击该按钮 MUST 导航至 `/desktop` 页面

#### Scenario: CTA 按钮视觉增强效果

- **GIVEN** CTA 按钮已显示在页面上
- **WHEN** 用户查看按钮样式
- **THEN** 按钮 MUST 应用以下视觉增强:
  - 背景渐变: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-success) 100%)`
  - 发光阴影: `box-shadow: var(--shadow-glow)` (使用 CSS 变量，支持主题自定义)
  - 悬停效果: `transform: translateY(-2px)` + 增强阴影
  - Framer Motion 入场动画 (fade-in + slide-up)

#### Scenario: CTA 按钮响应式设计

- **GIVEN** CTA 按钮已显示在页面上
- **WHEN** 在不同屏幕尺寸上查看
- **THEN** 在移动端 (宽度 < 768px):
  - 按钮 MUST 占据合适的宽度 (全宽或接近全宽)
  - 最小高度 MUST 为 48px (满足触摸目标标准)
  - 内边距 MUST 为 `0.75rem 1.5rem`
- **AND** 在桌面端 (宽度 >= 768px):
  - 按钮 MUST 有适当的水平内边距
  - 最小高度 MUST 为 56px
  - 内边距 MUST 为 `1rem 2rem`

#### Scenario: CTA 按钮主题适配

- **GIVEN** 站点支持亮色、暗色和农历新年主题
- **WHEN** 用户切换主题
- **THEN** CTA 按钮 MUST 自动适配当前主题
- **AND** 按钮颜色 MUST 使用主题 CSS 变量:
  - `--gradient-primary` (渐变背景)
  - `--shadow-glow` (发光效果)
  - `--color-text` (文字颜色)
- **AND** 文字对比度 MUST 符合 WCAG AA 标准 (>= 4.5:1)

#### Scenario: CTA 按钮多主题发光效果自定义

- **GIVEN** 站点支持多个主题（亮色、暗色、农历新年等）
- **WHEN** 在 `src/styles/homepage.css` 中定义样式
- **THEN** MUST 为每个主题定义专用的 `--shadow-glow` CSS 变量
- **AND** 发光颜色 MUST 与各主题的色调协调:
  - 亮色主题: 使用蓝色/青色系发光效果
  - 暗色主题: 使用增强的发光效果以提高可见度
  - 农历新年主题: 使用红色/金色系发光效果
- **AND** 新增主题时 MUST 能够轻松添加对应的 `--shadow-glow` 变量
- **AND** 发光效果 MUST 不影响文字可读性

#### Scenario: CTA 按钮可访问性

- **GIVEN** CTA 按钮已显示在页面上
- **WHEN** 使用键盘导航
- **THEN** 按钮 MUST 可以通过 Tab 键聚焦
- **AND** 聚焦状态 MUST 显示可见的焦点指示器 (`outline: 2px solid var(--color-primary)`)
- **AND** 按钮 MUST 包含描述性的 `aria-label` 或文本内容
- **AND** 按钮 MUST 支持屏幕阅读器正确朗读

#### Scenario: CTA 按钮性能优化

- **GIVEN** CTA 按钮使用 Framer Motion 动画
- **WHEN** 页面加载
- **THEN** 动画 MUST 使用 `viewport: { once: true }` 仅播放一次
- **AND** 动画 MUST 不阻塞初始页面渲染
- **AND** 按钮交互 MUST 响应迅速 (无卡顿)
- **AND** 移动端滚动性能 MUST 不受影响

#### Scenario: CTA 按钮链接目标

- **GIVEN** CTA 按钮已配置
- **WHEN** 用户点击按钮
- **THEN** 按钮 MUST 导航至 Desktop 页面 (`/desktop`)
- **AND** 链接 MUST 使用 `withBasePath` 工具函数处理 base path
- **AND** 链接 MUST 在根部署 (`/`) 和子路径部署 (`/site/`) 下均正常工作

### Requirement: 移除冗余安装相关入口

站点 MUST 移除分散的"安装指南"和"桌面客户端"导航入口，统一使用"立即安装"CTA 按钮作为 Desktop 页面的单一入口点。

**注意**: `src/config/navigation.ts` 是首页导航栏和 Starlight Docs 顶部导航栏的共享数据源。

#### Scenario: 移除导航配置中的安装指南入口

- **GIVEN** `src/config/navigation.ts` 包含导航链接配置
- **WHEN** 检查 `navLinks` 数组
- **THEN** MUST 不包含 label 为 "安装指南" 的链接对象
- **AND** MUST 不包含 label 为 "桌面客户端" 的链接对象（与 CTA 按钮功能重复）
- **AND** 此更改 MUST 同时影响首页和 Starlight Docs 的顶部导航

#### Scenario: 验证首页和 Starlight Docs 顶部导航变更

- **GIVEN** 导航配置已更新
- **WHEN** 查看首页或 Starlight Docs 页面的顶部导航栏
- **THEN** MUST 显示 "立即安装" CTA 按钮
- **AND** MUST NOT 显示 "安装指南" 链接
- **AND** MUST NOT 显示 "桌面客户端" 链接

#### Scenario: 验证 Starlight Docs 侧边栏保持不变

- **GIVEN** 仅更新了 `src/config/navigation.ts`
- **WHEN** 访问任何文档页面
- **THEN** Starlight 侧边栏 MUST 保持不变
- **AND** 侧边栏中的"安装指南"入口 MUST 仍然显示
- **AND** 其他侧边栏项（产品概述、快速开始、相关软件安装）MUST 正常显示

#### Scenario: 验证 Desktop 页面作为安装来源

- **GIVEN** 用户点击"立即安装"CTA 按钮
- **WHEN** 导航至 Desktop 页面
- **THEN** Desktop 页面 (`/desktop/index.astro`) MUST 包含完整的安装信息
- **AND** 页面 MUST 提供桌面客户端下载选项
- **AND** 页面 MUST 包含安装指南链接或内容
- **AND** 页面 MUST 支持不同平台的安装说明

#### Scenario: 用户从旧链接重定向

- **GIVEN** 用户有旧的"安装指南"书签或链接 (`/installation/docker-compose`)
- **WHEN** 访问该链接
- **THEN** 链接 MAY 继续工作（如果保留文档内容）
- **OR** 链接 MAY 重定向至 `/desktop` 页面（如果移除旧文档）
- **AND** 用户 MUST 能够找到所需的安装信息
