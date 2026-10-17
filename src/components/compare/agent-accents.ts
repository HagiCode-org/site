/**
 * Accent colours for the compared agents. Each comparison page keeps the same colour wherever
 * it shows up (homepage arena tab, stage, the page itself), picked by its alphabetical position.
 * The colours only ever fill shapes and tint surfaces; text stays on the theme text tokens.
 */
export const AGENT_ACCENTS = [
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#f43f5e',
  '#06b6d4',
  '#f97316',
  '#ec4899',
  '#0ea5e9',
  '#16a34a',
] as const;

export function agentAccent(index: number): string {
  return AGENT_ACCENTS[((index % AGENT_ACCENTS.length) + AGENT_ACCENTS.length) % AGENT_ACCENTS.length];
}
