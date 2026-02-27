/**
 * ThemeToggle 组件
 * 暗色/亮色主题切换按钮
 */
import { useState, useEffect } from 'react';
import { useLocale } from '@/lib/useLocale';
import { useTranslation } from '@/i18n/ui';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  className?: string;
  locale?: 'zh-CN' | 'en';
}

type Theme = 'light' | 'dark' | 'lunar-new-year' | undefined;

export default function ThemeToggle({ className = '', locale: propLocale }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(undefined);
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);

  // 初始化主题 - 与 Starlight 同步
  useEffect(() => {
    // 判断是否在农历新年期间
    // 蛇年2025: 2025-01-29 至 2025-02-12 (元宵节)
    // 马年2026: 2026-02-17 至 2026-03-03 (元宵节)
    function isLunarNewYearPeriod(): boolean {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // 1-12
      const day = now.getDate();

      // 2025年蛇年新年期间 (1月29日 - 2月12日)
      if (year === 2025) {
        if (month === 1 && day >= 29) return true;
        if (month === 2 && day <= 12) return true;
      }
      // 2026年马年新年期间 (2月17日 - 3月3日)
      if (year === 2026) {
        if (month === 2 && day >= 17) return true;
        if (month === 3 && day <= 3) return true;
      }
      return false;
    }

    const stored = localStorage.getItem('starlight-theme') as Theme | null;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    let initialTheme: Theme;

    if (stored) {
      // 用户已有主题偏好,使用其选择
      initialTheme = stored;
    } else {
      // 用户无主题偏好,应用智能默认
      initialTheme = isLunarNewYearPeriod() ? 'lunar-new-year' : system;
    }

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // 监听 Starlight 主题变化（从其他页面切换回来时）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'starlight-theme' && e.newValue) {
        const newTheme = e.newValue as Theme;
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 切换主题 - 与 Starlight 同步
  const toggleTheme = () => {
    let newTheme: Theme;
    if (theme === 'light') {
      newTheme = 'dark';
    } else if (theme === 'dark') {
      newTheme = 'lunar-new-year';
    } else {
      newTheme = 'light';
    }
    setTheme(newTheme);
    localStorage.setItem('starlight-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <button
      className={`${styles.themeToggle} ${className}`}
      onClick={toggleTheme}
      aria-label={
        theme === 'dark'
          ? t('themeToggle.lightMode')
          : theme === 'lunar-new-year'
            ? (locale === 'zh-CN' ? '切换到农历新年主题' : 'Switch to Lunar New Year theme')
            : t('themeToggle.darkMode')
      }
      title={
        theme === 'dark'
          ? t('themeToggle.lightMode')
          : theme === 'lunar-new-year'
            ? (locale === 'zh-CN' ? '切换到农历新年主题' : 'Switch to Lunar New Year theme')
            : t('themeToggle.darkMode')
      }
    >
      {theme === 'light' ? (
        // Sun icon for light mode
        <Sun className={styles.icon} />
      ) : theme === 'lunar-new-year' ? (
        // Lantern icon for lunar new year theme
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L12 4" />
          <path d="M12 4C10.8954 4 10 4.89543 10 6V14C10 15.1046 10.8954 16 12 16C13.1046 16 14 15.1046 14 14V6C14 4.89543 13.1046 4 12 4Z" />
          <path d="M8 14H16V18H8V14Z" />
          <path d="M6 18H18L17 22H7L6 18Z" />
          <path d="M9 10H15" />
          <path d="M9 12H15" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <Moon className={styles.icon} />
      )}
    </button>
  );
}
