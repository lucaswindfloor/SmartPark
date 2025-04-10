import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  DatePicker, 
  Select, 
  Form, 
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Divider,
  Modal,
  Badge,
  Image
} from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  SyncOutlined, 
  CarOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  ExportOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟数据
const mockRecords = [
  {
    id: 1,
    licensePlate: '湘A12345',
    parkingLot: '主楼停车场',
    entrance: '主楼东门',
    enterTime: '2023-08-01 08:23:45',
    exitTime: '2023-08-01 17:45:12',
    duration: '9小时21分钟',
    fee: 15,
    paymentStatus: 'paid',
    paymentMethod: 'wechat',
    vehicleType: 'temporary',
    vehicleImage: 'https://dummyimage.com/100x80/000/fff&text=湘A12345',
  },
  {
    id: 2,
    licensePlate: '湘B54321',
    parkingLot: '主楼停车场',
    entrance: '主楼西门',
    enterTime: '2023-08-01 09:10:32',
    exitTime: null,
    duration: null,
    fee: null,
    paymentStatus: 'unpaid',
    paymentMethod: null,
    vehicleType: 'temporary',
    vehicleImage: 'https://dummyimage.com/100x80/000/fff&text=湘B54321',
  },
  {
    id: 3,
    licensePlate: '湘C98765',
    parkingLot: '2号楼停车场',
    entrance: '2号楼南门',
    enterTime: '2023-08-01 07:55:18',
    exitTime: '2023-08-01 19:23:42',
    duration: '11小时28分钟',
    fee: 20,
    paymentStatus: 'paid',
    paymentMethod: 'alipay',
    vehicleType: 'temporary',
    vehicleImage: 'https://dummyimage.com/100x80/000/fff&text=湘C98765',
  },
  {
    id: 4,
    licensePlate: '湘D13579',
    parkingLot: '2号楼停车场',
    entrance: '2号楼北门',
    enterTime: '2023-08-01 08:30:00',
    exitTime: '2023-08-01 17:30:00',
    duration: '9小时0分钟',
    fee: 0,
    paymentStatus: 'free',
    paymentMethod: null,
    vehicleType: 'monthly',
    vehicleImage: 'https://dummyimage.com/100x80/000/fff&text=湘D13579',
  },
  {
    id: 5,
    licensePlate: '湘E24680',
    parkingLot: '3号楼停车场',
    entrance: '3号楼东门',
    enterTime: '2023-08-01 10:15:22',
    exitTime: null,
    duration: null,
    fee: null,
    paymentStatus: 'unpaid',
    paymentMethod: null,
    vehicleType: 'temporary',
    vehicleImage: 'https://dummyimage.com/100x80/000/fff&text=湘E24680',
  },
];

const AccessRecords: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 支付状态和方式的映射
  const paymentStatusMap: Record<string, { text: string; color: string }> = {
    paid: { text: '已支付', color: 'success' },
    unpaid: { text: '未支付', color: 'warning' },
    free: { text: '免费', color: 'default' },
  };

  const paymentMethodMap: Record<string, string> = {
    cash: '现金',
    wechat: '微信支付',
    alipay: '支付宝',
  };

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '车牌号',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '停车场',
      dataIndex: 'parkingLot',
      key: 'parkingLot',
    },
    {
      title: '出入口',
      dataIndex: 'entrance',
      key: 'entrance',
    },
    {
      title: '进入时间',
      dataIndex: 'enterTime',
      key: 'enterTime',
      sorter: (a, b) => new Date(a.enterTime).getTime() - new Date(b.enterTime).getTime(),
    },
    {
      title: '离开时间',
      dataIndex: 'exitTime',
      key: 'exitTime',
      render: (text: string) => text || <Tag color="processing">在场</Tag>,
    },
    {
      title: '停车时长',
      dataIndex: 'duration',
      key: 'duration',
      render: (text: string) => text || '-',
    },
    {
      title: '费用',
      dataIndex: 'fee',
      key: 'fee',
      render: (text: number) => text !== null ? `¥${text}` : '-',
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => (
        <Tag color={paymentStatusMap[status].color}>{paymentStatusMap[status].text}</Tag>
      ),
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => method ? paymentMethodMap[method] : '-',
    },
    {
      title: '车辆类型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      render: (type: string) => (
        type === 'monthly' ? <Tag color="blue">月卡车辆</Tag> : <Tag>临时车辆</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => showRecordDetail(record)}
          />
        </Space>
      ),
    },
  ];

  // 显示记录详情
  const showRecordDetail = (record: any) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  // 执行搜索
  const handleSearch = (values: any) => {
    setLoading(true);
    console.log('搜索条件:', values);
    // 这里应该调用API获取数据
    // 模拟API调用
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
  };

  // 导出数据
  const handleExport = () => {
    Modal.confirm({
      title: '确认导出',
      icon: <ExclamationCircleOutlined />,
      content: '确定要导出当前筛选条件下的所有记录吗？',
      onOk() {
        console.log('导出数据');
        // 这里应该调用导出API
      }
    });
  };

  return (
    <div className="access-records-container">
      <Title level={4}>车辆通行记录</Title>
      
      <Card style={{ marginBottom: 20 }}>
        <Form 
          form={searchForm}
          layout="horizontal"
          onFinish={handleSearch}
          initialValues={{
            timeRange: [dayjs().startOf('day'), dayjs()],
            status: 'all'
          }}
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="licensePlate" label="车牌号">
                <Input placeholder="请输入车牌号" prefix={<CarOutlined />} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="parkingLot" label="停车场">
                <Select placeholder="请选择停车场" allowClear>
                  <Option value="主楼停车场">主楼停车场</Option>
                  <Option value="2号楼停车场">2号楼停车场</Option>
                  <Option value="3号楼停车场">3号楼停车场</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="车辆状态">
                <Select placeholder="请选择状态">
                  <Option value="all">全部</Option>
                  <Option value="in">在场</Option>
                  <Option value="out">已离场</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="paymentStatus" label="支付状态">
                <Select placeholder="请选择支付状态" allowClear>
                  <Option value="paid">已支付</Option>
                  <Option value="unpaid">未支付</Option>
                  <Option value="free">免费</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="timeRange" label="时间范围">
                <RangePicker 
                  showTime 
                  style={{ width: '100%' }} 
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={handleReset}>重置</Button>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleExport}>
                  导出
                </Button>
                <Button icon={<SyncOutlined />} onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 500);
                }}>
                  刷新
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      
      <Card>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic title="当日入场总数" value={256} suffix="辆" />
          </Col>
          <Col span={6}>
            <Statistic title="当日出场总数" value={223} suffix="辆" />
          </Col>
          <Col span={6}>
            <Statistic title="当前在场车辆" value={33} suffix="辆" />
          </Col>
          <Col span={6}>
            <Statistic title="当日收费总额" value={1256.5} prefix="¥" precision={2} />
          </Col>
        </Row>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <Table 
          columns={columns} 
          dataSource={mockRecords} 
          rowKey="id" 
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            defaultPageSize: 10,
            total: 100, // 假设总共有100条记录
          }}
        />
      </Card>
      
      {/* 记录详情弹窗 */}
      <Modal
        title="车辆通行详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>,
          selectedRecord && selectedRecord.paymentStatus === 'unpaid' && selectedRecord.exitTime === null && (
            <Button 
              key="payment" 
              type="primary"
              onClick={() => {
                // 处理支付逻辑
                console.log('处理支付', selectedRecord);
                setIsDetailModalVisible(false);
              }}
            >
              确认离场并支付
            </Button>
          )
        ]}
        width={700}
      >
        {selectedRecord && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card bordered={false} style={{ textAlign: 'center' }}>
                  <Image
                    src={selectedRecord.vehicleImage}
                    alt={selectedRecord.licensePlate}
                    style={{ maxWidth: '100%', maxHeight: '120px' }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text strong style={{ fontSize: 18 }}>{selectedRecord.licensePlate}</Text>
                    <div>
                      {selectedRecord.vehicleType === 'monthly' ? 
                        <Badge status="processing" text="月卡车辆" /> : 
                        <Badge status="default" text="临时车辆" />
                      }
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={16}>
                <Row gutter={[0, 16]}>
                  <Col span={12}>
                    <Text type="secondary">停车场:</Text> {selectedRecord.parkingLot}
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">出入口:</Text> {selectedRecord.entrance}
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">进入时间:</Text> {selectedRecord.enterTime}
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">离开时间:</Text> {selectedRecord.exitTime || <Tag color="processing">在场</Tag>}
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">停车时长:</Text> {selectedRecord.duration || '-'}
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">停车费用:</Text> {selectedRecord.fee !== null ? `¥${selectedRecord.fee}` : '-'}
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">支付状态:</Text> 
                    <Tag color={paymentStatusMap[selectedRecord.paymentStatus].color}>
                      {paymentStatusMap[selectedRecord.paymentStatus].text}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">支付方式:</Text> {selectedRecord.paymentMethod ? paymentMethodMap[selectedRecord.paymentMethod] : '-'}
                  </Col>
                </Row>
              </Col>
            </Row>
            
            {selectedRecord.exitTime === null && (
              <Card 
                style={{ marginTop: 16, backgroundColor: '#f0f5ff', border: '1px solid #d6e4ff' }}
                bodyStyle={{ padding: 16 }}
              >
                <Row>
                  <Col span={16}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <ExclamationCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                      <Text>该车辆当前在园区内，已停放 {
                        (() => {
                          const enterTime = new Date(selectedRecord.enterTime);
                          const now = new Date();
                          const diffMs = now.getTime() - enterTime.getTime();
                          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                          return `${diffHrs}小时${diffMins}分钟`;
                        })()
                      }</Text>
                    </div>
                  </Col>
                  <Col span={8} style={{ textAlign: 'right' }}>
                    {selectedRecord.paymentStatus === 'unpaid' && (
                      <Button type="primary" icon={<ExportOutlined />}>
                        确认离场
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccessRecords; 