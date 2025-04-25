import request from '@/utils/request'

/**
 * 获取通知公告列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getNotificationList(params) {
  return request({
    url: '/api/notification/list',
    method: 'get',
    params
  })
}

/**
 * 获取单个通知公告详情
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function getNotificationDetail(id) {
  return request({
    url: `/api/notification/${id}`,
    method: 'get'
  })
}

/**
 * 创建通知公告
 * @param {Object} data 通知公告数据
 * @returns {Promise}
 */
export function createNotification(data) {
  return request({
    url: '/api/notification',
    method: 'post',
    data
  })
}

/**
 * 更新通知公告
 * @param {String|Number} id 通知公告ID
 * @param {Object} data 更新数据
 * @returns {Promise}
 */
export function updateNotification(id, data) {
  return request({
    url: `/api/notification/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除通知公告（移入回收站）
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function deleteNotification(id) {
  return request({
    url: `/api/notification/${id}`,
    method: 'delete'
  })
}

/**
 * 提交通知公告审核
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function submitNotificationAudit(id) {
  return request({
    url: `/api/notification/${id}/submit-audit`,
    method: 'post'
  })
}

/**
 * 审核通知公告
 * @param {String|Number} id 通知公告ID
 * @param {Object} data 审核数据
 * @returns {Promise}
 */
export function auditNotification(id, data) {
  return request({
    url: `/api/notification/${id}/audit`,
    method: 'post',
    data
  })
}

/**
 * 发布通知公告
 * @param {String|Number} id 通知公告ID
 * @param {Object} data 发布数据
 * @returns {Promise}
 */
export function publishNotification(id, data) {
  return request({
    url: `/api/notification/${id}/publish`,
    method: 'post',
    data
  })
}

/**
 * 取消发布通知公告
 * @param {String|Number} id 通知公告ID
 * @param {Object} data 取消原因
 * @returns {Promise}
 */
export function cancelNotification(id, data) {
  return request({
    url: `/api/notification/${id}/cancel`,
    method: 'post',
    data
  })
}

/**
 * 归档通知公告
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function archiveNotification(id) {
  return request({
    url: `/api/notification/${id}/archive`,
    method: 'post'
  })
}

/**
 * 从回收站恢复通知公告
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function restoreNotification(id) {
  return request({
    url: `/api/notification/${id}/restore`,
    method: 'post'
  })
}

/**
 * 彻底删除通知公告
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function permanentDeleteNotification(id) {
  return request({
    url: `/api/notification/${id}/permanent-delete`,
    method: 'delete'
  })
}

/**
 * 清空回收站
 * @returns {Promise}
 */
export function emptyRecycleBin() {
  return request({
    url: '/api/notification/empty-recycle-bin',
    method: 'delete'
  })
}

/**
 * 延长通知公告有效期
 * @param {String|Number} id 通知公告ID
 * @param {Object} data 延期数据
 * @returns {Promise}
 */
export function extendNotificationValidity(id, data) {
  return request({
    url: `/api/notification/${id}/extend`,
    method: 'post',
    data
  })
}

/**
 * 获取通知公告阅读统计
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function getNotificationStatistics(id) {
  return request({
    url: `/api/notification/${id}/statistics`,
    method: 'get'
  })
}

/**
 * 获取通知公告确认列表
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function getNotificationConfirmations(id) {
  return request({
    url: `/api/notification/${id}/confirmations`,
    method: 'get'
  })
}

/**
 * 发送确认提醒
 * @param {String|Number} id 通知公告ID
 * @param {Array} userIds 用户ID列表
 * @returns {Promise}
 */
export function sendConfirmationReminder(id, userIds) {
  return request({
    url: `/api/notification/${id}/send-reminder`,
    method: 'post',
    data: { userIds }
  })
}

/**
 * 获取未读通知公告
 * @returns {Promise}
 */
export function getUnreadNotifications() {
  return request({
    url: '/api/notification/unread',
    method: 'get'
  })
}

/**
 * 标记通知为已读
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function markAsRead(id) {
  return request({
    url: `/api/notification/${id}/read`,
    method: 'post'
  })
}

/**
 * 标记所有通知为已读
 * @returns {Promise}
 */
export function markAllAsRead() {
  return request({
    url: '/api/notification/read-all',
    method: 'post'
  })
}

/**
 * 确认通知公告
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function confirmNotification(id) {
  return request({
    url: `/api/notification/${id}/confirm`,
    method: 'post'
  })
}

/**
 * 获取审核中的通知公告列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getAuditList(params) {
  return request({
    url: '/api/notification/audit-list',
    method: 'get',
    params
  })
}

/**
 * 获取归档的通知公告列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getArchiveList(params) {
  return request({
    url: '/api/notification/archive-list',
    method: 'get',
    params
  })
}

/**
 * 获取回收站通知公告列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getRecycleBinList(params) {
  return request({
    url: '/api/notification/recycle-bin-list',
    method: 'get',
    params
  })
} 