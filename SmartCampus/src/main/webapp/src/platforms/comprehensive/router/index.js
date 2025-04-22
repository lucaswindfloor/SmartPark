// 综合管理平台路由配置
import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated, getAuthDiagnostics, forceAuthenticate } from '../../../services/auth';

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

// 开发环境初始化 - 生产环境应移除此代码
const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  console.warn('开发环境：自动设置认证状态');
  forceAuthenticate();
}

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
  
  // 获取并记录认证状态
  const authenticated = isAuthenticated();
  
  // 输出认证诊断信息
  console.log('认证状态:', authenticated);
  console.log('认证详情:', getAuthDiagnostics());
  
  // 特殊开发环境处理 - 针对仪表盘和服务模块
  if (isDev && !authenticated) {
    if (to.path.includes('/dashboard') || to.path.includes('/service')) {
      console.warn('开发模式：访问受保护模块，自动设置认证状态');
      forceAuthenticate();
    }
  }
  
  // 权限验证逻辑
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