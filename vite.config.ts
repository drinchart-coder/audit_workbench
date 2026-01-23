import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 采用更安全的方式注入 process.env，防止应用在没有 API Key 时崩溃
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || '')
    },
    'global': 'globalThis'
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild', // 使用 Vite 自带的 esbuild，不再依赖外部 terser
    sourcemap: false
  }
});