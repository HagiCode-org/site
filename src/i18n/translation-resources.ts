import {
  getSiteLocaleFallbackChain,
  resolveSiteLocale,
  type SiteLocale,
} from './locale-metadata';
import {
  SITE_I18N_NAMESPACES,
  type SiteI18nNamespace,
} from './namespaces';
import {
  createTranslator,
  SITE_I18N_PAYLOAD_GLOBAL,
  type TranslationNamespace,
  type TranslationResourceTree,
} from './ui';

const resourceModules = import.meta.glob('./generated-locales/*/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, TranslationNamespace>;

function buildTranslationResources(): TranslationResourceTree {
  const resources: TranslationResourceTree = {};

  for (const [modulePath, value] of Object.entries(resourceModules)) {
    const match = modulePath.match(/generated-locales\/([^/]+)\/([^/]+)\.json$/u);
    if (!match) {
      continue;
    }

    const [, locale, namespace] = match;
    const resolvedLocale = resolveSiteLocale(locale);
    const resolvedNamespace = namespace as SiteI18nNamespace;

    resources[resolvedLocale] ??= {};
    resources[resolvedLocale][resolvedNamespace] = value;
  }

  return resources;
}

function getLookupLocales(locale: SiteLocale): readonly SiteLocale[] {
  return [locale, ...getSiteLocaleFallbackChain(locale).filter((candidate) => candidate !== locale)];
}

function escapeInlineJson(input: string) {
  return input
    .replace(/</g, '\\u003C')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

const serverTranslationResources = buildTranslationResources();

export function getServerTranslationResources() {
  return serverTranslationResources;
}

export function getPageTranslationResources(
  localeInput: string | null | undefined,
  namespaces: readonly SiteI18nNamespace[] = SITE_I18N_NAMESPACES,
): TranslationResourceTree {
  const locale = resolveSiteLocale(localeInput);
  const resources: TranslationResourceTree = {};
  const uniqueNamespaces = [...new Set(namespaces)] as SiteI18nNamespace[];

  for (const candidate of getLookupLocales(locale)) {
    const candidateResources = serverTranslationResources[candidate];
    if (!candidateResources) {
      continue;
    }

    for (const namespace of uniqueNamespaces) {
      const namespaceResources = candidateResources[namespace];
      if (!namespaceResources) {
        continue;
      }

      resources[candidate] ??= {};
      resources[candidate][namespace] = namespaceResources;
    }
  }

  return resources;
}

export function getSerializedPageTranslationResources(
  localeInput: string | null | undefined,
  namespaces: readonly SiteI18nNamespace[] = SITE_I18N_NAMESPACES,
) {
  return escapeInlineJson(JSON.stringify(getPageTranslationResources(localeInput, namespaces)));
}

export function getSerializedPageTranslationBootstrap(
  localeInput: string | null | undefined,
  namespaces: readonly SiteI18nNamespace[] = SITE_I18N_NAMESPACES,
) {
  return `window.${SITE_I18N_PAYLOAD_GLOBAL} = ${getSerializedPageTranslationResources(localeInput, namespaces)};`;
}

export function getServerTranslation(localeInput: string | null | undefined) {
  return createTranslator(localeInput, { resources: serverTranslationResources });
}
