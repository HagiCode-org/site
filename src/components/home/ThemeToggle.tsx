/**
 * ThemeToggle 组件
 * 暗色/亮色主题切换按钮
 */
import { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  className?: string;
}

type Theme = 'light' | 'dark' | undefined;

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(undefined);

  // 初始化主题 - 与 Starlight 同步
  useEffect(() => {
    const stored = localStorage.getItem('starlight-theme') as Theme | null;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = stored || system;
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
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('starlight-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <button
      className={`${styles.themeToggle} ${className}`}
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {theme === 'dark' ? (
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
      ) : (
        // Moon icon for dark mode
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
