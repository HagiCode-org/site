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

function ctaLabel(locale: string | undefined) {
  return locale?.toLowerCase().startsWith('zh') ? '打开推广链接' : 'Open promotion';
}

function platformLabel(platform: string | null, locale: string | undefined) {
  if (platform) return platform;
  return locale?.toLowerCase().startsWith('zh') ? '推荐' : 'Promoted';
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

  if (!promotion || footerVisible) return null;

  return (
    <section className={className} data-promote-card aria-label={locale.toLowerCase().startsWith('zh') ? '推广信息' : 'Promotion'}>
      <div className="promote-card__badge">{platformLabel(promotion.platform, locale)}</div>
      <div className="promote-card__body">
        <h2 className="promote-card__title">{promotion.title}</h2>
        <p className="promote-card__description">{promotion.description}</p>
      </div>
      <a className="promote-card__cta" href={promotion.link} target="_blank" rel="noopener noreferrer" aria-label={`${ctaLabel(locale)}: ${promotion.title}`}>
        {ctaLabel(locale)}
      </a>
    </section>
  );
}
