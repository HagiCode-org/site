import { useEffect, useState } from 'react';

import { FEATURE_LIVE_BROADCAST_ENABLED } from '@/config/features';
import {
  LIVE_BROADCAST_REFRESH_MS,
  LIVE_BROADCAST_QR_IMAGE_URL,
  getLiveBroadcastRuntime,
  loadLiveBroadcastData,
  type LiveBroadcastData,
  type LiveBroadcastLocale,
  type LiveBroadcastRuntime,
} from '@/lib/live-broadcast-source';
import LiveBroadcastFloatingReminder from './LiveBroadcastFloatingReminder';
import styles from './LiveBroadcastSection.module.css';

interface LiveBroadcastSectionProps {
  locale: LiveBroadcastLocale;
  enabled?: boolean;
  initialData?: LiveBroadcastData | null;
}

interface LiveBroadcastSectionBodyProps {
  data: LiveBroadcastData;
  locale: LiveBroadcastLocale;
  runtime: LiveBroadcastRuntime;
  qrAvailable: boolean;
  onQrError?: () => void;
}

export function LiveBroadcastSectionBody({
  data,
  locale,
  runtime,
  qrAvailable,
  onQrError,
}: LiveBroadcastSectionBodyProps) {
  const bundle = data.locales[locale];
  const stateCopy = runtime.todayIsExcluded
    ? `${bundle.stateCopy.offline} ${bundle.time.thursdayNote}`
    : bundle.stateCopy[runtime.state];

  return (
    <>
      <section className={styles.section} data-live-broadcast-state={runtime.state}>
        <div className="container">
          <div className={styles.card}>
            <div className={styles.copyColumn}>
              <p className={styles.eyebrow}>{bundle.eyebrow}</p>

              <div className={styles.headerRow}>
                <h2 className={styles.title}>{bundle.title}</h2>
                <span className={styles.statusPill}>{bundle.status[runtime.state]}</span>
              </div>

              <p className={styles.description}>{bundle.description}</p>
              <p className={styles.stateCopy}>{stateCopy}</p>

              <dl className={styles.scheduleGrid}>
                <div className={styles.scheduleCard}>
                  <dt>{bundle.time.nextLabel}</dt>
                  <dd>{runtime.localStartLabel}</dd>
                </div>
                <div className={styles.scheduleCard}>
                  <dt>{bundle.time.localLabel}</dt>
                  <dd>{runtime.localStartLabel}</dd>
                </div>
                <div className={styles.scheduleCard}>
                  <dt>{bundle.time.beijingLabel}</dt>
                  <dd>{runtime.beijingStartLabel}</dd>
                </div>
              </dl>
            </div>

            <div className={styles.qrColumn}>
              <div className={styles.qrFrame}>
                {qrAvailable ? (
                  <img
                    src={LIVE_BROADCAST_QR_IMAGE_URL}
                    alt={data.qrCode.alt[locale]}
                    width={data.qrCode.width}
                    height={data.qrCode.height}
                    loading="lazy"
                    className={styles.qrImage}
                    onError={onQrError}
                  />
                ) : (
                  <div className={styles.qrFallback} role="status">
                    <span className={styles.qrFallbackIcon} aria-hidden="true">▦</span>
                    <span>{data.qrCode.fallbackLabel[locale]}</span>
                  </div>
                )}
              </div>

              <a className={styles.qrCta} href={LIVE_BROADCAST_QR_IMAGE_URL} target="_blank" rel="noreferrer">
                {bundle.reminder.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <LiveBroadcastFloatingReminder
        locale={locale}
        state={runtime.state}
        previewCopy={bundle.reminder.preview}
        liveCopy={bundle.reminder.live}
        ctaLabel={bundle.reminder.cta}
        qrUrl={LIVE_BROADCAST_QR_IMAGE_URL}
      />
    </>
  );
}

export default function LiveBroadcastSection({
  locale,
  enabled = FEATURE_LIVE_BROADCAST_ENABLED,
  initialData = null,
}: LiveBroadcastSectionProps) {
  const [data, setData] = useState<LiveBroadcastData | null>(enabled ? initialData : null);
  const [runtime, setRuntime] = useState<LiveBroadcastRuntime | null>(
    enabled && initialData ? getLiveBroadcastRuntime(initialData, locale) : null,
  );
  const [qrAvailable, setQrAvailable] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setRuntime(null);
      setQrAvailable(true);
      return;
    }

    let cancelled = false;
    let intervalId: number | undefined;

    const applyData = (nextData: LiveBroadcastData) => {
      setData(nextData);
      setRuntime(getLiveBroadcastRuntime(nextData, locale));
      setQrAvailable(true);

      if (typeof intervalId !== 'undefined') {
        window.clearInterval(intervalId);
      }

      intervalId = window.setInterval(() => {
        setRuntime(getLiveBroadcastRuntime(nextData, locale));
      }, LIVE_BROADCAST_REFRESH_MS);
    };

    if (initialData) {
      applyData(initialData);
    }

    const load = async () => {
      const result = await loadLiveBroadcastData();

      if (cancelled || !result.data) {
        return;
      }

      applyData(result.data);
    };

    load();

    return () => {
      cancelled = true;
      if (typeof intervalId !== 'undefined') {
        window.clearInterval(intervalId);
      }
    };
  }, [enabled, initialData, locale]);

  if (!enabled || !data || !runtime) {
    return null;
  }

  return (
    <LiveBroadcastSectionBody
      data={data}
      locale={locale}
      runtime={runtime}
      qrAvailable={qrAvailable}
      onQrError={() => setQrAvailable(false)}
    />
  );
}
