import {
  DEFAULT_LOCALE,
  SUPPORTED_SITE_LOCALES,
  getSiteLocaleDefinition,
  type SiteLocale,
} from '@/i18n/locale-metadata';
import {
  getStructuredArticleEntriesByCategory,
  resolveStructuredArticle,
} from '@/lib/structured-articles.mjs';

const ARTICLE_CATEGORY = 'vs-hagicode';

function isSiteLocale(route: string): route is SiteLocale {
  return SUPPORTED_SITE_LOCALES.some((locale) => locale === route);
}

export default function getFeed({ route, lang }: { route: string; lang: string }) {
  if (!isSiteLocale(route) || route !== lang) {
    throw new Error(`Unsupported Official Website RSS route "${route}" for language "${lang}".`);
  }

  const locale = route;
  const localeName = getSiteLocaleDefinition(locale).nativeName;
  const articles = getStructuredArticleEntriesByCategory(ARTICLE_CATEGORY)
    .filter((article) => article.supportedLocales.includes(locale))
    .map(({ slug }) => {
      const { detail } = resolveStructuredArticle(slug, locale);
      if (detail.locale !== locale) {
        throw new Error(`Structured article "${slug}" has no published ${locale} content.`);
      }

      return {
        title: detail.seo.title,
        description: detail.seo.description,
        link: locale === DEFAULT_LOCALE ? `/${slug}/` : `/${locale}/${slug}/`,
        pubDate: new Date(detail.updatedAt),
      };
    })
    .sort((left, right) => right.pubDate.getTime() - left.pubDate.getTime());

  return {
    title: `HagiCode | ${localeName} Articles`,
    description: `Published structured articles from the HagiCode website (${localeName}).`,
    items: articles,
  };
}
