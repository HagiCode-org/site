# Microsoft Clarity 集成验证清单

## 问题修复摘要

### 根本原因
Astro 的 `import.meta.env.PROD` 在 Vite 的 `define` 配置中没有显式设置，导致在构建时评估为 `false`，从而使 Clarity 组件的条件渲染永远为假，脚本被静态优化掉。

### 修复方案
在两个站点的 `astro.config.mjs` 中添加显式的 `import.meta.env.PROD` 定义：

```javascript
vite: {
  define: {
    "import.meta.env.VITE_CLARITY_PROJECT_ID": JSON.stringify(
      process.env.CLARITY_PROJECT_ID || "",
    ),
    // 确保 import.meta.env.PROD 在构建时正确评估为 true
    "import.meta.env.PROD": JSON.stringify(
      process.env.NODE_ENV === "production",
    ),
  },
}
```

### 修改的文件
- `apps/docs/astro.config.mjs` - 添加 `import.meta.env.PROD` 定义
- `apps/website/astro.config.mjs` - 添加 `import.meta.env.PROD` 定义
- `apps/docs/src/components/Clarity.astro` - 统一实现，添加调试支持
- `apps/website/src/components/Clarity.astro` - 统一实现，添加调试支持

---

## 验证清单

### 1. 本地构建验证

#### 文档站点
```bash
cd apps/docs
CLARITY_PROJECT_ID=test123 NODE_ENV=production npm run build
grep "clarity.ms/tag" dist/product-overview/index.html
# 应该看到实际的 Clarity 脚本（不是代码示例）
```

#### 营销站点
```bash
cd apps/website
CLARITY_PROJECT_ID=test123 NODE_ENV=production npm run build
grep "clarity.ms/tag" dist/index.html
# 应该看到实际的 Clarity 脚本
```

**预期结果**: 构建产物的 HTML 文件中应包含类似以下内容：
```html
<script>(function(){const clarityProjectId = "test123";
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", clarityProjectId);
})();
</script>
```

### 2. 本地开发环境验证

```bash
npm run dev
```

**预期结果**:
- 开发环境中不应加载 Clarity 脚本
- 浏览器控制台不应有 `clarity.ms` 的网络请求
- 组件的条件渲染正确工作

### 3. CI/CD 构建验证

#### GitHub Actions 工作流验证

检查 `.github/workflows/` 中的 Azure 部署工作流：

1. 确认工作流传递 `CLARITY_PROJECT_ID` 环境变量
2. 检查构建日志，确认没有错误
3. 下载构建产物并验证 HTML 文件包含 Clarity 脚本

**验证命令** (在 CI 构建产物中):
```bash
grep -r "clarity.ms/tag" apps/docs/dist --include="*.html" | grep -v "expressive-code"
```

### 4. 部署后验证

#### 浏览器开发者工具验证

1. 访问部署后的站点:
   - https://docs.hagicode.com
   - https://hagicode.com

2. 打开浏览器开发者工具 (F12)

3. **Network 面板验证**:
   - 刷新页面
   - 搜索 `clarity.ms`
   - 应该看到对 `https://www.clarity.ms/tag/{PROJECT_ID}` 的请求

4. **Console 面板验证**:
   - 检查是否有 Clarity 初始化日志
   - 输入 `window.clarity` 应该返回 Clarity 对象

5. **Elements 面板验证**:
   - 搜索 `clarityProjectId`
   - 应该找到包含实际 Project ID 的脚本标签

#### Microsoft Clarity Dashboard 验证

1. 访问 https://clarity.microsoft.com
2. 选择对应的项目
3. 确认开始接收数据
4. 检查以下指标:
   - 页面浏览量
   - 热力图数据
   - 用户录屏

---

## 调试功能

### 启用构建时调试

设置 `CLARITY_DEBUG=1` 环境变量来查看构建时的 Clarity 组件状态：

```bash
CLARITY_PROJECT_ID=test123 CLARITY_DEBUG=1 NODE_ENV=production npm run build:docs
```

**预期输出**:
```
[Clarity] Build-time state: {
  isProduction: true,
  clarityProjectId: '***t123',
  shouldLoadClarity: true,
  NODE_ENV: 'production'
}
```

---

## 故障排查

### 问题: 构建产物中没有 Clarity 脚本

**可能原因**:
1. `CLARITY_PROJECT_ID` 环境变量未设置
2. `NODE_ENV` 不是 `production`
3. `import.meta.env.PROD` 未正确配置

**排查步骤**:
```bash
# 1. 检查环境变量
echo $CLARITY_PROJECT_ID
echo $NODE_ENV

# 2. 启用调试模式重新构建
CLARITY_DEBUG=1 npm run build

# 3. 检查构建日志中的 [Clarity] 输出
```

### 问题: 开发环境也加载了 Clarity

**预期行为**: 开发环境不应加载 Clarity 脚本

**检查**: 确保 `import.meta.env.PROD` 在开发模式下为 `false`

---

## GitHub Secrets 配置

确保以下 Secret 在 GitHub 仓库中配置：

- **CLARITY_PROJECT_ID**: Microsoft Clarity 项目 ID (必需)

**配置步骤**:
1. 访问 GitHub 仓库设置
2. 选择 Secrets and variables > Actions
3. 添加新的 repository secret
4. 名称: `CLARITY_PROJECT_ID`
5. 值: 你的 Clarity Project ID

---

## 部署检查清单

- [ ] GitHub Secrets 中 `CLARITY_PROJECT_ID` 已配置
- [ ] 代码已提交并推送到 main 分支
- [ ] GitHub Actions 工作流已触发
- [ ] 构建成功完成
- [ ] 部署到 Azure Static Web Apps 成功
- [ ] 浏览器中验证 Clarity 脚本加载
- [ ] Microsoft Clarity Dashboard 确认数据接收

---

## 相关文件

- [Microsoft Clarity 官方文档](https://learn.microsoft.com/en-us/clarity/)
- [Astro 环境变量文档](https://docs.astro.build/en/guides/environment-variables/)
- [Vite define 配置](https://vitejs.dev/config/shared-options.html#define)
