import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Radio, 
  Tabs, 
  Table, 
  Tag, 
  Row, 
  Col, 
  Statistic, 
  Alert, 
  Steps, 
  Divider, 
  Typography, 
  Space,
  Modal,
  message
} from 'antd';
import { 
  ThunderboltOutlined, 
  HistoryOutlined, 
  CreditCardOutlined, 
  WalletOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Step } = Steps;

// 模拟数据
interface ElectricityRecordItem {
  id: number;
  date: string;
  amount: number;
  type: 'charge' | 'usage';
  status: 'success' | 'pending' | 'failed';
  meterReading?: number;
  paymentMethod?: string;
  transactionId?: string;
}

interface MeterItem {
  id: string;
  address: string;
  meterNumber: string;
  balance: number;
  status: 'normal' | 'warning' | 'alarm';
}

const ElectricityService: React.FC = () => {
  const [activeTab, setActiveTab] = useState('balance');
  const [selectedMeter, setSelectedMeter] = useState<string>('1');
  const [rechargeAmount, setRechargeAmount] = useState<number | null>(100);
  const [paymentMethod, setPaymentMethod] = useState<string>('wallet');
  const [isRechargeModalVisible, setIsRechargeModalVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  // 模拟电表数据
  const meters: MeterItem[] = [
    {
      id: '1',
      address: 'A栋3层305室',
      meterNumber: 'EL-20240001',
      balance: 56.75,
      status: 'normal'
    },
    {
      id: '2',
      address: 'B栋2层208室',
      meterNumber: 'EL-20240032',
      balance: 22.30,
      status: 'warning'
    },
    {
      id: '3',
      address: 'C栋1层103室',
      meterNumber: 'EL-20240087',
      balance: 5.15,
      status: 'alarm'
    }
  ];

  // 模拟电费记录
  const electricityRecords: ElectricityRecordItem[] = [
    {
      id: 1,
      date: '2024-09-05',
      amount: 100.00,
      type: 'charge',
      status: 'success',
      paymentMethod: '微信支付',
      transactionId: 'TX202409050001'
    },
    {
      id: 2,
      date: '2024-09-03',
      amount: 15.32,
      type: 'usage',
      status: 'success',
      meterReading: 3064.7
    },
    {
      id: 3,
      date: '2024-09-01',
      amount: 17.85,
      type: 'usage',
      status: 'success',
      meterReading: 3049.4
    },
    {
      id: 4,
      date: '2024-08-20',
      amount: 200.00,
      type: 'charge',
      status: 'success',
      paymentMethod: '支付宝',
      transactionId: 'TX202408200023'
    },
    {
      id: 5,
      date: '2024-08-15',
      amount: 22.46,
      type: 'usage',
      status: 'success',
      meterReading: 3031.6
    }
  ];

  // 获取当前选中电表信息
  const getCurrentMeter = () => {
    return meters.find(meter => meter.id === selectedMeter) || meters[0];
  };

  // 表格列定义
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'charge' ? 'green' : 'blue'}>
          {type === 'charge' ? '充值' : '用电'}
        </Tag>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: ElectricityRecordItem) => (
        <span style={{ color: record.type === 'charge' ? '#52c41a' : '#1890ff' }}>
          {record.type === 'charge' ? '+' : '-'} ¥{amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        let text = '';
        switch (status) {
          case 'success':
            color = 'green';
            text = '成功';
            break;
          case 'pending':
            color = 'orange';
            text = '处理中';
            break;
          case 'failed':
            color = 'red';
            text = '失败';
            break;
          default:
            color = 'blue';
            text = '未知';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '详情',
      key: 'details',
      render: (text: string, record: ElectricityRecordItem) => (
        record.type === 'charge' ? (
          <span>充值方式: {record.paymentMethod}</span>
        ) : (
          <span>电表读数: {record.meterReading} kWh</span>
        )
      ),
    }
  ];

  // 处理充值提交
  const handleRechargeSubmit = () => {
    form.validateFields().then(values => {
      setIsRechargeModalVisible(true);
      setCurrent(0);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  // 处理付款确认
  const handlePaymentConfirm = () => {
    setCurrent(1);
    // 模拟支付过程
    setTimeout(() => {
      setCurrent(2);
    }, 1500);
  };

  // 完成充值
  const handleFinishRecharge = () => {
    setIsRechargeModalVisible(false);
    message.success('电费充值成功！');
    // 重置
    setCurrent(0);
    form.resetFields();
  };

  // 渲染余额查询内容
  const renderBalanceContent = () => {
    const currentMeter = getCurrentMeter();
    let statusColor = 'green';
    let statusText = '正常';
    
    if (currentMeter.status === 'warning') {
      statusColor = 'orange';
      statusText = '余额不足';
    } else if (currentMeter.status === 'alarm') {
      statusColor = 'red';
      statusText = '余额警告';
    }
    
    return (
      <div className="balance-content">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card bordered={false} className="meter-selection-card">
              <Title level={5}>选择电表</Title>
              <Select
                style={{ width: '100%' }}
                value={selectedMeter}
                onChange={value => setSelectedMeter(value)}
              >
                {meters.map(meter => (
                  <Option key={meter.id} value={meter.id}>
                    {meter.address} ({meter.meterNumber})
                  </Option>
                ))}
              </Select>
            </Card>
          </Col>
          
          <Col xs={24} md={16}>
            <Card bordered={false} className="meter-info-card">
              <div className="meter-status">
                <Tag color={statusColor}>{statusText}</Tag>
              </div>
              <Title level={3}>{currentMeter.address}</Title>
              <Paragraph>电表编号: {currentMeter.meterNumber}</Paragraph>
              
              <div className="meter-balance">
                <Statistic 
                  title="当前余额" 
                  value={currentMeter.balance} 
                  precision={2} 
                  prefix="¥"
                  valueStyle={{ 
                    color: currentMeter.status === 'alarm' ? '#f5222d' : 
                           currentMeter.status === 'warning' ? '#faad14' : '#3f8600' 
                  }}
                />
                <Button 
                  type="primary" 
                  icon={<ThunderboltOutlined />} 
                  size="large"
                  onClick={() => setActiveTab('recharge')}
                >
                  立即充值
                </Button>
              </div>
              
              {currentMeter.status === 'alarm' && (
                <Alert
                  message="余额警告"
                  description="您的电费余额不足，请尽快充值以避免影响用电。"
                  type="error"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}
              
              {currentMeter.status === 'warning' && (
                <Alert
                  message="余额不足提醒"
                  description="您的电费余额较低，建议及时充值。"
                  type="warning"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 渲染充值内容
  const renderRechargeContent = () => {
    const currentMeter = getCurrentMeter();
    
    return (
      <div className="recharge-content">
        <Card bordered={false}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ 
              meterId: selectedMeter,
              amount: 100,
              paymentMethod: 'wallet'
            }}
          >
            <Form.Item
              name="meterId"
              label="充值电表"
              rules={[{ required: true, message: '请选择充值电表' }]}
            >
              <Select 
                onChange={value => setSelectedMeter(value)}
                style={{ maxWidth: 400 }}
              >
                {meters.map(meter => (
                  <Option key={meter.id} value={meter.id}>
                    {meter.address} ({meter.meterNumber})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              label="当前余额"
            >
              <Space>
                <span>¥{currentMeter.balance.toFixed(2)}</span>
                <Tag color={
                  currentMeter.status === 'alarm' ? 'red' : 
                  currentMeter.status === 'warning' ? 'orange' : 'green'
                }>
                  {currentMeter.status === 'alarm' ? '余额警告' : 
                   currentMeter.status === 'warning' ? '余额不足' : '正常'}
                </Tag>
              </Space>
            </Form.Item>
            
            <Form.Item
              name="amount"
              label="充值金额"
              rules={[
                { required: true, message: '请输入充值金额' },
                { type: 'number', min: 10, message: '最低充值金额为10元' }
              ]}
            >
              <InputNumber 
                style={{ width: 200 }} 
                addonBefore="¥" 
                placeholder="请输入金额"
                precision={2}
                step={10}
                onChange={(value) => setRechargeAmount(value as number | null)}
              />
            </Form.Item>
            
            <div className="quick-amount">
              <span>快速选择: </span>
              <Button 
                type={rechargeAmount === 50 ? 'primary' : 'default'}
                onClick={() => {
                  form.setFieldsValue({ amount: 50 });
                  setRechargeAmount(50);
                }}
              >
                ¥50
              </Button>
              <Button 
                type={rechargeAmount === 100 ? 'primary' : 'default'}
                onClick={() => {
                  form.setFieldsValue({ amount: 100 });
                  setRechargeAmount(100);
                }}
              >
                ¥100
              </Button>
              <Button 
                type={rechargeAmount === 200 ? 'primary' : 'default'}
                onClick={() => {
                  form.setFieldsValue({ amount: 200 });
                  setRechargeAmount(200);
                }}
              >
                ¥200
              </Button>
              <Button 
                type={rechargeAmount === 500 ? 'primary' : 'default'}
                onClick={() => {
                  form.setFieldsValue({ amount: 500 });
                  setRechargeAmount(500);
                }}
              >
                ¥500
              </Button>
            </div>
            
            <Form.Item
              name="paymentMethod"
              label="支付方式"
              rules={[{ required: true, message: '请选择支付方式' }]}
            >
              <Radio.Group onChange={e => setPaymentMethod(e.target.value)}>
                <Radio.Button value="wallet">
                  <WalletOutlined /> 园区钱包
                </Radio.Button>
                <Radio.Button value="wechat">
                  <i className="fab fa-weixin" /> 微信支付
                </Radio.Button>
                <Radio.Button value="alipay">
                  <i className="fab fa-alipay" /> 支付宝
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                size="large" 
                icon={<CreditCardOutlined />}
                onClick={handleRechargeSubmit}
              >
                立即充值
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  };

  // 渲染历史记录内容
  const renderHistoryContent = () => {
    return (
      <div className="history-content">
        <Card bordered={false}>
          <Table 
            dataSource={electricityRecords} 
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    );
  };

  return (
    <div className="electricity-service">
      <Card className="service-card">
        <div className="service-header">
          <div className="service-title">
            <ThunderboltOutlined className="service-icon" />
            <Title level={3}>电费预充</Title>
          </div>
          <Paragraph className="service-desc">
            为您提供方便快捷的电费查询和充值服务，支持多种支付方式。
          </Paragraph>
        </div>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={<span><ThunderboltOutlined /> 电费余额</span>} 
            key="balance"
          >
            {renderBalanceContent()}
          </TabPane>
          <TabPane 
            tab={<span><CreditCardOutlined /> 在线充值</span>} 
            key="recharge"
          >
            {renderRechargeContent()}
          </TabPane>
          <TabPane 
            tab={<span><HistoryOutlined /> 历史记录</span>} 
            key="history"
          >
            {renderHistoryContent()}
          </TabPane>
        </Tabs>
      </Card>
      
      {/* 充值确认弹窗 */}
      <Modal
        title="电费充值"
        open={isRechargeModalVisible}
        footer={null}
        closable={current !== 1}
        maskClosable={current !== 1}
        onCancel={() => current !== 1 && setIsRechargeModalVisible(false)}
        width={500}
      >
        <Steps current={current} className="recharge-steps">
          <Step title="确认信息" icon={<ExclamationCircleOutlined />} />
          <Step title="支付中" icon={<ClockCircleOutlined />} />
          <Step title="充值成功" icon={<CheckCircleOutlined />} />
        </Steps>
        
        <div className="steps-content">
          {current === 0 && (
            <div className="confirm-info">
              <Paragraph>
                您将为以下电表充值电费：
              </Paragraph>
              <div className="confirm-item">
                <Text strong>电表地址：</Text>
                <Text>{getCurrentMeter().address}</Text>
              </div>
              <div className="confirm-item">
                <Text strong>电表编号：</Text>
                <Text>{getCurrentMeter().meterNumber}</Text>
              </div>
              <div className="confirm-item">
                <Text strong>充值金额：</Text>
                <Text>¥{rechargeAmount?.toFixed(2)}</Text>
              </div>
              <div className="confirm-item">
                <Text strong>支付方式：</Text>
                <Text>
                  {paymentMethod === 'wallet' ? '园区钱包' : 
                   paymentMethod === 'wechat' ? '微信支付' : '支付宝'}
                </Text>
              </div>
              
              <div className="confirm-buttons">
                <Button onClick={() => setIsRechargeModalVisible(false)}>取消</Button>
                <Button type="primary" onClick={handlePaymentConfirm}>
                  确认支付
                </Button>
              </div>
            </div>
          )}
          
          {current === 1 && (
            <div className="payment-process">
              <div className="payment-loading">
                <img src="https://via.placeholder.com/100x100/1890ff/FFFFFF?text=Pay" alt="支付中" />
              </div>
              <Paragraph style={{ textAlign: 'center', marginTop: 16 }}>
                正在处理您的支付请求，请稍候...
              </Paragraph>
            </div>
          )}
          
          {current === 2 && (
            <div className="payment-success">
              <div className="success-icon">
                <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
              </div>
              <Title level={4} style={{ textAlign: 'center', margin: '16px 0' }}>
                充值成功
              </Title>
              <div className="success-info">
                <div className="success-item">
                  <Text strong>交易号：</Text>
                  <Text>TX{Date.now().toString().substring(0, 10)}</Text>
                </div>
                <div className="success-item">
                  <Text strong>充值金额：</Text>
                  <Text>¥{rechargeAmount?.toFixed(2)}</Text>
                </div>
                <div className="success-item">
                  <Text strong>当前余额：</Text>
                  <Text>¥{(getCurrentMeter().balance + (rechargeAmount || 0)).toFixed(2)}</Text>
                </div>
              </div>
              <div className="confirm-buttons">
                <Button type="primary" onClick={handleFinishRecharge}>
                  完成
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
      
      <style>
        {`
          .electricity-service {
            max-width: 1000px;
            margin: 24px auto;
            padding: 0 16px;
          }
          
          .service-card {
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .service-header {
            margin-bottom: 24px;
          }
          
          .service-title {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }
          
          .service-icon {
            font-size: 24px;
            color: #1890ff;
            margin-right: 12px;
          }
          
          .service-desc {
            color: rgba(0, 0, 0, 0.65);
            margin-bottom: 0;
          }
          
          .balance-content, .recharge-content, .history-content {
            margin-top: 16px;
          }
          
          .meter-selection-card, .meter-info-card {
            height: 100%;
          }
          
          .meter-status {
            margin-bottom: 8px;
          }
          
          .meter-balance {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 24px;
          }
          
          .quick-amount {
            margin: 16px 0;
          }
          
          .quick-amount button {
            margin-left: 8px;
          }
          
          .recharge-steps {
            margin: 24px 0;
          }
          
          .steps-content {
            min-height: 200px;
            padding: 16px;
            margin-top: 16px;
            background-color: #fafafa;
            border-radius: 8px;
          }
          
          .confirm-item, .success-item {
            margin-bottom: 12px;
            display: flex;
          }
          
          .confirm-item strong, .success-item strong {
            width: 100px;
            display: inline-block;
          }
          
          .confirm-buttons, .success-buttons {
            margin-top: 24px;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
          }
          
          .payment-process, .payment-success {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          
          .payment-loading, .success-icon {
            margin: 16px 0;
          }
          
          .success-info {
            width: 100%;
            padding: 16px;
            background-color: #f6ffed;
            border: 1px solid #b7eb8f;
            border-radius: 8px;
            margin: 16px 0;
          }
          
          @media (max-width: 576px) {
            .electricity-service {
              padding: 0 8px;
              margin: 16px auto;
            }
            
            .meter-balance {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .meter-balance button {
              margin-top: 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ElectricityService; 