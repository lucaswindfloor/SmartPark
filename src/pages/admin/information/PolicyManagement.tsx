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
  Upload,
  Popconfirm
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined, 
  CheckCircleOutlined,
  VerticalAlignTopOutlined,
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  UploadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/lib/table';
import type { UploadFile } from 'antd/lib/upload/interface';
import { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 政策文件数据接口
interface PolicyItem {
  id: number;
  title: string;
  category: string;
  createTime: string;
  updateTime: string;
  createdBy: string;
  reviewedBy: string | null;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  isTop: boolean;
  publicRange: string[];
  viewCount: number;
  fileName: string | null;
  fileUrl: string | null;
  downloadCount: number;
}

// 审核状态枚举
const STATUS_MAP = {
  draft: { text: '草稿', color: 'default' },
  pending: { text: '待审核', color: 'processing' },
  published: { text: '已发布', color: 'success' },
  rejected: { text: '已拒绝', color: 'error' }
};

// 政策分类枚举
const CATEGORY_MAP = {
  'park-management': '园区管理制度',
  'financial-support': '财政扶持政策',
  'talent-policy': '人才政策',
  'tax-policy': '税收政策',
  'enterprise-service': '企业服务政策'
};

// 部门映射
const DEPARTMENT_MAP = {
  finance: '财政部门',
  technology: '科技部门',
  humanResource: '人力资源部门',
  administration: '行政部门',
  other: '其他部门',
};

// 模拟数据
const mockData: PolicyItem[] = [
  {
    id: 1,
    title: '智慧园区创新企业认定管理办法',
    category: 'park-management',
    createTime: '2024-09-10 10:30:00',
    updateTime: '2024-09-11 14:20:00',
    createdBy: '张三',
    reviewedBy: '李四',
    status: 'published',
    isTop: true,
    publicRange: ['enterprise', 'employee'],
    viewCount: 156,
    fileName: '智慧园区创新企业认定管理办法.pdf',
    fileUrl: '/files/policies/park-management-001.pdf',
    downloadCount: 178
  },
  {
    id: 2,
    title: '智慧园区高新技术企业财政扶持实施细则',
    category: 'financial-support',
    createTime: '2024-09-08 09:15:00',
    updateTime: '2024-09-09 11:30:00',
    createdBy: '王五',
    reviewedBy: '李四',
    status: 'published',
    isTop: true,
    publicRange: ['enterprise', 'employee', 'public'],
    viewCount: 210,
    fileName: '智慧园区高新技术企业财政扶持实施细则.pdf',
    fileUrl: '/files/policies/financial-support-001.pdf',
    downloadCount: 245
  },
  {
    id: 3,
    title: '园区高层次人才引进奖励办法',
    category: 'talent-policy',
    createTime: '2024-09-05 15:45:00',
    updateTime: '2024-09-06 09:20:00',
    createdBy: '赵六',
    reviewedBy: '李四',
    status: 'published',
    isTop: false,
    publicRange: ['enterprise', 'employee'],
    viewCount: 98,
    fileName: '园区高层次人才引进奖励办法.pdf',
    fileUrl: '/files/policies/talent-policy-001.pdf',
    downloadCount: 201
  },
  {
    id: 4,
    title: '企业研发费用税前加计扣除政策解读（草稿）',
    category: 'tax-policy',
    createTime: '2024-09-04 11:20:00',
    updateTime: '2024-09-04 11:20:00',
    createdBy: '李四',
    reviewedBy: null,
    status: 'draft',
    isTop: false,
    publicRange: ['enterprise', 'employee', 'public'],
    viewCount: 0,
    fileName: '企业研发费用税前加计扣除政策解读.pdf',
    fileUrl: '/files/policies/draft/tax-policy-001.pdf',
    downloadCount: 0
  },
  {
    id: 5,
    title: '园区企业服务指南（待审核）',
    category: 'enterprise-service',
    createTime: '2024-09-03 14:30:00',
    updateTime: '2024-09-03 16:45:00',
    createdBy: '王五',
    reviewedBy: null,
    status: 'pending',
    isTop: false,
    publicRange: ['enterprise'],
    viewCount: 0,
    fileName: '园区企业服务指南.pdf',
    fileUrl: '/files/policies/pending/enterprise-service-001.pdf',
    downloadCount: 0
  }
];

const PolicyManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCategory, setSearchCategory] = useState<string | undefined>(undefined);
  const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);
  const [searchDateRange, setSearchDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [dataSource, setDataSource] = useState<PolicyItem[]>(mockData);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<PolicyItem | null>(null);
  const [reviewForm] = Form.useForm();
  const [editVisible, setEditVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 表格列定义
  const columns: ColumnsType<PolicyItem> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record) => (
        <Space>
          {record.isTop && <Tag color="#f50">置顶</Tag>}
          <span>{text}</span>
        </Space>
      ),
      width: 300,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: category => {
        const categoryName = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP] || category;
        return <Tag>{categoryName}</Tag>;
      },
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const statusInfo = STATUS_MAP[status as keyof typeof STATUS_MAP];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
      width: 100,
    },
    {
      title: '文件',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (fileName, record) => (
        fileName ? (
          <Tooltip title={fileName}>
            <Button 
              type="link" 
              icon={<FileTextOutlined />}
              onClick={() => handleViewFile(record)}
            >
              查看文件
            </Button>
          </Tooltip>
        ) : (
          <Tag color="default">无文件</Tag>
        )
      ),
      width: 150,
    },
    {
      title: '公开范围',
      dataIndex: 'publicRange',
      key: 'publicRange',
      render: ranges => (
        <Space>
          {ranges.includes('enterprise') && (
            <Tooltip title="企业管理员">
              <Tag color="blue">企业</Tag>
            </Tooltip>
          )}
          {ranges.includes('employee') && (
            <Tooltip title="企业员工">
              <Tag color="green">员工</Tag>
            </Tooltip>
          )}
          {ranges.includes('public') && (
            <Tooltip title="公众访客">
              <Tag color="orange">公众</Tag>
            </Tooltip>
          )}
        </Space>
      ),
      width: 200,
    },
    {
      title: '查看数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
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
            disabled={record.status === 'published'}
          />
          {record.status === 'pending' && (
            <Button 
              type="text" 
              icon={<CheckCircleOutlined />} 
              onClick={() => handleReview(record)}
            />
          )}
          {record.status === 'draft' && (
            <Button 
              type="text" 
              icon={<CloudUploadOutlined />} 
              onClick={() => handleSubmitReview(record)}
            />
          )}
          {record.status === 'published' && (
            <Button 
              type="text" 
              icon={<VerticalAlignTopOutlined />} 
              onClick={() => handleToggleTop(record)}
            />
          )}
          <Popconfirm
            title="确定要删除这条政策文件吗？"
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
        </Space>
      ),
      width: 200,
    },
  ];

  // 筛选数据
  const filteredData = () => {
    let result = [...dataSource];
    
    if (searchTitle) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    
    if (searchCategory) {
      result = result.filter(item => item.category === searchCategory);
    }
    
    if (searchStatus) {
      result = result.filter(item => item.status === searchStatus);
    }
    
    if (searchDateRange && searchDateRange[0] && searchDateRange[1]) {
      const startDate = searchDateRange[0].format('YYYY-MM-DD');
      const endDate = searchDateRange[1].format('YYYY-MM-DD');
      
      result = result.filter(item => {
        const createDate = item.createTime.split(' ')[0];
        return createDate >= startDate && createDate <= endDate;
      });
    }
    
    return result;
  };

  // 查看文件
  const handleViewFile = (record: PolicyItem) => {
    if (record.fileUrl) {
      message.info(`查看文件：${record.fileName}`);
      // 实际应用中可能会打开新窗口或下载
      // window.open(record.fileUrl, '_blank');
    }
  };

  // 查看政策详情
  const handleView = (record: PolicyItem) => {
    message.info(`查看政策详情：${record.title}`);
    // 实际应用中可能会导航到详情页
    // navigate(`/admin/information/policy/view/${record.id}`);
  };

  // 打开编辑弹窗
  const handleEdit = (record: PolicyItem) => {
    setCurrentItem(record);
    editForm.setFieldsValue({
      title: record.title,
      category: record.category,
      publicRange: record.publicRange,
    });
    
    // 如果有文件，设置文件列表
    if (record.fileName && record.fileUrl) {
      setFileList([
        {
          uid: '-1',
          name: record.fileName,
          status: 'done',
          url: record.fileUrl,
        }
      ]);
    } else {
      setFileList([]);
    }
    
    setEditVisible(true);
  };

  // 提交编辑
  const handleEditFinish = (values: any) => {
    if (!currentItem) return;
    
    const { title, category, publicRange } = values;
    
    // 获取文件信息
    let fileName = currentItem.fileName;
    let fileUrl = currentItem.fileUrl;
    
    if (fileList.length > 0) {
      fileName = fileList[0].name;
      // 在实际应用中，这应该是服务器上的文件路径
      fileUrl = `/files/policies/${category}/${fileName}`;
    }
    
    // 更新数据
    setDataSource(prev => 
      prev.map(item => 
        item.id === currentItem.id 
          ? { 
              ...item, 
              title,
              category,
              publicRange,
              fileName,
              fileUrl,
              updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
            } 
          : item
      )
    );
    
    message.success('编辑成功');
    setEditVisible(false);
    setCurrentItem(null);
    editForm.resetFields();
    setFileList([]);
  };

  // 打开审核弹窗
  const handleReview = (record: PolicyItem) => {
    setCurrentItem(record);
    setReviewVisible(true);
  };

  // 提交审核
  const handleSubmitReview = (record: PolicyItem) => {
    Modal.confirm({
      title: '提交审核',
      icon: <ExclamationCircleOutlined />,
      content: '确定要提交该政策文件进行审核吗？',
      onOk() {
        setDataSource(prev => 
          prev.map(item => 
            item.id === record.id 
              ? { ...item, status: 'pending', updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') } 
              : item
          )
        );
        message.success('已提交审核');
      },
    });
  };

  // 完成审核
  const handleReviewFinish = (values: any) => {
    if (!currentItem) return;
    
    const { reviewResult, reviewComment } = values;
    
    setDataSource(prev => 
      prev.map(item => 
        item.id === currentItem.id 
          ? { 
              ...item, 
              status: reviewResult === 'approve' ? 'published' : 'rejected',
              reviewedBy: '管理员',
              updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
            } 
          : item
      )
    );
    
    message.success(
      reviewResult === 'approve' 
        ? '审核通过，已发布' 
        : '已拒绝发布'
    );
    
    setReviewVisible(false);
    setCurrentItem(null);
    reviewForm.resetFields();
  };

  // 切换置顶状态
  const handleToggleTop = (record: PolicyItem) => {
    setDataSource(prev => 
      prev.map(item => 
        item.id === record.id 
          ? { ...item, isTop: !item.isTop, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') } 
          : item
      )
    );
    
    message.success(
      record.isTop 
        ? '已取消置顶' 
        : '已设为置顶'
    );
  };

  // 删除政策
  const handleDelete = (record: PolicyItem) => {
    setDataSource(prev => prev.filter(item => item.id !== record.id));
    message.success('删除成功');
  };

  // 文件上传变化
  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  // 重置过滤条件
  const resetFilters = () => {
    setSearchTitle('');
    setSearchCategory(undefined);
    setSearchStatus(undefined);
    setSearchDateRange(null);
  };

  // 处理日期范围变化
  const onDateChange: RangePickerProps['onChange'] = (dates) => {
    setSearchDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
  };

  return (
    <div className="policy-management">
      <div className="filter-container">
        <Space wrap>
          <Input
            placeholder="搜索标题"
            allowClear
            value={searchTitle}
            onChange={e => setSearchTitle(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Select 
            placeholder="分类筛选" 
            allowClear 
            style={{ width: 150 }}
            value={searchCategory}
            onChange={value => setSearchCategory(value)}
          >
            {Object.entries(CATEGORY_MAP).map(([key, name]) => (
              <Option key={key} value={key}>{name}</Option>
            ))}
          </Select>
          <Select 
            placeholder="状态筛选" 
            allowClear 
            style={{ width: 120 }}
            value={searchStatus}
            onChange={value => setSearchStatus(value)}
          >
            <Option value="draft">草稿</Option>
            <Option value="pending">待审核</Option>
            <Option value="published">已发布</Option>
            <Option value="rejected">已拒绝</Option>
          </Select>
          <RangePicker 
            value={searchDateRange}
            onChange={onDateChange}
          />
          <Button onClick={resetFilters}>重置</Button>
        </Space>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={filteredData()}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条记录`
        }}
      />
      
      {/* 审核弹窗 */}
      <Modal
        title="审核政策文件"
        open={reviewVisible}
        footer={null}
        onCancel={() => {
          setReviewVisible(false);
          setCurrentItem(null);
          reviewForm.resetFields();
        }}
      >
        <Form 
          form={reviewForm}
          layout="vertical"
          onFinish={handleReviewFinish}
        >
          <Form.Item name="title" label="标题">
            <Input value={currentItem?.title} disabled />
          </Form.Item>
          
          <Form.Item name="fileName" label="文件">
            {currentItem?.fileName || '无文件'}
          </Form.Item>
          
          <Form.Item 
            name="reviewResult" 
            label="审核结果" 
            rules={[{ required: true, message: '请选择审核结果' }]}
          >
            <Select placeholder="请选择">
              <Option value="approve">通过并发布</Option>
              <Option value="reject">拒绝</Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="reviewComment" 
            label="审核意见"
          >
            <TextArea rows={4} placeholder="请输入审核意见（可选）" />
          </Form.Item>
          
          <Form.Item>
            <Space style={{ float: 'right' }}>
              <Button onClick={() => {
                setReviewVisible(false);
                setCurrentItem(null);
                reviewForm.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 编辑弹窗 */}
      <Modal
        title="编辑政策文件"
        open={editVisible}
        footer={null}
        onCancel={() => {
          setEditVisible(false);
          setCurrentItem(null);
          editForm.resetFields();
          setFileList([]);
        }}
      >
        <Form 
          form={editForm}
          layout="vertical"
          onFinish={handleEditFinish}
        >
          <Form.Item 
            name="title" 
            label="标题" 
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>
          
          <Form.Item 
            name="category" 
            label="分类" 
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {Object.entries(CATEGORY_MAP).map(([key, name]) => (
                <Option key={key} value={key}>{name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="publicRange" 
            label="公开范围" 
            rules={[{ required: true, message: '请选择公开范围' }]}
          >
            <Select mode="multiple" placeholder="请选择公开范围">
              <Option value="enterprise">企业管理员</Option>
              <Option value="employee">企业员工</Option>
              <Option value="public">公众访客</Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="file" 
            label="文件"
          >
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item>
            <Space style={{ float: 'right' }}>
              <Button onClick={() => {
                setEditVisible(false);
                setCurrentItem(null);
                editForm.resetFields();
                setFileList([]);
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PolicyManagement; 