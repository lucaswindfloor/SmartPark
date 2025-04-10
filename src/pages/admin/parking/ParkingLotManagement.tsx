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
  ExportOutlined
} from '@ant-design/icons';

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

  // 模拟获取实时停车场状态
  useEffect(() => {
    // 实际项目中应该通过API获取
    const mockStatus = mockParkingLots.reduce((acc, lot) => {
      const total = mockAreaData.filter(area => area.parkingLotId === lot.id)
        .reduce((sum, area) => sum + area.spaceCount, 0);
        
      // 这里应该是API获取的占用车位数
      const occupied = Math.floor(Math.random() * total * 0.7); // 模拟70%以内的占用率
      
      return {...acc, [lot.id]: {total, occupied}};
    }, {});
    
    setParkingStatus(mockStatus);
  }, []);

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
    // 这里可以添加查看详情的逻辑
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
          <Col span={8}>
            <Card>
              <Statistic 
                title="总车位数" 
                value={Object.values(parkingStatus).reduce((sum, status) => sum + status.total, 0)} 
                suffix="个"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="已占用车位" 
                value={Object.values(parkingStatus).reduce((sum, status) => sum + status.occupied, 0)} 
                suffix="个"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="可用车位" 
                value={Object.values(parkingStatus).reduce((sum, status) => sum + (status.total - status.occupied), 0)} 
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
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
    </div>
  );
};

export default ParkingLotManagement; 