import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Tabs, 
  List, Avatar, Button, Tag, 
  Descriptions, Space, Empty, Modal, 
  Form, Input, DatePicker, message, Badge, Progress, Radio
} from 'antd';
import { 
  CreditCardOutlined, 
  CarOutlined,
  ReloadOutlined,
  SwapOutlined,
  ExclamationCircleOutlined,
  WalletOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './MyParkingCards.module.less';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface CardItem {
  id: string;
  cardType: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired';
  vehicles: string[];
  remainingDays: number;
}

const MyParkingCards: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [transferVisible, setTransferVisible] = useState(false);
  const [transferForm] = Form.useForm();
  const [renewVisible, setRenewVisible] = useState(false);
  
  // 模拟加载月卡数据
  useEffect(() => {
    // 实际应用中应调用API
    setTimeout(() => {
      const mockData: CardItem[] = [
        {
          id: '1',
          cardType: '月卡',
          startDate: '2023-09-01',
          endDate: '2023-10-01',
          status: 'active',
          vehicles: ['京A12345', '京B54321'],
          remainingDays: 12
        },
        {
          id: '2',
          cardType: '季卡',
          startDate: '2023-07-01',
          endDate: '2023-10-01',
          status: 'expiring',
          vehicles: ['京C11111'],
          remainingDays: 5
        }
      ];
      setCards(mockData);
      setLoading(false);
    }, 1000);
  }, []);
  
  // 获取卡片状态标签
  const getStatusTag = (status: string) => {
    if (status === 'active') return <Tag color="green">有效</Tag>;
    if (status === 'expiring') return <Tag color="orange">即将到期</Tag>;
    return <Tag color="red">已过期</Tag>;
  };
  
  // 打开转让弹窗
  const handleTransfer = (card: CardItem) => {
    setSelectedCard(card);
    setTransferVisible(true);
  };
  
  // 打开续费弹窗
  const handleRenew = (card: CardItem) => {
    setSelectedCard(card);
    setRenewVisible(true);
  };
  
  // 提交转让
  const handleTransferSubmit = () => {
    transferForm.validateFields().then(values => {
      message.success(`已成功转让给${values.transferTo}`);
      setTransferVisible(false);
      transferForm.resetFields();
    });
  };
  
  // 续费月卡
  const handleRenewSubmit = () => {
    message.success('续费成功！');
    setRenewVisible(false);
  };
  
  return (
    <div className={styles.container}>
      <Card className={styles.mainCard}>
        <Title level={4} className={styles.title}>
          <CreditCardOutlined /> 我的月卡
        </Title>
        
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : cards.length > 0 ? (
          <List
            dataSource={cards}
            renderItem={card => (
              <Card key={card.id} className={styles.cardItem}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <CreditCardOutlined className={styles.cardIcon} />
                    <span>{card.cardType}</span>
                    {getStatusTag(card.status)}
                  </div>
                  <Space>
                    <Button 
                      type="primary"
                      onClick={() => handleRenew(card)}
                      danger={card.status === 'expiring'}
                    >
                      {card.status === 'expiring' ? '立即续费' : '续费'}
                    </Button>
                    <Button onClick={() => handleTransfer(card)}>
                      转让
                    </Button>
                  </Space>
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.remainingDays}>
                    <div className={styles.daysCircle}>
                      <Progress
                        type="circle"
                        percent={Math.min(100, (card.remainingDays / 30) * 100)}
                        format={() => card.remainingDays}
                        width={80}
                        strokeColor={
                          card.remainingDays > 15 ? '#52c41a' : 
                          card.remainingDays > 7 ? '#faad14' : '#ff4d4f'
                        }
                      />
                      <div className={styles.daysText}>剩余天数</div>
                    </div>
                  </div>
                  
                  <Descriptions column={1} className={styles.cardInfo}>
                    <Descriptions.Item label="生效日期">
                      {card.startDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="到期日期">
                      {card.endDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="已绑定车辆">
                      <Space wrap>
                        {card.vehicles.map(vehicle => (
                          <Tag icon={<CarOutlined />} key={vehicle}>
                            {vehicle}
                          </Tag>
                        ))}
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Card>
            )}
          />
        ) : (
          <Empty 
            description="您暂无停车月卡" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" href="/service/parking/card">购买月卡</Button>
          </Empty>
        )}
      </Card>
      
      {/* 转让弹窗 */}
      <Modal
        title="月卡转让"
        open={transferVisible}
        onCancel={() => setTransferVisible(false)}
        onOk={handleTransferSubmit}
      >
        <Form form={transferForm} layout="vertical">
          <Form.Item
            name="transferTo"
            label="转让用户手机号"
            rules={[
              { required: true, message: '请输入转让用户手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]}
          >
            <Input placeholder="请输入接收方手机号" />
          </Form.Item>
          <Form.Item
            name="reason"
            label="转让原因"
          >
            <Input.TextArea placeholder="请输入转让原因（可选）" rows={3} />
          </Form.Item>
          
          {selectedCard && (
            <div className={styles.transferInfo}>
              <Paragraph>
                <Text strong>转让说明：</Text>
              </Paragraph>
              <ul>
                <li>月卡转让后，原卡将立即失效</li>
                <li>转让后的月卡有效期保持不变，截止日期仍为 {selectedCard.endDate}</li>
                <li>转让完成后不可撤销，请谨慎操作</li>
              </ul>
            </div>
          )}
        </Form>
      </Modal>
      
      {/* 续费弹窗 */}
      <Modal
        title="月卡续费"
        open={renewVisible}
        onCancel={() => setRenewVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRenewVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleRenewSubmit}>
            确认支付
          </Button>,
        ]}
      >
        {selectedCard && (
          <div className={styles.renewInfo}>
            <Descriptions column={1}>
              <Descriptions.Item label="当前月卡类型">
                {selectedCard.cardType}
              </Descriptions.Item>
              <Descriptions.Item label="到期日期">
                {selectedCard.endDate}
              </Descriptions.Item>
              <Descriptions.Item label="续费周期">
                <Radio.Group defaultValue="1month">
                  <Space direction="vertical">
                    <Radio value="1month">1个月 - ¥300</Radio>
                    <Radio value="3month">3个月 - ¥810 (9折)</Radio>
                    <Radio value="6month">6个月 - ¥1530 (8.5折)</Radio>
                    <Radio value="12month">12个月 - ¥2880 (8折)</Radio>
                  </Space>
                </Radio.Group>
              </Descriptions.Item>
              <Descriptions.Item label="支付方式">
                <Radio.Group defaultValue="wechat">
                  <Radio value="wechat">微信支付</Radio>
                  <Radio value="alipay">支付宝</Radio>
                  <Radio value="balance">预付款支付</Radio>
                </Radio.Group>
              </Descriptions.Item>
            </Descriptions>
            
            <div className={styles.renewPrice}>
              <Text>应付金额：</Text>
              <Text strong style={{ fontSize: 24, color: '#1890ff' }}>¥300.00</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyParkingCards;
