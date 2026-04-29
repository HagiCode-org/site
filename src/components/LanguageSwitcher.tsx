import { useTranslation } from '@/i18n/ui';
import {
  resolveSiteLocale,
  SITE_LOCALES,
} from '@/i18n/locale-metadata';
import { useLocale } from '@/lib/useLocale';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  locale?: string;
}

export function LanguageSwitcher({ locale: propLocale }: LanguageSwitcherProps = {}) {
  const { locale: detectedLocale, setLocale } = useLocale();
  const currentLocale = propLocale || detectedLocale;
  const { t } = useTranslation(currentLocale);

  return (
    <label className={styles.languageSwitcher}>
      <span className={styles.screenReaderOnly}>{t('languageSwitcher.label')}</span>
      <select
        value={currentLocale}
        aria-label={t('languageSwitcher.label')}
        title={t('languageSwitcher.label')}
        className={styles.languageSelect}
        onChange={(event) => setLocale(resolveSiteLocale(event.target.value))}
      >
        {SITE_LOCALES.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.nativeName}
          </option>
        ))}
      </select>
      <span className={styles.languageSelectChevron} aria-hidden="true">
        ▾
      </span>
    </label>
  );
}
