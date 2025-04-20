import { request } from '@/core/utils/request';
import { htmlToText } from '@/core/utils/html-utils';
import { isMobileDevice } from '@/core/utils/device-detection';

/**
 * 移动端通知服务
 * 提供针对移动设备优化的通知获取和处理功能
 */
export class MobileNotificationService {
  /**
   * 获取移动端优化的通知列表（分页）
   * @param {Object} params 查询参数
   */
  static async getMobileNotifications(params) {
    return request({
      url: '/api/mobile/notifications',
      method: 'get',
      params: {
        ...params,
        deviceType: 'mobile'
      }
    });
  }

  /**
   * 获取移动端优化的通知详情
   * @param {Number} id 通知ID
   */
  static async getMobileNotificationDetail(id) {
    return request({
      url: `/api/mobile/notifications/${id}`,
      method: 'get',
      params: {
        deviceType: 'mobile'
      }
    });
  }

  /**
   * 获取未读通知数量
   */
  static async getUnreadCount() {
    return request({
      url: '/api/mobile/notifications/unread-count',
      method: 'get'
    });
  }

  /**
   * 标记通知为已读
   * @param {Number} id 通知ID
   */
  static async markAsRead(id) {
    return request({
      url: `/api/mobile/notifications/${id}/read`,
      method: 'post'
    });
  }

  /**
   * 确认通知
   * @param {Number} id 通知ID
   */
  static async confirmNotification(id) {
    return request({
      url: `/api/mobile/notifications/${id}/confirm`,
      method: 'post'
    });
  }

  /**
   * 全部标记为已读
   */
  static async markAllAsRead() {
    return request({
      url: '/api/mobile/notifications/read-all',
      method: 'post'
    });
  }

  /**
   * 优化HTML内容以适应移动设备
   * @param {String} htmlContent 原始HTML内容
   * @returns {String} 优化后的HTML内容
   */
  static optimizeContentForMobile(htmlContent) {
    if (!htmlContent) return '';
    
    // 1. 调整图片大小，确保不超出屏幕
    let optimized = htmlContent.replace(/<img(.*?)>/gi, (match, attributes) => {
      return `<img${attributes} style="max-width:100%;height:auto;">`;
    });
    
    // 2. 调整表格宽度，使其可以在移动设备上水平滚动
    optimized = optimized.replace(/<table(.*?)>/gi, '<div style="overflow-x:auto;"><table$1>');
    optimized = optimized.replace(/<\/table>/gi, '</table></div>');
    
    // 3. 增加字体大小，提高移动设备上的可读性
    optimized = `<div style="font-size: 16px; line-height: 1.5;">${optimized}</div>`;
    
    // 4. 移除可能在移动设备上显示不正确的复杂元素
    optimized = optimized.replace(/<iframe(.*?)>(.*?)<\/iframe>/gi, '');
    
    return optimized;
  }

  /**
   * 生成缩略图预览
   * @param {String} htmlContent HTML内容
   * @returns {String|null} 第一张图片的URL或null
   */
  static extractThumbnail(htmlContent) {
    if (!htmlContent) return null;
    
    const imgRegex = /<img.*?src=["'](.*?)["']/i;
    const match = htmlContent.match(imgRegex);
    
    return match ? match[1] : null;
  }

  /**
   * 检测设备并自动选择合适的服务
   * 如果是移动设备，使用移动端优化服务，否则使用标准服务
   */
  static getAppropriateService() {
    return isMobileDevice() ? MobileNotificationService : 
      require('./notification.service').NotificationService;
  }
} 