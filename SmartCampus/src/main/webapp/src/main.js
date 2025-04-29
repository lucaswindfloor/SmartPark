// main.js
// SmartCampus Application Main Entry Point
// 智慧园区系统主入口文件

import { createApp } from 'vue';
import PlatformSelector from './app-selector/App.vue';
import ComprehensiveApp from './platforms/comprehensive/App.vue';
import comprehensiveRouter from './platforms/comprehensive/router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 添加 Ant Design Vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import './assets/styles/main.css';

console.log("应用启动，当前路径:", window.location.pathname);

// 创建一个单一的应用方法，确保不重复挂载
let app = null;

// 在根路径上显示平台选择器
if (window.location.pathname === '/' || window.location.pathname === '/selector.html') {
  console.log('加载平台选择器');
  app = createApp(PlatformSelector);
  app.use(Antd);
  
  // 挂载平台选择器
  app.mount('#app');
  console.log('平台选择器已挂载');
} 
// 针对综合管理平台路径
else if (window.location.pathname.startsWith('/comprehensive/')) {
  console.log('加载综合管理平台');
  
  // 创建应用
  app = createApp(ComprehensiveApp);
  
  // 配置错误处理
  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue错误:', err);
    console.error('错误信息:', info);
    console.error('错误组件:', vm);
    
    // 显示错误信息
    document.getElementById('app').innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>应用加载错误</h2>
        <pre style="text-align: left; background: #f5f5f5; padding: 10px; overflow: auto;">
          ${err.stack || err.message || '未知错误'}
        </pre>
      </div>
    `;
  };
  
  // 添加调试信息
  console.log('配置综合平台路由...');
  try {
    // 使用路由
    app.use(comprehensiveRouter);
    console.log('路由配置成功');
  } catch (error) {
    console.error('路由配置失败:', error);
  }
  
  // 使用UI库
  app.use(ElementPlus);
  app.use(Antd);
  
  // 注册Element Plus图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  
  // 挂载应用
  try {
    app.mount('#app');
    console.log('综合管理平台已挂载');
  } catch (error) {
    console.error('挂载应用失败:', error);
  }
} 
// 其他路径
else {
  console.log('未识别的路径:', window.location.pathname);
  app = createApp(PlatformSelector);
  app.use(Antd);
  app.mount('#app');
} 