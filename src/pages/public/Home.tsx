import React, { useState } from 'react';
import { Row, Col, Card, Carousel, List, Tag, Statistic, Button, Alert, Badge, Space, Tabs, Timeline, Image, Modal, Form, Input, message, Empty } from 'antd';
import { 
  CalendarOutlined, 
  NotificationOutlined, 
  FileTextOutlined,
  RightOutlined,
  BellOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  AppstoreOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useAuth, PermissionAction } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './home.css'; // Import CSS file for custom styling

const { TabPane } = Tabs;

// 定义接口
interface ActivityItem {
  id: number;
  title: string;
  image: string;
  date: string;
  isTop: boolean;
  endTime: string;
  link: string;
  location?: string;
}

interface ServiceItem {
  icon: string;
  title: string;
  path: string;
  type: 'property' | 'facility' | 'growth' | 'value-added';
  permission: PermissionAction;
}

const Home: React.FC = () => {
  const { userRole, hasPermission, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('intro');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 未读消息数量（模拟数据）
  const unreadCount = 3;
  
  // 园区活动轮播内容
  const carouselItems: ActivityItem[] = [
    {
      id: 1,
      title: '2024年科技创新峰会',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
      date: '2024-10-15',
      isTop: true,
      endTime: '2024-10-16',
      link: '/portal/activities/1',
      location: '创新中心多功能厅'
    },
    {
      id: 2,
      title: '人工智能技术交流会',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      date: '2024-09-28',
      isTop: true,
      endTime: '2024-09-28',
      link: '/portal/activities/2',
      location: '科技楼报告厅'
    },
    {
      id: 3,
      title: '创业项目路演活动',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop',
      date: '2024-09-20',
      isTop: false,
      endTime: '2024-09-20',
      link: '/portal/activities/3',
      location: '创业孵化中心路演厅'
    },
    {
      id: 4,
      title: '企业家沙龙第三期',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2026&auto=format&fit=crop',
      date: '2024-09-15',
      isTop: false,
      endTime: '2024-09-15',
      link: '/portal/activities/4',
      location: '湘江会议中心'
    }
  ];

  // 服务菜单配置
  const commonServices: ServiceItem[] = [
    { icon: '⚡', title: '电费预充', path: '/portal/services/electricity', type: 'facility', permission: PermissionAction.PAY_BILLS },
    { icon: '💰', title: '充值预付款', path: '/portal/services/prepay', type: 'facility', permission: PermissionAction.PAY_BILLS },
    { icon: '📄', title: '账单缴费', path: '/portal/services/bills', type: 'facility', permission: PermissionAction.PAY_BILLS },
    { icon: '❄️', title: '空调加时', path: '/portal/services/ac', type: 'facility', permission: PermissionAction.APPLY_ENTERPRISE_SERVICE },
    { icon: '🏢', title: '会议室预订', path: '/portal/services/meeting', type: 'facility', permission: PermissionAction.BOOK_MEETING_ROOM },
    { icon: '🚗', title: '停车月卡', path: '/portal/services/parking', type: 'facility', permission: PermissionAction.APPLY_ENTERPRISE_SERVICE },
    { icon: '⚠️', title: '事件上报', path: '/portal/services/report', type: 'property', permission: PermissionAction.REPORT_MAINTENANCE },
    { icon: '🔧', title: '维修申报', path: '/portal/services/maintenance', type: 'property', permission: PermissionAction.REPORT_MAINTENANCE }
  ];

  // 园区发展历程
  const historyItems = [
    { year: '2020', title: '园区成立', content: '湘江科创基地正式成立' },
    { year: '2021', title: '基础建设', content: '完成一期工程建设，引入首批企业' },
    { year: '2022', title: '快速发展', content: '入驻企业突破50家，建立产业集群' },
    { year: '2023', title: '创新升级', content: '智慧园区系统上线，服务升级' },
    { year: '2024', title: '产业集聚', content: '重点产业规模突破100亿' }
  ];

  // 园区相册
  const parkImages = [
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', title: '园区鸟瞰图' },
    { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2070&auto=format&fit=crop', title: '创新中心' },
    { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop', title: '产业园区' },
    { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop', title: '休闲广场' },
    { url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2074&auto=format&fit=crop', title: '科技展示中心' },
    { url: 'https://images.unsplash.com/photo-1562516710-58fc45060d76?q=80&w=2069&auto=format&fit=crop', title: '智能会议室' }
  ];

  // 处理房源意向登记
  const handleSpaceInterest = (values: any) => {
    console.log('房源意向登记:', values);
    message.success('登记成功，我们会尽快与您联系！');
    setIsModalVisible(false);
  };

  // 渲染园区展示内容
  const renderParkContent = () => {
    switch (activeTab) {
      case 'intro':
        return (
          <>
            <p>湘江科创基地位于长沙市岳麓区，总面积约50万平方米，是集科技研发、创新创业、产业加速于一体的综合性科技园区...</p>
            <Row gutter={16} style={{marginTop: 16}}>
              <Col span={8}>
                <Statistic title="入驻企业" value={108} suffix="家" />
              </Col>
              <Col span={8}>
                <Statistic title="孵化项目" value={256} suffix="个" />
              </Col>
              <Col span={8}>
                <Statistic title="服务设施" value={35} suffix="处" />
              </Col>
            </Row>
          </>
        );
      case 'history':
        return (
          <Timeline mode="left">
            {historyItems.map(item => (
              <Timeline.Item key={item.year} label={item.year}>
                <h4>{item.title}</h4>
                <p>{item.content}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        );
      case 'gallery':
        return (
          <>
            <Carousel autoplay className="gallery-carousel" style={{ marginBottom: '20px' }}>
              {parkImages.slice(0, 3).map((image, index) => (
                <div key={index}>
                  <div style={{ height: '300px', background: `url(${image.url}) center center / cover no-repeat` }}>
                    <div className="carousel-overlay">
                      <h3>{image.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
            <Image.PreviewGroup>
              <Row gutter={[16, 16]}>
                {parkImages.map((image, index) => (
                  <Col span={8} key={index}>
                    <Image 
                      src={image.url} 
                      alt={image.title} 
                      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <p style={{ textAlign: 'center', marginTop: '8px' }}>{image.title}</p>
                  </Col>
                ))}
              </Row>
            </Image.PreviewGroup>
          </>
        );
      case 'facilities':
        return (
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={[
              { title: '智能门禁系统', desc: '24小时智能化门禁管理' },
              { title: '智慧停车场', desc: '车位引导、无感支付' },
              { title: '会议室预订', desc: '多功能会议室、报告厅' },
              { title: '休闲健身区', desc: '健身房、咖啡厅、阅读区' }
            ]}
            renderItem={item => (
              <List.Item>
                <Card title={item.title}>{item.desc}</Card>
              </List.Item>
            )}
          />
        );
      case 'spaces':
        return (
          <>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>湘江科创基地在售/在租房源</h3>
                  <p>为您提供多样化的办公空间选择，满足不同企业需求</p>
                </div>
              </Col>
              
              {[
                { 
                  title: 'A1栋创业中心', 
                  area: '50-200㎡', 
                  type: '精装办公', 
                  price: '3-3.5元/㎡/天',
                  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
                  features: ['5G网络', '24小时门禁', '免费会议室', '园区班车']
                },
                { 
                  title: 'B2栋研发楼', 
                  area: '200-500㎡', 
                  type: '研发空间', 
                  price: '3.5-4元/㎡/天',
                  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
                  features: ['电梯直达', '超大承重', '独立空调', '可24小时用电']
                },
                { 
                  title: 'C3栋产业楼', 
                  area: '500-2000㎡', 
                  type: '生产研发一体', 
                  price: '2.5-3元/㎡/天',
                  image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=2070&auto=format&fit=crop',
                  features: ['大货梯', '独立水电', '可环评', '高承重']
                }
              ].map((item, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card 
                    hoverable 
                    cover={<img alt={item.title} src={item.image} style={{ height: '180px', objectFit: 'cover' }} />}
                    actions={[
                      <Button key="view" type="link">查看详情</Button>,
                      <Button key="register" type="primary" onClick={() => setIsModalVisible(true)}>登记意向</Button>
                    ]}
                  >
                    <Card.Meta 
                      title={item.title}
                      description={
                        <>
                          <p><strong>面积：</strong>{item.area}</p>
                          <p><strong>类型：</strong>{item.type}</p>
                          <p><strong>价格：</strong>{item.price}</p>
                          <div>
                            {item.features.map((feature, i) => (
                              <Tag key={i} color="blue" style={{ margin: '0 4px 4px 0' }}>{feature}</Tag>
                            ))}
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
              
              <Col span={24} style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button type="primary" size="large" icon={<UserOutlined />} onClick={() => setIsModalVisible(true)}>
                  我要登记意向
                </Button>
                <p style={{ marginTop: '10px', color: '#666' }}>登记后，专业顾问将为您提供一对一咨询服务</p>
              </Col>
            </Row>
          </>
        );
      default:
        return null;
    }
  };
  
  // 根据角色渲染不同的快捷服务卡片
  const renderRoleSpecificCards = () => {
    switch(userRole) {
      case 'enterprise':
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card title="企业账单" extra={<Button type="link">查看全部 <RightOutlined /></Button>}>
                <Statistic title="本月待缴账单" value={12600} precision={2} prefix="¥" />
                <Button type="primary" style={{marginTop: 16}}>立即缴费</Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="员工管理" extra={<Button type="link">查看全部 <RightOutlined /></Button>}>
                <Statistic title="待审批申请" value={3} />
                <Button type="primary" style={{marginTop: 16}}>审批管理</Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="企业服务" extra={<Button type="link">查看全部 <RightOutlined /></Button>}>
                <List
                  size="small"
                  dataSource={['电费预充', '空调加时', '会议室预订']}
                  renderItem={item => <List.Item><Button type="link">{item}</Button></List.Item>}
                />
              </Card>
            </Col>
          </Row>
        );
        
      case 'employee':
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card title="会议室预订" extra={<Button type="link">查看全部 <RightOutlined /></Button>}>
                <List
                  size="small"
                  dataSource={[
                    {title: '今日会议', count: 2},
                    {title: '明日会议', count: 1}
                  ]}
                  renderItem={item => <List.Item>{item.title}: {item.count}场</List.Item>}
                />
                <Button type="primary" style={{marginTop: 16}}>预订会议室</Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="我的申请" extra={<Button type="link">查看全部 <RightOutlined /></Button>}>
                <List
                  size="small"
                  dataSource={[
                    {title: '待审批', status: 'processing', count: 1},
                    {title: '已通过', status: 'success', count: 5}
                  ]}
                  renderItem={item => <List.Item>{item.title}: <Tag color={item.status === 'processing' ? 'blue' : 'green'}>{item.count}</Tag></List.Item>}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="常用服务" extra={<Button type="link">更多服务 <RightOutlined /></Button>}>
                <List
                  grid={{ gutter: 16, column: 3 }}
                  dataSource={[
                    {icon: '🛠️', title: '报修'},
                    {icon: '🚪', title: '访客'},
                    {icon: '🚗', title: '停车'}
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <Card size="small" hoverable style={{textAlign: 'center'}}>
                        <div style={{fontSize: 24}}>{item.icon}</div>
                        <div>{item.title}</div>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        );
        
      case 'public':
      default:
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Card title="园区简介" extra={<Button type="link">了解更多 <RightOutlined /></Button>}>
                <p>湘江科创基地位于长沙市岳麓区，总面积约50万平方米，是集科技研发、创新创业、产业加速于一体的综合性科技园区...</p>
                <Row gutter={16} style={{marginTop: 16}}>
                  <Col span={8}>
                    <Statistic title="入驻企业" value={108} suffix="家" />
                  </Col>
                  <Col span={8}>
                    <Statistic title="孵化项目" value={256} suffix="个" />
                  </Col>
                  <Col span={8}>
                    <Statistic title="服务设施" value={35} suffix="处" />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card title="我要入驻" extra={<Button type="link">咨询详情 <RightOutlined /></Button>}>
                <div style={{padding: '20px 0', textAlign: 'center'}}>
                  <Button size="large" type="primary" block>申请入驻</Button>
                  <div style={{marginTop: 16}}>
                    <Button type="link">查看房源</Button>
                    <Button type="link">预约参观</Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        );
    }
  };

  return (
    <div className="home-page">
      <Row gutter={[0, 24]}>
        {/* 消息提醒 - 只对已登录用户显示 */}
        {isAuthenticated ? (
          <Col span={24}>
            <Alert
              type="info"
              showIcon
              icon={<BellOutlined style={{ fontSize: 18, color: '#1890ff' }} />}
              message={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Space>
                    <Badge count={unreadCount} style={{ backgroundColor: '#f5222d' }} />
                    <span><strong>消息通知：</strong>您有 {unreadCount} 条未读消息，请及时查看</span>
                  </Space>
                  <Space>
                    <Button type="link" onClick={() => navigate('/portal/messages')}>
                      查看全部
                    </Button>
                    <Button type="text" icon={<RightOutlined />} />
                  </Space>
                </div>
              }
              className="message-alert"
              style={{ 
                backgroundColor: '#e6f7ff', 
                borderColor: '#91d5ff',
                padding: '12px 16px',
                borderRadius: '8px'
              }}
            />
          </Col>
        ) : (
          <Col span={24}>
            <Alert
              type="info"
              showIcon
              icon={<UserOutlined style={{ fontSize: 18, color: '#1890ff' }} />}
              message={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span>欢迎访问湘江科创基地！登录后可体验更多功能</span>
                  <Space>
                    <Button type="primary" onClick={() => navigate('/portal/login')}>
                      立即登录
                    </Button>
                    <Button type="link" onClick={() => navigate('/portal/services/enter-application')}>
                      申请入驻
                    </Button>
                  </Space>
                </div>
              }
              className="message-alert"
              style={{ 
                backgroundColor: '#f6ffed', 
                borderColor: '#b7eb8f',
                padding: '12px 16px',
                borderRadius: '8px'
              }}
            />
          </Col>
        )}

        {/* 园区活动轮播 */}
        <Col span={24}>
          <Card 
            title={<span className="card-title"><CalendarOutlined /> 园区活动</span>}
            extra={<Button type="link" onClick={() => navigate('/portal/activities')}>更多活动 <RightOutlined /></Button>}
            className="section-card"
          >
            <Carousel autoplay className="activity-carousel">
              {carouselItems
                .map(item => (
                  <div key={item.id} onClick={() => navigate(item.link)} style={{cursor: 'pointer'}}>
                    <div className="carousel-item" style={{ 
                    background: `url(${item.image})`, 
                      backgroundSize: 'cover'
                    }}>
                      <div className="carousel-overlay">
                        {item.isTop && <Tag color="#f50">置顶</Tag>}
                      <h3>{item.title}</h3>
                        <Space>
                          <ClockCircleOutlined /> {item.date}
                          <EnvironmentOutlined /> {item.location}
                        </Space>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </Card>
        </Col>
        
        {/* 快捷服务菜单 */}
        <Col span={24}>
          <Card 
            title={<span className="card-title"><AppstoreOutlined /> 常用服务</span>} 
            extra={<Button type="primary" onClick={() => navigate('/portal/services')}>更多服务 <RightOutlined /></Button>}
            className="section-card menu-card"
          >
            {commonServices.filter(item => hasPermission(item.permission)).length > 0 ? (
              <List
                grid={{ gutter: 24, column: 4, xs: 2, sm: 3, md: 4 }}
                dataSource={commonServices.filter(item => hasPermission(item.permission))}
                renderItem={item => (
                  <List.Item>
                    <Card 
                      hoverable 
                      onClick={() => navigate(item.path)}
                      className="service-item-card"
                    >
                      <div className="service-icon">{item.icon}</div>
                      <div className="service-title">{item.title}</div>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <div className="service-login-tip">
                <Empty
                  image={<AppstoreOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />}
                  description={
                    <span>
                      登录后可使用更多服务功能
                    </span>
                  }
                >
                  <Button type="primary" onClick={() => navigate('/portal/login')}>立即登录</Button>
                </Empty>
              </div>
            )}
          </Card>
        </Col>
        
        {/* 角色特定内容 */}
        <Col span={24}>
          {renderRoleSpecificCards()}
        </Col>
        
        {/* 信息公开 */}
        <Col span={24}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card 
                title={<span className="card-title"><NotificationOutlined /> 通知公告</span>}
                extra={<Button type="link" onClick={() => navigate('/portal/information/notice')}>更多公告 <RightOutlined /></Button>}
                className="section-card"
              >
                <List
                  size="small"
                  className="info-list"
                  dataSource={[
                    {id: 1, title: '关于举办2024年创新创业大赛的通知', date: '2024-09-10', isTop: true},
                    {id: 2, title: '第三季度安全生产检查工作安排', date: '2024-09-08', isTop: true},
                    {id: 3, title: '园区电梯维保工作通知', date: '2024-09-05'}
                  ]}
                  renderItem={item => (
                    <List.Item extra={item.date}>
                      <Space>
                        {item.isTop && <Tag color="#f50">置顶</Tag>}
                        <a onClick={() => navigate(`/portal/information/notice/${item.id}`)} className="info-link">{item.title}</a>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card 
                title={<span className="card-title"><FileTextOutlined /> 政策文件</span>}
                extra={<Button type="link" onClick={() => navigate('/portal/information/policy')}>更多政策 <RightOutlined /></Button>}
                className="section-card"
              >
                <List
                  size="small"
                  className="info-list"
                  dataSource={[
                    {id: 1, title: '科技型中小企业研发费用补贴申报指南', date: '2024-08-25', isTop: true},
                    {id: 2, title: '园区企业人才引进政策', date: '2024-08-15', isTop: true},
                    {id: 3, title: '创新创业孵化扶持计划实施细则', date: '2024-08-10'}
                  ]}
                  renderItem={item => (
                    <List.Item extra={item.date}>
                      <Space>
                        {item.isTop && <Tag color="#f50">置顶</Tag>}
                        <a onClick={() => navigate(`/portal/information/policy/${item.id}`)} className="info-link">{item.title}</a>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
          <div className="info-more-button">
            <Button 
              type="primary" 
              onClick={() => navigate('/portal/information')} 
              icon={<RightOutlined />}
            >
              查看全部信息公开
            </Button>
            <p>包含通知公告、政策文件、园区活动、需求发布、调查问卷等</p>
          </div>
        </Col>

        {/* 园区展示 */}
        <Col span={24}>
          <Card
            title={<span className="card-title"><HomeOutlined /> 园区展示</span>}
            className="section-card"
            tabList={[
              { key: 'intro', tab: '园区简介' },
              { key: 'history', tab: '发展历程' },
              { key: 'gallery', tab: '园区相册' },
              { key: 'facilities', tab: '服务配套' },
              { key: 'spaces', tab: '房源展示' }
            ]}
            activeTabKey={activeTab}
            onTabChange={key => setActiveTab(key)}
          >
            {renderParkContent()}
          </Card>
        </Col>
      </Row>

      {/* 房源意向登记弹窗 */}
      <Modal
        title="房源意向登记"
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form onFinish={handleSpaceInterest} layout="vertical">
          <Form.Item
            name="name"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人姓名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入联系人姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1\d{10}$/, message: '请输入正确的手机号码' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="requirement"
            label="意向需求"
            rules={[{ required: true, message: '请输入意向需求' }]}
          >
            <Input.TextArea placeholder="请描述您的具体需求（面积、用途等）" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交登记
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Home; 