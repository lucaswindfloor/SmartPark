import React, { useState, useEffect } from 'react';
import { Tabs, Button, Breadcrumb, Card, Table, Space, Tag, Input, DatePicker, Select, Radio, Tooltip, Modal, message, Checkbox, Spin } from 'antd';
import { HomeOutlined, PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, VerticalAlignTopOutlined, DownloadOutlined, FileExcelOutlined, PieChartOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from './api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

interface ModalFooterButton {
  key: string;
  text: string;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface RegistrationRecord {
  id: string;
  name: string;
  company: string;
  phone: string;
  registerTime: string;
  signStatus: 'signed' | 'unsigned';
}

/**
 * 信息公开管理模块
 * 
 * 模块概述：
 * 信息公开模块是智慧园区系统中连接园区管理方与用户的重要桥梁，提供透明、及时、全面的园区信息发布与管理功能。
 * 包含五个主要功能板块：通知公告、政策文件、园区活动、需求发布和调查问卷。
 * 
 * 用户场景：
 * 1. 园区管理方
 *    - 发布重要通知和政策文件
 *    - 管理和跟踪各类信息的阅读情况
 *    - 组织园区活动并管理报名
 *    - 收集和分析问卷调查结果
 *    - 审核企业发布的需求信息
 * 
 * 2. 企业用户
 *    - 及时了解园区通知和政策
 *    - 参与园区活动和问卷调查
 *    - 发布企业需求信息
 *    - 确认重要通知的接收情况
 * 
 * 3. 公众用户
 *    - 了解园区动态和政策
 *    - 查看公开的活动信息
 *    - 浏览企业发布的需求
 * 
 * 用户角色与权限：
 * 1. 园区管理员
 *    - 完整的信息管理权限
 *    - 审核和发布所有类型的信息
 *    - 查看统计数据和分析报告
 * 
 * 2. 信息管理员
 *    - 创建和编辑信息的权限
 *    - 管理活动报名和问卷调查
 *    - 有限的审核权限
 * 
 * 3. 企业管理员
 *    - 查看所有公开信息
 *    - 发布企业需求
 *    - 管理本企业活动报名
 * 
 * 4. 普通用户
 *    - 查看公开信息
 *    - 参与活动和问卷
 *    - 浏览需求信息
 */

interface RecordType {
  id: string;
  title: string;
  publishDate: string;
  status: string;
  auditStatus: string;
  viewCount: number;
  confirmCount?: number;
  isTop: boolean;
  visibleTo: string;
  content: string;
  createTime: string;
  needConfirm?: boolean;
  category?: string;
  demandType?: string;
  [key: string]: any;
}

interface QueryParams {
  current: number;
  pageSize: number;
  searchText: string;
  status: string;
  visibleTo: string;
  dateRange?: [string, string];
  needConfirm?: boolean;
  category?: string;
  demandType?: string;
}

interface ApiResponse {
  data: RecordType[];
  total: number;
  current: number;
  pageSize: number;
}

/**
 * 信息公开管理
 * 综合管理平台的信息公开管理主组件，包含通知公告、政策文件、园区活动、调查问卷和需求发布管理
 */
const InfoModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('notice');
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view' | 'stats' | 'registration' | 'surveyEdit' | 'surveyResults'>('create');
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [searchVisibleTo, setSearchVisibleTo] = useState<string>('');
  const [dateRange, setDateRange] = useState<any>(null);
  const [specificFilter, setSpecificFilter] = useState<string>('');
  const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
  const [confirmType, setConfirmType] = useState<'delete' | 'publish' | 'audit'>('delete');
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const [confirmCallback, setConfirmCallback] = useState<() => Promise<void>>(() => Promise.resolve());
  const [formData, setFormData] = useState<any>({});
  
  // 数据相关状态
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<RecordType[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 判断当前路径，设置活动的标签页
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes('/policy')) setActiveTab('policy');
    else if (pathname.includes('/activity')) setActiveTab('activity');
    else if (pathname.includes('/survey')) setActiveTab('survey');
    else if (pathname.includes('/demands')) setActiveTab('demands');
    else setActiveTab('notice');
    
    // 如果是根路径，默认重定向到notice
    if (location.pathname === '/admin/info/') {
      navigate('/admin/info/notice', { replace: true });
    }
  }, [location.pathname, navigate]);
  
  // 当标签页切换时，重置筛选条件并加载数据
  useEffect(() => {
    resetFilters();
    loadData();
  }, [activeTab]);
  
  // 表格数据加载
  useEffect(() => {
    loadData();
  }, [current, pageSize]);
  
  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const params: QueryParams = {
        current,
        pageSize,
        searchText,
        status: searchStatus,
        visibleTo: searchVisibleTo,
        dateRange: dateRange ? [dateRange[0], dateRange[1]] : undefined
      };
      
      // 根据不同类型添加特定筛选参数
      if (activeTab === 'notice' && specificFilter) {
        params.needConfirm = specificFilter === 'needConfirm';
      } else if (activeTab === 'policy' && specificFilter) {
        params.category = specificFilter;
      } else if (activeTab === 'demands' && specificFilter) {
        params.demandType = specificFilter;
      }
      
      const res = await api.getList(activeTab, params) as ApiResponse;
      setDataSource(res.data);
      setTotal(res.total);
      setCurrent(res.current);
      setPageSize(res.pageSize);
    } catch (error) {
      message.error('加载数据失败，请重试');
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 重置筛选条件
  const resetFilters = () => {
    setSearchText('');
    setSearchStatus('');
    setSearchVisibleTo('');
    setDateRange(null);
    setSpecificFilter('');
    setCurrent(1);
  };
  
  // 处理搜索
  const handleSearch = () => {
    setCurrent(1);
    loadData();
  };
  
  // 处理重置
  const handleReset = () => {
    resetFilters();
    loadData();
  };

  // 标签页切换时导航到对应路由
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`/admin/info/${key}`);
  };

  // 处理表单数据变更
  const handleFormChange = (field: string, value: unknown) => {
    setFormData((prev: Record<string, unknown>) => ({
      ...prev,
      [field]: value
    }));
  };
  
  // 处理创建新记录
  const handleCreate = () => {
    // 初始化表单数据
    const initialData: any = {
      title: '',
      content: '',
      visibleTo: '全部用户',
    };
    
    // 根据不同类型设置特定初始值
    if (activeTab === 'notice') {
      initialData.needConfirm = false;
    } else if (activeTab === 'policy') {
      initialData.category = '财税政策';
      initialData.implementDate = null;
    } else if (activeTab === 'activity') {
      initialData.registerStartDate = null;
      initialData.registerEndDate = null;
      initialData.startDate = null;
      initialData.endDate = null;
      initialData.location = '';
    } else if (activeTab === 'survey') {
      initialData.startDate = null;
      initialData.endDate = null;
      initialData.questions = [];
    } else if (activeTab === 'demands') {
      initialData.demandType = '项目合作';
      initialData.company = '';
      initialData.contact = '';
      initialData.phone = '';
    }
    
    setFormData(initialData);
    setModalType('create');
    setVisibleModal(true);
  };
  
  // 处理编辑记录
  const handleEdit = (record: any) => {
    setFormData({...record});
    setCurrentRecord(record);
    setModalType('edit');
    setVisibleModal(true);
  };
  
  // 处理查看记录
  const handleView = (record: any) => {
    setCurrentRecord(record);
    setModalType('view');
    setVisibleModal(true);
  };
  
  // 处理保存表单
  const handleSaveForm = async () => {
    try {
      // 验证表单数据
      if (!formData.title || !formData.content) {
        message.error('请填写标题和内容');
        return;
      }
      
      // 根据不同模态框类型处理数据
      if (modalType === 'create') {
        await api.create(activeTab, formData);
        message.success('创建成功');
      } else if (modalType === 'edit') {
        await api.update(activeTab, formData.id, formData);
        message.success('更新成功');
      }
      
      // 关闭模态框并重新加载数据
      setVisibleModal(false);
      loadData();
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };
  
  // 处理删除记录
  const handleDelete = (record: any) => {
    setCurrentRecord(record);
    setConfirmType('delete');
    setConfirmMessage(`确定要删除"${record.title}"吗？删除后将无法恢复。`);
    setConfirmCallback(async () => {
      try {
        await api.delete(activeTab, record.id);
        message.success('删除成功');
        setVisibleConfirm(false);
        loadData();
      } catch (error) {
        message.error('删除失败，请重试');
      }
    });
    setVisibleConfirm(true);
  };
  
  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一条记录');
      return;
    }
    
    setConfirmType('delete');
    setConfirmMessage(`确定要删除选中的${selectedRowKeys.length}条记录吗？删除后将无法恢复。`);
    setConfirmCallback(async () => {
      try {
        await api.batchDelete(activeTab, selectedRowKeys as string[]);
        message.success('批量删除成功');
        setVisibleConfirm(false);
        setSelectedRowKeys([]);
        loadData();
      } catch (error) {
        message.error('操作失败，请重试');
      }
    });
    setVisibleConfirm(true);
  };
  
  // 处理发布/取消发布
  const handlePublish = (record: any, publish: boolean) => {
    setCurrentRecord(record);
    setConfirmType('publish');
    setConfirmMessage(`确定要${publish ? '发布' : '取消发布'}"${record.title}"吗？`);
    setConfirmCallback(async () => {
      try {
        await api.publish(activeTab, record.id, publish);
        message.success(`${publish ? '发布' : '取消发布'}成功`);
        setVisibleConfirm(false);
        loadData();
      } catch (error) {
        message.error('操作失败，请重试');
      }
    });
    setVisibleConfirm(true);
  };
  
  // 处理批量发布
  const handleBatchPublish = (publish: boolean) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一条记录');
      return;
    }
    
    setConfirmType('publish');
    setConfirmMessage(`确定要${publish ? '发布' : '取消发布'}选中的${selectedRowKeys.length}条记录吗？`);
    setConfirmCallback(async () => {
      try {
        await api.batchPublish(activeTab, selectedRowKeys as string[], publish);
        message.success(`批量${publish ? '发布' : '取消发布'}成功`);
        setVisibleConfirm(false);
        setSelectedRowKeys([]);
        loadData();
      } catch (error) {
        message.error('操作失败，请重试');
      }
    });
    setVisibleConfirm(true);
  };
  
  // 处理审核/驳回
  const handleAudit = (record: any, approve: boolean) => {
    setCurrentRecord(record);
    setConfirmType('audit');
    setConfirmMessage(`确定要${approve ? '通过' : '驳回'}"${record.title}"的审核吗？`);
    setConfirmCallback(async () => {
      try {
        await api.audit(activeTab, record.id, approve ? 'approved' : 'rejected');
        message.success(`审核${approve ? '通过' : '驳回'}成功`);
        setVisibleConfirm(false);
        loadData();
      } catch (error) {
        message.error('操作失败，请重试');
      }
    });
    setVisibleConfirm(true);
  };
  
  // 处理批量审核/驳回
  const handleBatchAudit = (approve: boolean) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一条记录');
      return;
    }
    
    setConfirmType('audit');
    setConfirmMessage(`确定要${approve ? '通过' : '驳回'}选中的${selectedRowKeys.length}条记录的审核吗？`);
    setConfirmCallback(async () => {
      try {
        await api.batchAudit(activeTab, selectedRowKeys as string[], approve ? 'approved' : 'rejected');
        message.success(`批量审核${approve ? '通过' : '驳回'}成功`);
        setVisibleConfirm(false);
        setSelectedRowKeys([]);
        loadData();
      } catch (error) {
        message.error('操作失败，请重试');
      }
    });
    setVisibleConfirm(true);
  };
  
  // 处理置顶/取消置顶
  const handleToggleTop = async (record: any) => {
    try {
      await api.setTop(activeTab, record.id, !record.isTop);
      message.success(`${record.isTop ? '取消置顶' : '置顶'}成功`);
      loadData();
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };
  
  // 查看统计信息
  const handleViewStats = (record: any) => {
    setCurrentRecord(record);
    setModalType('stats');
    setVisibleModal(true);
  };
  
  // 查看活动报名情况
  const handleViewRegistration = (record: any) => {
    setCurrentRecord(record);
    setModalType('registration');
    setVisibleModal(true);
  };
  
  // 查看问卷设计
  const handleViewSurveyDesign = (record: any) => {
    setFormData({...record});
    setCurrentRecord(record);
    setModalType('surveyEdit');
    setVisibleModal(true);
  };
  
  // 查看问卷结果
  const handleViewSurveyResults = (record: any) => {
    setCurrentRecord(record);
    setModalType('surveyResults');
    setVisibleModal(true);
  };
  
  // 处理导出数据
  const handleExport = () => {
    if (!currentRecord) {
      message.warning('请先选择一条记录');
      return;
    }
    
    try {
      if (activeTab === 'activity') {
        api.exportRegistrations(currentRecord.id);
        message.success('报名信息导出成功');
      } else if (activeTab === 'survey') {
        api.exportSurveyData(currentRecord.id);
        message.success('问卷回复导出成功');
      }
    } catch (error) {
      message.error('导出失败，请重试');
    }
  };
  
  // 处理确认操作
  const handleConfirmAction = () => {
    if (confirmCallback) {
      confirmCallback();
    }
  };
  
  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    }
  };

  // 获取当前标签页的中文名称
  const getTabName = () => {
    switch (activeTab) {
      case 'notice': return '通知公告';
      case 'policy': return '政策文件';
      case 'activity': return '园区活动';
      case 'survey': return '调查问卷';
      case 'demands': return '需求发布';
      default: return '通知公告';
    }
  };
  
  // 渲染面包屑导航
  const renderBreadcrumb = () => (
    <Breadcrumb style={{ marginBottom: '16px' }}>
      <Breadcrumb.Item>
        <Link to="/admin">
          <HomeOutlined />
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>服务管理</Breadcrumb.Item>
      <Breadcrumb.Item>信息公开</Breadcrumb.Item>
      <Breadcrumb.Item>{getTabName()}</Breadcrumb.Item>
    </Breadcrumb>
  );

  // 获取当前标签页的表格列
  const getColumns = () => {
    const commonColumns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        ellipsis: true,
        render: (text: string, record: RecordType) => (
          <div>
            {record.isTop && <Tag color="red" style={{marginRight: 5}}>置顶</Tag>}
            <a onClick={() => handleView(record)}>{text}</a>
          </div>
        )
      },
      {
        title: '发布日期',
        dataIndex: 'publishDate',
        key: 'publishDate',
        width: 120,
      },
      {
        title: '公开范围',
        dataIndex: 'visibleTo',
        key: 'visibleTo',
        width: 100,
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        width: 100,
        render: (status: string) => {
          let color = 'blue';
          if (status === '待审核') color = 'orange';
          else if (status === '已通过') color = 'green';
          else if (status === '已拒绝') color = 'red';
          
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: '发布状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: string) => {
          let color = 'default';
          if (status === '已发布') color = 'green';
          else if (status === '草稿') color = 'orange';
          else if (status === '待审核') color = 'blue';
          
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: '浏览量',
        dataIndex: 'viewCount',
        key: 'viewCount',
        width: 80,
      },
      {
        title: '操作',
        key: 'action',
        width: 260,
        render: (_: any, record: RecordType) => (
          <Space size="small" wrap>
            <Tooltip title="查看">
              <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} />
            </Tooltip>
            <Tooltip title="编辑">
              <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
            </Tooltip>
            <Tooltip title="删除">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
            </Tooltip>
            {record.auditStatus === '待审核' && (
              <>
                <Tooltip title="审核通过">
                  <Button type="text" size="small" icon={<CheckCircleOutlined style={{color: 'green'}} />} 
                    onClick={() => handleAudit(record, true)} />
                </Tooltip>
                <Tooltip title="审核拒绝">
                  <Button type="text" size="small" icon={<CloseCircleOutlined style={{color: 'red'}} />} 
                    onClick={() => handleAudit(record, false)} />
                </Tooltip>
              </>
            )}
            <Tooltip title={record.isTop ? "取消置顶" : "置顶"}>
              <Button type="text" size="small" icon={<VerticalAlignTopOutlined />} 
                onClick={() => handleToggleTop(record)} />
            </Tooltip>
            {record.status !== '已发布' && record.auditStatus === '已通过' && (
              <Tooltip title="发布">
                <Button type="text" size="small" icon={<CheckCircleOutlined />} 
                  onClick={() => handlePublish(record, true)} />
              </Tooltip>
            )}
            {record.status === '已发布' && (
              <Tooltip title="下架">
                <Button type="text" size="small" icon={<CloseCircleOutlined />} 
                  onClick={() => handlePublish(record, false)} />
              </Tooltip>
            )}
            <Tooltip title="统计">
              <Button type="text" size="small" icon={<PieChartOutlined />} 
                onClick={() => handleViewStats(record)} />
            </Tooltip>
            {activeTab === 'activity' && (
              <Tooltip title="管理报名">
                <Button type="text" size="small" icon={<TeamOutlined />} 
                  onClick={() => handleViewRegistration(record)} />
              </Tooltip>
            )}
            {activeTab === 'survey' && record.hasResult && (
              <Tooltip title="查看问卷结果">
                <Button type="text" size="small" icon={<BarChartOutlined />} 
                  onClick={() => handleViewSurveyResults(record)} />
              </Tooltip>
            )}
          </Space>
        ),
      },
    ];

    // 根据不同标签页添加特定列
    switch (activeTab) {
      case 'notice':
        return [
          ...commonColumns.slice(0, 5),
          {
            title: '浏览量/确认量',
            key: 'stats',
            width: 120,
            render: (_: any, record: RecordType) => (
              <div>{record.viewCount} / {record.confirmCount}</div>
            )
          },
          {
            title: '需要确认',
            dataIndex: 'needConfirm',
            key: 'needConfirm',
            width: 100,
            render: (needConfirm: boolean) => (
              needConfirm ? <Tag color="green">是</Tag> : <Tag color="default">否</Tag>
            )
          },
          commonColumns[commonColumns.length - 1]
        ];
      case 'policy':
        return [
          ...commonColumns.slice(0, 2),
          {
            title: '政策分类',
            dataIndex: 'category',
            key: 'category',
            width: 100,
          },
          {
            title: '实施时间',
            dataIndex: 'implementDate',
            key: 'implementDate',
            width: 120,
          },
          ...commonColumns.slice(2)
        ];
      case 'activity':
        return [
          ...commonColumns.slice(0, 2),
          {
            title: '报名时间',
            key: 'registerTime',
            width: 200,
            render: (_: any, record: RecordType) => (
              <div>{record.registerStartDate} 至 {record.registerEndDate}</div>
            )
          },
          {
            title: '活动时间',
            key: 'activityTime',
            width: 200,
            render: (_: any, record: RecordType) => (
              <div>{record.startDate} 至 {record.endDate}</div>
            )
          },
          {
            title: '活动地点',
            dataIndex: 'location',
            key: 'location',
            width: 150,
          },
          {
            title: '浏览/报名',
            key: 'stats',
            width: 100,
            render: (_: any, record: RecordType) => (
              <div>{record.viewCount} / {record.registerCount}</div>
            )
          },
          ...commonColumns.slice(4)
        ];
      case 'survey':
        return [
          ...commonColumns.slice(0, 2),
          {
            title: '问卷时间',
            key: 'surveyTime',
            width: 200,
            render: (_: any, record: RecordType) => (
              <div>{record.startDate} 至 {record.endDate}</div>
            )
          },
          {
            title: '浏览/回复',
            key: 'stats',
            width: 100,
            render: (_: any, record: RecordType) => (
              <div>{record.viewCount} / {record.responses}</div>
            )
          },
          {
            title: '有统计结果',
            dataIndex: 'hasResult',
            key: 'hasResult',
            width: 100,
            render: (hasResult: boolean) => (
              hasResult ? <Tag color="green">是</Tag> : <Tag color="default">否</Tag>
            )
          },
          ...commonColumns.slice(4)
        ];
      case 'demands':
        return [
          ...commonColumns.slice(0, 2),
          {
            title: '需求类型',
            dataIndex: 'demandType',
            key: 'demandType',
            width: 100,
          },
          {
            title: '发布企业',
            dataIndex: 'company',
            key: 'company',
            width: 150,
          },
          {
            title: '联系人',
            dataIndex: 'contact',
            key: 'contact',
            width: 100,
          },
          {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
            width: 120,
          },
          ...commonColumns.slice(4)
        ];
      default:
        return commonColumns;
    }
  };

  // 渲染搜索工具栏
  const renderToolbar = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Input 
          placeholder={`搜索${getTabName()}标题`} 
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
        />
        
        {activeTab === 'notice' && (
          <Select 
            value={specificFilter} 
            onChange={value => setSpecificFilter(value)} 
            style={{ width: 130 }}
          >
            <Option value="">全部通知</Option>
            <Option value="needConfirm">需要确认</Option>
            <Option value="noConfirm">不需确认</Option>
          </Select>
        )}
        
        {activeTab === 'policy' && (
          <Select 
            value={specificFilter} 
            onChange={value => setSpecificFilter(value)} 
            style={{ width: 130 }}
          >
            <Option value="">全部类别</Option>
            <Option value="财税政策">财税政策</Option>
            <Option value="产业政策">产业政策</Option>
            <Option value="人才政策">人才政策</Option>
          </Select>
        )}
        
        {activeTab === 'demands' && (
          <Select 
            value={specificFilter} 
            onChange={value => setSpecificFilter(value)} 
            style={{ width: 130 }}
          >
            <Option value="">全部类型</Option>
            <Option value="项目合作">项目合作</Option>
            <Option value="成果展示">成果展示</Option>
            <Option value="招聘需求">招聘需求</Option>
          </Select>
        )}
        
        <Select 
          value={searchStatus} 
          onChange={value => setSearchStatus(value)} 
          style={{ width: 130 }}
        >
          <Option value="">全部状态</Option>
          <Option value="已发布">已发布</Option>
          <Option value="草稿">草稿</Option>
          <Option value="待审核">待审核</Option>
        </Select>
        
        <Select 
          value={searchVisibleTo} 
          onChange={value => setSearchVisibleTo(value)} 
          style={{ width: 130 }}
        >
          <Option value="">全部范围</Option>
          <Option value="全部用户">全部用户</Option>
          <Option value="入驻企业">入驻企业</Option>
          <Option value="特定企业">特定企业</Option>
        </Select>
        
        <RangePicker 
          value={dateRange} 
          onChange={value => setDateRange(value)} 
          placeholder={['开始日期', '结束日期']} 
        />
        
        <Button icon={<SearchOutlined />} onClick={handleSearch}>搜索</Button>
        <Button onClick={handleReset}>重置</Button>
      </div>
      
      <Space>
        {activeTab === 'activity' && currentRecord && (
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出报名信息</Button>
        )}
        {activeTab === 'survey' && currentRecord && (
          <Button icon={<FileExcelOutlined />} onClick={handleExport}>导出问卷回复</Button>
        )}
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          新建{getTabName()}
        </Button>
      </Space>
    </div>
  );

  // 渲染创建/编辑模态框
  const renderModal = () => {
    // 根据不同的模态窗口类型渲染不同内容
    let modalContent;
    let modalTitle;
    let modalWidth = 700;
    let modalFooter = [];
    
    if (modalType === 'create' || modalType === 'edit') {
      modalTitle = modalType === 'create' ? `新建${getTabName()}` : `编辑${getTabName()}`;
      
      // 通用表单内容
      const commonFormContent = (
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>标题：</label>
            <Input 
              placeholder="请输入标题" 
              style={{ width: '100%' }} 
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>内容：</label>
            <Input.TextArea 
              placeholder="请输入内容" 
              rows={5} 
              style={{ width: '100%' }} 
              value={formData.content}
              onChange={(e) => handleFormChange('content', e.target.value)}
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>公开范围：</label>
            <Select 
              style={{ width: '100%' }} 
              value={formData.visibleTo}
              onChange={(value) => handleFormChange('visibleTo', value)}
            >
              <Option value="全部用户">全部用户</Option>
              <Option value="入驻企业">入驻企业</Option>
              <Option value="特定企业">特定企业</Option>
              <Option value="管理员">仅管理员</Option>
            </Select>
          </div>
        </>
      );
      
      // 根据不同类型添加特定字段
      if (activeTab === 'notice') {
        modalContent = (
          <div>
            {commonFormContent}
            <div style={{ marginBottom: 16 }}>
              <Checkbox 
                checked={formData.needConfirm}
                onChange={(e) => handleFormChange('needConfirm', e.target.checked)}
              >
                需要确认接收
              </Checkbox>
            </div>
          </div>
        );
      } else if (activeTab === 'policy') {
        modalContent = (
          <div>
            {commonFormContent}
            <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>政策分类：</label>
                <Select 
                  style={{ width: '100%' }} 
                  value={formData.category}
                  onChange={(value) => handleFormChange('category', value)}
                >
                  <Option value="财税政策">财税政策</Option>
                  <Option value="产业政策">产业政策</Option>
                  <Option value="人才政策">人才政策</Option>
                </Select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>实施时间：</label>
                <DatePicker 
                  style={{ width: '100%' }} 
                  value={formData.implementDate ? (typeof formData.implementDate === 'string' ? dayjs(formData.implementDate) : formData.implementDate) : null}
                  onChange={(date) => handleFormChange('implementDate', date)}
                />
              </div>
            </div>
          </div>
        );
      } else if (activeTab === 'activity') {
        modalContent = (
          <div>
            {commonFormContent}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>报名时间：</label>
              <RangePicker 
                style={{ width: '100%' }} 
                value={[
                  formData.registerStartDate ? (typeof formData.registerStartDate === 'string' ? dayjs(formData.registerStartDate) : formData.registerStartDate) : null,
                  formData.registerEndDate ? (typeof formData.registerEndDate === 'string' ? dayjs(formData.registerEndDate) : formData.registerEndDate) : null
                ]}
                onChange={(dates) => {
                  if (dates) {
                    handleFormChange('registerStartDate', dates[0]);
                    handleFormChange('registerEndDate', dates[1]);
                  } else {
                    handleFormChange('registerStartDate', null);
                    handleFormChange('registerEndDate', null);
                  }
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>活动时间：</label>
              <RangePicker 
                style={{ width: '100%' }} 
                value={[
                  formData.startDate ? (typeof formData.startDate === 'string' ? dayjs(formData.startDate) : formData.startDate) : null,
                  formData.endDate ? (typeof formData.endDate === 'string' ? dayjs(formData.endDate) : formData.endDate) : null
                ]}
                onChange={(dates) => {
                  if (dates) {
                    handleFormChange('startDate', dates[0]);
                    handleFormChange('endDate', dates[1]);
                  } else {
                    handleFormChange('startDate', null);
                    handleFormChange('endDate', null);
                  }
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>活动地点：</label>
              <Input 
                placeholder="请输入活动地点" 
                style={{ width: '100%' }} 
                value={formData.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
              />
            </div>
          </div>
        );
      } else if (activeTab === 'demands') {
        modalContent = (
          <div>
            {commonFormContent}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>需求类型：</label>
              <Select 
                style={{ width: '100%' }} 
                value={formData.demandType}
                onChange={(value) => handleFormChange('demandType', value)}
              >
                <Option value="项目合作">项目合作</Option>
                <Option value="成果展示">成果展示</Option>
                <Option value="招聘需求">招聘需求</Option>
              </Select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>发布企业：</label>
              <Input 
                placeholder="请输入发布企业" 
                style={{ width: '100%' }} 
                value={formData.company}
                onChange={(e) => handleFormChange('company', e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>联系人：</label>
                <Input 
                  placeholder="请输入联系人" 
                  style={{ width: '100%' }} 
                  value={formData.contact}
                  onChange={(e) => handleFormChange('contact', e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>联系电话：</label>
                <Input 
                  placeholder="请输入联系电话" 
                  style={{ width: '100%' }} 
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      } else if (activeTab === 'survey') {
        // 表单内容将在surveyEdit模态框类型中处理
        modalContent = (
          <div>
            {commonFormContent}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>问卷时间：</label>
              <RangePicker 
                style={{ width: '100%' }} 
                value={[
                  formData.startDate ? (typeof formData.startDate === 'string' ? dayjs(formData.startDate) : formData.startDate) : null,
                  formData.endDate ? (typeof formData.endDate === 'string' ? dayjs(formData.endDate) : formData.endDate) : null
                ]}
                onChange={(dates) => {
                  if (dates) {
                    handleFormChange('startDate', dates[0]);
                    handleFormChange('endDate', dates[1]);
                  } else {
                    handleFormChange('startDate', null);
                    handleFormChange('endDate', null);
                  }
                }}
              />
            </div>
            <div style={{ margin: '16px 0' }}>
              <Button onClick={() => {
                setModalType('surveyEdit');
              }}>进入问卷设计</Button>
            </div>
          </div>
        );
      }
      
      modalFooter = [
        <Button key="cancel" onClick={() => setVisibleModal(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSaveForm}>
          保存
        </Button>
      ];
    } else if (modalType === 'view') {
      modalTitle = `查看${getTabName()}`;
      
      modalContent = currentRecord ? (
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: 20 }}>{currentRecord.title}</h2>
          <div style={{ marginBottom: 20, textAlign: 'center', color: '#888' }}>
            <span>发布日期：{currentRecord.publishDate}</span>
            <span style={{ marginLeft: 20 }}>浏览量：{currentRecord.viewCount}</span>
          </div>
          <div style={{ border: '1px solid #f0f0f0', padding: 20, margin: '20px 0', borderRadius: 4 }}>
            {currentRecord.content}
          </div>
          
          {activeTab === 'policy' && (
            <div style={{ marginTop: 20 }}>
              <p><strong>政策分类：</strong>{currentRecord.category}</p>
              <p><strong>实施时间：</strong>{currentRecord.implementDate}</p>
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div style={{ marginTop: 20 }}>
              <p><strong>报名时间：</strong>{currentRecord.registerStartDate} 至 {currentRecord.registerEndDate}</p>
              <p><strong>活动时间：</strong>{currentRecord.startDate} 至 {currentRecord.endDate}</p>
              <p><strong>活动地点：</strong>{currentRecord.location}</p>
              <p><strong>报名人数：</strong>{currentRecord.registerCount || 0}</p>
            </div>
          )}
          
          {activeTab === 'demands' && (
            <div style={{ marginTop: 20 }}>
              <p><strong>需求类型：</strong>{currentRecord.demandType}</p>
              <p><strong>发布企业：</strong>{currentRecord.company}</p>
              <p><strong>联系人：</strong>{currentRecord.contact}</p>
              <p><strong>联系电话：</strong>{currentRecord.phone}</p>
            </div>
          )}
        </div>
      ) : (
        <Spin tip="加载中..."></Spin>
      );
      
      modalFooter = [
        <Button key="close" onClick={() => setVisibleModal(false)}>
          关闭
        </Button>
      ];
    } else if (modalType === 'stats') {
      modalTitle = `${getTabName()}统计信息`;
      modalContent = currentRecord ? (
        <div style={{textAlign: 'center'}}>
          <h3>{currentRecord.title}</h3>
          <div style={{margin: '20px 0'}}>
            {activeTab === 'notice' && (
              <div>
                <p>总浏览量：{currentRecord.viewCount}</p>
                <p>确认接收量：{currentRecord.confirmCount}</p>
                <p>确认率：{currentRecord.viewCount ? Math.round(currentRecord.confirmCount / currentRecord.viewCount * 100) : 0}%</p>
              </div>
            )}
            {activeTab === 'policy' && (
              <div>
                <p>总浏览量：{currentRecord.viewCount}</p>
                <p>政策分类：{currentRecord.category}</p>
                <p>实施时间：{currentRecord.implementDate}</p>
              </div>
            )}
            {activeTab === 'activity' && (
              <div>
                <p>总浏览量：{currentRecord.viewCount}</p>
                <p>报名人数：{currentRecord.registerCount}</p>
                <p>报名率：{currentRecord.viewCount ? Math.round(currentRecord.registerCount / currentRecord.viewCount * 100) : 0}%</p>
              </div>
            )}
            {activeTab === 'survey' && (
              <div>
                <p>总浏览量：{currentRecord.viewCount}</p>
                <p>回复人数：{currentRecord.responses}</p>
                <p>回复率：{currentRecord.viewCount ? Math.round(currentRecord.responses / currentRecord.viewCount * 100) : 0}%</p>
              </div>
            )}
            {activeTab === 'demands' && (
              <div>
                <p>总浏览量：{currentRecord.viewCount}</p>
                <p>需求类型：{currentRecord.demandType}</p>
                <p>发布企业：{currentRecord.company}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Spin tip="加载中..."></Spin>
      );
      modalFooter = [
        <Button key="close" onClick={() => setVisibleModal(false)}>
          关闭
        </Button>
      ];
    } else if (modalType === 'registration') {
      modalTitle = '活动报名管理';
      modalWidth = 800;
      modalContent = currentRecord ? (
        <div>
          <Tabs defaultActiveKey="1" items={[
            {
              key: '1',
              label: '报名列表',
              children: (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Input placeholder="搜索报名人员" prefix={<SearchOutlined />} style={{ width: 200 }} />
                      <Select defaultValue="" style={{ width: 150 }}>
                        <Option value="">全部企业</Option>
                        <Option value="company1">A企业</Option>
                        <Option value="company2">B企业</Option>
                        <Option value="company3">C企业</Option>
                      </Select>
                      <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleExport()}>导出报名表</Button>
                    </Space>
                  </div>
                  <Table
                    columns={[
                      { title: '姓名', dataIndex: 'name', key: 'name' },
                      { title: '企业', dataIndex: 'company', key: 'company' },
                      { title: '手机号', dataIndex: 'phone', key: 'phone' },
                      { title: '报名时间', dataIndex: 'registerTime', key: 'registerTime' },
                      { title: '签到状态', dataIndex: 'signStatus', key: 'signStatus', 
                        render: (status) => (
                          <Tag color={status === '已签到' ? 'green' : 'orange'}>{status}</Tag>
                        ) 
                      },
                      { title: '操作', key: 'action', 
                        render: (_, record) => (
                          <Space>
                            <Button 
                              type="link" 
                              size="small"
                              onClick={async () => {
                                try {
                                  await api.updateSignStatus(
                                    currentRecord.id, 
                                    record.id, 
                                    record.signStatus === '已签到' ? '未签到' : '已签到'
                                  );
                                  message.success('更新签到状态成功');
                                  loadData();
                                } catch (error) {
                                  message.error('操作失败，请重试');
                                }
                              }}
                            >
                              {record.signStatus === '已签到' ? '取消签到' : '标记签到'}
                            </Button>
                          </Space>
                        ) 
                      }
                    ]}
                    dataSource={currentRecord.registrations || []}
                    pagination={{ pageSize: 5 }}
                    rowKey="id"
                  />
                </>
              )
            },
            {
              key: '2',
              label: '报名统计',
              children: (
                <div>
                  <div style={{ margin: '20px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, marginBottom: 15 }}>
                      <span style={{ marginRight: 30 }}>总报名人数：<b>{currentRecord.registerCount || 0}</b></span>
                      <span style={{ marginRight: 30 }}>已签到人数：<b>{currentRecord.registrations ? currentRecord.registrations.filter(r => r.signStatus === '已签到').length : 0}</b></span>
                      <span>签到率：<b>{currentRecord.registerCount ? Math.round(currentRecord.registrations.filter(r => r.signStatus === '已签到').length / currentRecord.registerCount * 100) : 0}%</b></span>
                    </div>
                  </div>
                </div>
              )
            },
            {
              key: '3',
              label: '短信通知',
              children: (
                <div style={{ margin: '20px 0' }}>
                  <Radio.Group defaultValue="all" style={{ marginBottom: 20 }} onChange={(e) => handleFormChange('notifyTarget', e.target.value)}>
                    <Radio value="all">所有报名人员</Radio>
                    <Radio value="unsigned">未签到人员</Radio>
                    <Radio value="signed">已签到人员</Radio>
                    <Radio value="custom">自定义选择</Radio>
                  </Radio.Group>
                  <Input.TextArea 
                    placeholder="请输入通知内容" 
                    rows={5}
                    maxLength={300}
                    style={{ marginBottom: 15 }}
                    value={formData.notifyContent}
                    onChange={(e) => handleFormChange('notifyContent', e.target.value)}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Button 
                      type="primary"
                      onClick={async () => {
                        try {
                          const result = await api.sendActivityNotification(
                            currentRecord.id,
                            formData.notifyContent,
                            formData.notifyTarget || 'all'
                          );
                          message.success(result.message);
                        } catch (error) {
                          message.error('发送失败，请重试');
                        }
                      }}
                    >
                      发送通知
                    </Button>
                  </div>
                </div>
              )
            }
          ]} />
        </div>
      ) : (
        <Spin tip="加载中..."></Spin>
      );
      modalFooter = [
        <Button key="close" onClick={() => setVisibleModal(false)}>
          关闭
        </Button>
      ];
    } else if (modalType === 'surveyEdit' || modalType === 'surveyResults') {
      // 这两个复杂模态框保持原有实现，因为代码量较大
      if (modalType === 'surveyEdit') {
        modalTitle = '问卷设计';
        modalWidth = 800;
      } else {
        modalTitle = '问卷结果统计';
        modalWidth = 800;
      }
    }
    
    return (
      <Modal
        title={modalTitle}
        open={visibleModal}
        onCancel={() => setVisibleModal(false)}
        footer={modalFooter}
        width={modalWidth}
      >
        {modalContent}
      </Modal>
    );
  };

  // 分页变化处理函数
  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // 批量操作渲染
  const renderBatchActions = () => {
    if (selectedRowKeys.length === 0) return null;
    
    return (
      <div style={{ marginBottom: 16 }}>
        <Space>
          <span>已选择 {selectedRowKeys.length} 项</span>
          <Button size="small" onClick={() => setSelectedRowKeys([])}>
            取消选择
          </Button>
          <Button size="small" type="primary" danger onClick={handleBatchDelete}>
            批量删除
          </Button>
          <Button size="small" type="primary" onClick={() => handleBatchAudit(true)}>
            批量审核通过
          </Button>
          <Button size="small" type="primary" onClick={() => handleBatchAudit(false)}>
            批量审核拒绝
          </Button>
          <Button size="small" onClick={() => handleBatchPublish(true)}>
            批量发布
          </Button>
          <Button size="small" onClick={() => handleBatchPublish(false)}>
            批量取消发布
          </Button>
        </Space>
      </div>
    );
  };

  // 渲染主视图
  return (
    <div className="info-management-container" style={{ padding: '20px' }}>
      {renderBreadcrumb()}
      
      <Card bodyStyle={{ padding: '24px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          items={[
            {
              key: 'notice',
              label: '通知公告'
            },
            {
              key: 'policy',
              label: '政策文件'
            },
            {
              key: 'activity',
              label: '园区活动'
            },
            {
              key: 'survey',
              label: '调查问卷'
            },
            {
              key: 'demands',
              label: '需求发布'
            }
          ]}
          className="info-tabs"
        />
        
        {renderToolbar()}
        
        {renderBatchActions()}
        
        <Table 
          rowSelection={rowSelection}
          columns={getColumns()}
          dataSource={dataSource}
          pagination={{ 
            pageSize: pageSize,
            total: total,
            current: current,
            onChange: handleTableChange
          }}
        />
      </Card>
      
      {renderModal()}
      
      {/* 确认对话框 */}
      <Modal
        title="确认操作"
        open={visibleConfirm}
        onCancel={() => setVisibleConfirm(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisibleConfirm(false)}>取消</Button>,
          <Button 
            key="confirm" 
            type="primary" 
            danger={confirmType === 'delete'} 
            onClick={handleConfirmAction}
          >
            确认
          </Button>
        ]}
      >
        <p>{confirmMessage}</p>
      </Modal>
      
      {/* 添加自定义样式 */}
      <style>
        {`
          .info-tabs .ant-tabs-tab.ant-tabs-tab-active {
            background-color: #e6f7ff;
            border-color: #1890ff;
            border-bottom: 1px solid #e6f7ff;
            z-index: 2;
          }
          .info-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #1890ff !important;
            font-weight: 500;
          }
          .info-tabs .ant-tabs-tab {
            background-color: #f5f5f5;
            border: 1px solid #d9d9d9;
            border-bottom: none;
            border-radius: 4px 4px 0 0;
            margin-right: 2px;
            padding: 8px 16px;
          }
          .info-tabs .ant-tabs-tab .ant-tabs-tab-btn {
            color: #333;
            font-weight: 400;
          }
          .info-tabs .ant-tabs-nav-list {
            border-bottom: 1px solid #d9d9d9;
          }
          .info-tabs .ant-tabs-nav::before {
            border-bottom: 1px solid #d9d9d9;
          }
        `}
      </style>
    </div>
  );
};

export default InfoModule; 