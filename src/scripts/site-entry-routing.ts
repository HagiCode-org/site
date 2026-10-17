import {
  LEGACY_SITE_LOCALE_STORAGE_KEY,
  SITE_LOCALE_STORAGE_KEY,
  buildSiteEntryRedirectUrl,
  traceSiteEntryLocale,
  type SiteEntryLocaleSource,
  type SiteEntryRedirectResolution,
} from '@/lib/site-entry-locale';

function normalizeTargetPath(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeadingSlash === '/' || withLeadingSlash.endsWith('/')
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

function getMetaContent(document: Document, name: string): string | null {
  const meta = document.querySelector(`meta[name="${name}"]`);
  return meta instanceof HTMLMetaElement ? meta.content : null;
}

function getClientLanguages(win: Window): string[] {
  if (Array.isArray(win.navigator.languages) && win.navigator.languages.length > 0) {
    return win.navigator.languages.filter((language): language is string => typeof language === 'string');
  }

  return typeof win.navigator.language === 'string' ? [win.navigator.language] : [];
}

function readStoredLocale(win: Window): { primary: string | null; legacy: string | null } {
  try {
    return {
      primary: win.localStorage.getItem(SITE_LOCALE_STORAGE_KEY),
      legacy: win.localStorage.getItem(LEGACY_SITE_LOCALE_STORAGE_KEY),
    };
  } catch {
    return {
      primary: null,
      legacy: null,
    };
  }
}

export function persistLocale(win: Window, locale: string): void {
  try {
    win.localStorage.setItem(SITE_LOCALE_STORAGE_KEY, locale);
    win.localStorage.removeItem(LEGACY_SITE_LOCALE_STORAGE_KEY);
  } catch {
    // Ignore storage failures so the redirect still works for this visit.
  }
}

/** What the entry decision was based on, as the browser reported it. */
export type SiteEntryEvidence = {
  requestedLang: string | null;
  storedLocale: string | null;
  legacyStoredLocale: string | null;
  clientLanguages: string[];
};

export type SiteEntryRouting = SiteEntryRedirectResolution & {
  source: SiteEntryLocaleSource;
  evidence: SiteEntryEvidence;
  targetPath: string;
  siteBase: string;
  /** Builds the redirect for an explicitly chosen locale, keeping query and hash. */
  buildUrlFor: (locale: string) => string;
};

/**
 * Decides where this entry page should send the visitor, and persists a newly detected locale.
 * It never navigates: applySiteEntryRouting() redirects at once, and the "/" page runs its own
 * short route animation first.
 */
export function resolveSiteEntryRouting(win: Window = window): SiteEntryRouting | null {
  const targetPath = normalizeTargetPath(getMetaContent(win.document, 'hagicode-site-landing-target'));
  if (!targetPath) {
    return null;
  }

  const siteBase = getMetaContent(win.document, 'hagicode-site-base') ?? '';
  const currentUrl = new URL(win.location.href);
  const stored = readStoredLocale(win);
  const clientLanguages = getClientLanguages(win);
  const options = {
    currentUrl,
    targetPath,
    siteBase,
    storedLocale: stored.primary,
    legacyStoredLocale: stored.legacy,
    clientLanguages,
  };

  const resolution = buildSiteEntryRedirectUrl(options);
  const { source } = traceSiteEntryLocale({
    requestedLang: currentUrl.searchParams.get('lang'),
    storedLocale: stored.primary,
    legacyStoredLocale: stored.legacy,
    clientLanguages,
  });

  if (resolution.shouldPersist) {
    persistLocale(win, resolution.locale);
  }

  return {
    ...resolution,
    source,
    targetPath,
    siteBase,
    evidence: {
      requestedLang: currentUrl.searchParams.get('lang'),
      storedLocale: stored.primary,
      legacyStoredLocale: stored.legacy,
      clientLanguages,
    },
    buildUrlFor: (locale) =>
      buildSiteEntryRedirectUrl({ ...options, requestedLang: locale }).targetUrl,
  };
}

export function applySiteEntryRouting(win: Window = window): void {
  const routing = resolveSiteEntryRouting(win);
  if (routing?.shouldRedirect) {
    win.location.replace(routing.targetUrl);
  }
}
