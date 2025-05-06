// main-comprehensive.js
// 综合管理平台入口文件

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './platforms/comprehensive/App.vue';
import router from './platforms/comprehensive/router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 添加 Ant Design Vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import './assets/styles/main.css';

// 导入Pinia和共享状态
// import { useSharedStore } from './stores/shared';

// 显示基本调试信息
console.log('正在加载综合管理平台...');
console.log('当前路径:', window.location.pathname);

// 创建应用实例
const app = createApp(App);

// 创建Pinia实例
const pinia = createPinia();
export { pinia };

// 添加错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue错误:', err);
  console.error('错误信息:', info);
  console.error('错误组件实例:', instance);
  // Consider a less disruptive way to show errors in production
  try {
    document.getElementById('app-comprehensive').innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>应用加载时发生错误</h2>
        <p>请稍后重试或联系管理员。</p>
        <pre style="margin-top: 10px; font-size: 12px; text-align: left; background: #f5f5f5; padding: 10px; overflow: auto; max-height: 300px;">
          ${err.stack || err.message || '未知错误'}
        </pre>
      </div>
    `;
  } catch (e) {
    console.error("Failed to update DOM with error message:", e);
  }
};

// 使用插件 (Order matters: Pinia first, then Router)
app.use(pinia);
console.log('Pinia 已挂载');
app.use(router);
console.log('Router 已安装');

// --- CHANGE: Only register Ant Design Vue globally for now --- 
// app.use(ElementPlus);
// console.log('Element Plus 已挂载');
app.use(Antd); // 使用 Ant Design Vue
console.log('Ant Design Vue 已挂载'); // Keep Antd as it seems used by login
// app.use(ArcoVue);
// app.use(ArcoVueIcon);
// console.log('Arco Design Vue 已挂载');

// --- REMOVE: Element Plus icon registration --- 
// // 注册Element Plus图标
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component);
// }

// 直接挂载应用
app.mount('#app-comprehensive');
console.log('综合管理平台已挂载');

// 测试共享状态
// const sharedStore = useSharedStore();
// sharedStore.updatePlatformStatus('comprehensive', 'initialized');
// sharedStore.addGlobalNotification({
//   title: '综合管理平台已启动',
//   message: '平台初始化完成，共享状态测试成功',
//   type: 'success'
// });

// console.log('共享状态测试:', {
//   platforms: sharedStore.platformStatuses,
//   notifications: sharedStore.globalNotifications,
//   unreadCount: sharedStore.unreadNotificationsCount
// }); 