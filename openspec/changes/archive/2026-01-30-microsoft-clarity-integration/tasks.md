# Implementation Tasks: 集成 Microsoft Clarity 用户行为分析

本文档列出实现 Microsoft Clarity 集成所需的所有任务。任务按逻辑顺序排列,每个任务都包含验证标准。

---

## Phase 1: 准备和配置

### Task 1.1: 创建 Microsoft Clarity 项目并获取 Project ID

**描述**: 在 Microsoft Clarity 平台创建新项目并获取 Project ID

**步骤**:
1. 访问 [Microsoft Clarity](https://clarity.microsoft.com/)
2. 使用 Microsoft 账户登录
3. 点击 "Create new project"
4. 填写项目信息:
   - Project name: `Hagicode Docs` (或自定义名称)
   - Website URL: `https://hagicode-org.github.io/site/` (生产环境 URL)
5. 创建项目后,复制 Project ID (格式: `xxxxxxxxxx`)

**验证标准**:
- ✅ 成功创建 Clarity 项目
- ✅ 获取到有效的 Project ID

**注意事项**:
- 此任务需手动完成,不涉及代码更改
- 暂时保存 Project ID,后续将在 Task 1.3 中配置到 GitHub Secrets

**预计时间**: 10 分钟

---

### Task 1.2: 验证 GitHub Actions 配置

**描述**: 确认 `.github/workflows/deploy.yml` 已包含 `CLARITY_PROJECT_ID` 环境变量配置

**步骤**:
1. 检查 `.github/workflows/deploy.yml` 文件
2. 确认 line 36 包含 `CLARITY_PROJECT_ID: ${{ secrets.CLARITY_PROJECT_ID }}`

**验证标准**:
- ✅ `deploy.yml` 已包含 `CLARITY_PROJECT_ID` 配置(无需修改)

**预计时间**: 2 分钟

---

### Task 1.3: 配置 GitHub Secrets

**描述**: 在 GitHub 仓库设置中添加 `CLARITY_PROJECT_ID` Secret

**步骤**:
1. 访问 GitHub 仓库设置页面: `https://github.com/HagiCode-org/site/settings/secrets/actions`
2. 点击 "New repository secret"
3. 填写信息:
   - Name: `CLARITY_PROJECT_ID`
   - Value: `<Task 1.1 中获取的 Project ID>`
4. 点击 "Add secret"

**验证标准**:
- ✅ GitHub Secrets 中成功添加 `CLARITY_PROJECT_ID`
- ✅ Secret 值与 Clarity Project ID 一致

**注意事项**:
- 确保 Secret 名称完全匹配(区分大小写)
- 不要在代码中硬编码 Project ID

**预计时间**: 5 分钟

---

## Phase 2: 核心实现

### Task 2.1: 创建 Clarity.astro 组件

**描述**: 创建 Microsoft Clarity 脚本封装组件

**文件**: `src/components/Clarity.astro`

**步骤**:
1. 创建文件 `src/components/Clarity.astro`
2. 添加以下内容:

```astro
---
/**
 * Microsoft Clarity 用户行为分析集成组件
 * 仅在生产环境加载 Clarity 脚本
 *
 * @see https://learn.microsoft.com/en-us/clarity/
 */
const clarityProjectId = import.meta.env.CLARITY_PROJECT_ID;
const isProduction = import.meta.env.PROD;
---

{isProduction && clarityProjectId && (
  <script is:inline define:vars={{clarityProjectId}}>
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", clarityProjectId);
  </script>
)}
```

**验证标准**:
- ✅ 文件创建成功
- ✅ 组件使用 `is:inline` 和 `define:vars` 特性
- ✅ 仅在生产环境且有 Project ID 时加载脚本

**预计时间**: 15 分钟

---

### Task 2.2: 更新 StarlightWrapper.astro 集成 Clarity 组件

**描述**: 在现有的自定义布局组件中引入 Clarity 组件

**文件**: `src/components/StarlightWrapper.astro`

**步骤**:
1. 读取现有 `src/components/StarlightWrapper.astro` 文件
2. 在 frontmatter 中添加 Clarity 组件导入:
   ```astro
   ---
   import { Layout as StarlightLayout } from '@astrojs/starlight/components';
   import Clarity from './Clarity.astro';
   ---
   ```
3. 在 `StarlightLayout` 组件内添加 `<Clarity />`:
   ```astro
   <StarlightLayout {...Astro.props}>
     <slot />
     <Clarity />
   </StarlightLayout>
   ```

**验证标准**:
- ✅ 成功导入 `Clarity` 组件
- ✅ `<Clarity />` 组件位于 `StarlightLayout` 内部
- ✅ 不影响现有的 `<slot />` 和其他组件

**预计时间**: 5 分钟

---

### Task 2.3: 配置 astro.config.mjs 环境变量

**描述**: 在 Astro 配置文件中添加 Vite 环境变量配置

**文件**: `astro.config.mjs`

**步骤**:
1. 读取现有 `astro.config.mjs` 文件
2. 在 `defineConfig` 对象中添加 `vite` 配置:

```javascript
export default defineConfig({
  // ... 现有配置 (base, markdown, integrations)

  // 添加 Vite 环境变量配置
  vite: {
    define: {
      'import.meta.env.CLARITY_PROJECT_ID': JSON.stringify(
        process.env.CLARITY_PROJECT_ID || ''
      ),
    },
  },
});
```

**验证标准**:
- ✅ `vite.define` 配置正确添加
- ✅ 使用 `process.env.CLARITY_PROJECT_ID` 读取环境变量
- ✅ 未配置时默认为空字符串(避免构建错误)

**预计时间**: 10 分钟

---

## Phase 3: 本地测试和验证

### Task 3.1: 验证开发环境不加载 Clarity

**描述**: 确认开发环境不加载 Clarity 脚本

**步骤**:
1. 启动开发服务器: `npm run dev`
2. 访问 `http://localhost:4321/`
3. 打开浏览器开发者工具 → Network 面板
4. 刷新页面并搜索 "clarity"

**验证标准**:
- ✅ Network 面板中无 `clarity.ms` 相关请求
- ✅ 页面源代码中无 Clarity 脚本

**预计时间**: 5 分钟

---

### Task 3.2: 验证生产构建包含 Clarity 脚本

**描述**: 确认生产构建正确注入 Clarity 脚本(需配置 CLARITY_PROJECT_ID)

**步骤**:
1. 设置环境变量(测试用):
   ```bash
   export CLARITY_PROJECT_ID=test_project_id
   ```
2. 运行生产构建: `npm run build`
3. 预览构建: `npm run preview`
4. 访问 `http://localhost:4321/`
5. 打开浏览器开发者工具 → Network 面板
6. 刷新页面并搜索 "clarity"
7. 检查页面源代码(右键 → View Page Source)

**验证标准**:
- ✅ Network 面板显示请求 `https://www.clarity.ms/tag/test_project_id`
- ✅ 页面源代码包含 Clarity 脚本
- ✅ 脚本中的 `clarityProjectId` 变量值为 `test_project_id`

**注意事项**:
- 如果未配置 `CLARITY_PROJECT_ID`,则不应加载 Clarity 脚本
- 测试完成后可取消环境变量: `unset CLARITY_PROJECT_ID`

**预计时间**: 10 分钟

---

### Task 3.3: 运行 TypeScript 类型检查

**描述**: 确保代码符合 TypeScript 类型规范

**步骤**:
1. 运行类型检查: `npm run typecheck`
2. 检查是否有类型错误

**验证标准**:
- ✅ `npm run typecheck` 通过,无类型错误

**预计时间**: 3 分钟

---

### Task 3.4: 验证无 Project ID 时不报错

**描述**: 确保未配置 `CLARITY_PROJECT_ID` 时构建成功

**步骤**:
1. 确保环境变量未设置:
   ```bash
   unset CLARITY_PROJECT_ID
   ```
2. 运行生产构建: `npm run build`
3. 预览构建: `npm run preview`
4. 访问 `http://localhost:4321/`

**验证标准**:
- ✅ 构建成功,无错误
- ✅ 页面正常加载,无 Clarity 脚本
- ✅ 浏览器控制台无错误

**预计时间**: 5 分钟

---

## Phase 4: 生产部署和验证

### Task 4.1: 提交代码并推送到 GitHub

**描述**: 创建 Git commit 并推送到远程仓库触发 CI/CD

**步骤**:
1. 提交更改:
   ```bash
   git add .
   git commit -m "feat: 集成 Microsoft Clarity 用户行为分析"
   ```
2. 推送到 `feat/astro-migration` 分支(或创建新分支):
   ```bash
   git push origin feat/astro-migration
   ```

**验证标准**:
- ✅ Git commit 成功创建
- ✅ 代码成功推送到 GitHub

**预计时间**: 3 分钟

---

### Task 4.2: 验证 GitHub Actions 构建成功

**描述**: 确认 CI/CD 流水线成功构建并部署

**步骤**:
1. 访问 GitHub Actions 页面: `https://github.com/HagiCode-org/site/actions`
2. 查看最新的 build workflow 运行状态
3. 检查构建日志中是否包含 `CLARITY_PROJECT_ID`

**验证标准**:
- ✅ GitHub Actions workflow 运行成功(绿色 ✓)
- ✅ 构建日志显示环境变量已加载
- ✅ 无构建错误或警告

**预计时间**: 5 分钟(需等待 CI/CD 完成,约 2-3 分钟)

---

### Task 4.3: 验证生产环境 Clarity 正常工作

**描述**: 确认生产环境正确加载 Clarity 并开始收集数据

**步骤**:
1. 访问生产环境: `https://hagicode-org.github.io/site/`
2. 打开浏览器开发者工具 → Network 面板
3. 刷新页面并搜索 "clarity"
4. 访问 [Microsoft Clarity Dashboard](https://clarity.microsoft.com/)
5. 查看项目实时数据

**验证标准**:
- ✅ Network 面板显示 Clarity 脚本请求
- ✅ Clarity Dashboard 显示实时用户会话
- ✅ Dashboard 开始记录热图和会话录制

**注意事项**:
- Clarity Dashboard 数据可能有 5-10 分钟延迟
- 首次访问可能需要等待几分钟才能看到数据

**预计时间**: 10 分钟

---

### Task 4.4: 性能验证(可选)

**描述**: 使用 Lighthouse 验证 Clarity 对页面性能的影响

**步骤**:
1. 在生产环境页面打开 Chrome DevTools
2. 切换到 Lighthouse 面板
3. 运行 Performance 审计
4. 对比集成前后的性能评分

**验证标准**:
- ✅ Lighthouse 性能评分降低 < 2 分
- ✅ FCP 和 LCP 指标无明显恶化

**预计时间**: 10 分钟

---

## Phase 5: 文档和归档

### Task 5.1: 更新项目文档

**描述**: 在相关文档中记录 Clarity 集成信息

**步骤**:
1. 更新 `openspec/project.md` 的 "External Dependencies" 部分,添加:
   ```markdown
   - **Microsoft Clarity**: 用户行为分析工具(热图、会话录制)
   ```
2. 如有相关技术文档,记录 Clarity 集成方式

**验证标准**:
- ✅ `project.md` 包含 Microsoft Clarity 依赖说明

**预计时间**: 5 分钟

---

### Task 5.2: 归档 OpenSpec 提案

**描述**: 在完成部署和验证后,归档 OpenSpec 提案

**步骤**:
1. 确认所有任务完成
2. 运行归档命令:
   ```bash
   openspec archive microsoft-clarity-integration --yes
   ```

**验证标准**:
- ✅ 提案移动到 `openspec/changes/archive/YYYY-MM-DD-microsoft-clarity-integration/`
- ✅ 如有 spec deltas,更新到 `openspec/specs/`

**预计时间**: 3 分钟

---

## Task Summary

| Phase | 任务数 | 预计总时间 |
|-------|-------|-----------|
| Phase 1: 准备和配置 | 3 | 17 分钟 |
| Phase 2: 核心实现 | 3 | 30 分钟 |
| Phase 3: 本地测试和验证 | 4 | 23 分钟 |
| Phase 4: 生产部署和验证 | 4 | 28 分钟 |
| Phase 5: 文档和归档 | 2 | 8 分钟 |
| **总计** | **16** | **约 1.5 小时** |

---

## Parallelization Opportunities

以下任务可以并行执行以节省时间:

1. **Task 1.1 - 1.3**: 可同时进行(创建 Clarity 项目和配置 GitHub Secrets)
2. **Task 2.1 - 2.3**: 可同时进行(组件创建和配置文件修改,但需注意依赖关系)
3. **Task 3.1 - 3.4**: 必须在 Phase 2 完成后执行
4. **Task 4.1 - 4.2**: 可同时进行(推送代码和监控 CI/CD)

---

## Blockers and Dependencies

| 任务 | 依赖 | 阻塞原因 |
|------|------|----------|
| Task 1.3 | Task 1.1 | 需要先获取 Project ID |
| Task 2.1 | 无 | - |
| Task 2.2 | Task 2.1 | 需要先创建 Clarity 组件 |
| Task 2.3 | 无 | - |
| Task 3.x | Task 2.1-2.3 | 需要先完成核心实现 |
| Task 4.2 | Task 4.1 | 需要先推送代码 |
| Task 4.3 | Task 4.2 | 需要先完成 CI/CD 部署 |

---

## Rollback Plan

如果集成过程中出现问题,可以按以下步骤回滚:

1. **回滚代码更改**:
   ```bash
   git revert HEAD
   git push origin feat/astro-migration
   ```

2. **移除 GitHub Secrets**:
   - 在 GitHub 仓库设置中删除 `CLARITY_PROJECT_ID` Secret

3. **重新部署**:
   - 等待 GitHub Actions 完成部署
   - 验证生产环境已移除 Clarity 脚本

---

## Additional Notes

1. **性能监控**: 建议定期查看 Clarity Dashboard 中的性能指标
2. **隐私合规**: 如需添加 Cookie 同意横幅,可参考 [Clarity GDPR 文档](https://learn.microsoft.com/en-us/clarity/gdpr/)
3. **未来扩展**: 可考虑同时集成 Google Analytics 4 以获得更丰富的分析数据
