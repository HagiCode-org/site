import { useLocale } from '@/lib/useLocale';
import { useTranslation } from '@/i18n/ui';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  locale?: 'zh-CN' | 'en';
}

export function LanguageSwitcher({ locale: propLocale }: LanguageSwitcherProps = {}) {
  const { locale, toggleLocale } = useLocale();
  const { t } = useTranslation(locale);
  // Use prop locale if provided (from SSR), otherwise use hook locale
  const currentLocale = propLocale || locale;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLocale();
    }
  };

  return (
    <button
      onClick={toggleLocale}
      onKeyDown={handleKeyDown}
      aria-label={t('languageSwitcher.label')}
      title={currentLocale === 'zh-CN' ? t('languageSwitcher.switchToEnglish') : t('languageSwitcher.switchToChinese')}
      className={styles.languageSwitcher}
    >
      <span>{currentLocale === 'zh-CN' ? '中' : 'EN'}</span>
    </button>
  );
}
