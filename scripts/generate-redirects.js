/**
 * Docusaurus 到 Astro URL 重定向页面生成脚本
 *
 * 此脚本在构建后根据 redirects.json 配置生成 HTML 重定向页面,
 * 确保从旧的 Docusaurus URL 结构迁移到新的 Astro URL 结构时,
 * 所有旧链接仍然有效。
 *
 * 功能:
 * - 读取 redirects.json 配置文件
 * - 为每个重定向规则生成 HTML 重定向页面
 * - 支持 base 路径(根路径和子路径部署)
 * - 包含 meta refresh 和 JavaScript 双重重定向机制
 * - 添加 canonical 链接以优化 SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 从环境变量读取 base 路径,默认为根路径
const base = process.env.VITE_SITE_BASE || '/';

// 配置
const CONFIG = {
  redirectConfig: 'redirects.json',
  outputDir: 'dist',
  base,
};

/**
 * 读取重定向配置文件
 */
function loadRedirectConfig() {
  const configPath = path.join(process.cwd(), CONFIG.redirectConfig);

  if (!fs.existsSync(configPath)) {
    console.error(`❌ 错误: 重定向配置文件不存在: ${configPath}`);
    process.exit(1);
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    return config.redirects || [];
  } catch (error) {
    console.error(`❌ 错误: 无法解析重定向配置文件`, error.message);
    process.exit(1);
  }
}

/**
 * HTML 转义函数,防止 XSS 攻击
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 生成重定向页面 HTML
 */
function generateRedirectHtml(oldUrl, newUrl) {
  const safeOldUrl = escapeHtml(oldUrl);
  const safeNewUrl = escapeHtml(newUrl);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>正在重定向...</title>
  <link rel="canonical" href="${safeNewUrl}">
  <meta http-equiv="refresh" content="0;url=${safeNewUrl}">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-attachment: fixed;
      color: #333;
    }

    .container {
      max-width: 500px;
      text-align: center;
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    h1 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
      color: #1a1a1a;
    }

    p {
      margin: 0.5rem 0;
      line-height: 1.6;
      color: #666;
    }

    a {
      color: #0080ff;
      text-decoration: none;
      font-weight: 500;
    }

    a:hover {
      text-decoration: underline;
    }

    .url-info {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .old-url,
    .new-url {
      font-size: 0.875rem;
      color: #9ca3af;
      word-break: break-all;
      margin: 0.25rem 0;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      }

      .container {
        background: rgba(17, 24, 39, 0.95);
      }

      h1 {
        color: #f3f4f6;
      }

      p {
        color: #9ca3af;
      }

      a {
        color: #60a5fa;
      }

      .url-info {
        border-top-color: #374151;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>页面已迁移</h1>
    <p>您访问的页面已移动到新地址,正在为您自动跳转...</p>
    <p>如果没有自动跳转,请<a href="${safeNewUrl}">点击这里</a>。</p>
    <div class="url-info">
      <p class="old-url">旧地址: ${safeOldUrl}</p>
      <p class="new-url">新地址: ${safeNewUrl}</p>
    </div>
  </div>
  <script>
    // 保留查询参数
    const search = window.location.search;
    const targetUrl = '${safeNewUrl}' + search;

    // 使用 replace 而不是 href,避免用户按后退键再次重定向
    window.location.replace(targetUrl);
  </script>
</body>
</html>`;
}

/**
 * 生成单个重定向页面
 */
function generateRedirectPage(from, to, outputPath) {
  try {
    // 确保 base 路径以 / 开头和结尾
    const base = CONFIG.base.startsWith('/') ? CONFIG.base : '/' + CONFIG.base;
    const baseNormalized = base.endsWith('/') || base === '/' ? base : base + '/';

    // 构建完整的新旧 URL
    const fullOldUrl = baseNormalized === '/' ? from : baseNormalized.slice(0, -1) + from;
    const fullNewUrl = baseNormalized === '/' ? to : baseNormalized.slice(0, -1) + to;

    // 生成 HTML 内容
    const html = generateRedirectHtml(fullOldUrl, fullNewUrl);

    // 确保输出目录存在
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // 写入文件
    fs.writeFileSync(outputPath, html, 'utf8');

    console.log(`  ✓ ${from} → ${to}`);
  } catch (error) {
    console.error(`  ❌ 错误: 无法生成重定向页面 ${outputPath}`, error.message);
    throw error;
  }
}

/**
 * 主函数: 生成所有重定向页面
 */
async function generateRedirects() {
  console.log('开始生成重定向页面...');
  console.log(`Base 路径: ${CONFIG.base}`);
  console.log('');

  // 检查 dist 目录是否存在
  const distDir = path.join(process.cwd(), CONFIG.outputDir);
  if (!fs.existsSync(distDir)) {
    console.error(`❌ 错误: dist 目录不存在,请先运行构建`);
    process.exit(1);
  }

  // 读取重定向配置
  console.log('读取重定向配置...');
  const redirects = loadRedirectConfig();
  console.log(`✓ 找到 ${redirects.length} 个重定向规则`);
  console.log('');

  // 生成重定向页面
  console.log('生成重定向页面...');
  let successCount = 0;
  let failCount = 0;

  redirects.forEach(({ from, to }) => {
    try {
      // 构建输出路径: dist/ + from + .html
      // 例如: dist/blog/2026/01/28/slug.html
      const outputPath = path.join(distDir, from + '.html');
      generateRedirectPage(from, to, outputPath);
      successCount++;
    } catch (error) {
      failCount++;
      console.error(`❌ 生成失败: ${from} → ${to}`);
    }
  });

  console.log('');
  console.log(`完成! 共生成 ${successCount} 个重定向页面${failCount > 0 ? `,失败 ${failCount} 个` : ''}`);
}

// 执行主函数
generateRedirects().catch((error) => {
  console.error('❌ 发生错误:', error);
  process.exit(1);
});
