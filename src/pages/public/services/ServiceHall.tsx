import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Tag, 
  Divider,
  Empty,
  Input,
  Tabs,
  Badge
} from 'antd';
import { 
  HomeOutlined, 
  ToolOutlined, 
  RocketOutlined, 
  DollarOutlined,
  CarOutlined,
  IdcardOutlined,
  ApartmentOutlined,
  TeamOutlined,
  FileTextOutlined,
  BuildOutlined,
  BellOutlined,
  BookOutlined,
  SearchOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import { PermissionAction } from '../../../constants/permissions';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

// 定义服务项目接口
interface ServiceItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  path: string;
  permission: PermissionAction; // 使用PermissionAction替代roles
  category: string;
  isNew?: boolean;
  isHot?: boolean;
}

// 服务类别颜色映射
const categoryMap: Record<string, { name: string, color: string }> = {
  property: { name: '物业服务', color: 'blue' },
  facility: { name: '配套服务', color: 'purple' },
  growth: { name: '成长服务', color: 'green' },
  valueAdded: { name: '增值服务', color: 'orange' },
};

// 服务项目列表 - 添加了权限控制
const serviceItems: ServiceItem[] = [
  // 物业服务
  {
    id: 'event-report',
    name: '事件上报',
    icon: <BellOutlined />,
    description: '提交园区事件报告，及时处理紧急情况',
    path: '/portal/services/event-report',
    permission: PermissionAction.REPORT_MAINTENANCE,
    category: 'property'
  },
  {
    id: 'maintenance',
    name: '维修申报',
    icon: <ToolOutlined />,
    description: '提交物业报修申请，快速解决设施故障问题',
    path: '/portal/services/maintenance',
    permission: PermissionAction.REPORT_MAINTENANCE,
    category: 'property',
    isHot: true
  },
  {
    id: 'enter-application',
    name: '入驻申请',
    icon: <HomeOutlined />,
    description: '申请入驻园区',
    path: '/portal/services/enter-application',
    permission: PermissionAction.REQUEST_VISITOR_ACCESS,
    category: 'property',
    isNew: true
  },
  {
    id: 'lease-termination',
    name: '退租申请',
    icon: <HomeOutlined />,
    description: '办理企业或个人退租手续',
    path: '/portal/services/lease-termination',
    permission: PermissionAction.APPLY_CONTRACT_CHANGE,
    category: 'property'
  },
  {
    id: 'park-exit',
    name: '退园申请',
    icon: <HomeOutlined />,
    description: '办理企业或个人退园手续',
    path: '/portal/services/park-exit',
    permission: PermissionAction.APPLY_CONTRACT_CHANGE,
    category: 'property'
  },
  
  // 配套服务
  {
    id: 'join-enterprise',
    name: '加入企业',
    icon: <TeamOutlined />,
    description: '员工申请加入企业，获取门禁权限',
    path: '/portal/services/join-enterprise',
    permission: PermissionAction.REQUEST_VISITOR_ACCESS,
    category: 'facility'
  },
  {
    id: 'visitor-access',
    name: '访客门禁申请',
    icon: <IdcardOutlined />,
    description: '为访客申请门禁权限，由被访人审批',
    path: '/portal/services/visitor-access',
    permission: PermissionAction.INVITE_VISITORS,
    category: 'facility'
  },
  {
    id: 'meeting-room',
    name: '会议室预订',
    icon: <TeamOutlined />,
    description: '预约园区内的会议室资源',
    path: '/portal/services/meeting-room',
    permission: PermissionAction.BOOK_MEETING_ROOM,
    category: 'facility',
    isHot: true
  },
  {
    id: 'parking-space',
    name: '车位查询',
    icon: <CarOutlined />,
    description: '实时查询园区停车场可用车位',
    path: '/portal/services/parking-space',
    permission: PermissionAction.VIEW_ACTIVITIES,
    category: 'facility'
  },
  {
    id: 'temp-parking',
    name: '临停缴费',
    icon: <CarOutlined />,
    description: '临时停车费查询与缴纳',
    path: '/portal/services/temp-parking',
    permission: PermissionAction.VIEW_ACTIVITIES,
    category: 'facility'
  },
  {
    id: 'parking-card',
    name: '停车月卡',
    icon: <CarOutlined />,
    description: '购买停车月卡，享受优惠价格',
    path: '/portal/services/parking-card',
    permission: PermissionAction.APPLY_ENTERPRISE_SERVICE,
    category: 'facility',
    isHot: true
  },
  {
    id: 'enterprise-qrcode',
    name: '企业停车码',
    icon: <QrcodeOutlined />,
    description: '查看和管理企业访客停车二维码',
    path: '/portal/services/enterprise-qrcode',
    permission: PermissionAction.MANAGE_EMPLOYEES,
    category: 'facility',
    isNew: true
  },
  {
    id: 'ac-extension',
    name: '空调加时',
    icon: <BuildOutlined />,
    description: '非工作时间申请使用空调服务',
    path: '/portal/services/ac-extension',
    permission: PermissionAction.APPLY_ENTERPRISE_SERVICE,
    category: 'facility'
  },
  {
    id: 'electricity-prepay',
    name: '电费预充',
    icon: <DollarOutlined />,
    description: '提前缴纳电费，确保用电不中断',
    path: '/portal/services/electricity-prepay',
    permission: PermissionAction.PAY_BILLS,
    category: 'facility'
  },
  {
    id: 'prepayment',
    name: '充值预付款',
    icon: <DollarOutlined />,
    description: '提前充值预付款，用于园区各项服务',
    path: '/portal/services/prepayment',
    permission: PermissionAction.PAY_BILLS,
    category: 'facility',
    isNew: true
  },
  {
    id: 'bill-payment',
    name: '账单缴费',
    icon: <FileTextOutlined />,
    description: '查看并支付企业各项费用账单',
    path: '/portal/services/bill-payment',
    permission: PermissionAction.PAY_BILLS,
    category: 'facility'
  },
  
  // 成长服务
  {
    id: 'enterprise-registration',
    name: '企业注册申请',
    icon: <ApartmentOutlined />,
    description: '提供企业注册、变更等相关服务',
    path: '/portal/services/enterprise-registration',
    permission: PermissionAction.VIEW_ENTERPRISE_INFO,
    category: 'growth',
    isNew: true
  },
  {
    id: 'financing-service',
    name: '融资服务申请',
    icon: <DollarOutlined />,
    description: '为园区企业提供融资对接服务',
    path: '/portal/services/financing-service',
    permission: PermissionAction.APPLY_ENTERPRISE_SERVICE,
    category: 'growth'
  },
  
  // 增值服务
  {
    id: 'lab-application',
    name: '实验室申请',
    icon: <RocketOutlined />,
    description: '申请使用园区专业实验室资源',
    path: '/portal/services/lab-application',
    permission: PermissionAction.APPLY_ENTERPRISE_SERVICE,
    category: 'valueAdded'
  },
  {
    id: 'computing-power',
    name: '普惠算力申请',
    icon: <RocketOutlined />,
    description: '申请使用园区计算资源服务',
    path: '/portal/services/computing-power',
    permission: PermissionAction.APPLY_ENTERPRISE_SERVICE,
    category: 'valueAdded',
    isNew: true
  }
];

const ServiceHall: React.FC = () => {
  const { userRole, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // 使用useMemo优化过滤逻辑
  const filteredServices = useMemo(() => {
    // 首先根据用户权限过滤
    let result = serviceItems.filter(item => 
      hasPermission(item.permission)
    );
    
    // 然后根据搜索文本过滤
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(lowerSearchText) || 
        item.description.toLowerCase().includes(lowerSearchText)
      );
    }
    
    // 最后根据选中的标签过滤
    if (activeTab !== 'all') {
      result = result.filter(item => item.category === activeTab);
    }
    
    return result;
  }, [userRole, searchText, activeTab, hasPermission]);

  // 处理服务卡片点击
  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  // 渲染服务卡片
  const renderServiceCard = (service: ServiceItem) => {
    const categoryColor = categoryMap[service.category].color;
    const iconColor = 
      categoryColor === 'blue' ? '#1890ff' :
      categoryColor === 'purple' ? '#722ed1' :
      categoryColor === 'green' ? '#52c41a' : '#fa8c16';
    
    return (
      <Card 
        hoverable 
        onClick={() => handleServiceClick(service.path)}
        className="service-card"
      >
        <div className="service-card-content">
          <div className="service-icon" style={{ color: iconColor }}>
            {service.icon}
          </div>
          <div className="service-info">
            <Title level={5} className="service-title">
              {service.name}
              {service.isNew && <Badge count="新" style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />}
              {service.isHot && <Badge count="热门" style={{ backgroundColor: '#f5222d', marginLeft: 8 }} />}
            </Title>
            <Paragraph type="secondary" className="service-description">
              {service.description}
            </Paragraph>
            <Tag color={categoryColor} className="service-tag">
              {categoryMap[service.category].name}
            </Tag>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="service-hall">
      <div className="service-hall-header">
        <div className="service-hall-title">
          <Title level={2}>服务大厅</Title>
          <Paragraph>欢迎使用湘江科创基地服务大厅，为您提供全方位的园区服务</Paragraph>
        </div>
        <div className="service-hall-search">
          <Search
            placeholder="搜索服务"
            allowClear
            onSearch={value => setSearchText(value)}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
        </div>
      </div>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="service-tabs">
        <TabPane tab="全部服务" key="all" />
        <TabPane tab="物业服务" key="property" />
        <TabPane tab="配套服务" key="facility" />
        <TabPane tab="成长服务" key="growth" />
        <TabPane tab="增值服务" key="valueAdded" />
      </Tabs>
      
      {filteredServices.length === 0 ? (
        <Empty description="没有找到匹配的服务" />
      ) : (
        <Row gutter={[16, 16]} className="service-grid">
          {filteredServices.map(service => (
            <Col xs={24} sm={12} md={8} lg={6} key={service.id}>
              {renderServiceCard(service)}
            </Col>
          ))}
        </Row>
      )}

      <style>
        {`
         .service-hall {
           padding: 24px;
         }
         
         .service-hall-header {
           display: flex;
           justify-content: space-between;
           align-items: flex-start;
           flex-wrap: wrap;
           margin-bottom: 24px;
         }
         
         .service-hall-title {
           flex: 1;
         }
         
         .service-card {
           height: 100%;
           transition: all 0.3s;
           border-radius: 12px;
           overflow: hidden;
         }
         
         .service-card:hover {
           transform: translateY(-5px);
           box-shadow: 0 8px 24px rgba(15, 38, 69, 0.12);
         }
         
         .service-card-content {
           display: flex;
           flex-direction: column;
           align-items: center;
           text-align: center;
         }
         
         .service-icon {
           font-size: 48px;
           margin-bottom: 16px;
         }
         
         .service-title {
           margin-bottom: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
         }
         
         .service-description {
           margin-bottom: 16px;
         }
         
         .service-tabs {
           margin-bottom: 24px;
         }
         
         @media (max-width: 768px) {
           .service-hall-header {
             flex-direction: column;
           }
           
           .service-hall-search {
             margin-top: 16px;
             width: 100%;
           }
           
           .service-hall-search .ant-input-search {
             width: 100% !important;
           }
         }
        `}
      </style>
    </div>
  );
};

export default ServiceHall; 