import React, { useState, useEffect } from 'react';
import { Tabs, Button, Breadcrumb } from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// 内联样式
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f0f2f5',
  },
  content: {
    background: '#fff',
    borderRadius: '4px',
    padding: '20px',
    marginTop: '16px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  }
};

/**
 * 信息公开管理
 * 综合管理平台的信息公开管理主组件，包含通知公告、政策文件、园区活动和调查问卷管理
 */
const InfoManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('notice');

  // 判断当前路径，设置活动的标签页
  const getActiveTabFromPath = () => {
    const pathname = location.pathname;
    if (pathname.includes('/policy')) return 'policy';
    if (pathname.includes('/activity')) return 'activity';
    if (pathname.includes('/survey')) return 'survey';
    if (pathname.includes('/notice')) return 'notice';
    return 'notice'; // 默认为通知公告
  };

  // 页面加载时设置当前激活的标签页
  useEffect(() => {
    const tab = getActiveTabFromPath();
    setActiveTab(tab);
    
    // 如果是根路径，默认重定向到notice
    if (location.pathname === '/admin/info/') {
      navigate('/admin/info/notice', { replace: true });
    }
  }, [location.pathname, navigate]);

  // 标签页切换时导航到对应路由
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    switch (key) {
      case 'notice':
        navigate('/admin/info/notice');
        break;
      case 'policy':
        navigate('/admin/info/policy');
        break;
      case 'activity':
        navigate('/admin/info/activity');
        break;
      case 'survey':
        navigate('/admin/info/survey');
        break;
      default:
        navigate('/admin/info/notice');
    }
  };

  // 新建按钮点击事件
  const handleCreate = () => {
    switch (activeTab) {
      case 'notice':
        alert('新建通知公告功能尚未实现');
        break;
      case 'policy':
        alert('新建政策文件功能尚未实现');
        break;
      case 'activity':
        alert('新建园区活动功能尚未实现');
        break;
      case 'survey':
        alert('新建调查问卷功能尚未实现');
        break;
    }
  };

  // 渲染标签页标题和右侧按钮
  const tabBarExtraContent = {
    right: (
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={handleCreate}
      >
        新建{activeTab === 'notice' ? '通知' : 
             activeTab === 'policy' ? '政策' : 
             activeTab === 'activity' ? '活动' : '问卷'}
      </Button>
    ),
  };

  // 渲染面包屑导航
  const renderBreadcrumb = () => (
    <Breadcrumb style={{ marginBottom: 16 }}>
      <Breadcrumb.Item>
        <Link to="/admin">
          <HomeOutlined />
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>服务管理</Breadcrumb.Item>
      <Breadcrumb.Item>信息公开</Breadcrumb.Item>
      <Breadcrumb.Item>
        {activeTab === 'notice' ? '通知公告' : 
         activeTab === 'policy' ? '政策文件' : 
         activeTab === 'activity' ? '园区活动' : '调查问卷'}
      </Breadcrumb.Item>
    </Breadcrumb>
  );

  // 渲染内容
  const renderContent = () => {
    return (
      <div>
        <h3>这是{activeTab === 'notice' ? '通知公告' : 
            activeTab === 'policy' ? '政策文件' : 
            activeTab === 'activity' ? '园区活动' : '调查问卷'}管理页面</h3>
        <p>该功能正在开发中，敬请期待...</p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {renderBreadcrumb()}
      
      <div style={styles.content}>
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
            }
          ]}
          tabBarExtraContent={tabBarExtraContent}
        />
        {renderContent()}
      </div>
    </div>
  );
};

export default InfoManagement; 