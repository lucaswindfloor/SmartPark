import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Tabs, 
  List, 
  Space, 
  Tag, 
  Button, 
  Input, 
  DatePicker, 
  Empty,
  Dropdown,
  Menu
} from 'antd';
import { 
  NotificationOutlined, 
  FileTextOutlined, 
  CalendarOutlined, 
  BulbOutlined,
  FormOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './information.css';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 定义不同类型信息的接口
interface InfoItem {
  id: number;
  title: string;
  date: string;
  isTop?: boolean;
  category?: string;
  status?: string;
  deadline?: string;
}

const InformationIndex: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notice');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 通知公告数据
  const noticeItems: InfoItem[] = [
    { id: 1, title: '关于举办2024年创新创业大赛的通知', date: '2024-09-10', isTop: true },
    { id: 2, title: '第三季度安全生产检查工作安排', date: '2024-09-08', isTop: true },
    { id: 3, title: '园区电梯维保工作通知', date: '2024-09-05' },
    { id: 4, title: '停车场管理规定调整公告', date: '2024-09-01' },
    { id: 5, title: '园区水电费调整通知', date: '2024-08-28' },
    { id: 6, title: '国庆节放假安排通知', date: '2024-08-25' },
    { id: 7, title: '园区安全演练通知', date: '2024-08-20' },
    { id: 8, title: '临时通行证使用规范', date: '2024-08-15' }
  ];

  // 政策文件数据
  const policyItems: InfoItem[] = [
    { id: 1, title: '科技型中小企业研发费用补贴申报指南', date: '2024-08-25', isTop: true },
    { id: 2, title: '园区企业人才引进政策', date: '2024-08-15', isTop: true },
    { id: 3, title: '创新创业孵化扶持计划实施细则', date: '2024-08-10' },
    { id: 4, title: '高新技术企业认定奖励办法', date: '2024-08-05' },
    { id: 5, title: '园区知识产权保护指南', date: '2024-07-30' },
    { id: 6, title: '科技成果转化资金支持办法', date: '2024-07-25' },
    { id: 7, title: '创业企业房租减免政策', date: '2024-07-20' },
    { id: 8, title: '科技企业税收优惠政策汇编', date: '2024-07-15' }
  ];

  // 园区活动数据
  const activityItems: InfoItem[] = [
    { id: 1, title: '2024年科技创新峰会', date: '2024-10-15', isTop: true, status: '未开始' },
    { id: 2, title: '人工智能技术交流会', date: '2024-09-28', isTop: true, status: '未开始' },
    { id: 3, title: '创业项目路演活动', date: '2024-09-20', status: '未开始' },
    { id: 4, title: '企业家沙龙第三期', date: '2024-09-15', status: '未开始' },
    { id: 5, title: '高校人才招聘会', date: '2024-09-10', status: '未开始' },
    { id: 6, title: '知识产权保护讲座', date: '2024-09-05', status: '未开始' },
    { id: 7, title: '创新方法培训课程', date: '2024-08-28', status: '已结束' },
    { id: 8, title: '企业融资对接会', date: '2024-08-20', status: '已结束' }
  ];

  // 需求发布数据
  const demandItems: InfoItem[] = [
    { id: 1, title: '智能制造解决方案需求', date: '2024-09-15', category: '技术合作', deadline: '2024-10-15' },
    { id: 2, title: '园区共享会议系统开发项目', date: '2024-09-10', category: '项目合作', deadline: '2024-10-10' },
    { id: 3, title: '企业数字化转型咨询服务', date: '2024-09-08', category: '服务采购', deadline: '2024-09-30' },
    { id: 4, title: '园区智能照明系统改造', date: '2024-09-05', category: '项目合作', deadline: '2024-09-25' },
    { id: 5, title: '企业ERP系统定制开发', date: '2024-09-01', category: '技术合作', deadline: '2024-09-20' },
    { id: 6, title: '区块链技术应用研究', date: '2024-08-28', category: '技术合作', deadline: '2024-09-28' }
  ];

  // 调查问卷数据
  const surveyItems: InfoItem[] = [
    { id: 1, title: '园区服务满意度调查', date: '2024-09-10', deadline: '2024-09-30' },
    { id: 2, title: '企业发展需求调研', date: '2024-09-05', deadline: '2024-09-25' },
    { id: 3, title: '园区配套设施改善意见征集', date: '2024-09-01', deadline: '2024-09-20' },
    { id: 4, title: '员工通勤方式调查', date: '2024-08-25', deadline: '2024-09-15' },
    { id: 5, title: '创新创业环境评估问卷', date: '2024-08-20', deadline: '2024-09-10' }
  ];

  // 根据当前选项卡获取数据
  const getTabData = () => {
    switch (activeTab) {
      case 'notice':
        return noticeItems;
      case 'policy':
        return policyItems;
      case 'activity':
        return activityItems;
      case 'demand':
        return demandItems;
      case 'survey':
        return surveyItems;
      default:
        return [];
    }
  };

  // 过滤数据
  const filterData = () => {
    let data = getTabData();

    // 搜索过滤
    if (searchText) {
      data = data.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 日期过滤
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      
      data = data.filter(item => {
        return item.date >= startDate && item.date <= endDate;
      });
    }

    return data;
  };

  // 处理项目点击
  const handleItemClick = (id: number) => {
    // 根据不同类型的内容跳转到不同的详情页
    switch (activeTab) {
      case 'notice':
        navigate(`/portal/information/notice/${id}`);
        break;
      case 'policy':
        navigate(`/portal/information/policy/${id}`);
        break;
      case 'activity':
        navigate(`/portal/activities/${id}`);
        break;
      case 'demand':
        navigate(`/portal/information/demand/${id}`);
        break;
      case 'survey':
        navigate(`/portal/information/survey/${id}`);
        break;
      default:
        break;
    }
  };

  // 渲染列表项
  const renderListItem = (item: InfoItem) => {
    let extra: React.ReactNode = item.date;
    
    // 针对不同类型的内容展示不同的额外信息
    if (activeTab === 'activity') {
      const statusColor = item.status === '已结束' ? '#999999' : '#52c41a';
      extra = (
        <Space>
          <span>{item.date}</span>
          <Tag color={statusColor}>{item.status}</Tag>
        </Space>
      );
    } else if (activeTab === 'demand') {
      extra = (
        <Space>
          <Tag color="blue">{item.category}</Tag>
          <span>截止: {item.deadline}</span>
        </Space>
      );
    } else if (activeTab === 'survey') {
      extra = <span>截止日期: {item.deadline}</span>;
    }

    return (
      <List.Item 
        key={item.id} 
        extra={extra}
        onClick={() => handleItemClick(item.id)}
        className="info-list-item"
      >
        <Space>
          {item.isTop && <Tag color="#f50">置顶</Tag>}
          <span className="info-title">{item.title}</span>
        </Space>
      </List.Item>
    );
  };

  return (
    <div className="information-index">
      <Card 
        title="信息公开" 
        className="info-card"
        extra={
          <Space>
            <Input 
              placeholder="搜索" 
              prefix={<SearchOutlined />} 
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="time">
                    <RangePicker 
                      onChange={(dates) => setDateRange(dates)}
                      placeholder={['开始日期', '结束日期']}
                    />
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Button icon={<FilterOutlined />}>筛选</Button>
            </Dropdown>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={<><NotificationOutlined /> 通知公告</>} 
            key="notice"
          />
          <TabPane 
            tab={<><FileTextOutlined /> 政策文件</>} 
            key="policy"
          />
          <TabPane 
            tab={<><CalendarOutlined /> 园区活动</>} 
            key="activity"
          />
          <TabPane 
            tab={<><BulbOutlined /> 需求发布</>} 
            key="demand"
          />
          <TabPane 
            tab={<><FormOutlined /> 调查问卷</>} 
            key="survey"
          />
        </Tabs>
        
        {filterData().length > 0 ? (
          <List
            className="info-list"
            itemLayout="horizontal"
            dataSource={filterData()}
            renderItem={renderListItem}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: total => `共 ${total} 条`
            }}
          />
        ) : (
          <Empty description="没有找到相关信息" />
        )}
      </Card>
    </div>
  );
};

export default InformationIndex; 