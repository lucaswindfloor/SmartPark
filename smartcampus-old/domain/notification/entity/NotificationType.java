package com.smartcampus.domain.notification.entity;

/**
 * Types of notifications that can be sent in the system
 */
public enum NotificationType {
    
    /**
     * Email notifications
     */
    EMAIL,
    
    /**
     * SMS text message notifications
     */
    SMS,
    
    /**
     * In-app notifications displayed in the application UI
     */
    IN_APP,
    
    /**
     * Push notifications for mobile devices
     */
    PUSH,
    
    /**
     * System notifications for administrators
     */
    SYSTEM
} 