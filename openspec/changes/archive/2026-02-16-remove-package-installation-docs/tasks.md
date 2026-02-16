# 实施任务清单

## 阶段 1: 内容分析与验证

### 1.1 分析图片依赖
**目的**: 确定哪些图片是软件包安装专用的

- [ ] 搜索 `package-deployment.md` 中引用的所有图片
- [ ] 使用 `grep` 搜索其他文档中对这些图片的引用
- [ ] 列出仅被 `package-deployment.md` 使用的图片文件

**命令参考**:
```bash
grep -o '!\[.*\](/img/[^)]*)' apps/docs/src/content/docs/installation/package-deployment.md
grep -r "install-package" apps/docs/src/content/docs --include="*.md"
```

### 1.2 验证链接引用
**目的**: 找出所有指向 package-deployment 的内部链接

- [ ] 搜索整个项目中 `/installation/package-deployment` 的引用
- [ ] 记录需要更新的文件位置

**命令参考**:
```bash
grep -r "package-deployment" apps/docs/src --include="*.md" --include="*.ts" --include="*.astro"
```

---

## 阶段 2: 文档删除与更新

### 2.1 删除主文档文件
**目的**: 移除软件包安装指南

- [ ] 删除 `apps/docs/src/content/docs/installation/package-deployment.md`

**命令参考**:
```bash
rm apps/docs/src/content/docs/installation/package-deployment.md
```

### 2.2 更新内部链接引用
**目的**: 将废弃的软件包部署链接更新为指向 Desktop 安装页面

- [ ] 编辑 `apps/docs/src/content/docs/installation/docker-compose.md`
- [ ] 定位第 239 行的软件包部署链接
- [ ] 将链接从 `/installation/package-deployment` 更新为 `/installation/desktop`
- [ ] 更新链接文本，反映当前推荐的安装方式

**修改示例**:
```diff
- 如果您更喜欢使用软件包方式部署，请参阅[软件包部署指南](/installation/package-deployment)。
+ 如果您更喜欢使用桌面应用方式部署，请参阅[Desktop 安装指南](/installation/desktop)。
```

**注意**: 当前产品推荐的两种部署模式为 **Docker Compose** 和 **Desktop**，更新后的链接应引导用户使用 Desktop 安装方式。

---

## 阶段 3: 图片资源清理

### 3.1 删除专用图片
**目的**: 移除仅用于软件包安装的图片

- [ ] 根据阶段 1.1 的分析结果，删除确认无其他依赖的图片
- [ ] 如存在独立的 `install-package/` 目录，整体删除

**命令参考**:
```bash
# 如果存在独立目录
rm -rf apps/docs/public/img/install-package

# 或逐个删除特定文件
```

### 3.2 验证图片删除安全性
**目的**: 确保未误删共享图片

- [ ] 搜索剩余文档中对已删除图片的引用
- [ ] 如发现误删，从 git 恢复文件

---

## 阶段 4: 构建验证

### 4.1 本地构建测试
**目的**: 确保删除后构建成功

- [ ] 运行 `npm run build:docs`
- [ ] 检查构建输出无错误
- [ ] 验证无断链错误（Astro `onBrokenLinks: 'throw'` 检查）

### 4.2 本地预览验证
**目的**: 验证用户界面正常

- [ ] 运行 `npm run dev` 启动本地预览
- [ ] 手动访问安装指南页面
- [ ] 验证侧边栏导航结构正常
- [ ] 确认 Desktop 安装作为主要入口清晰可见
- [ ] 点击 Docker Compose 页面中的更新链接，确认正确跳转到 Desktop 安装页面

---

## 阶段 5: 变更提交与部署

### 5.1 提交变更
**目的**: 创建清晰的 Git 提交

- [ ] 使用以下格式创建提交:
  ```
  docs: remove deprecated package installation documentation

    - Delete package-deployment.md installation guide
    - Update docker-compose.md link to point to Desktop installation
    - Clean up related image resources
  ```

### 5.2 部署后验证
**目的**: 确认生产环境正常

- [ ] 等待 Azure 部署完成
- [ ] 访问 `https://docs.hagicode.com` 验证
- [ ] 检查安装指南页面功能正常

---

## 回滚计划

如需回滚变更：

```bash
git revert HEAD
npm run build:docs
```

---

## 注意事项

1. **图片删除需谨慎**: 只删除确认无其他文档引用的图片
2. **链接检查要全面**: 包括 `.md`、`.ts`、`.astro` 文件
3. **构建验证不可省略**: Astro 配置了断链抛错，必须通过
4. **保留 git 历史**: 使用 `git rm` 而非直接删除文件
