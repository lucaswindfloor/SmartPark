// Service Management Module Routes
// This file defines the routes for the Service Management module

const serviceRoutes = [
  {
    path: '/service',
    name: 'ServiceManagement',
    component: () => import('../../views/service/ServiceManagement.vue'),
    meta: {
      title: '服务管理',
      icon: 'CustomerServiceOutlined',
      permissions: ['service:view']
    },
    children: [
      // Information disclosure routes
      {
        path: 'information',
        name: 'InformationDisclosure',
        component: () => import('../../views/service/information/InformationManagement.vue'),
        meta: {
          title: '信息发布管理',
          icon: 'ProfileOutlined',
          permissions: ['service:information:view']
        },
        children: [
          {
            path: 'notification',
            name: 'NotificationManagement',
            component: () => import('../../views/service/information/notification/NotificationList.vue'),
            meta: {
              title: '通知公告',
              icon: 'NotificationOutlined',
              permissions: ['service:information:notification:view']
            }
          },
          {
            path: 'notification/create',
            name: 'CreateNotification',
            component: () => import('../../views/service/information/notification/NotificationForm.vue'),
            meta: {
              title: '创建通知公告',
              hideInMenu: true,
              permissions: ['service:information:notification:create']
            }
          },
          {
            path: 'notification/edit/:id',
            name: 'EditNotification',
            component: () => import('../../views/service/information/notification/NotificationForm.vue'),
            meta: {
              title: '编辑通知公告',
              hideInMenu: true,
              permissions: ['service:information:notification:edit']
            }
          },
          {
            path: 'notification/detail/:id',
            name: 'NotificationDetail',
            component: () => import('../../views/service/information/notification/NotificationDetail.vue'),
            meta: {
              title: '通知公告详情',
              hideInMenu: true,
              permissions: ['service:information:notification:view']
            }
          },
          {
            path: 'policy',
            name: 'PolicyManagement',
            component: () => import('../../views/service/information/policy/PolicyList.vue'),
            meta: {
              title: '政策文件',
              icon: 'FileTextOutlined',
              permissions: ['service:information:policy:view']
            }
          },
          {
            path: 'activity',
            name: 'ActivityManagement',
            component: () => import('../../views/service/information/activity/ActivityList.vue'),
            meta: {
              title: '园区活动',
              icon: 'CalendarOutlined',
              permissions: ['service:information:activity:view']
            }
          },
          {
            path: 'survey',
            name: 'SurveyManagement',
            component: () => import('../../views/service/information/survey/SurveyList.vue'),
            meta: {
              title: '问卷调查',
              icon: 'FormOutlined',
              permissions: ['service:information:survey:view']
            }
          },
          {
            path: 'demand',
            name: 'DemandManagement',
            component: () => import('../../views/service/information/demand/DemandList.vue'),
            meta: {
              title: '需求发布',
              icon: 'BulbOutlined',
              permissions: ['service:information:demand:view']
            }
          }
        ]
      },
      // Work order management routes
      {
        path: 'workorder',
        name: 'WorkOrderManagement',
        component: () => import('../../views/service/workorder/WorkOrderManagement.vue'),
        meta: {
          title: '工单管理',
          icon: 'ToolOutlined',
          permissions: ['service:workorder:view']
        }
      },
      // Service evaluation routes
      {
        path: 'evaluation',
        name: 'ServiceEvaluation',
        component: () => import('../../views/service/evaluation/EvaluationManagement.vue'),
        meta: {
          title: '服务评价',
          icon: 'StarOutlined',
          permissions: ['service:evaluation:view']
        }
      }
    ]
  }
];

export default serviceRoutes; 