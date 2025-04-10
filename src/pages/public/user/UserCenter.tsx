import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Typography, 
  Tabs, 
  List, 
  Avatar, 
  Form, 
  Input, 
  Button, 
  Upload, 
  message, 
  Badge, 
  Divider,
  Empty,
  Tag,
  Space,
  Result
} from 'antd';
import { 
  UserOutlined, 
  BellOutlined, 
  HistoryOutlined, 
  SettingOutlined,
  EditOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PushpinOutlined,
  SecurityScanOutlined,
  LogoutOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  KeyOutlined,
  CarOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 模拟的消息数据
const mockMessages = [
  {
    id: '1',
    title: '租金缴费提醒',
    content: '您有一笔租金将于3天后到期，请及时缴纳。',
    time: '2023-04-01 09:30',
    read: false,
    type: 'payment'
  },
  {
    id: '2',
    title: '活动报名确认',
    content: '您已成功报名参加4月15日的园区创新论坛活动。',
    time: '2023-03-28 14:22',
    read: true,
    type: 'activity'
  },
  {
    id: '3',
    title: '服务申请已处理',
    content: '您的会议室预约申请已通过审核，预约时间为4月10日14:00-16:00。',
    time: '2023-03-25 11:05',
    read: false,
    type: 'service'
  },
  {
    id: '4',
    title: '系统维护通知',
    content: '平台将于4月5日凌晨2:00-4:00进行系统维护，期间部分服务可能暂时不可用。',
    time: '2023-03-20 16:45',
    read: true,
    type: 'system'
  }
];

// 模拟的服务记录数据
const mockServiceRecords = [
  {
    id: '1',
    title: '会议室预约',
    status: 'approved',
    date: '2023-04-10 14:00-16:00',
    location: 'A栋3楼会议室301',
    type: 'facility'
  },
  {
    id: '2',
    title: '物业报修',
    status: 'processing',
    date: '2023-03-27',
    description: '办公室空调故障',
    type: 'repair'
  },
  {
    id: '3',
    title: '园区活动报名',
    status: 'approved',
    date: '2023-04-15 09:00',
    description: '园区创新论坛',
    type: 'activity'
  },
  {
    id: '4',
    title: '访客预约',
    status: 'completed',
    date: '2023-03-20',
    visitorName: '李先生',
    type: 'visitor'
  }
];

// 定义不同身份的初始表单数据
const enterpriseInitialValues = {
  name: '湘江科技有限公司',
  contactPerson: '张三',
  phone: '13800138000',
  email: 'zhangsan@xjtech.com',
  address: '湘江科创基地A栋5楼',
  industry: '软件开发',
  size: '50-200人',
  description: '专注于智慧园区解决方案的科技公司'
};

const employeeInitialValues = {
  name: '李四',
  department: '研发部',
  position: '高级工程师',
  phone: '13900139000',
  email: 'lisi@xjtech.com',
  enterpriseName: '湘江科技有限公司',
  employeeId: 'EMP20230001'
};

const publicInitialValues = {
  name: '王五',
  phone: '13700137000',
  email: 'wangwu@example.com',
  address: '长沙市岳麓区大学城'
};

const UserCenter: React.FC = () => {
  const { userRole, userInfo, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('profile');
  const [messageData, setMessageData] = useState(mockMessages);
  const [serviceRecords, setServiceRecords] = useState(mockServiceRecords);
  const [form] = Form.useForm();
  
  // 重定向未登录用户
  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/portal/login');
    }
  }, [isAuthenticated, navigate]);
  
  // 从URL参数中获取tab值
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'messages', 'reservations', 'activities', 'applications', 'access', 'parking-cards', 'settings', 'employees'].includes(tab)) {
      setActiveKey(tab);
    }
  }, [location]);
  
  // 根据用户角色设置不同的初始值
  useEffect(() => {
    let initialValues;
    
    switch(userRole) {
      case 'enterprise':
        initialValues = enterpriseInitialValues;
        break;
      case 'employee':
        initialValues = employeeInitialValues;
        break;
      default:
        initialValues = publicInitialValues;
    }
    
    form.setFieldsValue(initialValues);
  }, [userRole, form]);
  
  // 处理未读消息标记为已读
  const handleMarkAsRead = (id: string) => {
    setMessageData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, read: true } : item
      )
    );
    message.success('已标记为已读');
  };
  
  // 处理全部标记为已读
  const handleMarkAllAsRead = () => {
    setMessageData(prev => 
      prev.map(item => ({ ...item, read: true }))
    );
    message.success('已全部标记为已读');
  };
  
  // 处理提交表单
  const handleFormSubmit = (values: any) => {
    console.log('表单提交的值:', values);
    message.success('个人信息已更新');
  };
  
  // 获取未读消息数量
  const getUnreadCount = () => messageData.filter(item => !item.read).length;
  
  // 处理标签切换
  const handleTabChange = (key: string) => {
    setActiveKey(key);
    navigate(`/portal/user/profile?tab=${key}`, { replace: true });
  };
  
  // 侧边栏菜单项
  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息'
    },
    {
      key: 'messages',
      icon: <BellOutlined />,
      label: '我的消息',
      badge: getUnreadCount()
    },
    {
      key: 'reservations',
      icon: <CalendarOutlined />,
      label: '我的预订'
    },
    {
      key: 'activities',
      icon: <TeamOutlined />,
      label: '我的活动'
    },
    {
      key: 'applications',
      icon: <HistoryOutlined />,
      label: '我的申请'
    },
    {
      key: 'access',
      icon: <KeyOutlined />,
      label: '我的门禁'
    },
    {
      key: 'parking-cards',
      icon: <CarOutlined />,
      label: '我的月卡'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置'
    },
    // 企业管理员特有菜单
    ...(userRole === 'enterprise' ? [
      {
        key: 'employees',
        icon: <TeamOutlined />,
        label: '我的员工'
      }
    ] : [])
  ];
  
  // 渲染消息列表项
  const renderMessageItem = (item: any) => {
    // 根据消息类型设置不同的图标和颜色
    const typeConfig = {
      payment: { icon: <FileTextOutlined />, color: '#1890ff', text: '缴费' },
      activity: { icon: <PushpinOutlined />, color: '#52c41a', text: '活动' },
      service: { icon: <CheckCircleOutlined />, color: '#722ed1', text: '服务' },
      system: { icon: <SecurityScanOutlined />, color: '#faad14', text: '系统' }
    };
    
    const typeInfo = typeConfig[item.type as keyof typeof typeConfig] || 
      { icon: <BellOutlined />, color: '#d9d9d9', text: '其他' };
    
    return (
      <List.Item
        actions={[
          !item.read && 
          <Button type="link" size="small" onClick={() => handleMarkAsRead(item.id)}>
            标记已读
          </Button>
        ]}
      >
        <List.Item.Meta
          avatar={
            <Badge dot={!item.read} offset={[-5, 5]}>
              <Avatar style={{ backgroundColor: typeInfo.color }} icon={typeInfo.icon} />
            </Badge>
          }
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text strong={!item.read} style={{ marginRight: 8 }}>{item.title}</Text>
              <Tag color={typeInfo.color}>{typeInfo.text}</Tag>
            </div>
          }
          description={
            <>
              <Text style={{ display: 'block', marginBottom: 4 }}>{item.content}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
            </>
          }
        />
      </List.Item>
    );
  };
  
  // 渲染服务记录列表项
  const renderServiceItem = (item: any) => {
    // 状态配置
    const statusConfig = {
      approved: { icon: <CheckCircleOutlined />, color: '#52c41a', text: '已通过' },
      processing: { icon: <ClockCircleOutlined />, color: '#1890ff', text: '处理中' },
      pending: { icon: <ClockCircleOutlined />, color: '#faad14', text: '待审核' },
      rejected: { icon: <CloseCircleOutlined />, color: '#f5222d', text: '已拒绝' },
      completed: { icon: <CheckCircleOutlined />, color: '#52c41a', text: '已完成' }
    };
    
    const statusInfo = statusConfig[item.status as keyof typeof statusConfig] || 
      { icon: <QuestionCircleOutlined />, color: '#d9d9d9', text: '未知' };
    
    return (
      <List.Item>
        <List.Item.Meta
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text strong style={{ marginRight: 8 }}>{item.title}</Text>
              <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
            </div>
          }
          description={
            <>
              <Text style={{ display: 'block', marginBottom: 4 }}>
                {item.date} {item.location && `· ${item.location}`}
              </Text>
              {item.description && (
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                  {item.description}
                </Text>
              )}
              {item.visitorName && (
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                  访客: {item.visitorName}
                </Text>
              )}
            </>
          }
        />
        <Space>
          <Button type="link" size="small">查看详情</Button>
          {item.status === 'approved' && (
            <Button type="link" size="small">取消预约</Button>
          )}
        </Space>
      </List.Item>
    );
  };
  
  // 渲染不同角色的表单字段
  const renderFormFields = () => {
    switch(userRole) {
      case 'enterprise':
        return (
          <>
            <Form.Item name="name" label="企业名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="contactPerson" label="联系人" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item name="email" label="电子邮箱" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item name="address" label="企业地址">
              <Input prefix={<HomeOutlined />} />
            </Form.Item>
            <Form.Item name="industry" label="所属行业">
              <Input />
            </Form.Item>
            <Form.Item name="size" label="企业规模">
              <Input />
            </Form.Item>
            <Form.Item name="description" label="企业简介">
              <Input.TextArea rows={4} />
            </Form.Item>
          </>
        );
      
      case 'employee':
        return (
          <>
            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="enterpriseName" label="所属企业" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="employeeId" label="员工编号">
              <Input disabled />
            </Form.Item>
            <Form.Item name="department" label="所属部门">
              <Input />
            </Form.Item>
            <Form.Item name="position" label="职位">
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item name="email" label="电子邮箱" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} />
            </Form.Item>
          </>
        );
      
      default: // public
        return (
          <>
            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item name="email" label="电子邮箱" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item name="address" label="地址">
              <Input prefix={<HomeOutlined />} />
            </Form.Item>
          </>
        );
    }
  };
  
  // 渲染个人信息页
  const renderProfileContent = () => (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {userRole === 'enterprise' ? enterpriseInitialValues.name : 
               userRole === 'employee' ? employeeInitialValues.name : 
               publicInitialValues.name}
            </Title>
            <Text type="secondary">
              {userRole === 'enterprise' ? '企业管理员' : 
               userRole === 'employee' ? `${employeeInitialValues.enterpriseName} - ${employeeInitialValues.position}` : 
               '访客'}
            </Text>
          </div>
        </div>
      }
      style={{ marginBottom: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        {renderFormFields()}
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
            保存修改
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
  
  // 渲染消息通知页
  const renderMessagesContent = () => (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>消息通知</Title>
        <Button type="link" onClick={handleMarkAllAsRead} disabled={getUnreadCount() === 0}>
          全部标为已读
        </Button>
      </div>
      <Tabs defaultActiveKey="all">
        <TabPane tab="全部" key="all">
          <List
            itemLayout="horizontal"
            dataSource={messageData}
            renderItem={renderMessageItem}
            locale={{ emptyText: <Empty description="暂无消息" /> }}
          />
        </TabPane>
        <TabPane tab="未读" key="unread">
          <List
            itemLayout="horizontal"
            dataSource={messageData.filter(item => !item.read)}
            renderItem={renderMessageItem}
            locale={{ emptyText: <Empty description="暂无未读消息" /> }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
  
  // 渲染服务记录页
  const renderServicesContent = () => (
    <Card>
      <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>服务申请记录</Title>
      <Tabs defaultActiveKey="all">
        <TabPane tab="全部" key="all">
          <List
            itemLayout="horizontal"
            dataSource={serviceRecords}
            renderItem={renderServiceItem}
            locale={{ emptyText: <Empty description="暂无服务记录" /> }}
          />
        </TabPane>
        <TabPane tab="进行中" key="ongoing">
          <List
            itemLayout="horizontal"
            dataSource={serviceRecords.filter(item => 
              item.status === 'processing' || item.status === 'approved'
            )}
            renderItem={renderServiceItem}
            locale={{ emptyText: <Empty description="暂无进行中的服务" /> }}
          />
        </TabPane>
        <TabPane tab="已完成" key="completed">
          <List
            itemLayout="horizontal"
            dataSource={serviceRecords.filter(item => item.status === 'completed')}
            renderItem={renderServiceItem}
            locale={{ emptyText: <Empty description="暂无已完成的服务" /> }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
  
  // 渲染账号设置页
  const renderSettingsContent = () => (
    <Card>
      <Title level={4} style={{ marginTop: 0, marginBottom: 24 }}>账号设置</Title>
      
      <Card
        type="inner"
        title="修改密码"
        style={{ marginBottom: 24 }}
      >
        <Form layout="vertical">
          <Form.Item name="oldPassword" label="当前密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="confirmPassword" label="确认新密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary">修改密码</Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Card
        type="inner"
        title="安全设置"
        style={{ marginBottom: 24 }}
      >
        <List>
          <List.Item
            actions={[<Button type="link">修改</Button>]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<PhoneOutlined />} style={{ backgroundColor: '#1890ff' }} />}
              title="手机绑定"
              description={userRole === 'enterprise' ? enterpriseInitialValues.phone : 
                          userRole === 'employee' ? employeeInitialValues.phone : 
                          publicInitialValues.phone}
            />
          </List.Item>
          <List.Item
            actions={[<Button type="link">修改</Button>]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<MailOutlined />} style={{ backgroundColor: '#52c41a' }} />}
              title="邮箱绑定"
              description={userRole === 'enterprise' ? enterpriseInitialValues.email : 
                          userRole === 'employee' ? employeeInitialValues.email : 
                          publicInitialValues.email}
            />
          </List.Item>
        </List>
      </Card>
      
      <Divider />
      
      <Button danger icon={<LogoutOutlined />} onClick={logout}>
        退出登录
      </Button>
    </Card>
  );
  
  // 根据选中的tab渲染内容
  const renderContent = () => {
    switch (activeKey) {
      case 'profile':
        return renderProfileContent();
      case 'messages':
        return renderMessagesContent();
      case 'reservations':
        return renderReservationsContent();
      case 'activities':
        return renderActivitiesContent();
      case 'applications':
        return renderApplicationsContent();
      case 'access':
        return renderAccessContent();
      case 'parking-cards':
        return renderParkingCardsContent();
      case 'settings':
        return renderSettingsContent();
      case 'employees':
        return renderEmployeesContent();
      default:
        return renderProfileContent();
    }
  };

  // 渲染我的预订内容
  const renderReservationsContent = () => (
    <Card>
      <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>我的预订</Title>
      <Tabs defaultActiveKey="meeting">
        <TabPane tab="会议室预订" key="meeting">
          <List
            itemLayout="horizontal"
            dataSource={[]}
            renderItem={() => <></>}
            locale={{ emptyText: <Empty description="暂无会议室预订记录" /> }}
          />
        </TabPane>
        <TabPane tab="空调加时预订" key="ac">
          <List
            itemLayout="horizontal"
            dataSource={[]}
            renderItem={() => <></>}
            locale={{ emptyText: <Empty description="暂无空调加时预订记录" /> }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );

  // 渲染我的活动内容
  const renderActivitiesContent = () => (
    <Card>
      <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>我的活动</Title>
      <List
        itemLayout="horizontal"
        dataSource={[]}
        renderItem={() => <></>}
        locale={{ emptyText: <Empty description="暂无活动记录" /> }}
      />
    </Card>
  );

  // 渲染我的申请内容
  const renderApplicationsContent = () => (
    <Card>
      <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>我的申请</Title>
      <List
        itemLayout="horizontal"
        dataSource={serviceRecords}
        renderItem={renderServiceItem}
        locale={{ emptyText: <Empty description="暂无申请记录" /> }}
      />
    </Card>
  );

  // 渲染我的门禁内容
  const renderAccessContent = () => (
    <Card>
      <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>我的门禁</Title>
      <Tabs defaultActiveKey="my-access">
        <TabPane tab="我的门禁" key="my-access">
          <List
            itemLayout="horizontal"
            dataSource={[]}
            renderItem={() => <></>}
            locale={{ emptyText: <Empty description="暂无门禁记录" /> }}
          />
        </TabPane>
        <TabPane tab="访客门禁审批" key="visitor-approval">
          <List
            itemLayout="horizontal"
            dataSource={[]}
            renderItem={() => <></>}
            locale={{ emptyText: <Empty description="暂无待审批的访客门禁申请" /> }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );

  // 渲染我的月卡内容
  const renderParkingCardsContent = () => (
    <Card>
      <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>我的月卡</Title>
      <List
        itemLayout="horizontal"
        dataSource={[]}
        renderItem={() => <></>}
        locale={{ emptyText: <Empty description="暂无停车月卡记录" /> }}
      />
    </Card>
  );

  // 渲染我的员工内容 (仅企业管理员可见)
  const renderEmployeesContent = () => (
    <Card>
      <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>我的员工</Title>
      {userRole === 'enterprise' ? (
        <List
          itemLayout="horizontal"
          dataSource={[]}
          renderItem={() => <></>}
          locale={{ emptyText: <Empty description="暂无员工记录" /> }}
        />
      ) : (
        <Result
          status="403"
          title="无访问权限"
          subTitle="只有企业管理员可以访问此功能"
        />
      )}
    </Card>
  );
  
  return (
    <Layout className="user-center-layout" style={{ minHeight: 'calc(100vh - 192px)', background: '#f0f2f5' }}>
      <Sider width={240} theme="light" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          style={{ height: '100%' }}
          onClick={e => handleTabChange(e.key)}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: (
              <span>
                {item.label}
                {item.badge && item.badge > 0 && (
                  <Badge count={item.badge} style={{ marginLeft: 8 }} />
                )}
              </span>
            ),
          }))}
        />
      </Sider>
      <Content style={{ padding: '24px', overflowY: 'auto' }}>
        {renderContent()}
      </Content>
    </Layout>
  );
};

export default UserCenter; 