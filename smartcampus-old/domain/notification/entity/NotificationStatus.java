package com.smartcampus.domain.notification.entity;

/**
 * Status values for notification records
 */
public enum NotificationStatus {
    
    /**
     * Notification is created but not yet sent
     */
    PENDING,
    
    /**
     * Notification has been sent successfully
     */
    SENT,
    
    /**
     * Notification has been read by the recipient
     */
    READ,
    
    /**
     * Notification sending failed
     */
    FAILED,
    
    /**
     * Notification has been cancelled before sending
     */
    CANCELLED
} 