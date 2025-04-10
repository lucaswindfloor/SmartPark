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
  Popconfirm,
  Image,
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
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  PictureOutlined,
  UploadOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/lib/table';
import type { UploadFile } from 'antd/lib/upload/interface';
import { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 活动数据接口
interface ActivityItem {
  id: number;
  title: string;
  category: string;
  startTime: string;
  endTime: string;
  location: string;
  createTime: string;
  updateTime: string;
  createdBy: string;
  reviewedBy: string | null;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  isTop: boolean;
  imageUrl: string | null;
  description: string;
  participantCount: number;
  viewCount: number;
  maxParticipants: number;
  currentParticipants: number;
  coverImage: string;
}

// 审核状态枚举
const STATUS_MAP = {
  draft: { text: '草稿', color: 'default' },
  pending: { text: '待审核', color: 'processing' },
  published: { text: '已发布', color: 'success' },
  rejected: { text: '已拒绝', color: 'error' }
};

// 活动分类枚举
const CATEGORY_MAP = {
  'business': '商务交流',
  'technology': '科技创新',
  'culture': '文化娱乐',
  'training': '培训课程',
  'recruitment': '招聘会',
  'other': '其他活动',
  networking: '交流活动',
  lecture: '专题讲座',
  exhibition: '展览展示',
  competition: '赛事活动',
};

// 模拟数据
const mockData: ActivityItem[] = [
  {
    id: 1,
    title: '2024年科技创新峰会',
    category: 'technology',
    startTime: '2024-10-15 09:00:00',
    endTime: '2024-10-15 17:00:00',
    location: '园区多功能厅A区',
    createTime: '2024-09-10 10:30:00',
    updateTime: '2024-09-11 14:20:00',
    createdBy: '张三',
    reviewedBy: '李四',
    status: 'published',
    isTop: true,
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3',
    description: '本次峰会将邀请行业专家分享最新科技趋势，探讨创新发展方向。',
    participantCount: 35,
    viewCount: 156,
    maxParticipants: 200,
    currentParticipants: 145,
    coverImage: '/images/activities/innovation_competition.jpg',
  },
  {
    id: 2,
    title: '园区企业招聘会',
    category: 'recruitment',
    startTime: '2024-10-20 13:00:00',
    endTime: '2024-10-20 17:30:00',
    location: '园区展览中心',
    createTime: '2024-09-08 09:15:00',
    updateTime: '2024-09-09 11:30:00',
    createdBy: '王五',
    reviewedBy: '李四',
    status: 'published',
    isTop: false,
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3',
    description: '园区联合招聘会，30家企业参与，提供200+就业岗位。',
    participantCount: 120,
    viewCount: 310,
    maxParticipants: 150,
    currentParticipants: 120,
    coverImage: '/images/activities/ai_forum.jpg',
  },
  {
    id: 3,
    title: '人工智能技术交流会',
    category: 'technology',
    startTime: '2024-10-25 14:00:00',
    endTime: '2024-10-25 16:30:00',
    location: '创新中心会议室',
    createTime: '2024-09-05 15:45:00',
    updateTime: '2024-09-06 09:20:00',
    createdBy: '赵六',
    reviewedBy: '李四',
    status: 'published',
    isTop: true,
    imageUrl: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-4.0.3',
    description: '探讨AI技术在企业中的实际应用案例分享。',
    participantCount: 28,
    viewCount: 98,
    maxParticipants: 80,
    currentParticipants: 76,
    coverImage: '/images/activities/financing_training.jpg',
  },
  {
    id: 4,
    title: '企业管理培训课程（草稿）',
    category: 'training',
    startTime: '2024-11-05 09:30:00',
    endTime: '2024-11-05 16:30:00',
    location: '培训中心',
    createTime: '2024-09-04 11:20:00',
    updateTime: '2024-09-04 11:20:00',
    createdBy: '李四',
    reviewedBy: null,
    status: 'draft',
    isTop: false,
    imageUrl: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-4.0.3',
    description: '为园区企业提供管理能力提升课程，包括团队管理、项目管理等内容。',
    participantCount: 0,
    viewCount: 0,
    maxParticipants: 0,
    currentParticipants: 0,
    coverImage: '/images/activities/default.jpg',
  },
  {
    id: 5,
    title: '园区文化艺术节（待审核）',
    category: 'culture',
    startTime: '2024-11-15 10:00:00',
    endTime: '2024-11-16 18:00:00',
    location: '园区中央广场',
    createTime: '2024-09-03 14:30:00',
    updateTime: '2024-09-03 16:45:00',
    createdBy: '王五',
    reviewedBy: null,
    status: 'pending',
    isTop: false,
    imageUrl: 'https://images.unsplash.com/photo-1593871075120-982e042088d8?ixlib=rb-4.0.3',
    description: '园区首届文化艺术节，包含艺术展览、音乐会、创意集市等多项活动。',
    participantCount: 0,
    viewCount: 0,
    maxParticipants: 0,
    currentParticipants: 0,
    coverImage: '/images/activities/product_exhibition.jpg',
  },
  {
    id: 6,
    title: '青年创业者交流会',
    category: 'networking',
    startTime: '2024-11-20 18:30:00',
    endTime: '2024-11-20 21:00:00',
    location: '创客咖啡厅',
    createTime: '2024-09-01 10:20:00',
    updateTime: '2024-09-01 10:20:00',
    createdBy: '张三',
    reviewedBy: null,
    status: 'draft',
    isTop: false,
    imageUrl: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-4.0.3',
    description: '为园区青年创业者提供交流平台，分享创业经验，探讨合作机会。',
    participantCount: 0,
    viewCount: 0,
    maxParticipants: 60,
    currentParticipants: 0,
    coverImage: '/images/activities/youth_networking.jpg',
  }
];

const ActivityManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCategory, setSearchCategory] = useState<string | undefined>(undefined);
  const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);
  const [searchDateRange, setSearchDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [dataSource, setDataSource] = useState<ActivityItem[]>(mockData);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<ActivityItem | null>(null);
  const [reviewForm] = Form.useForm();
  const [editVisible, setEditVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 处理日期范围变化
  const onDateChange: RangePickerProps['onChange'] = (dates) => {
    setSearchDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
  };

  // 表格列定义
  const columns: ColumnsType<ActivityItem> = [
    {
      title: '活动标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record) => (
        <Space>
          {record.isTop && <Tag color="#f50">置顶</Tag>}
          <span>{text}</span>
        </Space>
      ),
      width: 250,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: category => {
        const categoryName = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP] || category;
        return <Tag>{categoryName}</Tag>;
      },
      width: 120,
    },
    {
      title: '活动时间',
      key: 'activityTime',
      render: (_, record) => {
        const startDate = record.startTime.split(' ')[0];
        const endDate = record.endTime.split(' ')[0];
        const startTimeShort = record.startTime.split(' ')[1].substring(0, 5);
        const endTimeShort = record.endTime.split(' ')[1].substring(0, 5);
        
        return startDate === endDate ? 
          `${startDate} ${startTimeShort}-${endTimeShort}` : 
          `${startDate} ~ ${endDate}`;
      },
      width: 180,
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
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
      title: '海报',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        imageUrl ? (
          <Button 
            type="link" 
            icon={<PictureOutlined />}
            onClick={() => handlePreviewImage(imageUrl)}
          >
            查看海报
          </Button>
        ) : (
          <Tag color="default">无海报</Tag>
        )
      ),
      width: 100,
    },
    {
      title: '参与人数',
      dataIndex: 'participantCount',
      key: 'participantCount',
      width: 100,
    },
    {
      title: '查看数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
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
            title="确定要删除这个活动吗？"
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
        const activityStartDate = item.startTime.split(' ')[0];
        return activityStartDate >= startDate && activityStartDate <= endDate;
      });
    }
    
    return result;
  };

  // 预览图片
  const handlePreviewImage = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  // 查看活动详情
  const handleView = (record: ActivityItem) => {
    message.info(`查看活动详情：${record.title}`);
    setCurrentItem(record);
  };

  // 打开编辑弹窗
  const handleEdit = (record: ActivityItem) => {
    setCurrentItem(record);
    
    // 设置表单初始值
    editForm.setFieldsValue({
      title: record.title,
      category: record.category,
      activityTime: [
        dayjs(record.startTime),
        dayjs(record.endTime),
      ],
      location: record.location,
      description: record.description,
    });
    
    // 如果有海报图片，设置文件列表
    if (record.imageUrl) {
      const fileName = record.imageUrl.split('/').pop() || 'poster.jpg';
      setFileList([
        {
          uid: '-1',
          name: fileName,
          status: 'done',
          url: record.imageUrl,
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
    
    const { title, category, activityTime, location, description } = values;
    
    // 获取图片URL
    let imageUrl = currentItem.imageUrl;
    
    if (fileList.length > 0 && fileList[0].url) {
      imageUrl = fileList[0].url;
    }
    
    // 更新数据
    setDataSource(prev => 
      prev.map(item => 
        item.id === currentItem.id 
          ? { 
              ...item, 
              title,
              category,
              startTime: activityTime[0].format('YYYY-MM-DD HH:mm:ss'),
              endTime: activityTime[1].format('YYYY-MM-DD HH:mm:ss'),
              location,
              description,
              imageUrl,
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
  const handleReview = (record: ActivityItem) => {
    setCurrentItem(record);
    setReviewVisible(true);
  };

  // 提交审核
  const handleSubmitReview = (record: ActivityItem) => {
    Modal.confirm({
      title: '提交审核',
      icon: <ExclamationCircleOutlined />,
      content: '确定要提交该活动进行审核吗？',
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
  const handleToggleTop = (record: ActivityItem) => {
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

  // 删除活动
  const handleDelete = (record: ActivityItem) => {
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

  return (
    <div className="activity-management">
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
            placeholder={['活动开始日期', '活动结束日期']}
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
        title="审核活动"
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
          <Form.Item name="title" label="活动标题">
            <Input value={currentItem?.title} disabled />
          </Form.Item>
          
          <Form.Item name="time" label="活动时间">
            {currentItem ? `${currentItem.startTime} 至 ${currentItem.endTime}` : ''}
          </Form.Item>
          
          <Form.Item name="location" label="活动地点">
            {currentItem?.location}
          </Form.Item>
          
          {currentItem?.imageUrl && (
            <Form.Item name="poster" label="活动海报">
              <Image
                width={200}
                src={currentItem.imageUrl}
                alt="活动海报"
              />
            </Form.Item>
          )}
          
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
        title="编辑活动"
        open={editVisible}
        footer={null}
        width={700}
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
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="title" 
                label="活动标题" 
                rules={[{ required: true, message: '请输入活动标题' }]}
              >
                <Input placeholder="请输入活动标题" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="category" 
                label="活动分类" 
                rules={[{ required: true, message: '请选择活动分类' }]}
              >
                <Select placeholder="请选择活动分类">
                  {Object.entries(CATEGORY_MAP).map(([key, name]) => (
                    <Option key={key} value={key}>{name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="location" 
                label="活动地点" 
                rules={[{ required: true, message: '请输入活动地点' }]}
              >
                <Input placeholder="请输入活动地点" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="activityTime" 
                label="活动时间" 
                rules={[{ required: true, message: '请选择活动时间' }]}
              >
                <RangePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始时间', '结束时间']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="description" 
                label="活动描述" 
                rules={[{ required: true, message: '请输入活动描述' }]}
              >
                <TextArea rows={4} placeholder="请输入活动描述" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="poster" 
                label="活动海报"
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                  maxCount={1}
                  onPreview={() => fileList[0]?.url && handlePreviewImage(fileList[0].url)}
                >
                  {fileList.length < 1 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>上传海报</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          
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
      
      {/* 图片预览弹窗 */}
      <Modal
        open={previewVisible}
        title="活动海报预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="活动海报" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ActivityManagement; 