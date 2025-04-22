// Service Management Module Routes
// This file defines the routes for the Service Management module

export default {
  path: '/comprehensive/service',
  name: 'ServiceManagement',
  component: () => import('../../views/service/index.vue'),
  meta: {
    title: '服务管理',
    icon: 'customer-service-outlined',
    permission: ['service:view']
  },
  children: [
    // 服务事项子模块 - 展示为开发中
    {
      path: 'service-items',
      name: 'ServiceItems',
      component: () => import('../../views/service/components/UnderDevelopment.vue'),
      meta: {
        title: '服务事项',
        icon: 'profile-outlined',
        permission: ['service:items:view']
      },
      props: { title: '服务事项' }
    },
    // 服务设置子模块 - 展示为开发中
    {
      path: 'service-settings',
      name: 'ServiceSettings',
      component: () => import('../../views/service/components/UnderDevelopment.vue'),
      meta: {
        title: '服务设置',
        icon: 'setting-outlined',
        permission: ['service:settings:view']
      },
      props: { title: '服务设置' }
    },
    // 服务管理子模块 - 展示为开发中
    {
      path: 'service-mgmt',
      name: 'ServiceManagementConfig',
      component: () => import('../../views/service/service-mgmt/index.vue'),
      meta: {
        title: '服务管理',
        icon: 'control-outlined',
        permission: ['service:mgmt:view']
      },
      children: [
        // 基础配置
        {
          path: 'basic-config',
          name: 'BasicConfiguration',
          component: () => import('../../views/service/components/UnderDevelopment.vue'),
          meta: {
            title: '基础配置',
            icon: 'tool-outlined',
            permission: ['service:mgmt:basic:view']
          },
          props: { title: '基础配置' }
        },
        // 评价管理
        {
          path: 'evaluation',
          name: 'EvaluationManagement',
          component: () => import('../../views/service/service-mgmt/evaluation/index.vue'),
          meta: {
            title: '评价管理',
            icon: 'star-outlined',
            permission: ['service:mgmt:evaluation:view']
          }
        },
        // 服务指南
        {
          path: 'guide',
          name: 'ServiceGuide',
          component: () => import('../../views/service/service-mgmt/guide/index.vue'),
          meta: {
            title: '服务指南',
            icon: 'read-outlined',
            permission: ['service:mgmt:guide:view']
          }
        }
      ]
    },
    // 信息公开子模块 - 注意这是您将要完善的模块
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
              component: () => import('../../views/service/components/UnderDevelopment.vue'),
              meta: {
                title: '通知公告统计',
                icon: 'pie-chart-outlined',
                permission: ['service:information:notification:statistics'],
                hidden: true
              },
              props: { title: '通知公告统计' }
            }
          ]
        },
        // 其他信息公开页面
        // 政策文件管理
        {
          path: 'policy',
          name: 'PolicyManagement',
          component: () => import('../../views/service/components/UnderDevelopment.vue'),
          meta: {
            title: '政策文件管理',
            icon: 'file-outlined',
            permission: ['service:information:policy:view']
          },
          props: { title: '政策文件管理' }
        },
        // 活动通知管理
        {
          path: 'activity',
          name: 'ActivityManagement',
          component: () => import('../../views/service/components/UnderDevelopment.vue'),
          meta: {
            title: '活动通知管理',
            icon: 'calendar-outlined',
            permission: ['service:information:activity:view']
          },
          props: { title: '活动通知管理' }
        },
        // 问卷调查管理
        {
          path: 'survey',
          name: 'SurveyManagement',
          component: () => import('../../views/service/components/UnderDevelopment.vue'),
          meta: {
            title: '问卷调查管理',
            icon: 'form-outlined',
            permission: ['service:information:survey:view']
          },
          props: { title: '问卷调查管理' }
        },
        // 需求征集管理
        {
          path: 'demand',
          name: 'DemandManagement',
          component: () => import('../../views/service/components/UnderDevelopment.vue'),
          meta: {
            title: '需求征集管理',
            icon: 'inbox-outlined',
            permission: ['service:information:demand:view']
          },
          props: { title: '需求征集管理' }
        }
      ]
    },
    // 其他子模块 - 展示为开发中
    // 会议管理子模块
    {
      path: 'meeting',
      name: 'MeetingManagement',
      component: () => import('../../views/service/components/UnderDevelopment.vue'),
      meta: {
        title: '会议管理',
        icon: 'team-outlined',
        permission: ['service:meeting:view']
      },
      props: { title: '会议管理' }
    },
    // 空调管理子模块
    {
      path: 'ac',
      name: 'AirConditioningManagement',
      component: () => import('../../views/service/components/UnderDevelopment.vue'),
      meta: {
        title: '空调管理',
        icon: 'thunderbolt-outlined',
        permission: ['service:ac:view']
      },
      props: { title: '空调管理' }
    },
    // 门禁管理子模块
    {
      path: 'access',
      name: 'AccessControlManagement',
      component: () => import('../../views/service/components/UnderDevelopment.vue'),
      meta: {
        title: '门禁管理',
        icon: 'safety-outlined',
        permission: ['service:access:view']
      },
      props: { title: '门禁管理' }
    },
    // 停车管理子模块
    {
      path: 'parking',
      name: 'ParkingManagement',
      component: () => import('../../views/service/components/UnderDevelopment.vue'),
      meta: {
        title: '停车管理',
        icon: 'car-outlined',
        permission: ['service:parking:view']
      },
      props: { title: '停车管理' }
    },
    // 服务办理子模块
    {
      path: 'service-processing',
      name: 'ServiceProcessing',
      component: () => import('../../views/service/components/UnderDevelopment.vue'),
      meta: {
        title: '服务办理',
        icon: 'solution-outlined',
        permission: ['service:processing:view']
      },
      props: { title: '服务办理' }
    }
  ]
}; 