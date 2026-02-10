# 实施任务清单

修复文档站点 RSS 链接域名配置的实施步骤。

<!-- OPENSPEC:STATUS -->
**状态**: ExecutionCompleted
**执行日期**: 2026-02-10
**提交**: e026c8f
<!-- OPENSPEC:STATUS:END -->

---

## 任务 1: 更新 Site 配置

**状态**: Pending
**优先级**: 高
**预计耗时**: 短
**依赖**: 无

**描述**
修改 `apps/docs/astro.config.mjs` 中的 `site` 配置，将其从 `https://hagicode.com` 更改为 `https://docs.hagicode.com`。

**文件**
- `apps/docs/astro.config.mjs`

**修改内容**
```javascript
// 修改前 (line 30)
site: 'https://hagicode.com',

// 修改后
site: 'https://docs.hagicode.com',
```

**验证方式**
- 文件保存后确认配置语法正确

---

## 任务 2: 更新 Sitemap URL 引用

**状态**: Pending
**优先级**: 高
**预计耗时**: 短
**依赖**: 任务 1

**描述**
检查并更新 `robotsTxt` 配置中的 sitemap URL 引用，确保与新的 `site` 配置一致。

**文件**
- `apps/docs/astro.config.mjs`

**修改内容**
```javascript
// 修改前 (line 64)
sitemap: 'https://hagicode.com/docs/sitemap-index.xml',

// 修改后
sitemap: 'https://docs.hagicode.com/docs/sitemap-index.xml',
```

**验证方式**
- 确认 sitemap URL 与新 site 配置和 base 路径组合一致

---

## 任务 3: 本地构建验证

**状态**: Pending
**优先级**: 高
**预计耗时**: 中
**依赖**: 任务 1, 任务 2

**描述**
执行本地构建，验证配置修改后项目能正常构建。

**命令**
```bash
turbo run build --filter=docs
```

**验证方式**
- 构建成功无错误
- 检查构建输出无警告

---

## 任务 4: 验证 Sitemap 输出

**状态**: Pending
**优先级**: 高
**预计耗时**: 短
**依赖**: 任务 3

**描述**
检查生成的 sitemap XML 文件，确认所有链接使用正确的域名。

**文件**
- `apps/docs/dist/sitemap-index.xml`
- `apps/docs/dist/sitemap-*.xml` (其他 sitemap 文件)

**验证检查**
- [ ] sitemap-index.xml 中的所有 URL 使用 `docs.hagicode.com`
- [ ] 子 sitemap 文件中的 URL 使用 `docs.hagicode.com`
- [ ] URL 路径包含 `/docs` base 路径

---

## 任务 5: 验证 Canonical URLs

**状态**: Pending
**优先级**: 中
**预计耗时**: 短
**依赖**: 任务 3

**描述**
检查生成的 HTML 文件中的 canonical 链接元素。

**文件**
- 随机抽样检查 `apps/docs/dist/**/*.html` 文件

**验证检查**
- [ ] `<link rel="canonical">` href 属性使用 `docs.hagicode.com`
- [ ] href 路径包含 `/docs` base 路径

---

## 任务 6: RSS 功能验证（如适用）

**状态**: Pending
**优先级**: 低
**预计耗时**: 短
**依赖**: 任务 3

**描述**
如果启用 starlight-blog 的 RSS 功能，验证生成的 RSS feed 使用正确域名。

**注意**
当前配置中 `starlightBlog({ rss: false })`，RSS 功能处于禁用状态。此任务仅在启用 RSS 时需要执行。

**验证检查（启用 RSS 后）**
- [ ] RSS XML 文件生成在预期路径
- [ ] feed 中所有 `<link>` 和 `<guid>` 使用 `docs.hagicode.com`

---

## 任务 7: 提交变更

**状态**: Pending
**优先级**: 中
**预计耗时**: 短
**依赖**: 任务 1-5

**描述**
提交配置修改到版本控制。

**命令**
```bash
git add apps/docs/astro.config.mjs
git commit -m "fix(docs): correct site domain to docs.hagicode.com"
```

---

## 任务依赖图

```
任务 1 (更新 Site 配置)
    │
    ├──→ 任务 2 (更新 Sitemap URL)
    │       │
    │       └──→ 任务 3 (本地构建验证)
    │               │
    │               ├──→ 任务 4 (验证 Sitemap 输出)
    │               ├──→ 任务 5 (验证 Canonical URLs)
    │               └──→ 任务 6 (RSS 验证)
    │                       │
    │                       └──→ 任务 7 (提交变更)
```

---

## 完成标准

所有任务标记为完成，且：
- ✅ 构建成功无错误
- ✅ Sitemap 使用正确域名
- ✅ Canonical URLs 使用正确域名
- ✅ 变更已提交到版本控制
