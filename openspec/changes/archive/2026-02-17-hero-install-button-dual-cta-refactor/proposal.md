# 提案：重构 Hero 安装按钮为双 CTA

## 状态
`待审核`

## 概述
将 apps/website 主页 Hero 部分的下拉式安装按钮重构为两个独立的 CTA（Call-to-Action）按钮，以解决 z-index 层叠上下文冲突问题并简化用户交互。

## 背景与问题

### 当前实现
Hero 部分使用 `InstallButton` 组件，该组件包含：
- 主下载按钮（直接下载适配用户系统的版本）
- 下拉切换按钮（展开面板显示所有平台选项）
- 下拉菜单面板（包含 Windows/macOS/Linux 下载选项 + Docker 容器链接）

### 核心问题
1. **Z-Index 冲突**：下拉面板的层叠索引无法正确设置，导致面板被其他元素遮挡或显示层级错误
2. **技术债务**：
   - `InstallButton.tsx` 包含复杂的状态管理（`isDropdownOpen`、`dropdownPosition`）
   - `InstallButton.module.css` 使用 `z-index: 999999` 等极端值仍未完全解决问题
   - `HeroSection.module.css` 中的 `heroButtons` 容器需要 `z-index: 100000`
3. **维护成本**：多次尝试修复未果，持续投入调试时间

## 解决方案

### 设计变更
采用**双 CTA 按钮方案**替代原有的下拉按钮设计：

| 原方案 | 新方案 |
|--------|--------|
| 单个下拉按钮，点击展开面板显示多个安装选项 | 两个独立按钮，直接导航至对应页面 |

### 具体实现

#### 按钮 1：桌面应用安装（主按钮）
- **文案**：「立即安装桌面应用」
- **行为**：点击后跳转到 `/desktop` 页面
- **样式**：主按钮样式（高亮渐变背景）
- **图标**：保留现有的下载图标

#### 按钮 2：容器应用安装（次按钮）
- **文案**：「立即安装容器应用」
- **行为**：点击后跳转到 `/container` 页面
- **样式**：次要按钮样式（玻璃态边框）
- **图标**：Docker 图标

### 组件变更

#### 修改文件
1. **`apps/website/src/components/home/HeroSection.tsx`**
   - 替换 `<InstallButton variant="full" />` 为两个独立按钮
   - 移除 `InstallButton` 导入

2. **`apps/website/src/components/home/InstallButton.tsx`**
   - 保留组件（用于 Header 导航栏的紧凑模式）
   - 添加 `showDropdown` 属性支持（`variant="full"` 时禁用下拉）

3. **`apps/website/src/components/home/HeroSection.module.css`**
   - 移除 `heroButtons` 的 `z-index: 100000`
   - 调整按钮间距以适应双按钮布局

#### 新增内容
- 两个独立的 `<a>` 标签按钮元素
- 直接使用 Astro 的 `withBasePath()` 生成导航链接

#### 移除内容
- Hero 区域的下拉面板展开/收起状态管理
- 下拉选项的渲染逻辑
- 相关的 z-index CSS 规则

## 影响分析

### 用户体验
- **简化交互**：用户无需点击展开即可看到所有选项
- **明确导航**：两个按钮的文案清晰表明目标，减少用户决策成本
- **响应式友好**：移除下拉面板后，移动端布局更简洁

### 技术优势
- **消除 Z-Index 问题**：完全移除下拉面板，不再存在层叠上下文冲突
- **代码简化**：减少 Hero 区域的状态管理逻辑和动画代码
- **维护性提升**：降低组件复杂度，便于后续维护

### 范围界定
| 影响页面 | 说明 |
|---------|------|
| `apps/website/src/pages/index.astro` | 主页 Hero 部分 |
| `apps/website/src/components/home/HeroSection.tsx` | Hero 组件主体 |
| `apps/website/src/components/home/InstallButton.tsx` | 保持不变（Header 仍需使用） |

### 导航目标
| 按钮 | 目标页面 |
|-----|---------|
| 桌面应用安装 | `/desktop` |
| 容器应用安装 | `/container` |

## 实施计划

详见 [tasks.md](./tasks.md)

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|-----|------|---------|
| 用户可能不熟悉双按钮设计 | 低 | 文案清晰说明目标，样式区分明确 |
| 移动端布局可能需要调整 | 低 | 使用现有的 `flex-wrap` 和 `gap` 属性 |
| Header 的 InstallButton 仍需下拉功能 | 无 | 仅修改 Hero 区域调用，Header 不受影响 |

## 成功标准
- [ ] Hero 区域显示两个独立按钮
- [ ] 点击按钮正确导航至目标页面
- [ ] 移除所有 Hero 区域相关的 z-index 覆盖规则
- [ ] 响应式布局在各断点正常显示
- [ ] 无控制台错误或警告

## 参考文档
- [HeroSection 组件](../../apps/website/src/components/home/HeroSection.tsx)
- [InstallButton 组件](../../apps/website/src/components/home/InstallButton.tsx)
- [HeroSection 样式](../../apps/website/src/components/home/HeroSection.module.css)
