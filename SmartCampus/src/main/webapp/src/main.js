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
import './assets/styles/main.css';

console.log('初始路径:', window.location.pathname);
console.log('完整URL:', window.location.href);
console.log('PlatformSelector组件:', PlatformSelector ? '已加载' : '未加载');
console.log('ComprehensiveApp组件:', ComprehensiveApp ? '已加载' : '未加载');

// 监听URL变化 - 捕获任何可能的重定向
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('URL变化了!', 'New URL:', url);
  }
}).observe(document, {subtree: true, childList: true});

// 监听导航事件
window.addEventListener('popstate', (e) => {
  console.log('导航事件触发 - popstate', e);
});
window.addEventListener('navigate', (e) => {
  console.log('导航事件触发 - navigate', e);
});

// 记录DOM状态
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM已加载完成');
  console.log('App元素:', document.getElementById('app') ? '存在' : '不存在');
});

// 重要：在根路径强制阻止任何重定向
if (window.location.pathname === '/' || window.location.pathname === '') {
  console.log('检测到根路径，准备显示平台选择器');
  
  try {
    // 立即挂载平台选择器
    const app = createApp(PlatformSelector);
    console.log('平台选择器应用已创建');
    
    app.mount('#app');
    console.log('平台选择器已挂载到#app');
    
    // 验证挂载后的DOM
    setTimeout(() => {
      if (window.location.pathname !== '/') {
        console.log('警告: 路径已经改变! 当前路径:', window.location.pathname);
      }
      console.log('挂载后App内容:', document.getElementById('app').innerHTML);
    }, 100);
  } catch (err) {
    console.error('挂载平台选择器时出错:', err);
  }
} 
// 只有明确访问/comprehensive路径时才加载综合平台
else if (window.location.pathname.startsWith('/comprehensive/')) {
  console.log('加载综合管理平台');
  // 直接创建综合管理平台应用
  const app = createApp(ComprehensiveApp);
  
  // 配置错误处理
  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue错误:', err);
    console.error('错误信息:', info);
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
  app.use(comprehensiveRouter);
  app.use(ElementPlus);
  
  // 注册Element Plus图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  
  // 显示加载提示
  document.getElementById('app').innerHTML = '<div style="text-align:center;padding:50px;"><h3>加载中...</h3></div>';
  
  // 挂载应用
  setTimeout(() => {
    app.mount('#app');
    console.log('综合管理平台已挂载');
  }, 0);
} else {
  // 其他路径也加载平台选择器
  console.log('未识别的路径:', window.location.pathname, '加载平台选择器');
  try {
    createApp(PlatformSelector).mount('#app');
    console.log('平台选择器已挂载到#app (其他路径)');
  } catch (err) {
    console.error('挂载平台选择器时出错 (其他路径):', err);
  }
} 