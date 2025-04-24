package com.smartcampus.application.notification.controller.dto;

import com.smartcampus.domain.notification.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Data Transfer Object for creating a new notification
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    
    @NotBlank(message = "Title cannot be empty")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;
    
    @NotBlank(message = "Content cannot be empty")
    @Size(max = 2000, message = "Content cannot exceed 2000 characters")
    private String content;
    
    @NotNull(message = "Notification type cannot be null")
    private NotificationType type;
    
    @NotBlank(message = "Sender cannot be empty")
    private String sender;
    
    @NotBlank(message = "Recipient cannot be empty")
    private String recipient;
    
    private String extraData;
} 