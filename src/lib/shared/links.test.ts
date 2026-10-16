import { describe, expect, it } from 'vitest';

import { getLinkRel, getRelForHref, isFirstPartyHref } from './links';

describe('isFirstPartyHref', () => {
  it('treats hagicode.com and its subdomains as first-party', () => {
    expect(isFirstPartyHref('https://hagicode.com/')).toBe(true);
    expect(isFirstPartyHref('https://www.hagicode.com/desktop/')).toBe(true);
    expect(isFirstPartyHref('https://docs.hagicode.com/blog/')).toBe(true);
    expect(isFirstPartyHref('https://COST.HAGICODE.COM')).toBe(true);
    expect(isFirstPartyHref('http://index.hagicode.com/')).toBe(true);
  });

  it('treats the HagiCode-org GitHub organization as first-party, case-insensitively', () => {
    expect(isFirstPartyHref('https://github.com/HagiCode-org/site')).toBe(true);
    expect(isFirstPartyHref('https://github.com/HagiCode-org/')).toBe(true);
    expect(isFirstPartyHref('https://github.com/hagicode-org/hagicode-core')).toBe(true);
  });

  it('treats relative and same-origin URLs as first-party', () => {
    expect(isFirstPartyHref('/desktop/')).toBe(true);
    expect(isFirstPartyHref('#store')).toBe(true);
    expect(isFirstPartyHref('https://www.hagicode.com/about/')).toBe(true);
  });

  it('treats Discord, Steam, Microsoft Store and other hosts as third-party', () => {
    expect(isFirstPartyHref('https://discord.gg/qY662sJK')).toBe(false);
    expect(isFirstPartyHref('https://store.steampowered.com/app/4625540/Hagicode/')).toBe(false);
    expect(isFirstPartyHref('https://apps.microsoft.com/detail/9N3PM0N3SVDW')).toBe(false);
    expect(isFirstPartyHref('https://www.bilibili.com/video/BV1z4oWB3EpY')).toBe(false);
    expect(isFirstPartyHref('https://www.youtube.com/watch?v=AQ8oSTW6wNQ')).toBe(false);
    expect(isFirstPartyHref('https://github.com/other-org/site')).toBe(false);
    expect(isFirstPartyHref('https://github.com/')).toBe(false);
  });

  it('rejects look-alike hosts and paths that only contain the first-party string', () => {
    expect(isFirstPartyHref('https://hagicode.com.evil.example/')).toBe(false);
    expect(isFirstPartyHref('https://nothagicode.com/')).toBe(false);
    expect(isFirstPartyHref('https://evilhagicode.com/')).toBe(false);
    expect(isFirstPartyHref('https://github.com/HagiCode-org-fake/site')).toBe(false);
    expect(isFirstPartyHref('https://example.com/hagicode.com')).toBe(false);
    expect(isFirstPartyHref('https://example.com/?next=https://hagicode.com/')).toBe(false);
    expect(isFirstPartyHref('https://example.com/github.com/HagiCode-org/site')).toBe(false);
  });

  it('rejects non-http(s) protocols and malformed URLs', () => {
    expect(isFirstPartyHref('mailto:hello@hagicode.com')).toBe(false);
    expect(isFirstPartyHref('tel:+1555')).toBe(false);
    expect(isFirstPartyHref('javascript:void(0)')).toBe(false);
    expect(isFirstPartyHref('https://[invalid')).toBe(false);
  });
});

describe('getRelForHref', () => {
  it('returns noopener for first-party destinations', () => {
    expect(getRelForHref('https://github.com/HagiCode-org/site')).toBe('noopener');
    expect(getRelForHref('https://cost.hagicode.com')).toBe('noopener');
  });

  it('returns noopener noreferrer for third-party destinations', () => {
    expect(getRelForHref('https://discord.gg/qY662sJK')).toBe('noopener noreferrer');
    expect(getRelForHref('https://hagicode.com.evil.example/')).toBe('noopener noreferrer');
    expect(getRelForHref('https://github.com/HagiCode-org-fake/site')).toBe('noopener noreferrer');
  });
});

describe('getLinkRel', () => {
  it('returns noopener for first-party external links (GitHub org and *.hagicode.com)', () => {
    expect(getLinkRel('github')).toBe('noopener');
    expect(getLinkRel('costCalculator')).toBe('noopener');
  });

  it('returns noopener noreferrer for third-party external links (Discord, QQ group)', () => {
    expect(getLinkRel('discord')).toBe('noopener noreferrer');
    expect(getLinkRel('qqGroup')).toBe('noopener noreferrer');
  });

  it('returns undefined for same-tab links', () => {
    expect(getLinkRel('website')).toBeUndefined();
    expect(getLinkRel('docs')).toBeUndefined();
  });
});
