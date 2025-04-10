import React from 'react';
import { Card, List, Typography, Space, Tag, Row, Col, Breadcrumb, Divider, Input } from 'antd';
import { FileTextOutlined, SearchOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

// 模拟数据
const policies = [
  {
    id: '1',
    title: '湘江科创基地创新企业扶持政策2024版',
    content: '为进一步促进科技创新，支持企业发展，特制定本扶持政策...',
    publishTime: '2024-08-15',
    category: '创新扶持',
    department: '产业发展部',
    downloads: 86
  },
  {
    id: '2',
    title: '湘江科创基地知识产权保护实施细则',
    content: '为加强园区知识产权保护工作，营造良好的创新环境...',
    publishTime: '2024-07-22',
    category: '知识产权',
    department: '法务部',
    downloads: 64
  },
  {
    id: '3',
    title: '湘江科创基地创业孵化中心管理办法',
    content: '为规范创业孵化中心的管理，提升孵化服务质量...',
    publishTime: '2024-06-18',
    category: '孵化管理',
    department: '创业服务部',
    downloads: 102
  },
  {
    id: '4',
    title: '湘江科创基地高新技术企业认定奖励办法',
    content: '为鼓励园区企业申报高新技术企业，提升园区科技创新水平...',
    publishTime: '2024-05-30',
    category: '高企认定',
    department: '科技发展部',
    downloads: 128
  },
  {
    id: '5',
    title: '湘江科创基地科技金融服务实施方案',
    content: '为解决科技型中小企业融资难问题，促进科技与金融深度融合...',
    publishTime: '2024-04-25',
    category: '科技金融',
    department: '金融服务部',
    downloads: 95
  }
];

// 获取标签颜色
const getCategoryColor = (category: string) => {
  switch (category) {
    case '创新扶持':
      return 'blue';
    case '知识产权':
      return 'purple';
    case '孵化管理':
      return 'green';
    case '高企认定':
      return 'orange';
    case '科技金融':
      return 'cyan';
    default:
      return 'default';
  }
};

const PolicyPage: React.FC = () => {
  return (
    <div className="policy-page">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>信息公开</Breadcrumb.Item>
        <Breadcrumb.Item>政策文件</Breadcrumb.Item>
      </Breadcrumb>
      
      <Title level={2} style={{ marginBottom: 24 }}>
        <FileTextOutlined style={{ marginRight: 8 }} />
        政策文件
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card bordered={false}>
            <List
              itemLayout="vertical"
              size="large"
              header={
                <Search
                  placeholder="搜索政策文件"
                  allowClear
                  enterButton={<><SearchOutlined /> 搜索</>}
                  style={{ width: '100%' }}
                />
              }
              pagination={{
                pageSize: 5,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条政策文件`
              }}
              dataSource={policies}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  extra={
                    <Space direction="vertical" align="end" style={{ minWidth: 100 }}>
                      <Tag color={getCategoryColor(item.category)}>{item.category}</Tag>
                      <Text type="secondary">发布部门：{item.department}</Text>
                      <Space size="small">
                        <ClockCircleOutlined />
                        <Text type="secondary">
                          {item.publishTime}
                        </Text>
                      </Space>
                    </Space>
                  }
                >
                  <List.Item.Meta
                    title={<a href={`/portal/information/policy/${item.id}`}>{item.title}</a>}
                    description={item.content}
                  />
                  <div style={{ marginTop: 12 }}>
                    <Space size="middle">
                      <a href={`/portal/information/policy/${item.id}`}>在线阅读</a>
                      <a href={`/api/download/policy/${item.id}`}>
                        <DownloadOutlined /> 下载 ({item.downloads})
                      </a>
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="政策分类" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>全部政策</a>
                <Text type="secondary">23</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>创新扶持</a>
                <Text type="secondary">6</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>知识产权</a>
                <Text type="secondary">4</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>孵化管理</a>
                <Text type="secondary">5</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>高企认定</a>
                <Text type="secondary">3</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a>科技金融</a>
                <Text type="secondary">5</Text>
              </div>
            </Space>
          </Card>
          
          <Card title="热门下载" bordered={false} style={{ marginTop: 16 }}>
            <List
              itemLayout="horizontal"
              dataSource={[...policies].sort((a, b) => b.downloads - a.downloads).slice(0, 3)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={`/portal/information/policy/${item.id}`}>{item.title}</a>}
                    description={
                      <Space>
                        <Tag color={getCategoryColor(item.category)}>{item.category}</Tag>
                        <Text type="secondary">
                          <DownloadOutlined /> {item.downloads}
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

export default PolicyPage; 