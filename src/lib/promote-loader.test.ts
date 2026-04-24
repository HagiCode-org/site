import { describe, expect, it, vi } from 'vitest';
import { loadActivePromotions, loadFirstActivePromotion, resolvePromoteUrls } from './promote-loader';

const jsonHeaders = { 'content-type': 'application/json' };

function response(payload: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(payload), { status: 200, headers: jsonHeaders, ...init });
}

function createCatalogFetch() {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = input.toString();
    if (url.endsWith('/index-catalog.json')) {
      return response({ entries: [
        { id: 'promotion-flags', path: '/promote.json' },
        { id: 'promotion-content', path: '/promote_content.json' },
      ] });
    }
    if (url.endsWith('/promote.json')) {
      return response({ promotes: [
        { id: 'inactive', on: false },
        { id: 'active-one', on: true },
        { id: 'active-two', on: true },
      ] });
    }
    if (url.endsWith('/promote_content.json')) {
      return response({ contents: [
        { id: 'inactive', title: { en: 'Hidden', zh: '隐藏' }, description: { en: 'Hidden', zh: '隐藏' }, link: 'https://example.invalid/hidden', targetPlatform: 'steam' },
        { id: 'active-one', title: { en: 'Wishlist Now', zh: '立即添加到愿望单' }, description: { en: 'English copy', zh: '中文文案' }, link: 'https://example.invalid/one', targetPlatform: 'steam' },
        { id: 'active-two', title: { en: 'Second', zh: '第二条' }, description: { en: 'Second copy', zh: '第二条文案' }, link: 'https://example.invalid/two' },
      ] });
    }
    throw new Error(`Unexpected URL: ${url}`);
  });
}

describe('promote-loader', () => {
  it('loads active promotions through catalog discovery', async () => {
    const fetchImpl = createCatalogFetch();

    const urls = await resolvePromoteUrls(fetchImpl as typeof fetch);
    const promotions = await loadActivePromotions({ locale: 'zh-CN', fetchImpl: fetchImpl as typeof fetch });

    expect(urls.source).toBe('catalog');
    expect(promotions).toHaveLength(2);
    expect(promotions[0]).toMatchObject({ id: 'active-one', title: '立即添加到愿望单', description: '中文文案', platform: 'steam' });
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
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.endsWith('/index-catalog.json')) return response({ entries: [] });
      if (url.endsWith('/promote.json')) return response({ promotes: [{ id: 'missing-content', on: true }] });
      if (url.endsWith('/promote_content.json')) return response({ contents: [{ id: 'broken', title: {}, description: {}, link: '' }] });
      throw new Error(`Unexpected URL: ${url}`);
    });

    await expect(loadActivePromotions({ fetchImpl: fetchImpl as typeof fetch })).resolves.toEqual([]);
  });
});
