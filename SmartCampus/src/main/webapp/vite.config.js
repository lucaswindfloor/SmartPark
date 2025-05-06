import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@comp': resolve(__dirname, 'src/platforms/comprehensive'),
      '@public': resolve(__dirname, 'src/platforms/public-service'),
      '@admin': resolve(__dirname, 'src/platforms/system-admin'),
      '@service': resolve(__dirname, 'src/services')
    }
  },
  // 配置根目录为当前目录，让Vite知道从哪里查找文件
  root: __dirname,
  // 指定静态资源目录
  publicDir: 'public',
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    cors: true,
    hmr: { overlay: false }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        comprehensive: resolve(__dirname, 'comprehensive.html')
      }
    }
  }
}); 