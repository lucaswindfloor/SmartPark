package com.smartcampus.domain.information.service;

import com.smartcampus.domain.information.entity.Notification;
import com.smartcampus.domain.information.entity.NotificationPermission;

import java.util.List;

/**
 * 通知领域服务接口
 */
public interface NotificationDomainService {

    /**
     * 创建通知
     */
    Notification createNotification(Notification notification);
    
    /**
     * 添加通知权限
     */
    NotificationPermission addPermission(NotificationPermission permission);
    
    /**
     * 发送通知
     */
    boolean sendNotification(Notification notification);
    
    /**
     * 标记通知为已读
     */
    boolean markAsRead(Long notificationId, String recipient);
    
    /**
     * 取消通知
     */
    boolean cancelNotification(Long notificationId);
    
    /**
     * 检查用户是否有权限查看通知
     */
    boolean hasPermission(Long notificationId, String userId);
    
    /**
     * 获取用户可见的通知列表
     */
    List<Notification> getVisibleNotifications(String userId);
} 