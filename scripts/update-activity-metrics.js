#!/usr/bin/env node

/**
 * 活动数据更新脚本
 *
 * 从 Docker Hub 和 Microsoft Clarity API 获取活动数据，
 * 然后更新 activity-metrics.json 文件。
 *
 * 本地运行方式：
 * 1. 复制 .env.example 为 .env
 * 2. 在 .env 中填入 API 密钥
 * 3. 运行: node scripts/update-activity-metrics.js
 *
 * 或使用 npm script:
 * npm run update-metrics
 *
 * 环境变量：
 * - DOCKER_HUB_REPOSITORY: Docker Hub 仓库名称
 * - CLARITY_API_KEY: Microsoft Clarity API 密钥（用于数据导出）
 * - HAGICODE_CLARITY_PROJECT_ID: Hagicode 项目的 Clarity ID
 *
 * 可选环境变量：
 * - DOCKER_HUB_USERNAME: Docker Hub 用户名（如需认证）
 * - DOCKER_HUB_PASSWORD: Docker Hub 密码（如需认证）
 */

// 加载环境变量（优先从 .env 文件）
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES 模块中的 __filename 和 __dirname 等效实现
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 配置
const CONFIG = {
  dockerHub: {
    repository: process.env.DOCKER_HUB_REPOSITORY || 'newbe36524/hagicode',
    apiEndpoint: 'hub.docker.com',
    apiPath: (repo) => `/v2/repositories/${repo}`,
  },
  clarity: {
    apiKey: process.env.CLARITY_API_KEY,
    // Hagicode 项目的 Clarity ID（用于获取 Hagicode 的使用指标）
    hagicodeProjectId: process.env.HAGICODE_CLARITY_PROJECT_ID,
    apiEndpoint: 'www.clarity.ms',
    apiPath: '/api/v1/stats',
    dateRange: '3D',
  },
  outputFile: path.join(__dirname, '../apps/website/public/activity-metrics.json'),
};

// 错误处理器
class MetricsUpdateError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'MetricsUpdateError';
    this.cause = cause;
  }
}

/**
 * 发起 HTTPS 请求到 API
 */
function httpsRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new MetricsUpdateError(`解析 ${options.hostname} 响应失败`, error));
          }
        } else {
          reject(new MetricsUpdateError(`HTTP ${res.statusCode} 来自 ${options.hostname}: ${res.statusMessage}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new MetricsUpdateError(`${options.hostname} 请求失败`, error));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * 获取 Docker Hub 拉取次数
 */
async function fetchDockerHubMetrics() {
  console.log(`正在获取 Docker Hub 指标: ${CONFIG.dockerHub.repository}...`);

  const options = {
    hostname: CONFIG.dockerHub.apiEndpoint,
    path: CONFIG.dockerHub.apiPath(CONFIG.dockerHub.repository),
    method: 'GET',
    headers: {
      'User-Agent': 'Hagicode-Metrics-Updater/1.0',
    },
  };

  try {
    const response = await httpsRequest(options);
    console.log(`  ✓ 拉取次数: ${response.pull_count || 0}`);
    return {
      pullCount: response.pull_count || 0,
      repository: CONFIG.dockerHub.repository,
    };
  } catch (error) {
    console.error(`  ✗ 获取 Docker Hub 指标失败: ${error.message}`);
    // 错误时返回默认值
    return {
      pullCount: 0,
      repository: CONFIG.dockerHub.repository,
    };
  }
}

/**
 * 获取 Microsoft Clarity 指标
 *
 * API 文档: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api
 *
 * 说明:
 * - Microsoft Clarity Data Export API 使用 GET 请求
 * - 端点格式: GET https://www.clarity.ms/export-data/api/v1/project-live-insights
 * - 认证方式: Bearer token
 * - 每个项目每天最多 10 次 API 调用
 *
 * 请求参数:
 * - numOfDays: 1, 2, 或 3 (对应近24/48/72小时)
 * - metricType: 指定要获取的指标类型，如 Traffic
 *
 * Traffic 指标响应格式:
 * [
 *   {
 *     "metricName": "Traffic",
 *     "information": [
 *       {
 *         "totalSessionCount": "9554",
 *         "totalBotSessionCount": "8369",
 *         "distantUserCount": "189733",
 *         "PagesPerSessionPercentage": 1.0931,
 *         "OS": "Other"
 *       }
 *     ]
 *   }
 * ]
 */
async function fetchClarityMetrics() {
  if (!CONFIG.clarity.apiKey) {
    console.warn('Clarity API Key 未配置，使用默认值');
    console.warn('  如需 Clarity 数据，请在 .env 中设置 CLARITY_API_KEY');
    return {
      activeUsers: 0,
      activeSessions: 0,
      dateRange: '3Days',
    };
  }

  console.log(`正在获取 Clarity 指标...`);

  // Microsoft Clarity Data Export API 端点
  // 指定 metricType=Traffic 来获取流量指标数据
  const options = {
    hostname: CONFIG.clarity.apiEndpoint,
    path: `/export-data/api/v1/project-live-insights?numOfDays=3&metricType=Traffic`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CONFIG.clarity.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Hagicode-Metrics-Updater/1.0',
    },
  };

  try {
    const response = await httpsRequest(options);

    // Clarity API 返回数组格式
    if (!Array.isArray(response) || response.length === 0) {
      console.warn('  ⚠ API 返回数据为空');
      return {
        activeUsers: 0,
        activeSessions: 0,
        dateRange: '3Days',
      };
    }

    // 查找 Traffic 指标
    const trafficMetric = response.find((m) => m.metricName === 'Traffic');

    if (!trafficMetric) {
      console.warn('  ⚠ 未找到 Traffic 指标');
      console.warn('  返回的指标:', response.map((m) => m.metricName).join(', '));
      return {
        activeUsers: 0,
        activeSessions: 0,
        dateRange: '3Days',
      };
    }

    if (!Array.isArray(trafficMetric.information)) {
      console.warn('  ⚠ Traffic 指标没有 information 数组');
      return {
        activeUsers: 0,
        activeSessions: 0,
        dateRange: '3Days',
      };
    }

    console.log(`  Traffic 指标包含 ${trafficMetric.information.length} 个数据点`);

    // Traffic 指标通常只有一个汇总数据点，直接取第一个
    const trafficData = trafficMetric.information[0];

    // distinctUserCount 是去重用户数（注意拼写是 distinct 不是 distant）
    const users = parseInt(trafficData.distinctUserCount || '0', 10);
    // totalSessionCount 是总会话数
    const sessions = parseInt(trafficData.totalSessionCount || '0', 10);

    console.log(`  ✓ 活跃用户: ${users}`);
    console.log(`  ✓ 活跃会话: ${sessions}`);
    return {
      activeUsers: users,
      activeSessions: sessions,
      dateRange: '3Days',
    };
  } catch (error) {
    console.error(`  ✗ 获取 Clarity 指标失败: ${error.message}`);
    if (error.message.includes('401')) {
      console.error(`  提示: API Token 无效或已过期，请在 Clarity 项目设置中重新生成`);
    } else if (error.message.includes('403')) {
      console.error(`  提示: API Token 没有数据导出权限`);
    } else if (error.message.includes('429')) {
      console.error(`  提示: 已超过每日 API 调用限制（每项目每天最多 10 次）`);
    } else {
      console.error(`  API 端点: https://www.clarity.ms/export-data/api/v1/project-live-insights`);
    }
    // 错误时返回默认值
    return {
      activeUsers: 0,
      activeSessions: 0,
      dateRange: '3Days',
    };
  }
}

/**
 * 加载现有指标数据
 */
function loadExistingData() {
  const filePath = CONFIG.outputFile;
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`加载现有数据失败: ${error.message}`);
    }
  }
  return null;
}

/**
 * 将指标数据写入 JSON 文件
 */
/**
 * 写入指标数据到文件
 * 如果新数据为 0，则保留现有数据
 */
function writeMetricsData(data) {
  const dir = path.dirname(CONFIG.outputFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 如果文件已存在，检查是否需要保留现有数据
  if (fs.existsSync(CONFIG.outputFile)) {
    const existingData = JSON.parse(fs.readFileSync(CONFIG.outputFile, 'utf8'));

    // 如果 Clarity 数据为 0，保留现有数据
    if (data.clarity.activeUsers === 0 && data.clarity.activeSessions === 0) {
      console.log('\n⚠ Clarity 数据为空，保留现有数据');
      data.clarity = existingData.clarity;
    }
  }

  fs.writeFileSync(
    CONFIG.outputFile,
    JSON.stringify(data, null, 2),
    'utf8'
  );
  console.log(`\n数据已写入: ${CONFIG.outputFile}`);
}

/**
 * 主执行函数
 */
async function main() {
  console.log('========================================');
  console.log('   活动数据更新脚本');
  console.log('========================================');
  console.log(`开始时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  console.log('');

  // 检查环境变量
  console.log('配置信息:');
  console.log(`  Docker Hub 仓库: ${CONFIG.dockerHub.repository}`);
  console.log(`  Hagicode Clarity 项目 ID: ${CONFIG.clarity.hagicodeProjectId || '未配置'}`);
  console.log(`  Clarity API 密钥: ${CONFIG.clarity.apiKey ? '已配置' : '未配置'}`);
  console.log('');

  // 从所有数据源获取指标
  const dockerHubMetrics = await fetchDockerHubMetrics();
  const clarityMetrics = await fetchClarityMetrics();

  // 准备输出数据
  const metricsData = {
    lastUpdated: new Date().toISOString(),
    dockerHub: dockerHubMetrics,
    clarity: clarityMetrics,
  };

  // 写入文件
  writeMetricsData(metricsData);

  console.log('');
  console.log('========================================');
  console.log('   数据汇总');
  console.log('========================================');
  console.log(`Docker Hub 拉取次数: ${metricsData.dockerHub.pullCount}`);
  console.log(`活跃用户: ${metricsData.clarity.activeUsers}`);
  console.log(`活跃会话: ${metricsData.clarity.activeSessions}`);
  console.log(`更新时间: ${new Date(metricsData.lastUpdated).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  console.log('');
  console.log('✓ 指标更新完成！');
  console.log('========================================');

  return metricsData;
}

// 执行主函数 - ES 模块中使用 process.argv[1] === __filename 检查是否为主模块
if (process.argv[1] === __filename) {
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('');
      console.error('========================================');
      console.error('   指标更新失败');
      console.error('========================================');
      console.error(error);
      process.exit(1);
    });
}

export { main, fetchDockerHubMetrics, fetchClarityMetrics };
