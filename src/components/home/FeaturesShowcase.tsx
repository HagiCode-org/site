import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './featuresShowcase.module.css';

// 智能特性区域 - 整合 OpenSpec 工作流
function SmartFeature() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    { id: 'idea', label: 'Idea', icon: '💡', desc: '从想法开始' },
    { id: 'proposal', label: 'Proposal', icon: '📄', desc: 'AI 生成提案' },
    { id: 'review', label: 'Review', icon: '🔍', desc: '自动评审' },
    { id: 'tasks', label: 'Tasks', icon: '⚙️', desc: '任务分解' },
    { id: 'code', label: 'Code', icon: '💻', desc: '智能编码' },
    { id: 'test', label: 'Test', icon: '🧪', desc: '自动测试' },
    { id: 'refactor', label: 'Refactor', icon: '🔧', desc: '代码重构' },
    { id: 'docs', label: 'Docs', icon: '📚', desc: '文档生成' },
    { id: 'archive', label: 'Archive', icon: '✅', desc: '知识归档' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.featureZone} data-theme="smart">
      <div className={styles.featurePattern} />
      <div className={styles.featureContent}>
        <div className={styles.featureText}>
          <div>
            <span className={styles.featureBadge}>SMART</span>
            <h2 className={styles.featureTitle}>智能</h2>
            <p className={styles.featureSubtitle}>OpenSpec 工作流，AI 编码效率提升</p>
          </div>

          <div className={styles.efficiencyHighlight}>
            <div className={styles.efficiencyValue}>
              <span className={styles.efficiencyNumber}>300</span>
              <span className={styles.efficiencyPercent}>%</span>
            </div>
            <div className={styles.efficiencyLabel}>效率提升</div>
            <div className={styles.efficiencyChart}>
              <div className={styles.chartBar} style={{ height: '30%' }}>
                <span className={styles.chartLabel}>传统</span>
              </div>
              <div className={styles.chartBar} style={{ height: '100%', background: 'linear-gradient(135deg, #FF6B6B, #6C5CE7)' }}>
                <span className={styles.chartLabel}>PCode</span>
              </div>
            </div>
          </div>

          <p className={styles.featureDesc}>
            9 个阶段的完整提案流程，从想法到归档，AI 全流程辅助，
            让你的编码效率提升 3 倍。
          </p>
        </div>

        <div className={styles.workflowAnimation}>
          <div className={styles.workflowGrid}>
            {stages.map((stage, index) => (
              <motion.div
                key={stage.id}
                className={`${styles.workflowNode} ${activeStage === index ? styles.active : ''}`}
                animate={{
                  opacity: activeStage === index ? 1 : 0.4,
                  scale: activeStage === index ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.workflowIcon}>{stage.icon}</span>
                <span className={styles.workflowLabel}>{stage.label}</span>
                <span className={styles.workflowDesc}>{stage.desc}</span>
              </motion.div>
            ))}
          </div>
          <div className={styles.workflowProgress}>
            <motion.div
              className={styles.progressFill}
              animate={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 便捷特性区域 - 多线程操作
function ConvenientFeature() {
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    setAnimateBars(true);
  }, []);

  return (
    <div className={styles.featureZone} data-theme="convenient">
      <div className={styles.featurePattern} />
      <div className={styles.featureContent}>
        <div className={styles.featureText}>
          <div>
            <span className={styles.featureBadge}>CONVENIENT</span>
            <h2 className={styles.featureTitle}>便捷</h2>
            <p className={styles.featureSubtitle}>多线程操作，充分利用 AI 额度</p>
          </div>

          <div className={styles.quotaComparison}>
            <div className={styles.quotaItem}>
              <div className={styles.quotaBar}>
                <motion.div
                  className={styles.quotaFill}
                  style={{ background: 'linear-gradient(135deg, #666, #999)' }}
                  animate={{ width: animateBars ? '20%' : '0%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <span className={styles.quotaLabel}>传统单线程 20%</span>
            </div>
            <div className={styles.quotaArrow}>→</div>
            <div className={styles.quotaItem}>
              <div className={styles.quotaBar}>
                <motion.div
                  className={styles.quotaFill}
                  style={{ background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)' }}
                  animate={{ width: animateBars ? '100%' : '0%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className={styles.quotaLabel}>PCode 多线程 100%</span>
            </div>
          </div>

          <div className={styles.boostRange}>
            <span className={styles.boostLabel}>体验提升</span>
            <span className={styles.boostValue}>1.5x - 5x</span>
          </div>

          <p className={styles.featureDesc}>
            多线程并发操作让你同时处理多个任务，充分利用 GLM Pro 额度，
            从原本只能利用 20% 提升到 100%，实际体验提升 1.5 到 5 倍。
          </p>
        </div>

        <div className={styles.threadVisualization}>
          <div className={styles.threadContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.thread}>
                <div className={styles.threadTask}>
                  <span className={styles.threadIcon}>⚡</span>
                  <span className={styles.threadLabel}>Task {i}</span>
                </div>
                <motion.div
                  className={styles.threadProgress}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{
                    duration: 2,
                    delay: 0.3 * i,
                    repeat: Infinity,
                    repeatType: 'loop',
                    repeatDelay: 1,
                  }}
                />
              </div>
            ))}
          </div>
          <div className={styles.threadLabel}>多线程并发处理</div>
        </div>
      </div>
    </div>
  );
}

// 有趣特性区域 - 游戏化
function FunFeature() {
  return (
    <div className={styles.featureZone} data-theme="fun">
      <div className={styles.featurePattern} />
      <div className={styles.featureContent}>
        <div className={styles.featureText}>
          <div>
            <span className={styles.featureBadge}>FUN</span>
            <h2 className={styles.featureTitle}>有趣</h2>
            <p className={styles.featureSubtitle}>游戏化机制，让编码不再枯燥</p>
          </div>

          <div className={styles.gameFeatures}>
            <div className={styles.gameFeature}>
              <span className={styles.gameIcon}>🏆</span>
              <span className={styles.gameLabel}>成就系统</span>
              <p className={styles.gameDesc}>解锁 50+ 成就徽章</p>
            </div>
            <div className={styles.gameFeature}>
              <span className={styles.gameIcon}>📊</span>
              <span className={styles.gameLabel}>每日评级</span>
              <p className={styles.gameDesc}>S/A/B/C 等级评定</p>
            </div>
            <div className={styles.gameFeature}>
              <span className={styles.gameIcon}>🎨</span>
              <span className={styles.gameLabel}>游戏 UI</span>
              <p className={styles.gameDesc}>沉浸式游戏体验</p>
            </div>
          </div>

          <p className={styles.featureDesc}>
            告别单调的 IDE 体验，我们引入成就系统、每日评级和游戏化 UI，
            让每一次编码都充满乐趣，拥有更高的扩展性和未来性。
          </p>
        </div>

        <div className={styles.achievementShowcase}>
          <div className={styles.achievementGrid}>
            {[
              { icon: '🚀', name: '初次起飞', rarity: 'common' },
              { icon: '💎', name: '代码大师', rarity: 'rare' },
              { icon: '🔥', name: '连续编码', rarity: 'epic' },
              { icon: '👑', name: '传奇开发者', rarity: 'legendary' },
              { icon: '⚡', name: '闪电快手', rarity: 'rare' },
              { icon: '🎯', name: '精准打击', rarity: 'epic' },
            ].map((achievement) => (
              <motion.div
                key={achievement.name}
                className={`${styles.achievementCard} ${styles[achievement.rarity]}`}
                whileHover={{ scale: 1.1, rotateZ: 5 }}
              >
                <span className={styles.achievementIcon}>{achievement.icon}</span>
                <span className={styles.achievementName}>{achievement.name}</span>
                <span className={styles.achievementRarity}>{achievement.rarity}</span>
              </motion.div>
            ))}
          </div>
          <div className={styles.dailyReport}>
            <div className={styles.reportHeader}>
              <span className={styles.reportTitle}>今日评级</span>
              <span className={`${styles.reportGrade} ${styles.gradeS}`}>S</span>
            </div>
            <div className={styles.reportStats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>1,234</span>
                <span className={styles.statLabel}>Tokens</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>12</span>
                <span className={styles.statLabel}>成就</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>89%</span>
                <span className={styles.statLabel}>效率</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesShowcase(): JSX.Element {
  return (
    <section className={styles.featuresShowcase}>
      <div className="container">
        <div className={styles.showcaseHeader}>
          <h2 className={styles.showcaseTitle}>
            <span className={styles.titleHighlight}>三大核心特性</span>
          </h2>
          <p className={styles.showcaseSubtitle}>
            重新定义你的 AI 编码体验
          </p>
        </div>

        <div className={styles.zonesContainer}>
          <SmartFeature />
          <ConvenientFeature />
          <FunFeature />
        </div>
      </div>
    </section>
  );
}
