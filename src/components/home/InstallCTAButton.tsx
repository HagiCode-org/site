/**
 * InstallCTAButton 组件 - 统一安装入口按钮
 * 视觉增强的 CTA 按钮，作为安装相关内容的单一入口点
 */
import { motion } from "framer-motion";
import { withBasePath } from "@/utils/path";
import styles from "./InstallCTAButton.module.css";

interface InstallCTAButtonProps {
  /**
   * 可选的额外类名
   */
  className?: string;
}

/**
 * 统一安装入口 CTA 按钮
 * - 使用渐变背景和发光效果突出显示
 * - 支持 Framer Motion 入场和悬停动画
 * - 自动适配所有主题（亮色/暗色/新年）
 * - 响应式设计，移动端和桌面端均有良好表现
 */
export default function InstallCTAButton({
  className = "",
}: InstallCTAButtonProps) {
  const installUrl = withBasePath("/desktop");

  return (
    <motion.a
      href={installUrl}
      className={`${styles.installCta} ${className}`}
      aria-label="立即安装 Hagicode Desktop"
      role="button"
      // 入场动画 - 仅播放一次
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
      // 悬停动画
      whileHover={{
        y: -2,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          duration: 0.1,
        },
      }}
    >
      <span className={styles.buttonContent}>
        <svg
          className={styles.downloadIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.buttonText}>立即安装</span>
        <svg
          className={styles.arrowIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </motion.a>
  );
}
