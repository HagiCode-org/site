#!/usr/bin/env node

/**
 * 链接检查日志解析脚本
 *
 * 从 astro-link-validator 的构建输出中解析失效链接信息，
 * 生成 JSON 格式的报告供 GitHub Actions 使用。
 *
 * 本地运行方式：
 * node scripts/parse-link-check.js
 *
 * 输入文件（按优先级读取）：
 * - all-build.log（合并的构建日志）
 * - docs-build.log（docs 站点构建日志）
 * - website-build.log（website 站点构建日志）
 *
 * 输出文件：
 * - broken-links.json（失效链接报告）
 *
 * GitHub Actions 输出变量：
 * - has_broken_links: true/false
 * - broken_links_count: 数字
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES 模块中的 __dirname 等效实现
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 配置
const CONFIG = {
  logFiles: [
    'all-build.log',
    'docs-build.log',
    'website-build.log',
  ],
  outputFile: 'broken-links.json',
};

/**
 * 日志级别枚举
 */
const LogLevel = {
  INFO: '[INFO]',
  WARN: '[WARN]',
  ERROR: '[ERROR]',
  DEBUG: '[DEBUG]',
};

/**
 * 日志输出函数
 */
function log(level, message) {
  console.log(`${level} ${message}`);
}

/**
 * 读取并合并日志文件
 */
function readLogFiles() {
  const logContent = [];

  for (const logFile of CONFIG.logFiles) {
    const filePath = path.join(process.cwd(), logFile);
    if (fs.existsSync(filePath)) {
      log(LogLevel.INFO, `读取日志文件: ${logFile}`);
      const content = fs.readFileSync(filePath, 'utf8');
      logContent.push({ file: logFile, content });
    }
  }

  return logContent;
}

/**
 * 解析构建日志中的失效链接
 *
 * astro-link-validator 的输出格式示例：
 * ✖ broken link: https://example.com/broken
 *   src/pages/index.astro:42:12
 *   status: 404
 */
function parseBrokenLinks(logContent) {
  const brokenLinks = [];

  for (const { file, content } of logContent) {
    const lines = content.split('\n');

    // 确定站点类型
    const site = file.includes('docs') ? 'docs' : 'website';

    let currentLink = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 检测失效链接标记（多种可能的格式）
      // 格式1: ✖ broken link: https://...
      if (line.includes('broken link') || line.includes('✖') && line.includes('http')) {
        const urlMatch = line.match(/(https?:\/\/[^\s\)]+)/);
        if (urlMatch) {
          currentLink = {
            url: urlMatch[1],
            site,
            file: '',
            line: '',
            status: 'Unknown',
          };
        }
      }

      // 格式2: Extract file path and line number
      // src/pages/index.astro:42:12 or .astro:42:12
      if (currentLink && (line.includes('.astro:') || line.includes('.md:'))) {
        const pathMatch = line.match(/([^\s]+\.(?:astro|md)):(\d+):/);
        if (pathMatch) {
          currentLink.file = pathMatch[1];
          currentLink.line = pathMatch[2];
        }
      }

      // 格式3: Extract status code
      // status: 404 or Status code: 404
      if (currentLink && line.toLowerCase().includes('status')) {
        const statusMatch = line.match(/(\d{3})/);
        if (statusMatch) {
          currentLink.status = statusMatch[1];

          // 完成解析，添加到列表
          if (currentLink.url) {
            brokenLinks.push({ ...currentLink });
            log(LogLevel.DEBUG, `发现失效链接: ${currentLink.url} (${currentLink.status})`);
          }
          currentLink = null;
        }
      }

      // 备用格式：直接在一行中包含所有信息
      // ✖ https://example.com/broken - 404 - src/pages/index.astro:42
      if (line.includes('✖') || line.includes('✗')) {
        const fullMatch = line.match(/✖\s*(https?:\/\/[^\s]+)[^0-9]*(\d{3})[^:]*:([^\s]+\.(?:astro|md)):(\d+)/);
        if (fullMatch) {
          brokenLinks.push({
            url: fullMatch[1],
            site,
            file: fullMatch[3],
            line: fullMatch[4],
            status: fullMatch[2],
          });
          log(LogLevel.DEBUG, `发现失效链接: ${fullMatch[1]} (${fullMatch[2]})`);
        }
      }
    }
  }

  return brokenLinks;
}

/**
 * 解析 astro-link-validator 的 JSON 输出（如果存在）
 */
function parseJsonOutput() {
  const jsonPath = path.join(process.cwd(), 'link-check-results.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      return data.brokenLinks || [];
    } catch (error) {
      log(LogLevel.WARN, `解析 JSON 输出失败: ${error.message}`);
    }
  }
  return [];
}

/**
 * 去重失效链接（避免重复报告）
 */
function deduplicateLinks(links) {
  const seen = new Set();
  const uniqueLinks = [];

  for (const link of links) {
    const key = `${link.url}-${link.site}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLinks.push(link);
    }
  }

  return uniqueLinks;
}

/**
 * 生成失效链接报告
 */
function generateReport(brokenLinks) {
  const total = brokenLinks.length;
  const bySite = brokenLinks.reduce((acc, link) => {
    acc[link.site] = (acc[link.site] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    bySite,
    links: brokenLinks,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 写入失效链接报告到 JSON 文件
 */
function writeReport(report) {
  fs.writeFileSync(
    CONFIG.outputFile,
    JSON.stringify(report, null, 2),
    'utf8'
  );
  log(LogLevel.INFO, `报告已写入: ${CONFIG.outputFile}`);
}

/**
 * 设置 GitHub Actions 输出变量
 */
function setGitHubActionsOutput(report) {
  const hasBrokenLinks = report.total > 0;

  // GitHub Actions 输出格式
  if (process.env.GITHUB_OUTPUT) {
    const output = [
      `has_broken_links=${hasBrokenLinks}`,
      `broken_links_count=${report.total}`,
    ].join('\n');

    fs.appendFileSync(process.env.GITHUB_OUTPUT, output);
    log(LogLevel.INFO, `GitHub Actions 输出变量已设置`);
  }

  // 设置环境变量（用于本地调试）
  process.env.HAS_BROKEN_LINKS = hasBrokenLinks.toString();
  process.env.BROKEN_LINKS_COUNT = report.total.toString();
}

/**
 * 主执行函数
 */
async function main() {
  log('INFO', '========================================');
  log('INFO', '   链接检查日志解析');
  log('INFO', '========================================');
  log('INFO', `开始时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  log('INFO', '');

  // 尝试解析 JSON 输出
  let brokenLinks = parseJsonOutput();

  // 如果没有 JSON 输出，则解析构建日志
  if (brokenLinks.length === 0) {
    log(LogLevel.INFO, '解析构建日志...');
    const logContent = readLogFiles();

    if (logContent.length === 0) {
      log(LogLevel.WARN, '未找到构建日志文件');
      log(LogLevel.INFO, '  查找的文件: ' + CONFIG.logFiles.join(', '));
      brokenLinks = [];
    } else {
      brokenLinks = parseBrokenLinks(logContent);
    }
  } else {
    log(LogLevel.INFO, `从 JSON 文件读取到 ${brokenLinks.length} 个失效链接`);
  }

  // 去重
  const uniqueLinks = deduplicateLinks(brokenLinks);

  if (uniqueLinks.length > 0) {
    log(LogLevel.INFO, `发现 ${uniqueLinks.length} 个失效链接（去重后）`);
  } else {
    log(LogLevel.INFO, '未发现失效链接');
  }

  // 生成报告
  const report = generateReport(uniqueLinks);
  writeReport(report);

  // 设置 GitHub Actions 输出
  setGitHubActionsOutput(report);

  log('INFO', '');
  log('INFO', '========================================');
  log('INFO', '   检查结果汇总');
  log('INFO', '========================================');
  log('INFO', `总失效链接数: ${report.total}`);
  if (report.total > 0) {
    for (const [site, count] of Object.entries(report.bySite)) {
      log('INFO', `  - ${site}: ${count} 个`);
    }
  }
  log('INFO', '');

  // 返回退出码
  return report.total > 0 ? 1 : 0;
}

// 执行主函数
if (process.argv[1] === __filename) {
  main()
    .then((exitCode) => {
      process.exit(exitCode);
    })
    .catch((error) => {
      log(LogLevel.ERROR, `执行失败: ${error.message}`);
      console.error(error);
      process.exit(1);
    });
}

export { main, parseBrokenLinks, generateReport };
