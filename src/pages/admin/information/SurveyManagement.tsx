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
  Popconfirm,
  Progress,
  Badge,
  Statistic,
  Row,
  Col,
  Card
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined, 
  CheckCircleOutlined,
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  FormOutlined,
  ClockCircleOutlined,
  CheckSquareOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/lib/table';
import { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 问卷数据接口
interface SurveyItem {
  id: number;
  title: string;
  category: string;
  startTime: string;
  endTime: string;
  createTime: string;
  updateTime: string;
  createdBy: string;
  status: 'draft' | 'published' | 'ended' | 'archived';
  targetGroups: string[];
  questionCount: number;
  completedCount: number;
  viewCount: number;
  description: string;
}

// 状态枚举
const STATUS_MAP = {
  draft: { text: '草稿', color: 'default' },
  published: { text: '进行中', color: 'success' },
  ended: { text: '已结束', color: 'warning' },
  archived: { text: '已归档', color: 'error' }
};

// 问卷分类枚举
const CATEGORY_MAP = {
  'satisfaction': '满意度调查',
  'feedback': '意见反馈',
  'needs': '需求调研',
  'event': '活动评价',
  'other': '其他调查'
};

// 目标群体映射
const TARGET_GROUPS_MAP = {
  'enterprises': '入驻企业',
  'employees': '企业员工',
  'visitors': '访客',
  'public': '社会公众',
  'startups': '创业者'
};

// 模拟数据
const mockData: SurveyItem[] = [
  {
    id: 1,
    title: '园区服务满意度调查',
    category: 'satisfaction',
    startTime: '2024-10-01 00:00:00',
    endTime: '2024-10-30 23:59:59',
    createTime: '2024-09-25 10:30:00',
    updateTime: '2024-09-25 14:20:00',
    createdBy: '张三',
    status: 'published',
    targetGroups: ['enterprises', 'employees'],
    questionCount: 12,
    completedCount: 68,
    viewCount: 156,
    description: '本次调查旨在了解园区企业对各项服务的满意度，为进一步提升服务质量提供参考。'
  },
  {
    id: 2,
    title: '园区餐饮服务反馈调查',
    category: 'feedback',
    startTime: '2024-09-15 00:00:00',
    endTime: '2024-09-30 23:59:59',
    createTime: '2024-09-10 09:15:00',
    updateTime: '2024-09-11 11:30:00',
    createdBy: '王五',
    status: 'published',
    targetGroups: ['enterprises', 'employees', 'public'],
    questionCount: 8,
    completedCount: 124,
    viewCount: 210,
    description: '收集园区用户对餐饮服务的意见与建议，包括餐厅环境、食品质量、服务态度等方面。'
  },
  {
    id: 3,
    title: '科技创新峰会活动评价',
    category: 'event',
    startTime: '2024-09-01 00:00:00',
    endTime: '2024-09-10 23:59:59',
    createTime: '2024-08-25 15:45:00',
    updateTime: '2024-08-26 09:20:00',
    createdBy: '赵六',
    status: 'ended',
    targetGroups: ['enterprises', 'employees'],
    questionCount: 10,
    completedCount: 42,
    viewCount: 98,
    description: '针对科技创新峰会参与者的活动体验评价，包括内容安排、嘉宾分享、场地设施等。'
  },
  {
    id: 4,
    title: '园区公共设施改进需求调研（草稿）',
    category: 'needs',
    startTime: '',
    endTime: '',
    createTime: '2024-09-28 11:20:00',
    updateTime: '2024-09-28 11:20:00',
    createdBy: '李四',
    status: 'draft',
    targetGroups: ['enterprises', 'employees'],
    questionCount: 15,
    completedCount: 0,
    viewCount: 0,
    description: '调研园区企业和员工对公共设施的改进需求，包括休闲区域、健身设施、会议场所等。'
  },
  {
    id: 5,
    title: '智慧园区APP功能调研',
    category: 'needs',
    startTime: '2024-10-10 00:00:00',
    endTime: '2024-10-20 23:59:59',
    createTime: '2024-09-27 14:30:00',
    updateTime: '2024-09-27 16:45:00',
    createdBy: '王五',
    status: 'draft',
    targetGroups: ['enterprises', 'employees'],
    questionCount: 12,
    completedCount: 0,
    viewCount: 0,
    description: '了解用户对智慧园区APP的功能需求和改进建议，为产品迭代提供方向。'
  }
];

const SurveyManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCategory, setSearchCategory] = useState<string | undefined>(undefined);
  const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);
  const [searchDateRange, setSearchDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [dataSource, setDataSource] = useState<SurveyItem[]>(mockData);
  const [editVisible, setEditVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<SurveyItem | null>(null);
  const [editForm] = Form.useForm();
  const [statsVisible, setStatsVisible] = useState(false);
  const [publishVisible, setPublishVisible] = useState(false);
  const [publishForm] = Form.useForm();

  // 计算问卷完成率
  const getCompletionRate = (item: SurveyItem) => {
    if (item.viewCount === 0) return 0;
    return Math.round((item.completedCount / item.viewCount) * 100);
  };

  // 表格列定义
  const columns: ColumnsType<SurveyItem> = [
    {
      title: '问卷标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const statusInfo = STATUS_MAP[status as keyof typeof STATUS_MAP];
        
        // 如果是已发布状态，检查是否临近结束
        if (status === 'published') {
          const endDate = dayjs(record.endTime);
          const now = dayjs();
          const daysLeft = endDate.diff(now, 'day');
          
          if (daysLeft <= 3) {
            return (
              <Badge dot color="red">
                <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
              </Badge>
            );
          }
        }
        
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
      width: 100,
    },
    {
      title: '时间',
      key: 'surveyTime',
      render: (_, record) => {
        if (record.status === 'draft') {
          return <Tag color="default">未设置</Tag>;
        }
        
        const startDate = record.startTime.split(' ')[0];
        const endDate = record.endTime.split(' ')[0];
        
        return `${startDate} ~ ${endDate}`;
      },
      width: 180,
    },
    {
      title: '目标对象',
      dataIndex: 'targetGroups',
      key: 'targetGroups',
      render: groups => (
        <Space>
          {groups.includes('enterprises') && (
            <Tooltip title="企业管理员">
              <Tag color="blue">企业</Tag>
            </Tooltip>
          )}
          {groups.includes('employees') && (
            <Tooltip title="企业员工">
              <Tag color="green">员工</Tag>
            </Tooltip>
          )}
          {groups.includes('public') && (
            <Tooltip title="公众访客">
              <Tag color="orange">公众</Tag>
            </Tooltip>
          )}
        </Space>
      ),
      width: 180,
    },
    {
      title: '题目数',
      dataIndex: 'questionCount',
      key: 'questionCount',
      width: 80,
    },
    {
      title: '完成情况',
      key: 'completion',
      render: (_, record) => {
        if (record.status === 'draft') {
          return <span>-</span>;
        }
        
        const rate = getCompletionRate(record);
        return (
          <Tooltip title={`查看/完成: ${record.viewCount}/${record.completedCount}`}>
            <Progress percent={rate} size="small" />
          </Tooltip>
        );
      },
      width: 120,
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
          {record.status !== 'ended' && (
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          )}
          {record.status === 'draft' && (
            <Button 
              type="text" 
              icon={<CloudUploadOutlined />} 
              onClick={() => handlePublish(record)}
            />
          )}
          {record.status !== 'draft' && (
            <Button 
              type="text" 
              icon={<BarChartOutlined />} 
              onClick={() => handleStats(record)}
            />
          )}
          <Popconfirm
            title="确定要删除这份问卷吗？"
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
      width: 180,
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
        // 草稿状态的问卷没有开始时间
        if (item.status === 'draft') return true;
        
        const surveyStartDate = item.startTime.split(' ')[0];
        return surveyStartDate >= startDate && surveyStartDate <= endDate;
      });
    }
    
    return result;
  };

  // 查看问卷详情
  const handleView = (record: SurveyItem) => {
    message.info(`查看问卷详情：${record.title}`);
    // 实际应用中可能会导航到详情页
    // navigate(`/admin/information/survey/view/${record.id}`);
  };

  // 打开编辑弹窗
  const handleEdit = (record: SurveyItem) => {
    setCurrentItem(record);
    
    // 设置表单初始值
    editForm.setFieldsValue({
      title: record.title,
      category: record.category,
      targetGroups: record.targetGroups,
      description: record.description,
    });
    
    // 如果已经有时间设置，则加载时间
    if (record.status === 'published') {
      editForm.setFieldsValue({
        surveyTime: [
          dayjs(record.startTime),
          dayjs(record.endTime),
        ],
      });
    }
    
    setEditVisible(true);
  };

  // 提交编辑
  const handleEditFinish = (values: any) => {
    if (!currentItem) return;
    
    const { title, category, targetGroups, description, surveyTime } = values;
    
    // 更新数据
    setDataSource(prev => 
      prev.map(item => 
        item.id === currentItem.id 
          ? { 
              ...item, 
              title,
              category,
              targetGroups,
              description,
              // 如果是已发布状态，更新时间
              ...(item.status === 'published' && surveyTime && {
                startTime: surveyTime[0].format('YYYY-MM-DD HH:mm:ss'),
                endTime: surveyTime[1].format('YYYY-MM-DD HH:mm:ss'),
              }),
              updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
            } 
          : item
      )
    );
    
    message.success('编辑成功');
    setEditVisible(false);
    setCurrentItem(null);
    editForm.resetFields();
  };

  // 打开发布弹窗
  const handlePublish = (record: SurveyItem) => {
    setCurrentItem(record);
    publishForm.setFieldsValue({
      title: record.title,
    });
    setPublishVisible(true);
  };

  // 提交发布
  const handlePublishFinish = (values: any) => {
    if (!currentItem) return;
    
    const { surveyTime, targetGroups } = values;
    
    // 更新数据
    setDataSource(prev => 
      prev.map(item => 
        item.id === currentItem.id 
          ? { 
              ...item, 
              status: 'published',
              targetGroups: targetGroups || item.targetGroups,
              startTime: surveyTime[0].format('YYYY-MM-DD HH:mm:ss'),
              endTime: surveyTime[1].format('YYYY-MM-DD HH:mm:ss'),
              updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
            } 
          : item
      )
    );
    
    message.success('问卷已发布');
    setPublishVisible(false);
    setCurrentItem(null);
    publishForm.resetFields();
  };

  // 查看统计数据
  const handleStats = (record: SurveyItem) => {
    setCurrentItem(record);
    setStatsVisible(true);
  };

  // 删除问卷
  const handleDelete = (record: SurveyItem) => {
    setDataSource(prev => prev.filter(item => item.id !== record.id));
    message.success('删除成功');
  };

  // 重置过滤条件
  const resetFilters = () => {
    setSearchTitle('');
    setSearchCategory(undefined);
    setSearchStatus(undefined);
    setSearchDateRange(null);
  };

  return (
    <div className="survey-management">
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
            <Option value="published">进行中</Option>
            <Option value="ended">已结束</Option>
            <Option value="archived">已归档</Option>
          </Select>
          <RangePicker 
            value={searchDateRange}
            onChange={dates => setSearchDateRange(dates)}
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
      
      {/* 编辑弹窗 */}
      <Modal
        title="编辑问卷"
        open={editVisible}
        footer={null}
        width={700}
        onCancel={() => {
          setEditVisible(false);
          setCurrentItem(null);
          editForm.resetFields();
        }}
      >
        <Form 
          form={editForm}
          layout="vertical"
          onFinish={handleEditFinish}
        >
          <Form.Item 
            name="title" 
            label="问卷标题" 
            rules={[{ required: true, message: '请输入问卷标题' }]}
          >
            <Input placeholder="请输入问卷标题" />
          </Form.Item>
          
          <Form.Item 
            name="category" 
            label="问卷分类" 
            rules={[{ required: true, message: '请选择问卷分类' }]}
          >
            <Select placeholder="请选择问卷分类">
              {Object.entries(CATEGORY_MAP).map(([key, name]) => (
                <Option key={key} value={key}>{name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          {currentItem?.status === 'published' && (
            <Form.Item 
              name="surveyTime" 
              label="调查时间" 
              rules={[{ required: true, message: '请选择调查时间' }]}
            >
              <RangePicker 
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['开始时间', '结束时间']}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
          
          <Form.Item 
            name="targetGroups" 
            label="目标对象" 
            rules={[{ required: true, message: '请选择目标对象' }]}
          >
            <Select mode="multiple" placeholder="请选择目标对象">
              <Option value="enterprises">企业管理员</Option>
              <Option value="employees">企业员工</Option>
              <Option value="public">公众访客</Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="问卷说明" 
            rules={[{ required: true, message: '请输入问卷说明' }]}
          >
            <TextArea rows={4} placeholder="请输入问卷说明" />
          </Form.Item>
          
          <Form.Item>
            <Space style={{ float: 'right' }}>
              <Button onClick={() => {
                setEditVisible(false);
                setCurrentItem(null);
                editForm.resetFields();
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
      
      {/* 发布弹窗 */}
      <Modal
        title="发布问卷"
        open={publishVisible}
        footer={null}
        width={700}
        onCancel={() => {
          setPublishVisible(false);
          setCurrentItem(null);
          publishForm.resetFields();
        }}
      >
        <Form 
          form={publishForm}
          layout="vertical"
          onFinish={handlePublishFinish}
        >
          <Form.Item name="title" label="问卷标题">
            <Input value={currentItem?.title} disabled />
          </Form.Item>
          
          <Form.Item 
            name="surveyTime" 
            label="调查时间" 
            rules={[{ required: true, message: '请选择调查时间' }]}
          >
            <RangePicker 
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '结束时间']}
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item 
            name="targetGroups" 
            label="目标对象"
            initialValue={currentItem?.targetGroups}
            rules={[{ required: true, message: '请选择目标对象' }]}
          >
            <Select mode="multiple" placeholder="请选择目标对象">
              <Option value="enterprises">企业管理员</Option>
              <Option value="employees">企业员工</Option>
              <Option value="public">公众访客</Option>
            </Select>
          </Form.Item>
          
          <div className="warning-message" style={{ marginBottom: '20px', color: '#ff4d4f' }}>
            <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
            发布后将立即向目标用户推送问卷，请确认问卷内容已设计完毕。
          </div>
          
          <Form.Item>
            <Space style={{ float: 'right' }}>
              <Button onClick={() => {
                setPublishVisible(false);
                setCurrentItem(null);
                publishForm.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确认发布
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 统计数据弹窗 */}
      <Modal
        title="问卷统计数据"
        open={statsVisible}
        footer={[
          <Button key="close" onClick={() => setStatsVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="export" 
            type="primary" 
            onClick={() => {
              message.success('数据导出成功');
              setStatsVisible(false);
            }}
          >
            导出数据
          </Button>
        ]}
        width={800}
        onCancel={() => setStatsVisible(false)}
      >
        {currentItem && (
          <>
            <div className="survey-stats-header" style={{ marginBottom: '20px' }}>
              <h3>{currentItem.title}</h3>
              <p style={{ color: '#666' }}>
                <ClockCircleOutlined style={{ marginRight: '8px' }} />
                {currentItem.startTime} 至 {currentItem.endTime}
              </p>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="查看次数"
                    value={currentItem.viewCount}
                    prefix={<EyeOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="完成人数"
                    value={currentItem.completedCount}
                    prefix={<CheckSquareOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="完成率"
                    value={getCompletionRate(currentItem)}
                    suffix="%"
                    prefix={<FormOutlined />}
                  />
                </Card>
              </Col>
            </Row>
            
            <div className="completion-trend" style={{ marginTop: '20px' }}>
              <h4>完成情况</h4>
              <Progress 
                percent={getCompletionRate(currentItem)} 
                status={currentItem.status === 'ended' ? 'success' : 'active'} 
              />
            </div>
            
            <div className="target-distribution" style={{ marginTop: '20px' }}>
              <h4>目标人群分布</h4>
              <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                {currentItem.targetGroups.includes('enterprises') && (
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="企业管理员"
                        value={Math.round(currentItem.completedCount * 0.3)}
                        suffix={`/${Math.round(currentItem.viewCount * 0.3)}`}
                      />
                    </Card>
                  </Col>
                )}
                {currentItem.targetGroups.includes('employees') && (
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="企业员工"
                        value={Math.round(currentItem.completedCount * 0.6)}
                        suffix={`/${Math.round(currentItem.viewCount * 0.6)}`}
                      />
                    </Card>
                  </Col>
                )}
                {currentItem.targetGroups.includes('public') && (
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="公众访客"
                        value={Math.round(currentItem.completedCount * 0.1)}
                        suffix={`/${Math.round(currentItem.viewCount * 0.1)}`}
                      />
                    </Card>
                  </Col>
                )}
              </Row>
            </div>
            
            <div className="question-details" style={{ marginTop: '20px' }}>
              <h4>问题回答统计</h4>
              <p style={{ color: '#666', marginTop: '10px' }}>请点击"导出数据"查看详细的问题回答统计数据。</p>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SurveyManagement; 