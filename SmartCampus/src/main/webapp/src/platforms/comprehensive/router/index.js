// 综合管理平台路由配置
import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn as isAuthenticated, /* getAuthDiagnostics, */ clearAuth, getToken } from '../../../core/utils/auth';

// 导入路由模块
import dashboardRoute from './modules/dashboard';
import servicemanagementRoute from './modules/servicemanagement';
import recruitmentmanagementRoute from './modules/recruitmentmanagement';

// 导入布局组件
import AdminLayout from '../layouts/AdminLayout.vue';
// --- DIAGNOSTIC: Static Import for Login --- 
import LoginView from '../views/login/index.vue';

// 为调试打印路由模块
console.log('Dashboard路由:', dashboardRoute);
console.log('Service路由:', servicemanagementRoute);
console.log('Recruitment路由:', recruitmentmanagementRoute);

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 登录页面，不使用布局
    {
      path: '/comprehensive/login',
      name: 'Login',
      // --- DIAGNOSTIC: Use Static Import --- 
      component: LoginView, 
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
          ...servicemanagementRoute,
          path: servicemanagementRoute.path.replace('/comprehensive', ''),
        },
        {
          ...recruitmentmanagementRoute,
          path: recruitmentmanagementRoute.path.replace('/comprehensive', ''),
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
    from: from.fullPath,
    requiresAuth: to.meta.requiresAuth
  });
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 综合管理平台`;
  }
  
  // 获取并记录认证状态
  const authenticated = isAuthenticated();
  // --- DEBUG: Log token value --- 
  const tokenValue = getToken(); // Get token directly for logging
  console.log('认证状态 (isAuthenticated):', authenticated);
  console.log('Token 值 (getToken):', tokenValue); 
  
  // 权限验证逻辑
  console.log('检查权限: requiresAuth?:', to.meta.requiresAuth, '!authenticated?:', !authenticated, 'isNotLoginPage?:', to.path !== '/comprehensive/login');
  if (to.meta.requiresAuth && !authenticated && to.path !== '/comprehensive/login') {
    // 需要登录但用户未认证，重定向到登录页
    console.warn('访问受限路径需要登录:', to.fullPath);
    next({ path: '/comprehensive/login' });
  } else {
    // 用户已认证或路由不需要认证
    console.log('允许导航继续');
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