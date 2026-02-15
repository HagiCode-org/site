# Change: 优化版本监控工作流避免重复PR

## Why

当前版本监控工作流在检测到版本更新时会创建 Pull Request，但由于缺少重复检查机制，当同一版本的 PR 被手动关闭或分支被删除后，工作流会重复创建相同的 PR。这导致：

1. PR 列表中存在大量重复的版本更新请求
2. 浪费 GitHub Actions 资源和执行时间
3. 不必要的分支强制推送和删除操作
4. 可能关闭正在审查中的 PR

## What Changes

- **添加 PR 存在性检查**：在创建新 PR 前，使用 GitHub CLI 查询是否已存在目标版本的 PR
- **优化分支管理**：在创建分支前检查远程是否已存在同名分支
- **智能更新策略**：
  - 如果 PR 已存在，跳过创建并记录日志
  - 如果分支存在但 PR 不存在，基于现有分支创建 PR
  - 如果两者都不存在，才创建新的分支和 PR
- **改进关闭旧 PR 逻辑**：排除与当前版本相同的 PR，避免关闭目标 PR

## Code Flow Changes

### 当前流程
```mermaid
flowchart TD
    A[检测到版本更新] --> B[创建分支]
    B --> C[提交变更]
    C --> D[删除远程分支如果存在]
    D --> E[强制推送分支]
    E --> F[关闭所有旧版本PR]
    F --> G{PR是否已存在?}
    G -->|否| H[创建新PR]
    G -->|是| I[重复创建PR]
    F --> J[完成]
```

### 优化后流程
```mermaid
flowchart TD
    A[检测到版本更新] --> B{PR是否已存在?}
    B -->|是| C[记录日志并跳过]
    B -->|否| D{分支是否已存在?}
    D -->|是| E[基于现有分支创建PR]
    D -->|否| F[创建新分支并推送]
    F --> G[创建新PR]
    C --> H[关闭旧版本PR排除当前版本]
    E --> H
    G --> H
    H --> I[完成]
```

### PR 检查逻辑
```mermaid
sequenceDiagram
    participant WM as Workflow
    participant GH as GitHub API
    participant Repo as Repository

    WM->>GH: 查询PR列表
    Note over WM,GH: gh pr list --search "title:chore: update version to {version}"

    GH->>Repo: 搜索匹配的PR
    Repo-->>GH: 返回PR列表

    alt 找到匹配PR
        GH-->>WM: 返回PR信息
        WM->>WM: 记录日志：PR已存在
        WM->>WM: 跳过创建流程
    else 未找到匹配PR
        GH-->>WM: 返回空列表
        WM->>Repo: 创建新PR
    end
```

## Impact

- **影响的 specs**: 无（这是工具性改进，不影响外部行为规范）
- **影响的代码**:
  - `.github/workflows/version-monitor.yml` - 添加 PR 检查步骤
- **用户体验改进**:
  - 减少 GitHub Actions 任务执行时间
  - 保持 PR 列表整洁
  - 避免重复通知

## Success Criteria

1. ✅ 当检测到新版本时，如果 PR 已存在则不创建新的 PR
2. ✅ 当 PR 被手动关闭后再次运行，不会重新创建相同 PR（如果版本未变）
3. ✅ 当真正有新版本时，仍能正常创建新的 PR
4. ✅ 旧版本 PR 正确关闭，不影响当前版本 PR
5. ✅ 工作流日志清晰记录 PR 检查结果
