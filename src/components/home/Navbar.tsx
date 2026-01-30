/**
 * Navbar 组件 - 科技感设计风格
 * 首页导航栏，包含 Logo、导航链接和主题切换
 * 设计系统: HUD/Sci-Fi FUI + Glassmorphism
 */
import { useState, useEffect, useMemo } from "react";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";
import { withBasePath } from "../../utils/path";

interface NavbarProps {
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 根据当前 base path 动态生成导航链接
  const navItems: NavItem[] = useMemo(
    () => [
      { label: "安装指南", href: withBasePath("/installation/docker-compose") },
      { label: "博客", href: withBasePath("/blog") },
      { label: "文档", href: withBasePath("/product-overview") },
      {
        label: "技术支持群 610394020",
        href: "https://qm.qq.com/q/Fwb0o094kw",
      },
      {
        label: "Docker Compose 构建器",
        href: "https://hagicode-org.github.io/docker-compose-builder/",
      },
      { label: "GitHub （求 Star ~）", href: "https://github.com/HagiCode-org/site" },
    ],
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 阻止页面滚动（移动端菜单打开时）
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // 获取首页链接（适配 base path）
  const homeUrl = useMemo(() => withBasePath("/"), []);

  return (
    <header
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""} ${className}`}
    >
      {/* HUD 装饰线 */}
      <div className={styles.hudLine} />

      <div className={styles.container}>
        {/* Logo */}
        <a href={homeUrl} className={styles.logo} aria-label="Hagicode 首页">
          <div className={styles.logoIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 8L3 12L7 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 8L21 12L17 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 4L10 20"
                stroke="url(#nav-code-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="nav-code-gradient"
                  x1="10"
                  y1="4"
                  x2="14"
                  y2="20"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0080FF" />
                  <stop offset="1" stopColor="#00FFFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.logoText}>Hagicode</span>
        </a>

        {/* Desktop Navigation */}
        <nav className={styles.navDesktop}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.navLink}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              <span className={styles.navLinkText}>{item.label}</span>
              <span className={styles.navLinkIndicator} />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <ThemeToggle />
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.hamburger}>
              <span className={`${styles.hamburgerLine} ${styles.line1}`} />
              <span className={`${styles.hamburgerLine} ${styles.line2}`} />
              <span className={`${styles.hamburgerLine} ${styles.line3}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ""}`}
      >
        <div className={styles.mobileMenuBg} />
        <nav className={styles.mobileNav}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              <span className={styles.mobileNavText}>{item.label}</span>
              <span className={styles.mobileNavArrow} />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
