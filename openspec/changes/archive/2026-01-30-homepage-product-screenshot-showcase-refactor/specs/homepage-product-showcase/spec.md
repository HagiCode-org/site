# Homepage Product Showcase Capability

此规范定义首页产品展示区域的能力和要求,包括产品功能截图展示和可视化组件。

---

## ADDED Requirements

### Requirement: 展示产品功能截图

首页 MUST 包含产品功能截图展示区域,通过实际界面截图直观展示 Hagicode 的核心功能。截图展示组件 SHALL 使用语义化 HTML 元素(如 `<figure>` 和 `<figcaption>`),每张截图 MUST 配有清晰的功能标题和简洁的中文说明文字。截图 SHOULD 按逻辑顺序排列,从整体界面到具体功能,帮助用户快速了解产品特性和价值。

#### Scenario: 用户访问首页查看产品功能展示

**Given** 用户访问 Hagicode 文档站首页
**When** 用户滚动到产品展示区域
**Then** 应展示 6 张产品功能截图,包括:
  - 亮色主题主界面
  - 暗色主题主界面
  - 实时 token 消耗报告
  - 使用 AI 的效率提升报告
  - 每日成就报告
  - 每日编写代码获得的成就

#### Scenario: 用户查看截图内容和说明

**Given** 产品展示区域已渲染
**When** 用户查看每张截图
**Then** 每张截图应包含:
  - 高质量的界面截图(PNG 格式)
  - 清晰的功能标题(中文)
  - 简洁的功能说明(1-2 句话,约 20-30 字)
  - 语义化的 alt 文本

---

### Requirement: 响应式网格布局

产品截图 MUST 采用响应式网格布局,SHALL 使用 CSS Grid 技术实现不同设备尺寸下的自适应显示。桌面端(≥996px) MUST 显示 3 列网格,平板端(768-995px) SHOULD 显示 2 列网格,移动端(<768px) MUST 显示单列垂直堆叠布局。网格间距 MUST 根据设备尺寸适当调整,确保布局整齐美观,无错位或重叠。

#### Scenario: 桌面端用户查看截图展示

**Given** 用户使用桌面设备(屏幕宽度 ≥ 996px)
**When** 用户查看产品展示区域
**Then** 截图应以 3 列网格布局显示
**And** 每列宽度相等,间距 2rem
**And** 布局整齐,无错位或重叠

#### Scenario: 平板用户查看截图展示

**Given** 用户使用平板设备(屏幕宽度 768-995px)
**When** 用户查看产品展示区域
**Then** 截图应以 2 列网格布局显示
**And** 间距调整为 1.5rem
**And** 保持布局清晰可读

#### Scenario: 移动端用户查看截图展示

**Given** 用户使用移动设备(屏幕宽度 < 768px)
**When** 用户查看产品展示区域
**Then** 截图应以单列垂直堆叠显示
**And** 间距 1.5rem
**And** 标题和描述文字大小适配移动端

---

### Requirement: 交互和视觉反馈

截图卡片 MUST 提供丰富的悬停交互效果,SHALL 使用 CSS 过渡动画增强用户体验和视觉吸引力。悬停时,卡片 SHOULD 向上平移、边框颜色高亮、显示增强阴影效果,并 MUST 保持流畅的动画过渡(约 300ms)。交互效果 MUST 遵循项目的科技感设计风格(HUD/Sci-Fi FUI + Glassmorphism),并 SHALL 支持亮色/暗色主题切换。

#### Scenario: 用户悬停在截图卡片上

**Given** 产品展示区域已渲染
**When** 用户将鼠标悬停在截图卡片上
**Then** 卡片应向上平移 8px
**And** 边框颜色高亮(亮色主题为蓝色,暗色主题为青色)
**And** 显示增强的阴影效果
**And** 过渡动画流畅(时长约 300ms)

#### Scenario: 用户切换主题

**Given** 用户正在查看产品展示区域
**When** 用户切换亮色/暗色主题
**Then** 截图卡片样式应即时响应主题变化
**And** 亮色主题:蓝色高亮,浅色背景
**And** 暗色主题:青色高亮,深色玻璃态背景
**And** 文字对比度符合 WCAG AA 标准

---

### Requirement: 图片加载和错误处理

组件 MUST 正确处理图片加载状态和错误情况,SHALL 提供良好的用户体验。图片 MUST 使用 Astro 的 `client:idle` 指令实现延迟加载,减少初始页面加载时间。加载时 SHOULD 显示淡入动画或占位符,提升视觉体验。当图片加载失败(文件缺失或路径错误)时,MUST 隐藏损坏的图片元素并 SHALL 显示友好的占位符,保持布局稳定性。

#### Scenario: 图片加载成功

**Given** 用户访问首页
**When** 产品展示区域进入视口
**Then** 截图应延迟加载(使用 `client:idle`)
**And** 图片加载时显示淡入动画
**And** 加载完成后图片清晰显示

#### Scenario: 图片加载失败

**Given** 截图文件缺失或路径错误
**When** 组件尝试加载图片
**Then** 应隐藏损坏的图片元素
**And** 显示占位符,提示"图片加载失败"
**And** 占位符保持与其他截图相同的尺寸比例
**And** 不影响其他截图的正常显示

---

### Requirement: 组件性能优化

组件 MUST 优化加载性能,SHALL 减少初始页面加载时间,确保良好的用户体验。MUST 使用 Astro 的 `client:idle` 指令实现延迟加载,避免阻塞首屏内容渲染。图片资源总大小 SHOULD 控制在合理范围内(建议 < 1MB),MAY 考虑使用 WebP 格式进一步压缩。组件 SHOULD 使用浏览器原生懒加载和 CSS 动画优化,确保快速渲染和流畅交互。

#### Scenario: 首页初始加载

**Given** 用户首次访问首页
**When** 页面开始加载
**Then** 产品展示组件应在浏览器空闲时加载(`client:idle`)
**And** 不阻塞首屏内容(HeroSection、FeaturesShowcase)的渲染
**And** 页面加载时间(LCP)不受显著影响

#### Scenario: 图片资源优化

**Given** 产品展示区域包含 6 张截图
**When** 测量图片资源大小
**Then** 总大小应控制在 1MB 以内
**And** 可考虑使用 WebP 格式减少 30-40% 体积(可选优化)
**And** 使用浏览器原生懒加载(`<img loading="lazy">`)

---

## MODIFIED Requirements

### Requirement: 首页内容结构

更新首页组件结构,MUST 将 ShowcaseSection 从"社区项目链接"改为"产品功能截图展示"。修改后的组件 SHALL 展示 Hagicode 的实际界面截图和功能演示,而 MUST NOT 展示外部项目链接。组件在首页内容流中的位置 MUST 保持不变(位于 FeaturesShowcase 之后,QuickStartSection 之前),但内容定位 SHOULD 从"社区展示"改为"产品展示",更符合首页营销和产品介绍的目标。

**之前**: ShowcaseSection 展示外部项目链接(Hagicode CLI、Docs、Templates)
**之后**: ShowcaseSection 展示产品功能截图和界面演示

#### Scenario: 用户浏览首页内容流

**Given** 用户访问首页并向下滚动
**When** 用户依次浏览各个区域
**Then** 内容流应按以下顺序展示:
  1. HeroSection - 首屏 Hero 区域
  2. ActivityMetricsSection - 活动指标数据
  3. FeaturesShowcase - 特性展示
  4. **ShowcaseSection - 产品截图展示**(修改)
  5. QuickStartSection - 快速开始指南

#### Scenario: 用户理解产品定位

**Given** ShowcaseSection 已渲染为产品截图展示
**When** 用户查看截图内容
**Then** 用户应能直观了解:
  - Hagicode 的界面设计和布局
  - 主题切换功能(亮色/暗色)
  - 会话管理和 token 监控能力
  - 效率统计和成就系统
**And** 无需点击外部链接即可获取产品信息

---

## REMOVED Requirements

### Requirement: 外部项目链接展示

**描述**: 移除 ShowcaseSection 中的社区项目外部链接功能。

**之前**: 组件展示指向 GitHub 仓库的外部链接(Hagicode CLI、Docs、Templates)
**之后**: 不再包含外部链接,改为展示产品截图

#### Scenario: 用户寻找社区项目链接

**Given** 用户访问首页
**When** 用户查看 ShowcaseSection 区域
**Then** 不应显示指向外部 GitHub 仓库的链接卡片
**And** 如需访问社区项目,用户应:
  - 使用导航栏中的"社区"或"资源"链接(如存在)
  - 或直接访问 GitHub 组织页面

---

## 技术约束

### Requirement: 技术实现规范

**描述**: 组件实现应符合项目技术栈和代码规范。

#### Scenario: TypeScript 类型安全

**Given** 组件使用 TypeScript 编写
**When** 运行 `npm run typecheck`
**Then** 应通过类型检查,无错误
**And** `ScreenshotItem` 接口定义完整
**And** 数据结构类型正确

#### Scenario: 生产构建验证

**Given** 组件代码已完成
**When** 运行 `npm run build`
**Then** 构建应成功,无错误或警告
**And** 图片资源正确复制到 `dist/img/home/`
**And** 组件在构建后正常渲染

#### Scenario: 浏览器兼容性

**Given** 组件使用现代 CSS 特性(Grid、backdrop-filter)
**When** 在主流浏览器中测试
**Then** 应支持以下浏览器:
  - Chrome/Edge 最新版本
  - Firefox 最新版本
  - Safari 最新版本
  - 移动端浏览器(iOS Safari、Chrome Mobile)
**And** 降级方案优雅处理不支持的特性

---

## 可访问性要求

### Requirement: 无障碍访问支持

**描述**: 组件应符合 WCAG 2.1 AA 标准,确保所有用户可访问。

#### Scenario: 屏幕阅读器用户访问

**Given** 用户使用屏幕阅读器
**When** 用户浏览产品展示区域
**Then** 每张截图应提供描述性 alt 文本
**And** 使用 `<figure>` 和 `<figcaption>` 语义化标签
**And** 标题和描述文字正确朗读

#### Scenario: 键盘导航用户访问

**Given** 用户使用键盘导航
**When** 用户聚焦到产品展示区域
**Then** 区域应可正常浏览
**And** 无交互陷阱(如无边界的焦点移动)
**And** 如添加未来交互(如放大查看),应支持键盘激活

#### Scenario: 色盲用户访问

**Given** 用户患有色盲或色彩视觉障碍
**When** 用户查看产品展示区域
**Then** 信息传达不应仅依赖颜色
**And** 文字对比度应 ≥ 4.5:1(正文)
**And** 大文本对比度应 ≥ 3:1(标题)
**And** 悬停状态应通过多种方式传达(阴影、缩放、边框)

---

## 维护性要求

### Requirement: 内容更新流程

**描述**: 组件设计应便于后续内容更新和维护。

#### Scenario: 更新产品截图

**Given** 产品界面更新,需要替换截图
**When** 维护人员更新 `/public/img/home/` 目录中的图片文件
**Then** 应只需替换图片文件,无需修改代码(如文件名不变)
**And** 如需添加新截图,在 `screenshots` 数组中添加新项即可
**And** 组件应自动适应新增内容

#### Scenario: 更新截图说明文案

**Given** 需要优化或更新功能说明文字
**When** 维护人员编辑 `ShowcaseSection.tsx` 中的 `description` 字段
**Then** 应在单一位置修改(组件内部)
**And** 文案长度保持一致(建议 1-2 句话)
**And** 更新后运行类型检查和构建验证

---

## 非功能要求

### Requirement: 性能指标

**描述**: 组件应满足性能和用户体验指标。

#### Scenario: 首页性能测试

**Given** 用户使用 3G 网络访问首页
**When** 测量页面加载性能
**Then** 首屏内容时间(LCP)应 < 2.5s
**And** 产品展示组件延迟加载,不影响首屏
**And** 累积布局偏移(CLS)应 < 0.1

#### Scenario: 图片加载性能

**Given** 用户访问首页
**When** 产品展示区域加载完成
**Then** 所有 6 张截图应在 5 秒内完成加载(3G 网络)
**And** 提供加载状态指示或占位符
**And** 避免布局抖动(使用 `aspect-ratio` 固定尺寸)

---

## 验收标准

### Requirement: 功能完整性检查清单

**描述**: 确保所有功能需求正确实现。

#### Scenario: 最终验收测试

**Given** 开发工作已完成
**When** 进行最终验收测试
**Then** 应验证以下所有项:
  - ✅ 6 张产品截图正确展示
  - ✅ 截图顺序:亮色主题→暗色主题→token 报告→效率报告→成就报告→成就详情
  - ✅ 每张截图包含标题和描述
  - ✅ 响应式布局支持桌面/平板/移动端
  - ✅ 悬停效果和过渡动画流畅
  - ✅ 主题切换功能正常(亮色/暗色)
  - ✅ 图片加载错误处理正确
  - ✅ TypeScript 类型检查通过
  - ✅ 生产构建成功
  - ✅ 主流浏览器兼容性良好
  - ✅ 控制台无错误或警告
  - ✅ 无障碍访问标准符合 WCAG AA
  - ✅ 性能指标满足要求(LCP < 2.5s, CLS < 0.1)
