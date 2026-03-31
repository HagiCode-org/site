import fallbackPayload from '@/data/live-broadcast.snapshot.json';

export const LIVE_BROADCAST_URL = 'https://index.hagicode.com/live-broadcast.json';
export const LIVE_BROADCAST_QR_IMAGE_URL = '/live/douyin-qrcode.png';
export const BEIJING_TIME_ZONE = 'Asia/Shanghai';
export const LIVE_BROADCAST_REFRESH_MS = 60_000;

export const LIVE_BROADCAST_STATES = ['upcoming', 'live', 'offline'] as const;
export const LIVE_BROADCAST_LOCALES = ['zh-CN', 'en'] as const;

export type LiveBroadcastState = (typeof LIVE_BROADCAST_STATES)[number];
export type LiveBroadcastLocale = (typeof LIVE_BROADCAST_LOCALES)[number];

interface LocalizedStringMap {
  'zh-CN': string;
  en: string;
}

interface LocaleBundle {
  eyebrow: string;
  title: string;
  description: string;
  status: Record<LiveBroadcastState, string>;
  stateCopy: Record<LiveBroadcastState, string>;
  reminder: {
    preview: string;
    live: string;
    cta: string;
  };
  time: {
    beijingLabel: string;
    localLabel: string;
    nextLabel: string;
    thursdayNote: string;
  };
}

export interface LiveBroadcastData {
  version: string;
  updatedAt: string;
  timezone: {
    iana: string;
    utcOffsetMinutes: number;
    label: LocalizedStringMap;
  };
  schedule: {
    activeWeekdays: number[];
    excludedWeekdays: number[];
    previewStartTime: string;
    startTime: string;
    endTime: string;
  };
  qrCode: {
    width: number;
    height: number;
    alt: LocalizedStringMap;
    fallbackLabel: LocalizedStringMap;
  };
  locales: Record<LiveBroadcastLocale, LocaleBundle>;
}

export interface LiveBroadcastLoadResult {
  data: LiveBroadcastData | null;
  error: Error | null;
}

export interface LiveBroadcastRuntime {
  state: LiveBroadcastState;
  reminderVisible: boolean;
  todayIsExcluded: boolean;
  sessionStartAt: Date;
  localStartLabel: string;
  beijingStartLabel: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid live broadcast payload: ${fieldName} must be a non-empty string`);
  }

  return value;
}

function readNumber(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`Invalid live broadcast payload: ${fieldName} must be a number`);
  }

  return value;
}

function readLocalizedStringMap(value: unknown, fieldName: string): LocalizedStringMap {
  if (!isRecord(value)) {
    throw new Error(`Invalid live broadcast payload: ${fieldName} must be an object`);
  }

  return {
    'zh-CN': readString(value['zh-CN'], `${fieldName}.zh-CN`),
    en: readString(value.en, `${fieldName}.en`),
  };
}

function readWeekdayArray(value: unknown, fieldName: string): number[] {
  if (!Array.isArray(value) || value.some((entry) => !Number.isInteger(entry) || entry < 0 || entry > 6)) {
    throw new Error(`Invalid live broadcast payload: ${fieldName} must be an array of weekdays`);
  }

  return [...value];
}

function readLocaleBundle(value: unknown, locale: LiveBroadcastLocale): LocaleBundle {
  if (!isRecord(value) || !isRecord(value.status) || !isRecord(value.stateCopy) || !isRecord(value.reminder) || !isRecord(value.time)) {
    throw new Error(`Invalid live broadcast payload: locales.${locale} must include status, stateCopy, reminder, and time`);
  }

  return {
    eyebrow: readString(value.eyebrow, `locales.${locale}.eyebrow`),
    title: readString(value.title, `locales.${locale}.title`),
    description: readString(value.description, `locales.${locale}.description`),
    status: {
      upcoming: readString(value.status.upcoming, `locales.${locale}.status.upcoming`),
      live: readString(value.status.live, `locales.${locale}.status.live`),
      offline: readString(value.status.offline, `locales.${locale}.status.offline`),
    },
    stateCopy: {
      upcoming: readString(value.stateCopy.upcoming, `locales.${locale}.stateCopy.upcoming`),
      live: readString(value.stateCopy.live, `locales.${locale}.stateCopy.live`),
      offline: readString(value.stateCopy.offline, `locales.${locale}.stateCopy.offline`),
    },
    reminder: {
      preview: readString(value.reminder.preview, `locales.${locale}.reminder.preview`),
      live: readString(value.reminder.live, `locales.${locale}.reminder.live`),
      cta: readString(value.reminder.cta, `locales.${locale}.reminder.cta`),
    },
    time: {
      beijingLabel: readString(value.time.beijingLabel, `locales.${locale}.time.beijingLabel`),
      localLabel: readString(value.time.localLabel, `locales.${locale}.time.localLabel`),
      nextLabel: readString(value.time.nextLabel, `locales.${locale}.time.nextLabel`),
      thursdayNote: readString(value.time.thursdayNote, `locales.${locale}.time.thursdayNote`),
    },
  };
}

function parseClock(clock: string, fieldName: string): number {
  const matched = /^(\d{2}):(\d{2})$/.exec(clock);

  if (!matched) {
    throw new Error(`Invalid live broadcast payload: ${fieldName} must use HH:MM`);
  }

  const hours = Number.parseInt(matched[1]!, 10);
  const minutes = Number.parseInt(matched[2]!, 10);

  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid live broadcast payload: ${fieldName} must stay within the 24-hour clock`);
  }

  return hours * 60 + minutes;
}

function resolveFormatterLocale(locale: LiveBroadcastLocale): string {
  return locale === 'zh-CN' ? 'zh-CN' : 'en-US';
}

function getResolvedTimeZone(timeZone?: string): string {
  if (timeZone && timeZone.trim().length > 0) {
    return timeZone;
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

function getBeijingClockParts(now: Date, utcOffsetMinutes: number) {
  const shifted = new Date(now.getTime() + utcOffsetMinutes * 60_000);

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(),
    minutesOfDay: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
}

function createUtcDateForBusinessClock(
  businessDate: ReturnType<typeof getBeijingClockParts>,
  utcOffsetMinutes: number,
  dayOffset: number,
  clockMinutes: number,
): Date {
  const hours = Math.floor(clockMinutes / 60);
  const minutes = clockMinutes % 60;

  return new Date(
    Date.UTC(businessDate.year, businessDate.month - 1, businessDate.day + dayOffset, hours, minutes) - utcOffsetMinutes * 60_000,
  );
}

function isActiveWeekday(schedule: LiveBroadcastData['schedule'], weekday: number): boolean {
  return schedule.activeWeekdays.includes(weekday) && !schedule.excludedWeekdays.includes(weekday);
}

function findNextSessionStart(data: LiveBroadcastData, now: Date): Date {
  const businessDate = getBeijingClockParts(now, data.timezone.utcOffsetMinutes);
  const startMinutes = parseClock(data.schedule.startTime, 'schedule.startTime');

  for (let dayOffset = 0; dayOffset <= 7; dayOffset += 1) {
    const weekday = new Date(
      Date.UTC(businessDate.year, businessDate.month - 1, businessDate.day + dayOffset),
    ).getUTCDay();

    if (!isActiveWeekday(data.schedule, weekday)) {
      continue;
    }

    const candidate = createUtcDateForBusinessClock(
      businessDate,
      data.timezone.utcOffsetMinutes,
      dayOffset,
      startMinutes,
    );

    if (candidate.getTime() > now.getTime()) {
      return candidate;
    }
  }

  return createUtcDateForBusinessClock(businessDate, data.timezone.utcOffsetMinutes, 1, startMinutes);
}

export function normalizeLiveBroadcastData(payload: unknown): LiveBroadcastData {
  if (!isRecord(payload) || !isRecord(payload.timezone) || !isRecord(payload.schedule) || !isRecord(payload.qrCode) || !isRecord(payload.locales)) {
    throw new Error('Invalid live broadcast payload: root must include timezone, schedule, qrCode, and locales');
  }

  const normalized: LiveBroadcastData = {
    version: readString(payload.version, 'version'),
    updatedAt: readString(payload.updatedAt, 'updatedAt'),
    timezone: {
      iana: readString(payload.timezone.iana, 'timezone.iana'),
      utcOffsetMinutes: readNumber(payload.timezone.utcOffsetMinutes, 'timezone.utcOffsetMinutes'),
      label: readLocalizedStringMap(payload.timezone.label, 'timezone.label'),
    },
    schedule: {
      activeWeekdays: readWeekdayArray(payload.schedule.activeWeekdays, 'schedule.activeWeekdays'),
      excludedWeekdays: readWeekdayArray(payload.schedule.excludedWeekdays, 'schedule.excludedWeekdays'),
      previewStartTime: readString(payload.schedule.previewStartTime, 'schedule.previewStartTime'),
      startTime: readString(payload.schedule.startTime, 'schedule.startTime'),
      endTime: readString(payload.schedule.endTime, 'schedule.endTime'),
    },
    qrCode: {
      width: readNumber(payload.qrCode.width, 'qrCode.width'),
      height: readNumber(payload.qrCode.height, 'qrCode.height'),
      alt: readLocalizedStringMap(payload.qrCode.alt, 'qrCode.alt'),
      fallbackLabel: readLocalizedStringMap(payload.qrCode.fallbackLabel, 'qrCode.fallbackLabel'),
    },
    locales: {
      'zh-CN': readLocaleBundle(payload.locales['zh-CN'], 'zh-CN'),
      en: readLocaleBundle(payload.locales.en, 'en'),
    },
  };

  parseClock(normalized.schedule.previewStartTime, 'schedule.previewStartTime');
  parseClock(normalized.schedule.startTime, 'schedule.startTime');
  parseClock(normalized.schedule.endTime, 'schedule.endTime');

  return normalized;
}

const BUNDLED_LIVE_BROADCAST_DATA = normalizeLiveBroadcastData(fallbackPayload);

export function getBundledLiveBroadcastData(): LiveBroadcastData {
  return BUNDLED_LIVE_BROADCAST_DATA;
}

export function formatLiveBroadcastTime(
  date: Date,
  locale: LiveBroadcastLocale,
  timeZone = getResolvedTimeZone(),
): string {
  return new Intl.DateTimeFormat(resolveFormatterLocale(locale), {
    weekday: 'short',
    hour: locale === 'zh-CN' ? '2-digit' : 'numeric',
    minute: '2-digit',
    hour12: locale !== 'zh-CN',
    timeZone,
  }).format(date);
}

export function getLiveBroadcastRuntime(
  data: LiveBroadcastData,
  locale: LiveBroadcastLocale,
  options: { now?: Date; timeZone?: string } = {},
): LiveBroadcastRuntime {
  const now = options.now ?? new Date();
  const timeZone = getResolvedTimeZone(options.timeZone);
  const previewStartMinutes = parseClock(data.schedule.previewStartTime, 'schedule.previewStartTime');
  const liveStartMinutes = parseClock(data.schedule.startTime, 'schedule.startTime');
  const liveEndMinutes = parseClock(data.schedule.endTime, 'schedule.endTime');
  const businessDate = getBeijingClockParts(now, data.timezone.utcOffsetMinutes);
  const activeToday = isActiveWeekday(data.schedule, businessDate.weekday);
  const todayIsExcluded = !activeToday && data.schedule.excludedWeekdays.includes(businessDate.weekday);
  const todayStartAt = createUtcDateForBusinessClock(
    businessDate,
    data.timezone.utcOffsetMinutes,
    0,
    liveStartMinutes,
  );

  let state: LiveBroadcastState = 'offline';

  if (activeToday && businessDate.minutesOfDay >= previewStartMinutes && businessDate.minutesOfDay < liveStartMinutes) {
    state = 'upcoming';
  } else if (activeToday && businessDate.minutesOfDay >= liveStartMinutes && businessDate.minutesOfDay < liveEndMinutes) {
    state = 'live';
  }

  const sessionStartAt = activeToday && businessDate.minutesOfDay < liveEndMinutes
    ? todayStartAt
    : findNextSessionStart(data, now);

  return {
    state,
    reminderVisible: state !== 'offline',
    todayIsExcluded,
    sessionStartAt,
    localStartLabel: formatLiveBroadcastTime(sessionStartAt, locale, timeZone),
    beijingStartLabel: formatLiveBroadcastTime(sessionStartAt, locale, data.timezone.iana || BEIJING_TIME_ZONE),
  };
}

export async function fetchLiveBroadcastData(fetcher: typeof fetch = fetch): Promise<LiveBroadcastData> {
  const response = await fetcher(LIVE_BROADCAST_URL, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load live broadcast data: ${response.status}`);
  }

  return normalizeLiveBroadcastData(await response.json());
}

export async function loadLiveBroadcastData(fetcher: typeof fetch = fetch): Promise<LiveBroadcastLoadResult> {
  try {
    return {
      data: await fetchLiveBroadcastData(fetcher),
      error: null,
    };
  } catch (error) {
    return {
      data: BUNDLED_LIVE_BROADCAST_DATA,
      error: error instanceof Error ? error : new Error('Failed to load canonical live broadcast data'),
    };
  }
}
