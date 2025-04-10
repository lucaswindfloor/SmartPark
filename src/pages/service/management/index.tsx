import React, { useState } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Select,
  Row,
  Col,
  Typography,
  Switch,
  Tag,
  Tooltip,
  Modal,
  message,
  Divider,
  Alert,
  Pagination
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  ExportOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PrinterOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './index.less';

const { Title, Text } = Typography;
const { Option } = Select;

// 定义服务数据接口
interface ServiceItem {
  key: string;
  order: number;
  name: string;
  type: string;
  status: boolean;
  updatedBy: string;
  updatedAt: string;
}

// 服务类型
const serviceTypes = [
  { value: '1', label: '物业服务' },
  { value: '2', label: '成长服务' },
  { value: '3', label: '配套服务' },
  { value: '4', label: '增值服务' }
];

// 模拟服务数据
const mockData: ServiceItem[] = [
  {
    key: '1',
    order: 1,
    name: '退园申请',
    type: '物业服务',
    status: true,
    updatedBy: '李明',
    updatedAt: '2024-09-01 18:28:30'
  },
  {
    key: '2',
    order: 2,
    name: '企业注册服务',
    type: '成长服务',
    status: true,
    updatedBy: '王华',
    updatedAt: '2024-09-01 15:32:21'
  },
  {
    key: '3',
    order: 3,
    name: '停车服务',
    type: '配套服务',
    status: true,
    updatedBy: '汪有',
    updatedAt: '2024-09-01 9:12:46'
  },
  {
    key: '4',
    order: 4,
    name: '门禁服务',
    type: '配套服务',
    status: true,
    updatedBy: '张强',
    updatedAt: '2024-09-01 18:28:30'
  },
  {
    key: '5',
    order: 5,
    name: '空调加时服务',
    type: '配套服务',
    status: true,
    updatedBy: '赵敏瑞',
    updatedAt: '2024-09-01 15:32:21'
  },
  {
    key: '6',
    order: 6,
    name: '退租申请',
    type: '物业服务',
    status: true,
    updatedBy: '刘芳',
    updatedAt: '2024-09-01 9:12:46'
  },
  {
    key: '7',
    order: 7,
    name: '维修申报',
    type: '物业服务',
    status: true,
    updatedBy: '陈晨',
    updatedAt: '2024-09-01 18:28:30'
  },
  {
    key: '8',
    order: 8,
    name: '会议室服务',
    type: '配套服务',
    status: true,
    updatedBy: '王莉莉',
    updatedAt: '2024-09-01 18:28:30'
  },
  {
    key: '9',
    order: 9,
    name: '事件上报',
    type: '增值服务',
    status: true,
    updatedBy: '韩梅',
    updatedAt: '2024-09-01 15:32:21'
  },
  {
    key: '10',
    order: 10,
    name: '融资服务',
    type: '成长服务',
    status: true,
    updatedBy: '程依琳',
    updatedAt: '2024-09-01 9:12:46'
  }
];

const ServiceManagement: React.FC = () => {
  // 状态定义
  const [searchText, setSearchText] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // 处理服务状态切换
  const handleStatusChange = (checked: boolean, record: ServiceItem) => {
    message.success(`${record.name} 服务状态已${checked ? '开启' : '关闭'}`);
  };

  // 处理编辑操作
  const handleEdit = (record: ServiceItem) => {
    message.info(`编辑服务: ${record.name}`);
    // 这里可以打开编辑模态框
  };

  // 处理查看详情操作
  const handleViewDetails = (record: ServiceItem) => {
    message.info(`查看服务详情: ${record.name}`);
    // 这里可以打开详情模态框
  };

  // 处理删除操作
  const handleDelete = (record: ServiceItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 ${record.name} 服务吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success(`服务 ${record.name} 已成功删除`);
      }
    });
  };

  // 处理新增服务
  const handleAddService = () => {
    message.info('新增服务');
    // 这里可以打开新增服务的模态框
  };

  // 处理导出数据
  const handleExport = () => {
    message.success('服务数据导出成功');
  };

  // 处理刷新
  const handleRefresh = () => {
    message.success('数据已刷新');
  };

  // 处理打印
  const handlePrint = () => {
    message.info('准备打印服务列表');
    window.print();
  };

  // 表格列定义
  const columns: ColumnsType<ServiceItem> = [
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      align: 'center',
    },
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '服务类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        let color;
        switch (type) {
          case '物业服务':
            color = 'blue';
            break;
          case '成长服务':
            color = 'green';
            break;
          case '配套服务':
            color = 'purple';
            break;
          case '增值服务':
            color = 'orange';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          checked={status}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
    {
      title: '更新人',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Tooltip>
          <Tooltip title="详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetails(record)}
            >
              详情
            </Button>
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="link" 
              icon={<DeleteOutlined />} 
              danger 
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 获取过滤后的数据
  const getFilteredData = () => {
    return mockData.filter((item) => {
      // 按服务名称过滤
      const nameMatch = !searchText || item.name.toLowerCase().includes(searchText.toLowerCase());
      
      // 按服务类型过滤
      const typeMatch = !selectedType || 
        (selectedType === '1' && item.type === '物业服务') ||
        (selectedType === '2' && item.type === '成长服务') ||
        (selectedType === '3' && item.type === '配套服务') ||
        (selectedType === '4' && item.type === '增值服务');
      
      // 按状态过滤
      const statusMatch = selectedStatus === undefined || item.status === selectedStatus;
      
      return nameMatch && typeMatch && statusMatch;
    });
  };

  return (
    <div className="service-management">
      <Title level={4}>服务管理</Title>
      
      <Card className="filter-card" title="筛选条件">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6} lg={8}>
            <Input
              placeholder="搜索服务名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={8}>
            <Select
              placeholder="服务类型"
              style={{ width: '100%' }}
              value={selectedType}
              onChange={(value) => setSelectedType(value)}
              allowClear
            >
              {serviceTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={8}>
            <Select
              placeholder="服务状态"
              style={{ width: '100%' }}
              value={selectedStatus !== undefined ? (selectedStatus ? 'active' : 'inactive') : undefined}
              onChange={(value) => setSelectedStatus(value === 'active' ? true : value === 'inactive' ? false : undefined)}
              allowClear
            >
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Col>
        </Row>
      </Card>
      
      <Card 
        className="table-card" 
        title="服务列表" 
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddService}>
              新增服务
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出数据
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              刷新
            </Button>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
              打印
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          pagination={false}
          className="ant-table-striped"
          rowClassName={(record, index) => index % 2 === 0 ? '' : 'table-row-alternate'}
        />
        <Row justify="end" style={{ marginTop: 16 }}>
          <Col>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={mockData.length}
              showTotal={(total) => `共 ${total} 条记录`}
              onChange={(page) => setCurrentPage(page)}
              onShowSizeChange={(current, size) => {
                setCurrentPage(current);
                setPageSize(size);
              }}
              showSizeChanger
              showQuickJumper
            />
          </Col>
        </Row>
      </Card>

      <Card 
        className="info-card" 
        title={
          <span>
            <InfoCircleOutlined style={{ marginRight: 8 }} />
            功能说明
          </span>
        }
      >
        <Alert
          message="服务管理功能说明"
          description={
            <>
              <p><strong>新增服务：</strong>点击"新增服务"按钮添加园区服务项目，需设置服务名称、类型、状态等信息。</p>
              <p><strong>编辑服务：</strong>点击操作栏中的"编辑"按钮修改服务信息。</p>
              <p><strong>查看详情：</strong>点击操作栏中的"查看"按钮查看服务的详细信息。</p>
            </>
          }
          type="info"
          showIcon
        />
      </Card>
    </div>
  );
};

export default ServiceManagement; 