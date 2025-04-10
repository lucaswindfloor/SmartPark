import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, PermissionAction } from '../contexts/AuthContext';
import { Result, Button } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionAction;
  requireAuth?: boolean;
  redirectPath?: string;
}

/**
 * 权限保护路由组件
 * 
 * @param children 子组件
 * @param requiredPermission 访问路由所需的权限
 * @param requireAuth 是否需要登录才能访问
 * @param redirectPath 权限不足时的重定向路径
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requireAuth = true,
  redirectPath = '/portal/login'
}) => {
  const { isAuthenticated, hasPermission } = useAuth();

  // 检查是否登录
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // 检查是否有权限
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Result
        status="403"
        title="权限不足"
        subTitle="抱歉，您没有权限访问此页面"
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            返回上一页
          </Button>
        }
      />
    );
  }

  // 通过所有检查，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute; 