import { defineConfig } from 'vitest/config';
import { join } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/.vercel/**',
      '**/.netlify/**',
      '**/.trunk/**',
      '**/.git/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '.next/**',
        '.nuxt/**',
        '.output/**',
        '.vercel/**',
        '.netlify/**',
        '.trunk/**',
        'vitest.config.{js,cjs,mjs,ts}',
        'vitest.setup.{js,cjs,mjs,ts}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': join(__dirname, './'),
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
});