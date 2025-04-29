import request from '@/core/utils/request'

/**
 * 获取通知公告列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getAnnouncementList(params) {
  return request({
    url: '/api/announcements',
    method: 'get',
    params
  })
}

/**
 * 获取单个通知公告详情
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function getAnnouncementDetail(id) {
  return request({
    url: `/api/announcements/${id}`,
    method: 'get'
  })
}

/**
 * 创建通知公告
 * @param {Object} data 通知公告数据
 * @returns {Promise}
 */
export function createAnnouncement(data) {
  return request({
    url: '/api/announcements',
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
export function updateAnnouncement(id, data) {
  return request({
    url: `/api/announcements/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除通知公告（移入回收站）
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function deleteAnnouncement(id) {
  return request({
    url: `/api/announcements/${id}`,
    method: 'delete'
  })
}

/**
 * 提交通知公告审核
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function submitAnnouncementAudit(id) {
  return request({
    url: `/api/announcements/${id}/submit-audit`,
    method: 'post'
  })
}

/**
 * 审核通知公告
 * @param {String|Number} id 通知公告ID
 * @param {Object} data 审核数据
 * @returns {Promise}
 */
export function auditAnnouncement(id, data) {
  return request({
    url: `/api/announcements/${id}/audit`,
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
export function publishAnnouncement(id, data) {
  return request({
    url: `/api/announcements/${id}/publish`,
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
export function cancelAnnouncement(id, data) {
  return request({
    url: `/api/announcements/${id}/cancel`,
    method: 'post',
    data
  })
}

/**
 * 归档通知公告
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function archiveAnnouncement(id) {
  return request({
    url: `/api/announcements/${id}/archive`,
    method: 'post'
  })
}

/**
 * 从回收站恢复通知公告
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function restoreAnnouncement(id) {
  return request({
    url: `/api/announcements/${id}/restore`,
    method: 'post'
  })
}

/**
 * 彻底删除通知公告
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function permanentDeleteAnnouncement(id) {
  return request({
    url: `/api/announcements/${id}/permanent-delete`,
    method: 'delete'
  })
}

/**
 * 清空回收站
 * @returns {Promise}
 */
export function emptyAnnouncementRecycleBin() {
  return request({
    url: '/api/announcements/empty-recycle-bin',
    method: 'delete'
  })
}

/**
 * 延长通知公告有效期
 * @param {String|Number} id 通知公告ID
 * @param {Object} data 延期数据
 * @returns {Promise}
 */
export function extendAnnouncementValidity(id, data) {
  return request({
    url: `/api/announcements/${id}/extend`,
    method: 'post',
    data
  })
}

/**
 * 获取通知公告阅读统计
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function getAnnouncementStatistics(id) {
  return request({
    url: `/api/announcements/${id}/statistics`,
    method: 'get'
  })
}

/**
 * 获取通知公告确认列表
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function getAnnouncementConfirmations(id) {
  return request({
    url: `/api/announcements/${id}/confirmations`,
    method: 'get'
  })
}

/**
 * 发送确认提醒
 * @param {String|Number} id 通知公告ID
 * @param {Array} userIds 用户ID列表
 * @returns {Promise}
 */
export function sendAnnouncementConfirmationReminder(id, userIds) {
  return request({
    url: `/api/announcements/${id}/send-reminder`,
    method: 'post',
    data: { userIds }
  })
}

/**
 * 获取未读通知公告
 * @returns {Promise}
 */
export function getUnreadAnnouncements() {
  return request({
    url: '/api/announcements/unread',
    method: 'get'
  })
}

/**
 * 标记通知为已读
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function markAnnouncementAsRead(id) {
  return request({
    url: `/api/announcements/${id}/read`,
    method: 'post'
  })
}

/**
 * 标记所有通知为已读
 * @returns {Promise}
 */
export function markAllAnnouncementsAsRead() {
  return request({
    url: '/api/announcements/read-all',
    method: 'post'
  })
}

/**
 * 确认通知公告
 * @param {String|Number} id 通知公告ID
 * @returns {Promise}
 */
export function confirmAnnouncement(id) {
  return request({
    url: `/api/announcements/${id}/confirm`,
    method: 'post'
  })
}

/**
 * 获取审核中的通知公告列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getAnnouncementAuditList(params) {
  return request({
    url: '/api/announcements/audit-list',
    method: 'get',
    params
  })
}

/**
 * 获取归档的通知公告列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getAnnouncementArchiveList(params) {
  return request({
    url: '/api/announcements/archive-list',
    method: 'get',
    params
  })
}

/**
 * 获取回收站通知公告列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getAnnouncementRecycleBinList(params) {
  return request({
    url: '/api/announcements/recycle-bin-list',
    method: 'get',
    params
  })
} 