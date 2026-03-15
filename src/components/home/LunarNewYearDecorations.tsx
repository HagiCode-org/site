/**
 * LanternDecoration 组件
 * 新年主题灯笼装饰 - 红金配色，摇曳动画
 * 仅在农历新年主题下显示
 */

import { motion } from 'framer-motion';
import { useMemo, useEffect, useState } from 'react';
import styles from './LunarNewYearDecorations.module.css';

type Theme = 'light' | 'dark' | 'lunar-new-year' | undefined;

interface LanternDecorationProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'floating';
  size?: 'small' | 'medium' | 'large';
  delay?: number;
}

/**
 * 单个灯笼组件
 */
function Lantern({
  position,
  size = 'medium',
  delay = 0,
}: LanternDecorationProps) {
  const sizeClasses = {
    small: { width: '30px', height: '40px' },
    medium: { width: '50px', height: '65px' },
    large: { width: '70px', height: '90px' },
  };

  const swingDuration = 3 + Math.random() * 2; // 3-5秒随机摆动

  return (
    <motion.div
      className={styles.lanternWrapper}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {/* 悬挂绳 */}
      <div className={styles.lanternString} />

      {/* 灯笼主体 */}
      <motion.div
        className={styles.lantern}
        style={sizeClasses[size]}
        animate={{
          rotate: [-3, 3, -3],
        }}
        transition={{
          duration: swingDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 灯笼主体 */}
        <div className={styles.lanternBody}>
          {/* 金色边框装饰 */}
          <div className={styles.lanternRim} />
          <div className={styles.lanternRimBottom} />

          {/* 福/春/喜 字 */}
          <div className={styles.lanternCharacter}>
            {size === 'large' ? '福' : size === 'medium' ? '春' : '喜'}
          </div>

          {/* 光晕效果 */}
          <div className={styles.lanternGlow} />
        </div>

        {/* 流苏 */}
        <div className={styles.lanternTassel}>
          <motion.div
            className={styles.tasselStrands}
            animate={{
              rotate: [2, -2, 2],
            }}
            transition={{
              duration: swingDuration * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * 烟花效果组件
 */
interface FireworksProps {
  count?: number;
}

function Fireworks({ count = 5 }: FireworksProps) {
  const fireworks = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 10 + Math.random() * 30,
      delay: i * 0.5,
      color: ['#FFD700', '#FF6B6B', '#FFA500', '#FF69B4', '#00CED1'][i % 5],
    }));
  }, [count]);

  return (
    <div className={styles.fireworksContainer}>
      {fireworks.map((fw) => (
        <motion.div
          key={fw.id}
          className={styles.firework}
          style={{
            left: `${fw.x}%`,
            top: `${fw.y}%`,
            '--firework-color': fw.color,
          } as React.CSSProperties}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            delay: fw.delay,
            repeat: Infinity,
            repeatDelay: 3 + Math.random() * 2,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.fireworkParticle}
              style={{
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * 金币雨效果
 */
interface CoinRainProps {
  enabled?: boolean;
}

function CoinRain({ enabled = true }: CoinRainProps) {
  const [coins, setCoins] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setCoins((prev) => {
        const newCoin = {
          id: Date.now(),
          x: Math.random() * 100,
          delay: 0,
        };
        return [...prev.slice(-20), newCoin]; // 保持最多20个金币
      });
    }, 800);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={styles.coinRainContainer}>
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className={styles.goldCoin}
          style={{ left: `${coin.x}%` }}
          initial={{ y: -50, rotate: 0 }}
          animate={{ y: '100vh', rotate: 360 }}
          transition={{
            duration: 4 + Math.random() * 2,
            ease: 'linear',
          }}
          onAnimationComplete={() => {
            setCoins((prev) => prev.filter((c) => c.id !== coin.id));
          }}
        >
          <div className={styles.coinFace}>元</div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * 新年飘带装饰
 */
function FestiveRibbon() {
  return (
    <div className={styles.ribbonContainer}>
      <motion.div
        className={styles.ribbon}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <span className={styles.ribbonText}>
          ✦ 新春快乐 ✦ 马年大吉 ✦ 万事如意 ✦ 恭喜发财 ✦
        </span>
      </motion.div>
    </div>
  );
}

/**
 * 主装饰组件
 */
export default function LunarNewYearDecorations() {
  const [theme, setTheme] = useState<Theme>(undefined);
  const [showCoinRain, setShowCoinRain] = useState(false);

  useEffect(() => {
    // 检测当前主题
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
      setTheme(currentTheme);
    };

    checkTheme();

    // 监听主题变化
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

  return (
    <div className={styles.decorationsContainer}>
      {/* 烟花背景 */}
      <Fireworks count={6} />

      {/* 漂浮灯笼 */}
      <div className={styles.lanternsTopLeft}>
        <Lantern position="top-left" size="large" delay={0} />
        <Lantern position="top-left" size="small" delay={0.2} />
      </div>

      <div className={styles.lanternsTopRight}>
        <Lantern position="top-right" size="medium" delay={0.1} />
        <Lantern position="top-right" size="small" delay={0.3} />
      </div>

      {/* 飘带 */}
      <FestiveRibbon />

      {/* 金币雨 (鼠标悬停时触发) */}
      <CoinRain enabled={showCoinRain} />

      {/* 交互提示 */}
      <motion.div
        className={styles.interactionHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onHoverStart={() => setShowCoinRain(true)}
        onHoverEnd={() => setShowCoinRain(false)}
      >
        <span className={styles.hintText}>🎊 悬停收获好运 🎊</span>
      </motion.div>
    </div>
  );
}
