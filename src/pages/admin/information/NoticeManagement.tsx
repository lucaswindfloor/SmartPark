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
  Badge,
  Popconfirm,
  Switch
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  VerticalAlignTopOutlined,
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  PushpinOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/lib/table';
import { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 通知公告数据接口
interface NoticeItem {
  id: number;
  title: string;
  category: string;
  date: string;
  status: string;
  isTop: boolean;
  viewCount: number;
  createdBy: string;
  content?: string;
}

// 审核状态枚举
const STATUS_MAP = {
  draft: { text: '草稿', color: 'default' },
  published: { text: '已发布', color: 'success' },
  expired: { text: '已过期', color: 'error' },
};

// 类别映射
const CATEGORY_MAP = {
  announcement: '公告',
  notice: '通知',
  important: '重要通知',
};

// 模拟数据
const mockData: NoticeItem[] = [
  {
    id: 1,
    title: '关于园区停电维护的通知',
    category: 'notice',
    date: '2023-06-15',
    status: 'published',
    isTop: true,
    viewCount: 245,
    createdBy: 'admin',
    content: '尊敬的园区企业：\n为保障园区电力系统安全运行，我们计划于2023年6月20日进行电力设备维护，届时将会有短暂停电，请各企业做好相关准备。'
  },
  {
    id: 2,
    title: '园区招商政策更新公告',
    category: 'announcement',
    date: '2023-06-12',
    status: 'published',
    isTop: false,
    viewCount: 189,
    createdBy: 'admin'
  },
  {
    id: 3,
    title: '消防安全检查通知',
    category: 'important',
    date: '2023-06-10',
    status: 'published',
    isTop: true,
    viewCount: 356,
    createdBy: 'admin'
  },
  {
    id: 4,
    title: '园区企业座谈会邀请函',
    category: 'notice',
    date: '2023-06-05',
    status: 'expired',
    isTop: false,
    viewCount: 122,
    createdBy: 'admin'
  },
  {
    id: 5,
    title: '新年放假安排',
    category: 'announcement',
    date: '2023-05-28',
    status: 'draft',
    isTop: false,
    viewCount: 0,
    createdBy: 'admin'
  }
];

const NoticeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<NoticeItem[]>(mockData);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<NoticeItem | null>(null);
  const [form] = Form.useForm();

  // 处理日期范围变化
  const onDateChange: RangePickerProps['onChange'] = (dates) => {
    setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
  };

  // 根据筛选条件过滤数据
  const filteredData = dataSource.filter(item => {
    const matchesSearch = searchText 
      ? item.title.toLowerCase().includes(searchText.toLowerCase()) 
      : true;
    
    const matchesStatus = statusFilter 
      ? item.status === statusFilter 
      : true;
    
    const matchesCategory = categoryFilter 
      ? item.category === categoryFilter 
      : true;
    
    let matchesDateRange = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const itemDate = dayjs(item.date);
      matchesDateRange = itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1].add(1, 'day'));
    }
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDateRange;
  });

  // 表格列定义
  const columns: ColumnsType<NoticeItem> = [
    {
      title: '置顶',
      dataIndex: 'isTop',
      key: 'isTop',
      width: 80,
      render: (isTop: boolean) => isTop ? <PushpinOutlined style={{ color: '#ff4d4f' }} /> : null,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => CATEGORY_MAP[category as keyof typeof CATEGORY_MAP],
    },
    {
      title: '发布日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusInfo = STATUS_MAP[status as keyof typeof STATUS_MAP];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      sorter: (a, b) => a.viewCount - b.viewCount,
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
          />
          <Button 
            type="text" 
            icon={<PushpinOutlined />} 
            onClick={() => handleToggleTop(record)}
          />
        </Space>
      ),
    },
  ];

  // 查看通知详情
  const handleView = (record: NoticeItem) => {
    setCurrentItem(record);
    setIsModalVisible(true);
  };

  // 编辑通知
  const handleEdit = (record: NoticeItem) => {
    setCurrentItem(record);
    form.setFieldsValue({
      title: record.title,
      category: record.category,
      status: record.status,
      content: record.content || '',
      isTop: record.isTop,
    });
    setIsModalVisible(true);
  };

  // 删除通知
  const handleDelete = (record: NoticeItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除通知 "${record.title}" 吗？`,
      onOk() {
        const newData = dataSource.filter(item => item.id !== record.id);
        setDataSource(newData);
        message.success('通知已成功删除');
      },
    });
  };

  // 切换置顶状态
  const handleToggleTop = (record: NoticeItem) => {
    const newData = dataSource.map(item => {
      if (item.id === record.id) {
        return {...item, isTop: !item.isTop};
      }
      return item;
    });
    setDataSource(newData);
    message.success(`通知已${record.isTop ? '取消置顶' : '置顶'}`);
  };

  // 模态框确认
  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (currentItem) {
        // 更新现有通知
        const newData = dataSource.map(item => {
          if (item.id === currentItem.id) {
            return {...item, ...values};
          }
          return item;
        });
        setDataSource(newData);
        message.success('通知已更新');
      } else {
        // 创建新通知
        const newNotice: NoticeItem = {
          id: Date.now(),
          title: values.title,
          category: values.category,
          date: dayjs().format('YYYY-MM-DD'),
          status: values.status,
          isTop: values.isTop,
          viewCount: 0,
          createdBy: 'current_user',
          content: values.content,
        };
        setDataSource([...dataSource, newNotice]);
        message.success('通知已创建');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // 模态框取消
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentItem(null);
    form.resetFields();
  };

  return (
    <div className="notice-management">
      <div className="filter-container">
        <Space wrap>
          <Input
            placeholder="搜索标题"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <Select
            placeholder="状态筛选"
            allowClear
            style={{ width: 120 }}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="draft">草稿</Option>
            <Option value="published">已发布</Option>
            <Option value="expired">已过期</Option>
          </Select>
          <Select
            placeholder="类别筛选"
            allowClear
            style={{ width: 120 }}
            onChange={(value) => setCategoryFilter(value)}
          >
            <Option value="announcement">公告</Option>
            <Option value="notice">通知</Option>
            <Option value="important">重要通知</Option>
          </Select>
          <RangePicker onChange={onDateChange} />
          <Button type="primary" onClick={() => {
            setSearchText('');
            setDateRange(null);
            setStatusFilter(null);
            setCategoryFilter(null);
          }}>
            重置筛选
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={currentItem ? '编辑通知' : '查看通知'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="类别"
            rules={[{ required: true, message: '请选择类别' }]}
          >
            <Select>
              <Option value="announcement">公告</Option>
              <Option value="notice">通知</Option>
              <Option value="important">重要通知</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="published">已发布</Option>
              <Option value="expired">已过期</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            name="isTop"
            valuePropName="checked"
            label="置顶"
          >
            <Select>
              <Option value={true}>是</Option>
              <Option value={false}>否</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NoticeManagement; 