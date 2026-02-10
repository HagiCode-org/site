# 实施任务清单

**提案编号:** `blog-rss-subscription-feature`

---

## 任务列表

### 阶段 1: 启用 RSS 功能

- [ ] **T-001: 启用 starlight-blog RSS 插件**
  - 文件: `apps/docs/astro.config.mjs`
  - 操作: 将 `starlightBlog` 配置中的 `rss: false` 改为 `rss: true`
  - 预期时间: 1 分钟

### 阶段 2: 添加订阅入口

- [ ] **T-002: 在导航菜单添加 RSS 链接**
  - 文件: `apps/docs/src/config.ts` (Starlight 配置)
  - 操作: 在侧边栏或社交链接中添加 RSS 图标/链接
  - 链接目标: `/blog/rss.xml`
  - 预期时间: 5 分钟

### 阶段 3: 验证测试

- [ ] **T-003: 本地验证 RSS 生成**
  - 操作: 运行 `turbo run dev --filter=docs` 启动开发服务器
  - 访问: `http://localhost:4321/blog/rss.xml`
  - 验证点:
    - 返回 XML 格式内容
    - 包含博客文章列表
    - 元数据完整（title、date、link、description）
  - 预期时间: 3 分钟

- [ ] **T-004: RSS 格式验证**
  - 操作: 使用在线验证工具测试生成的 RSS
  - 工具建议:
    - https://validator.w3.org/feed/
    - https://www.rssboard.org/rss-validator/
  - 验证点: 通过 RSS 2.0 规范验证
  - 预期时间: 2 分钟

- [ ] **T-005: 订阅链接功能测试**
  - 操作: 点击导航中的 RSS 订阅链接
  - 验证点: 正确跳转到 `/blog/rss.xml`
  - 预期时间: 1 分钟

### 阶段 4: 构建验证

- [ ] **T-006: 生产构建验证**
  - 操作: 运行 `turbo run build --filter=docs`
  - 验证点: 构建成功，无错误或警告
  - 输出检查: `dist/docs/blog/rss.xml` 文件存在
  - 预期时间: 2 分钟

---

## 任务依赖关系

```
T-001 (启用 RSS)
  ↓
T-002 (添加订阅入口) ──┐
  ↓                    │
T-003 (本地验证) ───────┤
  ↓                    │
T-004 (格式验证) ───────┤
  ↓                    │
T-005 (链接测试) ───────┤
  ↓                    │
T-006 (构建验证) ◄──────┘
```

## 预计总时长

约 **15 分钟**

## 验收标准

所有任务完成且满足以下条件：

1. ✅ `/blog/rss.xml` 可访问且返回有效 RSS 2.0 内容
2. ✅ RSS 包含所有博客文章的完整元数据
3. ✅ 导航菜单包含可点击的订阅链接
4. ✅ 生产构建成功生成 RSS 文件
5. ✅ 通过 RSS 2.0 格式规范验证
