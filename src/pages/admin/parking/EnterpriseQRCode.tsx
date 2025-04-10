import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Typography, 
  Button, 
  Space, 
  Input, 
  Select,
  Form,
  Row,
  Col,
  QRCode,
  Tooltip,
  Modal,
  Statistic,
  Divider,
  Tabs,
  List,
  Avatar,
  Badge
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  ReloadOutlined,
  DownloadOutlined,
  SendOutlined,
  SyncOutlined,
  CarOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 模拟企业数据
const mockEnterprises = [
  { id: 1, name: 'A公司', balance: 5000 },
  { id: 2, name: 'B公司', balance: 3000 },
  { id: 3, name: 'C公司', balance: 2000 },
  { id: 4, name: 'D公司', balance: 1000 }
];

// 模拟企业二维码数据
const mockQRCodes = [
  { 
    id: 1, 
    enterpriseId: 1,
    enterpriseName: 'A公司', 
    qrcode: 'data:image/png;base64,...', 
    createdAt: '2023-06-01 10:00:00',
    monthlyScans: 15,
    monthlyConsumption: 320 
  },
  { 
    id: 2, 
    enterpriseId: 2,
    enterpriseName: 'B公司', 
    qrcode: 'data:image/png;base64,...', 
    createdAt: '2023-05-15 14:30:00',
    monthlyScans: 8,
    monthlyConsumption: 175 
  },
  { 
    id: 3, 
    enterpriseId: 3,
    enterpriseName: 'C公司', 
    qrcode: 'data:image/png;base64,...', 
    createdAt: '2023-07-01 09:15:00',
    monthlyScans: 22,
    monthlyConsumption: 460 
  },
  { 
    id: 4, 
    enterpriseId: 4,
    enterpriseName: 'D公司', 
    qrcode: 'data:image/png;base64,...', 
    createdAt: '2023-06-10 11:20:00',
    monthlyScans: 5,
    monthlyConsumption: 90 
  }
];

// 模拟扫码记录数据
const mockScanRecords = [
  { 
    id: 1, 
    enterpriseId: 1,
    scanTime: '2023-07-15 16:30:00', 
    licensePlate: '京X12345', 
    entryTime: '2023-07-15 14:20:00', 
    exitTime: '2023-07-15 16:25:00', 
    parkingFee: 15, 
    status: 'paid' 
  },
  { 
    id: 2, 
    enterpriseId: 1,
    scanTime: '2023-07-14 18:15:00', 
    licensePlate: '京Y54321', 
    entryTime: '2023-07-14 15:10:00', 
    exitTime: '2023-07-14 18:10:00', 
    parkingFee: 20, 
    status: 'paid' 
  },
  { 
    id: 3, 
    enterpriseId: 1,
    scanTime: '2023-07-13 12:30:00', 
    licensePlate: '京Z11111', 
    entryTime: '2023-07-13 10:05:00', 
    exitTime: '2023-07-13 12:25:00', 
    parkingFee: 15, 
    status: 'paid' 
  }
];

const EnterpriseQRCode: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [selectedEnterprise, setSelectedEnterprise] = useState<string | null>(null);
  const [qrCodes, setQRCodes] = useState(mockQRCodes);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState<any>(null);
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [scanRecords, setScanRecords] = useState(mockScanRecords);
  const [loading, setLoading] = useState(false);

  // 查询记录
  const handleSearch = (values: any) => {
    console.log('搜索条件', values);
    setLoading(true);
    setSelectedEnterprise(values.enterprise);
    
    // 这里模拟搜索，实际应该调用API
    setTimeout(() => {
      setLoading(false);
      // 在实际环境中，这里会用后端返回的数据更新状态
      if (values.enterprise) {
        // 过滤企业
        const filtered = mockQRCodes.filter(item => 
          item.enterpriseName === values.enterprise
        );
        setQRCodes(filtered);
      } else {
        setQRCodes(mockQRCodes);
      }
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setSelectedEnterprise(null);
    setQRCodes(mockQRCodes);
  };

  // 查看二维码
  const handleViewQRCode = (record: any) => {
    setCurrentQRCode(record);
    // 获取企业相关的扫码记录，这里简单模拟
    const relatedRecords = mockScanRecords.filter(item => item.enterpriseId === record.enterpriseId);
    setScanRecords(relatedRecords);
    setActiveTabKey('1');
    setIsModalVisible(true);
  };

  // 重新生成二维码
  const handleRegenerateQRCode = (record: any) => {
    console.log('重新生成二维码', record);
    // 这里应该调用API重新生成企业二维码
    // 然后更新二维码数据
  };

  // 查看账单
  const handleViewBill = (record: any) => {
    console.log('查看账单', record);
    // 这里应该打开账单详情页面
    // 或者跳转到财务系统的相关页面
  };

  // 下载二维码
  const handleDownloadQRCode = () => {
    console.log('下载二维码', currentQRCode);
    // 这里实际应该实现二维码下载功能
  };

  // 发送二维码到企业
  const handleSendQRCode = () => {
    console.log('发送二维码', currentQRCode);
    // 这里应该调用API发送二维码到企业管理员
  };

  // 更改标签页
  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
    },
    {
      title: '二维码',
      dataIndex: 'qrcode',
      key: 'qrcode',
      render: (_: unknown, record: any) => (
        <Button 
          type="link" 
          onClick={() => handleViewQRCode(record)}
        >
          查看
        </Button>
      )
    },
    {
      title: '生成时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '本月扫码次数',
      dataIndex: 'monthlyScans',
      key: 'monthlyScans',
    },
    {
      title: '本月消费金额(元)',
      dataIndex: 'monthlyConsumption',
      key: 'monthlyConsumption',
      render: (amount: number) => `¥${amount}`
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: any) => (
        <Space size="middle">
          <Tooltip title="查看二维码">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewQRCode(record)}
            />
          </Tooltip>
          <Tooltip title="重新生成">
            <Button 
              type="text" 
              icon={<SyncOutlined />} 
              onClick={() => handleRegenerateQRCode(record)}
            />
          </Tooltip>
          <Tooltip title="查看账单">
            <Button 
              type="text" 
              icon={<CarOutlined />} 
              onClick={() => handleViewBill(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 扫码记录表格列定义
  const scanRecordColumns = [
    {
      title: '扫码时间',
      dataIndex: 'scanTime',
      key: 'scanTime',
    },
    {
      title: '车牌号',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
    },
    {
      title: '入场时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
    },
    {
      title: '出场时间',
      dataIndex: 'exitTime',
      key: 'exitTime',
    },
    {
      title: '停车费用(元)',
      dataIndex: 'parkingFee',
      key: 'parkingFee',
      render: (fee: number) => `¥${fee}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        status === 'paid' ? 
          <Badge status="success" text="已支付" /> : 
          <Badge status="processing" text="待支付" />
      )
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>企业停车二维码管理</Title>
        <Paragraph>
          管理企业专属停车二维码，方便访客通过扫码快速完成停车登记和缴费流程。系统自动为企业生成动态的停车二维码，
          访客通过扫码后，停车费将自动生成企业账单。
        </Paragraph>

        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: '24px' }}
        >
          <Form.Item name="enterprise" label="企业">
            <Select 
              placeholder="选择企业" 
              allowClear 
              style={{ width: 200 }}
            >
              {mockEnterprises.map(enterprise => (
                <Option key={enterprise.id} value={enterprise.name}>{enterprise.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button 
                htmlType="submit" 
                type="primary" 
                icon={<SearchOutlined />}
                loading={loading}
              >
                查询
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Table 
          columns={columns} 
          dataSource={qrCodes} 
          rowKey="id" 
          loading={loading}
          pagination={{ 
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 二维码详情弹窗 */}
      <Modal
        title={currentQRCode ? `${currentQRCode.enterpriseName} 停车二维码` : '企业停车二维码'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentQRCode && (
          <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
            <TabPane tab="二维码信息" key="1">
              <Row gutter={[16, 16]}>
                <Col span={12} style={{ textAlign: 'center' }}>
                  <QRCode
                    value={`https://example.com/parking/enterprise/${currentQRCode.enterpriseId}`}
                    size={200}
                    bordered={false}
                    style={{ margin: '20px 0' }}
                  />
                  <div style={{ marginTop: '15px' }}>
                    <Space>
                      <Button icon={<DownloadOutlined />} onClick={handleDownloadQRCode}>
                        下载二维码
                      </Button>
                      <Button icon={<SendOutlined />} onClick={handleSendQRCode}>
                        发送至企业管理员
                      </Button>
                    </Space>
                  </div>
                  <Paragraph style={{ marginTop: '15px', fontSize: '12px', color: '#999' }}>
                    访客扫描此二维码可将停车费计入企业账单
                  </Paragraph>
                </Col>
                <Col span={12}>
                  <div style={{ padding: '20px' }}>
                    <Statistic 
                      title="企业名称" 
                      value={currentQRCode.enterpriseName} 
                      style={{ marginBottom: '15px' }}
                    />
                    <Statistic 
                      title="二维码生成时间" 
                      value={currentQRCode.createdAt} 
                      style={{ marginBottom: '15px' }}
                    />
                    <Statistic 
                      title="企业账户余额" 
                      value={`¥${mockEnterprises.find(e => e.id === currentQRCode.enterpriseId)?.balance || 0}`} 
                      style={{ marginBottom: '15px' }}
                    />
                    <Divider style={{ margin: '15px 0' }} />
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic 
                          title="本月扫码次数" 
                          value={currentQRCode.monthlyScans} 
                          suffix="次"
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic 
                          title="本月消费金额" 
                          value={currentQRCode.monthlyConsumption} 
                          prefix="¥"
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="扫码记录" key="2">
              <Table 
                columns={scanRecordColumns} 
                dataSource={scanRecords} 
                rowKey="id" 
                pagination={{ pageSize: 5 }}
              />
            </TabPane>
            <TabPane tab="使用说明" key="3">
              <div style={{ padding: '20px' }}>
                <Title level={5}>企业停车二维码使用说明</Title>
                <Paragraph>
                  企业停车二维码是便于企业访客停车缴费的便捷方式。通过以下步骤即可完成访客停车缴费：
                </Paragraph>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { title: '第一步', content: '企业在访客区域放置企业专属停车二维码' },
                    { title: '第二步', content: '访客停车后，使用手机扫描二维码，输入车牌号' },
                    { title: '第三步', content: '系统将车辆与企业关联，费用计入企业账单' },
                    { title: '第四步', content: '访客凭扫码记录直接出场，无需自行缴费' },
                    { title: '第五步', content: '系统自动从企业预付款中扣除或生成账单待企业支付' }
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.title.charAt(item.title.length - 1)}</Avatar>}
                        title={item.title}
                        description={item.content}
                      />
                    </List.Item>
                  )}
                />
                <Divider style={{ margin: '20px 0' }} />
                <Paragraph>
                  <Text strong>注意事项：</Text>
                </Paragraph>
                <Paragraph>
                  1. 企业需确保账户有足够预付款或及时支付账单，以保证访客顺利出场。
                </Paragraph>
                <Paragraph>
                  2. 访客扫码后，系统会记录车牌信息，请确保填写正确的车牌号。
                </Paragraph>
                <Paragraph>
                  3. 如遇二维码无法使用，请联系企业管理员或园区管理员。
                </Paragraph>
              </div>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default EnterpriseQRCode; 