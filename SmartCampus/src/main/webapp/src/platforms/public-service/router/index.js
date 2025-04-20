// 公共服务平台路由配置
import { createRouter, createWebHistory } from 'vue-router';
import { getToken } from '../../../core/utils/auth';
import { message } from 'ant-design-vue';
import Layout from '../layout/Index.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/home/Index.vue'),
        meta: {
          title: '智慧校园',
          icon: 'home-outlined'
        }
      },
      // 信息公告模块 - 暂时只保留通知公告功能
      {
        path: 'information',
        name: 'Information',
        component: () => import('../views/information/Index.vue'),
        meta: {
          title: '信息公告',
          icon: 'info-circle-outlined'
        },
        children: [
          {
            path: 'notification',
            name: 'Notification',
            component: () => import('../views/information/notification/Index.vue'),
            meta: {
              title: '通知公告',
              icon: 'notification-outlined'
            }
          },
          {
            path: 'notification/:id',
            name: 'NotificationDetail',
            component: () => import('../views/information/notification/Detail.vue'),
            meta: {
              title: '通知公告详情',
              icon: 'file-text-outlined',
              hidden: true
            }
          }
          /* 暂时注释其他信息公开页面
          {
            path: 'policy',
            name: 'Policy',
            component: () => import('../views/information/policy/Index.vue'),
            meta: {
              title: '政策文件',
              icon: 'file-outlined'
            }
          },
          {
            path: 'policy/:id',
            name: 'PolicyDetail',
            component: () => import('../views/information/policy/Detail.vue'),
            meta: {
              title: '政策文件详情',
              icon: 'file-text-outlined',
              hidden: true
            }
          },
          {
            path: 'activity',
            name: 'Activity',
            component: () => import('../views/information/activity/Index.vue'),
            meta: {
              title: '园区活动',
              icon: 'calendar-outlined'
            }
          },
          {
            path: 'activity/:id',
            name: 'ActivityDetail',
            component: () => import('../views/information/activity/Detail.vue'),
            meta: {
              title: '活动详情',
              icon: 'calendar-outlined',
              hidden: true
            }
          },
          {
            path: 'survey',
            name: 'Survey',
            component: () => import('../views/information/survey/Index.vue'),
            meta: {
              title: '问卷调查',
              icon: 'form-outlined'
            }
          },
          {
            path: 'survey/:id',
            name: 'SurveyDetail',
            component: () => import('../views/information/survey/Detail.vue'),
            meta: {
              title: '问卷详情',
              icon: 'form-outlined',
              hidden: true
            }
          },
          {
            path: 'demand',
            name: 'Demand',
            component: () => import('../views/information/demand/Index.vue'),
            meta: {
              title: '需求征集',
              icon: 'inbox-outlined'
            }
          },
          {
            path: 'demand/:id',
            name: 'DemandDetail',
            component: () => import('../views/information/demand/Detail.vue'),
            meta: {
              title: '需求详情',
              icon: 'file-text-outlined',
              hidden: true
            }
          }
          */
        ]
      },
      // 错误页面
      {
        path: '/403',
        name: '403',
        component: () => import('../views/error/403.vue'),
        meta: {
          title: '无权限访问',
          hidden: true
        }
      },
      {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('../views/error/404.vue'),
        meta: {
          title: '页面不存在',
          hidden: true
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 智慧校园公共服务平台` : '智慧校园公共服务平台';
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth && !getToken()) {
    message.warning('请先登录');
    next({ 
      path: '/login', 
      query: { redirect: to.fullPath } 
    });
  } else {
    next();
  }
});

export default router; 