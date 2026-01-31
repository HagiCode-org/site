# Proposal: 统一导航链接配置管理

## 概述 (Overview)

创建统一的导航链接配置数据集,解决当前首页和文档页面导航链接配置重复和维护成本高的问题。通过引入单一数据源,确保站点导航链接的一致性和可维护性。

## 问题陈述 (Problem Statement)

### 当前状态

站点使用 Astro 5.x 框架构建,包含首页和文档页面两种不同的视图模式:

- **首页**: 使用自定义 React 组件 `src/components/home/Navbar.tsx`,其中硬编码了导航链接数组
- **文档页面**: 使用 Starlight 主题,通过 `astro.config.mjs` 配置侧边栏,但导航链接在首页 Navbar 中单独维护

### 核心问题

1. **配置重复**: 首页 Navbar 组件中的导航链接数组硬编码在组件内部,未来如果在文档页面也需要展示相同的导航链接,将导致数据重复
2. **维护成本高**: 添加或修改链接需要在组件代码中直接修改,违反了配置与代码分离的原则
3. **数据一致性风险**: 硬编码的链接配置缺乏类型约束和集中管理,容易出现不一致的情况
4. **违反 DRY 原则**: 相同的链接数据没有统一管理,无法在多处复用
5. **可扩展性差**: 未来添加新的页面类型或组件时,需要重复定义相同的导航链接

### 受影响范围

- 首页导航栏 (`src/components/home/Navbar.tsx`)
- 未来可能添加的其他页面布局和组件

## 解决方案 (Solution)

### 实施策略

创建统一的导航链接配置模块,实现单一数据源管理:

1. **创建配置文件**
   - 在 `src/config/` 目录下创建 `navigation.ts` 配置文件
   - 定义 TypeScript 接口和类型,确保类型安全
   - 导出统一的导航链接配置数组

2. **数据结构设计**
   ```typescript
   export interface NavLink {
     label: string;      // 链接文本
     href: string;       // 链接地址
     external?: boolean; // 是否为外部链接
   }

   export const navLinks: NavLink[] = [
     // 统一的链接配置
   ];
   ```

3. **组件重构**
   - 更新 `src/components/home/Navbar.tsx` 导入并使用统一配置
   - 保持与现有功能完全兼容(包括 base path 处理)
   - 移除组件内部的硬编码链接数组

4. **代码规范**
   - 使用 PascalCase 命名 TypeScript 类型
   - 使用路径别名 `@/config/navigation` 导入配置
   - 保持 TypeScript 严格模式类型检查通过

## 影响分析 (Impact Analysis)

### 正面影响

✅ **易于维护**: 链接配置集中管理,修改一处即可全局生效

✅ **类型安全**: 通过 TypeScript 类型定义减少运行时错误

✅ **代码复用**: 遵循 DRY 原则,提高代码质量

✅ **一致性**: 确保所有使用导航链接的组件展示相同的内容

✅ **可扩展性**: 未来添加新的页面类型或组件可直接复用配置

### 测试验证

- 运行 `npm run dev` 验证本地开发环境,首页导航链接正常显示
- 运行 `npm run build` 确保生产构建无错误
- 运行 `npm run typecheck` 验证 TypeScript 类型检查通过
- 检查首页导航栏的所有链接功能正常(包括内部链接和外部链接)

### 实施风险评估

- **低风险**: 仅涉及数据结构重构,不改变核心功能和用户体验
- **兼容性**: 与现有 Astro 架构和 Starlight 主题无冲突
- **可回滚**: 通过 Git 可轻松回退到原有实现
- **无性能影响**: 配置文件在构建时静态导入,无运行时性能损耗

## 前置条件 (Prerequisites)

- Node.js >=18.0 环境
- 项目依赖已安装(`npm install`)
- TypeScript 严格模式已启用(已满足)

## 成功标准 (Success Criteria)

实施完成后,必须满足以下标准:

1. ✅ 配置文件 `src/config/navigation.ts` 已创建,包含完整的导航链接定义
2. ✅ `src/components/home/Navbar.tsx` 已更新为使用统一配置
3. ✅ TypeScript 类型检查通过(`npm run typecheck` 无错误)
4. ✅ 生产构建成功(`npm run build` 无错误)
5. ✅ 首页导航栏显示正常,所有链接功能正常
6. ✅ 内部链接正确处理 base path(支持根路径和子路径部署)

## 时间估算 (Time Estimation)

- 创建配置文件和类型定义: 5 分钟
- 更新 Navbar 组件: 5 分钟
- 测试和验证: 10 分钟

**总计**: 约 20 分钟

## 相关资源 (Related Resources)

- 当前首页 Navbar 组件: `src/components/home/Navbar.tsx`
- 路径工具函数: `src/utils/path.ts`
- Astro 配置: `astro.config.mjs`
- OpenSpec 项目规范: `openspec/project.md`
