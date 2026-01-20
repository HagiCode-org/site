# Implementation Tasks

## Overview

This document outlines the implementation tasks for the Docker Compose Generator page. Tasks are ordered by dependency and can be executed sequentially.

---

## Phase 1: Foundation

### Task 1.1: Create Page Component Structure

**File**: `src/pages/docker-compose-generator.tsx`

**Description**: Create the main page component with basic layout structure.

**Acceptance Criteria**:
- [x] Page component exports a default function component named `DockerComposeGenerator`
- [x] Uses `Layout` from `@theme/Layout`
- [x] Sets page title and description
- [x] Renders a main container with `generatorContainer` class
- [x] TypeScript compiles without errors
- [x] Page is accessible at `/docker-compose-generator` route

**Implementation Notes**:
```tsx
import Layout from '@theme/Layout';
import styles from './docker-compose-generator.module.css';

export default function DockerComposeGenerator(): JSX.Element {
  return (
    <Layout title="Docker Compose 生成器" description="快速生成 Hagicode Docker Compose 配置">
      <main className={styles.generatorContainer}>
        {/* Content will be added in subsequent tasks */}
      </main>
    </Layout>
  );
}
```

**Dependencies**: None

---

### Task 1.2: Create Page Styles

**File**: `src/pages/docker-compose-generator.module.css`

**Description**: Create CSS Module for the generator page styling.

**Acceptance Criteria**:
- [x] Defines two-column grid layout for desktop
- [x] Stacks to single column on mobile (max-width: 767px)
- [x] Uses CSS custom properties from `custom.css`
- [x] Matches existing site design patterns
- [x] Supports both light and dark themes

**Key Styles**:
```css
.generatorContainer {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.generatorLayout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 767px) {
  .generatorLayout {
    grid-template-columns: 1fr;
  }
}
```

**Dependencies**: Task 1.1

---

## Phase 2: Configuration Form

### Task 2.1: Define Configuration State Type

**File**: `src/pages/docker-compose-generator.tsx` (internal)

**Description**: Define TypeScript interface for Docker Compose configuration state.

**Acceptance Criteria**:
- [x] Interface `DockerComposeConfig` covers all configuration options
- [x] Default values match existing documentation
- [x] Type is exported for potential reuse

**Configuration Fields**:
```typescript
interface DockerComposeConfig {
  // Basic settings
  httpPort: string;
  containerName: string;
  postgresContainerName: string;

  // Environment
  aspNetEnvironment: 'Production' | 'Development';
  timezone: string;

  // Database
  postgresDatabase: string;
  postgresUser: string;
  postgresPassword: string;

  // API Keys
  licenseKey: string;
  zaiApiKey: string;

  // Volume mounts
  workdirPath: string;

  // Advanced
  enableUserMapping: boolean;
  puid: string;
  pgid: string;
}
```

**Dependencies**: Task 1.1

---

### Task 2.2: Create Configuration Form Component

**File**: `src/pages/docker-compose-generator.tsx` (internal component)

**Description**: Build the left-column form with all configuration inputs.

**Acceptance Criteria**:
- [x] Form sections match documentation structure
- [x] Each input has a descriptive label
- [x] Help text explains each configuration option
- [x] Input validation (port numbers, required fields)
- [x] Collapsible "Advanced Options" section
- [x] Styled consistently with site design

**Form Sections**:
1. **基础配置** (Basic Settings)
   - HTTP 端口
   - 容器名称
   - PostgreSQL 容器名称

2. **环境配置** (Environment)
   - ASP.NET Core 环境
   - 时区

3. **数据库配置** (Database)
   - 数据库名称
   - 用户名
   - 密码

4. **API 密钥** (API Keys)
   - License Key
   - 智谱 AI API Key

5. **卷挂载** (Volume Mounts)
   - 工作目录路径

6. **高级选项** (Advanced) - collapsible
   - 启用用户/组 ID 映射
   - PUID
   - PGID

**Dependencies**: Task 2.1, Task 1.2

---

### Task 2.3: Implement Form State Management

**File**: `src/pages/docker-compose-generator.tsx`

**Description**: Add React state management for configuration form.

**Acceptance Criteria**:
- [x] Uses `useState` for configuration state
- [x] All form inputs are controlled components
- [x] Default values are pre-populated
- [x] Changes trigger preview updates
- [x] No performance issues with re-renders

**Default Values**:
```typescript
const defaultConfig: DockerComposeConfig = {
  httpPort: '45000',
  containerName: 'hagicode-app',
  postgresContainerName: 'hagicode-postgres',
  aspNetEnvironment: 'Production',
  timezone: 'Asia/Shanghai',
  postgresDatabase: 'hagicode',
  postgresUser: 'postgres',
  postgresPassword: 'postgres',
  licenseKey: 'D76B5C-EC0A70-AEA453-BC9414-0A198D-V3',
  zaiApiKey: '',
  workdirPath: '/path/to/your/repos',
  enableUserMapping: false,
  puid: '1000',
  pgid: '1000',
};
```

**Dependencies**: Task 2.2

---

## Phase 3: YAML Preview

### Task 3.1: Create YAML Generator Function

**File**: `src/pages/docker-compose-generator.tsx` (internal)

**Description**: Implement function to convert config state to Docker Compose YAML string.

**Acceptance Criteria**:
- [x] Generates valid YAML syntax
- [x] Includes Chinese comments for each section
- [x] Handles optional fields (PUID/PGID)
- [x] Matches output format from documentation example
- [x] Uses proper indentation (2 spaces)

**Output Format**:
```yaml
services:
  hagicode:
    image: newbe36524/hagicode:latest
    container_name: {containerName}
    environment:
      ASPNETCORE_ENVIRONMENT: {aspNetEnvironment}
      # ... other environment variables
    ports:
      - "{httpPort}:45000"
    volumes:
      - {workdirPath}:/app/workdir
    # ... other configuration

  postgres:
    image: bitnami/postgresql:latest
    # ... postgres configuration

volumes:
  postgres-data:

networks:
  pcode-network:
    driver: bridge
```

**Dependencies**: Task 2.3

---

### Task 3.2: Create Preview Panel Component

**File**: `src/pages/docker-compose-generator.tsx` (internal component)

**Description**: Build the right-column preview panel with syntax highlighting.

**Acceptance Criteria**:
- [x] Displays generated YAML with syntax highlighting
- [x] Uses `prism-react-renderer` for YAML
- [x] Shows "Copy" button in top-right corner
- [x] Has "Copied!" feedback after copying
- [x] Matches site code block styling
- [x] Updates in real-time as form changes

**Dependencies**: Task 3.1, Task 1.2

---

### Task 3.3: Implement Copy Functionality

**File**: `src/pages/docker-compose-generator.tsx`

**Description**: Add copy to clipboard functionality with visual feedback.

**Acceptance Criteria**:
- [x] Copy button copies full YAML to clipboard
- [x] Shows "Copied!" message for 2 seconds after copy
- [x] Handles clipboard API errors gracefully
- [x] Works on modern browsers

**Dependencies**: Task 3.2

---

## Phase 4: Navigation Integration

### Task 4.1: Add Navbar Entry

**File**: `docusaurus.config.ts`

**Description**: Add "Docker Compose 生成器" link to navigation bar.

**Acceptance Criteria**:
- [x] New entry appears in right-side navbar
- [x] Link navigates to `/docker-compose-generator`
- [x] Label is "Docker Compose 生成器"
- [x] Position is after existing links (or appropriately placed)

**Change Location**: `themeConfig.navbar.items` array

**Dependencies**: None (can be done in parallel with Phase 1-3)

---

### Task 4.2: Add Documentation Cross-Reference

**File**: `docs/installation/docker-compose.md`

**Description**: Add recommendation link in existing Docker Compose documentation.

**Acceptance Criteria**:
- [x] Added prominent callout at top of document
- [x] Link opens generator in new tab
- [x] Styled as tip/admonition
- [x] Text is clear and inviting

**Suggested Content**:
```markdown
:::tip Try the interactive generator
Want a faster way to generate your Docker Compose configuration? Try our [interactive Docker Compose Generator](/docker-compose-generator) for a guided experience!
:::
```

**Dependencies**: Task 4.1

---

## Phase 5: Testing & Validation

### Task 5.1: Type Checking

**Command**: `npm run typecheck`

**Description**: Run TypeScript type checker and fix any errors.

**Acceptance Criteria**:
- [x] `npm run typecheck` completes without errors
- [x] All imports are properly typed
- [x] No implicit any types

**Dependencies**: All previous tasks

---

### Task 5.2: Build Verification

**Command**: `npm run build`

**Description**: Build the site and verify no errors occur.

**Acceptance Criteria**:
- [x] `npm run build` completes successfully
- [x] Generated page is included in build output
- [x] No console errors during build
- [x] Page renders correctly in production build

**Dependencies**: Task 5.1

---

### Task 5.3: Manual Testing

**Description**: Manual testing of the generator page functionality.

**Acceptance Criteria**:
- [x] Page loads at `/docker-compose-generator`
- [x] All form inputs work correctly
- [x] Preview updates in real-time
- [x] Copy button copies to clipboard
- [x] Generated YAML is valid
- [x] Navbar link navigates correctly
- [x] Documentation link navigates correctly
- [x] Page works on mobile (responsive)
- [x] Theme toggle works (light/dark)
- [x] No console errors

**Dependencies**: Task 5.2

---

## Task Summary

| Phase | Tasks | Estimated Files |
|-------|-------|-----------------|
| 1. Foundation | 2 | 2 new files |
| 2. Configuration Form | 3 | Updates to existing |
| 3. YAML Preview | 3 | Updates to existing |
| 4. Navigation | 2 | 2 modified files |
| 5. Testing | 3 | Validation only |
| **Total** | **13** | **4 files** |

## Dependencies Graph

```
1.1 (Page Structure)
  ├─> 1.2 (Styles)
  │     ├─> 2.2 (Form Component)
  │           ├─> 2.1 (Config Type)
  │           └─> 2.3 (State Management)
  │                 └─> 3.1 (YAML Generator)
  │                       └─> 3.2 (Preview Component)
  │                             └─> 3.3 (Copy Function)
  │
4.1 (Navbar) ────────────────────────> 4.2 (Doc Link)
                                            │
5.1 (Typecheck) <─────────────────────────┘
  └─> 5.2 (Build)
        └─> 5.3 (Manual Testing)
```

## Execution Order

1. **Start with**: Task 1.1, 1.2, 2.1, 4.1 (can be done in parallel)
2. **Then**: Task 2.2, 2.3 (sequential)
3. **Then**: Task 3.1, 3.2, 3.3 (sequential)
4. **Then**: Task 4.2
5. **Finally**: Task 5.1, 5.2, 5.3 (sequential validation)
