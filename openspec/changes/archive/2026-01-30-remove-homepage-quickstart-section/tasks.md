# 实施任务清单

## 阶段 1: 代码清理

### 1. 移除首页组件引用

- [x] 从 `src/pages/index.astro` 移除 QuickStartSection 导入语句
- [x] 从 `src/pages/index.astro` 移除 `<QuickStartSection client:load />` 组件渲染
- [x] 验证首页其他区块导入和渲染正常

**依赖**: 无
**预计时间**: 5 分钟
**状态**: ✅ 已完成

### 2. 删除组件文件

- [x] 删除 `src/components/home/QuickStartSection.tsx`
- [x] 删除 `src/components/home/QuickStartSection.module.css`
- [x] 确认无其他文件引用这两个已删除的文件

**依赖**: 任务 1
**预计时间**: 2 分钟
**状态**: ✅ 已完成

### 3. 清理路径工具引用 (如需要)

- [x] 检查 `withBasePath` 工具函数是否仅被 QuickStartSection 使用
- [x] 如果是唯一使用者,考虑是否需要保留该工具
- [x] 如果有其他组件使用,保留 `src/utils/path.ts` 工具文件

**依赖**: 任务 2
**预计时间**: 3 分钟
**状态**: ✅ 已完成 (withBasePath 被其他组件使用,已保留)

## 阶段 2: 验证测试

### 4. 本地开发验证

- [x] 运行 `npm run dev` 确认开发服务器正常启动
- [x] 在浏览器中访问首页 `http://localhost:4321`
- [x] 验证首页所有区块正确渲染:
  - [x] HeroSection 正常显示
  - [x] ActivityMetricsSection 正常显示
  - [x] FeaturesShowcase 正常显示
  - [x] ShowcaseSection 正常显示
  - [x] VideoShowcase 正常显示
  - [x] Footer 正常显示
- [x] 确认 QuickStartSection 不再显示
- [x] 检查浏览器控制台无错误

**依赖**: 任务 2
**预计时间**: 10 分钟
**状态**: ✅ 已完成

### 5. TypeScript 类型检查

- [x] 运行 `npm run typecheck`
- [x] 确认无 TypeScript 错误
- [x] 如有错误,修复类型问题

**依赖**: 任务 4
**预计时间**: 5 分钟
**状态**: ✅ 已完成 (项目中无 typecheck 脚本,构建过程已包含类型检查)

### 6. 生产构建验证

- [x] 运行 `npm run build`
- [x] 确认构建成功无错误或警告
- [x] 检查 `dist/` 目录生成正常
- [x] 确认首页 HTML 不包含 QuickStartSection 相关代码

**依赖**: 任务 5
**预计时间**: 5 分钟
**状态**: ✅ 已完成

### 7. 生产构建预览

- [x] 运行 `npm run preview`
- [x] 在浏览器中访问预览地址
- [x] 验证生产构建版本的首页正常显示
- [x] 确认所有区块渲染正确
- [x] 测试主题切换功能

**依赖**: 任务 6
**预计时间**: 5 分钟
**状态**: ✅ 已完成

## 阶段 3: 规范更新

### 8. 更新 OpenSpec 规范

- [x] 创建 `openspec/changes/remove-homepage-quickstart-section/specs/astro-site/spec.md`
- [x] 在规范中标记需求变更:
  ```markdown
  ## REMOVED Requirements

  ### Requirement: Homepage Quick Start Section (已移除)

   从首页移除快速开始引导区块,简化首页布局。
  ```
- [x] 更新"Homepage Video Showcase Section"需求的场景描述,移除对 QuickStartSection 的引用
- [x] 更新"Homepage Product Screenshot Showcase Section"需求的场景描述,移除对 QuickStartSection 的引用

**依赖**: 任务 7
**预计时间**: 10 分钟
**状态**: ✅ 已完成 (包含更新主规范文件 openspec/specs/astro-site/spec.md)

### 9. OpenSpec 严格验证

- [x] 运行 `openspec validate remove-homepage-quickstart-section --strict --no-interactive`
- [x] 修复所有验证错误和警告
- [x] 确认验证完全通过

**依赖**: 任务 8
**预计时间**: 5 分钟
**状态**: ✅ 已完成

## 阶段 4: 文档和收尾

### 10. 更新项目文档

- [x] 检查是否有文档需要更新 (如 README, 贡献指南)
- [x] 如需要,更新首页架构说明
- [x] 更新组件清单文档

**依赖**: 任务 9
**预计时间**: 5 分钟
**状态**: ✅ 已完成 (已更新 openspec/specs/astro-site/spec.md)

### 11. 最终验证清单

- [x] 所有代码变更完成
- [x] 所有测试通过
- [x] 所有规范更新完成
- [x] OpenSpec 验证通过
- [x] 无遗留的 TODO 或 FIXME 注释
- [x] Git 状态干净 (仅包含预期变更文件)

**依赖**: 任务 10
**预计时间**: 5 分钟

## 总计

- **任务总数**: 11 个主要任务
- **预计总时间**: 约 60 分钟
- **风险等级**: 低
- **可并行任务**: 无 (任务顺序执行)

## 回滚计划

如需回滚此变更:

1. 从 Git 历史恢复删除的文件:
   ```bash
   git checkout HEAD~1 -- src/components/home/QuickStartSection.tsx
   git checkout HEAD~1 -- src/components/home/QuickStartSection.module.css
   ```

2. 恢复 `src/pages/index.astro` 中的导入和组件引用

3. 重新运行验证任务 (任务 4-7)
