import { afterEach, describe, expect, it, vi } from 'vitest';
import { captureSiteEvent, SITE_POSTHOG_EVENTS, type PostHogLike } from './posthog-events';

const FORBIDDEN_SUPER_KEYS = ['site_id', 'site_framework', 'hagilight_version', 'locale', 'page_type'];

function fakePostHog(overrides: Partial<PostHogLike> = {}) {
  return {
    __loaded: true,
    capture: vi.fn(),
    has_opted_out_capturing: vi.fn(() => false),
    ...overrides,
  };
}

describe('site PostHog capture wrapper', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends an allowlisted event with its allowed properties', () => {
    const posthog = fakePostHog();

    captureSiteEvent('download_desktop_windows', { source: 'desktop_hero', platform: 'windows' }, { posthog });

    expect(posthog.capture).toHaveBeenCalledTimes(1);
    expect(posthog.capture).toHaveBeenCalledWith('download_desktop_windows', {
      source: 'desktop_hero',
      platform: 'windows',
    });
  });

  it('sends nothing for an event name outside the table', () => {
    const posthog = fakePostHog();

    captureSiteEvent('not_in_table', { source: 'x' }, { posthog });

    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it('does not treat inherited object keys as events', () => {
    const posthog = fakePostHog();

    captureSiteEvent('constructor', {}, { posthog });
    captureSiteEvent('toString', {}, { posthog });

    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it('drops keys that are not in the event allowlist', () => {
    const posthog = fakePostHog();

    captureSiteEvent('open_steam_store', { source: 'hero', url: 'https://store.steampowered.com/app/x' }, { posthog });

    expect(posthog.capture).toHaveBeenCalledWith('open_steam_store', { source: 'hero' });
  });

  it('drops non-primitive values even for an allowed key', () => {
    const posthog = fakePostHog();

    captureSiteEvent('open_steam_store', { source: { text: 'nested' } as unknown as string }, { posthog });
    captureSiteEvent('open_steam_store', { source: ['a'] as unknown as string }, { posthog });
    captureSiteEvent('open_steam_store', { source: null as unknown as string }, { posthog });

    expect(posthog.capture).toHaveBeenCalledWith('open_steam_store', {});
    expect(posthog.capture).toHaveBeenCalledTimes(3);
  });

  it('caps a string value at 128 characters', () => {
    const posthog = fakePostHog();

    captureSiteEvent('open_steam_store', { source: 'a'.repeat(300) }, { posthog });

    const sent = vi.mocked(posthog.capture).mock.calls[0][1] as Record<string, string>;
    expect(sent.source).toHaveLength(128);
  });

  it.each(FORBIDDEN_SUPER_KEYS)('drops the super property %s supplied by a caller', (key) => {
    const posthog = fakePostHog();

    captureSiteEvent('download_desktop', { source: 'navbar', [key]: 'caller-value' }, { posthog });

    expect(posthog.capture).toHaveBeenCalledWith('download_desktop', { source: 'navbar' });
  });

  it('drops a platform value outside the enumeration', () => {
    const posthog = fakePostHog();

    captureSiteEvent('download_desktop_linux', { source: 'desktop', platform: 'Ubuntu 24.04' }, { posthog });

    expect(posthog.capture).toHaveBeenCalledWith('download_desktop_linux', { source: 'desktop' });
  });

  it('sends nothing and does not throw when window.posthog is undefined', () => {
    vi.stubGlobal('window', {});

    expect(() => captureSiteEvent('download_desktop', { source: 'navbar' })).not.toThrow();
  });

  it('sends nothing when there is no window at all', () => {
    vi.stubGlobal('window', undefined);

    expect(() => captureSiteEvent('download_desktop', { source: 'navbar' })).not.toThrow();
  });

  it('reads window.posthog when no posthog option is passed', () => {
    const posthog = fakePostHog();
    vi.stubGlobal('window', { posthog });

    captureSiteEvent('open_desktop_page', { source: 'install-options' });

    expect(posthog.capture).toHaveBeenCalledWith('open_desktop_page', { source: 'install-options' });
  });

  it('queues through the stub without calling has_opted_out_capturing while __loaded is false', () => {
    const posthog = fakePostHog({ __loaded: false });

    captureSiteEvent('download_desktop', { source: 'navbar' }, { posthog });

    expect(posthog.capture).toHaveBeenCalledWith('download_desktop', { source: 'navbar' });
    expect(posthog.has_opted_out_capturing).not.toHaveBeenCalled();
  });

  it('sends nothing once loaded when the visitor has opted out', () => {
    const posthog = fakePostHog({ has_opted_out_capturing: vi.fn(() => true) });

    captureSiteEvent('download_desktop', { source: 'navbar' }, { posthog });

    expect(posthog.has_opted_out_capturing).toHaveBeenCalledTimes(1);
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it('sends nothing when the consent gate says no', () => {
    const posthog = fakePostHog();

    captureSiteEvent('download_desktop', { source: 'navbar' }, { posthog, isAllowed: () => false });

    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it('returns normally when capture throws', () => {
    const posthog = fakePostHog({
      capture: vi.fn(() => {
        throw new Error('blocked');
      }),
    });

    expect(() => captureSiteEvent('download_desktop', { source: 'navbar' }, { posthog })).not.toThrow();
    expect(posthog.capture).toHaveBeenCalledTimes(1);
  });

  it('sends the same allowlisted property set for every table event, with URLs, free text and super properties in the input', () => {
    for (const [eventName, allowed] of Object.entries(SITE_POSTHOG_EVENTS)) {
      const posthog = fakePostHog();
      const noisyInput: Record<string, unknown> = {
        source: 'desktop_hero',
        platform: 'macos',
        url: 'https://example.com/private/path?token=abc#frag',
        fullUrl: 'https://mirror.example.com/x',
        freeText: 'user typed this search term',
        apiKey: 'sk-secret',
        income: 250000,
        site_id: 'hagicode',
        site_framework: 'astro',
        hagilight_version: '0.18.0',
        locale: 'en-US',
        page_type: 'home',
      };

      captureSiteEvent(eventName, noisyInput, { posthog });

      expect(posthog.capture, eventName).toHaveBeenCalledTimes(1);
      const [sentName, sentProperties] = vi.mocked(posthog.capture).mock.calls[0] as [string, Record<string, unknown>];
      expect(sentName).toBe(eventName);
      expect(Object.keys(sentProperties).sort(), eventName).toEqual(Object.keys(allowed).sort());
    }
  });

  it('keeps every table event snake_case with at least two words and no super-property key', () => {
    for (const [eventName, allowed] of Object.entries(SITE_POSTHOG_EVENTS)) {
      expect(eventName).toMatch(/^[a-z]+(_[a-z]+)+$/);
      for (const key of Object.keys(allowed)) {
        expect(FORBIDDEN_SUPER_KEYS).not.toContain(key);
      }
    }
  });
});
