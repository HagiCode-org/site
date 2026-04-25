import { describe, expect, it, vi } from 'vitest';

import { loadActivePromotions, loadFirstActivePromotion, resolvePromoteUrls } from './promote-loader';

const jsonHeaders = { 'content-type': 'application/json' };
const BOUNDARY = '2026-04-29T00:00:00+08:00';
const BEFORE_BOUNDARY = '2026-04-28T23:59:59+08:00';
const AFTER_BOUNDARY = '2026-04-29T00:00:01+08:00';

function response(payload: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(payload), { status: 200, headers: jsonHeaders, ...init });
}

function createCatalogFetch(payload: {
  promotes: Array<Record<string, unknown>>;
  contents?: Array<Record<string, unknown>>;
}) {
  const contents = payload.contents ?? payload.promotes.map((promotion) => ({
    id: promotion.id,
    title: { en: `Title ${promotion.id as string}`, zh: `标题 ${promotion.id as string}` },
    description: { en: `Description ${promotion.id as string}`, zh: `描述 ${promotion.id as string}` },
    link: `https://example.invalid/${promotion.id as string}`,
    targetPlatform: 'steam',
    cta: { en: `Open ${promotion.id as string}`, zh: `打开 ${promotion.id as string}` },
  }));

  return vi.fn(async (input: RequestInfo | URL) => {
    const url = input.toString();
    if (url.endsWith('/index-catalog.json')) {
      return response({
        entries: [
          { id: 'promotion-flags', path: '/promote.json' },
          { id: 'promotion-content', path: '/promote_content.json' },
        ],
      });
    }
    if (url.endsWith('/promote.json')) {
      return response({ promotes: payload.promotes });
    }
    if (url.endsWith('/promote_content.json')) {
      return response({ contents });
    }
    throw new Error(`Unexpected URL: ${url}`);
  });
}

describe('promote-loader', () => {
  it('loads active promotions through catalog discovery', async () => {
    const fetchImpl = createCatalogFetch({
      promotes: [
        { id: 'inactive', on: false },
        { id: 'active-one', on: true },
        { id: 'active-two', on: true },
      ],
      contents: [
        { id: 'inactive', title: { en: 'Hidden', zh: '隐藏' }, description: { en: 'Hidden', zh: '隐藏' }, link: 'https://example.invalid/hidden', targetPlatform: 'steam', cta: { en: 'View on Steam', zh: '前往 Steam' } },
        { id: 'active-one', title: { en: 'Wishlist Now', zh: '立即添加到愿望单' }, description: { en: 'English copy', zh: '中文文案' }, cta: { en: 'Wishlist on Steam', zh: '加入愿望单' }, link: 'https://example.invalid/one', targetPlatform: 'steam' },
        { id: 'active-two', title: { en: 'Second', zh: '第二条' }, description: { en: 'Second copy', zh: '第二条文案' }, link: 'https://example.invalid/two' },
      ],
    });

    const urls = await resolvePromoteUrls(fetchImpl as typeof fetch);
    const promotions = await loadActivePromotions({
      locale: 'zh-CN',
      fetchImpl: fetchImpl as typeof fetch,
      now: Date.parse(BEFORE_BOUNDARY),
    });

    expect(urls.source).toBe('catalog');
    expect(promotions.map((promotion) => promotion.id)).toEqual(['active-one', 'active-two']);
    expect(promotions[0]).toMatchObject({
      id: 'active-one',
      title: '立即添加到愿望单',
      description: '中文文案',
      platform: 'steam',
      ctaLabel: '加入愿望单',
    });
  });

  it('keeps future promotions hidden until their start time', async () => {
    const promotions = await loadActivePromotions({
      locale: 'en',
      fetchImpl: createCatalogFetch({
        promotes: [
          { id: 'future', on: true, startTime: BOUNDARY },
          { id: 'current', on: true },
        ],
      }) as typeof fetch,
      now: Date.parse(BEFORE_BOUNDARY),
    });

    expect(promotions.map((promotion) => promotion.id)).toEqual(['current']);
  });

  it('removes promotions at and after their end time', async () => {
    const fetchImpl = createCatalogFetch({
      promotes: [
        { id: 'expired', on: true, endTime: BOUNDARY },
        { id: 'current', on: true },
      ],
    });

    const before = await loadActivePromotions({
      locale: 'en',
      fetchImpl: fetchImpl as typeof fetch,
      now: Date.parse(BEFORE_BOUNDARY),
    });
    const after = await loadActivePromotions({
      locale: 'en',
      fetchImpl: fetchImpl as typeof fetch,
      now: Date.parse(BOUNDARY),
    });

    expect(before.map((promotion) => promotion.id)).toEqual(['expired', 'current']);
    expect(after.map((promotion) => promotion.id)).toEqual(['current']);
  });

  it('hands off cleanly at the exact schedule boundary', async () => {
    const fetchImpl = createCatalogFetch({
      promotes: [
        { id: 'main-game-2026-04-29', on: true, endTime: BOUNDARY },
        { id: 'main-game-steam-ea-2026-04-29', on: true, startTime: BOUNDARY },
      ],
    });

    const before = await loadFirstActivePromotion({
      locale: 'en',
      fetchImpl: fetchImpl as typeof fetch,
      now: Date.parse(BEFORE_BOUNDARY),
    });
    const atBoundary = await loadFirstActivePromotion({
      locale: 'en',
      fetchImpl: fetchImpl as typeof fetch,
      now: Date.parse(BOUNDARY),
    });
    const after = await loadFirstActivePromotion({
      locale: 'en',
      fetchImpl: fetchImpl as typeof fetch,
      now: Date.parse(AFTER_BOUNDARY),
    });

    expect(before?.id).toBe('main-game-2026-04-29');
    expect(atBoundary?.id).toBe('main-game-steam-ea-2026-04-29');
    expect(after?.id).toBe('main-game-steam-ea-2026-04-29');
  });

  it('supports open-ended promotion windows without changing order', async () => {
    const promotions = await loadActivePromotions({
      locale: 'en',
      fetchImpl: createCatalogFetch({
        promotes: [
          { id: 'no-start', on: true, endTime: AFTER_BOUNDARY },
          { id: 'no-end', on: true, startTime: BEFORE_BOUNDARY },
        ],
      }) as typeof fetch,
      now: Date.parse(BOUNDARY),
    });

    expect(promotions.map((promotion) => promotion.id)).toEqual(['no-start', 'no-end']);
  });

  it('fails closed for invalid timestamps while keeping valid promotions', async () => {
    const promotions = await loadActivePromotions({
      locale: 'en',
      fetchImpl: createCatalogFetch({
        promotes: [
          { id: 'broken-start', on: true, startTime: 'not-a-date' },
          { id: 'broken-end', on: true, endTime: 'bad-date' },
          { id: 'broken-range', on: true, startTime: AFTER_BOUNDARY, endTime: BEFORE_BOUNDARY },
          { id: 'valid', on: true },
        ],
      }) as typeof fetch,
      now: Date.parse(BOUNDARY),
    });

    expect(promotions.map((promotion) => promotion.id)).toEqual(['valid']);
  });

  it('resolves CTA labels from locale data with deterministic fallbacks', async () => {
    const fetchImpl = createCatalogFetch({
      promotes: [
        { id: 'localized', on: true },
        { id: 'missing-locale', on: true },
        { id: 'malformed-cta', on: true },
        { id: 'legacy', on: true },
      ],
      contents: [
        { id: 'localized', title: { en: 'Localized' }, description: { en: 'English copy' }, cta: { en: 'View Offer', zh: '查看优惠' }, link: 'https://example.invalid/localized' },
        { id: 'missing-locale', title: { en: 'Missing locale' }, description: { en: 'Fallback copy' }, cta: { zh: '中文按钮' }, link: 'https://example.invalid/missing-locale' },
        { id: 'malformed-cta', title: { en: 'Malformed' }, description: { en: 'Malformed copy' }, cta: { en: '   ', zh: '' }, link: 'https://example.invalid/malformed-cta' },
        { id: 'legacy', title: { en: 'Legacy' }, description: { en: 'Legacy copy' }, link: 'https://example.invalid/legacy' },
      ],
    });

    const englishPromotions = await loadActivePromotions({ locale: 'en-US', fetchImpl: fetchImpl as typeof fetch });
    const chinesePromotions = await loadActivePromotions({ locale: 'zh-CN', fetchImpl: fetchImpl as typeof fetch });

    expect(englishPromotions.map((promotion) => promotion.ctaLabel)).toEqual(['View Offer', '中文按钮', 'GO', 'GO']);
    expect(chinesePromotions.map((promotion) => promotion.ctaLabel)).toEqual(['查看优惠', '中文按钮', '立即前往', '立即前往']);
  });

  it('falls back to stable promote endpoints when catalog discovery fails', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.endsWith('/index-catalog.json')) return new Response('not json', { status: 200, headers: { 'content-type': 'text/plain' } });
      if (url.endsWith('/promote.json')) return response({ promotes: [{ id: 'fallback', on: true }] });
      if (url.endsWith('/promote_content.json')) return response({ contents: [{ id: 'fallback', title: { en: 'Fallback' }, description: { en: 'Fallback copy' }, link: 'https://example.invalid/fallback' }] });
      throw new Error(`Unexpected URL: ${url}`);
    });

    const first = await loadFirstActivePromotion({ locale: 'en-US', fetchImpl: fetchImpl as typeof fetch });

    expect(first).toMatchObject({ id: 'fallback', title: 'Fallback', description: 'Fallback copy' });
  });

  it('returns an empty result when no valid active promotion exists', async () => {
    const fetchImpl = createCatalogFetch({
      promotes: [{ id: 'missing-content', on: true }],
      contents: [{ id: 'broken', title: {}, description: {}, link: '' }],
    });

    await expect(loadActivePromotions({ fetchImpl: fetchImpl as typeof fetch })).resolves.toEqual([]);
  });
});
