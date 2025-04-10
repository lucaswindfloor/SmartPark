import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Form, 
  InputNumber,
  Radio,
  Table,
  Divider,
  Tag,
  Modal,
  Input,
  Row,
  Col,
  Select
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SaveOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// 模拟企业类型优惠数据
const mockEnterpriseDiscounts = [
  { 
    id: 1, 
    type: '普通企业', 
    baseDiscount: 1, 
    discount3To6Months: 0.9, 
    discountOver6Months: 0.85,
    discountOver12Months: 0.8  
  },
  { 
    id: 2, 
    type: '重点企业', 
    baseDiscount: 0.9, 
    discount3To6Months: 0.85, 
    discountOver6Months: 0.8,
    discountOver12Months: 0.75
  },
  { 
    id: 3, 
    type: '战略合作伙伴', 
    baseDiscount: 0.85, 
    discount3To6Months: 0.8, 
    discountOver6Months: 0.75,
    discountOver12Months: 0.7
  },
];

const MonthlyPlanManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [discountForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentDiscount, setCurrentDiscount] = useState<any>(null);
  const [enterpriseDiscounts, setEnterpriseDiscounts] = useState(mockEnterpriseDiscounts);
  const [isResubmit, setIsResubmit] = useState(false);

  // 基本设置初始值
  const initialValues = {
    basePrice: 300,
    multiCarLimit: 3,
    multiCarRule: 'first'
  };

  // 处理保存基本设置
  const handleSaveBasicSettings = () => {
    form.validateFields().then(values => {
      console.log('保存基本设置', values);
      // 这里添加保存逻辑
    });
  };

  // 添加企业类型优惠
  const handleAddDiscount = () => {
    setModalMode('add');
    setCurrentDiscount(null);
    discountForm.resetFields();
    setIsModalVisible(true);
  };

  // 编辑企业类型优惠
  const handleEditDiscount = (record: any) => {
    setModalMode('edit');
    setCurrentDiscount(record);
    discountForm.setFieldsValue({
      type: record.type,
      baseDiscount: record.baseDiscount * 100,
      discount3To6Months: record.discount3To6Months * 100,
      discountOver6Months: record.discountOver6Months * 100,
      discountOver12Months: record.discountOver12Months * 100
    });
    setIsModalVisible(true);
  };

  // 删除企业类型优惠
  const handleDeleteDiscount = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除企业类型 "${record.type}" 的优惠设置吗？`,
      onOk() {
        const newDiscounts = enterpriseDiscounts.filter(item => item.id !== record.id);
        setEnterpriseDiscounts(newDiscounts);
      }
    });
  };

  // 保存优惠设置
  const handleSaveDiscount = () => {
    discountForm.validateFields().then(values => {
      // 转换百分比为小数
      const formattedValues = {
        ...values,
        baseDiscount: values.baseDiscount / 100,
        discount3To6Months: values.discount3To6Months / 100,
        discountOver6Months: values.discountOver6Months / 100,
        discountOver12Months: values.discountOver12Months / 100
      };

      console.log('保存优惠设置', formattedValues);
      
      if (modalMode === 'add') {
        // 添加逻辑
        const newDiscount = {
          id: Date.now(), // 使用时间戳作为临时ID
          ...formattedValues
        };
        setEnterpriseDiscounts([...enterpriseDiscounts, newDiscount]);
      } else {
        // 编辑逻辑
        if (currentDiscount) {
          const newDiscounts = enterpriseDiscounts.map(item => 
            item.id === currentDiscount.id ? { ...item, ...formattedValues } : item
          );
          setEnterpriseDiscounts(newDiscounts);
        }
      }
      
      setIsModalVisible(false);
    });
  };

  // 表格列定义
  const columns = [
    {
      title: '企业类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '基础折扣',
      dataIndex: 'baseDiscount',
      key: 'baseDiscount',
      render: (value: number) => `${(value * 100).toFixed(0)}%`
    },
    {
      title: '3-6个月购买折扣',
      dataIndex: 'discount3To6Months',
      key: 'discount3To6Months',
      render: (value: number) => `${(value * 100).toFixed(0)}%`
    },
    {
      title: '6-12个月购买折扣',
      dataIndex: 'discountOver6Months',
      key: 'discountOver6Months',
      render: (value: number) => `${(value * 100).toFixed(0)}%`
    },
    {
      title: '12个月以上购买折扣',
      dataIndex: 'discountOver12Months',
      key: 'discountOver12Months',
      render: (value: number) => `${(value * 100).toFixed(0)}%`
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditDiscount(record)}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteDiscount(record)}
          />
        </Space>
      ),
    },
  ];

  // 计算月卡价格示例
  const calculateExamplePrice = () => {
    const basePrice = form.getFieldValue('basePrice') || 300;
    const discount = enterpriseDiscounts[0]?.discount3To6Months || 0.9;
    return (basePrice * 3 * discount).toFixed(0);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>月卡收费方案</Title>
        <Paragraph>
          设置停车月卡的基础价格和各种优惠策略，包括一人多车规则和不同企业类型的折扣方案。
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
        >
          <Title level={5}>基本设置</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="basePrice"
                label="月卡基础价格（元/月）"
                rules={[{ required: true, message: '请输入月卡基础价格' }]}
              >
                <InputNumber 
                  min={1} 
                  max={10000} 
                  style={{ width: '100%' }}
                  onChange={() => setIsResubmit(!isResubmit)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="multiCarLimit"
                label="一人多车上限（辆）"
                rules={[{ required: true, message: '请输入多车上限' }]}
              >
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="multiCarRule"
                label="一人多车规则"
                rules={[{ required: true, message: '请选择多车规则' }]}
              >
                <Radio.Group>
                  <Radio value="first">先出场的车辆享受月卡优惠</Radio>
                  <Radio value="main">指定主车牌享受月卡优惠</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Space style={{ marginBottom: '24px' }}>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={handleSaveBasicSettings}
            >
              保存基本设置
            </Button>
          </Space>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5}>企业类型优惠</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddDiscount}
            >
              添加企业类型优惠
            </Button>
          </div>

          <Table 
            columns={columns} 
            dataSource={enterpriseDiscounts} 
            rowKey="id" 
            pagination={false}
          />

          <Divider />

          <Title level={5}>价格计算示例</Title>
          <Card 
            size="small" 
            style={{ 
              width: '100%', 
              marginBottom: '24px', 
              backgroundColor: '#f5f5f5', 
              border: '1px dashed #d9d9d9' 
            }}
          >
            <Text>普通企业购买3个月月卡：</Text>
            <br />
            <Text>{`基础月价格 ${form.getFieldValue('basePrice') || 300} 元 × 3个月 × 3-6个月折扣 ${((enterpriseDiscounts[0]?.discount3To6Months || 0.9) * 100).toFixed(0)}% = ${calculateExamplePrice()} 元`}</Text>
            <br /><br />
            <Text type="secondary">注：最终折扣计算以实际配置为准，此处仅为示例。</Text>
          </Card>
        </Form>
      </Card>

      {/* 优惠设置弹窗 */}
      <Modal
        title={modalMode === 'add' ? '添加企业类型优惠' : '编辑企业类型优惠'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveDiscount}
        width={600}
      >
        <Form
          form={discountForm}
          layout="vertical"
        >
          <Form.Item
            name="type"
            label="企业类型"
            rules={[{ required: true, message: '请输入企业类型' }]}
          >
            <Input placeholder="请输入企业类型" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="baseDiscount"
                label="基础折扣(%)"
                rules={[{ required: true, message: '请输入基础折扣' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discount3To6Months"
                label="3-6个月购买折扣(%)"
                rules={[{ required: true, message: '请输入3-6个月购买折扣' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="discountOver6Months"
                label="6-12个月购买折扣(%)"
                rules={[{ required: true, message: '请输入6-12个月购买折扣' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discountOver12Months"
                label="12个月以上购买折扣(%)"
                rules={[{ required: true, message: '请输入12个月以上购买折扣' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default MonthlyPlanManagement; 