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
  ExclamationCircleOutlined,
  TeamOutlined,
  PushpinOutlined,
  UserOutlined,
  LockOutlined,
  GlobalOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { RangePickerProps } from 'antd/es/date-picker';
import { informationApi } from '../../../services/api';
import { Notice, NoticeCategory, Status, PublicRange, QueryParams, ReviewRequest } from '../../../models/information';
import { useAuth } from '../../../contexts/AuthContext';

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

// 权限定义
const PERMISSIONS = {
  CREATE: 'notice:create',
  UPDATE: 'notice:update',
  DELETE: 'notice:delete',
  REVIEW: 'notice:review',
  TOP: 'notice:top',
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

  // 初始加载
  useEffect(() => {
    fetchNotices();
  }, [queryParams]);

  // 获取通知公告列表
  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
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
      
      // 调用API获取数据
      const response = await informationApi.getNotices(params);
      console.log('获取通知列表响应:', response);
      
      // 将后端响应数据字段转换为前端组件需要的字段名
      if (response.data && response.data.data) {
        const notices = response.data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          category: item.category,
          status: item.status,
          isTop: item.is_top === 1,
          requireConfirmation: item.require_confirmation === 1,
          publicRange: item.public_ranges || [],
          confirmCount: item.confirm_count || 0,
          viewCount: item.view_count || 0,
          createdBy: item.created_by,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          publishedAt: item.published_at,
          reviewedBy: item.reviewed_by,
          rejectReason: item.reject_reason
        }));
        
        setNoticeList(notices);
        setTotalCount(response.data.total);
      } else {
        // 如果没有数据或格式不对，设置为空数组
        setNoticeList([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error('获取通知公告失败:', err);
      setError(err.message || '获取通知公告失败');
      message.error('获取通知公告失败: ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 检查权限
  const hasPermission = (permission: string): boolean => {
    // 在开发阶段始终返回true，使所有按钮可见
    return true;
    // 实际环境中应使用auth上下文:
    // return auth.hasPermission(permission as any);
  };

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
    form.setFieldsValue({
      ...record,
      createdAt: dayjs(record.createdAt),
      publishedAt: record.publishedAt ? dayjs(record.publishedAt) : undefined
    });
    setFormVisible(true);
  };

  // 编辑通知
  const handleEdit = (record: Notice) => {
    setCurrentNotice(record);
    setFormMode('edit');
    form.setFieldsValue({
      ...record,
      createdAt: dayjs(record.createdAt),
      publishedAt: record.publishedAt ? dayjs(record.publishedAt) : undefined
    });
    setFormVisible(true);
  };

  // 新建通知
  const handleCreate = () => {
    setCurrentNotice(null);
    setFormMode('create');
    form.resetFields();
    form.setFieldsValue({
      title: '',
      content: '',
      category: 'notice' as NoticeCategory,
      publicRange: ['enterprise', 'employee'] as PublicRange[],
      requireConfirmation: false
    });
    setFormVisible(true);
  };

  // 删除通知
  const handleDelete = async (record: Notice) => {
    try {
      setLoading(true);
      await informationApi.deleteNotice(record.id);
      
      setNoticeList(prev => prev.filter(item => item.id !== record.id));
      setTotalCount(prev => prev - 1);
      
      message.success('删除成功');
    } catch (err: any) {
      message.error('删除失败: ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 置顶/取消置顶
  const handleToggleTop = async (record: Notice) => {
    try {
      setLoading(true);
      await informationApi.toggleNoticeTop(record.id);
      
      setNoticeList(prev => 
        prev.map(item => 
          item.id === record.id 
            ? {...item, isTop: !item.isTop} 
            : item
        )
      );
      
      message.success(record.isTop ? '取消置顶成功' : '置顶成功');
    } catch (err: any) {
      message.error((record.isTop ? '取消置顶失败' : '置顶失败') + ': ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 提交审核
  const handleSubmitReview = async (record: Notice) => {
    try {
      setLoading(true);
      await informationApi.updateNotice(record.id, { status: 'pending' as Status });
      
      setNoticeList(prev => 
        prev.map(item => 
          item.id === record.id 
            ? {...item, status: 'pending' as Status, updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')} 
            : item
        )
      );
      
      message.success('提交审核成功');
    } catch (err: any) {
      message.error('提交审核失败: ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 打开审核弹窗
  const handleReview = (record: Notice) => {
    setCurrentNotice(record);
    reviewForm.resetFields();
    setReviewFormVisible(true);
  };

  // 提交审核结果
  const handleReviewSubmit = async (values: any) => {
    if (!currentNotice) return;
    
    try {
      setFormLoading(true);
      const reviewData: ReviewRequest = {
        status: values.reviewResult,
        reason: values.reviewResult === 'rejected' ? values.rejectReason : undefined
      };
      
      await informationApi.reviewNotice(currentNotice.id, reviewData);
      
      setNoticeList(prev => 
        prev.map(item => 
          item.id === currentNotice.id 
            ? {
                ...item, 
                status: reviewData.status, 
                reviewedBy: '管理员',
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                ...(reviewData.status === 'published' ? {publishedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')} : {})
              } 
            : item
        )
      );
      
      message.success(values.reviewResult === 'published' ? '审核通过并发布成功' : '已拒绝发布');
      setReviewFormVisible(false);
    } catch (err: any) {
      message.error('审核操作失败: ' + (err.message || '未知错误'));
    } finally {
      setFormLoading(false);
    }
  };

  // 提交表单
  const handleFormSubmit = async (): Promise<void> => {
    setFormLoading(true);
    try {
      const values = await form.validateFields();
      
      // 转换数据格式，适配后端API
      const submitData = {
        title: values.title,
        content: values.content,
        category: values.category,
        public_ranges: values.publicRange,
        status: formMode === 'create' ? 'draft' : values.status,
        require_confirmation: values.requireConfirmation ? 1 : 0,
        expire_time: values.expireTime ? values.expireTime.format('YYYY-MM-DD HH:mm:ss') : null,
      };
      
      if (formMode === 'create') {
        try {
          Modal.confirm({
            title: '确认创建通知',
            content: (
              <div>
                <p>即将创建以下通知：</p>
                <p><strong>标题:</strong> {values.title}</p>
                <p><strong>类别:</strong> {CATEGORY_MAP[values.category as NoticeCategory]}</p>
                <p><strong>公开范围:</strong> {(values.publicRange as PublicRange[]).map(r => PUBLIC_RANGE_MAP[r].text).join(', ')}</p>
              </div>
            ),
            onOk: async () => {
              setFormLoading(true);
              try {
                const response = await informationApi.createNotice(submitData);
                console.log('创建通知成功:', response);
                message.success('创建成功');
                fetchNotices();
                setFormVisible(false);
              } catch (error: any) {
                console.error('创建通知失败:', error);
                if (error.response && error.response.status === 401) {
                  Modal.error({
                    title: '认证失败',
                    content: '您的身份验证失败，请重新登录后再试。'
                  });
                } else {
                  message.error('创建通知失败: ' + (error.message || '未知错误'));
                }
              } finally {
                setFormLoading(false);
              }
            }
          });
        } catch (error: any) {
          console.error('创建通知失败:', error);
          message.error('创建通知失败: ' + (error.message || '未知错误'));
        }
      } else if (formMode === 'edit' && currentNotice) {
        try {
          Modal.confirm({
            title: '确认更新通知',
            content: (
              <div>
                <p>即将更新以下通知：</p>
                <p><strong>标题:</strong> {values.title}</p>
                <p><strong>类别:</strong> {CATEGORY_MAP[values.category as NoticeCategory]}</p>
                <p><strong>公开范围:</strong> {(values.publicRange as PublicRange[]).map(r => PUBLIC_RANGE_MAP[r].text).join(', ')}</p>
              </div>
            ),
            onOk: async () => {
              setFormLoading(true);
              try {
                const response = await informationApi.updateNotice(currentNotice.id, submitData);
                console.log('更新通知成功:', response);
                message.success('更新成功');
                // 刷新列表
                fetchNotices();
                setFormVisible(false);
              } catch (error: any) {
                console.error('更新通知失败:', error);
                if (error.response && error.response.status === 401) {
                  Modal.error({
                    title: '认证失败',
                    content: '您的身份验证失败，请重新登录后再试。'
                  });
                } else {
                  message.error('更新通知失败: ' + (error.message || '未知错误'));
                }
              } finally {
                setFormLoading(false);
              }
            }
          });
        } catch (error: any) {
          console.error('更新通知失败:', error);
          message.error('更新通知失败: ' + (error.message || '未知错误'));
        }
      }
    } catch (err: any) {
      if (err.errorFields) {
        message.error('请检查表单填写是否正确');
      } else {
        message.error('操作失败: ' + (err.message || '未知错误'));
      }
    } finally {
      setFormLoading(false);
    }
  };

  // 表格列定义
  const columns: ColumnsType<Notice> = [
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
      render: (text, record) => (
        <Space>
          {record.requireConfirmation && <Badge status="processing" />}
          <span className="notice-title">{text}</span>
        </Space>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: NoticeCategory) => CATEGORY_MAP[category],
    },
    {
      title: '公开范围',
      dataIndex: 'publicRange',
      key: 'publicRange',
      render: (publicRange: PublicRange[]) => (
        <Space>
          {publicRange.map(range => (
            <Tag icon={PUBLIC_RANGE_MAP[range]?.icon} key={range}>
              {PUBLIC_RANGE_MAP[range]?.text}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: Status) => {
        const statusInfo = STATUS_MAP[status];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '查看/确认',
      key: 'stats',
      render: (_, record) => (
        <span>
          {record.viewCount} / {record.requireConfirmation ? record.confirmCount : '-'}
        </span>
      ),
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
          
          {hasPermission(PERMISSIONS.UPDATE) && record.status !== 'published' && (
            <Tooltip title="编辑">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleEdit(record)} 
              />
            </Tooltip>
          )}
          
          {hasPermission(PERMISSIONS.DELETE) && record.status !== 'published' && (
            <Tooltip title="删除">
              <Popconfirm
                title="确定要删除此通知吗？"
                onConfirm={() => handleDelete(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                />
              </Popconfirm>
            </Tooltip>
          )}
          
          {hasPermission(PERMISSIONS.REVIEW) && record.status === 'pending' && (
            <Tooltip title="审核">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleReview(record)} 
              />
            </Tooltip>
          )}
          
          {record.status === 'draft' && (
            <Tooltip title="提交审核">
              <Button 
                type="text" 
                icon={<CloudUploadOutlined />}
                onClick={() => handleSubmitReview(record)} 
              />
            </Tooltip>
          )}
          
          {hasPermission(PERMISSIONS.TOP) && record.status === 'published' && (
            <Tooltip title={record.isTop ? "取消置顶" : "置顶"}>
              <Button 
                type="text" 
                icon={<VerticalAlignTopOutlined />} 
                onClick={() => handleToggleTop(record)} 
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="notice-management">
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
          
          {hasPermission(PERMISSIONS.CREATE) && (
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
            
            {formMode === 'view' && (
              <>
                <Divider />
                <Form.Item label="创建时间" name="createdAt">
                  <DatePicker showTime disabled />
                </Form.Item>
                
                {currentNotice?.status === 'published' && (
                  <Form.Item label="发布时间" name="publishedAt">
                    <DatePicker showTime disabled />
                  </Form.Item>
                )}
                
                <Form.Item label="浏览次数">
                  <Input disabled value={currentNotice?.viewCount} />
                </Form.Item>
                
                {currentNotice?.requireConfirmation && (
                  <Form.Item label="确认接收次数">
                    <Input disabled value={currentNotice?.confirmCount} />
                  </Form.Item>
                )}
              </>
            )}
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