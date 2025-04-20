// router/index.js
// 路由配置

import { createRouter, createWebHistory } from 'vue-router';
import { getToken, getUserInfo, hasPermission } from '../utils/auth';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { message } from 'ant-design-vue';

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../../pages/Login.vue'),
    meta: { 
      title: '登录', 
      requiresAuth: false 
    }
  },
  {
    path: '/',
    component: () => import('../../layouts/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { 
      requiresAuth: true 
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../../pages/Dashboard.vue'),
        meta: { 
          title: '仪表盘',
          icon: 'dashboard',
          requiresAuth: true
        }
      },
      // 信息披露子模块路由
      {
        path: 'information',
        name: 'Information',
        component: () => import('../../pages/information/Index.vue'),
        meta: {
          title: '信息披露',
          icon: 'notification',
          requiresAuth: true
        },
        redirect: '/information/notifications',
        children: [
          {
            path: 'notifications',
            name: 'Notifications',
            component: () => import('../../pages/information/Notifications.vue'),
            meta: {
              title: '通知公告',
              requiresAuth: true,
              permission: 'information:notification:view'
            }
          },
          {
            path: 'notifications/create',
            name: 'NotificationCreate',
            component: () => import('../../pages/information/NotificationForm.vue'),
            meta: {
              title: '创建通知',
              requiresAuth: true,
              permission: 'information:notification:create'
            }
          },
          {
            path: 'notifications/edit/:id',
            name: 'NotificationEdit',
            component: () => import('../../pages/information/NotificationForm.vue'),
            meta: {
              title: '编辑通知',
              requiresAuth: true,
              permission: 'information:notification:edit'
            }
          },
          {
            path: 'notifications/detail/:id',
            name: 'NotificationDetail',
            component: () => import('../../pages/information/NotificationDetail.vue'),
            meta: {
              title: '通知详情',
              requiresAuth: true,
              permission: 'information:notification:view'
            }
          },
          {
            path: 'surveys',
            name: 'Surveys',
            component: () => import('../../pages/information/Surveys.vue'),
            meta: {
              title: '问卷调查',
              requiresAuth: true,
              permission: 'information:survey:view'
            }
          },
          {
            path: 'surveys/create',
            name: 'SurveyCreate',
            component: () => import('../../pages/information/SurveyForm.vue'),
            meta: {
              title: '创建问卷',
              requiresAuth: true,
              permission: 'information:survey:create'
            }
          },
          {
            path: 'surveys/edit/:id',
            name: 'SurveyEdit',
            component: () => import('../../pages/information/SurveyForm.vue'),
            meta: {
              title: '编辑问卷',
              requiresAuth: true,
              permission: 'information:survey:edit'
            }
          },
          {
            path: 'surveys/detail/:id',
            name: 'SurveyDetail',
            component: () => import('../../pages/information/SurveyDetail.vue'),
            meta: {
              title: '问卷详情',
              requiresAuth: true,
              permission: 'information:survey:view'
            }
          },
          {
            path: 'surveys/statistics/:id',
            name: 'SurveyStatistics',
            component: () => import('../../pages/information/SurveyStatistics.vue'),
            meta: {
              title: '问卷统计',
              requiresAuth: true,
              permission: 'information:survey:view'
            }
          }
        ]
      }
    ]
  },
  // 移动端路由
  {
    path: '/mobile',
    component: () => import('../../layouts/MobileLayout.vue'),
    redirect: '/mobile/home',
    meta: { 
      requiresAuth: true 
    },
    children: [
      {
        path: 'home',
        name: 'MobileHome',
        component: () => import('../../pages/mobile/Home.vue'),
        meta: { 
          title: '首页',
          requiresAuth: true
        }
      },
      {
        path: 'notifications',
        name: 'MobileNotifications',
        component: () => import('../../pages/mobile/Notifications.vue'),
        meta: {
          title: '通知公告',
          requiresAuth: true
        }
      },
      {
        path: 'notifications/detail/:id',
        name: 'MobileNotificationDetail',
        component: () => import('../../pages/mobile/NotificationDetail.vue'),
        meta: {
          title: '通知详情',
          requiresAuth: true
        }
      },
      {
        path: 'surveys',
        name: 'MobileSurveys',
        component: () => import('../../pages/mobile/Surveys.vue'),
        meta: {
          title: '问卷调查',
          requiresAuth: true
        }
      },
      {
        path: 'surveys/detail/:id',
        name: 'MobileSurveyDetail',
        component: () => import('../../pages/mobile/SurveyDetail.vue'),
        meta: {
          title: '问卷详情',
          requiresAuth: true
        }
      }
    ]
  },
  // 错误页面
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../../pages/error/403.vue'),
    meta: {
      title: '无权限',
      requiresAuth: false
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../../pages/error/404.vue'),
    meta: {
      title: '页面不存在',
      requiresAuth: false
    }
  },
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('../../pages/error/500.vue'),
    meta: {
      title: '服务器错误',
      requiresAuth: false
    }
  },
  // 未匹配的路由重定向到404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 配置NProgress
NProgress.configure({ 
  showSpinner: false 
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 开始进度条
  NProgress.start();
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 智慧校园` : '智慧校园管理系统';
  
  // 检查是否需要登录
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // 登录路由特殊处理
  if (to.path === '/login') {
    // 已登录则跳转到首页
    if (getToken()) {
      next({ path: '/' });
      NProgress.done();
    } else {
      next();
    }
    return;
  }
  
  // 需要登录但未登录
  if (requiresAuth && !getToken()) {
    message.warning('请先登录');
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    NProgress.done();
    return;
  }
  
  // 权限检查
  if (requiresAuth && to.meta.permission && !hasPermission(to.meta.permission)) {
    message.error('您没有权限访问该页面');
    next({ path: '/403' });
    NProgress.done();
    return;
  }
  
  // 检查用户信息是否存在
  if (requiresAuth && !getUserInfo()) {
    // 获取用户信息失败，退出登录
    message.error('获取用户信息失败，请重新登录');
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    NProgress.done();
    return;
  }
  
  // 检查路由是否存在
  if (to.matched.length === 0) {
    // 未找到匹配的路由
    next('/404');
    NProgress.done();
    return;
  }
  
  // 通过所有检查，继续导航
  next();
});

// 路由后置守卫
router.afterEach(() => {
  // 结束进度条
  NProgress.done();
});

export default router; 