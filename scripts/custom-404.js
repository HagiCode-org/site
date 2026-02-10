/**
 * 自定义 404 页面生成脚本
 * 在构建后替换 Starlight 的默认 404 页面
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 自定义 404 页面内容
const custom404Content = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <title>页面未找到 - Hagicode</title>
    <meta name="description" content="您访问的页面不存在,请检查 URL 或使用以下导航链接" />
    <script is:inline>
      (function() {
        const stored = localStorage.getItem('starlight-theme');
        const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = stored || system;
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
    <style>
      :root {
        --spacing-xl: 2rem;
        --spacing-md: 1rem;
        --radius-lg: 0.75rem;
        --duration-normal: 0.2s;
        --ease-out: cubic-bezier(0, 0, 0.2, 1);
        --color-text: #1a1a1a;
        --color-text-secondary: #6b7280;
        --color-surface-glass: rgba(255, 255, 255, 0.8);
        --color-border: #e5e7eb;
        --color-primary: #0080ff;
        --gradient-primary: linear-gradient(135deg, #0080ff 0%, #00ffff 100%);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        --shadow-glow: 0 0 20px rgba(0, 128, 255, 0.3);
      }

      [data-theme='dark'] {
        --color-text: #f3f4f6;
        --color-text-secondary: #9ca3af;
        --color-surface-glass: rgba(17, 24, 39, 0.8);
        --color-border: #374151;
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
      }

      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        background-attachment: fixed;
      }

      [data-theme='dark'] body {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      }

      .not-found-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-xl);
      }

      .not-found-content {
        max-width: 600px;
        text-align: center;
      }

      .error-code {
        font-size: 8rem;
        font-weight: 700;
        line-height: 1;
        background: linear-gradient(135deg, #0080ff 0%, #00ffff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 var(--spacing-md) 0;
      }

      .error-title {
        font-size: 2.5rem;
        font-weight: 600;
        margin: 0 0 var(--spacing-md) 0;
        color: var(--color-text);
      }

      .error-description {
        font-size: 1.125rem;
        line-height: 1.6;
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-xl) 0;
      }

      .not-found-nav {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
        margin-top: var(--spacing-xl);
      }

      .nav-link {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-md);
        background: var(--color-surface-glass);
        backdrop-filter: blur(10px);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        color: var(--color-text);
        text-decoration: none;
        transition: all var(--duration-normal) var(--ease-out);
        font-weight: 500;
      }

      .nav-link:hover {
        border-color: var(--color-primary);
        box-shadow: var(--shadow-lg), var(--shadow-glow);
        transform: translate3d(0, -4px, 0);
      }

      .nav-link:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      @media (max-width: 767px) {
        .not-found-nav {
          grid-template-columns: 1fr;
        }

        .error-code {
          font-size: 6rem;
        }

        .error-title {
          font-size: 2rem;
        }
      }
    </style>
  </head>
  <body>
    <main class="not-found-container">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">页面未找到</h2>
        <p class="error-description">
          抱歉,您访问的页面不存在。请检查 URL 或从以下链接导航到其他页面。
        </p>

        <nav class="not-found-nav" aria-label="快速导航">
          <a href="/" class="nav-link">
            <span>首页</span>
          </a>
          <a href="/docs/installation/docker-compose" class="nav-link">
            <span>安装指南</span>
          </a>
          <a href="/docs/quick-start/" class="nav-link">
            <span>快速开始</span>
          </a>
          <a href="/docs/product-overview" class="nav-link">
            <span>产品概览</span>
          </a>
        </nav>
      </div>
    </main>
  </body>
</html>
`;

// 获取 dist 目录路径
// 支持从根目录或 apps/docs 目录运行
const distDir = path.resolve(__dirname, '../apps/docs/dist');
const outputFile = path.join(distDir, '404.html');

// 确保目录存在
if (!fs.existsSync(distDir)) {
  console.error('dist 目录不存在,请先运行构建');
  process.exit(1);
}

// 写入自定义 404 页面
fs.writeFileSync(outputFile, custom404Content, 'utf-8');

console.log('✅ 自定义 404 页面已生成:', outputFile);
