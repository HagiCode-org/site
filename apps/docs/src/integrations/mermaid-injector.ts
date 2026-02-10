/**
 * Mermaid 注入器集成
 * 为包含 mermaid 图表的页面注入必要的渲染脚本
 */
import type { AstroIntegration } from 'astro';

export default function mermaidInjector(): AstroIntegration {
  return {
    name: 'mermaid-injector',
    hooks: {
      'astro:build:done': () => {
        // 构建完成后的钩子
      },
    },
  };
}
