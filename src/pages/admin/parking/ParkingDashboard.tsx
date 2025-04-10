import React from 'react';
import { Card, Row, Col, Statistic, Button, Table, Tabs, Typography, Space, Badge, Divider } from 'antd';
import { 
  CarOutlined, 
  DollarOutlined, 
  SettingOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  QrcodeOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 模拟数据
const parkingData = {
  totalSpaces: 500,
  occupiedSpaces: 320,
  availableSpaces: 180,
  monthlyPassCount: 268,
  todayIncome: 5280,
  monthlyIncome: 126500,
  peakHours: "8:30-9:30, 17:30-18:30"
};

// 模拟当前场内车辆数据
const insideVehiclesData = [
  { key: '1', licensePlate: '湘A12345', type: '月卡车辆', entryTime: '2024-04-08 08:15:23', entryGate: '南门', parkingDuration: '2小时15分' },
  { key: '2', licensePlate: '湘B54321', type: '临时车辆', entryTime: '2024-04-08 09:30:45', entryGate: '北门', parkingDuration: '1小时' },
  { key: '3', licensePlate: '湘C98765', type: '企业访客', entryTime: '2024-04-08 10:05:12', entryGate: '东门', parkingDuration: '25分钟' },
  { key: '4', licensePlate: '湘D24680', type: '月卡车辆', entryTime: '2024-04-08 08:45:30', entryGate: '南门', parkingDuration: '1小时45分' },
  { key: '5', licensePlate: '湘E13579', type: '临时车辆', entryTime: '2024-04-08 10:20:15', entryGate: '西门', parkingDuration: '10分钟' },
];

// 模拟今日收入明细
const todayIncomeData = [
  { key: '1', type: '临时停车', count: 156, amount: 3120 },
  { key: '2', type: '月卡新增', count: 8, amount: 1600 },
  { key: '3', type: '月卡续费', count: 12, amount: 2400 },
  { key: '4', type: '访客停车', count: 32, amount: 640 },
];

// 模拟紧急事项数据
const urgentMattersData = [
  { key: '1', content: '南门出口摄像头离线，需要维修', status: 'error', time: '10:15' },
  { key: '2', content: '车辆湘A88888停放超过48小时', status: 'warning', time: '昨日' },
  { key: '3', content: '10辆月卡车即将到期', status: 'processing', time: '3天后' },
];

const ParkingDashboard: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '场内车辆',
      children: (
        <Table 
          dataSource={insideVehiclesData} 
          pagination={{ pageSize: 5 }}
          columns={[
            { title: '车牌号', dataIndex: 'licensePlate', key: 'licensePlate' },
            { title: '车辆类型', dataIndex: 'type', key: 'type',
              render: (text) => {
                let color = text === '月卡车辆' ? 'green' : (text === '企业访客' ? 'blue' : 'orange');
                return <Badge color={color} text={text} />;
              }
            },
            { title: '入场时间', dataIndex: 'entryTime', key: 'entryTime' },
            { title: '入场口', dataIndex: 'entryGate', key: 'entryGate' },
            { title: '停车时长', dataIndex: 'parkingDuration', key: 'parkingDuration' },
            { title: '操作', key: 'action', 
              render: () => (
                <Space size="small">
                  <Button type="link" size="small">详情</Button>
                  <Button type="link" size="small">联系</Button>
                </Space>
              ) 
            },
          ]}
        />
      ),
    },
    {
      key: '2',
      label: '收入明细',
      children: (
        <Table 
          dataSource={todayIncomeData} 
          pagination={false}
          columns={[
            { title: '类型', dataIndex: 'type', key: 'type' },
            { title: '数量', dataIndex: 'count', key: 'count' },
            { title: '金额(元)', dataIndex: 'amount', key: 'amount', 
              render: (text) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{text}</span> 
            },
          ]}
          summary={(pageData) => {
            let totalAmount = 0;
            pageData.forEach(({ amount }) => {
              totalAmount += amount;
            });
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{pageData.reduce((sum, item) => sum + item.count, 0)}</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text type="success" strong>{totalAmount}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      ),
    }
  ];

  return (
    <div className="parking-dashboard" style={{ padding: '24px' }}>
      <Title level={2}>停车管理中心</Title>
      <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
        实时监控园区停车场状态，管理车辆信息，查看停车收入数据
      </Text>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总车位数" 
              value={parkingData.totalSpaces} 
              suffix="个" 
              valueStyle={{ color: '#1890ff' }}
              prefix={<CarOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="剩余车位" 
              value={parkingData.availableSpaces} 
              suffix="个" 
              valueStyle={{ color: parkingData.availableSpaces < 50 ? '#ff4d4f' : '#52c41a' }}
              prefix={<EnvironmentOutlined />}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
              已占用: {parkingData.occupiedSpaces} / {parkingData.totalSpaces}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="月卡车辆" 
              value={parkingData.monthlyPassCount} 
              suffix="辆" 
              valueStyle={{ color: '#722ed1' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="今日收入" 
              value={parkingData.todayIncome} 
              suffix="元" 
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
              本月累计: {parkingData.monthlyIncome}元
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} md={16}>
          <Card title="实时监控" style={{ marginBottom: '16px' }}>
            <Tabs items={items} defaultActiveKey="1" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="重要事项" style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {urgentMattersData.map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <Space>
                    <Badge status={item.status as any} />
                    <span>{item.content}</span>
                  </Space>
                  <span style={{ color: '#999' }}>{item.time}</span>
                </div>
              ))}
            </Space>
          </Card>
          
          <Card title="高峰时段" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '8px 0' }}>
              <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              <span>早高峰: 8:30-9:30</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              <span>晚高峰: 17:30-18:30</span>
            </div>
            <div style={{ padding: '8px 0', color: '#666', fontSize: '12px' }}>
              建议在高峰期增派人手维持秩序，确保车辆顺畅通行
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="快捷操作" style={{ textAlign: 'center' }}>
            <Space size="large" wrap>
              <Button type="primary" icon={<CarOutlined />}>停车场管理</Button>
              <Button icon={<UserOutlined />}>月卡管理</Button>
              <Button icon={<SettingOutlined />}>收费设置</Button>
              <Button icon={<FileTextOutlined />}>账单管理</Button>
              <Button icon={<QrcodeOutlined />}>出入口管理</Button>
              <Button icon={<CarOutlined />}>车辆名单管理</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ParkingDashboard; 