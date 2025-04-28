package com.smartcampus.platform.comprehensive.service.service.information;

import com.smartcampus.domain.information.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 通知服务接口
 */
public interface NotificationService {

    /**
     * 创建通知
     */
    Notification createNotification(Notification notification);
    
    /**
     * 获取通知详情
     */
    Notification getNotificationById(Long id);
    
    /**
     * 分页查询通知
     */
    Page<Notification> getNotifications(String scope, Integer status, Integer type, Integer importance, Pageable pageable);
    
    /**
     * 获取未读通知
     */
    List<Notification> getUnreadNotifications(String scope);
    
    /**
     * 统计未读通知数量
     */
    long countUnreadNotifications(String scope);
    
    /**
     * 标记通知为已读
     */
    boolean markAsRead(Long id, String recipient);
    
    /**
     * 删除通知
     */
    boolean deleteNotification(Long id);
    
    /**
     * 发送通知
     */
    boolean sendNotification(Long id);
    
    /**
     * 取消通知
     */
    boolean cancelNotification(Long id);
    
    /**
     * 处理待发送通知
     */
    void processPendingNotifications();
} 