// 车位查询组件
import React, { useState, useEffect } from 'react';
import { 
  Card, List, Typography, Progress, Empty, 
  Tag, Space, Badge, Spin, Button
} from 'antd';
import { 
  CarOutlined, 
  EnvironmentOutlined
} from '@ant-design/icons';
import styles from './ParkingSpaceQuery.module.less';

const { Title, Text } = Typography;

const ParkingSpaceQuery: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [parkingLots, setParkingLots] = useState<any[]>([]);
  
  // 模拟获取停车场数据
  useEffect(() => {
    // 实际应用中应调用API
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: 'A区停车场',
          location: 'A区主楼东侧',
          totalSpaces: 120,
          availableSpaces: 28,
          occupancyRate: 76.67
        },
        {
          id: 2,
          name: 'B区地下停车场',
          location: 'B区地下一层',
          totalSpaces: 200,
          availableSpaces: 62,
          occupancyRate: 69
        },
        {
          id: 3,
          name: 'C区访客停车场',
          location: 'C区西门',
          totalSpaces: 80,
          availableSpaces: 15,
          occupancyRate: 81.25
        }
      ];
      setParkingLots(mockData);
      setLoading(false);
    }, 1000);
  }, []);
  
  // 获取车位状态标签
  const getStatusTag = (rate: number) => {
    if (rate >= 90) return <Tag color="red">拥挤</Tag>;
    if (rate >= 70) return <Tag color="orange">较满</Tag>;
    return <Tag color="green">充足</Tag>;
  };
  
  // 获取进度条状态颜色
  const getProgressColor = (rate: number) => {
    if (rate >= 90) return '#f5222d';
    if (rate >= 70) return '#fa8c16';
    return '#52c41a';
  };
  
  return (
    <div className={styles.container}>
      <Card className={styles.headerCard}>
        <Title level={4}>园区车位实时查询</Title>
        <Text type="secondary">实时查看园区各停车场可用车位情况，方便您规划出行</Text>
      </Card>
      
      <Spin spinning={loading} tip="加载中...">
        {parkingLots.length > 0 ? (
          <List
            className={styles.parkingList}
            dataSource={parkingLots}
            renderItem={item => (
              <Card className={styles.parkingCard} key={item.id}>
                <div className={styles.parkingInfo}>
                  <div className={styles.header}>
                    <div className={styles.name}>
                      <CarOutlined className={styles.icon} />
                      <Title level={5}>{item.name}</Title>
                      {getStatusTag(item.occupancyRate)}
                    </div>
                    <Button type="link">导航</Button>
                  </div>
                  
                  <div className={styles.location}>
                    <EnvironmentOutlined /> {item.location}
                  </div>
                  
                  <div className={styles.spaces}>
                    <Progress 
                      percent={item.occupancyRate} 
                      format={() => `${item.availableSpaces}/${item.totalSpaces}`}
                      strokeColor={getProgressColor(item.occupancyRate)}
                    />
                    <Text>可用车位: <Text strong type="success">{item.availableSpaces}</Text> 个</Text>
                  </div>
                </div>
              </Card>
            )}
          />
        ) : !loading ? (
          <Empty description="暂无车位信息" />
        ) : null}
      </Spin>
      
      <div className={styles.tips}>
        <Text type="secondary">提示: 车位数据每5分钟更新一次，仅供参考</Text>
      </div>
    </div>
  );
};

export default ParkingSpaceQuery;
