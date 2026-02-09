# 修复 Desktop 页面版本同步

## 概述

修复 Desktop 页面版本信息无法随官方 `index.json` 自动更新的问题。

**重要更新**：经过架构审查，本项目的正确设计是**所有版本信息在构建时固定**。Version Monitor 工作流会检测官方 `index.json` 的版本变化，创建 PR 更新版本状态，PR 合并后自动触发站点重新构建和部署。

当前问题是：
1. **Desktop 页面**：使用构建时获取版本（正确），但可能存在获取逻辑问题
2. **首页 InstallButton**：使用客户端获取版本（**不符合设计**），应改为构建时固定

本提案将确保所有版本信息都在构建时固定，与 Version Monitor 工作流协同工作。

## 问题背景

### 架构设计原则

本项目使用**构建时固定版本**的架构：

```
官方 index.json 更新
    ↓
Version Monitor 检测（每 30 分钟）
    ↓
创建 PR 更新版本状态
    ↓
PR 合并到 main 分支
    ↓
触发 Deploy 工作流
    ↓
构建时获取最新版本并生成静态 HTML
    ↓
部署到 GitHub Pages
```

### 当前状态分析

| 组件 | 当前实现 | 符合设计 |
|------|---------|---------|
| Desktop 页面 | 构建时获取 (SSR) | ✅ 正确 |
| 首页 InstallButton | 客户端获取 | ❌ **不符合设计** |
| Version Monitor | 检测版本变化并创建 PR | ✅ 正常工作 |
| Deploy 工作流 | PR 合并后触发构建 | ✅ 正常工作 |

### 问题表现

1. **Desktop 页面**：版本信息在构建时固定，符合设计预期
2. **首页 InstallButton**：每次加载都从官方源获取版本，导致：
   - 与 Desktop 页面版本可能不一致
   - 增加了不必要的网络请求
   - 违背了"构建时固定"的设计原则
   - 可能出现加载延迟或加载失败的情况

### 根本原因

首页 InstallButton 组件 (`src/components/home/InstallButton.tsx`) 使用了**客户端获取版本**的方式：

```tsx
// 当前实现（不符合设计）
useEffect(() => {
  const fetchVersions = async () => {
    const response = await fetch('https://desktop.dl.hagicode.com/index.json');
    // ...
  };
  fetchVersions();
}, []);
```

这与项目整体架构不一致，应该改为**构建时获取**。

### Version Monitor 工作流审查

经过审查，Version Monitor 工作流 (`scripts/version-monitor.js`) **部分正常，但存在版本比较问题**：

- ✅ 每 30 分钟检查官方 `index.json`
- ✅ 检测到新版本时创建 PR
- ✅ PR 描述中明确说明"CI/CD pipeline will automatically rebuild and deploy"
- ✅ 避免重复创建相同版本的 PR
- ⚠️ **版本比较逻辑不支持 pre-release 版本**（beta/preview/rc）

**版本比较问题**：

当前 `compareVersions()` 函数使用简单的版本比较，直接丢弃了 pre-release 标识：

```javascript
// 当前实现（有问题）
const parseVersion = (v) => {
  const parts = v.replace(/^v/, '').split('-')[0].split('.');
  //                    ^^^^^^^^^^^^^^^^^^^^ 直接丢弃后缀
  return parts.map(p => parseInt(p, 10) || 0);
};
```

这会导致：
- `v0.1.3` 和 `v0.1.3-beta` 被认为是相同版本
- `v0.1.3-beta` 和 `v0.1.3-preview` 被认为是相同版本
- 无法正确识别从 beta 到稳定版的升级

**需要修复**：使用标准的 semver 比较逻辑，正确处理 pre-release 版本。

## 解决方案

### 方案选择：构建时固定版本

将首页 InstallButton 组件从**客户端获取**改为**构建时获取**，与 Desktop 页面保持一致。

#### 为什么选择这个方案？

1. **符合架构设计**：所有版本信息在构建时固定，通过 Version Monitor + Deploy 工作流实现自动更新
2. **一致的用户体验**：首页和 Desktop 页面版本信息保持同步
3. **更好的性能**：无需客户端网络请求，页面加载更快
4. **更好的可靠性**：不依赖外部 API 的可用性
5. **SEO 友好**：版本信息在初始 HTML 中即可用

### 技术实现

#### 1. 修改首页传递版本数据

在首页 (`src/pages/index.astro`) 中：

```astro
---
import { fetchDesktopVersions, groupAssetsByPlatform } from "@/utils/desktop";

// 在构建时获取版本数据
let versionData = {
  latest: null,
  platforms: [],
  error: null
};

try {
  const data = await fetchDesktopVersions();
  versionData.latest = data.versions[0] || null;
  if (versionData.latest) {
    versionData.platforms = groupAssetsByPlatform(versionData.latest.assets);
  }
} catch (e) {
  versionData.error = e instanceof Error ? e.message : String(e);
}
---

<!-- 将版本数据作为 props 传递给 InstallButton -->
<InstallButton
  version={versionData.latest}
  platforms={versionData.platforms}
  client:load
/>
```

#### 2. 修改 InstallButton 组件

修改 `src/components/home/InstallButton.tsx`：

```tsx
interface InstallButtonProps {
  // 构建时传入的版本数据
  version?: DesktopVersion | null;
  platforms?: PlatformGroup[];
  variant?: 'full' | 'compact';
  showDropdown?: boolean;
  className?: string;
}

export default function InstallButton({
  version,
  platforms = [],
  variant = 'full',
  showDropdown = true,
  className = ''
}: InstallButtonProps) {
  // 移除客户端获取版本的 useEffect
  // 直接使用 props 传入的数据

  const userOS = detectOS();
  const userPlatform = platforms.find(p => p.platform === userOS);

  // ... 其他逻辑保持不变
}
```

#### 3. 统一数据获取流程

确保所有组件都使用相同的工具函数：

- `fetchDesktopVersions()` - 从官方源获取版本数据
- `groupAssetsByPlatform()` - 按平台分组资源
- `formatFileSize()` - 格式化文件大小

### 完整的版本更新流程

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 官方 index.json 更新 (新版本 v0.1.4)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Version Monitor 工作流 (每 30 分钟)                       │
│    - 检测到版本变化 v0.1.3 → v0.1.4                          │
│    - 创建分支 update-version-v0.1.4                          │
│    - 更新 .github/version-state.json                         │
│    - 创建 PR "chore: update version to v0.1.4"               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. 开发者审查并合并 PR                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Deploy 工作流触发 (push to main)                          │
│    - npm run build                                          │
│        - 首页: fetchDesktopVersions() → 获取 v0.1.4          │
│        - Desktop 页面: fetchDesktopVersions() → 获取 v0.1.4  │
│    - 生成静态 HTML (所有版本信息已固定)                      │
│    - 部署到 GitHub Pages                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. 用户访问站点                                              │
│    - 首页 InstallButton 显示 v0.1.4 (构建时固定)             │
│    - Desktop 页面显示 v0.1.4 (构建时固定)                    │
│    - 两个页面版本完全一致                                    │
└─────────────────────────────────────────────────────────────┘
```

## 实施计划

详见 [tasks.md](./tasks.md)。

## 影响范围

### 受影响的文件

- `src/pages/index.astro` - 首页，需要添加版本数据获取逻辑
- `src/components/home/InstallButton.tsx` - 修改为接受 props 传入的版本数据
- `src/pages/desktop/index.astro` - 验证现有实现是否正确（当前已使用构建时获取）

### 不受影响的部分

- ✅ Deploy 工作流 (`.github/workflows/deploy.yml`) - **无需修改**
- ✅ 版本数据工具 (`src/utils/desktop.ts`) - **无需修改**
- ✅ Desktop 页面其他组件 - **无需修改**

### 需要修改的部分

- ⚠️ Version Monitor 脚本 (`scripts/version-monitor.js`) - **需要修复版本比较逻辑**

## 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 无 | 低风险变更 | 主要是将现有客户端逻辑移到构建时 |
| 构建失败 | 版本数据获取失败 | 已有错误处理，构建时会捕获异常 |
| API 超时 | 构建时间增加 | 已有 30 秒超时和重试机制 |

## 成功标准

1. ✅ 首页 InstallButton 在构建时获取版本信息
2. ✅ Desktop 页面继续使用构建时获取版本信息
3. ✅ 首页和 Desktop 页面版本信息保持一致
4. ✅ Version Monitor 检测到新版本后，通过 PR 触发站点更新
5. ✅ 无需任何客户端网络请求即可显示版本信息

## Version Monitor 工作流验证

经过审查，Version Monitor 工作流存在**版本比较问题**，需要修复：

### 问题详情

当前版本比较函数不支持 pre-release 版本（beta/preview/rc）：

| 版本比较 | 当前结果 | 正确结果 |
|---------|---------|---------|
| v0.1.3 vs v0.1.3 | 相等 | 相等 ✅ |
| v0.1.3 vs v0.1.3-beta | **相等** | v0.1.3 > v0.1.3-beta ❌ |
| v0.1.3-beta vs v0.1.3-preview | **相等** | 需要正确比较 ❌ |
| v0.1.3-beta vs v0.1.4-rc | v0.1.3-beta < v0.1.4-rc | v0.1.3-beta < v0.1.4-rc ✅ |

### 修复方案

使用标准的 semver 比较逻辑，正确处理：

1. **稳定版比较**：`v0.1.3` vs `v0.1.4`
2. **Pre-release 比较**：`v0.1.3-beta` vs `v0.1.3-preview`
3. **跨类型比较**：`v0.1.3-beta` vs `v0.1.3`（beta < 稳定版）

### Pre-release 版本优先级

按照 semver 规范，pre-release 版本优先级：

```
alpha < beta < preview < rc < (stable)
```

示例：
- `v0.1.3-alpha` < `v0.1.3-beta`
- `v0.1.3-beta` < `v0.1.3-rc.1`
- `v0.1.3-rc.1` < `v0.1.3` (稳定版)

## 后续优化

1. **缓存策略**：当前每次构建都会获取最新版本，这是预期行为
2. **版本回退**：如果官方版本回退，semver 比较会正确处理
3. **多版本支持**：当前架构已支持显示多个历史版本

## 相关资源

- 官方版本数据源: `https://desktop.dl.hagicode.com/index.json`
- Desktop 页面: `src/pages/desktop/index.astro`
- 首页: `src/pages/index.astro`
- InstallButton 组件: `src/components/home/InstallButton.tsx`
- 版本数据工具: `src/utils/desktop.ts`
- Version Monitor 工作流: `.github/workflows/version-monitor.yml`
- Version Monitor 脚本: `scripts/version-monitor.js`
- Deploy 工作流: `.github/workflows/deploy.yml`
