import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  // Add this loader configuration to enable native CSS Modules compiling:
  loader: {
    '.css': 'local-css',
  },
  external: ['react', 'react-dom', 'clsx', 'lucide-react'],
  banner: { js: '"use client";' },
});