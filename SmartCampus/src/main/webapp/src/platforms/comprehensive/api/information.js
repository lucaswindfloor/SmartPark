/**
 * 信息管理模块API
 */
import request from '../../../core/utils/request';

const baseUrl = '/api/comprehensive/information';

/**
 * 获取通知公告列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回通知公告列表及分页信息
 */
export function getNoticeList(params) {
  return request({
    url: `${baseUrl}/notices`,
    method: 'get',
    params
  });
}

/**
 * 获取通知公告详情
 * @param {number} id - 通知ID
 * @returns {Promise<Object>} 返回通知公告详情
 */
export function getNoticeDetail(id) {
  return request({
    url: `${baseUrl}/notices/${id}`,
    method: 'get'
  });
}

/**
 * 创建通知公告
 * @param {Object} data - 通知公告数据
 * @returns {Promise<Object>} 创建结果
 */
export function createNotice(data) {
  return request({
    url: `${baseUrl}/notices`,
    method: 'post',
    data
  });
}

/**
 * 更新通知公告
 * @param {number} id - 通知ID
 * @param {Object} data - 通知公告数据
 * @returns {Promise<Object>} 更新结果
 */
export function updateNotice(id, data) {
  return request({
    url: `${baseUrl}/notices/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除通知公告
 * @param {number} id - 通知ID
 * @returns {Promise<Object>} 删除结果
 */
export function deleteNotice(id) {
  return request({
    url: `${baseUrl}/notices/${id}`,
    method: 'delete'
  });
}

/**
 * 审核通知公告
 * @param {number} id - 通知ID
 * @param {Object} data - 审核数据
 * @returns {Promise<Object>} 审核结果
 */
export function reviewNotice(id, data) {
  return request({
    url: `${baseUrl}/notices/${id}/review`,
    method: 'post',
    data
  });
}

/**
 * 切换通知公告置顶状态
 * @param {number} id - 通知ID
 * @param {boolean} isTop - 是否置顶
 * @returns {Promise<Object>} 操作结果
 */
export function toggleNoticeTop(id, isTop) {
  return request({
    url: `${baseUrl}/notices/${id}/toggle-top`,
    method: 'post',
    data: { isTop }
  });
}

/**
 * 获取活动列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回活动列表及分页信息
 */
export function getActivityList(params) {
  return request({
    url: `${baseUrl}/activities`,
    method: 'get',
    params
  });
}

/**
 * 获取活动详情
 * @param {number} id - 活动ID
 * @returns {Promise<Object>} 返回活动详情
 */
export function getActivityDetail(id) {
  return request({
    url: `${baseUrl}/activities/${id}`,
    method: 'get'
  });
}

/**
 * 创建活动
 * @param {Object} data - 活动数据
 * @returns {Promise<Object>} 创建结果
 */
export function createActivity(data) {
  return request({
    url: `${baseUrl}/activities`,
    method: 'post',
    data
  });
}

/**
 * 更新活动
 * @param {number} id - 活动ID
 * @param {Object} data - 活动数据
 * @returns {Promise<Object>} 更新结果
 */
export function updateActivity(id, data) {
  return request({
    url: `${baseUrl}/activities/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除活动
 * @param {number} id - 活动ID
 * @returns {Promise<Object>} 删除结果
 */
export function deleteActivity(id) {
  return request({
    url: `${baseUrl}/activities/${id}`,
    method: 'delete'
  });
}

// 可根据需要添加更多API... 