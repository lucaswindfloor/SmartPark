import React, { createContext, useContext, useState, useEffect } from 'react';
import { message, Alert } from 'antd';
import { PermissionAction, AnnouncementPermission } from '../constants/permissions';

// 定义用户角色类型
export type UserRole = 'contentAdmin' | 'reviewer';

// 权限矩阵定义
const PERMISSION_MATRIX: Record<UserRole, (PermissionAction | AnnouncementPermission)[]> = {
  'contentAdmin': [
    // 通知公告权限
    AnnouncementPermission.CREATE,        // 创建通知公告
    AnnouncementPermission.UPDATE,        // 编辑草稿
    AnnouncementPermission.DELETE,        // 删除草稿
    AnnouncementPermission.VIEW_ALL,      // 查看通知公告
    AnnouncementPermission.VIEW_STATS,    // 查看统计数据
  ],
  'reviewer': [
    // 通知公告权限
    AnnouncementPermission.VIEW_ALL,      // 查看通知公告
    AnnouncementPermission.REVIEW,        // 审核内容
    AnnouncementPermission.UPDATE,        // 编辑待审核
    AnnouncementPermission.DELETE,        // 删除待审核
    AnnouncementPermission.PUBLISH,       // 发布
    AnnouncementPermission.TOP,           // 置顶
    AnnouncementPermission.VIEW_STATS,    // 查看统计数据
  ],
};

// 定义上下文内容
interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: any | null;
  user?: any | null;
  userRole: UserRole;
  availableRoles: UserRole[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => boolean;
  hasPermission: (action: PermissionAction | AnnouncementPermission | string) => boolean;
  checkPermission: (action: PermissionAction | string) => JSX.Element | null;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | null>(null);

// 提供者组件
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('contentAdmin');
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>(['contentAdmin']);

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
        console.error('解析本地存储的认证信息失败', error);
        // 如果解析失败，清除无效数据
        localStorage.removeItem('auth');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // 模拟登录请求
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 清除现有的localStorage数据
      localStorage.removeItem('auth');
      localStorage.removeItem('token');

      // 根据用户名确定角色
      let role: UserRole;
      let realName: string;

      if (username === 'content_admin' && password === 'content123') {
        role = 'contentAdmin';
        realName = '内容管理员';
        console.log('分配内容管理员角色');
      } else if (username === 'reviewer' && password === 'reviewer123') {
        role = 'reviewer';
        realName = '审核员';
        console.log('分配审核员角色');
      } else {
        throw new Error('无效的用户名或密码');
      }

      console.log('登录成功，分配角色', role);

      // 设置登录状态
      setIsAuthenticated(true);
      setUserInfo({
        id: 1,
        username,
        realName,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      });
      setUserRole(role);
      setAvailableRoles([role]);

      // 存储到本地
      localStorage.setItem('auth', JSON.stringify({
        userInfo: {
          id: 1,
          username,
          realName,
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        userRole: role,
        availableRoles: [role]
      }));
      localStorage.setItem('token', 'fake-jwt-token');

      message.success(`登录成功，当前角色: ${realName}`);
      return true;
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败: 用户名或密码错误');
      return false;
    }
  };

  // 退出登录
  const logout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    setUserRole('contentAdmin');
    setAvailableRoles(['contentAdmin']);
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
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
        role === 'contentAdmin' ? '内容管理员' : '审核员'
      }模式`);
      return true;
    }

    message.error('无权限切换至该角色');
    return false;
  };

  // 检查权限
  const hasPermission = (action: PermissionAction | AnnouncementPermission | string): boolean => {
    console.log('权限检查->', '角色:', userRole, '权限:', action);

    // 检查权限矩阵
    const permissions = PERMISSION_MATRIX[userRole] || [];
    const hasPermission = permissions.includes(action as any);

    console.log('权限检查结果', hasPermission);
    return hasPermission;
  };

  // 检查权限并返回组件
  const checkPermission = (action: PermissionAction | string): JSX.Element | null => {
    if (hasPermission(action)) {
      return null;
    }
    return (
      <Alert
        message="权限不足"
        description="您没有执行此操作的权限，请联系管理员。"
        type="warning"
        showIcon
      />
    );
  };

  const value = {
    isAuthenticated,
    userInfo,
    user: userInfo, // 兼容user属性
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

// 自定义钩子，方便消费上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 