import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Form, 
  InputNumber,
  Radio,
  Table,
  Divider,
  Tag,
  Modal,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  TimePicker,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SaveOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 模拟时段数据
const mockTimeRanges = [
  { 
    id: 1, 
    dayType: 'workday',
    name: '首小时', 
    startTime: null,
    endTime: null,
    timeLimit: 1,
    price: 10
  },
  { 
    id: 2, 
    dayType: 'workday',
    name: '后续时长', 
    startTime: null,
    endTime: null,
    timeLimit: null,
    price: 5
  },
  { 
    id: 3, 
    dayType: 'holiday',
    name: '白天', 
    startTime: '08:00',
    endTime: '18:00',
    timeLimit: null,
    price: 8
  },
  { 
    id: 4, 
    dayType: 'holiday',
    name: '夜间', 
    startTime: '18:00',
    endTime: '08:00',
    timeLimit: null,
    price: 3
  }
];

// 模拟特殊日期数据
const mockSpecialDates = [
  {
    id: 1,
    name: '元旦',
    startDate: '2023-01-01',
    endDate: '2023-01-01',
    chargeStandard: 'holiday'
  },
  {
    id: 2,
    name: '春节',
    startDate: '2023-01-22',
    endDate: '2023-01-27',
    chargeStandard: 'holiday'
  }
];

const TempPlanManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [timeRangeForm] = Form.useForm();
  const [specialDateForm] = Form.useForm();
  const [isTimeRangeModalVisible, setIsTimeRangeModalVisible] = useState(false);
  const [isSpecialDateModalVisible, setIsSpecialDateModalVisible] = useState(false);
  const [timeRangeModalMode, setTimeRangeModalMode] = useState<'add' | 'edit'>('add');
  const [specialDateModalMode, setSpecialDateModalMode] = useState<'add' | 'edit'>('add');
  const [currentTimeRange, setCurrentTimeRange] = useState<any>(null);
  const [currentSpecialDate, setCurrentSpecialDate] = useState<any>(null);
  const [timeRanges, setTimeRanges] = useState(mockTimeRanges);
  const [specialDates, setSpecialDates] = useState(mockSpecialDates);
  const [chargeType, setChargeType] = useState<'byTime' | 'byRange'>('byTime');

  // 基本设置初始值
  const initialValues = {
    chargeType: 'byTime'
  };

  // 处理收费类型变更
  const handleChargeTypeChange = (e: any) => {
    setChargeType(e.target.value);
  };

  // 添加时段
  const handleAddTimeRange = () => {
    setTimeRangeModalMode('add');
    setCurrentTimeRange(null);
    timeRangeForm.resetFields();
    timeRangeForm.setFieldsValue({
      dayType: 'workday',
      timeLimit: null,
    });
    setIsTimeRangeModalVisible(true);
  };

  // 编辑时段
  const handleEditTimeRange = (record: any) => {
    setTimeRangeModalMode('edit');
    setCurrentTimeRange(record);
    const formValues: any = {
      dayType: record.dayType,
      name: record.name,
      price: record.price,
    };
    
    if (record.timeLimit !== null) {
      formValues.timeLimit = record.timeLimit;
    }
    
    if (record.startTime && record.endTime) {
      formValues.timeRange = [
        dayjs(record.startTime, 'HH:mm'),
        dayjs(record.endTime, 'HH:mm')
      ];
    }
    
    timeRangeForm.setFieldsValue(formValues);
    setIsTimeRangeModalVisible(true);
  };

  // 删除时段
  const handleDeleteTimeRange = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除时段 "${record.name}" 吗？`,
      onOk() {
        const newTimeRanges = timeRanges.filter(item => item.id !== record.id);
        setTimeRanges(newTimeRanges);
      }
    });
  };

  // 保存时段
  const handleSaveTimeRange = () => {
    timeRangeForm.validateFields().then(values => {
      const formattedValues: any = {
        ...values,
        startTime: values.timeRange ? values.timeRange[0].format('HH:mm') : null,
        endTime: values.timeRange ? values.timeRange[1].format('HH:mm') : null
      };
      
      // 删除临时字段
      delete formattedValues.timeRange;
      
      console.log('保存时段', formattedValues);
      
      if (timeRangeModalMode === 'add') {
        // 添加逻辑
        const newTimeRange = {
          id: Date.now(), // 使用时间戳作为临时ID
          ...formattedValues
        };
        setTimeRanges([...timeRanges, newTimeRange]);
      } else {
        // 编辑逻辑
        if (currentTimeRange) {
          const newTimeRanges = timeRanges.map(item => 
            item.id === currentTimeRange.id ? { ...item, ...formattedValues } : item
          );
          setTimeRanges(newTimeRanges);
        }
      }
      
      setIsTimeRangeModalVisible(false);
    });
  };

  // 添加特殊日期
  const handleAddSpecialDate = () => {
    setSpecialDateModalMode('add');
    setCurrentSpecialDate(null);
    specialDateForm.resetFields();
    specialDateForm.setFieldsValue({
      chargeStandard: 'holiday'
    });
    setIsSpecialDateModalVisible(true);
  };

  // 编辑特殊日期
  const handleEditSpecialDate = (record: any) => {
    setSpecialDateModalMode('edit');
    setCurrentSpecialDate(record);
    
    specialDateForm.setFieldsValue({
      name: record.name,
      dateRange: [
        dayjs(record.startDate),
        dayjs(record.endDate)
      ],
      chargeStandard: record.chargeStandard
    });
    
    setIsSpecialDateModalVisible(true);
  };

  // 删除特殊日期
  const handleDeleteSpecialDate = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除特殊日期 "${record.name}" 吗？`,
      onOk() {
        const newSpecialDates = specialDates.filter(item => item.id !== record.id);
        setSpecialDates(newSpecialDates);
      }
    });
  };

  // 保存特殊日期
  const handleSaveSpecialDate = () => {
    specialDateForm.validateFields().then(values => {
      const formattedValues = {
        name: values.name,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        chargeStandard: values.chargeStandard
      };
      
      console.log('保存特殊日期', formattedValues);
      
      if (specialDateModalMode === 'add') {
        // 添加逻辑
        const newSpecialDate = {
          id: Date.now(), // 使用时间戳作为临时ID
          ...formattedValues
        };
        setSpecialDates([...specialDates, newSpecialDate]);
      } else {
        // 编辑逻辑
        if (currentSpecialDate) {
          const newSpecialDates = specialDates.map(item => 
            item.id === currentSpecialDate.id ? { ...item, ...formattedValues } : item
          );
          setSpecialDates(newSpecialDates);
        }
      }
      
      setIsSpecialDateModalVisible(false);
    });
  };

  // 保存所有设置
  const handleSaveAll = () => {
    form.validateFields().then(values => {
      console.log('保存所有设置', {
        ...values,
        timeRanges,
        specialDates
      });
      // 这里添加保存逻辑
    });
  };

  // 工作日时段表格列定义
  const workdayColumns = [
    {
      title: '时段名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '时间范围',
      key: 'timeRange',
      render: (_: unknown, record: any) => {
        if (record.startTime && record.endTime) {
          return `${record.startTime} - ${record.endTime}`;
        } else if (record.timeLimit) {
          return `首${record.timeLimit}小时`;
        } else {
          return '后续时长';
        }
      }
    },
    {
      title: '收费标准',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}/小时`
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditTimeRange(record)}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteTimeRange(record)}
          />
        </Space>
      ),
    },
  ];

  // 节假日时段表格列定义
  const holidayColumns = workdayColumns;

  // 特殊日期表格列定义
  const specialDateColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '日期范围',
      key: 'dateRange',
      render: (_: unknown, record: any) => {
        if (record.startDate === record.endDate) {
          return record.startDate;
        } else {
          return `${record.startDate} 至 ${record.endDate}`;
        }
      }
    },
    {
      title: '收费标准',
      dataIndex: 'chargeStandard',
      key: 'chargeStandard',
      render: (standard: string) => standard === 'holiday' ? '节假日标准' : '工作日标准'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditSpecialDate(record)}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteSpecialDate(record)}
          />
        </Space>
      ),
    },
  ];

  // 过滤工作日数据
  const workdayData = timeRanges.filter(item => item.dayType === 'workday');
  
  // 过滤节假日数据
  const holidayData = timeRanges.filter(item => item.dayType === 'holiday');

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>临停收费方案</Title>
        <Paragraph>
          设置临停车辆的收费标准，包括工作日和节假日的收费方式和费率。
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
        >
          <Title level={5}>收费模式设置</Title>
          <Form.Item
            name="chargeType"
            label={
              <span>
                收费模式
                <Tooltip title="按时长收费：按车辆停放的实际时间计费；按区间收费：将一天划分为不同时段，对不同时段实行不同的收费标准">
                  <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            }
          >
            <Radio.Group onChange={handleChargeTypeChange}>
              <Radio value="byTime">按时长收费</Radio>
              <Radio value="byRange">按区间收费</Radio>
            </Radio.Group>
          </Form.Item>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5}>工作日收费标准</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddTimeRange}
            >
              添加时段
            </Button>
          </div>

          <Table 
            columns={workdayColumns} 
            dataSource={workdayData} 
            rowKey="id" 
            pagination={false}
            style={{ marginBottom: '24px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5}>节假日收费标准</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddTimeRange}
            >
              添加时段
            </Button>
          </div>

          <Table 
            columns={holidayColumns} 
            dataSource={holidayData} 
            rowKey="id" 
            pagination={false}
            style={{ marginBottom: '24px' }}
          />

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5}>特殊日期设置</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddSpecialDate}
            >
              添加特殊日期
            </Button>
          </div>

          <Table 
            columns={specialDateColumns} 
            dataSource={specialDates} 
            rowKey="id" 
            pagination={false}
            style={{ marginBottom: '24px' }}
          />

          <Divider />

          <div style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={handleSaveAll}
            >
              保存所有设置
            </Button>
          </div>
        </Form>
      </Card>

      {/* 时段编辑弹窗 */}
      <Modal
        title={timeRangeModalMode === 'add' ? '添加时段' : '编辑时段'}
        open={isTimeRangeModalVisible}
        onCancel={() => setIsTimeRangeModalVisible(false)}
        onOk={handleSaveTimeRange}
        width={600}
      >
        <Form
          form={timeRangeForm}
          layout="vertical"
        >
          <Form.Item
            name="dayType"
            label="适用日类型"
            rules={[{ required: true, message: '请选择适用日类型' }]}
          >
            <Radio.Group>
              <Radio value="workday">工作日</Radio>
              <Radio value="holiday">节假日</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="name"
            label="时段名称"
            rules={[{ required: true, message: '请输入时段名称' }]}
          >
            <Input placeholder="请输入时段名称" />
          </Form.Item>
          
          {chargeType === 'byTime' ? (
            <Form.Item
              name="timeLimit"
              label="计时规则"
              help="若是首小时，请填写小时数；若是后续时长，请留空"
            >
              <InputNumber min={0} placeholder="小时数" style={{ width: '100%' }} />
            </Form.Item>
          ) : (
            <Form.Item
              name="timeRange"
              label="时间范围"
              rules={[{ required: true, message: '请选择时间范围' }]}
            >
              <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          )}
          
          <Form.Item
            name="price"
            label="收费标准(元/小时)"
            rules={[{ required: true, message: '请输入收费标准' }]}
          >
            <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 特殊日期编辑弹窗 */}
      <Modal
        title={specialDateModalMode === 'add' ? '添加特殊日期' : '编辑特殊日期'}
        open={isSpecialDateModalVisible}
        onCancel={() => setIsSpecialDateModalVisible(false)}
        onOk={handleSaveSpecialDate}
      >
        <Form
          form={specialDateForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          
          <Form.Item
            name="dateRange"
            label="日期范围"
            rules={[{ required: true, message: '请选择日期范围' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="chargeStandard"
            label="收费标准"
            rules={[{ required: true, message: '请选择收费标准' }]}
          >
            <Radio.Group>
              <Radio value="workday">工作日标准</Radio>
              <Radio value="holiday">节假日标准</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TempPlanManagement; 