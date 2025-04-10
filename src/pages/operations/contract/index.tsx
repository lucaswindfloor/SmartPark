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
  Tag,
  Tooltip,
  DatePicker,
  Pagination,
  message
} from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import {
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PrinterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './index.less';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 定义合同数据接口
interface ContractItem {
  key: string;
  name: string;
  contractNo: string;
  relatedContract?: string;
  type: string;
  nature: string;
  enterprise: string;
  property: string;
  area?: number;
  summary: string;
  period: string;
  signDate: string;
  terminationDate?: string;
  status: string;
}

// 合同状态对应的标签颜色
const statusColors: { [key: string]: string } = {
  '待付首款': 'orange',
  '正在履行': 'green',
  '变更中': 'blue',
  '续签中': 'purple',
  '终止中': 'red',
  '提前终止': 'red',
  '自然终止': 'gray',
  '已作废': 'gray'
};

// 模拟合同数据
const mockData: ContractItem[] = [
  {
    key: '1',
    name: '德康东叶租赁合同20250101',
    contractNo: '',
    type: '租赁合同',
    nature: '首签合同',
    enterprise: '德康东叶',
    property: 'A栋301',
    area: 420,
    summary: '【租金：80元/㎡/月】【装修优惠10000元】【押金：3000元】',
    period: '2024-01-01至2026-12-31',
    signDate: '2024-08-08',
    status: '待付首款'
  },
  {
    key: '2',
    name: '某某公司租赁合同20250102',
    contractNo: '',
    type: '租赁合同',
    nature: '首签合同',
    enterprise: '某某公司',
    property: 'A栋505',
    area: 420,
    summary: '【租金：80元/㎡/月】【装修优惠10000元】【押金：3000元】',
    period: '2024-08-09至2026-12-31',
    signDate: '2024-08-08',
    status: '正在履行'
  },
  {
    key: '3',
    name: '湖南科创租赁合同20250105',
    contractNo: '',
    type: '租赁合同',
    nature: '首签合同',
    enterprise: '湖南科创',
    property: 'B栋1505',
    area: 420,
    summary: '【租金：80元/㎡/月】【装修优惠10000元】【押金：3000元】',
    period: '2024-02-15至2026-12-31',
    signDate: '2024-08-08',
    status: '正在履行'
  },
  {
    key: '4',
    name: '三诺科技物业合同20240908',
    contractNo: '三诺科技变更协议20250101',
    type: '租赁合同',
    nature: '首签合同',
    enterprise: '三诺科技',
    property: 'B栋1301',
    area: 420,
    summary: '【租金：80元/㎡/月】【装修优惠10000元】【押金：3000元】',
    period: '2024-08-08至2025-01-07',
    signDate: '2024-08-07',
    status: '正在履行'
  },
  {
    key: '5',
    name: '洪福环保物业合同20250108',
    contractNo: '原：洪福环保物业合同20240108',
    relatedContract: '入孵协议',
    nature: '续签合同',
    type: '物业合同',
    enterprise: '洪福环保',
    property: '工位01、工位02...',
    summary: '【工位服务费：800元/月】【3月一付】【押金：3000元】',
    period: '2024-08-08至2026-12-31',
    signDate: '2024-08-08',
    status: '正在履行'
  },
  {
    key: '6',
    name: '洪福环保物业合同20240108',
    contractNo: '续：洪福环保物业合同20250108',
    relatedContract: '入孵协议',
    nature: '续签合同', 
    type: '物业合同',
    enterprise: '金旭新材料',
    property: '工位01、工位02...',
    summary: '【工位服务费：800元/月】【3月一付】【押金：3000元】',
    period: '2024-08-08至2026-12-31',
    signDate: '2024-08-08',
    terminationDate: '2025-01-08',
    status: '续签中'
  },
  {
    key: '7',
    name: '中联重科租赁合同20241108',
    contractNo: '中联重科退租协议20250110',
    type: '租赁合同',
    nature: '首签合同',
    enterprise: '中联重科',
    property: 'A栋5层',
    area: 420,
    summary: '【租金：80元/㎡/月】【装修优惠10000元】【押金：3000元】',
    period: '2024-08-08至2026-12-31',
    signDate: '2024-08-08',
    terminationDate: '2025-01-10',
    status: '提前终止'
  },
  {
    key: '8',
    name: '中联重科物业合同202050108',
    contractNo: '',
    type: '物业合同',
    nature: '首签合同',
    enterprise: '丹娜生物',
    property: 'A栋301',
    area: 420,
    summary: '【物业费：20元/㎡/月】【空调能耗费：7元/㎡/月】【3月一付】',
    period: '2024-09-10至2026-12-31',
    signDate: '2024-08-08',
    terminationDate: '2025-01-10',
    status: '自然终止'
  },
  {
    key: '9',
    name: '三诺科技物业合同202050108',
    contractNo: '',
    type: '租赁合同',
    nature: '首签合同',
    enterprise: '德康东叶',
    property: 'A栋505',
    area: 420,
    summary: '【租金：80元/㎡/月】【装修优惠10000元】【押金：3000元】',
    period: '2024-08-08至2026-12-31',
    signDate: '2024-08-08',
    status: '自然终止'
  },
  {
    key: '10',
    name: '三诺科技物业合同202050108',
    contractNo: '',
    type: '租赁合同',
    nature: '续签合同',
    enterprise: '洪福环保',
    property: 'A栋508',
    area: 420,
    summary: '【租金：80元/㎡/月】【装修优惠10000元】【押金：3000元】',
    period: '2024-08-08至2026-12-31',
    signDate: '2024-08-08',
    status: '已作废'
  }
];

const ContractList: React.FC = () => {
  // 状态定义
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[any, any] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // 表格列定义
  const columns: ColumnsType<ContractItem> = [
    {
      title: '合同名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (text) => <a>{text}</a>,
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      ellipsis: true,
    },
    {
      title: '关联合同',
      dataIndex: 'relatedContract',
      key: 'relatedContract',
    },
    {
      title: '合同类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '合同性质',
      dataIndex: 'nature',
      key: 'nature',
    },
    {
      title: '企业',
      dataIndex: 'enterprise',
      key: 'enterprise',
      ellipsis: true,
    },
    {
      title: '房源',
      dataIndex: 'property',
      key: 'property',
    },
    {
      title: '面积㎡',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '合同摘要',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '合同期限',
      dataIndex: 'period',
      key: 'period',
      ellipsis: true,
    },
    {
      title: '签约日期',
      dataIndex: 'signDate',
      key: 'signDate',
    },
    {
      title: '退租日期',
      dataIndex: 'terminationDate',
      key: 'terminationDate',
    },
    {
      title: '合同状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => handleView(record)} />
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  // 处理查看操作
  const handleView = (record: ContractItem) => {
    message.info(`查看合同: ${record.name}`);
  };

  // 处理编辑操作
  const handleEdit = (record: ContractItem) => {
    message.info(`编辑合同: ${record.name}`);
  };

  // 处理删除操作
  const handleDelete = (record: ContractItem) => {
    message.info(`删除合同: ${record.name}`);
  };

  // 处理新增合同
  const handleAdd = () => {
    message.info('新增合同');
  };

  // 处理导出数据
  const handleExport = () => {
    message.success('合同数据导出成功');
  };

  // 处理刷新
  const handleRefresh = () => {
    message.success('数据已刷新');
  };

  // 处理打印
  const handlePrint = () => {
    message.info('准备打印合同列表');
    window.print();
  };

  // 修复日期范围状态和处理函数
  const handleDateRangeChange: RangePickerProps['onChange'] = (dates) => {
    setDateRange(dates ? [dates[0], dates[1]] : undefined);
  };

  // 根据筛选条件过滤数据
  const getFilteredData = () => {
    return mockData.filter((item) => {
      // 按搜索文本筛选（合同名称、编号、企业、房源）
      const textMatch = !searchText || 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.contractNo.toLowerCase().includes(searchText.toLowerCase()) ||
        item.enterprise.toLowerCase().includes(searchText.toLowerCase()) ||
        item.property.toLowerCase().includes(searchText.toLowerCase());

      // 按合同状态筛选
      const statusMatch = !selectedStatus || item.status === selectedStatus;

      // 按日期范围筛选
      let dateMatch = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const startDate = new Date(dateRange[0]).getTime();
        const endDate = new Date(dateRange[1]).getTime();
        const itemDate = new Date(item.signDate).getTime();
        dateMatch = itemDate >= startDate && itemDate <= endDate;
      }

      return textMatch && statusMatch && dateMatch;
    });
  };

  return (
    <div className="contract-list">
      <Title level={4}>合同管理</Title>

      <Card className="filter-card" title="筛选条件">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="搜索合同名称/编号/企业/房源"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="合同状态"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              allowClear
            >
              <Option value="待付首款">待付首款</Option>
              <Option value="正在履行">正在履行</Option>
              <Option value="变更中">变更中</Option>
              <Option value="续签中">续签中</Option>
              <Option value="提前终止">提前终止</Option>
              <Option value="自然终止">自然终止</Option>
              <Option value="已作废">已作废</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['签约开始日期', '签约结束日期']}
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="合同期限"
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="6month">6个月内到期</Option>
              <Option value="3month">3个月内到期</Option>
              <Option value="1month">1个月内到期</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card
        className="table-card"
        title="合同列表"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增合同
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
          scroll={{ x: 'max-content' }}
          className="contract-table"
          size="middle"
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
    </div>
  );
};

export default ContractList; 