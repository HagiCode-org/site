/** 智能、高效、有趣：用提案流程、并行任务与便捷的 UI 交互展示产品价值。 */
import { useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Circle, FileCode2, GitBranch, Layers3 } from 'lucide-react';
import type { HomepageFeaturesCopy } from '@/lib/homepage-section-copy';
import styles from './FeaturesShowcase.module.css';

type PreviewKey = 'proposalWorkflow' | 'sessionBoard' | 'workspaceManagement';
type FeatureImages = Record<PreviewKey, { avif: string; webp: string; src: string }>;

const stageFiles: Record<string, string> = {
  review: 'specs/', scaffold: 'proposal.md', spec: 'specs/', design: 'design.md',
  tasks: 'tasks.md', validate: 'proposal.md', apply: 'tasks.md', archive: 'specs/',
};

function navigateTabs(event: KeyboardEvent<HTMLDivElement>) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
  if (current < 0) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
    : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus();
  tabs[next].click();
}

function SmartFeature({ copy, demoLabel }: { copy: HomepageFeaturesCopy['smart']; demoLabel: string }) {
  const [activeStage, setActiveStage] = useState(0);
  const reducedMotion = useReducedMotion();

  return (
    <article className={`${styles.feature} ${styles.smart}`} aria-labelledby="feature-smart-title">
      <div className={styles.featureIntro}>
        <h3 id="feature-smart-title" className={styles.featureTitle}>{copy.title}<span className={styles.signal} aria-hidden="true" /></h3>
        <p className={styles.featurePromise}>{copy.subtitle}</p>
        <p className={styles.featureDescription}>{copy.description}</p>
        <div className={styles.artifacts} aria-label="OpenSpec">
          <FileCode2 aria-hidden="true" size={18} />
          <code>proposal.md</code><ArrowRight aria-hidden="true" size={14} /><code>tasks.md</code><ArrowRight aria-hidden="true" size={14} /><code>specs/</code>
        </div>
      </div>

      <div className={styles.workflow}>
        <div className={styles.previewToolbar}><span>OpenSpec</span><span>{demoLabel}</span></div>
        <div className={styles.workflowTabs} role="tablist" aria-label={copy.title} onKeyDown={navigateTabs}>
          {copy.workflowStages.map((stage, index) => (
            <button
              key={stage.key}
              id={`feature-stage-${stage.key}`}
              type="button"
              role="tab"
              aria-selected={index === activeStage}
              aria-controls={`feature-stage-panel-${stage.key}`}
              tabIndex={index === activeStage ? 0 : -1}
              className={styles.workflowTab}
              onClick={() => setActiveStage(index)}
            >
              <span className={styles.stepIndex}>{String(index + 1).padStart(2, '0')}</span>
              <span>{stage.label}</span>
              {index === activeStage && <motion.span className={styles.stageCursor} layoutId="feature-stage-cursor" transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }} />}
            </button>
          ))}
        </div>
        {copy.workflowStages.map((stage, index) => (
          <div key={stage.key} id={`feature-stage-panel-${stage.key}`} role="tabpanel" aria-labelledby={`feature-stage-${stage.key}`} hidden={index !== activeStage} tabIndex={0} className={styles.workflowPanel}>
            <div className={styles.fileHeading}><FileCode2 aria-hidden="true" size={18} /><code>{stageFiles[stage.key]}</code><span>{String(index + 1).padStart(2, '0')} / {String(copy.workflowStages.length).padStart(2, '0')}</span></div>
            <div className={styles.stageDetail}>
              <h4>{stage.label}</h4>
              <p>{stage.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function EfficientFeature({ copy, demoLabel }: { copy: HomepageFeaturesCopy['convenient']; demoLabel: string }) {
  return (
    <article className={`${styles.feature} ${styles.efficient}`} aria-labelledby="feature-efficient-title">
      <div className={styles.featureIntro}>
        <h3 id="feature-efficient-title" className={styles.featureTitle}>{copy.title}<span className={styles.signal} aria-hidden="true" /></h3>
        <p className={styles.featurePromise}>{copy.subtitle}</p>
        <p className={styles.featureDescription}>{copy.description}</p>
      </div>

      <div className={styles.parallelPreview}>
        <div className={styles.previewToolbar}><span><GitBranch aria-hidden="true" size={16} />{copy.agentMatrix.title}</span><span>{demoLabel}</span></div>
        <div className={styles.agentLanes}>
          {copy.agentMatrix.agentLanes.map((lane) => (
            <div key={lane.key} className={styles.agentLane}>
              <div className={styles.agentIdentity}><span className={styles.laneNode} aria-hidden="true" /><strong>{lane.name}</strong><span>{lane.role}</span></div>
              <ul className={styles.agentTasks}>
                {lane.instances.map((instance) => <li key={instance}><Circle size={9} aria-hidden="true" />{instance}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.parallelFooter}><Layers3 aria-hidden="true" size={16} />{copy.agentMatrix.badge}</div>
      </div>

      <details className={styles.providers}>
        <summary><span>{copy.agentMatrix.supportedProvidersTitle}</span><ArrowRight aria-hidden="true" size={16} /></summary>
        <ul>{copy.agentMatrix.supportedProviders.map((provider) => <li key={provider.key}><Check size={14} aria-hidden="true" />{provider.name}</li>)}</ul>
      </details>
    </article>
  );
}

function InterestingFeature({ copy, images, previewLabel }: { copy: HomepageFeaturesCopy['interesting']; images: FeatureImages; previewLabel: string }) {
  const [activeView, setActiveView] = useState(0);
  const previewKeys: PreviewKey[] = ['proposalWorkflow', 'sessionBoard', 'workspaceManagement'];

  return (
    <article className={`${styles.feature} ${styles.interesting}`} aria-labelledby="feature-interesting-title">
      <div className={styles.featureIntro}>
        <h3 id="feature-interesting-title" className={styles.featureTitle}>{copy.title}<span className={styles.signal} aria-hidden="true" /></h3>
        <p className={styles.featurePromise}>{copy.subtitle}</p>
        <p className={styles.featureDescription}>{copy.description}</p>
      </div>

      <div className={styles.experiencePreview}>
        <div className={styles.viewTabs} role="tablist" aria-label={copy.title} onKeyDown={navigateTabs}>
          {copy.features.map((feature, index) => (
            <button type="button" role="tab" key={feature.key} id={`feature-view-${feature.key}`} aria-controls={`feature-view-panel-${feature.key}`} aria-selected={activeView === index} tabIndex={activeView === index ? 0 : -1} onClick={() => setActiveView(index)}>{feature.label}</button>
          ))}
        </div>
        {copy.features.map((feature, index) => {
          const image = images[previewKeys[index]];
          return (
            <div key={feature.key} role="tabpanel" id={`feature-view-panel-${feature.key}`} aria-labelledby={`feature-view-${feature.key}`} hidden={activeView !== index} tabIndex={0} className={styles.viewPanel}>
              <div className={styles.screenshotFrame}>
                <picture>
                  <source type="image/avif" srcSet={image.avif} />
                  <source type="image/webp" srcSet={image.webp} />
                  <img src={image.src} alt={feature.desc} width={1440} height={900} loading="lazy" decoding="async" />
                </picture>
              </div>
              <p className={styles.viewDescription}>{feature.desc}</p>
            </div>
          );
        })}
      </div>
      <p className={styles.previewSource}><Check aria-hidden="true" size={14} />{previewLabel}</p>
    </article>
  );
}

interface Props {
  copy: HomepageFeaturesCopy;
  images: FeatureImages;
}

export default function FeaturesShowcase({ copy, images }: Props) {
  return (
    <section className={styles.featuresShowcase} aria-labelledby="features-showcase-title" data-homepage-section="features">
      <div className="container">
        <header className={styles.showcaseHeader}>
          <h2 id="features-showcase-title" className={styles.showcaseTitle}>{copy.showcase.title}</h2>
          <p className={styles.showcaseSubtitle}>{copy.showcase.subtitle}</p>
        </header>
        <div className={styles.featuresGrid}>
          <SmartFeature copy={copy.smart} demoLabel={copy.showcase.demoLabel} />
          <EfficientFeature copy={copy.convenient} demoLabel={copy.showcase.demoLabel} />
          <InterestingFeature copy={copy.interesting} images={images} previewLabel={copy.showcase.previewLabel} />
        </div>
      </div>
    </section>
  );
}
