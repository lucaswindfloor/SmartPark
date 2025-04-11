import React, { useState, useEffect } from 'react';
import { Tabs, Button, Space, Breadcrumb } from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NoticeManagement from './NoticeManagement';
import PolicyManagement from './PolicyManagement';
import ActivityManagement from './ActivityManagement';
import SurveyManagement from './SurveyManagement';
import DemandManagement from './DemandManagement';

// 内联样式，替代外部CSS文件
const inlineStyles = {
  informationManagement: {
    padding: '20px',
    backgroundColor: '#f0f2f5',
  },
  informationContent: {
    background: '#fff',
    borderRadius: '4px',
    padding: '20px',
    marginTop: '16px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
};

/**
 * 信息公开管理
 * 综合管理平台的信息公开管理主组件，包含通知公告、政策文件、园区活动、调查问卷和需求发布管理
 */
const InformationManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('notice');

  // 判断当前路径，设置活动的标签页
  const getActiveTabFromPath = () => {
    const pathname = location.pathname;
    if (pathname.includes('/policy')) return 'policy';
    if (pathname.includes('/activity')) return 'activity';
    if (pathname.includes('/survey')) return 'survey';
    if (pathname.includes('/demands')) return 'demands';
    if (pathname.includes('/notice')) return 'notice';
    return 'notice'; // 默认为通知公告
  };

  // 页面加载时设置当前激活的标签页
  useEffect(() => {
    const tab = getActiveTabFromPath();
    setActiveTab(tab);
    
    // 如果是根路径，默认重定向到notice
    if (location.pathname === '/admin/info') {
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
      case 'demands':
        navigate('/admin/info/demands');
        break;
      default:
        navigate('/admin/info/notice');
    }
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
         activeTab === 'activity' ? '园区活动' : 
         activeTab === 'survey' ? '调查问卷' : '需求发布'}
      </Breadcrumb.Item>
    </Breadcrumb>
  );

  // 根据当前标签页渲染对应的组件
  const renderContent = () => {
    switch (activeTab) {
      case 'policy':
        return <PolicyManagement />;
      case 'activity':
        return <ActivityManagement />;
      case 'survey':
        return <SurveyManagement />;
      case 'demands':
        return <DemandManagement />;
      default:
        return <NoticeManagement />;
    }
  };

  return (
    <div style={inlineStyles.informationManagement}>
      {renderBreadcrumb()}
      
      <div style={inlineStyles.informationContent}>
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
        />
        {renderContent()}
      </div>
    </div>
  );
};

export default InformationManagement; 