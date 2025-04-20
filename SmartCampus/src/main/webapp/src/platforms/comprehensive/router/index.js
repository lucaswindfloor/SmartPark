// 综合管理平台路由配置
import { createRouter, createWebHistory } from 'vue-router';

// 导入路由模块
import dashboardRoute from './modules/dashboard';
import serviceRoute from './modules/service';
import investmentRoute from './modules/investment';

// 为调试打印路由模块
console.log('Dashboard路由:', dashboardRoute);
console.log('Service路由:', serviceRoute);
console.log('Investment路由:', investmentRoute);

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),  // 移除基础路径'/comprehensive'
  routes: [
    {
      path: '/comprehensive/login',
      name: 'Login',
      component: () => import('../views/login/index.vue'),
      meta: {
        title: '登录',
        requiresAuth: false
      }
    },
    {
      path: '/comprehensive',
      component: () => import('../views/login/index.vue'),
      meta: {
        title: '登录',
        requiresAuth: false
      }
    },
    // 使用模块化路由
    dashboardRoute,
    serviceRoute,
    investmentRoute,
    // 捕获所有未匹配的路由，重定向到登录页
    {
      path: '/comprehensive/:pathMatch(.*)*',
      redirect: '/comprehensive/login'
    }
  ]
});

// 路由导航守卫 - 记录所有导航
router.beforeEach((to, from, next) => {
  console.log('综合平台路由守卫触发:', { 
    to: to.fullPath, 
    from: from.fullPath 
  });
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 综合管理平台`;
  }
  
  // 这里可以添加全局路由守卫逻辑
  // 例如权限检查、用户登录状态验证等
  next();
});

export default router; 