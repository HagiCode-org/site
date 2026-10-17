import { DEFAULT_LOCALE, normalizeSiteLocale, type SiteLocale } from '@/i18n/locale-metadata';
import { getLandingEntryCopy } from '@/lib/landing-entry-copy';
import type { SiteEntryLocaleSource } from '@/lib/site-entry-locale';
import { persistLocale, resolveSiteEntryRouting, type SiteEntryRouting } from '@/scripts/site-entry-routing';

/**
 * The "/" page is a transit address, so it shows the transit: which input chose the language,
 * the route that resolves from it, then the hand-off. The CSS owns the choreography (one
 * --run-dur drives every layer); this module only resolves, fills in real values, and decides
 * when to leave.
 */

type Pace = 'full' | 'quick' | 'still';

const RUN_MS: Record<Pace, number> = { full: 1250, quick: 620, still: 0 };
/** Time the finished route stays on screen before the page hands off. */
const REST_MS: Record<Pace, number> = { full: 320, quick: 220, still: 700 };

const TRACE_ORDER: readonly SiteEntryLocaleSource[] = ['query', 'stored', 'browser', 'default'];

function text(element: Element | null, value: string): void {
  if (element) {
    element.textContent = value;
  }
}

function pickPace(win: Window, source: SiteEntryLocaleSource): Pace {
  if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'still';
  }

  // A saved choice or an explicit ?lang= means the visitor already decided: do not make them wait.
  return source === 'stored' || source === 'query' ? 'quick' : 'full';
}

function describeEvidence(routing: SiteEntryRouting, source: SiteEntryLocaleSource): string {
  const { evidence } = routing;

  switch (source) {
    case 'query':
      return evidence.requestedLang || '—';
    case 'stored':
      return evidence.storedLocale || evidence.legacyStoredLocale || '—';
    case 'browser':
      return evidence.clientLanguages.slice(0, 3).join(', ') || '—';
    default:
      return DEFAULT_LOCALE;
  }
}

function showTrace(doc: Document, routing: SiteEntryRouting, usedLabel: string): void {
  const usedIndex = TRACE_ORDER.indexOf(routing.source);

  TRACE_ORDER.forEach((source, index) => {
    const row = doc.querySelector<HTMLElement>(`[data-trace="${source}"]`);
    if (!row) {
      return;
    }

    const resolved = source === routing.source;
    text(row.querySelector('[data-trace-value]'), describeEvidence(routing, source));
    text(row.querySelector('[data-trace-verdict]'), resolved ? usedLabel : '');
    row.dataset.state = resolved ? 'used' : index < usedIndex ? 'skipped' : 'idle';
    row.style.setProperty('--i', String(index));
  });
}

function showRoute(doc: Document, locale: SiteLocale): void {
  const target = doc.getElementById('landing-route-target');
  if (!target) {
    return;
  }

  const segment = `${locale}/`;
  target.replaceChildren();

  const run = doc.createElement('span');
  run.className = 'run';

  const ghost = doc.createElement('span');
  ghost.className = 'run-ghost';
  ghost.textContent = segment;

  const solid = doc.createElement('span');
  solid.className = 'run-solid';
  solid.textContent = segment;

  const beam = doc.createElement('span');
  beam.className = 'run-beam';

  run.append(ghost, solid, beam);
  target.append(run);
}

function wireLocaleList(win: Window, routing: SiteEntryRouting, onChoose: () => void): void {
  const links = win.document.querySelectorAll<HTMLAnchorElement>('a[data-locale]');

  links.forEach((link) => {
    const locale = normalizeSiteLocale(link.dataset.locale);
    if (!locale) {
      return;
    }

    // Keep utm/hash on the way through, exactly as the automatic redirect does.
    link.href = routing.buildUrlFor(locale);

    if (locale === routing.locale) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }

    link.addEventListener('click', () => {
      onChoose();
      persistLocale(win, locale);
    });
  });
}

export function mountLandingRouteRun(win: Window = window): void {
  const doc = win.document;
  const root = doc.documentElement;
  const routing = resolveSiteEntryRouting(win);

  if (!routing) {
    root.dataset.ready = 'true';
    return;
  }

  const copy = getLandingEntryCopy(routing.locale);
  const pace = pickPace(win, routing.source);
  const runMs = RUN_MS[pace];
  const holdMs = runMs + REST_MS[pace];
  const status = doc.getElementById('landing-status');

  root.lang = routing.locale;
  root.style.setProperty('--run-dur', `${runMs}ms`);
  root.dataset.pace = pace;

  text(doc.getElementById('landing-heading'), copy.opening);
  text(status, copy.hint);
  text(doc.getElementById('landing-language-label'), copy.language);
  doc.getElementById('landing-language-label')?.setAttribute('lang', routing.locale);

  showRoute(doc, routing.locale);
  showTrace(doc, routing, copy.used);

  let timer: number | undefined;
  let stopped = false;

  const stop = () => {
    if (timer !== undefined) {
      win.clearTimeout(timer);
      timer = undefined;
    }
    stopped = true;
  };

  const pause = () => {
    if (stopped) {
      return;
    }
    stop();
    root.dataset.state = 'paused';
    text(status, copy.paused);
  };

  wireLocaleList(win, routing, stop);

  const list = doc.querySelector('[data-locale-list]');
  list?.addEventListener('focusin', pause);
  // Movement, not presence: a pointer that merely rests over the list on load must not stop the redirect.
  list?.addEventListener('pointermove', (event) => {
    if ((event as PointerEvent).pointerType === 'mouse') {
      pause();
    }
  });
  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      pause();
    }
  });

  root.dataset.state = 'running';
  root.dataset.ready = 'true';

  if (!routing.shouldRedirect) {
    return;
  }

  timer = win.setTimeout(() => {
    timer = undefined;
    root.dataset.state = 'leaving';
    win.location.replace(routing.targetUrl);
  }, holdMs);
}
