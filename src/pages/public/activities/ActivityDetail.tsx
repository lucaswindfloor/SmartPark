import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Space, 
  Tag, 
  Button, 
  Row, 
  Col, 
  Divider, 
  Image,
  Progress,
  Modal,
  Form,
  Input,
  Radio,
  message,
  Spin
} from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  PhoneOutlined,
  MailOutlined,
  LeftOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

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
  content?: string;
}

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityItem | null>(null);
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟获取活动详情数据
  useEffect(() => {
    // 模拟API请求延迟
    const timer = setTimeout(() => {
      // 这里是模拟数据，实际应从API获取
      const activityData: ActivityItem = {
        id: Number(id),
        title: id === '1' ? '2024年科技创新峰会' : '人工智能技术交流会',
        description: id === '1' 
          ? '汇聚行业精英，探讨最前沿的科技创新趋势，共同展望未来科技发展方向。' 
          : '探讨人工智能技术最新应用与发展趋势，分享AI领域的最新研究成果和实践经验。',
        image: id === '1' 
          ? 'https://via.placeholder.com/1200x400/1890ff/FFFFFF?text=2024年科技创新峰会' 
          : 'https://via.placeholder.com/1200x400/52c41a/FFFFFF?text=人工智能技术交流会',
        date: id === '1' ? '2024-10-15' : '2024-09-28',
        endDate: id === '1' ? '2024-10-16' : '2024-09-28',
        location: id === '1' ? '创新中心多功能厅' : '科技楼报告厅',
        organizer: id === '1' ? '园区管理委员会' : 'AI创新实验室',
        category: id === '1' ? '行业峰会' : '技术交流',
        status: '未开始',
        isTop: true,
        participants: id === '1' ? 120 : 85,
        maxParticipants: id === '1' ? 200 : 150,
        content: id === '1' 
          ? `## 活动介绍\n\n2024年科技创新峰会将汇聚全国各地的科技行业精英，共同探讨人工智能、区块链、量子计算等前沿科技领域的最新发展趋势，以及这些技术如何重塑未来产业格局。\n\n## 活动议程\n\n### 第一天（10月15日）\n\n- 09:00-09:30 签到\n- 09:30-10:00 开幕式\n- 10:00-12:00 主题演讲：《科技创新与产业变革》\n- 12:00-13:30 午餐交流\n- 13:30-15:30 分论坛一：人工智能与制造业升级\n- 15:30-17:30 分论坛二：数字经济新模式\n- 18:00-20:00 晚宴\n\n### 第二天（10月16日）\n\n- 09:00-11:00 圆桌论坛：《创新生态构建》\n- 11:00-12:00 项目路演\n- 12:00-13:30 午餐交流\n- 13:30-15:30 分论坛三：科技金融与投资趋势\n- 15:30-16:30 闭幕式\n\n## 报名须知\n\n1. 参会人员需提前报名，审核通过后方可参加\n2. 报名截止日期：2024年10月10日\n3. 请准备好个人身份证件，参会时需验证身份\n4. 会议期间免费提供午餐`
          : `## 活动介绍\n\n人工智能技术交流会旨在搭建一个专业的交流平台，邀请AI领域的专家学者分享最新研究成果与应用案例，探讨AI技术在各行业的落地实践与未来发展方向。\n\n## 活动议程\n\n- 13:00-13:30 签到\n- 13:30-14:00 开场致辞\n- 14:00-15:00 主题演讲：《大模型技术发展与应用趋势》\n- 15:00-15:30 茶歇交流\n- 15:30-16:30 案例分享：《AI在智能制造领域的应用实践》\n- 16:30-17:30 圆桌讨论：《AI技术落地的挑战与机遇》\n- 17:30-18:00 自由交流\n\n## 报名须知\n\n1. 本次活动面向园区内所有对AI技术感兴趣的企业和个人\n2. 报名截止日期：2024年9月25日\n3. 名额有限，请尽早报名\n4. 现场提供茶点`
      };
      
      setActivity(activityData);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id]);

  // 处理报名
  const handleSignUp = (values: any) => {
    console.log('报名信息:', values);
    message.success('报名成功！我们会尽快与您联系确认详情');
    setIsSignUpModalVisible(false);
    form.resetFields();
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

  // 格式化活动内容（将markdown风格的文本转为HTML）
  const formatContent = (content: string) => {
    if (!content) return '';
    
    // 简单的markdown转HTML处理
    return content
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/- (.*)/g, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n([^<])/g, '<br>$1');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Spin size="large" tip="加载活动详情..." />
      </div>
    );
  }

  if (!activity) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Title level={3}>未找到活动信息</Title>
        <Button onClick={() => navigate('/portal/activities')}>返回活动列表</Button>
      </div>
    );
  }

  const participationRate = activity.participants && activity.maxParticipants 
    ? Math.round((activity.participants / activity.maxParticipants) * 100) 
    : 0;

  return (
    <div className="activity-detail-page">
      <Button 
        type="link" 
        icon={<LeftOutlined />} 
        onClick={() => navigate('/portal/activities')}
        className="back-button"
      >
        返回活动列表
      </Button>
      
      <Card className="activity-banner">
        <Image 
          src={activity.image} 
          alt={activity.title}
          className="banner-image"
        />
      </Card>
      
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card className="activity-content-card">
            <div className="activity-header">
              <div className="activity-title">
                <Space size={8}>
                  {renderStatusTag(activity.status)}
                  {activity.isTop && <Tag color="#f50">置顶</Tag>}
                  <Tag color="purple">{activity.category}</Tag>
                </Space>
                <Title level={2}>{activity.title}</Title>
              </div>
              
              <div className="activity-meta">
                <Space direction="vertical" size={16}>
                  <Space size="large">
                    <Space>
                      <CalendarOutlined />
                      <span>{activity.date} {activity.endDate !== activity.date ? `至 ${activity.endDate}` : ''}</span>
                    </Space>
                    <Space>
                      <EnvironmentOutlined />
                      <span>{activity.location}</span>
                    </Space>
                  </Space>
                  <Space>
                    <UserOutlined />
                    <span>主办方: {activity.organizer}</span>
                  </Space>
                </Space>
              </div>
            </div>
            
            <Divider />
            
            <div 
              className="activity-detail-content"
              dangerouslySetInnerHTML={{ __html: `<p>${formatContent(activity.content || '')}</p>` }}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card className="activity-action-card">
            <Title level={4}>活动报名</Title>
            
            <div className="registration-status">
              <div className="registration-progress">
                <Progress 
                  percent={participationRate} 
                  size="small"
                  status={participationRate >= 100 ? 'exception' : 'active'}
                />
                <div className="registration-numbers">
                  <span>已报名: {activity.participants}/{activity.maxParticipants}</span>
                  {participationRate >= 100 && <Tag color="red">已满</Tag>}
                </div>
              </div>
            </div>
            
            <Button 
              type="primary" 
              size="large" 
              block
              onClick={() => setIsSignUpModalVisible(true)} 
              disabled={participationRate >= 100 || activity.status === '已结束'}
              className="signup-button"
            >
              {participationRate >= 100 ? '名额已满' : activity.status === '已结束' ? '活动已结束' : '立即报名'}
            </Button>
            
            <Divider />
            
            <div className="contact-info">
              <Title level={5}>联系方式</Title>
              <Space direction="vertical">
                <Space>
                  <UserOutlined />
                  <span>联系人: 张经理</span>
                </Space>
                <Space>
                  <PhoneOutlined />
                  <span>电话: 123-4567-8901</span>
                </Space>
                <Space>
                  <MailOutlined />
                  <span>邮箱: activities@smartpark.com</span>
                </Space>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* 报名表单弹窗 */}
      <Modal
        title="活动报名"
        open={isSignUpModalVisible}
        footer={null}
        onCancel={() => setIsSignUpModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignUp}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
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
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="company"
            label="公司/单位"
          >
            <Input placeholder="请输入公司或单位名称" />
          </Form.Item>
          
          <Form.Item
            name="position"
            label="职位"
          >
            <Input placeholder="请输入您的职位" />
          </Form.Item>
          
          <Form.Item
            name="attendType"
            label="参与方式"
            rules={[{ required: true, message: '请选择参与方式' }]}
          >
            <Radio.Group>
              <Radio value="offline">线下参与</Radio>
              <Radio value="online">线上参与</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={4} placeholder="如有特殊需求，请在此说明" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交报名
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      <style>
        {`
          .activity-detail-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px 16px;
          }
          
          .back-button {
            margin-bottom: 16px;
            padding-left: 0;
          }
          
          .activity-banner {
            margin-bottom: 24px;
            border-radius: 12px;
            overflow: hidden;
          }
          
          .banner-image {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
          }
          
          .activity-content-card, .activity-action-card {
            border-radius: 12px;
            height: 100%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }
          
          .activity-header {
            margin-bottom: 24px;
          }
          
          .activity-title h2 {
            margin-top: 8px;
            margin-bottom: 16px;
          }
          
          .activity-meta {
            margin: 16px 0;
          }
          
          .activity-detail-content {
            line-height: 1.8;
          }
          
          .activity-detail-content h2 {
            font-size: 20px;
            margin-top: 24px;
            margin-bottom: 16px;
          }
          
          .activity-detail-content h3 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 12px;
          }
          
          .activity-detail-content li {
            margin-bottom: 8px;
            list-style-type: disc;
            margin-left: 20px;
          }
          
          .registration-status {
            margin: 24px 0;
          }
          
          .registration-progress {
            margin-bottom: 16px;
          }
          
          .registration-numbers {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
          }
          
          .signup-button {
            margin: 16px 0;
          }
          
          .contact-info {
            margin-top: 16px;
          }
          
          @media (max-width: 576px) {
            .activity-detail-page {
              padding: 16px 8px;
            }
            
            .activity-action-card {
              margin-top: 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ActivityDetail; 