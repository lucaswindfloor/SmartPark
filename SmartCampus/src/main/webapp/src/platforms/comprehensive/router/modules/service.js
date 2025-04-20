// Service Management Module Routes
// This file defines the routes for the Service Management module

export default {
  path: '/service',
  name: 'ServiceManagement',
  component: () => import('../../views/service/index.vue'),
  meta: {
    title: '服务管理',
    icon: 'customer-service-outlined',
    permission: ['service:view']
  },
  children: [
    // 信息公开子模块
    {
      path: 'information',
      name: 'InformationDisclosure',
      component: () => import('../../views/service/information/index.vue'),
      meta: {
        title: '信息公开',
        icon: 'info-circle-outlined',
        permission: ['service:information:view']
      },
      children: [
        // 通知公告管理
        {
          path: 'notification',
          name: 'NotificationManagement',
          component: () => import('../../views/service/information/notification/index.vue'),
          meta: {
            title: '通知公告管理',
            icon: 'notification-outlined',
            permission: ['service:information:notification:view']
          },
          children: [
            {
              path: 'list',
              name: 'NotificationList',
              component: () => import('../../views/service/information/notification/List.vue'),
              meta: {
                title: '通知公告列表',
                icon: 'unordered-list-outlined',
                permission: ['service:information:notification:list']
              }
            },
            {
              path: 'create',
              name: 'CreateNotification',
              component: () => import('../../views/service/information/notification/Form.vue'),
              meta: {
                title: '创建通知公告',
                icon: 'form-outlined',
                permission: ['service:information:notification:create'],
                hidden: true
              }
            },
            {
              path: 'edit/:id',
              name: 'EditNotification',
              component: () => import('../../views/service/information/notification/Form.vue'),
              meta: {
                title: '编辑通知公告',
                icon: 'edit-outlined',
                permission: ['service:information:notification:edit'],
                hidden: true
              }
            },
            {
              path: 'detail/:id',
              name: 'NotificationDetail',
              component: () => import('../../views/service/information/notification/Detail.vue'),
              meta: {
                title: '通知公告详情',
                icon: 'file-text-outlined',
                permission: ['service:information:notification:detail'],
                hidden: true
              }
            },
            {
              path: 'statistics/:id',
              name: 'NotificationStatistics',
              component: () => import('../../views/service/information/notification/Statistics.vue'),
              meta: {
                title: '通知公告统计',
                icon: 'pie-chart-outlined',
                permission: ['service:information:notification:statistics'],
                hidden: true
              }
            }
          ]
        }
        // 其他信息公开页面暂时被注释掉
        /*
        // 政策文件管理
        {
          path: 'policy',
          name: 'PolicyManagement',
          component: () => import('../../views/service/information/policy/index.vue'),
          meta: {
            title: '政策文件管理',
            icon: 'file-outlined',
            permission: ['service:information:policy:view']
          }
        },
        // 活动通知管理
        {
          path: 'activity',
          name: 'ActivityManagement',
          component: () => import('../../views/service/information/activity/index.vue'),
          meta: {
            title: '活动通知管理',
            icon: 'calendar-outlined',
            permission: ['service:information:activity:view']
          }
        },
        // 问卷调查管理
        {
          path: 'survey',
          name: 'SurveyManagement',
          component: () => import('../../views/service/information/survey/index.vue'),
          meta: {
            title: '问卷调查管理',
            icon: 'form-outlined',
            permission: ['service:information:survey:view']
          }
        },
        // 需求征集管理
        {
          path: 'demand',
          name: 'DemandManagement',
          component: () => import('../../views/service/information/demand/index.vue'),
          meta: {
            title: '需求征集管理',
            icon: 'inbox-outlined',
            permission: ['service:information:demand:view']
          }
        }
        */
      ]
    },
    // 工单管理子模块
    {
      path: 'workorder',
      name: 'WorkOrderManagement',
      component: () => import('../../views/service/workorder/index.vue'),
      meta: {
        title: '工单管理',
        icon: 'solution-outlined',
        permission: ['service:workorder:view']
      }
    },
    // 服务评价子模块
    {
      path: 'evaluation',
      name: 'ServiceEvaluation',
      component: () => import('../../views/service/evaluation/index.vue'),
      meta: {
        title: '服务评价',
        icon: 'star-outlined',
        permission: ['service:evaluation:view']
      }
    }
  ]
}; 