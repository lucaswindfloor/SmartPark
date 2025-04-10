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
  Tooltip,
  Tabs
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
  CarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

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

// 模拟车辆分类
const vehicleCategories = [
  { key: 'inPark', name: '场内车辆' },
  { key: 'whitelist', name: '白名单车辆' },
  { key: 'free', name: '免费车辆' },
  { key: 'monthly', name: '月卡车辆' },
  { key: 'blacklist', name: '黑名单车辆' }
];

// 模拟特殊车辆类型
const specialVehicleTypes = [
  { id: 1, name: '军用车辆' },
  { id: 2, name: '警用车辆' },
  { id: 3, name: '残疾人车辆' },
  { id: 4, name: '救护车辆' },
  { id: 5, name: '消防车辆' }
];

// 模拟车辆数据
const mockVehicles = [
  {
    id: 1,
    licensePlate: '京A12345',
    vehicleType: '小型汽车',
    category: 'inPark',
    specialType: null,
    enterprise: 'A公司',
    owner: '张三',
    phone: '13800138001',
    registerDate: '2023-01-15',
    status: 'active',
    entryTime: '2023-08-15 08:23:45',
    exitTime: null,
    freeStartTime: null,
    freeEndTime: null,
    blockStartTime: null,
    blockEndTime: null,
    isMonthly: false
  },
  {
    id: 2,
    licensePlate: '京B54321',
    vehicleType: '中型汽车',
    category: 'whitelist',
    specialType: null,
    enterprise: 'B公司',
    owner: '李四',
    phone: '13900139002',
    registerDate: '2023-02-20',
    status: 'active',
    entryTime: null,
    exitTime: null,
    freeStartTime: '2023-01-01',
    freeEndTime: '2023-12-31',
    blockStartTime: null,
    blockEndTime: null,
    isMonthly: false
  },
  {
    id: 3,
    licensePlate: '京C11111',
    vehicleType: '新能源汽车',
    category: 'free',
    specialType: '残疾人车辆',
    enterprise: 'C公司',
    owner: '王五',
    phone: '13700137003',
    registerDate: '2023-03-05',
    status: 'active',
    entryTime: null,
    exitTime: null,
    freeStartTime: null,
    freeEndTime: null,
    blockStartTime: null,
    blockEndTime: null,
    isMonthly: false
  },
  {
    id: 4,
    licensePlate: '京D22222',
    vehicleType: '小型汽车',
    category: 'monthly',
    specialType: null,
    enterprise: 'A公司',
    owner: '赵六',
    phone: '13600136004',
    registerDate: '2023-01-10',
    status: 'active',
    entryTime: null,
    exitTime: null,
    freeStartTime: null,
    freeEndTime: null,
    blockStartTime: null,
    blockEndTime: null,
    isMonthly: true
  },
  {
    id: 5,
    licensePlate: '京E33333',
    vehicleType: '小型汽车',
    category: 'blacklist',
    specialType: null,
    enterprise: 'D公司',
    owner: '钱七',
    phone: '13500135005',
    registerDate: '2023-05-15',
    status: 'inactive',
    entryTime: null,
    exitTime: null,
    freeStartTime: null,
    freeEndTime: null,
    blockStartTime: '2023-08-01',
    blockEndTime: '2023-10-31',
    isMonthly: false
  },
  {
    id: 6,
    licensePlate: '军A12345',
    vehicleType: '中型汽车',
    category: 'free',
    specialType: '军用车辆',
    enterprise: null,
    owner: '军方车辆',
    phone: '',
    registerDate: '2023-04-20',
    status: 'active',
    entryTime: null,
    exitTime: null,
    freeStartTime: null,
    freeEndTime: null,
    blockStartTime: null,
    blockEndTime: null,
    isMonthly: false
  }
];

const VehicleManagement: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState(mockVehicles);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [timeSettingVisible, setTimeSettingVisible] = useState(false);

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
  
  // 车辆分类标签颜色映射
  const categoryColorMap: Record<string, string> = {
    inPark: 'processing',
    whitelist: 'success',
    free: 'blue',
    monthly: 'purple',
    blacklist: 'error'
  };
  
  // 车辆分类文本映射
  const categoryTextMap: Record<string, string> = {
    inPark: '场内车辆',
    whitelist: '白名单车辆',
    free: '免费车辆',
    monthly: '月卡车辆',
    blacklist: '黑名单车辆',
    all: '全部车辆'
  };

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'all') {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter(vehicle => vehicle.category === key);
      setFilteredVehicles(filtered);
    }
  };

  // 查询车辆
  const handleSearch = (values: any) => {
    console.log('搜索条件', values);
    setLoading(true);
    
    // 模拟搜索，实际应该调用API
    setTimeout(() => {
      setLoading(false);
      // 简单过滤实现
      let filteredVehicles = [...vehicles];
      
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
      
      if (values.category) {
        filteredVehicles = filteredVehicles.filter(vehicle => 
          vehicle.category === values.category
        );
      }
      
      // 根据当前标签再次过滤
      if (activeTab !== 'all') {
        filteredVehicles = filteredVehicles.filter(vehicle => vehicle.category === activeTab);
      }
      
      setFilteredVehicles(filteredVehicles);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    if (activeTab === 'all') {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter(vehicle => vehicle.category === activeTab);
      setFilteredVehicles(filtered);
    }
  };

  // 添加车辆
  const handleAdd = () => {
    setCurrentVehicle(null);
    editForm.resetFields();
    
    // 根据当前标签页设置默认分类
    if (activeTab !== 'all') {
      editForm.setFieldsValue({
        category: activeTab,
        status: 'active'
      });
    }
    
    setEditModalVisible(true);
  };

  // 编辑车辆
  const handleEdit = (record: any) => {
    setCurrentVehicle(record);
    editForm.setFieldsValue({
      ...record,
      registerDate: record.registerDate ? dayjs(record.registerDate) : undefined,
      freeTimeRange: record.freeStartTime && record.freeEndTime ? 
        [dayjs(record.freeStartTime), dayjs(record.freeEndTime)] : undefined,
      blockTimeRange: record.blockStartTime && record.blockEndTime ? 
        [dayjs(record.blockStartTime), dayjs(record.blockEndTime)] : undefined
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
        
        // 更新过滤后的车辆列表
        if (activeTab === 'all') {
          setFilteredVehicles(updatedVehicles);
        } else {
          const filtered = updatedVehicles.filter(vehicle => vehicle.category === activeTab);
          setFilteredVehicles(filtered);
        }
        
        message.success('删除成功');
      }
    });
  };

  // 提交车辆表单
  const handleSubmitVehicle = () => {
    editForm.validateFields().then(values => {
      console.log('提交车辆信息', values);
      
      // 格式化日期和时间范围
      const formattedValues = {
        ...values,
        registerDate: values.registerDate ? values.registerDate.format('YYYY-MM-DD') : '',
        freeStartTime: values.freeTimeRange ? values.freeTimeRange[0].format('YYYY-MM-DD') : null,
        freeEndTime: values.freeTimeRange ? values.freeTimeRange[1].format('YYYY-MM-DD') : null,
        blockStartTime: values.blockTimeRange ? values.blockTimeRange[0].format('YYYY-MM-DD') : null,
        blockEndTime: values.blockTimeRange ? values.blockTimeRange[1].format('YYYY-MM-DD') : null
      };
      
      // 删除临时字段
      delete formattedValues.freeTimeRange;
      delete formattedValues.blockTimeRange;
      
      if (currentVehicle) {
        // 更新现有车辆
        const updatedVehicles = vehicles.map(item => 
          item.id === currentVehicle.id ? { ...item, ...formattedValues } : item
        );
        setVehicles(updatedVehicles);
        
        // 更新过滤后的车辆列表
        if (activeTab === 'all') {
          setFilteredVehicles(updatedVehicles);
        } else {
          const filtered = updatedVehicles.filter(vehicle => vehicle.category === activeTab);
          setFilteredVehicles(filtered);
        }
        
        message.success('更新成功');
      } else {
        // 添加新车辆
        const newVehicle = {
          id: Math.max(...vehicles.map(item => item.id)) + 1,
          ...formattedValues,
          entryTime: values.category === 'inPark' ? dayjs().format('YYYY-MM-DD HH:mm:ss') : null,
          exitTime: null
        };
        
        const newVehicles = [...vehicles, newVehicle];
        setVehicles(newVehicles);
        
        // 更新过滤后的车辆列表
        if (activeTab === 'all' || activeTab === values.category) {
          setFilteredVehicles([...filteredVehicles, newVehicle]);
        }
        
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

  // 获取当前分类表格列
  const getColumns = () => {
    // 基础列，所有分类共有
    const baseColumns = [
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
        render: (text: string) => text || '-'
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
      }
    ];
    
    // 分类特定列
    let categorySpecificColumns: any[] = [];
    
    if (activeTab === 'all') {
      categorySpecificColumns = [
        {
          title: '车辆类别',
          dataIndex: 'category',
          key: 'category',
          render: (category: string) => (
            <Tag color={categoryColorMap[category] || 'default'}>
              {categoryTextMap[category] || category}
            </Tag>
          )
        }
      ];
    } else if (activeTab === 'inPark') {
      categorySpecificColumns = [
        {
          title: '进入时间',
          dataIndex: 'entryTime',
          key: 'entryTime'
        }
      ];
    } else if (activeTab === 'whitelist') {
      categorySpecificColumns = [
        {
          title: '免费时间段',
          key: 'freeTime',
          render: (_: any, record: any) => (
            record.freeStartTime && record.freeEndTime ?
            `${record.freeStartTime} 至 ${record.freeEndTime}` : '永久'
          )
        }
      ];
    } else if (activeTab === 'free') {
      categorySpecificColumns = [
        {
          title: '特殊车辆类型',
          dataIndex: 'specialType',
          key: 'specialType',
          render: (text: string) => text || '-'
        }
      ];
    } else if (activeTab === 'monthly') {
      categorySpecificColumns = [
        {
          title: '月卡状态',
          key: 'monthlyStatus',
          render: () => <Tag color="success">有效</Tag>
        }
      ];
    } else if (activeTab === 'blacklist') {
      categorySpecificColumns = [
        {
          title: '禁止时间段',
          key: 'blockTime',
          render: (_: any, record: any) => (
            record.blockStartTime && record.blockEndTime ?
            `${record.blockStartTime} 至 ${record.blockEndTime}` : '永久'
          )
        }
      ];
    }
    
    // 操作列
    const actionColumn = {
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
    };
    
    return [...baseColumns, ...categorySpecificColumns, actionColumn];
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>车辆管理</Title>
        <Paragraph>
          全面管理车辆信息，支持对场内车辆、白名单车辆、免费车辆、月卡车辆和黑名单车辆的分类管理。
        </Paragraph>

        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          tabBarExtraContent={
            <Space>
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
          }
        >
          <TabPane tab="全部车辆" key="all" />
          <TabPane tab="场内车辆" key="inPark" />
          <TabPane tab="白名单车辆" key="whitelist" />
          <TabPane tab="免费车辆" key="free" />
          <TabPane tab="月卡车辆" key="monthly" />
          <TabPane tab="黑名单车辆" key="blacklist" />
        </Tabs>

        <Form
          form={searchForm}
          layout="horizontal"
          onFinish={handleSearch}
          style={{ marginTop: '16px', marginBottom: '24px' }}
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
              </Space>
            </Col>
          </Row>
        </Form>

        <Divider style={{ margin: '12px 0' }} />

        <Table 
          columns={getColumns()} 
          dataSource={filteredVehicles} 
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
        width={700}
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
                name="category"
                label="车辆类别"
                rules={[{ required: true, message: '请选择车辆类别' }]}
              >
                <Select 
                  placeholder="请选择车辆类别"
                  onChange={(value) => {
                    // 切换类别时重置相关字段
                    if (value === 'free') {
                      editForm.setFieldsValue({
                        specialType: null,
                        freeTimeRange: null,
                        blockTimeRange: null
                      });
                    } else if (value === 'whitelist') {
                      editForm.setFieldsValue({
                        specialType: null,
                        blockTimeRange: null
                      });
                    } else if (value === 'blacklist') {
                      editForm.setFieldsValue({
                        specialType: null,
                        freeTimeRange: null
                      });
                    } else {
                      editForm.setFieldsValue({
                        specialType: null,
                        freeTimeRange: null,
                        blockTimeRange: null
                      });
                    }
                  }}
                >
                  {vehicleCategories.map(category => (
                    <Option key={category.key} value={category.key}>{category.name}</Option>
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
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="enterprise"
                label="所属企业"
              >
                <Select placeholder="请选择所属企业" allowClear>
                  {mockEnterprises.map(enterprise => (
                    <Option key={enterprise.id} value={enterprise.name}>{enterprise.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>
          
          {/* 根据车辆分类显示不同的表单项 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.category !== currentValues.category}
          >
            {({ getFieldValue }) => {
              const category = getFieldValue('category');
              
              if (category === 'free') {
                return (
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="specialType"
                        label="特殊车辆类型"
                        rules={[{ required: true, message: '请选择特殊车辆类型' }]}
                      >
                        <Select placeholder="请选择特殊车辆类型">
                          {specialVehicleTypes.map(type => (
                            <Option key={type.id} value={type.name}>{type.name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              
              if (category === 'whitelist') {
                return (
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="freeTimeRange"
                        label="免费停车时间段"
                        help="不设置则为永久免费"
                      >
                        <DatePicker.RangePicker 
                          style={{ width: '100%' }} 
                          placeholder={['开始日期', '结束日期']}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              
              if (category === 'blacklist') {
                return (
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="blockTimeRange"
                        label="禁止进入园区时间段"
                        help="不设置则永久禁止"
                        rules={[{ required: true, message: '请选择禁止进入时间段' }]}
                      >
                        <DatePicker.RangePicker 
                          style={{ width: '100%' }} 
                          placeholder={['开始日期', '结束日期']}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              
              if (category === 'monthly') {
                return (
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="isMonthly"
                        label="月卡状态"
                        initialValue={true}
                        valuePropName="checked"
                      >
                        <Radio.Group>
                          <Radio value={true}>有效</Radio>
                          <Radio value={false}>已过期</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Text type="secondary">注：月卡具体有效期及相关管理请在"月卡购买记录"模块中管理</Text>
                    </Col>
                  </Row>
                );
              }
              
              return null;
            }}
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
              <li>必填字段: 车牌号、车辆类型、车辆类别、车主姓名、联系电话</li>
              <li>不同类别的车辆需要填写对应的特殊字段</li>
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
