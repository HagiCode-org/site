import type { CSSProperties } from 'react';
import { motion, type Variants } from 'framer-motion';
import ChatGLM from '@lobehub/icons/es/ChatGLM';
import Claude from '@lobehub/icons/es/Claude';
import ClaudeCode from '@lobehub/icons/es/ClaudeCode';
import Cline from '@lobehub/icons/es/Cline';
import Codex from '@lobehub/icons/es/Codex';
import Kimi from '@lobehub/icons/es/Kimi';
import Minimax from '@lobehub/icons/es/Minimax';
import Qwen from '@lobehub/icons/es/Qwen';
import { useLocale } from '@/lib/useLocale';
import { useTranslation } from '@/i18n/ui';
import styles from './ArchitectureDiagram.module.css';

type Locale = 'zh-CN' | 'en';

interface LayerEntity {
  id: string;
  name: string;
  iconKey: string;
  fallbackLabel: string;
  color: string;
  emphasis?: boolean;
}

interface LayerData {
  id: string;
  name: string;
  coreValue: string;
  supportItems: string[];
  accentColor: string;
  entities?: LayerEntity[];
}

interface BenefitItem {
  id: string;
  title: string;
  description: string;
}

interface DiagramCopy {
  eyebrow: string;
  sectionTitle: string;
  sectionSubtitle: string;
  flow: string;
  layerWord: string;
  layerTag: string;
  startNode: string;
  endNode: string;
  flowDirection: string;
  directionHint: string;
  coreValueLabel: string;
  supportLabel: string;
  entitiesLabel: string;
  loopBack: string;
  whyTitle: string;
  whySubtitle: string;
  fallbackLayerName: string;
  fallbackCoreValue: string;
  fallbackSupportItem: string;
  layers: LayerData[];
  benefits: BenefitItem[];
}

const defaultCopyByLocale: Record<Locale, DiagramCopy> = {
  'zh-CN': {
    eyebrow: 'HagiCode 工作原理',
    sectionTitle: '项目价值层次四层结构',
    sectionSubtitle: '把“目标 - 编排 - 执行 - 模型能力”变成可快速理解的统一表达',
    flow: '从目标到可交付结果的四层协同',
    layerWord: '层',
    layerTag: '层级',
    startNode: '你描述目标',
    endNode: '你快速审查并交付',
    flowDirection: '请求向下分解，结果向上回传',
    directionHint: '价值向上汇聚',
    coreValueLabel: '核心价值',
    supportLabel: '主要支持内容',
    entitiesLabel: '关键主体',
    loopBack: '每轮结果都会反馈到上层，持续优化下一轮执行。',
    whyTitle: '为什么这套结构更容易理解',
    whySubtitle: '统一模板 + 层级关系 + 关键主体图标锚点，让信息一眼可读。',
    fallbackLayerName: '未命名层级',
    fallbackCoreValue: '核心价值待补充',
    fallbackSupportItem: '支持内容待补充',
    layers: [
      {
        id: 'value',
        name: '价值层',
        coreValue: '将用户目标转化为可衡量的业务结果与体验指标。',
        supportItems: ['目标对齐', '价值评估', '结果复盘'],
        accentColor: '#10B981',
      },
      {
        id: 'orchestration',
        name: '编排层',
        coreValue: '将抽象目标拆解为可追踪、可审查、可回放的执行路径。',
        supportItems: ['OpenSpec 分解', '流程治理', '质量闸门'],
        accentColor: '#3B82F6',
      },
      {
        id: 'execution',
        name: '执行层（CLI）',
        coreValue: '在受控环境中持续执行代码改动、命令验证与迭代闭环。',
        supportItems: ['代码变更', '命令执行', '结果验证'],
        accentColor: '#F97316',
        entities: [
          {
            id: 'claude-code',
            name: 'Claude Code',
            iconKey: 'claude-code',
            fallbackLabel: 'CLD',
            color: '#FB923C',
            emphasis: true,
          },
          {
            id: 'codex-cli',
            name: 'Codex CLI',
            iconKey: 'codex',
            fallbackLabel: 'CDX',
            color: '#22D3EE',
            emphasis: true,
          },
          {
            id: 'cli-tooling',
            name: 'CLI Tooling',
            iconKey: 'cline',
            fallbackLabel: 'CLI',
            color: '#FDBA74',
          },
        ],
      },
      {
        id: 'models',
        name: '模型层',
        coreValue: '按子任务动态选择最匹配模型，平衡质量、速度与成本。',
        supportItems: ['任务路由', '多模型协同', '反馈再优化'],
        accentColor: '#EF4444',
        entities: [
          {
            id: 'claude-ops',
            name: 'Claude',
            iconKey: 'claude',
            fallbackLabel: 'CLD',
            color: '#FB7185',
            emphasis: true,
          },
          {
            id: 'gpt-codex',
            name: 'Codex',
            iconKey: 'codex',
            fallbackLabel: 'CDX',
            color: '#60A5FA',
            emphasis: true,
          },
          {
            id: 'glm-5',
            name: 'GLM-5',
            iconKey: 'chatglm',
            fallbackLabel: 'G5',
            color: '#93C5FD',
          },
          {
            id: 'qwen',
            name: 'Qwen',
            iconKey: 'qwen',
            fallbackLabel: 'QW',
            color: '#FCA5A5',
          },
          {
            id: 'kimi',
            name: 'Kimi K2.5',
            iconKey: 'kimi',
            fallbackLabel: 'KM',
            color: '#F9A8D4',
          },
          {
            id: 'minimax',
            name: 'Minimax M2.5',
            iconKey: 'minimax',
            fallbackLabel: 'MM',
            color: '#FDBA74',
          },
        ],
      },
    ],
    benefits: [
      {
        id: 'scan',
        title: '可一眼扫读',
        description: '统一模板减少理解跳跃，用户无需在长文中寻找重点。',
      },
      {
        id: 'hierarchy',
        title: '层级关系清晰',
        description: '方向提示与稳定顺序帮助用户快速建立整体认知。',
      },
      {
        id: 'anchor',
        title: '关键主体可识别',
        description: 'CLI 与模型使用图标锚点，避免 emoji 造成识别噪音。',
      },
    ],
  },
  en: {
    eyebrow: 'How HagiCode Works',
    sectionTitle: 'Four-Layer Value Structure',
    sectionSubtitle: 'A unified view from intent to orchestration, execution, and model capability',
    flow: 'A 4-layer collaboration from goal to shippable result',
    layerWord: 'Layers',
    layerTag: 'Layer',
    startNode: 'You describe the goal',
    endNode: 'You review and ship faster',
    flowDirection: 'Requests go downward, results flow back upward',
    directionHint: 'Value accumulates upward',
    coreValueLabel: 'Core value',
    supportLabel: 'Main support',
    entitiesLabel: 'Key entities',
    loopBack: 'Each iteration feeds improvements upward for the next run.',
    whyTitle: 'Why this structure is easier to understand',
    whySubtitle: 'A single template + clear hierarchy + icon anchors for instant recognition.',
    fallbackLayerName: 'Unnamed layer',
    fallbackCoreValue: 'Core value is not configured yet',
    fallbackSupportItem: 'Support item is not configured yet',
    layers: [
      {
        id: 'value',
        name: 'Value Layer',
        coreValue: 'Translates user intent into measurable business and DX outcomes.',
        supportItems: ['Goal alignment', 'Value scoring', 'Outcome review'],
        accentColor: '#10B981',
      },
      {
        id: 'orchestration',
        name: 'Orchestration Layer',
        coreValue: 'Breaks abstract goals into trackable, reviewable, replayable plans.',
        supportItems: ['OpenSpec planning', 'Workflow governance', 'Quality gates'],
        accentColor: '#3B82F6',
      },
      {
        id: 'execution',
        name: 'Execution Layer (CLI)',
        coreValue: 'Runs code changes, command validation, and iterative feedback safely.',
        supportItems: ['Code edits', 'Command execution', 'Result validation'],
        accentColor: '#F97316',
        entities: [
          {
            id: 'claude-code',
            name: 'Claude Code',
            iconKey: 'claude-code',
            fallbackLabel: 'CLD',
            color: '#FB923C',
            emphasis: true,
          },
          {
            id: 'codex-cli',
            name: 'Codex CLI',
            iconKey: 'codex',
            fallbackLabel: 'CDX',
            color: '#22D3EE',
            emphasis: true,
          },
          {
            id: 'cli-tooling',
            name: 'CLI Tooling',
            iconKey: 'cline',
            fallbackLabel: 'CLI',
            color: '#FDBA74',
          },
        ],
      },
      {
        id: 'models',
        name: 'Model Layer',
        coreValue: 'Routes each sub-task to the best model balance of quality and speed.',
        supportItems: ['Task routing', 'Multi-model synergy', 'Feedback optimization'],
        accentColor: '#EF4444',
        entities: [
          {
            id: 'claude-ops',
            name: 'Claude',
            iconKey: 'claude',
            fallbackLabel: 'CLD',
            color: '#FB7185',
            emphasis: true,
          },
          {
            id: 'gpt-codex',
            name: 'Codex',
            iconKey: 'codex',
            fallbackLabel: 'CDX',
            color: '#60A5FA',
            emphasis: true,
          },
          {
            id: 'glm-5',
            name: 'GLM-5',
            iconKey: 'chatglm',
            fallbackLabel: 'G5',
            color: '#93C5FD',
          },
          {
            id: 'qwen',
            name: 'Qwen',
            iconKey: 'qwen',
            fallbackLabel: 'QW',
            color: '#FCA5A5',
          },
          {
            id: 'kimi',
            name: 'Kimi K2.5',
            iconKey: 'kimi',
            fallbackLabel: 'KM',
            color: '#F9A8D4',
          },
          {
            id: 'minimax',
            name: 'Minimax M2.5',
            iconKey: 'minimax',
            fallbackLabel: 'MM',
            color: '#FDBA74',
          },
        ],
      },
    ],
    benefits: [
      {
        id: 'scan',
        title: 'Scan in seconds',
        description: 'A consistent card template removes cognitive jumps between layers.',
      },
      {
        id: 'hierarchy',
        title: 'Clear hierarchy',
        description: 'Direction hints and stable ordering make the full system obvious.',
      },
      {
        id: 'anchor',
        title: 'Recognizable entities',
        description: 'CLI and model icon anchors replace emoji noise with clear recognition.',
      },
    ],
  },
};

export const defaultDiagramCopyByLocale = defaultCopyByLocale;

function hexToRgbChannels(color: string): string {
  const normalized = color.replace('#', '');
  const hex = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;
  const value = Number.parseInt(hex, 16);

  if (Number.isNaN(value)) {
    return '37, 194, 160';
  }

  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `${red}, ${green}, ${blue}`;
}

function normalizeLayer(raw: unknown, fallback: LayerData): LayerData {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return fallback;
  }

  const candidate = raw as Partial<LayerData>;

  return {
    id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : fallback.id,
    name: typeof candidate.name === 'string' && candidate.name.trim() ? candidate.name : fallback.name,
    coreValue: typeof candidate.coreValue === 'string' && candidate.coreValue.trim()
      ? candidate.coreValue
      : fallback.coreValue,
    supportItems: Array.isArray(candidate.supportItems) && candidate.supportItems.length
      ? candidate.supportItems.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : fallback.supportItems,
    accentColor: typeof candidate.accentColor === 'string' && candidate.accentColor.trim()
      ? candidate.accentColor
      : fallback.accentColor,
    entities: Array.isArray(candidate.entities)
      ? candidate.entities.filter((item): item is LayerEntity => {
        if (!item || typeof item !== 'object') {
          return false;
        }

        const entity = item as Partial<LayerEntity>;
        return typeof entity.id === 'string'
          && typeof entity.name === 'string'
          && typeof entity.iconKey === 'string'
          && typeof entity.fallbackLabel === 'string'
          && typeof entity.color === 'string';
      })
      : fallback.entities,
  };
}

function normalizeBenefit(raw: unknown, fallback: BenefitItem): BenefitItem {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return fallback;
  }

  const candidate = raw as Partial<BenefitItem>;

  return {
    id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : fallback.id,
    title: typeof candidate.title === 'string' && candidate.title.trim() ? candidate.title : fallback.title,
    description: typeof candidate.description === 'string' && candidate.description.trim()
      ? candidate.description
      : fallback.description,
  };
}

function buildCopy(locale: Locale, t: (key: string) => unknown): DiagramCopy {
  const defaults = defaultCopyByLocale[locale];
  const raw = t('architectureDiagram.diagram');

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return defaults;
  }

  const candidate = raw as Partial<DiagramCopy>;
  const layers = Array.isArray(candidate.layers)
    ? defaults.layers.map((fallback, index) => normalizeLayer(candidate.layers?.[index], fallback))
    : defaults.layers;
  const benefits = Array.isArray(candidate.benefits)
    ? defaults.benefits.map((fallback, index) => normalizeBenefit(candidate.benefits?.[index], fallback))
    : defaults.benefits;

  return {
    ...defaults,
    ...candidate,
    layers,
    benefits,
    eyebrow: typeof candidate.eyebrow === 'string' && candidate.eyebrow.trim() ? candidate.eyebrow : defaults.eyebrow,
    sectionTitle: typeof candidate.sectionTitle === 'string' && candidate.sectionTitle.trim()
      ? candidate.sectionTitle
      : defaults.sectionTitle,
    sectionSubtitle: typeof candidate.sectionSubtitle === 'string' && candidate.sectionSubtitle.trim()
      ? candidate.sectionSubtitle
      : defaults.sectionSubtitle,
    flow: typeof candidate.flow === 'string' && candidate.flow.trim() ? candidate.flow : defaults.flow,
    layerWord: typeof candidate.layerWord === 'string' && candidate.layerWord.trim()
      ? candidate.layerWord
      : defaults.layerWord,
    layerTag: typeof candidate.layerTag === 'string' && candidate.layerTag.trim() ? candidate.layerTag : defaults.layerTag,
    startNode: typeof candidate.startNode === 'string' && candidate.startNode.trim()
      ? candidate.startNode
      : defaults.startNode,
    endNode: typeof candidate.endNode === 'string' && candidate.endNode.trim() ? candidate.endNode : defaults.endNode,
    flowDirection: typeof candidate.flowDirection === 'string' && candidate.flowDirection.trim()
      ? candidate.flowDirection
      : defaults.flowDirection,
    directionHint: typeof candidate.directionHint === 'string' && candidate.directionHint.trim()
      ? candidate.directionHint
      : defaults.directionHint,
    coreValueLabel: typeof candidate.coreValueLabel === 'string' && candidate.coreValueLabel.trim()
      ? candidate.coreValueLabel
      : defaults.coreValueLabel,
    supportLabel: typeof candidate.supportLabel === 'string' && candidate.supportLabel.trim()
      ? candidate.supportLabel
      : defaults.supportLabel,
    entitiesLabel: typeof candidate.entitiesLabel === 'string' && candidate.entitiesLabel.trim()
      ? candidate.entitiesLabel
      : defaults.entitiesLabel,
    loopBack: typeof candidate.loopBack === 'string' && candidate.loopBack.trim() ? candidate.loopBack : defaults.loopBack,
    whyTitle: typeof candidate.whyTitle === 'string' && candidate.whyTitle.trim() ? candidate.whyTitle : defaults.whyTitle,
    whySubtitle: typeof candidate.whySubtitle === 'string' && candidate.whySubtitle.trim()
      ? candidate.whySubtitle
      : defaults.whySubtitle,
    fallbackLayerName: typeof candidate.fallbackLayerName === 'string' && candidate.fallbackLayerName.trim()
      ? candidate.fallbackLayerName
      : defaults.fallbackLayerName,
    fallbackCoreValue: typeof candidate.fallbackCoreValue === 'string' && candidate.fallbackCoreValue.trim()
      ? candidate.fallbackCoreValue
      : defaults.fallbackCoreValue,
    fallbackSupportItem: typeof candidate.fallbackSupportItem === 'string' && candidate.fallbackSupportItem.trim()
      ? candidate.fallbackSupportItem
      : defaults.fallbackSupportItem,
  };
}

function LayerEntityIcon({ entity }: { entity: LayerEntity }) {
  const iconSize = entity.emphasis ? 56 : 40;

  switch (entity.iconKey) {
    case 'claude':
      return <Claude.Color size={iconSize} />;
    case 'codex':
      return <Codex size={iconSize} />;
    case 'claude-code':
      return <ClaudeCode size={iconSize} />;
    case 'cline':
      return <Cline size={iconSize} />;
    case 'chatglm':
      return <ChatGLM size={iconSize} />;
    case 'qwen':
      return <Qwen size={iconSize} />;
    case 'kimi':
      return <Kimi size={iconSize} />;
    case 'minimax':
      return <Minimax size={iconSize} />;
    default:
      return (
        <span className={styles.fallbackIcon} aria-hidden="true">
          {entity.fallbackLabel}
        </span>
      );
  }
}

function LayerCard({
  layer,
  index,
  copy,
  isLast,
}: {
  layer: LayerData;
  index: number;
  copy: DiagramCopy;
  isLast: boolean;
}) {
  const accentRgb = hexToRgbChannels(layer.accentColor);
  const hasEntities = Array.isArray(layer.entities) && layer.entities.length > 0;

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

  const supportItems = layer.supportItems.length ? layer.supportItems : [copy.fallbackSupportItem];

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
        <span className={styles.layerTag}>
          {copy.layerTag} {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className={styles.layerTitle}>{layer.name || copy.fallbackLayerName}</h3>
      </div>

      <div className={`${styles.layerBody} ${hasEntities ? styles.layerBodyWithEntities : ''}`.trim()}>
        <div className={styles.layerInfo}>
          <p className={styles.layerCoreValue}>
            <strong>{copy.coreValueLabel}: </strong>
            {layer.coreValue || copy.fallbackCoreValue}
          </p>

          <div className={styles.supportZone}>
            <span className={styles.supportLabel}>{copy.supportLabel}</span>
            <ul className={styles.supportList}>
              {supportItems.map((item) => (
                <li key={`${layer.id}-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {hasEntities && (
          <div className={styles.entitiesZone}>
            <span className={styles.entitiesLabel}>{copy.entitiesLabel}</span>
            <ul className={styles.entitiesList}>
              {layer.entities!.map((entity) => (
                <motion.li
                  key={entity.id}
                  className={`${styles.entityItem} ${entity.emphasis ? styles.priorityEntity : ''}`.trim()}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  style={{
                    '--entity-color': entity.color,
                    '--entity-color-rgb': hexToRgbChannels(entity.color),
                  } as CSSProperties}
                >
                  <span className={styles.entityIcon}>
                    <LayerEntityIcon entity={entity} />
                  </span>
                  <span className={styles.entityName}>{entity.name}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {!isLast && (
        <div className={styles.layerConnector} aria-hidden="true">
          <span className={styles.connectorRail} />
          <motion.span
            className={styles.connectorPulse}
            animate={{ y: [-2, 24, -2], opacity: [0, 1, 0] }}
            transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
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
  const copy = buildCopy(locale, t);

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
            <span className={styles.titleHighlight}>{copy.sectionTitle}</span>
          </h2>
          <p className={styles.sectionSubtitle}>{copy.sectionSubtitle}</p>
        </motion.div>

        <p className={styles.directionHint}>{copy.directionHint}</p>

        <div className={styles.architectureContainer}>
          {copy.layers.map((layer, index) => (
            <LayerCard
              key={layer.id}
              layer={layer}
              index={index}
              copy={copy}
              isLast={index === copy.layers.length - 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
