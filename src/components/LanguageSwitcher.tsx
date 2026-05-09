import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

import {
  getSiteLocaleDefinition,
  resolveSiteLocale,
  SITE_LOCALES,
  type SiteLocale,
} from '@/i18n/locale-metadata';
import { useLocale } from '@/lib/useLocale';
import type { HomepageLanguageSwitcherCopy } from '@/lib/homepage-runtime-copy';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  locale: string;
  copy: HomepageLanguageSwitcherCopy;
}

export function LanguageSwitcher({ locale: propLocale, copy }: LanguageSwitcherProps) {
  const { locale: detectedLocale, setLocale } = useLocale();
  const currentLocale = resolveSiteLocale(propLocale ?? detectedLocale);
  const currentLocaleDefinition = getSiteLocaleDefinition(currentLocale);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Partial<Record<SiteLocale, HTMLButtonElement | null>>>({});
  const dialogId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    optionRefs.current[currentLocale]?.focus();

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (triggerRef.current?.contains(target) || dialogRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [currentLocale, isOpen]);

  const closeChooser = (focusTrigger = false) => {
    setIsOpen(false);
    if (focusTrigger) {
      triggerRef.current?.focus();
    }
  };

  const focusLocaleOption = (locale: SiteLocale) => {
    optionRefs.current[locale]?.focus();
  };

  const handleOptionKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    locale: SiteLocale,
  ) => {
    const currentIndex = SITE_LOCALES.findIndex((entry) => entry.code === locale);
    if (currentIndex < 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight': {
        event.preventDefault();
        const nextLocale = SITE_LOCALES[(currentIndex + 1) % SITE_LOCALES.length];
        focusLocaleOption(nextLocale.code);
        break;
      }
      case 'ArrowUp':
      case 'ArrowLeft': {
        event.preventDefault();
        const previousLocale = SITE_LOCALES[(currentIndex - 1 + SITE_LOCALES.length) % SITE_LOCALES.length];
        focusLocaleOption(previousLocale.code);
        break;
      }
      case 'Home':
        event.preventDefault();
        focusLocaleOption(SITE_LOCALES[0].code);
        break;
      case 'End':
        event.preventDefault();
        focusLocaleOption(SITE_LOCALES[SITE_LOCALES.length - 1].code);
        break;
      case 'Escape':
        event.preventDefault();
        closeChooser(true);
        break;
      default:
        break;
    }
  };

  const handleSelectLocale = (locale: SiteLocale) => {
    setIsOpen(false);

    if (locale === currentLocale) {
      triggerRef.current?.focus();
      return;
    }

    setLocale(locale);
  };

  const dialogContent = isOpen ? (
    <>
      <button
        type="button"
        className={styles.languageBackdrop}
        aria-label={copy.close}
        onClick={() => closeChooser(true)}
      />

      <div
        ref={dialogRef}
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.languageDialog}
      >
        <div className={styles.languageDialogHeader}>
          <div>
            <p id={titleId} className={styles.languageDialogTitle}>
              {copy.dialogTitle}
            </p>
            <p className={styles.languageDialogCurrent}>
              {copy.currentLocaleLabel}
              {': '}
              <strong>{currentLocaleDefinition.nativeName}</strong>
            </p>
          </div>

          <button
            type="button"
            className={styles.languageDialogClose}
            aria-label={copy.close}
            onClick={() => closeChooser(true)}
          >
            ×
          </button>
        </div>

        <div className={styles.languageGridScroller}>
          <div
            className={styles.languageGrid}
            role="listbox"
            aria-label={copy.label}
          >
            {SITE_LOCALES.map((locale) => {
              const isSelected = locale.code === currentLocale;

              return (
                <button
                  key={locale.code}
                  ref={(node) => {
                    optionRefs.current[locale.code] = node;
                  }}
                  type="button"
                  role="option"
                  data-locale={locale.code}
                  aria-selected={isSelected}
                  className={`${styles.languageOptionButton}${isSelected ? ` ${styles.languageOptionSelected}` : ''}`}
                  onClick={() => handleSelectLocale(locale.code)}
                  onKeyDown={(event) => handleOptionKeyDown(event, locale.code)}
                >
                  <span className={styles.languageOptionLabel}>{locale.nativeName}</span>
                  {isSelected ? (
                    <span className={styles.languageOptionSelectedBadge}>
                      {copy.selectedState}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className={styles.languageSwitcher} data-open={isOpen ? 'true' : 'false'}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.languageTrigger}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        aria-label={`${copy.label}: ${currentLocaleDefinition.nativeName}`}
        title={currentLocaleDefinition.nativeName}
        onClick={() => setIsOpen((previousState) => !previousState)}
      >
        <span className={styles.triggerLabel}>{currentLocaleDefinition.nativeName}</span>
        <span className={styles.languageTriggerChevron} aria-hidden="true">
          ▾
        </span>
      </button>
      {dialogContent && typeof document !== 'undefined'
        ? createPortal(dialogContent, document.body)
        : dialogContent}
    </div>
  );
}
