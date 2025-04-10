import React, { useState } from 'react';
import { 
  Card, 
  List, 
  Avatar, 
  Badge, 
  Tabs, 
  Button, 
  Space, 
  Typography, 
  Tooltip, 
  Empty,
  Divider,
  Modal,
  message 
} from 'antd';
import { 
  BellOutlined, 
  CalendarOutlined, 
  SettingOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 消息接口定义
interface MessageItem {
  id: number;
  title: string;
  content: string;
  type: 'system' | 'activity' | 'service';
  time: string;
  isRead: boolean;
  link?: string;
  icon?: React.ReactNode;
}

const MessageCenter: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 1,
      title: '系统维护通知',
      content: '尊敬的用户，系统将于2024年9月15日晚间22:00-次日2:00进行维护升级，届时部分服务将暂停使用，请提前做好安排，感谢您的理解与支持。',
      type: 'system',
      time: '2024-09-10 10:30',
      isRead: false,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />
    },
    {
      id: 2,
      title: '您有新的活动通知',
      content: '2024年科技创新峰会将于10月15日至16日在创新中心多功能厅举行，欢迎报名参加！',
      type: 'activity',
      time: '2024-09-08 14:20',
      isRead: true,
      link: '/portal/activities/1',
      icon: <CalendarOutlined style={{ color: '#1890ff' }} />
    },
    {
      id: 3,
      title: '会议室预订成功',
      content: '您已成功预订A栋3楼会议室（301），时间：2024年9月12日 14:00-16:00，请准时参加。',
      type: 'service',
      time: '2024-09-07 09:15',
      isRead: false,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    },
    {
      id: 4,
      title: '物业费缴纳提醒',
      content: '您的B栋3层305室物业费将于2024年9月30日到期，请及时缴纳，以免影响正常使用园区服务。',
      type: 'service',
      time: '2024-09-05 16:45',
      isRead: true,
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />
    },
    {
      id: 5,
      title: '人工智能技术交流会',
      content: '人工智能技术交流会将于9月28日在科技楼报告厅举行，专家将分享AI最新研究成果与应用案例。',
      type: 'activity',
      time: '2024-09-03 11:30',
      isRead: true,
      link: '/portal/activities/2',
      icon: <CalendarOutlined style={{ color: '#1890ff' }} />
    },
    {
      id: 6,
      title: '维修申报处理结果',
      content: '您于2024年8月30日提交的办公室空调维修申报已处理完成，如有问题请联系物业中心。',
      type: 'service',
      time: '2024-09-01 15:20',
      isRead: false,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    },
    {
      id: 7,
      title: '账户安全提醒',
      content: '检测到您的账户在新设备上登录，如非本人操作，请及时修改密码并联系客服。',
      type: 'system',
      time: '2024-08-28 20:15',
      isRead: true,
      icon: <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
    }
  ]);

  // 筛选消息
  const getFilteredMessages = () => {
    if (activeTab === 'all') {
      return messages;
    }
    return messages.filter(msg => msg.type === activeTab);
  };

  // 获取未读消息数量
  const getUnreadCount = (type?: string) => {
    if (type) {
      return messages.filter(msg => !msg.isRead && msg.type === type).length;
    }
    return messages.filter(msg => !msg.isRead).length;
  };

  // 标记消息为已读
  const markAsRead = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, isRead: true } : msg
    ));
  };

  // 标记所有消息为已读
  const markAllAsRead = () => {
    Modal.confirm({
      title: '确认将所有消息标记为已读吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setMessages(messages.map(msg => ({ ...msg, isRead: true })));
        message.success('已将所有消息标记为已读');
      }
    });
  };

  // 删除消息
  const deleteMessage = (id: number) => {
    Modal.confirm({
      title: '确认删除此消息吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后将无法恢复',
      onOk() {
        setMessages(messages.filter(msg => msg.id !== id));
        message.success('消息已删除');
      }
    });
  };

  // 清空所有消息
  const clearAllMessages = () => {
    Modal.confirm({
      title: '确认清空所有消息吗？',
      icon: <ExclamationCircleOutlined />,
      content: '清空后将无法恢复',
      onOk() {
        setMessages([]);
        message.success('已清空所有消息');
      }
    });
  };

  // 处理消息点击
  const handleMessageClick = (msg: MessageItem) => {
    if (!msg.isRead) {
      markAsRead(msg.id);
    }
    
    if (msg.link) {
      navigate(msg.link);
    }
  };

  return (
    <div className="message-center">
      <Card className="message-card">
        <div className="message-header">
          <Title level={4}>消息中心</Title>
          <Space>
            <Button 
              type="primary" 
              onClick={markAllAsRead}
              disabled={getUnreadCount() === 0}
            >
              全部标为已读
            </Button>
            <Button 
              danger 
              onClick={clearAllMessages}
              disabled={messages.length === 0}
            >
              清空消息
            </Button>
          </Space>
        </div>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="message-tabs"
        >
          <TabPane 
            tab={
              <Badge count={getUnreadCount()} offset={[10, 0]}>
                <span>全部消息</span>
              </Badge>
            } 
            key="all" 
          />
          <TabPane 
            tab={
              <Badge count={getUnreadCount('system')} offset={[10, 0]}>
                <span>系统通知</span>
              </Badge>
            } 
            key="system" 
          />
          <TabPane 
            tab={
              <Badge count={getUnreadCount('activity')} offset={[10, 0]}>
                <span>活动通知</span>
              </Badge>
            } 
            key="activity" 
          />
          <TabPane 
            tab={
              <Badge count={getUnreadCount('service')} offset={[10, 0]}>
                <span>服务通知</span>
              </Badge>
            } 
            key="service" 
          />
        </Tabs>
        
        {getFilteredMessages().length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={getFilteredMessages()}
            renderItem={item => (
              <List.Item
                className={`message-item ${!item.isRead ? 'unread' : ''}`}
                actions={[
                  <Tooltip title={item.isRead ? '已读' : '标记为已读'}>
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />} 
                      onClick={() => markAsRead(item.id)}
                      disabled={item.isRead}
                    />
                  </Tooltip>,
                  <Tooltip title="删除">
                    <Button 
                      type="text" 
                      danger
                      icon={<DeleteOutlined />} 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(item.id);
                      }}
                    />
                  </Tooltip>
                ]}
                onClick={() => handleMessageClick(item)}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!item.isRead}>
                      <Avatar icon={item.icon || <BellOutlined />} />
                    </Badge>
                  }
                  title={
                    <div>
                      <Text strong>{item.title}</Text>
                      {!item.isRead && <Badge status="processing" style={{ marginLeft: 8 }} />}
                    </div>
                  }
                  description={
                    <div className="message-content">
                      <div className="message-text">{item.content}</div>
                      <div className="message-time">{item.time}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
            pagination={{
              pageSize: 5,
              total: getFilteredMessages().length,
              showTotal: total => `共 ${total} 条消息`
            }}
          />
        ) : (
          <Empty 
            description="暂无消息" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            style={{ margin: '40px 0' }}
          />
        )}
      </Card>
      
      <style>
        {`
          .message-center {
            max-width: 1000px;
            margin: 24px auto;
            padding: 0 16px;
          }
          
          .message-card {
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .message-tabs {
            margin-bottom: 16px;
          }
          
          .message-item {
            padding: 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
          }
          
          .message-item:hover {
            background-color: #f0f5ff;
          }
          
          .message-item.unread {
            background-color: #f0f7ff;
          }
          
          .message-content {
            display: flex;
            flex-direction: column;
          }
          
          .message-text {
            color: rgba(0, 0, 0, 0.65);
            margin-bottom: 4px;
          }
          
          .message-time {
            color: rgba(0, 0, 0, 0.45);
            font-size: 12px;
          }
          
          @media (max-width: 576px) {
            .message-center {
              padding: 0 8px;
              margin: 16px auto;
            }
            
            .message-header {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .message-header button {
              margin-top: 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MessageCenter; 