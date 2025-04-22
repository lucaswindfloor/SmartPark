/**
 * 认证服务 - 用于处理用户登录状态管理
 */

// 检查用户是否已登录
export function isAuthenticated() {
  return localStorage.getItem('isAuthenticated') === 'true';
}

// 设置用户为已登录状态
export function setAuthenticated(username = 'admin', role = 'admin') {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userInfo', JSON.stringify({
    username,
    role
  }));
  
  // 设置会话开始时间
  localStorage.setItem('sessionStartTime', Date.now().toString());
  
  // 输出状态变更日志
  console.log('用户认证状态已更新为: 已登录');
  return true;
}

// 清除登录状态
export function clearAuthentication() {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('sessionStartTime');
  
  console.log('用户认证状态已清除');
  return true;
}

// 获取当前用户信息
export function getCurrentUser() {
  try {
    const userInfoStr = localStorage.getItem('userInfo');
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

// 当前认证状态的诊断信息
export function getAuthDiagnostics() {
  return {
    isAuthenticated: isAuthenticated(),
    userInfo: getCurrentUser(),
    sessionStartTime: localStorage.getItem('sessionStartTime'),
    storageItems: {
      isAuthenticatedItem: localStorage.getItem('isAuthenticated'),
      userInfoItem: localStorage.getItem('userInfo')
    },
    timestamp: new Date().toISOString()
  };
}

// 立即设置为已认证状态(开发环境辅助函数)
export function forceAuthenticate() {
  return setAuthenticated();
} 