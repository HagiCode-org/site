/**
 * ActivityMetricsChart 组件
 *
 * 使用 Chart.js 展示活动指标的历史趋势图
 *
 * 功能特性:
 * - 支持折线图 (line) 和面积图 (area) 两种类型
 * - 自动适配时间轴显示
 * - 支持 Tooltip 显示详细数值
 * - 响应式布局
 * - 平滑的曲线动画
 *
 * 使用示例:
 * ```tsx
 * <ActivityMetricsChart
 *   type="area"
 *   data={historyData}
 *   title="Docker Hub 拉取量"
 *   currentValue={2250}
 *   icon="🐳"
 *   color="#4ECDC4"
 *   dataKey="dockerHub"
 *   valueKey="pullCount"
 * />
 * ```
 */
import { useEffect, useRef, useState } from 'react';
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import styles from './ActivityMetricsSection.module.css';

// 注册 Chart.js 模块
Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

/** 图表类型 */
export type ChartType = 'line' | 'area';

/**
 * 历史数据条目
 *
 * @property date - ISO 8601 格式的日期字符串
 * @property dockerHub - Docker Hub 指标数据
 * @property clarity - Microsoft Clarity 指标数据
 */
export interface HistoryEntry {
  date: string;
  dockerHub?: {
    pullCount: number;
  };
  clarity?: {
    activeUsers: number;
    activeSessions: number;
  };
}

/**
 * ActivityMetricsChart 组件属性
 *
 * @property type - 图表类型：'line' 折线图 或 'area' 面积图
 * @property data - 历史数据数组
 * @property title - 图表标题
 * @property currentValue - 当前数值（显示在图表上方）
 * @property icon - 图标 emoji
 * @property color - 图表颜色（十六进制）
 * @property dataKey - 数据键名：'dockerHub' 或 'clarity'
 * @property valueKey - 数值键名：'pullCount', 'activeUsers' 或 'activeSessions'
 */
export interface ActivityMetricsChartProps {
  type: ChartType;
  data: HistoryEntry[];
  title: string;
  currentValue: number;
  icon: string;
  color: string;
  dataKey: 'dockerHub' | 'clarity';
  valueKey: 'pullCount' | 'activeUsers' | 'activeSessions';
}

interface ChartDataPoint {
  x: Date;
  y: number;
}

interface ThemeTokens {
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  surface: string;
}

function readThemeTokens(): ThemeTokens {
  if (typeof window === 'undefined') {
    return {
      text: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8',
      border: 'rgba(0, 0, 0, 0.1)',
      surface: '#FFFFFF',
    };
  }

  const computed = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) => computed.getPropertyValue(name).trim() || fallback;

  return {
    text: token('--color-text', '#0F172A'),
    textSecondary: token('--color-text-secondary', '#475569'),
    textMuted: token('--color-text-muted', '#94A3B8'),
    border: token('--color-border', 'rgba(0, 0, 0, 0.1)'),
    surface: token('--color-surface', '#FFFFFF'),
  };
}

/**
 * 格式化数值为中文显示
 */
function formatValue(val: number): string {
  if (val >= 100000000) return `${(val / 100000000).toFixed(1)}亿`;
  if (val >= 10000) return `${(val / 10000).toFixed(1)}万`;
  return val.toString();
}

/**
 * 活动指标图表组件
 */
export default function ActivityMetricsChart({
  type,
  data,
  title,
  currentValue,
  icon,
  color,
  dataKey,
  valueKey,
}: ActivityMetricsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [themeTokens, setThemeTokens] = useState<ThemeTokens>(() => readThemeTokens());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateThemeTokens = () => {
      setThemeTokens(readThemeTokens());
    };

    updateThemeTokens();

    const observer = new MutationObserver(updateThemeTokens);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 销毁旧图表
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // 准备图表数据
    const chartData: ChartDataPoint[] = data
      .filter((entry) => {
        const entryData = dataKey === 'dockerHub' ? entry.dockerHub : entry.clarity;
        const value = entryData?.[valueKey as keyof typeof entryData];
        return value !== undefined && Number(value) > 0;
      })
      .map((entry) => {
        const entryData = dataKey === 'dockerHub' ? entry.dockerHub : entry.clarity;
        const value = entryData?.[valueKey as keyof typeof entryData];
        return {
          x: new Date(entry.date),
          y: Number(value) || 0,
        };
      })
      .sort((a, b) => a.x.getTime() - b.x.getTime());

    // 如果没有数据，显示空状态
    if (chartData.length === 0) {
      return;
    }

    // 获取颜色配置
    const borderColor = color;
    const backgroundColor = type === 'area'
      ? `${color}33` // 添加透明度
      : 'transparent';

    // 创建图表
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map((d) => d.x),
        datasets: [
          {
            label: title,
            data: chartData.map((d) => d.y),
            borderColor,
            backgroundColor,
            fill: type === 'area',
            tension: 0.4, // 平滑曲线
            pointRadius: chartData.length > 15 ? 2 : 4,
            pointHoverRadius: 6,
            pointBackgroundColor: borderColor,
            pointBorderColor: themeTokens.surface,
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: themeTokens.surface,
            titleColor: themeTokens.text,
            bodyColor: themeTokens.textSecondary,
            borderColor: themeTokens.border,
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (items) => {
                if (items.length > 0) {
                  const date = new Date(items[0].label);
                  return date.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                }
                return '';
              },
              label: (item) => {
                return `${title}: ${formatValue(item.raw as number)}`;
              },
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: chartData.length > 30 ? 'week' : 'day',
              displayFormats: {
                day: 'MM/dd',
                week: 'MM/dd',
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              color: themeTokens.textSecondary,
              maxRotation: 0,
              maxTicksLimit: 8,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: themeTokens.border,
            },
            ticks: {
              color: themeTokens.textSecondary,
              callback: (value) => formatValue(value as number),
            },
          },
        },
      },
    });

    // 清理函数
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, type, color, dataKey, valueKey, title, themeTokens]);

  // 检查是否有有效数据
  const hasData = data.some((entry) => {
    const entryData = dataKey === 'dockerHub' ? entry.dockerHub : entry.clarity;
    const value = entryData?.[valueKey as keyof typeof entryData];
    return value !== undefined && Number(value) > 0;
  });

  if (!hasData) {
    return (
      <div className={styles.chartCardEmpty}>
        <div className={styles.chartEmptyIcon}>{icon}</div>
        <div className={styles.chartEmptyTitle}>{title}</div>
        <div className={styles.chartEmptyDescription}>
          暂无历史数据
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartCard}>
      {/* 标题和当前值 */}
      <div className={styles.chartHeader}>
        <div className={styles.chartMeta}>
          <span className={styles.chartHeaderIcon}>{icon}</span>
          <span className={styles.chartHeaderTitle}>{title}</span>
        </div>
        <div className={styles.chartCurrentValue} style={{ color }}>
          {formatValue(currentValue)}
        </div>
      </div>

      {/* 图表 */}
      <div className={styles.chartCanvasWrap}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
