import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  injectStyle: true, // Auto-injects CSS into JS
  external: ['react', 'react-dom', 'clsx', 'lucide-react'],
  banner: { js: '"use client";' },
});