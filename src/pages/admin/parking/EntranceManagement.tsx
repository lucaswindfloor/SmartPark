import React, { useState } from 'react';
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
  Select,
  Divider,
  Tabs,
  Row,
  Col,
  QRCode,
  Tooltip,
  Image,
  message
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  EyeOutlined, 
  DownloadOutlined,
  PrinterOutlined,
  QrcodeOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 模拟数据
const mockEntrances = [
  { 
    id: 1, 
    name: 'A区东门', 
    parkingLotId: 1,
    parkingLotName: 'A区一号楼停车场',
    type: 'entrance', 
    status: 'normal',
    qrCode: 'https://example.com/qrcode/1' 
  },
  { 
    id: 2, 
    name: 'A区西门', 
    parkingLotId: 1,
    parkingLotName: 'A区一号楼停车场',
    type: 'exit', 
    status: 'normal',
    qrCode: 'https://example.com/qrcode/2' 
  },
  { 
    id: 3, 
    name: 'B区北门', 
    parkingLotId: 3,
    parkingLotName: 'B区主楼停车场',
    type: 'both', 
    status: 'maintenance',
    qrCode: 'https://example.com/qrcode/3' 
  },
  { 
    id: 4, 
    name: 'C区南门', 
    parkingLotId: 4,
    parkingLotName: 'C区地下停车场',
    type: 'both', 
    status: 'normal',
    qrCode: 'https://example.com/qrcode/4' 
  },
];

// 模拟设备数据
const mockDevices = [
  { id: 1, entranceId: 1, name: 'CAM-A-001', type: 'camera', ipAddress: '192.168.1.101', status: 'online' },
  { id: 2, entranceId: 1, name: 'BAR-A-001', type: 'barrier', ipAddress: '192.168.1.102', status: 'online' },
  { id: 3, entranceId: 1, name: 'DIS-A-001', type: 'display', ipAddress: '192.168.1.103', status: 'online' },
  { id: 4, entranceId: 2, name: 'CAM-A-002', type: 'camera', ipAddress: '192.168.1.104', status: 'online' },
  { id: 5, entranceId: 2, name: 'BAR-A-002', type: 'barrier', ipAddress: '192.168.1.105', status: 'offline' },
  { id: 6, entranceId: 3, name: 'CAM-B-001', type: 'camera', ipAddress: '192.168.1.106', status: 'maintenance' },
];

// 模拟停车场数据
const mockParkingLots = [
  { id: 1, name: 'A区一号楼停车场' },
  { id: 2, name: 'A区二号楼停车场' },
  { id: 3, name: 'B区主楼停车场' },
  { id: 4, name: 'C区地下停车场' },
];

const EntranceManagement: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedParkingLot, setSelectedParkingLot] = useState<number | 'all'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeviceModalVisible, setIsDeviceModalVisible] = useState(false);
  const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);
  const [currentEntrance, setCurrentEntrance] = useState<any>(null);
  const [currentDevice, setCurrentDevice] = useState<any>(null);
  const [form] = Form.useForm();
  const [deviceForm] = Form.useForm();
  const [deviceModalMode, setDeviceModalMode] = useState<'add' | 'edit'>('add');
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedEntrance, setSelectedEntrance] = useState<any>(null);

  // 状态标签颜色映射
  const statusColorMap: Record<string, string> = {
    normal: 'success',
    maintenance: 'warning',
    offline: 'error'
  };

  // 状态文本映射
  const statusTextMap: Record<string, string> = {
    normal: '正常',
    maintenance: '维护中',
    offline: '离线'
  };

  // 类型文本映射
  const typeTextMap: Record<string, string> = {
    entrance: '入口',
    exit: '出口',
    both: '出入口'
  };

  // 设备类型映射
  const deviceTypeMap: Record<string, string> = {
    camera: '摄像头',
    barrier: '道闸',
    display: '显示屏',
    intercom: '对讲机',
    payStation: '缴费终端',
    sensor: '车辆感应器'
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  // 筛选数据
  const filteredData = mockEntrances.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.parkingLotName.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesParkingLot = selectedParkingLot === 'all' || item.parkingLotId === selectedParkingLot;
    
    return matchesSearch && matchesParkingLot;
  });

  // 添加出入口
  const handleAdd = () => {
    setCurrentEntrance(null);
    form.resetFields();
    form.setFieldsValue({
      type: 'entrance',
      status: 'normal'
    });
    setIsModalVisible(true);
  };

  // 编辑出入口
  const handleEdit = (record: any) => {
    setCurrentEntrance(record);
    form.setFieldsValue({
      name: record.name,
      parkingLotId: record.parkingLotId,
      type: record.type,
      status: record.status
    });
    setIsModalVisible(true);
  };

  // 查看出入口详情
  const handleView = (record: any) => {
    setCurrentEntrance(record);
    setActiveTabKey('1');
    setIsQRCodeModalVisible(true);
  };

  // 保存出入口
  const handleSaveEntrance = () => {
    form.validateFields().then(values => {
      console.log('保存出入口', values);
      // 这里添加保存逻辑
      setIsModalVisible(false);
    });
  };

  // 添加设备
  const handleAddDevice = () => {
    setDeviceModalMode('add');
    setCurrentDevice(null);
    deviceForm.resetFields();
    deviceForm.setFieldsValue({
      entranceId: currentEntrance.id,
      status: 'online'
    });
    setIsDeviceModalVisible(true);
  };

  // 编辑设备
  const handleEditDevice = (record: any) => {
    setDeviceModalMode('edit');
    setCurrentDevice(record);
    deviceForm.setFieldsValue({
      name: record.name,
      entranceId: record.entranceId,
      type: record.type,
      ipAddress: record.ipAddress,
      status: record.status
    });
    setIsDeviceModalVisible(true);
  };

  // 保存设备
  const handleSaveDevice = () => {
    deviceForm.validateFields().then(values => {
      console.log('保存设备', values);
      // 这里添加保存设备逻辑
      setIsDeviceModalVisible(false);
    });
  };

  // 显示二维码
  const handleShowQRCode = (record: any) => {
    setSelectedEntrance(record);
    setQrModalVisible(true);
  };

  // 下载二维码
  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('entrance-qrcode') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `出入口二维码-${selectedEntrance?.name}.png`;
      link.click();
      message.success('二维码下载成功');
    }
  };

  // 删除出入口
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除出入口 "${record.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 实际应用中这里会调用API删除数据
        const newEntrances = mockEntrances.filter(item => item.id !== record.id);
        // setEntrances(newEntrances);
        message.success(`出入口 "${record.name}" 已删除`);
      }
    });
  };

  // 更改标签页
  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
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
      title: '出入口名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属停车场',
      dataIndex: 'parkingLotName',
      key: 'parkingLotName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => typeTextMap[type] || type
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
      title: '二维码',
      key: 'qrCode',
      width: 100,
      render: (_: unknown, record: any) => (
        <Tooltip title="查看二维码">
          <Button 
            type="text" 
            icon={<QrcodeOutlined />} 
            onClick={() => handleShowQRCode(record)}
          />
        </Tooltip>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: any) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
          <Tooltip title="二维码">
            <Button 
              type="text"
              icon={<QrcodeOutlined />} 
              onClick={() => handleShowQRCode(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 设备表格列定义
  const deviceColumns = [
    {
      title: '设备ID',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => deviceTypeMap[type] || type
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
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
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditDevice(record)}
          />
        </Space>
      ),
    },
  ];

  // 获取当前出入口的设备
  const getCurrentEntranceDevices = () => {
    if (!currentEntrance) return [];
    return mockDevices.filter(device => device.entranceId === currentEntrance.id);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={4}>出入口管理</Title>
          <Space>
            <Select
              placeholder="选择停车场"
              style={{ width: 180 }}
              value={selectedParkingLot}
              onChange={value => setSelectedParkingLot(value)}
            >
              <Option value="all">所有停车场</Option>
              {mockParkingLots.map(lot => (
                <Option key={lot.id} value={lot.id}>{lot.name}</Option>
              ))}
            </Select>
            <Input
              placeholder="搜索出入口"
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
              新增出入口
            </Button>
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 出入口编辑弹窗 */}
      <Modal
        title={currentEntrance ? '编辑出入口' : '新增出入口'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveEntrance}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="出入口名称"
            rules={[{ required: true, message: '请输入出入口名称' }]}
          >
            <Input placeholder="请输入出入口名称" />
          </Form.Item>
          <Form.Item
            name="parkingLotId"
            label="所属停车场"
            rules={[{ required: true, message: '请选择所属停车场' }]}
          >
            <Select placeholder="请选择所属停车场">
              {mockParkingLots.map(lot => (
                <Option key={lot.id} value={lot.id}>{lot.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              <Option value="entrance">入口</Option>
              <Option value="exit">出口</Option>
              <Option value="both">出入口</Option>
            </Select>
          </Form.Item>
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
        </Form>
      </Modal>

      {/* 出入口详情/二维码弹窗 */}
      <Modal
        title={currentEntrance ? `${currentEntrance.name} 详情` : '出入口详情'}
        open={isQRCodeModalVisible}
        onCancel={() => setIsQRCodeModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentEntrance && (
          <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
            <TabPane tab="基本信息" key="1">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Title level={5}>出入口信息</Title>
                </Col>
                <Col span={12}>
                  <Text strong>出入口名称：</Text> {currentEntrance.name}
                </Col>
                <Col span={12}>
                  <Text strong>所属停车场：</Text> {currentEntrance.parkingLotName}
                </Col>
                <Col span={12}>
                  <Text strong>类型：</Text> {typeTextMap[currentEntrance.type]}
                </Col>
                <Col span={12}>
                  <Text strong>状态：</Text> 
                  <Tag color={statusColorMap[currentEntrance.status]}>
                    {statusTextMap[currentEntrance.status]}
                  </Tag>
                </Col>
                
                <Col span={24}>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={5}>关联设备</Title>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={handleAddDevice}
                      size="small"
                    >
                      添加设备
                    </Button>
                  </div>
                  <Table 
                    columns={deviceColumns} 
                    dataSource={getCurrentEntranceDevices()} 
                    rowKey="id" 
                    pagination={false}
                    size="small"
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="二维码" key="2">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <QRCode
                  value={`https://example.com/parking/pay?entranceId=${currentEntrance.id}`}
                  size={200}
                  bordered={false}
                />
                <div style={{ marginTop: '20px' }}>
                  <Text>说明：扫描此二维码可查询该出入口未缴费车辆并进行支付</Text>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <Space>
                    <Button icon={<DownloadOutlined />} onClick={handleDownloadQRCode}>
                      下载二维码
                    </Button>
                    <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
                      打印二维码
                    </Button>
                  </Space>
                </div>
              </div>
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* 设备编辑弹窗 */}
      <Modal
        title={deviceModalMode === 'add' ? '添加设备' : '编辑设备'}
        open={isDeviceModalVisible}
        onCancel={() => setIsDeviceModalVisible(false)}
        onOk={handleSaveDevice}
      >
        <Form
          form={deviceForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="设备ID"
            rules={[{ required: true, message: '请输入设备ID' }]}
          >
            <Input placeholder="请输入设备ID" />
          </Form.Item>
          <Form.Item
            name="type"
            label="设备类型"
            rules={[{ required: true, message: '请选择设备类型' }]}
          >
            <Select placeholder="请选择设备类型">
              <Option value="camera">摄像头</Option>
              <Option value="barrier">道闸</Option>
              <Option value="display">显示屏</Option>
              <Option value="intercom">对讲机</Option>
              <Option value="payStation">缴费终端</Option>
              <Option value="sensor">车辆感应器</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ipAddress"
            label="IP地址"
            rules={[{ required: true, message: '请输入IP地址' }]}
          >
            <Input placeholder="请输入IP地址" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="entranceId"
            hidden
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 二维码弹窗 */}
      <Modal
        title={selectedEntrance ? `${selectedEntrance.name} 停车缴费二维码` : '停车缴费二维码'}
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
            打印
          </Button>,
          <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadQRCode}>
            下载
          </Button>,
          <Button key="close" onClick={() => setQrModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedEntrance && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '15px' }}>
              <Text strong>扫描下方二维码快速查询和缴纳停车费</Text>
            </div>
            
            <div id="entrance-qrcode-container">
              <QRCode 
                id="entrance-qrcode"
                value={`https://smartpark.example.com/parking-payment?entranceId=${selectedEntrance.id}&name=${selectedEntrance.name}`} 
                size={250} 
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div style={{ marginTop: '15px' }}>
              <Text type="secondary">此二维码用于在{selectedEntrance.name}出入口缴费</Text>
            </div>
            
            <Divider />
            
            <Paragraph>
              <ul style={{ textAlign: 'left' }}>
                <li>将此二维码张贴在出入口明显位置</li>
                <li>访客可通过微信、支付宝等扫码查询未缴费车辆</li>
                <li>扫码后可直接进行在线支付，无需到收费处排队</li>
              </ul>
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EntranceManagement; 