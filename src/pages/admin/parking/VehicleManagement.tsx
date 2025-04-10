import React, { useState } from 'react';
import {
  Card,
  Table,
  Typography,
  Button,
  Space,
  Input,
  Tag,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  Modal,
  Radio,
  Divider,
  Upload,
  message,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined,
  UploadOutlined,
  CarOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// 模拟企业数据
const mockEnterprises = [
  { id: 1, name: 'A公司' },
  { id: 2, name: 'B公司' },
  { id: 3, name: 'C公司' },
  { id: 4, name: 'D公司' }
];

// 模拟车辆类型数据
const vehicleTypes = [
  { id: 1, name: '小型汽车' },
  { id: 2, name: '中型汽车' },
  { id: 3, name: '大型汽车' },
  { id: 4, name: '新能源汽车' }
];

// 模拟车辆数据
const mockVehicles = [
  {
    id: 1,
    licensePlate: '京A12345',
    vehicleType: '小型汽车',
    enterprise: 'A公司',
    owner: '张三',
    phone: '13800138001',
    registerDate: '2023-01-15',
    status: 'active'
  },
  {
    id: 2,
    licensePlate: '京B54321',
    vehicleType: '中型汽车',
    enterprise: 'B公司',
    owner: '李四',
    phone: '13900139002',
    registerDate: '2023-02-20',
    status: 'active'
  },
  {
    id: 3,
    licensePlate: '京C11111',
    vehicleType: '新能源汽车',
    enterprise: 'C公司',
    owner: '王五',
    phone: '13700137003',
    registerDate: '2023-03-05',
    status: 'active'
  },
  {
    id: 4,
    licensePlate: '京D22222',
    vehicleType: '小型汽车',
    enterprise: 'A公司',
    owner: '赵六',
    phone: '13600136004',
    registerDate: '2023-01-10',
    status: 'inactive'
  }
];

const VehicleManagement: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  const [importModalVisible, setImportModalVisible] = useState(false);

  // 状态标签颜色映射
  const statusColorMap: Record<string, string> = {
    active: 'success',
    inactive: 'default'
  };

  // 状态文本映射
  const statusTextMap: Record<string, string> = {
    active: '正常',
    inactive: '禁用'
  };

  // 查询车辆
  const handleSearch = (values: any) => {
    console.log('搜索条件', values);
    setLoading(true);
    
    // 模拟搜索，实际应该调用API
    setTimeout(() => {
      setLoading(false);
      // 简单过滤实现
      let filteredVehicles = [...mockVehicles];
      
      if (values.licensePlate) {
        filteredVehicles = filteredVehicles.filter(vehicle => 
          vehicle.licensePlate.includes(values.licensePlate)
        );
      }
      
      if (values.enterprise) {
        filteredVehicles = filteredVehicles.filter(vehicle => 
          vehicle.enterprise === values.enterprise
        );
      }
      
      if (values.vehicleType) {
        filteredVehicles = filteredVehicles.filter(vehicle => 
          vehicle.vehicleType === values.vehicleType
        );
      }
      
      if (values.status) {
        filteredVehicles = filteredVehicles.filter(vehicle => 
          vehicle.status === values.status
        );
      }
      
      setVehicles(filteredVehicles);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setVehicles(mockVehicles);
  };

  // 添加车辆
  const handleAdd = () => {
    setCurrentVehicle(null);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 编辑车辆
  const handleEdit = (record: any) => {
    setCurrentVehicle(record);
    editForm.setFieldsValue({
      ...record,
      registerDate: record.registerDate ? new Date(record.registerDate) : undefined
    });
    setEditModalVisible(true);
  };

  // 删除车辆
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除车辆 ${record.licensePlate} 吗？`,
      onOk() {
        // 模拟删除操作
        const updatedVehicles = vehicles.filter(item => item.id !== record.id);
        setVehicles(updatedVehicles);
        message.success('删除成功');
      }
    });
  };

  // 提交车辆表单
  const handleSubmitVehicle = () => {
    editForm.validateFields().then(values => {
      console.log('提交车辆信息', values);
      
      // 格式化日期
      const formattedValues = {
        ...values,
        registerDate: values.registerDate ? values.registerDate.format('YYYY-MM-DD') : ''
      };
      
      if (currentVehicle) {
        // 更新现有车辆
        const updatedVehicles = vehicles.map(item => 
          item.id === currentVehicle.id ? { ...item, ...formattedValues } : item
        );
        setVehicles(updatedVehicles);
        message.success('更新成功');
      } else {
        // 添加新车辆
        const newVehicle = {
          id: Math.max(...vehicles.map(item => item.id)) + 1,
          ...formattedValues
        };
        setVehicles([...vehicles, newVehicle]);
        message.success('添加成功');
      }
      
      setEditModalVisible(false);
    });
  };

  // 导入车辆
  const handleImport = () => {
    setImportModalVisible(true);
  };

  // 导出车辆
  const handleExport = () => {
    console.log('导出车辆数据');
    message.success('车辆数据导出成功');
  };

  // 上传文件属性
  const uploadProps: UploadProps = {
    name: 'file',
    action: 'https://example.com/upload', // 实际环境中替换为真实的上传接口
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        setImportModalVisible(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
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
      title: '所属企业',
      dataIndex: 'enterprise',
      key: 'enterprise',
    },
    {
      title: '车主姓名',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '登记日期',
      dataIndex: 'registerDate',
      key: 'registerDate',
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
      render: (_: unknown, record: any) => (
        <Space size="middle">
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
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>车辆管理</Title>
        <Paragraph>
          管理园区内登记的车辆信息，支持按车牌号、所属企业、车辆类型等多条件查询，并提供车辆信息的添加、编辑、删除和导入导出功能。
        </Paragraph>

        <Form
          form={searchForm}
          layout="horizontal"
          onFinish={handleSearch}
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="licensePlate" label="车牌号">
                <Input placeholder="输入车牌号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="enterprise" label="所属企业">
                <Select placeholder="选择企业" allowClear>
                  {mockEnterprises.map(enterprise => (
                    <Option key={enterprise.id} value={enterprise.name}>{enterprise.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="vehicleType" label="车辆类型">
                <Select placeholder="选择类型" allowClear>
                  {vehicleTypes.map(type => (
                    <Option key={type.id} value={type.name}>{type.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="选择状态" allowClear>
                  <Option value="active">正常</Option>
                  <Option value="inactive">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button 
                  htmlType="submit" 
                  type="primary" 
                  icon={<SearchOutlined />}
                  loading={loading}
                >
                  查询
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleReset}
                >
                  重置
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAdd}
                >
                  添加车辆
                </Button>
                <Button 
                  icon={<ImportOutlined />}
                  onClick={handleImport}
                >
                  导入
                </Button>
                <Button 
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                >
                  导出
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Divider style={{ margin: '12px 0' }} />

        <Table 
          columns={columns} 
          dataSource={vehicles} 
          rowKey="id" 
          loading={loading}
          pagination={{ 
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 车辆编辑弹窗 */}
      <Modal
        title={currentVehicle ? "编辑车辆" : "添加车辆"}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSubmitVehicle}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="licensePlate"
                label="车牌号"
                rules={[{ required: true, message: '请输入车牌号' }]}
              >
                <Input placeholder="请输入车牌号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="vehicleType"
                label="车辆类型"
                rules={[{ required: true, message: '请选择车辆类型' }]}
              >
                <Select placeholder="请选择车辆类型">
                  {vehicleTypes.map(type => (
                    <Option key={type.id} value={type.name}>{type.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="enterprise"
                label="所属企业"
                rules={[{ required: true, message: '请选择所属企业' }]}
              >
                <Select placeholder="请选择所属企业">
                  {mockEnterprises.map(enterprise => (
                    <Option key={enterprise.id} value={enterprise.name}>{enterprise.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="registerDate"
                label="登记日期"
                rules={[{ required: true, message: '请选择登记日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="owner"
                label="车主姓名"
                rules={[{ required: true, message: '请输入车主姓名' }]}
              >
                <Input placeholder="请输入车主姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="status"
            label="状态"
            initialValue="active"
          >
            <Radio.Group>
              <Radio value="active">正常</Radio>
              <Radio value="inactive">禁用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* 导入弹窗 */}
      <Modal
        title="导入车辆数据"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
      >
        <Paragraph>
          请上传符合格式要求的Excel文件，文件模板可以通过导出功能获取。
        </Paragraph>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </Upload>
          <div style={{ marginTop: '20px' }}>
            <Text type="secondary">提示：</Text>
            <ul style={{ paddingLeft: '20px', color: 'rgba(0, 0, 0, 0.45)' }}>
              <li>文件格式支持: .xlsx, .xls</li>
              <li>文件大小不超过10MB</li>
              <li>必填字段: 车牌号、车辆类型、所属企业、车主姓名、联系电话</li>
            </ul>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setImportModalVisible(false)}>取消</Button>
              <Button type="primary" icon={<CarOutlined />} href="/templates/vehicle_import_template.xlsx" target="_blank">
                下载模板
              </Button>
            </Space>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default VehicleManagement;
