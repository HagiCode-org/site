import type { SteamProductImageRecord } from '@/data/steamImageDescriptors';
import type {
  DlcItem,
  EditionColumn,
  FeatureCell,
  PricingContent,
  SteamPreviewLabels,
  SteamPreviewRecordMap,
} from '@/lib/homepage-section-copy';
import styles from './PricingComparisonSection.module.css';

function getSteamVariantLabel(variant: string): string {
  return variant.replace(/[-_]+/g, ' ');
}

function renderSteamImagePreview(
  item: DlcItem,
  records: SteamPreviewRecordMap,
  labels: SteamPreviewLabels,
) {
  if (!item.productKey) {
    return null;
  }

  const record: SteamProductImageRecord | null = records[item.productKey] ?? null;
  const preview = record?.images[0];
  const displayName = record?.displayName ?? item.title;

  return (
    <div className={styles.steamPreview} aria-label={`${displayName} ${labels.previewLabel}`}>
      {preview ? (
        <img
          src={preview.src}
          alt={preview.alt || `${displayName} ${getSteamVariantLabel(preview.variant)} ${labels.imageSuffix}`}
          width={preview.width}
          height={preview.height}
          className={styles.steamPreviewImage}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className={styles.steamPreviewFallback}>
          <span className={styles.steamPreviewBadge}>Steam</span>
          <strong>{displayName}</strong>
          <small>{record?.type === 'bundle' || item.productKey === 'hagicode-plus' ? labels.bundlePending : labels.productPending}</small>
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 10.2 8.6 12.7 14 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m7 7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m13 7-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function renderCell(cell: FeatureCell, labels: { included: string; notIncluded: string }) {
  if (cell.type === 'check') {
    return (
      <span className={`${styles.cellBadge} ${styles.cellCheck}`} aria-label={labels.included}>
        <CheckIcon />
      </span>
    );
  }

  if (cell.type === 'cross') {
    return (
      <span className={`${styles.cellBadge} ${styles.cellCross}`} aria-label={labels.notIncluded}>
        <CrossIcon />
      </span>
    );
  }

  if (cell.href) {
    return (
      <a
        href={cell.href}
        className={`${styles.cellText} ${styles.cellLink}`}
        target={cell.external ? '_blank' : undefined}
        rel={cell.external ? 'noopener noreferrer' : undefined}
      >
        {cell.value}
      </a>
    );
  }

  return <span className={styles.cellText}>{cell.value}</span>;
}

function renderEditionHeader(column: EditionColumn, className?: string) {
  if (!column.action) {
    return (
      <div className={`${styles.columnHeading} ${className ?? ''}`.trim()}>
        <span className={`${styles.headerButton} ${styles.headerLabel}`}>{column.title}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.columnHeading} ${className ?? ''}`.trim()}>
      <a
        href={column.action.href}
        className={styles.headerButton}
        target={column.action.external ? '_blank' : undefined}
        rel={column.action.external ? 'noopener noreferrer' : undefined}
      >
        {column.title}
      </a>
    </div>
  );
}

interface Props {
  content: PricingContent;
  steamPreviewRecords?: SteamPreviewRecordMap;
}

export default function PricingComparisonSection({ content, steamPreviewRecords = {} }: Props) {
  const cellLabels = {
    included: content.includedLabel,
    notIncluded: content.notIncludedLabel,
  };

  return (
    <section className={styles.section} aria-labelledby="pricing-comparison-title">
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />

      <div className="container">
        <div className={styles.header}>
          <h2 id="pricing-comparison-title" className={styles.title}>
            {content.title}
          </h2>
        </div>

        <section className={styles.group} aria-labelledby="pricing-base-title">
          <div className={styles.matrixWrap}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th scope="col" className={styles.featureHeading}>{content.featureHeader}</th>
                  <th scope="col">
                    {renderEditionHeader(content.turboEdition, styles.turboColumnHeading)}
                  </th>
                  <th scope="col">
                    {renderEditionHeader(content.steamEdition, styles.steamColumnHeading)}
                  </th>
                  <th scope="col">
                    {renderEditionHeader(content.desktopEdition, styles.desktopColumnHeading)}
                  </th>
                  <th scope="col">
                    {renderEditionHeader(content.containerEdition, styles.containerColumnHeading)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.rows.map((row) => (
                  <tr key={row.feature} className={row.steamExclusive ? styles.steamExclusiveRow : undefined}>
                    <th scope="row" className={styles.rowHeading}>{row.feature}</th>
                    <td className={styles.turboColumnCell} data-column={content.turboEdition.title}>{renderCell(row.turbo, cellLabels)}</td>
                    <td className={styles.steamColumnCell} data-column={content.steamEdition.title}>{renderCell(row.steam, cellLabels)}</td>
                    <td className={styles.desktopColumnCell} data-column={content.desktopEdition.title}>{renderCell(row.desktop, cellLabels)}</td>
                    <td className={styles.containerColumnCell} data-column={content.containerEdition.title}>{renderCell(row.container, cellLabels)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.matrixNote}>
            <span>{content.limitTitle}:</span>
            {' '}
            {content.limitDescription}
          </p>
          <p className={styles.matrixNote}>
            <span>{content.plusTitle}:</span>
            {' '}
            {content.plusDescription}
          </p>
        </section>

        {content.dlcItems.length > 0 ? (
          <section className={styles.group} aria-labelledby="pricing-dlc-title">
            <div className={styles.groupHeader}>
              <span className={styles.groupLabel}>{content.dlcLabel}</span>
              <h3 id="pricing-dlc-title" className={styles.groupTitle}>
                {content.dlcTitle}
              </h3>
              {content.dlcDescription ? (
                <p className={styles.groupDescription}>{content.dlcDescription}</p>
              ) : null}
            </div>

            <div className={styles.dlcList}>
              {content.dlcItems.map((item) => (
                <article
                  key={item.title}
                  className={`${styles.dlcRow} ${item.featured === 'sponsor' ? styles.sponsorRow : ''}`}
                >
                  <div className={styles.dlcTop}>
                    {renderSteamImagePreview(item, steamPreviewRecords, content.steamPreviewLabels)}
                    <div className={styles.dlcMain}>
                      <span className={styles.dlcCategory}>{item.category}</span>
                      <h4 className={styles.dlcTitle}>{item.title}</h4>
                      <p className={styles.dlcDescription}>{item.description}</p>
                    </div>
                    <div className={styles.dlcAside}>
                      <strong className={styles.dlcPrice}>{item.price}</strong>
                    </div>
                  </div>
                  <ul className={styles.dlcBullets}>
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
