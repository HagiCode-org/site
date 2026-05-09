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

export type TranslationPrimitive = string | number | boolean | null;
export type TranslationValue =
  | TranslationPrimitive
  | TranslationValue[]
  | { [key: string]: TranslationValue };

export type TranslationNamespace = Record<string, TranslationValue>;
export type TranslationResourceTree = Partial<
  Record<SiteLocale, Partial<Record<SiteI18nNamespace, TranslationNamespace>>>
>;

export const SITE_I18N_PAYLOAD_GLOBAL = '__HAGICODE_SITE_I18N__' as const;

const EMPTY_TRANSLATION_RESOURCES: TranslationResourceTree = {};

declare global {
  var __HAGICODE_SITE_I18N__: TranslationResourceTree | undefined;
}

function getTranslationStore() {
  return globalThis as typeof globalThis & {
    __HAGICODE_SITE_I18N__?: TranslationResourceTree;
  };
}

function getRegisteredTranslationResources(): TranslationResourceTree | undefined {
  const resources = getTranslationStore().__HAGICODE_SITE_I18N__;

  if (!resources || typeof resources !== 'object') {
    return undefined;
  }

  return resources;
}

function getDefaultTranslationResources() {
  return getRegisteredTranslationResources() ?? EMPTY_TRANSLATION_RESOURCES;
}

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

export function registerTranslationResources(resources: TranslationResourceTree) {
  getTranslationStore().__HAGICODE_SITE_I18N__ = resources;
  return resources;
}

export function clearRegisteredTranslationResources() {
  delete getTranslationStore().__HAGICODE_SITE_I18N__;
}

export function resolveTranslationValue(
  localeInput: string | null | undefined,
  key: string,
  resources: TranslationResourceTree = getDefaultTranslationResources(),
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
  const locale = resolveSiteLocale(localeInput, DEFAULT_LOCALE);
  const resources = options.resources ?? getDefaultTranslationResources();

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

export function useTranslation(
  locale: string | null | undefined,
  options: {
    resources?: TranslationResourceTree;
  } = {},
) {
  return createTranslator(locale, options);
}

export function getTranslation(
  locale: string | null | undefined,
  options: {
    resources?: TranslationResourceTree;
  } = {},
) {
  return createTranslator(locale, options);
}

export function getTranslationResources() {
  return getDefaultTranslationResources();
}
