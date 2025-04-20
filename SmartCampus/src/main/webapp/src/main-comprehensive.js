// main-comprehensive.js
// 综合管理平台入口文件

import { createApp } from 'vue';
import App from './platforms/comprehensive/App.vue';
import router from './platforms/comprehensive/router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './assets/styles/main.css';

// 显示基本调试信息
console.log('正在加载综合管理平台...');
console.log('当前路径:', window.location.pathname);

// 创建应用实例
const app = createApp(App);

// 添加错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue错误:', err);
  console.error('错误信息:', info);
  // 显示错误到页面
  document.getElementById('app').innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2>应用加载错误</h2>
      <pre style="text-align: left; background: #f5f5f5; padding: 10px; overflow: auto;">
        ${err.stack || err.message || '未知错误'}
      </pre>
    </div>
  `;
};

// 使用插件
app.use(router);
app.use(ElementPlus);

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 先渲染一个加载提示
document.getElementById('app').innerHTML = '<div style="text-align:center;padding:50px;"><h3>加载中...</h3></div>';

// 确保DOM已准备好
setTimeout(() => {
  // 挂载应用
  app.mount('#app');
  console.log('综合管理平台已挂载');
}, 0); 