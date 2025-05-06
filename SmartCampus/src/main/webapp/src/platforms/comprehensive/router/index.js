// 综合管理平台路由配置
import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn as isAuthenticated, /* getAuthDiagnostics, */ clearAuth, getToken } from '../../../core/utils/auth';
import { useAuthStore } from '../../../core/stores/auth'; // Import the actual store hook

// 导入路由模块
import dashboardRoute from './modules/dashboard';
import servicemanagementRoute from './modules/servicemanagement';
import recruitmentmanagementRoute from './modules/recruitmentmanagement';

// 导入布局组件
import AdminLayout from '../layouts/AdminLayout.vue';
// --- REMOVE: Static Import for Login --- 
// import LoginView from '../views/login/index.vue';

// 为调试打印路由模块
console.log('Dashboard路由:', dashboardRoute);
console.log('Service路由:', servicemanagementRoute);
console.log('Recruitment路由:', recruitmentmanagementRoute);

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // --- ADD: Route for the HTML entry point itself --- 
    {
      path: '/comprehensive.html', // Match the actual HTML file path
      redirect: '/comprehensive/login', // Redirect to the default login route
    },
    // 登录页面，不使用布局
    {
      path: '/comprehensive/login',
      name: 'Login',
      // --- CHANGE: Use dynamic import --- 
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
router.beforeEach(async (to, from, next) => { // Make the guard async
  console.log('综合平台路由守卫触发:', {
    to: to.fullPath,
    from: from.fullPath,
    requiresAuth: to.meta.requiresAuth,
    permissions: to.meta.permission // Log required permissions
  });

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 综合管理平台`;
  }

  // 获取认证状态
  const authenticated = isAuthenticated();
  const tokenValue = getToken();
  console.log('认证状态 (isAuthenticated):', authenticated);
  console.log('Token 值 (getToken):', tokenValue);

  // --- Permission Check Logic ---
  if (to.meta.requiresAuth) {
    if (!authenticated) {
      // Needs auth, but not logged in -> Redirect to login
      console.warn('访问受限路径需要登录:', to.fullPath);
      next({ path: '/comprehensive/login', query: { redirect: to.fullPath } }); // Pass redirect query
    } else {
      // Logged in, now check permissions
      const authStore = useAuthStore();

      // Ensure user info (including permissions) is loaded if not already present
      // This might happen on a page refresh where the token exists but the store state isn't fully hydrated yet
      if (!authStore.currentUser && authStore.token) {
         try {
           console.log('用户信息未加载，尝试从后端获取...');
           await authStore.fetchUserInfo();
           console.log('用户信息获取成功:', authStore.currentUser);
         } catch (error) {
           console.error('获取用户信息失败，可能Token无效，将重定向到登录:', error);
           clearAuth(); // Clear potentially invalid token
           next({ path: '/comprehensive/login', query: { redirect: to.fullPath } });
           return; // Stop further processing
         }
      }

      const requiredPermissions = to.meta.permission; // Can be string or array
      console.log('需要的权限:', requiredPermissions);
      console.log('用户拥有的权限:', authStore.permissions);

      if (requiredPermissions && requiredPermissions.length > 0) {
         let hasAccess = false;
         if (Array.isArray(requiredPermissions)) {
            // Check if user has AT LEAST ONE of the required permissions
            hasAccess = requiredPermissions.some(p => authStore.hasPermission(p));
            // OR: Check if user has ALL required permissions
            // hasAccess = requiredPermissions.every(p => authStore.hasPermission(p));
         } else {
            // Single permission string
            hasAccess = authStore.hasPermission(requiredPermissions);
         }

         if (!hasAccess) {
            // Logged in, but lacks necessary permissions
            console.warn(`用户 ${authStore.currentUser?.username} 权限不足，无法访问:`, to.fullPath, '需要:', requiredPermissions);
            // Redirect to a 'Forbidden' page or show an error message
            // For simplicity, redirecting back to dashboard or showing alert
            // next({ name: 'Forbidden' }); // If you have a Forbidden page
            alert('您没有访问此页面的权限。'); // Simple alert for now
            next(from.fullPath || '/comprehensive/dashboard'); // Go back or to dashboard
            return; // Stop execution
         } else {
            console.log('权限检查通过');
            next(); // Has permissions, proceed
         }
      } else {
         console.log('路由不需要特定权限或权限未定义');
         next(); // Requires auth, but no specific permissions defined for this route
      }
    }
  } else {
    // Route does not require authentication
    console.log('路由不需要认证，允许导航');
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