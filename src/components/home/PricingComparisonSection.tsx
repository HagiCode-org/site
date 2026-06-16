import type {
  EditionColumn,
  FeatureCell,
  PricingContent,
} from '@/lib/homepage-section-copy';
import styles from './PricingComparisonSection.module.css';

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
}

export default function PricingComparisonSection({ content }: Props) {
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
      </div>
    </section>
  );
}
