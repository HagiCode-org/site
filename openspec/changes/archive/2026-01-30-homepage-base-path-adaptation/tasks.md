# 实施任务清单

## 任务概览

- **总任务数**: 5
- **预估完成时间**: 1-2 小时
- **风险等级**: 低

---

## 任务列表

### 1. 修改 ShowcaseSection 组件适配 base 路径

**优先级**: 高
**预估时间**: 15 分钟
**依赖**: 无

**实施步骤**:

1. 在 `src/components/home/ShowcaseSection.tsx` 顶部导入 `withBasePath`:
   ```typescript
   import { withBasePath } from '../../utils/path';
   ```

2. 修改 `screenshots` 数组中所有图片的 `src` 属性,使用 `withBasePath()` 包装:
   ```typescript
   const screenshots: ScreenshotItem[] = [
     {
       src: withBasePath('/img/home/亮色主题主界面.png'),
       title: '亮色主题主界面',
       // ...
     },
     {
       src: withBasePath('/img/home/暗色主题主界面.png'),
       // ...
     },
     // ... 修改其余 4 个图片路径
   ];
   ```

3. 验证修改:
   - 保存文件,确保无 TypeScript 错误
   - 检查所有 6 张图片路径都已使用 `withBasePath()`

**验证标准**:
- [x] 文件顶部已添加 `import { withBasePath } from '../../utils/path'`
- [x] 所有 6 个 `screenshots` 项的 `src` 属性都使用 `withBasePath()` 包装
- [x] 无 TypeScript 类型错误

---

### 2. 修改 ActivityMetricsSection 组件适配 base 路径

**优先级**: 高
**预估时间**: 15 分钟
**依赖**: 无

**实施步骤**:

1. 在 `src/components/home/ActivityMetricsSection.tsx` 顶部导入 `withBasePath`:
   ```typescript
   import { withBasePath } from '../../utils/path';
   ```

2. 修改 `useEffect` 中的 fetch URL (第 225 行):
   ```typescript
   // 修改前:
   fetch('/activity-metrics.json')

   // 修改后:
   fetch(withBasePath('/activity-metrics.json'))
   ```

3. 验证修改:
   - 保存文件,确保无 TypeScript 错误
   - 确认 fetch 调用使用 `withBasePath()` 构建URL

**验证标准**:
- [x] 文件顶部已添加 `import { withBasePath } from '../../utils/path'`
- [x] fetch 调用使用 `withBasePath('/activity-metrics.json')`
- [x] 无 TypeScript 类型错误

---

### 3. 验证根路径部署场景

**优先级**: 中
**预估时间**: 10 分钟
**依赖**: 任务 1, 2

**实施步骤**:

1. 启动根路径开发服务器:
   ```bash
   npm run dev:root
   ```

2. 在浏览器中访问 `http://localhost:4321/`

3. 验证图片加载:
   - 滚动到 ShowcaseSection 组件区域
   - 确认所有 6 张产品截图正常显示
   - 检查浏览器控制台无图片加载 404 错误

4. 验证 metrics 数据加载:
   - 查看 ActivityMetricsSection 组件区域
   - 确认 Docker Hub 拉取量、活跃用户、活跃会话数据正常显示
   - 检查网络标签页,确认 `/activity-metrics.json` 请求成功 (200)

**验证标准**:
- [x] 所有 6 张图片正常显示
- [x] metrics 数据正常加载并显示
- [x] 浏览器控制台无 404 错误
- [x] 网络请求成功 (HTTP 200)

---

### 4. 验证子路径部署场景

**优先级**: 中
**预估时间**: 10 分钟
**依赖**: 任务 1, 2, 3

**实施步骤**:

1. 启动子路径开发服务器:
   ```bash
   npm run dev:site
   ```

2. 在浏览器中访问 `http://localhost:4321/site/`

3. 验证图片加载:
   - 滚动到 ShowcaseSection 组件区域
   - 确认所有 6 张产品截图正常显示
   - 检查浏览器控制台无图片加载 404 错误
   - 验证图片 URL 为 `/site/img/home/*.png` (包含 base 路径前缀)

4. 验证 metrics 数据加载:
   - 查看 ActivityMetricsSection 组件区域
   - 确认 metrics 数据正常显示
   - 检查网络标签页,确认 `/site/activity-metrics.json` 请求成功 (200)
   - 验证请求 URL 包含 `/site` 前缀

**验证标准**:
- [x] 所有 6 张图片正常显示
- [x] metrics 数据正常加载并显示
- [x] 浏览器控制台无 404 错误
- [x] 网络请求成功 (HTTP 200)
- [x] 所有资源 URL 包含 `/site` 前缀

---

### 5. 生产构建验证和回归测试

**优先级**: 中
**预估时间**: 15 分钟
**依赖**: 任务 3, 4

**实施步骤**:

1. 根路径构建测试:
   ```bash
   npm run build
   npm run preview
   ```
   - 访问 `http://localhost:4321/`
   - 验证图片和 metrics 数据加载正常

2. 子路径构建测试:
   ```bash
   npm run build:site
   npm run preview
   ```
   - 访问 `http://localhost:4321/site/`
   - 验证图片和 metrics 数据加载正常

3. 回归测试:
   - 验证 HeroSection 导航链接仍然正常工作
   - 验证其他首页组件功能不受影响
   - 验证主题切换功能正常
   - 验证响应式布局在不同屏幕尺寸下正常

**验证标准**:
- [x] 根路径构建后功能正常
- [x] 子路径构建后功能正常
- [x] 其他首页组件功能无回归
- [x] 两种部署模式体验一致

---

## 可选任务

### 添加单元测试 (可选)

**优先级**: 低
**预估时间**: 1-2 小时
**依赖**: 任务 1, 2

为 `withBasePath` 工具函数添加单元测试,覆盖以下场景:
- 根路径 (`/`) 处理
- 子路径 (`/site`) 处理
- 外部 URL 透传
- 已包含 base 路径的输入处理

**注意**: 此任务为可选项,当前改动风险较低,可通过手动测试充分验证。

---

## 完成标准

所有核心任务 (任务 1-5) 完成后:

- [x] ShowcaseSection 和 ActivityMetricsSection 组件已使用 `withBasePath()` 工具函数
- [x] 根路径部署场景测试通过
- [x] 子路径部署场景测试通过
- [x] 生产构建验证通过
- [x] 无回归问题
- [x] 代码符合项目现有规范 (参考 HeroSection.tsx)

---

## 注意事项

1. **不要修改** `src/utils/path.ts` - 现有实现已满足需求
2. **保持** 现有的错误处理逻辑不变
3. **确保** 导入路径正确: `'../../utils/path'` (从 `src/components/home/` 访问 `src/utils/`)
4. **测试时** 注意清理浏览器缓存,避免缓存导致 404 误判
5. **检查** 浏览器开发者工具的 Network 标签页,确认请求 URL 正确

---

## 回滚计划

如果发现严重问题,回滚步骤:

1. 恢复 `ShowcaseSection.tsx` 中的图片路径为硬编码 `/img/home/*.png`
2. 恢复 `ActivityMetricsSection.tsx` 中的 fetch URL 为 `/activity-metrics.json`
3. 移除添加的 `import { withBasePath } from '../../utils/path'` 导入

**注意**: 此回滚方案仅作为应急措施,修复后的代码向后兼容,不应影响根路径部署。
