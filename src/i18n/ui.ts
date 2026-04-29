import {
  DEFAULT_LOCALE,
  getSiteLocaleFallbackChain,
  resolveSiteLocale,
  type SiteLocale,
} from './locale-metadata';
import {
  SITE_I18N_NAMESPACES,
  type SiteI18nNamespace,
} from './namespaces';

type TranslationPrimitive = string | number | boolean | null;
type TranslationValue =
  | TranslationPrimitive
  | TranslationValue[]
  | { [key: string]: TranslationValue };

type TranslationNamespace = Record<string, TranslationValue>;
type TranslationResourceTree = Record<
  SiteLocale,
  Partial<Record<SiteI18nNamespace, TranslationNamespace>>
>;

const resourceModules = import.meta.glob('./generated-locales/*/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, TranslationNamespace>;

function buildTranslationResources(): TranslationResourceTree {
  const resources = {} as TranslationResourceTree;

  for (const [modulePath, value] of Object.entries(resourceModules)) {
    const match = modulePath.match(/generated-locales\/([^/]+)\/([^/]+)\.json$/u);
    if (!match) {
      continue;
    }

    const [, locale, namespace] = match;
    const resolvedLocale = resolveSiteLocale(locale, DEFAULT_LOCALE);
    const resolvedNamespace = namespace as SiteI18nNamespace;

    resources[resolvedLocale] ??= {};
    resources[resolvedLocale][resolvedNamespace] = value;
  }

  return resources;
}

const translationResources = buildTranslationResources();

function getNestedValue(
  input: TranslationValue | undefined,
  segments: readonly string[],
): TranslationValue | undefined {
  let current = input;

  for (const segment of segments) {
    if (Array.isArray(current)) {
      if (!/^(?:0|[1-9]\d*)$/u.test(segment)) {
        return undefined;
      }

      current = current[Number(segment)];
      continue;
    }

    if (!current || typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string, TranslationValue>)[segment];
  }

  return current;
}

function interpolateValue(
  input: string,
  variables: Record<string, string | number | boolean> = {},
): string {
  return input.replace(/\{\{(\w+)\}\}|\{(\w+)\}/g, (_, doubleKey, singleKey) => {
    const key = doubleKey ?? singleKey;
    const value = variables[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

function getLookupLocales(locale: SiteLocale): readonly SiteLocale[] {
  return [locale, ...getSiteLocaleFallbackChain(locale).filter((candidate) => candidate !== locale)];
}

export function resolveTranslationValue(
  localeInput: string | null | undefined,
  key: string,
  resources: TranslationResourceTree = translationResources,
): TranslationValue | undefined {
  const locale = resolveSiteLocale(localeInput);
  const segments = key.split('.');

  for (const candidate of getLookupLocales(locale)) {
    for (const namespace of SITE_I18N_NAMESPACES) {
      const namespaceResources = resources[candidate]?.[namespace];
      const value = getNestedValue(namespaceResources, segments);
      if (value !== undefined) {
        return value;
      }
    }
  }

  return undefined;
}

export function createTranslator(
  localeInput: string | null | undefined,
  options: {
    resources?: TranslationResourceTree;
  } = {},
) {
  const locale = resolveSiteLocale(localeInput);
  const resources = options.resources ?? translationResources;

  return {
    locale,
    t(
      key: string,
      variables: Record<string, string | number | boolean> = {},
    ): string {
      const value = resolveTranslationValue(locale, key, resources);

      if (typeof value === 'string') {
        return interpolateValue(value, variables);
      }

      if (
        typeof value === 'number'
        || typeof value === 'boolean'
      ) {
        return String(value);
      }

      if (value === null) {
        return '';
      }

      return key;
    },
  };
}

export function useTranslation(locale: string | null | undefined) {
  return createTranslator(locale);
}

export function getTranslation(locale: string | null | undefined) {
  return createTranslator(locale);
}

export function getTranslationResources() {
  return translationResources;
}
