import { request } from '@/core/utils/request';
import { formatDate } from '@/core/utils/formatter';
import { htmlToText, removeHtmlTags } from '@/core/utils/html-utils';

// 通知服务
export class NotificationService {
  /**
   * 获取通知列表（分页）
   * @param {Object} params 查询参数
   */
  static async getNotifications(params) {
    return request({
      url: '/api/notifications',
      method: 'get',
      params
    });
  }

  /**
   * 获取通知详情
   * @param {Number} id 通知ID
   */
  static async getNotificationDetail(id) {
    return request({
      url: `/api/notifications/${id}`,
      method: 'get'
    });
  }

  /**
   * 创建通知
   * @param {Object} data 通知数据
   */
  static async createNotification(data) {
    return request({
      url: '/api/notifications',
      method: 'post',
      data
    });
  }

  /**
   * 更新通知
   * @param {Number} id 通知ID
   * @param {Object} data 更新数据
   */
  static async updateNotification(id, data) {
    return request({
      url: `/api/notifications/${id}`,
      method: 'put',
      data
    });
  }

  /**
   * 删除通知
   * @param {Number} id 通知ID
   */
  static async deleteNotification(id) {
    return request({
      url: `/api/notifications/${id}`,
      method: 'delete'
    });
  }

  /**
   * 提交通知审核
   * @param {Number} id 通知ID
   */
  static async submitForReview(id) {
    return request({
      url: `/api/notifications/${id}/submit`,
      method: 'post'
    });
  }

  /**
   * 审核通知
   * @param {Number} id 通知ID
   * @param {Boolean} approved 是否通过
   * @param {String} reason 拒绝原因
   */
  static async reviewNotification(id, approved, reason) {
    return request({
      url: `/api/notifications/${id}/review`,
      method: 'post',
      data: { approved, reason }
    });
  }

  /**
   * 发布通知
   * @param {Number} id 通知ID
   * @param {Date} publishTime 发布时间
   */
  static async publishNotification(id, publishTime) {
    return request({
      url: `/api/notifications/${id}/publish`,
      method: 'post',
      data: { publishTime }
    });
  }

  /**
   * 撤回通知
   * @param {Number} id 通知ID
   * @param {String} reason 撤回原因
   */
  static async recallNotification(id, reason) {
    return request({
      url: `/api/notifications/${id}/recall`,
      method: 'post',
      data: { reason }
    });
  }

  /**
   * 设置通知置顶状态
   * @param {Number} id 通知ID
   * @param {Boolean} isTop 是否置顶
   */
  static async setNotificationTopStatus(id, isTop) {
    return request({
      url: `/api/notifications/${id}/top`,
      method: 'post',
      data: { isTop }
    });
  }

  /**
   * 获取通知统计信息
   * @param {Number} id 通知ID
   */
  static async getNotificationStatistics(id) {
    return request({
      url: `/api/notifications/${id}/statistics`,
      method: 'get'
    });
  }

  /**
   * 标记通知为已读
   * @param {Number} id 通知ID
   */
  static async markAsRead(id) {
    return request({
      url: `/api/notifications/${id}/read`,
      method: 'post'
    });
  }

  /**
   * 确认通知
   * @param {Number} id 通知ID
   */
  static async confirmNotification(id) {
    return request({
      url: `/api/notifications/${id}/confirm`,
      method: 'post'
    });
  }

  /**
   * 生成通知摘要
   * @param {String} content 通知内容
   * @param {Number} maxLength 最大长度
   */
  static generateSummary(content, maxLength = 100) {
    const plainText = htmlToText(content);
    if (plainText.length <= maxLength) {
      return plainText;
    }
    return plainText.substring(0, maxLength) + '...';
  }

  /**
   * 格式化通知发布时间
   * @param {Date} publishTime 发布时间
   */
  static formatPublishTime(publishTime) {
    return formatDate(publishTime, 'YYYY-MM-DD HH:mm');
  }
} 