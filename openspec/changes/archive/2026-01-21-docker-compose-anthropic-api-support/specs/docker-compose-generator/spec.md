# Docker Compose Generator Spec

## ADDED Requirements

### Requirement: Claude API 提供商选择

The Docker Compose generator SHALL support user selection of different Claude API providers, using a unified `ANTHROPIC_AUTH_TOKEN` environment variable for all providers.

#### Scenario: 用户选择智谱 AI (ZAI) 作为默认提供商

**Given** 用户访问 Docker Compose 生成器页面
**When** 用户在 "Claude API 配置" 区域查看默认选项
**Then** "API 提供商" 下拉菜单默认选中 "智谱 AI (ZAI)"
**And** 显示说明 "统一使用 ANTHROPIC_AUTH_TOKEN 环境变量"
**And** 显示 "Anthropic API Token" 输入框
**And** 显示说明 "API Endpoint 将自动设置为 ZAI API URL"
**And** 显示 "获取智谱 AI API Token →" 链接

#### Scenario: 用户选择 Anthropic 官方 API

**Given** 用户在 Docker Compose 生成器页面
**When** 用户将 "API 提供商" 下拉菜单切换为 "Anthropic 官方 API"
**Then** 显示 "Anthropic API Token" 输入框
**And** 占位符显示 "请输入您的 Anthropic API Token (sk-ant-...)"
**And** 显示 "获取 Anthropic API Token →" 链接
**And** 不显示 URL 配置选项（使用默认 endpoint）

#### Scenario: 用户选择自定义 API Endpoint

**Given** 用户在 Docker Compose 生成器页面
**When** 用户将 "API 提供商" 下拉菜单切换为 "自定义 API Endpoint"
**Then** 显示 "API Token" 输入框
**And** 显示 "API Endpoint URL" 输入框
**And** URL 占位符显示 "例如：https://api.example.com/v1"

#### Scenario: 用户选择主机配置

**Given** 用户在 Docker Compose 生成器页面
**When** 用户将 "API 提供商" 下拉菜单切换为 "主机配置"
**Then** 显示 "配置挂载路径" 输入框
**And** 显示 "禁用自动检测" 复选框
**And** 说明显示 "从挂载的配置文件自动读取"

---

### Requirement: 动态环境变量生成

The generator SHALL output the appropriate environment variables in the generated Docker Compose configuration, using `ANTHROPIC_AUTH_TOKEN` for all providers and `ANTHROPIC_URL` for ZAI and custom providers.

#### Scenario: 智谱 AI 提供商生成 ANTHROPIC_AUTH_TOKEN 和 ANTHROPIC_URL

**Given** 用户选择 "智谱 AI (ZAI)" 作为提供商
**And** 用户输入 API Token 值为 "zai-test-token"
**When** 生成的 YAML 配置被渲染
**Then** 环境变量部分包含 `ANTHROPIC_AUTH_TOKEN: "zai-test-token"`
**And** 环境变量部分包含 `ANTHROPIC_URL: "https://open.bigmodel.cn/api/paas/v4/"`
**And** 包含注释说明使用智谱 AI 的 Anthropic 兼容 API

#### Scenario: Anthropic 官方提供商仅生成 ANTHROPIC_AUTH_TOKEN

**Given** 用户选择 "Anthropic 官方 API" 作为提供商
**And** 用户输入 API Token 值为 "sk-ant-api03-test"
**When** 生成的 YAML 配置被渲染
**Then** 环境变量部分包含 `ANTHROPIC_AUTH_TOKEN: "sk-ant-api03-test"`
**And** 不包含 `ANTHROPIC_URL` 环境变量
**And** 包含注释说明不需要 URL（使用默认 endpoint）

#### Scenario: 自定义提供商生成 ANTHROPIC_AUTH_TOKEN 和 ANTHROPIC_URL

**Given** 用户选择 "自定义 API Endpoint" 作为提供商
**And** 用户输入 API Token 为 "custom-token"
**And** 用户输入 API URL 为 "https://api.custom.com/v1"
**When** 生成的 YAML 配置被渲染
**Then** 环境变量部分包含 `ANTHROPIC_AUTH_TOKEN: "custom-token"`
**And** 环境变量部分包含 `ANTHROPIC_URL: "https://api.custom.com/v1"`

#### Scenario: 主机配置生成 volume 挂载

**Given** 用户选择 "主机配置" 作为提供商
**And** 用户输入挂载路径为 "/home/user/.claude"
**When** 生成的 YAML 配置被渲染
**Then** volumes 部分包含 `/home/user/.claude:/claude-mount:ro`

---

### Requirement: 类型安全的配置状态

The generator configuration state MUST use TypeScript type definitions to ensure type safety for API provider-related fields.

#### Scenario: AnthropicApiProvider 类型定义

**Given** Docker Compose 生成器代码
**When** 检查 TypeScript 类型定义
**Then** 存在 `AnthropicApiProvider` 类型，定义为 `'anthropic' | 'zai' | 'custom' | 'host'`
**And** `DockerComposeConfig` 接口包含 `anthropicApiProvider: AnthropicApiProvider` 字段
**And** 默认配置中 `anthropicApiProvider` 设置为 `'zai'`

#### Scenario: 统一的 Token 字段定义

**Given** Docker Compose 生成器代码
**When** 检查 `DockerComposeConfig` 接口
**Then** 包含可选字段 `anthropicAuthToken?: string`（所有提供商共用）
**And** 包含可选字段 `anthropicUrl?: string`（zai 和 custom 提供商使用）
**And** 包含 ZAI API URL 常量定义
**And** 不包含 `zaiApiKey` 字段（已废弃）

---

### Requirement: 用户界面一致性

The Claude API configuration section SHALL follow existing UI patterns to maintain visual and interaction consistency.

#### Scenario: 配置区域标题更新

**Given** 用户访问 Docker Compose 生成器页面
**When** 用户查看 API 配置区域
**Then** 区域标题显示为 "Claude API 配置"
**And** 主要字段标签显示为 "API 提供商"

#### Scenario: 提供商选择器样式

**Given** 用户在 Claude API 配置区域
**When** 用户查看 "API 提供商" 下拉菜单
**Then** 选择器使用与现有表单字段一致的样式
**And** 选择器为必填项，显示 `*` 标记
**And** 显示说明 "统一使用 ANTHROPIC_AUTH_TOKEN 环境变量"

#### Scenario: 动态字段样式一致性

**Given** 用户选择任意 API 提供商
**When** 动态字段被渲染
**Then** 所有输入框使用统一的样式类
**And** 必填字段显示 `*` 标记
**And** 占位符文本格式一致
**And** 每个提供商显示相应的说明文字

---

### Requirement: 移除 ZAI_API_KEY 独立环境变量

The generator SHALL NOT use `ZAI_API_KEY` as a separate environment variable. All providers MUST use `ANTHROPIC_AUTH_TOKEN`.

#### Scenario: 不生成 ZAI_API_KEY 环境变量

**Given** 用户选择任何 API 提供商
**When** 生成的 YAML 配置被渲染
**Then** 生成的配置不包含 `ZAI_API_KEY` 环境变量
**And** 智谱 AI 配置使用 `ANTHROPIC_AUTH_TOKEN` + `ANTHROPIC_URL`

#### Scenario: 文档说明统一使用 ANTHROPIC_AUTH_TOKEN

**Given** 用户查看配置说明
**When** 用户阅读生成的 YAML 注释
**Then** 注释说明 "All providers use ANTHROPIC_AUTH_TOKEN"
**And** 注释说明 "ANTHROPIC_URL is set for ZAI and custom providers"

---

## MODIFIED Requirements

### Requirement: API 密钥配置表单

The existing "智谱 AI API Key" configuration section SHALL be refactored to support multiple provider options using a unified `ANTHROPIC_AUTH_TOKEN` approach.

#### Scenario: 默认使用智谱 AI

**Given** 用户首次访问 Docker Compose 生成器
**When** 页面加载完成
**Then** "API 提供商" 默认选中 "智谱 AI (ZAI)"
**And** 显示的输入框标签为 "Anthropic API Token"
**And** 说明会自动设置 ZAI API URL

#### Scenario: 获取 API Token 链接

**Given** 用户选择 "智谱 AI (ZAI)" 提供商
**When** 用户查看配置区域
**Then** 显示 "获取智谱 AI API Token →" 链接
**And** 链接指向 `https://www.bigmodel.cn/glm-coding?ic=14BY54APZA`

**Given** 用户选择 "Anthropic 官方 API" 提供商
**When** 用户查看配置区域
**Then** 显示 "获取 Anthropic API Token →" 链接
**And** 链接指向 `https://console.anthropic.com/`

---

## DEPRECATED Requirements

无废弃的功能。
