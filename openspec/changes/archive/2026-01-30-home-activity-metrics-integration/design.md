# Design Document: 首页活动指标数据集成

## 概述

本文档详细说明了在首页集成活动指标数据加载的技术设计和架构决策。这是一个相对简单的功能增强，主要涉及数据加载流程的优化，不涉及复杂的架构变更。

---

## 当前状态分析

### 现有实现

查看 `src/components/home/ActivityMetricsSection.tsx` 的当前实现：

**数据加载方式** (行 216-224):
```typescript
let metricsData: ActivityMetricsData | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  metricsData = require('../../../data/activity-metrics.json');
} catch {
  // 文件尚不存在
}
```

**问题识别**:

1. **不兼容的模块系统**: Astro 的 React 集成使用 ES modules，而 `require()` 是 CommonJS 语法
2. **客户端 hydration 问题**: `client:visible` 指令意味着组件在客户端 hydration，`require()` 在浏览器环境中不可用
3. **类型安全绕过**: 使用 `require()` 绕过了 TypeScript 的类型检查
4. **构建时路径解析**: 相对路径 `../../../data/activity-metrics.json` 在构建时可能无法正确解析

### 数据文件

**文件路径**: `data/activity-metrics.json`

**当前数据结构**:
```json
{
  "lastUpdated": "2026-01-27T01:09:44.520Z",
  "dockerHub": {
    "pullCount": 490,
    "repository": "newbe36524/hagicode"
  },
  "clarity": {
    "activeUsers": 41,
    "activeSessions": 43,
    "dateRange": "3Days"
  }
}
```

**数据来源**: 通过 GitHub Actions workflow 自动生成（推测，未在本设计范围内）

---

## 设计方案

### 架构选择

**方案**: Astro 服务端数据加载 + Props 传递

**选择理由**:

1. **符合 Astro 最佳实践**: Astro 推荐在服务端（`.astro` 文件的 frontmatter）加载数据
2. **零 JavaScript 默认**: 数据在构建时预渲染为 HTML，无需客户端 JavaScript
3. **类型安全**: 使用 TypeScript 导入，完整类型检查
4. **性能优化**: 服务端渲染减少客户端计算和加载时间
5. **可维护性**: 清晰的数据流向，易于理解和调试

### 数据流向图

```
┌─────────────────────────────────────────────────────────────┐
│                     构建时 (Build Time)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  data/activity-metrics.json                                 │
│  - 静态 JSON 文件                                            │
│  - 由 CI/CD workflow 更新                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ import (ES Module)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  src/pages/index.astro (Frontmatter)                        │
│  - 服务端执行                                                │
│  - 导入并解构数据                                           │
│  - 准备传递给子组件                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ props 传递
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  <ActivityMetricsSection> 组件                              │
│  - React 组件 (客户端 hydrated)                             │
│  - 接收数据作为 props                                       │
│  - 降级到默认数据（如果 props 未提供）                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 渲染
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     HTML 输出                                │
│  - 预渲染的静态 HTML                                         │
│  - 包含活动指标数据                                         │
│  - 客户端 hydration 时保持数据一致                          │
└─────────────────────────────────────────────────────────────┘
```

### 组件交互序列图

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────────────┐
│   构建时     │      │ index.astro  │      │ ActivityMetricsSection  │
└─────────────┘      └──────────────┘      └─────────────────────────┘
                            │                            │
                            │ 1. import JSON             │
                            │   activity-metrics.json    │
                            │────────────────────────────>│
                            │                            │
                            │ 2. 解构数据                │
                            │   lastUpdated              │
                            │   dockerHub                │
                            │   clarity                  │
                            │                            │
                            │ 3. 渲染组件                │
                            │   传递 props               │
                            │────────────────────────────>│
                            │                            │
                            │                            │ 4. 接收 props
                            │                            │
                            │                            │ 5. 检查 props
                            │                            │    如果存在 → 使用
                            │                            │    如果不存在 → 默认值
                            │                            │
                            │                            │ 6. 渲染 UI
                            │                            │   - 数字卡片
                            │                            │   - 动画效果
                            │                            │
                            │ 7. 返回 HTML               │
                            │<────────────────────────────│
                            │                            │
                            ▼                            ▼
                      ┌──────────────────────────────────────┐
                      │         输出 HTML                    │
                      │  - 包含预渲染的活动指标数据          │
                      └──────────────────────────────────────┘
```

---

## 详细实现设计

### 1. 首页数据加载 (`src/pages/index.astro`)

#### Frontmatter 数据加载

```astro
---
// ... 现有导入

// 导入活动指标数据（ES Module 语法）
import activityMetrics from '../data/activity-metrics.json';

// 数据解构和准备
const { lastUpdated, dockerHub, clarity } = activityMetrics;

// 可选：数据验证（如果需要）
// if (!lastUpdated || !dockerHub || !clarity) {
//   console.warn('活动指标数据不完整，将使用默认值');
// }
---
```

**设计决策**:

- ✅ **使用 ES Module 导入**: `import ... from ...` 而非 `require()`
- ✅ **相对路径**: `../data/` 从 `src/pages/` 到项目根目录
- ✅ **直接解构**: 简化后续代码中的数据访问
- ⚠️ **数据验证**: 可选，当前假设数据格式正确（由 CI/CD 保证）

#### 组件 Props 传递

```astro
<ActivityMetricsSection
  lastUpdated={lastUpdated}
  dockerHub={dockerHub}
  clarity={clarity}
  client:visible
/>
```

**设计决策**:

- ✅ **保持 client:visible**: 组件仍然在客户端 hydration 以支持动画
- ✅ **Props 展开**: 将数据对象的顶层属性作为独立 props 传递
- ✅ **命名一致性**: Props 名称与 JSON 结构保持一致

### 2. 组件 Props 接口 (`src/components/home/ActivityMetricsSection.tsx`)

#### TypeScript 类型定义

```typescript
// 数据结构接口（已存在）
interface ActivityMetricsData {
  lastUpdated: string;
  dockerHub: {
    pullCount: number;
    repository: string;
  };
  clarity: {
    activeUsers: number;
    activeSessions: number;
    dateRange: string;
  };
}

// 新增：组件 Props 接口
interface ActivityMetricsSectionProps {
  lastUpdated?: string;  // 可选：支持降级到默认值
  dockerHub?: ActivityMetricsData['dockerHub'];  // 复用类型定义
  clarity?: ActivityMetricsData['clarity'];
}
```

**设计决策**:

- ✅ **可选 Props**: 使用 `?` 标记所有字段为可选，支持降级逻辑
- ✅ **类型复用**: `ActivityMetricsData['dockerHub']` 复用已有类型，避免重复
- ✅ **明确接口**: 单独定义 Props 接口，提高代码可读性

#### 组件函数签名

```typescript
export default function ActivityMetricsSection({
  lastUpdated,
  dockerHub,
  clarity,
}: ActivityMetricsSectionProps): JSX.Element | null {
  // ... 组件实现
}
```

**设计决策**:

- ✅ **解构参数**: 使用解构语法，提高代码可读性
- ✅ **显式类型**: 明确声明 `ActivityMetricsSectionProps` 类型
- ✅ **返回类型**: 保持 `JSX.Element | null` 不变

### 3. 数据降级逻辑

#### 降级策略

```typescript
// 默认占位数据（已存在）
const defaultData: ActivityMetricsData = {
  lastUpdated: new Date().toISOString(),
  dockerHub: {
    pullCount: 0,
    repository: 'newbe36524/hagicode',
  },
  clarity: {
    activeUsers: 0,
    activeSessions: 0,
    dateRange: '3Days',
  },
};

// 使用 props 数据或降级到默认数据
const data: ActivityMetricsData = {
  lastUpdated: lastUpdated || defaultData.lastUpdated,
  dockerHub: dockerHub || defaultData.dockerHub,
  clarity: clarity || defaultData.clarity,
};
```

**设计决策**:

- ✅ **对象级降级**: 优先使用 props 数据，降级时使用整个默认对象
- ✅ **保留现有逻辑**: 不修改 `defaultData` 和后续的数据处理逻辑
- ✅ **渐进增强**: 即使数据不可用，UI 仍然可用（显示 0 或空状态）

---

## 错误处理和边界情况

### 1. 数据文件不存在

**场景**: `data/activity-metrics.json` 文件不存在或路径错误

**当前行为**: `require()` 会抛出异常，被 `try-catch` 捕获，`metricsData` 为 `null`

**新行为**:

```astro
---
// index.astro
import activityMetrics from '../data/activity-metrics.json';
// 如果文件不存在，构建时会报错（Astro 的默认行为）
---
```

**建议**: 如果需要支持文件不存在的场景，可以添加动态导入：

```astro
---
// 可选：更健壮的导入方式
let activityMetrics;
try {
  activityMetrics = (await import('../data/activity-metrics.json')).default;
} catch (error) {
  console.warn('活动指标数据文件不存在，将使用默认值:', error);
  activityMetrics = {};
}
---
```

**决策**: 当前不实现，因为：
1. 数据文件应该始终存在（由 CI/CD 生成）
2. 如果文件不存在，应该让构建失败，及时发现配置问题

### 2. 数据格式不正确

**场景**: JSON 文件格式错误或缺少必需字段

**当前行为**: 运行时错误，组件崩溃

**建议增强** (可选):

```typescript
// 在 index.astro frontmatter 中添加数据验证
if (!activityMetrics?.lastUpdated || !activityMetrics?.dockerHub?.pullCount) {
  console.warn('活动指标数据格式不完整');
}
```

**决策**: 当前不实现，因为：
1. 数据由 CI/CD 自动生成，格式应该有保证
2. 过度验证增加了维护成本
3. 可以在未来根据需要添加

### 3. Props 部分缺失

**场景**: 组件接收了部分 props（例如只有 `dockerHub`，没有 `clarity`）

**当前降级逻辑**:
```typescript
const data: ActivityMetricsData = {
  lastUpdated: lastUpdated || defaultData.lastUpdated,
  dockerHub: dockerHub || defaultData.dockerHub,
  clarity: clarity || defaultData.clarity,
};
```

**行为**: 使用 props 中的非空值，缺失的值使用默认值

**评估**: ✅ 合理的降级行为

---

## 性能考虑

### 1. 构建时性能

**影响**: 在 `index.astro` 中导入 JSON 数据是在构建时执行

**评估**:
- ✅ JSON 文件很小（~200 bytes），导入开销可忽略
- ✅ 导入只执行一次（构建时），不影响运行时性能
- ✅ Astro 的静态优化会将数据直接内联到 HTML 中

### 2. 客户端性能

**影响**: `client:visible` 指令意味着组件在客户端 hydration

**评估**:
- ✅ Props 数据在服务端预渲染到 HTML，无需客户端 fetch
- ✅ Hydration 时复用服务端数据，避免重复计算
- ✅ 保持了现有的动画和交互功能

**性能指标**:
- 首次内容绘制 (FCP): 无影响（数据在 HTML 中）
- Time to Interactive (TTI): 可能略微增加（hydration 需要 JavaScript）
- Cumulative Layout Shift (CLS): 无影响（布局固定）

### 3. 缓存策略

**当前**: 无特殊缓存机制

**潜在优化** (未来):
- 如果数据更新频率低，可以设置较长的 HTTP 缓存头
- 如果数据量大，可以考虑使用 Service Worker 缓存

---

## 安全性考虑

### 1. 数据注入

**风险**: JSON 数据可能包含恶意内容

**当前状态**:
- ✅ 数据由项目 CI/CD 控制，来源可信
- ✅ 数据只包含数字和字符串，无代码执行风险
- ✅ React 的默认 XSS 防护仍然有效

**评估**: 无额外安全风险

### 2. 数据隐私

**风险**: 活动指标数据可能包含敏感信息

**当前状态**:
- ✅ 数据只包含聚合统计信息（拉取次数、活跃用户数）
- ✅ 无个人身份信息 (PII)
- ✅ 数据公开展示在首页，非敏感

**评估**: 无隐私风险

---

## 可测试性

### 1. 单元测试 (可选)

**可以测试的场景**:

```typescript
// 示例：测试降级逻辑
describe('ActivityMetricsSection', () => {
  it('应该使用 props 数据当其可用时', () => {
    const { getByText } = render(
      <ActivityMetricsSection
        lastUpdated="2026-01-27T00:00:00.000Z"
        dockerHub={{ pullCount: 1000, repository: 'test/repo' }}
        clarity={{ activeUsers: 50, activeSessions: 60, dateRange: '3Days' }}
      />
    );
    expect(getByText('1000')).toBeInTheDocument();
  });

  it('应该降级到默认数据当 props 未提供时', () => {
    const { container } = render(<ActivityMetricsSection />);
    // 应该显示默认值或空状态
  });
});
```

**当前决策**: 不添加单元测试，因为：
1. 项目目前没有设置测试框架
2. 功能相对简单，手动测试已足够
3. 可以在未来根据需要添加

### 2. 集成测试

**手动测试步骤** (见 `tasks.md`):
1. 本地开发环境测试
2. 生产构建测试
3. 数据文件不存在时的降级测试

---

## 可维护性

### 1. 代码组织

**文件结构**:
```
src/
├── pages/
│   └── index.astro              # 数据加载和传递
├── components/
│   └── home/
│       └── ActivityMetricsSection.tsx  # 数据展示组件
└── types/
    └── activity-metrics.ts      # (可选) 类型定义
```

**职责分离**:
- ✅ `index.astro`: 负责数据加载（服务端）
- ✅ `ActivityMetricsSection`: 负责 UI 渲染（客户端）
- ✅ 清晰的关注点分离

### 2. 类型定义复用

**当前**: 类型定义在 `ActivityMetricsSection.tsx` 内部

**潜在改进**: 提取到独立文件

```typescript
// src/types/activity-metrics.ts
export interface ActivityMetricsData {
  lastUpdated: string;
  dockerHub: {
    pullCount: number;
    repository: string;
  };
  clarity: {
    activeUsers: number;
    activeSessions: number;
    dateRange: string;
  };
}

// src/components/home/ActivityMetricsSection.tsx
import { ActivityMetricsData } from '@/types/activity-metrics';

interface ActivityMetricsSectionProps {
  lastUpdated?: string;
  dockerHub?: ActivityMetricsData['dockerHub'];
  clarity?: ActivityMetricsData['clarity'];
}
```

**决策**: 当前不实现，因为：
1. 类型只在单个组件中使用，无需共享
2. 保持类型定义靠近使用处，提高可读性
3. 可以在未来需要时提取

### 3. 配置灵活性

**当前**: 数据文件路径硬编码在 `index.astro` 中

**潜在改进**: 使用环境变量

```astro
---
// 环境变量配置
const DATA_FILE_PATH = import.meta.env.ACTIVITY_METRICS_PATH || '../data/activity-metrics.json';
import activityMetrics from DATA_FILE_PATH;
---
```

**决策**: 当前不实现，因为：
1. 数据文件路径不太可能改变
2. 环境变量增加了配置复杂度
3. 可以在未来需要时添加

---

## 扩展性

### 1. 支持多个数据源

**当前**: 只支持静态 JSON 文件

**潜在扩展**: 支持 API 动态加载

```typescript
// 未来可能的实现
export async function getActivityMetrics(): Promise<ActivityMetricsData> {
  try {
    const response = await fetch('/api/activity-metrics');
    return await response.json();
  } catch (error) {
    return defaultData;
  }
}
```

**设计考虑**:
- ✅ 当前的 Props 接口设计支持从任何数据源获取数据
- ✅ 降级逻辑可以处理 API 失败的情况
- ✅ 可以保持静态 JSON 作为默认/备份数据源

### 2. 支持实时更新

**当前**: 数据只在构建时更新

**潜在扩展**: 客户端轮询或 WebSocket

```typescript
// 未来可能的实现
useEffect(() => {
  const interval = setInterval(async () => {
    const newData = await fetchLatestMetrics();
    setMetrics(newData);
  }, 60000); // 每分钟更新

  return () => clearInterval(interval);
}, []);
```

**设计考虑**:
- ⚠️ 需要权衡实时性和性能
- ⚠️ 需要考虑 API 限流和成本
- ✅ 当前静态方案适合大多数场景

### 3. 支持多种指标类型

**当前**: 只支持 Docker Hub 和 Clarity 数据

**潜在扩展**: 添加更多数据源

```typescript
interface ActivityMetricsData {
  lastUpdated: string;
  dockerHub: { /* ... */ };
  clarity: { /* ... */ };
  // 新增
  githubStars?: number;
  npmDownloads?: number;
  communityContributors?: number;
}
```

**设计考虑**:
- ✅ 当前的接口设计易于扩展
- ✅ 降级逻辑可以处理部分数据缺失
- ✅ UI 组件可以动态渲染可用的指标卡片

---

## 部署和运维

### 1. 构建流程

**现状**:
```yaml
# .github/workflows/deploy.yml
- name: Build
  run: npm run build
```

**评估**: ✅ 无需修改，构建流程自动包含 JSON 文件

**验证**: 确保 `data/` 目录在构建时存在
- ✅ GitHub Actions `actions/checkout@v4` 会检出完整仓库
- ✅ `data/` 目录应该被包含在构建输出中

### 2. 数据更新流程

**当前**: 推测由 CI/CD workflow 更新 `activity-metrics.json`

**建议** (如果未实现):
```yaml
# 示例：数据更新 workflow
name: Update Activity Metrics

on:
  schedule:
    - cron: '0 */6 * * *'  # 每 6 小时
  workflow_dispatch:       # 手动触发

jobs:
  update-metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Fetch metrics
        run: |
          # 从 Docker Hub API 和 Clarity API 获取数据
          # 更新 data/activity-metrics.json
      - name: Commit changes
        run: |
          git config user.name 'github-actions[bot]'
          git add data/activity-metrics.json
          git commit -m 'chore: 更新活动指标数据'
          git push
```

**注意**: 这不在当前设计范围内，但可以作为后续优化

### 3. 监控和告警

**建议** (未来增强):
- 设置数据更新失败的告警
- 监控数据文件大小变化（检测异常）
- 定期验证数据格式正确性

---

## 总结

### 关键设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 数据加载方式 | Astro 服务端加载 | 符合最佳实践，性能最优 |
| Props 传递 | 独立 props 展开 | 类型安全，代码清晰 |
| 降级策略 | Props 级降级 | 灵活，支持部分数据缺失 |
| 类型定义 | 组件内定义 | 简单，靠近使用处 |
| 错误处理 | 构建时失败 | 及时发现配置问题 |

### 权衡和取舍

**简单性 vs 健壮性**:
- 选择简单的实现（不添加复杂的数据验证）
- 接受构建时失败的风险（数据文件应该始终存在）

**性能 vs 功能**:
- 保持 `client:visible` 以支持动画
- 接受轻微的 hydration 开销

**灵活性 vs 约束**:
- 不支持多数据源或动态路径
- 保持实现简单和专注

### 风险和缓解

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| 数据文件缺失 | 构建失败 | 低 | 确保 CI/CD 正确生成文件 |
| 数据格式错误 | 运行时错误 | 低 | CI/CD 验证 JSON 格式 |
| 类型不匹配 | TypeScript 错误 | 低 | 严格类型检查 |

### 下一步行动

1. **实施**: 按照 `tasks.md` 中的步骤实施
2. **测试**: 完成所有测试验证任务
3. **部署**: 提交 PR 并部署到生产环境
4. **监控**: 观察生产环境的数据展示和性能
5. **优化**: 根据实际使用情况考虑后续优化
