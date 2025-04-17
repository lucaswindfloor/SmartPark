// main.js
// SmartCampus Application Main Entry Point
// This file serves as the entry point for the SmartCampus application
// It initializes the platform selector for navigating between different platforms

import { createApp } from 'vue';
import AppSelector from './app-selector/App.vue';
import './assets/styles/main.css';

// 检查URL参数
const urlParams = new URLSearchParams(window.location.search);
const platform = urlParams.get('platform');

// 如果有平台参数，加载对应平台
if (platform) {
  // 动态导入对应平台的入口文件
  import(`./main-${platform}.js`).catch(error => {
    console.error(`无法加载平台: ${platform}`, error);
    // 加载失败显示平台选择器
    loadAppSelector();
  });
} else {
  // 否则加载平台选择器
  loadAppSelector();
}

// 加载平台选择器
function loadAppSelector() {
  const app = createApp(AppSelector);

  // 全局错误处理
  app.config.errorHandler = (err, vm, info) => {
    console.error('全局错误:', err);
    console.error('错误信息:', info);
  };

  app.mount('#app');
} 