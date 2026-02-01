# Design Document: Docker Compose Anthropic API Support

## Architecture Overview

本设计文档描述如何扩展 Docker Compose 生成器以支持多种 Anthropic API 提供商，同时保持向后兼容性和良好的用户体验。

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Docker Compose Generator                        │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     Configuration Form                        │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐    │   │
│  │  │   Basic       │  │  Database     │  │    API Keys   │    │   │
│  │  │   Settings    │  │  Config       │  │  (MODIFIED)   │    │   │
│  │  └───────────────┘  └───────────────┘  └───────────────┘    │   │
│  │                                                      │        │   │
│  │                              ┌─────────────────────▼────────┐  │   │
│  │                              │  Anthropic API Provider      │  │   │
│  │                              │  ┌────────────────────────┐  │  │   │
│  │                              │  │ Provider Selector      │  │  │   │
│  │                              │  │ - anthropic (官方，最高优先级) │  │  │   │
│  │                              │  │ - zai (智谱 AI，次之)    │  │  │   │
│  │                              │  │ - custom (自定义 API)    │  │  │   │
│  │                              │  │ - host (主机配置)        │  │  │   │
│  │                              │  └────────────────────────┘  │  │   │
│  │                              │  ┌────────────────────────┐  │  │   │
│  │                              │  │ Dynamic Input Fields   │  │  │   │
│  │                              │  │ - ANTHROPIC_AUTH_TOKEN  │  │  │   │
│  │                              │  │ - ANTHROPIC_URL        │  │  │   │
│  │                              │  │ - ZAI_API_KEY          │  │  │   │
│  │                              │  │ - Volume mounts        │  │  │   │
│  │                              │  └────────────────────────┘  │  │   │
│  │                              └─────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    YAML Preview Panel                        │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │  Generated Docker Compose Configuration             │    │   │
│  │  │  - Environment variables based on provider selection │    │   │
│  │  │  - Provider comments for clarity                    │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User       │────▶│   Form       │────▶│   Config     │
│   Input      │     │   Component  │     │   State      │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │ generateYAML │
                                          │   Function   │
                                          └──────┬───────┘
                                                 │
                     ┌───────────────────────────┼───────────────────────────┐
                     │                           │                           │        │
                     ▼                           ▼                           ▼        ▼
              ┌─────────────┐            ┌─────────────┐            ┌─────────────┐    ┌─────────────┐
              │  anthropic  │            │    zai      │            │   custom    │    │    host     │
              │  provider   │            │  provider   │            │  provider   │    │  provider   │
              │  (highest)  │            │  (secondary)│            │ (custom URL)│    │  (mounted)  │
              └──────┬──────┘            └──────┬──────┘            └──────┬──────┘    └──────┬──────┘
                     │                           │                           │                   │
                     ▼                           ▼                           ▼                   ▼
            ┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐   ┌─────────────────┐
            │ANTHROPIC_AUTH_  │        │ ZAI_API_KEY     │        │ANTHROPIC_AUTH_  │   │ Volume mounts   │
            │TOKEN environment│        │ environment     │        │TOKEN + URL      │   │ + optional env  │
            └─────────────────┘        └─────────────────┘        └─────────────────┘   └─────────────────┘
                     │                           │                           │                   │
                     └───────────────────────────┼───────────────────────────┴───────────────────┘
                                                 ▼
                                          ┌──────────────┐
                                          │    YAML      │
                                          │   Output     │
                                          └──────────────┘
```

## Type Definitions

### 新增类型

```typescript
/**
 * Anthropic API 提供商类型
 * 统一使用 ANTHROPIC_AUTH_TOKEN 环境变量
 * 不同提供商通过 ANTHROPIC_URL 区分
 *
 * - anthropic: Anthropic 官方 API (仅需 ANTHROPIC_AUTH_TOKEN)
 * - zai: 智谱 AI (使用 ANTHROPIC_AUTH_TOKEN + 预设的 ANTHROPIC_URL)
 * - custom: 自定义 API (使用 ANTHROPIC_AUTH_TOKEN + ANTHROPIC_URL)
 * - host: 主机配置 (自动从挂载的配置文件读取)
 */
type AnthropicApiProvider = 'anthropic' | 'zai' | 'custom' | 'host';

/**
 * 扩展后的 Docker Compose 配置接口
 */
interface DockerComposeConfig {
  // ... 现有字段 ...

  // 新增字段
  /** Anthropic API 提供商选择 */
  anthropicApiProvider: AnthropicApiProvider;

  /** Anthropic API Token (所有提供商都使用此字段) */
  anthropicAuthToken?: string;

  /** API Endpoint URL (zai/custom 提供商使用) */
  anthropicUrl?: string;

  /** 预设的 ZAI API URL (用于 zai 提供商) */
  readonly ZAI_API_URL = 'https://open.bigmodel.cn/api/paas/v4/';

  /** 主机配置挂载路径 (host 提供商使用) */
  hostConfigPath?: string;

  /** 是否禁用主机配置自动检测 */
  hostConfigDisabled?: boolean;
}
```

## Component Structure

### API Keys Form Section

```
<FormSection title="Claude API 配置">
  ┌─────────────────────────────────────────────────────────────┐
  │  API 提供商                                    *           │
  │  ┌─────────────────────────────────────────────────────┐   │
  │  │ 统一使用 ANTHROPIC_AUTH_TOKEN 环境变量               │   │
  │  │ ┌─────────────────────────────────────────────────┐ │   │
  │  │ │ ▼ 智谱 AI (ZAI) - 默认选项                     │ │   │
  │  │ │   Anthropic 官方 API                            │ │   │
  │  │ │   自定义 API Endpoint                          │ │   │
  │  │ │   主机配置 (从挂载配置读取)                    │ │   │
  │  │ └─────────────────────────────────────────────────┘ │   │
  │  └─────────────────────────────────────────────────────┘   │
  │                                                              │
  │  [动态字段区域 - 根据提供商选择显示]                          │
  │                                                              │
  │  ┌─────────────────────────────────────────────────────┐   │
  │  │ Anthropic API Token                                │   │
  │  │ ┌─────────────────────────────────────────────────┐ │   │
  │  │ │ 请输入您的 API Token                             │ │   │
  │  │ └─────────────────────────────────────────────────┘ │   │
  │  │ 获取智谱 AI API Token →                              │   │
  │  └─────────────────────────────────────────────────────┘   │
  │                                                              │
  │  [智谱 AI 说明]                                               │
  │  API Endpoint 将自动设置为 ZAI API URL                      │
  └─────────────────────────────────────────────────────────────┘
</FormSection>
```

### 动态字段状态

```typescript
// 根据提供商显示的字段
const ZAI_API_URL = 'https://open.bigmodel.cn/api/paas/v4/';

const providerFields = {
  anthropic: {
    label: 'Anthropic 官方 API',
    description: '使用 Anthropic 官方 API',
    tokenLabel: 'Anthropic API Token',
    tokenKey: 'anthropicAuthToken',
    tokenPlaceholder: '请输入您的 Anthropic API Token (sk-ant-...)',
    link: 'https://console.anthropic.com/',
    linkText: '获取 Anthropic API Token →',
    envVar: 'ANTHROPIC_AUTH_TOKEN',
    needsUrl: false
  },
  zai: {
    label: '智谱 AI (ZAI)',
    description: '使用智谱 AI 的 Claude API（默认选项）',
    tokenLabel: 'API Token',
    tokenKey: 'anthropicAuthToken',
    tokenPlaceholder: '请输入您的智谱 AI API Token',
    link: 'https://www.bigmodel.cn/glm-coding?ic=14BY54APZA',
    linkText: '获取智谱 AI API Token →',
    envVar: 'ANTHROPIC_AUTH_TOKEN',
    envVarUrl: 'ANTHROPIC_URL',
    presetUrl: ZAI_API_URL,
    urlNote: 'API Endpoint 将自动设置为 ZAI API URL'
  },
  custom: {
    label: '自定义 API Endpoint',
    description: '使用自定义的 Anthropic 兼容 API',
    fields: [
      {
        label: 'API Token',
        key: 'anthropicAuthToken',
        placeholder: '请输入您的 API Token',
        envVar: 'ANTHROPIC_AUTH_TOKEN'
      },
      {
        label: 'API Endpoint URL',
        key: 'anthropicUrl',
        placeholder: '例如：https://api.example.com/v1',
        envVar: 'ANTHROPIC_URL'
      }
    ]
  },
  host: {
    label: '主机配置',
    description: '从挂载的配置文件自动读取',
    fields: [
      {
        label: '配置挂载路径',
        key: 'hostConfigPath',
        placeholder: '/path/to/.claude (留空使用默认)',
        note: '挂载主机上的 Claude 配置目录到容器'
      },
      {
        label: '禁用自动检测',
        key: 'hostConfigDisabled',
        type: 'checkbox',
        note: '设置 CLAUDE_HOST_CONFIG_ENABLED=false'
      }
    ],
    volumeNote: '需要添加 volume 挂载配置'
  }
};
```

## YAML Generation Logic

### 环境变量生成规则

```typescript
function generateClaudeApiEnvironment(config: DockerComposeConfig): {
  envLines: string[];
  volumeLines: string[];
} {
  const envLines: string[] = [];
  const volumeLines: string[] = [];
  const ZAI_API_URL = 'https://open.bigmodel.cn/api/paas/v4/';

  // 添加配置说明注释
  envLines.push('      # ==================================================');
  envLines.push('      # Claude Code Configuration');
  envLines.push('      # All providers use ANTHROPIC_AUTH_TOKEN');
  envLines.push('      # ANTHROPIC_URL is set for ZAI and custom providers');
  envLines.push('      # ==================================================');

  switch (config.anthropicApiProvider) {
    case 'anthropic':
      if (config.anthropicAuthToken) {
        envLines.push('      # Anthropic Official API');
        envLines.push(`      ANTHROPIC_AUTH_TOKEN: "${config.anthropicAuthToken}"`);
        envLines.push('      # No ANTHROPIC_URL needed - uses default Anthropic endpoint');
      }
      break;

    case 'zai':
      if (config.anthropicAuthToken) {
        envLines.push('      # 智谱 AI (ZAI) - uses Anthropic-compatible API');
        envLines.push(`      ANTHROPIC_AUTH_TOKEN: "${config.anthropicAuthToken}"`);
        envLines.push(`      ANTHROPIC_URL: "${ZAI_API_URL}"`);
        envLines.push('      # API Provider: 智谱 AI (ZAI)');
      }
      break;

    case 'custom':
      if (config.anthropicAuthToken) {
        envLines.push('      # Custom Anthropic-compatible API');
        envLines.push(`      ANTHROPIC_AUTH_TOKEN: "${config.anthropicAuthToken}"`);
        if (config.anthropicUrl) {
          envLines.push(`      ANTHROPIC_URL: "${config.anthropicUrl}"`);
        }
        envLines.push('      # API Provider: Custom Endpoint');
      }
      break;

    case 'host':
      envLines.push('      # Host Claude Configuration (auto-detected from mounts)');
      if (config.hostConfigDisabled) {
        envLines.push('      CLAUDE_HOST_CONFIG_ENABLED: false');
      }
      if (config.hostConfigPath) {
        volumeLines.push(`      - ${config.hostConfigPath}:/claude-mount:ro`);
      } else {
        volumeLines.push('      # Mount example: Host settings.json file');
        volumeLines.push('      # - /path/to/settings.json:/claude-mount/settings.json:ro');
        volumeLines.push('      # Or mount entire Claude directory:');
        volumeLines.push('      # - ~/.claude:/claude-mount:ro');
      }
      break;
  }

  return { envLines, volumeLines };
}
```

### 生成的 YAML 示例

```yaml
# Anthropic 官方 API (anthropic)
services:
  hagicode:
    environment:
      # ==================================================
      # Claude Code Configuration
      # All providers use ANTHROPIC_AUTH_TOKEN
      # ANTHROPIC_URL is set for ZAI and custom providers
      # ==================================================
      # Anthropic Official API
      ANTHROPIC_AUTH_TOKEN: "${ANTHROPIC_AUTH_TOKEN}"
      # No ANTHROPIC_URL needed - uses default Anthropic endpoint

# 智谱 AI (zai) - 默认选项
services:
  hagicode:
    environment:
      # ==================================================
      # Claude Code Configuration
      # All providers use ANTHROPIC_AUTH_TOKEN
      # ANTHROPIC_URL is set for ZAI and custom providers
      # ==================================================
      # 智谱 AI (ZAI) - uses Anthropic-compatible API
      ANTHROPIC_AUTH_TOKEN: "${ANTHROPIC_AUTH_TOKEN}"
      ANTHROPIC_URL: "https://open.bigmodel.cn/api/paas/v4/"
      # API Provider: 智谱 AI (ZAI)

# 自定义 API Endpoint (custom)
services:
  hagicode:
    environment:
      # ==================================================
      # Claude Code Configuration
      # All providers use ANTHROPIC_AUTH_TOKEN
      # ANTHROPIC_URL is set for ZAI and custom providers
      # ==================================================
      # Custom Anthropic-compatible API
      ANTHROPIC_AUTH_TOKEN: "${ANTHROPIC_AUTH_TOKEN}"
      ANTHROPIC_URL: "${ANTHROPIC_URL}"
      # API Provider: Custom Endpoint

# 主机配置 (host)
services:
  hagicode:
    environment:
      # ==================================================
      # Claude Code Configuration
      # All providers use ANTHROPIC_AUTH_TOKEN
      # ANTHROPIC_URL is set for ZAI and custom providers
      # ==================================================
      # Host Claude Configuration (auto-detected from mounts)
    volumes:
      # Mount example: Host settings.json file
      - /path/to/settings.json:/claude-mount/settings.json:ro
      # Or mount entire Claude directory:
      # - ~/.claude:/claude-mount:ro
```

## Backward Compatibility

### 兼容性策略

1. **默认行为变更说明**
   - 原：`anthropicApiProvider` 默认值为 `'zai'`
   - 新：`anthropicApiProvider` 默认值改为 `'anthropic'`（推荐官方 API）
   - 如需保持完全向后兼容，可选择将默认值保留为 `'zai'`

2. **环境变量名称变化**
   - 原：`ANTHROPIC_API_KEY`
   - 新：`ANTHROPIC_AUTH_TOKEN`（与后端保持一致）
   - 旧配置需要更新环境变量名

3. **配置迁移**
   - `zaiApiKey` 字段保持不变
   - `anthropicApiKey` 改为 `anthropicAuthToken`
   - 新增 `anthropicUrl`、`hostConfigPath` 等字段

4. **URL 兼容性**
   - 生成器页面 URL 不变
   - 无需重定向或路由修改

## UI/UX Considerations

### 用户体验原则

1. **渐进式披露**
   - 默认显示推荐的选项（Anthropic 官方 API）
   - 其他选项通过下拉菜单选择
   - 高级选项（主机配置）显示更多说明

2. **清晰引导**
   - 每个提供商都有获取 API Token 的链接
   - 占位符文本提供格式提示
   - 显示配置优先级说明

3. **即时反馈**
   - YAML 预览实时更新
   - 切换提供商时字段状态清晰可见
   - 显示当前选择的优先级说明

### 辅助功能

- 所有输入框都有对应的 label
- 必填字段有明确的 `*` 标记
- 提供商选择器使用语义化的 select 元素
- 错误状态有适当的 ARIA 属性

## Documentation Changes

### 文档清理策略

1. **识别硬编码配置**
   ```bash
   # 搜索包含 Docker Compose 配置的文档
   rg -l "ZAI_API_KEY" docs/
   rg -l "docker-compose" docs/
   ```

2. **更新策略**
   - 保留概念说明和架构图
   - 移除完整的硬编码 YAML
   - 添加生成器引用和引导

3. **新文档内容**
   - API 提供商对比和选择指南
   - 各提供商的 API Key 获取教程

## Testing Strategy

### 单元测试考虑

```typescript
// 测试用例示例
describe('DockerComposeConfig - API Provider', () => {
  test('zai provider generates ZAI_API_KEY', () => {
    const config = { anthropicApiProvider: 'zai', zaiApiKey: 'test-key' };
    const yaml = generateYAML(config);
    expect(yaml).toContain('ZAI_API_KEY:');
    expect(yaml).toContain('Option 2: ZAI API Key');
  });

  test('anthropic provider generates ANTHROPIC_AUTH_TOKEN', () => {
    const config = { anthropicApiProvider: 'anthropic', anthropicAuthToken: 'sk-ant-test' };
    const yaml = generateYAML(config);
    expect(yaml).toContain('ANTHROPIC_AUTH_TOKEN:');
    expect(yaml).toContain('Option 1: Anthropic Official API');
  });

  test('custom provider generates ANTHROPIC_AUTH_TOKEN and ANTHROPIC_URL', () => {
    const config = {
      anthropicApiProvider: 'custom',
      anthropicAuthToken: 'test-token',
      anthropicUrl: 'https://api.example.com'
    };
    const yaml = generateYAML(config);
    expect(yaml).toContain('ANTHROPIC_AUTH_TOKEN:');
    expect(yaml).toContain('ANTHROPIC_URL:');
    expect(yaml).toContain('Option 1: Custom Anthropic API');
  });

  test('host provider generates volume mounts', () => {
    const config = {
      anthropicApiProvider: 'host',
      hostConfigPath: '/path/to/.claude'
    };
    const yaml = generateYAML(config);
    expect(yaml).toContain('/path/to/.claude:/claude-mount:ro');
    expect(yaml).toContain('Option 3: Host Claude Configuration');
  });

  test('host provider with disabled auto-detection', () => {
    const config = {
      anthropicApiProvider: 'host',
      hostConfigDisabled: true
    };
    const yaml = generateYAML(config);
    expect(yaml).toContain('CLAUDE_HOST_CONFIG_ENABLED: false');
  });
});
```

### 手动测试清单

- [ ] Anthropic 官方（推荐）：输入 API Token，验证 YAML 生成 `ANTHROPIC_AUTH_TOKEN`
- [ ] 智谱 AI：切换提供商，输入 API Key，验证 YAML 生成 `ZAI_API_KEY`
- [ ] 自定义 API：输入 Token 和 URL，验证 YAML 生成两个环境变量
- [ ] 主机配置：输入挂载路径，验证 YAML 生成 volume 挂载
- [ ] 切换提供商：验证字段正确显示/隐藏
- [ ] 必填验证：尝试生成空配置，验证错误处理
- [ ] 配置优先级：验证注释中正确显示优先级说明

## Trade-offs and Alternatives

### 考虑的替代方案

1. **单一环境变量 + API endpoint 配置**
   - 优点：更灵活，支持任意 API
   - 缺点：更复杂，需要 endpoint 配置
   - **决策**：采用提供商选择，更用户友好

2. **配置文件导入/导出**
   - 优点：支持配置保存和分享
   - 缺点：超出当前需求范围
   - **决策**：暂不实现，未来可扩展

3. **API 验证功能**
   - 优点：确保配置正确
   - 缺点：需要后端支持，增加复杂度
   - **决策**：前端不做验证，依赖后端错误处理
