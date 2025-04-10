import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionAction } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Platform layouts
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import IntentionPage from './pages/admin/investment/Intention';

// 停车管理页面
import ParkingDashboard from './pages/admin/parking/ParkingDashboard';
import ParkingLotManagement from './pages/admin/parking/ParkingLotManagement';
import EntranceManagement from './pages/admin/parking/EntranceManagement';
import MonthlyPlanManagement from './pages/admin/parking/MonthlyPlanManagement';
import TempPlanManagement from './pages/admin/parking/TempPlanManagement';
// 注释掉有问题的导入
import MonthlyPurchaseRecord from './pages/admin/parking/MonthlyPurchaseRecord';
import EnterpriseQRCode from './pages/admin/parking/EnterpriseQRCode';
import VehicleManagement from './pages/admin/parking/VehicleManagement';
import AccessRecords from './pages/admin/parking/AccessRecords';

// 财务管理页面
import BillManagement from './pages/finance/bill';

// 服务管理页面
import ServiceManagement from './pages/service/management';
// 信息公开管理
import InformationManagement from './pages/admin/information/InformationManagement';
import InfoManagement from './pages/admin/information-management/InfoManagement';
import InfoModule from './pages/admin/info-module/InfoModule';

// 运营管理页面
import ContractList from './pages/operations/contract';

// Public pages
import PublicHome from './pages/public/Home';
import PublicLogin from './pages/public/Login';
import ServiceHall from './pages/public/services/ServiceHall';
import NoticePage from './pages/public/information/Notice';
import PolicyPage from './pages/public/information/Policy';
import InformationIndex from './pages/public/information/InformationIndex';
import UserCenter from './pages/public/user/UserCenter';
import ElectricityService from './pages/public/services/ElectricityService';
import ActivityList from './pages/public/activities/ActivityList';
import ActivityDetail from './pages/public/activities/ActivityDetail';
import MessageCenter from './pages/public/messages/MessageCenter';

// Platform selector
const PlatformSelector = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(to right, #1890ff, #096dd9)'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ color: 'white', fontSize: '32px' }}>湘江科创基地智慧园区系统</h1>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <a href="/admin/login" style={{
            padding: '20px 40px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1890ff'
          }}>
            智慧园区综合管理平台
          </a>
          <a href="/portal" style={{
            padding: '20px 40px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1890ff'
          }}>
            公共服务平台
          </a>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ConfigProvider locale={zhCN}>
        <Routes>
          {/* Platform selector */}
          <Route path="/selector" element={<PlatformSelector />} />
          
          {/* Admin Platform Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="investment/intention" element={<IntentionPage />} />
            <Route path="finance/bill" element={<BillManagement />} />
            <Route path="service/management" element={<ServiceManagement />} />
            {/* 信息公开管理路由 */}
            <Route path="info/notice" element={<InformationManagement />} />
            <Route path="info" element={<Navigate to="/admin/info/notice" replace />} />
            <Route path="operations/contract" element={<ContractList />} />
            
            {/* 停车管理路由 - 只保留没问题的 */}
            <Route path="parking/dashboard" element={<ParkingDashboard />} />
            <Route path="parking/lot-management" element={<ParkingLotManagement />} />
            <Route path="parking/entrance-management" element={<EntranceManagement />} />
            <Route path="parking/monthly-plan-management" element={<MonthlyPlanManagement />} />
            <Route path="parking/temp-plan-management" element={<TempPlanManagement />} />
            
            {/* 注释掉有问题的路由 */}
            <Route path="parking/monthly-purchase-record" element={<MonthlyPurchaseRecord />} />
            <Route path="parking/enterprise-qr-code" element={<EnterpriseQRCode />} />
            <Route path="parking/vehicle-management" element={<VehicleManagement />} />
            <Route path="parking/access-records" element={<AccessRecords />} />
            
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* Public Platform Routes - 使用ProtectedRoute进行权限控制 */}
          <Route path="/portal/login" element={<PublicLogin />} />
          <Route path="/portal" element={<PublicLayout />}>
            <Route index element={<PublicHome />} />
            <Route path="home" element={<PublicHome />} />
            <Route path="services" element={<ServiceHall />} />
            <Route path="services/electricity" element={
              <ProtectedRoute requiredPermission={PermissionAction.PAY_BILLS}>
                <ElectricityService />
              </ProtectedRoute>
            } />
            <Route path="information" element={<InformationIndex />} />
            <Route path="information/policy" element={<PolicyPage />} />
            <Route path="information/notice" element={<NoticePage />} />
            <Route path="activities" element={<ActivityList />} />
            <Route path="activities/:id" element={<ActivityDetail />} />
            <Route path="messages" element={
              <ProtectedRoute requireAuth={true}>
                <MessageCenter />
              </ProtectedRoute>
            } />
            <Route path="user/profile" element={
              <ProtectedRoute requireAuth={true}>
                <UserCenter />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Root route */}
          <Route path="/" element={<Navigate to="/selector" replace />} />
          
          {/* Fallback route */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h1>404</h1>
              <p>页面不存在</p>
              <button onClick={() => window.history.back()}>返回上一页</button>
            </div>
          } />
        </Routes>
      </ConfigProvider>
    </AuthProvider>
  );
};

export default App; 