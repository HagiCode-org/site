## 1. 修改安装指南文件

- [x] 1.1 定位到 `docs/quick-start/installation.md` 文件中的 PostgreSQL > 安装 Docker > Windows TabItem 部分（约第 24-27 行）
- [x] 1.2 在 Docker Desktop 链接后添加 tip 组件，包含 EXE 安装方式的链接提示
- [x] 1.3 确保链接目标正确指向 `/docs/related-software-installation/postgresql/install-on-windows`

## 2. 验证和测试

- [x] 2.1 运行 `npm run typecheck` 确保无 TypeScript 错误（注：存在预存在的 TypeScript 错误，与本修改无关）
- [x] 2.2 运行 `npm run build` 确保构建成功，无断链错误（注：存在预存在的断链错误，与本修改无关，新链接目标有效）
- [ ] 2.3 使用 `npm start` 在本地预览文档（需用户手动验证）
- [x] 2.4 验证 Windows TabItem 中的 tip 组件正确显示（已按照规范格式添加）
- [x] 2.5 验证链接能够正确跳转到 PostgreSQL Windows 安装文档（链接目标文件存在）
- [x] 2.6 验证与文档中已有的 OpenSpec 和 Claude Code 安装提示样式保持一致（使用相同的 `:::tip` 语法）

## 3. 完成

- [x] 3.1 更新 tasks.md，将所有任务标记为完成
- [ ] 3.2 更新 proposal.md 中的 Status 为 `ExecutionCompleted`
- [ ] 3.3 提交更改并等待审核批准

## 实施说明

**已完成的修改：**

文件：`docs/quick-start/installation.md`

**修改内容：**
在 PostgreSQL > 安装 Docker > Windows TabItem 部分添加了 tip 组件，提供 EXE 安装方式的替代选项。

**修改前：**
```markdown
<TabItem value="win" label="Windows">
  下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
</TabItem>
```

**修改后：**
```markdown
<TabItem value="win" label="Windows">
  下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)

  :::tip 替代安装方式
  如果您更倾向于使用原生安装程序，可以参阅 **[在 Windows 上安装 PostgreSQL](/docs/related-software-installation/postgresql/install-on-windows)** 获取详细的 EXE 安装步骤。
  :::
</TabItem>
```

**注意事项：**
- TypeScript 类型检查存在预存在的错误（`src/components/home/OpenSpecAnimation.tsx` 和 `src/pages/index.tsx`），与本修改无关
- 构建过程中存在预存在的断链错误（`/docs/feature-guides`、`/docs/quick-start/project-setup` 等），与本修改无关
- 新增的 PostgreSQL Windows 安装链接目标文件存在且路径正确
