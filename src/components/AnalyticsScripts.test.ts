import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { WEBSITE_ANALYTICS_READY_EVENT } from '@/lib/analytics/tracker';

describe('AnalyticsScripts hagilight integration', () => {
  it('uses the hagilight 51LA component with its defaults instead of a local SDK loader', async () => {
    const source = await readFile(resolve(process.cwd(), 'src/components/AnalyticsScripts.astro'), 'utf8');

    expect(source).toContain("import Analytics51LA from '@hagicode/hagilight-core/Analytics51LA'");
    expect(source).toContain('<Analytics51LA siteId={laId} />');
    expect(source).not.toContain('screenRecord');
    expect(existsSync(resolve(process.cwd(), 'src/components/51LAAnalytics.astro'))).toBe(false);
  });

  it('flushes queued events on page load, not on an event only a local component could dispatch', () => {
    expect(WEBSITE_ANALYTICS_READY_EVENT).toBe('load');
  });
});
