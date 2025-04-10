// 停车月卡购买组件
import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Steps, Form, Input, Select, 
  DatePicker, Button, Radio, Row, Col, Divider,
  Statistic, Alert, List, Space, Table, Tag, message,
  Modal, Result
} from 'antd';
import { 
  CreditCardOutlined, 
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  SolutionOutlined,
  WalletOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import styles from './ParkingCardPurchase.module.less';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;

// 模拟企业类型
const enterpriseTypes = [
  { id: 1, name: '普通企业', discount: 1 },
  { id: 2, name: '重点企业', discount: 0.9 },
  { id: 3, name: '战略合作伙伴', discount: 0.8 }
];

// 模拟月卡方案
const cardPlans = [
  { id: 1, months: 1, name: '月卡', basePrice: 300, discountRate: 1 },
  { id: 2, months: 3, name: '季卡', basePrice: 900, discountRate: 0.9 },
  { id: 3, months: 6, name: '半年卡', basePrice: 1800, discountRate: 0.85 },
  { id: 4, months: 12, name: '年卡', basePrice: 3600, discountRate: 0.8 }
];

interface VehicleItem {
  key: string;
  licensePlate: string;
  vehicleType: string;
  status: string;
}

const ParkingCardPurchase: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [cardPlan, setCardPlan] = useState<any>(cardPlans[0]);
  const [enterpriseType, setEnterpriseType] = useState<any>(enterpriseTypes[0]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // 模拟已绑定的车辆数据
  const vehicles: VehicleItem[] = [
    { key: '1', licensePlate: '京A12345', vehicleType: '小型汽车', status: '正常' },
    { key: '2', licensePlate: '京B54321', vehicleType: '新能源汽车', status: '正常' },
  ];
  
  // 表格列定义
  const columns: ColumnsType<VehicleItem> = [
    {
      title: '车牌号',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
    },
    {
      title: '车辆类型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '正常' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
  ];
  
  // 已选车辆的rowSelection配置
  const rowSelection = {
    selectedRowKeys: selectedVehicles,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedVehicles(selectedRowKeys as string[]);
    },
    getCheckboxProps: (record: VehicleItem) => ({
      disabled: selectedVehicles.length >= 3 && !selectedVehicles.includes(record.key),
    }),
  };
  
  // 计算最终价格
  const calculatePrice = () => {
    const basePrice = cardPlan.basePrice;
    const enterpriseDiscount = enterpriseType.discount;
    const periodDiscount = cardPlan.discountRate;
    
    return (basePrice * enterpriseDiscount * periodDiscount).toFixed(2);
  };
  
  // 下一步
  const handleNext = () => {
    if (currentStep === 0) {
      form.validateFields().then(() => {
        setCurrentStep(1);
      });
    } else if (currentStep === 1) {
      if (selectedVehicles.length === 0) {
        message.error('请至少选择一辆车');
        return;
      }
      setCurrentStep(2);
    }
  };
  
  // 上一步
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // 提交支付
  const handleSubmit = () => {
    setLoading(true);
    // 模拟支付过程
    setTimeout(() => {
      setLoading(false);
      setOrderComplete(true);
    }, 2000);
  };
  
  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // 选择月卡类型
        return (
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              enterpriseType: enterpriseTypes[0].id,
              cardPlan: cardPlans[0].id,
              startDate: dayjs()
            }}
          >
            <Form.Item
              name="enterpriseType"
              label="企业类型"
              rules={[{ required: true, message: '请选择企业类型' }]}
            >
              <Select 
                placeholder="请选择企业类型" 
                onChange={(value) => {
                  const selected = enterpriseTypes.find(type => type.id === value);
                  if (selected) setEnterpriseType(selected);
                }}
              >
                {enterpriseTypes.map(type => (
                  <Option key={type.id} value={type.id}>{type.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="cardPlan"
              label="月卡套餐"
              rules={[{ required: true, message: '请选择月卡套餐' }]}
            >
              <Radio.Group 
                onChange={(e) => {
                  const selected = cardPlans.find(plan => plan.id === e.target.value);
                  if (selected) setCardPlan(selected);
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {cardPlans.map(plan => (
                    <Card key={plan.id} className={form.getFieldValue('cardPlan') === plan.id ? styles.selectedCard : ''}>
                      <Radio value={plan.id}>
                        <div className={styles.planCard}>
                          <div>
                            <Text strong>{plan.name}</Text>
                            <Text type="secondary"> ({plan.months}个月)</Text>
                          </div>
                          <div>
                            <Text type="danger">¥{plan.basePrice}</Text>
                            {plan.discountRate < 1 && (
                              <Text type="secondary"> ({(plan.discountRate * 10).toFixed(1)}折)</Text>
                            )}
                          </div>
                        </div>
                      </Radio>
                    </Card>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item
              name="startDate"
              label="生效日期"
              rules={[{ required: true, message: '请选择生效日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        );
        
      case 1: // 选择车辆
        return (
          <div className={styles.vehiclesStep}>
            <Alert
              message="一个账户最多可以为3辆车办理月卡，先出场的车辆享受月卡优惠"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={vehicles}
              pagination={false}
            />
            
            <div className={styles.addVehicle}>
              <Button type="dashed" block icon={<CarOutlined />}>
                绑定新车辆
              </Button>
            </div>
          </div>
        );
        
      case 2: // 确认支付
        return (
          <div className={styles.confirmStep}>
            <Card className={styles.orderSummary}>
              <Statistic
                title="应付金额"
                value={calculatePrice()}
                precision={2}
                prefix="¥"
                valueStyle={{ color: '#1890ff', fontSize: 36 }}
              />
              
              <Divider />
              
              <List>
                <List.Item>
                  <Text>套餐类型</Text>
                  <Text>{cardPlan.name} ({cardPlan.months}个月)</Text>
                </List.Item>
                <List.Item>
                  <Text>企业类型</Text>
                  <Text>{enterpriseType.name}</Text>
                </List.Item>
                <List.Item>
                  <Text>基础价格</Text>
                  <Text>¥{cardPlan.basePrice}</Text>
                </List.Item>
                <List.Item>
                  <Text>企业折扣</Text>
                  <Text>{(enterpriseType.discount * 10).toFixed(1)}折</Text>
                </List.Item>
                <List.Item>
                  <Text>时长优惠</Text>
                  <Text>{(cardPlan.discountRate * 10).toFixed(1)}折</Text>
                </List.Item>
                <List.Item>
                  <Text>车辆数量</Text>
                  <Text>{selectedVehicles.length}辆</Text>
                </List.Item>
                <List.Item>
                  <Text>生效日期</Text>
                  <Text>{form.getFieldValue('startDate').format('YYYY-MM-DD')}</Text>
                </List.Item>
                <List.Item>
                  <Text>到期日期</Text>
                  <Text>{form.getFieldValue('startDate').add(cardPlan.months, 'month').format('YYYY-MM-DD')}</Text>
                </List.Item>
              </List>
              
              <Divider />
              
              <div className={styles.paymentMethods}>
                <Title level={5}>选择支付方式</Title>
                <Radio.Group 
                  onChange={e => setPaymentMethod(e.target.value)} 
                  value={paymentMethod}
                >
                  <Radio value="wechat">微信支付</Radio>
                  <Radio value="alipay">支付宝</Radio>
                  <Radio value="unionpay">银联支付</Radio>
                  <Radio value="balance">预付款支付</Radio>
                </Radio.Group>
              </div>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  if (orderComplete) {
    return (
      <Result
        status="success"
        title="购买成功"
        subTitle={`您已成功购买${cardPlan.name}，有效期至${form.getFieldValue('startDate').add(cardPlan.months, 'month').format('YYYY-MM-DD')}`}
        extra={[
          <Button type="primary" key="console" onClick={() => window.location.href = '/user/my-card'}>
            查看我的月卡
          </Button>,
          <Button key="buy" onClick={() => {
            setCurrentStep(0);
            setOrderComplete(false);
            form.resetFields();
            setSelectedVehicles([]);
          }}>
            继续购买
          </Button>,
        ]}
      />
    );
  }
  
  return (
    <div className={styles.container}>
      <Card className={styles.mainCard}>
        <Title level={4} className={styles.title}>
          <CreditCardOutlined /> 停车月卡购买
        </Title>
        
        <Steps
          current={currentStep}
          items={[
            {
              title: '选择套餐',
              icon: <SolutionOutlined />,
            },
            {
              title: '选择车辆',
              icon: <CarOutlined />,
            },
            {
              title: '确认支付',
              icon: <WalletOutlined />,
            }
          ]}
        />
        
        <div className={styles.stepContent}>
          {renderStepContent()}
        </div>
        
        <div className={styles.stepActions}>
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={handlePrev}>
              上一步
            </Button>
          )}
          {currentStep < 2 ? (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          ) : (
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={loading}
            >
              立即支付
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ParkingCardPurchase;
