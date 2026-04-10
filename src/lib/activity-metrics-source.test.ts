import { describe, expect, it, vi } from 'vitest';
import {
  ACTIVITY_METRICS_URL,
  fetchActivityMetricsData,
  filterActivityMetricsHistory,
  loadActivityMetricsData,
  normalizeActivityMetricsData,
} from './activity-metrics-source';

const activityMetricsFixture = {
  lastUpdated: '2026-03-24T01:16:43.021Z',
  dockerHub: {
    pullCount: 4747,
    repository: 'newbe36524/hagicode',
  },
  clarity: {
    activeUsers: 178,
    activeSessions: 197,
    dateRange: '3Days',
  },
  history: [
    {
      date: '2026-03-20T01:18:24.386Z',
      dockerHub: {
        pullCount: 4700,
      },
      clarity: {
        activeUsers: 150,
        activeSessions: 165,
      },
    },
    {
      date: '2026-03-24T01:16:43.021Z',
      dockerHub: {
        pullCount: 4747,
      },
      clarity: {
        activeUsers: 178,
        activeSessions: 197,
      },
    },
  ],
};

function createJsonResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue(body),
  };
}

describe('activity metrics source', () => {
  it('requests the canonical activity metrics URL and returns normalized data', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(createJsonResponse(structuredClone(activityMetricsFixture)) as unknown as Awaited<ReturnType<typeof fetch>>);

    const data = await fetchActivityMetricsData(fetchMock);

    expect(fetchMock).toHaveBeenCalledWith(ACTIVITY_METRICS_URL, {
      headers: {
        accept: 'application/json',
      },
    });
    expect(data.dockerHub.pullCount).toBe(4747);
    expect(data.history).toHaveLength(2);
  });

  it('surfaces request failures from the canonical source', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 503,
      json: vi.fn(),
    } as unknown as Awaited<ReturnType<typeof fetch>>);

    await expect(fetchActivityMetricsData(fetchMock)).rejects.toThrow('Failed to load activity metrics: 503');
  });

  it('returns an empty history array when the payload omits history', async () => {
    const data = normalizeActivityMetricsData({
      lastUpdated: '2026-03-24T01:16:43.021Z',
      dockerHub: {
        pullCount: 4747,
        repository: 'newbe36524/hagicode',
      },
      clarity: {
        activeUsers: 178,
        activeSessions: 197,
        dateRange: '3Days',
      },
    });

    expect(data.history).toEqual([]);
  });

  it('wraps rejected requests for the section fallback path', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error('network down'));

    const result = await loadActivityMetricsData(fetchMock);

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe('network down');
  });

  it('treats invalid canonical payloads as fallback errors instead of returning partial data', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(createJsonResponse({
        lastUpdated: '2026-03-24T01:16:43.021Z',
        dockerHub: {
          pullCount: 4747,
          repository: 'newbe36524/hagicode',
        },
      }) as unknown as Awaited<ReturnType<typeof fetch>>);

    const result = await loadActivityMetricsData(fetchMock);

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe('Invalid activity metrics payload: clarity must be an object');
  });

  it('filters history by the selected time range and ignores invalid dates', () => {
    const filtered = filterActivityMetricsHistory(
      [
        ...activityMetricsFixture.history,
        {
          date: 'invalid-date',
          dockerHub: {
            pullCount: 1,
          },
        },
      ],
      7,
      new Date('2026-03-24T12:00:00.000Z'),
    );

    expect(filtered).toHaveLength(2);
    expect(filtered[0]?.date).toBe('2026-03-20T01:18:24.386Z');
    expect(filtered[1]?.date).toBe('2026-03-24T01:16:43.021Z');
  });
});
