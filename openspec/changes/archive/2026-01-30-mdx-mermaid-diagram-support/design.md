# Design: MDX Mermaid Diagram Support

## Architecture Overview

本设计说明了如何在 Astro Starlight 项目中实现完整的 Mermaid 图表支持,特别是在 MDX 文件中。

## Current State Analysis

### 现有实现

项目当前已实现以下 Mermaid 支持:

1. **依赖安装**: `mermaid` v11.12.2 已安装
2. **渲染脚本**: `src/scripts/mermaid-renderer.astro` 提供客户端渲染
3. **集成方式**: 通过 `StarlightWrapper.astro` 在所有文档页面注入渲染脚本
4. **配置**: `astro.config.mjs` 中已排除 Mermaid 和 Math 的语法高亮

### 现有实现分析

```javascript
// mermaid-renderer.astro 核心逻辑
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',  // ⚠️ 硬编码为 dark 主题
  securityLevel: 'loose',
  themeVariables: { ... }
});

// 查找并渲染 Mermaid 代码块
const mermaidBlocks = document.querySelectorAll('pre[data-language="mermaid"]');
```

**问题识别**:
1. 主题硬编码为 `dark`,不支持动态主题切换
2. 使用 `data-language="mermaid"` 选择器,需验证 Starlight 的语法高亮输出格式
3. 缺少对 MDX 特殊处理的说明
4. 错误处理虽有实现,但需在 MDX 环境中验证

## Proposed Solution

### 1. 主题感知的 Mermaid 渲染

#### 1.1 动态主题检测

修改 `mermaid-renderer.astro` 以支持动态主题切换:

```javascript
// 检测当前主题
function getCurrentTheme() {
  // Starlight 使用 data-theme 属性
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

// 根据主题初始化 Mermaid
function initializeMermaid(theme) {
  mermaid.initialize({
    startOnLoad: false,
    theme: theme === 'dark' ? 'dark' : 'default',
    securityLevel: 'loose',
    themeVariables: theme === 'dark' ? {
      darkMode: true,
      background: 'transparent',
      primaryColor: '#ff5d01',
      primaryTextColor: '#fff',
      primaryBorderColor: '#c43d00',
      lineColor: '#ff5d01',
      secondaryColor: '#61dafb',
      tertiaryColor: '#3178c6',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    } : {
      darkMode: false,
      background: '#ffffff',
      primaryColor: '#0066cc',
      primaryTextColor: '#000',
      primaryBorderColor: '#004499',
      lineColor: '#0066cc',
      secondaryColor: '#61dafb',
      tertiaryColor: '#28a745',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }
  });
}
```

#### 1.2 主题切换监听

监听 Starlight 的主题切换事件,重新渲染图表:

```javascript
// 监听主题切换
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'data-theme') {
      const newTheme = getCurrentTheme();
      reinitializeMermaid();
      rerenderAllDiagrams();
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
});
```

### 2. MDX 兼容性验证

#### 2.1 Starlight 代码块输出格式

Starlight (基于 Astro 的 Shiki) 输出格式:

```html
<pre class="shiki"><code data-language="mermaid">graph TD
  A[开始] --> B[结束]
</code></pre>
```

需要验证并调整选择器:

```javascript
// 更健壮的选择器
const mermaidBlocks = document.querySelectorAll(
  'pre[data-language="mermaid"], ' +
  'code[data-language="mermaid"], ' +
  'pre.shiki code[data-language="mermaid"]'
);
```

#### 2.2 MDX 特殊处理

MDX 文件可能包含 JSX 组件,需要确保:

1. Mermaid 代码块在 JSX 上下文中正确识别
2. 客户端 hydration 后图表正确渲染
3. 与其他 MDX 组件(如 Tabs, Cards)兼容

### 3. 渲染策略优化

#### 3.1 渐进式渲染

避免阻塞页面加载:

```javascript
// 使用 requestIdleCallback 或 Intersection Observer
const renderWhenIdle = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(renderMermaidDiagrams);
  } else {
    setTimeout(renderMermaidDiagrams, 100);
  }
};

// 或使用 Intersection Observer 仅渲染可见图表
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      renderSingleDiagram(entry.target);
      observer.unobserve(entry.target);
    }
  });
});
```

#### 3.2 错误降级

增强错误处理,提供更好的用户体验:

```javascript
catch (error) {
  console.error('Mermaid rendering error:', error);

  // 显示友好的错误提示
  const errorDiv = document.createElement('div');
  errorDiv.className = 'mermaid-error';
  errorDiv.innerHTML = `
    <div class="error-icon">⚠️</div>
    <div class="error-message">
      <strong>图表渲染失败</strong>
      <p>无法渲染 Mermaid 图表,可能是语法错误或图表过于复杂。</p>
      <details>
        <summary>查看详细错误</summary>
        <code>${escapeHtml(error.message)}</code>
      </details>
    </div>
  `;
  block.replaceWith(errorDiv);
}
```

### 4. 性能考虑

#### 4.1 构建时影响

- Mermaid 使用**客户端渲染**,对构建时间影响极小
- 无需修改 Astro 构建配置
- 需确保 `mermaid` 包不会被打入服务端 bundle

#### 4.2 运行时性能

- 单个图表渲染: < 100ms (简单图表)
- 页面包含多个图表时,使用渐进式渲染
- 总 JavaScript 增量: Mermaid 库约 2MB (压缩后约 500KB)

#### 4.3 优化策略

1. **懒加载**: 仅在页面包含 Mermaid 代码块时加载库
2. **代码分割**: 使用动态 import
3. **缓存**: 缓存已渲染的 SVG

```javascript
// 动态加载 Mermaid
async function loadMermaid() {
  if (!window.mermaid) {
    window.mermaid = await import('mermaid');
  }
  return window.mermaid;
}
```

### 5. 文档和示例

#### 5.1 支持的图表类型

根据项目约定,支持以下 Mermaid 图表类型:

1. **流程图** (Flowchart)
   ```mermaid
   graph TD
     A[开始] --> B{判断}
     B -->|是| C[操作1]
     B -->|否| D[操作2]
   ```

2. **序列图** (Sequence Diagram)
   ```mermaid
   sequenceDiagram
     用户->>系统: 发起请求
     系统->>API: 调用接口
     API-->>系统: 返回结果
     系统-->>用户: 显示数据
   ```

3. **状态图** (State Diagram)
   ```mermaid
   stateDiagram-v2
     [*] --> 待处理
     待处理 --> 进行中
     进行中 --> 已完成
     进行中 --> 失败
   ```

4. **类图** (Class Diagram) - 简单的架构图
   ```mermaid
   classDiagram
     class User {
       +String name
       +login()
     }
     class Session {
       +Date createdAt
       +close()
     }
     User "1" --> "*" Session : 拥有
   ```

5. **ER 图** (Entity Relationship) - 数据库结构
   ```mermaid
   erDiagram
     USER ||--o{ SESSION : 拥有
     USER {
       string id PK
       string name
     }
     SESSION {
       string id PK
       string user_id FK
       timestamp created_at
     }
   ```

#### 5.2 限制和最佳实践

1. **复杂度限制**: 建议节点数不超过 20 个
2. **标签长度**: 使用简短的中文标签
3. **主题适配**: 避免硬编码颜色,使用主题变量
4. **响应式**: 测试不同屏幕尺寸下的显示效果
5. **可访问性**: 为复杂图表提供文字描述

## Implementation Phases

### Phase 1: 基础验证 (MVP)

1. 验证当前 Mermaid 渲染在 `.md` 文件中正常工作
2. 测试 `.mdx` 文件中的 Mermaid 代码块
3. 验证主题切换时的渲染行为

### Phase 2: 主题适配

1. 实现动态主题检测
2. 添加主题切换监听
3. 重新渲染图表以适配新主题

### Phase 3: 性能优化

1. 实现懒加载机制
2. 添加渐进式渲染
3. 性能测试和优化

### Phase 4: 文档和示例

1. 创建 Mermaid 图表示例文档
2. 编写最佳实践指南
3. 更新项目约定

## Testing Strategy

### 单元测试

- 主题检测函数
- 选择器匹配逻辑
- 错误处理函数

### 集成测试

- MDX 文件中 Mermaid 渲染
- 主题切换时的图表更新
- 与其他 MDX 组件的兼容性

### 视觉回归测试

- 明暗主题下的图表显示
- 不同图表类型的渲染效果
- 移动端和桌面端的响应式布局

### 性能测试

- 页面加载时间
- 图表渲染时间
- JavaScript bundle 大小

## Rollout Plan

1. **开发环境验证**: 在本地开发环境中测试所有功能
2. **文档预览**: 创建预览环境供团队审查
3. **渐进式发布**: 先在部分文档中启用,收集反馈
4. **全面部署**: 确认无问题后全面启用
5. **监控**: 监控用户反馈和性能指标

## Alternatives Considered

### Alternative 1: 使用 starlight-client-mermaid 插件

**优点**:
- 专为 Starlight 设计
- 可能提供更好的集成

**缺点**:
- 额外的依赖
- 可能与现有自定义实现冲突
- 需要验证与当前主题的兼容性

**结论**: 当前实现已能满足需求,优先优化现有方案。如果遇到难以解决的问题,再考虑此插件。

### Alternative 2: 构建时渲染

**优点**:
- 更快的客户端加载
- 无需客户端 JavaScript

**缺点**:
- 失去动态主题切换能力
- 构建时间增加
- 无法在 MDX 中动态使用

**结论**: 不推荐,项目需要主题切换支持。

### Alternative 3: 仅支持静态图片

**优点**:
- 简单可靠
- 无需额外配置

**缺点**:
- 失去版本控制能力
- 维护成本高
- 无法适配主题

**结论**: 不符合项目需求,Mermaid 代码是更好的选择。

## Open Questions

1. **Starlight 代码块输出格式**: 需要实际验证 `data-language` 属性是否正确设置
2. **MDX hydration 时机**: 需要确保 Mermaid 渲染脚本在 MDX hydration 后执行
3. **主题切换事件**: Starlight 的主题切换事件机制需要进一步研究
4. **性能基准**: 需要建立性能基准以评估优化效果

## References

- [Mermaid 官方文档](https://mermaid.js.org/)
- [Starlight 文档](https://starlight.astro.build/)
- [Astro MDX 集成](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [现有实现: mermaid-renderer.astro](../src/scripts/mermaid-renderer.astro)
- [项目约定: openspec/project.md](../project.md)
