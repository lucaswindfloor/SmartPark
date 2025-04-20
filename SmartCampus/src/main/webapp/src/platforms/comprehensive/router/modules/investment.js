// 招商管理路由模块
// 定义招商管理相关路由

export default {
  path: '/comprehensive/investment',
  name: 'Investment',
  component: () => import('../../views/investment/index.vue'),
  meta: {
    title: '招商管理',
    icon: 'fund-outlined',
    permission: ['investment:view']
  },
  children: [
    {
      path: 'customer',
      name: 'CustomerManagement',
      component: () => import('../../views/investment/customer/index.vue'),
      meta: {
        title: '客户管理',
        permission: ['investment:customer:view']
      }
    },
    {
      path: 'contract',
      name: 'ContractManagement',
      component: () => import('../../views/investment/contract/index.vue'),
      meta: {
        title: '合同签约',
        permission: ['investment:contract:view']
      }
    },
    {
      path: 'intention',
      name: 'IntentionManagement',
      component: () => import('../../views/investment/intention/index.vue'),
      meta: {
        title: '意向管理',
        permission: ['investment:intention:view']
      }
    }
  ]
}; 