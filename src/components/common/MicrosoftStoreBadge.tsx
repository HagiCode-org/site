import React, { useEffect, useRef } from 'react';

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
  const badgeRef = useRef<HTMLElement>(null);

  // ms-store-badge only reacts to attribute changes, but React sets a prop the element
  // already has (like `size`) as a property, so a size change after mount would be ignored.
  useEffect(() => {
    badgeRef.current?.setAttribute('size', size);
  }, [size]);

  return (
    <span className={className}>
      {React.createElement('ms-store-badge', {
        ...badgeAttributes,
        ref: badgeRef,
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
