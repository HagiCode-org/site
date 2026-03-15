import { useLocale } from '@/lib/useLocale';
import { useTranslation } from '@/i18n/ui';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  locale?: 'zh-CN' | 'en';
}

export function LanguageSwitcher({ locale: propLocale }: LanguageSwitcherProps = {}) {
  const { locale: detectedLocale, toggleLocale } = useLocale();
  const currentLocale = propLocale || detectedLocale;
  const { t } = useTranslation(currentLocale);
  const switchLabel =
    currentLocale === 'zh-CN'
      ? t('languageSwitcher.switchToEnglish')
      : t('languageSwitcher.switchToChinese');

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleLocale();
    }
  };

  return (
    <button
      onClick={toggleLocale}
      onKeyDown={handleKeyDown}
      aria-label={switchLabel}
      title={switchLabel}
      className={styles.languageSwitcher}
      data-current-locale={currentLocale}
    >
      <span>{currentLocale === 'zh-CN' ? '中' : 'EN'}</span>
    </button>
  );
}
