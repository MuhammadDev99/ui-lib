import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@muhammad_dev_77/ui-lib': path.resolve(__dirname, './src/index.ts'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});