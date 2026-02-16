## 1. Implementation

### 1.1 astro-link-validator 集成安装
- [ ] 1.1.1 安装 astro-link-validator（docs 站点）
  ```bash
  cd apps/docs
  npm install github:rodgtr1/astro-link-validator
  ```
- [ ] 1.1.2 安装 astro-link-validator（website 站点）
  ```bash
  cd apps/website
  npm install github:rodgtr1/astro-link-validator
  ```
- [ ] 1.1.3 验证安装成功（检查 node_modules 和 package.json）
- [ ] 1.1.4 检查 TypeScript 类型定义是否包含

### 1.2 Astro 配置更新
- [ ] 1.2.1 更新 `apps/docs/astro.config.mjs` 添加 linkValidator 集成
- [ ] 1.2.2 配置 linkValidator 选项：
  - `checkExternal`: 根据 CI 环境变量动态配置
  - `externalTimeout`: 10000（10 秒）
  - `failOnBrokenLinks`: true（CI 环境）
  - `verbose`: true（CI 环境）
  - `exclude`: 配置排除路径（如 `/api/*`）
- [ ] 1.2.3 更新 `apps/website/astro.config.mjs` 添加相同配置
- [ ] 1.2.4 添加环境变量支持（`CI` 标志）
- [ ] 1.2.5 本地测试构建（禁用外部链接检查）
- [ ] 1.2.6 本地测试构建（启用外部链接检查）

### 1.3 GitHub Actions 工作流配置
- [ ] 1.3.1 创建 `.github/workflows/link-check.yml` 文件
- [ ] 1.3.2 配置 schedule 触发器（每天 UTC 2:00）
  ```yaml
  schedule:
    - cron: '0 2 * * *'
  ```
- [ ] 1.3.3 配置 workflow_dispatch 手动触发器
- [ ] 1.3.4 设置必要的权限：
  - `contents: read`
  - `issues: write`
- [ ] 1.3.5 配置构建步骤（分别构建 docs 和 website）
- [ ] 1.3.6 设置环境变量 `CI=true`
- [ ] 1.3.7 配置构建失败时的处理逻辑
- [ ] 1.3.8 添加日志输出和步骤说明

### 1.4 Issue 管理脚本
- [ ] 1.4.1 创建 `scripts/link-check-issue.js` 脚本
- [ ] 1.4.2 实现解析 astro-link-validator 输出的功能
- [ ] 1.4.3 实现检查现有 Issues 功能（搜索最近 7 天）
- [ ] 1.4.4 实现创建新 Issue 功能
- [ ] 1.4.5 实现添加评论到现有 Issue 功能
- [ ] 1.4.6 实现 Issue 内容格式化（表格展示失效链接）
- [ ] 1.4.7 实现 Issue 标题格式（包含日期）
- [ ] 1.4.8 添加错误处理和日志记录

### 1.5 工作流集成
- [ ] 1.5.1 在构建失败后调用 Issue 管理脚本
- [ ] 1.5.2 配置构建日志解析逻辑
- [ ] 1.5.3 实现 Issue 去重检查
- [ ] 1.5.4 添加成功/失败的条件判断
- [ ] 1.5.5 配置 GitHub API 认证（使用 GITHUB_TOKEN）
- [ ] 1.5.6 添加输出变量（issue_url, broken_links_count）

### 1.6 排除规则和重定向配置
- [ ] 1.6.1 识别需要排除的路径（如 API 端点、管理后台）
- [ ] 1.6.2 配置 `exclude` 选项
- [ ] 1.6.3 如果存在 `_redirects` 文件，配置 `redirectsFile` 选项
- [ ] 1.6.4 验证重定向规则格式正确
- [ ] 1.6.5 测试排除规则生效

### 1.7 错误处理和日志
- [ ] 1.7.1 添加构建失败的错误处理
- [ ] 1.7.2 添加 GitHub API 错误处理
- [ ] 1.7.3 实现详细的日志输出（[INFO]、[WARN]、[ERROR]）
- [ ] 1.7.4 添加脚本执行失败的回退逻辑
- [ ] 1.7.5 实现进度显示（构建状态、检查进度）
- [ ] 1.7.6 配置日志级别（verbose 模式）

### 1.8 测试和验证
- [ ] 1.8.1 本地测试 docs 站点构建（禁用外部链接检查）
- [ ] 1.8.2 本地测试 docs 站点构建（启用外部链接检查）
- [ ] 1.8.3 本地测试 website 站点构建
- [ ] 1.8.4 测试失效链接检测（故意添加失效链接）
- [ ] 1.8.5 测试排除规则（验证排除路径生效）
- [ ] 1.8.6 测试重定向规则（验证重定向不误报）
- [ ] 1.8.7 本地测试 Issue 管理脚本
- [ ] 1.8.8 手动触发 GitHub Actions 工作流测试
- [ ] 1.8.9 测试 Issue 创建功能
- [ ] 1.8.10 测试 Issue 去重功能（验证不重复创建）
- [ ] 1.8.11 测试 Issue 评论功能（验证更新现有 Issue）
- [ ] 1.8.12 验证完整的端到端流程
- [ ] 1.8.13 移除测试用的失效链接

### 1.9 文档和清理
- [ ] 1.9.1 添加代码注释和说明
- [ ] 1.9.2 更新 Astro 配置文档（说明 linkValidator 集成）
- [ ] 1.9.3 创建 GitHub Actions 工作流说明文档
- [ ] 1.9.4 创建使用说明（如何手动触发、如何配置排除规则）
- [ ] 1.9.5 更新项目 README（如有需要）
- [ ] 1.9.6 记录 astro-link-validator 的更新和升级方法
- [ ] 1.9.7 清理测试文件和临时数据
- [ ] 1.9.8 运行 `openspec validate external-link-check-workflow --strict`

## 2. Deployment

### 2.1 部署前准备
- [ ] 2.1.1 确认所有测试通过
- [ ] 2.1.2 检查 GitHub Actions 工作流配置
- [ ] 2.1.3 验证 Astro 配置正确
- [ ] 2.1.4 确认排除路径列表合理
- [ ] 2.1.5 验证环境变量配置
- [ ] 2.1.6 确认 package.json 依赖正确

### 2.2 部署执行
- [ ] 2.2.1 提交所有代码变更
- [ ] 2.2.2 创建 Pull Request
- [ ] 2.2.3 代码审查
- [ ] 2.2.4 合并到 main 分支
- [ ] 2.2.5 验证首次运行（或等待定时触发）

### 2.3 部署后验证
- [ ] 2.3.1 检查 GitHub Actions 运行历史
- [ ] 2.3.2 验证构建日志输出
- [ ] 2.3.3 验证 astro-link-validator 正常运行
- [ ] 2.3.4 测试手动触发功能
- [ ] 2.3.5 验证 Issue 创建（如有失效链接）
- [ ] 2.3.6 验证 Issue 去重机制
- [ ] 2.3.7 检查运行时间在合理范围内（< 20 分钟）

## 3. Monitoring and Maintenance

### 3.1 监控设置
- [ ] 3.1.1 设置 GitHub Actions 运行状态监控
- [ ] 3.1.2 配置失败通知（可选）
- [ ] 3.1.3 定期检查构建日志
- [ ] 3.1.4 监控运行时间趋势
- [ ] 3.1.5 监控失效链接数量趋势
- [ ] 3.1.6 监控 Issue 创建和关闭状态
- [ ] 3.1.7 关注 astro-link-validator 项目更新

### 3.2 维护任务
- [ ] 3.2.1 定期更新排除路径列表
- [ ] 3.2.2 优化超时配置（根据运行情况）
- [ ] 3.2.3 更新 astro-link-validator 到最新版本
- [ ] 3.2.4 处理失效链接（修复或排除）
- [ ] 3.2.5 定期关闭已修复的 Issue
- [ ] 3.2.6 审查和更新重定向规则

## 4. Optional Enhancements

### 4.1 功能增强（可选）
- [ ] 4.1.1 添加更多排除规则（正则表达式支持）
- [ ] 4.1.2 实现 PR 评论功能（检测到新失效链接时）
- [ ] 4.1.3 实现链接修复建议（使用 Internet Archive）
- [ ] 4.1.4 添加 Slack/邮件通知
- [ ] 4.1.5 实现链接健康度评分
- [ ] 4.1.6 添加自定义报告格式
- [ ] 4.1.7 实现按站点分开检查（docs 和 website 独立）
- [ ] 4.1.8 添加跳过特定状态码的配置（如忽略 403）

### 4.2 性能优化（可选）
- [ ] 4.2.1 调整并发数量（根据 GitHub Actions 限制）
- [ ] 4.2.2 实现增量检查（只检查变更的站点）
- [ ] 4.2.3 优化超时时间（平衡准确性和速度）
- [ ] 4.2.4 实现缓存机制（避免重复检查）
- [ ] 4.2.5 考虑使用 lychee 作为备选方案（更高性能）

### 4.3 报告增强（可选）
- [ ] 4.3.1 添加链接检查趋势报告
- [ ] 4.3.2 生成可视化图表
- [ ] 4.3.3 添加失效链接分类（按域名、路径、状态码）
- [ ] 4.3.4 实现历史数据追踪
- [ ] 4.3.5 添加链接修复进度跟踪
- [ ] 4.3.6 创建专门的 Issue 模板用于链接检查报告

### 4.4 备选方案准备（可选）
- [ ] 4.4.1 评估 lychee 替代方案
- [ ] 4.4.2 准备 lychee 集成方案（如果 astro-link-validator 不可用）
- [ ] 4.4.3 创建 Docker 镜像（如果需要运行 Rust 二进制）
- [ ] 4.4.4 编写备选方案的切换文档
