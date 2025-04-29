import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    vue(),
    // 自定义插件：记录请求
    {
      name: 'log-requests',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // 记录请求
          console.log(`请求: ${req.method} ${req.url}`);
          
          // 如果是根路径，直接重定向到选择器页面
          if (req.url === '/' || req.url === '/index.html') {
            console.log('拦截到根路径请求，重定向到选择器页面');
            res.writeHead(302, {
              'Location': '/selector.html'
            });
            res.end();
            return;
          }
          
          // 简化路由处理 - 让所有请求通过，交给Vue Router处理
          // 选择器页面
          if (req.url === '/selector.html') {
            console.log('加载选择器页面');
            next();
            return;
          }
          
          // 综合平台相关路由 - 直接通过，不进行干预
          if (req.url.startsWith('/comprehensive/')) {
            console.log('访问综合平台:', req.url);
            // 不做任何特殊处理，直接交给Vite处理
            next();
            return;
          }
          
          // 所有其他请求
          next();
        });
      }
    }
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
        rewrite: (path) => path
      }
    },
    cors: true,
    hmr: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
}); 