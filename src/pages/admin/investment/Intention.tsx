import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Table, 
  Space, 
  Row, 
  Col, 
  Divider, 
  Tag,
  Dropdown,
  Menu,
  Modal,
  message
} from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  SettingOutlined,
  SearchOutlined,
  UserSwitchOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
  EllipsisOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface IntentionRecord {
  key: string;
  park: string;
  code: string;
  customerName: string;
  customerType: string;
  intentionType: string;
  intentionProperty: string;
  createTime: string;
  followPerson: string;
  status: string;
}

const mockData: IntentionRecord[] = [
  {
    key: '1',
    park: '创意园',
    code: 'YX20241001',
    customerName: '丹娜生物',
    customerType: '企业',
    intentionType: '房间、工位',
    intentionProperty: '楼栋：C1栋',
    createTime: '2024-09-01 11:11:11',
    followPerson: '—',
    status: '待分配',
  },
  {
    key: '2',
    park: '科技园',
    code: 'YX20241002',
    customerName: '长沙数智科技',
    customerType: '企业',
    intentionType: '房间',
    intentionProperty: '楼栋：A1栋，楼层：3层',
    createTime: '2024-09-02 09:30:00',
    followPerson: '张三',
    status: '跟进中',
  },
  {
    key: '3',
    park: '文化园',
    code: 'YX20241003',
    customerName: '湘江设计工作室',
    customerType: '个人',
    intentionType: '工位',
    intentionProperty: '楼栋：B2栋，楼层：5层',
    createTime: '2024-09-03 14:25:10',
    followPerson: '李四',
    status: '跟进中',
  },
  {
    key: '4',
    park: '创意园',
    code: 'YX20241004',
    customerName: '湘江智能制造',
    customerType: '企业',
    intentionType: '房间',
    intentionProperty: '楼栋：C2栋，楼层：2层，房号：201',
    createTime: '2024-09-04 10:05:22',
    followPerson: '—',
    status: '待分配',
  },
  {
    key: '5',
    park: '科技园',
    code: 'YX20241005',
    customerName: '王小明',
    customerType: '个人',
    intentionType: '工位',
    intentionProperty: '楼栋：A3栋，楼层：4层',
    createTime: '2024-09-05 15:40:18',
    followPerson: '王五',
    status: '已签约',
  }
];

const IntentionPage: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [assignModalVisible, setAssignModalVisible] = useState<boolean>(false);

  // 处理搜索表单提交
  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    // 实际应用中这里会调用API进行搜索
    message.success('查询成功');
  };

  // 重置搜索表单
  const handleReset = () => {
    form.resetFields();
  };

  // 处理表格行选择
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 处理新增按钮点击
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  // 处理分配按钮点击
  const handleAssign = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要分配的意向');
      return;
    }
    setAssignModalVisible(true);
  };

  // 处理删除按钮点击
  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的意向');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条意向记录吗？`,
      onOk() {
        message.success(`成功删除 ${selectedRowKeys.length} 条记录`);
        setSelectedRowKeys([]);
      }
    });
  };

  // 处理单行分配按钮点击
  const handleRowAssign = (record: IntentionRecord) => {
    setSelectedRowKeys([record.key]);
    setAssignModalVisible(true);
  };

  // 处理单行编辑按钮点击
  const handleRowEdit = (record: IntentionRecord) => {
    message.info(`编辑意向: ${record.code}`);
  };

  // 处理单行删除按钮点击
  const handleRowDelete = (record: IntentionRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除意向 ${record.code} 吗？`,
      onOk() {
        message.success(`成功删除意向 ${record.code}`);
      }
    });
  };

  // 处理单行收回按钮点击
  const handleRowRecall = (record: IntentionRecord) => {
    Modal.confirm({
      title: '确认收回',
      content: `确定要收回意向 ${record.code} 吗？`,
      onOk() {
        message.success(`成功收回意向 ${record.code}`);
      }
    });
  };

  // 表格列定义
  const columns: ColumnsType<IntentionRecord> = [
    {
      title: '园区',
      dataIndex: 'park',
      key: 'park',
      width: 100,
    },
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: '企业/个人',
      dataIndex: 'customerType',
      key: 'customerType',
      width: 100,
    },
    {
      title: '意向类型',
      dataIndex: 'intentionType',
      key: 'intentionType',
      width: 120,
    },
    {
      title: '意向房源',
      dataIndex: 'intentionProperty',
      key: 'intentionProperty',
      width: 220,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '跟进人',
      dataIndex: 'followPerson',
      key: 'followPerson',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        let color = '';
        switch (status) {
          case '待分配':
            color = 'orange';
            break;
          case '跟进中':
            color = 'blue';
            break;
          case '已签约':
            color = 'green';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => {
        // 根据状态显示不同的按钮
        if (record.status === '待分配') {
          return (
            <Space size="small">
              <Button type="link" size="small" onClick={() => handleRowAssign(record)}>分配</Button>
              <Button type="link" size="small" onClick={() => message.info(`查看详情: ${record.code}`)}>详情</Button>
              <Dropdown overlay={
                <Menu items={[
                  {
                    key: '1',
                    label: '编辑',
                    icon: <EditOutlined />,
                    onClick: () => handleRowEdit(record)
                  },
                  {
                    key: '2',
                    label: '删除',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleRowDelete(record)
                  }
                ]} />
              }>
                <Button type="link" size="small">更多 <EllipsisOutlined /></Button>
              </Dropdown>
            </Space>
          );
        } else if (record.status === '跟进中') {
          return (
            <Space size="small">
              <Button type="link" size="small" onClick={() => message.info(`查看详情: ${record.code}`)}>详情</Button>
              <Dropdown overlay={
                <Menu items={[
                  {
                    key: '1',
                    label: '编辑',
                    icon: <EditOutlined />,
                    onClick: () => handleRowEdit(record)
                  },
                  {
                    key: '2',
                    label: '收回',
                    icon: <RollbackOutlined />,
                    onClick: () => handleRowRecall(record)
                  },
                  {
                    key: '3',
                    label: '删除',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleRowDelete(record)
                  }
                ]} />
              }>
                <Button type="link" size="small">更多 <EllipsisOutlined /></Button>
              </Dropdown>
            </Space>
          );
        } else {
          return (
            <Space size="small">
              <Button type="link" size="small" onClick={() => message.info(`查看详情: ${record.code}`)}>详情</Button>
            </Space>
          );
        }
      }
    },
  ];

  return (
    <div className="intention-page">
      <h2 style={{ marginBottom: '24px', fontWeight: 'bold' }}>意向登记</h2>
      
      {/* 搜索表单 */}
      <Card style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          name="searchForm"
          layout="inline"
          onFinish={handleSearch}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
        >
          <Form.Item name="customerInfo" style={{ minWidth: '250px' }}>
            <Input placeholder="客户编号或客户名称" prefix={<SearchOutlined />} />
          </Form.Item>
          
          <Form.Item name="park" style={{ minWidth: '180px' }}>
            <Select placeholder="园区" allowClear>
              <Option value="创意园">创意园</Option>
              <Option value="科技园">科技园</Option>
              <Option value="文化园">文化园</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="customerType" style={{ minWidth: '180px' }}>
            <Select placeholder="企业/个人" allowClear>
              <Option value="企业">企业</Option>
              <Option value="个人">个人</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="createTime" style={{ minWidth: '320px' }}>
            <RangePicker placeholder={['创建时间开始', '创建时间结束']} />
          </Form.Item>
          
          <Form.Item name="followPerson" style={{ minWidth: '180px' }}>
            <Select placeholder="跟进人" allowClear>
              <Option value="张三">张三</Option>
              <Option value="李四">李四</Option>
              <Option value="王五">王五</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="status" style={{ minWidth: '180px' }}>
            <Select placeholder="状态" allowClear>
              <Option value="待分配">待分配</Option>
              <Option value="跟进中">跟进中</Option>
              <Option value="已签约">已签约</Option>
            </Select>
          </Form.Item>
          
          <Form.Item style={{ marginLeft: 'auto' }}>
            <Space>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      {/* 操作按钮区 */}
      <div style={{ marginBottom: '16px' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
          <Button icon={<UserSwitchOutlined />} onClick={handleAssign}>
            分配
          </Button>
          <Button icon={<RollbackOutlined />} disabled={selectedRowKeys.length === 0}>
            回收
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete} disabled={selectedRowKeys.length === 0}>
            删除
          </Button>
          <Divider type="vertical" />
          <Button icon={<UploadOutlined />}>
            导入
          </Button>
          <Button icon={<DownloadOutlined />}>
            导出
          </Button>
          <Button icon={<SettingOutlined />}>
            表头设置
          </Button>
        </Space>
        <span style={{ marginLeft: '16px' }}>
          {selectedRowKeys.length > 0 && `已选择 ${selectedRowKeys.length} 项`}
        </span>
      </div>
      
      {/* 数据表格 */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={mockData}
        bordered
        scroll={{ x: 1500 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          pageSize: 10,
          total: mockData.length,
        }}
      />
      
      {/* 新增意向模态框 */}
      <Modal
        title="新增意向"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading}>
            提交
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="园区" name="park" rules={[{ required: true, message: '请选择园区' }]}>
                <Select placeholder="请选择园区">
                  <Option value="创意园">创意园</Option>
                  <Option value="科技园">科技园</Option>
                  <Option value="文化园">文化园</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="客户" name="customer" rules={[{ required: true, message: '请选择客户' }]}>
                <Select
                  showSearch
                  placeholder="请选择客户"
                  optionFilterProp="children"
                >
                  <Option value="1">丹娜生物</Option>
                  <Option value="2">长沙数智科技</Option>
                  <Option value="3">湘江设计工作室</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="意向类型" name="intentionType" rules={[{ required: true, message: '请选择意向类型' }]}>
                <Select placeholder="请选择意向类型" mode="multiple">
                  <Option value="房间">房间</Option>
                  <Option value="工位">工位</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="意向房源" name="intentionProperty" rules={[{ required: true, message: '请选择意向房源' }]}>
                <Select placeholder="请选择意向房源">
                  <Option value="C1栋">C1栋</Option>
                  <Option value="A1栋_3层">A1栋-3层</Option>
                  <Option value="B2栋_5层">B2栋-5层</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="意向备注" name="remark">
                <Input.TextArea rows={4} placeholder="请输入意向备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      
      {/* 分配意向模态框 */}
      <Modal
        title="分配意向"
        visible={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onOk={() => {
          message.success('分配成功');
          setAssignModalVisible(false);
          setSelectedRowKeys([]);
        }}
      >
        <Form layout="vertical">
          <Form.Item 
            label="跟进人" 
            name="followPerson" 
            rules={[{ required: true, message: '请选择跟进人' }]}
          >
            <Select placeholder="请选择跟进人">
              <Option value="张三">张三</Option>
              <Option value="李四">李四</Option>
              <Option value="王五">王五</Option>
            </Select>
          </Form.Item>
          <Form.Item label="分配备注" name="assignRemark">
            <Input.TextArea rows={4} placeholder="请输入分配备注信息" />
          </Form.Item>
        </Form>
        <div style={{ marginTop: '16px', color: '#ff4d4f' }}>
          <InfoCircleOutlined /> 已选择 {selectedRowKeys.length} 条意向记录进行分配
        </div>
      </Modal>
    </div>
  );
};

export default IntentionPage; 