/**
 * @file stores/index.js
 * @description Pinia状态管理配置
 */

import { createPinia } from 'pinia';
import { markRaw } from 'vue';
import router from '../router';

// 创建pinia实例
const pinia = createPinia();

// 添加router到pinia上下文中，方便在store中使用
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

// 插件：状态持久化处理
pinia.use(({ store }) => {
  // 添加持久化能力
  const storeId = store.$id;
  
  // 从localStorage中加载之前的状态
  const fromStorage = localStorage.getItem(`store-${storeId}`);
  if (fromStorage) {
    try {
      store.$patch(JSON.parse(fromStorage));
    } catch (error) {
      console.error(`Error loading persisted state for store "${storeId}":`, error);
      // 如果出错，清除之前的状态
      localStorage.removeItem(`store-${storeId}`);
    }
  }
  
  // 监听状态变化并保存到localStorage
  // 注意：仅当你的store中标记了persistState: true时才会持久化
  store.$subscribe((mutation, state) => {
    if (store.$persistState) {
      localStorage.setItem(`store-${storeId}`, JSON.stringify(state));
    }
  });
});

export default pinia; 