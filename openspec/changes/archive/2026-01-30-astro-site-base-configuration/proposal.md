# 变更提案:统一 Astro 站点基础路径配置管理

## Why (背景与动机)

Hagicode 文档站点使用 Astro 5.x 框架构建,当前通过 `VITE_SITE_BASE` 环境变量配置站点基础路径。根据项目配置:

- **默认部署**: 根路径部署 (`/`),URL 结构为 `/docs/*`, `/blog/*`
- **子路径部署**: 设置 `VITE_SITE_BASE=/site`,URL 结构为 `/site/docs/*`, `/site/blog/*`

站点在 GitHub Pages 上部署,通过 `.github/workflows/deploy.yml` 自动化流程管理构建和部署。

### 当前问题

站点基础路径配置存在以下限制:

1. **配置分散**: `VITE_SITE_BASE` 需要在多个地方单独配置:
   - 本地开发环境 (需要通过命令行环境变量或 `.env` 文件)
   - GitHub Actions 环境变量 (在 deploy.yml 中硬编码为 `/site`)
   - 手动部署时的构建命令

2. **缺乏统一管理**: 没有单一的配置文件定义基础路径,容易导致配置不一致

3. **灵活性不足**: 无法通过修改单个配置文件来切换部署场景(根路径 vs 子路径)

4. **开发体验不佳**: 本地测试不同部署场景需要手动设置环境变量或修改构建命令

## What Changes (变更内容)

### 核心变更

1. **在 `astro.config.mjs` 中添加基础路径配置**:
   - 支持通过配置文件直接设置 base 路径
   - 从环境变量 `VITE_SITE_BASE` 读取作为覆盖选项
   - 默认值为 `/` (根路径部署)

2. **更新 `package.json` scripts**:
   - 添加 `dev:root` 脚本用于本地测试根路径部署
   - 添加 `dev:site` 脚本用于本地测试子路径部署
   - 保持现有 `dev` 脚本使用默认配置

3. **更新 GitHub Actions 配置**:
   - 移除硬编码的 `VITE_SITE_BASE` 环境变量
   - 依赖 `astro.config.mjs` 中的配置

4. **完善项目文档**:
   - 在 `openspec/project.md` 中更新配置说明
   - 添加不同部署场景的配置示例

### 技术实现细节

#### astro.config.mjs 修改

```javascript
export default defineConfig({
  // 从环境变量读取,如果没有则默认为 '/'
  base: import.meta.env.VITE_SITE_BASE || '/',
  // ... 其他配置
});
```

#### package.json scripts 更新

```json
{
  "scripts": {
    "dev": "astro dev",
    "dev:root": "astro dev",
    "dev:site": "VITE_SITE_BASE=/site astro dev",
    "build": "astro build",
    "build:site": "VITE_SITE_BASE=/site astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

#### .github/workflows/deploy.yml 更新

移除环境变量配置,使用 `astro.config.mjs` 中的默认值或环境变量覆盖:

```yaml
# 移除这部分:
# env:
#   VITE_SITE_BASE: '/site'

# 如果需要子路径部署,可以在配置文件中设置或通过环境变量覆盖
```

## Impact (影响范围)

### 影响的规格

- **astro-site** - 修改站点配置管理需求,添加统一的基础路径配置管理

### 影响的文件/目录

- **修改**: `astro.config.mjs` - 添加 base 配置
- **修改**: `package.json` - 更新和添加 scripts
- **修改**: `.github/workflows/deploy.yml` - 移除硬编码的环境变量
- **修改**: `openspec/project.md` - 更新部署配置文档

### 预期成果

#### 正面影响

1. **简化配置流程**:
   - 开发者只需修改 `astro.config.mjs` 即可设置默认基础路径
   - 不需要在多个地方维护相同的配置

2. **提升开发体验**:
   - 可以通过 `npm run dev:root` 或 `npm run dev:site` 快速测试不同部署场景
   - 配置逻辑更清晰,减少配置错误

3. **增强可维护性**:
   - 配置集中在单一位置
   - 环境变量作为覆盖选项,提供灵活性

4. **向后兼容**:
   - 保持 `VITE_SITE_BASE` 环境变量功能
   - 不影响当前 GitHub Actions 部署流程(可通过环境变量覆盖)

#### 兼容性保证

- **环境变量覆盖**: `VITE_SITE_BASE` 继续作为覆盖选项
- **现有部署**: GitHub Actions 可以继续使用环境变量(如需子路径部署)
- **默认行为**: 未设置环境变量时,默认为根路径 `/`

### 风险评估

- **低风险**: 配置逻辑简单,Astro 原生支持 base 配置
- **测试需求**: 需要验证本地开发和构建流程
- **迁移成本**: 无需内容迁移,仅调整配置文件

## Success Criteria (成功标准)

1. ✅ 本地开发可以通过 `npm run dev:root` 和 `npm run dev:site` 测试不同部署场景
2. ✅ `npm run build` 使用 `astro.config.mjs` 中的默认配置
3. ✅ GitHub Actions 部署成功(可通过环境变量覆盖基础路径)
4. ✅ 所有内部链接、图片、资源在两种部署场景下正确加载
5. ✅ `openspec validate astro-site-base-configuration --strict` 通过

## Alternatives Considered (备选方案)

### 方案 A: 仅使用环境变量

**优点**:
- 实现简单,无需修改配置文件

**缺点**:
- 仍然需要在多个地方设置环境变量
- 无法提供便捷的开发脚本
- 不改善配置分散的问题

**结论**: 不采用,未解决核心问题

### 方案 B: 使用 .env 文件管理

**优点**:
- 可以将环境变量集中管理

**缺点**:
- `.env` 文件不应该提交到版本控制
- 不同环境(本地、CI、生产)需要不同的 `.env` 文件
- 增加了配置复杂度

**结论**: 不采用,增加而非减少配置复杂度

### 方案 C: 在 astro.config.mjs 中硬编码 base 路径

**优点**:
- 配置最简单

**缺点**:
- 失去灵活性,无法通过环境变量覆盖
- 不同部署场景需要手动修改配置文件并提交

**结论**: 不采用,失去灵活性

## Status

**ExecutionCompleted** (已完成实施)

## Related Changes

- 无相关变更

## Related Specs

- `astro-site` - Astro 站点基础规格
