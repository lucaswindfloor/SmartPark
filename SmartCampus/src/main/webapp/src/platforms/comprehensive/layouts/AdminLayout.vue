<template>
  <div class="admin-layout">
    <a-layout class="layout-container">
      <!-- 头部导航 -->
      <a-layout-header class="layout-header">
        <div class="header-left">
          <div class="platform-logo">
            <div class="logo-icon">
              <dashboard-outlined />
            </div>
            <h2 class="platform-title">湘江科创基地智慧园区</h2>
          </div>
          <div class="toggle-sidebar collapse-button" @click="collapsed = !collapsed">
            <menu-unfold-outlined v-if="collapsed" />
            <menu-fold-outlined v-else />
          </div>
        </div>
        <div class="header-tabs">
          <a-tabs v-model:activeKey="activeTopTab" @change="handleTabClick">
            <a-tab-pane v-for="item in topTabItems" :key="item.key">
              <template #tab>
                <span class="tab-text">{{ item.label }}</span>
              </template>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div class="header-right">
          <a-space :size="16">
            <a-badge count="5" class="notification-badge">
              <div class="header-action-button">
                <bell-outlined style="color: white; font-size: 18px;" />
              </div>
            </a-badge>
            <a-dropdown>
              <div class="user-profile">
                <a-avatar class="user-avatar">
                  <template #icon><user-outlined /></template>
                </a-avatar>
                <div class="user-info">
                  <span class="user-name">管理员</span>
                </div>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <user-outlined /> 个人信息
                  </a-menu-item>
                  <a-menu-item key="settings">
                    <setting-outlined /> 系统设置
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <logout-outlined /> 退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-layout-header>

      <a-layout>
        <!-- 侧边栏导航 -->
        <a-layout-sider
          v-model:collapsed="collapsed"
          :width="200"
          collapsible
          theme="dark"
          class="site-sidebar"
        >
          <a-menu 
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            theme="dark"
            class="side-menu"
            @click="handleMenuClick"
          >
            <template v-if="activeTopTab === 'dashboard'">
              <a-menu-item key="dashboard">
                <template #icon><dashboard-outlined /></template>
                工作门户
              </a-menu-item>
            </template>
            
            <!-- 投资管理菜单 -->
            <template v-if="activeTopTab === 'investment'">
              <a-sub-menu key="customer-management">
                <template #icon><user-outlined /></template>
                <template #title>客户管理</template>
                <a-menu-item key="intention">意向登记</a-menu-item>
                <a-menu-item key="customer-archive">客户档案</a-menu-item>
                <a-menu-item key="customer-follow">客户跟进</a-menu-item>
              </a-sub-menu>
              
              <a-sub-menu key="channel-management">
                <template #icon><team-outlined /></template>
                <template #title>渠道管理</template>
                <a-menu-item key="channel-unit">渠道单位</a-menu-item>
                <a-menu-item key="broker-management">经纪人管理</a-menu-item>
              </a-sub-menu>
              
              <a-sub-menu key="property-management">
                <template #icon><home-outlined /></template>
                <template #title>房源管理</template>
                <a-menu-item key="area-management">片区管理</a-menu-item>
                <a-menu-item key="building-management">楼栋管理</a-menu-item>
                <a-menu-item key="floor-management">楼层管理</a-menu-item>
                <a-menu-item key="room-management">房间管理</a-menu-item>
                <a-menu-item key="workstation-management">工位管理</a-menu-item>
                <a-menu-item key="rental-pricing">租金定价</a-menu-item>
              </a-sub-menu>
              
              <a-sub-menu key="contract-management">
                <template #icon><file-text-outlined /></template>
                <template #title>合同管理</template>
                <a-menu-item key="rental-contract">租赁合同</a-menu-item>
                <a-menu-item key="property-contract">物业合同</a-menu-item>
                <a-menu-item key="incubation-agreement">入孵协议</a-menu-item>
                <a-menu-item key="registration-contract">注册合同</a-menu-item>
              </a-sub-menu>
              
              <a-sub-menu key="enterprise-entry">
                <template #icon><shop-outlined /></template>
                <template #title>企业入驻</template>
                <a-menu-item key="entry-application">入驻申请</a-menu-item>
              </a-sub-menu>
              
              <a-sub-menu key="base-settings">
                <template #icon><setting-outlined /></template>
                <template #title>基础设置</template>
                <a-menu-item key="channel-type">渠道类型</a-menu-item>
                <a-menu-item key="enterprise-type">企业类型</a-menu-item>
                <a-menu-item key="industry-type">行业类型</a-menu-item>
                <a-menu-item key="intention-delete-reason">意向删除原因</a-menu-item>
                <a-menu-item key="customer-source">客户来源</a-menu-item>
                <a-menu-item key="investment-settings">招商设置</a-menu-item>
              </a-sub-menu>
            </template>
            
            <!-- 运营管理菜单 -->
            <template v-if="activeTopTab === 'operations'">
              <a-sub-menu key="contract">
                <template #icon><file-text-outlined /></template>
                <template #title>合同管理</template>
                <a-menu-item key="contract">合同列表</a-menu-item>
                <a-menu-item key="sales-contract" disabled>销售合同</a-menu-item>
              </a-sub-menu>
              <!-- 更多运营管理菜单项... -->
            </template>
            
            <!-- 财务管理菜单 -->
            <template v-if="activeTopTab === 'finance'">
              <a-sub-menu key="bill-management">
                <template #icon><account-book-outlined /></template>
                <template #title>账单管理</template>
                <a-menu-item key="bill">账单列表</a-menu-item>
              </a-sub-menu>
              <!-- 更多财务管理菜单项... -->
            </template>
            
            <!-- 服务管理菜单 -->
            <template v-if="activeTopTab === 'service'">
              <!-- 服务事项 -->
              <a-menu-item key="ServiceItems">
                <template #icon><unordered-list-outlined /></template>
                服务事项
              </a-menu-item>
              <!-- 服务设置 -->
              <a-menu-item key="ServiceSettings">
                <template #icon><setting-outlined /></template>
                服务设置
              </a-menu-item>
              <!-- 服务管理配置 -->
              <a-sub-menu key="ServiceManagementConfig">
                <template #icon><control-outlined /></template>
                <template #title>服务管理配置</template>
                <a-menu-item key="BasicConfiguration">基础配置</a-menu-item>
                <a-menu-item key="EvaluationManagement">评价管理</a-menu-item>
                <a-menu-item key="ServiceGuide">服务指南</a-menu-item>
              </a-sub-menu>
              <!-- 信息发布管理 -->
              <a-sub-menu key="InformationDisclosure">
                <template #icon><notification-outlined /></template>
                <template #title>信息公开</template> 
                <a-menu-item key="AnnouncementList">通知公告</a-menu-item>
                <a-menu-item key="PolicyManagement">政策文件</a-menu-item>
                <a-menu-item key="ActivityManagement">园区活动</a-menu-item>
                <a-menu-item key="SurveyManagement">问卷调查</a-menu-item>
                <a-menu-item key="DemandPublishing">需求发布</a-menu-item>
              </a-sub-menu>
              <!-- 会议管理 -->
              <a-menu-item key="MeetingManagement">
                <template #icon><team-outlined /></template>
                会议管理
              </a-menu-item>
              <!-- 空调管理 -->
              <a-menu-item key="AirConditioningManagement">
                <template #icon><thunderbolt-outlined /></template>
                空调管理
              </a-menu-item>
              <!-- 门禁管理 -->
              <a-menu-item key="AccessControlManagement">
                <template #icon><safety-outlined /></template>
                门禁管理
              </a-menu-item>
              <!-- 停车管理 -->
              <a-menu-item key="ParkingManagement">
                <template #icon><car-outlined /></template>
                停车管理
              </a-menu-item>
              <!-- 服务办理 -->
              <a-menu-item key="ServiceProcessing">
                <template #icon><solution-outlined /></template>
                服务办理
              </a-menu-item>
            </template>
          </a-menu>
        </a-layout-sider>
        
        <!-- 内容区域 -->
        <a-layout-content class="site-content" :style="{ marginLeft: collapsed ? '80px' : '200px' }">
          <div class="content-container">
            <router-view />
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  ShopOutlined,
  BankOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  HomeOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  ToolOutlined,
  PieChartOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  AccountBookOutlined,
  DollarOutlined,
  NotificationOutlined,
  UnorderedListOutlined,
  ControlOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  CarOutlined,
  SolutionOutlined,
} from '@ant-design/icons-vue';
import { isLoggedIn as isAuthenticated, logout } from '../../../core/utils/auth';

const router = useRouter();
const route = useRoute();

// 定义顶部选项卡菜单
const topTabItems = [
  {
    key: 'dashboard',
    label: '工作门户',
    icon: DashboardOutlined,
  },
  {
    key: 'investment',
    label: '招商管理',
    icon: ShopOutlined,
  },
  {
    key: 'operations',
    label: '运营管理',
    icon: BankOutlined,
  },
  {
    key: 'finance',
    label: '财务管理',
    icon: DatabaseOutlined,
  },
  {
    key: 'asset',
    label: '资产管理',
    icon: HomeOutlined,
  },
  {
    key: 'service',
    label: '服务管理',
    icon: ToolOutlined,
  },
  {
    key: 'statistics',
    label: '综合统计',
    icon: PieChartOutlined,
  },
  {
    key: 'more',
    label: '更多',
    icon: EllipsisOutlined,
  },
];

// 状态定义
const collapsed = ref(false);
const activeTopTab = ref('dashboard');
const openKeys = ref([]);
const selectedKeys = ref(['dashboard']);

// 处理Tab点击
const handleTabClick = (key) => {
  console.log('Tab点击:', key);
  
  // 检查认证状态 (不再强制认证)
  // if (!isAuthenticated()) {
  //   console.warn('用户未登录，不再自动设置认证状态');
  // }
  
  // 不再输出认证诊断信息
  
  activeTopTab.value = key;
  
  // 根据不同的Tab重置侧边栏状态
  switch (key) {
    case 'dashboard':
      selectedKeys.value = ['dashboard'];
      openKeys.value = [];
      router.push('/comprehensive/dashboard');
      break;
    case 'investment':
      openKeys.value = ['customer-management'];
      selectedKeys.value = ['intention'];
      router.push('/comprehensive/investment/intention');
      break;
    case 'operations':
      openKeys.value = ['contract'];
      selectedKeys.value = ['contract'];
      router.push('/comprehensive/operations/contract');
      break;
    case 'finance':
      openKeys.value = ['bill-management'];
      selectedKeys.value = ['bill'];
      router.push('/comprehensive/finance/bill');
      break;
    case 'service':
      // Navigate to the default/initial service page (e.g., AnnouncementList)
      openKeys.value = ['InformationDisclosure']; // Ensure the parent sub-menu is open
      selectedKeys.value = ['AnnouncementList']; // Select the default item
      router.push({ name: 'AnnouncementList' }); // Navigate to the default item
      break;
    // 更多case分支...
  }
};

// 处理菜单点击
const handleMenuClick = ({ key }) => {
  console.log('菜单点击:', key);
  selectedKeys.value = [key];
  
  // 基于当前activeTab和选中的menu key确定路由
  switch (activeTopTab.value) {
    case 'dashboard':
      router.push('/comprehensive/dashboard');
      break;
    case 'investment':
      if (key === 'intention') {
        router.push('/comprehensive/investment/intention');
      } else {
        // 其他投资管理的路由...
        console.log('其他投资管理路由, key:', key);
      }
      break;
    case 'operations':
      if (key === 'contract') {
        router.push('/comprehensive/operations/contract');
      } else {
        // 其他运营管理的路由...
        console.log('其他运营管理路由, key:', key);
      }
      break;
    case 'service':
      // --- Navigate by route name based on menu key ---
      const validServiceKeys = [
        'ServiceItems', 'ServiceSettings', 
        'BasicConfiguration', 'EvaluationManagement', 'ServiceGuide',
        'AnnouncementList', 'PolicyManagement', 'ActivityManagement', 'SurveyManagement', 'DemandPublishing',
        'MeetingManagement', 'AirConditioningManagement', 'AccessControlManagement',
        'ParkingManagement', 'ServiceProcessing'
      ];
      if (validServiceKeys.includes(key)) {
        router.push({ name: key });
      } else {
        console.warn('Unhandled service menu key:', key);
        // Optionally navigate to a default service page or show an error
        router.push({ name: 'ServiceManagement' }); // Fallback to parent route maybe?
      }
      break;
    case 'finance':
      if (key === 'bill') {
        router.push('/comprehensive/finance/bill');
      } else {
        // 其他财务管理的路由...
        console.log('其他财务管理路由, key:', key);
      }
      break;
    // 更多case分支...
  }
};

// 处理退出登录
const handleLogout = () => {
  logout(); // 先调用登出函数，清除认证信息
  router.push('/comprehensive/login');
};

// 初始化激活状态
const initFromRoute = () => {
  const path = route.path;
  console.log('当前路径:', path);
  
  if (path.includes('/dashboard')) {
    activeTopTab.value = 'dashboard';
    selectedKeys.value = ['dashboard'];
    openKeys.value = [];
  } else if (path.includes('/investment')) {
    activeTopTab.value = 'investment';
    if (path.includes('/intention')) {
      selectedKeys.value = ['intention'];
      openKeys.value = ['customer-management'];
    } 
    // 其他投资管理相关路径...
  } else if (path.includes('/operations')) {
    activeTopTab.value = 'operations';
    if (path.includes('/contract')) {
      selectedKeys.value = ['contract'];
      openKeys.value = ['contract'];
    }
    // 其他运营管理相关路径...
  } else if (path.includes('/finance')) {
    activeTopTab.value = 'finance';
    if (path.includes('/bill')) {
      selectedKeys.value = ['bill'];
      openKeys.value = ['bill-management'];
    }
    // 其他财务管理相关路径...
  } else if (path.includes('/servicemanagement')) {
    activeTopTab.value = 'service';
    // Check the full path to determine selected/open keys
    if (path.includes('/informationdisclosure')) {
      openKeys.value = ['InformationDisclosure']; // Match the sub-menu key
      if (path.endsWith('/list')) { // Check for the specific list path
        selectedKeys.value = ['AnnouncementList']; // Match the menu item key (route name)
      } else if (path.includes('/policy')) {
        selectedKeys.value = ['PolicyManagement']; // Match the menu item key (route name)
      } else if (path.includes('/activity')) {
        selectedKeys.value = ['ActivityManagement']; // Match the menu item key (route name)
      } else if (path.includes('/survey')) {
        selectedKeys.value = ['SurveyManagement']; // Match the menu item key (route name)
      } else if (path.includes('/demand')) {
        selectedKeys.value = ['DemandPublishing']; // Match the menu item key (route name)
      }
    } else if (path.includes('/service-items')) {
      selectedKeys.value = ['ServiceItems'];
      openKeys.value = [];
    } else if (path.includes('/service-settings')) {
      selectedKeys.value = ['ServiceSettings'];
      openKeys.value = [];
    } else if (path.includes('/service-mgmt')) {
      openKeys.value = ['ServiceManagementConfig'];
      if (path.includes('/basic-config')) {
        selectedKeys.value = ['BasicConfiguration'];
      } else if (path.includes('/evaluation')) {
        selectedKeys.value = ['EvaluationManagement'];
      } else if (path.includes('/guide')) {
        selectedKeys.value = ['ServiceGuide'];
      }
    } else if (path.includes('/meeting')) {
      selectedKeys.value = ['MeetingManagement'];
      openKeys.value = [];
    } else if (path.includes('/ac')) {
      selectedKeys.value = ['AirConditioningManagement'];
      openKeys.value = [];
    } else if (path.includes('/access')) {
      selectedKeys.value = ['AccessControlManagement'];
      openKeys.value = [];
    } else if (path.includes('/parking')) {
      selectedKeys.value = ['ParkingManagement'];
      openKeys.value = [];
    } else if (path.includes('/service-processing')) {
      selectedKeys.value = ['ServiceProcessing'];
      openKeys.value = [];
    } else {
      // Fallback if no specific sub-route matches
      selectedKeys.value = [];
      openKeys.value = [];
    }
  }
};

// 监听路由变化
watch(() => route.path, initFromRoute);

// 组件挂载时初始化
initFromRoute();
</script>

<style>
:root {
  --primary-color: #2E6AE6;
  --secondary-color: #4CBBFF;
  --dark-bg: #0F2645;
  --light-bg: #f6f8fd;
  --header-height: 72px;
  --border-radius-lg: 12px;
  --border-radius-sm: 8px;
  --box-shadow: 0 8px 24px rgba(15, 38, 69, 0.12);
  --transition-normal: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>

<style lang="less" scoped>
.admin-layout {
  width: 100%;
  height: 100vh;
  background: var(--light-bg);
  position: relative;
}

.layout-container {
  height: 100%;
}

.layout-header {
  display: flex;
  align-items: center;
  background: var(--dark-bg);
  background-image: linear-gradient(90deg, #0F2645 0%, #1A3A67 100%);
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  height: var(--header-height);
  line-height: var(--header-height);
  position: relative;
  overflow: hidden;
}

.layout-header::before {
  content: '';
  position: absolute;
  top: -60%;
  right: -10%;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(76, 187, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none;
}

.layout-header::after {
  content: '';
  position: absolute;
  bottom: -70%;
  left: 30%;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(46, 106, 230, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none;
}

.header-left {
  display: flex;
  align-items: center;
  padding-left: 24px;
  z-index: 1;
}

.platform-logo {
  display: flex;
  align-items: center;
  margin-right: 24px;
  position: relative;
  z-index: 1;
}

.logo-icon {
  font-size: 28px;
  color: var(--secondary-color);
  margin-right: 10px;
  background: rgba(76, 187, 255, 0.15);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.platform-title {
  margin: 0;
  color: white;
  white-space: nowrap;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #FFFFFF 0%, #D0E6FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.toggle-sidebar {
  margin-left: 16px;
  font-size: 18px;
  cursor: pointer;
  color: white;
  transition: var(--transition-normal);
}

.collapse-button {
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--border-radius-sm);
  backdrop-filter: blur(8px);
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
}

.collapse-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.header-tabs {
  flex: 1;
  margin-left: 20px;
}

:deep(.ant-tabs) {
  height: var(--header-height);
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
  height: var(--header-height);
}

:deep(.ant-tabs-tab) {
  padding: 0 20px !important;
  font-size: 16px;
  transition: background-color 0.3s;
  margin: 0 !important;
  color: rgba(255, 255, 255, 0.85) !important;
}

:deep(.ant-tabs-tab-active) {
  font-weight: 500;
  color: white !important;
}

:deep(.ant-tabs-tab-btn) {
  display: flex;
  align-items: center;
}

:deep(.ant-tabs-nav::before) {
  border-bottom: none !important;
}

:deep(.ant-tabs-ink-bar) {
  height: 3px !important;
  background-color: var(--secondary-color) !important;
}

.tab-text {
  margin-left: 0;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  padding-right: 24px;
  z-index: 1;
}

.header-action-button {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  padding: 12px;
  height: 46px;
  width: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
  border-radius: var(--border-radius-sm);
  backdrop-filter: blur(8px);
  cursor: pointer;
}

.header-action-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.notification-badge :deep(.ant-badge-count) {
  background-color: #FF4D4F;
  box-shadow: 0 0 0 2px var(--dark-bg);
  font-weight: bold;
}

.user-profile {
  cursor: pointer;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  padding: 6px 10px 6px 6px;
  border-radius: 50px;
  backdrop-filter: blur(8px);
  transition: var(--transition-normal);
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.15);
}

.user-avatar {
  background-color: var(--secondary-color) !important;
  color: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  font-size: 18px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.user-name {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
}

.site-sidebar {
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  position: fixed;
  z-index: 10;
  background: #0F2645;
  background-image: linear-gradient(180deg, #0F2645 0%, #1A3A67 100%);
  border-right: none;
  margin-top: 0;
  height: calc(100vh - var(--header-height));
  left: 0;
  overflow: auto;
  transition: var(--transition-normal);
}

.side-menu {
  border-right: 0;
  padding: 16px 8px;
  background: transparent;
  font-weight: 500;
  height: 100%;
}

:deep(.ant-menu-dark) {
  background: transparent;
}

:deep(.ant-menu-dark .ant-menu-inline.ant-menu-sub) {
  background: rgba(0, 0, 0, 0.2);
}

:deep(.ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal) .ant-menu-item-selected) {
  background-color: var(--primary-color);
}

.site-content {
  transition: margin-left 0.2s;
  background: #f0f2f5;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.content-container {
  padding: 24px;
  background: #fff;
  min-height: 360px;
  flex: 1;
}

.content-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 