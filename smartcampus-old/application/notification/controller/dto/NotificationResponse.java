package com.smartcampus.application.notification.controller.dto;

import com.smartcampus.domain.notification.entity.NotificationStatus;
import com.smartcampus.domain.notification.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for returning notification data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    
    private Long id;
    private String title;
    private String content;
    private NotificationType type;
    private String sender;
    private String recipient;
    private NotificationStatus status;
    private LocalDateTime createTime;
    private LocalDateTime sendTime;
    private LocalDateTime readTime;
    private String extraData;
} 