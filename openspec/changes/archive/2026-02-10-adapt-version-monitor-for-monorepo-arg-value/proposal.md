# 提案: 适配 MonoRepo 架构的版本监控

## 提案元数据

- **ID**: `adapt-version-monitor-for-monorepo-arg-value`
- **状态**: <span class="status-completed">执行完成</span>
- **创建日期**: 2026-02-10
- **目标分支**: `main`
- **影响范围**: Version Monitor 工作流、MonoRepo 架构、多应用版本管理

---

## 概述

将 Version Monitor 功能适配到新的 MonoRepo 架构。项目已完成从单体 Astro 应用到 MonoRepo 的重构,Version Monitor 需要相应调整以支持多应用结构和新的文件组织方式。

---

## 动机

### 当前 MonoRepo 架构状态

项目已完成从单体 Astro 应用到 MonoRepo 架构的重构（提案 `refactor-astro-site-to-monorepo-architecture`,状态:ExecutionCompleted）。当前目录结构如下:

```
pcode-docs/
├── apps/
│   ├── docs/                # Starlight 文档站点
│   └── website/             # 官方营销站点
├── packages/
│   └── shared/              # 共享代码
├── openspec/                # OpenSpec 工作流(根级别)
├── .github/workflows/       # CI/CD 配置
└── package.json             # 根级 workspaces 配置
```

### Version Monitor 功能定位

Version Monitor 负责监控 Hagicode 桌面应用的新版本发布,并自动创建 PR 更新版本索引文件。根据 `fix-version-monitor-pr-creation` 提案(已完成),该功能已从直接 GitHub API 调用迁移到使用 `gh` CLI 的工作流实现方式。

### 问题

当前 Version Monitor 功能存在以下与 MonoRepo 架构不兼容的问题:

1. **版本索引文件位置**: 当前 `public/version-index.json` 位于根目录,在 MonoRepo 结构下需要明确应该由哪个应用管理此文件
2. **多应用同步更新**: Docs 和 Website 两个应用可能都需要使用相同的版本信息,当前实现仅更新单一文件
3. **部署目标不一致**:
   - Docs 应用部署到 GitHub Pages
   - Website 应用部署到 Azure Static Web Apps
   - Version Monitor 需要明确更新哪个应用的版本文件
4. **工作流路径变更**:
   - 原有工作流路径: `public/version-index.json`
   - 新 MonoRepo 路径: `apps/docs/public/version-index.json` 或 `apps/website/public/version-index.json`
5. **CI/CD 工作流分离**: 当前 `version-monitor.yml` 需要适配新的多应用部署工作流（`deploy-docs.yml` 和 `deploy-website.yml`）

---

## 解决方案

### 版本管理策略选择

**方案 A: 在共享包中管理版本**

1. 将 `version-index.json` 移至 `packages/shared/data/version-index.json`
2. Docs 和 Website 应用通过构建时复制或 npm link 方式获取版本数据
3. Version Monitor 工作流直接更新共享包中的版本文件

**方案 B: 在 Docs 应用中管理版本(推荐)**

1. 将 `version-index.json` 移至 `apps/docs/public/version-index.json`
2. Website 应用通过共享包 `packages/shared` 提供的工具函数读取版本信息
3. Version Monitor 工作流仅更新 Docs 应用的版本文件

**推荐方案 B 的理由**:

- Docs 应用是文档站点,包含桌面应用下载和版本相关文档
- Website 应用是营销站点,可以从 Docs 获取版本信息
- 保持 `public/version-index.json` 在可公开访问的位置
- 简化 Version Monitor 工作流的实现

### 具体实施步骤

1. **版本文件迁移**
   - 移动 `public/version-index.json` → `apps/docs/public/version-index.json`
   - 更新 `scripts/version-monitor.js` 中的文件路径引用
   - 删除根目录和 Website 应用中的冗余版本文件

2. **共享工具创建**
   - 在 `packages/shared/src/` 中添加 `version.ts`,提供版本读取和导出功能
   - 在 Website 应用中引入共享包以获取版本信息

3. **工作流适配**
   - 更新 `.github/workflows/version-monitor.yml` 中的文件路径
   - 确保工作流仅修改 `apps/docs/public/version-index.json`
   - 添加工作流触发 Docs 应用部署的逻辑

4. **依赖注入配置**
   - 在根级 `package.json` 中添加 `postinstall` 脚本(如需要)
   - 确保两个应用都能正确访问版本数据

5. **CI/CD 集成**
   - 更新 `deploy-docs.yml` 以包含版本检查步骤
   - 在 Version Monitor 工作流中添加对 Docs 应用构建和部署的触发

---

## 变更内容

### 文件变更

1. **版本文件迁移**:
   - 移动 `public/version-index.json` → `apps/docs/public/version-index.json`
   - 删除 `apps/website/public/version-index.json`（冗余文件）

2. **脚本更新**:
   - 更新 `scripts/version-monitor.js` 中的 `VERSION_INDEX_FILE` 常量

3. **工作流更新**:
   - 更新 `.github/workflows/version-monitor.yml` 中的文件路径和提交路径

4. **共享包新增**:
   - 新增 `packages/shared/src/version.ts` - 版本工具函数

5. **应用配置**:
   - 更新 `apps/website/package.json` - 确保对 `@pcode-docs/shared` 的依赖

### 工作流变更

1. **version-monitor.yml**:
   - 更新 git add 路径: `public/version-index.json` → `apps/docs/public/version-index.json`
   - 更新 PR 描述中的文件路径引用
   - 确保工作流可以正确创建和提交到新路径

2. **deploy-docs.yml**:
   - 保持现有构建逻辑不变
   - 确认 `apps/docs/public/version-index.json` 会被正确部署

### 共享工具函数

新增 `packages/shared/src/version.ts` 提供以下功能:

```typescript
/**
 * 从 Docs 应用的 version-index.json 读取版本信息
 * @returns Promise<DesktopIndexResponse>
 */
export async function getVersionIndex(): Promise<DesktopIndexResponse>

/**
 * 获取最新版本号
 * @returns Promise<string>
 */
export async function getLatestVersion(): Promise<string>
```

---

## 影响分析

### 受影响的规范

- `monorepo-structure` - 扩展以包含版本管理策略
- `github-integration` - 更新 Version Monitor 工作流配置
- `astro-site` - 明确各应用对版本数据的访问方式

### 受影响的代码

1. **版本文件**:
   - `public/version-index.json` → `apps/docs/public/version-index.json`
   - 删除 `apps/website/public/version-index.json`

2. **脚本**:
   - `scripts/version-monitor.js:34` - 更新 `VERSION_INDEX_FILE` 常量

3. **工作流**:
   - `.github/workflows/version-monitor.yml:71` - 更新 git add 路径
   - `.github/workflows/version-monitor.yml:122` - 更新 PR 描述中的路径

4. **共享包**:
   - `packages/shared/src/version.ts` - 新增版本工具函数
   - `packages/shared/src/index.ts` - 导出版本函数

5. **应用配置**:
   - `apps/website/package.json` - 验证对 `@pcode-docs/shared` 的依赖

---

## 预期收益

- **架构一致性**: Version Monitor 与 MonoRepo 架构完全对齐
- **代码复用**: 通过共享包统一版本数据访问逻辑
- **维护简化**: 单一版本数据源,减少同步问题
- **部署清晰**: 明确的版本更新和部署流程
- **职责明确**: Docs 应用负责版本数据,Website 应用通过共享包获取

---

## 潜在风险

### 高风险

无

### 中风险

1. **迁移期间服务中断**: 版本文件移动期间可能导致版本信息不可用
   - 缓解: 先创建新文件,再删除旧文件,确保平滑过渡
   - 回退: 保留原始文件位置作为备份

2. **构建依赖**: 需要确保 Website 应用能正确读取共享包中的版本数据
   - 缓解: 添加构建时验证,确保版本数据可访问
   - 测试: 在本地和 CI/CD 环境中验证

### 低风险

1. **工作流复杂性**: 增加的工作流步骤可能导致调试难度提升
   - 缓解: 添加详细的日志输出
   - 文档: 更新相关文档说明

---

## 成功标准

### 功能完整性

- [ ] Version Monitor 工作流可以成功更新 `apps/docs/public/version-index.json`
- [ ] Docs 应用可以访问 `public/version-index.json`
- [ ] Website 应用可以通过共享包访问版本信息
- [ ] 工作流创建的 PR 包含正确的文件路径
- [ ] 合并 PR 后 Docs 应用自动部署包含新版本

### 兼容性

- [ ] 现有的版本监控逻辑保持不变
- [ ] PR 创建和合并流程不受影响
- [ ] 部署工作流正常触发

### 测试验证

- [ ] 本地运行 `scripts/version-monitor.js` 验证路径更新
- [ ] 手动触发 GitHub Actions 工作流验证
- [ ] 验证 Website 应用可以正确导入和使用版本工具

---

## 回滚计划

如果在生产环境中发现严重问题:

1. **立即回滚**:
   ```bash
   # 恢复原始文件位置
   git revert <merge-commit>
   git push
   ```

2. **手动恢复**:
   - 将 `apps/docs/public/version-index.json` 复制回 `public/version-index.json`
   - 恢复 `scripts/version-monitor.js` 中的原始路径
   - 恢复 `.github/workflows/version-monitor.yml` 中的原始配置

3. **回滚触发条件**:
   - Version Monitor 工作流持续失败
   - Website 应用无法获取版本信息
   - Docs 应用部署失败

---

## 相关提案

- `refactor-astro-site-to-monorepo-architecture` - MonoRepo 架构重构
- `fix-version-monitor-pr-creation` - Version Monitor PR 创建修复

---

## 参考资料

- 当前 Version Monitor 工作流: `.github/workflows/version-monitor.yml`
- Version Monitor 脚本: `scripts/version-monitor.js`
- MonoRepo 结构: `pnpm-workspace.yaml`
- Docs 应用部署: `.github/workflows/deploy-docs.yml`
