import React, { useState } from 'react';
import { Row, Col, Card, Tree, Space, Button, Tooltip, Modal, Alert } from 'antd';
import { InfoCircleOutlined, SearchOutlined, ZoomInOutlined, ZoomOutOutlined, RedoOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd/es/tree';

const { DirectoryTree } = Tree;

// 房屋状态颜色定义
const roomStatusColors = {
  available: '#52c41a', // 待出租
  rented: '#1890ff',    // 已出租
  reserved: '#faad14',  // 已预定
  expiringSoon: '#fa8c16', // 即将到期
  expired: '#ff4d4f',   // 已到期
  sold: '#8c8c8c',      // 已销售
};

// 房间组件，根据状态展示不同颜色
const Room = ({ 
  id, 
  name, 
  status, 
  area, 
  tenant, 
  endDate, 
  onClick 
}: { 
  id: string, 
  name: string, 
  status: 'available' | 'rented' | 'reserved' | 'expiringSoon' | 'expired' | 'sold', 
  area: number,
  tenant?: string,
  endDate?: string,
  onClick: (id: string) => void
}) => (
  <Tooltip title={
    <div>
      <p><strong>房间号：</strong>{name}</p>
      <p><strong>面积：</strong>{area}㎡</p>
      {tenant && <p><strong>租户：</strong>{tenant}</p>}
      {endDate && <p><strong>到期日：</strong>{endDate}</p>}
      <p><strong>状态：</strong>{
        status === 'available' ? '待出租' : 
        status === 'rented' ? '已出租' : 
        status === 'reserved' ? '已预定' : 
        status === 'expiringSoon' ? '即将到期' : 
        status === 'expired' ? '已到期' : '已销售'
      }</p>
    </div>
  }>
    <div 
      onClick={() => onClick(id)}
      style={{ 
        width: 60, 
        height: 60, 
        backgroundColor: roomStatusColors[status], 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 'bold',
        borderRadius: 4,
        margin: 4
      }}
    >
      <div>{name}</div>
      <div style={{ fontSize: 12 }}>{area}㎡</div>
    </div>
  </Tooltip>
);

// 楼层组件，展示该层的所有房间
const Floor = ({ 
  id, 
  name, 
  rooms,
  onRoomClick
}: {
  id: string,
  name: string,
  rooms: {
    id: string,
    name: string,
    status: 'available' | 'rented' | 'reserved' | 'expiringSoon' | 'expired' | 'sold',
    area: number,
    tenant?: string,
    endDate?: string
  }[],
  onRoomClick: (id: string) => void
}) => (
  <Card 
    title={name} 
    style={{ marginBottom: 16 }}
    extra={<Button type="link" icon={<ZoomInOutlined />}>查看平面图</Button>}
  >
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {rooms.map(room => (
        <Room 
          key={room.id}
          id={room.id}
          name={room.name}
          status={room.status}
          area={room.area}
          tenant={room.tenant}
          endDate={room.endDate}
          onClick={onRoomClick}
        />
      ))}
    </div>
  </Card>
);

// 模拟数据 - 实际应用中应该从API获取
const treeData: { key: string, title: string, children?: any[] }[] = [
  {
    key: 'park-1',
    title: '湘江科创基地',
    children: [
      {
        key: 'area-1',
        title: 'A区 - 研发中心',
        children: [
          {
            key: 'building-1',
            title: 'A1栋 - 创新楼',
          },
          {
            key: 'building-2',
            title: 'A2栋 - 科技楼',
          },
        ],
      },
      {
        key: 'area-2',
        title: 'B区 - 孵化中心',
        children: [
          {
            key: 'building-3',
            title: 'B1栋 - 孵化器',
          },
          {
            key: 'building-4',
            title: 'B2栋 - 加速器',
          },
        ],
      },
    ],
  },
];

// 模拟楼层和房间数据
const floorData = [
  {
    id: 'floor-1',
    name: '1层',
    buildingId: 'building-1',
    rooms: Array(12).fill(null).map((_, index) => ({
      id: `room-1-${index + 1}`,
      name: `101${index + 1}`,
      status: ['available', 'rented', 'reserved', 'expiringSoon', 'expired', 'sold'][Math.floor(Math.random() * 6)] as 'available' | 'rented' | 'reserved' | 'expiringSoon' | 'expired' | 'sold',
      area: Math.floor(Math.random() * 50) + 30,
      tenant: Math.random() > 0.5 ? '湖南创新科技有限公司' : undefined,
      endDate: Math.random() > 0.5 ? '2023-12-31' : undefined
    }))
  },
  {
    id: 'floor-2',
    name: '2层',
    buildingId: 'building-1',
    rooms: Array(10).fill(null).map((_, index) => ({
      id: `room-2-${index + 1}`,
      name: `201${index + 1}`,
      status: ['available', 'rented', 'reserved', 'expiringSoon', 'expired', 'sold'][Math.floor(Math.random() * 6)] as 'available' | 'rented' | 'reserved' | 'expiringSoon' | 'expired' | 'sold',
      area: Math.floor(Math.random() * 50) + 30,
      tenant: Math.random() > 0.5 ? '长沙数字技术有限公司' : undefined,
      endDate: Math.random() > 0.5 ? '2023-11-30' : undefined
    }))
  },
  {
    id: 'floor-3',
    name: '3层',
    buildingId: 'building-1',
    rooms: Array(8).fill(null).map((_, index) => ({
      id: `room-3-${index + 1}`,
      name: `301${index + 1}`,
      status: ['available', 'rented', 'reserved', 'expiringSoon', 'expired', 'sold'][Math.floor(Math.random() * 6)] as 'available' | 'rented' | 'reserved' | 'expiringSoon' | 'expired' | 'sold',
      area: Math.floor(Math.random() * 50) + 30,
      tenant: Math.random() > 0.5 ? '湘江人工智能研究院' : undefined,
      endDate: Math.random() > 0.5 ? '2024-06-30' : undefined
    }))
  }
];

/**
 * 租控图组件
 * 可视化展示园区楼栋、楼层和房间的出租情况
 */
const RentControlMap: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('building-1');
  const [roomDetailVisible, setRoomDetailVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // 模拟房间详情数据
  const roomDetailData = selectedRoom ? {
    id: selectedRoom,
    name: selectedRoom.split('-').pop() || '',
    area: 45,
    status: 'rented' as const,
    tenant: '湖南创新科技有限公司',
    contractNo: 'HT2023001',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    rentPrice: 80,
    totalRent: 3600,
    contact: '张三',
    phone: '13800138000'
  } : null;

  // 处理树节点选择
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    if (selectedKeys.length > 0 && selectedKeys[0].toString().startsWith('building-')) {
      setSelectedBuilding(selectedKeys[0].toString());
    }
  };

  // 处理房间点击
  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId);
    setRoomDetailVisible(true);
  };

  return (
    <div className="rent-control-map">
      <Row gutter={16}>
        <Col span={6}>
          <Card title="园区结构" style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
            <DirectoryTree
              defaultExpandAll
              onSelect={onSelect}
              treeData={treeData}
              selectedKeys={[selectedBuilding]}
            />
          </Card>
        </Col>
        <Col span={18}>
          <Card 
            title={`房间租控图 - ${treeData[0].children?.find(area => 
              area.children?.some(building => building.key === selectedBuilding)
            )?.children?.find(building => 
              building.key === selectedBuilding
            )?.title || ''}`}
            extra={
              <Space>
                <Tooltip title="图例说明">
                  <Button icon={<InfoCircleOutlined />}>图例</Button>
                </Tooltip>
                <Tooltip title="搜索房间">
                  <Button icon={<SearchOutlined />}>搜索</Button>
                </Tooltip>
                <Tooltip title="放大">
                  <Button icon={<ZoomInOutlined />} />
                </Tooltip>
                <Tooltip title="缩小">
                  <Button icon={<ZoomOutOutlined />} />
                </Tooltip>
                <Tooltip title="重置">
                  <Button icon={<RedoOutlined />} />
                </Tooltip>
              </Space>
            }
            style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}
          >
            <div className="legend" style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
              {Object.entries({
                available: '待出租',
                rented: '已出租',
                reserved: '已预定',
                expiringSoon: '即将到期',
                expired: '已到期',
                sold: '已销售'
              }).map(([status, label]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: roomStatusColors[status as keyof typeof roomStatusColors],
                    marginRight: 8,
                    borderRadius: 2
                  }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="floors">
              {floorData.filter(floor => floor.buildingId === selectedBuilding).map(floor => (
                <Floor 
                  key={floor.id}
                  id={floor.id}
                  name={floor.name}
                  rooms={floor.rooms}
                  onRoomClick={handleRoomClick}
                />
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 房间详情模态框 */}
      <Modal
        title="房间详情"
        open={roomDetailVisible}
        onCancel={() => setRoomDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setRoomDetailVisible(false)}>
            关闭
          </Button>,
          <Button key="contract" type="primary">
            查看合同
          </Button>,
        ]}
        width={600}
      >
        {roomDetailData && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div>房间号：{roomDetailData.name}</div>
              </Col>
              <Col span={12}>
                <div>面积：{roomDetailData.area}㎡</div>
              </Col>
              <Col span={12}>
                <div>状态：{
                  roomDetailData.status === 'available' ? '待出租' : 
                  roomDetailData.status === 'rented' ? '已出租' : 
                  roomDetailData.status === 'reserved' ? '已预定' : 
                  roomDetailData.status === 'expiringSoon' ? '即将到期' : 
                  roomDetailData.status === 'expired' ? '已到期' : '已销售'
                }</div>
              </Col>
              <Col span={24}>
                <div className="divider" style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />
              </Col>
              <Col span={24}>
                <div><strong>租户信息</strong></div>
              </Col>
              <Col span={12}>
                <div>企业名称：{roomDetailData.tenant}</div>
              </Col>
              <Col span={12}>
                <div>联系人：{roomDetailData.contact}</div>
              </Col>
              <Col span={12}>
                <div>联系电话：{roomDetailData.phone}</div>
              </Col>
              <Col span={24}>
                <div className="divider" style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />
              </Col>
              <Col span={24}>
                <div><strong>合同信息</strong></div>
              </Col>
              <Col span={12}>
                <div>合同编号：{roomDetailData.contractNo}</div>
              </Col>
              <Col span={12}>
                <div>租金单价：{roomDetailData.rentPrice}元/㎡/月</div>
              </Col>
              <Col span={12}>
                <div>开始日期：{roomDetailData.startDate}</div>
              </Col>
              <Col span={12}>
                <div>结束日期：{roomDetailData.endDate}</div>
              </Col>
              <Col span={12}>
                <div>月租金：{roomDetailData.totalRent}元</div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RentControlMap; 