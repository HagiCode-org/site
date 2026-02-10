# 实施任务清单

修复 RSS 订阅源中错误路径段问题的实施步骤。

**问题**：RSS feed 中包含错误的 `/docs` 路径段
- 当前：`https://docs.hagicode.com/docs/blog/article-title/` ❌
- 期望：`https://docs.hagicode.com/blog/article-title/` ✅

**根本原因**：文档站点现在是独立部署的站点，不需要 `base: '/docs'` 前缀

---

## 任务 1: 确认 base 配置

**状态**: Pending
**优先级**: 高
**依赖**: 无

**描述**
确认 `apps/docs/astro.config.mjs` 中的 `base` 配置和 `getBasePath()` 函数。

**文件**
- `apps/docs/astro.config.mjs`

**检查项**
- [ ] 确认当前 `getBasePath()` 函数在生产环境返回 `/docs`
- [ ] 确认 `site` 配置为 `https://docs.hagicode.com`
- [ ] 确认文档站点确实是独立部署（不是其他站点的子路径）

---

## 任务 2: 验证当前 RSS 输出问题

**状态**: Pending
**优先级**: 高
**依赖**: 任务 1

**描述**
构建文档站点并验证 RSS 链接包含错误的 `/docs` 路径段。

**命令**
```bash
npm run build --filter=docs
```

**检查项**
- [ ] 检查 `apps/docs/dist/blog/rss.xml` 文件
- [ ] 确认链接格式为 `https://docs.hagicode.com/docs/blog/...`（包含错误的 `/docs` 段）
- [ ] 记录问题：验证这确实是由 `base: '/docs'` 导致的

---

## 任务 3: 修改 getBasePath() 函数

**状态**: Pending
**优先级**: 高
**依赖**: 任务 2

**描述**
修改 `getBasePath()` 函数，使生产环境返回 `/` 而非 `/docs`。

**文件**
- `apps/docs/astro.config.mjs`

**修改内容**
将 `getBasePath()` 函数修改为：
```javascript
const getBasePath = () => {
    // 文档站点现在独立部署在 docs.hagicode.com
    // 不再需要 /docs 前缀，开发和生产都使用根路径
    return '/';
};
```

**原因**
- 文档站点独立部署在 docs.hagicode.com
- 不是某个更大站点的子路径
- 因此不需要 `/docs` 基础路径前缀

---

## 任务 4: 重新构建和验证

**状态**: Pending
**优先级**: 高
**依赖**: 任务 3

**描述**
重新构建站点并验证 RSS 输出不包含 `/docs` 路径段。

**命令**
```bash
npm run build --filter=docs
```

**验证检查**
- [ ] 检查 `apps/docs/dist/blog/rss.xml`
- [ ] 确认链接格式为 `https://docs.hagicode.com/blog/article-title/`（无 `/docs` 段）
- [ ] 确认 `<link>` 和 `<guid>` 元素都使用正确格式
- [ ] 检查其他页面 URL 是否也正确（应该没有 `/docs` 前缀）

---

## 任务 5: 验证部署后的 URL 可访问性

**状态**: Pending
**优先级**: 中
**依赖**: 任务 4

**描述**
确认修复后的 RSS 链接在生产环境中可访问。

**检查项**
- [ ] 从 RSS 中随机选择 2-3 个链接
- [ ] 验证 `https://docs.hagicode.com/blog/article-title/` 格式正确
- [ ] 确认链接不返回 404 错误
- [ ] 验证文档页面 URL 也正确（如 `https://docs.hagicode.com/guide/...`）

---

## 任务 6: 提交变更和更新提案

**状态**: Pending
**优先级**: 中
**依赖**: 任务 5

**描述**
提交配置变更并更新提案状态。

**操作**
- [ ] 提交 `apps/docs/astro.config.mjs` 变更
- [ ] 提交消息应说明：移除 `/docs` base 前缀，因为站点现在是独立部署
- [ ] 更新提案状态为已完成

---

## 任务 7: 提交变更和更新提案

**状态**: Pending
**优先级**: 中
**依赖**: 任务 6

**描述**
提交配置变更并更新提案状态。

**操作**
- [ ] 提交 `apps/docs/astro.config.mjs` 变更
- [ ] 更新提案状态为已完成

---

## 任务依赖图

```
任务 1 (确认 base 配置)
    │
    └──→ 任务 2 (验证 RSS 输出问题)
            │
            └──→ 任务 3 (修改 getBasePath 函数)
                    │
                    └──→ 任务 4 (重新构建验证)
                            │
                            └──→ 任务 5 (验证部署可访问性)
                                    │
                                    └──→ 任务 6 (提交变更)
                                            │
                                            └──→ 任务 7 (更新提案状态)
```

---

## 完成标准

- ✅ `getBasePath()` 函数返回 `/`（开发和生产环境都使用根路径）
- ✅ RSS feed 中所有链接不包含 `/docs` 路径段
- ✅ 正确的 URL 格式：`https://docs.hagicode.com/blog/article-title/`
- ✅ 所有站点页面（文档和博客）使用正确的根路径 URL
- ✅ 文章链接在生产环境可正确访问
- ✅ 配置变更已提交到版本控制
