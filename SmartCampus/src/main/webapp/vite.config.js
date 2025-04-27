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
          
          // 如果是根路径，直接重定向到选择器页面，但不进行后续自动跳转
          if (req.url === '/' || req.url === '/index.html') {
            console.log('拦截到根路径请求，重定向到选择器页面');
            res.writeHead(302, {
              'Location': '/selector.html'
            });
            res.end();
            return;
          }
          
          // 移除原来的自动跳转代码，改为更合理的路由处理
          if (req.url === '/selector.html') {
            console.log('加载选择器页面');
            next();
            return;
          }
          
          // 综合平台相关路由
          if (req.url.startsWith('/comprehensive/')) {
            console.log('访问综合平台:', req.url);
            next();
            return;
          }
          
          // 特定模块相关路由 - 不再自动跳转
          if (req.url.startsWith('/service/information/notification')) {
            console.log('访问通知公告页面，需要登录后由菜单导航');
            // 让用户通过正常流程导航
            res.writeHead(302, {
              'Location': '/selector.html'
            });
            res.end();
            return;
          }
          
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
      '/service': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path
      }
    },
    cors: true,
    hmr: true,
    // 配置路径重写规则
    historyApiFallback: {
      disableDotRule: true,
      verbose: true,
      rewrites: [
        // 使用选择器页面作为根路径
        { from: /^\/$/, to: '/selector.html' },
        // 选择器页面
        { from: /^\/selector\.html$/, to: '/selector.html' },
        // 其他路径
        { from: /^\/comprehensive\/.*$/, to: '/index.html' },
        { from: /^\/public-service\/.*$/, to: '/index.html' },
        { from: /^\/system-admin\/.*$/, to: '/index.html' }
      ]
    }
  }
}); 