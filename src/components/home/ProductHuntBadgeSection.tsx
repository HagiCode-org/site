import { getServerTranslation } from '@/i18n/translation-resources';
import { ExternalLink } from 'lucide-react';
import styles from './ProductHuntBadgeSection.module.css';

export const PRODUCT_HUNT_BADGE_WIDTH = 250;
export const PRODUCT_HUNT_BADGE_HEIGHT = 54;
export const PRODUCT_HUNT_PRODUCT_URL = 'https://www.producthunt.com/products/hagicode';
export const PRODUCT_HUNT_BADGE_LINK =
  `${PRODUCT_HUNT_PRODUCT_URL}?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-hagicode`;
export const PRODUCT_HUNT_BADGE_IMAGE_URL =
  'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=hagicode&theme=light';
export const PRODUCT_HUNT_BADGE_ALT = 'Hagicode featured on Product Hunt';

interface ProductHuntBadgeSectionProps {
  locale: string;
}

export default function ProductHuntBadgeSection({ locale }: ProductHuntBadgeSectionProps) {
  const { t } = getServerTranslation(locale);

  return (
    <section className={styles.section} aria-labelledby={`product-hunt-title-${locale}`}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.copyColumn}>
            <div className={styles.eyebrowRow}>
              <p className={styles.eyebrow}>{t('productHuntBadge.eyebrow')}</p>
              <span className={styles.signalTag}>Product Hunt</span>
            </div>
            <h2 id={`product-hunt-title-${locale}`} className={styles.title}>
              {t('productHuntBadge.title')}
            </h2>
            <span className={styles.signalRule} aria-hidden="true" />
          </div>

          <a
            className={styles.badgeLink}
            href={PRODUCT_HUNT_BADGE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('productHuntBadge.linkLabel')}
            data-product-hunt-entry="homepage-badge"
          >
            <span className={styles.badgeTopline}>
              <span className={styles.badgeHint}>Product Hunt</span>
              <span className={styles.iconShell} aria-hidden="true">
                <ExternalLink className={styles.badgeIcon} />
              </span>
            </span>

            <span className={styles.badgeFrame}>
              <img
                src={PRODUCT_HUNT_BADGE_IMAGE_URL}
                alt={PRODUCT_HUNT_BADGE_ALT}
                width={PRODUCT_HUNT_BADGE_WIDTH}
                height={PRODUCT_HUNT_BADGE_HEIGHT}
                loading="lazy"
                decoding="async"
                className={styles.badgeImage}
              />
            </span>

            <span className={styles.badgeMeta}>
              <span className={styles.badgeCta}>{t('productHuntBadge.cta')}</span>
              <span className={styles.badgeSupporting}>{t('productHuntBadge.linkLabel')}</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
