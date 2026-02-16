# Implementation Tasks

## 1. 准备阶段

- [ ] 1.1 阅读并理解当前两个应用中的 Desktop 类型定义和工具函数
- [ ] 1.2 分析 `packages/shared/src/desktop.ts` 和 `desktop-utils.ts` 的现有实现
- [ ] 1.3 确定需要合并的类型和函数清单
- [ ] 1.4 规划版本管理器的接口设计

## 2. packages/shared 增强

- [ ] 2.1 更新 `packages/shared/src/types/desktop.ts`：合并两个应用的类型定义，添加渠道信息类型
- [ ] 2.2 更新 `packages/shared/src/utils/desktop.ts`：合并工具函数，添加版本比较和渠道管理函数
- [ ] 2.3 创建 `packages/shared/src/version-manager.ts`：实现版本数据管理器
  - [ ] 2.3.1 实现单例模式的 VersionManager 类
  - [ ] 2.3.2 添加版本数据缓存机制
  - [ ] 2.3.3 实现服务端数据注入接口（用于 SSR）
  - [ ] 2.3.4 实现客户端数据获取接口
- [ ] 2.4 创建 `packages/shared/src/desktop-context.tsx`：实现 React Context Provider（可选）
  - [ ] 2.4.1 定义 DesktopVersionContext
  - [ ] 2.4.2 创建 DesktopVersionProvider 组件
  - [ ] 2.4.3 实现 useDesktopVersion Hook
- [ ] 2.5 更新 `packages/shared/src/index.ts`：导出新的模块和类型

## 3. apps/docs 迁移

- [ ] 3.1 删除 `apps/docs/src/types/desktop.ts`
- [ ] 3.2 删除 `apps/docs/src/utils/desktop.ts`
- [ ] 3.3 更新 `apps/docs/src/components/InstallButton.tsx`
  - [ ] 3.3.1 修改导入路径，使用 `@shared/desktop` 和 `@shared/desktop-utils`
  - [ ] 3.3.2 添加内部状态管理，调用 VersionManager 获取版本数据
  - [ ] 3.3.3 保持 props 向后兼容（支持 initialVersion 等）
  - [ ] 3.3.4 移除客户端数据获取逻辑（使用 VersionManager）
- [ ] 3.4 更新 `apps/docs/src/pages/index.astro`：移除版本数据获取和传递逻辑
- [ ] 3.5 更新其他使用 Desktop 类型的页面：修改导入路径
- [ ] 3.6 验证 `apps/docs` 构建：确保 TypeScript 类型检查通过

## 4. apps/website 迁移

- [ ] 4.1 删除 `apps/website/src/types/desktop.ts`
- [ ] 4.2 删除 `apps/website/src/utils/desktop.ts`
- [ ] 4.3 更新 `apps/website/src/components/home/Navbar.tsx`
  - [ ] 4.3.1 修改导入路径，使用 `@shared/desktop` 和 `@shared/desktop-utils`
  - [ ] 4.3.2 移除 props 中的版本数据，使用 VersionManager
  - [ ] 4.3.3 添加内部状态管理，获取版本数据
- [ ] 4.4 更新 `apps/website/src/components/home/HeroSection.tsx`：同 Navbar
- [ ] 4.5 更新 `apps/website/src/pages/index.astro`：移除版本数据获取和传递
- [ ] 4.6 更新 `apps/website/src/pages/desktop/index.astro`
  - [ ] 4.6.1 移除版本数据获取逻辑
  - [ ] 4.6.2 使用 VersionManager 注入服务端数据
  - [ ] 4.6.3 更新客户端脚本使用共享 API
- [ ] 4.7 更新其他使用 Desktop 类型的组件：修改导入路径
- [ ] 4.8 验证 `apps/website` 构建：确保 TypeScript 类型检查通过

## 5. 集成测试

- [ ] 5.1 本地开发服务器测试：启动 `npm run dev` 验证两个站点
- [ ] 5.2 安装按钮功能测试：验证所有页面的安装按钮正常工作
- [ ] 5.3 版本切换测试（如果有渠道切换功能）：验证 stable/beta 切换
- [ ] 5.4 平台检测测试：验证自动检测用户系统的功能
- [ ] 5.5 生产构建测试：运行 `npm run build` 确保无错误

## 6. 文档和清理

- [ ] 6.1 更新组件使用文档：说明新的组件接口
- [ ] 6.2 添加代码注释：解释 VersionManager 的使用方式
- [ ] 6.3 清理未使用的导入和代码
- [ ] 6.4 运行 `openspec validate refactor-desktop-version-management --strict` 验证提案

## 7. 验收标准

- [ ] 7.1 两个应用构建成功，无 TypeScript 错误
- [ ] 7.2 所有安装按钮正常显示和工作
- [ ] 7.3 版本数据在组件间正确共享
- [ ] 7.4 代码重复消除，packages/shared 统一管理
- [ ] 7.5 向后兼容，现有功能不受影响
