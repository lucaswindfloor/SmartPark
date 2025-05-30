// 工作门户路由模块
// 定义工作门户相关路由

export default {
  path: '/comprehensive/dashboard',
  name: 'Dashboard',
  component: () => import('../../views/dashboard/index.vue'),
  meta: {
    title: '工作门户',
    icon: 'dashboard-outlined',
    permission: ['dashboard:view']
  }
}; 