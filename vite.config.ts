
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 仅注入必要的环境变量，避免直接传递整个 process.env 对象
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'global': 'window',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 移除 terser，改用 Vite 默认内置的 esbuild 进行压缩，提高构建速度并减少依赖错误
    minify: 'esbuild',
  }
});
