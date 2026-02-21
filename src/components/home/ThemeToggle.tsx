/**
 * ThemeToggle 组件
 * 暗色/亮色主题切换按钮
 */
import { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  className?: string;
}

type Theme = 'light' | 'dark' | 'lunar-new-year' | undefined;

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(undefined);

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
          ? '切换到亮色模式'
          : theme === 'lunar-new-year'
            ? '切换到农历新年主题'
            : '切换到暗色模式'
      }
      title={
        theme === 'dark'
          ? '切换到亮色模式'
          : theme === 'lunar-new-year'
            ? '切换到农历新年主题'
            : '切换到暗色模式'
      }
    >
      {theme === 'light' ? (
        // Sun icon for light mode
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
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
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
