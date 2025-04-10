import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';

// 定义角色类型
export type UserRole = 'enterprise' | 'employee' | 'public';

// 定义功能模块
export enum PermissionModule {
  ENTERPRISE_MANAGEMENT = 'enterpriseManagement',
  CONTRACT_MANAGEMENT = 'contractManagement',
  BILLING_MANAGEMENT = 'billingManagement',
  SERVICE_APPLICATION = 'serviceApplication',
  VISITOR_MANAGEMENT = 'visitorManagement',
  PARK_ACTIVITIES = 'parkActivities',
}

// 定义具体功能点
export enum PermissionAction {
  // 企业管理
  VIEW_ENTERPRISE_INFO = 'viewEnterpriseInfo',
  EDIT_ENTERPRISE_INFO = 'editEnterpriseInfo',
  MANAGE_EMPLOYEES = 'manageEmployees',
  CONFIGURE_DEPARTMENTS = 'configureDepartments',
  // 合同管理
  VIEW_CONTRACTS = 'viewContracts',
  APPLY_CONTRACT_RENEWAL = 'applyContractRenewal',
  APPLY_CONTRACT_CHANGE = 'applyContractChange',
  UPLOAD_CONTRACT_DOCUMENTS = 'uploadContractDocuments',
  // 账单管理
  VIEW_BILLS = 'viewBills',
  PAY_BILLS = 'payBills',
  VIEW_PAYMENT_RECORDS = 'viewPaymentRecords',
  REQUEST_INVOICE = 'requestInvoice',
  // 服务申请
  APPLY_ENTERPRISE_SERVICE = 'applyEnterpriseService',
  BOOK_MEETING_ROOM = 'bookMeetingRoom',
  REPORT_MAINTENANCE = 'reportMaintenance',
  CHECK_SERVICE_STATUS = 'checkServiceStatus',
  // 访客管理
  INVITE_VISITORS = 'inviteVisitors',
  VIEW_VISITOR_RECORDS = 'viewVisitorRecords',
  BATCH_IMPORT_VISITORS = 'batchImportVisitors',
  REQUEST_VISITOR_ACCESS = 'requestVisitorAccess',
  // 园区活动
  VIEW_ACTIVITIES = 'viewActivities',
  REGISTER_ACTIVITIES = 'registerActivities',
  PUBLISH_ACTIVITIES = 'publishActivities',
  DOWNLOAD_ACTIVITY_MATERIALS = 'downloadActivityMaterials',
}

// 权限矩阵定义
const PERMISSION_MATRIX: Record<UserRole, PermissionAction[]> = {
  'enterprise': [
    // 企业管理
    PermissionAction.VIEW_ENTERPRISE_INFO,
    PermissionAction.EDIT_ENTERPRISE_INFO,
    PermissionAction.MANAGE_EMPLOYEES,
    PermissionAction.CONFIGURE_DEPARTMENTS,
    // 合同管理
    PermissionAction.VIEW_CONTRACTS,
    PermissionAction.APPLY_CONTRACT_RENEWAL,
    PermissionAction.APPLY_CONTRACT_CHANGE,
    PermissionAction.UPLOAD_CONTRACT_DOCUMENTS,
    // 账单管理
    PermissionAction.VIEW_BILLS,
    PermissionAction.PAY_BILLS,
    PermissionAction.VIEW_PAYMENT_RECORDS,
    PermissionAction.REQUEST_INVOICE,
    // 服务申请
    PermissionAction.APPLY_ENTERPRISE_SERVICE,
    PermissionAction.BOOK_MEETING_ROOM,
    PermissionAction.REPORT_MAINTENANCE,
    PermissionAction.CHECK_SERVICE_STATUS,
    // 访客管理
    PermissionAction.INVITE_VISITORS,
    PermissionAction.VIEW_VISITOR_RECORDS,
    PermissionAction.BATCH_IMPORT_VISITORS,
    // 园区活动
    PermissionAction.VIEW_ACTIVITIES,
    PermissionAction.REGISTER_ACTIVITIES,
    PermissionAction.PUBLISH_ACTIVITIES,
    PermissionAction.DOWNLOAD_ACTIVITY_MATERIALS,
  ],
  'employee': [
    // 企业管理
    PermissionAction.VIEW_ENTERPRISE_INFO, // 仅查看
    // 服务申请
    PermissionAction.BOOK_MEETING_ROOM,
    PermissionAction.REPORT_MAINTENANCE,
    PermissionAction.CHECK_SERVICE_STATUS, // 仅本人
    // 访客管理
    PermissionAction.INVITE_VISITORS,
    PermissionAction.VIEW_VISITOR_RECORDS, // 仅本人
    // 园区活动
    PermissionAction.VIEW_ACTIVITIES,
    PermissionAction.REGISTER_ACTIVITIES,
    PermissionAction.DOWNLOAD_ACTIVITY_MATERIALS,
  ],
  'public': [
    // 园区活动
    PermissionAction.VIEW_ACTIVITIES, // 仅公开
    PermissionAction.REGISTER_ACTIVITIES, // 仅公开
    PermissionAction.DOWNLOAD_ACTIVITY_MATERIALS, // 仅公开
    // 访客管理
    PermissionAction.REQUEST_VISITOR_ACCESS,
  ],
};

// 定义上下文内容
interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: any | null;
  userRole: UserRole;
  availableRoles: UserRole[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => boolean;
  hasPermission: (action: PermissionAction) => boolean;
  checkPermission: (action: PermissionAction) => JSX.Element | null;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | null>(null);

// 提供者组件
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('public');
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>(['public']);

  // 初始化时检查本地存储的登录信息
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUserInfo(authData.userInfo);
        setUserRole(authData.userRole);
        setAvailableRoles(authData.availableRoles);
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  // 登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 实际应用中会调用API进行身份验证
      // 这里模拟一个成功的登录
      const mockUserInfo = {
        id: '12345',
        name: '张三',
        avatar: '',
        enterprise: '湘江科技有限公司'
      };
      
      // 模拟获取用户可用角色
      const mockAvailableRoles: UserRole[] = ['enterprise', 'employee'];
      
      // 更新状态
      setIsAuthenticated(true);
      setUserInfo(mockUserInfo);
      setUserRole(mockAvailableRoles[0]); // 默认使用第一个角色
      setAvailableRoles(mockAvailableRoles);
      
      // 保存到本地存储
      localStorage.setItem('auth', JSON.stringify({
        userInfo: mockUserInfo,
        userRole: mockAvailableRoles[0],
        availableRoles: mockAvailableRoles
      }));
      
      message.success('登录成功');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      message.error('登录失败，请检查用户名和密码');
      return false;
    }
  };

  // 退出登录
  const logout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    setUserRole('public');
    setAvailableRoles(['public']);
    localStorage.removeItem('auth');
    message.success('已退出登录');
  };

  // 切换角色
  const switchRole = (role: UserRole): boolean => {
    if (availableRoles.includes(role)) {
      setUserRole(role);
      
      // 更新本地存储
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        authData.userRole = role;
        localStorage.setItem('auth', JSON.stringify(authData));
      }
      
      message.success(`已切换至${
        role === 'enterprise' ? '企业管理员' : 
        role === 'employee' ? '企业员工' : '访客'
      }模式`);
      return true;
    }
    
    message.error('无权限切换至该角色');
    return false;
  };

  // 检查当前用户是否拥有特定权限
  const hasPermission = (action: PermissionAction): boolean => {
    return PERMISSION_MATRIX[userRole].includes(action);
  };

  // 条件渲染组件的权限检查
  const checkPermission = (action: PermissionAction): JSX.Element | null => {
    if (!hasPermission(action)) {
      return null;
    }
    return <></>;
  };

  const value = {
    isAuthenticated,
    userInfo,
    userRole,
    availableRoles,
    login,
    logout,
    switchRole,
    hasPermission,
    checkPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 