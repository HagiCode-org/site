/**
 * Shared type declarations for structured article components.
 * Derived from the index structured article schema (schemaVersion 1.0.0).
 */

export interface StructuredArticleCtaLink {
  label: string;
  href: string;
}

export interface StructuredRichTextBlock {
  id: string;
  type: 'rich-text';
  content: string[];
}

export interface StructuredBulletListBlock {
  id: string;
  type: 'bullet-list';
  items: string[];
}

export interface StructuredCapabilityItem {
  id: string;
  title: string;
  content: string[];
  bullets?: string[];
}

export interface StructuredCapabilityListBlock {
  id: string;
  type: 'capability-list';
  items: StructuredCapabilityItem[];
}

export interface StructuredComparisonItem {
  id: string;
  label: string;
  agent: string;
  hagicode: string;
  combinedValue?: string;
}

export interface StructuredComparisonGridBlock {
  id: string;
  type: 'comparison-grid';
  items: StructuredComparisonItem[];
}

export interface StructuredComparisonTableRow {
  id: string;
  /** One entry per header; the first entry is the row label. */
  cells: string[];
}

export interface StructuredComparisonTableBlock {
  id: string;
  type: 'comparison-table';
  caption?: string;
  headers: string[];
  rows: StructuredComparisonTableRow[];
}

export interface StructuredCalloutBlock {
  id: string;
  type: 'callout';
  tone: 'info' | 'success' | 'warning';
  title?: string;
  content: string[];
}

export interface StructuredCtaGroupItem extends StructuredArticleCtaLink {
  variant?: 'primary' | 'secondary';
}

export interface StructuredCtaGroupBlock {
  id: string;
  type: 'cta-group';
  items: StructuredCtaGroupItem[];
}

export type StructuredArticleBlock =
  | StructuredRichTextBlock
  | StructuredBulletListBlock
  | StructuredCapabilityListBlock
  | StructuredComparisonGridBlock
  | StructuredComparisonTableBlock
  | StructuredCalloutBlock
  | StructuredCtaGroupBlock;

export interface StructuredArticleSection {
  id: string;
  title: string;
  blocks: StructuredArticleBlock[];
}

export interface StructuredArticleCtaSet {
  primary?: StructuredArticleCtaLink;
  secondary?: StructuredArticleCtaLink;
}

export interface StructuredArticleFaqItem {
  question: string;
  answer: string;
}

export interface StructuredArticleViewModel {
  slug: string;
  title: string;
  description: string;
  summary: string;
  updatedAt: string;
  requestedLocale: string;
  resolvedLocale: string;
  usedFallback: boolean;
  snapshotPath: string;
  sections: StructuredArticleSection[];
  faq: StructuredArticleFaqItem[];
  toc: Array<{ id: string; title: string }>;
  cta: StructuredArticleCtaSet;
}
