// auth.js
// 认证相关工具函数

import { get, post } from './request';

// Token 存储键名
const TOKEN_KEY = 'smart_campus_token';
const USER_INFO_KEY = 'smart_campus_user_info';
const PERMISSIONS_KEY = 'smart_campus_permissions';

/**
 * 保存令牌到本地存储
 * @param {string} token - 用户令牌
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 获取令牌
 * @returns {string|null} 用户令牌
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 移除令牌
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 保存用户信息
 * @param {Object} userInfo - 用户信息对象
 */
export function setUserInfo(userInfo) {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象
 */
export function getUserInfo() {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
}

/**
 * 移除用户信息
 */
export function removeUserInfo() {
  localStorage.removeItem(USER_INFO_KEY);
}

/**
 * 保存权限信息
 * @param {Array} permissions - 权限列表
 */
export function setPermissions(permissions) {
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
}

/**
 * 获取权限信息
 * @returns {Array} 权限列表
 */
export function getPermissions() {
  const permissions = localStorage.getItem(PERMISSIONS_KEY);
  return permissions ? JSON.parse(permissions) : [];
}

/**
 * 检查是否有指定权限
 * @param {string} permission - 权限标识
 * @returns {boolean} 是否有权限
 */
export function hasPermission(permission) {
  const permissions = getPermissions();
  return permissions.includes(permission);
}

/**
 * 登录
 * @param {Object} credentials - 登录凭证，包含用户名和密码
 * @returns {Promise} 登录结果
 */
export function login(credentials) {
  return post('/auth/login', credentials).then(response => {
    const { token, user, permissions } = response;
    setToken(token);
    setUserInfo(user);
    setPermissions(permissions);
    return response;
  });
}

/**
 * 登出
 * @returns {Promise} 登出结果
 */
export function logout() {
  return post('/auth/logout').finally(() => {
    removeToken();
    removeUserInfo();
    localStorage.removeItem(PERMISSIONS_KEY);
  });
}

/**
 * 刷新令牌
 * @returns {Promise} 刷新结果
 */
export function refreshToken() {
  return post('/auth/refresh-token').then(response => {
    const { token } = response;
    setToken(token);
    return response;
  });
}

/**
 * 检查是否已认证
 * @returns {boolean} 是否已认证
 */
export function isAuthenticated() {
  return !!getToken();
}

export default {
  login,
  logout,
  refreshToken,
  isAuthenticated,
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  getPermissions,
  hasPermission
}; 