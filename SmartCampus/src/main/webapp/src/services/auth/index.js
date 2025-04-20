/**
 * @file services/auth/index.js
 * @description 认证相关API服务
 */

import { post, get } from '../../core/utils/request';

/**
 * 用户登录
 * @param {Object} data - 登录参数 {username, password}
 * @returns {Promise} 请求结果
 */
export function login(data) {
  return post('/auth/login', data);
}

/**
 * 用户退出登录
 * @returns {Promise} 请求结果
 */
export function logout() {
  return post('/auth/logout');
}

/**
 * 获取用户信息
 * @returns {Promise} 请求结果
 */
export function getUserInfo() {
  return get('/user/info');
}

/**
 * 刷新token
 * @param {string} refreshToken - 刷新token
 * @returns {Promise} 请求结果
 */
export function refreshToken(refreshToken) {
  return post('/auth/refresh', { refreshToken });
}

/**
 * 修改密码
 * @param {Object} data - 修改密码参数 {oldPassword, newPassword}
 * @returns {Promise} 请求结果
 */
export function changePassword(data) {
  return post('/user/change-password', data);
}

/**
 * 重置密码
 * @param {Object} data - 重置密码参数 {username, code, newPassword}
 * @returns {Promise} 请求结果
 */
export function resetPassword(data) {
  return post('/auth/reset-password', data);
}

/**
 * 获取验证码
 * @param {string} username - 用户名/手机号
 * @returns {Promise} 请求结果
 */
export function getVerificationCode(username) {
  return get('/auth/captcha', { username });
}

/**
 * 注册账号
 * @param {Object} data - 注册参数
 * @returns {Promise} 请求结果
 */
export function register(data) {
  return post('/auth/register', data);
} 