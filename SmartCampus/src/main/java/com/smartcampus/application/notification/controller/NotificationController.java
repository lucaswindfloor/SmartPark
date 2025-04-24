package com.smartcampus.application.notification.controller;

import com.smartcampus.application.notification.controller.dto.NotificationRequest;
import com.smartcampus.application.notification.controller.dto.NotificationResponse;
import com.smartcampus.common.response.ApiResponse;
import com.smartcampus.domain.notification.entity.NotificationStatus;
import com.smartcampus.domain.notification.entity.NotificationType;
import com.smartcampus.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API controller for notification management
 */
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    
    /**
     * Create a new notification
     */
    @PostMapping
    public ApiResponse<NotificationResponse> createNotification(@RequestBody @Validated NotificationRequest request) {
        log.info("Received request to create notification: {}", request);
        NotificationResponse response = notificationService.createNotification(request);
        return ApiResponse.success(response);
    }
    
    /**
     * Get notification by ID
     */
    @GetMapping("/{id}")
    public ApiResponse<NotificationResponse> getNotification(@PathVariable Long id) {
        log.info("Received request to get notification with ID: {}", id);
        NotificationResponse response = notificationService.getNotificationById(id);
        return ApiResponse.success(response);
    }
    
    /**
     * Get notifications for current user
     */
    @GetMapping
    public ApiResponse<Page<NotificationResponse>> getNotifications(
            @RequestParam(required = false) String recipient,
            @RequestParam(required = false) NotificationStatus status,
            @RequestParam(required = false) NotificationType type,
            @PageableDefault(size = 20, sort = "createTime,desc") Pageable pageable) {
        
        log.info("Received request to get notifications for recipient: {}, status: {}, type: {}", 
                recipient, status, type);
        
        Page<NotificationResponse> page;
        
        if (recipient != null) {
            if (status != null) {
                page = notificationService.getNotificationsByRecipientAndStatus(recipient, status, pageable);
            } else if (type != null) {
                page = notificationService.getNotificationsByRecipientAndType(recipient, type, pageable);
            } else {
                page = notificationService.getNotificationsByRecipient(recipient, pageable);
            }
        } else {
            throw new IllegalArgumentException("Recipient is required");
        }
        
        return ApiResponse.success(page);
    }
    
    /**
     * Get unread notifications
     */
    @GetMapping("/unread")
    public ApiResponse<List<NotificationResponse>> getUnreadNotifications(@RequestParam String recipient) {
        log.info("Received request to get unread notifications for recipient: {}", recipient);
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(recipient);
        return ApiResponse.success(notifications);
    }
    
    /**
     * Count unread notifications
     */
    @GetMapping("/unread/count")
    public ApiResponse<Long> countUnreadNotifications(@RequestParam String recipient) {
        log.info("Received request to count unread notifications for recipient: {}", recipient);
        long count = notificationService.countUnreadNotifications(recipient);
        return ApiResponse.success(count);
    }
    
    /**
     * Mark notification as read
     */
    @PutMapping("/{id}/read")
    public ApiResponse<Boolean> markAsRead(@PathVariable Long id) {
        log.info("Received request to mark notification as read with ID: {}", id);
        boolean success = notificationService.markAsRead(id);
        return ApiResponse.success(success);
    }
    
    /**
     * Delete notification
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> deleteNotification(@PathVariable Long id) {
        log.info("Received request to delete notification with ID: {}", id);
        boolean success = notificationService.deleteNotification(id);
        return ApiResponse.success(success);
    }
} 