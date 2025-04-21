// 综合管理平台路由配置
import { createRouter, createWebHistory } from 'vue-router';

// 导入路由模块
import dashboardRoute from './modules/dashboard';
import serviceRoute from './modules/service';
import investmentRoute from './modules/investment';

// 导入布局组件
import AdminLayout from '../layouts/AdminLayout.vue';

// 为调试打印路由模块
console.log('Dashboard路由:', dashboardRoute);
console.log('Service路由:', serviceRoute);
console.log('Investment路由:', investmentRoute);

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 登录页面，不使用布局
    {
      path: '/comprehensive/login',
      name: 'Login',
      component: () => import('../views/login/index.vue'),
      meta: {
        title: '登录',
        requiresAuth: false
      }
    },
    // 根路径重定向到登录页
    {
      path: '/comprehensive',
      redirect: '/comprehensive/login',
    },
    // 使用AdminLayout的路由
    {
      path: '/comprehensive',
      component: AdminLayout,
      children: [
        // Dashboard路由
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../views/dashboard/index.vue'),
          meta: {
            title: '工作门户',
            icon: 'dashboard-outlined',
            permission: ['dashboard:view']
          }
        },
        // 其他模块化路由
        {
          ...serviceRoute,
          path: serviceRoute.path.replace('/comprehensive', ''),
        },
        {
          ...investmentRoute,
          path: investmentRoute.path.replace('/comprehensive', ''),
        },
      ],
      meta: {
        requiresAuth: true
      }
    },
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
  
  // 简单的权限验证示例 (实际项目中会有更复杂的验证逻辑)
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (to.meta.requiresAuth && !isAuthenticated && to.path !== '/comprehensive/login') {
    // 需要登录但用户未认证，重定向到登录页
    next({ path: '/comprehensive/login' });
  } else {
    next();
  }
});

// 记录路由完成后的状态
router.afterEach((to, from) => {
  console.log('路由切换完成:', {
    from: from.fullPath,
    to: to.fullPath
  });
});

export default router; 