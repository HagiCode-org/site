import styles from './LiveBroadcastFloatingReminder.module.css';

import type { LiveBroadcastLocale, LiveBroadcastState } from '@/lib/live-broadcast-source';

interface LiveBroadcastFloatingReminderProps {
  locale: LiveBroadcastLocale;
  state: LiveBroadcastState;
  previewCopy: string;
  liveCopy: string;
  ctaLabel: string;
  qrUrl: string;
}

export default function LiveBroadcastFloatingReminder({
  locale,
  state,
  previewCopy,
  liveCopy,
  ctaLabel,
  qrUrl,
}: LiveBroadcastFloatingReminderProps) {
  if (state === 'offline') {
    return null;
  }

  const body = state === 'live' ? liveCopy : previewCopy;
  const kicker = locale === 'zh-CN'
    ? state === 'live' ? 'Hagi 正在直播' : 'Hagi 今晚开播'
    : state === 'live' ? 'Hagi is live' : 'Hagi goes live tonight';

  return (
    <aside className={styles.reminder} aria-live="polite" data-live-broadcast-reminder={state}>
      <div className={styles.shell}>
        <div className={styles.signal} aria-hidden="true">
          <span className={styles.signalDot} />
          <span className={styles.signalRing} />
        </div>

        <div className={styles.copy}>
          <p className={styles.kicker}>{kicker}</p>
          <p className={styles.body}>{body}</p>
        </div>

        <a className={styles.cta} href={qrUrl} target="_blank" rel="noreferrer">
          {ctaLabel}
        </a>
      </div>
    </aside>
  );
}
