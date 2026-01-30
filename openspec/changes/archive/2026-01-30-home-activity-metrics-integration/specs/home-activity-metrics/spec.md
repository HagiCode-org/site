# home-activity-metrics Specification Delta

## 概述

本规范定义了首页活动指标数据加载和展示的需求。这是对 `astro-site` 规范的增强，添加了在首页集成动态活动指标数据的功能。

---

## MODIFIED Requirements

修改 `astro-site` 规范中的"自定义首页"需求，添加活动指标数据加载要求。

### Requirement: 首页活动指标数据加载

首页 MUST 加载并展示活动指标数据，包括 Docker Hub 拉取次数、活跃用户数和活跃会话数。

#### Scenario: 服务端数据加载

**Given** `data/activity-metrics.json` 文件存在并包含有效的活动指标数据
**When** 我访问首页 `src/pages/index.astro`
**Then** 首页必须在服务端（frontmatter）中导入 `activity-metrics.json` 文件
**And** 数据必须通过 props 传递给 `ActivityMetricsSection` 组件
**And** 导入必须使用 ES Module 语法（`import ... from ...`）
**And** 必须使用相对路径 `../data/activity-metrics.json`

#### Scenario: 数据传递给子组件

**Given** 首页已加载活动指标数据
**When** 首页渲染 `ActivityMetricsSection` 组件
**Then** 组件必须接收以下 props:
  - `lastUpdated`: string - 数据最后更新时间
  - `dockerHub`: { pullCount: number, repository: string } - Docker Hub 数据
  - `clarity`: { activeUsers: number, activeSessions: number, dateRange: string } - Clarity 分析数据
**And** 所有 props 必须是可选的（使用 TypeScript 可选属性）
**And** 组件必须保留 `client:visible` 指令以支持动画

#### Scenario: 数据降级到默认值

**Given** 首页传递的活动指标数据部分或完全缺失
**When** `ActivityMetricsSection` 组件渲染
**Then** 组件必须使用默认数据作为降级方案
**And** 默认数据必须包含:
  - `lastUpdated`: 当前时间的 ISO 8601 格式
  - `dockerHub.pullCount`: 0
  - `dockerHub.repository`: "newbe36524/hagicode"
  - `clarity.activeUsers`: 0
  - `clarity.activeSessions`: 0
  - `clarity.dateRange`: "3Days"
**And** UI 必须显示默认数据而不崩溃

#### Scenario: 类型安全

**Given** `ActivityMetricsSection` 组件接收活动指标数据 props
**When** TypeScript 类型检查运行（`npm run typecheck`）
**Then** 组件必须定义 `ActivityMetricsSectionProps` 接口
**And** 接口必须包含所有数据字段的类型定义
**And** 所有字段必须标记为可选（使用 `?`）
**And** 类型检查必须通过，无类型错误

#### Scenario: 数据展示

**Given** 首页已加载活动指标数据并传递给组件
**When** 用户访问首页
**Then** 首页必须显示三个指标卡片:
  1. Docker Hub 拉取次数
  2. 活跃用户数（近三天）
  3. 活跃会话数（近三天）
**And** 数字必须显示为格式化的字符串（例如：1.5万、490）
**And** 数字必须有滚动动画效果
**And** 卡片必须有悬停效果和渐变边框

#### Scenario: 构建时数据可用性

**Given** 项目进行生产构建（`npm run build`）
**When** Astro 构建过程处理首页
**Then** `data/activity-metrics.json` 文件必须在构建时存在
**And** 构建必须成功完成，无错误
**And** 输出的 HTML 必须包含活动指标数据
**And** 数据必须预渲染到 HTML 中，无需客户端 fetch

---

## ADDED Requirements

### Requirement: 活动指标数据文件

项目 MUST 维护一个活动指标数据文件，用于存储和展示项目活动数据。

#### Scenario: 数据文件结构

**Given** `data/activity-metrics.json` 文件存在
**When** 我检查文件内容
**Then** 文件必须是有效的 JSON 格式
**And** 文件必须包含以下顶层属性:
  - `lastUpdated`: ISO 8601 时间戳字符串
  - `dockerHub`: 对象，包含 Docker Hub 相关数据
  - `clarity`: 对象，包含 Microsoft Clarity 分析数据
**And** `dockerHub` 对象必须包含:
  - `pullCount`: 数字 - Docker Hub 镜像拉取次数
  - `repository`: 字符串 - Docker Hub 仓库名称
**And** `clarity` 对象必须包含:
  - `activeUsers`: 数字 - 活跃用户数
  - `activeSessions`: 数字 - 活跃会话数
  - `dateRange`: 字符串 - 数据时间范围（例如："3Days"）

#### Scenario: 数据文件更新

**Given** CI/CD workflow 运行
**When** workflow 执行活动指标数据更新步骤
**Then** `data/activity-metrics.json` 文件必须被更新
**And** 更新必须包含最新的 Docker Hub 和 Clarity 数据
**And** `lastUpdated` 字段必须反映数据更新时间
**And** 文件必须被提交到仓库（如果使用自动更新 workflow）

---

## Quality Gates

### 必须满足 (MUST)

- ✅ **数据加载**: 首页必须在服务端加载 `activity-metrics.json` 数据
- ✅ **Props 传递**: 数据必须通过 props 传递给 `ActivityMetricsSection` 组件
- ✅ **类型安全**: TypeScript 类型检查必须通过
- ✅ **构建成功**: 生产构建必须成功，数据包含在输出 HTML 中
- ✅ **降级处理**: 数据不可用时必须降级到默认值，不崩溃
- ✅ **数据展示**: 首页必须正确显示三个活动指标卡片

### 应该满足 (SHOULD)

- ✅ **性能**: 数据加载不应影响首次内容绘制 (FCP) 性能
- ✅ **代码质量**: 遵循 Astro 和 React 最佳实践
- ✅ **可维护性**: 代码清晰，类型定义完整
- ✅ **降级体验**: 默认数据应提供有意义的空状态或占位值

### 可以满足 (MAY)

- ⚠️ **数据验证**: 可以添加数据格式验证（当前假设数据正确）
- ⚠️ **错误边界**: 可以添加 React 错误边界以处理异常
- ⚠️ **缓存策略**: 可以实现浏览器或服务端缓存以优化性能

---

## Implementation Notes

### 技术约束

1. **Astro 版本**: 必须使用 Astro 5.x 的服务端数据加载特性
2. **React 集成**: 组件使用 `@astrojs/react` 集成
3. **TypeScript**: 必须使用严格模式，确保类型安全
4. **文件路径**: `data/activity-metrics.json` 相对于 `src/pages/index.astro` 的路径为 `../data/`

### 依赖关系

- 依赖 `data/activity-metrics.json` 文件的存在
- 依赖 `src/components/home/ActivityMetricsSection.tsx` 组件
- 依赖 Astro 的静态构建流程

### 兼容性

- 必须与现有的首页组件兼容
- 必须不影响其他页面或组件的功能
- 必须支持现有的主题系统和响应式设计

---

## Testing Strategy

### 手动测试清单

- [ ] 本地开发环境启动成功（`npm run dev`）
- [ ] 首页显示活动指标数据
- [ ] 三个指标卡片正确渲染
- [ ] 数字滚动动画正常工作
- [ ] 悬停效果显示正常
- [ ] TypeScript 类型检查通过（`npm run typecheck`）
- [ ] 生产构建成功（`npm run build`）
- [ ] 预览服务器显示正确数据（`npm run preview`）
- [ ] 数据文件不存在时显示默认值

### 自动化测试（可选）

- [ ] 单元测试：组件 props 接口
- [ ] 单元测试：降级逻辑
- [ ] 集成测试：首页数据加载流程

---

## Migration Notes

### 从现有实现迁移

当前 `ActivityMetricsSection.tsx` 使用 `require()` 加载数据，需要修改为：

1. **移除 `require()` 导入**: 删除组件中的 `require('../../../data/activity-metrics.json')` 代码
2. **添加 Props 接口**: 定义 `ActivityMetricsSectionProps` 接口
3. **修改组件签名**: 接收数据 props 而非内部加载数据
4. **更新首页**: 在 `index.astro` 中加载数据并传递给组件

### 向后兼容性

- ✅ UI 和用户体验保持不变
- ✅ 组件功能保持不变
- ✅ 动画和交互效果保持不变
- ⚠️ 数据加载方式改变（从客户端改为服务端）

---

## Version History

- **2026-01-30**: 初始规范 delta，定义首页活动指标数据加载需求
