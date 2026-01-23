
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 确保 process.env 在整个应用中可用
    'process.env': process.env,
    'global': {},
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  }
});
