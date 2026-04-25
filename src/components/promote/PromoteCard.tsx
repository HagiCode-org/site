import { useEffect, useState } from 'react';

import { loadFirstActivePromotion, type ActivePromotion } from '@/lib/promote-loader';

type PromoteCardProps = {
  locale?: string;
  fetchImpl?: typeof fetch;
  className?: string;
  initialPromotion?: ActivePromotion | null;
  footerSelector?: string;
};

const DEFAULT_FOOTER_SELECTOR = 'footer, [data-footer-root], .footer';
const DISMISSED_PROMOTIONS_STORAGE_KEY = 'hagicode:promote-card:dismissed-signature';

function platformLabel(platform: string | null, locale: string | undefined) {
  if (platform) return platform;
  return locale?.toLowerCase().startsWith('zh') ? '推荐' : 'Promoted';
}

function closeLabel(locale: string | undefined) {
  return locale?.toLowerCase().startsWith('zh') ? '关闭推广信息' : 'Dismiss promotion';
}

function readDismissedSignature(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(DISMISSED_PROMOTIONS_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeDismissedSignature(signature: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DISMISSED_PROMOTIONS_STORAGE_KEY, signature);
  } catch {
    // Ignore unavailable storage; closing still works for this render.
  }
}

export function PromoteCard({
  locale = 'en',
  fetchImpl,
  className,
  initialPromotion = null,
  footerSelector = DEFAULT_FOOTER_SELECTOR,
}: PromoteCardProps) {
  const [promotion, setPromotion] = useState<ActivePromotion | null>(initialPromotion);
  const [footerVisible, setFooterVisible] = useState(false);
  const [dismissedSignature, setDismissedSignature] = useState<string | null>(() => readDismissedSignature());

  useEffect(() => {
    if (initialPromotion) return;
    let cancelled = false;

    void loadFirstActivePromotion({ locale, fetchImpl }).then((nextPromotion) => {
      if (!cancelled) setPromotion(nextPromotion);
    });

    return () => {
      cancelled = true;
    };
  }, [fetchImpl, initialPromotion, locale]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const footer = document.querySelector<HTMLElement>(footerSelector);
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.01 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [footerSelector]);

  const promotionSignature = promotion?.id ?? null;
  const dismissed = Boolean(promotionSignature && dismissedSignature === promotionSignature);

  if (!promotion || footerVisible || dismissed) return null;

  const openPromotion = () => {
    window.open(promotion.link, '_blank', 'noopener,noreferrer');
  };

  const dismissPromotion = () => {
    if (!promotionSignature) return;
    writeDismissedSignature(promotionSignature);
    setDismissedSignature(promotionSignature);
  };

  return (
    <section className={className} data-promote-card aria-label={locale.toLowerCase().startsWith('zh') ? '推广信息' : 'Promotion'}>
      <div className="promote-card__inner">
        <button type="button" className="promote-card__close" onClick={dismissPromotion} aria-label={closeLabel(locale)}>
          <span aria-hidden="true">×</span>
        </button>
        <button type="button" className="promote-card__surface" onClick={openPromotion} aria-label={`${promotion.ctaLabel}: ${promotion.title}`}>
          <span className="promote-card__body">
            <span className="promote-card__badge">{platformLabel(promotion.platform, locale)}</span>
            <span className="promote-card__title">{promotion.title}</span>
            <span className="promote-card__description">{promotion.description}</span>
          </span>
          <span className="promote-card__cta" aria-hidden="true">{promotion.ctaLabel}</span>
        </button>
      </div>
    </section>
  );
}
