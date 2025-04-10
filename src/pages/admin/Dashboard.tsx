import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Button } from 'antd';
import { 
  UserOutlined, 
  HomeOutlined, 
  TeamOutlined, 
  BarChartOutlined,
  FileTextOutlined,
  DollarOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard" style={{ padding: '24px' }}>
      <Title level={2}>工作门户</Title>
      <Paragraph>欢迎使用湘江科创基地智慧园区系统，以下是园区管理概况</Paragraph>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="园区入驻企业" 
              value={128} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="房间出租率" 
              value={82.5} 
              suffix="%" 
              prefix={<HomeOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="本月新增客户" 
              value={24} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="本月营收" 
              value={1256789} 
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24} md={16}>
          <Card 
            title="待办事项" 
            extra={<Button type="link">查看全部</Button>}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <Space>
                  <FileTextOutlined />
                  <span>合同【HT2024001】待审批</span>
                </Space>
                <Button type="link" size="small">处理</Button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <Space>
                  <FileTextOutlined />
                  <span>客户【长沙数智科技】跟进提醒</span>
                </Space>
                <Button type="link" size="small">处理</Button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <Space>
                  <FileTextOutlined />
                  <span>退园申请【TY2024003】待处理</span>
                </Space>
                <Button type="link" size="small">处理</Button>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={24} md={8}>
          <Card 
            title="快捷入口" 
            extra={<Button type="link">自定义</Button>}
          >
            <Space style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Button icon={<TeamOutlined />}>添加客户</Button>
              <Button icon={<FileTextOutlined />}>新建合同</Button>
              <Button icon={<BarChartOutlined />}>服务管理</Button>
              <Button icon={<HomeOutlined />}>房源管理</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard; 