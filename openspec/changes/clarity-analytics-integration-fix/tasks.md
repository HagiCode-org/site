# 修复 Microsoft Clarity 分析集成 - 实施任务

## 任务清单

### 阶段 1：调查与诊断

- [ ] **任务 1.1：检查生产构建输出（关键）**
  - 检查 `apps/docs/dist/` 和 `apps/website/dist/` 目录中的 HTML 文件
  - 搜索 `clarity`、`clarity.ms`、`CLARITY_PROJECT_ID` 等关键词
  - 确认构建产物中是否真的没有 Clarity 相关代码
  - 记录发现的内容（如果有部分代码）或确认完全缺失

- [ ] **任务 1.2：分析 Clarity 组件的条件渲染逻辑**
  - 仔细阅读 `apps/docs/src/components/Clarity.astro` 和 `apps/website/src/components/Clarity.astro`
  - 确认组件中的 `if` 条件判断逻辑
  - 检查 `isProduction` 和 `clarityProjectId` 的获取方式
  - 验证这些变量在构建时是否正确评估

- [ ] **任务 1.3：验证环境变量传递链**
  - 检查 `astro.config.mjs` 中的 `vite.define` 配置
  - 确认 `import.meta.env.VITE_CLARITY_PROJECT_ID` 在构建时是否被正确替换
  - 在构建时添加调试输出，打印环境变量的值
  - 验证 GitHub Secrets → 构建环境 → Vite define 的传递链条

- [ ] **任务 1.4：检查 GitHub Secrets 配置**
  - 确认 GitHub 仓库 Secrets 中 `CLARITY_PROJECT_ID` 是否存在且有效
  - 验证 Project ID 格式是否正确（通常是字母数字字符串）

### 阶段 2：修复实现

- [ ] **任务 2.1：修复 Clarity 组件的条件渲染逻辑**
  - 确保 `isProduction` 检查在构建时正确评估为 `true`
  - 确保 `clarityProjectId` 在构建时有正确的值
  - 如果条件判断有问题，修复组件逻辑
  - 考虑使用 Astro 的 `define:vars` 指令或其他构建时注入方式

- [ ] **任务 2.2：验证和修复环境变量配置**
  - 确保 `astro.config.mjs` 中的 `vite.define` 正确配置
  - 验证环境变量在构建时被正确注入
  - 如果需要，添加构建时的调试日志

- [ ] **任务 2.3：统一两个站点的 Clarity 组件实现**
  - 确保两个站点的组件逻辑一致
  - 统一生产环境检查方式
  - 统一 Clarity 脚本注入方式（partytown 或直接 script 标签）

- [ ] **任务 2.4：添加调试和验证功能**
  - 在 Clarity 组件中添加构建时的调试输出
  - 添加更清晰的错误提示
  - 方便未来排查类似问题

### 阶段 3：验证与测试

- [ ] **任务 3.1：本地构建验证（关键）**
  - 设置 `CLARITY_PROJECT_ID` 环境变量
  - 运行 `CLARITY_PROJECT_ID=<your-id> npm run build:docs`
  - 运行 `CLARITY_PROJECT_ID=<your-id> npm run build:website`
  - 检查 `apps/docs/dist/` 和 `apps/website/dist/` 中的 HTML 文件
  - 确认包含 Clarity 脚本标签或 partytown 配置
  - 使用 `grep -r "clarity" dist/` 搜索 Clarity 相关代码

- [ ] **任务 3.2：本地开发环境验证**
  - 运行 `npm run dev` 确认开发环境不加载 Clarity 脚本
  - 检查浏览器控制台，确认没有 Clarity 相关的网络请求
  - 确认组件的条件渲染正确工作

- [ ] **任务 3.3：Azure 构建验证**
  - 提交代码并触发 Azure 部署工作流
  - 检查 GitHub Actions 构建日志
  - 确认环境变量正确传递到构建环境
  - 下载构建产物并检查 HTML 文件

- [ ] **任务 3.4：部署后验证**
  - 部署到 Azure Static Web Apps
  - 在浏览器中访问部署后的站点
  - 使用浏览器开发者工具检查：
    - Network 面板中是否有 `clarity.ms` 的请求
    - Console 中是否有 Clarity 初始化日志
    - Elements 面板中搜索 Clarity 相关元素
  - 在 Microsoft Clarity Dashboard 中确认数据开始接收

### 阶段 4：文档与收尾

- [ ] **任务 4.1：更新项目文档**
  - 记录 Clarity 集成的配置方式
  - 添加故障排查指南

- [ ] **任务 4.2：创建验证清单**
  - 为未来的部署提供 Clarity 集成验证步骤

## 任务依赖关系

```
阶段 1 (调查与诊断)
    ↓
阶段 2 (修复实现)
    ↓
阶段 3 (验证与测试)
    ↓
阶段 4 (文档与收尾)
```

## 预期成果

完成所有任务后：
1. 两个站点的 Clarity 组件实现逻辑一致
2. 仅在生产环境加载 Clarity 脚本
3. Microsoft Clarity Dashboard 能够正常接收分析数据
4. 有完整的验证步骤可供参考
