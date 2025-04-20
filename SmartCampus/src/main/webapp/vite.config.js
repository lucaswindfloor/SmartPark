import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    vue(),
    // 自定义插件：记录和阻止重定向
    {
      name: 'log-requests',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // 记录请求
          console.log(`请求: ${req.method} ${req.url}`);
          
          // 如果是根路径，重定向到我们的中间页面
          if (req.url === '/' || req.url === '/index.html') {
            console.log('拦截到根路径请求，重定向到redirect_fix.html');
            res.writeHead(302, {
              'Location': '/redirect_fix.html'
            });
            res.end();
            return;
          }
          
          // 如果是/comprehensive/路径，检查是否是直接访问
          if (req.url.startsWith('/comprehensive/') && req.headers.referer) {
            const referer = new URL(req.headers.referer);
            if (referer.pathname === '/') {
              console.log('检测到从根路径的自动重定向，重定向到selector.html');
              res.writeHead(302, {
                'Location': '/selector.html'
              });
              res.end();
              return;
            }
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
    proxy: {},
    cors: true,
    hmr: true,
    // 配置路径重写规则
    historyApiFallback: {
      disableDotRule: true,
      verbose: true,
      rewrites: [
        // 使用我们的重定向修复页
        { from: /^\/$/, to: '/redirect_fix.html' },
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