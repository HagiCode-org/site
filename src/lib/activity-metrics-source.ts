import type { HistoryEntry } from '@/components/home/ActivityMetricsChart';

export const ACTIVITY_METRICS_URL = 'https://index.hagicode.com/activity-metrics.json';
export const ACTIVITY_METRICS_TIME_RANGES = [7, 30, 90] as const;

export type ActivityMetricsTimeRange = (typeof ACTIVITY_METRICS_TIME_RANGES)[number];

export interface ActivityMetricsData {
  lastUpdated: string;
  dockerHub: {
    pullCount: number;
    repository: string;
  };
  clarity: {
    activeUsers: number;
    activeSessions: number;
    dateRange: string;
  };
  history: HistoryEntry[];
}

export interface ActivityMetricsLoadResult {
  data: ActivityMetricsData | null;
  error: Error | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readNumber(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`Invalid activity metrics payload: ${fieldName} must be a number`);
  }

  return value;
}

function readString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid activity metrics payload: ${fieldName} must be a string`);
  }

  return value;
}

function normalizeHistoryEntry(entry: unknown, index: number): HistoryEntry {
  if (!isRecord(entry)) {
    throw new Error(`Invalid activity metrics payload: history[${index}] must be an object`);
  }

  const normalized: HistoryEntry = {
    date: readString(entry.date, `history[${index}].date`),
  };

  if (entry.dockerHub !== undefined) {
    if (!isRecord(entry.dockerHub)) {
      throw new Error(`Invalid activity metrics payload: history[${index}].dockerHub must be an object`);
    }

    normalized.dockerHub = {
      pullCount: readNumber(entry.dockerHub.pullCount, `history[${index}].dockerHub.pullCount`),
    };
  }

  if (entry.clarity !== undefined) {
    if (!isRecord(entry.clarity)) {
      throw new Error(`Invalid activity metrics payload: history[${index}].clarity must be an object`);
    }

    normalized.clarity = {
      activeUsers: readNumber(entry.clarity.activeUsers, `history[${index}].clarity.activeUsers`),
      activeSessions: readNumber(entry.clarity.activeSessions, `history[${index}].clarity.activeSessions`),
    };
  }

  return normalized;
}

export function normalizeActivityMetricsData(payload: unknown): ActivityMetricsData {
  if (!isRecord(payload)) {
    throw new Error('Invalid activity metrics payload: root must be an object');
  }

  if (!isRecord(payload.dockerHub)) {
    throw new Error('Invalid activity metrics payload: dockerHub must be an object');
  }

  if (!isRecord(payload.clarity)) {
    throw new Error('Invalid activity metrics payload: clarity must be an object');
  }

  const history = payload.history === undefined
    ? []
    : Array.isArray(payload.history)
      ? payload.history.map((entry, index) => normalizeHistoryEntry(entry, index))
      : (() => {
          throw new Error('Invalid activity metrics payload: history must be an array');
        })();

  return {
    lastUpdated: readString(payload.lastUpdated, 'lastUpdated'),
    dockerHub: {
      pullCount: readNumber(payload.dockerHub.pullCount, 'dockerHub.pullCount'),
      repository: readString(payload.dockerHub.repository, 'dockerHub.repository'),
    },
    clarity: {
      activeUsers: readNumber(payload.clarity.activeUsers, 'clarity.activeUsers'),
      activeSessions: readNumber(payload.clarity.activeSessions, 'clarity.activeSessions'),
      dateRange: readString(payload.clarity.dateRange, 'clarity.dateRange'),
    },
    history,
  };
}

export async function fetchActivityMetricsData(
  fetcher: typeof fetch = fetch,
): Promise<ActivityMetricsData> {
  const response = await fetcher(ACTIVITY_METRICS_URL, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load activity metrics: ${response.status}`);
  }

  return normalizeActivityMetricsData(await response.json());
}

export async function loadActivityMetricsData(
  fetcher: typeof fetch = fetch,
): Promise<ActivityMetricsLoadResult> {
  try {
    return {
      data: await fetchActivityMetricsData(fetcher),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error
        ? error
        : new Error('Failed to load canonical activity metrics'),
    };
  }
}

export function filterActivityMetricsHistory(
  history: HistoryEntry[] | undefined,
  timeRange: ActivityMetricsTimeRange,
  now = new Date(),
): HistoryEntry[] {
  if (!history || history.length === 0) {
    return [];
  }

  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - timeRange);

  return history
    .filter((entry) => {
      const entryDate = new Date(entry.date);
      return !Number.isNaN(entryDate.getTime()) && entryDate >= cutoffDate;
    })
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
}
