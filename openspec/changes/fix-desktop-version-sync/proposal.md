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

经过审查，Version Monitor 工作流 (`scripts/version-monitor.js`) **工作正常**：

- ✅ 每 30 分钟检查官方 `index.json`
- ✅ 检测到新版本时创建 PR
- ✅ PR 描述中明确说明"CI/CD pipeline will automatically rebuild and deploy"
- ✅ 避免重复创建相同版本的 PR

**Version Monitor 无需修改**。

## 解决方案

### 方案选择：客户端版本获取

将 Desktop 页面的版本数据获取从**构建时**改为**运行时**，使用 React 客户端组件动态获取版本信息。

#### 为什么选择这个方案？

1. **简单直接**：无需修改 CI/CD 配置或工作流
2. **行为一致**：与首页 InstallButton 保持一致的用户体验
3. **低风险**：仅影响 Desktop 页面的版本显示部分
4. **即时生效**：版本更新后用户刷新页面即可看到最新版本

### 技术实现

#### 1. 创建版本显示组件

创建一个新的 React 组件 `VersionDisplay.tsx`：

```tsx
// src/components/desktop/VersionDisplay.tsx
interface VersionDisplayProps {
  onVersionsLoaded?: (versions: DesktopVersion[]) => void;
}

export default function VersionDisplay({ onVersionsLoaded }: VersionDisplayProps) {
  const [versions, setVersions] = useState<DesktopVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 客户端获取版本数据
    fetch('https://desktop.dl.hagicode.com/index.json')
      .then(res => res.json())
      .then(data => {
        setVersions(data.versions);
        onVersionsLoaded?.(data.versions);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // 渲染加载状态、错误状态或版本信息
}
```

#### 2. 修改 Desktop 页面

在 `src/pages/desktop/index.astro` 中：

1. 移除构建时的 `fetchDesktopVersions()` 调用
2. 将版本显示区域替换为 `VersionDisplay` 客户端组件
3. 添加加载状态和错误处理的 UI

```astro
---
// 移除构建时的版本获取
// import { fetchDesktopVersions } from "@/utils/desktop";
// const data = await fetchDesktopVersions(); // 删除

// 导入新的客户端组件
import VersionDisplay from '@/components/desktop/VersionDisplay';
---

<main>
  <!-- 使用客户端组件渲染版本信息 -->
  <VersionDisplay client:load />
</main>
```

#### 3. 统一数据获取逻辑

考虑将版本获取逻辑提取为共享的 React Hook 或工具函数，确保首页和 Desktop 页面使用相同的实现。

```tsx
// src/hooks/useDesktopVersions.ts
export function useDesktopVersions() {
  const [versions, setVersions] = useState<DesktopVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch('https://desktop.dl.hagicode.com/index.json');
        const data = await response.json();
        setVersions(data.versions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, []);

  return { versions, loading, error };
}
```

## 实施计划

详见 [tasks.md](./tasks.md)。

## 影响范围

### 受影响的文件

- `src/pages/desktop/index.astro` - Desktop 页面主文件
- `src/components/desktop/VersionDisplay.tsx` - 新建版本显示组件
- `src/hooks/useDesktopVersions.ts` - 新建共享 Hook（可选）
- `src/components/home/InstallButton.tsx` - 可选重构以使用共享 Hook

### 不受影响的部分

- Version Monitor 工作流 (`scripts/version-monitor.js`)
- CI/CD 配置
- 首页其他组件
- 文档站点其他页面

## 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 加载延迟 | 用户看到短暂加载状态 | 添加骨架屏或加载动画 |
| API 失败 | 无法显示版本信息 | 添加错误处理和降级方案 |
| SEO 影响 | 版本号不在初始 HTML 中 | 版本号不是 SEO 关键内容，影响可忽略 |

## 成功标准

1. ✅ Desktop 页面版本号在官方 `index.json` 更新后自动更新
2. ✅ 无需重新构建站点即可显示最新版本
3. ✅ Desktop 页面与首页使用统一的数据源
4. ✅ 用户体验保持良好（适当的加载状态提示）
5. ✅ 错误处理：当获取版本失败时显示友好提示并提供降级方案

## 后续优化

1. **缓存策略**：可以考虑添加浏览器缓存，避免每次都重新请求
2. **Service Worker**：通过 SW 缓存版本数据，提供离线支持
3. **数据统一**：考虑将 InstallButton 也迁移到使用共享的 `useDesktopVersions` Hook

## 相关资源

- 官方版本数据源: `https://desktop.dl.hagicode.com/index.json`
- Desktop 页面: `src/pages/desktop/index.astro`
- 首页 InstallButton: `src/components/home/InstallButton.tsx`
- 版本数据工具: `src/utils/desktop.ts`
