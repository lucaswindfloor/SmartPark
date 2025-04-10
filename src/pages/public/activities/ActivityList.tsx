import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  List, 
  Tag, 
  Space, 
  Button, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Input, 
  Empty,
  Typography,
  Image
} from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 定义活动接口
interface ActivityItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  endDate: string;
  location: string;
  organizer: string;
  category: string;
  status: '未开始' | '进行中' | '已结束';
  isTop: boolean;
  participants?: number;
  maxParticipants?: number;
}

const ActivityList: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // 活动数据
  const activities: ActivityItem[] = [
    {
      id: 1,
      title: '2024年科技创新峰会',
      description: '汇聚行业精英，探讨最前沿的科技创新趋势，共同展望未来科技发展方向。',
      image: 'https://via.placeholder.com/800x300/1890ff/FFFFFF?text=2024年科技创新峰会',
      date: '2024-10-15',
      endDate: '2024-10-16',
      location: '创新中心多功能厅',
      organizer: '园区管理委员会',
      category: '行业峰会',
      status: '未开始',
      isTop: true,
      participants: 120,
      maxParticipants: 200
    },
    {
      id: 2,
      title: '人工智能技术交流会',
      description: '探讨人工智能技术最新应用与发展趋势，分享AI领域的最新研究成果和实践经验。',
      image: 'https://via.placeholder.com/800x300/52c41a/FFFFFF?text=人工智能技术交流会',
      date: '2024-09-28',
      endDate: '2024-09-28',
      location: '科技楼报告厅',
      organizer: 'AI创新实验室',
      category: '技术交流',
      status: '未开始',
      isTop: true,
      participants: 85,
      maxParticipants: 150
    },
    {
      id: 3,
      title: '创业项目路演活动',
      description: '为园区创业企业提供展示平台，帮助优质项目获得投资人关注和资金支持。',
      image: 'https://via.placeholder.com/800x300/722ed1/FFFFFF?text=创业项目路演活动',
      date: '2024-09-20',
      endDate: '2024-09-20',
      location: '创业孵化中心路演厅',
      organizer: '创业服务部',
      category: '创业路演',
      status: '未开始',
      isTop: false,
      participants: 60,
      maxParticipants: 100
    },
    {
      id: 4,
      title: '企业家沙龙第三期',
      description: '邀请成功企业家分享创业心得与管理经验，促进企业家之间的交流与合作。',
      image: 'https://via.placeholder.com/800x300/faad14/FFFFFF?text=企业家沙龙第三期',
      date: '2024-09-15',
      endDate: '2024-09-15',
      location: '湘江会议中心',
      organizer: '企业服务部',
      category: '沙龙交流',
      status: '未开始',
      isTop: false,
      participants: 40,
      maxParticipants: 50
    },
    {
      id: 5,
      title: '高校人才招聘会',
      description: '为园区企业提供招聘平台，连接高校优秀毕业生与企业用人需求。',
      image: 'https://via.placeholder.com/800x300/eb2f96/FFFFFF?text=高校人才招聘会',
      date: '2024-09-10',
      endDate: '2024-09-10',
      location: '科创园广场',
      organizer: '人才服务中心',
      category: '招聘活动',
      status: '未开始',
      isTop: false,
      participants: 200,
      maxParticipants: 500
    },
    {
      id: 6,
      title: '知识产权保护讲座',
      description: '邀请专业律师讲解知识产权保护相关法律知识，提高企业知识产权保护意识。',
      image: 'https://via.placeholder.com/800x300/13c2c2/FFFFFF?text=知识产权保护讲座',
      date: '2024-09-05',
      endDate: '2024-09-05',
      location: '科技楼培训室',
      organizer: '法律服务部',
      category: '培训讲座',
      status: '未开始',
      isTop: false,
      participants: 50,
      maxParticipants: 80
    },
    {
      id: 7,
      title: '创新方法培训课程',
      description: '系统介绍TRIZ等创新方法理论，帮助企业技术人员掌握创新思维工具。',
      image: 'https://via.placeholder.com/800x300/f5222d/FFFFFF?text=创新方法培训课程',
      date: '2024-08-28',
      endDate: '2024-08-28',
      location: '创新中心培训室',
      organizer: '创新服务部',
      category: '培训讲座',
      status: '已结束',
      isTop: false,
      participants: 65,
      maxParticipants: 80
    },
    {
      id: 8,
      title: '企业融资对接会',
      description: '搭建企业与投资机构交流平台，促进优质项目与资本有效对接。',
      image: 'https://via.placeholder.com/800x300/fa8c16/FFFFFF?text=企业融资对接会',
      date: '2024-08-20',
      endDate: '2024-08-20',
      location: '湘江会议中心',
      organizer: '金融服务部',
      category: '融资对接',
      status: '已结束',
      isTop: false,
      participants: 75,
      maxParticipants: 100
    }
  ];

  // 获取所有活动分类
  const categories = Array.from(new Set(activities.map(item => item.category)));

  // 过滤活动数据
  const filteredActivities = activities.filter(activity => {
    // 搜索过滤
    if (searchText && !activity.title.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }

    // 状态过滤
    if (statusFilter && activity.status !== statusFilter) {
      return false;
    }

    // 分类过滤
    if (categoryFilter && activity.category !== categoryFilter) {
      return false;
    }

    // 日期过滤
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      return activity.date >= startDate && activity.date <= endDate;
    }

    return true;
  });

  // 处理详情查看
  const handleViewDetails = (id: number) => {
    navigate(`/portal/activities/${id}`);
  };

  // 渲染活动状态标签
  const renderStatusTag = (status: string) => {
    let color = '';
    switch (status) {
      case '未开始':
        color = 'blue';
        break;
      case '进行中':
        color = 'green';
        break;
      case '已结束':
        color = 'gray';
        break;
      default:
        color = 'blue';
    }
    return <Tag color={color}>{status}</Tag>;
  };

  return (
    <div className="activity-list-page">
      <Card title="园区活动" className="filter-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Input 
              prefix={<SearchOutlined />} 
              placeholder="搜索活动" 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="选择活动状态"
              style={{ width: '100%' }}
              allowClear
              onChange={value => setStatusFilter(value)}
            >
              <Option value="未开始">未开始</Option>
              <Option value="进行中">进行中</Option>
              <Option value="已结束">已结束</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="选择活动类型"
              style={{ width: '100%' }}
              allowClear
              onChange={value => setCategoryFilter(value)}
            >
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <RangePicker 
              style={{ width: '100%' }} 
              placeholder={['开始日期', '结束日期']}
              onChange={value => setDateRange(value)}
            />
          </Col>
        </Row>
      </Card>

      {filteredActivities.length > 0 ? (
        <List
          grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
          dataSource={filteredActivities}
          renderItem={item => (
            <List.Item>
              <Card 
                hoverable
                cover={<Image alt={item.title} src={item.image} />}
                className="activity-card"
              >
                <div className="activity-card-body">
                  <div className="activity-title">
                    {item.isTop && <Tag color="#f50">置顶</Tag>}
                    {renderStatusTag(item.status)}
                    <Title level={4}>{item.title}</Title>
                  </div>
                  
                  <Paragraph ellipsis={{ rows: 2 }} className="activity-description">
                    {item.description}
                  </Paragraph>
                  
                  <div className="activity-info">
                    <Space direction="vertical" size={8}>
                      <Space>
                        <CalendarOutlined /> {item.date} {item.endDate !== item.date ? `至 ${item.endDate}` : ''}
                      </Space>
                      <Space>
                        <EnvironmentOutlined /> {item.location}
                      </Space>
                      <Space>
                        <UserOutlined /> 主办方: {item.organizer}
                      </Space>
                    </Space>
                  </div>
                  
                  <div className="activity-footer">
                    <Space>
                      <span>已报名: {item.participants}/{item.maxParticipants}</span>
                      <Button 
                        type="primary" 
                        onClick={() => handleViewDetails(item.id)}
                      >
                        查看详情
                      </Button>
                    </Space>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
          pagination={{
            pageSize: 6,
            total: filteredActivities.length,
            showTotal: total => `共 ${total} 个活动`
          }}
        />
      ) : (
        <Empty description="没有找到符合条件的活动" />
      )}

      <style>
        {`
          .activity-list-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px 16px;
          }
          
          .filter-card {
            margin-bottom: 24px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }
          
          .activity-card {
            height: 100%;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
          }
          
          .activity-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }
          
          .activity-card-body {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          
          .activity-title {
            margin-bottom: 12px;
          }
          
          .activity-title h4 {
            margin-top: 8px;
            margin-bottom: 0;
          }
          
          .activity-description {
            margin-bottom: 16px;
            flex-grow: 1;
          }
          
          .activity-info {
            margin-bottom: 16px;
          }
          
          .activity-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
          }
          
          @media (max-width: 576px) {
            .activity-list-page {
              padding: 16px 8px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ActivityList; 