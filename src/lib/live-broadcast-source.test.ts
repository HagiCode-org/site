import { describe, expect, it, vi } from 'vitest';

import {
  LIVE_BROADCAST_QR_IMAGE_URL,
  LIVE_BROADCAST_URL,
  fetchLiveBroadcastData,
  formatLiveBroadcastTime,
  getBundledLiveBroadcastData,
  getLiveBroadcastRuntime,
  loadLiveBroadcastData,
  normalizeLiveBroadcastData,
} from './live-broadcast-source';

const fixture = {
  version: '1.0.0',
  updatedAt: '2026-03-31T00:00:00.000Z',
  timezone: {
    iana: 'Asia/Shanghai',
    utcOffsetMinutes: 480,
    label: {
      'zh-CN': '北京时间（UTC+8）',
      en: 'Beijing Time (UTC+8)',
    },
  },
  schedule: {
    activeWeekdays: [0, 1, 2, 3, 5, 6],
    excludedWeekdays: [4],
    previewStartTime: '18:00',
    startTime: '20:00',
    endTime: '21:00',
  },
  qrCode: {
    width: 201,
    height: 213,
    alt: {
      'zh-CN': 'Hagicode 抖音直播二维码',
      en: 'Douyin QR code for the Hagicode live broadcast',
    },
    fallbackLabel: {
      'zh-CN': '二维码暂时不可用',
      en: 'QR image unavailable',
    },
  },
  locales: {
    'zh-CN': {
      eyebrow: '直播预告',
      title: 'Hagicode 每日直播编程间',
      description: '每天 20:00 按北京时间开播，扫码进入抖音直播间。周四固定停播。',
      status: {
        upcoming: '即将开始',
        live: '正在直播',
        offline: '暂未开播',
      },
      stateCopy: {
        upcoming: '今晚 20:00 开播，18:00 起会显示直播提醒。',
        live: '直播已开始，扫码即可进入抖音直播间。',
        offline: '当前不在直播窗口，页面会自动显示下一场时间。',
      },
      reminder: {
        preview: '直播即将开始',
        live: '正在直播，扫码观看',
        cta: '打开二维码',
      },
      time: {
        beijingLabel: '北京时间',
        localLabel: '你的本地时间',
        nextLabel: '下一场',
        thursdayNote: '周四固定停播',
      },
    },
    en: {
      eyebrow: 'Live Broadcast',
      title: 'Daily Hagi Live Coding Room',
      description: 'The recurring Hagi coding stream starts at 20:00 Beijing time. Scan the Douyin QR code to join. Thursday stays offline.',
      status: {
        upcoming: 'Upcoming',
        live: 'Live now',
        offline: 'Offline',
      },
      stateCopy: {
        upcoming: 'The room starts at 20:00 Beijing time and shows a reminder from 18:00.',
        live: 'The stream is live right now. Scan the QR code to join the room.',
        offline: 'The room is outside its active window right now. The next start time stays visible below.',
      },
      reminder: {
        preview: 'Live starts soon',
        live: 'Now live, scan to watch',
        cta: 'Open QR',
      },
      time: {
        beijingLabel: 'Beijing time',
        localLabel: 'Your local time',
        nextLabel: 'Next stream',
        thursdayNote: 'Thursday is the weekly off day',
      },
    },
  },
};

describe('live broadcast source', () => {
  it('requests the canonical live broadcast URL and normalizes the payload', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(structuredClone(fixture)),
    } as unknown as Awaited<ReturnType<typeof fetch>>);

    const data = await fetchLiveBroadcastData(fetchMock);

    expect(fetchMock).toHaveBeenCalledWith(LIVE_BROADCAST_URL, {
      headers: {
        accept: 'application/json',
      },
    });
    expect('imageUrl' in data.qrCode).toBe(false);
    expect(data.locales.en.title).toBe('Daily Hagi Live Coding Room');
  });

  it('falls back to the bundled snapshot when the canonical endpoint is unavailable', async () => {
    const result = await loadLiveBroadcastData(vi.fn<typeof fetch>().mockRejectedValue(new Error('network down')));

    expect(result.data).not.toBeNull();
    expect(result.error?.message).toBe('network down');
    expect(result.data?.locales.en.title).toBe('Daily Hagi Live Coding Room');
  });

  it('keeps a bundled snapshot ready for static rendering', () => {
    expect('imageUrl' in getBundledLiveBroadcastData().qrCode).toBe(false);
    expect(LIVE_BROADCAST_QR_IMAGE_URL).toBe('/live/douyin-qrcode.png');
  });

  it('switches between preview, live, offline, and Thursday-offline states on Beijing time boundaries', () => {
    const data = normalizeLiveBroadcastData(fixture);

    expect(getLiveBroadcastRuntime(data, 'en', {
      now: new Date('2026-03-31T10:00:00.000Z'),
      timeZone: 'Asia/Shanghai',
    }).state).toBe('upcoming');

    expect(getLiveBroadcastRuntime(data, 'en', {
      now: new Date('2026-03-31T12:00:00.000Z'),
      timeZone: 'Asia/Shanghai',
    }).state).toBe('live');

    expect(getLiveBroadcastRuntime(data, 'en', {
      now: new Date('2026-03-31T13:00:00.000Z'),
      timeZone: 'Asia/Shanghai',
    }).state).toBe('offline');

    const thursday = getLiveBroadcastRuntime(data, 'en', {
      now: new Date('2026-04-02T11:00:00.000Z'),
      timeZone: 'Asia/Shanghai',
    });

    expect(thursday.state).toBe('offline');
    expect(thursday.todayIsExcluded).toBe(true);
    expect(thursday.reminderVisible).toBe(false);
  });

  it('formats one non-UTC+8 example and one UTC+8 example from the same session start', () => {
    const startAt = new Date('2026-03-31T12:00:00.000Z');

    expect(formatLiveBroadcastTime(startAt, 'en', 'America/Los_Angeles')).toContain('5:00 AM');
    expect(formatLiveBroadcastTime(startAt, 'zh-CN', 'Asia/Shanghai')).toContain('20:00');
  });
});
