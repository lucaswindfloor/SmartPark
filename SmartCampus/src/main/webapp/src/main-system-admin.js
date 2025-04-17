// main-system-admin.js
// 系统管理平台入口文件

import { createApp } from 'vue';
import App from './platforms/system-admin/App.vue';
import router from './platforms/system-admin/router';
import { createPinia } from 'pinia';
import './assets/styles/main.css';

// 导入核心插件
import corePlugins from './core/plugins';

const app = createApp(App);
const pinia = createPinia();

// 使用插件
app.use(router);
app.use(pinia);

// 注册所有核心插件
Object.values(corePlugins).forEach(plugin => {
  app.use(plugin);
});

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('系统管理平台错误:', err);
  console.error('错误信息:', info);
};

app.mount('#app'); 