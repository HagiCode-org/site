# 实施任务清单

## 任务列表

### 阶段 1: 创建视频展示组件

- [x] **1.1 创建 VideoShowcase 组件文件**
  - 文件路径: `src/components/home/VideoShowcase.tsx`
  - 定义 TypeScript Props 接口(标题、描述、视频 ID)
  - 集成 `BilibiliVideo` 组件
  - 添加容器结构和样式类

- [x] **1.2 创建 VideoShowcase 样式文件**
  - 文件路径: `src/components/home/VideoShowcase.module.css`
  - 定义容器、标题、描述、视频包装器样式
  - 遵循项目设计系统(HUD/Sci-Fi FUI + Glassmorphism)
  - 添加响应式断点(移动端适配)

- [x] **1.3 实现组件逻辑**
  - 使用 Framer Motion 添加进入动画
  - 添加标题和描述文案
  - 配置视频参数(Bilibili BV ID: `BV1pirZBuEzq`)
  - 视频标题: "每天哈基半小时,AI多任务编程实战"

### 阶段 2: 集成到首页

- [x] **2.1 更新首页导入**
  - 在 `src/pages/index.astro` 中导入 `VideoShowcase` 组件
  - 确保导入路径正确(`@/components/home/VideoShowcase`)

- [x] **2.2 插入视频区块**
  - 在 `<main>` 中适当位置插入 `<VideoShowcase>` 组件
  - 建议位置: ShowcaseSection 之后,QuickStartSection 之前
  - 使用 `client:visible` 指令优化加载性能
  - 传入视频 ID: `BV1pirZBuEzq`
  - 设置标题: "每天哈基半小时,AI多任务编程实战"

- [x] **2.3 调整区块顺序**
  - 确保区块加载优先级合理:
    1. HeroSection (client:load)
    2. ActivityMetricsSection (client:visible)
    3. FeaturesShowcase (client:visible)
    4. ShowcaseSection (client:idle)
    5. **VideoShowcase (client:visible)** ← 新增
    6. QuickStartSection (client:idle)

### 阶段 3: 样式适配

- [x] **3.1 添加全局样式变量**(如需要)
  - 在 `src/styles/homepage.css` 中添加视频区块特定变量
  - 确保与现有设计系统一致

- [x] **3.2 响应式布局测试**
  - 测试移动端(< 768px)显示效果
  - 测试平板端(768px - 1024px)显示效果
  - 测试桌面端(> 1024px)显示效果

- [x] **3.3 深色主题适配**
  - 验证深色模式下视频区块样式正确
  - 确保与 Starlight 主题切换兼容

### 阶段 4: 类型检查与验证

- [x] **4.1 TypeScript 类型检查**
  - 运行 `npm run typecheck` 确保无类型错误
  - 修复所有类型警告

- [x] **4.2 本地开发测试**
  - 运行 `npm run dev` 启动开发服务器
  - 检查首页视频区块显示正常
  - 测试视频播放功能
  - 验证响应式布局

- [x] **4.3 生产构建验证**
  - 运行 `npm run build` 执行生产构建
  - 确保构建成功无错误
  - 检查输出文件大小
  - 运行 `npm run preview` 预览构建结果

- [x] **4.4 浏览器兼容性测试**
  - 测试主流浏览器(Chrome、Firefox、Safari、Edge)
  - 验证 Bilibili iframe 加载正常
  - 检查视频播放功能

### 阶段 5: 文档与收尾

- [x] **5.1 更新组件文档**(可选)
  - 如有需要,在组件文件顶部添加 JSDoc 注释
  - 说明 Props 接口和使用示例

- [x] **5.2 代码审查准备**
  - 确保代码符合项目规范(PascalCase、TypeScript 严格模式)
  - 检查无 console.log 或调试代码
  - 验证所有导入路径正确

- [x] **5.3 提交变更**
  - 运行 `git status` 查看变更文件
  - 提交变更到功能分支
  - 创建 Pull Request

## 依赖关系

- **阶段 1** 必须最先完成(创建基础组件)
- **阶段 2** 依赖阶段 1(需要组件才能集成)
- **阶段 3** 可与阶段 2 并行(样式适配)
- **阶段 4** 依赖阶段 1-3(需要完整实现才能验证)
- **阶段 5** 依赖阶段 4(验证通过后才能收尾)

## 并行化机会

- 任务 1.2 和 1.3 可部分并行(样式定义与逻辑实现)
- 任务 3.1、3.2、3.3 可与任务 2.x 并行(样式与集成独立)

## 验收标准

所有任务完成的标准:
1. ✅ 首页包含视频展示区块
2. ✅ 视频能正常播放(Bilibili 嵌入工作正常)
3. ✅ 响应式布局在所有断点正常显示
4. ✅ TypeScript 类型检查通过
5. ✅ 生产构建成功
6. ✅ 深色/浅色主题切换正常
7. ✅ 无控制台错误或警告
