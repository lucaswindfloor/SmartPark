package com.smartcampus.domain.notification.service;

import com.smartcampus.application.notification.controller.dto.NotificationRequest;
import com.smartcampus.application.notification.controller.dto.NotificationResponse;
import com.smartcampus.domain.notification.entity.NotificationStatus;
import com.smartcampus.domain.notification.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for notification management
 */
public interface NotificationService {

    /**
     * Create a new notification
     */
    NotificationResponse createNotification(NotificationRequest request);
    
    /**
     * Get notification by id
     */
    NotificationResponse getNotificationById(Long id);
    
    /**
     * Get all notifications for a recipient
     */
    Page<NotificationResponse> getNotificationsByRecipient(String recipient, Pageable pageable);
    
    /**
     * Get notifications for a recipient with specific status
     */
    Page<NotificationResponse> getNotificationsByRecipientAndStatus(String recipient, NotificationStatus status, Pageable pageable);
    
    /**
     * Get notifications for a recipient with specific type
     */
    Page<NotificationResponse> getNotificationsByRecipientAndType(String recipient, NotificationType type, Pageable pageable);
    
    /**
     * Get unread notifications for a recipient
     */
    List<NotificationResponse> getUnreadNotifications(String recipient);
    
    /**
     * Count unread notifications for a recipient
     */
    long countUnreadNotifications(String recipient);
    
    /**
     * Mark notification as read
     */
    boolean markAsRead(Long id);
    
    /**
     * Delete notification
     */
    boolean deleteNotification(Long id);
    
    /**
     * Process pending notifications - send them through appropriate channels
     */
    void processPendingNotifications();
} 