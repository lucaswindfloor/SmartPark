import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Badge, Button, Typography, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import {
  HomeOutlined, 
  AppstoreOutlined, 
  BellOutlined,
  UserOutlined,
  TeamOutlined,
  GlobalOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  BankOutlined,
  NotificationOutlined,
  LogoutOutlined,
  RobotOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoginOutlined,
  KeyOutlined,
  CarOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// 定义菜单项类型
type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItem[];
  onClick?: () => void;
  path?: string;
  disabled?: boolean;
};

// 定义主导航菜单
const mainNavItems: MenuItem[] = [
  {
    key: 'home',
    label: '首页',
    icon: <HomeOutlined />,
    path: '/portal'
  },
  {
    key: 'information',
    label: '信息公开',
    icon: <InfoCircleOutlined />,
    path: '/portal/information/notice'
  },
  {
    key: 'services',
    label: '服务大厅',
    icon: <AppstoreOutlined />,
    path: '/portal/services'
  },
  {
    key: 'user-center',
    label: '用户中心',
    icon: <UserOutlined />,
    path: '/portal/user/profile'
  }
];

const PublicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedNavKey, setSelectedNavKey] = useState('home');
  const { userRole, switchRole, availableRoles, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 确保用户总是有访客角色
  useEffect(() => {
    // 如果用户未登录，强制设置为访客角色
    if (!isAuthenticated) {
      switchRole('public');
    }
  }, [isAuthenticated, switchRole]);
  
  // 根据当前路径设置选中的导航项
  useEffect(() => {
    const path = location.pathname;
    
    for (const item of mainNavItems) {
      if (path.startsWith(item.path || '')) {
        setSelectedNavKey(item.key);
        break;
      }
    }
  }, [location]);
  
  // 角色标签样式和图标
  const roleConfig = {
    enterprise: { color: '#0050B3', icon: <TeamOutlined />, name: '企业管理员' },
    employee: { color: '#389E0D', icon: <UserOutlined />, name: '企业员工' },
    public: { color: '#8C8C8C', icon: <GlobalOutlined />, name: '访客' }
  };
  
  // 根据当前选中的导航项和角色返回不同的侧边菜单项
  const getSideMenuItems = (): MenuItem[] => {
    // 首页无侧边菜单
    if (selectedNavKey === 'home') {
      return [];
    }
    
    // 服务大厅侧边菜单
    if (selectedNavKey === 'services') {
      const commonItems: MenuItem[] = [
        {
          key: 'all-services',
          icon: <AppstoreOutlined />,
          label: '全部服务',
          onClick: () => navigate('/portal/services')
        }
      ];
      
      // 访客菜单 - 最简单的，先定义
      if (userRole === 'public') {
        return [
          ...commonItems,
          {
            key: 'property-services',
            icon: <HomeOutlined />,
            label: '物业服务',
            children: [
              {
                key: 'event-report',
                label: '事件上报',
                onClick: () => navigate('/portal/services/event-report')
              }
            ]
          },
          {
            key: 'support-services',
            icon: <SettingOutlined />,
            label: '配套服务',
            children: [
              {
                key: 'join-enterprise',
                label: '加入企业',
                onClick: () => navigate('/portal/services/join-enterprise')
              },
              {
                key: 'visitor-access',
                label: '访客门禁申请',
                onClick: () => navigate('/portal/services/visitor-access')
              },
              {
                key: 'temp-parking',
                label: '临停缴费',
                onClick: () => navigate('/portal/services/temp-parking')
              }
            ]
          }
        ];
      }
      
      // 企业员工菜单
      else if (userRole === 'employee') {
        return [
          ...commonItems,
          {
            key: 'property-services',
            icon: <HomeOutlined />,
            label: '物业服务',
            children: [
              {
                key: 'event-report',
                label: '事件上报',
                onClick: () => navigate('/portal/services/event-report')
              },
              {
                key: 'maintenance',
                label: '维修申报',
                onClick: () => navigate('/portal/services/maintenance')
              },
              {
                key: 'lease-termination',
                label: '退租申请',
                onClick: () => navigate('/portal/services/lease-termination')
              },
              {
                key: 'park-exit',
                label: '退园申请',
                onClick: () => navigate('/portal/services/park-exit')
              }
            ]
          },
          {
            key: 'support-services',
            icon: <SettingOutlined />,
            label: '配套服务',
            children: [
              {
                key: 'join-enterprise',
                label: '加入企业',
                onClick: () => navigate('/portal/services/join-enterprise')
              },
              {
                key: 'visitor-access',
                label: '访客门禁申请',
                onClick: () => navigate('/portal/services/visitor-access')
              },
              {
                key: 'meeting-room',
                label: '会议室预订',
                onClick: () => navigate('/portal/services/meeting-room')
              },
              {
                key: 'temp-parking',
                label: '临停缴费',
                onClick: () => navigate('/portal/services/temp-parking')
              },
              {
                key: 'parking-card',
                label: '停车月卡',
                onClick: () => navigate('/portal/services/parking-card')
              },
              {
                key: 'ac-extension',
                label: '空调加时',
                onClick: () => navigate('/portal/services/ac-extension')
              },
              {
                key: 'electricity-prepay',
                label: '电费预充',
                onClick: () => navigate('/portal/services/electricity-prepay')
              },
              {
                key: 'enterprise-bill',
                label: '企业账单',
                onClick: () => navigate('/portal/services/enterprise-bill')
              },
              {
                key: 'invoice-apply',
                label: '开票申请',
                onClick: () => navigate('/portal/services/invoice-apply')
              },
              {
                key: 'demand-publish',
                label: '需求发布',
                onClick: () => navigate('/portal/services/demand-publish')
              }
            ]
          },
          {
            key: 'growth-services',
            icon: <BankOutlined />,
            label: '成长服务',
            children: [
              {
                key: 'enterprise-registration',
                label: '企业注册申请',
                onClick: () => navigate('/portal/services/enterprise-registration')
              },
              {
                key: 'financing-service',
                label: '融资服务申请',
                onClick: () => navigate('/portal/services/financing-service')
              }
            ]
          },
          {
            key: 'value-added-services',
            icon: <RobotOutlined />,
            label: '增值服务',
            children: [
              {
                key: 'lab-application',
                label: '实验室申请',
                onClick: () => navigate('/portal/services/lab-application'),
                disabled: true
              },
              {
                key: 'computing-power',
                label: '普惠算力申请',
                onClick: () => navigate('/portal/services/computing-power'),
                disabled: true
              }
            ]
          }
        ];
      } 
      // 企业管理员菜单 - 完整访问权限
      else {
        return [
          ...commonItems,
          {
            key: 'property-services',
            icon: <HomeOutlined />,
            label: '物业服务',
            children: [
              {
                key: 'event-report',
                label: '事件上报',
                onClick: () => navigate('/portal/services/event-report')
              },
              {
                key: 'maintenance',
                label: '维修申报',
                onClick: () => navigate('/portal/services/maintenance')
              },
              {
                key: 'lease-termination',
                label: '退租申请',
                onClick: () => navigate('/portal/services/lease-termination')
              },
              {
                key: 'park-exit',
                label: '退园申请',
                onClick: () => navigate('/portal/services/park-exit')
              }
            ]
          },
          {
            key: 'support-services',
            icon: <SettingOutlined />,
            label: '配套服务',
            children: [
              {
                key: 'visitor-access',
                label: '访客门禁申请',
                onClick: () => navigate('/portal/services/visitor-access')
              },
              {
                key: 'meeting-room',
                label: '会议室预订',
                onClick: () => navigate('/portal/services/meeting-room')
              },
              {
                key: 'temp-parking',
                label: '临停缴费',
                onClick: () => navigate('/portal/services/temp-parking')
              },
              {
                key: 'parking-card',
                label: '停车月卡',
                onClick: () => navigate('/portal/services/parking-card')
              },
              {
                key: 'ac-extension',
                label: '空调加时',
                onClick: () => navigate('/portal/services/ac-extension')
              },
              {
                key: 'electricity-prepay',
                label: '电费预充',
                onClick: () => navigate('/portal/services/electricity-prepay')
              },
              {
                key: 'enterprise-bill',
                label: '企业账单',
                onClick: () => navigate('/portal/services/enterprise-bill')
              },
              {
                key: 'invoice-apply',
                label: '开票申请',
                onClick: () => navigate('/portal/services/invoice-apply')
              },
              {
                key: 'invoice-change',
                label: '开票变更',
                onClick: () => navigate('/portal/services/invoice-change')
              },
              {
                key: 'demand-publish',
                label: '需求发布',
                onClick: () => navigate('/portal/services/demand-publish')
              }
            ]
          },
          {
            key: 'growth-services',
            icon: <BankOutlined />,
            label: '成长服务',
            children: [
              {
                key: 'enterprise-registration',
                label: '企业注册申请',
                onClick: () => navigate('/portal/services/enterprise-registration')
              },
              {
                key: 'financing-service',
                label: '融资服务申请',
                onClick: () => navigate('/portal/services/financing-service')
              }
            ]
          },
          {
            key: 'value-added-services',
            icon: <RobotOutlined />,
            label: '增值服务',
            children: [
              {
                key: 'lab-application',
                label: '实验室申请',
                onClick: () => navigate('/portal/services/lab-application')
              },
              {
                key: 'computing-power',
                label: '普惠算力申请',
                onClick: () => navigate('/portal/services/computing-power')
              }
            ]
          }
        ];
      }
    }
    
    // 信息公开菜单
    if (selectedNavKey === 'information') {
      return [
        {
          key: 'notice',
          icon: <NotificationOutlined />,
          label: '通知公告',
          onClick: () => navigate('/portal/information/notice')
        },
        {
          key: 'policy',
          icon: <FileTextOutlined />,
          label: '政策文件',
          onClick: () => navigate('/portal/information/policy')
        },
        {
          key: 'activities',
          icon: <NotificationOutlined />,
          label: '园区活动',
          onClick: () => navigate('/portal/information/activities')
        },
        {
          key: 'demand',
          icon: <AppstoreOutlined />,
          label: '需求发布',
          onClick: () => navigate('/portal/information/demand')
        },
        {
          key: 'survey',
          icon: <FileTextOutlined />,
          label: '调查问卷',
          onClick: () => navigate('/portal/information/survey')
        }
      ];
    }
    
    // 用户中心侧边菜单
    if (selectedNavKey === 'user-center') {
      const commonItems: MenuItem[] = [
        {
          key: 'my-messages',
          icon: <NotificationOutlined />,
          label: '我的消息',
          onClick: () => navigate('/portal/user/profile?tab=messages')
        },
        {
          key: 'my-reservations',
          icon: <AppstoreOutlined />,
          label: '我的预订',
          children: [
            {
              key: 'meeting-reservations',
              label: '会议室预订',
              onClick: () => navigate('/portal/user/reservations/meeting')
            },
            {
              key: 'ac-reservations',
              label: '空调加时预订',
              onClick: () => navigate('/portal/user/reservations/ac')
            }
          ]
        },
        {
          key: 'my-activities',
          icon: <NotificationOutlined />,
          label: '我的活动',
          onClick: () => navigate('/portal/user/activities')
        },
        {
          key: 'my-applications',
          icon: <FileTextOutlined />,
          label: '我的申请',
          onClick: () => navigate('/portal/user/applications')
        },
        {
          key: 'my-access',
          icon: <KeyOutlined />,
          label: '我的门禁',
          children: [
            {
              key: 'my-access-cards',
              label: '我的门禁',
              onClick: () => navigate('/portal/user/access')
            },
            {
              key: 'visitor-approval',
              label: '访客门禁审批',
              onClick: () => navigate('/portal/user/access/approval')
            }
          ]
        },
        {
          key: 'my-parking-cards',
          icon: <CarOutlined />,
          label: '我的月卡',
          onClick: () => navigate('/portal/user/parking-cards')
        },
        {
          key: 'personal-settings',
          icon: <SettingOutlined />,
          label: '个人设置',
          onClick: () => navigate('/portal/user/settings')
        }
      ];
      
      // 企业管理员特有菜单
      if (userRole === 'enterprise') {
        return [
          ...commonItems,
          {
            key: 'my-employees',
            icon: <TeamOutlined />,
            label: '我的员工',
            onClick: () => navigate('/portal/user/employees')
          }
        ];
      }
      
      // 企业员工和访客菜单
      return commonItems;
    }
    
    // 默认空菜单
    return [];
  };
  
  // 转换为Ant Design菜单需要的格式
  const getAntdMenuItems = (items: MenuItem[]): MenuProps['items'] => {
    return items.map(item => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? getAntdMenuItems(item.children) : undefined,
      onClick: item.onClick ? () => item.onClick && item.onClick() : undefined
    }));
  };
  
  // 处理顶部导航点击
  const handleNavClick = (key: string) => {
    setSelectedNavKey(key);
    
    // 找到对应的导航项
    const navItem = mainNavItems.find(item => item.key === key);
    if (navItem && navItem.path) {
      navigate(navItem.path);
    }
  };
  
  // 角色切换下拉菜单
  const roleMenu = (
    <Menu onClick={({key}) => switchRole(key as any)}>
      {availableRoles.map(role => (
        <Menu.Item key={role} icon={roleConfig[role].icon}>
          {roleConfig[role].name}
        </Menu.Item>
      ))}
    </Menu>
  );

  // 用户菜单
  const userMenu = (
    <Menu>
      {isAuthenticated ? (
        <>
          <Menu.Item key="profile" onClick={() => navigate('/portal/user/profile')}>
            个人中心
          </Menu.Item>
          <Menu.Item key="settings" onClick={() => navigate('/portal/user/settings')}>
            个人设置
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="logout" onClick={logout}>
            退出登录
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="login" onClick={() => navigate('/portal/login')}>
          <LoginOutlined /> 登录
        </Menu.Item>
      )}
    </Menu>
  );

  // 获取当前导航的标题
  const getCurrentNavTitle = () => {
    const currentNav = mainNavItems.find(item => item.key === selectedNavKey);
    return currentNav ? currentNav.label : '';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 30px', 
        background: 'linear-gradient(90deg, #0F2645 0%, #1D4073 100%)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 11,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '18px', color: '#fff' }} /> : <MenuFoldOutlined style={{ fontSize: '18px', color: '#fff' }} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 40,
              height: 40,
              marginRight: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)'
            }}
            className="collapse-button"
          />
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            marginRight: 40
          }}>
            <div style={{ 
              fontSize: 28, 
              color: '#4CBBFF', 
              marginRight: 10,
              background: 'rgba(76, 187, 255, 0.15)',
              padding: 8,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RobotOutlined />
            </div>
            <Title 
              level={4} 
              style={{
                margin: 0,
                color: 'white',
                whiteSpace: 'nowrap',
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: '0.5px',
                background: 'linear-gradient(90deg, #FFFFFF 0%, #D0E6FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              智慧园区公共服务平台
            </Title>
          </div>
          
          {/* 顶部主导航菜单 */}
          <div className="main-nav">
            {mainNavItems.map(item => (
              <div 
                key={item.key} 
                className={`nav-item ${item.key === selectedNavKey ? 'active' : ''}`}
                onClick={() => handleNavClick(item.key)}
              >
                {React.cloneElement(item.icon as React.ReactElement, { 
                  style: { fontSize: 16, marginRight: 8 } 
                })}
                {item.label}
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 角色切换按钮 - 仅当用户已登录且有多个角色时显示 */}
          {isAuthenticated && availableRoles.length > 1 && (
            <Dropdown overlay={roleMenu} placement="bottomRight">
              <div style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2px 8px',
                borderRadius: '40px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
                marginRight: 16,
                height: 28
              }}>
                <Avatar 
                  size={20}
                  icon={roleConfig[userRole].icon}
                  style={{
                    backgroundColor: roleConfig[userRole].color,
                    color: '#fff',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                />
                <span style={{ marginLeft: 4, color: '#fff', fontSize: '12px' }}>
                  {roleConfig[userRole].name}
                </span>
              </div>
            </Dropdown>
          )}
          
          {/* 通知图标 - 根据登录状态显示通知数 */}
          <Badge count={isAuthenticated ? 5 : 0} style={{ 
            marginRight: 14,
            backgroundColor: '#FF4D4F',
            boxShadow: '0 0 0 2px #0F2645',
            fontWeight: 'bold'
          }}
          onClick={() => isAuthenticated && navigate('/portal/user/profile?tab=messages')}>
            <Button type="text" 
              icon={<BellOutlined style={{ fontSize: 16, color: '#fff' }} />}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                padding: 6,
                height: 30,
                width: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
                borderRadius: '6px',
                backdropFilter: 'blur(8px)'
              }}
            />
          </Badge>
          
          {/* 用户头像/登录按钮 */}
          <Dropdown overlay={userMenu}>
            <div style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 8px',
              borderRadius: '40px',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
              height: 28
            }}>
              <Avatar 
                size={20}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: isAuthenticated ? '#4CBBFF' : roleConfig.public.color,
                  color: '#fff',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              />
              <div style={{ marginLeft: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: '12px', lineHeight: '1' }}>
                  {isAuthenticated ? 'User001' : '访客模式'}
                </span>
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>
      
      <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Sider 
          width={256} 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          theme="dark"
          trigger={null}
          style={{
            display: getSideMenuItems().length > 0 ? 'block' : 'none',
            boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            zIndex: 10,
            background: '#0F2645',
            backgroundImage: 'linear-gradient(180deg, #0F2645 0%, #1A3A67 100%)',
            borderRight: 'none',
            marginTop: 0,
            height: 'calc(100vh - 64px)',
            left: 0,
            overflow: 'auto',
            transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)'
          }}
        >
          <div className="sidebar-header">
            <div className="sidebar-title">
              {collapsed ? 
                <span className="sidebar-icon">{(mainNavItems.find(item => item.key === selectedNavKey)?.icon)}</span> :
                getCurrentNavTitle()
              }
            </div>
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={[]}
            style={{ 
              height: 'calc(100% - 64px)', 
              borderRight: 0,
              padding: '16px 8px',
              background: 'transparent',
              fontWeight: 500
            }}
            theme="dark"
            items={getAntdMenuItems(getSideMenuItems())}
          />
        </Sider>
        
        <Layout style={{ 
          padding: '24px',
          marginLeft: getSideMenuItems().length > 0 ? (collapsed ? 80 : 256) : 0,
          transition: 'margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
          background: '#f6f8fd'
        }}>
          <div className="page-header">
            <div className="page-title">{getCurrentNavTitle()}</div>
          </div>
          <Content style={{
            padding: 30,
            margin: '16px 0 0 0',
            minHeight: 280,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(15, 38, 69, 0.12)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeIn 0.5s'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #2E6AE6, #4CBBFF)',
              borderRadius: '12px 12px 0 0'
            }}></div>
            <Outlet />
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
            --header-height: 64px;
            --border-radius-lg: 12px;
            --border-radius-sm: 8px;
            --box-shadow: 0 8px 24px rgba(15, 38, 69, 0.12);
            --transition-normal: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
          
          .main-nav {
            display: flex;
            height: 64px;
            align-items: center;
          }
          
          .nav-item {
            height: 64px;
            line-height: 64px;
            padding: 0 20px;
            color: rgba(255, 255, 255, 0.85);
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            position: relative;
          }
          
          .nav-item:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.1);
          }
          
          .nav-item.active {
            color: #fff;
            background: rgba(255, 255, 255, 0.15);
            font-weight: 600;
          }
          
          .nav-item.active::after {
            content: '';
            position: absolute;
            left: 20px;
            right: 20px;
            bottom: 0;
            height: 3px;
            background: #4CBBFF;
            border-radius: 3px 3px 0 0;
          }
          
          .sidebar-header {
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .sidebar-title {
            color: white;
            font-size: 16px;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .sidebar-icon {
            font-size: 20px;
            display: flex;
            justify-content: center;
          }
          
          .page-header {
            display: flex;
            align-items: center;
            margin-bottom: 0;
          }
          
          .page-title {
            font-size: 20px;
            font-weight: 600;
            color: #0F2645;
            position: relative;
            padding-left: 16px;
          }
          
          .page-title::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 20px;
            background: linear-gradient(180deg, #2E6AE6, #4CBBFF);
            border-radius: 2px;
          }
          
          .ant-menu-dark {
            background: transparent !important;
          }
          
          .ant-menu-dark .ant-menu-item-selected {
            background-color: #4CBBFF !important;
            border-radius: 8px;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Layout>
  );
};

export default PublicLayout; 

