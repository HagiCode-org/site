<div align="center">

<!-- Aurora Gradient Header -->
<div style="
  background: linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%);
  padding: 80px 40px;
  border-radius: 0 0 40px 40px;
  position: relative;
  overflow: hidden;
  margin-bottom: 60px;
">

<!-- Aurora Background Effects -->
<div style="
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 61, 113, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(37, 99, 235, 0.3) 0%, transparent 50%);
  animation: aurora 15s ease-in-out infinite;
  pointer-events: none;
"></div>

<style>
@keyframes aurora {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(5deg); }
  66% { transform: translate(-20px, 20px) rotate(-5deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.3); }
  50% { box-shadow: 0 0 40px rgba(37, 99, 235, 0.6); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  animation: float 3s ease-in-out infinite;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.4);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.workflow-step {
  background: rgba(37, 99, 235, 0.1);
  border: 2px solid rgba(37, 99, 235, 0.3);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.workflow-step:hover {
  background: rgba(37, 99, 235, 0.2);
  border-color: rgba(37, 99, 235, 0.5);
  transform: scale(1.05);
}

.stat-bar {
  height: 24px;
  background: linear-gradient(90deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.stat-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

.achievement-badge {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.achievement-badge:hover {
  transform: translateY(-5px) scale(1.1);
}

.nav-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  display: block;
}

.nav-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(37, 99, 235, 0.5);
  transform: translateX(8px);
}
</style>

<!-- Logo & Title -->
<pre style="
  font-size: 14px;
  line-height: 1.4;
  color: #fff;
  margin: 0 0 30px 0;
  text-shadow: 0 0 30px rgba(37, 99, 235, 0.5);
">
<span style="color: #2563EB;">████████████████████████████████████████████████████████████████████████████████</span>
<span style="color: #3B82F6;">                                                                      </span>
<span style="color: #60A5FA;">   ███████╗██╗ ██████╗ ███╗   ██╗ █████╗ ██╗                    </span>
<span style="color: #93C5FD;">   ██╔════╝██║██╔════╝ ████╗  ██║██╔══██╗██║                    </span>
<span style="color: #BFDBFE;">   ███████╗██║██║  ███╗██╔██╗ ██║███████║██║                    </span>
<span style="color: #93C5FD;">   ╚════██║██║██║   ██║██║╚██╗██║██╔══██║██║                    </span>
<span style="color: #60A5FA;">   ███████║██║╚██████╔╝██║ ╚████║██║  ██║███████╗               </span>
<span style="color: #3B82F6;">   ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝               </span>
<span style="color: #2563EB;">                     DOCUMENTATION                                </span>
<span style="color: #3B82F6;">                                                                      </span>
<span style="color: #2563EB;">████████████████████████████████████████████████████████████████████████████████</span>
</pre>

<h1 style="
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #fff 0%, #93C5FD 50%, #C4B5FD 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
">
  智能 · 便捷 · 有趣
</h1>

<p style="
  font-size: 20px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 40px 0;
  font-weight: 400;
">
  用 AI 重新定义代码开发体验
</p>

<!-- CTA Buttons -->
<div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
  <a href="./docs/installation" class="btn-primary">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
    开始使用
  </a>
  <a href="./docs/quick-start/conversation-session" class="btn-secondary">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
    快速入门
  </a>
  <a href="https://github.com/Hagicode-org/hagicode-docs" class="btn-secondary">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    GitHub
  </a>
</div>

</div>

</div>

<!-- Product Introduction -->
<div style="max-width: 1200px; margin: 0 auto 60px; padding: 0 24px;">
<div class="glass-card" style="padding: 40px;">
<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#cloud-gradient)" stroke-width="2">
    <defs>
      <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#2563EB"/>
        <stop offset="100%" style="stop-color:#7C3AED"/>
      </linearGradient>
    </defs>
    <path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3s1.3 3 3 3h11c1.7 0 3-1.3 3-3z"/>
    <path d="M14.5 9c0-2.5-2-4.5-4.5-4.5S5.5 6.5 5.5 9c0 .5.1 1 .3 1.4"/>
    <path d="M18.5 13c1.7 0 3-1.3 3-3s-1.3-3-3-3c-.5 0-1 .1-1.4.3"/>
  </svg>
  <h2 style="margin: 0; font-size: 28px; font-weight: 700;">产品介绍</h2>
</div>
<p style="color: rgba(255,255,255,0.7); font-size: 18px; line-height: 1.8; margin: 0;">
  <strong style="color: #fff;">Hagicode</strong> 是一款 <strong style="background: linear-gradient(135deg, #2563EB, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AI 驱动的代码智能助手</strong>，通过创新的 <strong style="color: #60A5FA;">OpenSpec 工作流</strong>、<strong style="color: #60A5FA;">多线程并发操作</strong> 和 <strong style="color: #60A5FA;">游戏化机制</strong>，为开发者带来前所未有的编码体验。
</p>
</div>
</div>

<!-- Three Core Features -->
<div style="max-width: 1200px; margin: 0 auto 80px; padding: 0 24px;">
<h2 style="text-align: center; font-size: 32px; font-weight: 700; margin-bottom: 40px;">三大核心特性</h2>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">

<!-- Feature 1: 智能 -->
<div class="glass-card" style="padding: 40px; text-align: center;">
  <div class="feature-icon" style="animation-delay: 0s;">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  </div>
  <h3 style="font-size: 24px; font-weight: 700; margin: 0 0 12px 0;">智能</h3>
  <p style="color: rgba(255,255,255,0.6); font-size: 16px; margin: 0 0 16px 0;">OpenSpec 工作流</p>
  <div style="display: inline-block; padding: 8px 20px; background: rgba(37, 99, 235, 0.2); border-radius: 20px; font-weight: 600; color: #60A5FA;">
    AI 编码效率 ↑300%
  </div>
</div>

<!-- Feature 2: 便捷 -->
<div class="glass-card" style="padding: 40px; text-align: center;">
  <div class="feature-icon" style="animation-delay: 0.5s; background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  </div>
  <h3 style="font-size: 24px; font-weight: 700; margin: 0 0 12px 0;">便捷</h3>
  <p style="color: rgba(255,255,255,0.6); font-size: 16px; margin: 0 0 16px 0;">多线程操作</p>
  <div style="display: inline-block; padding: 8px 20px; background: rgba(124, 58, 237, 0.2); border-radius: 20px; font-weight: 600; color: #A78BFA;">
    额度利用率 20%→100%
  </div>
</div>

<!-- Feature 3: 有趣 -->
<div class="glass-card" style="padding: 40px; text-align: center;">
  <div class="feature-icon" style="animation-delay: 1s; background: linear-gradient(135deg, #EC4899 0%, #F97316 100%);">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  </div>
  <h3 style="font-size: 24px; font-weight: 700; margin: 0 0 12px 0;">有趣</h3>
  <p style="color: rgba(255,255,255,0.6); font-size: 16px; margin: 0 0 16px 0;">游戏化机制</p>
  <div style="display: inline-block; padding: 8px 20px; background: rgba(236, 72, 153, 0.2); border-radius: 20px; font-weight: 600; color: #F472B6;">
    让编码不再枯燥
  </div>
</div>

</div>
</div>

<!-- OpenSpec Workflow -->
<div style="max-width: 1200px; margin: 0 auto 80px; padding: 0 24px;">
<div class="glass-card" style="padding: 48px;">
<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
  <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #2563EB, #7C3AED); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01"/>
    </svg>
  </div>
  <div>
    <h2 style="margin: 0; font-size: 28px; font-weight: 700;">智能 · OpenSpec 工作流</h2>
    <p style="margin: 4px 0 0 0; color: rgba(255,255,255,0.5);">9 阶段智能开发流程</p>
  </div>
</div>

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
  <div class="workflow-step">
    <div style="font-size: 24px; margin-bottom: 8px;">💡</div>
    <div style="font-weight: 700; color: #fff;">IDEA</div>
    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">想法构思</div>
  </div>
  <div style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">→</div>
  <div class="workflow-step">
    <div style="font-size: 24px; margin-bottom: 8px;">📄</div>
    <div style="font-weight: 700; color: #fff;">PROPOSAL</div>
    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">AI 生成提案</div>
  </div>
  <div style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">→</div>
  <div class="workflow-step">
    <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
    <div style="font-weight: 700; color: #fff;">REVIEW</div>
    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">自动评审</div>
  </div>
</div>

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
  <div class="workflow-step">
    <div style="font-size: 24px; margin-bottom: 8px;">⚙️</div>
    <div style="font-weight: 700; color: #fff;">TASKS</div>
    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">任务分解</div>
  </div>
  <div style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">→</div>
  <div class="workflow-step">
    <div style="font-size: 24px; margin-bottom: 8px;">💻</div>
    <div style="font-weight: 700; color: #fff;">CODE</div>
    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">智能编码</div>
  </div>
  <div style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">→</div>
  <div class="workflow-step">
    <div style="font-size: 24px; margin-bottom: 8px;">🧪</div>
    <div style="font-weight: 700; color: #fff;">TEST</div>
    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">自动测试</div>
  </div>
</div>

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px;">
  <div class="workflow-step">
    <div style="font-size: 24px; margin-bottom: 8px;">🔧</div>
    <div style="font-weight: 700; color: #fff;">REFACTOR</div>
    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">代码重构</div>
  </div>
  <div style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">→</div>
  <div class="workflow-step">
    <div style="font-size: 24px; margin-bottom: 8px;">📚</div>
    <div style="font-weight: 700; color: #fff;">DOCS</div>
    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">文档生成</div>
  </div>
  <div style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">→</div>
  <div class="workflow-step">
    <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
    <div style="font-weight: 700; color: #fff;">ARCHIVE</div>
    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">知识归档</div>
  </div>
</div>
</div>
</div>

<!-- Multi-threading Comparison -->
<div style="max-width: 1200px; margin: 0 auto 80px; padding: 0 24px;">
<div class="glass-card" style="padding: 48px;">
<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
  <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #7C3AED, #EC4899); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  </div>
  <div>
    <h2 style="margin: 0; font-size: 28px; font-weight: 700;">便捷 · 多线程操作</h2>
    <p style="margin: 4px 0 0 0; color: rgba(255,255,255,0.5);">额度利用率对比</p>
  </div>
</div>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; margin-bottom: 24px;">
  <!-- Traditional -->
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
      <span style="font-weight: 600; color: rgba(255,255,255,0.7);">传统单线程</span>
      <span style="color: #EF4444; font-weight: 700;">20%</span>
    </div>
    <div style="background: rgba(255,255,255,0.1); height: 24px; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(90deg, #EF4444, #F87171); width: 20%; height: 100%;"></div>
    </div>
  </div>

  <!-- Hagicode -->
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
      <span style="font-weight: 600; color: rgba(255,255,255,0.7);">Hagicode 多线程</span>
      <span style="color: #10B981; font-weight: 700;">100%</span>
    </div>
    <div class="stat-bar"></div>
  </div>
</div>

<div style="text-align: center; padding: 20px; background: rgba(16, 185, 129, 0.1); border-radius: 12px;">
  <span style="font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #10B981, #34D399); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
    体验提升 1.5x — 5x
  </span>
</div>
</div>
</div>

<!-- Gamification -->
<div style="max-width: 1200px; margin: 0 auto 80px; padding: 0 24px;">
<div class="glass-card" style="padding: 48px;">
<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
  <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #EC4899, #F97316); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  </div>
  <div>
    <h2 style="margin: 0; font-size: 28px; font-weight: 700;">有趣 · 游戏化机制</h2>
    <p style="margin: 4px 0 0 0; color: rgba(255,255,255,0.5);">让编码充满乐趣</p>
  </div>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
  <!-- Achievement System -->
  <div>
    <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 20px; text-align: center;">🏆 成就系统</h3>
    <p style="text-align: center; color: rgba(255,255,255,0.5); margin-bottom: 20px;">解锁 50+ 成就徽章</p>
    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
      <div class="achievement-badge" style="background: linear-gradient(135deg, #6B7280, #9CA3AF);">
        <span style="font-size: 24px;">🚀</span>
        <span>初次起飞</span>
        <span style="opacity: 0.7;">COMMON</span>
      </div>
      <div class="achievement-badge" style="background: linear-gradient(135deg, #3B82F6, #60A5FA);">
        <span style="font-size: 24px;">💎</span>
        <span>代码大师</span>
        <span style="opacity: 0.7;">RARE</span>
      </div>
      <div class="achievement-badge" style="background: linear-gradient(135deg, #8B5CF6, #A78BFA);">
        <span style="font-size: 24px;">🔥</span>
        <span>连续编码</span>
        <span style="opacity: 0.7;">EPIC</span>
      </div>
      <div class="achievement-badge" style="background: linear-gradient(135deg, #F59E0B, #FBBF24);">
        <span style="font-size: 24px;">👑</span>
        <span>传奇开发</span>
        <span style="opacity: 0.7;">LEGENDARY</span>
      </div>
    </div>
  </div>

  <!-- Daily Rating -->
  <div>
    <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 20px; text-align: center;">📊 每日评级</h3>
    <p style="text-align: center; color: rgba(255,255,255,0.5); margin-bottom: 20px;">S/A/B/C 等级评定</p>
    <div style="background: rgba(0,0,0,0.3); border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #F59E0B, #FBBF24); border-radius: 8px; font-size: 24px; font-weight: 800; color: #000;">
          今日评级: S
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
        <div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.5);">Tokens</div>
          <div style="font-size: 20px; font-weight: 700; color: #60A5FA;">1,234</div>
        </div>
        <div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.5);">成就</div>
          <div style="font-size: 20px; font-weight: 700; color: #F472B6;">12</div>
        </div>
        <div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.5);">效率</div>
          <div style="font-size: 20px; font-weight: 700; color: #34D399;">89%</div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</div>

<!-- Documentation Navigation -->
<div style="max-width: 1200px; margin: 0 auto 80px; padding: 0 24px;">
<h2 style="text-align: center; font-size: 32px; font-weight: 700; margin-bottom: 40px;">📖 文档库导航</h2>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">

<a href="./docs/installation" class="nav-card">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" style="margin-bottom: 16px;">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">📦 安装指南</h3>
  <ul style="margin: 0; padding-left: 16px; color: rgba(255,255,255,0.6); font-size: 14px;">
    <li>Docker Compose 部署 — 推荐方式</li>
    <li>包部署 — 灵活定制</li>
  </ul>
</a>

<a href="./docs/quick-start/conversation-session" class="nav-card">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" style="margin-bottom: 16px;">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">🚀 快速入门</h3>
  <ul style="margin: 0; padding-left: 16px; color: rgba(255,255,255,0.6); font-size: 14px;">
    <li>会话管理 — 第一个 AI 会话</li>
    <li>创建项目 — 管理你的项目</li>
    <li>提案会话 — OpenSpec 流程</li>
  </ul>
</a>

<a href="./docs/related-software-installation" class="nav-card">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4899" stroke-width="2" style="margin-bottom: 16px;">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">🔧 相关软件安装</h3>
  <ul style="margin: 0; padding-left: 16px; color: rgba(255,255,255,0.6); font-size: 14px;">
    <li>Claude Code + Zai</li>
    <li>OpenSpec</li>
    <li>Node.js / PostgreSQL</li>
  </ul>
</a>

<a href="./docs/contributor-guide" class="nav-card">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" style="margin-bottom: 16px;">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">🤝 贡献指南</h3>
  <ul style="margin: 0; padding-left: 16px; color: rgba(255,255,255,0.6); font-size: 14px;">
    <li>Mermaid 图表指南</li>
    <li>文档贡献规范</li>
  </ul>
</a>

</div>
</div>

<!-- Development Guide -->
<div style="max-width: 1200px; margin: 0 auto 60px; padding: 0 24px;">
<div class="glass-card" style="padding: 40px;">
<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#dev-gradient)" stroke-width="2">
    <defs>
      <linearGradient id="dev-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#2563EB"/>
        <stop offset="100%" style="stop-color:#10B981"/>
      </linearGradient>
    </defs>
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
  <h2 style="margin: 0; font-size: 24px; font-weight: 700;">🛠️ 文档站点开发</h2>
</div>

<p style="color: rgba(255,255,255,0.6); margin: 0 0 24px 0;">
  基于 <a href="https://docusaurus.io/" style="color: #60A5FA; text-decoration: none;">Docusaurus</a> 构建的文档站点
</p>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
  <div>
    <h4 style="margin: 0 0 12px 0; font-size: 14px; color: rgba(255,255,255,0.7);">快速开始</h4>
    <div style="background: rgba(0,0,0,0.4); border-radius: 8px; padding: 16px; font-family: 'Fira Code', monospace; font-size: 13px; line-height: 1.8;">
      <div style="color: rgba(255,255,255,0.5);"># 安装依赖</div>
      <div><span style="color: #10B981;">npm</span> install</div>
      <div style="color: rgba(255,255,255,0.5); margin-top: 8px;"># 启动开发服务器</div>
      <div><span style="color: #10B981;">npm</span> start</div>
      <div style="color: rgba(255,255,255,0.5); margin-top: 8px;"># 构建生产版本</div>
      <div><span style="color: #10B981;">npm</span> build</div>
    </div>
  </div>

  <div>
    <h4 style="margin: 0 0 12px 0; font-size: 14px; color: rgba(255,255,255,0.7);">环境要求</h4>
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
        <td style="padding: 8px 0; color: rgba(255,255,255,0.6);">依赖</td>
        <td style="padding: 8px 0; color: rgba(255,255,255,0.6);">版本</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #fff;">Node.js</td>
        <td style="padding: 8px 0; color: #60A5FA;">≥18.0</td>
      </tr>
    </table>

    <h4 style="margin: 20px 0 12px 0; font-size: 14px; color: rgba(255,255,255,0.7);">项目结构</h4>
    <div style="background: rgba(0,0,0,0.4); border-radius: 8px; padding: 16px; font-family: 'Fira Code', monospace; font-size: 12px; line-height: 1.6;">
      <div style="color: rgba(255,255,255,0.5);">pcode-docs/</div>
      <div style="padding-left: 16px;">├── docs/ <span style="color: rgba(255,255,255,0.3);"># 文档内容</span></div>
      <div style="padding-left: 16px;">├── src/ <span style="color: rgba(255,255,255,0.3);"># 源代码</span></div>
      <div style="padding-left: 16px;">├── static/ <span style="color: rgba(255,255,255,0.3);"># 静态资源</span></div>
      <div style="padding-left: 16px;">└── docusaurus.config.ts</div>
    </div>
  </div>
</div>
</div>
</div>

<!-- Footer -->
<div style="
  background: linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%);
  padding: 60px 40px;
  border-radius: 40px 40px 0 0;
  text-align: center;
">
<div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px;">
  <a href="https://pcode-org.github.io/site/" style="
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: rgba(255,255,255,0.1);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.1);
  " onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
    官网
  </a>
  <a href="https://github.com/Hagicode-org/hagicode-docs" style="
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: rgba(255,255,255,0.1);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.1);
  " onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    GitHub
  </a>
  <a href="./blog" style="
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: rgba(255,255,255,0.1);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.1);
  " onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
    博客
  </a>
  <a href="https://docusaurus.io/" style="
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: rgba(255,255,255,0.1);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.1);
  " onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.583 2H6.417A2.417 2.417 0 0 0 4 4.417v15.166A2.417 2.417 0 0 0 6.417 22h11.166A2.417 2.417 0 0 0 20 19.583V4.417A2.417 2.417 0 0 0 17.583 2zM7.5 4.5h9v4h-9v-4zm4.5 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
    </svg>
    Docusaurus 3.0
  </a>
</div>
<p style="color: rgba(255,255,255,0.5); margin: 0;">
  Built with ❤️ and 🎮
</p>
</div>
