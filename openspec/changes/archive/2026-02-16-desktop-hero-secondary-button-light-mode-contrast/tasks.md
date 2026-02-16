## 1. 实施前准备

- [ ] 1.1 阅读并理解 `proposal.md` 中的变更描述和影响范围
- [ ] 1.2 确认当前亮色模式下的对比度问题（可选：使用浏览器开发工具对比度检查器）
- [ ] 1.3 备份当前 `DesktopHero.module.css` 文件（可选，Git 已有版本控制）

## 2. CSS 样式实现

- [ ] 2.1 在 `DesktopHero.module.css` 中添加亮色模式次要按钮主下载按钮样式
  - 在文件末尾（约第 1102 行后）添加以下样式规则：
  ```css
  /* 亮色模式下的次要按钮主下载按钮 */
  :root .platformButtonSecondary .btnDownloadMain {
    background: rgba(15, 23, 42, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.15);
    color: #0F172A;
  }

  :root .platformButtonSecondary .btnDownloadMain:hover {
    background: rgba(0, 128, 255, 0.1);
    border-color: rgba(0, 128, 255, 0.3);
    color: #0060CC;
  }
  ```

- [ ] 2.2 在 `DesktopHero.module.css` 中添加亮色模式次要按钮下拉切换按钮样式
  - 在上述样式后继续添加：
  ```css
  /* 亮色模式下的次要下拉切换按钮 */
  :root .platformButtonSecondary .btnDropdownToggle {
    background: rgba(15, 23, 42, 0.06);
    border-left-color: rgba(0, 0, 0, 0.12);
    color: #0F172A;
  }

  :root .platformButtonSecondary .btnDropdownToggle:hover {
    background: rgba(0, 128, 255, 0.08);
    border-left-color: rgba(0, 128, 255, 0.3);
    color: #0060CC;
  }
  ```

- [ ] 2.3 确保新增样式位于现有暗色模式样式之后（保持选择器优先级）

## 3. 本地验证测试

- [ ] 3.1 启动本地开发服务器
  ```bash
  cd apps/website && npm run dev
  ```

- [ ] 3.2 访问 Desktop 页面（通常为 `/desktop` 路径）

- [ ] 3.3 切换到亮色模式
  - 使用主题切换器选择亮色主题
  - 或检查 `<html>` 元素的 `data-theme` 属性为 `light` 或不存在

- [ ] 3.4 验证次要按钮显示效果
  - 确认次要按钮（非用户平台）文字清晰可读
  - 确认背景为深色半透明，文字为深色
  - 确认边框可见

- [ ] 3.5 测试悬停状态
  - 将鼠标悬停在次要按钮上
  - 确认背景变为品牌色半透明
  - 确认边框高亮显示
  - 确认文字颜色变为品牌深色

- [ ] 3.6 测试下拉切换按钮
  - 确认下拉箭头图标颜色为深色
  - 确认背景与主按钮一致
  - 测试悬停状态样式

## 4. 主题兼容性验证

- [ ] 4.1 切换到暗色模式
  - 确认次要按钮恢复为白色背景和白色文字
  - 确认样式与修改前保持一致

- [ ] 4.2 切换到农历新年主题
  - 确认次要按钮使用新年主题样式
  - 确认样式与修改前保持一致

- [ ] 4.3 验证主要按钮
  - 确认主要按钮（用户平台）在所有主题下样式不变
  - 确认渐变背景正常显示

## 5. 可访问性测试

- [ ] 5.1 使用浏览器开发工具检查对比度
  - Chrome DevTools: Elements > Styles > Color Picker > Contrast ratio
  - 确认文字与背景对比度 ≥ 4.5:1 (WCAG AA)
  - 目标对比度 ≥ 7:1 (WCAG AAA)

- [ ] 5.2 使用键盘导航测试
  - 使用 Tab 键聚焦次要按钮
  - 确认焦点指示器清晰可见
  - 确认可以使用 Enter 键触发下载

- [ ] 5.3 使用屏幕阅读器测试（可选）
  - 确认次要按钮标签正确读取
  - 确认平台名称和下载功能正确播报

## 6. 响应式验证

- [ ] 6.1 测试桌面端显示（> 768px）
  - 确认三个平台按钮横向排列
  - 确认次要按钮样式正确应用

- [ ] 6.2 测试平板端显示（481px - 768px）
  - 确认按钮间距适配
  - 确认次要按钮样式正确应用

- [ ] 6.3 测试移动端显示（≤ 480px）
  - 确认按钮垂直堆叠
  - 确认次要按钮样式正确应用
  - 确认触摸目标尺寸 ≥ 44x44px

## 7. 跨浏览器验证

- [ ] 7.1 在 Chrome/Edge 中测试
  - 确认样式正确渲染
  - 确认过渡动画流畅

- [ ] 7.2 在 Firefox 中测试
  - 确认样式正确渲染
  - 确认无兼容性问题

- [ ] 7.3 在 Safari 中测试（可选）
  - 确认样式正确渲染
  - 确认 `-webkit-` 前缀的 backdrop-filter 正常工作

## 8. 代码审查与提交

- [ ] 8.1 运行代码检查工具
  ```bash
  cd apps/website && npm run lint
  ```
  - 确认无新增 lint 错误

- [ ] 8.2 运行格式化工具
  ```bash
  cd apps/website && npm run format
  ```

- [ ] 8.3 提交代码变更
  ```bash
  git add apps/website/src/components/desktop/DesktopHero.module.css
  git commit -m "fix: 修复 Desktop Hero 次要按钮亮色模式对比度问题"
  ```

## 9. 完成确认

- [ ] 9.1 确认所有测试通过
- [ ] 9.2 确认亮色模式对比度问题已解决
- [ ] 9.3 确认其他主题样式未受影响
- [ ] 9.4 更新 `tasks.md` 所有任务为已完成状态

## 注意事项

1. **CSS 选择器优先级**: 使用 `:root` 选择器确保亮色模式样式在无 `data-theme` 属性时生效
2. **样式位置**: 新增样式应放在现有暗色模式样式之后，确保优先级正确
3. **颜色值**: 使用提案中指定的颜色值，确保对比度达标
4. **测试覆盖**: 在提交前完成所有主题和响应式测试
5. **回归测试**: 确保主要按钮和其他组件样式不受影响
