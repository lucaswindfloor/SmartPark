// main-system-admin.js
// 系统管理平台入口文件

import { createApp } from 'vue';
import App from './platforms/system-admin/App.vue';
import router from './platforms/system-admin/router';
import pinia from './stores';
import './assets/styles/main.css';

// 导入核心插件
import corePlugins from './core/plugins';

// 设置默认平台
import { useAppStore } from './stores/app';

// 创建应用实例
const app = createApp(App);

// 使用插件
app.use(router);
app.use(pinia);

// 设置当前平台
const appStore = useAppStore();
appStore.setPlatform('system-admin');

// 注册所有核心插件
Object.values(corePlugins).forEach(plugin => {
  app.use(plugin);
});

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('系统管理平台错误:', err);
  console.error('错误信息:', info);
};

// 挂载应用
app.mount('#app'); 