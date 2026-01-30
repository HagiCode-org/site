# theme-system 规范变更

## ADDED Requirements

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

## MODIFIED Requirements

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

## 相关说明

### 实施注意事项

1. **日期判断逻辑**: 使用简单的日期范围检查(2月1日-3月1日),未来可优化为根据实际农历新年日期动态计算

2. **向后兼容性**: 所有修改应保持对现有 `light` 和 `dark` 主题的完全兼容,不破坏现有功能

3. **性能要求**: 新增功能不应显著影响页面加载性能或 JavaScript bundle 大小

4. **无障碍支持**: 农历新年主题应同样符合 WCAG 2.1 AA 级标准,特别是颜色对比度要求

5. **测试覆盖**: 应充分测试日期边界条件、localStorage 存在/不存在场景、以及所有主题之间的切换

### 未来增强方向

- 根据实际农历新年日期动态计算时间窗口
- 添加更多节日主题(如国庆节、中秋节等)
- 实现主题预览功能,让用户在选择前预览效果
- 支持自定义主题配色

---

**规范变更创建时间**: 2026-01-30
**变更 ID**: `lunar-new-year-theme-smart-default-arg-value-reasoning-thinking-process-1-analyze-the-proposal-main`
**影响的规范**: `openspec/specs/theme-system/spec.md`
