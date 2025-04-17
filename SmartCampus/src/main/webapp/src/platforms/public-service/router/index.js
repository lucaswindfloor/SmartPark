// 公共服务平台路由配置
import { createRouter, createWebHistory } from 'vue-router';

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    // 其他路由将根据模块逐步添加
  ]
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 这里可以添加全局路由守卫逻辑
  // 例如权限检查、用户登录状态验证等
  next();
});

export default router; 