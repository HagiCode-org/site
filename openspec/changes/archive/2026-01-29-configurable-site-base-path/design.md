# Design: 支持可配置的站点基础路径

## 设计目标

实现灵活的站点基础路径(base)配置,支持多种部署场景,同时保持向后兼容和开发体验。

## 架构设计

### 1. 配置层

#### 环境变量命名

使用 `VITE_SITE_BASE` 作为环境变量名称,原因:
- 符合 Vite 环境变量命名规范(VITE_ 前缀)
- 在构建时可以被 Vite 正确处理
- 在客户端代码中可以通过 `import.meta.env` 访问

#### 默认值策略

```javascript
// astro.config.mjs
base: process.env.VITE_SITE_BASE || '/'
```

**设计考虑**:
- 使用 `/` 作为默认值,符合大多数部署场景
- 当环境变量未设置时,默认部署到根路径
- 保持向后兼容:如果不设置环境变量,站点行为与大多数静态站点生成器一致

### 2. 构建层

#### Astro 配置更新

**当前配置**:
```javascript
export default defineConfig({
  site: 'https://pcode-org.github.io',
  base: '/site',
  output: 'static',
  // ...
});
```

**更新后配置**:
```javascript
export default defineConfig({
  site: 'https://pcode-org.github.io',
  base: process.env.VITE_SITE_BASE || '/',
  output: 'static',
  // ...
});
```

**技术细节**:
- `process.env.VITE_SITE_BASE` 在构建时由 Node.js 提供
- Vite 会处理 `VITE_` 前缀的环境变量,使其在构建时可用
- `site` 配置保持不变,继续定义站点的规范 URL

### 3. 部署层

#### GitHub Actions 多环境支持

**当前工作流**:
```yaml
- name: Build
  run: npm run build
  env:
    CLARITY_PROJECT_ID: ${{ secrets.CLARITY_PROJECT_ID }}
```

**更新后工作流**:
```yaml
- name: Build
  run: npm run build
  env:
    CLARITY_PROJECT_ID: ${{ secrets.CLARITY_PROJECT_ID }}
    VITE_SITE_BASE: '/site'  # 可配置
```

**部署场景**:

1. **子路径部署(现有行为)**:
   ```yaml
   VITE_SITE_BASE: '/site'
   # 部署到: https://pcode-org.github.io/site/
   ```

2. **根路径部署**:
   ```yaml
   VITE_SITE_BASE: '/'
   # 部署到: https://pcode-org.github.io/
   ```

3. **多版本部署(未来扩展)**:
   - 可以创建多个工作流文件
   - 每个工作流使用不同的 `VITE_SITE_BASE` 值
   - 部署到不同的环境或分支

### 4. 开发层

#### 本地开发体验

**保持现有行为**:
- `npm run dev` 启动开发服务器
- 默认访问 `http://localhost:4321/`
- 如果需要测试子路径,可以设置环境变量:
  ```bash
  VITE_SITE_BASE=/site npm run dev
  ```

**环境变量设置方式**:
1. 临时设置(单次):
   ```bash
   VITE_SITE_BASE=/site npm run build
   ```

2. 持久设置(.env 文件):
   ```bash
   # .env.production
   VITE_SITE_BASE=/site
   ```

3. shell 配置:
   ```bash
   export VITE_SITE_BASE=/site
   npm run build
   ```

## 技术实现细节

### 1. URL 路径处理

Astro 会自动处理 `base` 配置,无需手动调整:
- 内部链接会自动加上 base 前缀
- 图片路径会自动解析
- sitemap.xml 会自动包含正确的 URL

### 2. 内容集合

Content Collections 不受影响,因为:
- 集合配置基于文件系统路径
- 生成的 URL 会自动适配 base 配置
- 无需修改任何内容文件

### 3. 第三方集成

**Clarity Analytics**:
- 当前配置使用 `vite.define` 注入
- 不受 `base` 配置影响
- 继续正常工作

**其他集成**:
- React 组件:不受影响
- MDX:不受影响
- Mermaid:不受影响

## 风险评估

### 低风险
- **配置变更简单**:仅修改一行配置
- **Astro 原生支持**:Astro 官方推荐的环境变量配置方式
- **向后兼容**:可以通过设置 `VITE_SITE_BASE=/site` 保持现有行为

### 需要验证
- **构建产物**:需要验证不同 base 值下的构建产物
- **链接完整性**:需要验证所有内部链接和外部链接
- **资源加载**:需要验证图片、CSS、JS 资源加载
- **SEO 影响**:需要验证 sitemap.xml 和 robots.xml

## 迁移策略

### 阶段 1: 配置更新
1. 修改 `astro.config.mjs`
2. 更新 GitHub Actions 工作流
3. 本地测试验证

### 阶段 2: 部署测试
1. 在功能分支上测试
2. 验证 GitHub Actions 构建
3. 验证 GitHub Pages 部署

### 阶段 3: 文档更新
1. 更新项目文档
2. 更新部署指南
3. 添加使用示例

### 阶段 4: 监控和优化
1. 监控构建性能
2. 收集用户反馈
3. 根据需要调整

## 未来扩展

### 多环境部署

可以扩展支持多个部署环境:
- **生产环境**:根路径部署
- **预览环境**:子路径部署
- **版本化文档**:不同版本使用不同子路径

### 自动化配置

可以创建配置脚本:
```bash
# 设置部署场景
npm run deploy:root      # 根路径部署
npm run deploy:subpath   # 子路径部署
```

### 部署矩阵

可以使用 GitHub Actions 矩阵策略同时部署到多个环境:
```yaml
strategy:
  matrix:
    site_base: ['/', '/site', '/v1']
```

## 测试策略

### 单元测试
- 不需要(配置层面变更)

### 集成测试
- 本地开发服务器测试
- 不同 base 值的构建测试
- 预览服务器测试

### 端到端测试
- GitHub Actions 工作流测试
- GitHub Pages 部署测试
- 跨浏览器兼容性测试

### 性能测试
- 构建时间对比
- 构建产物大小对比
- Lighthouse 性能审计

## 回滚计划

如果出现问题,可以快速回滚:
1. 恢复 `astro.config.mjs` 中的 `base: '/site'`
2. 移除 GitHub Actions 中的 `VITE_SITE_BASE` 环境变量
3. 重新部署

回滚风险:低(配置变更简单,容易恢复)

## 总结

这个设计方案提供了:
- ✅ 灵活的部署配置
- ✅ 向后兼容性
- ✅ 开发体验保持不变
- ✅ 简单的实现方式
- ✅ 低风险的变更
- ✅ 良好的扩展性
