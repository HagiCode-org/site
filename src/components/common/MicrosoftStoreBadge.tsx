import React from 'react';

import {
  resolveMicrosoftStoreBadgeLanguage,
  resolveMicrosoftStoreProductId,
} from '@/lib/shared/microsoft-store-badge';

interface MicrosoftStoreBadgeProps {
  href?: string;
  locale?: string;
  size?: 'small' | 'large';
  productName?: string;
  ariaLabel?: string;
  className?: string;
  badgeClassName?: string;
  badgeAttributes?: Record<string, string>;
}

export default function MicrosoftStoreBadge({
  href,
  locale = 'en-US',
  size = 'small',
  productName = 'HagiCode',
  ariaLabel,
  className,
  badgeClassName,
  badgeAttributes,
}: MicrosoftStoreBadgeProps) {
  return (
    <span className={className}>
      {React.createElement('ms-store-badge', {
        ...badgeAttributes,
        className: badgeClassName,
        productid: resolveMicrosoftStoreProductId(href),
        productname: productName,
        'window-mode': 'direct',
        theme: 'auto',
        size,
        language: resolveMicrosoftStoreBadgeLanguage(locale),
        animation: 'on',
        'aria-label': ariaLabel,
        title: ariaLabel,
      })}
    </span>
  );
}
