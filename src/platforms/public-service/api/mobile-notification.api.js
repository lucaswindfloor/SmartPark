import { MobileNotificationService } from '@/services/information/mobile-notification.service';
import { AccessibilityService } from '@/services/information/accessibility.service';
import { getDeviceType } from '@/core/utils/device-detection';

/**
 * 移动端通知API模块
 * 提供移动端通知相关的API请求和处理逻辑
 */
export default {
  /**
   * 获取通知列表
   * @param {Object} params 查询参数
   */
  getNotifications(params = {}) {
    return MobileNotificationService.getMobileNotifications({
      ...params,
      deviceType: getDeviceType()
    });
  },
  
  /**
   * 获取通知详情
   * @param {Number} id 通知ID
   */
  async getNotificationDetail(id) {
    const response = await MobileNotificationService.getMobileNotificationDetail(id);
    
    // 标记为已读
    if (response.data && response.success) {
      this.markAsRead(id);
    }
    
    // 添加无障碍功能
    if (response.data && response.data.content) {
      // 应用移动优化
      response.data.content = MobileNotificationService.optimizeContentForMobile(response.data.content);
      
      // 标记是否有附件
      response.data.hasAttachments = Array.isArray(response.data.attachments) && 
                                     response.data.attachments.length > 0;
      
      // 改进无障碍特性
      response.data.content = AccessibilityService.improveAccessibility(response.data.content);
      
      // 提取缩略图
      response.data.thumbnailUrl = MobileNotificationService.extractThumbnail(response.data.content);
    }
    
    return response;
  },
  
  /**
   * 获取未读通知数量
   */
  getUnreadCount() {
    return MobileNotificationService.getUnreadCount();
  },
  
  /**
   * 标记通知为已读
   * @param {Number} id 通知ID
   */
  markAsRead(id) {
    return MobileNotificationService.markAsRead(id);
  },
  
  /**
   * 确认通知
   * @param {Number} id 通知ID
   */
  confirmNotification(id) {
    return MobileNotificationService.confirmNotification(id);
  },
  
  /**
   * 全部标记为已读
   */
  markAllAsRead() {
    return MobileNotificationService.markAllAsRead();
  },
  
  /**
   * 格式化通知内容摘要（用于列表展示）
   * @param {String} content HTML内容
   * @param {Number} maxLength 最大长度
   */
  formatSummary(content, maxLength = 50) {
    return MobileNotificationService.generateSummary(content, maxLength);
  },
  
  /**
   * 根据设备类型返回合适的日期格式
   * @param {String} dateString 日期字符串
   */
  formatDateForMobile(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    
    // 今天发布的显示时间
    if (date.toDateString() === now.toDateString()) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // 昨天发布的显示"昨天"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    }
    
    // 一周内显示星期几
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const daysDiff = Math.floor((now - date) / (24 * 60 * 60 * 1000));
    if (daysDiff < 7) {
      return weekDays[date.getDay()];
    }
    
    // 其他日期显示年月日
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  },
  
  /**
   * 生成通知气泡信息（包含摘要和动态标签）
   * @param {Object} notification 通知对象
   */
  generateNotificationBubble(notification) {
    const bubble = {
      id: notification.id,
      title: notification.title,
      summary: this.formatSummary(notification.content, 50),
      date: this.formatDateForMobile(notification.publishTime),
      isNew: notification.isNew,
      isTop: notification.isTop,
      importance: notification.importance,
      requireConfirmation: notification.requireConfirmation,
      isConfirmed: notification.isConfirmed,
      type: notification.type,
      thumbnailUrl: notification.thumbnailUrl || MobileNotificationService.extractThumbnail(notification.content)
    };
    
    // 设置重要性标签
    if (notification.importance === 'HIGH') {
      bubble.tag = '重要';
      bubble.tagType = 'danger';
    } else if (notification.importance === 'MEDIUM') {
      bubble.tag = '提醒';
      bubble.tagType = 'warning';
    }
    
    // 未确认且需要确认的通知
    if (notification.requireConfirmation && !notification.isConfirmed) {
      bubble.confirmTag = '待确认';
      bubble.confirmTagType = 'primary';
    }
    
    return bubble;
  }
}; 