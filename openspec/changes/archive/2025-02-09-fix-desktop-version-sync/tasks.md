# 实施任务清单

## 概述

本文档列出了修复 Desktop 页面版本同步问题的具体实施任务。

**架构原则**：所有版本信息在构建时固定，通过 Version Monitor + Deploy 工作流实现自动更新。

**重要更新**：需要修复 Version Monitor 的版本比较逻辑，以正确处理 pre-release 版本（beta/preview/rc）。

## 任务列表

### 阶段 1：验证和准备

- [ ] **1.1 验证 Version Monitor 工作流**
  - 检查 `scripts/version-monitor.js` 的版本检测逻辑
  - 验证 semver 版本比较是否正确
  - **特别关注 pre-release 版本比较**（beta/preview/rc）
  - 确认 PR 创建流程正常
  - **预期结果**：发现版本比较问题，记录需要修复的部分
  - **验证方式**：代码审查 + 日志分析

- [ ] **1.2 测试当前版本比较逻辑**
  - 测试以下版本比较场景：
    - `v0.1.3` vs `v0.1.3` → 应该相等
    - `v0.1.3` vs `v0.1.3-beta` → 应该 v0.1.3 更大
    - `v0.1.3-beta` vs `v0.1.3-preview` → 应该正确比较
    - `v0.1.3-beta` vs `v0.1.4-alpha` → 应该 v0.1.4-alpha 更大
  - **预期结果**：确认当前实现的问题
  - **验证方式**：编写测试用例验证

- [ ] **1.3 验证当前 Desktop 页面实现**
  - 确认 Desktop 页面使用构建时获取版本
  - 检查 `fetchDesktopVersions()` 调用位置
  - 验证版本数据渲染逻辑
  - **预期结果**：Desktop 页面已正确使用构建时获取
  - **验证方式**：代码审查

- [ ] **1.4 验证 Deploy 工作流**
  - 检查 `.github/workflows/deploy.yml` 配置
  - 确认 PR 合并后会触发构建
  - 验证构建命令包含版本数据获取
  - **预期结果**：Deploy 工作流正常，无需修改
  - **验证方式**：工作流配置审查

- [ ] **1.5 准备开发环境**
  - 确保本地开发服务器可以正常运行 (`npm run dev`)
  - 验证可以访问首页和 Desktop 页面
  - 测试构建命令是否正常 (`npm run build`)
  - **预期结果**：开发环境准备就绪
  - **验证方式**：本地测试

### 阶段 2：修复 Version Monitor 版本比较

- [ ] **2.1 实现正确的 semver 比较函数**
  - 修改 `scripts/version-monitor.js` 中的 `compareVersions()` 函数
  - 支持标准 semver 格式：`v1.2.3-prerelease.build`
  - 正确处理 pre-release 标识（alpha、beta、preview、rc 等）
  - 实现 pre-release 版本优先级比较
  - **预期结果**：版本比较符合 semver 规范
  - **验证方式**：编写单元测试

  ```javascript
  // 需要支持的版本格式
  v0.1.3           // 稳定版
  v0.1.3-beta      // beta 版本
  v0.1.3-preview   // preview 版本
  v0.1.3-rc.1      // release candidate
  v0.1.3-alpha.1   // alpha 版本
  ```

- [ ] **2.2 添加版本比较测试用例**
  - 创建测试脚本或手动测试方案
  - 测试以下场景：
    - 相同版本比较
    - 不同主版本比较
    - 不同次版本比较
    - 不同补丁版本比较
    - Pre-release 版本之间比较
    - Pre-release 与稳定版比较
  - **预期结果**：所有测试用例通过
  - **验证方式**：运行测试

- [ ] **2.3 更新版本提取逻辑**
  - 检查 `extractVersionFromData()` 函数
  - 确保能正确提取带 pre-release 标识的版本号
  - **预期结果**：版本号提取正确
  - **验证方式**：使用 mock 数据测试

### 阶段 3：修改首页 InstallButton

- [ ] **3.1 修改首页添加版本数据获取**
  - 在 `src/pages/index.astro` 中导入 `fetchDesktopVersions`
  - 在 frontmatter 中添加版本数据获取逻辑
  - 处理错误情况
  - **预期结果**：首页可以获取版本数据
  - **验证方式**：构建时检查日志

  ```astro
  ---
  import { fetchDesktopVersions, groupAssetsByPlatform } from "@/utils/desktop";

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
    console.error("Failed to fetch desktop versions:", e);
    versionData.error = e instanceof Error ? e.message : String(e);
  }
  ---
  ```

- [ ] **3.2 修改 InstallButton 组件接口**
  - 修改 `src/components/home/InstallButton.tsx`
  - 添加 `version` 和 `platforms` props
  - 更新 TypeScript 类型定义
  - **预期结果**：InstallButton 可以接受构建时传入的数据
  - **验证方式**：类型检查通过

  ```tsx
  interface InstallButtonProps {
    version?: DesktopVersion | null;
    platforms?: PlatformGroup[];
    variant?: 'full' | 'compact';
    showDropdown?: boolean;
    className?: string;
  }
  ```

- [ ] **3.3 移除客户端版本获取逻辑**
  - 删除 InstallButton 中的 `useEffect` 获取版本代码
  - 删除相关的 state (`platformData`, `isLoading`, `hasError`)
  - 直接使用 props 传入的数据
  - **预期结果**：不再有客户端网络请求
  - **验证方式**：浏览器网络面板检查

- [ ] **3.4 更新首页传递数据给 InstallButton**
  - 在首页中将获取的版本数据传递给 InstallButton
  - 处理无数据或错误情况的降级显示
  - **预期结果**：首页正确传递版本数据
  - **验证方式**：本地开发测试

  ```astro
  <InstallButton
    version={versionData.latest}
    platforms={versionData.platforms}
    variant="full"
    client:load
  />
  ```

### 阶段 4：优化和测试

- [ ] **4.1 测试 Version Monitor 版本比较**
  - 使用实际的 pre-release 版本号测试
  - 验证从 beta 到稳定版的升级检测
  - 验证不会为相同版本创建重复 PR
  - **预期结果**：版本比较逻辑正确
  - **验证方式**：本地测试脚本

- [ ] **4.2 添加错误处理和降级方案**
  - 当版本获取失败时显示友好的错误提示
  - 提供前往 Desktop 页面的降级链接
  - 确保即使版本数据不可用，安装按钮仍然可用
  - **预期结果**：各种情况下都有良好的用户体验
  - **验证方式**：手动模拟获取失败场景

- [ ] **4.3 本地功能测试**
  - 测试首页 InstallButton 功能：
    - ✅ 版本号正确显示
    - ✅ 下载按钮链接正确
    - ✅ 平台检测和排序正常
    - ✅ 下拉菜单功能正常
  - 测试 Desktop 页面功能：
    - ✅ 版本号正确显示
    - ✅ 下载选项正确
    - ✅ 版本历史正常
  - **预期结果**：所有功能正常工作
  - **验证方式**：手动测试

- [ ] **4.4 跨浏览器测试**
  - 在以下浏览器中测试：
    - Chrome/Edge (Chromium)
    - Firefox
    - Safari (如可用)
  - **预期结果**：所有主流浏览器功能一致
  - **验证方式**：逐一测试各浏览器

- [ ] **4.5 响应式测试**
  - 测试不同屏幕尺寸：
    - 桌面 (>1024px)
    - 平板 (768px-1024px)
    - 手机 (<768px)
  - **预期结果**：各尺寸下显示正常
  - **验证方式**：浏览器响应式设计模式

- [ ] **4.6 构建测试**
  - 运行 `npm run build` 确保构建成功
  - 检查构建输出是否有警告或错误
  - 验证生成的静态页面包含版本信息
  - **预期结果**：构建成功，无警告
  - **验证方式**：构建命令 + 检查输出 HTML

### 阶段 5：文档和清理

- [ ] **5.1 更新组件文档**
  - 为 InstallButton 添加 JSDoc 注释
  - 说明 props 的用途和数据结构
  - 更新相关 TypeScript 类型定义
  - **预期结果**：代码有良好的文档注释

- [ ] **5.2 清理未使用的代码**
  - 检查是否有未使用的导入或变量
  - 移除客户端版本获取的相关代码
  - 清理任何临时调试代码
  - **预期结果**：代码库整洁，无死代码

- [ ] **5.3 更新变更日志**
  - 在项目的 CHANGELOG 中记录此变更
  - **预期结果**：变更记录完整

### 阶段 6：部署验证

- [ ] **6.1 创建 Pull Request**
  - 提交变更到新分支
  - 创建 PR，描述变更内容
  - **预期结果**：PR 创建成功

- [ ] **6.2 部署到预览环境**
  - 通过 CI/CD 部署预览版本
  - 在预览环境中验证功能
  - **预期结果**：预览环境功能正常

- [ ] **6.3 合并到主分支**
  - 代码审查通过后合并
  - 触发生产环境部署
  - **预期结果**：生产环境更新成功

- [ ] **6.4 生产环境验证**
  - 访问生产环境的首页和 Desktop 页面
  - 验证版本信息正确显示
  - 验证两个页面版本信息一致
  - **预期结果**：生产环境功能正常

- [ ] **6.5 验证完整流程**
  - 等待或触发 Version Monitor 工作流
  - 验证新版本 PR 创建流程
  - 合并 PR 后验证站点自动更新
  - **预期结果**：完整的版本更新流程正常工作

### 阶段 7：Pre-release 版本测试（新增）

- [ ] **7.1 测试 Beta 版本检测**
  - 模拟发布 beta 版本（如 v0.1.4-beta）
  - 验证 Version Monitor 正确检测到版本变化
  - 确认 PR 正确创建
  - **预期结果**：Beta 版本被正确识别
  - **验证方式**：使用测试数据或手动触发

- [ ] **7.2 测试 Beta 到稳定版升级**
  - 从 v0.1.4-beta 升级到 v0.1.4
  - 验证版本比较逻辑正确判断为新版本
  - 确认不会跳过稳定版更新
  - **预期结果**：正确检测从 beta 到稳定版的升级
  - **验证方式**：测试脚本

- [ ] **7.3 测试各种 Pre-release 格式**
  - 测试 alpha 版本（v0.1.4-alpha）
  - 测试 preview 版本（v0.1.4-preview）
  - 测试 rc 版本（v0.1.4-rc.1）
  - 测试带数字的 pre-release（v0.1.4-beta.2）
  - **预期结果**：所有格式都能正确解析和比较
  - **验证方式**：测试套件

## 实施注意事项

### 开发原则

1. **保持架构一致性**：所有版本信息必须在构建时固定
2. **渐进式实施**：按照任务顺序逐步完成
3. **持续验证**：每完成一个任务立即进行验证
4. **保持兼容**：确保修改不影响其他页面和功能

### 回滚计划

如果部署后发现严重问题：
1. 回滚到之前的版本
2. 首页将恢复到客户端获取版本的方式
3. 不影响 Desktop 页面功能
4. 不影响 Version Monitor 和 Deploy 工作流

### 已知限制

1. **版本更新延迟**：新版本发布后最多延迟 30 分钟被检测到（Version Monitor 间隔）
2. **PR 合并延迟**：需要人工审查并合并 PR 后才会触发站点更新
3. **构建时间**：每次版本更新需要重新构建整个站点

### 架构优势

1. **一致的版本信息**：首页和 Desktop 页面版本完全一致
2. **更好的性能**：无需客户端网络请求
3. **更好的可靠性**：不依赖外部 API 的可用性
4. **SEO 友好**：版本信息在初始 HTML 中即可用
5. **可预测性**：版本信息在构建时确定，便于测试和调试
6. **Pre-release 支持**：正确处理 beta/preview/rc 等预发布版本

## Pre-release 版本优先级

按照 semver 规范，pre-release 版本优先级：

```
alpha < beta < preview < rc < (stable)
```

示例：
- `v0.1.3-alpha` < `v0.1.3-beta`
- `v0.1.3-beta` < `v0.1.3-rc.1`
- `v0.1.3-rc.1` < `v0.1.3` (稳定版)

## 预计工时

- 阶段 1：1.5 小时
- 阶段 2：2-3 小时（版本比较修复）
- 阶段 3：2-3 小时
- 阶段 4：1-2 小时
- 阶段 5：0.5 小时
- 阶段 6：1 小时
- 阶段 7：1-2 小时（pre-release 测试）

**总计**：约 9-13 小时
