/**
 * @file services/notification/index.js
 * @description 通知公告相关API服务
 */

import { get, post, put, del } from '../../core/utils/request';

/**
 * 获取通知列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求结果
 */
export function getNotifications(params) {
  return get('/notification/list', params);
}

/**
 * 获取通知详情
 * @param {string|number} id - 通知ID
 * @returns {Promise} 请求结果
 */
export function getNotificationDetail(id) {
  return get(`/notification/detail/${id}`);
}

/**
 * 添加通知
 * @param {Object} data - 通知数据
 * @returns {Promise} 请求结果
 */
export function addNotification(data) {
  return post('/notification/add', data);
}

/**
 * 更新通知
 * @param {Object} data - 通知数据
 * @returns {Promise} 请求结果
 */
export function updateNotification(data) {
  return put('/notification/update', data);
}

/**
 * 删除通知
 * @param {string|number} id - 通知ID
 * @returns {Promise} 请求结果
 */
export function deleteNotification(id) {
  return del(`/notification/delete/${id}`);
}

/**
 * 发布通知
 * @param {string|number} id - 通知ID
 * @returns {Promise} 请求结果
 */
export function publishNotification(id) {
  return post(`/notification/publish/${id}`);
}

/**
 * 撤回通知
 * @param {string|number} id - 通知ID
 * @returns {Promise} 请求结果
 */
export function revokeNotification(id) {
  return post(`/notification/revoke/${id}`);
}

/**
 * 标记通知为已读
 * @param {string|number} id - 通知ID
 * @returns {Promise} 请求结果
 */
export function markAsRead(id) {
  return post(`/notification/read/${id}`);
}

/**
 * 批量标记通知为已读
 * @param {Array} ids - 通知ID数组
 * @returns {Promise} 请求结果
 */
export function batchMarkAsRead(ids) {
  return post('/notification/batch-read', { ids });
}

/**
 * 获取未读通知数量
 * @returns {Promise} 请求结果
 */
export function getUnreadCount() {
  return get('/notification/unread-count');
}

/**
 * 获取最新的通知
 * @param {number} limit - 限制数量
 * @returns {Promise} 请求结果
 */
export function getLatestNotifications(limit = 5) {
  return get('/notification/latest', { limit });
}

/**
 * 上传附件
 * @param {FormData} formData - 表单数据
 * @returns {Promise} 请求结果
 */
export function uploadAttachment(formData) {
  return post('/notification/upload', formData);
}

/**
 * 下载附件
 * @param {string|number} id - 附件ID
 * @returns {Promise} 请求结果
 */
export function downloadAttachment(id) {
  return get(`/notification/download/${id}`, {}, {
    responseType: 'blob'
  });
} 