// 临停缴费组件
import React, { useState } from 'react';
import { 
  Card, Input, Button, Form, Typography, 
  Divider, Result, Steps, Spin, Row, Col,
  Statistic, Radio, Modal, message
} from 'antd';
import { 
  CarOutlined, 
  SearchOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import styles from './TempParkingPayment.module.less';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const TempParkingPayment: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [parkingInfo, setParkingInfo] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  
  // 查询车辆费用
  const handleSearch = (values: { licensePlate: string }) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      // 实际应用中根据API返回数据
      const mockData = {
        licensePlate: values.licensePlate,
        parkingLot: 'A区停车场',
        entranceGate: 'A区东门',
        entryTime: '2023-10-25 09:15:23',
        parkingDuration: '2小时45分钟',
        fee: 15,
        status: 'unpaid'
      };
      
      setParkingInfo(mockData);
      setLoading(false);
      setCurrentStep(1);
    }, 1500);
  };
  
  // 支付停车费
  const handlePayment = () => {
    setLoading(true);
    
    // 模拟支付过程
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(2);
      message.success('支付成功！');
    }, 2000);
  };
  
  // 企业支付二维码弹窗
  const [qrVisible, setQrVisible] = useState(false);
  
  // 显示内容根据步骤
  const renderStepContent = () => {
    switch(currentStep) {
      case 0: // 车牌查询
        return (
          <Form 
            form={form} 
            onFinish={handleSearch}
            layout="vertical"
            className={styles.searchForm}
          >
            <Form.Item
              name="licensePlate"
              label="请输入车牌号"
              rules={[{ required: true, message: '请输入车牌号' }]}
            >
              <Input 
                placeholder="请输入完整车牌号" 
                size="large"
                prefix={<CarOutlined />}
                maxLength={8}
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
                size="large"
                block
                loading={loading}
              >
                查询停车费
              </Button>
            </Form.Item>
            
            <Divider>或</Divider>
            
            <Button 
              type="link" 
              block 
              onClick={() => setQrVisible(true)}
            >
              使用企业访客二维码
            </Button>
          </Form>
        );
        
      case 1: // 费用确认与支付
        return (
          <div className={styles.paymentInfo}>
            <Card className={styles.feeCard}>
              <Statistic 
                title="应付金额" 
                value={parkingInfo.fee} 
                precision={2} 
                prefix="¥" 
                valueStyle={{ color: '#1890ff', fontSize: 36 }}
              />
              
              <div className={styles.parkingDetails}>
                <Row gutter={[0, 12]}>
                  <Col span={12}><Text type="secondary">车牌号:</Text></Col>
                  <Col span={12}><Text strong>{parkingInfo.licensePlate}</Text></Col>
                  
                  <Col span={12}><Text type="secondary">停车场:</Text></Col>
                  <Col span={12}><Text>{parkingInfo.parkingLot}</Text></Col>
                  
                  <Col span={12}><Text type="secondary">入场时间:</Text></Col>
                  <Col span={12}><Text>{parkingInfo.entryTime}</Text></Col>
                  
                  <Col span={12}><Text type="secondary">停车时长:</Text></Col>
                  <Col span={12}><Text>{parkingInfo.parkingDuration}</Text></Col>
                </Row>
              </div>
              
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
              
              <Button 
                type="primary" 
                size="large" 
                block 
                icon={<WalletOutlined />} 
                className={styles.payButton}
                onClick={handlePayment}
                loading={loading}
              >
                立即支付
              </Button>
            </Card>
          </div>
        );
        
      case 2: // 支付成功
        return (
          <Result
            status="success"
            title="支付成功"
            subTitle={`停车费 ¥${parkingInfo.fee} 元已支付完成，请在15分钟内驶离停车场`}
            extra={[
              <Button type="primary" key="done" onClick={() => setCurrentStep(0)}>
                完成
              </Button>,
              <Button key="receipt" onClick={() => message.info('发票功能开发中')}>
                申请发票
              </Button>,
            ]}
          />
        );
    }
  };
  
  return (
    <div className={styles.container}>
      <Card className={styles.mainCard}>
        <Title level={4} className={styles.title}>
          <CarOutlined /> 临停缴费
        </Title>
        
        <Steps 
          current={currentStep}
          className={styles.steps}
          items={[
            {
              title: '查询车辆',
              icon: <CarOutlined />,
            },
            {
              title: '费用支付',
              icon: <WalletOutlined />,
            },
            {
              title: '支付完成',
              icon: <CheckCircleOutlined />,
            }
          ]}
        />
        
        <div className={styles.stepContent}>
          <Spin spinning={loading} tip="处理中...">
            {renderStepContent()}
          </Spin>
        </div>
      </Card>
      
      {/* 企业访客二维码弹窗 */}
      <Modal
        title="企业访客停车"
        open={qrVisible}
        onCancel={() => setQrVisible(false)}
        footer={null}
        centered
      >
        <div className={styles.qrCodeContainer}>
          <Paragraph>
            请输入您要访问的企业名称，生成企业访客停车二维码
          </Paragraph>
          <Form layout="vertical">
            <Form.Item
              label="企业名称"
              name="enterpriseName"
              rules={[{ required: true, message: '请输入企业名称' }]}
            >
              <Input placeholder="请输入企业名称" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block>
                查询企业
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default TempParkingPayment;
