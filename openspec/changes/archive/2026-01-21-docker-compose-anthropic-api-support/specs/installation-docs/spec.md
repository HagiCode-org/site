# Installation Documentation Spec

## ADDED Requirements

### Requirement: API 提供商说明文档

The installation documentation SHALL include descriptions and selection guidance for different Claude API providers, emphasizing the unified use of `ANTHROPIC_AUTH_TOKEN`.

#### Scenario: API 提供商对比说明

**Given** 用户阅读安装文档
**When** 用户查看 API 配置相关章节
**Then** 文档包含 API 提供商对比表格或列表
**And** 说明智谱 AI (ZAI) 的特点和适用场景
**And** 说明 Anthropic 官方 API 的特点和适用场景
**And** 说明自定义 API 的使用场景
**And** 强调所有提供商统一使用 `ANTHROPIC_AUTH_TOKEN`

#### Scenario: API Token 获取指南

**Given** 用户需要获取 Anthropic API Token
**When** 用户查阅安装文档
**Then** 文档提供 Anthropic 官方 API Token 获取步骤
**And** 文档提供智谱 AI API Token 获取步骤
**And** 包含相应的官方链接

---

### Requirement: 生成器引导语

The installation documentation SHALL guide users to use the Docker Compose generator rather than providing hardcoded configuration for direct copying.

#### Scenario: Docker Compose 安装引导

**Given** 用户阅读 `docs/installation/docker-compose.md`
**When** 用户查看配置部分
**Then** 文档包含引导语："推荐使用 Docker Compose 生成器自动生成配置"
**And** 包含生成器页面链接
**And** 说明生成器的优势（动态配置、多提供商支持等）

#### Scenario: 包部署文档引导

**Given** 用户阅读 `docs/installation/package-deployment.md`
**When** 文档涉及环境变量配置
**Then** 如涉及 Docker 部署，包含生成器引用
**And** 说明生成器可用于生成完整的环境配置

---

### Requirement: 统一环境变量说明

The documentation MUST explain that all providers use `ANTHROPIC_AUTH_TOKEN` and differentiate providers using `ANTHROPIC_URL`.

#### Scenario: 环境变量配置说明

**Given** 用户阅读环境变量配置文档
**When** 用户查看 Claude API 配置部分
**Then** 文档说明统一使用 `ANTHROPIC_AUTH_TOKEN`
**And** 文档说明智谱 AI 和自定义提供商需要设置 `ANTHROPIC_URL`
**And** 文档说明官方 API 不需要设置 URL

---

## MODIFIED Requirements

### Requirement: Docker Compose 配置示例

The existing hardcoded Docker Compose configuration SHALL be simplified or removed, guiding users to use the generator.

#### Scenario: 移除完整硬编码配置

**Given** 用户阅读 `docs/installation/docker-compose.md`
**When** 用户查看配置示例部分
**Then** 文档不再包含完整的硬编码 Docker Compose YAML
**And** 或者仅保留最小化的概念示例（如架构说明）
**And** 主要内容引导用户使用生成器

#### Scenario: 保留环境变量说明

**Given** 文档移除完整配置示例
**When** 用户需要了解环境变量配置
**Then** 文档仍然包含环境变量说明
**And** 说明统一使用 `ANTHROPIC_AUTH_TOKEN`
**And** 说明 `ANTHROPIC_URL` 的使用场景

---

## REMOVED Requirements

### Requirement: ZAI_API_KEY 独立环境变量说明

The documentation MUST NOT include `ZAI_API_KEY` as a separate environment variable. All references SHALL be updated to use `ANTHROPIC_AUTH_TOKEN` with `ANTHROPIC_URL`.

#### Scenario: 移除 ZAI_API_KEY 环境变量说明

**Given** 用户查阅安装文档
**When** 用户搜索 `ZAI_API_KEY` 环境变量
**Then** 文档中不包含 `ZAI_API_KEY` 作为独立环境变量的说明
**And** 智谱 AI 配置说明使用 `ANTHROPIC_AUTH_TOKEN` + `ANTHROPIC_URL`

#### Scenario: 更新现有配置示例

**Given** 文档包含智谱 AI 配置示例
**When** 示例被更新
**Then** 示例使用 `ANTHROPIC_AUTH_TOKEN` 环境变量
**And** 示例包含 `ANTHROPIC_URL` 设置为 ZAI API URL

---

## MODIFIED Requirements

### Requirement: 文档链接完整性

External links in the documentation (such as API Token acquisition pages) MUST remain valid and accurate.

#### Scenario: Anthropic API 链接验证

**Given** 文档包含 Anthropic 官方 API 相关链接
**When** 用户点击链接
**Then** 链接指向 `https://console.anthropic.com/`
**And** 链接在新标签页打开
**And** 链接有效可访问

#### Scenario: 智谱 AI 链接验证

**Given** 文档包含智谱 AI 相关链接
**When** 用户点击链接
**Then** 链接指向 `https://www.bigmodel.cn/glm-coding?ic=14BY54APZA`
**And** 链接在新标签页打开
**And** 链接有效可访问

---

## Cross-References

此规格与以下相关规格有关联：

- **docker-compose-generator/spec.md**: 生成器功能实现直接影响文档内容的更新
- **docusaurus-site/spec.md**: 文档构建和链接验证遵循站点规范
