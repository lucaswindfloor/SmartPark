import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Typography, 
  Button, 
  Space, 
  Input, 
  Tag, 
  Modal, 
  Form, 
  InputNumber, 
  Select,
  Divider,
  Row,
  Col,
  Progress,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  ExportOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { message } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

// 模拟数据
const mockParkingLots = [
  { 
    id: 1, 
    name: 'A区一号楼停车场', 
    location: 'A区一号楼东侧', 
    totalSpaces: 200, 
    availableSpaces: 44,
    usageRate: 78,
    status: 'normal' 
  },
  { 
    id: 2, 
    name: 'A区二号楼停车场', 
    location: 'A区二号楼地下一层', 
    totalSpaces: 300, 
    availableSpaces: 90,
    usageRate: 70,
    status: 'normal' 
  },
  { 
    id: 3, 
    name: 'B区主楼停车场', 
    location: 'B区主楼西侧', 
    totalSpaces: 250, 
    availableSpaces: 70,
    usageRate: 72,
    status: 'crowded' 
  },
  { 
    id: 4, 
    name: 'C区地下停车场', 
    location: 'C区综合楼地下', 
    totalSpaces: 450, 
    availableSpaces: 210,
    usageRate: 53,
    status: 'normal' 
  },
];

// 模拟区域数据
const mockAreaData = [
  { id: 1, parkingLotId: 1, name: 'A-1', spaceCount: 100, type: 'normal' },
  { id: 2, parkingLotId: 1, name: 'A-2', spaceCount: 80, type: 'monthly' },
  { id: 3, parkingLotId: 1, name: 'A-3', spaceCount: 15, type: 'visitor' },
  { id: 4, parkingLotId: 1, name: 'A-4', spaceCount: 5, type: 'disabled' },
];

// 模拟车辆出入记录数据
const mockAccessRecords = [
  { id: 1, parkingLotId: 1, licensePlate: '京A12345', enterTime: '2023-08-01 08:23:45', exitTime: null },
  { id: 2, parkingLotId: 1, licensePlate: '京B54321', enterTime: '2023-08-01 09:10:32', exitTime: null },
  { id: 3, parkingLotId: 2, licensePlate: '京C98765', enterTime: '2023-08-01 07:55:18', exitTime: null },
  { id: 4, parkingLotId: 3, licensePlate: '京D13579', enterTime: '2023-08-01 08:30:00', exitTime: null },
  { id: 5, parkingLotId: 3, licensePlate: '京E24680', enterTime: '2023-08-01 10:15:22', exitTime: null },
  { id: 6, parkingLotId: 4, licensePlate: '京F13579', enterTime: '2023-08-01 11:30:00', exitTime: null },
  { id: 7, parkingLotId: 1, licensePlate: '京G24680', enterTime: '2023-08-01 09:45:22', exitTime: '2023-08-01 14:30:15' },
  { id: 8, parkingLotId: 2, licensePlate: '京H13579', enterTime: '2023-08-01 08:20:00', exitTime: '2023-08-01 12:15:33' },
];

const ParkingLotManagement: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAreaModalVisible, setIsAreaModalVisible] = useState(false);
  const [currentParkingLot, setCurrentParkingLot] = useState<any>(null);
  const [form] = Form.useForm();
  const [areaForm] = Form.useForm();
  const [areaModalMode, setAreaModalMode] = useState<'add' | 'edit'>('add');
  const [currentArea, setCurrentArea] = useState<any>(null);
  const [parkingStatus, setParkingStatus] = useState<Record<number, {total: number, occupied: number}>>({});
  const [accessRecords, setAccessRecords] = useState(mockAccessRecords);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [parkingLots, setParkingLots] = useState(mockParkingLots);
  const [loading, setLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // 状态标签颜色映射
  const statusColorMap: Record<string, string> = {
    normal: 'success',
    crowded: 'warning',
    full: 'error',
    maintenance: 'default'
  };

  // 状态文本映射
  const statusTextMap: Record<string, string> = {
    normal: '正常',
    crowded: '拥挤',
    full: '已满',
    maintenance: '维护中'
  };

  // 区域类型映射
  const areaTypeMap: Record<string, string> = {
    normal: '普通车位',
    monthly: '月卡专用',
    visitor: '访客专用',
    disabled: '无障碍车位',
    vip: 'VIP专用',
    charging: '充电桩车位'
  };

  // 计算实时车位状态
  const calculateParkingStatus = () => {
    setLoading(true);
    
    // 获取当前在场车辆
    const currentVehicles = accessRecords.filter(record => record.exitTime === null);
    
    // 按停车场ID分组
    const vehiclesByLot = currentVehicles.reduce((acc, record) => {
      const lotId = record.parkingLotId;
      if (!acc[lotId]) {
        acc[lotId] = [];
      }
      acc[lotId].push(record);
      return acc;
    }, {} as Record<number, any[]>);
    
    // 计算每个停车场的状态
    const status = parkingLots.reduce((acc, lot) => {
      const vehiclesInLot = vehiclesByLot[lot.id] || [];
      const occupied = vehiclesInLot.length;
      const total = lot.totalSpaces;
      const availableSpaces = total - occupied;
      const usageRate = Math.round((occupied / total) * 100);
      
      // 更新停车场状态
      let status = 'normal';
      if (usageRate >= 90) {
        status = 'full';
      } else if (usageRate >= 70) {
        status = 'crowded';
      }
      
      // 更新停车场数据
      const updatedLot = {
        ...lot,
        availableSpaces,
        usageRate,
        status: lot.status === 'maintenance' ? 'maintenance' : status
      };
      
      // 查找并更新停车场数据
      const index = parkingLots.findIndex(item => item.id === lot.id);
      if (index !== -1) {
        const newParkingLots = [...parkingLots];
        newParkingLots[index] = updatedLot;
        setParkingLots(newParkingLots);
      }
      
      return {...acc, [lot.id]: {total, occupied}};
    }, {});
    
    setParkingStatus(status);
    setLoading(false);
  };

  // 初始化和定时刷新停车状态
  useEffect(() => {
    calculateParkingStatus();
    
    // 设置30秒刷新一次
    const interval = setInterval(() => {
      calculateParkingStatus();
    }, 30000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [accessRecords]);

  // 模拟实时数据更新 - 在实际应用中应通过API获取
  const handleRefreshData = () => {
    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      calculateParkingStatus();
      message.success('数据已更新');
    }, 500);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  // 筛选数据
  const filteredData = mockParkingLots.filter(item => 
    item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.location.toLowerCase().includes(searchValue.toLowerCase())
  );

  // 添加停车场
  const handleAdd = () => {
    setCurrentParkingLot(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 编辑停车场
  const handleEdit = (record: any) => {
    setCurrentParkingLot(record);
    form.setFieldsValue({
      name: record.name,
      location: record.location,
      totalSpaces: record.totalSpaces,
      status: record.status
    });
    setIsModalVisible(true);
  };

  // 查看停车场详情
  const handleView = (record: any) => {
    setCurrentParkingLot(record);
    setIsDetailModalVisible(true);
  };

  // 保存停车场
  const handleSaveParkingLot = () => {
    form.validateFields().then(values => {
      console.log('保存停车场', values);
      // 这里添加保存逻辑
      setIsModalVisible(false);
    });
  };

  // 添加区域
  const handleAddArea = () => {
    setAreaModalMode('add');
    setCurrentArea(null);
    areaForm.resetFields();
    setIsAreaModalVisible(true);
  };

  // 编辑区域
  const handleEditArea = (record: any) => {
    setAreaModalMode('edit');
    setCurrentArea(record);
    areaForm.setFieldsValue({
      name: record.name,
      spaceCount: record.spaceCount,
      type: record.type
    });
    setIsAreaModalVisible(true);
  };

  // 保存区域
  const handleSaveArea = () => {
    areaForm.validateFields().then(values => {
      console.log('保存区域', values);
      // 这里添加保存区域逻辑
      setIsAreaModalVisible(false);
    });
  };

  // 删除区域
  const handleDeleteArea = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除区域 ${record.name} 吗？`,
      onOk() {
        console.log('删除区域', record);
        // 这里添加删除区域逻辑
      }
    });
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '停车场名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '车位总数',
      dataIndex: 'totalSpaces',
      key: 'totalSpaces',
      render: (text: number) => `${text} 个`
    },
    {
      title: '车位状态',
      key: 'status',
      render: (_: unknown, record: any) => {
        const status = parkingStatus[record.id] || {total: 0, occupied: 0};
        const available = status.total - status.occupied;
        const occupancyRate = status.total > 0 ? Math.round((status.occupied / status.total) * 100) : 0;
        
        return (
          <div>
            <Progress 
              percent={occupancyRate} 
              size="small" 
              status={occupancyRate > 80 ? "exception" : "normal"}
            />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              总车位: {status.total} | 
              已占用: {status.occupied} | 
              剩余: <span style={{ color: available < 10 ? '#f5222d' : '#52c41a', fontWeight: 'bold' }}>{available}</span>
            </div>
          </div>
        );
      }
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
      width: 180,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
          />
        </Space>
      ),
    },
  ];

  // 区域表格列定义
  const areaColumns = [
    {
      title: '区域',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '车位数',
      dataIndex: 'spaceCount',
      key: 'spaceCount',
    },
    {
      title: '区域类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => areaTypeMap[type] || type
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditArea(record)}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteArea(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="parking-lot-management" style={{ padding: '24px' }}>
      <Card>
        <Typography.Title level={4}>停车场管理</Typography.Title>
        <Typography.Paragraph>
          管理园区内的停车场信息，包括车位数量、车位状态统计等。支持添加、编辑、删除停车场，以及划分子区域和特殊车位。
        </Typography.Paragraph>
        
        {/* 添加总体车位统计 */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="总车位数" 
                value={Object.values(parkingStatus).reduce((sum, status) => sum + status.total, 0)} 
                suffix="个"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="已占用车位" 
                value={Object.values(parkingStatus).reduce((sum, status) => sum + status.occupied, 0)} 
                suffix="个"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="可用车位" 
                value={Object.values(parkingStatus).reduce((sum, status) => sum + (status.total - status.occupied), 0)} 
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="总体使用率" 
                value={(() => {
                  const totalSpaces = Object.values(parkingStatus).reduce((sum, status) => sum + status.total, 0);
                  const occupiedSpaces = Object.values(parkingStatus).reduce((sum, status) => sum + status.occupied, 0);
                  return totalSpaces > 0 ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0;
                })()}
                suffix="%"
                valueStyle={{ 
                  color: (() => {
                    const rate = (() => {
                      const totalSpaces = Object.values(parkingStatus).reduce((sum, status) => sum + status.total, 0);
                      const occupiedSpaces = Object.values(parkingStatus).reduce((sum, status) => sum + status.occupied, 0);
                      return totalSpaces > 0 ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0;
                    })();
                    return rate > 80 ? '#f5222d' : rate > 60 ? '#faad14' : '#52c41a';
                  })()
                }}
              />
            </Card>
          </Col>
        </Row>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={4}>停车场列表</Title>
          <Space>
            <Input
              placeholder="搜索停车场"
              value={searchValue}
              onChange={e => handleSearch(e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefreshData}
              loading={loading}
            >
              刷新数据
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增停车场
            </Button>
            <Button icon={<ExportOutlined />}>导出数据</Button>
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>

      {/* 停车场编辑弹窗 */}
      <Modal
        title={currentParkingLot ? '编辑停车场' : '新增停车场'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveParkingLot}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Title level={5}>基本信息</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="停车场名称"
                rules={[{ required: true, message: '请输入停车场名称' }]}
              >
                <Input placeholder="请输入停车场名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="位置描述"
                rules={[{ required: true, message: '请输入位置描述' }]}
              >
                <Input placeholder="请输入位置描述" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalSpaces"
                label="车位总数"
                rules={[{ required: true, message: '请输入车位总数' }]}
              >
                <InputNumber min={1} placeholder="请输入车位总数" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="normal">正常</Option>
                  <Option value="maintenance">维护中</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {currentParkingLot && (
            <>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={5}>区域划分</Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleAddArea}
                  size="small"
                >
                  添加区域
                </Button>
              </div>
              <Table 
                columns={areaColumns} 
                dataSource={mockAreaData} 
                rowKey="id" 
                pagination={false}
                size="small"
              />
            </>
          )}
        </Form>
      </Modal>

      {/* 区域编辑弹窗 */}
      <Modal
        title={areaModalMode === 'add' ? '添加区域' : '编辑区域'}
        open={isAreaModalVisible}
        onCancel={() => setIsAreaModalVisible(false)}
        onOk={handleSaveArea}
      >
        <Form
          form={areaForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="区域名称"
            rules={[{ required: true, message: '请输入区域名称' }]}
          >
            <Input placeholder="请输入区域名称" />
          </Form.Item>
          <Form.Item
            name="spaceCount"
            label="车位数量"
            rules={[{ required: true, message: '请输入车位数量' }]}
          >
            <InputNumber min={1} placeholder="请输入车位数量" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="type"
            label="区域类型"
            rules={[{ required: true, message: '请选择区域类型' }]}
          >
            <Select placeholder="请选择区域类型">
              <Option value="normal">普通车位</Option>
              <Option value="monthly">月卡专用</Option>
              <Option value="visitor">访客专用</Option>
              <Option value="disabled">无障碍车位</Option>
              <Option value="vip">VIP专用</Option>
              <Option value="charging">充电桩车位</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 停车场详情弹窗 */}
      <Modal
        title="停车场详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentParkingLot && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={5}>{currentParkingLot.name}</Title>
              </Col>
              <Col span={12}>
                <Card title="基本信息">
                  <p><strong>位置：</strong> {currentParkingLot.location}</p>
                  <p><strong>总车位数：</strong> {currentParkingLot.totalSpaces} 个</p>
                  <p><strong>状态：</strong> <Tag color={statusColorMap[currentParkingLot.status]}>{statusTextMap[currentParkingLot.status]}</Tag></p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="车位使用情况">
                  <Statistic 
                    title="使用率" 
                    value={currentParkingLot.usageRate || 0} 
                    suffix="%" 
                    valueStyle={{ color: currentParkingLot.usageRate > 80 ? '#f5222d' : '#52c41a' }}
                  />
                  <Progress 
                    percent={currentParkingLot.usageRate || 0} 
                    status={currentParkingLot.usageRate > 80 ? "exception" : "normal"}
                    style={{ marginTop: 16 }}
                  />
                  <div style={{ marginTop: 16 }}>
                    <p><strong>已占用车位：</strong> {parkingStatus[currentParkingLot.id]?.occupied || 0} 个</p>
                    <p><strong>剩余车位：</strong> {currentParkingLot.availableSpaces || 0} 个</p>
                  </div>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="区域分布">
                  <Table 
                    columns={areaColumns} 
                    dataSource={mockAreaData.filter(area => area.parkingLotId === currentParkingLot.id)} 
                    rowKey="id" 
                    pagination={false}
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card title="在场车辆">
                  <Table 
                    columns={[
                      { title: '车牌号', dataIndex: 'licensePlate', key: 'licensePlate' },
                      { title: '进入时间', dataIndex: 'enterTime', key: 'enterTime' },
                      { 
                        title: '已停时长', 
                        key: 'duration',
                        render: (_, record) => {
                          const enterTime = new Date(record.enterTime);
                          const now = new Date();
                          const diffMs = now.getTime() - enterTime.getTime();
                          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                          return `${diffHrs}小时${diffMins}分钟`;
                        }
                      }
                    ]} 
                    dataSource={accessRecords.filter(record => 
                      record.parkingLotId === currentParkingLot.id && record.exitTime === null
                    )} 
                    rowKey="id" 
                    pagination={{ pageSize: 5 }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ParkingLotManagement; 