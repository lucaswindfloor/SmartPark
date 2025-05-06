// main.js
// SmartCampus Application Main Entry Point (Platform Selector)
// 智慧园区系统主入口文件 (平台选择器)

import { createApp } from 'vue';
import PlatformSelector from './app-selector/App.vue';
// --- REMOVE: Comprehensive platform specific imports ---
// import ComprehensiveApp from './platforms/comprehensive/App.vue';
// import comprehensiveRouter from './platforms/comprehensive/router';
// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
// import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// Add Ant Design Vue (Assuming selector uses Antd)
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import './assets/styles/main.css';

console.log("平台选择器入口启动，当前路径:", window.location.pathname);

// --- REMOVE: Conditional mounting logic --- 
// // 创建一个单一的应用方法，确保不重复挂载
// let app = null;
// 
// // 在根路径上显示平台选择器
// if (window.location.pathname === '/' || window.location.pathname === '/selector.html') {
//   console.log('加载平台选择器');
//   app = createApp(PlatformSelector);
//   app.use(Antd);
//   
//   // 挂载平台选择器
//   app.mount('#app');
//   console.log('平台选择器已挂载');
// } 
// // 针对综合管理平台路径
// else if (window.location.pathname.startsWith('/comprehensive/')) {
//   // ... comprehensive app logic removed ...
// } 
// // 其他路径
// else {
//   console.log('未识别的路径，加载平台选择器:', window.location.pathname);
//   app = createApp(PlatformSelector);
//   app.use(Antd);
//   app.mount('#app');
// }

// --- CHANGE: Always mount the Platform Selector from main.js --- 
console.log('加载平台选择器 (main.js)');
const app = createApp(PlatformSelector);

// Register Antd for the selector app
app.use(Antd);

// Mount the selector app
app.mount('#app'); 
// Ensure your main HTML file has <div id="app"></div> for the selector

console.log('平台选择器已挂载 (main.js)'); 