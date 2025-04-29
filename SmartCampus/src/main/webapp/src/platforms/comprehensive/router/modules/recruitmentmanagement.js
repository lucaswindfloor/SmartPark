// 招商管理路由模块
// 定义招商管理相关路由

// 导入招商管理主视图
// 注意：路径已从 'investment' 修改为 'recruitmentmanagement'
const InvestmentIndex = () => import('../../views/recruitmentmanagement/index.vue');

const investmentRoute = {
  path: '/comprehensive/investment',
  name: 'Investment',
  component: InvestmentIndex, // 使用更新后的路径
  meta: {
    title: '招商管理',
    icon: 'fund-projection-screen-outlined',
    permission: ['investment:view']
  },
  children: [
    {
      path: 'customer',
      name: 'InvestmentCustomer',
      component: () => import('../../views/recruitmentmanagement/customer/index.vue'),
      meta: {
        title: '客户管理',
        permission: ['investment:customer:view']
      }
    },
    {
      path: 'contract',
      name: 'InvestmentContract',
      component: () => import('../../views/recruitmentmanagement/contract/index.vue'),
      meta: {
        title: '合同签约',
        permission: ['investment:contract:view']
      }
    },
    {
      path: 'intention',
      name: 'InvestmentIntention',
      component: () => import('../../views/recruitmentmanagement/intention/index.vue'),
      meta: {
        title: '意向管理',
        permission: ['investment:intention:view']
      }
    }
  ]
};

export default investmentRoute; 