import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  LIVE_BROADCAST_QR_IMAGE_URL,
  type LiveBroadcastData,
  type LiveBroadcastRuntime,
} from '@/lib/live-broadcast-source';
import LiveBroadcastSection, { LiveBroadcastSectionBody } from './LiveBroadcastSection';

const data: LiveBroadcastData = {
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

const previewRuntime: LiveBroadcastRuntime = {
  state: 'upcoming',
  reminderVisible: true,
  todayIsExcluded: false,
  sessionStartAt: new Date('2026-03-31T12:00:00.000Z'),
  localStartLabel: 'Tue 5:00 AM',
  beijingStartLabel: 'Tue 8:00 PM',
};

const offlineThursdayRuntime: LiveBroadcastRuntime = {
  state: 'offline',
  reminderVisible: false,
  todayIsExcluded: true,
  sessionStartAt: new Date('2026-04-03T12:00:00.000Z'),
  localStartLabel: 'Fri 5:00 AM',
  beijingStartLabel: 'Fri 8:00 PM',
};

describe('LiveBroadcastSectionBody markup', () => {
  it('stays hidden by default when the live broadcast feature flag is disabled', () => {
    const markup = renderToStaticMarkup(<LiveBroadcastSection locale="en" initialData={data} />);

    expect(markup).toBe('');
  });

  it('renders the static live broadcast card when the feature flag is explicitly enabled', () => {
    const markup = renderToStaticMarkup(
      <LiveBroadcastSection locale="en" enabled={true} initialData={data} />,
    );

    expect(markup).toContain('Daily Hagi Live Coding Room');
    expect(markup).toContain('Open QR');
    expect(markup).toContain(LIVE_BROADCAST_QR_IMAGE_URL);
  });

  it('keeps the module usable when the QR image is unavailable', () => {
    const markup = renderToStaticMarkup(
      <LiveBroadcastSectionBody
        data={data}
        locale="en"
        runtime={previewRuntime}
        qrAvailable={false}
      />,
    );

    expect(markup).toContain('Daily Hagi Live Coding Room');
    expect(markup).toContain('QR image unavailable');
    expect(markup).toContain('data-live-broadcast-reminder="upcoming"');
  });

  it('stays offline on Thursday without rendering an active reminder', () => {
    const markup = renderToStaticMarkup(
      <LiveBroadcastSectionBody
        data={data}
        locale="en"
        runtime={offlineThursdayRuntime}
        qrAvailable={true}
      />,
    );

    expect(markup).toContain('Thursday is the weekly off day');
    expect(markup).not.toContain('data-live-broadcast-reminder=');
  });

  it('publishes the site-owned QR asset at the shared live path', async () => {
    const { access } = await import('node:fs/promises');

    await access(new URL('../../../public/live/douyin-qrcode.png', import.meta.url));
  });

  it('keeps the implementation local to the site repository', async () => {
    const { readFile } = await import('node:fs/promises');
    const [sectionSource, reminderSource] = await Promise.all([
      readFile(new URL('./LiveBroadcastSection.tsx', import.meta.url), 'utf8'),
      readFile(new URL('./LiveBroadcastFloatingReminder.tsx', import.meta.url), 'utf8'),
    ]);

    const combined = `${sectionSource}
${reminderSource}`;
    expect(combined).not.toContain('repos/docs');
    expect(combined).not.toContain('@shared');
  });
});
