import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Typography, 
  Button, 
  Space, 
  Input, 
  Tag, 
  DatePicker,
  Row,
  Col,
  Select,
  Form,
  Modal,
  InputNumber,
  Divider,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  ExportOutlined,
  ReloadOutlined,
  WalletOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟企业数据
const mockEnterprises = [
  { id: 1, name: 'A公司' },
  { id: 2, name: 'B公司' },
  { id: 3, name: 'C公司' },
  { id: 4, name: 'D公司' }
];

// 模拟月卡购买记录数据
const mockPurchaseRecords = [
  { 
    id: 1, 
    enterprise: 'A公司', 
    licensePlate: '京A12345', 
    purchaseDate: '2023-07-01', 
    expireDate: '2023-08-01', 
    duration: 1,
    amount: 300, 
    paymentMethod: 'online', 
    status: 'active' 
  },
  { 
    id: 2, 
    enterprise: 'B公司', 
    licensePlate: '京B54321', 
    purchaseDate: '2023-06-15', 
    expireDate: '2023-09-15', 
    duration: 3,
    amount: 810, 
    paymentMethod: 'prepaid', 
    status: 'active' 
  },
  { 
    id: 3, 
    enterprise: 'C公司', 
    licensePlate: '京C11111', 
    purchaseDate: '2023-07-10', 
    expireDate: '2023-08-10', 
    duration: 1,
    amount: 255, 
    paymentMethod: 'offline', 
    status: 'pending' 
  },
  { 
    id: 4, 
    enterprise: 'D公司', 
    licensePlate: '京D22222', 
    purchaseDate: '2023-05-01', 
    expireDate: '2023-06-01', 
    duration: 1,
    amount: 300, 
    paymentMethod: 'online', 
    status: 'expired' 
  }
];

const MonthlyPurchaseRecord: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [rechargeForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [enterprises, setEnterprises] = useState(mockEnterprises);
  const [records, setRecords] = useState(mockPurchaseRecords);
  const [loading, setLoading] = useState(false);

  // 状态标签颜色映射
  const statusColorMap: Record<string, string> = {
    active: 'success',
    pending: 'warning',
    expired: 'error'
  };

  // 状态文本映射
  const statusTextMap: Record<string, string> = {
    active: '有效',
    pending: '待支付',
    expired: '已过期'
  };

  // 支付方式映射
  const paymentMethodMap: Record<string, string> = {
    online: '在线支付',
    offline: '线下支付',
    prepaid: '预付款支付'
  };

  // 查询记录
  const handleSearch = (values: any) => {
    console.log('搜索条件', values);
    setLoading(true);
    
    // 这里模拟搜索，实际应该调用API
    setTimeout(() => {
      setLoading(false);
      // 在实际环境中，这里会用后端返回的数据更新状态
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
  };

  // 查看详情
  const handleViewDetail = (record: any) => {
    console.log('查看详情', record);
    // 实际应该跳转到详情页或打开详情弹窗
  };

  // 导出数据
  const handleExport = () => {
    console.log('导出数据');
    // 实际应该调用导出API
  };

  // 月卡充值
  const handleRecharge = (record: any) => {
    setCurrentRecord(record);
    rechargeForm.setFieldsValue({
      enterprise: record.enterprise,
      licensePlate: record.licensePlate,
      duration: 1,
      paymentMethod: 'prepaid'
    });
    setIsModalVisible(true);
  };

  // 提交充值
  const handleSubmitRecharge = () => {
    rechargeForm.validateFields().then(values => {
      console.log('提交充值', values);
      // 这里应该调用充值API
      
      // 模拟充值成功
      const newExpiryDate = dayjs(currentRecord.expireDate).add(values.duration, 'month').format('YYYY-MM-DD');
      const updatedRecords = records.map(item => 
        item.id === currentRecord.id 
          ? { 
              ...item, 
              expireDate: newExpiryDate,
              status: 'active'
            } 
          : item
      );
      
      setRecords(updatedRecords);
      setIsModalVisible(false);
    });
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
      dataIndex: 'enterprise',
      key: 'enterprise',
    },
    {
      title: '车牌号',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
    },
    {
      title: '购买日期',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
    },
    {
      title: '有效期至',
      dataIndex: 'expireDate',
      key: 'expireDate',
    },
    {
      title: '金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount}`
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => paymentMethodMap[method] || method
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>
          {statusTextMap[status] || status}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: any) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="月卡充值">
            <Button 
              type="text" 
              icon={<WalletOutlined />} 
              onClick={() => handleRecharge(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>月卡购买记录</Title>
        <Paragraph>
          查询和管理停车月卡购买记录，支持按企业、车牌号等多条件查询，并提供月卡充值功能。
        </Paragraph>

        <Form
          form={searchForm}
          layout="horizontal"
          onFinish={handleSearch}
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="enterprise" label="企业">
                <Select placeholder="选择企业" allowClear>
                  {enterprises.map(enterprise => (
                    <Option key={enterprise.id} value={enterprise.name}>{enterprise.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="licensePlate" label="车牌号">
                <Input placeholder="输入车牌号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="状态">
                <Select placeholder="选择状态" allowClear>
                  <Option value="active">有效</Option>
                  <Option value="pending">待支付</Option>
                  <Option value="expired">已过期</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
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
                <Button 
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                >
                  导出数据
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Divider style={{ margin: '12px 0' }} />

        <Table 
          columns={columns} 
          dataSource={records} 
          rowKey="id" 
          loading={loading}
          pagination={{ 
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 月卡充值弹窗 */}
      <Modal
        title="月卡充值"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmitRecharge}
        width={600}
      >
        <Form
          form={rechargeForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="enterprise"
                label="企业名称"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="licensePlate"
                label="车牌号"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="duration"
            label="续费时长(月)"
            rules={[{ required: true, message: '请输入续费时长' }]}
          >
            <InputNumber min={1} max={24} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="paymentMethod"
            label="支付方式"
            rules={[{ required: true, message: '请选择支付方式' }]}
          >
            <Select>
              <Option value="prepaid">企业预付款支付</Option>
              <Option value="offline">线下支付</Option>
            </Select>
          </Form.Item>
          
          {currentRecord && (
            <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
              <Text>当前有效期至: {currentRecord.expireDate}</Text>
              <br />
              <Text>当前状态: 
                <Tag color={statusColorMap[currentRecord.status] || 'default'} style={{ marginLeft: '8px' }}>
                  {statusTextMap[currentRecord.status] || currentRecord.status}
                </Tag>
              </Text>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default MonthlyPurchaseRecord; 