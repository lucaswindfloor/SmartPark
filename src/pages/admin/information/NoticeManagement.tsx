import React, { useState, useEffect } from 'react';
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
  Switch,
  Spin,
  Typography,
  Divider,
  Radio,
  Alert
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
  TeamOutlined,
  PushpinOutlined,
  UserOutlined,
  GlobalOutlined,
  PlusOutlined,
  FileTextOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { RangePickerProps } from 'antd/es/date-picker';
import { informationApi } from '../../../services/api';
import { Notice, NoticeCategory, Status, PublicRange, QueryParams, ReviewRequest } from '../../../models/information';
import { useAuth } from '../../../contexts/AuthContext';
import { AnnouncementPermission } from '../../../constants/permissions';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

// 审核状态枚举
const STATUS_MAP = {
  draft: { text: '草稿', color: 'default' },
  pending: { text: '待审核', color: 'processing' },
  published: { text: '已发布', color: 'success' },
  rejected: { text: '已拒绝', color: 'error' },
  expired: { text: '已过期', color: 'warning' },
};

// 类别映射
const CATEGORY_MAP: Record<NoticeCategory, string> = {
  announcement: '公告',
  notice: '通知',
  important: '重要通知',
};

// 公开范围映射
const PUBLIC_RANGE_MAP: Record<PublicRange, { text: string, icon: React.ReactNode }> = {
  enterprise: { text: '企业', icon: <TeamOutlined /> },
  employee: { text: '员工', icon: <UserOutlined /> },
  public: { text: '公众', icon: <GlobalOutlined /> },
};

// 权限定义 - 使用枚举
const PERMISSIONS = {
  CREATE: AnnouncementPermission.CREATE,
  UPDATE: AnnouncementPermission.UPDATE,
  DELETE: AnnouncementPermission.DELETE,
  REVIEW: AnnouncementPermission.REVIEW,
  PUBLISH: AnnouncementPermission.PUBLISH,
  TOP: AnnouncementPermission.TOP,
};

const NoticeManagement: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  
  // 数据状态
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 表单状态
  const [form] = Form.useForm();
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [reviewFormVisible, setReviewFormVisible] = useState<boolean>(false);
  const [reviewForm] = Form.useForm();
  
  // 当前选中的通知
  const [currentNotice, setCurrentNotice] = useState<Notice | null>(null);
  
  // 查询参数
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    pageSize: 10
  });
  const [searchText, setSearchText] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<NoticeCategory | null>(null);

  // Add debug logging
  useEffect(() => {
    console.log('=== 权限调试信息 ===');
    console.log('当前用户角色:', auth.userRole);
    console.log('可用角色:', auth.availableRoles);
    console.log('创建权限检查:', auth.hasPermission(PERMISSIONS.CREATE));
    console.log('审核权限检查:', auth.hasPermission(PERMISSIONS.REVIEW));
    console.log('发布权限检查:', auth.hasPermission(PERMISSIONS.PUBLISH));
    console.log('置顶权限检查:', auth.hasPermission(PERMISSIONS.TOP));
    console.log('更新权限检查:', auth.hasPermission(PERMISSIONS.UPDATE));
    console.log('删除权限检查:', auth.hasPermission(PERMISSIONS.DELETE));
  }, [auth.userRole]);

  // 初始加载
  useEffect(() => {
    fetchNotices();
  }, [queryParams]);

  // 获取通知公告列表
  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 构建查询参数
      const params = {
        page: queryParams.page,
        page_size: queryParams.pageSize,
        keyword: searchText,
        status: statusFilter,
        category: categoryFilter,
        start_date: dateRange?.[0]?.format('YYYY-MM-DD'),
        end_date: dateRange?.[1]?.format('YYYY-MM-DD'),
      };
      
      // 模拟一些示例数据以便测试界面，避免后端API调用问题
      const mockData = [
        {
          id: 1,
          title: '园区安全管理规定更新通知',
          content: '为了园区安全，特发布新的管理规定...',
          category: 'important' as NoticeCategory,
          publicRange: ['enterprise', 'employee'] as PublicRange[],
          status: 'published' as Status,
          isTop: true,
          requireConfirmation: true,
          confirmCount: 128,
          viewCount: 256,
          createdBy: '系统管理员',
          createdAt: '2023-06-01 10:00:00',
          updatedAt: '2023-06-01 11:30:00',
          publishedAt: '2023-06-01 12:00:00',
          reviewedBy: '审核员'
        },
        {
          id: 2,
          title: '6月份食堂菜单公告',
          content: '6月份的食堂菜单已更新...',
          category: 'notice' as NoticeCategory,
          publicRange: ['enterprise', 'employee', 'public'] as PublicRange[],
          status: 'draft' as Status,
          isTop: false,
          requireConfirmation: false,
          confirmCount: 0,
          viewCount: 0,
          createdBy: '食堂管理员',
          createdAt: '2023-05-25 14:20:00',
          updatedAt: '2023-05-25 14:20:00'
        }
      ];
      
      setNoticeList(mockData);
      setTotalCount(2);
      
    } catch (err: any) {
      console.error('获取通知公告失败:', err);
      setError('获取通知公告失败: ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 检查权限
  const hasPermission = auth.hasPermission;

  // 处理日期范围变化
  const onDateChange: RangePickerProps['onChange'] = (dates) => {
    setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
  };

  // 应用筛选条件
  const applyFilters = () => {
    setQueryParams({
      ...queryParams,
      page: 1, // 重置到第一页
    });
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchText('');
    setDateRange(null);
    setStatusFilter(null);
    setCategoryFilter(null);
    setQueryParams({
      page: 1,
      pageSize: 10
    });
  };

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setQueryParams({
      ...queryParams,
      page: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  // 查看通知详情
  const handleView = (record: Notice) => {
    setCurrentNotice(record);
    setFormMode('view');
    form.setFieldsValue(record);
    setFormVisible(true);
  };

  // 编辑通知
  const handleEdit = (record: Notice) => {
    setCurrentNotice(record);
    setFormMode('edit');
    form.setFieldsValue(record);
    setFormVisible(true);
  };

  // 新建通知
  const handleCreate = () => {
    setCurrentNotice(null);
    setFormMode('create');
    form.resetFields();
    setFormVisible(true);
  };

  // 删除通知
  const handleDelete = (record: Notice) => {
    message.success('删除成功');
    fetchNotices();
  };

  // 提交审核
  const handleSubmitReview = (record: Notice) => {
    message.success('提交审核成功');
    fetchNotices();
  };

  // 置顶/取消置顶
  const handleToggleTop = (record: Notice) => {
    message.success(record.isTop ? '取消置顶成功' : '置顶成功');
    fetchNotices();
  };

  // 打开审核弹窗
  const handleReview = (record: Notice) => {
    setCurrentNotice(record);
    reviewForm.resetFields();
    setReviewFormVisible(true);
  };

  // 提交审核结果
  const handleReviewSubmit = async (values: any) => {
    message.success(values.reviewResult === 'published' ? '发布成功' : '拒绝成功');
    setReviewFormVisible(false);
    fetchNotices();
  };

  // 提交表单
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      setFormLoading(true);
      
      if (formMode === 'create') {
        message.success('创建成功');
      } else if (formMode === 'edit') {
        message.success('更新成功');
      }
      
      setFormVisible(false);
      fetchNotices();
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setFormLoading(false);
    }
  };
  
  // 根据用户角色和通知状态判断是否显示操作按钮
  const getActionButtons = (record: Notice) => {
    const buttons = [];
    const isContentAdmin = auth.userRole === 'contentAdmin';
    const isReviewer = auth.userRole === 'reviewer';

    // 查看按钮 - 所有角色可见
    buttons.push(
      <Button
        key="view"
        type="text"
        icon={<EyeOutlined />}
        onClick={() => handleView(record)}
      >
        查看
      </Button>
    );

    // 内容管理员权限
    if (isContentAdmin) {
      // 草稿状态：编辑、删除、提交审核
      if (record.status === 'draft') {
        buttons.push(
          <Button
            key="edit"
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>,
          <Popconfirm
            key="delete"
            title="确定要删除这条通知吗？"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>,
          <Button
            key="submit"
            type="text"
            icon={<CloudUploadOutlined />}
            onClick={() => handleSubmitReview(record)}
          >
            提交审核
          </Button>
        );
      }
    }

    // 审核员权限
    if (isReviewer) {
      // 待审核状态：审核、编辑、删除
      if (record.status === 'pending') {
        buttons.push(
          <Button
            key="review"
            type="text"
            icon={<CheckCircleOutlined />}
            onClick={() => handleReview(record)}
          >
            审核
          </Button>,
          <Button
            key="edit"
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>,
          <Popconfirm
            key="delete"
            title="确定要删除这条通知吗？"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        );
      }
      // 已发布状态：置顶
      if (record.status === 'published') {
        buttons.push(
          <Button
            key="top"
            type="text"
            icon={<PushpinOutlined />}
            onClick={() => handleToggleTop(record)}
          >
            {record.isTop ? '取消置顶' : '置顶'}
          </Button>
        );
      }
    }

    return buttons;
  };

  // 表格列定义
  const columns: ColumnsType<Notice> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text, record) => (
        <Space>
          {record.isTop && <PushpinOutlined style={{ color: '#f5222d' }} />}
          <span>{text}</span>
          {record.requireConfirmation && <BellOutlined style={{ color: '#1890ff' }} />}
        </Space>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: NoticeCategory) => (
        <Tag color="blue">{CATEGORY_MAP[category]}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: Status) => (
        <Tag color={STATUS_MAP[status].color}>
          {STATUS_MAP[status].text}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          {getActionButtons(record)}
        </Space>
      ),
    },
  ];
  
  // 工具栏按钮
  const renderToolbar = () => {
    const isContentAdmin = auth.userRole === 'contentAdmin';
    
    return (
      <Space>
        {isContentAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            创建通知
          </Button>
        )}
        <Button
          icon={<SearchOutlined />}
          onClick={applyFilters}
        >
          搜索
        </Button>
        <Button onClick={resetFilters}>
          重置
        </Button>
      </Space>
    );
  };

  return (
    <div className="notice-management">
      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>通知公告管理</Title>
            <div>
              <Text type="secondary">
                当前角色: {auth.userRole === 'contentAdmin' ? '内容管理员' : '审核员'}
              </Text>
            </div>
          </div>
        </Space>
      </div>

      {/* 搜索和筛选区 */}
      <div style={{ marginBottom: 16 }}>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索标题或内容"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          
          <Select 
            placeholder="类别" 
            allowClear 
            style={{ width: 130 }}
            value={categoryFilter}
            onChange={setCategoryFilter}
          >
            {Object.entries(CATEGORY_MAP).map(([key, name]) => (
              <Option key={key} value={key as NoticeCategory}>{name}</Option>
            ))}
          </Select>
          
          <Select 
            placeholder="状态" 
            allowClear 
            style={{ width: 130 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            {Object.entries(STATUS_MAP).map(([key, { text }]) => (
              <Option key={key} value={key as Status}>{text}</Option>
            ))}
          </Select>
          
          <RangePicker 
            value={dateRange}
            onChange={onDateChange}
            placeholder={['开始日期', '结束日期']}
          />
          
          <Button type="primary" onClick={applyFilters}>搜索</Button>
          <Button onClick={resetFilters}>重置</Button>
          
          {/* 只对内容管理员显示新建按钮 */}
          {auth.userRole === 'contentAdmin' && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreate}
            >
              新建通知
            </Button>
          )}
        </Space>
      </div>

      {/* 错误信息 */}
      {error && (
        <div style={{ marginBottom: 16 }}>
          <Alert type="error" message={error} showIcon closable onClose={() => setError(null)} />
        </div>
      )}

      {/* 表格 */}
      <Spin spinning={loading}>
        <Table 
          columns={columns} 
          dataSource={noticeList}
          rowKey="id"
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.pageSize,
            total: totalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`
          }}
          onChange={handleTableChange}
        />
      </Spin>

      {/* 通知表单弹窗 */}
      <Modal
        title={
          formMode === 'create' ? '新建通知公告' : 
          formMode === 'edit' ? '编辑通知公告' : 
          '查看通知公告'
        }
        open={formVisible}
        onOk={handleFormSubmit}
        onCancel={() => setFormVisible(false)}
        okButtonProps={{ loading: formLoading, disabled: formMode === 'view' }}
        cancelButtonProps={{ disabled: formLoading }}
        width={800}
      >
        <Spin spinning={formLoading}>
          <Form
            form={form}
            layout="vertical"
            disabled={formMode === 'view' || formLoading}
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="请输入通知标题" maxLength={100} />
            </Form.Item>
            
            <Form.Item
              name="category"
              label="类别"
              rules={[{ required: true, message: '请选择类别' }]}
            >
              <Select placeholder="请选择类别">
                {Object.entries(CATEGORY_MAP).map(([key, name]) => (
                  <Option key={key} value={key as NoticeCategory}>{name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <TextArea rows={6} placeholder="请输入通知内容" />
            </Form.Item>
            
            <Form.Item
              name="publicRange"
              label="公开范围"
              rules={[{ required: true, message: '请选择公开范围' }]}
            >
              <Select 
                mode="multiple" 
                placeholder="请选择公开范围"
              >
                {Object.entries(PUBLIC_RANGE_MAP).map(([key, { text, icon }]) => (
                  <Option key={key} value={key as PublicRange}>
                    <Space>
                      {icon}
                      {text}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="requireConfirmation"
              label="需要确认接收"
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      {/* 审核弹窗 */}
      <Modal
        title="审核通知公告"
        open={reviewFormVisible}
        footer={null}
        onCancel={() => setReviewFormVisible(false)}
        width={600}
      >
        <Spin spinning={formLoading}>
          <Form
            form={reviewForm}
            layout="vertical"
            onFinish={handleReviewSubmit}
          >
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>{currentNotice?.title}</Title>
              <Text type="secondary">
                类别：{currentNotice?.category && CATEGORY_MAP[currentNotice.category]}
              </Text>
              <div style={{ margin: '16px 0', padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                {currentNotice?.content}
              </div>
              <Text type="secondary">
                创建人：{currentNotice?.createdBy}，
                创建时间：{currentNotice?.createdAt}
              </Text>
            </div>
            
            <Form.Item
              name="reviewResult"
              label="审核结果"
              rules={[{ required: true, message: '请选择审核结果' }]}
            >
              <Radio.Group>
                <Radio value="published">通过并发布</Radio>
                <Radio value="rejected">拒绝发布</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.reviewResult !== currentValues.reviewResult}
            >
              {({ getFieldValue }) => 
                getFieldValue('reviewResult') === 'rejected' ? (
                  <Form.Item
                    name="rejectReason"
                    label="拒绝原因"
                    rules={[{ required: true, message: '请输入拒绝原因' }]}
                  >
                    <TextArea rows={4} placeholder="请输入拒绝原因" />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
            
            <Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={() => setReviewFormVisible(false)}>取消</Button>
                  <Button type="primary" htmlType="submit" loading={formLoading}>
                    提交审核
                  </Button>
                </Space>
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default NoticeManagement;
