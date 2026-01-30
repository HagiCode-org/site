---
title: 外部链接测试页面
description: 用于验证外部链接在新标签页打开功能的测试页面
---

# 外部链接测试

本页面用于验证外部链接在新标签页打开功能是否正常工作。

## 外部链接

以下外部链接应该在新标签页打开,并包含 `target="_blank"` 和 `rel="noopener noreferrer"` 属性:

- [Example HTTP](http://example.com) - HTTP 外部链接
- [Example HTTPS](https://example.com) - HTTPS 外部链接
- [GitHub](https://github.com) - GitHub 外部链接
- [Bilibili](https://www.bilibili.com) - Bilibili 外部链接
- [Astro 文档](https://docs.astro.build) - Astro 文档外部链接
- [React 官网](https://react.dev) - React 官网外部链接

## 内部链接

以下内部链接应该在当前标签页打开,不包含 `target` 属性:

- [快速开始 - 创建第一个项目](/quick-start/create-first-project) - 内部文档链接
- [安装指南 - Docker Compose](/installation/docker-compose) - 内部安装指南链接
- [产品概述](/product-overview) - 内部概述链接

## 锚点链接

以下锚点链接应该在当前标签页打开并跳转到页面内指定位置:

- [回到顶部](#外部链接测试) - 页面内锚点链接

## 测试说明

### 如何测试

1. **外部链接测试**:
   - 右键点击外部链接,选择"检查"或"审查元素"
   - 查看 HTML 源码,确认包含 `target="_blank"` 属性
   - 确认包含 `rel="noopener noreferrer"` 属性
   - 点击链接,验证在新标签页打开

2. **内部链接测试**:
   - 右键点击内部链接,选择"检查"或"审查元素"
   - 查看 HTML 源码,确认不包含 `target` 属性
   - 点击链接,验证在当前标签页打开

3. **锚点链接测试**:
   - 点击锚点链接
   - 验证页面滚动到对应位置
   - 确认在当前标签页跳转

### 预期结果

- ✅ 所有外部链接包含 `target="_blank"` 和 `rel="noopener noreferrer"`
- ✅ 所有内部链接不包含 `target` 属性
- ✅ 所有锚点链接正常工作
- ✅ 点击外部链接时在新标签页打开
- ✅ 点击内部链接时在当前标签页打开

## 技术实现

本功能通过 `rehype-external-links` 插件实现,配置位于 `astro.config.mjs`:

```javascript
[rehypeExternalLinks, {
  target: '_blank',
  rel: ['noopener', 'noreferrer'],
}]
```

插件会自动检测外部链接(以 `http://` 或 `https://` 开头)并添加相应的属性。
