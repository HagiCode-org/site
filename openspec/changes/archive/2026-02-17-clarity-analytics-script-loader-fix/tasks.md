# Clarity 分析脚本加载修复 - 任务清单

## 诊断阶段

### 1. 环境变量验证

- [ ] 检查 GitHub Secrets 中 `CLARITY_PROJECT_ID` 是否已配置
  - 访问仓库 Settings > Secrets and variables > Actions
  - 验证 `CLARITY_PROJECT_ID` secret 存在且值有效

- [ ] 检查 GitHub Actions 工作流中的环境变量配置
  - 文件: `.github/workflows/deploy-docs.yml`
  - 文件: `.github/workflows/azure-deploy-website.yml`
  - 验证 `env.CLARITY_PROJECT_ID` 正确引用 secret

### 2. 本地构建诊断

- [ ] 执行 docs 应用构建并启用调试模式
  ```bash
  cd apps/docs
  CLARITY_PROJECT_ID=test_id CLARITY_DEBUG=1 npm run build
  ```
  - 检查控制台输出的 Clarity 调试信息
  - 验证 `isProduction` 和 `clarityProjectId` 的值

- [ ] 执行 website 应用构建并启用调试模式
  ```bash
  cd apps/website
  CLARITY_PROJECT_ID=test_id CLARITY_DEBUG=1 npm run build
  ```
  - 检查控制台输出的 Clarity 调试信息
  - 验证 `isProduction` 和 `clarityProjectId` 的值

### 3. 构建输出检查

- [ ] 检查 docs 构建输出中的 Clarity 脚本
  ```bash
  grep -r "clarity.ms" apps/docs/dist
  ```
  - 验证脚本标签是否存在
  - 检查 Project ID 是否正确注入

- [ ] 检查 website 构建输出中的 Clarity 脚本
  ```bash
  grep -r "clarity.ms" apps/website/dist
  ```
  - 验证脚本标签是否存在
  - 检查 Project ID 是否正确注入

- [ ] 检查 `is:inline` 属性是否保留
  - 搜索构建输出中的 `<script` 标签
  - 验证 `is:inline` 属性未被移除

### 4. 环境变量传递链路验证

- [ ] 验证 `process.env.CLARITY_PROJECT_ID` 在构建时可访问
  - 在 `astro.config.mjs` 中添加临时日志
  - 运行构建并检查输出

- [ ] 验证 `vite.define` 映射是否正确
  - 检查 `import.meta.env.VITE_CLARITY_PROJECT_ID` 是否正确映射
  - 检查 `import.meta.env.PROD` 是否正确评估为 `true`

## 修复阶段

### 根据诊断结果选择以下修复方案

#### 方案 A: 环境变量修复（如果诊断显示环境变量未传递）

- [ ] 确保 GitHub Secrets 已配置
  - 在仓库设置中添加/更新 `CLARITY_PROJECT_ID` secret

- [ ] 验证工作流文件中的环境变量引用
  - 确认 `deploy-docs.yml` 中正确设置 `CLARITY_PROJECT_ID`
  - 确认 `azure-deploy-website.yml` 中正确设置 `CLARITY_PROJECT_ID`

#### 方案 B: 构建配置修复（如果诊断显示 PROD 环境变量未正确评估）

- [ ] 修改 `apps/docs/astro.config.mjs`
  - 更新 `vite.define` 配置以确保 `import.meta.env.PROD` 正确评估
  - 考虑使用 Astro 的 `env.isProduction` 替代 `import.meta.env.PROD`

- [ ] 修改 `apps/website/astro.config.mjs`
  - 更新 `vite.define` 配置以确保 `import.meta.env.PROD` 正确评估
  - 考虑使用 Astro 的 `env.isProduction` 替代 `import.meta.env.PROD`

#### 方案 C: Clarity 组件逻辑修复（如果诊断显示组件逻辑有问题）

- [ ] 修改 `apps/docs/src/components/Clarity.astro`
  - 更新条件渲染逻辑
  - 添加更详细的调试日志

- [ ] 修改 `apps/website/src/components/Clarity.astro`
  - 更新条件渲染逻辑
  - 添加更详细的调试日志

#### 方案 D: 布局集成修复（如果诊断显示组件未正确集成）

- [ ] 为 website 应用创建统一布局
  - 创建 `apps/website/src/layouts/BaseLayout.astro`
  - 在布局中包含 Clarity 组件
  - 更新所有页面使用新布局

- [ ] 验证 docs 应用的 Footer 覆盖
  - 确认 `StarlightFooter.astro` 在所有页面被使用
  - 检查博客页面的布局配置

## 验证阶段

### 本地验证

- [ ] 本地构建 docs 应用
  ```bash
  CLARITY_PROJECT_ID=test_id npm run build:docs
  ```
  - 检查 `apps/docs/dist` 中的 HTML 文件
  - 验证 Clarity 脚本存在且格式正确

- [ ] 本地构建 website 应用
  ```bash
  CLARITY_PROJECT_ID=test_id npm run build:website
  ```
  - 检查 `apps/website/dist` 中的 HTML 文件
  - 验证 Clarity 脚本存在且格式正确

- [ ] 本地预览（可选）
  - 使用 `astro preview` 预览构建结果
  - 在浏览器中检查 Network 标签

### 生产验证

- [ ] 部署到生产环境
  - 合并修复到 main 分支
  - 等待 GitHub Actions 完成部署

- [ ] 验证 docs.hagicode.com
  - 访问 https://docs.hagicode.com/installation/desktop/
  - 打开浏览器开发者工具 > Network 标签
  - 搜索 `clarity.ms` 请求

- [ ] 验证 hagicode.com
  - 访问 https://hagicode.com/
  - 打开浏览器开发者工具 > Network 标签
  - 搜索 `clarity.ms` 请求

- [ ] 验证 hagicode.com/desktop/
  - 访问 https://hagicode.com/desktop/
  - 打开浏览器开发者工具 > Network 标签
  - 搜索 `clarity.ms` 请求

### 数据验证

- [ ] 检查 Clarity Dashboard
  - 登录 Microsoft Clarity 控制台
  - 验证是否显示实时用户数据
  - 检查热力图和录屏是否正常工作

## 后续工作

- [ ] 移除临时调试代码（如果有）
- [ ] 更新相关文档
- [ ] 创建回归测试以确保未来不会出现类似问题
- [ ] 考虑添加 CI 检查以验证 Clarity 脚本在构建输出中存在

## 回退方案

如果修复导致问题：

- [ ] 移除 Clarity 组件引用
  - 从 `StarlightFooter.astro` 中移除 `<Clarity />`
  - 从 website 页面中移除 `<Clarity />` 引用

- [ ] 回滚部署
  - 使用 GitHub Actions 重新部署之前的版本

## 完成标准

所有以下条件满足时，任务可标记为完成：

1. ✅ 诊断确定了根本原因
2. ✅ 修复已实施并测试
3. ✅ 本地构建输出包含 Clarity 脚本
4. ✅ 生产环境页面加载 Clarity 脚本
5. ✅ Clarity Dashboard 显示实时用户数据
6. ✅ 无回归问题或意外副作用
