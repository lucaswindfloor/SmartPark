import React from 'react';
import { Card, List, Typography, Space, Tag, Row, Col, Breadcrumb, Divider } from 'antd';
import { NotificationOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// 模拟数据
const notices = [
  {
    id: '1',
    title: '关于举办2024年科技创新峰会的通知',
    content: '湘江科创基地将于2024年10月举办科技创新峰会，诚邀园区企业参与...',
    publishTime: '2024-09-01 10:00',
    category: '活动通知',
    views: 156
  },
  {
    id: '2',
    title: '关于调整园区部分区域电力维护时间的通知',
    content: '为保障园区电力设施安全运行，计划于2024年9月15日进行电力维护...',
    publishTime: '2024-09-02 14:30',
    category: '设施维护',
    views: 203
  },
  {
    id: '3',
    title: '园区公共会议室使用规范更新',
    content: '为提高园区公共会议室使用效率，现对会议室使用规范进行更新...',
    publishTime: '2024-09-03 16:45',
    category: '规章制度',
    views: 187
  },
  {
    id: '4',
    title: '园区食堂中秋节放假安排',
    content: '值此中秋佳节来临之际，园区食堂放假安排如下...',
    publishTime: '2024-09-04 09:15',
    category: '假期安排',
    views: 310
  },
  {
    id: '5',
    title: '关于开展园区安全大检查的通知',
    content: '为进一步加强园区安全管理，提高安全防范意识，将于近期开展安全大检查...',
    publishTime: '2024-09-05 11:30',
    category: '安全管理',
    views: 178
  }
];

// 获取标签颜色
const getCategoryColor = (category: string) => {
  switch (category) {
    case '活动通知':
      return 'blue';
    case '设施维护':
      return 'orange';
    case '规章制度':
      return 'green';
    case '假期安排':
      return 'purple';
    case '安全管理':
      return 'red';
    default:
      return 'default';
  }
};

const NoticePage: React.FC = () => {
  return (
    <div className="notice-page">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>信息公开</Breadcrumb.Item>
        <Breadcrumb.Item>通知公告</Breadcrumb.Item>
      </Breadcrumb>
      
      <Title level={2} style={{ marginBottom: 24 }}>
        <NotificationOutlined style={{ marginRight: 8 }} />
        通知公告
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card bordered={false}>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 5,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条通知`
              }}
              dataSource={notices}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  extra={
                    <Space direction="vertical" align="end" style={{ minWidth: 100 }}>
                      <Tag color={getCategoryColor(item.category)}>{item.category}</Tag>
                      <Space size="small">
                        <ClockCircleOutlined />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.publishTime.split(' ')[0]}
                        </Text>
                      </Space>
                      <Space size="small">
                        <EyeOutlined />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.views} 次查看
                        </Text>
                      </Space>
                    </Space>
                  }
                >
                  <List.Item.Meta
                    title={<a href={`/portal/information/notice/${item.id}`}>{item.title}</a>}
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="通知分类" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>全部通知</a>
                <Text type="secondary">25</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>活动通知</a>
                <Text type="secondary">8</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>设施维护</a>
                <Text type="secondary">5</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>规章制度</a>
                <Text type="secondary">4</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>假期安排</a>
                <Text type="secondary">3</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>安全管理</a>
                <Text type="secondary">5</Text>
              </div>
            </Space>
          </Card>
          
          <Card title="热门通知" bordered={false} style={{ marginTop: 16 }}>
            <List
              itemLayout="horizontal"
              dataSource={notices.slice(0, 3)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={`/portal/information/notice/${item.id}`}>{item.title}</a>}
                    description={
                      <Space>
                        <Tag color={getCategoryColor(item.category)}>{item.category}</Tag>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.views} 次查看
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NoticePage; 