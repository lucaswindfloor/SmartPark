import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  DatePicker, 
  Modal, 
  Form, 
  Select, 
  message, 
  Tooltip,
  Row,
  Col
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined, 
  CheckCircleOutlined,
  VerticalAlignTopOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 需求数据接口
interface DemandItem {
  id: number;
  title: string;
  type: string;
  content: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  createTime: string;
  updateTime: string;
  createdBy: string;
  reviewedBy: string | null;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  isTop: boolean;
  viewCount: number;
  validUntil: string;
}

// 审核状态枚举
const STATUS_MAP = {
  draft: { text: '草稿', color: 'default' },
  pending: { text: '待审核', color: 'processing' },
  published: { text: '已发布', color: 'success' },
  rejected: { text: '已拒绝', color: 'error' }
};

// 需求类型枚举
const DEMAND_TYPES = {
  'project': '项目合作',
  'achievement': '成果展示',
  'recruitment': '招聘需求',
  'other': '其他需求'
};

// 模拟数据
const mockData: DemandItem[] = [
  {
    id: 1,
    title: '招聘AI算法工程师',
    type: 'recruitment',
    content: '我司正在寻找有经验的AI算法工程师...',
    company: '智能科技有限公司',
    contact: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    createTime: '2024-03-15 10:30:00',
    updateTime: '2024-03-15 14:20:00',
    createdBy: '张三',
    reviewedBy: '李四',
    status: 'published',
    isTop: true,
    viewCount: 156,
    validUntil: '2024-04-15'
  },
  {
    id: 2,
    title: '寻找机器学习项目合作伙伴',
    type: 'project',
    content: '我们正在开发一个创新的机器学习项目...',
    company: '创新科技有限公司',
    contact: '李四',
    phone: '13900139000',
    email: 'lisi@example.com',
    createTime: '2024-03-14 09:15:00',
    updateTime: '2024-03-14 11:30:00',
    createdBy: '李四',
    reviewedBy: '王五',
    status: 'published',
    isTop: false,
    viewCount: 89,
    validUntil: '2024-04-14'
  }
];

const DemandManagement: React.FC = () => {
  // 状态管理
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [currentRecord, setCurrentRecord] = useState<DemandItem | null>(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<DemandItem> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '需求类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => DEMAND_TYPES[type as keyof typeof DEMAND_TYPES],
    },
    {
      title: '发布企业',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={STATUS_MAP[status as keyof typeof STATUS_MAP].color}>
          {STATUS_MAP[status as keyof typeof STATUS_MAP].text}
        </Tag>
      ),
    },
    {
      title: '置顶',
      dataIndex: 'isTop',
      key: 'isTop',
      render: (isTop: boolean) => isTop ? '是' : '否',
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => dayjs(a.createTime).unix() - dayjs(b.createTime).unix(),
    },
    {
      title: '有效期至',
      dataIndex: 'validUntil',
      key: 'validUntil',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="查看">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleView(record)} 
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              disabled={record.status === 'published'} 
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
              disabled={record.status === 'published'} 
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="审核">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleReview(record)} 
              />
            </Tooltip>
          )}
          <Tooltip title="置顶/取消置顶">
            <Button 
              type="text" 
              icon={<VerticalAlignTopOutlined />} 
              onClick={() => handleToggleTop(record)}
              disabled={record.status !== 'published'} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 搜索和筛选
  const filteredData = () => {
    return mockData.filter(item => {
      const matchText = searchText ? 
        (item.title + item.content + item.company).toLowerCase().includes(searchText.toLowerCase()) : 
        true;
      const matchType = searchType ? item.type === searchType : true;
      const matchStatus = searchStatus ? item.status === searchStatus : true;
      const matchDate = dateRange ? 
        dayjs(item.createTime).isAfter(dateRange[0]) && 
        dayjs(item.createTime).isBefore(dateRange[1]) : 
        true;
      return matchText && matchType && matchStatus && matchDate;
    });
  };

  // 处理查看
  const handleView = (record: DemandItem) => {
    setCurrentRecord(record);
    setModalType('view');
    setVisibleModal(true);
  };

  // 处理编辑
  const handleEdit = (record: DemandItem) => {
    setCurrentRecord(record);
    setModalType('edit');
    form.setFieldsValue(record);
    setVisibleModal(true);
  };

  // 处理删除
  const handleDelete = (record: DemandItem) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除"${record.title}"吗？`,
      onOk() {
        message.success('删除成功');
      },
    });
  };

  // 处理审核
  const handleReview = (record: DemandItem) => {
    Modal.confirm({
      title: '需求审核',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>需求标题：{record.title}</p>
          <p>发布企业：{record.company}</p>
          <p>是否通过该需求的发布申请？</p>
        </div>
      ),
      okText: '通过',
      cancelText: '拒绝',
      onOk() {
        message.success('审核通过');
      },
      onCancel() {
        Modal.confirm({
          title: '请输入拒绝原因',
          icon: <ExclamationCircleOutlined />,
          content: <Input.TextArea rows={4} />,
          onOk() {
            message.success('已拒绝');
          },
        });
      },
    });
  };

  // 处理置顶
  const handleToggleTop = (record: DemandItem) => {
    Modal.confirm({
      title: record.isTop ? '取消置顶' : '设置置顶',
      content: `确定要${record.isTop ? '取消置顶' : '置顶'}该需求吗？`,
      onOk() {
        message.success(`${record.isTop ? '取消置顶' : '置顶'}成功`);
      },
    });
  };

  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      message.success(`${modalType === 'create' ? '创建' : '更新'}成功`);
      setVisibleModal(false);
      form.resetFields();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  // 重置筛选
  const resetFilters = () => {
    setSearchText('');
    setSearchType('');
    setSearchStatus('');
    setDateRange(null);
  };

  return (
    <div>
      {/* 搜索和筛选区 */}
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="搜索标题/内容/企业"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="需求类型"
              value={searchType}
              onChange={value => setSearchType(value)}
              allowClear
            >
              {Object.entries(DEMAND_TYPES).map(([key, value]) => (
                <Option key={key} value={key}>{value}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="状态"
              value={searchStatus}
              onChange={value => setSearchStatus(value)}
              allowClear
            >
              {Object.entries(STATUS_MAP).map(([key, value]) => (
                <Option key={key} value={key}>{value.text}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={value => setDateRange(value)}
            />
          </Col>
          <Col span={4}>
            <Space>
              <Button type="primary" onClick={() => setVisibleModal(true)}>
                新建需求
              </Button>
              <Button onClick={resetFilters}>重置</Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={filteredData()}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: keys => setSelectedRowKeys(keys),
        }}
      />

      {/* 新建/编辑/查看弹窗 */}
      <Modal
        title={
          modalType === 'create' ? '新建需求' :
          modalType === 'edit' ? '编辑需求' : '查看需求'
        }
        open={visibleModal}
        onOk={handleSubmit}
        onCancel={() => {
          setVisibleModal(false);
          form.resetFields();
        }}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={modalType === 'view'}
        >
          <Form.Item
            name="title"
            label="需求标题"
            rules={[{ required: true, message: '请输入需求标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="需求类型"
            rules={[{ required: true, message: '请选择需求类型' }]}
          >
            <Select>
              {Object.entries(DEMAND_TYPES).map(([key, value]) => (
                <Option key={key} value={key}>{value}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="需求内容"
            rules={[{ required: true, message: '请输入需求内容' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="company"
                label="发布企业"
                rules={[{ required: true, message: '请输入发布企业' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contact"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="电子邮箱"
                rules={[
                  { required: true, message: '请输入电子邮箱' },
                  { type: 'email', message: '请输入有效的电子邮箱' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="validUntil"
            label="有效期至"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DemandManagement; 