import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from 'react';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import {
  type ExploreHubNode,
  type ExploreMapAccent,
  type ExploreMapNode,
  type ExplorePageModel,
  type ExploreProductNode,
} from '@/lib/explore-page-copy';
import styles from './UniverseMap.module.css';

const CANVAS_WIDTH = 6800;
const CANVAS_HEIGHT = 6800;
const MIN_SCALE = 0.08;
const MAX_SCALE = 1.32;
const KEYBOARD_PAN_STEP = 124;
const ZOOM_STEP = 0.12;
const FIT_PADDING = 220;

interface UniverseMapProps {
  model: ExplorePageModel;
}

interface TransformState {
  x: number;
  y: number;
  scale: number;
}

interface AccentStyleMap {
  readonly root: string;
  readonly hub: string;
  readonly product: string;
}

interface ContentBounds {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
}

type NonRootNode = ExploreHubNode | ExploreProductNode;

const accentClassNames: Record<ExploreMapAccent, AccentStyleMap> = {
  core: {
    root: styles.rootCore,
    hub: styles.hubCore,
    product: styles.productCore,
  },
  surface: {
    root: styles.rootSurface,
    hub: styles.hubSurface,
    product: styles.productSurface,
  },
  delivery: {
    root: styles.rootDelivery,
    hub: styles.hubDelivery,
    product: styles.productDelivery,
  },
  labs: {
    root: styles.rootLabs,
    hub: styles.hubLabs,
    product: styles.productLabs,
  },
};

function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

function getNodeDimensions(node: ExploreMapNode) {
  if (node.kind === 'root') {
    return { width: 368, height: 272 };
  }

  if (node.kind === 'hub') {
    if (node.depth === 1) {
      return { width: 288, height: 192 };
    }

    if (node.depth === 2) {
      return { width: 237, height: 157 };
    }

    if (node.depth === 3) {
      return { width: 198, height: 131 };
    }

    return { width: 259, height: 176 };
  }

  if (node.depth === 3) {
    return { width: 170, height: 112 };
  }

  if (node.depth === 4) {
    return { width: 147, height: 96 };
  }

  return { width: 179, height: 118 };
}

function getContentBounds(nodes: readonly ExploreMapNode[]): ContentBounds {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const node of nodes) {
    const { width, height } = getNodeDimensions(node);
    minX = Math.min(minX, node.x - width / 2);
    maxX = Math.max(maxX, node.x + width / 2);
    minY = Math.min(minY, node.y - height / 2);
    maxY = Math.max(maxY, node.y + height / 2);
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

function getInitialTransform(
  viewportWidth: number,
  viewportHeight: number,
  contentBounds: ContentBounds,
): TransformState {
  const scale = clampScale(
    Math.min(
      viewportWidth / (contentBounds.width + FIT_PADDING * 2),
      viewportHeight / (contentBounds.height + FIT_PADDING * 2),
    ) * 0.98,
  );

  return {
    scale,
    x: viewportWidth / 2 - contentBounds.centerX * scale,
    y: viewportHeight / 2 - contentBounds.centerY * scale,
  };
}

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);

    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

function getVisibleHighlights(node: ExploreMapNode) {
  if (node.kind === 'root') {
    return node.highlights.slice(0, 4);
  }

  if (node.depth === 1) {
    return node.highlights.slice(0, 3);
  }

  if (node.depth === 2) {
    return node.highlights.slice(0, 2);
  }

  return node.highlights.slice(0, 1);
}

function getVisibleDetails(node: ExploreMapNode) {
  if (node.kind === 'root') {
    return node.details.slice(0, 3);
  }

  if (node.depth <= 2) {
    return node.details.slice(0, 2);
  }

  return node.details.slice(0, 1);
}

export default function UniverseMap({ model }: UniverseMapProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [transform, setTransform] = useState<TransformState>({ x: 0, y: 0, scale: 0.7 });
  const [selectedId, setSelectedId] = useState(model.root.id);
  const [isDragging, setIsDragging] = useState(false);
  const reducedMotion = useReducedMotionPreference();
  const allNodes: ExploreMapNode[] = [model.root, ...model.hubs, ...model.products];
  const nodeById = new Map<string, ExploreMapNode>(allNodes.map((node) => [node.id, node] as const));
  const nonRootNodes: NonRootNode[] = [...model.hubs, ...model.products];
  const contentBounds = getContentBounds(allNodes);

  const resetView = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    setSelectedId(model.root.id);
    setTransform(getInitialTransform(viewport.clientWidth, viewport.clientHeight, contentBounds));
  }, [contentBounds, model.root.id]);

  useEffect(() => {
    resetView();
  }, [resetView]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(() => {
      setTransform((current) => {
        if (current.x !== 0 || current.y !== 0 || current.scale !== 0.7) {
          return current;
        }

        return getInitialTransform(viewport.clientWidth, viewport.clientHeight, contentBounds);
      });
    });

    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, [contentBounds]);

  const updateScale = useCallback((nextScale: number, origin?: { x: number; y: number }) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    setTransform((current) => {
      const targetScale = clampScale(nextScale);
      const focusPoint = origin ?? {
        x: viewport.clientWidth / 2,
        y: viewport.clientHeight / 2,
      };
      const ratio = targetScale / current.scale;

      return {
        scale: targetScale,
        x: focusPoint.x - (focusPoint.x - current.x) * ratio,
        y: focusPoint.y - (focusPoint.y - current.y) * ratio,
      };
    });
  }, []);

  const focusNode = useCallback((node: ExploreMapNode) => {
    const viewport = viewportRef.current;
    setSelectedId(node.id);

    if (!viewport) {
      return;
    }

    setTransform((current) => ({
      ...current,
      x: viewport.clientWidth / 2 - node.x * current.scale,
      y: viewport.clientHeight / 2 - node.y * current.scale,
    }));
  }, []);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
    };
    setIsDragging(true);
  }, [transform.x, transform.y]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    setTransform((current) => ({
      ...current,
      x: dragState.originX + event.clientX - dragState.startX,
      y: dragState.originY + event.clientY - dragState.startY,
    }));
  }, []);

  const stopDragging = useCallback((event?: PointerEvent<HTMLDivElement>) => {
    if (event && dragRef.current && dragRef.current.pointerId === event.pointerId) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const bounds = viewport.getBoundingClientRect();
    const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;

    updateScale(transform.scale + delta, {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  }, [transform.scale, updateScale]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setTransform((current) => ({ ...current, y: current.y + KEYBOARD_PAN_STEP }));
        break;
      case 'ArrowDown':
        event.preventDefault();
        setTransform((current) => ({ ...current, y: current.y - KEYBOARD_PAN_STEP }));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        setTransform((current) => ({ ...current, x: current.x + KEYBOARD_PAN_STEP }));
        break;
      case 'ArrowRight':
        event.preventDefault();
        setTransform((current) => ({ ...current, x: current.x - KEYBOARD_PAN_STEP }));
        break;
      case '+':
      case '=':
        event.preventDefault();
        updateScale(transform.scale + ZOOM_STEP);
        break;
      case '-':
      case '_':
        event.preventDefault();
        updateScale(transform.scale - ZOOM_STEP);
        break;
      case '0':
      case 'Home':
        event.preventDefault();
        resetView();
        break;
      default:
        break;
    }
  }, [resetView, transform.scale, updateScale]);

  const renderNode = (node: ExploreMapNode) => {
    const accentStyles = accentClassNames[node.accent];
    const nodeClassName =
      node.kind === 'root'
        ? `${styles.node} ${styles.rootNode} ${accentStyles.root}`
        : node.kind === 'hub'
          ? `${styles.node} ${styles.hubNode} ${accentStyles.hub}`
          : `${styles.node} ${styles.productNode} ${accentStyles.product}`;
    const highlights = getVisibleHighlights(node);
    const details = getVisibleDetails(node);
    const parentNode = node.kind === 'root' ? null : nodeById.get(node.parentId);

    return (
      <button
        key={node.id}
        type="button"
        className={`${nodeClassName} ${selectedId === node.id ? styles.nodeSelected : ''}`}
        style={{ left: node.x, top: node.y }}
        data-depth={node.depth}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => focusNode(node)}
        aria-pressed={selectedId === node.id}
      >
        <span className={styles.nodeStatus}>{node.status}</span>
        <strong className={styles.nodeTitle}>{node.title}</strong>
        <span className={styles.nodeSummary}>{node.summary}</span>

        {highlights.length > 0 ? <span className={styles.nodeDivider} aria-hidden="true" /> : null}

        {highlights.length > 0 ? (
          <ul className={styles.nodeList}>
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}

        {details.length > 0 ? (
          <ul className={styles.nodeSecondaryList}>
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        ) : null}

        {parentNode ? <span className={styles.nodeFooter}>{parentNode.title}</span> : null}
      </button>
    );
  };

  return (
    <section className={styles.page}>
      <div className={styles.toolbar} role="group" aria-label={model.ui.controlsLabel}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => updateScale(transform.scale + ZOOM_STEP)}
          aria-label={model.ui.controls.zoomIn}
        >
          <ZoomIn size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => updateScale(transform.scale - ZOOM_STEP)}
          aria-label={model.ui.controls.zoomOut}
        >
          <ZoomOut size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={resetView}
          aria-label={model.ui.controls.reset}
        >
          <RotateCcw size={16} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.viewportShell}>
        <div
          ref={viewportRef}
          className={`${styles.viewport} ${isDragging ? styles.dragging : ''}`}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerLeave={stopDragging}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          aria-label={model.ui.canvasLabel}
        >
          <div className={styles.backgroundHalo} aria-hidden="true" />
          <div
            className={`${styles.transformLayer} ${reducedMotion ? styles.reducedMotion : ''}`}
            style={{
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
            }}
          >
            <div className={styles.orbitLarge} aria-hidden="true" />
            <div className={styles.orbitMedium} aria-hidden="true" />
            <div className={styles.orbitSmall} aria-hidden="true" />

            <svg className={styles.connections} viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} aria-hidden="true">
              {nonRootNodes.map((node) => {
                const parent = nodeById.get(node.parentId);
                if (!parent) {
                  return null;
                }

                return (
                  <line
                    key={`${node.parentId}-${node.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={node.x}
                    y2={node.y}
                    className={node.depth === 1 ? `${styles.connectionLine} ${styles.connectionRoot}` : styles.connectionLine}
                  />
                );
              })}
            </svg>

            {renderNode(model.root)}
            {model.hubs.map(renderNode)}
            {model.products.map(renderNode)}
          </div>
        </div>
      </div>
    </section>
  );
}
