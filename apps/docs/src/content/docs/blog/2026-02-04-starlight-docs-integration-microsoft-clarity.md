---
title: "基于 Starlight 文档站点接入 Microsoft Clarity 的完整实践指南"
date: 2026-02-04
---

# 从数据洞察到用户增长：HagiCode 博客接入 Clarity Analytics 的完整指南

> 本文将分享如何在 Starlight 文档站点中优雅地接入 Microsoft Clarity，不仅能看清用户行为，还能确保隐私合规。这套方案是我们在 HagiCode 项目中实践总结出来的，希望能给同样在折腾数据统计的你一点参考。

<!-- truncate -->

## 背景：为什么我们需要 Clarity？

以下代码展示了如何在 Astro 集成中根据环境变量动态注入 Microsoft Clarity 脚本，仅在生效时进行生产环境加载。


<!-- Code from openspec/changes/archive/2026-01-30-microsoft-clarity-integration/design.md:105-119 -->
```markdown
105 | interface Props {
106 |   // 未来可扩展: 允许手动覆盖 Project ID
107 |   projectId?: string;
108 | }
109 | 
110 | const {
111 |   projectId = import.meta.env.CLARITY_PROJECT_ID,
112 | } = Astro.props;
113 | 
114 | const isProduction = import.meta.env.PROD;
115 | ---
116 | 
117 | {isProduction && projectId && (
118 |   <script is:inline define:vars={{projectId}}>
119 |     (function(c,l,a,r,i,t,y){
```

*文件：`openspec/changes/archive/2026-01-30-microsoft-clarity-integration/design.md`*

在运营 **HagiCode** 的过程中，我们一直面临一个"盲盒"问题：我们产出内容，但不清楚用户是如何阅读的。虽然 GitHub 能看到 Star 数，但这太滞后了。我们需要知道：

- 用户到底有没有看完我们的教程？
- 那些复杂的配置文档，是在哪一步劝退了用户的？
- 我们的 SEO 优化是否真的带来了有效流量？

市面上有很多分析工具，比如 Google Analytics（GA）和 Microsoft Clarity。GA 功能强大但配置复杂，且受到隐私法规（如 GDPR）的严格限制。而 Clarity 作为微软推出的免费热力图工具，不仅功能直观，而且在隐私合规上相对宽松，非常适合技术文档站点。

**我们的目标很明确**：在 **HagiCode** 的文档站点中无缝集成 Clarity，既要在所有页面生效，又要给用户留有"退出"的权利（隐私合规）。

## 关于 HagiCode

HagiCode 主题初始化逻辑：优先读取本地存储，回退至系统偏好，默认暗色。


<!-- Code from openspec/changes/archive/2026-01-29-theme-toggle-implementation/design.md:67-86 -->
```markdown
67 | function getInitialTheme(): Theme {
68 |   // 1. 检查 localStorage
69 |   const stored = localStorage.getItem('hagicode-theme');
70 |   if (stored) return stored as Theme;
71 | 
72 |   // 2. 检测系统偏好
73 |   const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
74 |   if (systemDark) return 'dark';
75 | 
76 |   // 3. 默认暗色
77 |   return 'dark';
78 | }
79 | ```
80 | 
81 | ### 决策 3：主题应用方式
82 | 
83 | **选择**：在 `<html>` 根元素设置 `data-theme` 属性
84 | 
85 | **对比方案**：
86 | 
```

*文件：`openspec/changes/archive/2026-01-29-theme-toggle-implementation/design.md`*

本文分享的方案来自我们在 [HagiCode](https://github.com/HagiCode-org/site) 项目中的实践经验。HagiCode 是一个基于 AI 的代码辅助工具，在开发过程中，我们需要维护大量的技术文档和博客。为了更好地理解用户需求，我们探索并实施了这套数据接入方案。

## 技术选型与探索

起初，我们在 Proposal 阶段讨论了多种集成方式。既然我们使用的是 Starlight（基于 Astro 的文档框架），最直观的想法是利用 Astro 的 Hooks。

我们首先尝试了修改 `astro.config.mjs`，计划在构建时注入 Clarity 脚本。虽然这种方式能保证全局覆盖，但缺乏灵活性——我们无法根据用户的偏好动态加载或卸载脚本。

考虑到用户体验和隐私控制，我们最终决定采用 **组件覆盖** 的方案。Starlight 允许开发者覆盖其内部组件，这意味着我们可以接管 `<footer>` 或 `<head>` 的渲染逻辑，从而精细控制 Clarity 的加载时机。

这里有一个小插曲：原本我们想创建一个名为 `StarlightWrapper.astro` 的布局包装器。但在实际调试中发现，Starlight 的路由机制并不会自动调用这个自定义 Wrapper，这导致脚本在部分页面失效。这算是一个典型的"想当然"踩坑经历，提醒我们**必须深入理解框架的渲染流程，而不是盲目套用通用框架模式**。

## 核心方案：Footer 组件覆盖

为了确保 Clarity 脚本在所有页面（包括文档和博客）加载，并且不破坏原有的页面结构，我们选择了覆盖 Starlight 的 `Footer` 组件。

### 为什么是 Footer？

1.  **全局性**：Footer 几乎在所有标准页面都会出现。
2.  **非侵入性**：将脚本放在 Footer 区域（实际渲染在 body 底部）不会阻塞页面的关键渲染路径（LCP），对性能影响最小。
3.  **逻辑集中**：可以在组件内部统一处理 Cookie 同意逻辑。

### 实施步骤

#### 1. 准备 Clarity 项目

首先，你需要在 [Microsoft Clarity](https://clarity.microsoft.com/) 注册并创建一个新项目。获取你的 Project ID（类似 `k8z2ab3xxx` 这样的字符串）。

#### 2. 环境变量配置

下面通过环境变量配置与日期判断代码，实现新年期间的逻辑控制，请参考具体实现。


<!-- Code from src/pages/index.astro:46-65 -->
```text
46 |         function isLunarNewYearPeriod() {
47 |           const now = new Date();
48 |           const year = now.getFullYear();
49 |           const month = now.getMonth() + 1; // 1-12
50 |           const day = now.getDate();
51 | 
52 |           // 2025年蛇年新年期间 (1月29日 - 2月12日)
53 |           if (year === 2025) {
54 |             if (month === 1 && day >= 29) return true;
55 |             if (month === 2 && day <= 12) return true;
56 |           }
57 |           // 2026年马年新年期间 (2月17日 - 3月3日)
58 |           if (year === 2026) {
59 |             if (month === 2 && day >= 17) return true;
60 |             if (month === 3 && day <= 3) return true;
61 |           }
62 |           return false;
63 |         }
64 | 
65 |         const stored = localStorage.getItem('starlight-theme');
```

*文件：`src/pages/index.astro`*

为了安全起见，不要硬编码 ID。建议将 ID 存入环境变量。

在项目根目录创建 `.env` 文件：

```bash
# Microsoft Clarity ID
PUBLIC_CLARITY_ID="你的_Clarity_ID"
```

#### 3. 创建覆盖组件

以下是监听系统主题变化的实现代码，展示了如何仅在未手动设置时跟随系统切换主题。


<!-- Code from openspec/changes/archive/2026-01-29-theme-toggle-implementation/design.md:445-464 -->
```markdown
445 |     const handleChange = (e: MediaQueryListEvent) => {
446 |       // 仅在用户未手动设置时跟随系统
447 |       if (!localStorage.getItem(THEME_KEY)) {
448 |         setThemeState(e.matches ? 'dark' : 'light');
449 |       }
450 |     };
451 | 
452 |     mediaQuery.addEventListener('change', handleChange);
453 |     return () => mediaQuery.removeEventListener('change', handleChange);
454 |   }, []);
455 | 
456 |   return { theme, toggleTheme, setTheme: manuallySetTheme };
457 | }
458 | ```
459 | 
460 | #### 3. `src/components/ThemeButton.tsx` - 按钮组件
461 | 
462 | **职责**：渲染主题切换按钮，处理用户交互
463 | 
464 | **组件接口**：
```

*文件：`openspec/changes/archive/2026-01-29-theme-toggle-implementation/design.md`*

在 `src/components/` 目录下创建文件 `StarlightFooter.astro`。Starlight 会自动识别这个文件并覆盖默认的 Footer。

核心代码逻辑如下：

```astro
---
// src/components/StarlightFooter.astro
// 1. 引入原始组件以保留其默认功能
import DefaultFooter from '@astrojs/starlight/components/StarlightFooter.astro';

// 2. 获取环境变量
const clarityId = import.meta.env.PUBLIC_CLARITY_ID;

// 3. 定义简单的注入脚本（内联方式）
// 注意：生产环境建议将此逻辑抽离到单独的 .js 文件中以利用缓存
const initScript = `
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");
`;
---

<DefaultFooter {...Astro.props} />

{/* 仅在生产环境且 ID 存在时注入脚本 */}
{import.meta.env.PROD && clarityId && (
  <script is:inline define:vars={{ clarityId }}>
    {initScript}
  </script>
)}
```

**关键点解析**：
- `is:inline`：告诉 Astro 不要处理这个 script 标签内的内容，直接输出到 HTML。这对第三方统计脚本至关重要，否则 Astro 的打包优化可能会导致脚本失效。
- `define:vars`：这是 Astro 3+ 的特性，允许在作用域内安全地注入变量。
- `import.meta.env.PROD`：确保在本地开发时（除非为了调试）不产生无效统计，保持数据纯净。

### 进阶：隐私合规与 Cookie 控制

仅仅加上代码是不够的，特别是在 GDPR 管辖区域。我们需要尊重用户的选择。

HagiCode 的做法是提供一个简单的开关。虽然这不是全功能的 Cookie Banner，但对于纯展示的技术文档站点来说，通常属于"必要"或"统计"类 Cookie，可以通过隐私声明告知并默认开启，或者在 Footer 链接到隐私设置页面。

如果需要更严谨的控制，你可以结合 `localStorage` 来记录用户的选择：

本文将介绍用于主题切换与持久化的 TypeScript 工具函数，通过类型安全与环境检测实现严谨控制。


<!-- Code from openspec/changes/archive/2026-01-29-theme-toggle-implementation/design.md:367-386 -->
```markdown
367 | export function getInitialTheme(): Theme;
368 | export function getSystemTheme(): Theme;
369 | export function setTheme(theme: Theme): void;
370 | export function applyTheme(theme: Theme): void;
371 | ```
372 | 
373 | **设计原则**：
374 | - **纯函数**：无副作用（除了 `setTheme` 和 `applyTheme`）
375 | - **类型安全**：完整的 TypeScript 类型推导
376 | - **环境检测**：SSR 安全（`typeof window` 检查）
377 | - **单一职责**：每个函数只做一件事
378 | 
379 | **关键实现**：
380 | ```typescript
381 | export function getInitialTheme(): Theme {
382 |   if (typeof window === 'undefined') return 'dark';
383 | 
384 |   const stored = localStorage.getItem(THEME_KEY);
385 |   if (stored === 'light' || stored === 'dark') return stored;
386 | 
```

*文件：`openspec/changes/archive/2026-01-29-theme-toggle-implementation/design.md`*

```javascript
// 简单示例：检查用户是否拒绝统计
const consent = localStorage.getItem('clarity_consent');
if (consent !== 'denied') {
    // 执行上面的 Clarity 初始化代码
    window.clarity('start', clarityId);
}
```

## 经验总结与坑点

在将这套方案落地到 HagiCode 的过程中，我们总结了几个容易被忽视的细节：

1.  **`StarlightWrapper.astro` 是个陷阱**：
    如前所述，不要试图去创建一个全局 Wrapper 来注入脚本，这在 Starlight 中行不通。老老实实覆盖特定组件（如 `StarlightFooter.astro` 或 `StarlightHead.astro`）才是正解。

2.  **脚本位置的性能考量**：
    虽然 Clarity 建议放在 `<head>` 中以确保数据准确性，但对于文档站点，首屏加载速度（LCP）直接影响了 SEO 和用户留存。我们选择了放在 Footer（Body 底部），这会轻微丢失极少量"秒退"用户的数据，但换来了更快的页面加载体验，这是一个值得的权衡。

3.  **开发环境的干扰**：
    一定要加上 `import.meta.env.PROD` 判断。在开发模式下，你会频繁刷新页面，这会产生大量无意义的测试数据，污染你的 Clarity 仪表盘。

## 效果验证

部署完成后，你可以在 Clarity 控制台查看实时数据。通常在几分钟内，你就能看到用户的heatmap（热力图）和 recordings（录屏）。

对于 HagiCode 来说，通过这些数据我们发现：
- 很多用户会反复查看"快速开始"章节，说明我们的安装指引可能还不够直观。
- "API 参考"页面的停留时间最长，证实了我们核心用户群体的需求。

## 总结

接入 Microsoft Clarity 并不需要复杂的服务端改造，也不需要引入沉重的 SDK。

利用 Starlight 的组件覆盖机制，我们仅通过一个轻量级的 `StarlightFooter.astro` 组件，就实现了全局数据统计。这种"微集成"的方式，既保证了代码的整洁，又赋予了我们洞察用户行为的能力。

如果你也在运营技术类项目，特别是像 **HagiCode** 这样需要不断迭代文档的项目，强烈建议尝试接入 Clarity。数据会告诉你，用户真正的痛点在哪里。

## 参考资料

- [HagiCode GitHub 仓库](https://github.com/HagiCode-org/site) - 查看我们在实际项目中的配置文件
- [Microsoft Clarity 官方文档](https://learn.microsoft.com/en-us/clarity/)
- [Starlight 组件覆盖指南](https://starlight.astro.build/guides/overriding-components/)



---

感谢您的阅读,如果您觉得本文有用,快点击下方点赞按钮👍,让更多的人看到本文。

本内容采用人工智能辅助协作,经本人审核,符合本人观点与立场。

- **本文作者:** [newbe36524](https://www.newbe.pro)
- **本文链接:** [https://hagicode.com/blog/2026-02-04-starlight-docs-integration-microsoft-clarity/](https://hagicode.com/blog/2026-02-04-starlight-docs-integration-microsoft-clarity/)
- **版权声明:** 本博客所有文章除特别声明外,均采用 BY-NC-SA 许可协议。转载请注明出处!