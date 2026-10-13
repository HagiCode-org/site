// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import MicrosoftStoreBadge from './MicrosoftStoreBadge';

/**
 * Mirrors the real `ms-store-badge`: `size` is a plain field and only attribute changes reach the
 * component, so React must not be left to set `size` as a property.
 */
class StubStoreBadge extends HTMLElement {
  static observedAttributes = ['size'];
  size = 'large';
  renderedSize = 'large';

  attributeChangedCallback(name: string, _previous: string | null, next: string | null) {
    if (name === 'size' && next) {
      this.size = next;
      this.renderedSize = next;
    }
  }
}

describe('MicrosoftStoreBadge', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    customElements.define('ms-store-badge', StubStoreBadge);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  async function render(size: 'small' | 'large') {
    await act(async () => {
      root.render(<MicrosoftStoreBadge size={size} />);
    });
    return container.querySelector('ms-store-badge') as StubStoreBadge;
  }

  it('passes a size change after mount through to the badge', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    const badge = await render('large');
    expect(badge.getAttribute('size')).toBe('large');

    await render('small');

    expect(badge.getAttribute('size')).toBe('small');
    expect(badge.renderedSize).toBe('small');
  });
});
