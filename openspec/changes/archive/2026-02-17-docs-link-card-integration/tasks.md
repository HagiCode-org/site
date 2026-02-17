## 1. Implementation

- [ ] 1.1 验证目标文档存在性
  - [ ] 检查 `apps/docs/src/content/docs/installation/desktop.mdx`
  - [ ] 检查 `apps/docs/src/content/docs/setup-openspec.mdx`
  - [ ] 检查 `apps/docs/src/content/docs/conversation-session.md`
  - [ ] 检查 `apps/docs/src/content/docs/related-software-installation/nodejs/installation.md`

- [ ] 1.2 更新 installation/desktop.mdx
  - [ ] 添加 `import { LinkCard, CardGrid } from '@astrojs/starlight/components';`
  - [ ] 将"后续步骤"部分的列表链接替换为 LinkCard 格式
  - [ ] 确认链接和描述文本与 product-overview.mdx 保持一致

- [ ] 1.3 更新 setup-openspec.mdx
  - [ ] 添加 `import { LinkCard, CardGrid } from '@astrojs/starlight/components';`
  - [ ] 将"下一步"部分的列表链接替换为 LinkCard 格式
  - [ ] 确认链接和描述文本准确

- [ ] 1.4 更新 conversation-session.md
  - [ ] 添加 `import { LinkCard, CardGrid } from '@astrojs/starlight/components';`
  - [ ] 将"后续步骤"部分的列表链接替换为 LinkCard 格式
  - [ ] 确认链接和描述文本准确

- [ ] 1.5 更新 related-software-installation/nodejs/installation.md
  - [ ] 添加 `import { LinkCard, CardGrid } from '@astrojs/starlight/components';`
  - [ ] 将"下一步"部分的列表链接替换为 LinkCard 格式
  - [ ] 确认链接和描述文本准确

## 2. Testing

- [ ] 2.1 本地构建验证
  - [ ] 运行 `npm run build:docs` 确保构建成功
  - [ ] 检查构建输出无错误或警告

- [ ] 2.2 本地开发验证
  - [ ] 运行 `npm run dev:docs` 启动开发服务器
  - [ ] 逐个访问修改的文档页面
  - [ ] 验证 LinkCard 组件正确渲染

- [ ] 2.3 链接功能验证
  - [ ] 测试所有 LinkCard 的链接跳转
  - [ ] 验证悬停效果正常工作
  - [ ] 确认卡片样式与 product-overview.mdx 一致

- [ ] 2.4 跨浏览器测试（可选）
  - [ ] 在 Chrome 中验证显示效果
  - [ ] 在 Firefox 中验证显示效果
  - [ ] 在 Safari 中验证显示效果（如可用）

## 3. Finalization

- [ ] 3.1 代码审查准备
  - [ ] 检查所有修改的文件
  - [ ] 确保代码格式一致
  - [ ] 验证无未使用的导入

- [ ] 3.2 更新任务清单
  - [ ] 将所有已完成的任务标记为 [x]
  - [ ] 确保所有验证标准已满足
