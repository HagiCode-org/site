/**
 * ArchitectureDiagram 组件 - explain how HagiCode works end-to-end.
 */
import type { CSSProperties } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useLocale } from '@/lib/useLocale';
import { useTranslation } from '@/i18n/ui';
import styles from './ArchitectureDiagram.module.css';

interface ArchitectureItem {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
}

interface ArchitectureLayer {
  id: string;
  name: string;
  nameEn: string;
  purpose: string;
  purposeEn: string;
  input: string;
  inputEn: string;
  output: string;
  outputEn: string;
  items: ArchitectureItem[];
  accentColor: string;
}

interface BenefitItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

interface LocaleCopy {
  eyebrow: string;
  flow: string;
  layerWord: string;
  layerTag: string;
  startNode: string;
  endNode: string;
  flowDirection: string;
  purposeLabel: string;
  inputLabel: string;
  outputLabel: string;
  componentsLabel: string;
  loopBack: string;
  whyTitle: string;
  whySubtitle: string;
}

type Locale = 'zh-CN' | 'en';

const copyByLocale: Record<Locale, LocaleCopy> = {
  'zh-CN': {
    eyebrow: 'HagiCode 工作原理',
    flow: '从目标到可交付结果的四层协同',
    layerWord: '层',
    layerTag: '阶段',
    startNode: '你描述目标',
    endNode: '你快速审查并交付',
    flowDirection: '请求向下分解，结果向上回传',
    purposeLabel: '这一层在做什么',
    inputLabel: '输入',
    outputLabel: '输出',
    componentsLabel: '核心组件',
    loopBack: '每轮结果都会反馈到上层，持续优化下一轮执行',
    whyTitle: '为什么这套架构让 HagiCode 很强',
    whySubtitle: '不是单点模型，而是目标、流程、执行、模型的闭环系统',
  },
  en: {
    eyebrow: 'How HagiCode Works',
    flow: 'A 4-layer collaboration from goal to shippable result',
    layerWord: 'Layers',
    layerTag: 'Stage',
    startNode: 'You describe the goal',
    endNode: 'You review and ship faster',
    flowDirection: 'Requests go downward, results flow back upward',
    purposeLabel: 'What this layer does',
    inputLabel: 'Input',
    outputLabel: 'Output',
    componentsLabel: 'Core components',
    loopBack: 'Every iteration feeds back upward to improve the next one',
    whyTitle: 'Why this architecture makes HagiCode amazing',
    whySubtitle: 'It is a closed loop of intent, orchestration, execution, and models',
  },
};

const architectureLayers: ArchitectureLayer[] = [
  {
    id: 'value',
    name: '价值层',
    nameEn: 'Value Layer',
    purpose: '把用户需求变成清晰的成功标准（质量、速度、体验）',
    purposeEn: 'Converts user intent into clear success signals: quality, speed, and DX',
    input: '需求描述 + 项目上下文',
    inputEn: 'Goal description + project context',
    output: '可执行的目标优先级',
    outputEn: 'Prioritized execution objective',
    accentColor: '#10B981',
    items: [
      { id: 'smart', name: '智能决策', nameEn: 'Smart Decisions', icon: '🧠', color: '#10B981' },
      { id: 'efficient', name: '效率优先', nameEn: 'Speed First', icon: '⚡', color: '#F59E0B' },
      { id: 'fun', name: '开发体验', nameEn: 'Dev Experience', icon: '✨', color: '#8B5CF6' },
    ],
  },
  {
    id: 'orchestration',
    name: '编排层',
    nameEn: 'Orchestration Layer',
    purpose: '用 OpenSpec 与工作流引擎把目标拆分为可追踪步骤',
    purposeEn: 'Transforms objectives into trackable steps with OpenSpec and workflows',
    input: '优先级目标 + 约束条件',
    inputEn: 'Prioritized objective + constraints',
    output: '带质量闸门的执行蓝图',
    outputEn: 'Execution blueprint with quality gates',
    accentColor: '#3B82F6',
    items: [
      { id: 'hagicode', name: 'HagiCode Core', nameEn: 'HagiCode Core', icon: '🔷', color: '#3B82F6' },
      { id: 'openspec', name: 'OpenSpec', nameEn: 'OpenSpec', icon: '📋', color: '#06B6D4' },
      { id: 'workflow', name: '流程引擎', nameEn: 'Workflow Engine', icon: '🧭', color: '#6366F1' },
    ],
  },
  {
    id: 'execution',
    name: '执行层',
    nameEn: 'Execution Layer',
    purpose: 'Agent 在受控环境中改代码、跑命令、做验证并自动迭代',
    purposeEn: 'Agents edit code, run commands, validate results, and iterate safely',
    input: '执行蓝图 + 当前仓库状态',
    inputEn: 'Execution blueprint + live repo state',
    output: '可验证的改动与执行证据',
    outputEn: 'Verifiable changes with execution evidence',
    accentColor: '#F97316',
    items: [
      { id: 'claude-code', name: 'Claude Code', nameEn: 'Claude Code', icon: '🤖', color: '#A855F7' },
      { id: 'codex', name: 'Codex', nameEn: 'Codex', icon: '🔬', color: '#EC4899' },
      { id: 'cli', name: 'CLI 工具链', nameEn: 'CLI Tooling', icon: '🛠', color: '#F97316' },
    ],
  },
  {
    id: 'models',
    name: '模型层',
    nameEn: 'Model Layer',
    purpose: '多模型协同路由：不同子任务调用最合适的模型组合',
    purposeEn: 'Routes each sub-task to the best model combination',
    input: '子任务上下文 + 历史反馈',
    inputEn: 'Subtask context + historical feedback',
    output: '高质量推理与代码建议',
    outputEn: 'High-quality reasoning and code suggestions',
    accentColor: '#EF4444',
    items: [
      { id: 'claude-ops', name: 'Claude Ops', nameEn: 'Claude Ops', icon: '🧩', color: '#EF4444' },
      { id: 'gpt-codex', name: 'GPT Codex', nameEn: 'GPT Codex', icon: '💠', color: '#10B981' },
      { id: 'glm-5', name: 'GLM-5', nameEn: 'GLM-5', icon: '🔶', color: '#3B82F6' },
      { id: 'qwen', name: 'Qwen', nameEn: 'Qwen', icon: '◈', color: '#F59E0B' },
      { id: 'kimi', name: 'Kimi K2.5', nameEn: 'Kimi K2.5', icon: '◐', color: '#8B5CF6' },
      { id: 'minimax', name: 'Minimax M2.5', nameEn: 'Minimax M2.5', icon: '◆', color: '#06B6D4' },
    ],
  },
];

const benefitItems: BenefitItem[] = [
  {
    id: 'routing',
    title: '任务级模型路由',
    titleEn: 'Task-Level Model Routing',
    description: '不是固定单模型，而是按任务选择最优模型与 Agent 组合。',
    descriptionEn: 'Not one model for all tasks. HagiCode picks the best model-agent pair per task.',
  },
  {
    id: 'predictability',
    title: '可预测的交付过程',
    titleEn: 'Predictable Delivery',
    description: 'OpenSpec 把模糊需求变成可审查、可追踪、可回放的执行路径。',
    descriptionEn: 'OpenSpec turns vague requests into reviewable and traceable execution paths.',
  },
  {
    id: 'closed-loop',
    title: '持续进化的闭环',
    titleEn: 'Self-Improving Loop',
    description: '每轮执行结果会反哺策略，下一轮更快、更稳、更贴合目标。',
    descriptionEn: 'Every run improves the next one with tighter quality, speed, and alignment.',
  },
];

function hexToRgbChannels(color: string): string {
  const normalized = color.replace('#', '');
  const hex = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;
  const value = Number.parseInt(hex, 16);

  if (Number.isNaN(value)) {
    return '0, 128, 255';
  }

  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `${red}, ${green}, ${blue}`;
}

function LayerCard({
  layer,
  index,
  locale,
  copy,
  isLast,
}: {
  layer: ArchitectureLayer;
  index: number;
  locale: Locale;
  copy: LocaleCopy;
  isLast: boolean;
}) {
  const accentRgb = hexToRgbChannels(layer.accentColor);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.article
      className={styles.layerCard}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{
        '--layer-accent': layer.accentColor,
        '--layer-accent-rgb': accentRgb,
      } as CSSProperties}
    >
      <div className={styles.layerHeader}>
        <div className={styles.layerIdentity}>
          <span className={styles.layerTag}>
            {copy.layerTag} {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className={styles.layerTitle}>
            {locale === 'zh-CN' ? layer.name : layer.nameEn}
          </h3>
        </div>
      </div>

      <p className={styles.layerPurpose}>
        <strong>{copy.purposeLabel}: </strong>
        {locale === 'zh-CN' ? layer.purpose : layer.purposeEn}
      </p>

      <div className={styles.ioGrid}>
        <div className={styles.ioBlock}>
          <span className={styles.ioLabel}>{copy.inputLabel}</span>
          <p>{locale === 'zh-CN' ? layer.input : layer.inputEn}</p>
        </div>
        <div className={styles.ioBlock}>
          <span className={styles.ioLabel}>{copy.outputLabel}</span>
          <p>{locale === 'zh-CN' ? layer.output : layer.outputEn}</p>
        </div>
      </div>

      <div className={styles.componentZone}>
        <span className={styles.componentLabel}>{copy.componentsLabel}</span>
        <ul className={styles.layerItems}>
          {layer.items.map((item, itemIndex) => (
            <motion.li
              key={item.id}
              className={styles.layerItem}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1 + itemIndex * 0.04 + 0.2,
                duration: 0.28,
              }}
              style={{
                '--item-color': item.color,
                '--item-color-rgb': hexToRgbChannels(item.color),
              } as CSSProperties}
            >
              <span className={styles.itemIcon}>{item.icon}</span>
              <span className={styles.itemName}>
                {locale === 'zh-CN' ? item.name : item.nameEn}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {!isLast && (
        <div className={styles.layerConnector} aria-hidden="true">
          <span className={styles.connectorRail} />
          <motion.span
            className={styles.connectorPulse}
            animate={{ y: [-2, 24, -2], opacity: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}
    </motion.article>
  );
}

export default function ArchitectureDiagram({
  locale: propLocale,
}: {
  locale?: Locale;
}) {
  const { locale: detectedLocale } = useLocale();
  const locale = propLocale || detectedLocale;
  const { t } = useTranslation(locale);
  const copy = copyByLocale[locale];

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section className={styles.architectureSection}>
      <div className={styles.bgMesh} aria-hidden="true" />
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className="container">
        <motion.div
          className={styles.sectionHeader}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <span className={styles.sectionEyebrow}>{copy.eyebrow}</span>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleHighlight}>
              {locale === 'zh-CN' ? t('architectureDiagram.title') : t('architectureDiagram.titleEn')}
            </span>
          </h2>
          <p className={styles.sectionSubtitle}>
            {locale === 'zh-CN' ? t('architectureDiagram.subtitle') : t('architectureDiagram.subtitleEn')}
          </p>
          <div className={styles.quickMeta}>
            <span className={styles.metaChip}>{copy.flow}</span>
            <span className={styles.metaChip}>
              {architectureLayers.length} {copy.layerWord}
            </span>
          </div>
        </motion.div>

        <div className={styles.flowRail} aria-hidden="true">
          <span className={styles.flowNode}>{copy.startNode}</span>
          <span className={styles.flowTrack} />
          <span className={styles.flowNode}>{copy.endNode}</span>
        </div>
        <p className={styles.flowDirection}>{copy.flowDirection}</p>

        <div className={styles.architectureContainer}>
          {architectureLayers.map((layer, index) => (
            <LayerCard
              key={layer.id}
              layer={layer}
              index={index}
              locale={locale}
              copy={copy}
              isLast={index === architectureLayers.length - 1}
            />
          ))}
        </div>

        <p className={styles.loopBackNote}>{copy.loopBack}</p>

        <div className={styles.whySection}>
          <h3>{copy.whyTitle}</h3>
          <p>{copy.whySubtitle}</p>
          <div className={styles.whyGrid}>
            {benefitItems.map((benefit) => (
              <article key={benefit.id} className={styles.whyCard}>
                <h4>{locale === 'zh-CN' ? benefit.title : benefit.titleEn}</h4>
                <p>{locale === 'zh-CN' ? benefit.description : benefit.descriptionEn}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
