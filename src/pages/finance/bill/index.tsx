import React, { useState } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  DatePicker,
  Space,
  Select,
  Row,
  Col,
  Tabs,
  Tag,
  Typography,
  Tooltip,
  message,
  Modal
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './index.less';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// 定义账单数据接口
interface BillRecord {
  key: string;
  billNo: string;
  enterpriseName: string;
  feeSubject: string;
  orderNo: string;
  feeDesc: string;
  billPeriod: string;
  billAmount: number;
  discountAmount: number | null;
  coupon: string | null;
  adjustAmount: number | null;
  adjustReason: string | null;
  receivableAmount: number;
  receivedAmount: number;
  remainAmount: number;
  status: string;
}

// 模拟账单数据
const mockData: BillRecord[] = [
  {
    key: '1',
    billNo: 'ZD240303001507',
    enterpriseName: '丹娜生物',
    feeSubject: '租金',
    orderNo: '1234合同编号',
    feeDesc: '--',
    billPeriod: '2024年10月1日-2024年12月31日',
    billAmount: 30000.00,
    discountAmount: null,
    coupon: null,
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: 0,
    receivedAmount: 0,
    remainAmount: 0,
    status: 'unreviewed'
  },
  {
    key: '2',
    billNo: 'ZD240303001506',
    enterpriseName: '德康茶叶',
    feeSubject: '物业费',
    orderNo: '1234合同编号',
    feeDesc: '--',
    billPeriod: '2024年10月1日-2024年12月31日',
    billAmount: 20000.00,
    discountAmount: null,
    coupon: null,
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: 0,
    receivedAmount: 0,
    remainAmount: 0,
    status: 'reviewed'
  },
  {
    key: '3',
    billNo: 'ZD240303001505',
    enterpriseName: '洪福环保',
    feeSubject: '空调能耗费',
    orderNo: '1234合同编号',
    feeDesc: '--',
    billPeriod: '2024年10月1日-2024年12月31日',
    billAmount: 30000.00,
    discountAmount: null,
    coupon: null,
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: 30000.00,
    receivedAmount: 30000.00,
    remainAmount: 0,
    status: 'paid'
  },
  {
    key: '4',
    billNo: 'ZD240303001504',
    enterpriseName: '金旭新材料',
    feeSubject: '工位服务费',
    orderNo: '1234合同编号',
    feeDesc: '--',
    billPeriod: '2024年10月1日-2024年12月31日',
    billAmount: 3300.00,
    discountAmount: null,
    coupon: null,
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: 3300.00,
    receivedAmount: 3300.00,
    remainAmount: 0,
    status: 'paid'
  },
  {
    key: '5',
    billNo: 'ZD240303001503',
    enterpriseName: '金旭新材料',
    feeSubject: '水费',
    orderNo: '1234合同编号',
    feeDesc: '--',
    billPeriod: '2024年10月1日-2024年12月31日',
    billAmount: 60.00,
    discountAmount: null,
    coupon: null,
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: 0,
    receivedAmount: 0,
    remainAmount: 0,
    status: 'unreviewed'
  },
  {
    key: '6',
    billNo: 'ZD240303001507',
    enterpriseName: '外部公司名称',
    feeSubject: '会议室服务费',
    orderNo: 'HY250304000002',
    feeDesc: '--',
    billPeriod: '--',
    billAmount: 28000.00,
    discountAmount: 28000.00,
    coupon: '大会议室使用1次优惠券',
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: 0,
    receivedAmount: 0,
    remainAmount: 0,
    status: 'closed'
  },
  {
    key: '7',
    billNo: 'ZD240303001506',
    enterpriseName: '拓维信息',
    feeSubject: '空调加时费',
    orderNo: 'KJ250304000002',
    feeDesc: '--',
    billPeriod: '--',
    billAmount: 1200.00,
    discountAmount: null,
    coupon: null,
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: 1200.00,
    receivedAmount: 1200.00,
    remainAmount: 0,
    status: 'unreviewed'
  },
  {
    key: '8',
    billNo: 'ZD240303001505',
    enterpriseName: '拓维信息',
    feeSubject: '垃圾清运费',
    orderNo: 'LS250101000001',
    feeDesc: '--',
    billPeriod: '--',
    billAmount: 1110.00,
    discountAmount: null,
    coupon: null,
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: null,
    receivedAmount: null,
    remainAmount: null,
    status: 'closed'
  },
  {
    key: '9',
    billNo: 'ZD240303001507',
    enterpriseName: '丹娜生物',
    feeSubject: '活动奖金',
    orderNo: 'LS250101000002',
    feeDesc: '--',
    billPeriod: '--',
    billAmount: -3000.10,
    discountAmount: null,
    coupon: null,
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: null,
    receivedAmount: null,
    remainAmount: null,
    status: 'special'
  },
  {
    key: '10',
    billNo: 'ZD240303001506',
    enterpriseName: '--',
    feeSubject: '活动奖金',
    orderNo: 'LS250101000002',
    feeDesc: '--',
    billPeriod: '--',
    billAmount: -3000.00,
    discountAmount: null,
    coupon: null,
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: null,
    receivedAmount: null,
    remainAmount: null,
    status: 'special'
  },
  {
    key: '11',
    billNo: 'ZD240303001321',
    enterpriseName: '丹娜生物',
    feeSubject: '活动奖金',
    orderNo: 'LS250101000002',
    feeDesc: '--',
    billPeriod: '--',
    billAmount: -3000.00,
    discountAmount: null,
    coupon: null,
    adjustAmount: null,
    adjustReason: null,
    receivableAmount: -3000.00,
    receivedAmount: -3000.00,
    remainAmount: 0,
    status: 'paid'
  }
];

// 企业列表
const enterprises = [
  { value: '1', label: '丹娜生物' },
  { value: '2', label: '德康茶叶' },
  { value: '3', label: '洪福环保' },
  { value: '4', label: '金旭新材料' },
  { value: '5', label: '拓维信息' },
  { value: '6', label: '外部公司名称' }
];

// 费用科目
const feeSubjects = [
  { value: '1', label: '租金' },
  { value: '2', label: '物业费' },
  { value: '3', label: '空调能耗费' },
  { value: '4', label: '工位服务费' },
  { value: '5', label: '水费' },
  { value: '6', label: '会议室服务费' },
  { value: '7', label: '空调加时费' },
  { value: '8', label: '垃圾清运费' },
  { value: '9', label: '活动奖金' }
];

// 账单状态
const billStatus = [
  { value: 'unreviewed', label: '未复核', color: 'orange' },
  { value: 'reviewed', label: '待支付', color: 'blue' },
  { value: 'paid', label: '已支付', color: 'green' },
  { value: 'closed', label: '已关闭', color: 'red' },
  { value: 'special', label: '特殊状态', color: 'purple' }
];

const BillManagement: React.FC = () => {
  // 状态定义
  const [searchText, setSearchText] = useState<string>('');
  const [selectedEnterprise, setSelectedEnterprise] = useState<string | undefined>(undefined);
  const [selectedFeeSubject, setSelectedFeeSubject] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const [selectedRows, setSelectedRows] = useState<BillRecord[]>([]);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  // 处理复核操作
  const handleReview = (record: BillRecord) => {
    Modal.confirm({
      title: '确认复核',
      content: `确定要复核账单 ${record.billNo} 吗？`,
      onOk: () => {
        message.success(`账单 ${record.billNo} 已成功复核`);
      }
    });
  };

  // 处理撤销操作
  const handleCancel = (record: BillRecord) => {
    Modal.confirm({
      title: '确认撤销',
      content: `确定要撤销账单 ${record.billNo} 吗？`,
      onOk: () => {
        message.success(`账单 ${record.billNo} 已成功撤销`);
      }
    });
  };

  // 处理查看详情操作
  const handleViewDetails = (record: BillRecord) => {
    message.info(`查看账单 ${record.billNo} 的详细信息`);
  };

  // 批量复核操作
  const handleBatchReview = () => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要复核的账单');
      return;
    }
    
    Modal.confirm({
      title: '批量复核',
      content: `确定要复核选中的 ${selectedRows.length} 条账单吗？`,
      onOk: () => {
        message.success(`已成功复核 ${selectedRows.length} 条账单`);
        setSelectedRows([]);
      }
    });
  };

  // 导出账单
  const handleExport = () => {
    message.success('账单数据导出成功');
  };

  // 获取状态颜色和文本
  const getStatusTag = (status: string) => {
    const statusItem = billStatus.find(item => item.value === status);
    if (!statusItem) return <Tag>未知状态</Tag>;
    
    return <Tag color={statusItem.color}>{statusItem.label}</Tag>;
  };

  // 表格列定义
  const columns: ColumnsType<BillRecord> = [
    {
      title: '账单编号',
      dataIndex: 'billNo',
      key: 'billNo',
      width: 150,
      fixed: 'left',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '企业',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: 150,
    },
    {
      title: '费用科目',
      dataIndex: 'feeSubject',
      key: 'feeSubject',
      width: 120,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 150,
    },
    {
      title: '费用说明',
      dataIndex: 'feeDesc',
      key: 'feeDesc',
      width: 120,
    },
    {
      title: '计费周期',
      dataIndex: 'billPeriod',
      key: 'billPeriod',
      width: 220,
    },
    {
      title: '账单金额',
      dataIndex: 'billAmount',
      key: 'billAmount',
      width: 120,
      align: 'right',
      render: (value) => value.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
    },
    {
      title: '优惠金额',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      width: 120,
      align: 'right',
      render: (value) => value ? value.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : '--',
    },
    {
      title: '优惠券',
      dataIndex: 'coupon',
      key: 'coupon',
      width: 180,
      render: (text) => text || '--',
    },
    {
      title: '调整金额',
      dataIndex: 'adjustAmount',
      key: 'adjustAmount',
      width: 120,
      align: 'right',
      render: (value) => value ? value.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : '--',
    },
    {
      title: '调整理由',
      dataIndex: 'adjustReason',
      key: 'adjustReason',
      width: 120,
      render: (text) => text || '--',
    },
    {
      title: '应收/付金额',
      dataIndex: 'receivableAmount',
      key: 'receivableAmount',
      width: 120,
      align: 'right',
      render: (value) => value !== null ? value.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : '--',
    },
    {
      title: '已收/付金额',
      dataIndex: 'receivedAmount',
      key: 'receivedAmount',
      width: 120,
      align: 'right',
      render: (value) => value !== null ? value.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : '--',
    },
    {
      title: '末收/付金额',
      dataIndex: 'remainAmount',
      key: 'remainAmount',
      width: 120,
      align: 'right',
      render: (value) => value !== null ? value.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : '--',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'unreviewed' && (
            <a onClick={() => handleReview(record)}>复核</a>
          )}
          {record.status === 'reviewed' && (
            <a onClick={() => handleCancel(record)}>撤销</a>
          )}
          <a onClick={() => handleViewDetails(record)}>详情</a>
        </Space>
      ),
    },
  ];

  // 根据当前选项卡筛选数据
  const getFilteredData = () => {
    let filteredData = [...mockData];

    // 根据搜索文本筛选
    if (searchText) {
      filteredData = filteredData.filter(
        item => item.billNo.includes(searchText) || 
               (item.enterpriseName && item.enterpriseName.includes(searchText))
      );
    }

    // 根据企业筛选
    if (selectedEnterprise) {
      const enterprise = enterprises.find(e => e.value === selectedEnterprise)?.label;
      filteredData = filteredData.filter(item => item.enterpriseName === enterprise);
    }

    // 根据费用科目筛选
    if (selectedFeeSubject) {
      const subject = feeSubjects.find(s => s.value === selectedFeeSubject)?.label;
      filteredData = filteredData.filter(item => item.feeSubject === subject);
    }

    // 根据状态筛选
    if (selectedStatus) {
      filteredData = filteredData.filter(item => item.status === selectedStatus);
    }

    // 根据选项卡筛选
    if (currentTab !== 'all') {
      filteredData = filteredData.filter(item => item.status === currentTab);
    }

    return filteredData;
  };

  // 表格行选择配置
  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: BillRecord[]) => {
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record: BillRecord) => ({
      disabled: record.status !== 'unreviewed', // 只有未复核的可以选择
    }),
  };

  // 年份选项
  const yearOptions = [
    { value: '2024', label: '2024年' },
    { value: '2023', label: '2023年' },
    { value: '2022', label: '2022年' }
  ];

  // 月份选项
  const monthOptions = [
    { value: '1', label: '1月' },
    { value: '2', label: '2月' },
    { value: '3', label: '3月' },
    { value: '4', label: '4月' },
    { value: '5', label: '5月' },
    { value: '6', label: '6月' },
    { value: '7', label: '7月' },
    { value: '8', label: '8月' },
    { value: '9', label: '9月' },
    { value: '10', label: '10月' },
    { value: '11', label: '11月' },
    { value: '12', label: '12月' }
  ];

  return (
    <div className="bill-management">
      <Title level={4}>通用账单</Title>
      
      <Card className="filter-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Input
              placeholder="搜索账单编号/企业名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Select
              placeholder="选择企业"
              style={{ width: '100%' }}
              allowClear
              value={selectedEnterprise}
              onChange={(value) => setSelectedEnterprise(value)}
              options={enterprises}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Select
              placeholder="费用科目"
              style={{ width: '100%' }}
              allowClear
              value={selectedFeeSubject}
              onChange={(value) => setSelectedFeeSubject(value)}
              options={feeSubjects}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <RangePicker 
              style={{ width: '100%' }} 
              placeholder={['账单开始日期', '账单结束日期']}
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Space>
              <Select
                placeholder="计费年份"
                style={{ width: 120 }}
                allowClear
                value={selectedYear}
                onChange={(value) => setSelectedYear(value)}
                options={yearOptions}
              />
              <Select
                placeholder="计费月份"
                style={{ width: 120 }}
                allowClear
                value={selectedMonth}
                onChange={(value) => setSelectedMonth(value)}
                options={monthOptions}
              />
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Select
              placeholder="账单状态"
              style={{ width: '100%' }}
              allowClear
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              options={billStatus.map(item => ({
                value: item.value,
                label: <span>
                  <Tag color={item.color} style={{ marginRight: 5 }}>{item.label}</Tag>
                </span>
              }))}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" onClick={handleBatchReview} disabled={selectedRows.length === 0}>
                <CheckCircleOutlined /> 批量复核
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      <Card className="table-card">
        <Tabs 
          activeKey={currentTab} 
          onChange={setCurrentTab}
          className="bill-tabs"
        >
          <TabPane tab="全部账单" key="all" />
          <TabPane 
            tab={
              <span>
                <Tag color="orange">未复核</Tag>
                <span>未复核账单</span>
              </span>
            } 
            key="unreviewed" 
          />
          <TabPane 
            tab={
              <span>
                <Tag color="blue">待支付</Tag>
                <span>待支付账单</span>
              </span>
            } 
            key="reviewed" 
          />
          <TabPane 
            tab={
              <span>
                <Tag color="green">已支付</Tag>
                <span>已支付账单</span>
              </span>
            } 
            key="paid" 
          />
          <TabPane 
            tab={
              <span>
                <Tag color="red">已关闭</Tag>
                <span>已关闭账单</span>
              </span>
            } 
            key="closed" 
          />
        </Tabs>
        
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={getFilteredData()}
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default BillManagement; 