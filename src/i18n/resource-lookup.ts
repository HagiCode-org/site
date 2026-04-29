import {
  getSiteLocaleFallbackChain,
  resolveSiteLocale,
  type SiteLocale,
} from './locale-metadata';
import type { SiteI18nNamespace } from './namespaces';
import { getTranslationResources } from './ui';

type LocaleResourceValue =
  | string
  | number
  | boolean
  | null
  | LocaleResourceValue[]
  | { [key: string]: LocaleResourceValue };

function getNestedValue(
  input: LocaleResourceValue | undefined,
  segments: readonly string[],
): LocaleResourceValue | undefined {
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

    current = (current as Record<string, LocaleResourceValue>)[segment];
  }

  return current;
}

function getLookupLocales(locale: SiteLocale): readonly SiteLocale[] {
  return [
    locale,
    ...getSiteLocaleFallbackChain(locale).filter((candidate) => candidate !== locale),
  ];
}

export function getLocaleResourceValue(
  localeInput: string | null | undefined,
  namespace: SiteI18nNamespace,
  key: string,
): LocaleResourceValue | undefined {
  const locale = resolveSiteLocale(localeInput);
  const resources = getTranslationResources();
  const segments = key.split('.');

  for (const candidate of getLookupLocales(locale)) {
    const value = getNestedValue(
      resources[candidate]?.[namespace] as LocaleResourceValue | undefined,
      segments,
    );
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

export function requireLocaleResourceString(
  localeInput: string | null | undefined,
  namespace: SiteI18nNamespace,
  key: string,
): string {
  const value = getLocaleResourceValue(localeInput, namespace, key);

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  throw new Error(`Missing localized string for ${namespace}.${key} (${localeInput ?? 'default'})`);
}
