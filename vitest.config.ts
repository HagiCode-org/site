import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/lib/shared': fileURLToPath(new URL('./src/lib/shared', import.meta.url)),
    },
  },
});
