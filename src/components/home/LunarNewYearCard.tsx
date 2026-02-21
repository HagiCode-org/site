/**
 * LunarNewYearCard 组件
 * 新年主题福字/红包卡片
 * 可用于展示新年祝福、活动信息等
 */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './LunarNewYearCard.module.css';

type Theme = 'light' | 'dark' | 'lunar-new-year' | undefined;

interface LunarNewYearCardProps {
  type?: 'fu' | 'hongbao' | 'couplet' | 'zodiac';
  title?: string;
  message?: string;
  onClick?: () => void;
}

/**
 * 福字卡片
 */
function FuCard({ onClick }: { onClick?: () => void }) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <motion.div
      className={`${styles.card} ${styles.fuCard}`}
      whileHover={{ scale: 1.05, rotate: [-2, 2, -2] }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        setIsOpened(!isOpened);
        onClick?.();
      }}
    >
      {/* 红色背景 */}
      <div className={styles.cardBackground}>
        {/* 金色边框装饰 */}
        <svg className={styles.goldBorder} viewBox="0 0 200 200">
          <rect
            x="10"
            y="10"
            width="180"
            height="180"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="3"
          />
          <rect
            x="5"
            y="5"
            width="190"
            height="190"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            opacity="0.5"
          />
          {/* 四角装饰 */}
          <path d="M10 30 L10 10 L30 10" stroke="#FFD54F" strokeWidth="2" fill="none" />
          <path d="M190 30 L190 10 L170 10" stroke="#FFD54F" strokeWidth="2" fill="none" />
          <path d="M10 170 L10 190 L30 190" stroke="#FFD54F" strokeWidth="2" fill="none" />
          <path d="M190 170 L190 190 L170 190" stroke="#FFD54F" strokeWidth="2" fill="none" />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD54F" />
              <stop offset="50%" stopColor="#FFA000" />
              <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
          </defs>
        </svg>

        {/* 中心福字 */}
        <div className={styles.fuCharacter}>
          <div className={styles.fuWrapper} style={{ transform: isOpened ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <span className={styles.fuText}>福</span>
          </div>
          <div className={styles.fuGlow} />
        </div>

        {/* 装饰纹样 */}
        <div className={styles.pattern}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={styles.patternDot}
              style={{
                transform: `rotate(${i * 45}deg) translateY(-70px)`,
              }}
            />
          ))}
        </div>

        {/* 展开后的祝福 */}
        {isOpened && (
          <motion.div
            className={styles.blessing}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p>新春快乐 · 马年大吉</p>
            <p className={styles.blessingSmall}>万事如意 · 恭喜发财</p>
          </motion.div>
        )}
      </div>

      {/* 流苏 */}
      <div className={styles.tassel} />
    </motion.div>
  );
}

/**
 * 红包卡片
 */
function HongbaoCard({ title, message, onClick }: LunarNewYearCardProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <motion.div
      className={`${styles.card} ${styles.hongbaoCard}`}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        setIsOpened(!isOpened);
        onClick?.();
      }}
    >
      {/* 红包主体 */}
      <div className={styles.hongbaoBody}>
        {/* 封口装饰 */}
        <div className={styles.hongbaoFlap} />

        {/* 金色图案 */}
        <div className={styles.hongbaoPattern}>
          <svg viewBox="0 0 100 100" className={styles.hongbaoSvg}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD54F" strokeWidth="2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#FFA000" strokeWidth="1.5" />
            <path d="M50 20 L50 80 M20 50 L80 50" stroke="#FFD54F" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="8" fill="#FFD54F" />
          </svg>
        </div>

        {/* 标题 */}
        {title && <p className={styles.hongbaoTitle}>{title}</p>}

        {/* 开启提示 */}
        <p className={styles.hongbaoHint}>
          {isOpened ? '🎉 已开启' : '点击开启'}
        </p>

        {/* 内容 */}
        {isOpened && (
          <motion.div
            className={styles.hongbaoContent}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.hongbaoMessage}>
              {message || '恭喜发财，大吉大利！'}
            </p>
            <div className={styles.hongbaoCoin}>🪙</div>
          </motion.div>
        )}
      </div>

      {/* 底部装饰 */}
      <div className={styles.hongbaoBottom} />
    </motion.div>
  );
}

/**
 * 生肖卡片 (马年 2026)
 */
function ZodiacCard({ onClick }: { onClick?: () => void }) {
  return (
    <motion.div
      className={`${styles.card} ${styles.zodiacCard}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <div className={styles.zodiacBackground}>
        {/* 马形图案 */}
        <svg className={styles.zodiacSvg} viewBox="0 0 200 200">
          <defs>
            <linearGradient id="horseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
          </defs>
          {/* 简化的马形图案 */}
          {/* 马头 */}
          <ellipse cx="130" cy="70" rx="30" ry="25" fill="url(#horseGradient)" />
          {/* 马鬃 */}
          <path
            d="M145 55 Q160 45 155 60 Q165 50 160 65 Q170 55 165 70"
            stroke="#FF8F00"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* 马耳 */}
          <ellipse cx="120" cy="50" rx="6" ry="12" fill="url(#horseGradient)" transform="rotate(-20 120 50)" />
          <ellipse cx="135" cy="48" rx="6" ry="12" fill="url(#horseGradient)" transform="rotate(-10 135 48)" />
          {/* 马眼 */}
          <circle cx="138" cy="65" r="5" fill="#1a0505" />
          <circle cx="139" cy="64" r="2" fill="#FFD54F" />
          {/* 马鼻 */}
          <ellipse cx="155" cy="75" rx="8" ry="5" fill="#FF8F00" />
          {/* 马颈 */}
          <path
            d="M100 75 Q90 90 85 110"
            stroke="url(#horseGradient)"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
          />
          {/* 马身 */}
          <ellipse cx="70" cy="130" rx="40" ry="25" fill="url(#horseGradient)" />
          {/* 马腿 */}
          <path
            d="M50 145 L45 175"
            stroke="url(#horseGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M70 150 L68 180"
            stroke="url(#horseGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M90 150 L92 180"
            stroke="url(#horseGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M100 145 L108 175"
            stroke="url(#horseGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* 马尾 */}
          <path
            d="M35 120 Q15 110 20 130 Q10 140 25 135"
            stroke="#FF8F00"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* 年份文字 */}
        <div className={styles.zodiacText}>
          <p className={styles.zodiacYear}>2026</p>
          <p className={styles.zodiacName}>马年大吉</p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 主组件 - 根据类型渲染不同卡片
 */
export default function LunarNewYearCard(props: LunarNewYearCardProps) {
  const { type = 'fu', title, message, onClick } = props;
  const [theme, setTheme] = useState<Theme>(undefined);

  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
      setTheme(currentTheme);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // 只在农历新年主题下显示
  if (theme !== 'lunar-new-year') {
    return null;
  }

  switch (type) {
    case 'fu':
      return <FuCard onClick={onClick} />;
    case 'hongbao':
      return <HongbaoCard title={title} message={message} onClick={onClick} />;
    case 'zodiac':
      return <ZodiacCard onClick={onClick} />;
    default:
      return <FuCard onClick={onClick} />;
  }
}

/**
 * 卡片组 - 新年装饰横幅（简化版，不显示卡片）
 */
export function LunarNewYearCardGroup() {
  // 不显示任何卡片组件
  return null;
}
