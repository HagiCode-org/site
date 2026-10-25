import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/lib/shared': fileURLToPath(new URL('./src/lib/shared', import.meta.url)),
    },
  },
  test: {
    // Memory bound: cap the worker count and give every worker a V8 heap ceiling, so a leaking test file fails with an OOM
    // instead of exhausting the machine.
    maxWorkers: 4,
    execArgv: ['--max-old-space-size=4096'],
  },
});
