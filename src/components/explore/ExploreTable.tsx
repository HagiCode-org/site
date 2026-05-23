import type { ExploreHubNode, ExploreMapNode, ExplorePageModel } from '@/lib/explore-page-copy';
import styles from './ExploreTable.module.css';

interface ExploreTableProps {
  readonly model: ExplorePageModel;
}

interface ExploreSection {
  readonly branch: ExploreHubNode;
  readonly rows: readonly ExploreRow[];
}

interface ExploreRow {
  readonly id: string;
  readonly path: string;
  readonly title: string;
  readonly summary: string;
  readonly status: string;
  readonly highlights: string;
  readonly sourcePath: string;
  readonly accent: ExploreMapNode['accent'];
}

function hasParent(node: ExploreMapNode): node is Extract<ExploreMapNode, { parentId: string }> {
  return 'parentId' in node;
}

function buildChildrenMap(nodes: readonly ExploreMapNode[]) {
  const childrenByParent = new Map<string, ExploreMapNode[]>();

  for (const node of nodes) {
    if (!hasParent(node)) {
      continue;
    }

    const bucket = childrenByParent.get(node.parentId);
    if (bucket) {
      bucket.push(node);
      continue;
    }

    childrenByParent.set(node.parentId, [node]);
  }

  return childrenByParent;
}

function collectBranchRows(
  branch: ExploreHubNode,
  childrenByParent: ReadonlyMap<string, readonly ExploreMapNode[]>,
  nodeById: ReadonlyMap<string, ExploreMapNode>,
  rootPathLabel: string,
): ExploreRow[] {
  const rows: ExploreRow[] = [];

  function visit(parentId: string) {
    const children = childrenByParent.get(parentId) ?? [];

    for (const node of children) {
      const pathSegments: string[] = [];
      let cursorId = hasParent(node) ? node.parentId : undefined;

      while (cursorId && cursorId !== branch.id) {
        const cursor = nodeById.get(cursorId);
        if (!cursor || !hasParent(cursor)) {
          break;
        }

        pathSegments.unshift(cursor.title);
        cursorId = cursor.parentId;
      }

      rows.push({
        id: node.id,
        path: pathSegments.length > 0 ? pathSegments.join(' / ') : rootPathLabel,
        title: node.title,
        summary: node.summary,
        status: node.status,
        highlights: node.highlights.slice(0, 3).join(' · '),
        sourcePath: node.sourcePath,
        accent: node.accent,
      });

      visit(node.id);
    }
  }

  visit(branch.id);
  return rows;
}

function buildSections(model: ExplorePageModel): ExploreSection[] {
  const allNodes = [model.root, ...model.hubs, ...model.products];
  const nodeById = new Map<string, ExploreMapNode>(allNodes.map((node) => [node.id, node]));
  const childrenByParent = buildChildrenMap(allNodes);

  return model.root.relatedIds
    .map((branchId) => nodeById.get(branchId))
    .filter((node): node is ExploreHubNode => node != null && node.kind === 'hub')
    .map((branch) => ({
      branch,
      rows: collectBranchRows(branch, childrenByParent, nodeById, model.ui.table.rootPathLabel),
    }));
}

function getAccentClass(accent: ExploreMapNode['accent']) {
  switch (accent) {
    case 'core':
      return styles.accentCore;
    case 'surface':
      return styles.accentSurface;
    case 'delivery':
      return styles.accentDelivery;
    case 'labs':
      return styles.accentLabs;
    default:
      return styles.accentCore;
  }
}

export default function ExploreTable({ model }: ExploreTableProps) {
  const sections = buildSections(model);

  return (
    <section className={styles.page} aria-label={model.root.title}>
      <div className={styles.sectionStack}>
        {sections.map(({ branch, rows }) => (
          <section key={branch.id} className={styles.sectionCard} aria-labelledby={branch.id}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={`${styles.sectionBadge} ${getAccentClass(branch.accent)}`}>{branch.status}</p>
                <h2 id={branch.id} className={styles.sectionTitle}>
                  {branch.title}
                </h2>
                <p className={styles.sectionSummary}>{branch.summary}</p>
              </div>
              <ul className={styles.branchHighlights}>
                {branch.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col" className={styles.pathColumn}>{model.ui.table.pathTitle}</th>
                    <th scope="col" className={styles.itemColumn}>{model.ui.table.itemTitle}</th>
                    <th scope="col" className={styles.statusColumn}>{model.ui.table.statusTitle}</th>
                    <th scope="col" className={styles.highlightsColumn}>{model.ui.table.highlightsTitle}</th>
                    <th scope="col" className={styles.sourceColumn}>{model.ui.table.sourceTitle}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className={`${styles.pathCell} ${styles.pathColumn}`} data-label={model.ui.table.pathTitle}>{row.path}</td>
                      <td className={`${styles.itemCell} ${styles.itemColumn}`} data-label={model.ui.table.itemTitle}>
                        <strong>{row.title}</strong>
                        <span>{row.summary}</span>
                      </td>
                      <td className={styles.statusColumn} data-label={model.ui.table.statusTitle}>
                        <span className={`${styles.statusChip} ${getAccentClass(row.accent)}`}>{row.status}</span>
                      </td>
                      <td className={`${styles.highlightsCell} ${styles.highlightsColumn}`} data-label={model.ui.table.highlightsTitle}>{row.highlights}</td>
                      <td className={`${styles.sourceCell} ${styles.sourceColumn}`} data-label={model.ui.table.sourceTitle}>{row.sourcePath}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
