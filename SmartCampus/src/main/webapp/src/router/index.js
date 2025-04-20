/**
 * @file router/index.js
 * @description 通用路由配置，用于Pinia集成
 */

import { createRouter, createWebHistory } from 'vue-router';

// 创建一个简单的通用路由
// 注意：实际应用中将使用平台特定的路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../app-selector/App.vue'),
      // 移除redirect防止循环重定向
    },
    {
      path: '/app-selector',
      name: 'AppSelector',
      component: () => import('../app-selector/App.vue')
    },
    // 为了向后兼容，将/selector也指向同一组件
    {
      path: '/selector',
      redirect: '/app-selector'
    }
  ]
});

export default router; 