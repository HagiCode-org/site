## ADDED Requirements

### Requirement: 外部链接检查 GitHub Actions 工作流

系统 SHALL 提供一个 GitHub Actions 工作流，用于自动扫描和检查文档站点和营销站点中的所有外部链接，并在发现失效链接时创建 Issue。

#### Scenario: 工作流定时触发
- **WHEN** 每天 UTC 2:00 定时触发
- **THEN** 链接检查工作流被执行
- **AND** 工作流检出代码仓库
- **AND** 工作流执行链接检查脚本

#### Scenario: 工作流手动触发
- **WHEN** 用户从 GitHub Actions UI 手动触发工作流
- **THEN** 链接检查工作流立即执行
- **AND** 工作流执行链接检查脚本

#### Scenario: 工作流权限配置
- **WHEN** 链接检查工作流运行
- **THEN** 工作流具有 `contents: read` 权限以读取文件
- **AND** 工作流具有 `issues: write` 权限以创建和管理 Issue

### Requirement: 链接提取和扫描

链接检查脚本 SHALL 从指定的文件路径中提取所有外部链接并进行扫描。

#### Scenario: 扫描文档站点 Markdown 文件
- **WHEN** 链接检查脚本运行
- **THEN** 脚本扫描 `apps/docs/src/content/docs/**/*.md` 路径
- **AND** 脚本扫描 `apps/docs/src/content/blog/**/*.md` 路径
- **AND** 脚本从这些文件中提取所有外部链接

#### Scenario: 扫描营销站点文件
- **WHEN** 链接检查脚本运行
- **THEN** 脚本扫描 `apps/website/src/**/*.astro` 路径
- **AND** 脚本扫描 `apps/website/src/**/*.md` 路径
- **AND** 脚本从这些文件中提取所有外部链接

#### Scenario: 提取 Markdown 格式链接
- **WHEN** 扫描 Markdown 文件
- **THEN** 脚本提取 `[text](url)` 格式的外部链接
- **AND** 脚本记录文件路径和行号

#### Scenario: 提取 HTML 格式链接
- **WHEN** 扫描 Astro 和 HTML 文件
- **THEN** 脚本提取 `<a href="url">` 格式的外部链接
- **AND** 脚本记录文件路径和行号

#### Scenario: 过滤内部链接
- **WHEN** 提取链接时
- **THEN** 脚本忽略相对路径链接（如 `/docs/guide`）
- **AND** 脚本忽略同域名链接
- **AND** 脚本忽略锚点链接（如 `#section`）

#### Scenario: 过滤特殊协议链接
- **WHEN** 提取链接时
- **THEN** 脚本忽略 `mailto:` 链接
- **AND** 脚本忽略 `tel:` 链接
- **AND** 脚本忽略其他非 HTTP 协议链接

### Requirement: 并发链接检查

链接检查脚本 SHALL 使用并发方式检查链接状态，以提高检查效率。

#### Scenario: 并发检查配置
- **WHEN** 链接检查脚本执行
- **THEN** 脚本使用配置的并发数量（默认 10-20）
- **AND** 脚本同时发起多个 HTTP 请求

#### Scenario: 请求超时处理
- **WHEN** HTTP 请求超过配置的超时时间（默认 10 秒）
- **THEN** 请求被中止
- **AND** 脚本记录超时错误
- **AND** 脚本将该链接标记为失效

#### Scenario: 重试机制
- **WHEN** HTTP 请求失败（超时或网络错误）
- **THEN** 脚本等待后重试请求
- **AND** 脚本最多重试 3 次
- **AND** 如果所有重试都失败，脚本将链接标记为失效

#### Scenario: 状态码检测
- **WHEN** HTTP 请求完成
- **THEN** 脚本检查响应状态码
- **AND** 状态码 4xx 或 5xx 被视为失效链接
- **AND** 状态码 200 被视为有效链接
- **AND** 脚本记录实际状态码

### Requirement: 配置文件管理

系统 SHALL 使用配置文件定义链接检查的扫描路径、排除规则和检查参数。

#### Scenario: 加载配置文件
- **WHEN** 链接检查脚本启动
- **THEN** 脚本读取 `.github/link-check-config.json` 文件
- **AND** 脚本解析配置参数

#### Scenario: 配置扫描路径
- **WHEN** 配置文件定义扫描路径
- **THEN** 脚本扫描配置路径下的所有文件
- **AND** 支持 glob 模式（如 `**/*.md`）

#### Scenario: 配置排除域名
- **WHEN** 配置文件定义排除域名列表
- **THEN** 脚本跳过匹配排除域名的链接
- **AND** 不对这些链接执行 HTTP 检查

#### Scenario: 配置超时和重试
- **WHEN** 配置文件定义超时时间
- **THEN** 脚本使用配置的超时时间（默认 10 秒）
- **AND** 当配置文件定义重试次数时，脚本使用配置的次数（默认 3 次）

#### Scenario: 配置并发数量
- **WHEN** 配置文件定义并发数量
- **THEN** 脚本使用配置的并发数量（默认 15）
- **AND** 并发限制控制同时发出的 HTTP 请求数量

### Requirement: Issue 创建和管理

系统 SHALL 在发现失效链接时创建 GitHub Issue，并实现去重机制避免重复创建。

#### Scenario: 创建新 Issue
- **WHEN** 链接检查发现失效链接
- **AND** 最近 7 天内不存在未关闭的同类型 Issue
- **THEN** 脚本创建新的 GitHub Issue
- **AND** Issue 标题为 `[链接检查] 发现失效外部链接 - YYYY-MM-DD`
- **AND** Issue 包含失效链接列表的表格

#### Scenario: 更新现有 Issue
- **WHEN** 链接检查发现失效链接
- **AND** 最近 7 天内存在未关闭的同类型 Issue
- **THEN** 脚本不创建新 Issue
- **AND** 脚本在现有 Issue 中添加新评论
- **AND** 评论包含本次检查发现的失效链接

#### Scenario: Issue 内容格式
- **WHEN** 创建或更新 Issue
- **THEN** Issue 包含检查日期
- **AND** Issue 包含失效链接数量
- **AND** Issue 包含失效链接表格（文件路径、行号、链接、状态码）
- **AND** Issue 包含建议操作（修复链接或添加到排除列表）

#### Scenario: 搜索现有 Issues
- **WHEN** 检查是否需要创建新 Issue
- **THEN** 脚本使用 GitHub API 搜索 Issue
- **AND** 搜索标题包含 `[链接检查]` 的 Issue
- **AND** 搜索限制为最近 7 天内创建的 Issue
- **AND** 只考虑未关闭的 Issue

### Requirement: 日志和监控

链接检查系统 SHALL 提供详细的日志输出用于调试和监控。

#### Scenario: 日志级别使用
- **WHEN** 链接检查脚本执行
- **THEN** `[INFO]` 日志用于正常操作（如扫描文件、检查链接）
- **AND** `[WARN]` 日志用于重试和警告（如排除域名、超时重试）
- **AND** `[ERROR]` 日志用于错误和异常（如文件读取失败、HTTP 错误）
- **AND** `[DEBUG]` 日志用于详细执行信息（如请求详情、解析结果）

#### Scenario: 进度显示
- **WHEN** 链接检查脚本执行
- **THEN** 脚本显示已扫描文件数量
- **AND** 脚本显示已检查链接数量
- **AND** 脚本显示发现的失效链接数量
- **AND** 脚本显示当前进度百分比

#### Scenario: 检查结果汇总
- **WHEN** 链接检查完成
- **THEN** 脚本显示总扫描文件数
- **AND** 脚本显示总检查链接数
- **AND** 脚本显示失效链接数量
- **AND** 脚本显示有效链接数量
- **AND** 脚本显示 Issue 创建或更新状态

#### Scenario: GitHub Actions 输出
- **WHEN** 在 GitHub Actions 中运行
- **THEN** 工作流输出 `broken_links_count` 变量（失效链接数量）
- **AND** 工作流输出 `total_links_checked` 变量（总检查链接数）
- **AND** 工作流输出 `issue_created` 或 `issue_updated` 变量
- **AND** 如果创建了 Issue，输出 `issue_url` 变量

### Requirement: 排除规则和过滤

系统 SHALL 支持灵活的排除规则，以过滤不需要检查的链接。

#### Scenario: 域名排除
- **WHEN** 配置文件定义排除域名列表
- **THEN** 脚本跳过匹配这些域名的链接
- **AND** 跳过的链接不计入失效链接统计

#### Scenario: 链接模式排除
- **WHEN** 配置文件定义排除模式（正则表达式）
- **THEN** 脚本跳过匹配这些模式的链接
- **AND** 支持通配符模式（如 `https://example.com/*`）

#### Scenario: 本地开发链接过滤
- **WHEN** 检测到 `localhost`、`127.0.0.1` 或本地 IP 地址
- **THEN** 脚本自动跳过这些链接
- **AND** 不对这些链接执行 HTTP 检查

### Requirement: User-Agent 和请求头配置

链接检查脚本 SHALL 配置适当的 HTTP 请求头，以提高检查成功率。

#### Scenario: 设置 User-Agent
- **WHEN** 发起 HTTP 请求
- **THEN** 脚本设置 User-Agent 头
- **AND** User-Agent 标识为链接检查工具（如 `Hagicode-Link-Checker/1.0`）

#### Scenario: 自定义请求头
- **WHEN** 配置文件定义自定义请求头
- **THEN** 脚本在所有 HTTP 请求中包含这些请求头
- **AND** 支持配置 Accept、Accept-Language 等常见请求头
