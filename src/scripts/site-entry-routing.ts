import {
  LEGACY_SITE_LOCALE_STORAGE_KEY,
  SITE_LOCALE_STORAGE_KEY,
  buildSiteEntryRedirectUrl,
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

function persistLocale(win: Window, locale: string): void {
  try {
    win.localStorage.setItem(SITE_LOCALE_STORAGE_KEY, locale);
    win.localStorage.removeItem(LEGACY_SITE_LOCALE_STORAGE_KEY);
  } catch {
    // Ignore storage failures so the redirect still works for this visit.
  }
}

export function applySiteEntryRouting(win: Window = window): void {
  const targetPath = normalizeTargetPath(getMetaContent(win.document, 'hagicode-site-landing-target'));
  if (!targetPath) {
    return;
  }

  const siteBase = getMetaContent(win.document, 'hagicode-site-base') ?? '';
  const storedLocale = readStoredLocale(win);
  const resolution = buildSiteEntryRedirectUrl({
    currentUrl: new URL(win.location.href),
    targetPath,
    siteBase,
    storedLocale: storedLocale.primary,
    legacyStoredLocale: storedLocale.legacy,
    clientLanguages: getClientLanguages(win),
  });

  if (resolution.shouldPersist) {
    persistLocale(win, resolution.locale);
  }

  if (resolution.shouldRedirect) {
    win.location.replace(resolution.targetUrl);
  }
}
