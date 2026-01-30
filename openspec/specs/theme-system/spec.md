# theme-system Specification

## Purpose
TBD - created by archiving change theme-toggle-implementation. Update Purpose after archive.
## Requirements
### Requirement: 主题切换功能

系统 SHALL 提供用户在亮色和暗色主题之间切换的功能，以支持不同环境光线下的阅读需求和用户个性化偏好。

#### Scenario: 用户通过导航栏按钮切换主题

- **WHEN** 用户点击导航栏右侧的主题切换按钮
- **THEN** 系统应立即切换当前主题（亮色 ↔ 暗色）
- **AND** 页面所有元素应平滑过渡到新主题的配色方案
- **AND** 主题切换按钮图标应更新为对应状态（月亮图标 ↔ 太阳图标）
- **AND** 切换过程中应显示流畅的旋转和缩放动画（300ms）

#### Scenario: 用户刷新页面后主题保持不变

- **WHEN** 用户已选择某个主题并刷新页面或重新访问站点
- **THEN** 系统应自动应用用户之前选择的主题
- **AND** 页面加载时不应出现主题闪烁（FOUC）
- **AND** 用户无需重新选择主题

#### Scenario: 首次访问默认使用暗色主题

- **WHEN** 用户首次访问文档站点
- **AND** 用户浏览器 localStorage 中无保存的主题偏好
- **THEN** 系统应默认应用暗色主题（`data-theme="dark"`）
- **AND** 所有页面元素应使用暗色配色方案渲染

#### Scenario: 移动端用户通过菜单切换主题

- **WHEN** 移动端用户点击汉堡菜单并选择主题选项
- **THEN** 系统应切换到选中的主题
- **AND** 侧边栏菜单应自动关闭
- **AND** 页面应立即应用新主题

### Requirement: 主题状态持久化

系统 SHALL 将用户选择的主题持久化保存到浏览器 localStorage,确保用户的主题偏好在页面刷新和重新访问时得以保持。**此要求被修改以支持三种主题而非仅两种。**

#### Scenario: 主题切换后保存到 localStorage

- **WHEN** 用户切换主题
- **THEN** 系统应使用键名 `starlight-theme` 将主题值保存到 localStorage
- **AND** 主题值应为 `'light'`、`'dark'` 或 `'lunar-new-year'` 之一
- **AND** 保存操作应在主题切换动作执行后立即进行
- **AND** 保存操作不应阻塞主题切换的视觉反馈

#### Scenario: 页面加载时从 localStorage 读取主题

- **WHEN** 用户访问站点任意页面
- **THEN** 系统应首先尝试从 localStorage 读取保存的主题
- **AND** 如果读取到有效的主题值(`'light'`、`'dark'` 或 `'lunar-new-year'`),应应用该主题
- **AND** 如果读取失败或值无效,应应用智能默认逻辑(农历新年主题或系统偏好)

---

### Requirement: 系统主题偏好检测

系统 SHALL 支持检测操作系统的主题偏好（prefers-color-scheme），在用户未手动选择主题时自动跟随系统设置。

#### Scenario: 未手动设置时跟随系统主题

- **WHEN** 用户未手动选择主题（localStorage 中无保存值）
- **AND** 用户操作系统设置为暗色模式
- **THEN** 系统应检测到系统偏好并应用暗色主题
- **AND** 主题状态应标记为系统偏好（非用户手动选择）

#### Scenario: 用户手动选择后不跟随系统变化

- **WHEN** 用户已手动选择主题（localStorage 中有保存值）
- **AND** 操作系统主题偏好发生变化
- **THEN** 系统应保持用户手动选择的主题不变
- **AND** 不应响应系统主题偏好变化事件

#### Scenario: 系统偏好动态变化时自动更新

- **WHEN** 用户未手动选择主题
- **AND** 操作系统主题偏好发生变化（如日落后自动切换）
- **THEN** 系统应监听 `prefers-color-scheme` 媒体查询变化事件
- **AND** 应自动更新站点主题以匹配新的系统偏好
- **AND** 主题切换应包含平滑的过渡动画

### Requirement: 主题初始化与防止闪烁

系统 SHALL 在页面渲染前初始化主题,防止出现主题闪烁(Flash of Unstyled Content, FOUC)现象。**此要求被修改以包含智能默认逻辑。**

#### Scenario: 页面加载前应用主题

- **WHEN** 浏览器开始解析 HTML 文档
- **THEN** 系统应在 `<head>` 部分执行内联脚本检测主题
- **AND** 内联脚本应在页面内容渲染前同步执行
- **AND** 应立即设置 `<html>` 元素的 `data-theme` 属性
- **AND** 主题检测逻辑应包含智能默认机制:

```javascript
// 优先级: 用户偏好 > 智能默认 > 系统偏好
const stored = localStorage.getItem('starlight-theme');
if (stored) {
  // 用户已有主题偏好,使用其选择
  document.documentElement.setAttribute('data-theme', stored);
} else {
  // 用户无主题偏好,应用智能默认
  const isLunarNewYearPeriod = checkLunarNewYearPeriod(); // 2月1日-3月1日
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = isLunarNewYearPeriod ? 'lunar-new-year' : system;
  document.documentElement.setAttribute('data-theme', theme);
}
```

#### Scenario: SSR 阶段设置默认主题

- **WHEN** Astro 服务端渲染 HTML
- **THEN** `<html>` 根元素应预设 `data-theme="dark"` 属性作为降级方案
- **AND** 客户端 hydration 时应能正确识别并调整主题
- **AND** 调整逻辑应遵循智能默认机制

---

### Requirement: 样式系统与 CSS 变量

系统 SHALL 通过 CSS 自定义属性（CSS Variables）实现主题切换，确保所有组件在亮色和暗色主题下均正常显示。

#### Scenario: CSS 变量定义主题颜色

- **WHEN** 系统定义主题样式
- **THEN** 应在 `:root` 选择器中定义亮色主题的 CSS 变量
- **AND** 应在 `[data-theme='dark']` 选择器中定义暗色主题的 CSS 变量
- **AND** 每个主题的颜色变量应成对定义（如 `--color-background`）
- **AND** CSS 变量命名应使用 `--color-*` 前缀以保持一致性

#### Scenario: 组件使用 CSS 变量引用主题颜色

- **WHEN** 组件需要引用主题颜色
- **THEN** 应使用 `var(--color-background)` 等 CSS 变量
- **AND** 不应硬编码颜色值（如 `#ffffff`）
- **AND** 当 `data-theme` 属性变化时，组件颜色应自动更新

#### Scenario: 主题切换时平滑过渡

- **WHEN** 主题发生变化
- **THEN** 所有颜色相关的 CSS 属性应应用过渡动画
- **AND** 过渡时长应为 300ms，缓动函数为 `ease`
- **AND** 过渡应影响背景色、文字色、边框色等属性
- **AND** 过渡效果应在所有支持的元素上生效

### Requirement: 无障碍支持

主题切换功能 SHALL 符合 Web 无障碍标准（WCAG 2.1 AA 级），确保残障用户能够正常使用。

#### Scenario: 键盘导航支持

- **WHEN** 用户使用键盘 Tab 键导航
- **THEN** 主题切换按钮应可获得焦点
- **AND** 焦点状态下应显示明显的焦点指示器（蓝色轮廓）
- **AND** 按下 Enter 或 Space 键应触发主题切换

#### Scenario: 屏幕阅读器支持

- **WHEN** 屏幕阅读器用户访问主题切换按钮
- **THEN** 按钮应包含 `aria-label` 属性，描述当前主题和切换目标
- **AND** aria-label 应动态更新（如 "切换到亮色模式" 或 "切换到暗色模式"）
- **AND** 按钮应包含 `role="button"` 属性明确元素角色

#### Scenario: 颜色对比度符合标准

- **WHEN** 系统定义主题配色方案
- **THEN** 亮色主题的文字与背景对比度应 ≥ 4.5:1（WCAG AA 级）
- **AND** 暗色主题的文字与背景对比度应 ≥ 4.5:1（WCAG AA 级）
- **AND** 重要文本（如标题、链接）应达到 AAA 级（≥ 7:1）

### Requirement: 性能与兼容性

主题切换功能 SHALL 在保证性能的前提下兼容主流浏览器，不应显著增加页面加载时间或 JavaScript bundle 大小。

#### Scenario: JavaScript Bundle 大小控制

- **WHEN** 主题切换功能打包到生产构建
- **THEN** 新增代码的 gzip 压缩后大小应 < 3 KB
- **AND** 应使用 Tree Shaking 移除未使用的代码
- **AND** 应内联 SVG 图标而非额外请求资源文件

#### Scenario: 主题切换性能

- **WHEN** 用户触发主题切换
- **THEN** 从点击到视觉反馈的延迟应 < 100ms
- **AND** 主题切换动画应保持 60fps 流畅度
- **AND** localStorage 读写操作不应阻塞主线程

#### Scenario: 跨浏览器兼容性

- **WHEN** 用户使用主流浏览器访问站点
- **THEN** 主题切换功能应在 Chrome/Edge（最新版）正常工作
- **AND** 主题切换功能应在 Firefox（最新版）正常工作
- **AND** 主题切换功能应在 Safari（最新版）正常工作
- **AND** 移动端浏览器（iOS Safari、Android Chrome）应支持主题切换

#### Scenario: 不支持浏览器的降级方案

- **WHEN** 用户使用不支持 CSS 变量或 localStorage 的旧版浏览器
- **THEN** 系统应降级到默认暗色主题
- **AND** 主题切换按钮可能不显示或不可用
- **AND** 不应出现 JavaScript 错误或页面崩溃
- **AND** 站点核心功能（文档浏览）仍应可用

### Requirement: 农历新年主题支持

系统 SHALL 提供农历新年专属主题选项,在农历新年期间(2月1日-3月1日)为用户提供符合节日氛围的视觉体验。

#### Scenario: 用户手动选择农历新年主题

- **WHEN** 用户通过主题切换器选择农历新年主题
- **THEN** 系统应立即应用农历新年主题的配色方案
- **AND** 页面所有元素应平滑过渡到农历新年主题的样式
- **AND** 主题切换按钮图标应更新为对应状态(灯笼或其他节日图标)
- **AND** 系统应将农历新年主题保存到 localStorage

#### Scenario: 农历新年主题视觉特征

- **WHEN** 系统应用农历新年主题
- **THEN** 主题应使用红色为主色调(春节红 #D32F2F)
- **AND** 主题应使用金色为次要色调(富贵金 #FFA000)
- **AND** 主题应包含红色到金色的渐变效果
- **AND** 主题应包含金色光晕发光效果
- **AND** 主题应保持良好的文字可读性(对比度 ≥ 4.5:1)

#### Scenario: 首页组件农历新年主题样式

- **WHEN** 系统应用农历新年主题
- **THEN** ShowcaseSection 组件应显示节日风格的卡片样式
- **AND** ActivityMetricsSection 组件应显示节日风格的指标展示
- **AND** 组件应使用红色和金色主题色
- **AND** 可选显示新年装饰元素(如灯笼、春联等 SVG 图标)

---

### Requirement: 智能默认主题机制

系统 SHALL 在农历新年期间(2月1日-3月1日)为首次访问且无主题偏好的用户自动应用农历新年主题,同时尊重已有主题偏好的用户选择。

#### Scenario: 农历新年期间新用户自动应用节日主题

- **WHEN** 用户在2月1日至3月1日期间首次访问站点
- **AND** 用户浏览器 localStorage 中无保存的主题偏好
- **THEN** 系统应自动应用农历新年主题(`data-theme="lunar-new-year"`)
- **AND** 用户无需手动选择主题即可获得节日体验
- **AND** 页面加载时不应出现主题闪烁(FOUC)

#### Scenario: 非农历新年期间新用户应用系统偏好

- **WHEN** 用户在非2月1日-3月1日期间首次访问站点
- **AND** 用户浏览器 localStorage 中无保存的主题偏好
- **THEN** 系统应检测操作系统主题偏好(`prefers-color-scheme`)
- **AND** 系统应应用与系统偏好一致的主题(亮色或暗色)
- **AND** 主题初始化逻辑应在页面渲染前同步执行

#### Scenario: 已有主题偏好的用户不受智能默认影响

- **WHEN** 用户已手动选择并保存主题偏好
- **AND** 用户在农历新年期间访问站点
- **THEN** 系统应读取并应用用户保存的主题偏好
- **AND** 系统不应自动覆盖用户的选择
- **AND** 用户之前选择的主题应保持不变

#### Scenario: 日期边界条件处理

- **WHEN** 当前日期为1月31日23:59:59(农历新年期间前夕)
- **THEN** 系统应识别为非农历新年期间
- **AND** 应应用系统偏好主题(如果有)或默认暗色主题

- **WHEN** 当前日期为2月1日00:00:00(农历新年期间开始)
- **THEN** 系统应识别为农历新年期间
- **AND** 应为新用户应用农历新年主题

- **WHEN** 当前日期为3月1日23:59:59(农历新年期间结束)
- **THEN** 系统应识别为农历新年期间
- **AND** 应为新用户应用农历新年主题

- **WHEN** 当前日期为3月2日00:00:00(农历新年期间后)
- **THEN** 系统应识别为非农历新年期间
- **AND** 应应用系统偏好主题(如果有)或默认暗色主题

---

### Requirement: 多主题选项支持

系统 SHALL 扩展主题系统以支持三个主题选项:亮色(`light`)、暗色(`dark`)和农历新年(`lunar-new-year`),并确保主题切换功能在所有主题之间正常工作。

#### Scenario: 三主题循环切换

- **WHEN** 用户在亮色主题下点击主题切换按钮
- **THEN** 系统应切换到暗色主题
- **AND** 当用户在暗色主题下点击按钮
- **THEN** 系统应切换到农历新年主题
- **AND** 当用户在农历新年主题下点击按钮
- **THEN** 系统应切换到亮色主题
- **AND** 切换循环应流畅且无遗漏

#### Scenario: 多主题状态持久化

- **WHEN** 用户切换到任意主题(包括农历新年主题)
- **THEN** 系统应将主题值(`'light'`、`'dark'` 或 `'lunar-new-year'`)保存到 localStorage
- **AND** 保存操作应使用键名 `starlight-theme`
- **AND** 页面刷新或重新访问时,系统应正确恢复用户选择的主题

#### Scenario: 多主题跨页面同步

- **WHEN** 用户在某个页面选择农历新年主题
- **AND** 用户打开站点的另一个页面或标签页
- **THEN** 新页面应自动应用农历新年主题
- **AND** 主题状态应通过 localStorage 事件监听同步
- **AND** 所有打开的标签页应保持主题一致

#### Scenario: 多主题类型安全

- **WHEN** TypeScript 编译器检查主题相关代码
- **THEN** `Theme` 类型应包含 `'light' | 'dark' | 'lunar-new-year'`
- **AND** 所有使用 `Theme` 类型的地方应正确处理新主题类型
- **AND** TypeScript 严格模式下应无类型错误

---

