## 1. Implementation

### 1.1 首页验证标签

- [ ] 1.1.1 打开 `src/pages/index.astro` 文件
- [ ] 1.1.2 找到 `<head>` 标签中的 `<meta name="description" content={description} />` (第 35 行)
- [ ] 1.1.3 在该行后添加百度验证 meta 标签
- [ ] 1.1.4 添加以下代码:
  ```astro
  <!-- 百度搜索引擎验证 -->
  <meta name="baidu-site-verification" content="codeva-A9s3yT3z5m" />
  ```

### 1.2 文档页验证标签

- [ ] 1.2.1 打开 `src/components/StarlightHead.astro` 文件
- [ ] 1.2.2 在 `</SEO>` 组件结束标签后添加百度验证 meta 标签
- [ ] 1.2.3 添加以下代码:
  ```astro
  <!-- 百度搜索引擎验证 -->
  <meta name="baidu-site-verification" content="codeva-A9s3yT3z5m" />
  ```
- [ ] 1.2.4 确保添加位置在 `{isValidPage && (...) }` 条件块内,以保证只在有效页面中显示

## 2. Verification

### 2.1 构建和基础验证

- [ ] 2.1.1 本地构建站点: `npm run build`
- [ ] 2.1.2 在构建输出中检查首页 HTML 源代码
- [ ] 2.1.3 在构建输出中检查文档页 HTML 源代码

### 2.2 首页验证

- [ ] 2.2.1 使用浏览器访问首页 (`/`)
- [ ] 2.2.2 使用浏览器开发工具查看首页 `<head>` 标签
- [ ] 2.2.3 确认首页包含百度验证 meta 标签
- [ ] 2.2.4 验证 meta 标签的 content 属性值为 `codeva-A9s3yT3z5m`

### 2.3 文档页验证

- [ ] 2.3.1 使用浏览器访问任意文档页面
- [ ] 2.3.2 使用浏览器开发工具查看文档页 `<head>` 标签
- [ ] 2.3.3 确认文档页包含百度验证 meta 标签
- [ ] 2.3.4 验证 meta 标签的 content 属性值为 `codeva-A9s3yT3z5m`

### 2.4 多页面覆盖验证

- [ ] 2.4.1 测试多个不同类型的文档页面(如入门指南、API 文档等)
- [ ] 2.4.2 确认所有页面都包含百度验证 meta 标签且 content 值一致

## 3. Documentation

- [ ] 3.1 在百度站长平台提交站点验证
- [ ] 3.2 确认百度站长平台验证通过
- [ ] 3.3 (可选) 在项目文档中记录已添加的搜索引擎验证配置
