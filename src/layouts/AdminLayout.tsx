import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Tabs, theme, Typography, Space } from 'antd';
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
  RobotOutlined,
  FileTextOutlined,
  MenuOutlined,
  FileSearchOutlined,
  WalletOutlined,
  AccountBookOutlined,
  DollarOutlined,
  StarOutlined,
  NotificationOutlined,
  KeyOutlined,
  CarOutlined,
  FormOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// 定义顶部选项卡菜单
const topTabItems = [
  {
    key: 'dashboard',
    label: '工作门户',
    icon: <DashboardOutlined />,
  },
  {
    key: 'investment',
    label: '招商管理',
    icon: <ShopOutlined />,
  },
  {
    key: 'operations',
    label: '运营管理',
    icon: <BankOutlined />,
  },
  {
    key: 'finance',
    label: '财务管理',
    icon: <DatabaseOutlined />,
  },
  {
    key: 'asset',
    label: '资产管理',
    icon: <HomeOutlined />,
  },
  {
    key: 'service',
    label: '服务管理',
    icon: <ToolOutlined />,
  },
  {
    key: 'statistics',
    label: '综合统计',
    icon: <PieChartOutlined />,
  },
  {
    key: 'more',
    label: '更多',
    icon: <EllipsisOutlined />,
  },
];

// 投资管理左侧菜单项
const getInvestmentMenuItems = (): MenuProps['items'] => {
  return [
    {
      key: 'customer-management',
      label: '客户管理',
      icon: <UserOutlined />,
      children: [
        { key: 'intention', label: '意向登记' },
        { key: 'customer-archive', label: '客户档案' },
        { key: 'customer-follow', label: '客户跟进' },
      ],
    },
    {
      key: 'channel-management',
      label: '渠道管理',
      icon: <TeamOutlined />,
      children: [
        { key: 'channel-unit', label: '渠道单位' },
        { key: 'broker-management', label: '经纪人管理' },
      ],
    },
    {
      key: 'property-management',
      label: '房源管理',
      icon: <HomeOutlined />,
      children: [
        { key: 'area-management', label: '片区管理' },
        { key: 'building-management', label: '楼栋管理' },
        { key: 'floor-management', label: '楼层管理' },
        { key: 'room-management', label: '房间管理' },
        { key: 'workstation-management', label: '工位管理' },
        { key: 'rental-pricing', label: '租金定价' },
      ],
    },
    {
      key: 'contract-management',
      label: '合同管理',
      icon: <FileTextOutlined />,
      children: [
        { key: 'rental-contract', label: '租赁合同' },
        { key: 'property-contract', label: '物业合同' },
        { key: 'incubation-agreement', label: '入孵协议' },
        { key: 'registration-contract', label: '注册合同' },
      ],
    },
    {
      key: 'enterprise-entry',
      label: '企业入驻',
      icon: <ShopOutlined />,
      children: [
        { key: 'entry-application', label: '入驻申请' },
      ],
    },
    {
      key: 'base-settings',
      label: '基础设置',
      icon: <SettingOutlined />,
      children: [
        { key: 'channel-type', label: '渠道类型' },
        { key: 'enterprise-type', label: '企业类型' },
        { key: 'industry-type', label: '行业类型' },
        { key: 'intention-delete-reason', label: '意向删除原因' },
        { key: 'customer-source', label: '客户来源' },
        { key: 'investment-settings', label: '招商设置' },
      ],
    },
  ];
};

// 运营管理左侧菜单项
const getOperationsMenuItems = (): MenuProps['items'] => {
  return [
    {
      key: 'contract',
      label: '合同管理',
      icon: <FileTextOutlined />,
      children: [
        { key: 'contract', label: '合同列表' },
        { key: 'sales-contract', label: '销售合同', disabled: true },
      ],
    },
    {
      key: 'contract-template',
      label: '合同模板管理',
      icon: <FileSearchOutlined />,
      children: [
        { key: 'contract-template', label: '合同模板', disabled: true },
        { key: 'attachment-template', label: '合同附件模板', disabled: true },
      ],
    },
    {
      key: 'lease-control',
      label: '租控图',
      icon: <AppstoreOutlined />,
      children: [
        { key: 'room-control', label: '房间租控图', disabled: true },
        { key: 'workstation-control', label: '工位租控图', disabled: true },
      ],
    },
    {
      key: 'energy-meter',
      label: '能源表管理',
      icon: <DashboardOutlined />,
      children: [
        { key: 'meter-review', label: '抄表审核', disabled: true },
        { key: 'meter-reading', label: '抄表记录', disabled: true },
        { key: 'meter-account', label: '表账管理', disabled: true },
        { key: 'energy-meter-management', label: '能源表管理', disabled: true },
      ],
    },
    { 
      key: 'enterprise-management', 
      label: '企业管理', 
      icon: <ShopOutlined />, 
      disabled: true 
    },
    { 
      key: 'coupon-management', 
      label: '优惠券管理', 
      icon: <WalletOutlined />, 
      disabled: true 
    },
  ];
};

// 财务管理左侧菜单项
const getFinanceMenuItems = (): MenuProps['items'] => {
  return [
    {
      key: 'bill-management',
      label: '账单管理',
      icon: <AccountBookOutlined />,
      children: [
        { key: 'bill', label: '通用账单' },
        { key: 'parking-bill', label: '停车账单（本期不做）', disabled: true },
        { key: 'receivable-management', label: '应收/付管理' },
        { key: 'overdue-management', label: '逾期管理（本期不做）', disabled: true },
        { key: 'reminder-management', label: '催款单管理（本期不做）', disabled: true },
        { key: 'settlement-management', label: '结算单管理（本期不做）', disabled: true },
      ],
    },
    {
      key: 'deposit-management',
      label: '押金管理',
      icon: <WalletOutlined />,
      children: [
        { key: 'deposit', label: '押金管理' },
      ],
    },
    {
      key: 'temp-fee-management',
      label: '临时费管理',
      icon: <DollarOutlined />,
      children: [
        { key: 'temp-fee', label: '临时费管理' },
      ],
    },
    {
      key: 'prepaid-fee-management',
      label: '预收费管理',
      icon: <WalletOutlined />,
      children: [
        { key: 'electricity-prepaid', label: '电费预收' },
        { key: 'enterprise-prepaid', label: '企业预付费' },
        { key: 'temp-parking-prepaid', label: '临时停车费预收' },
      ],
    },
    {
      key: 'payment-management',
      label: '收/付款管理',
      icon: <DollarOutlined />,
      children: [
        { key: 'payment', label: '收/付款管理' },
      ],
    },
    {
      key: 'invoice-management',
      label: '开票管理',
      icon: <FileTextOutlined />,
      children: [
        { key: 'invoice', label: '开票管理' },
      ],
    },
    {
      key: 'finance-settings',
      label: '基础设置',
      icon: <SettingOutlined />,
      children: [
        { key: 'fee-item', label: '费项管理（已完成）', disabled: true },
        { key: 'fee-standard', label: '收费标准管理（已完成）', disabled: true },
        { key: 'bill-generation', label: '账单生成方式' },
        { key: 'finance-setting', label: '财务设置' },
      ],
    },
  ];
};

// 服务管理左侧菜单项
const getServiceMenuItems = (): MenuProps['items'] => {
  return [
    {
      key: 'service',
      label: '服务管理',
      icon: <AppstoreOutlined />,
      children: [
        { key: 'management', label: '服务管理' },
        { key: 'settings', label: '服务设置', disabled: true },
      ],
    },
    {
      key: 'service-handling',
      label: '服务办理',
      icon: <FileTextOutlined />,
      children: [
        { key: 'event-report', label: '事件上报', disabled: true },
        { key: 'maintenance', label: '维修申报', disabled: true },
        { key: 'registration', label: '企业注册申请', disabled: true },
        { key: 'financing', label: '融资服务申请', disabled: true },
        { key: 'lease-termination', label: '退租申请', disabled: true },
        { key: 'park-exit', label: '退园申请', disabled: true },
      ],
    },
    {
      key: 'info',
      label: '信息公开',
      icon: <NotificationOutlined />,
      children: [
        { key: 'notice', label: '通知公告' },
        { key: 'policy', label: '政策文件' },
        { key: 'activity', label: '园区活动' },
        { key: 'survey', label: '调查问卷' },
        { key: 'demands', label: '需求发布' },
      ],
    },
    { key: 'meeting-room', label: '会议室管理', icon: <TeamOutlined />, disabled: true },
    { key: 'air-condition', label: '空调管理', icon: <SettingOutlined />, disabled: true },
    { key: 'access-control', label: '门禁管理', icon: <KeyOutlined />, disabled: true },
    {
      key: 'parking',
      label: '停车管理',
      icon: <CarOutlined />,
      children: [
        { key: 'parking-dashboard', label: '停车管理中心' },
        { key: 'parking-lot', label: '停车场管理' },
        { key: 'entrance', label: '车道口管理' },
        { key: 'monthly-plan', label: '月卡收费方案' },
        { key: 'monthly-purchase', label: '月卡购买记录' },
        { key: 'temp-plan', label: '临停收费方案' },
        { key: 'enterprise-qrcode', label: '企业停车二维码' },
        { key: 'vehicle-manage', label: '车辆管理' },
        { key: 'access-records', label: '车辆通行记录' },
      ],
    },
    { key: 'surveys', label: '调查问卷管理', icon: <FormOutlined />, disabled: true },
    { key: 'invoices', label: '开票管理', icon: <FileTextOutlined />, disabled: true },
  ];
};

// 系统管理左侧菜单项
const getSystemMenuItems = (): MenuProps['items'] => {
  return [
    { key: 'user-management', label: '用户管理', icon: <UserOutlined /> },
    { key: 'role-management', label: '角色管理', icon: <TeamOutlined /> },
    { key: 'menu-management', label: '菜单管理', icon: <MenuOutlined /> },
    { key: 'log-management', label: '日志管理', icon: <FileSearchOutlined /> },
    { key: 'park-management', label: '园区管理', icon: <HomeOutlined /> },
  ];
};

// 根据当前选中的顶部选项卡，返回相应的左侧菜单项
const getMenuItemsByActiveTab = (activeTab: string): MenuProps['items'] => {
  // 检查当前URL路径
  const pathname = window.location.pathname;
  
  // 如果路径包含/admin/info，则强制返回服务管理菜单
  if (pathname.includes('/admin/info/')) {
    return getServiceMenuItems();
  }
  
  switch (activeTab) {
    case 'investment':
      return getInvestmentMenuItems();
    case 'operations':
      return getOperationsMenuItems();
    case 'finance':
      return getFinanceMenuItems();
    case 'service':
      return getServiceMenuItems();
    case 'system':
      return getSystemMenuItems();
    default:
      return [];
  }
};

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 从URL路径中提取当前活动的顶部标签和菜单项
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const activeTopTab = pathSegments.length > 1 ? pathSegments[1] : 'dashboard';
  const activeMenuItem = pathSegments.length > 2 ? pathSegments[2] : '';
  
  // 特殊处理parking相关路径
  useEffect(() => {
    if (pathSegments[1] === 'parking') {
      setCurrentTopTab('service');
      // 设置左侧菜单为停车管理
      setOpenKeys(['parking']);
    }
  }, [pathSegments]);
  
  // 从URL的第三段提取子菜单项，例如 customer-management/intention
  const activeSubMenuItem = pathSegments.length > 3 ? pathSegments[3] : '';
  
  // 用于左侧菜单的选中键，如果有嵌套菜单则使用子菜单的key
  const selectedMenuKey = activeSubMenuItem ? activeSubMenuItem : (
    // 特殊处理 parking 路径
    pathSegments[1] === 'parking' ? (
      pathSegments[2] === 'dashboard' ? 'parking-dashboard' :
      pathSegments[2] === 'lot-management' ? 'parking-lot' :
      pathSegments[2] === 'entrance-management' ? 'entrance' :
      pathSegments[2] === 'monthly-plan-management' ? 'monthly-plan' :
      pathSegments[2] === 'temp-plan-management' ? 'temp-plan' : ''
    ) : activeMenuItem
  );
  
  // 处理菜单展开逻辑
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  
  // 声明一个状态来控制当前的顶部标签
  const [currentTopTab, setCurrentTopTab] = useState(activeTopTab);
  
  // 当路径变化时，自动设置展开的菜单项
  useEffect(() => {
    // 如果是信息公开管理路径
    if (pathSegments[1] === 'info') {
      setOpenKeys(['info']);
      // 把顶部活动标签设置为service
      setCurrentTopTab('service');
    } else {
      // 更新顶部标签为当前路径的第一个段
      setCurrentTopTab(activeTopTab);
      
      if (activeMenuItem) {
        // 对于其他路径，尝试查找父菜单key并展开
        const menuItems = getMenuItemsByActiveTab(activeTopTab);
        let parentKey = '';
        
        // 遍历菜单项，寻找包含当前菜单项的父菜单
        menuItems?.forEach((item: any) => {
          if (item.children) {
            const found = item.children.find((child: any) => child.key === activeMenuItem);
            if (found) {
              parentKey = item.key;
            }
          }
        });
        
        if (parentKey) {
          setOpenKeys([parentKey]);
        }
      }
    }
  }, [location.pathname, activeTopTab, activeMenuItem]);

  // 处理菜单展开收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // 处理顶部选项卡点击
  const handleTabClick = (key: string) => {
    // 如果当前路径是info相关，且切换到了其他顶部标签，需特殊处理
    const isInfoPath = location.pathname.includes('/admin/info/');
    
    if (key === 'dashboard') {
      navigate('/admin/dashboard');
    } else if (key === 'investment') {
      // 对于招商管理，默认导航到意向登记页面
      navigate('/admin/investment/intention');
    } else if (key === 'finance') {
      // 对于财务管理，默认导航到通用账单页面
      navigate('/admin/finance/bill');
    } else if (key === 'service') {
      // 对于服务管理，检查是否是从信息公开页面点击
      if (isInfoPath) {
        // 如果已经在信息公开页面，保持当前页面
        return;
      }
      // 否则默认导航到服务管理页面
      navigate('/admin/service/management');
    } else if (key === 'operations') {
      // 对于运营管理，默认导航到合同列表页面
      navigate('/admin/operations/contract');
    } else {
      // 其他模块导航到相应的默认页面
      navigate(`/admin/${key}`);
    }
  };

  // 处理菜单点击事件
  const handleMenuClick = ({ key, keyPath }: { key: string; keyPath: string[] }) => {
    if (keyPath.includes('parking')) {
      // 停车管理相关路由
      switch (key) {
        case 'parking-dashboard':
          navigate('/admin/parking/dashboard');
          break;
        case 'parking-lot':
          navigate('/admin/parking/lot-management');
          break;
        case 'entrance':
          navigate('/admin/parking/entrance-management');
          break;
        case 'monthly-plan':
          navigate('/admin/parking/monthly-plan-management');
          break;
        case 'temp-plan':
          navigate('/admin/parking/temp-plan-management');
          break;
        case 'monthly-purchase':
          navigate('/admin/parking/monthly-purchase-record');
          break;
        case 'enterprise-qrcode':
          navigate('/admin/parking/enterprise-qr-code');
          break;
        case 'vehicle-manage':
          navigate('/admin/parking/vehicle-management');
          break;
        case 'access-records':
          navigate('/admin/parking/access-records');
          break;
        default:
          break;
      }
    } else if (keyPath.includes('bill-management')) {
      // 账单管理相关路由
      switch (key) {
        case 'bill':
          navigate('/admin/finance/bill');
          break;
        case 'receivable-management':
          navigate('/admin/finance/receivable');
          break;
        default:
          break;
      }
    } else if (keyPath.includes('temp-fee-management')) {
      // 临时费管理相关路由
      switch (key) {
        case 'temp-fee':
          navigate('/admin/finance/temp-fee');
          break;
        default:
          break;
      }
    } else if (keyPath.includes('deposit-management')) {
      // 押金管理相关路由
      switch (key) {
        case 'deposit':
          navigate('/admin/finance/deposit');
          break;
        default:
          break;
      }
    } else if (keyPath.includes('prepaid-fee-management')) {
      // 预收费管理相关路由
      switch (key) {
        case 'electricity-prepaid':
          navigate('/admin/finance/electricity-prepaid');
          break;
        case 'enterprise-prepaid':
          navigate('/admin/finance/enterprise-prepaid');
          break;
        default:
          break;
      }
    } else if (keyPath.includes('payment-management')) {
      // 收/付款管理相关路由
      switch (key) {
        case 'payment':
          navigate('/admin/finance/payment');
          break;
        default:
          break;
      }
    } else if (keyPath.includes('invoice-management')) {
      // 开票管理相关路由
      switch (key) {
        case 'invoice':
          navigate('/admin/finance/invoice');
          break;
        default:
          break;
      }
    } else if (keyPath.includes('service')) {
      // 服务管理相关路由
      switch (key) {
        case 'management':
          navigate('/admin/service/management');
          break;
        default:
          break;
      }
    } else if (keyPath.includes('info')) {
      // 信息公开相关路由
      navigate(`/admin/info/${key}`);
    } else if (key === 'intention') {
      // 意向登记特殊处理
      navigate('/admin/investment/intention');
    } else if (key === 'contract') {
      // 合同管理特殊处理
      navigate('/admin/operations/contract');
    } else {
      // 其他路由处理
      switch (key) {
        case 'dashboard':
          navigate('/admin/dashboard');
          break;
        default:
          navigate(`/admin/${currentTopTab}/${key}`);
          break;
      }
    }
  };

  // 菜单点击事件处理
  const onMenuClick = ({ key, keyPath }: { key: string; keyPath: string[] }) => {
    handleMenuClick({ key, keyPath });
  };

  // 用户下拉菜单
  const userMenu = {
    items: [
      {
        key: '1',
        icon: <UserOutlined />,
        label: '个人信息',
      },
      {
        key: '2',
        icon: <LogoutOutlined />,
        label: '退出登录',
      },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === '2') {
        navigate('/admin/login');
      }
    },
  };

  // 自定义顶部标签样式
  const customTabBarStyle = {
    borderBottom: 'none',
    marginBottom: 0
  };

  // 活动标签样式
  const activeTabStyle = {
    color: '#fff', 
    fontWeight: 'bold',
    transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)'
  };

  return (
    <Layout className="admin-layout" style={{ minHeight: '100vh' }}>
      <Header 
        className="site-header"
        style={{
          padding: '0 30px',
          background: 'linear-gradient(90deg, #0F2645 0%, #1D4073 100%)',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
          borderBottom: 'none',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '20px', color: '#fff' }} /> : <MenuFoldOutlined style={{ fontSize: '20px', color: '#fff' }} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 40,
              height: 40,
              marginRight: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="collapse-button"
          />
          
          {/* 顶部平台名称 */}
          <div className="platform-logo">
            <RobotOutlined className="logo-icon" />
            <Title 
              level={4} 
              className="platform-title"
            >
              智慧园区综合管理平台
            </Title>
          </div>
          
          <div className="top-menu" style={{ flex: 1 }}>
            <Tabs
              activeKey={currentTopTab}
              onChange={handleTabClick}
              tabBarStyle={customTabBarStyle}
              size="large"
              animated={{ inkBar: true, tabPane: false }}
              items={topTabItems.map(item => ({
                key: item.key,
                label: (
                  <span style={item.key === currentTopTab ? activeTabStyle : { color: 'rgba(255, 255, 255, 0.85)' }} className="tab-label">
                    {React.cloneElement(item.icon as React.ReactElement, { 
                      style: { color: item.key === currentTopTab ? '#fff' : 'rgba(255, 255, 255, 0.85)', fontSize: '18px' } 
                    })}
                    <span className="tab-text">
                      {item.label}
                    </span>
                  </span>
                ),
              }))}
            />
          </div>
        
          <Space size="large" align="center">
            <Badge count={5} className="notification-badge">
              <Button 
                type="text" 
                icon={<BellOutlined style={{ fontSize: 22, color: '#fff' }} />} 
                className="header-action-button"
              />
            </Badge>
            
            <Dropdown menu={userMenu} placement="bottomRight">
              <div className="user-profile">
                <Avatar 
                  className="user-avatar"
                  icon={<UserOutlined />} 
                />
                <div className="user-info">
                  <span className="user-name">hkt001</span>
                  <Text className="user-role">管理员</Text>
                </div>
              </div>
            </Dropdown>
          </Space>
        </div>
      </Header>
      
      <Layout style={{ minHeight: 'calc(100vh - 72px)' }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          width={200}
          className="site-sidebar"
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedMenuKey]}
            openKeys={openKeys}
            className="side-menu"
            items={getMenuItemsByActiveTab(currentTopTab)}
            onClick={onMenuClick}
            onOpenChange={handleOpenChange}
          />
        </Sider>
        
        <Layout className="site-content-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Content className="site-content">
            <div className="content-container">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
      
      <style>
        {`
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
          
          .admin-layout {
            background: var(--light-bg);
            position: relative;
          }
          
          .site-header {
            position: relative;
            overflow: hidden;
          }
          
          .site-header::before {
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
          
          .site-header::after {
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
          
          .tab-text {
            margin-left: 0;
            font-size: 16px;
            font-weight: 500;
            letter-spacing: 0.5px;
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
          
          .site-content-layout {
            transition: margin-left 0.3s;
            position: relative;
          }
          
          .site-content {
            margin: 24px;
            padding: 0;
            background: var(--light-bg);
            border-radius: var(--border-radius-lg);
            min-height: calc(100vh - 120px);
            overflow: hidden;
            position: relative;
          }
          
          .content-container {
            padding: 30px;
            background: #fff;
            border-radius: var(--border-radius-lg);
            min-height: calc(100vh - 120px);
            box-shadow: var(--box-shadow);
            position: relative;
            overflow: hidden;
            animation: fadeIn 0.5s;
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
          }
          
          .header-action-button:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
          
          .collapse-button {
            background: rgba(255, 255, 255, 0.08);
            border-radius: var(--border-radius-sm);
            backdrop-filter: blur(8px);
            transition: var(--transition-normal);
          }
          
          .collapse-button:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
          
          .notification-badge .ant-badge-count {
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
            background-color: var(--secondary-color);
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
          
          .user-role {
            color: rgba(255, 255, 255, 0.65);
            font-size: 12px;
            line-height: 1;
          }
          
          .ant-menu-dark {
            color: rgba(255, 255, 255, 0.85);
            background: transparent;
          }
          
          .ant-menu-dark .ant-menu-item {
            margin: 6px 0 !important;
            border-radius: var(--border-radius-sm) !important;
            font-size: 15px;
            height: 46px;
            line-height: 46px;
            transition: var(--transition-normal) !important;
            position: relative;
            overflow: hidden;
          }
          
          .ant-menu-dark .ant-menu-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background: transparent;
            transition: var(--transition-normal);
          }
          
          .ant-menu-dark .ant-menu-item:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: #fff !important;
          }
          
          .ant-menu-dark .ant-menu-item:hover::before {
            background: var(--secondary-color);
          }
          
          .ant-menu-dark .ant-menu-item-selected {
            background: linear-gradient(90deg, rgba(46, 106, 230, 0.3) 0%, rgba(76, 187, 255, 0.3) 100%) !important;
            color: #fff !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 12px rgba(46, 106, 230, 0.3) !important;
          }
          
          .ant-menu-dark .ant-menu-item-selected::before {
            background: var(--secondary-color);
          }
          
          .ant-menu-dark .ant-menu-submenu-title {
            margin: 6px 0 !important;
            border-radius: var(--border-radius-sm) !important;
            font-size: 15px;
            height: 46px;
            line-height: 46px;
            transition: var(--transition-normal) !important;
            position: relative;
            overflow: hidden;
          }
          
          .ant-menu-dark .ant-menu-submenu-title::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background: transparent;
            transition: var(--transition-normal);
          }
          
          .ant-menu-dark .ant-menu-submenu-title:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: #fff !important;
          }
          
          .ant-menu-dark .ant-menu-submenu-title:hover::before {
            background: var(--secondary-color);
          }
          
          .ant-menu-sub.ant-menu-inline {
            background: transparent !important;
          }
          
          .ant-tabs-tab {
            padding: 8px 8px !important;
            transition: var(--transition-normal) !important;
            margin: 0 1px !important;
            position: relative;
            border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
          }
          
          .ant-tabs-tab:hover {
            color: #fff !important;
            background: rgba(255, 255, 255, 0.15) !important;
          }
          
          .ant-tabs-tab.ant-tabs-tab-active {
            background: rgba(255, 255, 255, 0.2) !important;
          }
          
          .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #fff !important;
            font-weight: bold !important;
          }
          
          .ant-tabs-ink-bar {
            background-color: var(--secondary-color) !important;
            height: 4px !important;
            border-radius: 2px !important;
          }
          
          /* 滚动条样式 */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.15);
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.25);
          }
          
          /* 平滑过渡 */
          * {
            transition: background-color 0.3s, border-color 0.3s, color 0.3s;
          }
          
          .ant-layout-sider-children {
            overflow-y: auto;
            overflow-x: hidden;
          }
          
          .ant-btn {
            border-radius: var(--border-radius-sm);
          }
          
          .ant-input, .ant-select, .ant-picker, .ant-select-selector {
            border-radius: var(--border-radius-sm) !important;
          }
          
          .ant-table {
            border-radius: var(--border-radius-lg);
            overflow: hidden;
          }
          
          .ant-card {
            border-radius: var(--border-radius-lg);
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
          }
          
          .ant-layout-content {
            transition: margin 0.3s;
          }
          
          .ant-layout-sider {
            transition: all 0.3s !important;
          }
          
          /* 添加动画效果 */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(76, 187, 255, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(76, 187, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(76, 187, 255, 0); }
          }
          
          .tab-label {
            display: flex;
            align-items: center;
            column-gap: 2px;
          }
          
          /* 适配暗色主题按钮效果 */
          .ant-btn-primary {
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)) !important;
            border: none !important;
            box-shadow: 0 2px 8px rgba(46, 106, 230, 0.3) !important;
            transition: all 0.3s !important;
          }
          
          .ant-btn-primary:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(46, 106, 230, 0.4) !important;
          }
        `}
      </style>
    </Layout>
  );
};

export default AdminLayout; 