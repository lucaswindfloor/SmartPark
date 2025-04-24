package com.smartcampus.application.notification.service;

import com.smartcampus.application.notification.controller.dto.NotificationRequest;
import com.smartcampus.application.notification.controller.dto.NotificationResponse;
import com.smartcampus.common.exception.BusinessException;
import com.smartcampus.common.response.ResultCode;
import com.smartcampus.domain.notification.entity.SystemNotification;
import com.smartcampus.domain.notification.entity.NotificationStatus;
import com.smartcampus.domain.notification.entity.NotificationType;
import com.smartcampus.domain.notification.repository.NotificationRepository;
import com.smartcampus.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the NotificationService
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    
    @Override
    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        log.debug("Creating notification: {}", request);
        
        SystemNotification notification = SystemNotification.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .type(request.getType())
                .sender(request.getSender())
                .recipient(request.getRecipient())
                .status(NotificationStatus.PENDING)
                .createTime(LocalDateTime.now())
                .extraData(request.getExtraData())
                .build();
        
        notification = notificationRepository.save(notification);
        
        // Here we can add additional logic to send the notification based on type
        // For example, sending emails, SMS, push notifications, etc.
        
        return convertToResponse(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(Long id) {
        log.debug("Getting notification by id: {}", id);
        
        return notificationRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new BusinessException(ResultCode.NOTIFICATION_NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotificationsByRecipient(String recipient, Pageable pageable) {
        log.debug("Getting notifications for recipient: {}", recipient);
        
        return notificationRepository.findByRecipientOrderByCreateTimeDesc(recipient, pageable)
                .map(this::convertToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotificationsByRecipientAndStatus(String recipient, NotificationStatus status, Pageable pageable) {
        log.debug("Getting notifications for recipient: {} with status: {}", recipient, status);
        
        return notificationRepository.findByRecipientAndStatusOrderByCreateTimeDesc(recipient, status, pageable)
                .map(this::convertToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotificationsByRecipientAndType(String recipient, NotificationType type, Pageable pageable) {
        log.debug("Getting notifications for recipient: {} with type: {}", recipient, type);
        
        return notificationRepository.findByRecipientAndTypeOrderByCreateTimeDesc(recipient, type, pageable)
                .map(this::convertToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(String recipient) {
        log.debug("Getting unread notifications for recipient: {}", recipient);
        
        return notificationRepository.findByRecipientAndStatusNotOrderByCreateTimeDesc(recipient, NotificationStatus.READ)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnreadNotifications(String recipient) {
        log.debug("Counting unread notifications for recipient: {}", recipient);
        
        return notificationRepository.countByRecipientAndStatusNot(recipient, NotificationStatus.READ);
    }

    @Override
    @Transactional
    public boolean markAsRead(Long id) {
        log.debug("Marking notification as read: {}", id);
        
        int updated = notificationRepository.updateStatus(id, NotificationStatus.READ, LocalDateTime.now());
        return updated > 0;
    }

    @Override
    @Transactional
    public boolean deleteNotification(Long id) {
        log.debug("Deleting notification: {}", id);
        
        if (!notificationRepository.existsById(id)) {
            throw new BusinessException(ResultCode.NOTIFICATION_NOT_FOUND);
        }
        
        notificationRepository.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    @Scheduled(fixedRate = 60000) // Process every 60 seconds
    public void processPendingNotifications() {
        log.debug("Processing pending notifications");
        
        List<SystemNotification> pendingNotifications = notificationRepository.findByStatusOrderByCreateTimeAsc(NotificationStatus.PENDING);
        
        for (SystemNotification notification : pendingNotifications) {
            try {
                // Here we would implement actual sending logic based on notification type
                boolean sent = sendNotification(notification);
                
                if (sent) {
                    notification.setStatus(NotificationStatus.SENT);
                    notification.setSendTime(LocalDateTime.now());
                } else {
                    notification.setStatus(NotificationStatus.FAILED);
                }
                
                notificationRepository.save(notification);
            } catch (Exception e) {
                log.error("Failed to process notification: {}", notification.getId(), e);
                notification.setStatus(NotificationStatus.FAILED);
                notificationRepository.save(notification);
            }
        }
    }
    
    /**
     * Send notification based on type
     */
    private boolean sendNotification(SystemNotification notification) {
        // Mock implementation - in a real application, this would send the actual notification
        log.info("Sending {} notification to {}: {}", 
                notification.getType(), notification.getRecipient(), notification.getTitle());
        
        switch (notification.getType()) {
            case EMAIL:
                return sendEmailNotification(notification);
            case SMS:
                return sendSmsNotification(notification);
            case PUSH:
                return sendPushNotification(notification);
            case IN_APP:
                // In-app notifications don't need to be sent - they're just displayed in the UI
                return true;
            case SYSTEM:
                return sendSystemNotification(notification);
            default:
                log.warn("Unsupported notification type: {}", notification.getType());
                return false;
        }
    }
    
    private boolean sendEmailNotification(SystemNotification notification) {
        // Mock implementation - would integrate with an email service
        log.debug("Sending email notification: {}", notification.getId());
        return true;
    }
    
    private boolean sendSmsNotification(SystemNotification notification) {
        // Mock implementation - would integrate with an SMS service
        log.debug("Sending SMS notification: {}", notification.getId());
        return true;
    }
    
    private boolean sendPushNotification(SystemNotification notification) {
        // Mock implementation - would integrate with a push notification service
        log.debug("Sending push notification: {}", notification.getId());
        return true;
    }
    
    private boolean sendSystemNotification(SystemNotification notification) {
        // Mock implementation - would send to system administrators
        log.debug("Sending system notification: {}", notification.getId());
        return true;
    }
    
    /**
     * Convert entity to DTO
     */
    private NotificationResponse convertToResponse(SystemNotification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .content(notification.getContent())
                .type(notification.getType())
                .sender(notification.getSender())
                .recipient(notification.getRecipient())
                .status(notification.getStatus())
                .createTime(notification.getCreateTime())
                .sendTime(notification.getSendTime())
                .readTime(notification.getReadTime())
                .extraData(notification.getExtraData())
                .build();
    }
} 