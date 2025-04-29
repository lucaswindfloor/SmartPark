/**
 * @file auth.js
 * @description 用户认证工具类，处理token存储、获取和刷新等功能
 */

import { post } from './request';
import { localStorage } from './storage';

// 存储Token的键名
const TOKEN_KEY = 'smart_campus_token';
const REFRESH_TOKEN_KEY = 'smart_campus_refresh_token';
const USER_INFO_KEY = 'smart_campus_user_info';
const ROLES_KEY = 'smart_campus_roles';
const PERMISSIONS_KEY = 'smart_campus_permissions';
const PLATFORM_KEY = 'smart_campus_current_platform';

/**
 * 获取token
 * @returns {string} token字符串
 */
export function getToken() {
  return localStorage.get(TOKEN_KEY);
}

/**
 * 设置token
 * @param {string} token - 认证token
 */
export function setToken(token) {
  return localStorage.set(TOKEN_KEY, token);
}

/**
 * 获取刷新token
 * @returns {string} 刷新token字符串
 */
export function getRefreshToken() {
  return localStorage.get(REFRESH_TOKEN_KEY);
}

/**
 * 设置刷新token
 * @param {string} token - 刷新token
 */
export function setRefreshToken(token) {
  return localStorage.set(REFRESH_TOKEN_KEY, token);
}

/**
 * 保存用户登录信息
 * @param {object} data - 登录响应数据
 */
export function saveLoginInfo(data) {
  if (data.token) {
    setToken(data.token);
  }
  
  if (data.refreshToken) {
    setRefreshToken(data.refreshToken);
  }
  
  if (data.userInfo) {
    setUserInfo(data.userInfo);
  }
}

/**
 * 获取用户信息
 * @returns {object} 用户信息对象
 */
export function getUserInfo() {
  const userInfo = localStorage.get(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
}

/**
 * 设置用户信息
 * @param {object} userInfo - 用户信息对象
 */
export function setUserInfo(userInfo) {
  return localStorage.set(USER_INFO_KEY, JSON.stringify(userInfo));
}

/**
 * 移除用户信息
 */
export function removeUserInfo() {
  return localStorage.remove(USER_INFO_KEY);
}

/**
 * 获取用户角色
 * @returns {Array} 角色数组
 */
export function getRoles() {
  return localStorage.get(ROLES_KEY) || [];
}

/**
 * 设置用户角色
 * @param {Array} roles - 角色数组
 */
export function setRoles(roles) {
  return localStorage.set(ROLES_KEY, roles);
}

/**
 * 获取用户权限
 * @returns {Array} 权限数组
 */
export function getPermissions() {
  return localStorage.get(PERMISSIONS_KEY) || [];
}

/**
 * 设置用户权限
 * @param {Array} permissions - 权限数组
 */
export function setPermissions(permissions) {
  return localStorage.set(PERMISSIONS_KEY, permissions);
}

/**
 * 获取当前平台
 * @returns {string} 当前平台标识
 */
export function getCurrentPlatform() {
  return localStorage.get(PLATFORM_KEY) || 'public';
}

/**
 * 设置当前平台
 * @param {string} platform - 平台标识
 */
export function setCurrentPlatform(platform) {
  return localStorage.set(PLATFORM_KEY, platform);
}

/**
 * 刷新token
 * @returns {Promise<string>} 新的token
 */
export function refreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return Promise.reject('没有刷新令牌');
  }
  
  return post('/auth/refresh', { refreshToken })
    .then(res => {
      if (res.data && res.data.token) {
        setToken(res.data.token);
        
        if (res.data.refreshToken) {
          setRefreshToken(res.data.refreshToken);
        }
        
        return res.data.token;
      }
      return null;
    });
}

/**
 * 退出登录
 */
export function logout() {
  // 从服务器注销
  post('/auth/logout')
    .catch(err => console.error('退出登录时发生错误:', err));
  
  // 清除本地存储的认证信息
  clearAuth();
}

/**
 * 清除认证信息
 */
export function clearAuth() {
  localStorage.remove(TOKEN_KEY);
  localStorage.remove(REFRESH_TOKEN_KEY);
  localStorage.remove(USER_INFO_KEY);
  localStorage.remove(ROLES_KEY);
  localStorage.remove(PERMISSIONS_KEY);
}

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * 检查用户是否有权限
 * @param {string|array} permission - 权限标识或权限数组
 * @returns {boolean} 是否有权限
 */
export function hasPermission(permission) {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.permissions) {
    return false;
  }
  
  if (Array.isArray(permission)) {
    return permission.some(p => userInfo.permissions.includes(p));
  }
  
  return userInfo.permissions.includes(permission);
}

/**
 * 检查用户是否有指定角色
 * @param {string|array} role - 角色标识或角色数组
 * @returns {boolean} 是否有角色
 */
export function hasRole(role) {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.roles) {
    return false;
  }
  
  if (Array.isArray(role)) {
    return role.some(r => userInfo.roles.includes(r));
  }
  
  return userInfo.roles.includes(role);
}

export default {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  saveLoginInfo,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  getRoles,
  setRoles,
  getPermissions,
  setPermissions,
  getCurrentPlatform,
  setCurrentPlatform,
  refreshToken,
  logout,
  clearAuth,
  isLoggedIn,
  hasPermission,
  hasRole
}; 