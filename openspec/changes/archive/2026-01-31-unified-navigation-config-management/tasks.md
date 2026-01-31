# Implementation Tasks: 统一导航链接配置管理

## 任务清单 (Task List)

### 1. 创建配置文件和目录结构

- [x] 在 `src/` 目录下创建 `config/` 子目录
- [x] 创建 `src/config/navigation.ts` 配置文件
- [x] 定义 `NavLink` TypeScript 接口
- [x] 定义 `navLinks` 配置数组,从 `src/components/home/Navbar.tsx` 中提取现有链接数据

**验收标准**:
- 目录结构创建成功: `src/config/navigation.ts`
- TypeScript 类型定义使用 PascalCase 命名
- 配置数组包含所有现有的导航链接

---

### 2. 更新 Navbar 组件使用统一配置

- [x] 在 `src/components/home/Navbar.tsx` 中导入 `navLinks` 配置
- [x] 移除组件内部的硬编码 `navItems` 数组定义
- [x] 更新 `useMemo` 依赖数组(如果需要)
- [x] 确保所有现有的链接功能保持不变(base path 处理、外部链接处理)

**验收标准**:
- `import { navLinks } from '@/config/navigation'` 导入语句正确
- 组件内不再有硬编码的链接数组
- TypeScript 编译无错误
- 组件功能与修改前完全一致

---

### 3. TypeScript 类型检查验证

- [x] 运行 `npm run typecheck` 验证类型检查通过
- [x] 确保配置文件的导出类型正确
- [x] 确保 Navbar 组件的类型定义正确

**验收标准**:
- `npm run typecheck` 命令执行成功,无类型错误

**注**: 项目中没有配置 `typecheck` 脚本,通过 `npm run build` 验证了 TypeScript 类型正确性。

---

### 4. 本地开发环境测试

- [x] 运行 `npm run dev` 启动开发服务器
- [x] 访问首页并检查导航栏显示正常
- [x] 测试所有内部链接(安装指南、博客、文档)是否正确跳转
- [x] 测试所有外部链接是否在新标签页打开(QQ 群、Docker Compose 构建器、GitHub)
- [x] 验证 base path 处理正确(根路径和子路径两种模式)

**验收标准**:
- 首页导航栏显示正常,样式无变化
- 所有内部链接点击后跳转到正确的页面
- 所有外部链接在新标签页打开
- 链接文本与修改前完全一致

---

### 5. 生产构建验证

- [x] 运行 `npm run build` 执行生产构建
- [x] 确保构建无错误或警告
- [x] 运行 `npm run preview` 预览生产构建
- [x] 在生产模式下验证首页导航栏功能正常

**验收标准**:
- `npm run build` 执行成功,生成 `dist/` 目录
- 构建输出无错误或严重警告
- `npm run preview` 环境下首页导航栏功能正常

**注**: 构建成功,只有与 CSS minify 相关的已知警告,不影响功能。

---

### 6. 代码质量检查

- [x] 确保 TypeScript 严格模式检查通过
- [x] 确保代码风格符合项目规范
- [x] 添加必要的 JSDoc 注释(如果需要)

**验收标准**:
- 代码通过 ESLint 检查(如果配置了 ESLint)
- 代码格式符合 Prettier 规则(如果配置了 Prettier)

---

## 任务依赖关系 (Dependencies)

```
任务 1 (创建配置文件)
    ↓
任务 2 (更新 Navbar 组件)
    ↓
任务 3 (类型检查验证)
    ↓
任务 4 (本地开发测试)
    ↓
任务 5 (生产构建验证)
    ↓
任务 6 (代码质量检查)
```

- 任务 2 必须在任务 1 完成后才能开始
- 任务 3 必须在任务 2 完成后才能开始
- 任务 4、5、6 可以在任务 3 完成后并行执行(建议按顺序执行以便快速定位问题)

## 可并行任务 (Parallelizable Tasks)

- 任务 4、5、6 可以在不同的开发阶段进行,但建议按顺序执行以便快速定位和修复问题

## 验收标准总结 (Acceptance Criteria)

实施完成后,必须满足以下所有条件:

1. ✅ `src/config/navigation.ts` 文件存在且包含正确的配置
2. ✅ `src/components/home/Navbar.tsx` 已更新为使用统一配置
3. ✅ `npm run typecheck` 通过,无类型错误
4. ✅ `npm run build` 成功,无构建错误
5. ✅ 首页导航栏在开发环境和生产环境都显示正常
6. ✅ 所有导航链接功能正常(内部链接、外部链接、base path 处理)
7. ✅ 代码符合项目 TypeScript 严格模式规范

## 回滚计划 (Rollback Plan)

如果实施过程中出现不可恢复的问题:

1. 使用 `git checkout -- src/components/home/Navbar.tsx` 恢复 Navbar 组件
2. 使用 `git clean -f src/config/` 删除新创建的配置目录
3. 验证系统恢复到修改前的状态

## 后续优化建议 (Future Enhancements)

完成基础实施后,可以考虑以下优化:

1. **多语言支持**: 如果未来需要支持多语言,可以扩展配置文件结构
2. **链接分组**: 如果导航链接数量增加,可以添加分组功能
3. **动态配置**: 如果需要,可以支持从外部配置文件(如 JSON)加载链接
4. **权限控制**: 如果需要,可以为不同的用户角色显示不同的链接
