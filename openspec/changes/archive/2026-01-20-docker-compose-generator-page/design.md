# Design Document

## Overview

This document provides detailed design specifications for the Docker Compose Generator page component architecture, styling approach, and interaction patterns.

---

## Component Architecture

### File Structure

```
src/pages/
├── docker-compose-generator.tsx           # Main page component (all-in-one)
└── docker-compose-generator.module.css    # Page-specific styles
```

### Component Hierarchy

```
DockerComposeGenerator (page component)
├── GeneratorHeader
│   ├── Title
│   └── Description
├── GeneratorLayout (two-column grid)
│   ├── ConfigForm (left column)
│   │   ├── FormSection
│   │   │   ├── SectionTitle
│   │   │   ├── FieldGroup
│   │   │   │   ├── Label
│   │   │   │   ├── Input (TextField | Select | Checkbox)
│   │   │   │   └── HelpText
│   │   │   └── [more fields...]
│   │   └── [more sections...]
│   └── ConfigPreview (right column)
│       ├── PreviewHeader
│       │   ├── Title
│       │   └── CopyButton
│       ├── CodeBlock (prism-react-renderer)
│       └── CopyFeedback
```

---

## Type Definitions

### DockerComposeConfig Interface

```typescript
interface DockerComposeConfig {
  // Basic Settings
  httpPort: string;              // Default: '45000'
  containerName: string;         // Default: 'hagicode-app'
  postgresContainerName: string; // Default: 'hagicode-postgres'

  // Environment
  aspNetEnvironment: 'Production' | 'Development' | 'Staging';
  timezone: string;              // Default: 'Asia/Shanghai'

  // Database
  postgresDatabase: string;      // Default: 'hagicode'
  postgresUser: string;          // Default: 'postgres'
  postgresPassword: string;      // Default: 'postgres'

  // API Keys
  licenseKey: string;            // Default: 'D76B5C-EC0A70-AEA453-BC9414-0A198D-V3'
  zaiApiKey: string;             // Required, no default

  // Volume Mounts
  workdirPath: string;           // Default: '/path/to/your/repos'

  // Advanced (conditional)
  enableUserMapping: boolean;    // Default: false
  puid: string;                  // Default: '1000', shown when enableUserMapping=true
  pgid: string;                  // Default: '1000', shown when enableUserMapping=true
}
```

### Component Props

```typescript
// Internal components (not exported)
interface ConfigFormProps {
  config: DockerComposeConfig;
  onChange: (config: DockerComposeConfig) => void;
}

interface ConfigPreviewProps {
  yaml: string;
  onCopy: () => void;
  copied: boolean;
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
  type?: 'text' | 'number' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}
```

---

## Visual Design

### Layout Specifications

#### Desktop (>= 768px)
```
┌─────────────────────────────────────────────────────────────┐
│                    Header (Site Nav)                         │
├─────────────────────────────────────────────────────────────┤
│  Page Title: Docker Compose 生成器                           │
│  Page Description: 快速生成配置文件...                        │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│   Configuration Form     │      Live Preview               │
│   (Left Column)          │      (Right Column)              │
│                          │                                  │
│   Section: 基础配置        │   ┌─────────────────────────┐  │
│   [HTTP Port: 45000   ]  │   │ services:                │  │
│   [Container Name    ]  │   │   hagicode:               │  │
│                          │   │     image: ...            │  │
│   Section: 环境配置        │   │     environment:         │  │
│   [Environment: v    ]  │   │       ASPNETCORE_...      │  │
│   [Timezone: Asia/Sh ]  │   │ ...                      │  │
│                          │   └─────────────────────────┘  │
│   Section: 数据库配置      │                  [Copy按钮]    │
│   [Database Name   ]  │                                   │
│   [Username        ]  │                                   │
│   [Password •••    ]  │                                   │
│                          │                                   │
│   ...更多 sections        │                                   │
│                          │                                   │
└──────────────────────────┴───────────────────────────────────┘
```

#### Mobile (< 768px)
```
┌─────────────────────────┐
│    Header (Site Nav)    │
├─────────────────────────┤
│  Page Title             │
│  Page Description       │
├─────────────────────────┤
│  Configuration Form     │
│  (stacked sections)     │
│                         │
│  [Form Fields...]       │
│                         │
├─────────────────────────┤
│  Live Preview           │
│  ┌───────────────────┐ │
│  │  services:        │ │
│  │    hagicode:      │ │
│  │  ...              │ │
│  └───────────────────┘ │
│  [Copy]                │
└─────────────────────────┘
```

### Styling Patterns

#### Color Palette (from `custom.css`)
```css
/* Primary accent for actions, borders, highlights */
--pc-accent: #6C5CE7;
--pc-accent-glow: rgba(108, 92, 231, 0.4);

/* Gradient colors */
--pc-gradient-1: #FF6B6B;
--pc-gradient-2: #4ECDC4;
--pc-gradient-3: #45B7D1;

/* Docusaurus theme colors */
--ifm-background-surface-color
--ifm-background-color
--ifm-color-emphasis-600
--ifm-border-color
```

#### Form Element Styles
```css
/* Section container */
.formSection {
  background: var(--ifm-background-surface-color);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--ifm-border-color);
}

/* Section title */
.sectionTitle {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--pc-accent);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Form field */
.formField {
  margin-bottom: 1.25rem;
}

.fieldLabel {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--ifm-color-emphasis-900);
}

.fieldInput {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--ifm-border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: var(--ifm-background-color);
  color: var(--ifm-color-emphasis-900);
}

.fieldInput:focus {
  border-color: var(--pc-accent);
  outline: none;
  box-shadow: 0 0 0 3px var(--pc-accent-glow);
}

/* Help text */
.helpText {
  font-size: 0.875rem;
  color: var(--ifm-color-emphasis-600);
  margin-top: 0.375rem;
  line-height: 1.4;
}

/* Advanced section (collapsible) */
.advancedSection {
  border-top: 1px dashed var(--ifm-border-color);
  padding-top: 1rem;
  margin-top: 1rem;
}
```

#### Preview Panel Styles
```css
/* Preview container */
.previewPanel {
  position: sticky;
  top: calc(var(--ifm-navbar-height) + 2rem);
  height: fit-content;
  max-height: calc(100vh - var(--ifm-navbar-height) - 4rem);
  display: flex;
  flex-direction: column;
}

/* Preview header */
.previewHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--ifm-border-color);
}

/* Code block */
.codeBlock {
  background: var(--ifm-code-background);
  border-radius: 12px;
  padding: 1.5rem;
  overflow: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  flex: 1;
  position: relative;
  border: 1px solid var(--ifm-border-color);
}

/* Copy button */
.copyButton {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: var(--pc-accent);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.copyButton:hover {
  background: var(--pc-gradient-3);
  transform: translateY(-1px);
}

.copyButton.copied {
  background: var(--pc-gradient-2);
}

/* Copy feedback */
.copyFeedback {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--pc-gradient-2);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  animation: feedbackPop 0.3s ease-out;
  z-index: 1000;
}

@keyframes feedbackPop {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

---

## YAML Generation Specification

### Template Structure

```typescript
function generateYAML(config: DockerComposeConfig): string {
  const sections = [
    generateHeader(),
    generateHagicodeService(config),
    generatePostgresService(config),
    generateVolumes(),
    generateNetworks()
  ];

  return sections.filter(Boolean).join('\n\n');
}
```

### Output Template

```yaml
# Hagicode Docker Compose 配置文件
# 由 Docker Compose 生成器自动生成
# 生成时间: {timestamp}

services:
  # Hagicode 主应用服务
  hagicode:
    image: newbe36524/hagicode:latest
    container_name: {containerName}
    environment:
      # ASP.NET Core 运行环境
      ASPNETCORE_ENVIRONMENT: {aspNetEnvironment}
      ASPNETCORE_URLS: http://+:45000
      # 时区设置
      TZ: {timezone}
      # 数据库连接字符串
      ConnectionStrings__Default: "Host={postgresContainerName};Port=5432;Database={postgresDatabase};Username={postgresUser};Password={postgresPassword}"
      # Hagicode 许可证密钥（公测阶段通用密钥）
      License__Activation__LicenseKey: "{licenseKey}"
      {if enableUserMapping}
      # 用户和组 ID 配置（用于文件权限管理）
      # 将 PUID/PGID 替换为您在宿主机的实际用户 ID 和组 ID
      PUID: {puid}
      PGID: {pgid}
      {endif}
      # 智谱 AI API Key（容器部署必需）
      # 购买链接：https://www.bigmodel.cn/claude-code?ic=14BY54APZA
      ZAI_API_KEY: "{zaiApiKey}"
    ports:
      # HTTP 端口映射（主机端口:容器端口）
      - "{httpPort}:45000"
    volumes:
      # 代码工作目录映射（主机路径:容器路径）
      # 请将 {workdirPath} 替换为您的实际代码仓库路径
      - {workdirPath}:/app/workdir
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - pcode-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:45000/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s

  # PostgreSQL 数据库服务
  postgres:
    image: bitnami/postgresql:latest
    container_name: {postgresContainerName}
    environment:
      POSTGRES_DATABASE: {postgresDatabase}
      POSTGRES_USER: {postgresUser}
      POSTGRES_PASSWORD: {postgresPassword}
      POSTGRES_HOST_AUTH_METHOD: trust
      TZ: {timezone}
    volumes:
      - postgres-data:/bitnami/postgresql
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "{postgresUser}"]
      interval: 10s
      timeout: 3s
      retries: 3
    networks:
      - pcode-network
    restart: unless-stopped

# 数据卷定义
volumes:
  postgres-data:

# 网络定义
networks:
  pcode-network:
    driver: bridge
```

---

## Interaction Patterns

### Form Updates

1. **Input Change** → `onChange` handler → Update state
2. **State Update** → Re-render → Generate new YAML
3. **YAML Update** → Preview updates

### Copy Flow

1. User clicks "Copy" button
2. `navigator.clipboard.writeText(yaml)` called
3. Show "Copied!" feedback overlay
4. Set timeout to remove feedback after 2 seconds
5. Button shows "Copied!" state briefly

### Advanced Options Toggle

1. User clicks "高级选项" (Advanced Options) header
2. Toggle `showAdvanced` state
3. Conditional rendering of PUID/PGID fields
4. Smooth height transition

---

## Accessibility

### Keyboard Navigation

- Tab: Navigate through form fields
- Shift+Tab: Reverse navigation
- Enter: Submit/copy on focused button
- Escape: Close modals (if added)

### Screen Reader Support

```tsx
<label htmlFor="httpPort">
  HTTP 端口
  <span className="visually-hidden">（必需）</span>
</label>
<input
  id="httpPort"
  type="number"
  aria-describedby="httpPort-help"
  aria-required="true"
/>
<p id="httpPort-help" className="helpText">
  容器暴露到主机的 HTTP 端口号
</p>
```

### Focus Management

- Visible focus indicators on all interactive elements
- Focus returned to button after copy action
- No focus traps

---

## Performance Considerations

### Optimization Strategies

1. **Memoization**: Use `React.useMemo` for YAML generation
2. **Debouncing**: Consider debouncing rapid input changes
3. **Code Splitting**: Lazy load prism-react-renderer

```typescript
const yaml = React.useMemo(
  () => generateYAML(config),
  [config]
);
```

### Bundle Impact

- prism-react-renderer: ~100KB gzipped
- No additional runtime dependencies
- CSS is code-split via CSS Modules

---

## Responsive Breakpoints

```css
/* Mobile First Approach */

/* Base styles (< 768px) */
.generatorLayout {
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* Tablet and Desktop (>= 768px) */
@media (min-width: 768px) {
  .generatorLayout {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

/* Large Desktop (>= 1200px) */
@media (min-width: 1200px) {
  .generatorContainer {
    padding: 3rem;
  }
}
```

---

## Theme Support

### Dark Mode Considerations

- All colors use CSS custom properties
- Code block syntax highlighting adapts to theme
- Input field borders readable in both themes

### Theme-Specific Overrides (if needed)

```css
[data-theme='dark'] {
  .codeBlock {
    background: #1e1e1e;
  }

  .formSection {
    border-color: var(--ifm-border-color);
  }
}
```

---

## Future Extension Points

### Pluggable Architecture

```typescript
// Future: Template system
interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  defaults: Partial<DockerComposeConfig>;
  customYAML?: (config: DockerComposeConfig) => string;
}

// Future: Validation
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Future: Export formats
type ExportFormat = 'yaml' | 'json' | 'env-file';
```

### Extensibility Hooks

```typescript
// Before generating YAML
onBeforeGenerate?: (config: DockerComposeConfig) => DockerComposeConfig;

// After generating YAML
onAfterGenerate?: (yaml: string, config: DockerComposeConfig) => string;

// On copy
onCopy?: (yaml: string) => void;
```
