# astro-site 规范更新

## MODIFIED Requirements

### Requirement: Astro 核心配置

仓库 MUST 支持多应用 MonoRepo 架构，每个应用有独立的 Astro 配置。

#### Scenario: 识别 MonoRepo 结构

- **GIVEN** 仓库根目录
- **WHEN** 检查目录结构
- **THEN** MUST 包含 `apps/` 目录
- **AND** MUST 包含 `apps/docs/` 应用目录
- **AND** MUST 包含 `apps/website/` 应用目录
- **AND** 每个应用 MUST 有独立的 `astro.config.mjs`

#### Scenario: 初始化 Astro 配置（docs 应用）

- **GIVEN** `apps/docs/` 目录
- **WHEN** 我运行 `cd apps/docs && npm install` 和 `npm run dev`
- **THEN** Astro 开发服务器 MUST 成功启动
- **AND** 服务器 MUST 运行在 `http://localhost:4321`
- **AND** 站点 MUST 使用 `apps/docs/astro.config.mjs` 中配置的 base 路径

#### Scenario: 初始化 Astro 配置（website 应用）

- **GIVEN** `apps/website/` 目录
- **WHEN** 我运行 `cd apps/website && npm install` 和 `npm run dev`
- **THEN** Astro 开发服务器 MUST 成功启动
- **AND** 服务器 MUST 运行在 `http://localhost:4322`
- **AND** 站点 MUST 使用 `apps/website/astro.config.mjs` 中配置的 base 路径

#### Scenario: 验证 Astro 配置（docs 应用）

- **GIVEN** `apps/docs/astro.config.mjs` 文件存在
- **WHEN** 我检查配置
- **THEN** 它 MUST 包含：
  - 站点元数据（title, description, locale）
  - 集成配置（@astrojs/starlight, @astrojs/mdx, @astrojs/mermaid）
  - 构建配置（output: 'static'）
  - Base 路径配置从 `import.meta.env.VITE_SITE_BASE` 读取，默认值为 '/docs'
- **AND** 配置 MUST 符合 Astro 5.x 架构

#### Scenario: 验证 Astro 配置（website 应用）

- **GIVEN** `apps/website/astro.config.mjs` 文件存在
- **WHEN** 我检查配置
- **THEN** 它 MUST 包含：
  - 站点元数据（title, description, locale）
  - 集成配置（@astrojs/react, @astrojs/mdx）
  - 构建配置（output: 'static'）
  - Base 路径配置从 `import.meta.env.VITE_SITE_BASE` 读取，默认值为 '/'
  - **不包含** @astrojs/starlight 集成
- **AND** 配置 MUST 符合 Astro 5.x 架构

## REMOVED Requirements

### Requirement: Astro 核心配置（单体应用版本）

**Reason**: 被 MonoRepo 架构的多应用配置替代

**Migration**:
- 原根级 `astro.config.mjs` 的配置已迁移到 `apps/docs/astro.config.mjs`
- 文档站点内容已迁移到 `apps/docs/src/content/docs/`
- 营销站点内容已迁移到 `apps/website/src/pages/` 和 `apps/website/src/components/`

### Requirement: Starlight 文档结构（单体应用版本）

**Reason**: 文档结构已迁移到 `apps/docs/` 应用

**Migration**:
- 所有文档内容已从 `src/content/docs/` 迁移到 `apps/docs/src/content/docs/`
- Starlight 配置已在 `apps/docs/astro.config.mjs` 中配置
- 文档路由已迁移到 `apps/docs/src/pages/docs/[...slug].astro`
