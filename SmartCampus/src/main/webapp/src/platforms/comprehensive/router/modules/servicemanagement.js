// Service Management Module Routes
// This file defines the routes for the Service Management module

// 导入主视图组件，如果存在
// 注意：路径已从 'service' 修改为 'servicemanagement'
const ServiceIndex = () => import('../../views/servicemanagement/index.vue');
// Import the new layout component
const InformationDisclosureLayout = () => import('../../views/servicemanagement/informationdisclosure/Layout.vue');

const serviceRoute = {
  path: '/comprehensive/servicemanagement',
  name: 'ServiceManagement',
  component: ServiceIndex,
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
      component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
      meta: {
        title: '服务事项',
        icon: 'unordered-list-outlined',
        permission: ['service:items:view']
      }
    },
    // 服务设置子模块 - 展示为开发中
    {
      path: 'service-settings',
      name: 'ServiceSettings',
      component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
      meta: {
        title: '服务设置',
        icon: 'setting-outlined',
        permission: ['service:settings:view']
      }
    },
    // 服务管理子模块 - 展示为开发中
    {
      path: 'service-mgmt',
      name: 'ServiceManagementConfig',
      component: () => import('../../views/servicemanagement/service-mgmt/index.vue'),
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
          component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
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
          component: () => import('../../views/servicemanagement/service-mgmt/evaluation/index.vue'),
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
          component: () => import('../../views/servicemanagement/service-mgmt/guide/index.vue'),
          meta: {
            title: '服务指南',
            icon: 'read-outlined',
            permission: ['service:mgmt:guide:view']
          }
        }
      ]
    },
    // 信息公开子模块
    {
      path: 'informationdisclosure',
      name: 'InformationDisclosure',
      // Use the imported Layout component instead of inline template
      component: InformationDisclosureLayout,
      redirect: { name: 'AnnouncementList' },
      meta: {
        title: '信息公开',
        icon: 'notification-outlined',
        permission: ['information:view']
      },
      children: [
        // 通知公告管理
        {
          path: 'list',
          name: 'AnnouncementList',
          component: () => import('../../views/servicemanagement/informationdisclosure/announcement/List.vue'),
          meta: {
            title: '通知公告列表',
            permission: ['announcement:list']
          },
        },
        // 其他信息公开页面
        // 政策文件管理
        {
          path: 'policy',
          name: 'PolicyManagement',
          component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
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
          component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
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
          component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
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
          name: 'DemandPublishing',
          component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
          meta: {
            title: '需求发布',
            permission: ['demand:publish']
          }
        }
      ]
    },
    // 其他子模块 - 展示为开发中
    // 会议管理子模块
    {
      path: 'meeting',
      name: 'MeetingManagement',
      component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
      meta: {
        title: '会议管理',
        icon: 'team-outlined',
        permission: ['meeting:view']
      }
    },
    // 空调管理子模块
    {
      path: 'ac',
      name: 'AirConditioningManagement',
      component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
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
      component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
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
      component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
      meta: {
        title: '停车管理',
        icon: 'car-outlined',
        permission: ['parking:view']
      }
    },
    // 服务办理子模块
    {
      path: 'service-processing',
      name: 'ServiceProcessing',
      component: () => import('../../views/servicemanagement/components/UnderDevelopment.vue'),
      meta: {
        title: '服务办理',
        icon: 'solution-outlined',
        permission: ['service:processing:view']
      },
      props: { title: '服务办理' }
    }
  ]
};

export default serviceRoute; 