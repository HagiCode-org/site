# Site - Agent Configuration

## Root Configuration
从 monorepo 根目录的 `/AGENTS.md` 继承所有行为。

## Project Context

Site 是 HagiCode 的官方文档和营销网站（hagicode.com 和 docs.hagicode.com）。基于 Astro 5 构建，提供：

- 产品文档和指南
- 营销内容和落地页
- 安装说明
- 快速入门指南
- 贡献者指南

## Tech Stack

### Core Framework
- **Astro**: 5.6.1 静态站点生成器
- **React**: 19.2.4 交互式组件
- **TypeScript**: 5.3.0 类型安全
- **Vite**: 6.0.0 构建工具

### Content Management
- **Markdown**: 内容创作
- **MDX**: 4.3.13 增强 Markdown（React 组件支持）
- **Starlight Blog**: 0.25.2 博客集成
- **Frontmatter**: 内容元数据

### Styling & UI
- **CSS**: 原生 CSS（不使用 TailwindCSS）
- **Design System**: Glassmorphism + Tech Dark 风格（详见 `design-system.md`）
- **Framer Motion**: 12.29.2 流畅动画

### Integrations
- **@astrojs/react**: 4.4.2 React 集成
- **@astrojs/partytown**: 2.1.4 第三方脚本卸载
- **@astrojs/sitemap**: 3.7.0 站点地图生成
- **astro-og-canvas**: 0.10.1 OG 图片生成
- **astro-robots-txt**: 1.0.0 robots.txt 生成
- **astro-seo**: 1.1.0 SEO 优化
- **astro-link-validator**: 链接验证（CI 环境启用）
- **Mermaid**: 11.12.2 图表支持

### Analytics
- **Microsoft Clarity**: 用户行为分析
- **51LA**: 备用分析方案（已迁移，百度统计已弃用）

### Testing
- **Vitest**: 4.0.18 单元测试
- **Playwright**: 1.58.0 E2E 测试

## Project Structure

```
repos/site/
├── src/
│   ├── pages/              # 路由页面（基于文件的路由）
│   │   ├── index.astro     # 首页
│   │   ├── desktop/        # Desktop 应用页面
│   │   ├── container/      # 容器相关页面
│   │   └── demo/           # 演示页面
│   ├── components/         # React/Astro 组件
│   │   ├── home/           # 首页组件
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesShowcase.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── InstallOptionsSection.tsx
│   │   │   ├── ActivityMetricsSection.tsx
│   │   │   ├── VideoShowcase.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ...
│   │   ├── desktop/        # Desktop 应用相关组件
│   │   ├── 51LAAnalytics.astro
│   │   ├── BaiduAnalytics.astro
│   │   └── Clarity.astro
│   ├── config/             # 站点配置
│   ├── lib/                # 工具库
│   ├── styles/             # 全局样式
│   └── utils/              # 工具函数
├── public/                 # 静态资源（图片、字体等）
├── static/                 # 公共文件（根路径服务）
├── scripts/                # 构建脚本
│   ├── copy-version-index.js
│   ├── update-activity-metrics.js
│   └── generate-image.sh
├── astro.config.mjs        # Astro 配置
├── package.json            # 项目依赖
├── tsconfig.json           # TypeScript 配置
├── design-system.md        # 设计系统文档
└── AGENTS.md               # 本文件
```

## Agent Behavior

在 site 子模块中工作时：

1. **内容优先**: 主要处理文档和营销内容
2. **Astro 模式**: 使用 Astro 的基于文件的路由和组件 islands
3. **静态生成**: 所有内容在构建时预渲染
4. **i18n 意识**: 内容支持多语言（英文/中文）
5. **SEO 重要**: 正确的 meta 标签和结构化数据
6. **设计系统**: 遵循 Glassmorphism + Tech Dark 风格

### Development Workflow
```bash
cd repos/site

# 安装依赖
npm install

# 启动开发服务器（默认端口 31264）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run typecheck

# 运行测试
npm run test
npm run test:ui

# 生成 OG 图片
npm run generate:image
npm run generate:product-images

# 更新活动指标
npm run update-metrics
```

### Environment Variables
```bash
# 开发服务器端口
PORT_WEBSITE=31264

# Microsoft Clarity
VITE_CLARITY_PROJECT_ID=your_project_id
VITE_CLARITY_DEBUG=false

# 51LA Analytics
LI_51LA_ID=L6b88a5yK4h2Xnci
LI_51LA_DEBUG=false

# CI 环境（启用链接验证）
CI=true
```

## Design System

Site 采用 **Glassmorphism + Tech Dark** 风格，详见 `design-system.md`：

### 视觉风格
- **主风格**: Glassmorphism（玻璃态）
- **特点**: 毛玻璃效果、透明度、背景模糊、分层
- **渐变**: 绿色系主渐变 (#22C55E → #25c2a0 → #06b6d4)

### 颜色系统
- **Primary**: #25c2a0（暗色）/ #2e8555（亮色）
- **Background**: #0a0a0a（暗色）/ #ffffff（亮色）
- **Surface**: rgba(23, 23, 23, 0.8) 玻璃态

### 字体系统
- **标题**: Space Grotesk
- **正文**: DM Sans
- **代码**: JetBrains Mono

### 间距系统
基于 8px 网格，使用 `--spacing-*` CSS 变量

## Specific Conventions

### Content Organization
- 营销页面在 `src/pages/` 目录
- 组件在 `src/components/` 按功能分组
- 静态资源在 `public/` 和 `static/` 目录
- 页面路由遵循文件结构

### Frontmatter Usage
所有内容文件使用 frontmatter 定义元数据：
```yaml
title: Page Title
description: Page description for SEO
lang: en
---
```

### Styling Conventions
- **不使用 TailwindCSS**: 使用原生 CSS 和 CSS 变量
- **组件样式**: 使用 Astro 的 scoped styles
- **全局样式**: 在 `src/styles/` 目录
- **设计系统**: 遵循 `design-system.md` 中的规范

### Component Patterns
- **React 组件**: 用于交互式功能（.tsx）
- **Astro 组件**: 用于静态内容（.astro）
- **Analytics**: 组件化分析脚本（Clarity.astro, 51LAAnalytics.astro）
- **动画**: 使用 Framer Motion

### i18n
- **英文内容**: 默认语言
- **中文内容**: 使用 `lang: zh-CN` frontmatter
- **分离文件**: 每种语言使用独立文件

## Page Sections

### Homepage Structure
首页采用以下区块结构（Hero + Features + CTA 模式）：

1. **HeroSection**: 主视觉区域
   - 全屏高度或最小 600px
   - 渐变背景 + 辉光效果
   - 大标题 + 描述 + 双 CTA

2. **ActivityMetricsSection**: 活动指标展示
   - 大号数字展示
   - 渐变进度条
   - 流畅计数动画

3. **FeaturesShowcase**: 特性展示
   - 3 列网格布局
   - 玻璃态卡片
   - 悬停提升效果

4. **VideoShowcase**: 视频演示
   - Bilibili 视频集成
   - 视频播放器组件

5. **InstallOptionsSection**: 安装选项
   - 多平台下载选项
   - CTA 按钮

### Desktop Pages
- 产品介绍和功能展示
- 下载选项（Windows/macOS/Linux）
- 功能图标和标签组件

## Disabled Capabilities

AI 助手不应建议：
- **后端代码**: 无服务器端逻辑或 API
- **数据库操作**: 无数据持久化
- **用户认证**: 无登录/认证功能
- **动态路由**: 所有路由都是静态的
- **服务端渲染**: 内容在构建时预渲染
- **API 路由**: 无后端端点
- **Orleans 模式**: 这是静态站点，不是分布式系统
- **TailwindCSS**: 此项目使用原生 CSS，不使用 TailwindCSS

## Optimization Features

### Performance
- **Partytown**: 第三方脚本卸载到 Web Worker
- **静态生成**: 所有内容预渲染
- **图片优化**: 使用 Sharp 进行图片处理
- **OG 图片生成**: 动态生成社交媒体分享图片

### SEO
- **Sitemap**: 自动生成 sitemap-index.xml
- **Robots.txt**: 自动生成 robots.txt
- **Meta 标签**: 使用 astro-seo 优化
- **结构化数据**: 正确的 HTML 结构

### Link Validation
- **开发环境**: 禁用外部链接检查
- **CI 环境**: 启用外部链接检查（10 秒超时）
- **独立工作流**: `.github/workflows/link-check.yml` 负责完整链接检查

## Recent Changes

根据最近的 git 提交记录：

- **博客发布**: 文章已发布到 docs/blog
- **链接修复**: 修复多个仓库中的断开链接
- **前端构建**: 调整新仓库结构的前端构建路径配置
- **依赖移除**: 移除 Anthropic SDK 依赖（media console）
- **前端组件分离**: 后端代码库前端组件分离
- **pnpm 迁移**: media console 已迁移到 pnpm

## Testing

### Unit Tests (Vitest)
```bash
npm run test          # 运行测试
npm run test:ui       # 测试 UI
npm run test:watch    # 监视模式
```

### E2E Tests (Playwright)
```bash
npx playwright test   # 运行 E2E 测试
```

## Deployment

### Build Configuration
- **Site URL**: https://hagicode.com
- **Base Path**: `/`（根路径部署）
- **Port**: 31264（可配置 `PORT_WEBSITE` 环境变量）

### Build Process
```bash
npm run build
```

构建步骤：
1. 复制版本索引（`copy-version-index.js`）
2. Astro 静态生成
3. 输出到 `dist/` 目录

## Scripts

### copy-version-index.js
复制版本索引文件到构建目录

### update-activity-metrics.js
更新活动指标数据（用于 ActivityMetricsSection）

### generate-image.sh
生成 OG 图片和产品图片
- 单张生成: `npm run generate:image`
- 批量生成: `npm run generate:product-images`
- 强制重新生成: `npm run regenerate:product-images`

## Troubleshooting

### 常见问题

1. **端口冲突**: 使用 `PORT_WEBSITE` 环境变量更改端口
2. **构建失败**: 检查 Node 版本（>=18.0）和 npm 版本（>=9.0）
3. **图片生成失败**: 确保 Sharp 依赖正确安装
4. **链接检查超时**: 本地开发禁用，CI 中启用

## References

- **Root AGENTS.md**: `/AGENTS.md` at monorepo root
- **Monorepo README**: `/README.md`
- **Design System**: `repos/site/design-system.md`
- **OpenSpec Workflow**: `/openspec/` at monorepo root
- **Repo Management**: `/REPO_MANAGEMENT.md`
- **Astro Docs**: https://docs.astro.build
- **Starlight Docs**: https://starlight.astro.build

## Package Manager

- **npm**: 11.10.1
- **Node**: >=18.0
- **TypeScript**: ~5.3.0

## Repository Information

- **Name**: hagicode-site
- **URL**: https://github.com/HagiCode-org/site.git
- **Type**: astro-marketing-site
- **Private**: true
